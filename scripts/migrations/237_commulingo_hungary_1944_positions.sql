-- 2026-10-02: political-position collections for the new people of the
-- hungary-1944-1945 event (same scheme as 228/234). The rescuers (Wallenberg,
-- Lutz, Kasztner) and Miklós Béla have no fitting collection.
BEGIN;
INSERT INTO commulingo_person_collection_members (collection_id, person_id) VALUES
    ('fascist', 'edmund-veesenmayer'),
    ('fascist', 'laszlo-endre'),
    ('counterrevolution', 'laszlo-endre'),
    ('fascist', 'laszlo-baky'),
    ('counterrevolution', 'laszlo-baky'),
    ('fascist', 'andor-jaross'),
    ('nationalist', 'andor-jaross'),
    ('conservative', 'geza-lakatos'),
    ('fascist', 'karl-pfeffer-wildenbruch')
ON CONFLICT DO NOTHING;
COMMIT;
