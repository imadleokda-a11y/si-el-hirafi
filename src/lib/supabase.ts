import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export type Artisan = {
  id: string;
  name: string;
  phone: string;
  whatsapp: string | null;
  service_type: string;
  city: string;
  photo_url: string | null;
  slug: string | null;
  is_featured: boolean;
  payment_status: 'pending' | 'paid';
  rating: number;
  completed_jobs: number;
  gallery_urls: string[];
  created_at: string;
};

export type ArtisanInput = {
  name: string;
  phone: string;
  whatsapp?: string | null;
  service_type: string;
  city: string;
  photo_url?: string | null;
  slug?: string | null;
  is_featured?: boolean;
  payment_status?: 'pending' | 'paid';
  rating?: number;
  completed_jobs?: number;
  gallery_urls?: string[];
};
