-- Create ENUM type for class levels
CREATE TYPE class_level_enum AS ENUM ('5ème', '6ème', 'Bac', 'Bac+');

-- Create profiles table
CREATE TABLE profiles (
  id UUID REFERENCES auth.users ON DELETE CASCADE PRIMARY KEY,
  first_name TEXT,
  last_name TEXT,
  city TEXT,
  class_level class_level_enum,
  plan TEXT DEFAULT 'free',
  plan_expiry TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable Row Level Security on profiles
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

-- Create policies for profiles table
-- Users can view only their own profile
CREATE POLICY "Users can view own profile" ON profiles
  FOR SELECT USING (auth.uid() = id);

-- Users can insert their own profile
CREATE POLICY "Users can insert own profile" ON profiles
  FOR INSERT WITH CHECK (auth.uid() = id);

-- Users can update only their own profile
CREATE POLICY "Users can update own profile" ON profiles
  FOR UPDATE USING (auth.uid() = id);

-- Users can delete their own profile
CREATE POLICY "Users can delete own profile" ON profiles
  FOR DELETE USING (auth.uid() = id);

-- Create preferences table
CREATE TABLE preferences (
  id UUID REFERENCES auth.users ON DELETE CASCADE PRIMARY KEY,
  preferred_cities TEXT[],
  preferred_fields TEXT[],
  hobbies TEXT[],
  near_ocean BOOLEAN DEFAULT FALSE,
  needs_housing BOOLEAN DEFAULT FALSE,
  needs_scholarship BOOLEAN DEFAULT FALSE,
  additional_notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable Row Level Security on preferences
ALTER TABLE preferences ENABLE ROW LEVEL SECURITY;

-- Create policies for preferences table
-- Users can view only their own preferences
CREATE POLICY "Users can view own preferences" ON preferences
  FOR SELECT USING (auth.uid() = id);

-- Users can insert their own preferences
CREATE POLICY "Users can insert own preferences" ON preferences
  FOR INSERT WITH CHECK (auth.uid() = id);

-- Users can update only their own preferences
CREATE POLICY "Users can update own preferences" ON preferences
  FOR UPDATE USING (auth.uid() = id);

-- Users can delete their own preferences
CREATE POLICY "Users can delete own preferences" ON preferences
  FOR DELETE USING (auth.uid() = id);

-- Create function to automatically update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Create triggers to automatically update updated_at
CREATE TRIGGER update_profiles_updated_at BEFORE UPDATE
  ON profiles FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_preferences_updated_at BEFORE UPDATE
  ON preferences FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Create function to automatically create profile and preferences on user signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, first_name, last_name)
  VALUES (NEW.id, NEW.raw_user_meta_data->>'first_name', NEW.raw_user_meta_data->>'last_name');
  
  INSERT INTO public.preferences (id)
  VALUES (NEW.id);
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger to call the function on new user creation
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Optional: Add indexes for better performance
CREATE INDEX profiles_plan_idx ON profiles(plan);
CREATE INDEX profiles_class_level_idx ON profiles(class_level);
CREATE INDEX profiles_city_idx ON profiles(city);
CREATE INDEX preferences_preferred_cities_idx ON preferences USING GIN (preferred_cities);
CREATE INDEX preferences_preferred_fields_idx ON preferences USING GIN (preferred_fields);
CREATE INDEX preferences_hobbies_idx ON preferences USING GIN (hobbies);
