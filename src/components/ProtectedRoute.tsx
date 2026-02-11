import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { Loader2 } from 'lucide-react';

interface ProtectedRouteProps {
  allowedRole: 'admin' | 'recruiter' | 'candidate';
  children: React.ReactNode;
}

export default function ProtectedRoute({ allowedRole, children }: ProtectedRouteProps) {
  const { user, role, loading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!loading) {
      if (!user) {
        navigate('/auth', { replace: true });
      } else if (role && role !== allowedRole) {
        navigate(`/${role}`, { replace: true });
      }
    }
  }, [user, role, loading, allowedRole, navigate]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-background">
        <Loader2 size={32} className="animate-spin text-primary" />
      </div>
    );
  }

  if (!user || (role && role !== allowedRole)) {
    return null;
  }

  return <>{children}</>;
}
