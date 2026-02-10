
-- Create storage bucket for resumes
INSERT INTO storage.buckets (id, name, public) VALUES ('resumes', 'resumes', false)
ON CONFLICT (id) DO NOTHING;

-- Candidates can upload their own resume
CREATE POLICY "Candidates upload own resume"
ON storage.objects FOR INSERT
WITH CHECK (
  bucket_id = 'resumes' 
  AND auth.uid()::text = (storage.foldername(name))[1]
);

-- Candidates can view their own resume
CREATE POLICY "Candidates view own resume"
ON storage.objects FOR SELECT
USING (
  bucket_id = 'resumes' 
  AND (
    auth.uid()::text = (storage.foldername(name))[1]
    OR EXISTS (SELECT 1 FROM public.user_roles WHERE user_id = auth.uid() AND role IN ('admin', 'recruiter'))
  )
);

-- Candidates can update their own resume
CREATE POLICY "Candidates update own resume"
ON storage.objects FOR UPDATE
USING (
  bucket_id = 'resumes' 
  AND auth.uid()::text = (storage.foldername(name))[1]
);

-- Candidates can delete their own resume
CREATE POLICY "Candidates delete own resume"
ON storage.objects FOR DELETE
USING (
  bucket_id = 'resumes' 
  AND auth.uid()::text = (storage.foldername(name))[1]
);
