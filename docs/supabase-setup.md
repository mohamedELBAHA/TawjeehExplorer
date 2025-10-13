# Supabase Setup Guide

## 1. Create Supabase Project

1. Go to [Supabase Dashboard](https://supabase.com/dashboard)
2. Click "New Project"
3. Choose your organization and fill in project details
4. Wait for the project to be created (1-2 minutes)

## 2. Get Your Credentials

1. In your Supabase project dashboard, go to **Settings** → **API**
2. Copy the following:
   - **Project URL** → This is your `VITE_SUPABASE_URL`
   - **Project API Key** (anon/public) → This is your `VITE_SUPABASE_ANON_KEY`

## 3. Set Up Environment Variables

1. Copy `.env.example` to `.env`:
   ```bash
   cp .env.example .env
   ```

2. Update the values in `.env`:
   ```bash
   VITE_SUPABASE_URL=https://your-project-id.supabase.co
   VITE_SUPABASE_ANON_KEY=your-anon-key-here
   ```

## 4. Set Up Database Schema

1. In your Supabase project dashboard, go to **SQL Editor**
2. Copy the contents of `supabase-schema.sql` from this project
3. Paste it into the SQL Editor and click "Run"

This will create:
- `profiles` table with user profile information
- `preferences` table with user preferences
- Row Level Security (RLS) policies
- Automatic triggers for `updated_at` timestamps
- Automatic profile/preferences creation on user signup

## 5. Enable Authentication (Optional)

If you plan to use Supabase Auth:

1. Go to **Authentication** → **Settings**
2. Configure your authentication providers (Email, Google, GitHub, etc.)
3. Update site URL and redirect URLs as needed

## 6. Test the Connection

Start your development server:
```bash
npm run dev
```

The Supabase client should now be properly configured and ready to use!

## Database Schema Overview

### Profiles Table
- Stores user profile information (name, city, class level, subscription plan)
- Linked to auth.users with CASCADE delete

### Preferences Table  
- Stores user preferences for school matching
- Includes preferred cities, fields, housing needs, etc.
- Also linked to auth.users with CASCADE delete

### Security
- Row Level Security (RLS) enabled on both tables
- Users can only access their own data
- Automatic profile creation on user signup
