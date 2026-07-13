-- The era-group summary blurbs were written for a small curated set and no
-- longer match the grown, diverse membership: old-regime "fell with the tsar"
-- ignores its revolutionary challengers and the many who outlived 1917
-- (Kerensky d.1970, Figner d.1942); perestroika "the man and the man" describes
-- two of 27. Rewrite them to be factually accurate while keeping the evocative
-- one-line style. stalin-era stays ("enforced, endured, survived" is accurate).

UPDATE commulingo_people_groups SET
    blurb_ko = '제정 러시아를 떠받친 이들과 그 체제에 맞서 싸운 혁명가·사상가들 — 볼셰비키 권력 이전의 세계.',
    blurb_en = 'Those who upheld imperial Russia and the revolutionaries and thinkers who fought it — the world before Bolshevik power.',
    updated_at = NOW()
WHERE id = 'old-regime';

UPDATE commulingo_people_groups SET
    blurb_ko = '10월 혁명을 만들고 초기 소비에트 국가를 세운 세대, 다수는 훗날 그 혁명의 이름으로 스러졌다.',
    blurb_en = 'The generation that made October and built the early Soviet state — many later fell in the name of that revolution.',
    updated_at = NOW()
WHERE id = 'bolshevik';

UPDATE commulingo_people_groups SET
    blurb_ko = '스탈린의 관 뚜껑을 연 해빙과 그것을 다시 덮은 정체 사이에서, 우주와 개혁과 반체제의 시대를 살아간 사람들.',
    blurb_en = 'Between the thaw that opened Stalin’s coffin and the stagnation that closed it again — the people of an age of space, reform, and dissent.',
    updated_at = NOW()
WHERE id = 'thaw';

UPDATE commulingo_people_groups SET
    blurb_ko = '소련을 개혁하려 한 사람들과 그 종말을 앞당긴 사람들, 마지막 소비에트 세대.',
    blurb_en = 'Those who tried to reform the Soviet Union and those who hastened its end — the last Soviet generation.',
    updated_at = NOW()
WHERE id = 'perestroika';

UPDATE commulingo_people_groups SET
    blurb_ko = '러시아 혁명과 영향을 주고받았지만 소련 국가기구에는 속하지 않았던, 세계 각지의 혁명가와 사상가들.',
    blurb_en = 'Revolutionaries and thinkers around the world who shaped and were shaped by the Russian Revolution without belonging to Soviet state institutions.',
    updated_at = NOW()
WHERE id = 'international-revolutionary';
