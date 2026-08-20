import { createClient } from '@supabase/supabase-js';

let supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://placeholder.supabase.co';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'placeholder';

// Ensure the URL is valid to prevent crashes
try {
  new URL(supabaseUrl);
} catch (e) {
  console.warn('Invalid VITE_SUPABASE_URL detected. Falling back to placeholder.');
  supabaseUrl = 'https://placeholder.supabase.co';
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

