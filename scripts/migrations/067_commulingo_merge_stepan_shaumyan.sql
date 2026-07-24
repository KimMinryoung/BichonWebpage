BEGIN;

DO $$
DECLARE
    keep_id CONSTANT text := 'stepan-shaumyan';
    duplicate_id CONSTANT text := 'stepan-shahumyan';
BEGIN
    IF NOT EXISTS (SELECT 1 FROM commulingo_people WHERE id = keep_id) THEN
        RAISE EXCEPTION 'canonical person % is missing', keep_id;
    END IF;

    -- Idempotent reruns after a successful merge only re-assert the canonical fields.
    IF NOT EXISTS (SELECT 1 FROM commulingo_people WHERE id = duplicate_id) THEN
        UPDATE commulingo_people
           SET origin_code = 'armenia',
               origin_label_ko = '아르메니아',
               origin_label_en = 'Armenia',
               updated_at = NOW()
         WHERE id = keep_id;
        RETURN;
    END IF;

    -- Preserve every distinct alias before removing the duplicate card.
    INSERT INTO commulingo_person_aliases (person_id, lang, alias, sort_order)
    SELECT keep_id, lang, alias, sort_order
      FROM commulingo_person_aliases
     WHERE person_id = duplicate_id
    ON CONFLICT (person_id, lang, alias) DO NOTHING;

    -- The career and primary-role rows are duplicates. Complementary material moves across.
    UPDATE commulingo_person_sections
       SET person_id = keep_id,
           sort_order = sort_order + 1
     WHERE person_id = duplicate_id;

    INSERT INTO commulingo_history_event_people (
        event_id, person_id, sort_order, relation_ko, relation_en,
        note_ko, note_en, relation_kind
    )
    SELECT event_id, keep_id, sort_order, relation_ko, relation_en,
           note_ko, note_en, relation_kind
      FROM commulingo_history_event_people
     WHERE person_id = duplicate_id
    ON CONFLICT (event_id, person_id) DO NOTHING;

    INSERT INTO commulingo_term_people (term_id, person_id, sort_order)
    SELECT term_id, keep_id, sort_order
      FROM commulingo_term_people
     WHERE person_id = duplicate_id
    ON CONFLICT (term_id, person_id) DO NOTHING;

    INSERT INTO commulingo_person_scenes (person_id, collection_id, episode_id, sort_order)
    SELECT keep_id, collection_id, episode_id, sort_order
      FROM commulingo_person_scenes
     WHERE person_id = duplicate_id
    ON CONFLICT DO NOTHING;

    INSERT INTO commulingo_person_patronymics (
        person_id, patronymic_ko, patronymic_en, cyrillic_patronymic, updated_at
    )
    SELECT keep_id, patronymic_ko, patronymic_en, cyrillic_patronymic, updated_at
      FROM commulingo_person_patronymics
     WHERE person_id = duplicate_id
    ON CONFLICT (person_id) DO NOTHING;

    UPDATE commulingo_office_rows SET person_id = keep_id WHERE person_id = duplicate_id;

    DELETE FROM commulingo_history_event_people WHERE person_id = duplicate_id;

    -- Keep audit history discoverable under the surviving entity.
    UPDATE commulingo_people_revisions
       SET entity_id = keep_id || substr(entity_id, length(duplicate_id) + 1)
     WHERE entity_id = duplicate_id OR entity_id LIKE duplicate_id || '/%';

    UPDATE commulingo_agent_suggestions
       SET target_id = keep_id || substr(target_id, length(duplicate_id) + 1)
     WHERE target_id = duplicate_id OR target_id LIKE duplicate_id || '/%';

    UPDATE commulingo_people
       SET origin_code = 'armenia',
           origin_label_ko = '아르메니아',
           origin_label_en = 'Armenia',
           updated_at = NOW()
     WHERE id = keep_id;

    -- Remaining duplicate-owned aliases, career, role, and other rows cascade away.
    DELETE FROM commulingo_people WHERE id = duplicate_id;

    IF EXISTS (SELECT 1 FROM commulingo_people WHERE id = duplicate_id) THEN
        RAISE EXCEPTION 'duplicate person % survived merge', duplicate_id;
    END IF;
END $$;

COMMIT;
