import { supabase } from './supabase';
import type { 
  Profile, 
  Preferences, 
  ProfileInsert, 
  PreferencesInsert, 
  ProfileUpdate, 
  PreferencesUpdate,
  UserData 
} from '../types/database';

/**
 * Profile-related database operations
 */
export const profileService = {
  /**
   * Get a profile by user ID
   */
  async getProfile(userId: string): Promise<Profile | null> {
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .single();

    if (error) {
      console.error('Error fetching profile:', error);
      return null;
    }

    return data;
  },

  /**
   * Get the current user's profile
   */
  async getCurrentProfile(): Promise<Profile | null> {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return null;

    return this.getProfile(user.id);
  },

  /**
   * Create a new profile for the current user
   */
  async createProfile(profileData: Omit<ProfileInsert, 'id'>): Promise<Profile | null> {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return null;

    return this.createProfileForUser(user.id, profileData);
  },

  /**
   * Create a new profile for a specific user
   */
  async createProfileForUser(userId: string, profileData: Omit<ProfileInsert, 'id'>): Promise<Profile | null> {
    const { data, error } = await supabase
      .from('profiles')
      .insert([{ id: userId, ...profileData }])
      .select()
      .single();

    if (error) {
      console.error('Error creating profile:', error);
      return null;
    }

    return data;
  },

  /**
   * Update the current user's profile
   */
  async updateProfile(profileData: Omit<ProfileUpdate, 'id'>): Promise<Profile | null> {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return null;

    const { data, error } = await supabase
      .from('profiles')
      .update(profileData)
      .eq('id', user.id)
      .select()
      .single();

    if (error) {
      console.error('Error updating profile:', error);
      return null;
    }

    return data;
  },

  /**
   * Delete the current user's profile
   */
  async deleteProfile(): Promise<boolean> {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return false;

    const { error } = await supabase
      .from('profiles')
      .delete()
      .eq('id', user.id);

    if (error) {
      console.error('Error deleting profile:', error);
      return false;
    }

    return true;
  }
};

/**
 * Preferences-related database operations
 */
export const preferencesService = {
  /**
   * Get the current user's preferences
   */
  async getCurrentPreferences(): Promise<Preferences | null> {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return null;

    const { data, error } = await supabase
      .from('preferences')
      .select('*')
      .eq('id', user.id)
      .single();

    if (error) {
      console.error('Error fetching preferences:', error);
      return null;
    }

    return data;
  },

  /**
   * Alias for getCurrentPreferences for backward compatibility
   */
  async getPreferences(): Promise<Preferences | null> {
    return this.getCurrentPreferences();
  },

  /**
   * Create preferences for the current user
   */
  async createPreferences(preferencesData: Omit<PreferencesInsert, 'id'>): Promise<Preferences | null> {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return null;

    const { data, error } = await supabase
      .from('preferences')
      .insert([{ id: user.id, ...preferencesData }])
      .select()
      .single();

    if (error) {
      console.error('Error creating preferences:', error);
      return null;
    }

    return data;
  },

  /**
   * Update the current user's preferences
   */
  async updatePreferences(preferencesData: Omit<PreferencesUpdate, 'id'>): Promise<Preferences | null> {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return null;

    const { data, error } = await supabase
      .from('preferences')
      .update(preferencesData)
      .eq('id', user.id)
      .select()
      .single();

    if (error) {
      console.error('Error updating preferences:', error);
      return null;
    }

    return data;
  },

  /**
   * Delete the current user's preferences
   */
  async deletePreferences(): Promise<boolean> {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return false;

    const { error } = await supabase
      .from('preferences')
      .delete()
      .eq('id', user.id);

    if (error) {
      console.error('Error deleting preferences:', error);
      return false;
    }

    return true;
  },

  /**
   * Upsert (create or update) preferences for the current user
   */
  async upsertPreferences(preferencesData: Omit<PreferencesInsert, 'id'>): Promise<Preferences | null> {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return null;

    const { data, error } = await supabase
      .from('preferences')
      .upsert({ id: user.id, ...preferencesData })
      .select()
      .single();

    if (error) {
      console.error('Error upserting preferences:', error);
      return null;
    }

    return data;
  }
};

/**
 * Combined user data operations
 */
export const userDataService = {
  /**
   * Get complete user data (profile + preferences)
   */
  async getUserData(): Promise<UserData | null> {
    const [profile, preferences] = await Promise.all([
      profileService.getCurrentProfile(),
      preferencesService.getCurrentPreferences()
    ]);

    if (!profile || !preferences) {
      return null;
    }

    return { profile, preferences };
  },

  /**
   * Initialize user data (create both profile and preferences)
   */
  async initializeUserData(
    profileData: Omit<ProfileInsert, 'id'>,
    preferencesData: Omit<PreferencesInsert, 'id'>
  ): Promise<UserData | null> {
    const [profile, preferences] = await Promise.all([
      profileService.createProfile(profileData),
      preferencesService.createPreferences(preferencesData)
    ]);

    if (!profile || !preferences) {
      return null;
    }

    return { profile, preferences };
  }
};
