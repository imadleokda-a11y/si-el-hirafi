/*
# Extend artisans with rating, completed jobs, and work gallery; add photo storage

1. artisans new columns
- `rating` (smallint, 0-5, default 0) - star rating
- `completed_jobs` (integer, >= 0, default 0)
- `gallery_urls` (text[], default empty, max 4 entries) - previous work photos

2. Storage
- Public bucket `artisan-photos` for artisan profile and gallery photos (images only, max 5 MB)
- Anyone can read; uploads/updates/deletes limited to this bucket

3. Functions
- `count_service_leads()` returns the total number of quote requests (count only, no personal data)
*/

ALTER TABLE artisans
  ADD COLUMN IF NOT EXISTS rating smallint NOT NULL DEFAULT 0 CHECK (rating BETWEEN 0 AND 5),
  ADD COLUMN IF NOT EXISTS completed_jobs integer NOT NULL DEFAULT 0 CHECK (completed_jobs >= 0),
  ADD COLUMN IF NOT EXISTS gallery_urls text[] NOT NULL DEFAULT '{}' CHECK (cardinality(gallery_urls) <= 4);

INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES ('artisan-photos', 'artisan-photos', true, 5242880, ARRAY['image/jpeg', 'image/png', 'image/webp'])
ON CONFLICT (id) DO UPDATE SET public = true, file_size_limit = 5242880, allowed_mime_types = ARRAY['image/jpeg', 'image/png', 'image/webp'];

DROP POLICY IF EXISTS "public_read_artisan_photos" ON storage.objects;
CREATE POLICY "public_read_artisan_photos" ON storage.objects FOR SELECT
  TO anon, authenticated USING (bucket_id = 'artisan-photos');

DROP POLICY IF EXISTS "anon_insert_artisan_photos" ON storage.objects;
CREATE POLICY "anon_insert_artisan_photos" ON storage.objects FOR INSERT
  TO anon, authenticated WITH CHECK (bucket_id = 'artisan-photos');

DROP POLICY IF EXISTS "anon_update_artisan_photos" ON storage.objects;
CREATE POLICY "anon_update_artisan_photos" ON storage.objects FOR UPDATE
  TO anon, authenticated USING (bucket_id = 'artisan-photos') WITH CHECK (bucket_id = 'artisan-photos');

DROP POLICY IF EXISTS "anon_delete_artisan_photos" ON storage.objects;
CREATE POLICY "anon_delete_artisan_photos" ON storage.objects FOR DELETE
  TO anon, authenticated USING (bucket_id = 'artisan-photos');

CREATE OR REPLACE FUNCTION public.count_service_leads()
RETURNS bigint
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$ SELECT count(*) FROM public.service_leads $$;

REVOKE EXECUTE ON FUNCTION public.count_service_leads() FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.count_service_leads() TO anon, authenticated;
