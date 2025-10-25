import { createClient } from '@supabase/supabase-js';

const supabaseUrl = https://mjrvubcvfsegixjvnrnx.supabase.co;
const supabaseAnonKey = eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1qcnZ1YmN2ZnNlZ2l4anZucm54Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjEzMTAwMzMsImV4cCI6MjA3Njg4NjAzM30.CEpwXJNK6Fsd7WUIgtlZKN_uYk1C9TeCqZK8s7F_jVc;

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
