ALTER TABLE research_documents
    ADD COLUMN IF NOT EXISTS series_slug TEXT,
    ADD COLUMN IF NOT EXISTS series_title TEXT,
    ADD COLUMN IF NOT EXISTS series_title_en TEXT,
    ADD COLUMN IF NOT EXISTS series_order INTEGER;

DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1
          FROM pg_constraint
         WHERE conname = 'research_documents_series_order_positive'
    ) THEN
        ALTER TABLE research_documents
            ADD CONSTRAINT research_documents_series_order_positive
            CHECK (series_order IS NULL OR series_order > 0)
            NOT VALID;
    END IF;
END
$$;

CREATE INDEX IF NOT EXISTS idx_research_documents_series
    ON research_documents (series_slug, series_order, updated_at DESC)
    WHERE series_slug IS NOT NULL;
