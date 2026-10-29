/*
# Add whatsapp column to artisans table

1. Modified Tables
- `artisans`
  - Added `whatsapp` (text, nullable) - رقم واتساب ديال الحرفي

2. Notes
- Non-destructive: adds a nullable column, existing rows get NULL.
- No policy changes needed (existing CRUD policies already cover all columns).
*/

ALTER TABLE artisans ADD COLUMN IF NOT EXISTS whatsapp text;
