-- 182: a Chinese-history shelf on the people page.
--
-- The dictionary's era groups narrate one country. Every Chinese Communist —
-- Chen Duxiu (d. 1942), Mao, Deng (d. 1997) — sat in 비소련 혁명가 beside
-- Luxemburg and Guevara, and Chiang Kai-shek sat among the statesmen who
-- negotiated with Moscow, so a reader could not follow the Chinese revolution
-- and the People's Republic as a sequence the way the Soviet shelf lets them
-- follow 1905–1991.
--
-- `shelf` says which boxed section of the people page a group belongs to:
-- soviet (the era sequence), china (the second era sequence added here), or
-- world (the groups outside both states, which used to be hard-coded in
-- people-view.js as STANDALONE_GROUP_IDS). Nothing in code names the Chinese
-- group ids: membership is data, and the page builds itself from these rows.
--
-- Assignment rule for the China shelf, mirroring the Soviet one (Stalin is in
-- 혁명 세대 because he made October; Molotov is in 스탈린 시대 because that is
-- where his public role peaked): people who made the revolution before 1949
-- stay in 혁명 세대 even when they ruled afterwards; people whose defining role
-- came after 1949 go to the Mao era or the reform era; the Qing officials,
-- warlords and Nationalists the party fought are 구체제·국민당·군벌, the
-- counterpart of the Soviet shelf's 구체제. Foreign advisers (Borodin, Otto
-- Braun) keep their own groups and meet the Chinese story through events.

BEGIN;
SET LOCAL lock_timeout = '5s';

ALTER TABLE commulingo_people_groups
    ADD COLUMN IF NOT EXISTS shelf TEXT NOT NULL DEFAULT 'soviet';

UPDATE commulingo_people_groups
   SET shelf = 'world', updated_at = NOW()
 WHERE id IN ('international-revolutionary', 'foreign-statesmen',
              'international-counterrevolutionary', 'scholar');

INSERT INTO commulingo_people_groups
    (id, shelf, sort_order, range_label, title_ko, title_en, blurb_ko, blurb_en)
VALUES
    ('china-old-regime', 'china', 200, '1894–1949',
     '구체제와 국민당', 'The old regime and the Nationalists',
     '청 왕조 말기의 관료와 군벌, 중화민국을 세우고 다스린 국민당의 정치가와 장군들 — 공산당이 맞서 싸운 상대.',
     'Late-Qing officials and warlords, and the Nationalist politicians and generals who founded and ruled the Republic of China — the side the Communists fought.'),
    ('china-revolution', 'china', 201, '1911–1949',
     '중국 혁명 세대', 'The Chinese revolutionary generation',
     '5·4 운동에서 중국공산당을 만들고, 대장정과 항일전쟁을 거쳐 1949년의 승리를 이끈 세대.',
     'The generation that founded the Chinese Communist Party out of May Fourth and led it through the Long March and the war with Japan to victory in 1949.'),
    ('china-mao-era', 'china', 202, '1949–1976',
     '마오 시대의 사람들', 'People of the Mao era',
     '토지개혁과 사회주의 개조, 대약진과 문화대혁명의 시대를 집행하고, 견디고, 그 안에서 스러진 사람들.',
     'They carried out, endured and fell in the age of land reform and socialist transformation, the Great Leap and the Cultural Revolution.'),
    ('china-reform', 'china', 203, '1976–현재',
     '개혁개방의 세대', 'The reform generation',
     '마오 이후의 중국을 시장으로 돌린 개혁가들과 그 궤도에 이의를 제기한 사람들, 1989년 이후의 지도부.',
     'The reformers who turned post-Mao China toward the market, those who challenged that course, and the leadership after 1989.')
ON CONFLICT (id) DO UPDATE SET
    shelf = EXCLUDED.shelf,
    sort_order = EXCLUDED.sort_order,
    range_label = EXCLUDED.range_label,
    title_ko = EXCLUDED.title_ko,
    title_en = EXCLUDED.title_en,
    blurb_ko = EXCLUDED.blurb_ko,
    blurb_en = EXCLUDED.blurb_en,
    updated_at = NOW();

-- Existing Chinese cards move to the new shelf. Scholars (Shen Zhihua, Nancy
-- Qian) stay in 이 역사를 연구한 사람들; Grace Lee Boggs is a US citizen of
-- Chinese background and stays with the international revolutionaries.
CREATE TEMP TABLE _china_groups (id text PRIMARY KEY, group_id text NOT NULL);
INSERT INTO _china_groups (id, group_id) VALUES
    ('zhang-zuolin', 'china-old-regime'),
    ('chiang-kai-shek', 'china-old-regime'),
    ('song-ziwen', 'china-old-regime'),
    ('tsiang-tingfu', 'china-old-regime'),
    ('chen-duxiu', 'china-revolution'),
    ('li-dazhao', 'china-revolution'),
    ('qu-qiubai', 'china-revolution'),
    ('wang-ming', 'china-revolution'),
    ('bo-gu-qin-bangxian', 'china-revolution'),
    ('mao-zedong', 'china-revolution'),
    ('zhu-de', 'china-revolution'),
    ('zhou-enlai', 'china-revolution'),
    ('liu-shaoqi', 'china-revolution'),
    ('peng-dehuai', 'china-mao-era'),
    ('lin-biao', 'china-mao-era'),
    ('gao-gang', 'china-mao-era'),
    ('peng-zhen', 'china-mao-era'),
    ('deng-hua', 'china-mao-era'),
    ('jiang-qing', 'china-mao-era'),
    ('zhang-chunqiao', 'china-mao-era'),
    ('deng-xiaoping', 'china-reform'),
    ('chen-yun', 'china-reform');

UPDATE commulingo_people p
   SET group_id = g.group_id, updated_at = NOW()
  FROM _china_groups g
 WHERE p.id = g.id AND p.group_id <> g.group_id;

DROP TABLE _china_groups;

-- The role medal had no slot for a commander outside the Soviet army: Zhu De
-- and Lin Biao wore 비소련 혁명가, Peng Dehuai and Deng Hua 사회주의권 지도자.
-- 군 지휘관 is generic (Giap and the Yugoslav partisan generals fit it too);
-- the Soviet marshals keep the 군사·국방 office. Keep the seed list in
-- scripts/seed-commulingo-person-roles.js in sync (the drift check reads it).
INSERT INTO commulingo_role_categories (id, sort_order, icon, label_ko, label_en)
VALUES ('military-commander', 11, 'shield', '군 지휘관', 'Military commander')
ON CONFLICT (id) DO UPDATE SET
    sort_order = EXCLUDED.sort_order,
    icon = EXCLUDED.icon,
    label_ko = EXCLUDED.label_ko,
    label_en = EXCLUDED.label_en,
    updated_at = NOW();

UPDATE commulingo_person_roles
   SET category_id = 'military-commander', office_id = NULL, updated_at = NOW()
 WHERE person_id IN ('zhu-de', 'peng-dehuai', 'lin-biao', 'deng-hua')
   AND category_id IS DISTINCT FROM 'military-commander';

COMMIT;
