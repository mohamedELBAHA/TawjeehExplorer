// Simple database verification script
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://shcyriwkfjxrxicojjfg.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InNoY3lyaXdrZmp4cnhpY29qamZnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjA2MDU4ODUsImV4cCI6MjA3NjE4MTg4NX0.m0AA3lmI4eKpXFSsoxTpNkgamUM9nFZLlTAIUrjzNW8';

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function checkDatabase() {
  console.log('🔍 Checking Supabase database connection...');
  
  try {
    // Test profiles table
    const { data: profiles, error: profilesError } = await supabase
      .from('profiles')
      .select('*')
      .limit(1);
    
    if (profilesError) {
      console.log('❌ Profiles table error:', profilesError.message);
      return false;
    }
    
    console.log('✅ Profiles table accessible');
    
    // Test preferences table
    const { data: preferences, error: preferencesError } = await supabase
      .from('preferences')
      .select('*')
      .limit(1);
    
    if (preferencesError) {
      console.log('❌ Preferences table error:', preferencesError.message);
      return false;
    }
    
    console.log('✅ Preferences table accessible');
    console.log('✅ Database connection successful!');
    console.log('✅ User profile table is properly stored in the database');
    
    return true;
    
  } catch (error) {
    console.log('❌ Database check failed:', error.message);
    return false;
  }
}

checkDatabase();
