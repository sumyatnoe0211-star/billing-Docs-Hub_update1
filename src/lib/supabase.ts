import { createClient } from '@supabase/supabase-js'

const supabaseUrl = "https://mlvuvhlbiubguuafinov.supabase.co";
const supabaseAnonKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1sdnV2aGxiaXViZ3V1YWZpbm92Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTg4ODM3MjcsImV4cCI6MjA3NDQ1OTcyN30.iagX9iyvNTtyxTEDvF9JAfqbbYuu1QHaSjNmNYL5ye0";

export const supabase = createClient(supabaseUrl, supabaseAnonKey)
