import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

/**
 * AI Question Generation Logic:
 * 
 * 1. Parse candidate's resume skills and the job requirements
 * 2. Find overlapping skills (skills the candidate has that match job requirements)
 * 3. Find gap skills (job requirements the candidate lacks)
 * 4. Generate questions that:
 *    - Test the candidate's claimed skills (overlap questions)
 *    - Assess their ability to learn/adapt (gap questions)
 *    - Evaluate problem-solving and system design abilities
 *    - Test communication and cultural fit
 * 
 * Questions are role-relevant and based on actual resume + job data.
 * This is NOT random question generation.
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

    const { application_id } = await req.json();

    if (!application_id) {
      return new Response(JSON.stringify({ error: "application_id is required" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    console.log(`Generating questions for application: ${application_id}`);

    // Fetch application with job and candidate data
    const { data: application, error: appError } = await supabase
      .from("applications")
      .select("id, job_id, candidate_id")
      .eq("id", application_id)
      .maybeSingle();

    if (appError || !application) {
      console.error("Application fetch error:", appError);
      return new Response(JSON.stringify({ error: "Application not found" }), {
        status: 404,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Fetch job details
    const { data: job } = await supabase
      .from("jobs")
      .select("title, description, skills, experience_level")
      .eq("id", application.job_id)
      .maybeSingle();

    // Fetch candidate profile with resume skills
    const { data: profile } = await supabase
      .from("profiles")
      .select("name, resume_skills, title, experience")
      .eq("id", application.candidate_id)
      .maybeSingle();

    const jobSkills = job?.skills || [];
    const resumeSkills = profile?.resume_skills || [];
    const jobTitle = job?.title || "Software Developer";
    const jobDescription = job?.description || "";
    const experienceLevel = job?.experience_level || "mid";

    console.log(`Job: ${jobTitle}, Job Skills: ${jobSkills}, Resume Skills: ${resumeSkills}`);

    // Skill matching logic
    const overlapSkills = resumeSkills.filter((s: string) =>
      jobSkills.some((js: string) => js.toLowerCase() === s.toLowerCase())
    );
    const gapSkills = jobSkills.filter(
      (js: string) => !resumeSkills.some((s: string) => s.toLowerCase() === js.toLowerCase())
    );

    // Try AI-generated questions via Lovable AI Gateway
    let questions: Array<{ q: string; time: number; category: string }> = [];

    const lovableApiKey = Deno.env.get("LOVABLE_API_KEY");
    if (lovableApiKey) {
      try {
        const prompt = `You are an AI interviewer. Generate exactly 5 interview questions for a "${jobTitle}" position (${experienceLevel} level).

Job Description: ${jobDescription}
Job Required Skills: ${jobSkills.join(", ")}
Candidate's Resume Skills: ${resumeSkills.join(", ")}
Matching Skills: ${overlapSkills.join(", ")}
Skills Gaps: ${gapSkills.join(", ")}

Rules:
- 2 questions should test the candidate's matching skills (${overlapSkills.join(", ") || "general technical skills"})
- 1 question should assess their ability in gap areas (${gapSkills.join(", ") || "broader knowledge"})
- 1 question should be about system design or problem-solving related to the role
- 1 question should assess communication, teamwork, or cultural fit

Return ONLY a JSON array of objects with keys: "q" (question text), "time" (seconds, 90-180), "category" (one of: "technical", "problem_solving", "system_design", "communication", "gap_assessment").
No markdown, no explanation, just the JSON array.`;

        const aiResponse = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${lovableApiKey}`,
          },
          body: JSON.stringify({
            model: "google/gemini-3-flash-preview",
            messages: [{ role: "user", content: prompt }],
            temperature: 0.7,
          }),
        });

        if (aiResponse.ok) {
          const aiData = await aiResponse.json();
          const content = aiData.choices?.[0]?.message?.content || "";
          // Extract JSON from the response
          const jsonMatch = content.match(/\[[\s\S]*\]/);
          if (jsonMatch) {
            questions = JSON.parse(jsonMatch[0]);
            console.log(`AI generated ${questions.length} questions`);
          }
        }
      } catch (aiError) {
        console.error("AI generation failed, using fallback:", aiError);
      }
    }

    // Fallback: Generate questions based on skills matching logic
    if (questions.length === 0) {
      console.log("Using fallback question generation");
      
      // Technical questions based on overlapping skills
      if (overlapSkills.length > 0) {
        questions.push({
          q: `Explain your experience with ${overlapSkills[0]} and how you've used it in a production environment for ${jobTitle} responsibilities.`,
          time: 120,
          category: "technical",
        });
        if (overlapSkills.length > 1) {
          questions.push({
            q: `How would you combine ${overlapSkills[0]} and ${overlapSkills[1]} to solve a complex problem in a ${jobTitle} role?`,
            time: 120,
            category: "technical",
          });
        } else {
          questions.push({
            q: `What are the best practices you follow when working with ${overlapSkills[0]}? Give specific examples.`,
            time: 120,
            category: "technical",
          });
        }
      } else {
        questions.push({
          q: `What technical skills do you bring to the ${jobTitle} position? Describe your strongest area of expertise.`,
          time: 120,
          category: "technical",
        });
        questions.push({
          q: `Describe a technically challenging project you've worked on. What was your role and what technologies did you use?`,
          time: 120,
          category: "technical",
        });
      }

      // Gap assessment
      if (gapSkills.length > 0) {
        questions.push({
          q: `This role requires ${gapSkills[0]}. While it's not on your resume, how would you approach learning and applying it?`,
          time: 120,
          category: "gap_assessment",
        });
      } else {
        questions.push({
          q: `How do you stay updated with new technologies and skills relevant to the ${jobTitle} role?`,
          time: 120,
          category: "gap_assessment",
        });
      }

      // System design
      questions.push({
        q: `How would you design a scalable system architecture for a key feature of a ${jobTitle} project? Walk us through your approach.`,
        time: 150,
        category: "system_design",
      });

      // Communication / cultural fit
      questions.push({
        q: `Describe a situation where you had to collaborate with cross-functional teams. How did you ensure effective communication and delivery?`,
        time: 120,
        category: "communication",
      });
    }

    // Create interview record
    const { data: interview, error: intError } = await supabase
      .from("interviews")
      .insert({
        application_id,
        questions,
        status: "in_progress",
      })
      .select()
      .single();

    if (intError) {
      console.error("Interview creation error:", intError);
      return new Response(JSON.stringify({ error: "Failed to create interview", details: intError.message }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Update application status
    await supabase
      .from("applications")
      .update({ status: "interviewing" })
      .eq("id", application_id);

    console.log(`Interview created: ${interview.id} with ${questions.length} questions`);

    return new Response(
      JSON.stringify({ interview_id: interview.id, questions }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error("Error in generate-questions:", error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
