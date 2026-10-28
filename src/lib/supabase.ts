import { createClient, type SupabaseClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

export const supabaseConfigurado = Boolean(
  supabaseUrl?.trim() && supabaseAnonKey?.trim(),
);

export const supabase: SupabaseClient = supabaseConfigurado
  ? createClient(supabaseUrl, supabaseAnonKey)
  : (null as unknown as SupabaseClient);
