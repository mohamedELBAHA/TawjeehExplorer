// Check what's actually in the database
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://shcyriwkfjxrxicojjfg.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InNoY3lyaXdrZmp4cnhpY29qamZnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjA2MDU4ODUsImV4cCI6MjA3NjE4MTg4NX0.m0AA3lmI4eKpXFSsoxTpNkgamUM9nFZLlTAIUrjzNW8';

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function checkDatabaseContents() {
  console.log('🔍 Checking database contents...');
  
  try {
    // Check profiles table
    console.log('\n📊 Profiles table:');
    const { data: profiles, error: profilesError } = await supabase
      .from('profiles')
      .select('*');
    
    if (profilesError) {
      console.log('❌ Error fetching profiles:', profilesError.message);
    } else {
      console.log(`✅ Found ${profiles.length} profiles:`);
      profiles.forEach((profile, index) => {
        console.log(`   ${index + 1}. ID: ${profile.id}`);
        console.log(`      Name: ${profile.first_name} ${profile.last_name}`);
        console.log(`      City: ${profile.city}`);
        console.log(`      Class Level: ${profile.class_level}`);
        console.log(`      Plan: ${profile.plan}`);
        console.log(`      Created: ${profile.created_at}`);
        console.log('');
      });
    }
    
    // Check preferences table
    console.log('\n📊 Preferences table:');
    const { data: preferences, error: preferencesError } = await supabase
      .from('preferences')
      .select('*');
    
    if (preferencesError) {
      console.log('❌ Error fetching preferences:', preferencesError.message);
    } else {
      console.log(`✅ Found ${preferences.length} preferences:`);
      preferences.forEach((pref, index) => {
        console.log(`   ${index + 1}. ID: ${pref.id}`);
        console.log(`      Cities: ${pref.preferred_cities || 'None'}`);
        console.log(`      Fields: ${pref.preferred_fields || 'None'}`);
        console.log(`      Housing: ${pref.needs_housing}`);
        console.log(`      Created: ${pref.created_at}`);
        console.log('');
      });
    }
    
    // Check auth.users (if accessible)
    console.log('\n📊 Auth users (if accessible):');
    const { data: users, error: usersError } = await supabase.auth.admin.listUsers();
    
    if (usersError) {
      console.log('⚠️  Cannot access auth.users (normal for anon key)');
      console.log('   This is expected - you need service role key to see auth users');
    } else {
      console.log(`✅ Found ${users.users.length} auth users`);
    }
    
    return true;
    
  } catch (error) {
    console.log('❌ Check failed:', error.message);
    return false;
  }
}

checkDatabaseContents();
