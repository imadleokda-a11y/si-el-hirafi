/*
# Create artisans table (single-tenant, no auth)

1. New Tables
- `artisans`
  - `id` (uuid, primary key)
  - `name` (text, not null) - اسم الحرفي
  - `phone` (text, not null) - رقم الهاتف
  - `service_type` (text, not null) - نوع الخدمة (بلومبي، صباغ، إلخ)
  - `city` (text, not null) - المدينة أو الحي
  - `photo_url` (text) - رابط صورة الحرفي
  - `created_at` (timestamptz)

2. Security
- Enable RLS on `artisans`.
- Grant CRUD to `anon` + `authenticated` so the Data API can reach the table.
- Allow anon + authenticated CRUD because the data is intentionally shared/public (single-tenant app, no sign-in).

3. Notes
- No user_id column — this is a single-admin directory app with no sign-in.
- Index on city and service_type for faster search filtering.
*/

CREATE TABLE IF NOT EXISTS artisans (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  phone text NOT NULL,
  service_type text NOT NULL,
  city text NOT NULL,
  photo_url text,
  created_at timestamptz DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_artisans_city ON artisans(city);
CREATE INDEX IF NOT EXISTS idx_artisans_service_type ON artisans(service_type);

ALTER TABLE artisans ENABLE ROW LEVEL SECURITY;

GRANT SELECT, INSERT, UPDATE, DELETE ON artisans TO anon, authenticated;

DROP POLICY IF EXISTS "anon_select_artisans" ON artisans;
CREATE POLICY "anon_select_artisans" ON artisans FOR SELECT
  TO anon, authenticated USING (true);

DROP POLICY IF EXISTS "anon_insert_artisans" ON artisans;
CREATE POLICY "anon_insert_artisans" ON artisans FOR INSERT
  TO anon, authenticated WITH CHECK (true);

DROP POLICY IF EXISTS "anon_update_artisans" ON artisans;
CREATE POLICY "anon_update_artisans" ON artisans FOR UPDATE
  TO anon, authenticated USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "anon_delete_artisans" ON artisans;
CREATE POLICY "anon_delete_artisans" ON artisans FOR DELETE
  TO anon, authenticated USING (true);
