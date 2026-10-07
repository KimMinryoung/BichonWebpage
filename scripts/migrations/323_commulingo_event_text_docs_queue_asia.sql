-- 2026-10-07 owner decision (event cards follow the published translations), Asia set.
-- ethiopian-revolution-1974-1977: Proclamation No. 31 is dated 29 April 1975 in the Negarit
--   Gazeta and takes effect from 4 March (art. 33); 10 ha is the allotment ceiling per farm
--   family (art. 4(3)); peasant associations cover at least 800 ha (art. 8); large-scale farms
--   are defined by mechanisation / modern animal husbandry (art. 2).
-- vietnam-reunification-1975-1976: the Saigon renaming was a separate resolution of the same
--   day; 호찌민 is the standard spelling (also in two other events).
-- chinese-revolution-1949: Common Program terms 소자산계급·민족자산계급.
-- soviet-japanese-border-wars: official title of the Kwantung Army document and its wording.
BEGIN;
UPDATE commulingo_history_events
   SET body_ko = replace(replace(replace(body_ko,
         '1975년 3월 4일 공포된 <농촌 토지 공유화 포고령>(제31호)', '1975년 3월 4일부터 효력을 갖도록 한 <농촌 토지 공유화 포고령>(제31호, 관보 4월 29일 자)'),
         '소작제를 폐지하고 가구당 10헥타르를 넘는 사유 경작을 금했다. 그보다 큰 상업 농장은 국가 관리로 넘겼다.',
         '소작제를 폐지하고 한 농가에 배정하는 토지를 10헥타르 이하로 묶었다. 기계화 농장과 근대적 축산 농장 같은 대규모 농장은 국가 관리로 넘겼다.'),
         '800헥타르 단위의 농민협회', '최소 800헥타르 구역의 농민협회'),
       body_en = replace(replace(replace(body_en,
         'The Proclamation to Provide for the Public Ownership of Rural Lands (No. 31), issued on 4 March 1975,', 'The Proclamation to Provide for the Public Ownership of Rural Lands (No. 31), dated 29 April 1975 in the Negarit Gazeta and effective from 4 March,'),
         'abolished tenancy, and forbade private cultivation above ten hectares per household. Larger commercial farms passed to state control.',
         'abolished tenancy, and capped the land allotted to a farm family at ten hectares. Large-scale farms, defined as mechanised farms and modern animal-husbandry enterprises, passed to state control.'),
         'associations of 800 hectares', 'associations covering at least 800 hectares'),
       updated_at = now()
 WHERE id = 'ethiopian-revolution-1974-1977' AND strpos(body_ko, '1975년 3월 4일 공포된') > 0;

UPDATE commulingo_history_events
   SET body_ko = replace(replace(body_ko,
         '하노이를 수도로 확정했으며, 사이공·자딘을 호치민시로 개칭했다. 국호와 국기의 결정이 단일한 결의로',
         '하노이를 수도로 확정했고, 같은 날 별도 결의로 사이공·자딘을 호찌민시로 개칭했다. 국호·국기·국장·수도·국가의 결정이 단일한 결의로'),
         '호치민', '호찌민'),
       body_en = replace(body_en,
         'and Hanoi as the capital, and renamed Saigon-Gia Dinh as Ho Chi Minh City. That the country''s name and its flag were settled',
         'and Hanoi as the capital, and in a separate resolution the same day renamed Saigon-Gia Dinh as Ho Chi Minh City. That the country''s name, flag, emblem, capital and anthem were settled'),
       updated_at = now()
 WHERE id = 'vietnam-reunification-1975-1976' AND strpos(body_ko, '호치민') > 0;

UPDATE commulingo_history_events SET body_ko = replace(body_ko, '호치민', '호찌민'), updated_at = now()
 WHERE id IN ('world-war-i-aftermath-1918-1923', 'sino-soviet-split') AND strpos(body_ko, '호치민') > 0;

UPDATE commulingo_history_events SET body_ko = replace(body_ko, '소자산계층과 민족자본가를 포함하는', '소자산계급과 민족자산계급을 포함하는'), updated_at = now()
 WHERE id = 'chinese-revolution-1949' AND strpos(body_ko, '소자산계층과 민족자본가') > 0;

UPDATE commulingo_history_events
   SET body_ko = replace(body_ko,
         '4월 25일 채택한 「국경방비요령」은 ''필요시 소련 영토에 들어가거나 소련군을 만주 영토 안으로 유인해 싸워도 된다''고 명시한,',
         '4월 25일 명령으로 내린 「만·소 국경분쟁 처리 요강」(흔히 「국경방비요령」)은 ''이 목적을 달성하기 위하여 일시적으로 소련 영내에 진입하거나, 소련군을 만주 영내로 끌어들여 머물게 할 수 있다''고 명시한,'),
       body_en = replace(body_en,
         'The "Border Defense Guide," drafted by Kwantung Army operations staff officer Masanobu Tsuji and adopted on 25 April, stated that "it is permissible to enter Soviet territory, or to trap or lure Soviet troops into Manchurian territory,"',
         'The Guidelines for the Settlement of Manchukuo–Soviet Border Disputes (often called the "Border Defense Guide"), drafted by Kwantung Army operations staff officer Masanobu Tsuji and issued by order on 25 April, stated that "to attain this objective it is permissible temporarily to enter Soviet territory, or to lure Soviet troops into Manchurian territory and hold them there,"'),
       updated_at = now()
 WHERE id = 'soviet-japanese-border-wars' AND strpos(body_ko, '4월 25일 채택한 「국경방비요령」') > 0;
COMMIT;
