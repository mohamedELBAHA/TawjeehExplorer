# Profile Testing Guide

## 🎯 Issue: City and Class Level Not Pre-filled

The signup process should save city and class level, but they might not be pre-filled on the profile page.

## 🔍 Debugging Steps

### Step 1: Test Complete Signup Flow
1. **Log out** of any existing session
2. **Go to signup page**
3. **Fill in all fields** including:
   - First Name: `Test`
   - Last Name: `User`
   - Email: `test@example.com`
   - Password: `password123`
   - City: `Casablanca` (select from dropdown)
   - Class Level: `Bac` (select from dropdown)
4. **Click "Créer un compte"**
5. **Check browser console** for debug messages

### Step 2: Check Console Messages
Look for these debug messages:
```
AuthContext: Profile fetched: true
AuthContext: Profile data: {first_name: "Test", city: "Casablanca", class_level: "Bac", ...}
Profile page: Profile data changed: {first_name: "Test", city: "Casablanca", class_level: "Bac", ...}
```

### Step 3: Verify Profile Page
1. **Go to profile page**
2. **Click "Modifier"**
3. **Check if city and class level are pre-filled**
4. **If not pre-filled, check console for errors**

## 🐛 Common Issues

### Issue 1: Profile Not Loading
**Symptoms:** Console shows `Profile fetched: false`
**Solution:** Check if user was created in Supabase dashboard

### Issue 2: Profile Data Missing
**Symptoms:** Console shows `Profile data: null`
**Solution:** Check if profile was created with city/class_level

### Issue 3: Timing Issue
**Symptoms:** Profile loads but form isn't updated
**Solution:** The useEffect should handle this automatically

## 🔧 Quick Fixes

### Fix 1: Force Profile Refresh
Add this to Profile page to force refresh:
```javascript
useEffect(() => {
  if (user && !profile) {
    refreshProfile();
  }
}, [user, profile, refreshProfile]);
```

### Fix 2: Check Database
Run this to check what's in the database:
```bash
node scripts/check-database-contents.js
```

## 📊 Expected Results

After successful signup:
- ✅ Profile created in Supabase with city and class level
- ✅ AuthContext loads profile data
- ✅ Profile page shows pre-filled city and class level
- ✅ User can edit and save changes

## 🚀 Test Commands

```bash
# Check database contents
node scripts/check-database-contents.js

# Check database connection
npm run check-db

# Test profile functionality
npm run test-db
```

## 💡 If Still Not Working

1. **Check Supabase dashboard** - look for the user profile
2. **Check browser console** - look for error messages
3. **Try creating another user** - see if issue persists
4. **Check network tab** - see if profile API calls are working
