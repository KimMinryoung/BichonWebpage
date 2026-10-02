-- 2026-10-02: József Mindszenty got a person card (hungary-interwar-20261001
-- batch, people-1944-c.js; 172 had left him body-only). Link him to the
-- hungary-1945-1949 document, whose body tells his resistance to the school
-- nationalisation, arrest, trial and release, and add his position collections
-- (conservative; monarchist per en.wikipedia "remained a monarchist").
BEGIN;
INSERT INTO commulingo_history_event_people
  (event_id, person_id, sort_order, relation_kind, relation_ko, relation_en, note_ko, note_en) VALUES
  ('hungary-1945-1949', 'jozsef-mindszenty', 15, 'target',
   '에스테르곰 대주교·추기경, 1949년 재판의 피고', 'Archbishop of Esztergom and cardinal, defendant in 1949',
   '1948년 6월 교회 학교 국유화를 거부하고 교사들에게 협조하지 말라고 요구했으며, 12월 26일 체포되어 1949년 2월 재판에서 반역과 외환 범죄로 종신형을 받았고 1956년 혁명 중 풀려났다.',
   'He rejected the nationalisation of church schools in June 1948 and told teachers not to cooperate; arrested on 26 December, he was sentenced to life for treason and currency offences at his trial in February 1949, and was freed during the 1956 revolution.')
ON CONFLICT DO NOTHING;
INSERT INTO commulingo_person_collection_members (collection_id, person_id) VALUES
    ('conservative', 'jozsef-mindszenty'),
    ('monarchist', 'jozsef-mindszenty')
ON CONFLICT DO NOTHING;
COMMIT;
