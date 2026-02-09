
-- 1. Create enum for roles
CREATE TYPE public.app_role AS ENUM ('admin', 'recruiter', 'candidate');

-- 2. Create profiles table
CREATE TABLE public.profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL UNIQUE,
  name TEXT NOT NULL DEFAULT '',
  email TEXT NOT NULL DEFAULT '',
  status TEXT NOT NULL DEFAULT 'active',
  location TEXT DEFAULT '',
  experience TEXT DEFAULT '',
  title TEXT DEFAULT '',
  resume_url TEXT DEFAULT '',
  resume_skills TEXT[] DEFAULT '{}',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 3. Create user_roles table
CREATE TABLE public.user_roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  role app_role NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE(user_id, role)
);

-- 4. Create jobs table
CREATE TABLE public.jobs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  recruiter_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  title TEXT NOT NULL,
  description TEXT NOT NULL DEFAULT '',
  skills TEXT[] NOT NULL DEFAULT '{}',
  experience_level TEXT NOT NULL DEFAULT 'mid',
  salary_range TEXT DEFAULT '',
  location TEXT DEFAULT 'Remote',
  job_type TEXT DEFAULT 'Full-time',
  status TEXT NOT NULL DEFAULT 'active',
  deadline TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 5. Create applications table
CREATE TABLE public.applications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  job_id UUID REFERENCES public.jobs(id) ON DELETE CASCADE NOT NULL,
  candidate_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE(job_id, candidate_id)
);

-- 6. Create interviews table
CREATE TABLE public.interviews (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  application_id UUID REFERENCES public.applications(id) ON DELETE CASCADE NOT NULL,
  questions JSONB NOT NULL DEFAULT '[]',
  answers JSONB NOT NULL DEFAULT '[]',
  status TEXT NOT NULL DEFAULT 'pending',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 7. Create scores table
CREATE TABLE public.scores (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  interview_id UUID REFERENCES public.interviews(id) ON DELETE CASCADE NOT NULL UNIQUE,
  resume_score NUMERIC(5,2) NOT NULL DEFAULT 0,
  interview_score NUMERIC(5,2) NOT NULL DEFAULT 0,
  total_score NUMERIC(5,2) NOT NULL DEFAULT 0,
  status TEXT NOT NULL DEFAULT 'under_review',
  feedback JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 8. Create system_settings table
CREATE TABLE public.system_settings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  key TEXT NOT NULL UNIQUE,
  value JSONB NOT NULL DEFAULT '{}',
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Insert default settings
INSERT INTO public.system_settings (key, value) VALUES
  ('platform_name', '"HireAI"'),
  ('support_email', '"support@hireai.com"'),
  ('ai_interview_enabled', 'true'),
  ('email_notifications', 'true'),
  ('new_application_alerts', 'true'),
  ('two_factor_auth', 'false'),
  ('session_timeout', '30'),
  ('default_question_time', '120'),
  ('max_questions', '10'),
  ('resume_weight', '40'),
  ('interview_weight', '60');

-- 9. Enable RLS on all tables
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.jobs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.applications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.interviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.scores ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.system_settings ENABLE ROW LEVEL SECURITY;

-- 10. Security definer helper functions
CREATE OR REPLACE FUNCTION public.has_role(_user_id UUID, _role app_role)
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.user_roles
    WHERE user_id = _user_id AND role = _role
  )
$$;

CREATE OR REPLACE FUNCTION public.get_profile_id(_user_id UUID)
RETURNS UUID
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT id FROM public.profiles WHERE user_id = _user_id LIMIT 1
$$;

CREATE OR REPLACE FUNCTION public.is_recruiter_for_job(_job_id UUID, _user_id UUID)
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.jobs j
    JOIN public.profiles p ON p.id = j.recruiter_id
    WHERE j.id = _job_id AND p.user_id = _user_id
  )
$$;

-- 11. RLS Policies for profiles
CREATE POLICY "Users can view own profile" ON public.profiles FOR SELECT USING (
  auth.uid() = user_id OR public.has_role(auth.uid(), 'admin') OR public.has_role(auth.uid(), 'recruiter')
);
CREATE POLICY "Users can insert own profile" ON public.profiles FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own profile" ON public.profiles FOR UPDATE USING (auth.uid() = user_id OR public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins can delete profiles" ON public.profiles FOR DELETE USING (public.has_role(auth.uid(), 'admin'));

