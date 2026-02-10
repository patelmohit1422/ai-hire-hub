import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    const results: string[] = [];

    // Create 10 users via auth admin
    const users = [
      { email: "alice.johnson@example.com", name: "Alice Johnson", role: "candidate" },
      { email: "bob.smith@example.com", name: "Bob Smith", role: "candidate" },
      { email: "carol.williams@example.com", name: "Carol Williams", role: "candidate" },
      { email: "david.brown@example.com", name: "David Brown", role: "candidate" },
      { email: "eve.davis@example.com", name: "Eve Davis", role: "candidate" },
      { email: "frank.miller@example.com", name: "Frank Miller", role: "recruiter" },
      { email: "grace.wilson@example.com", name: "Grace Wilson", role: "recruiter" },
      { email: "henry.taylor@example.com", name: "Henry Taylor", role: "recruiter" },
      { email: "iris.anderson@example.com", name: "Iris Anderson", role: "admin" },
      { email: "jack.thomas@example.com", name: "Jack Thomas", role: "admin" },
    ];

    const createdUsers: Array<{ id: string; email: string; role: string; name: string }> = [];

    for (const u of users) {
      // Check if user already exists
      const { data: existingUsers } = await supabase.auth.admin.listUsers();
      const existing = existingUsers?.users?.find((eu: any) => eu.email === u.email);
      
      if (existing) {
        createdUsers.push({ id: existing.id, email: u.email, role: u.role, name: u.name });
        results.push(`User ${u.email} already exists`);
        continue;
      }

      const { data: newUser, error } = await supabase.auth.admin.createUser({
        email: u.email,
        password: "Password123!",
        email_confirm: true,
        user_metadata: { name: u.name, role: u.role },
      });

      if (error) {
        results.push(`Failed to create ${u.email}: ${error.message}`);
      } else {
        createdUsers.push({ id: newUser.user.id, email: u.email, role: u.role, name: u.name });
        results.push(`Created user ${u.email}`);
      }
    }

    // Wait for triggers to create profiles
    await new Promise(r => setTimeout(r, 2000));

    // Update profiles with detailed data
    const candidateProfiles = [
      { email: "alice.johnson@example.com", title: "Senior React Developer", location: "San Francisco, CA", experience: "5 years", skills: ["React", "TypeScript", "Node.js", "GraphQL", "AWS"] },
      { email: "bob.smith@example.com", title: "Full Stack Engineer", location: "New York, NY", experience: "3 years", skills: ["JavaScript", "Python", "Django", "PostgreSQL", "Docker"] },
      { email: "carol.williams@example.com", title: "UI/UX Designer", location: "Austin, TX", experience: "4 years", skills: ["Figma", "UI Design", "UX Research", "Prototyping", "CSS"] },
      { email: "david.brown@example.com", title: "Network Engineer", location: "Chicago, IL", experience: "6 years", skills: ["Network Security", "Routing", "TCP/IP", "Firewall", "CCNA"] },
      { email: "eve.davis@example.com", title: "Data Scientist", location: "Seattle, WA", experience: "4 years", skills: ["Python", "Machine Learning", "TensorFlow", "SQL", "Statistics"] },
    ];

    for (const cp of candidateProfiles) {
      const user = createdUsers.find(u => u.email === cp.email);
      if (user) {
        await supabase
          .from("profiles")
          .update({
            title: cp.title,
            location: cp.location,
            experience: cp.experience,
            resume_skills: cp.skills,
          })
          .eq("user_id", user.id);
        results.push(`Updated profile for ${cp.email}`);
      }
    }

    // Get profile IDs for recruiter users
    const recruiterUsers = createdUsers.filter(u => u.role === "recruiter");
    const recruiterProfileIds: string[] = [];
    for (const ru of recruiterUsers) {
      const { data: prof } = await supabase.from("profiles").select("id").eq("user_id", ru.id).maybeSingle();
      if (prof) recruiterProfileIds.push(prof.id);
    }

    // Create 10 jobs
    const jobsData = [
      { title: "Senior React Developer", description: "Build modern web apps using React and TypeScript", skills: ["React", "TypeScript", "Node.js", "REST API"], experience_level: "senior", location: "San Francisco, CA", job_type: "Full-time", salary_range: "$120k-$160k" },
      { title: "Full Stack Engineer", description: "Work on frontend and backend systems", skills: ["JavaScript", "Python", "PostgreSQL", "Docker"], experience_level: "mid", location: "Remote", job_type: "Full-time", salary_range: "$100k-$140k" },
      { title: "UI/UX Designer", description: "Design intuitive user interfaces for web and mobile apps", skills: ["Figma", "UI Design", "UX Research", "Prototyping"], experience_level: "mid", location: "Austin, TX", job_type: "Full-time", salary_range: "$90k-$120k" },
      { title: "Data Scientist", description: "Analyze large datasets and build ML models", skills: ["Python", "Machine Learning", "TensorFlow", "SQL"], experience_level: "senior", location: "Seattle, WA", job_type: "Full-time", salary_range: "$130k-$170k" },
      { title: "Network Security Engineer", description: "Secure enterprise network infrastructure", skills: ["Network Security", "Firewall", "CCNA", "TCP/IP"], experience_level: "senior", location: "Chicago, IL", job_type: "Full-time", salary_range: "$110k-$150k" },
      { title: "Backend Developer", description: "Build scalable backend services and APIs", skills: ["Node.js", "Python", "PostgreSQL", "Redis", "Docker"], experience_level: "mid", location: "Remote", job_type: "Full-time", salary_range: "$100k-$130k" },
      { title: "DevOps Engineer", description: "Manage CI/CD pipelines and cloud infrastructure", skills: ["AWS", "Docker", "Kubernetes", "Terraform"], experience_level: "senior", location: "Remote", job_type: "Full-time", salary_range: "$120k-$160k" },
      { title: "Mobile Developer", description: "Build cross-platform mobile applications", skills: ["React Native", "TypeScript", "iOS", "Android"], experience_level: "mid", location: "New York, NY", job_type: "Full-time", salary_range: "$110k-$140k" },
      { title: "Product Manager", description: "Lead product strategy and roadmap", skills: ["Product Strategy", "Agile", "Data Analysis", "UX"], experience_level: "senior", location: "San Francisco, CA", job_type: "Full-time", salary_range: "$140k-$180k" },
      { title: "QA Engineer", description: "Ensure software quality through testing", skills: ["Selenium", "Jest", "Cypress", "API Testing"], experience_level: "junior", location: "Remote", job_type: "Full-time", salary_range: "$70k-$90k" },
    ];

    const createdJobs: string[] = [];
    for (let i = 0; i < jobsData.length; i++) {
      const jd = jobsData[i];
      const recruiterId = recruiterProfileIds[i % recruiterProfileIds.length] || null;
      
      // Check if job already exists
      const { data: existing } = await supabase.from("jobs").select("id").eq("title", jd.title).maybeSingle();
      if (existing) {
        createdJobs.push(existing.id);
        results.push(`Job "${jd.title}" already exists`);
        continue;
      }

      const { data: job, error } = await supabase.from("jobs").insert({
        ...jd,
        recruiter_id: recruiterId,
        status: "active",
      }).select().single();

      if (error) {
        results.push(`Failed to create job "${jd.title}": ${error.message}`);
      } else {
        createdJobs.push(job.id);
        results.push(`Created job "${jd.title}"`);
      }
    }

    // Create applications (candidates applying to jobs)
    const candidateUsers = createdUsers.filter(u => u.role === "candidate");
    const candidateProfileIds: string[] = [];
    for (const cu of candidateUsers) {
      const { data: prof } = await supabase.from("profiles").select("id").eq("user_id", cu.id).maybeSingle();
      if (prof) candidateProfileIds.push(prof.id);
    }

    const appPairs = [
      { candidateIdx: 0, jobIdx: 0, status: "shortlisted" },
      { candidateIdx: 0, jobIdx: 1, status: "pending" },
      { candidateIdx: 1, jobIdx: 1, status: "review" },
      { candidateIdx: 1, jobIdx: 5, status: "pending" },
      { candidateIdx: 2, jobIdx: 2, status: "shortlisted" },
      { candidateIdx: 2, jobIdx: 8, status: "pending" },
      { candidateIdx: 3, jobIdx: 4, status: "review" },
      { candidateIdx: 3, jobIdx: 3, status: "rejected" },
      { candidateIdx: 4, jobIdx: 3, status: "shortlisted" },
      { candidateIdx: 4, jobIdx: 6, status: "pending" },
    ];

    const createdApps: string[] = [];
    for (const ap of appPairs) {
      const candidateId = candidateProfileIds[ap.candidateIdx];
      const jobId = createdJobs[ap.jobIdx];
      if (!candidateId || !jobId) continue;

      const { data: existing } = await supabase.from("applications").select("id").eq("candidate_id", candidateId).eq("job_id", jobId).maybeSingle();
      if (existing) {
        createdApps.push(existing.id);
        results.push(`Application already exists`);
        continue;
      }

      const { data: app, error } = await supabase.from("applications").insert({
        candidate_id: candidateId,
        job_id: jobId,
        status: ap.status,
      }).select().single();

      if (error) {
        results.push(`Failed to create application: ${error.message}`);
      } else {
        createdApps.push(app.id);
        results.push(`Created application`);
      }
    }

    // Create interviews for completed applications
    const interviewApps = createdApps.slice(0, 5);
    const createdInterviews: string[] = [];
    for (const appId of interviewApps) {
      const { data: existing } = await supabase.from("interviews").select("id").eq("application_id", appId).maybeSingle();
      if (existing) {
        createdInterviews.push(existing.id);
        continue;
      }

      const questions = [
        { q: "Describe your experience with your primary technology stack.", time: 120, category: "technical" },
        { q: "How do you approach debugging complex issues in production?", time: 120, category: "problem_solving" },
        { q: "Design a scalable system for a high-traffic application.", time: 150, category: "system_design" },
        { q: "Tell us about a time you collaborated with a cross-functional team.", time: 120, category: "communication" },
        { q: "What areas of this role excite you the most and why?", time: 90, category: "gap_assessment" },
      ];

      const answers = [
        "I have extensive experience building production applications with modern frameworks. I focus on clean architecture, testing, and performance optimization.",
        "I start by reproducing the issue locally, then use logging and monitoring tools to trace the root cause. I believe in systematic debugging rather than guessing.",
        "I would use a microservices architecture with load balancing, caching layers, and a CDN. Database sharding and read replicas would handle data scaling.",
        "In my previous role, I worked closely with designers and product managers to deliver features. We used agile sprints and daily standups for alignment.",
        "I'm excited about the technical challenges and the opportunity to work with cutting-edge technologies while making a real impact on users.",
      ];

      const { data: intv, error } = await supabase.from("interviews").insert({
        application_id: appId,
        questions,
        answers,
        status: "completed",
      }).select().single();

      if (error) {
        results.push(`Failed to create interview: ${error.message}`);
      } else {
        createdInterviews.push(intv.id);
        results.push(`Created interview`);
      }
    }

    // Create scores for interviews
    const scoreValues = [
      { resume: 85, interview: 89, total: 87, status: "passed" },
      { resume: 70, interview: 74, total: 72, status: "under_review" },
      { resume: 92, interview: 88, total: 90, status: "passed" },
      { resume: 65, interview: 58, total: 61, status: "under_review" },
      { resume: 80, interview: 82, total: 81, status: "passed" },
    ];

    for (let i = 0; i < createdInterviews.length && i < scoreValues.length; i++) {
      const intId = createdInterviews[i];
      const sv = scoreValues[i];

      const { data: existing } = await supabase.from("scores").select("id").eq("interview_id", intId).maybeSingle();
      if (existing) {
        results.push(`Score already exists for interview`);
        continue;
      }

      const { error } = await supabase.from("scores").insert({
        interview_id: intId,
        resume_score: sv.resume,
        interview_score: sv.interview,
        total_score: sv.total,
        status: sv.status,
        feedback: {
          question_feedback: [
            { question: "Technical stack experience", score: sv.interview, feedback: "Good technical depth" },
          ],
          resume_details: { matching_skills: [], gap_skills: [], skill_match_percentage: sv.resume },
        },
      });

      if (error) {
        results.push(`Failed to create score: ${error.message}`);
      } else {
        results.push(`Created score`);
      }
    }

    return new Response(JSON.stringify({ success: true, results }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Seed error:", error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
