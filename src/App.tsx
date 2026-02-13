import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import LandingPage from "./pages/LandingPage";
import AuthPage from "./pages/AuthPage";
import PricingPage from "./pages/PricingPage";
import NotFound from "./pages/NotFound";
import ProtectedRoute from "./components/ProtectedRoute";

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
import RecruiterJobDetail from "./pages/recruiter/RecruiterJobDetail";
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
          <Route path="/admin" element={<ProtectedRoute allowedRole="admin"><AdminOverview /></ProtectedRoute>} />
          <Route path="/admin/users" element={<ProtectedRoute allowedRole="admin"><AdminUsers /></ProtectedRoute>} />
          <Route path="/admin/users/add" element={<ProtectedRoute allowedRole="admin"><AdminAddUser /></ProtectedRoute>} />
          <Route path="/admin/jobs" element={<ProtectedRoute allowedRole="admin"><AdminJobs /></ProtectedRoute>} />
          <Route path="/admin/analytics" element={<ProtectedRoute allowedRole="admin"><AdminAnalytics /></ProtectedRoute>} />
          <Route path="/admin/scoring" element={<ProtectedRoute allowedRole="admin"><AdminScoring /></ProtectedRoute>} />
          <Route path="/admin/settings" element={<ProtectedRoute allowedRole="admin"><AdminSettings /></ProtectedRoute>} />

          {/* Recruiter */}
          <Route path="/recruiter" element={<ProtectedRoute allowedRole="recruiter"><RecruiterOverview /></ProtectedRoute>} />
          <Route path="/recruiter/jobs" element={<ProtectedRoute allowedRole="recruiter"><RecruiterJobs /></ProtectedRoute>} />
          <Route path="/recruiter/jobs/add" element={<ProtectedRoute allowedRole="recruiter"><RecruiterAddJob /></ProtectedRoute>} />
          <Route path="/recruiter/jobs/:jobId" element={<ProtectedRoute allowedRole="recruiter"><RecruiterJobDetail /></ProtectedRoute>} />
          <Route path="/recruiter/applications" element={<ProtectedRoute allowedRole="recruiter"><RecruiterApplications /></ProtectedRoute>} />
          <Route path="/recruiter/candidates" element={<ProtectedRoute allowedRole="recruiter"><RecruiterCandidates /></ProtectedRoute>} />
          <Route path="/recruiter/compare" element={<ProtectedRoute allowedRole="recruiter"><RecruiterCompare /></ProtectedRoute>} />
          <Route path="/recruiter/results" element={<ProtectedRoute allowedRole="recruiter"><RecruiterResults /></ProtectedRoute>} />
          <Route path="/recruiter/decisions" element={<ProtectedRoute allowedRole="recruiter"><RecruiterDecisions /></ProtectedRoute>} />
          <Route path="/recruiter/settings" element={<ProtectedRoute allowedRole="recruiter"><RecruiterSettings /></ProtectedRoute>} />

          {/* Candidate */}
          <Route path="/candidate" element={<ProtectedRoute allowedRole="candidate"><CandidateDashboard /></ProtectedRoute>} />
          <Route path="/candidate/profile" element={<ProtectedRoute allowedRole="candidate"><CandidateProfile /></ProtectedRoute>} />
          <Route path="/candidate/jobs" element={<ProtectedRoute allowedRole="candidate"><CandidateJobs /></ProtectedRoute>} />
          <Route path="/candidate/interview" element={<ProtectedRoute allowedRole="candidate"><CandidateInterview /></ProtectedRoute>} />
          <Route path="/candidate/progress" element={<ProtectedRoute allowedRole="candidate"><CandidateProgress /></ProtectedRoute>} />
          <Route path="/candidate/results" element={<ProtectedRoute allowedRole="candidate"><CandidateResults /></ProtectedRoute>} />
          <Route path="/candidate/settings" element={<ProtectedRoute allowedRole="candidate"><CandidateSettings /></ProtectedRoute>} />

          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
