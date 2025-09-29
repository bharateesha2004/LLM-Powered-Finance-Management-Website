
-- SQL function to enable realtime for specific tables
-- This can be manually run in the Supabase SQL Editor
CREATE OR REPLACE FUNCTION enable_realtime(table_name text)
RETURNS void AS $$
BEGIN
  EXECUTE format('
    ALTER TABLE public.%I REPLICA IDENTITY FULL;
    ', table_name);
END;
$$ LANGUAGE plpgsql;
