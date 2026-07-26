-- Glossary hierarchy, and one name unified with the history dictionary.
--
-- 1. parent_id gives the glossary a single level of nesting. Until now the only
--    term-to-term structure was commulingo_term_relations, which is undirected
--    ('related terms', mirrored on both entries) and so cannot say that
--    예조프시나 is a part of 대숙청 rather than a neighbour of it.
--
--    One level only: a term that is itself a child may not be a parent. The
--    glossary is a reference list, not a taxonomy, and a two-level cap keeps the
--    entry page readable and the write path free of cycle handling. The trigger
--    below enforces it in the database, because the constraint is about the
--    shape of the graph and cannot be expressed as a CHECK.
--
-- 2. The history dictionary called 1937–38 대테러 while the glossary called the
--    same thing 대숙청, and each carried the other's name as an alternate. One
--    name now: 대숙청 / The Great Purge, on both sides. The event id stays
--    'great-terror' so /commulingo/events/great-terror keeps working, and
--    '대테러' stays an auto-link term in event-linkify's EXTRA_TERMS.

ALTER TABLE commulingo_terms
    ADD COLUMN IF NOT EXISTS parent_id TEXT
        REFERENCES commulingo_terms (id) ON DELETE SET NULL;

CREATE INDEX IF NOT EXISTS commulingo_terms_parent_idx ON commulingo_terms (parent_id);

ALTER TABLE commulingo_terms
    DROP CONSTRAINT IF EXISTS commulingo_terms_parent_not_self;
ALTER TABLE commulingo_terms
    ADD CONSTRAINT commulingo_terms_parent_not_self CHECK (parent_id IS DISTINCT FROM id);

CREATE OR REPLACE FUNCTION commulingo_terms_parent_depth_guard() RETURNS trigger AS $$
BEGIN
    IF NEW.parent_id IS NOT NULL
       AND (SELECT parent_id FROM commulingo_terms WHERE id = NEW.parent_id) IS NOT NULL THEN
        RAISE EXCEPTION 'term %: parent % is itself a child; the glossary nests one level only',
            NEW.id, NEW.parent_id;
    END IF;
    IF EXISTS (SELECT 1 FROM commulingo_terms WHERE parent_id = NEW.id)
       AND NEW.parent_id IS NOT NULL THEN
        RAISE EXCEPTION 'term %: it already has children, so it cannot become a child itself',
            NEW.id;
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS commulingo_terms_parent_depth ON commulingo_terms;
CREATE TRIGGER commulingo_terms_parent_depth
    BEFORE INSERT OR UPDATE OF parent_id ON commulingo_terms
    FOR EACH ROW EXECUTE FUNCTION commulingo_terms_parent_depth_guard();

-- ── 대테러 → 대숙청 ─────────────────────────────────────────────────────

UPDATE commulingo_history_events
   SET title_ko = '대숙청',
       title_en = 'The Great Purge',
       updated_at = NOW()
 WHERE id = 'great-terror';

-- ── 대숙청의 하위 항목 ──────────────────────────────────────────────────
-- The parts of the campaign itself: its Soviet name (예조프시나), its public
-- face (모스크바 재판), its largest operations (민족 작전), the body that
-- sentenced outside the courts (트로이카), and the article they were sentenced
-- under (58조). 굴라크 and 샤라시카 stay independent: both predate the purge
-- and outlive it, and the purge is one chapter of theirs rather than the whole.
-- Victims and factions (구볼셰비키, 좌익반대파, 우익반대파, 46인 선언) stay
-- independent too — being a target is not being a part.

UPDATE commulingo_terms SET parent_id = 'great-purge'
 WHERE id IN ('yezhovshchina', 'moscow-trials', 'national-operations-nkvd',
              'troika', 'article-58');

-- The parent must not be a child of anything (the trigger enforces this on
-- write; state it explicitly so a re-run cannot leave a half-applied shape).
UPDATE commulingo_terms SET parent_id = NULL WHERE id = 'great-purge';
