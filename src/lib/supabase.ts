import { createClient } from '@supabase/supabase-js';

// Environment variables from Vite
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

console.log('Supabase config:', { 
  url: supabaseUrl ? 'SET' : 'MISSING', 
  key: supabaseAnonKey ? 'SET' : 'MISSING' 
});

// Create a dummy client if environment variables are missing (for demo/development)
const createSupabaseClient = () => {
  if (!supabaseUrl || !supabaseAnonKey) {
    console.warn('Supabase environment variables missing. Using demo mode.');
    // Return a mock client for demo purposes
    return createClient(
      'https://demo.supabase.co', 
      'demo-key',
      {
        auth: {
          autoRefreshToken: false,
          persistSession: false,
          detectSessionInUrl: false
        }
      }
    );
  }

  return createClient(supabaseUrl, supabaseAnonKey, {
    auth: {
      autoRefreshToken: true,
      persistSession: true,
      detectSessionInUrl: true
    }
  });
};

// Create and export the Supabase client
export const supabase = createSupabaseClient();

// Export types for TypeScript support
export type { User, Session, AuthError } from '@supabase/supabase-js';
