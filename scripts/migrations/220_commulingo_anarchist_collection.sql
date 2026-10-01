-- 220: 아나키스트 person collection.
--
-- Anarchism is a political position, not an organisation a person served, so
-- it is a curated collection (migration 213) rather than an affiliation:
-- Makhno's affiliation stays the Revolutionary Insurgent Army of Ukraine.
-- Members carried out a substantial period of their political activity as
-- self-identified anarchists or inside anarchist organisations; a later change
-- of course (Serge, Kim Won-bong) does not remove that period. Historians of
-- anarchism are not members. Sources, cited sentences and exclusions:
-- scripts/content/person-collection-anarchist-20261001.json.

BEGIN;
SET LOCAL lock_timeout = '5s';

INSERT INTO commulingo_person_collections (id, sort_order, icon, title_ko, title_en, intro_ko, intro_en)
VALUES ('anarchist', 5, 'flag', '아나키스트', 'Anarchists',
    '국가 권력 자체를 거부하고 자유로운 연합과 자주관리로 사회를 바꾸려 한 사람들입니다. 제1인터내셔널에서 마르크스와 갈라선 바쿠닌과 아나코공산주의의 크로폿킨에서, 러시아 혁명기의 페트로그라드 아나키스트와 마흐노 운동, 스페인 내전의 CNT·FAI까지 이어집니다. 한 시기 아나키스트로 활동한 뒤 다른 길로 간 사람(빅토르 세르주, 김원봉)도 그 시기를 근거로 넣었고, 아나키즘을 연구한 역사가는 넣지 않았습니다.',
    'People who rejected state power as such and sought to remake society through free association and self-management: from Bakunin, who split with Marx in the First International, and Kropotkin''s anarchist communism, through the Petrograd anarchists and the Makhno movement of the Russian Revolution, to the CNT and FAI of the Spanish Civil War. People who were anarchists for a period before taking another road (Victor Serge, Kim Won-bong) are included for that period; historians of anarchism are not.')
ON CONFLICT (id) DO UPDATE SET intro_ko = EXCLUDED.intro_ko, intro_en = EXCLUDED.intro_en, updated_at = now();

INSERT INTO commulingo_person_collection_members (collection_id, person_id)
VALUES
    ('anarchist', 'alexander-berkman'),
    ('anarchist', 'alexander-shapiro'),
    ('anarchist', 'anatoly-zheleznyakov'),
    ('anarchist', 'buenaventura-durruti'),
    ('anarchist', 'cipriano-mera'),
    ('anarchist', 'emma-goldman'),
    ('anarchist', 'federica-montseny'),
    ('anarchist', 'gustav-landauer'),
    ('anarchist', 'iosif-bleikhman'),
    ('anarchist', 'kim-won-bong'),
    ('anarchist', 'leo-tolstoy'),
    ('anarchist', 'louise-michel'),
    ('anarchist', 'mikhail-bakunin'),
    ('anarchist', 'nestor-makhno'),
    ('anarchist', 'pyotr-kropotkin'),
    ('anarchist', 'victor-serge'),
    ('anarchist', 'volin')
ON CONFLICT DO NOTHING;

COMMIT;
