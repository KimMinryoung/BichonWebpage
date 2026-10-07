-- 2026-10-07 owner decision (event cards follow the published translations): article 2 of the
-- 1977 Vietnam–Laos treaty (doc vietnam-laos-friendship-treaty-1977) is a pledge of mutual
-- support and cooperation in defence, with no automatic-intervention wording.
UPDATE commulingo_history_events
   SET body_ko = replace(body_ko,
         '''제국주의와 외국 반동 세력의 모든 책동과 파괴 행위로부터'' 독립·주권·영토 보전을 지키기 위해 방위 역량을 강화하며 서로 지원한다는 상호방위 조항이었고, 이는 라오스에 주둔한 베트남군에 법적 근거를 부여했다.',
         '두 나라가 ''방위 능력을 강화하고 독립·주권·영토 보전을 지키며 … 제국주의와 외국 반동 세력의 모든 파괴 음모와 행동에 맞서기 위하여 서로 전심으로 지지하고 원조하며 긴밀히 협력''한다는 방위 협력 조항이었다. 자동 개입을 정한 문구는 없었지만, 이 조항은 라오스에 주둔한 베트남군의 근거로 쓰였다.'),
       body_en = replace(replace(body_en,
         'Article 2: a mutual-defence clause pledging cooperation in',
         'Article 2: a defence-cooperation clause, with no automatic-intervention wording, pledging wholehearted mutual support, assistance and close cooperation in'),
         'which gave Vietnamese troops stationed in Laos a legal basis.', 'which served as the basis for Vietnamese troops stationed in Laos.'),
       updated_at = now()
 WHERE id = 'lao-republic-1975' AND strpos(body_ko, '상호방위 조항이었고') > 0;
