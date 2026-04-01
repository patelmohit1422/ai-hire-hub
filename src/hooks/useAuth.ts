// custom hook for authentication - handles sign in, sign up, and session management
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import type { User } from '@supabase/supabase-js';

const SUPABASE_URL = "https://dtkoenqyxptijpacpxdk.supabase.co";

interface AuthState {
  user: User | null;
  profile: any | null;
  role: string | null;
  loading: boolean;
}

export function useAuth() {
  const [state, setState] = useState<AuthState>({
    user: null,
    profile: null,
    role: null,
    loading: true,
  });

  useEffect(() => {
    // check if user already has a session
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session?.user) {
        fetchUserData(session.user);
      } else {
        setState(prev => ({ ...prev, loading: false }));
      }
    });

    // listen for login/logout events
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session?.user) {
        fetchUserData(session.user);
      } else {
        setState({ user: null, profile: null, role: null, loading: false });
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  // fetch profile and role from database after login
  async function fetchUserData(user: User) {
    try {
      const { data: profile } = await supabase
        .from('profiles')
        .select('*')
        .eq('user_id', user.id)
        .maybeSingle();

      const { data: roleData } = await supabase
        .from('user_roles')
        .select('role')
        .eq('user_id', user.id)
        .maybeSingle();

      setState({
        user,
        profile,
        role: roleData?.role || 'candidate',
        loading: false,
      });
    } catch (error) {
      console.error('Error fetching user data:', error);
      setState(prev => ({ ...prev, user, loading: false }));
    }
  }

  // register a new user via auth proxy edge function
  async function signUp(email: string, password: string, name: string, role: string) {
    try {
      const response = await fetch(`${SUPABASE_URL}/functions/v1/auth-proxy`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password, name, role, action: 'signup' }),
      });

      const result = await response.json();

      if (result.error) {
        return { data: null, error: { message: result.error } as any };
      }

      // set session in client if signup returned tokens
      if (result.session) {
        await supabase.auth.setSession({
          access_token: result.session.access_token,
          refresh_token: result.session.refresh_token,
        });
      }

      return { data: { user: result.user }, error: null };
    } catch (err: any) {
      return { data: null, error: { message: 'Network error. Please check your connection and try again.' } as any };
    }
  }

  // sign in existing user via auth proxy edge function
  async function signIn(email: string, password: string) {
    try {
      const response = await fetch(`${SUPABASE_URL}/functions/v1/auth-proxy`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password, action: 'signin' }),
      });

      const result = await response.json();

      if (result.error) {
        return { data: null, error: { message: result.error } as any };
      }

      // set session tokens in supabase client
      if (result.session) {
        await supabase.auth.setSession({
          access_token: result.session.access_token,
          refresh_token: result.session.refresh_token,
        });
      }

      return { data: { user: result.session?.user || result.user }, error: null };
    } catch (err: any) {
      return { data: null, error: { message: 'Network error. Please check your connection and try again.' } as any };
    }
  }

  // clear session and reset state
  async function signOut() {
    await supabase.auth.signOut();
    setState({ user: null, profile: null, role: null, loading: false });
  }

  return {
    ...state,
    signUp,
    signIn,
    signOut,
  };
}