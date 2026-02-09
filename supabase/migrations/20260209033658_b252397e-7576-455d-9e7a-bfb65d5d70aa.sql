
-- Fix overly permissive INSERT/UPDATE policies for interviews
DROP POLICY "Service role can insert interviews" ON public.interviews;
DROP POLICY "Service role can update interviews" ON public.interviews;

CREATE POLICY "Authenticated can insert interviews" ON public.interviews FOR INSERT WITH CHECK (
  auth.uid() IS NOT NULL
);
CREATE POLICY "Authenticated can update interviews" ON public.interviews FOR UPDATE USING (
  auth.uid() IS NOT NULL
  AND (
    public.has_role(auth.uid(), 'admin')
    OR EXISTS (
      SELECT 1 FROM public.applications a
      WHERE a.id = application_id AND a.candidate_id = public.get_profile_id(auth.uid())
    )
    OR EXISTS (
      SELECT 1 FROM public.applications a
      JOIN public.jobs j ON j.id = a.job_id
      JOIN public.profiles p ON p.id = j.recruiter_id
      WHERE a.id = application_id AND p.user_id = auth.uid()
    )
  )
);

-- Fix overly permissive INSERT/UPDATE policies for scores
DROP POLICY "Service role can insert scores" ON public.scores;
DROP POLICY "Service role can update scores" ON public.scores;

CREATE POLICY "Authenticated can insert scores" ON public.scores FOR INSERT WITH CHECK (
  auth.uid() IS NOT NULL
);
CREATE POLICY "Authenticated can update scores" ON public.scores FOR UPDATE USING (
  auth.uid() IS NOT NULL AND public.has_role(auth.uid(), 'admin')
);