-- 12. RLS Policies for user_roles
CREATE POLICY "Users can view own roles" ON public.user_roles FOR SELECT USING (
  auth.uid() = user_id OR public.has_role(auth.uid(), 'admin')
);
CREATE POLICY "Admins can insert roles" ON public.user_roles FOR INSERT WITH CHECK (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins can update roles" ON public.user_roles FOR UPDATE USING (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins can delete roles" ON public.user_roles FOR DELETE USING (public.has_role(auth.uid(), 'admin'));

-- 13. RLS Policies for jobs
CREATE POLICY "Anyone authenticated can view jobs" ON public.jobs FOR SELECT USING (auth.uid() IS NOT NULL);
CREATE POLICY "Recruiters can insert jobs" ON public.jobs FOR INSERT WITH CHECK (
  public.has_role(auth.uid(), 'recruiter') OR public.has_role(auth.uid(), 'admin')
);
CREATE POLICY "Recruiters can update own jobs" ON public.jobs FOR UPDATE USING (
  public.is_recruiter_for_job(id, auth.uid()) OR public.has_role(auth.uid(), 'admin')
);
CREATE POLICY "Admins can delete jobs" ON public.jobs FOR DELETE USING (
  public.is_recruiter_for_job(id, auth.uid()) OR public.has_role(auth.uid(), 'admin')
);

-- 14. RLS Policies for applications
CREATE POLICY "View own or recruiter applications" ON public.applications FOR SELECT USING (
  candidate_id = public.get_profile_id(auth.uid())
  OR public.has_role(auth.uid(), 'admin')
  OR EXISTS (
    SELECT 1 FROM public.jobs j
    JOIN public.profiles p ON p.id = j.recruiter_id
    WHERE j.id = job_id AND p.user_id = auth.uid()
  )
);
CREATE POLICY "Candidates can apply" ON public.applications FOR INSERT WITH CHECK (
  candidate_id = public.get_profile_id(auth.uid())
);
CREATE POLICY "Recruiters and admins can update applications" ON public.applications FOR UPDATE USING (
  public.has_role(auth.uid(), 'admin')
  OR EXISTS (
    SELECT 1 FROM public.jobs j
    JOIN public.profiles p ON p.id = j.recruiter_id
    WHERE j.id = job_id AND p.user_id = auth.uid()
  )
);

-- 15. RLS Policies for interviews
CREATE POLICY "View own or managed interviews" ON public.interviews FOR SELECT USING (
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
);
CREATE POLICY "Service role can insert interviews" ON public.interviews FOR INSERT WITH CHECK (true);
CREATE POLICY "Service role can update interviews" ON public.interviews FOR UPDATE USING (true);

-- 16. RLS Policies for scores
CREATE POLICY "View own or managed scores" ON public.scores FOR SELECT USING (
  public.has_role(auth.uid(), 'admin')
  OR EXISTS (
    SELECT 1 FROM public.interviews i
    JOIN public.applications a ON a.id = i.application_id
    WHERE i.id = interview_id AND a.candidate_id = public.get_profile_id(auth.uid())
  )
  OR EXISTS (
    SELECT 1 FROM public.interviews i
    JOIN public.applications a ON a.id = i.application_id
    JOIN public.jobs j ON j.id = a.job_id
    JOIN public.profiles p ON p.id = j.recruiter_id
    WHERE i.id = interview_id AND p.user_id = auth.uid()
  )
);
CREATE POLICY "Service role can insert scores" ON public.scores FOR INSERT WITH CHECK (true);
CREATE POLICY "Service role can update scores" ON public.scores FOR UPDATE USING (true);

-- 17. RLS Policies for system_settings
CREATE POLICY "Anyone authenticated can view settings" ON public.system_settings FOR SELECT USING (auth.uid() IS NOT NULL);
CREATE POLICY "Admins can modify settings" ON public.system_settings FOR UPDATE USING (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins can insert settings" ON public.system_settings FOR INSERT WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- 18. Timestamps trigger
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

CREATE TRIGGER update_profiles_updated_at BEFORE UPDATE ON public.profiles FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_jobs_updated_at BEFORE UPDATE ON public.jobs FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_applications_updated_at BEFORE UPDATE ON public.applications FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_interviews_updated_at BEFORE UPDATE ON public.interviews FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_scores_updated_at BEFORE UPDATE ON public.scores FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- 19. Auto-create profile on signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (user_id, name, email)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'name', ''),
    COALESCE(NEW.email, '')
  );
  -- Auto-assign role from metadata
  INSERT INTO public.user_roles (user_id, role)
  VALUES (
    NEW.id,
    COALESCE((NEW.raw_user_meta_data->>'role')::app_role, 'candidate')
  );
  RETURN NEW;
END;
$$;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- 20. Indexes
CREATE INDEX idx_profiles_user_id ON public.profiles(user_id);
CREATE INDEX idx_user_roles_user_id ON public.user_roles(user_id);
CREATE INDEX idx_jobs_recruiter_id ON public.jobs(recruiter_id);
CREATE INDEX idx_applications_job_id ON public.applications(job_id);
CREATE INDEX idx_applications_candidate_id ON public.applications(candidate_id);
CREATE INDEX idx_interviews_application_id ON public.interviews(application_id);
CREATE INDEX idx_scores_interview_id ON public.scores(interview_id);
CREATE INDEX idx_system_settings_key ON public.system_settings(key);
