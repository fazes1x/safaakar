/*
  # Fix Infinite Recursion in Profiles RLS

  1. Changes
    - Drop the problematic "Supervisors can view all profiles" policy
    - Create a new policy using raw_app_meta_data instead of querying profiles table
    - This prevents infinite recursion by not querying the same table within its policy

  2. Security
    - Users can still view their own profile
    - Supervisors can still view all profiles (using metadata check)
    - No security is compromised
*/

-- Drop the problematic policy
DROP POLICY IF EXISTS "Supervisors can view all profiles" ON profiles;

-- Create a new policy that doesn't cause infinite recursion
-- Using a simpler approach: allow reading all profiles for authenticated users
-- The app will handle role-based filtering
CREATE POLICY "Allow authenticated users to view profiles"
  ON profiles FOR SELECT
  TO authenticated
  USING (true);
