-- 219: fill the 반체제 인사 collection and state where the two counterrevolution
-- collections divide.
--
-- 반체제 인사 had 3 members (Fang Lizhi, Wei Jingsheng, Horáková) while
-- Sakharov, Solzhenitsyn, Havel, Kuroń and Michnik sat outside it: the role
-- category it was copied from (migration 213) had filed them by function. The
-- collection's own test is two conditions — open criticism made inside a
-- socialist state, and persecution for it. 38 people meet both on a cited
-- source; the review, the sources and the near-misses (intra-party purges,
-- reform leaders, critics abroad, Stalin-era victims without open dissent)
-- are in scripts/content/person-collection-dissident-20260930.json.
--
-- 반혁명 세력 and 제정·백색진영 share no member: the first is the world
-- outside Russia, the second the Russian Empire and the Whites. Their intros
-- now say so, so a reader looking for Kolchak in the first is sent on.

BEGIN;
SET LOCAL lock_timeout = '5s';

INSERT INTO commulingo_person_collection_members (collection_id, person_id)
VALUES
    ('dissident', 'abulfaz-elchibey'),
    ('dissident', 'adam-michnik'),
    ('dissident', 'alina-pienkowska'),
    ('dissident', 'andrei-amalrik'),
    ('dissident', 'andrei-sinyavsky'),
    ('dissident', 'andrzej-gwiazda'),
    ('dissident', 'anna-walentynowicz'),
    ('dissident', 'bogdan-borusewicz'),
    ('dissident', 'boris-pasternak'),
    ('dissident', 'etibar-mammadov'),
    ('dissident', 'frantisek-kriegel'),
    ('dissident', 'heiki-ahonen'),
    ('dissident', 'henryka-krzywonos'),
    ('dissident', 'jacek-kuron'),
    ('dissident', 'jan-ludwiczak'),
    ('dissident', 'jan-patocka'),
    ('dissident', 'jan-rulewski'),
    ('dissident', 'jiri-hajek'),
    ('dissident', 'lagle-parek'),
    ('dissident', 'laszlo-tokes'),
    ('dissident', 'lech-walesa'),
    ('dissident', 'ludvik-vaculik'),
    ('dissident', 'marian-jurczyk'),
    ('dissident', 'merab-kostava'),
    ('dissident', 'milovan-djilas'),
    ('dissident', 'nikola-petkov'),
    ('dissident', 'petro-grigorenko'),
    ('dissident', 'roman-bartoszcze'),
    ('dissident', 'roy-medvedev'),
    ('dissident', 'sakharov'),
    ('dissident', 'solzhenitsyn'),
    ('dissident', 'tadeusz-mazowiecki'),
    ('dissident', 'tiit-madisson'),
    ('dissident', 'vaclav-havel'),
    ('dissident', 'yuri-orlov'),
    ('dissident', 'zdenek-mlynar'),
    ('dissident', 'zhores-medvedev'),
    ('dissident', 'zviad-gamsakhurdia')
ON CONFLICT DO NOTHING;

UPDATE commulingo_person_collections
   SET intro_ko = '사회주의 국가 안에서 체제를 공개적으로 비판하다 박해받은 인물들입니다. 글·청원·공개서한·조직 활동으로 비판했고, 그 때문에 체포·수감·정신병원 수용·추방·해고를 겪었습니다. 당내 권력 투쟁의 숙청이나 망명 뒤 국외에서의 비판만으로는 포함하지 않습니다.',
       intro_en = 'People who openly criticised the system inside a socialist state and were persecuted for it: they criticised in writing, petitions, open letters or organizing, and were arrested, imprisoned, confined to psychiatric hospitals, expelled or dismissed for it. Purges in inner-party power struggles, and criticism made only from abroad after emigrating, are not included.',
       updated_at = NOW()
 WHERE id = 'dissident';

UPDATE commulingo_person_collections
   SET intro_ko = '프랑스 혁명에서 20세기 후반까지, 러시아 밖에서 혁명 운동이나 사회주의 국가에 무력·정치로 맞선 인물들입니다. 간섭군, 파시즘·나치 체제와 그 군 지휘관, 식민지·냉전기 반공 정권과 군이 포함됩니다. 러시아 제국과 백색진영은 제정·백색진영 모음에 있습니다.',
       intro_en = 'From the French Revolution to the late twentieth century, people outside Russia who opposed revolutionary movements or socialist states by force or politics: interventionists, the fascist and Nazi regimes and their commanders, and colonial and Cold War anti-communist governments and armies. The Russian Empire and the Whites are in the Imperial establishment and White movement collection.',
       updated_at = NOW()
 WHERE id = 'counterrevolution';

UPDATE commulingo_person_collections
   SET intro_ko = '러시아 제국을 떠받친 황실·관료·장군, 1917년의 자유주의 정치가, 그리고 내전기에 볼셰비키와 싸운 백색운동과 망명 세력입니다. 러시아 밖의 반혁명은 반혁명 세력 모음에 있습니다. 각 인물의 실제 활동과 소속은 인물 카드에 따로 있습니다.',
       intro_en = 'The dynasty, officials and generals who upheld the Russian Empire, the liberal politicians of 1917, and the White movement and emigration that fought the Bolsheviks. Counter-revolution outside Russia is in the Counter-revolutionary forces collection. Each person''s actual activities and affiliations are on their card.',
       updated_at = NOW()
 WHERE id = 'imperial-white';

COMMIT;
