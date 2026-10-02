-- 2026-10-02: Baltic 1940–1953 batch.
-- 1. Owner decision: the event baltic-soviet-occupation-1940-1941 (발트 3국
--    병합과 1941년 6월 추방) and the term the-annexation-of-the-baltic-states-1940
--    (발트 병합 (1940)) are one subject, paired like great-purge ↔ great-terror
--    (102). The term_events row was added through the term editorial service.
-- 2. Political-position collections for the batch's new people (scheme of
--    228/234/237). Left without one: Merkys, Krėvė-Mickevičius, Munters,
--    Welles, Lipke, Borisevičius.
BEGIN;
UPDATE commulingo_term_events SET same_subject = TRUE
 WHERE term_id = 'the-annexation-of-the-baltic-states-1940'
   AND event_id = 'baltic-soviet-occupation-1940-1941';
INSERT INTO commulingo_person_collection_members (collection_id, person_id) VALUES
    ('communist', 'johannes-vares'),
    ('communist', 'augusts-kirhensteins'),
    ('communist', 'nikolai-karotamm'),
    ('fascist', 'alfred-rosenberg'),
    ('fascist', 'hinrich-lohse'),
    ('fascist', 'walter-stahlecker'),
    ('fascist', 'karl-jager'),
    ('fascist', 'viktors-arajs'),
    ('fascist', 'hjalmar-mae'),
    ('nationalist', 'hjalmar-mae'),
    ('nationalist', 'kazys-skirpa'),
    ('nationalist', 'juri-uluots'),
    ('nationalist', 'jonas-zemaitis'),
    ('nationalist', 'adolfas-ramanauskas'),
    ('nationalist', 'juozas-luksa')
ON CONFLICT DO NOTHING;
COMMIT;
