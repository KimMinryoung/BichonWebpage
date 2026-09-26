-- 188: a French Revolution shelf on the people page.
--
-- The people of 1789–1830 had no era of their own. Robespierre and Danton sat
-- in 비소련 혁명가 (1871–2016) beside Luxemburg, Valmy's Kellermann and
-- Fleurus's Jourdan in 구체제와 그 도전자들 (1905–1917), Dumouriez and
-- Pichegru among the statesmen who dealt with the USSR, and Napoleon among the
-- anti-communist counter-revolutionaries. Their life years alone rule every
-- one of those groups out; the classifier now checks that first (leninbot
-- commulingo/classify.py GROUP_ERAS) and chooses only among the eras the
-- years allow.
--
-- Assignment rule, mirroring the China shelf: the group is the era of the
-- defining role. 구체제와 대혁명 runs from Louis XVI's accession through the
-- Directory, the Vendée, the émigrés and the coalition commanders of the
-- revolutionary wars (Howe) included; generals whose career was made in the
-- republican armies (Desaix, Moreau) stay here even when they fought on under
-- the Consulate. 통령정부·제정과 복고 왕정 runs from 18 Brumaire to the July
-- Revolution. Utopian socialists of the 1830s–1840s (Cabet, Owen) and
-- Blanqui keep the world shelf; Suvorov stays with the Russian old regime.

BEGIN;
SET LOCAL lock_timeout = '5s';

INSERT INTO commulingo_people_groups
    (id, shelf, sort_order, range_label, title_ko, title_en, blurb_ko, blurb_en)
VALUES
    ('france-revolution', 'france', 300, '1774–1799',
     '구체제와 대혁명', 'The old regime and the Revolution',
     '루이 16세의 왕정에서 1789년 삼부회, 공포정치와 테르미도르를 거쳐 총재정부까지 — 혁명을 일으키고 이끈 사람들과 그에 맞선 국왕·망명귀족·방데 봉기, 대불동맹의 지휘관들.',
     'From Louis XVI''s monarchy through the Estates-General of 1789, the Terror and Thermidor to the Directory — those who made and led the Revolution, and the king, émigrés, Vendée rebels and coalition commanders who fought it.'),
    ('france-napoleon', 'france', 301, '1799–1830',
     '통령정부·제정과 복고 왕정', 'The Consulate, the Empire and the Restoration',
     '브뤼메르 18일 쿠데타에서 나폴레옹 제정, 부르봉 복고를 거쳐 1830년 7월 혁명까지 — 혁명을 끝내고 유럽을 전쟁으로 몰아넣은 사람들과 그에 맞선 이들.',
     'From the Coup of 18 Brumaire through Napoleon''s Empire and the Bourbon Restoration to the July Revolution of 1830 — those who ended the Revolution and took Europe to war, and those who fought them.')
ON CONFLICT (id) DO UPDATE SET
    shelf = EXCLUDED.shelf,
    sort_order = EXCLUDED.sort_order,
    range_label = EXCLUDED.range_label,
    title_ko = EXCLUDED.title_ko,
    title_en = EXCLUDED.title_en,
    blurb_ko = EXCLUDED.blurb_ko,
    blurb_en = EXCLUDED.blurb_en,
    updated_at = NOW();

CREATE TEMP TABLE _france_groups (id text PRIMARY KEY, group_id text NOT NULL);
INSERT INTO _france_groups (id, group_id) VALUES
    ('louis-xvi', 'france-revolution'),
    ('louis-joseph-prince-of-conde', 'france-revolution'),
    ('emmanuel-sieyes', 'france-revolution'),
    ('jean-paul-marat', 'france-revolution'),
    ('olympe-de-gouges', 'france-revolution'),
    ('jacques-louis-david', 'france-revolution'),
    ('sylvain-marechal', 'france-revolution'),
    ('jacques-roux', 'france-revolution'),
    ('pierre-vergniaud', 'france-revolution'),
    ('lazare-carnot', 'france-revolution'),
    ('jacques-pierre-brissot', 'france-revolution'),
    ('georges-couthon', 'france-revolution'),
    ('bertrand-barere', 'france-revolution'),
    ('jacques-rene-hebert', 'france-revolution'),
    ('maximilien-robespierre', 'france-revolution'),
    ('georges-danton', 'france-revolution'),
    ('adrien-duport', 'france-revolution'),
    ('camille-desmoulins', 'france-revolution'),
    ('gracchus-babeuf', 'france-revolution'),
    ('alexandre-de-lameth', 'france-revolution'),
    ('antoine-barnave', 'france-revolution'),
    ('pierre-gaspard-chaumette', 'france-revolution'),
    ('jean-francois-varlet', 'france-revolution'),
    ('louis-antoine-de-saint-just', 'france-revolution'),
    ('charlotte-corday', 'france-revolution'),
    ('jacques-cathelineau', 'france-revolution'),
    ('francois-de-charette', 'france-revolution'),
    ('henri-de-la-rochejaquelein', 'france-revolution'),
    ('francois-christophe-kellermann', 'france-revolution'),
    ('charles-francois-dumouriez', 'france-revolution'),
    ('jean-charles-pichegru', 'france-revolution'),
    ('jean-baptiste-jourdan', 'france-revolution'),
    ('jean-victor-moreau', 'france-revolution'),
    ('louis-desaix', 'france-revolution'),
    ('jean-joseph-amable-humbert', 'france-revolution'),
    ('richard-howe', 'france-revolution'),
    ('napoleon-bonaparte', 'france-napoleon'),
    ('andre-massena', 'france-napoleon'),
    ('antoine-richepanse', 'france-napoleon'),
    ('horatio-nelson', 'france-napoleon'),
    ('charles-x-of-france', 'france-napoleon');

UPDATE commulingo_people p
   SET group_id = g.group_id, updated_at = NOW()
  FROM _france_groups g
 WHERE p.id = g.id AND p.group_id <> g.group_id;

DROP TABLE _france_groups;

COMMIT;
