// Create a test user and profile in the database
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://shcyriwkfjxrxicojjfg.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InNoY3lyaXdrZmp4cnhpY29qamZnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjA2MDU4ODUsImV4cCI6MjA3NjE4MTg4NX0.m0AA3lmI4eKpXFSsoxTpNkgamUM9nFZLlTAIUrjzNW8';

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function createTestUser() {
  console.log('🧪 Creating test user and profile...');
  
  try {
    // Create a test user ID (simulating what would come from Supabase auth)
    const testUserId = '550e8400-e29b-41d4-a716-446655440000';
    
    console.log(`📝 Creating profile for user: ${testUserId}`);
    
    // Create profile
    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .insert([{
        id: testUserId,
        first_name: 'Test',
        last_name: 'User',
        city: 'Casablanca',
        class_level: 'Bac',
        plan: 'free'
      }])
      .select()
      .single();
    
    if (profileError) {
      console.log('❌ Error creating profile:', profileError.message);
      return false;
    }
    
    console.log('✅ Profile created:', profile);
    
    // Create preferences
    const { data: preferences, error: preferencesError } = await supabase
      .from('preferences')
      .insert([{
        id: testUserId,
        preferred_cities: ['Casablanca', 'Rabat'],
        preferred_fields: ['Informatique', 'Médecine'],
        hobbies: ['Sport', 'Musique'],
        near_ocean: true,
        needs_housing: false,
        needs_scholarship: true
      }])
      .select()
      .single();
    
    if (preferencesError) {
      console.log('❌ Error creating preferences:', preferencesError.message);
      return false;
    }
    
    console.log('✅ Preferences created:', preferences);
    
    // Test updating the profile
    console.log('\n🔄 Testing profile update...');
    const { data: updatedProfile, error: updateError } = await supabase
      .from('profiles')
      .update({
        first_name: 'Updated',
        last_name: 'Name',
        city: 'Rabat'
      })
      .eq('id', testUserId)
      .select()
      .single();
    
    if (updateError) {
      console.log('❌ Error updating profile:', updateError.message);
      return false;
    }
    
    console.log('✅ Profile updated:', updatedProfile);
    
    console.log('\n🎉 Test user created successfully!');
    console.log('✅ Database operations are working');
    console.log('✅ Profile updates are working');
    
    return true;
    
  } catch (error) {
    console.log('❌ Test failed:', error.message);
    return false;
  }
}

createTestUser();
