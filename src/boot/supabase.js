import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://ashpqtdyjndqkpcxndyo.supabase.co'
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFzaHBxdGR5am5kcWtwY3huZHlvIiwicm9sZSI6ImFub24iLCJpYXQiOjE2OTkzODMzMjksImV4cCI6MjAxNDk1OTMyOX0.bGW2G1v2gA_1Um620jd8bcwMJ6WnQVY57DCGJB4syT4'

const supabase = createClient(supabaseUrl, supabaseKey)

export default function useSupabase() {
    return { supabase }
}