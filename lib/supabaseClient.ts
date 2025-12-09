import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://mcusrqeaamauhmhiwvdm.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1jdXNycWVhYW1hdWhtaGl3dmRtIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjUyODk0NjQsImV4cCI6MjA4MDg2NTQ2NH0.z5C53TbRo_mMIz7GAuZRjyfNhHUuoj_yPwyoiL1cxFM';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);