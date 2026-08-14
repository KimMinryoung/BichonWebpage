-- Two corrections to the 6 February 1934 entry (139), on the owner's reading.
--
-- 1. The title was neutral to the point of saying nothing: '1934년 2월 6일 위기'
--    names a date and a temperature. The contemporary left called that night
--    l'émeute fasciste, the fascist riot, and Dimitrov's report a year later
--    spoke of the fascist offensive; this dictionary writes from inside that
--    tradition, so the entry now carries the word. The body gains a sentence on
--    the naming itself, because the right called the same night a day of
--    patriots and the reader should know both names.
--
-- 2. Antisemitism was not a footnote to the agitation but one of its engines.
--    Stavisky was born into a Jewish family from the Russian Empire, and the
--    far-right press worked the scandal from a question of institutions into a
--    question of blood. A new body section carries that, with the line running
--    from the winter of 1934 to Xavier Vallat's appointment at Vichy in 1941.

BEGIN;

UPDATE commulingo_history_events SET
  title_ko = '1934년 2월 6일 파시스트 폭동',
  title_en = 'The Fascist Riot of 6 February 1934',
  updated_at = now()
WHERE id = 'february-1934-crisis';

UPDATE commulingo_history_events SET
  summary_ko = replace(summary_ko,
    '스타비스키 금융 사기 사건으로 의회 부패에 대한 분노가 쌓인 끝이었다.',
    '스타비스키 금융 사기 사건으로 의회 부패에 대한 분노가 쌓인 끝이었고, 극우 언론은 스타비스키가 유대인 이민자 가정 출신이라는 점을 앞세워 그 분노를 반유대 선동으로 옮겨 놓았다.'),
  summary_en = replace(summary_en,
    'The Stavisky financial scandal had spent six weeks turning ordinary distress into fury at a parliament seen as bought.',
    'The Stavisky financial scandal had spent six weeks turning ordinary distress into fury at a parliament seen as bought, and the far-right press, seizing on Stavisky''s origins in a Jewish immigrant family, worked that fury into antisemitic agitation.'),
  updated_at = now()
WHERE id = 'february-1934-crisis';

