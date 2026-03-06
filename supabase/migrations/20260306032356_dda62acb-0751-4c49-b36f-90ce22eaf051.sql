-- Drop overly permissive "Service role" policies that grant everyone write access
DROP POLICY IF EXISTS "Service role can insert interviews" ON interviews;
DROP POLICY IF EXISTS "Service role can update interviews" ON interviews;
DROP POLICY IF EXISTS "Service role can insert scores" ON scores;
DROP POLICY IF EXISTS "Service role can update scores" ON scores;