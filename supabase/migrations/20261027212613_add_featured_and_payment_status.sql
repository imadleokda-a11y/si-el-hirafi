/*
# Add featured & payment_status columns to artisans

1. Modified Tables
- `artisans`
  - Added `is_featured` (boolean, default false) - الحرفي مميز ولا لا
  - Added `payment_status` (text, default 'pending') - حالة الدفع: 'pending' أو 'paid'

2. Notes
- Non-destructive: adds nullable/defaulted columns, existing rows get defaults.
- No policy changes needed (existing CRUD policies already cover all columns).
*/

ALTER TABLE artisans
  ADD COLUMN IF NOT EXISTS is_featured boolean NOT NULL DEFAULT false,
  ADD COLUMN IF NOT EXISTS payment_status text NOT NULL DEFAULT 'pending';

-- Index for sorting featured artisans first
CREATE INDEX IF NOT EXISTS artisans_is_featured_idx ON artisans (is_featured DESC);
