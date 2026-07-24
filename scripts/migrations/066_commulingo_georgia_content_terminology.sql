-- Canonicalize Soviet-history Korean public content to 그루지야. Deliberately
-- exclude citizenship_label_ko (modern-state citizenship remains 조지아),
-- revision snapshots (immutable audit history), and approved suggestion logs.

UPDATE commulingo_people
SET epithet_ko = REPLACE(epithet_ko, '조지아', '그루지야'),
    bio_ko = REPLACE(bio_ko, '조지아', '그루지야'),
    moment_ko = REPLACE(moment_ko, '조지아', '그루지야'),
    updated_at = NOW()
WHERE epithet_ko LIKE '%조지아%'
   OR bio_ko LIKE '%조지아%'
   OR moment_ko LIKE '%조지아%';

UPDATE commulingo_person_career_entries
SET role_ko = REPLACE(role_ko, '조지아', '그루지야'),
    updated_at = NOW()
WHERE role_ko LIKE '%조지아%';

UPDATE commulingo_person_sections
SET heading_ko = REPLACE(heading_ko, '조지아', '그루지야'),
    body_ko = REPLACE(body_ko, '조지아', '그루지야'),
    updated_at = NOW()
WHERE heading_ko LIKE '%조지아%'
   OR body_ko LIKE '%조지아%';

UPDATE commulingo_history_event_people
SET relation_ko = REPLACE(relation_ko, '조지아', '그루지야'),
    note_ko = REPLACE(note_ko, '조지아', '그루지야')
WHERE relation_ko LIKE '%조지아%'
   OR note_ko LIKE '%조지아%';
