// Database types for Supabase tables
export type ClassLevel = '5ème' | '6ème' | 'Bac' | 'Bac+';
export type PlanType = 'free' | 'premium' | 'enterprise';

export interface Profile {
  id: string;
  first_name?: string | null;
  last_name?: string | null;
  city?: string | null;
  class_level?: ClassLevel | null;
  plan: string;
  plan_expiry?: string | null;
  created_at: string;
  updated_at: string;
}

export interface Preferences {
  id: string;
  preferred_cities?: string[] | null;
  preferred_fields?: string[] | null;
  hobbies?: string[] | null;
  near_ocean: boolean;
  needs_housing: boolean;
  needs_scholarship: boolean;
  additional_notes?: string | null;
  created_at: string;
  updated_at: string;
}

// Insert types (without auto-generated fields)
export interface ProfileInsert {
  id: string;
  first_name?: string | null;
  last_name?: string | null;
  city?: string | null;
  class_level?: ClassLevel | null;
  plan?: string;
  plan_expiry?: string | null;
}

export interface PreferencesInsert {
  id: string;
  preferred_cities?: string[] | null;
  preferred_fields?: string[] | null;
  hobbies?: string[] | null;
  near_ocean?: boolean;
  needs_housing?: boolean;
  needs_scholarship?: boolean;
  additional_notes?: string | null;
}

// Update types (all fields optional except id)
export interface ProfileUpdate {
  id: string;
  first_name?: string | null;
  last_name?: string | null;
  city?: string | null;
  class_level?: ClassLevel | null;
  plan?: string;
  plan_expiry?: string | null;
}

export interface PreferencesUpdate {
  id: string;
  preferred_cities?: string[] | null;
  preferred_fields?: string[] | null;
  hobbies?: string[] | null;
  near_ocean?: boolean;
  needs_housing?: boolean;
  needs_scholarship?: boolean;
}

// Combined user data type
export interface UserData {
  profile: Profile;
  preferences: Preferences;
}
