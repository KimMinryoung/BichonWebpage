-- A person reviewed and found to hold no political position (an apolitical
-- scientist, a career officer) is recorded on the person row, so a later
-- review can tell "checked, none" from "not yet classified". The card shows
-- nothing for either. Joining a position collection clears the mark.
BEGIN;

ALTER TABLE commulingo_people
    ADD COLUMN IF NOT EXISTS no_political_position BOOLEAN NOT NULL DEFAULT FALSE;

COMMENT ON COLUMN commulingo_people.no_political_position IS
    'Reviewed: no political position (no commulingo_person_collection_members row by design). Cleared when a membership is added.';

CREATE OR REPLACE FUNCTION commulingo_clear_no_political_position() RETURNS trigger AS $$
BEGIN
    UPDATE commulingo_people SET no_political_position = FALSE
     WHERE id = NEW.person_id AND no_political_position;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS commulingo_person_collection_members_clear_none ON commulingo_person_collection_members;
CREATE TRIGGER commulingo_person_collection_members_clear_none
    AFTER INSERT OR UPDATE OF person_id ON commulingo_person_collection_members
    FOR EACH ROW EXECUTE FUNCTION commulingo_clear_no_political_position();

COMMIT;
