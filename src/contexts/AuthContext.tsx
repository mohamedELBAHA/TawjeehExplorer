import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { User } from '@supabase/supabase-js';
import { supabase } from '../lib/supabase';
import { profileService } from '../lib/database';
import type { Profile } from '../types/database';

interface AuthState {
  user: User | null;
  profile: Profile | null;
  loading: boolean;
  authReady: boolean;
  refreshProfile: () => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthState | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);
  const [authReady, setAuthReady] = useState(false);

  const fetchProfile = async (userId: string): Promise<void> => {
    console.log('AuthContext: fetchProfile called for user:', userId);
    try {
      // Add timeout to prevent infinite waiting
      const timeoutPromise = new Promise<never>((_, reject) => 
        setTimeout(() => reject(new Error('Profile fetch timeout')), 10000)
      );
      
      const profilePromise = profileService.getProfile(userId);
      const userProfile = await Promise.race([profilePromise, timeoutPromise]);
      
      console.log('AuthContext: Profile fetched:', !!userProfile);
      setProfile(userProfile);
    } catch (error) {
      console.error('Error fetching profile:', error);
      setProfile(null);
    }
  };

  const refreshProfile = async (): Promise<void> => {
    if (!user?.id) return;
    
    setLoading(true);
    try {
      await fetchProfile(user.id);
    } finally {
      setLoading(false);
    }
  };

  const logout = async (): Promise<void> => {
    setLoading(true);
    try {
      // Check if this is an admin session
      if (localStorage.getItem('admin_session')) {
        localStorage.removeItem('admin_session');
      } else {
        // Regular Supabase logout
        await supabase.auth.signOut();
      }
      
      setUser(null);
      setProfile(null);
    } catch (error) {
      console.error('Error during logout:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // Fallback timeout to prevent infinite loading
    const fallbackTimeout = setTimeout(() => {
      console.warn('AuthContext: Fallback timeout - forcing loading to false');
      setLoading(false);
    }, 15000); // 15 second maximum wait

    // Check for admin session first
    const checkAdminSession = () => {
      const adminSession = localStorage.getItem('admin_session');
      if (adminSession) {
        try {
          const adminUser = JSON.parse(adminSession);
          console.log('AuthContext: Found admin session');
          setUser(adminUser as User);
          
          // Create mock admin profile
          const adminProfile: Profile = {
            id: 'admin-profile',
            first_name: 'Admin',
            last_name: 'User',
            city: 'Admin City',
            class_level: 'Bac+',
            plan: 'enterprise',
            plan_expiry: null,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
          };
          setProfile(adminProfile);
          setLoading(false);
          setAuthReady(true);
          clearTimeout(fallbackTimeout);
          return true;
        } catch (error) {
          console.error('Error parsing admin session:', error);
          localStorage.removeItem('admin_session');
        }
      }
      return false;
    };

    // Get initial session
    const getInitialSession = async () => {
      console.log('AuthContext: Getting initial session...');
      
      // Check for admin session first
      if (checkAdminSession()) {
        return;
      }
      
      try {
        // Add timeout to Supabase call
        const sessionPromise = supabase.auth.getSession();
        const timeoutPromise = new Promise<never>((_, reject) => 
          setTimeout(() => reject(new Error('Session timeout')), 8000)
        );
        
        const { data: { session }, error } = await Promise.race([sessionPromise, timeoutPromise]);
        
        console.log('AuthContext: Session result:', { session: !!session, error });
        
        if (error) {
          console.error('Error getting session:', error);
          setUser(null);
          setProfile(null);
          setLoading(false);
          setAuthReady(true);
          clearTimeout(fallbackTimeout);
          return;
        }

        setUser(session?.user ?? null);
        console.log('AuthContext: User set:', !!session?.user);
        
        if (session?.user?.id) {
          console.log('AuthContext: Fetching profile for user:', session.user.id);
          await fetchProfile(session.user.id);
        } else {
          console.log('AuthContext: No user, skipping profile fetch');
        }
      } catch (error) {
        console.error('Error in getInitialSession:', error);
        setUser(null);
        setProfile(null);
      } finally {
        console.log('AuthContext: Setting loading to false');
        setLoading(false);
        setAuthReady(true);
        clearTimeout(fallbackTimeout);
      }
    };

    getInitialSession();

    // Listen to storage events for admin session
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'admin_session') {
        if (e.newValue) {
          // Admin logged in
          checkAdminSession();
        } else {
          // Admin logged out
          setUser(null);
          setProfile(null);
        }
      }
    };

    window.addEventListener('storage', handleStorageChange);

    // Listen to auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        // Don't override admin session with Supabase auth changes
        if (localStorage.getItem('admin_session')) {
          return;
        }
        
        setLoading(true);
        
        try {
          const currentUser = session?.user ?? null;
          setUser(currentUser);

          if (event === 'SIGNED_IN' && currentUser?.id) {
            // User signed in - fetch their profile
            await fetchProfile(currentUser.id);
          } else if (event === 'SIGNED_OUT') {
            // User signed out - clear profile
            setProfile(null);
          } else if (event === 'TOKEN_REFRESHED' && currentUser?.id) {
            // Token refreshed - always refetch profile to ensure it's current
            await fetchProfile(currentUser.id);
          }
        } catch (error) {
          console.error('Error handling auth state change:', error);
          setProfile(null);
        } finally {
          setLoading(false);
        }
      }
    );

    return () => {
      subscription.unsubscribe();
      window.removeEventListener('storage', handleStorageChange);
    };
  }, []); // Remove profile dependency to prevent infinite loops

  const value: AuthState = {
    user,
    profile,
    loading,
    authReady,
    refreshProfile,
    logout,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth(): AuthState {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

// Utility hooks for common use cases
export function useUser(): User | null {
  const { user } = useAuth();
  return user;
}

export function useProfile(): Profile | null {
  const { profile } = useAuth();
  return profile;
}

export function useAuthLoading(): boolean {
  const { loading } = useAuth();
  return loading;
}

// Type guards for better TypeScript support
export function isAuthenticated(user: User | null): user is User {
  return user !== null;
}

export function hasProfile(profile: Profile | null): profile is Profile {
  return profile !== null;
}
