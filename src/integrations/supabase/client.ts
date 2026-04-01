// supabase client setup with retry logic for network errors
import { createClient } from '@supabase/supabase-js';
import type { Database } from './types';

const SUPABASE_URL = "https://dtkoenqyxptijpacpxdk.supabase.co";
const SUPABASE_PUBLISHABLE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImR0a29lbnF5eHB0aWpwYWNweGRrIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzA1ODA4NTUsImV4cCI6MjA4NjE1Njg1NX0.GkpI9vD04OgSwl9LvGdUEi8-OHVojbiFzlbcO8Y9LDA";

// retry fetch wrapper to handle intermittent network errors
const fetchWithRetry = async (input: RequestInfo | URL, init?: RequestInit): Promise<Response> => {
  const maxRetries = 3;
  for (let attempt = 0; attempt < maxRetries; attempt++) {
    try {
      const response = await fetch(input, init);
      return response;
    } catch (error) {
      if (attempt === maxRetries - 1) throw error;
      await new Promise(resolve => setTimeout(resolve, 200 * (attempt + 1)));
    }
  }
  throw new Error('Failed to fetch after retries');
};

export const supabase = createClient<Database>(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true,
  },
  global: {
    fetch: fetchWithRetry,
  },
});