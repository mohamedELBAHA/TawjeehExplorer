# AuthContext Documentation

## Overview

The `AuthContext` provides global authentication state management for your TawjeehExplorer application, integrating with Supabase Auth and automatically managing user profiles.

## Features

- ✅ Global authentication state with Supabase integration
- ✅ Automatic profile loading on authentication
- ✅ Robust loading states and error handling
- ✅ TypeScript support with proper null checks
- ✅ Plan and plan expiry tracking
- ✅ Utility hooks for common use cases

## Setup

### 1. Wrap your app with AuthProvider

```tsx
// src/App.tsx
import { AuthProvider } from './contexts/AuthContext';

function App() {
  return (
    <AuthProvider>
      <div className="App">
        {/* Your app components */}
      </div>
    </AuthProvider>
  );
}
```

### 2. Use authentication in components

```tsx
import { useAuth, useUser, useProfile, isAuthenticated, hasProfile } from '../contexts/AuthContext';

function MyComponent() {
  const { user, profile, loading, refreshProfile } = useAuth();

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!isAuthenticated(user)) {
    return <div>Please sign in</div>;
  }

  if (!hasProfile(profile)) {
    return <div>Profile not found</div>;
  }

  return (
    <div>
      <h1>Welcome, {profile.first_name}!</h1>
      <p>Plan: {profile.plan}</p>
      <button onClick={refreshProfile}>Refresh Profile</button>
    </div>
  );
}
```

## Available Hooks

### `useAuth()`
Main hook providing full authentication state:

```tsx
const { user, profile, loading, refreshProfile } = useAuth();
```

- `user`: Supabase User object or null
- `profile`: User profile from database or null  
- `loading`: Boolean indicating if auth state is loading
- `refreshProfile()`: Function to manually refresh user profile

### `useUser()`
Convenience hook for just the user:

```tsx
const user = useUser(); // User | null
```

### `useProfile()`
Convenience hook for just the profile:

```tsx
const profile = useProfile(); // Profile | null
```

### `useAuthLoading()`
Convenience hook for just the loading state:

```tsx
const loading = useAuthLoading(); // boolean
```

## Type Guards

### `isAuthenticated(user)`
Type guard to check if user is authenticated:

```tsx
if (isAuthenticated(user)) {
  // user is guaranteed to be User, not null
  console.log(user.id, user.email);
}
```

### `hasProfile(profile)`
Type guard to check if profile exists:

```tsx
if (hasProfile(profile)) {
  // profile is guaranteed to be Profile, not null
  console.log(profile.first_name, profile.plan);
}
```

## Profile Data Structure

The profile contains the following data:

```tsx
interface Profile {
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
```

## Authentication Flow

1. **App starts**: AuthContext initializes and checks for existing session
2. **User signs in**: `onAuthStateChange` fires with 'SIGNED_IN' event
3. **Profile loads**: Automatically fetches user profile from database
4. **State updates**: Components re-render with new auth state
5. **User signs out**: Profile is cleared, components update

## Error Handling

The AuthContext includes robust error handling:

- Network errors during profile loading are logged and profile set to null
- Invalid sessions are handled gracefully
- Authentication errors don't crash the app

## Example Component

See `src/components/AuthStatus.tsx` for a complete example of how to use the AuthContext with proper loading states, null checks, and user interface.

## Best Practices

1. **Always use type guards**: Use `isAuthenticated()` and `hasProfile()` for type safety
2. **Handle loading states**: Check `loading` before rendering content
3. **Wrap early**: Place `<AuthProvider>` as high as possible in your component tree
4. **Use specific hooks**: Use `useUser()`, `useProfile()` when you only need specific data
5. **Refresh when needed**: Call `refreshProfile()` after profile updates
