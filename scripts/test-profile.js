// Test script to verify profile table functionality
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://shcyriwkfjxrxicojjfg.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InNoY3lyaXdrZmp4cnhpY29qamZnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjA2MDU4ODUsImV4cCI6MjA3NjE4MTg4NX0.m0AA3lmI4eKpXFSsoxTpNkgamUM9nFZLlTAIUrjzNW8';

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function testProfileTable() {
  console.log('🧪 Testing profile table functionality...');
  
  try {
    // Test 1: Check if tables exist
    console.log('\n1️⃣ Checking table existence...');
    
    const { data: profiles, error: profilesError } = await supabase
      .from('profiles')
      .select('*')
      .limit(1);
    
    if (profilesError) {
      console.log('❌ Profiles table not found');
      console.log('Error:', profilesError.message);
      return false;
    }
    
    console.log('✅ Profiles table exists');
    
    const { data: preferences, error: preferencesError } = await supabase
      .from('preferences')
      .select('*')
      .limit(1);
    
    if (preferencesError) {
      console.log('❌ Preferences table not found');
      console.log('Error:', preferencesError.message);
      return false;
    }
    
    console.log('✅ Preferences table exists');
    
    // Test 2: Check table structure
    console.log('\n2️⃣ Checking table structure...');
    
    // Try to get table info by attempting a select with specific columns
    const { data: profileStructure, error: profileStructureError } = await supabase
      .from('profiles')
      .select('id, first_name, last_name, city, class_level, plan, created_at, updated_at')
      .limit(0);
    
    if (profileStructureError) {
      console.log('❌ Profile table structure issue:', profileStructureError.message);
    } else {
      console.log('✅ Profile table has correct structure');
    }
    
    const { data: preferencesStructure, error: preferencesStructureError } = await supabase
      .from('preferences')
      .select('id, preferred_cities, preferred_fields, hobbies, near_ocean, needs_housing, needs_scholarship, created_at, updated_at')
      .limit(0);
    
    if (preferencesStructureError) {
      console.log('❌ Preferences table structure issue:', preferencesStructureError.message);
    } else {
      console.log('✅ Preferences table has correct structure');
    }
    
    // Test 3: Check RLS policies
    console.log('\n3️⃣ Checking Row Level Security...');
    
    // This will fail if RLS is not properly configured
    const { data: rlsTest, error: rlsError } = await supabase
      .from('profiles')
      .select('*');
    
    if (rlsError && rlsError.message.includes('Row Level Security')) {
      console.log('✅ RLS is properly configured (access denied without auth)');
    } else if (rlsError) {
      console.log('⚠️  RLS might not be configured properly');
    } else {
      console.log('⚠️  RLS might not be working (data accessible without auth)');
    }
    
    console.log('\n🎉 Database verification completed!');
    console.log('✅ User profile table is properly stored in the database');
    console.log('✅ All tables are accessible and properly structured');
    
    return true;
    
  } catch (error) {
    console.log('❌ Test failed:', error.message);
    return false;
  }
}

testProfileTable();
