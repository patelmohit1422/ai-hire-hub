import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

/**
 * Score Calculation Logic:
 * 
 * Resume Score (0-100):
 *   - Skill match percentage: (matching_skills / total_job_skills) * 60
 *   - Experience relevance: based on experience_level match * 20
 *   - Profile completeness: based on filled fields * 20
 * 
 * Interview Score (0-100):
 *   - Answer relevance: AI-evaluated or keyword-based scoring per question
 *   - Answer completeness: penalize very short or empty answers
 *   - Average across all questions
 * 
 * Total Score = (resume_score * resume_weight + interview_score * interview_weight) / 100
 *   where weights come from system_settings
 * 
 * Status determination:
 *   - total >= 75: "passed"
 *   - total >= 50: "under_review"
 *   - total < 50: "needs_improvement"
 */

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const authHeader = req.headers.get("Authorization");
    if (!authHeader) {
      return new Response(JSON.stringify({ error: "No authorization header" }), {
        status: 401,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    const { interview_id, answers } = await req.json();

    if (!interview_id || !answers) {
      return new Response(JSON.stringify({ error: "interview_id and answers are required" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    console.log(`Calculating scores for interview: ${interview_id}`);

    // Fetch interview with application data
    const { data: interview, error: intError } = await supabase
      .from("interviews")
      .select("id, application_id, questions")
      .eq("id", interview_id)
      .maybeSingle();

    if (intError || !interview) {
      console.error("Interview fetch error:", intError);
      return new Response(JSON.stringify({ error: "Interview not found" }), {
        status: 404,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Fetch application → job + candidate
    const { data: application } = await supabase
      .from("applications")
      .select("id, job_id, candidate_id")
      .eq("id", interview.application_id)
      .maybeSingle();

    const { data: job } = await supabase
      .from("jobs")
      .select("skills, experience_level")
      .eq("id", application?.job_id)
      .maybeSingle();

    const { data: profile } = await supabase
      .from("profiles")
      .select("resume_skills, experience, title, name, email")
      .eq("id", application?.candidate_id)
      .maybeSingle();

    // Fetch scoring weights from system settings
    const { data: resumeWeightSetting } = await supabase
      .from("system_settings")
      .select("value")
      .eq("key", "resume_weight")
      .maybeSingle();

    const { data: interviewWeightSetting } = await supabase
      .from("system_settings")
      .select("value")
      .eq("key", "interview_weight")
      .maybeSingle();

    const resumeWeight = Number(resumeWeightSetting?.value) || 40;
    const interviewWeight = Number(interviewWeightSetting?.value) || 60;

    // =========================================
    // RESUME SCORE CALCULATION
    // =========================================
    const jobSkills = job?.skills || [];
    const resumeSkills = profile?.resume_skills || [];

    // Skill match score (0-60 points)
    const matchingSkills = resumeSkills.filter((s: string) =>
      jobSkills.some((js: string) => js.toLowerCase() === s.toLowerCase())
    );
    const skillMatchScore = jobSkills.length > 0
      ? (matchingSkills.length / jobSkills.length) * 60
      : 30; // Default if no job skills defined

    // Experience relevance (0-20 points)
    let experienceScore = 10; // default
    const exp = profile?.experience || "";
    const level = job?.experience_level || "mid";
    if (level === "junior" && (exp.includes("1") || exp.includes("2") || exp.includes("entry"))) experienceScore = 20;
    else if (level === "mid" && (exp.includes("3") || exp.includes("4") || exp.includes("5"))) experienceScore = 20;
    else if (level === "senior" && (exp.includes("5") || exp.includes("6") || exp.includes("7") || exp.includes("8") || exp.includes("10"))) experienceScore = 20;
    else if (exp.length > 0) experienceScore = 15;

    // Profile completeness (0-20 points)
    let profileScore = 0;
    if (profile?.name && profile.name.length > 0) profileScore += 5;
    if (profile?.email && profile.email.length > 0) profileScore += 5;
    if (profile?.title && profile.title.length > 0) profileScore += 5;
    if (resumeSkills.length > 0) profileScore += 5;

    const resumeScore = Math.min(100, Math.round(skillMatchScore + experienceScore + profileScore));

    console.log(`Resume Score: ${resumeScore} (skills: ${skillMatchScore}, exp: ${experienceScore}, profile: ${profileScore})`);

    // =========================================
    // INTERVIEW SCORE CALCULATION
    // =========================================
    const questions = interview.questions || [];
    let totalInterviewScore = 0;
    const questionFeedback: Array<{ question: string; score: number; feedback: string }> = [];

    // Try AI-based scoring
    const lovableApiKey = Deno.env.get("LOVABLE_API_KEY");
    let aiScoringDone = false;

    if (lovableApiKey && answers.length > 0) {
      try {
        const scoringPrompt = `You are an AI interview evaluator for a "${job?.skills?.join(', ') || 'technical'}" role.

Score each answer from 0-100 based on:
- Relevance to the question (40%)
- Technical accuracy (30%)
- Completeness and depth (20%)
- Communication clarity (10%)

Questions and Answers:
${questions.map((q: any, i: number) => `Q${i + 1}: ${q.q || q}\nA${i + 1}: ${answers[i] || "(no answer)"}`).join("\n\n")}

Return ONLY a JSON array of objects with keys: "score" (number 0-100), "feedback" (one sentence).
No markdown, no explanation.`;

        const aiResponse = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${lovableApiKey}`,
          },
          body: JSON.stringify({
            model: "google/gemini-2.0-flash-001",
            messages: [{ role: "user", content: scoringPrompt }],
            temperature: 0.3,
          }),
        });

        if (aiResponse.ok) {
          const aiData = await aiResponse.json();
          const content = aiData.choices?.[0]?.message?.content || "";
          const jsonMatch = content.match(/\[[\s\S]*\]/);
          if (jsonMatch) {
            const scores = JSON.parse(jsonMatch[0]);
            scores.forEach((s: any, i: number) => {
              questionFeedback.push({
                question: questions[i]?.q || questions[i] || `Question ${i + 1}`,
                score: Math.min(100, Math.max(0, s.score)),
                feedback: s.feedback || "Evaluated by AI",
              });
              totalInterviewScore += Math.min(100, Math.max(0, s.score));
            });
            aiScoringDone = true;
            console.log(`AI scoring completed for ${scores.length} questions`);
          }
        }
      } catch (aiError) {
        console.error("AI scoring failed, using fallback:", aiError);
      }
    }

    // Fallback scoring: keyword-based
    if (!aiScoringDone) {
      console.log("Using fallback keyword-based scoring");
      questions.forEach((q: any, i: number) => {
        const answer = answers[i] || "";
        let score = 0;

        // Length-based score (max 40 points)
        if (answer.length > 200) score += 40;
        else if (answer.length > 100) score += 30;
        else if (answer.length > 50) score += 20;
        else if (answer.length > 10) score += 10;

        // Keyword relevance (max 40 points)
        const questionWords = (q.q || q || "").toLowerCase().split(/\s+/);
        const answerLower = answer.toLowerCase();
        const relevantKeywords = jobSkills.filter((s: string) => answerLower.includes(s.toLowerCase()));
        const questionKeywordHits = questionWords.filter((w: string) => w.length > 4 && answerLower.includes(w)).length;
        score += Math.min(40, relevantKeywords.length * 10 + questionKeywordHits * 5);

        // Structure bonus (max 20 points)
        if (answer.includes("example") || answer.includes("instance")) score += 10;
        if (answer.includes("because") || answer.includes("therefore") || answer.includes("approach")) score += 10;

        score = Math.min(100, score);
        totalInterviewScore += score;

        questionFeedback.push({
          question: q.q || q || `Question ${i + 1}`,
          score,
          feedback: score >= 70 ? "Good response with relevant content" :
                    score >= 40 ? "Adequate but could be more detailed" :
                    "Answer needs more depth and relevance",
        });
      });
    }

    const interviewScore = questions.length > 0
      ? Math.round(totalInterviewScore / questions.length)
      : 0;

    // =========================================
    // TOTAL SCORE CALCULATION
    // =========================================
    const totalScore = Math.round(
      (resumeScore * resumeWeight + interviewScore * interviewWeight) / 100
    );

    // Determine status
    let status = "under_review";
    if (totalScore >= 75) status = "passed";
    else if (totalScore < 50) status = "needs_improvement";

    console.log(`Scores - Resume: ${resumeScore}, Interview: ${interviewScore}, Total: ${totalScore}, Status: ${status}`);

    // Save answers to interview
    await supabase
      .from("interviews")
      .update({ answers, status: "completed" })
      .eq("id", interview_id);

    // Save scores
    const { data: scoreRecord, error: scoreError } = await supabase
      .from("scores")
      .insert({
        interview_id,
        resume_score: resumeScore,
        interview_score: interviewScore,
        total_score: totalScore,
        status,
        feedback: {
          question_feedback: questionFeedback,
          resume_details: {
            matching_skills: matchingSkills,
            gap_skills: jobSkills.filter((js: string) => !resumeSkills.some((s: string) => s.toLowerCase() === js.toLowerCase())),
            skill_match_percentage: jobSkills.length > 0 ? Math.round((matchingSkills.length / jobSkills.length) * 100) : 0,
          },
          weights: { resume: resumeWeight, interview: interviewWeight },
        },
      })
      .select()
      .single();

    if (scoreError) {
      console.error("Score save error:", scoreError);
      return new Response(JSON.stringify({ error: "Failed to save scores", details: scoreError.message }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Update application status
    await supabase
      .from("applications")
      .update({ status: status === "passed" ? "shortlisted" : status === "needs_improvement" ? "rejected" : "review" })
      .eq("id", application?.id);

    return new Response(
      JSON.stringify({
        score_id: scoreRecord.id,
        resume_score: resumeScore,
        interview_score: interviewScore,
        total_score: totalScore,
        status,
        feedback: scoreRecord.feedback,
      }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error("Error in calculate-scores:", error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
