import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import type { User } from '@supabase/supabase-js';

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
    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session?.user) {
        fetchUserData(session.user);
      } else {
        setState(prev => ({ ...prev, loading: false }));
      }
    });

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session?.user) {
        fetchUserData(session.user);
      } else {
        setState({ user: null, profile: null, role: null, loading: false });
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  async function fetchUserData(user: User) {
    try {
      // Fetch profile
      const { data: profile } = await supabase
        .from('profiles')
        .select('*')
        .eq('user_id', user.id)
        .maybeSingle();

      // Fetch role
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

  async function signUp(email: string, password: string, name: string, role: string) {
    // Check if email already exists in profiles (prevents duplicate accounts across roles)
    const { data: existingProfile } = await supabase
      .from('profiles')
      .select('id, email')
      .eq('email', email)
      .maybeSingle();

    if (existingProfile) {
      return { data: null, error: { message: 'This email is already registered. One email can only have one role. Please sign in instead.' } as any };
    }

    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: { name, role },
      },
    });
    return { data, error };
  }

  async function signIn(email: string, password: string) {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    return { data, error };
  }

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
