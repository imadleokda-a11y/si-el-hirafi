/*
# Create service_leads table for free quote requests ("طلب دوفي فابور")

1. New Table
- `service_leads`
  - `id` (uuid, primary key)
  - `service_type` (text, not null) - نوع الخدمة المطلوبة
  - `city` (text, not null) - المدينة
  - `description` (text, not null) - وصف المشروع (max 1000 chars)
  - `phone` (text, not null) - رقم الهاتف بصيغة +212XXXXXXXXX
  - `created_at` (timestamptz, default now())

2. Security
- Enable RLS on `service_leads`.
- Visitors (anon) and signed-in users can only INSERT new leads. The public cannot read, update or delete leads, so phone numbers are never exposed through the public API.
- Grants: INSERT only, for anon + authenticated. No SELECT grant.

3. Notes
- CHECK constraints validate phone format and field lengths at the database level, regardless of the frontend.
- Reading leads from the admin panel will require a separate, authenticated access path.
*/

CREATE TABLE IF NOT EXISTS service_leads (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  service_type text NOT NULL CHECK (char_length(service_type) BETWEEN 1 AND 100),
  city text NOT NULL CHECK (char_length(city) BETWEEN 1 AND 100),
  description text NOT NULL CHECK (char_length(description) BETWEEN 1 AND 1000),
  phone text NOT NULL CHECK (phone ~ '^\+212[5-7][0-9]{8}$'),
  created_at timestamptz DEFAULT now()
);

ALTER TABLE service_leads ENABLE ROW LEVEL SECURITY;

GRANT INSERT ON service_leads TO anon, authenticated;

DROP POLICY IF EXISTS "anon_insert_service_leads" ON service_leads;
CREATE POLICY "anon_insert_service_leads" ON service_leads FOR INSERT
  TO anon, authenticated WITH CHECK (true);
