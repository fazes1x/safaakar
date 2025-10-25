import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export type Profile = {
  id: string;
  role: 'resident' | 'supervisor';
  address: string | null;
  full_name: string;
  preferred_language: 'en' | 'ur';
  created_at: string;
  updated_at: string;
};

export type TrashPickup = {
  id: string;
  user_id: string;
  pickup_date: string;
  status: 'collected' | 'pending';
  marked_at: string | null;
  created_at: string;
};

export type Report = {
  id: string;
  user_id: string;
  address: string;
  comment: string;
  photo_url: string | null;
  status: 'open' | 'resolved';
  created_at: string;
  resolved_at: string | null;
  resolved_by: string | null;
};
