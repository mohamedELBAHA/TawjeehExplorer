# Database Setup Guide

## 🚀 Quick Setup

Your Supabase project is configured but the database tables need to be created. Follow these steps:

### 1. Access Supabase Dashboard
- Go to: https://supabase.com/dashboard
- Select your project: `shcyriwkfjxrxicojjfg`

### 2. Apply Database Schema
1. Click on **"SQL Editor"** in the left sidebar
2. Click **"New Query"**
3. Copy the entire contents of `supabase-schema.sql` file
4. Paste it into the SQL Editor
5. Click **"Run"** to execute the schema

### 3. Verify Setup
After applying the schema, run:
```bash
node scripts/check-db.js
```

## 📊 What Gets Created

### Tables
- **`profiles`** - User profile information
- **`preferences`** - User preferences for school matching

### Security
- **Row Level Security (RLS)** enabled on both tables
- **Policies** that ensure users only see their own data
- **Automatic triggers** for timestamps and user creation

### Features
- **Auto-creation** of profile/preferences when user signs up
- **Cascade delete** when user is deleted
- **Optimized indexes** for performance

## 🔍 Verification Commands

```bash
# Check database connection
node scripts/check-db.js

# Verify schema is applied
node scripts/verify-database.js
```

## 📋 Expected Results

After successful setup, you should see:
```
✅ Profiles table accessible
✅ Preferences table accessible
✅ Database connection successful!
✅ User profile table is properly stored in the database
```

## 🛠️ Troubleshooting

If you encounter issues:
1. Check your Supabase project is active
2. Verify the SQL was executed without errors
3. Check the Supabase logs for any errors
4. Ensure RLS policies are properly applied

## 📞 Support

If you need help:
1. Check Supabase documentation
2. Review the SQL schema file
3. Check Supabase project logs