UPDATE commulingo_history_events SET
  body_ko = replace(body_ko, '## 콩코르드의 밤', $t$## 「유대인 사기꾼」: 추문이 인종 선동으로 번역되다

스타비스키는 러시아 제국의 우크라이나에서 유대인 가정에 태어나 어려서 부모를 따라 프랑스에 왔고 뒤에 귀화한 사람이었다. 극우 언론에게 이 사실은 사건의 부수적인 세부가 아니라 사건의 의미 그 자체였다. 악시옹 프랑세즈는 제호 옆에 「프랑스는 프랑스인에게」를 달고 있었고, 샤를 모라스와 레옹 도데는 이 추문을 외국인과 유대인이 프랑스의 제도를 안에서부터 좀먹는다는 오래된 이야기의 최신 증거로 삼았다. 《그랭구아르》와 《주 쉬 파르투》가 같은 곡조를 반복했으며, 「유대-프리메이슨 공화국」이라는 표현이 몇 주 사이에 우파 지면의 상투구가 되었다.

부패에 대한 분노 자체에는 근거가 있었다. 담보가 부실한 채권이 시립 기관의 이름으로 발행되었고, 열아홉 번 연기된 재판 뒤에는 정치인과 사법부의 인맥이 있었다. 극우가 한 일은 그 분노를 제도의 문제에서 혈통의 문제로 옮긴 것이었다. 문제는 부패한 의원이 아니라 「이 나라 사람이 아닌 자들」이 되었고, 해법은 감사와 재판이 아니라 의회 자체의 청산이 되었다. 2월 6일 밤 광장에 모인 대열의 상당수가 이 이야기를 안고 왔으며, 「도둑들을 몰아내라」는 구호와 반유대 구호는 그날 같은 입에서 나왔다.

이 선동은 그 밤으로 끝나지 않았다. 1936년 2월 왕당파 행동대 카믈로 뒤 루아가 레옹 블룸을 차에서 끌어내 거의 죽도록 때렸고, 그해 6월 그가 총리로 의사당에 서자 우파 의원 그자비에 발라는 이 오래된 갈로로마의 나라가 처음으로 유대인의 통치를 받게 되었다고 말했다. 발라는 1941년 비시 정권의 유대인문제총국장이 되어 유대인 등록과 재산 박탈을 집행한다. 1934년 겨울의 지면에서 자란 언어가 어디로 갔는지는 그 인사 하나로 드러난다.

## 콩코르드의 밤$t$),
  body_en = replace(body_en, '## The night on the Concorde', $t$## 'The Jewish swindler': a scandal translated into racial agitation

Stavisky was born into a Jewish family in Ukraine, then part of the Russian Empire, came to France as a child with his parents and was naturalised later. To the far-right press this was not an incidental detail of the affair but its meaning. Action Française carried 'France for the French' beside its masthead, and Charles Maurras and Léon Daudet took the scandal as the latest proof of an old story in which foreigners and Jews eat away at French institutions from within. Gringoire and Je suis partout repeated the tune, and within weeks 'the Judeo-Masonic republic' was a commonplace of the right-wing page.

The anger at corruption was not baseless. Bonds with poor security had been issued in the name of a municipal institution, and behind nineteen postponements of a trial stood connections among politicians and in the judiciary. What the far right did was to move that anger from a question of institutions to a question of blood. The problem became not corrupt deputies but 'people who are not of this country', and the remedy became not audits and trials but the liquidation of parliament itself. A good part of the columns that reached the square on 6 February carried this story with them, and 'throw out the thieves' and the antisemitic slogans came from the same mouths that night.

The agitation did not end with the night. In February 1936 the royalist Camelots du Roi dragged Léon Blum from a car and beat him nearly to death; in June, when he stood in the Chamber as prime minister, the right-wing deputy Xavier Vallat said that this old Gallo-Roman country would for the first time be governed by a Jew. In 1941 Vallat became Vichy's Commissioner-General for Jewish Affairs, administering the registration of Jews and the seizure of their property. Where the language grown on the pages of that winter went is legible in that one appointment.

## The night on the Concorde$t$),
  updated_at = now()
WHERE id = 'february-1934-crisis';

UPDATE commulingo_history_events SET
  body_ko = replace(body_ko,
    '오늘날 연구는 2월 6일을 조직된 쿠데타로 보지 않는다.',
    $t$이 밤은 이름부터 갈렸다. 좌파는 「2월 6일 파시스트 폭동」이라 불렀고 우파는 애국자들의 날이라 불렀다. 이 항목이 앞의 이름을 쓰는 것은 그 밤이 어떻게 읽혔고 무엇을 낳았는지를 기준으로 삼기 때문이다. 오늘날 연구는 2월 6일을 조직된 쿠데타로 보지 않는다.$t$),
  body_en = replace(body_en,
    'Historians no longer read 6 February as an organised coup.',
    $t$The night was named twice over. The left called it the fascist riot of 6 February; the right called it a day of patriots. This entry uses the first name because it takes as its measure how the night was read and what it produced. Historians no longer read 6 February as an organised coup.$t$),
  updated_at = now()
WHERE id = 'february-1934-crisis';

UPDATE commulingo_history_events SET
  timeline = jsonb_set(timeline, '{0,body}', $j${
    "ko": "바욘 시립 전당포를 통한 알렉상드르 스타비스키의 채권 사기가 드러나고, 급진당 정치인들과의 인맥이 함께 알려졌다. 극우 언론은 그가 유대인 이민자 가정 출신이라는 점을 앞세워 추문을 반유대 선동으로 옮겼다.",
    "en": "Alexandre Stavisky's bond fraud through the municipal pawnshop of Bayonne is exposed, along with his connections among Radical politicians. The far-right press seizes on his origins in a Jewish immigrant family and turns the scandal into antisemitic agitation."
  }$j$::jsonb),
  updated_at = now()
WHERE id = 'february-1934-crisis';

COMMIT;
