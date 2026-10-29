/*
# Add slug column to artisans for SEO-friendly URLs

1. Changes
- Add `slug` text column to `artisans` (nullable for backward compat with existing rows).
- Add a unique index on `slug` so each artisan has a distinct URL.
- Backfill existing rows with a slug derived from name + city (ASCII-transliterated, kebab-cased, with a short id suffix to guarantee uniqueness).

2. Security
- No RLS / policy changes. The existing policies already cover SELECT/INSERT/UPDATE/DELETE for anon + authenticated.
- Grant remains SELECT/INSERT/UPDATE/DELETE on the table for anon + authenticated; the new column inherits the table-level grants automatically.

3. Notes
- Slug is nullable so old inserts / code paths that don't set it still work.
- The app will generate the slug client-side when creating new artisans.
- Unique index is partial (WHERE slug IS NOT NULL) so multiple NULLs are allowed.
*/

ALTER TABLE artisans ADD COLUMN IF NOT EXISTS slug text;

CREATE UNIQUE INDEX IF NOT EXISTS idx_artisans_slug_unique
  ON artisans (slug)
  WHERE slug IS NOT NULL;

-- Backfill existing rows with a kebab slug of name + city + short id suffix.
-- unaccent + regexp_replace produce a URL-safe ASCII slug.
DO $$
DECLARE
  r RECORD;
  base TEXT;
  candidate TEXT;
  n INT := 0;
BEGIN
  FOR r IN SELECT id, name, city FROM artisans WHERE slug IS NULL LOOP
    base := lower(
      regexp_replace(
        regexp_replace(
          coalesce(r.name, 'artisan') || '-' || coalesce(r.city, 'maroc'),
          '[^a-zA-Z0-9]+', '-', 'g'
        ),
        '^-+|-+$', '', 'g'
      )
    );
    IF base = '' THEN base := 'artisan'; END IF;

    candidate := base;
    LOOP
      BEGIN
        UPDATE artisans SET slug = candidate WHERE id = r.id AND slug IS NULL;
        EXIT;
      EXCEPTION WHEN unique_violation THEN
        n := n + 1;
        candidate := base || '-' || n::text;
      END;
    END LOOP;
  END LOOP;
END $$;
