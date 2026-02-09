import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import LandingPage from "./pages/LandingPage";
import AuthPage from "./pages/AuthPage";
import PricingPage from "./pages/PricingPage";
import NotFound from "./pages/NotFound";

// Admin
import AdminOverview from "./pages/admin/AdminOverview";
import AdminUsers from "./pages/admin/AdminUsers";
import AdminAddUser from "./pages/admin/AdminAddUser";
import AdminJobs from "./pages/admin/AdminJobs";
import AdminAnalytics from "./pages/admin/AdminAnalytics";
import AdminScoring from "./pages/admin/AdminScoring";
import AdminSettings from "./pages/admin/AdminSettings";

// Recruiter
import RecruiterOverview from "./pages/recruiter/RecruiterOverview";
import RecruiterJobs from "./pages/recruiter/RecruiterJobs";
import RecruiterAddJob from "./pages/recruiter/RecruiterAddJob";
import RecruiterApplications from "./pages/recruiter/RecruiterApplications";
import RecruiterCandidates from "./pages/recruiter/RecruiterCandidates";
import RecruiterCompare from "./pages/recruiter/RecruiterCompare";
import RecruiterResults from "./pages/recruiter/RecruiterResults";
import RecruiterDecisions from "./pages/recruiter/RecruiterDecisions";
import RecruiterSettings from "./pages/recruiter/RecruiterSettings";

// Candidate
import CandidateDashboard from "./pages/candidate/CandidateDashboard";
import CandidateProfile from "./pages/candidate/CandidateProfile";
import CandidateJobs from "./pages/candidate/CandidateJobs";
import CandidateInterview from "./pages/candidate/CandidateInterview";
import CandidateProgress from "./pages/candidate/CandidateProgress";
import CandidateResults from "./pages/candidate/CandidateResults";
import CandidateSettings from "./pages/candidate/CandidateSettings";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/auth" element={<AuthPage />} />
          <Route path="/pricing" element={<PricingPage />} />

          {/* Admin */}
          <Route path="/admin" element={<AdminOverview />} />
          <Route path="/admin/users" element={<AdminUsers />} />
          <Route path="/admin/users/add" element={<AdminAddUser />} />
          <Route path="/admin/jobs" element={<AdminJobs />} />
          <Route path="/admin/analytics" element={<AdminAnalytics />} />
          <Route path="/admin/scoring" element={<AdminScoring />} />
          <Route path="/admin/settings" element={<AdminSettings />} />

          {/* Recruiter */}
          <Route path="/recruiter" element={<RecruiterOverview />} />
          <Route path="/recruiter/jobs" element={<RecruiterJobs />} />
          <Route path="/recruiter/jobs/add" element={<RecruiterAddJob />} />
          <Route path="/recruiter/applications" element={<RecruiterApplications />} />
          <Route path="/recruiter/candidates" element={<RecruiterCandidates />} />
          <Route path="/recruiter/compare" element={<RecruiterCompare />} />
          <Route path="/recruiter/results" element={<RecruiterResults />} />
          <Route path="/recruiter/decisions" element={<RecruiterDecisions />} />
          <Route path="/recruiter/settings" element={<RecruiterSettings />} />

          {/* Candidate */}
          <Route path="/candidate" element={<CandidateDashboard />} />
          <Route path="/candidate/profile" element={<CandidateProfile />} />
          <Route path="/candidate/jobs" element={<CandidateJobs />} />
          <Route path="/candidate/interview" element={<CandidateInterview />} />
          <Route path="/candidate/progress" element={<CandidateProgress />} />
          <Route path="/candidate/results" element={<CandidateResults />} />
          <Route path="/candidate/settings" element={<CandidateSettings />} />

          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
