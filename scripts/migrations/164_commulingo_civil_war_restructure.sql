-- Civil-war overview and six detail documents; bilingual content and curated cast.
-- Reviewed against the 2026-09-05 production snapshot. Run as postgres.
-- Body hashes refuse to overwrite intervening editorial changes.
BEGIN;
LOCK TABLE commulingo_history_events, commulingo_history_event_people,
           commulingo_term_events IN SHARE ROW EXCLUSIVE MODE;
ALTER TABLE commulingo_history_events ADD COLUMN IF NOT EXISTS relations JSONB NOT NULL DEFAULT '{}'::jsonb;
DO $guard$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM commulingo_history_events WHERE id='civil-war' AND md5(body_ko) IN ('e84887c1b330347b0323a5be94052289', 'e4b64b61cbe32ed5a93f7e3acb04c00d')) THEN RAISE EXCEPTION 'Changed source: civil-war/ko'; END IF;
  IF NOT EXISTS (SELECT 1 FROM commulingo_history_events WHERE id='civil-war' AND md5(body_en) IN ('25bf287e7a65c847720a84fe99e63252', '7ee07c7701595fb100d2076c0fd6d993')) THEN RAISE EXCEPTION 'Changed source: civil-war/en'; END IF;
  IF NOT EXISTS (SELECT 1 FROM commulingo_history_events WHERE id='soviet-polish-war' AND md5(body_ko) IN ('21e41df6e75e9bb74d11e58d97ea6db1', '4da473b1ef20152913dea2581ecd9192')) THEN RAISE EXCEPTION 'Changed source: soviet-polish-war/ko'; END IF;
  IF NOT EXISTS (SELECT 1 FROM commulingo_history_events WHERE id='soviet-polish-war' AND md5(body_en) IN ('9ce4eb1b35d6676618efdae0d24c82fa', 'fe250441da96f55d5b3b7021604d5096')) THEN RAISE EXCEPTION 'Changed source: soviet-polish-war/en'; END IF;
  IF NOT EXISTS (SELECT 1 FROM commulingo_history_events WHERE id='winter-war' AND md5(body_ko) IN ('e12e7921d9f41b45a12a0fb414e32367', '6755ba12df12ecbed5652220b3253d5f')) THEN RAISE EXCEPTION 'Changed source: winter-war/ko'; END IF;
  IF NOT EXISTS (SELECT 1 FROM commulingo_history_events WHERE id='winter-war' AND md5(body_en) IN ('e3b4969e0d511610e89f985ff23f3090', 'b4f50a7c6e9624114f52dcf3cd058e1f')) THEN RAISE EXCEPTION 'Changed source: winter-war/en'; END IF;
  IF NOT EXISTS (SELECT 1 FROM commulingo_history_events WHERE id='baltic-independence' AND md5(body_ko) IN ('82d4508d60f60966cb4ebc100f1221e5', '3a21b1c17aa8f1ca12c7d7d5e6464dbf')) THEN RAISE EXCEPTION 'Changed source: baltic-independence/ko'; END IF;
  IF NOT EXISTS (SELECT 1 FROM commulingo_history_events WHERE id='baltic-independence' AND md5(body_en) IN ('e61810a696c95f8a60df050652c4db22', '47fd3dfb1ac68e8c59e47345706e235a')) THEN RAISE EXCEPTION 'Changed source: baltic-independence/en'; END IF;
  IF NOT EXISTS (SELECT 1 FROM commulingo_history_events WHERE id='ussr-formation' AND md5(body_ko) IN ('8dd6b1b1ca4b851a9715d445d3befc56', 'd9b5f2c020b69c1711681b07d6aca82b')) THEN RAISE EXCEPTION 'Changed source: ussr-formation/ko'; END IF;
  IF NOT EXISTS (SELECT 1 FROM commulingo_history_events WHERE id='ussr-formation' AND md5(body_en) IN ('da66e2c74f4e33f7d518f7461b5eee7f', '06000feb9d8b5f1140ac5048101e0145')) THEN RAISE EXCEPTION 'Changed source: ussr-formation/en'; END IF;
  IF EXISTS (SELECT 1 FROM commulingo_history_events WHERE id='brest-litovsk' AND body_ko <> '## 전쟁을 끝내겠다는 약속과 무너진 군대

1917년 10월 혁명으로 집권한 볼셰비키는 평화를 약속했지만, 독일과 오스트리아-헝가리는 혁명이 아니라 전쟁에서 얻은 지위를 기준으로 협상했다. 12월 15일 휴전에 이어 22일 브레스트-리토프스크에서 강화 협상이 시작됐다. 아돌프 이오페와 뒤이어 레프 트로츠키가 이끈 대표단은 공개 외교와 민족자결을 내걸었다. 독일군 지휘부의 막스 호프만에게 중요한 것은 동부의 점령지를 확보하고 서부전선으로 병력을 돌리는 일이었다.

협상장의 힘은 군대의 상태에서 나왔다. 러시아 병사들은 귀향하고 있었고, 소비에트 정부는 전선을 다시 유지할 수 없었다. 휴전은 시간을 주었지만 군사적 균형을 회복시키지는 못했다. 독일의 점령 아래 실시될 자결이 누구의 의사를 반영하는지도 문제였다. 점령군이 인정한 현지 대표기구와 주민 전체의 자유로운 선택은 같은 것이 아니었다.

## 당 안의 세 가지 시간표

니콜라이 부하린과 좌파 공산주의자들은 혁명전쟁이 유럽의 봉기를 자극할 것이라고 보았다. 레닌은 군대가 없는 상태의 전쟁은 소비에트 권력 자체를 없앨 것이라며 즉시 강화를 요구했다. 트로츠키는 전쟁을 중단하되 병합 조약에는 서명하지 않는 중간 노선을 시도했다. 세 입장은 모두 국제혁명을 말했지만, 그것이 오기까지 러시아가 버틸 수 있는 시간에 대한 판단은 달랐다.

1918년 2월 10일 트로츠키가 협상 중단을 선언하자 독일은 18일 공세를 재개했다. 파우스트슐라크 작전의 급속한 진격은 서명 거부만으로 전쟁을 끝낼 수 없음을 드러냈다. 레닌은 사임 가능성까지 내걸고 더 가혹해진 조건의 수용을 관철했다. 그리고리 소콜니코프가 이끈 대표단은 3월 3일 조약에 서명했고, 당대회와 소비에트 대회의 비준이 뒤따랐다. 나르바 전투를 2월 23일의 적군 승리로 설명하는 후대의 기념 서사는 이 군사적 붕괴와 구별해야 한다.

## 두 개의 브레스트 조약과 우크라이나 점령

우크라이나 중앙라다의 대표단은 소비에트 러시아 대표단과 별도로 협상했고, 2월 9일 중앙동맹국과 조약을 맺었다. 식량 공급과 군사 지원을 교환하는 합의였다. 이때 키예프에서는 라다와 볼셰비키가 권력을 다투고 있었다. 독일·오스트리아-헝가리군의 진입으로 라다가 복귀했지만, 점령군의 곡물 요구와 라다의 통치 능력은 곧 충돌했다.

4월 29일 파울로 스코로파츠키가 헤트만 정권을 세웠다. 독일군의 뒷받침 속에서 지주 소유와 행정 질서를 복구하려는 정책은 농민의 토지 점유와 부딪쳤다. 점령은 단순한 국경 변경이 아니라 누가 토지를 갖고 곡물을 가져가는가의 문제였다. 라다에서 헤트만, 디렉토리아로 이어진 정권 교체와 농민군의 대응은 [우크라이나 혁명과 전쟁](/commulingo/events/ukraine-1917-1921)에서 다룬다.

3월 3일 러시아 측 조약은 서부 영토에 대한 러시아의 권한을 포기하게 하고, 우크라이나와의 강화 및 핀란드·발트 지역에서 러시아 병력의 철수를 요구했다. 이를 오늘날의 모든 국경을 한 번에 확정한 조약으로 읽어서는 안 된다. 독일이 지배할 방식과 독립국들이 실제로 확보할 영토는 여전히 미정이었다. 좌파 에스에르는 강화에 반대해 인민위원회에서 탈퇴했고, 7월 독일 대사 미르바흐 암살은 독일과의 전쟁 재개를 노린 시도였다.

## 오버 오스트와 핀란드의 내전

독일은 전쟁 중 리투아니아와 쿠를란트 등을 오버 오스트 군정 아래 두었고, 1918년에는 영향권을 더 넓혔다. 발트 독일계 지배층의 발트 연합공국 구상과 리투아니아의 독일계 군주 초청 시도는 독일의 우산 아래 서로 다른 국가를 세우려는 계획이었다. 에스토니아와 라트비아의 독립국 건설과는 양립하기 어려웠으며, 독일이 패전하면서 실현되지 못했다.

핀란드는 이미 1917년 12월 독립을 선언했고 소비에트 정부도 이를 인정했다. 그러나 1918년 1월 말에는 적색정부와 백색정부 사이의 내전이 시작됐다. 쿨레르보 만네르와 오토 쿠시넨이 참여한 적색정부에 맞서 페르 에빈드 스빈후부드의 원로원과 만네르헤임의 백군이 싸웠다. 스빈후부드 측의 지원 요청 뒤 뤼디거 폰 데어 골츠의 독일 발트 사단은 4월 항코에 상륙하고 헬싱키를 점령했다. 핀란드 백군의 승리는 자체 군사작전과 독일의 개입이 결합한 결과였다.

적색·백색 테러에 이어 포로수용소의 굶주림과 질병이 패배한 적군과 가족들에게 막대한 피해를 남겼다. 핀란드 내전은 독일과 러시아의 대리전만으로 환원할 수 없다. 국내의 계급 갈등과 국가권력의 붕괴가 외국의 지원과 결합한 전쟁이었다. 독일의 패전은 핀란드의 친독 군주제 계획도 무너뜨렸다. 이후의 에스토니아 지원과 1920년 타르투 강화는 [발트 독립전쟁](/commulingo/events/baltic-wars-of-independence)으로 이어진다.

## 11월의 폐기, 끝나지 않은 점령의 유산

1918년 11월 11일 서부전선 정전협정은 브레스트 조약의 포기를 요구했다. 소비에트 러시아도 13일 조약을 폐기했다. 그러나 정전협정 제12조는 옛 러시아 영토의 독일군이 연합국이 적절하다고 판단할 때 철수하도록 규정했다. 독일군이 곧바로 일제히 사라진 것이 아니며, 이 잔류와 반볼셰비키 정책은 1919년 발트 자유군단 문제의 배경이 되었다.

브레스트가 남긴 것은 안정된 평화가 아니라 짧은 생존의 시간과 새로운 전쟁의 공간이었다. 독일의 후퇴 뒤에는 적군, 민족정부, 백군, 독일계 무장세력이 서로 다른 질서를 세우려 했다. 조약의 폐기는 옛 제국의 자동 복구를 뜻하지 않았다. 이 충돌의 전체 흐름은 [러시아 내전](/commulingo/events/civil-war)에서, 북서부의 전쟁과 강화는 [발트 독립전쟁](/commulingo/events/baltic-wars-of-independence)에서 이어진다.
') THEN RAISE EXCEPTION 'New event id already occupied: brest-litovsk'; END IF;
  IF EXISTS (SELECT 1 FROM commulingo_history_events WHERE id='baltic-wars-of-independence' AND body_ko <> '## 독립 선언 뒤에도 전쟁이 필요했던 이유

1918년 11월 독일이 패전했다고 발트의 국가권력이 곧바로 독립정부에 넘어간 것은 아니었다. 에스토니아와 리투아니아는 이미 2월에 독립을 선언했고 라트비아는 11월 18일 독립을 선포했지만, 각 정부는 군대와 재정, 실제 통치영역을 확보해야 했다. 후퇴하는 독일군 뒤로 적군이 들어왔고, 러시아 백군과 독일계 부대도 자신들의 전후 질서를 추구했다. [브레스트 강화와 독일 점령](/commulingo/events/brest-litovsk)이 만든 조건 속에서 독립전쟁·내전·외국의 개입은 같은 장소에서 겹쳤다.

세 나라를 하나의 전선으로 보는 것도, 각국의 고립된 영웅담으로 보는 것도 불충분하다. 에스토니아군은 라트비아 북부에서 싸웠고 폴란드군은 라트비아와 협력하면서 리투아니아와 충돌했다. 이 문서에서 핀란드는 발트 3국의 하나가 아니라 핀란드만과 동카렐리야를 통해 연결된 이웃으로 다룬다.

## 에스토니아: 나르바에서 타르투까지

1918년 11월 말 적군이 나르바를 점령하자 얀 안벨트가 이끄는 에스토니아 노동 코뮌이 수립됐다. 콘스탄틴 페츠의 임시정부는 요한 라이도네르의 지휘 아래 군대를 정비했다. 영국의 해상 지원과 핀란드 의용군의 참전이 이를 도왔고, 1919년 초 에스토니아군은 반격해 주요 영토에서 적군을 밀어냈다. 국내에서는 토지개혁과 제헌의회 선거가 신생 공화국의 지지 기반을 넓혔다. 빅토르 킹기세프의 공산주의 지하활동은 코뮌의 군사적 패배 뒤에도 계속됐지만, 이를 국가 전체의 의사와 동일시할 수는 없다.

유데니치의 북서군은 에스토니아를 기지로 페트로그라드를 공격했다. 여기에는 조건부 협력과 근본적 불신이 공존했다. 백군의 통일 러시아 구상은 에스토니아의 독립과 충돌했다. 다만 백군이 끝까지 어떤 승인도 하지 않았다는 설명은 부정확하다. 영국의 압력 아래 1919년 8월 구성된 북서정부는 에스토니아 독립을 인정했지만, 백군 전체가 이를 확실하게 보장할지는 별개의 문제였다.

10월 페트로그라드 공세가 실패하자 후퇴한 북서군은 에스토니아에서 무장해제·억류되었고, 군인과 피란민은 발진티푸스와 열악한 수용 조건에 시달렸다. 부와크-바와호비치처럼 이후 폴란드 전선으로 옮겨간 지휘관도 있었다. 얀 퇴니손 정부 아래 진행된 협상은 1920년 2월 2일 타르투 강화로 끝났다. 소비에트 러시아는 에스토니아의 독립을 인정하고 주권 주장을 포기했다. 이것은 전쟁 중 탄생한 국가가 군사적 생존을 조약으로 확인받은 과정이었다.

## 라트비아: 세 정부와 두 번의 리가 전투

카를리스 울마니스의 정부와 페테리스 스투치카의 소비에트 정부는 라트비아의 권력을 다투었다. 소비에트군이 1919년 1월 리가를 차지하자 울마니스 정부는 리예파야로 물러났다. 독일의 폰 데어 골츠가 지휘한 병력과 발트 향토방위군은 적군에 맞섰지만, 울마니스의 독립국 구상에 복무하는 단순한 지원군은 아니었다. 독일계 군인과 지주층의 이해, 라트비아인의 토지개혁 요구가 충돌했다.

4월 16일 리예파야 쿠데타 뒤 울마니스는 배 위로 피신했고, 5월 안드리에우스 니에드라가 친독 정부의 수반이 되었다. 5월 22일 독일계 부대와 동맹 부대는 리가에서 소비에트군을 몰아냈다. 스투치카 정권의 적색 테러에 이어 탈환 뒤에도 보복과 처형이 벌어졌다. 반볼셰비키 진영 안의 충돌은 6월 체시스 전투에서 드러났다. 에스토니아군과 북라트비아 부대가 독일계 세력을 격퇴했고 울마니스 정부는 리가로 돌아왔다.

전쟁은 끝나지 않았다. 철수를 거부한 독일 병력 상당수가 파벨 베르몬트-아발로프의 서러시아 의용군에 합류했다. 이 군대는 반볼셰비키를 표방하면서도 10월 리가를 공격했다. 라트비아군은 영국·프랑스 함정의 지원을 받으며 11월 11일 서안의 적을 밀어냈다. 메이에로비츠의 외교는 군사적 생존을 국제적 인정으로 연결하려는 작업이었다. 1920년 1월 폴란드와 라트비아의 합동 다우가프필스 작전이 라트갈레의 소비에트군을 밀어내는 데 기여했고, 8월 11일 러시아와의 리가 강화가 체결됐다. 이 조약은 폴란드와 소비에트 측이 맺은 1921년 리가 조약과 다르다.

## 리투아니아: 소비에트 정권의 실패와 빌뉴스 분쟁

스메토나와 볼데마라스가 참여한 리투아니아 국가 건설은 독일 철수와 적군 진입 사이에서 진행됐다. 빈차스 카프수카스와 지그마스 안가리에티스는 소비에트 정권을 추진했고, 1919년에는 리투아니아-벨로루시 소비에트 공화국인 리트벨이 만들어졌다. 그러나 독립정부의 거점은 카우나스에 남았고, 폴란드군은 4월 빌뉴스를 점령했다. 소비에트 국가 건설은 리투아니아 독립운동을 흡수하지 못했다.

1920년 7월 12일 모스크바 조약으로 소비에트 러시아는 리투아니아의 독립과 빌뉴스에 대한 권리를 인정했다. 그러나 그 조약이 폴란드를 구속하거나 현지의 군사적 충돌을 끝낸 것은 아니었다. 적군의 진격과 후퇴 속에서 빌뉴스 문제가 다시 열렸다. 10월 7일 수바우키 협정은 제한된 구역의 정전과 군사분계선을 정했으며 빌뉴스의 최종 귀속을 해결한 평화조약은 아니었다.

협정 발효를 앞둔 10월 9일 루치안 젤리고프스키가 빌뉴스를 점령했다. 피우수트스키와 협의한 행동을 항명으로 꾸민 뒤 중부 리투아니아를 세웠고, 그 영토는 1922년 폴란드에 편입됐다. 리투아니아는 이를 인정하지 않았다. 독립을 확보한 국가들끼리도 국경과 주민의 정치적 의사를 둘러싸고 전쟁을 계속할 수 있었다. 북쪽 날개가 [소비에트-폴란드 전쟁](/commulingo/events/soviet-polish-war)과 분리되지 않는 이유다.

## 영국 함대와 핀란드의 선택

월터 코원이 지휘한 영국 함대는 무기 수송, 해안 작전 지원, 소비에트 발트함대의 활동 억제에 관여했다. 1919년 8월 크론시타트 항구를 향한 어뢰정 공격은 이 개입의 대표적 작전이었다. 그러나 영국의 반볼셰비키 목표가 발트 각국과 백군의 이해를 일치시킨 것은 아니었다. 영국이 지원한 세력들 사이에서도 독립 승인과 영토를 놓고 갈등이 계속됐다.

핀란드에서는 1918년 내전의 백색 승리 뒤에도 동카렐리야 원정과 러시아와의 국경 문제가 남았다. 핀란드 의용군은 1919년 에스토니아를 지원했지만 핀란드가 유데니치와 함께 전면적으로 페트로그라드를 공격한 것은 아니었다. 1920년 10월 14일 핀란드와 소비에트 러시아는 별도의 타르투 조약을 맺었다. 핀란드는 페차모를 얻고 레폴라와 포라얘르비에서 철수하기로 했다. 에스토니아의 2월 타르투 조약과 혼동해서는 안 된다. 이 국경 질서는 훗날 [겨울전쟁](/commulingo/events/winter-war)의 배경이 되었다.

## 같은 해의 강화, 서로 다른 국경

1920년의 타르투·모스크바·리가·타르투 조약은 공통의 전쟁 피로와 각 정부의 생존 필요를 반영했다. 소비에트 러시아는 주변 전선을 줄일 필요가 있었고, 신생국들은 독립과 실제 통치영역을 보장받으려 했다. 그렇다고 모든 조약이 같은 조건이나 동일한 정치체제를 만든 것은 아니다. 특히 폴란드-리투아니아 분쟁은 대러시아 강화 뒤에도 남았다.

독립전쟁은 러시아 내전의 주변 전투이면서 동시에 각국의 국가 수립 과정이었다. 이후 1940년 병합과 1987~1991년 [발트 독립 회복](/commulingo/events/baltic-independence)을 이해하려면 이 첫 공화국들과 조약의 경험을 먼저 보아야 한다. 군사적 연결의 전체 흐름은 상위 문서인 [러시아 내전](/commulingo/events/civil-war)에서 다룬다.
') THEN RAISE EXCEPTION 'New event id already occupied: baltic-wars-of-independence'; END IF;
  IF EXISTS (SELECT 1 FROM commulingo_history_events WHERE id='ukraine-1917-1921' AND body_ko <> '## 라다: 자치에서 독립으로

1917년 2월 혁명 뒤 키예프에 세워진 중앙라다는 우크라이나의 정치적 대표권을 주장했다. 미하일로 흐루셰프스키가 의장을 맡고 볼로디미르 빈니첸코가 총서기국을 이끌었다. 처음부터 모든 러시아와의 관계를 끊으려던 정부는 아니었다. 러시아의 민주적 연방 안에서 자치를 확보하려는 기대가 있었지만, 임시정부와의 권한 다툼과 볼셰비키의 집권은 그 길을 좁혔다.

라다는 1917년 11월 우크라이나 인민공화국을 선포하고 1918년 1월에는 독립을 선언했다. 한편 하리코프에는 경쟁하는 소비에트 정부가 수립됐고 안토노프-옵세옌코와 무라비요프의 군사작전이 뒤따랐다. 1918년 2월 소비에트군이 키예프를 장악했다. 어느 정부가 우크라이나를 대표하는가의 문제는 선포문뿐 아니라 무력과 지방의 지지를 통해 결정되고 있었다.

## 독일군이 돌려준 수도, 독일군이 지탱한 헤트만

중앙라다는 2월 9일 중앙동맹국과 별도의 브레스트 조약을 맺었다. 독일·오스트리아-헝가리군이 소비에트군을 몰아내면서 키예프에 복귀했지만, 식량 공급을 요구하는 점령 당국과의 관계는 곧 악화했다. 4월 29일 파울로 스코로파츠키가 헤트만으로 집권했고 라다의 공화국은 우크라이나국으로 대체됐다. 협상과 점령의 국제적 경위는 [브레스트 강화](/commulingo/events/brest-litovsk)에서 다룬다.

헤트만 정권은 관료기구와 교육·학술기관을 세우고 외교 관계를 넓혔다. 그러나 토지 소유 질서의 복구와 곡물 반출은 농민의 토지혁명과 충돌했다. 독일군이 질서를 보장하는 동안에는 정권이 버틸 수 있었지만, 국내의 동의와 외국 군대의 보호는 같은 기반이 아니었다. 독일의 11월 패전이 그 차이를 드러냈다.

## 디렉토리아가 되찾은 키예프, 다시 잃은 키예프

1918년 11월 빈니첸코와 시몬 페틀류라 등이 디렉토리아를 구성해 헤트만에 맞섰다. 12월 스코로파츠키가 물러나고 인민공화국이 복구됐다. 하지만 반헤트만 연합은 안정된 국가군으로 통합되지 못했다. 지방의 아타만들은 토지와 식량, 자치에 대한 이해에 따라 동맹을 바꾸었다. 프랑스 등 연합국과 협력할지를 둘러싼 갈등도 지도부를 갈랐다.

1919년 1월 인민공화국과 서우크라이나 인민공화국은 통합을 선언했지만 군대와 행정은 곧바로 하나가 되지 않았다. 동쪽의 소비에트군, 서쪽의 폴란드군에 맞서는 전쟁은 서로 다른 우선순위를 낳았다. 2월 키예프가 다시 소비에트군에 넘어간 뒤 빈니첸코는 지도부를 떠났고 페틀류라의 군사·정치적 비중이 커졌다. 크리스티안 라콥스키의 소비에트 정부 역시 곡물 징발과 지방의 저항이라는 문제를 피하지 못했다.

## 흐리호리우·마흐노와 농민의 전쟁

니키포르 흐리호리우는 헤트만에 맞선 봉기에서 디렉토리아를 거쳐 적군과 결합했다. 그의 부대는 1919년 봄 남부에서 연합군을 압박했지만 5월 소비에트 권력에 반란을 일으켰다. 그 과정에서 부대들이 자행한 반유대인 포그롬은 농민 저항이라는 말만으로 가려서는 안 되는 대규모 폭력이었다. 7월 흐리호리우는 마흐노 측과의 충돌에서 살해됐다.

훌랴이폴레를 기반으로 한 네스토르 마흐노는 아나키스트 농민군을 이끌었다. 볼린과 나바트 연합 등은 그 운동의 정치적 논의를 발전시켰다. 마흐노군은 적군과 협력해 백군에 맞섰지만 중앙집권적 당국가와 강제 징발을 받아들이지 않았다. 1919년 데니킨의 후방을 공격했고 1920년 브란겔에 맞서 다시 적군과 협력했다. 크림 승리 뒤 볼셰비키는 이 동맹군을 제거하는 작전에 나섰다. 마흐노는 1921년 국외로 탈출했다.

유대인 주민은 인민공화국 계열 부대, 독립 아타만 부대, 백군을 비롯한 여러 군대의 폭력에 노출됐다. 적군 부대의 가해도 있었다. 각 진영의 규모와 지휘 책임을 같게 취급해서는 안 되지만, 중앙정부의 금지 명령이 존재했다는 사실만으로 현장의 가해와 처벌 실패가 사라지는 것도 아니다. 민간인에게 정권 교체는 거듭된 약탈·징발·학살과 피란을 뜻할 수 있었다.

## 데니킨의 점령과 국가 통합의 실패

1919년 여름 데니킨의 남러시아군이 우크라이나로 진입했다. 8월 말 인민공화국·갈리치아군과 백군이 키예프에 들어왔지만, 반볼셰비키라는 공통점은 동맹을 보장하지 않았다. 데니킨의 통일 러시아 구상은 우크라이나 국가의 독립을 거부했다. 인민공화국은 붉은 군대뿐 아니라 백군과도 싸워야 했고, 발진티푸스와 보급 붕괴는 군대를 무너뜨렸다.

백군은 도시를 점령해도 농촌의 안정적 지지를 확보하지 못했다. 토지 문제와 민족정책, 포그롬, 마흐노군의 후방 공격이 군사적 과잉 확장과 결합했다. 적군의 반격 속에서 12월 키예프는 다시 소비에트 지배로 넘어갔다. 모스크바 진격과 남부전선의 전체 작전은 [러시아 내전](/commulingo/events/civil-war)에서 연결해 읽을 수 있다.

## 폴란드 동맹과 1921년의 패배

독자적 군사 기반을 잃은 페틀류라는 1920년 4월 피우수트스키와 바르샤바 협정을 맺었다. 폴란드의 인민공화국 승인을 얻는 대신 동갈리치아와 서부 볼히니아에 대한 폴란드의 지배를 받아들인 선택은 우크라이나 진영 내부에서도 반발을 낳았다. 4월 25일 시작된 합동 공세로 5월 키예프에 들어갔지만, 소비에트군의 반격으로 6월 철수했다. 이후 바르샤바 전투와 강화 협상은 [소비에트-폴란드 전쟁](/commulingo/events/soviet-polish-war)에서 자세히 다룬다.

폴란드와 소비에트 측의 휴전 뒤 인민공화국군은 계속 싸웠으나 1920년 11월 패퇴해 폴란드에서 억류되었다. 1921년 3월 리가 조약에서 인민공화국은 협상 당사자로 인정받지 못했다. 그해 11월의 마지막 원정도 실패했다. 소비에트 우크라이나는 대부분의 중부·동부 영토를 통치했고 서부 우크라이나의 상당 부분은 폴란드에 남았다.

이 결말을 처음부터 예정된 단일 민족국가의 실패나 러시아 내전의 지방 전선 하나로만 설명할 수는 없다. 국가 독립, 토지혁명, 사회주의의 형태, 외국의 개입이 서로 충돌했다. 소비에트 우크라이나의 형식적 국가 지위와 실질적 중앙 통제라는 모순은 1922년 [소련 성립](/commulingo/events/ussr-formation)의 논쟁으로 이어졌다.
') THEN RAISE EXCEPTION 'New event id already occupied: ukraine-1917-1921'; END IF;
END $guard$;
INSERT INTO commulingo_history_events (id, sort_order, period_label, title_ko, title_en, question_ko, question_en, summary_ko, summary_en, outcome_ko, outcome_en, body_ko, body_en, timeline, locations, sources, relations, no_auto_link) VALUES (
  'brest-litovsk',
  35,
  '1917.12–1918.11',
  '브레스트 강화와 독일의 동방 점령',
  'Brest-Litovsk and Germany’s eastern occupation',
  '혁명을 살린 강화는 국경 지대에 무엇을 남겼는가?',
  'What did the peace that preserved Soviet power leave in the borderlands?',
  '브레스트 협상은 볼셰비키의 생존 전략과 독일의 전쟁 목적이 충돌한 자리였다. 우크라이나·발트·핀란드에서는 강화가 점령과 내전으로 이어졌고, 독일의 패전은 다시 권력의 공백을 열었다.',
  'At Brest, Bolshevik survival strategy collided with German war aims. In Ukraine, the Baltic region and Finland, peace intersected with occupation and civil war; German defeat reopened the struggle for power.',
  '소비에트 정부는 시간을 벌었으나 연립정부가 갈라졌고, 독일의 점령 질서는 11월에 붕괴했다. 뒤이은 국경은 새로운 전쟁과 별도의 조약으로 만들어졌다.',
  'The Soviet government bought time but lost its coalition partner. German occupation collapsed in November, leaving new wars and separate treaties to determine the borders.',
  '## 전쟁을 끝내겠다는 약속과 무너진 군대

1917년 10월 혁명으로 집권한 볼셰비키는 평화를 약속했지만, 독일과 오스트리아-헝가리는 혁명이 아니라 전쟁에서 얻은 지위를 기준으로 협상했다. 12월 15일 휴전에 이어 22일 브레스트-리토프스크에서 강화 협상이 시작됐다. 아돌프 이오페와 뒤이어 레프 트로츠키가 이끈 대표단은 공개 외교와 민족자결을 내걸었다. 독일군 지휘부의 막스 호프만에게 중요한 것은 동부의 점령지를 확보하고 서부전선으로 병력을 돌리는 일이었다.

협상장의 힘은 군대의 상태에서 나왔다. 러시아 병사들은 귀향하고 있었고, 소비에트 정부는 전선을 다시 유지할 수 없었다. 휴전은 시간을 주었지만 군사적 균형을 회복시키지는 못했다. 독일의 점령 아래 실시될 자결이 누구의 의사를 반영하는지도 문제였다. 점령군이 인정한 현지 대표기구와 주민 전체의 자유로운 선택은 같은 것이 아니었다.

## 당 안의 세 가지 시간표

니콜라이 부하린과 좌파 공산주의자들은 혁명전쟁이 유럽의 봉기를 자극할 것이라고 보았다. 레닌은 군대가 없는 상태의 전쟁은 소비에트 권력 자체를 없앨 것이라며 즉시 강화를 요구했다. 트로츠키는 전쟁을 중단하되 병합 조약에는 서명하지 않는 중간 노선을 시도했다. 세 입장은 모두 국제혁명을 말했지만, 그것이 오기까지 러시아가 버틸 수 있는 시간에 대한 판단은 달랐다.

1918년 2월 10일 트로츠키가 협상 중단을 선언하자 독일은 18일 공세를 재개했다. 파우스트슐라크 작전의 급속한 진격은 서명 거부만으로 전쟁을 끝낼 수 없음을 드러냈다. 레닌은 사임 가능성까지 내걸고 더 가혹해진 조건의 수용을 관철했다. 그리고리 소콜니코프가 이끈 대표단은 3월 3일 조약에 서명했고, 당대회와 소비에트 대회의 비준이 뒤따랐다. 나르바 전투를 2월 23일의 적군 승리로 설명하는 후대의 기념 서사는 이 군사적 붕괴와 구별해야 한다.

## 두 개의 브레스트 조약과 우크라이나 점령

우크라이나 중앙라다의 대표단은 소비에트 러시아 대표단과 별도로 협상했고, 2월 9일 중앙동맹국과 조약을 맺었다. 식량 공급과 군사 지원을 교환하는 합의였다. 이때 키예프에서는 라다와 볼셰비키가 권력을 다투고 있었다. 독일·오스트리아-헝가리군의 진입으로 라다가 복귀했지만, 점령군의 곡물 요구와 라다의 통치 능력은 곧 충돌했다.

4월 29일 파울로 스코로파츠키가 헤트만 정권을 세웠다. 독일군의 뒷받침 속에서 지주 소유와 행정 질서를 복구하려는 정책은 농민의 토지 점유와 부딪쳤다. 점령은 단순한 국경 변경이 아니라 누가 토지를 갖고 곡물을 가져가는가의 문제였다. 라다에서 헤트만, 디렉토리아로 이어진 정권 교체와 농민군의 대응은 [우크라이나 혁명과 전쟁](/commulingo/events/ukraine-1917-1921)에서 다룬다.

3월 3일 러시아 측 조약은 서부 영토에 대한 러시아의 권한을 포기하게 하고, 우크라이나와의 강화 및 핀란드·발트 지역에서 러시아 병력의 철수를 요구했다. 이를 오늘날의 모든 국경을 한 번에 확정한 조약으로 읽어서는 안 된다. 독일이 지배할 방식과 독립국들이 실제로 확보할 영토는 여전히 미정이었다. 좌파 에스에르는 강화에 반대해 인민위원회에서 탈퇴했고, 7월 독일 대사 미르바흐 암살은 독일과의 전쟁 재개를 노린 시도였다.

## 오버 오스트와 핀란드의 내전

독일은 전쟁 중 리투아니아와 쿠를란트 등을 오버 오스트 군정 아래 두었고, 1918년에는 영향권을 더 넓혔다. 발트 독일계 지배층의 발트 연합공국 구상과 리투아니아의 독일계 군주 초청 시도는 독일의 우산 아래 서로 다른 국가를 세우려는 계획이었다. 에스토니아와 라트비아의 독립국 건설과는 양립하기 어려웠으며, 독일이 패전하면서 실현되지 못했다.

핀란드는 이미 1917년 12월 독립을 선언했고 소비에트 정부도 이를 인정했다. 그러나 1918년 1월 말에는 적색정부와 백색정부 사이의 내전이 시작됐다. 쿨레르보 만네르와 오토 쿠시넨이 참여한 적색정부에 맞서 페르 에빈드 스빈후부드의 원로원과 만네르헤임의 백군이 싸웠다. 스빈후부드 측의 지원 요청 뒤 뤼디거 폰 데어 골츠의 독일 발트 사단은 4월 항코에 상륙하고 헬싱키를 점령했다. 핀란드 백군의 승리는 자체 군사작전과 독일의 개입이 결합한 결과였다.

적색·백색 테러에 이어 포로수용소의 굶주림과 질병이 패배한 적군과 가족들에게 막대한 피해를 남겼다. 핀란드 내전은 독일과 러시아의 대리전만으로 환원할 수 없다. 국내의 계급 갈등과 국가권력의 붕괴가 외국의 지원과 결합한 전쟁이었다. 독일의 패전은 핀란드의 친독 군주제 계획도 무너뜨렸다. 이후의 에스토니아 지원과 1920년 타르투 강화는 [발트 독립전쟁](/commulingo/events/baltic-wars-of-independence)으로 이어진다.

## 11월의 폐기, 끝나지 않은 점령의 유산

1918년 11월 11일 서부전선 정전협정은 브레스트 조약의 포기를 요구했다. 소비에트 러시아도 13일 조약을 폐기했다. 그러나 정전협정 제12조는 옛 러시아 영토의 독일군이 연합국이 적절하다고 판단할 때 철수하도록 규정했다. 독일군이 곧바로 일제히 사라진 것이 아니며, 이 잔류와 반볼셰비키 정책은 1919년 발트 자유군단 문제의 배경이 되었다.

브레스트가 남긴 것은 안정된 평화가 아니라 짧은 생존의 시간과 새로운 전쟁의 공간이었다. 독일의 후퇴 뒤에는 적군, 민족정부, 백군, 독일계 무장세력이 서로 다른 질서를 세우려 했다. 조약의 폐기는 옛 제국의 자동 복구를 뜻하지 않았다. 이 충돌의 전체 흐름은 [러시아 내전](/commulingo/events/civil-war)에서, 북서부의 전쟁과 강화는 [발트 독립전쟁](/commulingo/events/baltic-wars-of-independence)에서 이어진다.
',
  '## A promise of peace and an army coming apart

The Bolsheviks took power promising peace, but Germany and Austria-Hungary negotiated from their military position. An armistice on 15 December 1917 was followed by peace talks at Brest-Litovsk on 22 December. Adolph Joffe and then Leon Trotsky led a delegation advocating open diplomacy and national self-determination. For General Max Hoffmann and the German command, securing occupied territory and releasing troops for the Western Front came first.

Russian soldiers were going home; the Soviet government could not restore the front. The ceasefire bought time without restoring military balance. Nor did recognition of selected local councils under German occupation amount to a free choice by all inhabitants. The disagreement over self-determination concerned who could speak for the population and under what conditions.

## Three timetables inside the party

Nikolai Bukharin and the Left Communists hoped revolutionary war would ignite revolt in Europe. Lenin argued that fighting without an army would destroy Soviet power and demanded immediate peace. Trotsky tried a middle course: stop fighting without signing an annexationist settlement. All invoked international revolution; they differed over how long Russia could survive while waiting for it.

Trotsky broke off negotiations on 10 February 1918. Germany resumed its offensive on 18 February, and the rapid advance of Operation Faustschlag exposed the failure of that strategy. Threatening resignation, Lenin secured acceptance of harsher terms. A delegation led by Grigory Sokolnikov signed on 3 March, followed by party and Soviet congress ratification. Later commemorations of a Red Army victory at Narva on 23 February should not be confused with this military collapse.

## Two Brest treaties and the occupation of Ukraine

The Ukrainian Central Rada negotiated separately and signed with the Central Powers on 9 February, exchanging food commitments for support. Bolsheviks and the Rada were then contesting Kyiv. German and Austro-Hungarian intervention restored the Rada, but occupying forces'' grain demands soon collided with its capacity to govern.

On 29 April Pavlo Skoropadskyi established the Hetmanate. Backed by Germany, efforts to restore landowners'' property and administrative order clashed with peasant land seizures. Occupation changed who controlled land and took grain, as well as the political map. The sequence from the Rada through the Hetmanate to the Directory, and the response of peasant armies, continues in [Ukraine''s revolution and wars](/commulingo/events/ukraine-1917-1921).

Russia''s treaty of 3 March relinquished authority over western territories and required peace with Ukraine and the withdrawal of Russian forces from Finland and the Baltic region. It did not fix every subsequent national frontier at once. Both German control and the territory emerging states would actually hold remained unsettled. The Left Socialist Revolutionaries left the Soviet government in protest; the July assassination of German ambassador Mirbach sought to restart war with Germany.

## Ober Ost and Finland''s civil war

Germany had established the Ober Ost military administration in Lithuania, Courland and adjoining occupied areas, then extended its reach in 1918. Baltic German plans for a United Baltic Duchy and Lithuania''s invitation to a German prince represented different projects under German protection. They conflicted with other claims to statehood and collapsed with Germany''s defeat.

Finland had declared independence in December 1917 and obtained Soviet recognition. Nevertheless, civil war broke out in late January 1918. The Red government, including Kullervo Manner and Otto Kuusinen, faced the Senate led by Pehr Evind Svinhufvud and Mannerheim''s White army. After the White government''s appeal, Rüdiger von der Goltz''s German Baltic Sea Division landed at Hanko in April and captured Helsinki. Finnish White military operations and German intervention combined to secure victory.

Red and White terror was followed by hunger and disease in prison camps, devastating defeated Reds and their families. Domestic class conflict and the collapse of state authority made this more than a German-Russian proxy war. Germany''s defeat also ended Finland''s pro-German monarchy project. Finnish aid to Estonia and the 1920 Treaty of Tartu belong to the subsequent [Baltic wars of independence](/commulingo/events/baltic-wars-of-independence).

## November annulment and the occupation''s afterlife

The armistice of 11 November 1918 required Germany to abandon Brest-Litovsk; Soviet Russia annulled it on 13 November. Yet Article XII allowed German troops in former Russian territory to remain until the Allies considered withdrawal appropriate. They did not all disappear immediately. Continued deployment and anti-Bolshevik policy helped create the setting for the Baltic Freikorps campaigns of 1919.

Brest left a brief opportunity for Soviet survival and a new arena of war. Red armies, national governments, Whites and German formations sought incompatible settlements as occupation receded. Annulment did not automatically restore the former empire. The wider struggle continues in the [Russian Civil War](/commulingo/events/civil-war), and the northwestern wars and treaties in the [Baltic wars of independence](/commulingo/events/baltic-wars-of-independence).
',
  '[{"date": "1917.12.22", "title": {"ko": "강화 협상 개시", "en": "Peace talks open"}, "body": {"ko": "12월 15일 휴전에 이어 대표단들이 브레스트에서 협상했다.", "en": "Delegations began negotiations following the armistice of 15 December."}}, {"date": "1918.02.09", "title": {"ko": "우크라이나의 별도 강화", "en": "Ukraine signs separately"}, "body": {"ko": "중앙라다가 중앙동맹국과 조약을 맺었다.", "en": "The Central Rada concluded a treaty with the Central Powers."}}, {"date": "1918.02.18", "title": {"ko": "독일 공세 재개", "en": "Germany resumes its offensive"}, "body": {"ko": "협상 중단 뒤 파우스트슐라크 작전이 시작됐다.", "en": "Operation Faustschlag followed the breakdown of talks."}}, {"date": "1918.03.03", "title": {"ko": "러시아 측 조약 서명", "en": "Russia signs"}, "body": {"ko": "소콜니코프 대표단이 가혹해진 조건을 수용했다.", "en": "Sokolnikov’s delegation accepted the harsher terms."}}, {"date": "1918.04", "title": {"ko": "핀란드 파병과 헤트만 정권", "en": "Finland intervention and the Hetmanate"}, "body": {"ko": "독일군의 핀란드 상륙과 우크라이나의 정권 교체가 이어졌다.", "en": "German troops landed in Finland; a change of government followed in Ukraine."}}, {"date": "1918.11.11–13", "title": {"ko": "정전과 조약 폐기", "en": "Armistice and annulment"}, "body": {"ko": "독일의 패전으로 동방 점령 질서가 무너졌다.", "en": "German defeat dismantled its eastern occupation order."}}]'::jsonb,
  '[{"lat": 52.1, "lng": 23.69, "label": {"ko": "브레스트", "en": "Brest"}, "kind": "main"}, {"lat": 50.45, "lng": 30.52, "label": {"ko": "키예프", "en": "Kyiv"}, "kind": "place"}, {"lat": 59.83, "lng": 22.97, "label": {"ko": "항코", "en": "Hanko"}, "kind": "place"}, {"lat": 60.17, "lng": 24.94, "label": {"ko": "헬싱키", "en": "Helsinki"}, "kind": "place"}, {"lat": 54.69, "lng": 25.28, "label": {"ko": "빌뉴스", "en": "Vilnius"}, "kind": "place"}]'::jsonb,
  '["https://encyclopedia.1914-1918-online.net/article/brest-litovsk-treaty-of/", "https://en.wikisource.org/wiki/Peace_Treaty_of_Brest-Litovsk", "https://encyclopedia.1914-1918-online.net/article/occupation-during-and-after-the-war-russian-empire/", "https://encyclopedia.1914-1918-online.net/article/finnish-civil-war-1918/", "https://suomenpresidentit.fi/en/svinhufvud/", "https://germanhistorydocs.org/en/weimar-germany-1918-1933/conditions-of-the-armistice-with-germany-november-11-1918"]'::jsonb,
  '{"parent": "civil-war"}'::jsonb,
  '["자유로운 선택"]'::jsonb
) ON CONFLICT (id) DO NOTHING;
INSERT INTO commulingo_history_events (id, sort_order, period_label, title_ko, title_en, question_ko, question_en, summary_ko, summary_en, outcome_ko, outcome_en, body_ko, body_en, timeline, locations, sources, relations, no_auto_link) VALUES (
  'baltic-wars-of-independence',
  41,
  '1918.11–1920.10',
  '발트 독립전쟁과 국경의 강화',
  'Baltic wars of independence and border settlements',
  '독립 선언을 실제 국가로 만든 것은 무엇이었는가?',
  'What turned declarations of independence into functioning states?',
  '에스토니아·라트비아·리투아니아는 적군, 백군, 독일계 무장세력과 싸우며 국가를 세웠다. 핀란드와 영국 함대, 폴란드의 개입이 맞물렸고 1920년의 조약들도 모든 국경 분쟁을 끝내지는 못했다.',
  'Estonia, Latvia and Lithuania established states amid conflict with Reds, Whites and German formations. Finland, British warships and Poland shaped the struggle; the treaties of 1920 left some borders contested.',
  '발트 3국의 독립은 소비에트 러시아와의 조약으로 인정되었다. 핀란드도 별도로 강화했지만 빌뉴스 분쟁은 남았고, 독립의 기억과 조약은 훗날 주권 회복 주장의 근거가 되었다.',
  'Treaties secured Soviet recognition of the three Baltic states, while Finland made a separate peace. Vilnius remained disputed; independence and treaty continuity later informed claims to restored sovereignty.',
  '## 독립 선언 뒤에도 전쟁이 필요했던 이유

1918년 11월 독일이 패전했다고 발트의 국가권력이 곧바로 독립정부에 넘어간 것은 아니었다. 에스토니아와 리투아니아는 이미 2월에 독립을 선언했고 라트비아는 11월 18일 독립을 선포했지만, 각 정부는 군대와 재정, 실제 통치영역을 확보해야 했다. 후퇴하는 독일군 뒤로 적군이 들어왔고, 러시아 백군과 독일계 부대도 자신들의 전후 질서를 추구했다. [브레스트 강화와 독일 점령](/commulingo/events/brest-litovsk)이 만든 조건 속에서 독립전쟁·내전·외국의 개입은 같은 장소에서 겹쳤다.

세 나라를 하나의 전선으로 보는 것도, 각국의 고립된 영웅담으로 보는 것도 불충분하다. 에스토니아군은 라트비아 북부에서 싸웠고 폴란드군은 라트비아와 협력하면서 리투아니아와 충돌했다. 이 문서에서 핀란드는 발트 3국의 하나가 아니라 핀란드만과 동카렐리야를 통해 연결된 이웃으로 다룬다.

## 에스토니아: 나르바에서 타르투까지

1918년 11월 말 적군이 나르바를 점령하자 얀 안벨트가 이끄는 에스토니아 노동 코뮌이 수립됐다. 콘스탄틴 페츠의 임시정부는 요한 라이도네르의 지휘 아래 군대를 정비했다. 영국의 해상 지원과 핀란드 의용군의 참전이 이를 도왔고, 1919년 초 에스토니아군은 반격해 주요 영토에서 적군을 밀어냈다. 국내에서는 토지개혁과 제헌의회 선거가 신생 공화국의 지지 기반을 넓혔다. 빅토르 킹기세프의 공산주의 지하활동은 코뮌의 군사적 패배 뒤에도 계속됐지만, 이를 국가 전체의 의사와 동일시할 수는 없다.

유데니치의 북서군은 에스토니아를 기지로 페트로그라드를 공격했다. 여기에는 조건부 협력과 근본적 불신이 공존했다. 백군의 통일 러시아 구상은 에스토니아의 독립과 충돌했다. 다만 백군이 끝까지 어떤 승인도 하지 않았다는 설명은 부정확하다. 영국의 압력 아래 1919년 8월 구성된 북서정부는 에스토니아 독립을 인정했지만, 백군 전체가 이를 확실하게 보장할지는 별개의 문제였다.

10월 페트로그라드 공세가 실패하자 후퇴한 북서군은 에스토니아에서 무장해제·억류되었고, 군인과 피란민은 발진티푸스와 열악한 수용 조건에 시달렸다. 부와크-바와호비치처럼 이후 폴란드 전선으로 옮겨간 지휘관도 있었다. 얀 퇴니손 정부 아래 진행된 협상은 1920년 2월 2일 타르투 강화로 끝났다. 소비에트 러시아는 에스토니아의 독립을 인정하고 주권 주장을 포기했다. 이것은 전쟁 중 탄생한 국가가 군사적 생존을 조약으로 확인받은 과정이었다.

## 라트비아: 세 정부와 두 번의 리가 전투

카를리스 울마니스의 정부와 페테리스 스투치카의 소비에트 정부는 라트비아의 권력을 다투었다. 소비에트군이 1919년 1월 리가를 차지하자 울마니스 정부는 리예파야로 물러났다. 독일의 폰 데어 골츠가 지휘한 병력과 발트 향토방위군은 적군에 맞섰지만, 울마니스의 독립국 구상에 복무하는 단순한 지원군은 아니었다. 독일계 군인과 지주층의 이해, 라트비아인의 토지개혁 요구가 충돌했다.

4월 16일 리예파야 쿠데타 뒤 울마니스는 배 위로 피신했고, 5월 안드리에우스 니에드라가 친독 정부의 수반이 되었다. 5월 22일 독일계 부대와 동맹 부대는 리가에서 소비에트군을 몰아냈다. 스투치카 정권의 적색 테러에 이어 탈환 뒤에도 보복과 처형이 벌어졌다. 반볼셰비키 진영 안의 충돌은 6월 체시스 전투에서 드러났다. 에스토니아군과 북라트비아 부대가 독일계 세력을 격퇴했고 울마니스 정부는 리가로 돌아왔다.

전쟁은 끝나지 않았다. 철수를 거부한 독일 병력 상당수가 파벨 베르몬트-아발로프의 서러시아 의용군에 합류했다. 이 군대는 반볼셰비키를 표방하면서도 10월 리가를 공격했다. 라트비아군은 영국·프랑스 함정의 지원을 받으며 11월 11일 서안의 적을 밀어냈다. 메이에로비츠의 외교는 군사적 생존을 국제적 인정으로 연결하려는 작업이었다. 1920년 1월 폴란드와 라트비아의 합동 다우가프필스 작전이 라트갈레의 소비에트군을 밀어내는 데 기여했고, 8월 11일 러시아와의 리가 강화가 체결됐다. 이 조약은 폴란드와 소비에트 측이 맺은 1921년 리가 조약과 다르다.

## 리투아니아: 소비에트 정권의 실패와 빌뉴스 분쟁

스메토나와 볼데마라스가 참여한 리투아니아 국가 건설은 독일 철수와 적군 진입 사이에서 진행됐다. 빈차스 카프수카스와 지그마스 안가리에티스는 소비에트 정권을 추진했고, 1919년에는 리투아니아-벨로루시 소비에트 공화국인 리트벨이 만들어졌다. 그러나 독립정부의 거점은 카우나스에 남았고, 폴란드군은 4월 빌뉴스를 점령했다. 소비에트 국가 건설은 리투아니아 독립운동을 흡수하지 못했다.

1920년 7월 12일 모스크바 조약으로 소비에트 러시아는 리투아니아의 독립과 빌뉴스에 대한 권리를 인정했다. 그러나 그 조약이 폴란드를 구속하거나 현지의 군사적 충돌을 끝낸 것은 아니었다. 적군의 진격과 후퇴 속에서 빌뉴스 문제가 다시 열렸다. 10월 7일 수바우키 협정은 제한된 구역의 정전과 군사분계선을 정했으며 빌뉴스의 최종 귀속을 해결한 평화조약은 아니었다.

협정 발효를 앞둔 10월 9일 루치안 젤리고프스키가 빌뉴스를 점령했다. 피우수트스키와 협의한 행동을 항명으로 꾸민 뒤 중부 리투아니아를 세웠고, 그 영토는 1922년 폴란드에 편입됐다. 리투아니아는 이를 인정하지 않았다. 독립을 확보한 국가들끼리도 국경과 주민의 정치적 의사를 둘러싸고 전쟁을 계속할 수 있었다. 북쪽 날개가 [소비에트-폴란드 전쟁](/commulingo/events/soviet-polish-war)과 분리되지 않는 이유다.

## 영국 함대와 핀란드의 선택

월터 코원이 지휘한 영국 함대는 무기 수송, 해안 작전 지원, 소비에트 발트함대의 활동 억제에 관여했다. 1919년 8월 크론시타트 항구를 향한 어뢰정 공격은 이 개입의 대표적 작전이었다. 그러나 영국의 반볼셰비키 목표가 발트 각국과 백군의 이해를 일치시킨 것은 아니었다. 영국이 지원한 세력들 사이에서도 독립 승인과 영토를 놓고 갈등이 계속됐다.

핀란드에서는 1918년 내전의 백색 승리 뒤에도 동카렐리야 원정과 러시아와의 국경 문제가 남았다. 핀란드 의용군은 1919년 에스토니아를 지원했지만 핀란드가 유데니치와 함께 전면적으로 페트로그라드를 공격한 것은 아니었다. 1920년 10월 14일 핀란드와 소비에트 러시아는 별도의 타르투 조약을 맺었다. 핀란드는 페차모를 얻고 레폴라와 포라얘르비에서 철수하기로 했다. 에스토니아의 2월 타르투 조약과 혼동해서는 안 된다. 이 국경 질서는 훗날 [겨울전쟁](/commulingo/events/winter-war)의 배경이 되었다.

## 같은 해의 강화, 서로 다른 국경

1920년의 타르투·모스크바·리가·타르투 조약은 공통의 전쟁 피로와 각 정부의 생존 필요를 반영했다. 소비에트 러시아는 주변 전선을 줄일 필요가 있었고, 신생국들은 독립과 실제 통치영역을 보장받으려 했다. 그렇다고 모든 조약이 같은 조건이나 동일한 정치체제를 만든 것은 아니다. 특히 폴란드-리투아니아 분쟁은 대러시아 강화 뒤에도 남았다.

독립전쟁은 러시아 내전의 주변 전투이면서 동시에 각국의 국가 수립 과정이었다. 이후 1940년 병합과 1987~1991년 [발트 독립 회복](/commulingo/events/baltic-independence)을 이해하려면 이 첫 공화국들과 조약의 경험을 먼저 보아야 한다. 군사적 연결의 전체 흐름은 상위 문서인 [러시아 내전](/commulingo/events/civil-war)에서 다룬다.
',
  '## Why declarations did not end the fighting

Germany''s defeat in November 1918 did not automatically transfer power to independent Baltic governments. Estonia and Lithuania had declared independence in February; Latvia did so on 18 November. Each still needed an army, revenue and territory it could govern. Red forces followed retreating Germans, while Russian Whites and German formations pursued their own settlements. Independence struggles, civil wars and intervention overlapped in the space left by [Brest and German occupation](/commulingo/events/brest-litovsk).

These were neither a single national front nor three isolated wars. Estonians fought in northern Latvia; Poland cooperated with Latvia while fighting Lithuania. Finland appears here as a neighbour connected through the Gulf of Finland and eastern Karelia, not as one of the three Baltic states.

## Estonia: from Narva to Tartu

After the Red capture of Narva in November 1918, Jaan Anvelt headed the Commune of the Working People of Estonia. Konstantin Päts''s provisional government built an army under Johan Laidoner, assisted by British naval support and Finnish volunteers. An early 1919 counteroffensive recovered the main Estonian territory. Land reform and constituent elections broadened the republic''s support. Viktor Kingissepp''s communist underground survived the Commune''s military defeat, but did not represent the country as a whole.

Yudenich''s Northwestern Army used Estonia as a base against Petrograd. Cooperation was conditional: White commitments to a united Russia threatened Estonian independence. It is nevertheless inaccurate to say there was never any White recognition. Under British pressure, the Northwestern Government formed in August 1919 recognized Estonia; whether the wider White movement would honour that commitment remained uncertain.

Following the failed October offensive, retreating Northwestern troops were disarmed and interned in Estonia. Soldiers and refugees suffered typhus and poor camp conditions; commanders such as Bułak-Bałachowicz later moved to the Polish front. Negotiations under Jaan Tõnisson''s government culminated in the Treaty of Tartu on 2 February 1920. Soviet Russia recognized Estonian independence and renounced sovereignty claims: military survival acquired a treaty guarantee.

## Latvia: three governments and two battles for Riga

Kārlis Ulmanis''s government confronted Pēteris Stučka''s Soviet government. Red forces captured Riga in January 1919, driving Ulmanis to Liepāja. German troops under von der Goltz and the Baltic Landeswehr fought the Reds, but were not simply auxiliaries of Latvian independence. German military and landowning interests clashed with Latvian land reform aspirations.

Following the Liepāja coup of 16 April, Ulmanis took refuge aboard ship; Andrievs Niedra headed a pro-German government in May. German-led forces captured Riga on 22 May. Soviet terror was followed by reprisals and executions after the city''s recapture. The anti-Bolshevik camp then split openly: Estonian and northern Latvian forces defeated German formations at Cēsis in June, enabling Ulmanis''s return to Riga.

Many Germans resisting withdrawal joined Pavel Bermondt-Avalov''s West Russian Volunteer Army. Despite its anti-Bolshevik banner, it attacked Riga in October. Latvian troops, supported by British and French warships, cleared the western bank on 11 November. Meierovics''s diplomacy sought to convert survival into international recognition. The joint Polish-Latvian Daugavpils operation in January 1920 helped drive Soviet forces from Latgale. Peace with Russia followed at Riga on 11 August, a different treaty from the Polish-Soviet agreement of March 1921.

## Lithuania: Soviet state-building and the Vilnius dispute

Lithuanian state-building, involving Smetona and Voldemaras, proceeded between German withdrawal and Red advance. Vincas Kapsukas and Zigmas Angarietis pursued a Soviet alternative, followed in 1919 by the Lithuanian-Belorussian Soviet republic, Litbel. The independent government retained its base in Kaunas; Polish forces took Vilnius in April. The Soviet project did not absorb the independence movement.

In the Moscow treaty of 12 July 1920, Soviet Russia recognized Lithuania''s independence and its claim to Vilnius. This did not bind Poland or end military conflict. Red advances and retreats reopened the dispute. The Suwałki Agreement of 7 October established a ceasefire and demarcation in a limited area; it was not a final settlement of sovereignty over Vilnius.

On 9 October, before the ceasefire took effect, Lucjan Żeligowski occupied Vilnius. Acting in agreement with Piłsudski but presenting the operation as a mutiny, he established Central Lithuania, incorporated into Poland in 1922. Lithuania refused recognition. Independent states could still fight each other over borders and inhabitants'' political claims. This northern flank is inseparable from the [Polish-Soviet War](/commulingo/events/soviet-polish-war).

## British warships and Finland''s choices

Walter Cowan''s British squadron supported arms deliveries and coastal operations and constrained the Soviet Baltic Fleet. Motor torpedo boats attacked Kronstadt harbour in August 1919. Anti-Bolshevik objectives did not align British clients'' interests: Baltic governments and Whites continued to disagree over independence and territory.

After the White victory in Finland''s 1918 civil war, expeditions into eastern Karelia and the Russian border remained contentious. Finnish volunteers assisted Estonia in 1919, but Finland did not join a full national assault on Petrograd with Yudenich. A separate Finnish-Russian Treaty of Tartu followed on 14 October 1920. Finland obtained Petsamo and agreed to withdraw from Repola and Porajärvi. This was not Estonia''s February treaty. The resulting border order forms part of the background to the [Winter War](/commulingo/events/winter-war).

## One year of treaties, several unsettled borders

The Tartu, Moscow, Riga and Finnish Tartu treaties of 1920 reflected war exhaustion and governments'' need to survive. Soviet Russia wanted fewer active fronts; its neighbours wanted independence and effective territory secured. The settlements were not identical, and Polish-Lithuanian conflict outlasted peace with Russia.

The independence wars were both connected to Russia''s civil war and processes of state formation in their own right. The first republics and their treaty experience later informed opposition to the 1940 annexations and the [restoration of Baltic independence](/commulingo/events/baltic-independence) in 1987–1991. Their wider military connections continue in the [Russian Civil War](/commulingo/events/civil-war).
',
  '[{"date": "1918.11", "title": {"ko": "독일 철수와 적군 진입", "en": "German withdrawal and Red advance"}, "body": {"ko": "국가 수립과 전쟁이 겹쳤다.", "en": "State formation overlapped with continuing war."}}, {"date": "1919.04.16", "title": {"ko": "리예파야 쿠데타", "en": "Liepāja coup"}, "body": {"ko": "울마니스 정부에 맞선 친독 세력이 권력을 장악했다.", "en": "Pro-German forces displaced Ulmanis’s government."}}, {"date": "1919.06", "title": {"ko": "체시스 전투", "en": "Battle of Cēsis"}, "body": {"ko": "에스토니아군과 북라트비아 부대가 독일계 세력을 격퇴했다.", "en": "Estonian and northern Latvian troops defeated German formations."}}, {"date": "1919.10–11", "title": {"ko": "북서군의 패퇴와 리가 방어", "en": "Northwestern defeat and Riga’s defence"}, "body": {"ko": "유데니치는 페트로그라드에서 패퇴했고 베르몬트군은 리가에서 격퇴됐다.", "en": "Yudenich retreated from Petrograd; Bermondt’s forces were repulsed at Riga."}}, {"date": "1920.01", "title": {"ko": "다우가프필스 작전", "en": "Daugavpils operation"}, "body": {"ko": "라트비아와 폴란드가 소비에트군에 맞서 협력했다.", "en": "Latvia and Poland cooperated against Soviet troops."}}, {"date": "1920.02.02", "title": {"ko": "에스토니아 타르투 강화", "en": "Estonian Treaty of Tartu"}, "body": {"ko": "러시아가 에스토니아 독립을 인정했다.", "en": "Russia recognized Estonian independence."}}, {"date": "1920.07.12", "title": {"ko": "리투아니아 모스크바 강화", "en": "Lithuanian Treaty of Moscow"}, "body": {"ko": "러시아가 리투아니아의 독립과 빌뉴스에 대한 권리를 인정했다.", "en": "Russia recognized Lithuania and its claim to Vilnius."}}, {"date": "1920.08.11", "title": {"ko": "라트비아 리가 강화", "en": "Latvian Treaty of Riga"}, "body": {"ko": "라트비아와 러시아의 전쟁이 조약으로 끝났다.", "en": "A treaty ended war between Latvia and Russia."}}, {"date": "1920.10.07–09", "title": {"ko": "수바우키와 빌뉴스 점령", "en": "Suwałki and the seizure of Vilnius"}, "body": {"ko": "협정 뒤 젤리고프스키군이 빌뉴스를 점령했다.", "en": "Żeligowski’s troops seized Vilnius after the agreement."}}, {"date": "1920.10.14", "title": {"ko": "핀란드 타르투 강화", "en": "Finnish Treaty of Tartu"}, "body": {"ko": "핀란드와 러시아가 별도의 국경 합의에 서명했다.", "en": "Finland and Russia signed their separate border settlement."}}]'::jsonb,
  '[{"lat": 58.38, "lng": 26.72, "label": {"ko": "타르투", "en": "Tartu"}, "kind": "main"}, {"lat": 59.38, "lng": 28.19, "label": {"ko": "나르바", "en": "Narva"}, "kind": "place"}, {"lat": 56.95, "lng": 24.11, "label": {"ko": "리가", "en": "Riga"}, "kind": "place"}, {"lat": 56.51, "lng": 21.01, "label": {"ko": "리예파야", "en": "Liepāja"}, "kind": "place"}, {"lat": 57.31, "lng": 25.27, "label": {"ko": "체시스", "en": "Cēsis"}, "kind": "place"}, {"lat": 55.87, "lng": 26.52, "label": {"ko": "다우가프필스", "en": "Daugavpils"}, "kind": "place"}, {"lat": 54.69, "lng": 25.28, "label": {"ko": "빌뉴스", "en": "Vilnius"}, "kind": "place"}, {"lat": 54.9, "lng": 23.9, "label": {"ko": "카우나스", "en": "Kaunas"}, "kind": "place"}]'::jsonb,
  '["https://encyclopedia.1914-1918-online.net/article/independence-wars-lithuania-latvia-and-estonia/", "https://vm.ee/en/tartu-peace", "https://ojs.utlib.ee/index.php/EAA/article/download/AA.2020.3-4.02/AA.2020.3-4.02/20702", "https://www2.mfa.gov.lv/en/belgium/history-of-latvia", "https://www2.mfa.gov.lv/en/poland/embassy-of-latvia/history-of-polish-latvian-relations", "https://www.royalnavy.mod.uk/news/2019/june/20/190620-hms-ranger-100-year-history-baltic", "https://um.fi/it/suomen-itsenaistyminen", "https://www.vle.lt/straipsnis/lucjan-zeligowski/", "https://publications.tlu.ee/index.php/eymh/article/view/1186", "https://www.contractsfinder.service.gov.uk/Notice/Attachment/c6f2fa2d-72a3-472f-803b-5067ca383fa1"]'::jsonb,
  '{"parent": "civil-war"}'::jsonb,
  '["임시정부", "Provisional Government", "provisional government"]'::jsonb
) ON CONFLICT (id) DO NOTHING;
INSERT INTO commulingo_history_events (id, sort_order, period_label, title_ko, title_en, question_ko, question_en, summary_ko, summary_en, outcome_ko, outcome_en, body_ko, body_en, timeline, locations, sources, relations) VALUES (
  'ukraine-1917-1921',
  39,
  '1917–1921',
  '우크라이나 혁명과 전쟁',
  'Ukraine’s revolution and wars',
  '키예프의 정권은 왜 거듭 바뀌었는가?',
  'Why did power in Kyiv change hands repeatedly?',
  '중앙라다·헤트만·디렉토리아·소비에트 정부는 독립과 토지, 국가권력을 놓고 경쟁했다. 독일의 점령, 백군의 진격, 농민군의 동맹과 반란, 폴란드와의 협정이 하나의 전쟁 공간에서 만났다.',
  'The Rada, Hetmanate, Directory and Soviet governments contested independence, land and state power. German occupation, White advances, peasant armies and the Polish alliance intersected in a shared theatre of war.',
  '인민공화국은 패배하고 우크라이나 영토는 분할됐다. 소비에트 우크라이나의 국가 형식은 남았지만 정치·군사 권력은 볼셰비키 중앙에 결합되었다.',
  'The republic was defeated and Ukrainian territories divided. Soviet Ukraine retained a state framework, while political and military power was integrated with the Bolshevik centre.',
  '## 라다: 자치에서 독립으로

1917년 2월 혁명 뒤 키예프에 세워진 중앙라다는 우크라이나의 정치적 대표권을 주장했다. 미하일로 흐루셰프스키가 의장을 맡고 볼로디미르 빈니첸코가 총서기국을 이끌었다. 처음부터 모든 러시아와의 관계를 끊으려던 정부는 아니었다. 러시아의 민주적 연방 안에서 자치를 확보하려는 기대가 있었지만, 임시정부와의 권한 다툼과 볼셰비키의 집권은 그 길을 좁혔다.

라다는 1917년 11월 우크라이나 인민공화국을 선포하고 1918년 1월에는 독립을 선언했다. 한편 하리코프에는 경쟁하는 소비에트 정부가 수립됐고 안토노프-옵세옌코와 무라비요프의 군사작전이 뒤따랐다. 1918년 2월 소비에트군이 키예프를 장악했다. 어느 정부가 우크라이나를 대표하는가의 문제는 선포문뿐 아니라 무력과 지방의 지지를 통해 결정되고 있었다.

## 독일군이 돌려준 수도, 독일군이 지탱한 헤트만

중앙라다는 2월 9일 중앙동맹국과 별도의 브레스트 조약을 맺었다. 독일·오스트리아-헝가리군이 소비에트군을 몰아내면서 키예프에 복귀했지만, 식량 공급을 요구하는 점령 당국과의 관계는 곧 악화했다. 4월 29일 파울로 스코로파츠키가 헤트만으로 집권했고 라다의 공화국은 우크라이나국으로 대체됐다. 협상과 점령의 국제적 경위는 [브레스트 강화](/commulingo/events/brest-litovsk)에서 다룬다.

헤트만 정권은 관료기구와 교육·학술기관을 세우고 외교 관계를 넓혔다. 그러나 토지 소유 질서의 복구와 곡물 반출은 농민의 토지혁명과 충돌했다. 독일군이 질서를 보장하는 동안에는 정권이 버틸 수 있었지만, 국내의 동의와 외국 군대의 보호는 같은 기반이 아니었다. 독일의 11월 패전이 그 차이를 드러냈다.

## 디렉토리아가 되찾은 키예프, 다시 잃은 키예프

1918년 11월 빈니첸코와 시몬 페틀류라 등이 디렉토리아를 구성해 헤트만에 맞섰다. 12월 스코로파츠키가 물러나고 인민공화국이 복구됐다. 하지만 반헤트만 연합은 안정된 국가군으로 통합되지 못했다. 지방의 아타만들은 토지와 식량, 자치에 대한 이해에 따라 동맹을 바꾸었다. 프랑스 등 연합국과 협력할지를 둘러싼 갈등도 지도부를 갈랐다.

1919년 1월 인민공화국과 서우크라이나 인민공화국은 통합을 선언했지만 군대와 행정은 곧바로 하나가 되지 않았다. 동쪽의 소비에트군, 서쪽의 폴란드군에 맞서는 전쟁은 서로 다른 우선순위를 낳았다. 2월 키예프가 다시 소비에트군에 넘어간 뒤 빈니첸코는 지도부를 떠났고 페틀류라의 군사·정치적 비중이 커졌다. 크리스티안 라콥스키의 소비에트 정부 역시 곡물 징발과 지방의 저항이라는 문제를 피하지 못했다.

## 흐리호리우·마흐노와 농민의 전쟁

니키포르 흐리호리우는 헤트만에 맞선 봉기에서 디렉토리아를 거쳐 적군과 결합했다. 그의 부대는 1919년 봄 남부에서 연합군을 압박했지만 5월 소비에트 권력에 반란을 일으켰다. 그 과정에서 부대들이 자행한 반유대인 포그롬은 농민 저항이라는 말만으로 가려서는 안 되는 대규모 폭력이었다. 7월 흐리호리우는 마흐노 측과의 충돌에서 살해됐다.

훌랴이폴레를 기반으로 한 네스토르 마흐노는 아나키스트 농민군을 이끌었다. 볼린과 나바트 연합 등은 그 운동의 정치적 논의를 발전시켰다. 마흐노군은 적군과 협력해 백군에 맞섰지만 중앙집권적 당국가와 강제 징발을 받아들이지 않았다. 1919년 데니킨의 후방을 공격했고 1920년 브란겔에 맞서 다시 적군과 협력했다. 크림 승리 뒤 볼셰비키는 이 동맹군을 제거하는 작전에 나섰다. 마흐노는 1921년 국외로 탈출했다.

유대인 주민은 인민공화국 계열 부대, 독립 아타만 부대, 백군을 비롯한 여러 군대의 폭력에 노출됐다. 적군 부대의 가해도 있었다. 각 진영의 규모와 지휘 책임을 같게 취급해서는 안 되지만, 중앙정부의 금지 명령이 존재했다는 사실만으로 현장의 가해와 처벌 실패가 사라지는 것도 아니다. 민간인에게 정권 교체는 거듭된 약탈·징발·학살과 피란을 뜻할 수 있었다.

## 데니킨의 점령과 국가 통합의 실패

1919년 여름 데니킨의 남러시아군이 우크라이나로 진입했다. 8월 말 인민공화국·갈리치아군과 백군이 키예프에 들어왔지만, 반볼셰비키라는 공통점은 동맹을 보장하지 않았다. 데니킨의 통일 러시아 구상은 우크라이나 국가의 독립을 거부했다. 인민공화국은 붉은 군대뿐 아니라 백군과도 싸워야 했고, 발진티푸스와 보급 붕괴는 군대를 무너뜨렸다.

백군은 도시를 점령해도 농촌의 안정적 지지를 확보하지 못했다. 토지 문제와 민족정책, 포그롬, 마흐노군의 후방 공격이 군사적 과잉 확장과 결합했다. 적군의 반격 속에서 12월 키예프는 다시 소비에트 지배로 넘어갔다. 모스크바 진격과 남부전선의 전체 작전은 [러시아 내전](/commulingo/events/civil-war)에서 연결해 읽을 수 있다.

## 폴란드 동맹과 1921년의 패배

독자적 군사 기반을 잃은 페틀류라는 1920년 4월 피우수트스키와 바르샤바 협정을 맺었다. 폴란드의 인민공화국 승인을 얻는 대신 동갈리치아와 서부 볼히니아에 대한 폴란드의 지배를 받아들인 선택은 우크라이나 진영 내부에서도 반발을 낳았다. 4월 25일 시작된 합동 공세로 5월 키예프에 들어갔지만, 소비에트군의 반격으로 6월 철수했다. 이후 바르샤바 전투와 강화 협상은 [소비에트-폴란드 전쟁](/commulingo/events/soviet-polish-war)에서 자세히 다룬다.

폴란드와 소비에트 측의 휴전 뒤 인민공화국군은 계속 싸웠으나 1920년 11월 패퇴해 폴란드에서 억류되었다. 1921년 3월 리가 조약에서 인민공화국은 협상 당사자로 인정받지 못했다. 그해 11월의 마지막 원정도 실패했다. 소비에트 우크라이나는 대부분의 중부·동부 영토를 통치했고 서부 우크라이나의 상당 부분은 폴란드에 남았다.

이 결말을 처음부터 예정된 단일 민족국가의 실패나 러시아 내전의 지방 전선 하나로만 설명할 수는 없다. 국가 독립, 토지혁명, 사회주의의 형태, 외국의 개입이 서로 충돌했다. 소비에트 우크라이나의 형식적 국가 지위와 실질적 중앙 통제라는 모순은 1922년 [소련 성립](/commulingo/events/ussr-formation)의 논쟁으로 이어졌다.
',
  '## The Rada: from autonomy to independence

The Central Rada formed in Kyiv after the February Revolution of 1917 to claim Ukrainian political representation. Mykhailo Hrushevsky chaired it; Volodymyr Vynnychenko led its General Secretariat. Initially, many leaders sought autonomy within a democratic Russian federation. Conflict with the Provisional Government and the Bolshevik seizure of power narrowed that possibility.

The Rada proclaimed the Ukrainian People''s Republic in November 1917 and independence in January 1918. A rival Soviet government emerged in Kharkiv, followed by military operations under Antonov-Ovseenko and Muravev. Soviet troops captured Kyiv in February. Representation was being determined by force and local support as well as constitutional declarations.

## A capital restored by Germany, a Hetman sustained by Germany

The Rada signed a separate Brest treaty with the Central Powers on 9 February. German and Austro-Hungarian troops drove out Soviet forces, enabling its return, but relations with occupiers demanding food deliveries deteriorated. On 29 April Pavlo Skoropadskyi took power as Hetman, replacing the republic with the Ukrainian State. The international negotiations and occupation are discussed in [Brest-Litovsk](/commulingo/events/brest-litovsk).

The Hetmanate developed administration, education, scholarly institutions and diplomacy. Yet restoration of property rights and grain extraction conflicted with the peasants'' land revolution. Protection by foreign troops was not the same foundation as domestic consent. Germany''s defeat in November exposed the difference.

## The Directory regained Kyiv, then lost it again

In November 1918 Vynnychenko, Symon Petliura and their allies formed the Directory against the Hetmanate. Skoropadskyi fell in December and the republic was restored. The coalition could not easily turn regional insurgents into a disciplined national army. Otamans changed allegiance over land, food and local autonomy; leaders also disagreed over cooperation with the Entente.

The January 1919 declaration of union with the Western Ukrainian People''s Republic did not immediately unite armies or administrations. Fighting Soviet forces in the east and Poland in the west produced different priorities. Following the February loss of Kyiv, Vynnychenko left the leadership and Petliura became increasingly dominant. Christian Rakovsky''s Soviet government also faced resistance to requisitioning and central control.

## Hryhoriv, Makhno and the peasants'' war

Nykyfor Hryhoriv moved from the anti-Hetman uprising through the Directory to cooperation with the Reds. His troops pressured Allied forces in the south in spring 1919, then rebelled against Soviet authority in May. Their anti-Jewish pogroms were mass violence that cannot be concealed by calling the movement peasant resistance. Hryhoriv was killed in a confrontation with Makhno''s side in July.

Based around Huliaipole, Nestor Makhno led an anarchist peasant army. Volin and the Nabat federation contributed to its political debates. The insurgents cooperated with the Reds against the Whites but resisted centralized party rule and forced requisitioning. They struck Denikin''s rear in 1919 and allied with the Reds again against Wrangel in 1920. After victory in Crimea, the Bolsheviks moved to eliminate their former allies. Makhno fled abroad in 1921.

Jewish civilians suffered violence by troops associated with the republic, independent otamans, Whites and other forces, including Red units. The scale and command responsibility differed by army. Central prohibitions nevertheless did not erase atrocities or failures to punish them. Changing governments could mean repeated plunder, requisition, massacre and flight for civilians.

## Denikin''s occupation and the failure of unity

Denikin''s Armed Forces of South Russia advanced into Ukraine in summer 1919. Republican and Galician troops entered Kyiv in late August, as did the Whites, but opposition to Bolshevism did not guarantee an alliance. Denikin''s commitment to a united Russia rejected Ukrainian independence. Republican forces fought Whites as well as Reds, while typhus and collapsing supply devastated their armies.

Capturing cities did not secure White support in the countryside. Land policy, rejection of Ukrainian nationhood, pogroms and Makhno''s attacks combined with military overextension. A Red counteroffensive returned Kyiv to Soviet control in December. The advance on Moscow and wider southern operations belong to the [Russian Civil War](/commulingo/events/civil-war).

## The Polish alliance and defeat in 1921

With his independent military base eroded, Petliura made the Warsaw agreement with Piłsudski in April 1920. Polish recognition of the republic came at the cost of accepting Polish control in eastern Galicia and western Volhynia, provoking opposition among Ukrainians. Their joint offensive began on 25 April and reached Kyiv in May; a Soviet counteroffensive forced withdrawal in June. Warsaw and the peace negotiations are covered in the [Polish-Soviet War](/commulingo/events/soviet-polish-war).

After the Polish-Soviet armistice, republican troops continued fighting but retreated into Polish internment in November 1920. The republic was excluded from the March 1921 Treaty of Riga. A final expedition in November 1921 also failed. Soviet Ukraine controlled most central and eastern territories, while much of western Ukraine remained in Poland.

This outcome was neither the predetermined failure of one nation-state nor merely a provincial episode of Russia''s civil war. Independence, land revolution, competing socialisms and foreign intervention collided. The tension between Soviet Ukraine''s formal statehood and centralized party control continued into the debates over the [formation of the USSR](/commulingo/events/ussr-formation).
',
  '[{"date": "1917.03", "title": {"ko": "중앙라다 수립", "en": "Central Rada formed"}, "body": {"ko": "혁명 뒤 우크라이나의 정치적 대표기구가 등장했다.", "en": "A Ukrainian representative body emerged after the revolution."}}, {"date": "1918.01–02", "title": {"ko": "독립과 첫 키예프 상실", "en": "Independence and the first loss of Kyiv"}, "body": {"ko": "독립 선언 뒤 소비에트군이 수도를 점령했다.", "en": "Soviet forces captured the capital after independence was declared."}}, {"date": "1918.04.29", "title": {"ko": "헤트만 집권", "en": "The Hetman takes power"}, "body": {"ko": "스코로파츠키 정권이 라다를 대체했다.", "en": "Skoropadskyi’s government replaced the Rada."}}, {"date": "1918.12", "title": {"ko": "디렉토리아의 승리", "en": "The Directory prevails"}, "body": {"ko": "반헤트만 봉기로 인민공화국이 복구됐다.", "en": "The anti-Hetman uprising restored the republic."}}, {"date": "1919.02", "title": {"ko": "소비에트군의 키예프 재점령", "en": "Soviet forces retake Kyiv"}, "body": {"ko": "디렉토리아가 수도에서 철수했다.", "en": "The Directory withdrew from the capital."}}, {"date": "1919.05", "title": {"ko": "흐리호리우 봉기", "en": "Hryhoriv’s rebellion"}, "body": {"ko": "반소비에트 봉기와 반유대인 학살이 벌어졌다.", "en": "An anti-Soviet rising was accompanied by anti-Jewish massacres."}}, {"date": "1919.08–12", "title": {"ko": "백군 점령과 적군의 귀환", "en": "White occupation and Red return"}, "body": {"ko": "데니킨의 진격과 패퇴 속에서 키예프의 권력이 다시 바뀌었다.", "en": "Power changed again with Denikin’s advance and retreat."}}, {"date": "1920.04–06", "title": {"ko": "폴란드 동맹과 키예프 공세", "en": "Polish alliance and Kyiv offensive"}, "body": {"ko": "합동 공세 뒤 소비에트 반격으로 철수했다.", "en": "A Soviet counteroffensive reversed the joint advance."}}, {"date": "1921.03–11", "title": {"ko": "리가 조약과 마지막 원정의 실패", "en": "Riga and the last expedition’s defeat"}, "body": {"ko": "인민공화국의 독립전쟁은 군사적 패배로 끝났다.", "en": "The republic’s struggle ended in military defeat."}}]'::jsonb,
  '[{"lat": 50.45, "lng": 30.52, "label": {"ko": "키예프", "en": "Kyiv"}, "kind": "main"}, {"lat": 49.99, "lng": 36.23, "label": {"ko": "하리코프", "en": "Kharkiv"}, "kind": "place"}, {"lat": 47.66, "lng": 36.26, "label": {"ko": "훌랴이폴레", "en": "Huliaipole"}, "kind": "place"}, {"lat": 46.48, "lng": 30.73, "label": {"ko": "오데사", "en": "Odesa"}, "kind": "place"}, {"lat": 48.68, "lng": 26.58, "label": {"ko": "카메네츠포돌스크", "en": "Kamianets-Podilskyi"}, "kind": "place"}]'::jsonb,
  '["https://www.encyclopediaofukraine.com/display.asp?linkpath=pages%5CU%5CK%5CUkrainian6SovietWar1917hD721.htm", "https://www.encyclopediaofukraine.com/display.asp?linkpath=pages%5CD%5CI%5CDirectoryoftheUkrainianNationalRepublic.htm", "https://www.encyclopediaofukraine.com/display.asp?linkpath=pages%5CH%5CR%5CHryhorivNykyfor.htm", "https://www.encyclopediaofukraine.com/display.asp?linkpath=pages%5CH%5CR%5CHrushevskyMykhailo.htm", "https://www.encyclopediaofukraine.com/display.asp?linkpath=pages%5CV%5CY%5CVynnychenkoVolodymyr.htm", "https://encyclopedia.1914-1918-online.net/article/ukraine/", "https://encyclopedia.1914-1918-online.net/article/makhno-nestor-ivanovich/", "https://www.encyclopedia.com/religion/encyclopedias-almanacs-transcripts-and-maps/pogroms"]'::jsonb,
  '{"parent": "civil-war"}'::jsonb
) ON CONFLICT (id) DO NOTHING;
INSERT INTO commulingo_people (id, group_id, sort_order, initial, cyrillic, years_label, birth_year, death_year, name_ko, name_en, given_name_ko, given_name_en, family_name_ko, family_name_en, epithet_ko, epithet_en, bio_ko, bio_en, fate_kind, fate_label_ko, fate_label_en, citizenship_code, citizenship_label_ko, citizenship_label_en, origin_code, origin_label_ko, origin_label_en) VALUES (
  'konstantin-pats',
  'foreign-statesmen',
  191800,
  '',
  'Konstantin Päts',
  '1874–1956',
  1874,
  1956,
  '콘스탄틴 페츠',
  'Konstantin Päts',
  '콘스탄틴',
  'Konstantin',
  '페츠',
  'Päts',
  '에스토니아 독립전쟁 초기 정부 수반',
  'Estonian government leader early in the independence war',
  '독립전쟁 초기에 에스토니아 정부를 이끌었다. 1934년 라이도네르와 함께 권위주의 체제를 세웠고, 1940년 소련 점령 뒤 강제이송되어 구금 중 사망했다.',
  'Led Estonia’s government early in the independence war. He established authoritarian rule with Laidoner in 1934 and died in Soviet custody after deportation following the 1940 occupation.',
  'natural',
  '소련 구금 중 사망',
  'Died in Soviet custody',
  'estonia',
  '에스토니아',
  'Estonia',
  'estonia',
  '에스토니아',
  'Estonia'
) ON CONFLICT (id) DO NOTHING;
INSERT INTO commulingo_person_roles (person_id, category_id) VALUES (
  'konstantin-pats',
  'foreign-statesman'
) ON CONFLICT DO NOTHING;
INSERT INTO commulingo_person_sections (person_id, slug, sort_order, heading_ko, heading_en, body_ko, body_en, sources) VALUES (
  'konstantin-pats',
  'independence-wars',
  0,
  '혁명과 독립전쟁',
  'Revolution and independence wars',
  '독립전쟁 초기에 에스토니아 정부를 이끌었다. 1934년 라이도네르와 함께 권위주의 체제를 세웠고, 1940년 소련 점령 뒤 강제이송되어 구금 중 사망했다.',
  'Led Estonia’s government early in the independence war. He established authoritarian rule with Laidoner in 1934 and died in Soviet custody after deportation following the 1940 occupation.',
  '["https://valitsus.ee/konstantin-pats"]'::jsonb
) ON CONFLICT (person_id, slug) DO NOTHING;
INSERT INTO commulingo_person_aliases (person_id, lang, alias, sort_order) VALUES (
  'konstantin-pats',
  'ko',
  '페츠',
  0
) ON CONFLICT DO NOTHING;
INSERT INTO commulingo_person_aliases (person_id, lang, alias, sort_order) VALUES (
  'konstantin-pats',
  'en',
  'Päts',
  0
) ON CONFLICT DO NOTHING;
INSERT INTO commulingo_people (id, group_id, sort_order, initial, cyrillic, years_label, birth_year, death_year, name_ko, name_en, given_name_ko, given_name_en, family_name_ko, family_name_en, epithet_ko, epithet_en, bio_ko, bio_en, fate_kind, fate_label_ko, fate_label_en, citizenship_code, citizenship_label_ko, citizenship_label_en, origin_code, origin_label_ko, origin_label_en) VALUES (
  'johan-laidoner',
  'foreign-statesmen',
  191801,
  '',
  'Johan Laidoner',
  '1884–1953',
  1884,
  1953,
  '요한 라이도네르',
  'Johan Laidoner',
  '요한',
  'Johan',
  '라이도네르',
  'Laidoner',
  '에스토니아 독립전쟁 총사령관',
  'Estonian commander-in-chief in the independence war',
  '에스토니아군의 반격과 북라트비아 작전을 지휘했다. 유데니치군과 조건부로 협력했으며, 1934년 페츠의 쿠데타를 도왔다. 소련에 강제이송된 뒤 감옥에서 사망했다.',
  'Commanded Estonia’s counteroffensive and operations in northern Latvia, cooperating conditionally with Yudenich. He supported Päts’s 1934 coup and died in prison after Soviet deportation.',
  'natural',
  '소련 감옥에서 사망',
  'Died in a Soviet prison',
  'estonia',
  '에스토니아',
  'Estonia',
  'estonia',
  '에스토니아',
  'Estonia'
) ON CONFLICT (id) DO NOTHING;
INSERT INTO commulingo_person_roles (person_id, category_id) VALUES (
  'johan-laidoner',
  'foreign-statesman'
) ON CONFLICT DO NOTHING;
INSERT INTO commulingo_person_sections (person_id, slug, sort_order, heading_ko, heading_en, body_ko, body_en, sources) VALUES (
  'johan-laidoner',
  'independence-wars',
  0,
  '혁명과 독립전쟁',
  'Revolution and independence wars',
  '에스토니아군의 반격과 북라트비아 작전을 지휘했다. 유데니치군과 조건부로 협력했으며, 1934년 페츠의 쿠데타를 도왔다. 소련에 강제이송된 뒤 감옥에서 사망했다.',
  'Commanded Estonia’s counteroffensive and operations in northern Latvia, cooperating conditionally with Yudenich. He supported Päts’s 1934 coup and died in prison after Soviet deportation.',
  '["https://encyclopedia.1914-1918-online.net/article/laidoner-johan/"]'::jsonb
) ON CONFLICT (person_id, slug) DO NOTHING;
INSERT INTO commulingo_person_aliases (person_id, lang, alias, sort_order) VALUES (
  'johan-laidoner',
  'ko',
  '라이도네르',
  0
) ON CONFLICT DO NOTHING;
INSERT INTO commulingo_person_aliases (person_id, lang, alias, sort_order) VALUES (
  'johan-laidoner',
  'en',
  'Laidoner',
  0
) ON CONFLICT DO NOTHING;
INSERT INTO commulingo_people (id, group_id, sort_order, initial, cyrillic, years_label, birth_year, death_year, name_ko, name_en, given_name_ko, given_name_en, family_name_ko, family_name_en, epithet_ko, epithet_en, bio_ko, bio_en, fate_kind, fate_label_ko, fate_label_en, citizenship_code, citizenship_label_ko, citizenship_label_en, origin_code, origin_label_ko, origin_label_en) VALUES (
  'jaan-tonisson',
  'foreign-statesmen',
  191802,
  '',
  'Jaan Tõnisson',
  '1868–1941?',
  1868,
  NULL,
  '얀 퇴니손',
  'Jaan Tõnisson',
  '얀',
  'Jaan',
  '퇴니손',
  'Tõnisson',
  '타르투 강화기의 에스토니아 총리',
  'Estonian prime minister during the Tartu settlement',
  '언론인이자 자유주의 정치인으로 1919~1920년 총리를 지냈다. 그의 정부 아래 러시아와 타르투 강화가 체결됐다. 소련 점령 뒤 체포되어 실종됐으며 1941년 사망한 것으로 추정된다.',
  'A journalist and liberal politician, he was prime minister in 1919–1920 when Estonia concluded the Treaty of Tartu. Arrested after Soviet occupation, he disappeared and is presumed to have died in 1941.',
  '',
  '체포 뒤 실종·1941년 사망 추정',
  'Disappeared after arrest; presumed dead in 1941',
  'estonia',
  '에스토니아',
  'Estonia',
  'estonia',
  '에스토니아',
  'Estonia'
) ON CONFLICT (id) DO NOTHING;
INSERT INTO commulingo_person_roles (person_id, category_id) VALUES (
  'jaan-tonisson',
  'foreign-statesman'
) ON CONFLICT DO NOTHING;
INSERT INTO commulingo_person_sections (person_id, slug, sort_order, heading_ko, heading_en, body_ko, body_en, sources) VALUES (
  'jaan-tonisson',
  'independence-wars',
  0,
  '혁명과 독립전쟁',
  'Revolution and independence wars',
  '언론인이자 자유주의 정치인으로 1919~1920년 총리를 지냈다. 그의 정부 아래 러시아와 타르투 강화가 체결됐다. 소련 점령 뒤 체포되어 실종됐으며 1941년 사망한 것으로 추정된다.',
  'A journalist and liberal politician, he was prime minister in 1919–1920 when Estonia concluded the Treaty of Tartu. Arrested after Soviet occupation, he disappeared and is presumed to have died in 1941.',
  '["https://en.wikipedia.org/wiki/Jaan_T%C3%B5nisson"]'::jsonb
) ON CONFLICT (person_id, slug) DO NOTHING;
INSERT INTO commulingo_person_aliases (person_id, lang, alias, sort_order) VALUES (
  'jaan-tonisson',
  'ko',
  '퇴니손',
  0
) ON CONFLICT DO NOTHING;
INSERT INTO commulingo_person_aliases (person_id, lang, alias, sort_order) VALUES (
  'jaan-tonisson',
  'en',
  'Tõnisson',
  0
) ON CONFLICT DO NOTHING;
INSERT INTO commulingo_people (id, group_id, sort_order, initial, cyrillic, years_label, birth_year, death_year, name_ko, name_en, given_name_ko, given_name_en, family_name_ko, family_name_en, epithet_ko, epithet_en, bio_ko, bio_en, fate_kind, fate_label_ko, fate_label_en, citizenship_code, citizenship_label_ko, citizenship_label_en, origin_code, origin_label_ko, origin_label_en) VALUES (
  'karlis-ulmanis',
  'foreign-statesmen',
  191803,
  '',
  'Kārlis Ulmanis',
  '1877–1942',
  1877,
  1942,
  '카를리스 울마니스',
  'Kārlis Ulmanis',
  '카를리스',
  'Kārlis',
  '울마니스',
  'Ulmanis',
  '라트비아 독립전쟁기의 총리',
  'Latvian prime minister during the independence war',
  '1918년 임시정부를 이끌었고 소비에트군과 친독 정권, 베르몬트군에 맞서 공화국을 지켰다. 1934년 쿠데타로 독재를 수립했으며 소련 점령 뒤 강제이송되어 사망했다.',
  'Led the provisional government from 1918 against Soviet forces, a pro-German rival government and Bermondt’s army. He established a dictatorship in 1934 and died after Soviet deportation.',
  'natural',
  '소련 강제이송 뒤 사망',
  'Died after Soviet deportation',
  'latvia',
  '라트비아',
  'Latvia',
  'latvia',
  '라트비아',
  'Latvia'
) ON CONFLICT (id) DO NOTHING;
INSERT INTO commulingo_person_roles (person_id, category_id) VALUES (
  'karlis-ulmanis',
  'foreign-statesman'
) ON CONFLICT DO NOTHING;
INSERT INTO commulingo_person_sections (person_id, slug, sort_order, heading_ko, heading_en, body_ko, body_en, sources) VALUES (
  'karlis-ulmanis',
  'independence-wars',
  0,
  '혁명과 독립전쟁',
  'Revolution and independence wars',
  '1918년 임시정부를 이끌었고 소비에트군과 친독 정권, 베르몬트군에 맞서 공화국을 지켰다. 1934년 쿠데타로 독재를 수립했으며 소련 점령 뒤 강제이송되어 사망했다.',
  'Led the provisional government from 1918 against Soviet forces, a pro-German rival government and Bermondt’s army. He established a dictatorship in 1934 and died after Soviet deportation.',
  '["https://enciklopedija.lv/skirklis/138164"]'::jsonb
) ON CONFLICT (person_id, slug) DO NOTHING;
INSERT INTO commulingo_person_aliases (person_id, lang, alias, sort_order) VALUES (
  'karlis-ulmanis',
  'ko',
  '울마니스',
  0
) ON CONFLICT DO NOTHING;
INSERT INTO commulingo_person_aliases (person_id, lang, alias, sort_order) VALUES (
  'karlis-ulmanis',
  'en',
  'Ulmanis',
  0
) ON CONFLICT DO NOTHING;
INSERT INTO commulingo_people (id, group_id, sort_order, initial, cyrillic, years_label, birth_year, death_year, name_ko, name_en, given_name_ko, given_name_en, family_name_ko, family_name_en, epithet_ko, epithet_en, bio_ko, bio_en, fate_kind, fate_label_ko, fate_label_en, citizenship_code, citizenship_label_ko, citizenship_label_en, origin_code, origin_label_ko, origin_label_en) VALUES (
  'andrievs-niedra',
  'international-counterrevolutionary',
  191804,
  '',
  'Andrievs Niedra',
  '1871–1942',
  1871,
  1942,
  '안드리에우스 니에드라',
  'Andrievs Niedra',
  '안드리에우스',
  'Andrievs',
  '니에드라',
  'Niedra',
  '1919년 친독 라트비아 정부 수반',
  'Head of Latvia’s pro-German government in 1919',
  '목사이자 작가로 1919년 리예파야 쿠데타 뒤 친독 정부를 이끌었다. 체시스 전투 이후 정권이 무너졌으며, 독립 라트비아에서 반역죄로 재판받고 독일로 추방됐다.',
  'A pastor and writer, he headed the pro-German government formed after the Liepāja coup. His government fell after Cēsis; independent Latvia later tried him for treason and expelled him to Germany.',
  'natural',
  '1942년 사망',
  'Died in 1942',
  'latvia',
  '라트비아',
  'Latvia',
  'latvia',
  '라트비아',
  'Latvia'
) ON CONFLICT (id) DO NOTHING;
INSERT INTO commulingo_person_roles (person_id, category_id) VALUES (
  'andrievs-niedra',
  'counterrevolution'
) ON CONFLICT DO NOTHING;
INSERT INTO commulingo_person_sections (person_id, slug, sort_order, heading_ko, heading_en, body_ko, body_en, sources) VALUES (
  'andrievs-niedra',
  'independence-wars',
  0,
  '혁명과 독립전쟁',
  'Revolution and independence wars',
  '목사이자 작가로 1919년 리예파야 쿠데타 뒤 친독 정부를 이끌었다. 체시스 전투 이후 정권이 무너졌으며, 독립 라트비아에서 반역죄로 재판받고 독일로 추방됐다.',
  'A pastor and writer, he headed the pro-German government formed after the Liepāja coup. His government fell after Cēsis; independent Latvia later tried him for treason and expelled him to Germany.',
  '["https://enciklopedija.lv/skirklis/55155-Andrievs-Niedra-"]'::jsonb
) ON CONFLICT (person_id, slug) DO NOTHING;
INSERT INTO commulingo_person_aliases (person_id, lang, alias, sort_order) VALUES (
  'andrievs-niedra',
  'ko',
  '니에드라',
  0
) ON CONFLICT DO NOTHING;
INSERT INTO commulingo_person_aliases (person_id, lang, alias, sort_order) VALUES (
  'andrievs-niedra',
  'en',
  'Niedra',
  0
) ON CONFLICT DO NOTHING;
INSERT INTO commulingo_people (id, group_id, sort_order, initial, cyrillic, years_label, birth_year, death_year, name_ko, name_en, given_name_ko, given_name_en, family_name_ko, family_name_en, epithet_ko, epithet_en, bio_ko, bio_en, fate_kind, fate_label_ko, fate_label_en, citizenship_code, citizenship_label_ko, citizenship_label_en, origin_code, origin_label_ko, origin_label_en) VALUES (
  'zigfrids-meierovics',
  'foreign-statesmen',
  191805,
  '',
  'Zigfrīds Anna Meierovics',
  '1887–1925',
  1887,
  1925,
  '지그프리츠 안나 메이에로비츠',
  'Zigfrīds Anna Meierovics',
  '지그프리츠 안나',
  'Zigfrīds Anna',
  '메이에로비츠',
  'Meierovics',
  '라트비아 독립 승인을 이끈 외교관',
  'Diplomat securing recognition for independent Latvia',
  '라트비아의 초대 외무장관으로 독립전쟁 동안 연합국의 지원과 국제 승인을 추구했다. 이후 총리도 지냈으며 1925년 교통사고로 사망했다.',
  'Latvia’s first foreign minister, he sought Allied support and international recognition during the independence war. He later served as prime minister and died in a traffic accident in 1925.',
  'killed',
  '교통사고로 사망',
  'Died in a traffic accident',
  'latvia',
  '라트비아',
  'Latvia',
  'latvia',
  '라트비아·유대계',
  'Latvian and Jewish'
) ON CONFLICT (id) DO NOTHING;
INSERT INTO commulingo_person_roles (person_id, category_id) VALUES (
  'zigfrids-meierovics',
  'foreign-statesman'
) ON CONFLICT DO NOTHING;
INSERT INTO commulingo_person_sections (person_id, slug, sort_order, heading_ko, heading_en, body_ko, body_en, sources) VALUES (
  'zigfrids-meierovics',
  'independence-wars',
  0,
  '혁명과 독립전쟁',
  'Revolution and independence wars',
  '라트비아의 초대 외무장관으로 독립전쟁 동안 연합국의 지원과 국제 승인을 추구했다. 이후 총리도 지냈으며 1925년 교통사고로 사망했다.',
  'Latvia’s first foreign minister, he sought Allied support and international recognition during the independence war. He later served as prime minister and died in a traffic accident in 1925.',
  '["https://enciklopedija.lv/skirklis/130366-Zigfr%C4%ABds-Anna-Meierovics"]'::jsonb
) ON CONFLICT (person_id, slug) DO NOTHING;
INSERT INTO commulingo_person_aliases (person_id, lang, alias, sort_order) VALUES (
  'zigfrids-meierovics',
  'ko',
  '메이에로비츠',
  0
) ON CONFLICT DO NOTHING;
INSERT INTO commulingo_person_aliases (person_id, lang, alias, sort_order) VALUES (
  'zigfrids-meierovics',
  'en',
  'Meierovics',
  0
) ON CONFLICT DO NOTHING;
INSERT INTO commulingo_people (id, group_id, sort_order, initial, cyrillic, years_label, birth_year, death_year, name_ko, name_en, given_name_ko, given_name_en, family_name_ko, family_name_en, epithet_ko, epithet_en, bio_ko, bio_en, fate_kind, fate_label_ko, fate_label_en, citizenship_code, citizenship_label_ko, citizenship_label_en, origin_code, origin_label_ko, origin_label_en) VALUES (
  'rudiger-von-der-goltz',
  'international-counterrevolutionary',
  191806,
  '',
  'Rüdiger von der Goltz',
  '1865–1946',
  1865,
  1946,
  '뤼디거 폰 데어 골츠',
  'Rüdiger von der Goltz',
  '뤼디거',
  'Rüdiger',
  '폰 데어 골츠',
  'von der Goltz',
  '핀란드와 발트의 독일군 지휘관',
  'German commander in Finland and the Baltic',
  '1918년 발트 사단을 이끌고 핀란드 백군을 지원했다. 1919년에는 라트비아의 독일군과 자유군단을 지휘했으며 반볼셰비키 전쟁을 독일의 발트 영향력 유지와 결합했다.',
  'Led the Baltic Sea Division supporting Finland’s Whites in 1918. In Latvia in 1919 he commanded German forces and Freikorps, combining anti-Bolshevik warfare with efforts to retain German influence.',
  'natural',
  '1946년 사망',
  'Died in 1946',
  'germany',
  '독일',
  'Germany',
  'germany',
  '독일',
  'Germany'
) ON CONFLICT (id) DO NOTHING;
INSERT INTO commulingo_person_roles (person_id, category_id) VALUES (
  'rudiger-von-der-goltz',
  'counterrevolution'
) ON CONFLICT DO NOTHING;
INSERT INTO commulingo_person_sections (person_id, slug, sort_order, heading_ko, heading_en, body_ko, body_en, sources) VALUES (
  'rudiger-von-der-goltz',
  'independence-wars',
  0,
  '혁명과 독립전쟁',
  'Revolution and independence wars',
  '1918년 발트 사단을 이끌고 핀란드 백군을 지원했다. 1919년에는 라트비아의 독일군과 자유군단을 지휘했으며 반볼셰비키 전쟁을 독일의 발트 영향력 유지와 결합했다.',
  'Led the Baltic Sea Division supporting Finland’s Whites in 1918. In Latvia in 1919 he commanded German forces and Freikorps, combining anti-Bolshevik warfare with efforts to retain German influence.',
  '["https://encyclopedia.1914-1918-online.net/article/goltz-rudiger-graf-von-der/"]'::jsonb
) ON CONFLICT (person_id, slug) DO NOTHING;
INSERT INTO commulingo_person_aliases (person_id, lang, alias, sort_order) VALUES (
  'rudiger-von-der-goltz',
  'ko',
  '폰 데어 골츠',
  0
) ON CONFLICT DO NOTHING;
INSERT INTO commulingo_person_aliases (person_id, lang, alias, sort_order) VALUES (
  'rudiger-von-der-goltz',
  'en',
  'von der Goltz',
  0
) ON CONFLICT DO NOTHING;
INSERT INTO commulingo_people (id, group_id, sort_order, initial, cyrillic, years_label, birth_year, death_year, name_ko, name_en, given_name_ko, given_name_en, family_name_ko, family_name_en, epithet_ko, epithet_en, bio_ko, bio_en, fate_kind, fate_label_ko, fate_label_en, citizenship_code, citizenship_label_ko, citizenship_label_en, origin_code, origin_label_ko, origin_label_en) VALUES (
  'pavel-bermondt-avalov',
  'international-counterrevolutionary',
  191807,
  '',
  'Павел Бермондт-Авалов',
  '1877–1973',
  1877,
  1973,
  '파벨 베르몬트-아발로프',
  'Pavel Bermondt-Avalov',
  '파벨',
  'Pavel',
  '베르몬트-아발로프',
  'Bermondt-Avalov',
  '리가를 공격한 서러시아 의용군 사령관',
  'West Russian Volunteer Army commander who attacked Riga',
  '독일계 병력을 대거 받아들인 서러시아 의용군을 지휘했다. 반볼셰비키를 표방했으나 1919년 라트비아·리투아니아의 독립군과 싸웠고 리가 공격 실패 뒤 망명했다.',
  'Commanded the West Russian Volunteer Army, incorporating many German soldiers. Despite an anti-Bolshevik banner, he fought Latvian and Lithuanian forces in 1919 and went into exile after failing at Riga. Accounts of his ethnic background differ.',
  'natural',
  '미국 망명 중 사망',
  'Died in exile in the United States',
  'russia',
  '러시아',
  'Russia',
  '',
  '출신에 이견 있음',
  'Disputed background'
) ON CONFLICT (id) DO NOTHING;
INSERT INTO commulingo_person_roles (person_id, category_id) VALUES (
  'pavel-bermondt-avalov',
  'counterrevolution'
) ON CONFLICT DO NOTHING;
INSERT INTO commulingo_person_sections (person_id, slug, sort_order, heading_ko, heading_en, body_ko, body_en, sources) VALUES (
  'pavel-bermondt-avalov',
  'independence-wars',
  0,
  '혁명과 독립전쟁',
  'Revolution and independence wars',
  '독일계 병력을 대거 받아들인 서러시아 의용군을 지휘했다. 반볼셰비키를 표방했으나 1919년 라트비아·리투아니아의 독립군과 싸웠고 리가 공격 실패 뒤 망명했다.',
  'Commanded the West Russian Volunteer Army, incorporating many German soldiers. Despite an anti-Bolshevik banner, he fought Latvian and Lithuanian forces in 1919 and went into exile after failing at Riga. Accounts of his ethnic background differ.',
  '["https://www.vle.lt/straipsnis/pavel-bermondt/"]'::jsonb
) ON CONFLICT (person_id, slug) DO NOTHING;
INSERT INTO commulingo_person_aliases (person_id, lang, alias, sort_order) VALUES (
  'pavel-bermondt-avalov',
  'ko',
  '베르몬트-아발로프',
  0
) ON CONFLICT DO NOTHING;
INSERT INTO commulingo_person_aliases (person_id, lang, alias, sort_order) VALUES (
  'pavel-bermondt-avalov',
  'en',
  'Bermondt-Avalov',
  0
) ON CONFLICT DO NOTHING;
INSERT INTO commulingo_people (id, group_id, sort_order, initial, cyrillic, years_label, birth_year, death_year, name_ko, name_en, given_name_ko, given_name_en, family_name_ko, family_name_en, epithet_ko, epithet_en, bio_ko, bio_en, fate_kind, fate_label_ko, fate_label_en, citizenship_code, citizenship_label_ko, citizenship_label_en, origin_code, origin_label_ko, origin_label_en) VALUES (
  'antanas-smetona',
  'foreign-statesmen',
  191808,
  '',
  'Antanas Smetona',
  '1874–1944',
  1874,
  1944,
  '안타나스 스메토나',
  'Antanas Smetona',
  '안타나스',
  'Antanas',
  '스메토나',
  'Smetona',
  '리투아니아 초대 대통령',
  'Lithuania’s first president',
  '리투아니아 평의회 의장으로 1918년 독립 선언에 참여하고 1919년 초대 대통령이 됐다. 1926년 쿠데타 뒤 권위주의 통치를 이끌었으며 소련 점령 뒤 망명해 미국에서 화재로 사망했다.',
  'Chaired Lithuania’s Council, signed the 1918 independence act and became its first president in 1919. He led authoritarian rule after the 1926 coup and died in a fire in American exile after Soviet occupation.',
  'killed',
  '미국 망명 중 화재로 사망',
  'Died in a fire in American exile',
  'lithuania',
  '리투아니아',
  'Lithuania',
  'lithuania',
  '리투아니아',
  'Lithuania'
) ON CONFLICT (id) DO NOTHING;
INSERT INTO commulingo_person_roles (person_id, category_id) VALUES (
  'antanas-smetona',
  'foreign-statesman'
) ON CONFLICT DO NOTHING;
INSERT INTO commulingo_person_sections (person_id, slug, sort_order, heading_ko, heading_en, body_ko, body_en, sources) VALUES (
  'antanas-smetona',
  'independence-wars',
  0,
  '혁명과 독립전쟁',
  'Revolution and independence wars',
  '리투아니아 평의회 의장으로 1918년 독립 선언에 참여하고 1919년 초대 대통령이 됐다. 1926년 쿠데타 뒤 권위주의 통치를 이끌었으며 소련 점령 뒤 망명해 미국에서 화재로 사망했다.',
  'Chaired Lithuania’s Council, signed the 1918 independence act and became its first president in 1919. He led authoritarian rule after the 1926 coup and died in a fire in American exile after Soviet occupation.',
  '["https://istorineprezidentura.lt/en/presidents/antanas-smetona-en/"]'::jsonb
) ON CONFLICT (person_id, slug) DO NOTHING;
INSERT INTO commulingo_person_aliases (person_id, lang, alias, sort_order) VALUES (
  'antanas-smetona',
  'ko',
  '스메토나',
  0
) ON CONFLICT DO NOTHING;
INSERT INTO commulingo_person_aliases (person_id, lang, alias, sort_order) VALUES (
  'antanas-smetona',
  'en',
  'Smetona',
  0
) ON CONFLICT DO NOTHING;
INSERT INTO commulingo_people (id, group_id, sort_order, initial, cyrillic, years_label, birth_year, death_year, name_ko, name_en, given_name_ko, given_name_en, family_name_ko, family_name_en, epithet_ko, epithet_en, bio_ko, bio_en, fate_kind, fate_label_ko, fate_label_en, citizenship_code, citizenship_label_ko, citizenship_label_en, origin_code, origin_label_ko, origin_label_en) VALUES (
  'augustinas-voldemaras',
  'foreign-statesmen',
  191809,
  '',
  'Augustinas Voldemaras',
  '1883–1942',
  1883,
  1942,
  '아우구스티나스 볼데마라스',
  'Augustinas Voldemaras',
  '아우구스티나스',
  'Augustinas',
  '볼데마라스',
  'Voldemaras',
  '리투아니아 초대 총리와 외무장관',
  'Lithuania’s first prime minister and foreign minister',
  '1918년 초대 내각을 이끌고 독립전쟁기에 외무장관으로 활동했다. 1926년 쿠데타 뒤 다시 총리가 됐으나 스메토나와 결별했다. 소련 점령 뒤 체포되어 감옥에서 사망했다.',
  'Headed the first cabinet in 1918 and served as foreign minister during the independence wars. Prime minister again after the 1926 coup, he later broke with Smetona and died in Soviet imprisonment.',
  'natural',
  '소련 감옥에서 사망',
  'Died in a Soviet prison',
  'lithuania',
  '리투아니아',
  'Lithuania',
  'lithuania',
  '리투아니아',
  'Lithuania'
) ON CONFLICT (id) DO NOTHING;
INSERT INTO commulingo_person_roles (person_id, category_id) VALUES (
  'augustinas-voldemaras',
  'foreign-statesman'
) ON CONFLICT DO NOTHING;
INSERT INTO commulingo_person_sections (person_id, slug, sort_order, heading_ko, heading_en, body_ko, body_en, sources) VALUES (
  'augustinas-voldemaras',
  'independence-wars',
  0,
  '혁명과 독립전쟁',
  'Revolution and independence wars',
  '1918년 초대 내각을 이끌고 독립전쟁기에 외무장관으로 활동했다. 1926년 쿠데타 뒤 다시 총리가 됐으나 스메토나와 결별했다. 소련 점령 뒤 체포되어 감옥에서 사망했다.',
  'Headed the first cabinet in 1918 and served as foreign minister during the independence wars. Prime minister again after the 1926 coup, he later broke with Smetona and died in Soviet imprisonment.',
  '["https://www.vle.lt/straipsnis/augustinas-voldemaras/"]'::jsonb
) ON CONFLICT (person_id, slug) DO NOTHING;
INSERT INTO commulingo_person_aliases (person_id, lang, alias, sort_order) VALUES (
  'augustinas-voldemaras',
  'ko',
  '볼데마라스',
  0
) ON CONFLICT DO NOTHING;
INSERT INTO commulingo_person_aliases (person_id, lang, alias, sort_order) VALUES (
  'augustinas-voldemaras',
  'en',
  'Voldemaras',
  0
) ON CONFLICT DO NOTHING;
INSERT INTO commulingo_people (id, group_id, sort_order, initial, cyrillic, years_label, birth_year, death_year, name_ko, name_en, given_name_ko, given_name_en, family_name_ko, family_name_en, epithet_ko, epithet_en, bio_ko, bio_en, fate_kind, fate_label_ko, fate_label_en, citizenship_code, citizenship_label_ko, citizenship_label_en, origin_code, origin_label_ko, origin_label_en) VALUES (
  'vincas-kapsukas',
  'international-revolutionary',
  191810,
  '',
  'Vincas Mickevičius-Kapsukas',
  '1880–1935',
  1880,
  1935,
  '빈차스 카프수카스',
  'Vincas Kapsukas',
  '빈차스',
  'Vincas',
  '카프수카스',
  'Kapsukas',
  '리투아니아와 리트벨의 소비에트 정부 지도자',
  'Leader of Soviet Lithuania and Litbel',
  '리투아니아 공산주의자로 1918~1919년 소비에트 리투아니아와 리투아니아-벨로루시 소비에트 공화국 정부를 이끌었다. 군사적 패배 뒤 소비에트 러시아로 옮겨 코민테른에서 활동했다.',
  'A Lithuanian communist, he led the governments of Soviet Lithuania and the Lithuanian-Belorussian Soviet republic in 1918–1919. After military defeat he moved to Soviet Russia and worked in the Comintern.',
  'natural',
  '1935년 모스크바에서 사망',
  'Died in Moscow in 1935',
  'soviet',
  '소련',
  'Soviet Union',
  'lithuania',
  '리투아니아',
  'Lithuania'
) ON CONFLICT (id) DO NOTHING;
INSERT INTO commulingo_person_roles (person_id, category_id) VALUES (
  'vincas-kapsukas',
  'non-soviet-revolutionary'
) ON CONFLICT DO NOTHING;
INSERT INTO commulingo_person_sections (person_id, slug, sort_order, heading_ko, heading_en, body_ko, body_en, sources) VALUES (
  'vincas-kapsukas',
  'independence-wars',
  0,
  '혁명과 독립전쟁',
  'Revolution and independence wars',
  '리투아니아 공산주의자로 1918~1919년 소비에트 리투아니아와 리투아니아-벨로루시 소비에트 공화국 정부를 이끌었다. 군사적 패배 뒤 소비에트 러시아로 옮겨 코민테른에서 활동했다.',
  'A Lithuanian communist, he led the governments of Soviet Lithuania and the Lithuanian-Belorussian Soviet republic in 1918–1919. After military defeat he moved to Soviet Russia and worked in the Comintern.',
  '["https://www.mle.lt/straipsniai/vincas-mickevicius-kapsukas"]'::jsonb
) ON CONFLICT (person_id, slug) DO NOTHING;
INSERT INTO commulingo_person_aliases (person_id, lang, alias, sort_order) VALUES (
  'vincas-kapsukas',
  'ko',
  '카프수카스',
  0
) ON CONFLICT DO NOTHING;
INSERT INTO commulingo_person_aliases (person_id, lang, alias, sort_order) VALUES (
  'vincas-kapsukas',
  'en',
  'Kapsukas',
  0
) ON CONFLICT DO NOTHING;
INSERT INTO commulingo_people (id, group_id, sort_order, initial, cyrillic, years_label, birth_year, death_year, name_ko, name_en, given_name_ko, given_name_en, family_name_ko, family_name_en, epithet_ko, epithet_en, bio_ko, bio_en, fate_kind, fate_label_ko, fate_label_en, citizenship_code, citizenship_label_ko, citizenship_label_en, origin_code, origin_label_ko, origin_label_en) VALUES (
  'zigmas-angarietis',
  'international-revolutionary',
  191811,
  '',
  'Zigmas Angarietis',
  '1882–1940',
  1882,
  1940,
  '지그마스 안가리에티스',
  'Zigmas Angarietis',
  '지그마스',
  'Zigmas',
  '안가리에티스',
  'Angarietis',
  '소비에트 리투아니아의 내무 인민위원',
  'Interior commissar of Soviet Lithuania',
  '리투아니아 공산당의 지도자로 1918~1919년 소비에트 국가 수립에 참여했다. 망명 뒤 코민테른에서 일했고 스탈린기 탄압으로 체포되어 1940년 처형됐다.',
  'A Lithuanian Communist Party leader, he participated in Soviet state-building in 1918–1919. He worked in the Comintern after exile and was arrested during Stalinist repression and executed in 1940.',
  'executed',
  '1940년 처형',
  'Executed in 1940',
  'soviet',
  '소련',
  'Soviet Union',
  'lithuania',
  '리투아니아',
  'Lithuania'
) ON CONFLICT (id) DO NOTHING;
INSERT INTO commulingo_person_roles (person_id, category_id) VALUES (
  'zigmas-angarietis',
  'non-soviet-revolutionary'
) ON CONFLICT DO NOTHING;
INSERT INTO commulingo_person_sections (person_id, slug, sort_order, heading_ko, heading_en, body_ko, body_en, sources) VALUES (
  'zigmas-angarietis',
  'independence-wars',
  0,
  '혁명과 독립전쟁',
  'Revolution and independence wars',
  '리투아니아 공산당의 지도자로 1918~1919년 소비에트 국가 수립에 참여했다. 망명 뒤 코민테른에서 일했고 스탈린기 탄압으로 체포되어 1940년 처형됐다.',
  'A Lithuanian Communist Party leader, he participated in Soviet state-building in 1918–1919. He worked in the Comintern after exile and was arrested during Stalinist repression and executed in 1940.',
  '["https://www.vle.lt/straipsnis/zigmas-angarietis/"]'::jsonb
) ON CONFLICT (person_id, slug) DO NOTHING;
INSERT INTO commulingo_person_aliases (person_id, lang, alias, sort_order) VALUES (
  'zigmas-angarietis',
  'ko',
  '안가리에티스',
  0
) ON CONFLICT DO NOTHING;
INSERT INTO commulingo_person_aliases (person_id, lang, alias, sort_order) VALUES (
  'zigmas-angarietis',
  'en',
  'Angarietis',
  0
) ON CONFLICT DO NOTHING;
INSERT INTO commulingo_people (id, group_id, sort_order, initial, cyrillic, years_label, birth_year, death_year, name_ko, name_en, given_name_ko, given_name_en, family_name_ko, family_name_en, epithet_ko, epithet_en, bio_ko, bio_en, fate_kind, fate_label_ko, fate_label_en, citizenship_code, citizenship_label_ko, citizenship_label_en, origin_code, origin_label_ko, origin_label_en) VALUES (
  'lucjan-zeligowski',
  'foreign-statesmen',
  191812,
  '',
  'Lucjan Żeligowski',
  '1865–1947',
  1865,
  1947,
  '루치안 젤리고프스키',
  'Lucjan Żeligowski',
  '루치안',
  'Lucjan',
  '젤리고프스키',
  'Żeligowski',
  '빌뉴스를 점령한 폴란드 장군',
  'Polish general who seized Vilnius',
  '러시아 제국군 출신으로 폴란드군을 지휘했다. 1920년 10월 피우수트스키와 협의해 항명을 가장하고 빌뉴스를 점령한 뒤 중부 리투아니아를 수립했다. 훗날 폴란드 군사장관을 지냈다.',
  'A former imperial Russian officer, he commanded Polish troops. In October 1920, in agreement with Piłsudski, he staged a mutiny, seized Vilnius and established Central Lithuania. He later served as Poland’s minister of military affairs.',
  'natural',
  '런던 망명 중 사망',
  'Died in exile in London',
  'poland',
  '폴란드',
  'Poland',
  'poland',
  '폴란드',
  'Poland'
) ON CONFLICT (id) DO NOTHING;
INSERT INTO commulingo_person_roles (person_id, category_id) VALUES (
  'lucjan-zeligowski',
  'foreign-statesman'
) ON CONFLICT DO NOTHING;
INSERT INTO commulingo_person_sections (person_id, slug, sort_order, heading_ko, heading_en, body_ko, body_en, sources) VALUES (
  'lucjan-zeligowski',
  'independence-wars',
  0,
  '혁명과 독립전쟁',
  'Revolution and independence wars',
  '러시아 제국군 출신으로 폴란드군을 지휘했다. 1920년 10월 피우수트스키와 협의해 항명을 가장하고 빌뉴스를 점령한 뒤 중부 리투아니아를 수립했다. 훗날 폴란드 군사장관을 지냈다.',
  'A former imperial Russian officer, he commanded Polish troops. In October 1920, in agreement with Piłsudski, he staged a mutiny, seized Vilnius and established Central Lithuania. He later served as Poland’s minister of military affairs.',
  '["https://www.vle.lt/straipsnis/lucjan-zeligowski/"]'::jsonb
) ON CONFLICT (person_id, slug) DO NOTHING;
INSERT INTO commulingo_person_aliases (person_id, lang, alias, sort_order) VALUES (
  'lucjan-zeligowski',
  'ko',
  '젤리고프스키',
  0
) ON CONFLICT DO NOTHING;
INSERT INTO commulingo_person_aliases (person_id, lang, alias, sort_order) VALUES (
  'lucjan-zeligowski',
  'en',
  'Żeligowski',
  0
) ON CONFLICT DO NOTHING;
INSERT INTO commulingo_people (id, group_id, sort_order, initial, cyrillic, years_label, birth_year, death_year, name_ko, name_en, given_name_ko, given_name_en, family_name_ko, family_name_en, epithet_ko, epithet_en, bio_ko, bio_en, fate_kind, fate_label_ko, fate_label_en, citizenship_code, citizenship_label_ko, citizenship_label_en, origin_code, origin_label_ko, origin_label_en) VALUES (
  'stanislaw-bulak-balachowicz',
  'international-counterrevolutionary',
  191813,
  '',
  'Stanisław Bułak-Bałachowicz',
  '1883–1940',
  1883,
  1940,
  '스타니스와프 부와크-바와호비치',
  'Stanisław Bułak-Bałachowicz',
  '스타니스와프',
  'Stanisław',
  '부와크-바와호비치',
  'Bułak-Bałachowicz',
  '에스토니아에서 벨로루시로 옮겨간 반소비에트 지휘관',
  'Anti-Soviet commander from Estonia to Belarus',
  '적군에서 백군으로 옮겨 에스토니아 전선에서 싸웠고 이후 폴란드와 협력했다. 1920년 휴전 뒤 독자적으로 벌인 벨로루시 원정은 실패했다. 그의 부대가 자행한 반유대인 폭력도 전쟁 기록의 일부다.',
  'Changed from Red to White service, fought on the Estonian front and later cooperated with Poland. His independent Belarusian expedition after the 1920 armistice failed. His troops’ anti-Jewish violence is also part of the war’s record.',
  'killed',
  '1940년 독일 점령하 바르샤바에서 피살',
  'Killed in German-occupied Warsaw in 1940',
  'poland',
  '폴란드',
  'Poland',
  'belarus',
  '벨로루시·폴란드계',
  'Belarusian and Polish'
) ON CONFLICT (id) DO NOTHING;
INSERT INTO commulingo_person_roles (person_id, category_id) VALUES (
  'stanislaw-bulak-balachowicz',
  'counterrevolution'
) ON CONFLICT DO NOTHING;
INSERT INTO commulingo_person_sections (person_id, slug, sort_order, heading_ko, heading_en, body_ko, body_en, sources) VALUES (
  'stanislaw-bulak-balachowicz',
  'independence-wars',
  0,
  '혁명과 독립전쟁',
  'Revolution and independence wars',
  '적군에서 백군으로 옮겨 에스토니아 전선에서 싸웠고 이후 폴란드와 협력했다. 1920년 휴전 뒤 독자적으로 벌인 벨로루시 원정은 실패했다. 그의 부대가 자행한 반유대인 폭력도 전쟁 기록의 일부다.',
  'Changed from Red to White service, fought on the Estonian front and later cooperated with Poland. His independent Belarusian expedition after the 1920 armistice failed. His troops’ anti-Jewish violence is also part of the war’s record.',
  '["https://en.wikipedia.org/wiki/Stanis%C5%82aw_Bu%C5%82ak-Ba%C5%82achowicz"]'::jsonb
) ON CONFLICT (person_id, slug) DO NOTHING;
INSERT INTO commulingo_person_aliases (person_id, lang, alias, sort_order) VALUES (
  'stanislaw-bulak-balachowicz',
  'ko',
  '부와크-바와호비치',
  0
) ON CONFLICT DO NOTHING;
INSERT INTO commulingo_person_aliases (person_id, lang, alias, sort_order) VALUES (
  'stanislaw-bulak-balachowicz',
  'en',
  'Bułak-Bałachowicz',
  0
) ON CONFLICT DO NOTHING;
INSERT INTO commulingo_people (id, group_id, sort_order, initial, cyrillic, years_label, birth_year, death_year, name_ko, name_en, given_name_ko, given_name_en, family_name_ko, family_name_en, epithet_ko, epithet_en, bio_ko, bio_en, fate_kind, fate_label_ko, fate_label_en, citizenship_code, citizenship_label_ko, citizenship_label_en, origin_code, origin_label_ko, origin_label_en) VALUES (
  'pehr-evind-svinhufvud',
  'foreign-statesmen',
  191814,
  '',
  'Pehr Evind Svinhufvud',
  '1861–1944',
  1861,
  1944,
  '페르 에빈드 스빈후부드',
  'Pehr Evind Svinhufvud',
  '페르 에빈드',
  'Pehr Evind',
  '스빈후부드',
  'Svinhufvud',
  '독일 지원을 요청한 핀란드 원로원 수반',
  'Finnish Senate leader who sought German assistance',
  '1917년 핀란드 독립을 추진한 원로원을 이끌었다. 1918년 내전에서 백색정부의 수반으로 독일의 개입을 요청했고 섭정을 지냈다. 이후 1931~1937년 대통령을 역임했다.',
  'Led the Senate that pursued Finnish independence in 1917. Heading the White government during the civil war, he sought German intervention and later served as regent. He was president from 1931 to 1937.',
  'natural',
  '1944년 사망',
  'Died in 1944',
  'finland',
  '핀란드',
  'Finland',
  'finland',
  '핀란드',
  'Finland'
) ON CONFLICT (id) DO NOTHING;
INSERT INTO commulingo_person_roles (person_id, category_id) VALUES (
  'pehr-evind-svinhufvud',
  'foreign-statesman'
) ON CONFLICT DO NOTHING;
INSERT INTO commulingo_person_sections (person_id, slug, sort_order, heading_ko, heading_en, body_ko, body_en, sources) VALUES (
  'pehr-evind-svinhufvud',
  'independence-wars',
  0,
  '혁명과 독립전쟁',
  'Revolution and independence wars',
  '1917년 핀란드 독립을 추진한 원로원을 이끌었다. 1918년 내전에서 백색정부의 수반으로 독일의 개입을 요청했고 섭정을 지냈다. 이후 1931~1937년 대통령을 역임했다.',
  'Led the Senate that pursued Finnish independence in 1917. Heading the White government during the civil war, he sought German intervention and later served as regent. He was president from 1931 to 1937.',
  '["https://suomenpresidentit.fi/en/svinhufvud/"]'::jsonb
) ON CONFLICT (person_id, slug) DO NOTHING;
INSERT INTO commulingo_person_aliases (person_id, lang, alias, sort_order) VALUES (
  'pehr-evind-svinhufvud',
  'ko',
  '스빈후부드',
  0
) ON CONFLICT DO NOTHING;
INSERT INTO commulingo_person_aliases (person_id, lang, alias, sort_order) VALUES (
  'pehr-evind-svinhufvud',
  'en',
  'Svinhufvud',
  0
) ON CONFLICT DO NOTHING;
INSERT INTO commulingo_people (id, group_id, sort_order, initial, cyrillic, years_label, birth_year, death_year, name_ko, name_en, given_name_ko, given_name_en, family_name_ko, family_name_en, epithet_ko, epithet_en, bio_ko, bio_en, fate_kind, fate_label_ko, fate_label_en, citizenship_code, citizenship_label_ko, citizenship_label_en, origin_code, origin_label_ko, origin_label_en) VALUES (
  'volodymyr-vynnychenko',
  'international-revolutionary',
  191815,
  '',
  'Володимир Винниченко',
  '1880–1951',
  1880,
  1951,
  '볼로디미르 빈니첸코',
  'Volodymyr Vynnychenko',
  '볼로디미르',
  'Volodymyr',
  '빈니첸코',
  'Vynnychenko',
  '중앙라다 총서기국과 디렉토리아의 지도자',
  'Leader of the Rada’s Secretariat and the Directory',
  '우크라이나 사회주의자이자 작가로 1917년 총서기국을 이끌고 1918년 반헤트만 디렉토리아의 초대 의장을 맡았다. 연합국과의 협력 및 국가 노선을 둘러싼 갈등으로 물러났고 독립 사회주의 우크라이나를 모색했다.',
  'A Ukrainian socialist and writer, he led the General Secretariat in 1917 and became the Directory’s first chairman in 1918. He resigned amid disputes over Entente cooperation and state policy, seeking an independent socialist Ukraine.',
  'natural',
  '프랑스 망명 중 사망',
  'Died in exile in France',
  'ukraine',
  '우크라이나',
  'Ukraine',
  'ukraine',
  '우크라이나',
  'Ukraine'
) ON CONFLICT (id) DO NOTHING;
INSERT INTO commulingo_person_roles (person_id, category_id) VALUES (
  'volodymyr-vynnychenko',
  'non-soviet-revolutionary'
) ON CONFLICT DO NOTHING;
INSERT INTO commulingo_person_sections (person_id, slug, sort_order, heading_ko, heading_en, body_ko, body_en, sources) VALUES (
  'volodymyr-vynnychenko',
  'independence-wars',
  0,
  '혁명과 독립전쟁',
  'Revolution and independence wars',
  '우크라이나 사회주의자이자 작가로 1917년 총서기국을 이끌고 1918년 반헤트만 디렉토리아의 초대 의장을 맡았다. 연합국과의 협력 및 국가 노선을 둘러싼 갈등으로 물러났고 독립 사회주의 우크라이나를 모색했다.',
  'A Ukrainian socialist and writer, he led the General Secretariat in 1917 and became the Directory’s first chairman in 1918. He resigned amid disputes over Entente cooperation and state policy, seeking an independent socialist Ukraine.',
  '["https://www.encyclopediaofukraine.com/display.asp?linkpath=pages%5CV%5CY%5CVynnychenkoVolodymyr.htm"]'::jsonb
) ON CONFLICT (person_id, slug) DO NOTHING;
INSERT INTO commulingo_person_aliases (person_id, lang, alias, sort_order) VALUES (
  'volodymyr-vynnychenko',
  'ko',
  '빈니첸코',
  0
) ON CONFLICT DO NOTHING;
INSERT INTO commulingo_person_aliases (person_id, lang, alias, sort_order) VALUES (
  'volodymyr-vynnychenko',
  'en',
  'Vynnychenko',
  0
) ON CONFLICT DO NOTHING;
INSERT INTO commulingo_people (id, group_id, sort_order, initial, cyrillic, years_label, birth_year, death_year, name_ko, name_en, given_name_ko, given_name_en, family_name_ko, family_name_en, epithet_ko, epithet_en, bio_ko, bio_en, fate_kind, fate_label_ko, fate_label_en, citizenship_code, citizenship_label_ko, citizenship_label_en, origin_code, origin_label_ko, origin_label_en) VALUES (
  'mykhailo-hrushevsky',
  'scholar',
  191816,
  '',
  'Михайло Грушевський',
  '1866–1934',
  1866,
  1934,
  '미하일로 흐루셰프스키',
  'Mykhailo Hrushevsky',
  '미하일로',
  'Mykhailo',
  '흐루셰프스키',
  'Hrushevsky',
  '우크라이나 중앙라다 의장인 역사학자',
  'Historian and chairman of Ukraine’s Central Rada',
  '우크라이나 역사를 독자적인 역사로 서술한 학자로 1917~1918년 중앙라다를 이끌었다. 자치에서 독립으로 나아간 공화국의 대표자였으며 망명 뒤 소비에트 우크라이나로 돌아왔지만 탄압과 감시를 겪었다.',
  'A historian who framed Ukraine’s past as a distinct history, he chaired the Central Rada in 1917–1918 as it moved from autonomy to independence. Returning to Soviet Ukraine after exile, he faced repression and surveillance.',
  'natural',
  '1934년 사망',
  'Died in 1934',
  'ukraine',
  '우크라이나',
  'Ukraine',
  'ukraine',
  '우크라이나',
  'Ukraine'
) ON CONFLICT (id) DO NOTHING;
INSERT INTO commulingo_person_roles (person_id, category_id) VALUES (
  'mykhailo-hrushevsky',
  'scholar'
) ON CONFLICT DO NOTHING;
INSERT INTO commulingo_person_sections (person_id, slug, sort_order, heading_ko, heading_en, body_ko, body_en, sources) VALUES (
  'mykhailo-hrushevsky',
  'independence-wars',
  0,
  '혁명과 독립전쟁',
  'Revolution and independence wars',
  '우크라이나 역사를 독자적인 역사로 서술한 학자로 1917~1918년 중앙라다를 이끌었다. 자치에서 독립으로 나아간 공화국의 대표자였으며 망명 뒤 소비에트 우크라이나로 돌아왔지만 탄압과 감시를 겪었다.',
  'A historian who framed Ukraine’s past as a distinct history, he chaired the Central Rada in 1917–1918 as it moved from autonomy to independence. Returning to Soviet Ukraine after exile, he faced repression and surveillance.',
  '["https://www.encyclopediaofukraine.com/display.asp?linkpath=pages%5CH%5CR%5CHrushevskyMykhailo.htm"]'::jsonb
) ON CONFLICT (person_id, slug) DO NOTHING;
INSERT INTO commulingo_person_aliases (person_id, lang, alias, sort_order) VALUES (
  'mykhailo-hrushevsky',
  'ko',
  '흐루셰프스키',
  0
) ON CONFLICT DO NOTHING;
INSERT INTO commulingo_person_aliases (person_id, lang, alias, sort_order) VALUES (
  'mykhailo-hrushevsky',
  'en',
  'Hrushevsky',
  0
) ON CONFLICT DO NOTHING;
INSERT INTO commulingo_people (id, group_id, sort_order, initial, cyrillic, years_label, birth_year, death_year, name_ko, name_en, given_name_ko, given_name_en, family_name_ko, family_name_en, epithet_ko, epithet_en, bio_ko, bio_en, fate_kind, fate_label_ko, fate_label_en, citizenship_code, citizenship_label_ko, citizenship_label_en, origin_code, origin_label_ko, origin_label_en) VALUES (
  'nykyfor-hryhoriv',
  'international-counterrevolutionary',
  191817,
  '',
  'Никифор Григор''єв',
  'c.1885–1919',
  NULL,
  1919,
  '니키포르 흐리호리우',
  'Nykyfor Hryhoriv',
  '니키포르',
  'Nykyfor',
  '흐리호리우',
  'Hryhoriv',
  '적군과의 동맹을 뒤집은 우크라이나 아타만',
  'Ukrainian otaman who turned against his Red allies',
  '반헤트만 부대에서 디렉토리아와 적군을 거쳐 1919년 5월 반소비에트 봉기를 일으켰다. 그의 부대는 반유대인 학살을 자행했다. 7월 마흐노 측과의 충돌에서 살해됐다. 동명의 사회주의 정치인과 다른 인물이다.',
  'Moved from anti-Hetman forces through the Directory to Red service, then rebelled in May 1919. His troops committed anti-Jewish massacres. He was killed in a confrontation with Makhno’s side in July, and should not be confused with the socialist politician of a similar name.',
  'killed',
  '1919년 마흐노 측과의 충돌에서 피살',
  'Killed in a confrontation with Makhno’s side in 1919',
  'ukraine',
  '우크라이나',
  'Ukraine',
  'ukraine',
  '우크라이나',
  'Ukraine'
) ON CONFLICT (id) DO NOTHING;
INSERT INTO commulingo_person_roles (person_id, category_id) VALUES (
  'nykyfor-hryhoriv',
  'counterrevolution'
) ON CONFLICT DO NOTHING;
INSERT INTO commulingo_person_sections (person_id, slug, sort_order, heading_ko, heading_en, body_ko, body_en, sources) VALUES (
  'nykyfor-hryhoriv',
  'independence-wars',
  0,
  '혁명과 독립전쟁',
  'Revolution and independence wars',
  '반헤트만 부대에서 디렉토리아와 적군을 거쳐 1919년 5월 반소비에트 봉기를 일으켰다. 그의 부대는 반유대인 학살을 자행했다. 7월 마흐노 측과의 충돌에서 살해됐다. 동명의 사회주의 정치인과 다른 인물이다.',
  'Moved from anti-Hetman forces through the Directory to Red service, then rebelled in May 1919. His troops committed anti-Jewish massacres. He was killed in a confrontation with Makhno’s side in July, and should not be confused with the socialist politician of a similar name.',
  '["https://www.encyclopediaofukraine.com/display.asp?linkpath=pages%5CH%5CR%5CHryhorivNykyfor.htm"]'::jsonb
) ON CONFLICT (person_id, slug) DO NOTHING;
INSERT INTO commulingo_person_aliases (person_id, lang, alias, sort_order) VALUES (
  'nykyfor-hryhoriv',
  'ko',
  '흐리호리우',
  0
) ON CONFLICT DO NOTHING;
INSERT INTO commulingo_person_aliases (person_id, lang, alias, sort_order) VALUES (
  'nykyfor-hryhoriv',
  'en',
  'Hryhoriv',
  0
) ON CONFLICT DO NOTHING;
INSERT INTO commulingo_people (id, group_id, sort_order, initial, cyrillic, years_label, birth_year, death_year, name_ko, name_en, given_name_ko, given_name_en, family_name_ko, family_name_en, epithet_ko, epithet_en, bio_ko, bio_en, fate_kind, fate_label_ko, fate_label_en, citizenship_code, citizenship_label_ko, citizenship_label_en, origin_code, origin_label_ko, origin_label_en) VALUES (
  'viktor-kingissepp',
  'international-revolutionary',
  191818,
  '',
  'Viktor Kingissepp',
  '1888–1922',
  1888,
  1922,
  '빅토르 킹기세프',
  'Viktor Kingissepp',
  '빅토르',
  'Viktor',
  '킹기세프',
  'Kingissepp',
  '에스토니아 공산주의 지하조직 지도자',
  'Leader of Estonia’s communist underground',
  '1917년 혁명에 참여한 볼셰비키로 독립전쟁기 에스토니아의 공산주의 지하활동을 이끌었다. 독립 공화국의 당국에 체포되어 1922년 처형됐으며 소비에트 시대에 기념 인물이 되었다.',
  'A Bolshevik active in the 1917 revolution, he led communist underground work in Estonia during the independence struggle. Arrested by the republic’s authorities, he was executed in 1922 and became a commemorated figure under Soviet rule.',
  'executed',
  '1922년 에스토니아 당국에 의해 처형',
  'Executed by Estonian authorities in 1922',
  'estonia',
  '에스토니아',
  'Estonia',
  'estonia',
  '에스토니아',
  'Estonia'
) ON CONFLICT (id) DO NOTHING;
INSERT INTO commulingo_person_roles (person_id, category_id) VALUES (
  'viktor-kingissepp',
  'non-soviet-revolutionary'
) ON CONFLICT DO NOTHING;
INSERT INTO commulingo_person_sections (person_id, slug, sort_order, heading_ko, heading_en, body_ko, body_en, sources) VALUES (
  'viktor-kingissepp',
  'independence-wars',
  0,
  '혁명과 독립전쟁',
  'Revolution and independence wars',
  '1917년 혁명에 참여한 볼셰비키로 독립전쟁기 에스토니아의 공산주의 지하활동을 이끌었다. 독립 공화국의 당국에 체포되어 1922년 처형됐으며 소비에트 시대에 기념 인물이 되었다.',
  'A Bolshevik active in the 1917 revolution, he led communist underground work in Estonia during the independence struggle. Arrested by the republic’s authorities, he was executed in 1922 and became a commemorated figure under Soviet rule.',
  '["https://www.tallinn.ee/et/viktor-kingissepp-1888-1922-revolutsionaar"]'::jsonb
) ON CONFLICT (person_id, slug) DO NOTHING;
INSERT INTO commulingo_person_aliases (person_id, lang, alias, sort_order) VALUES (
  'viktor-kingissepp',
  'ko',
  '킹기세프',
  0
) ON CONFLICT DO NOTHING;
INSERT INTO commulingo_person_aliases (person_id, lang, alias, sort_order) VALUES (
  'viktor-kingissepp',
  'en',
  'Kingissepp',
  0
) ON CONFLICT DO NOTHING;
INSERT INTO commulingo_people (id, group_id, sort_order, initial, cyrillic, years_label, birth_year, death_year, name_ko, name_en, given_name_ko, given_name_en, family_name_ko, family_name_en, epithet_ko, epithet_en, bio_ko, bio_en, fate_kind, fate_label_ko, fate_label_en, citizenship_code, citizenship_label_ko, citizenship_label_en, origin_code, origin_label_ko, origin_label_en) VALUES (
  'jaan-anvelt',
  'international-revolutionary',
  191819,
  '',
  'Jaan Anvelt',
  '1884–1937',
  1884,
  1937,
  '얀 안벨트',
  'Jaan Anvelt',
  '얀',
  'Jaan',
  '안벨트',
  'Anvelt',
  '에스토니아 노동 코뮌의 지도자',
  'Leader of the Commune of the Working People of Estonia',
  '1918~1919년 적군의 진입과 함께 세워진 에스토니아 노동 코뮌을 이끌었다. 패배 뒤에도 공산주의 운동과 코민테른에서 활동했으며 1937년 소련에서 체포되어 심문 중 사망했다.',
  'Led the Commune established alongside the Red advance in 1918–1919. After its defeat he remained active in communism and the Comintern, and died under interrogation following Soviet arrest in 1937.',
  'murdered',
  '1937년 심문 중 사망',
  'Died under interrogation in 1937',
  'soviet',
  '소련',
  'Soviet Union',
  'estonia',
  '에스토니아',
  'Estonia'
) ON CONFLICT (id) DO NOTHING;
INSERT INTO commulingo_person_roles (person_id, category_id) VALUES (
  'jaan-anvelt',
  'non-soviet-revolutionary'
) ON CONFLICT DO NOTHING;
INSERT INTO commulingo_person_sections (person_id, slug, sort_order, heading_ko, heading_en, body_ko, body_en, sources) VALUES (
  'jaan-anvelt',
  'independence-wars',
  0,
  '혁명과 독립전쟁',
  'Revolution and independence wars',
  '1918~1919년 적군의 진입과 함께 세워진 에스토니아 노동 코뮌을 이끌었다. 패배 뒤에도 공산주의 운동과 코민테른에서 활동했으며 1937년 소련에서 체포되어 심문 중 사망했다.',
  'Led the Commune established alongside the Red advance in 1918–1919. After its defeat he remained active in communism and the Comintern, and died under interrogation following Soviet arrest in 1937.',
  '["https://sisu.ut.ee/ewod/e/eessaare/"]'::jsonb
) ON CONFLICT (person_id, slug) DO NOTHING;
INSERT INTO commulingo_person_aliases (person_id, lang, alias, sort_order) VALUES (
  'jaan-anvelt',
  'ko',
  '안벨트',
  0
) ON CONFLICT DO NOTHING;
INSERT INTO commulingo_person_aliases (person_id, lang, alias, sort_order) VALUES (
  'jaan-anvelt',
  'en',
  'Anvelt',
  0
) ON CONFLICT DO NOTHING;
INSERT INTO commulingo_history_event_people (event_id, person_id, sort_order, relation_kind, relation_ko, relation_en, note_ko, note_en) VALUES (
  'brest-litovsk',
  'lenin',
  0,
  'leader',
  '즉시 강화 지지자',
  'Advocate of immediate peace',
  '즉시 강화 지지자로 이 사건에 관여했다.',
  'Involved in this event as advocate of immediate peace.'
) ON CONFLICT (event_id, person_id) DO NOTHING;
INSERT INTO commulingo_history_event_people (event_id, person_id, sort_order, relation_kind, relation_ko, relation_en, note_ko, note_en) VALUES (
  'brest-litovsk',
  'trotsky',
  1,
  'leader',
  '강화 협상 대표',
  'Peace negotiator',
  '강화 협상 대표로 이 사건에 관여했다.',
  'Involved in this event as peace negotiator.'
) ON CONFLICT (event_id, person_id) DO NOTHING;
INSERT INTO commulingo_history_event_people (event_id, person_id, sort_order, relation_kind, relation_ko, relation_en, note_ko, note_en) VALUES (
  'brest-litovsk',
  'bukharin',
  2,
  'opponent',
  '혁명전쟁 지지자',
  'Advocate of revolutionary war',
  '혁명전쟁 지지자로 이 사건에 관여했다.',
  'Involved in this event as advocate of revolutionary war.'
) ON CONFLICT (event_id, person_id) DO NOTHING;
INSERT INTO commulingo_history_event_people (event_id, person_id, sort_order, relation_kind, relation_ko, relation_en, note_ko, note_en) VALUES (
  'brest-litovsk',
  'sokolnikov',
  3,
  'participant',
  '3월 조약 서명 대표',
  'Head of the March signing delegation',
  '3월 조약 서명 대표로 이 사건에 관여했다.',
  'Involved in this event as head of the March signing delegation.'
) ON CONFLICT (event_id, person_id) DO NOTHING;
INSERT INTO commulingo_history_event_people (event_id, person_id, sort_order, relation_kind, relation_ko, relation_en, note_ko, note_en) VALUES (
  'brest-litovsk',
  'adolph-joffe',
  4,
  'participant',
  '초기 협상 대표',
  'Initial Soviet negotiator',
  '초기 협상 대표로 이 사건에 관여했다.',
  'Involved in this event as initial Soviet negotiator.'
) ON CONFLICT (event_id, person_id) DO NOTHING;
INSERT INTO commulingo_history_event_people (event_id, person_id, sort_order, relation_kind, relation_ko, relation_en, note_ko, note_en) VALUES (
  'brest-litovsk',
  'max-hoffmann',
  5,
  'participant',
  '독일군 협상 대표',
  'German military negotiator',
  '독일군 협상 대표로 이 사건에 관여했다.',
  'Involved in this event as german military negotiator.'
) ON CONFLICT (event_id, person_id) DO NOTHING;
INSERT INTO commulingo_history_event_people (event_id, person_id, sort_order, relation_kind, relation_ko, relation_en, note_ko, note_en) VALUES (
  'brest-litovsk',
  'maria-spiridonova',
  6,
  'opponent',
  '강화에 반대한 좌파 에스에르 지도자',
  'Left SR leader opposing peace',
  '강화에 반대한 좌파 에스에르 지도자로 이 사건에 관여했다.',
  'Involved in this event as left SR leader opposing peace.'
) ON CONFLICT (event_id, person_id) DO NOTHING;
INSERT INTO commulingo_history_event_people (event_id, person_id, sort_order, relation_kind, relation_ko, relation_en, note_ko, note_en) VALUES (
  'brest-litovsk',
  'yakov-blumkin',
  7,
  'participant',
  '독일 대사 암살 가담자',
  'Participant in the German ambassador’s assassination',
  '독일 대사 암살 가담자로 이 사건에 관여했다.',
  'Involved in this event as participant in the German ambassador’s assassination.'
) ON CONFLICT (event_id, person_id) DO NOTHING;
INSERT INTO commulingo_history_event_people (event_id, person_id, sort_order, relation_kind, relation_ko, relation_en, note_ko, note_en) VALUES (
  'brest-litovsk',
  'pavlo-skoropadskyi',
  8,
  'leader',
  '독일의 지원을 받은 헤트만',
  'German-backed Hetman',
  '독일의 지원을 받은 헤트만로 이 사건에 관여했다.',
  'Involved in this event as german-backed Hetman.'
) ON CONFLICT (event_id, person_id) DO NOTHING;
INSERT INTO commulingo_history_event_people (event_id, person_id, sort_order, relation_kind, relation_ko, relation_en, note_ko, note_en) VALUES (
  'brest-litovsk',
  'carl-gustaf-emil-mannerheim',
  9,
  'leader',
  '핀란드 백군 사령관',
  'Finnish White commander',
  '핀란드 백군 사령관로 이 사건에 관여했다.',
  'Involved in this event as finnish White commander.'
) ON CONFLICT (event_id, person_id) DO NOTHING;
INSERT INTO commulingo_history_event_people (event_id, person_id, sort_order, relation_kind, relation_ko, relation_en, note_ko, note_en) VALUES (
  'brest-litovsk',
  'carl-manner',
  10,
  'leader',
  '핀란드 적색정부 수반',
  'Head of Finland’s Red government',
  '핀란드 적색정부 수반로 이 사건에 관여했다.',
  'Involved in this event as head of Finland’s Red government.'
) ON CONFLICT (event_id, person_id) DO NOTHING;
INSERT INTO commulingo_history_event_people (event_id, person_id, sort_order, relation_kind, relation_ko, relation_en, note_ko, note_en) VALUES (
  'brest-litovsk',
  'kuusinen',
  11,
  'leader',
  '핀란드 적색정부 지도자',
  'Finnish Red government leader',
  '핀란드 적색정부 지도자로 이 사건에 관여했다.',
  'Involved in this event as finnish Red government leader.'
) ON CONFLICT (event_id, person_id) DO NOTHING;
INSERT INTO commulingo_history_event_people (event_id, person_id, sort_order, relation_kind, relation_ko, relation_en, note_ko, note_en) VALUES (
  'baltic-wars-of-independence',
  'peteris-stucka',
  12,
  'leader',
  '소비에트 라트비아 정부 수반',
  'Head of Soviet Latvia',
  '소비에트 라트비아 정부 수반로 이 사건에 관여했다.',
  'Involved in this event as head of Soviet Latvia.'
) ON CONFLICT (event_id, person_id) DO NOTHING;
INSERT INTO commulingo_history_event_people (event_id, person_id, sort_order, relation_kind, relation_ko, relation_en, note_ko, note_en) VALUES (
  'baltic-wars-of-independence',
  'nikolai-yudenich',
  13,
  'leader',
  '에스토니아를 기지로 삼은 북서군 사령관',
  'Northwestern Army commander based in Estonia',
  '에스토니아를 기지로 삼은 북서군 사령관로 이 사건에 관여했다.',
  'Involved in this event as northwestern Army commander based in Estonia.'
) ON CONFLICT (event_id, person_id) DO NOTHING;
INSERT INTO commulingo_history_event_people (event_id, person_id, sort_order, relation_kind, relation_ko, relation_en, note_ko, note_en) VALUES (
  'baltic-wars-of-independence',
  'adolph-joffe',
  14,
  'participant',
  '타르투 강화의 소비에트 협상 대표',
  'Soviet negotiator at Tartu',
  '타르투 강화의 소비에트 협상 대표로 이 사건에 관여했다.',
  'Involved in this event as soviet negotiator at Tartu.'
) ON CONFLICT (event_id, person_id) DO NOTHING;
INSERT INTO commulingo_history_event_people (event_id, person_id, sort_order, relation_kind, relation_ko, relation_en, note_ko, note_en) VALUES (
  'baltic-wars-of-independence',
  'chicherin',
  15,
  'leader',
  '국경 강화의 소비에트 외교 책임자',
  'Soviet foreign affairs leader in border negotiations',
  '국경 강화의 소비에트 외교 책임자로 이 사건에 관여했다.',
  'Involved in this event as soviet foreign affairs leader in border negotiations.'
) ON CONFLICT (event_id, person_id) DO NOTHING;
INSERT INTO commulingo_history_event_people (event_id, person_id, sort_order, relation_kind, relation_ko, relation_en, note_ko, note_en) VALUES (
  'baltic-wars-of-independence',
  'jozef-pilsudski',
  16,
  'leader',
  '라트비아 협력과 빌뉴스 정책의 폴란드 지도자',
  'Polish leader of Latvian cooperation and Vilnius policy',
  '라트비아 협력과 빌뉴스 정책의 폴란드 지도자로 이 사건에 관여했다.',
  'Involved in this event as polish leader of Latvian cooperation and Vilnius policy.'
) ON CONFLICT (event_id, person_id) DO NOTHING;
INSERT INTO commulingo_history_event_people (event_id, person_id, sort_order, relation_kind, relation_ko, relation_en, note_ko, note_en) VALUES (
  'baltic-wars-of-independence',
  'fyodor-raskolnikov',
  17,
  'participant',
  '영국군과 교전하다 포로가 된 해군 지휘관',
  'Naval commander captured fighting British forces',
  '영국군과 교전하다 포로가 된 해군 지휘관로 이 사건에 관여했다.',
  'Involved in this event as naval commander captured fighting British forces.'
) ON CONFLICT (event_id, person_id) DO NOTHING;
INSERT INTO commulingo_history_event_people (event_id, person_id, sort_order, relation_kind, relation_ko, relation_en, note_ko, note_en) VALUES (
  'ukraine-1917-1921',
  'pavlo-skoropadskyi',
  18,
  'leader',
  '우크라이나국 헤트만',
  'Hetman of the Ukrainian State',
  '우크라이나국 헤트만로 이 사건에 관여했다.',
  'Involved in this event as hetman of the Ukrainian State.'
) ON CONFLICT (event_id, person_id) DO NOTHING;
INSERT INTO commulingo_history_event_people (event_id, person_id, sort_order, relation_kind, relation_ko, relation_en, note_ko, note_en) VALUES (
  'ukraine-1917-1921',
  'symon-petliura',
  19,
  'leader',
  '디렉토리아와 인민공화국군 지도자',
  'Directory and republican army leader',
  '디렉토리아와 인민공화국군 지도자로 이 사건에 관여했다.',
  'Involved in this event as directory and republican army leader.'
) ON CONFLICT (event_id, person_id) DO NOTHING;
INSERT INTO commulingo_history_event_people (event_id, person_id, sort_order, relation_kind, relation_ko, relation_en, note_ko, note_en) VALUES (
  'ukraine-1917-1921',
  'nestor-makhno',
  20,
  'leader',
  '아나키스트 혁명반란군 지도자',
  'Anarchist insurgent army leader',
  '아나키스트 혁명반란군 지도자로 이 사건에 관여했다.',
  'Involved in this event as anarchist insurgent army leader.'
) ON CONFLICT (event_id, person_id) DO NOTHING;
INSERT INTO commulingo_history_event_people (event_id, person_id, sort_order, relation_kind, relation_ko, relation_en, note_ko, note_en) VALUES (
  'ukraine-1917-1921',
  'volin',
  21,
  'participant',
  '나바트와 마흐노 운동의 활동가',
  'Nabat and Makhnovist activist',
  '나바트와 마흐노 운동의 활동가로 이 사건에 관여했다.',
  'Involved in this event as nabat and Makhnovist activist.'
) ON CONFLICT (event_id, person_id) DO NOTHING;
INSERT INTO commulingo_history_event_people (event_id, person_id, sort_order, relation_kind, relation_ko, relation_en, note_ko, note_en) VALUES (
  'ukraine-1917-1921',
  'anton-denikin',
  22,
  'leader',
  '우크라이나 독립을 거부한 백군 사령관',
  'White commander rejecting Ukrainian independence',
  '우크라이나 독립을 거부한 백군 사령관로 이 사건에 관여했다.',
  'Involved in this event as white commander rejecting Ukrainian independence.'
) ON CONFLICT (event_id, person_id) DO NOTHING;
INSERT INTO commulingo_history_event_people (event_id, person_id, sort_order, relation_kind, relation_ko, relation_en, note_ko, note_en) VALUES (
  'ukraine-1917-1921',
  'antonov-ovseenko',
  23,
  'leader',
  '우크라이나의 소비에트군 지휘관',
  'Soviet commander in Ukraine',
  '우크라이나의 소비에트군 지휘관로 이 사건에 관여했다.',
  'Involved in this event as soviet commander in Ukraine.'
) ON CONFLICT (event_id, person_id) DO NOTHING;
INSERT INTO commulingo_history_event_people (event_id, person_id, sort_order, relation_kind, relation_ko, relation_en, note_ko, note_en) VALUES (
  'ukraine-1917-1921',
  'christian-rakovsky',
  24,
  'leader',
  '소비에트 우크라이나 정부 수반',
  'Head of Soviet Ukraine’s government',
  '소비에트 우크라이나 정부 수반로 이 사건에 관여했다.',
  'Involved in this event as head of Soviet Ukraine’s government.'
) ON CONFLICT (event_id, person_id) DO NOTHING;
INSERT INTO commulingo_history_event_people (event_id, person_id, sort_order, relation_kind, relation_ko, relation_en, note_ko, note_en) VALUES (
  'ukraine-1917-1921',
  'jozef-pilsudski',
  25,
  'leader',
  '1920년 페틀류라의 폴란드 동맹자',
  'Petliura’s Polish ally in 1920',
  '1920년 페틀류라의 폴란드 동맹자로 이 사건에 관여했다.',
  'Involved in this event as petliura’s Polish ally in 1920.'
) ON CONFLICT (event_id, person_id) DO NOTHING;
INSERT INTO commulingo_history_event_people (event_id, person_id, sort_order, relation_kind, relation_ko, relation_en, note_ko, note_en) VALUES (
  'ukraine-1917-1921',
  'evgenia-bosch',
  26,
  'leader',
  '우크라이나 초기 소비에트 정부 지도자',
  'Early Soviet Ukrainian government leader',
  '우크라이나 초기 소비에트 정부 지도자로 이 사건에 관여했다.',
  'Involved in this event as early Soviet Ukrainian government leader.'
) ON CONFLICT (event_id, person_id) DO NOTHING;
INSERT INTO commulingo_history_event_people (event_id, person_id, sort_order, relation_kind, relation_ko, relation_en, note_ko, note_en) VALUES (
  'ukraine-1917-1921',
  'vladimir-vernadsky',
  27,
  'witness',
  '헤트만기 과학아카데미 창설자',
  'Academy founder under the Hetmanate',
  '헤트만기 과학아카데미 창설자로 이 사건에 관여했다.',
  'Involved in this event as academy founder under the Hetmanate.'
) ON CONFLICT (event_id, person_id) DO NOTHING;
INSERT INTO commulingo_history_event_people (event_id, person_id, sort_order, relation_kind, relation_ko, relation_en, note_ko, note_en) VALUES (
  'ukraine-1917-1921',
  'artyom-sergeyev',
  28,
  'leader',
  '도네츠크-크리보이로크 소비에트 공화국 지도자',
  'Donetsk–Krivoy Rog Soviet republic leader',
  '도네츠크-크리보이로크 소비에트 공화국 지도자로 이 사건에 관여했다.',
  'Involved in this event as donetsk–Krivoy Rog Soviet republic leader.'
) ON CONFLICT (event_id, person_id) DO NOTHING;
INSERT INTO commulingo_history_event_people (event_id, person_id, sort_order, relation_kind, relation_ko, relation_en, note_ko, note_en) VALUES (
  'baltic-wars-of-independence',
  'konstantin-pats',
  29,
  'leader',
  '에스토니아 독립전쟁 초기 정부 수반',
  'Estonian government leader early in the independence war',
  '독립전쟁 초기에 에스토니아 정부를 이끌었다. 1934년 라이도네르와 함께 권위주의 체제를 세웠고, 1940년 소련 점령 뒤 강제이송되어 구금 중 사망했다.',
  'Led Estonia’s government early in the independence war. He established authoritarian rule with Laidoner in 1934 and died in Soviet custody after deportation following the 1940 occupation.'
) ON CONFLICT (event_id, person_id) DO NOTHING;
INSERT INTO commulingo_history_event_people (event_id, person_id, sort_order, relation_kind, relation_ko, relation_en, note_ko, note_en) VALUES (
  'baltic-wars-of-independence',
  'johan-laidoner',
  30,
  'leader',
  '에스토니아 독립전쟁 총사령관',
  'Estonian commander-in-chief in the independence war',
  '에스토니아군의 반격과 북라트비아 작전을 지휘했다. 유데니치군과 조건부로 협력했으며, 1934년 페츠의 쿠데타를 도왔다. 소련에 강제이송된 뒤 감옥에서 사망했다.',
  'Commanded Estonia’s counteroffensive and operations in northern Latvia, cooperating conditionally with Yudenich. He supported Päts’s 1934 coup and died in prison after Soviet deportation.'
) ON CONFLICT (event_id, person_id) DO NOTHING;
INSERT INTO commulingo_history_event_people (event_id, person_id, sort_order, relation_kind, relation_ko, relation_en, note_ko, note_en) VALUES (
  'baltic-wars-of-independence',
  'jaan-tonisson',
  31,
  'leader',
  '타르투 강화기의 에스토니아 총리',
  'Estonian prime minister during the Tartu settlement',
  '언론인이자 자유주의 정치인으로 1919~1920년 총리를 지냈다. 그의 정부 아래 러시아와 타르투 강화가 체결됐다. 소련 점령 뒤 체포되어 실종됐으며 1941년 사망한 것으로 추정된다.',
  'A journalist and liberal politician, he was prime minister in 1919–1920 when Estonia concluded the Treaty of Tartu. Arrested after Soviet occupation, he disappeared and is presumed to have died in 1941.'
) ON CONFLICT (event_id, person_id) DO NOTHING;
INSERT INTO commulingo_history_event_people (event_id, person_id, sort_order, relation_kind, relation_ko, relation_en, note_ko, note_en) VALUES (
  'baltic-wars-of-independence',
  'karlis-ulmanis',
  32,
  'leader',
  '라트비아 독립전쟁기의 총리',
  'Latvian prime minister during the independence war',
  '1918년 임시정부를 이끌었고 소비에트군과 친독 정권, 베르몬트군에 맞서 공화국을 지켰다. 1934년 쿠데타로 독재를 수립했으며 소련 점령 뒤 강제이송되어 사망했다.',
  'Led the provisional government from 1918 against Soviet forces, a pro-German rival government and Bermondt’s army. He established a dictatorship in 1934 and died after Soviet deportation.'
) ON CONFLICT (event_id, person_id) DO NOTHING;
INSERT INTO commulingo_history_event_people (event_id, person_id, sort_order, relation_kind, relation_ko, relation_en, note_ko, note_en) VALUES (
  'baltic-wars-of-independence',
  'andrievs-niedra',
  33,
  'leader',
  '1919년 친독 라트비아 정부 수반',
  'Head of Latvia’s pro-German government in 1919',
  '목사이자 작가로 1919년 리예파야 쿠데타 뒤 친독 정부를 이끌었다. 체시스 전투 이후 정권이 무너졌으며, 독립 라트비아에서 반역죄로 재판받고 독일로 추방됐다.',
  'A pastor and writer, he headed the pro-German government formed after the Liepāja coup. His government fell after Cēsis; independent Latvia later tried him for treason and expelled him to Germany.'
) ON CONFLICT (event_id, person_id) DO NOTHING;
INSERT INTO commulingo_history_event_people (event_id, person_id, sort_order, relation_kind, relation_ko, relation_en, note_ko, note_en) VALUES (
  'baltic-wars-of-independence',
  'zigfrids-meierovics',
  34,
  'participant',
  '라트비아 독립 승인을 이끈 외교관',
  'Diplomat securing recognition for independent Latvia',
  '라트비아의 초대 외무장관으로 독립전쟁 동안 연합국의 지원과 국제 승인을 추구했다. 이후 총리도 지냈으며 1925년 교통사고로 사망했다.',
  'Latvia’s first foreign minister, he sought Allied support and international recognition during the independence war. He later served as prime minister and died in a traffic accident in 1925.'
) ON CONFLICT (event_id, person_id) DO NOTHING;
INSERT INTO commulingo_history_event_people (event_id, person_id, sort_order, relation_kind, relation_ko, relation_en, note_ko, note_en) VALUES (
  'baltic-wars-of-independence',
  'rudiger-von-der-goltz',
  35,
  'leader',
  '핀란드와 발트의 독일군 지휘관',
  'German commander in Finland and the Baltic',
  '1918년 발트 사단을 이끌고 핀란드 백군을 지원했다. 1919년에는 라트비아의 독일군과 자유군단을 지휘했으며 반볼셰비키 전쟁을 독일의 발트 영향력 유지와 결합했다.',
  'Led the Baltic Sea Division supporting Finland’s Whites in 1918. In Latvia in 1919 he commanded German forces and Freikorps, combining anti-Bolshevik warfare with efforts to retain German influence.'
) ON CONFLICT (event_id, person_id) DO NOTHING;
INSERT INTO commulingo_history_event_people (event_id, person_id, sort_order, relation_kind, relation_ko, relation_en, note_ko, note_en) VALUES (
  'brest-litovsk',
  'rudiger-von-der-goltz',
  36,
  'leader',
  '핀란드 파병 발트 사단장',
  'Commander of the Baltic Sea Division in Finland',
  '핀란드 파병 발트 사단장로 이 사건에 관여했다.',
  'Involved in this event as commander of the Baltic Sea Division in Finland.'
) ON CONFLICT (event_id, person_id) DO NOTHING;
INSERT INTO commulingo_history_event_people (event_id, person_id, sort_order, relation_kind, relation_ko, relation_en, note_ko, note_en) VALUES (
  'baltic-wars-of-independence',
  'pavel-bermondt-avalov',
  37,
  'leader',
  '리가를 공격한 서러시아 의용군 사령관',
  'West Russian Volunteer Army commander who attacked Riga',
  '독일계 병력을 대거 받아들인 서러시아 의용군을 지휘했다. 반볼셰비키를 표방했으나 1919년 라트비아·리투아니아의 독립군과 싸웠고 리가 공격 실패 뒤 망명했다.',
  'Commanded the West Russian Volunteer Army, incorporating many German soldiers. Despite an anti-Bolshevik banner, he fought Latvian and Lithuanian forces in 1919 and went into exile after failing at Riga. Accounts of his ethnic background differ.'
) ON CONFLICT (event_id, person_id) DO NOTHING;
INSERT INTO commulingo_history_event_people (event_id, person_id, sort_order, relation_kind, relation_ko, relation_en, note_ko, note_en) VALUES (
  'baltic-wars-of-independence',
  'antanas-smetona',
  38,
  'leader',
  '리투아니아 초대 대통령',
  'Lithuania’s first president',
  '리투아니아 평의회 의장으로 1918년 독립 선언에 참여하고 1919년 초대 대통령이 됐다. 1926년 쿠데타 뒤 권위주의 통치를 이끌었으며 소련 점령 뒤 망명해 미국에서 화재로 사망했다.',
  'Chaired Lithuania’s Council, signed the 1918 independence act and became its first president in 1919. He led authoritarian rule after the 1926 coup and died in a fire in American exile after Soviet occupation.'
) ON CONFLICT (event_id, person_id) DO NOTHING;
INSERT INTO commulingo_history_event_people (event_id, person_id, sort_order, relation_kind, relation_ko, relation_en, note_ko, note_en) VALUES (
  'baltic-wars-of-independence',
  'augustinas-voldemaras',
  39,
  'leader',
  '리투아니아 초대 총리와 외무장관',
  'Lithuania’s first prime minister and foreign minister',
  '1918년 초대 내각을 이끌고 독립전쟁기에 외무장관으로 활동했다. 1926년 쿠데타 뒤 다시 총리가 됐으나 스메토나와 결별했다. 소련 점령 뒤 체포되어 감옥에서 사망했다.',
  'Headed the first cabinet in 1918 and served as foreign minister during the independence wars. Prime minister again after the 1926 coup, he later broke with Smetona and died in Soviet imprisonment.'
) ON CONFLICT (event_id, person_id) DO NOTHING;
INSERT INTO commulingo_history_event_people (event_id, person_id, sort_order, relation_kind, relation_ko, relation_en, note_ko, note_en) VALUES (
  'baltic-wars-of-independence',
  'vincas-kapsukas',
  40,
  'leader',
  '리투아니아와 리트벨의 소비에트 정부 지도자',
  'Leader of Soviet Lithuania and Litbel',
  '리투아니아 공산주의자로 1918~1919년 소비에트 리투아니아와 리투아니아-벨로루시 소비에트 공화국 정부를 이끌었다. 군사적 패배 뒤 소비에트 러시아로 옮겨 코민테른에서 활동했다.',
  'A Lithuanian communist, he led the governments of Soviet Lithuania and the Lithuanian-Belorussian Soviet republic in 1918–1919. After military defeat he moved to Soviet Russia and worked in the Comintern.'
) ON CONFLICT (event_id, person_id) DO NOTHING;
INSERT INTO commulingo_history_event_people (event_id, person_id, sort_order, relation_kind, relation_ko, relation_en, note_ko, note_en) VALUES (
  'baltic-wars-of-independence',
  'zigmas-angarietis',
  41,
  'participant',
  '소비에트 리투아니아의 내무 인민위원',
  'Interior commissar of Soviet Lithuania',
  '리투아니아 공산당의 지도자로 1918~1919년 소비에트 국가 수립에 참여했다. 망명 뒤 코민테른에서 일했고 스탈린기 탄압으로 체포되어 1940년 처형됐다.',
  'A Lithuanian Communist Party leader, he participated in Soviet state-building in 1918–1919. He worked in the Comintern after exile and was arrested during Stalinist repression and executed in 1940.'
) ON CONFLICT (event_id, person_id) DO NOTHING;
INSERT INTO commulingo_history_event_people (event_id, person_id, sort_order, relation_kind, relation_ko, relation_en, note_ko, note_en) VALUES (
  'baltic-wars-of-independence',
  'lucjan-zeligowski',
  42,
  'leader',
  '빌뉴스를 점령한 폴란드 장군',
  'Polish general who seized Vilnius',
  '러시아 제국군 출신으로 폴란드군을 지휘했다. 1920년 10월 피우수트스키와 협의해 항명을 가장하고 빌뉴스를 점령한 뒤 중부 리투아니아를 수립했다. 훗날 폴란드 군사장관을 지냈다.',
  'A former imperial Russian officer, he commanded Polish troops. In October 1920, in agreement with Piłsudski, he staged a mutiny, seized Vilnius and established Central Lithuania. He later served as Poland’s minister of military affairs.'
) ON CONFLICT (event_id, person_id) DO NOTHING;
INSERT INTO commulingo_history_event_people (event_id, person_id, sort_order, relation_kind, relation_ko, relation_en, note_ko, note_en) VALUES (
  'soviet-polish-war',
  'lucjan-zeligowski',
  43,
  'participant',
  '빌뉴스를 점령한 폴란드 장군',
  'Polish general who seized Vilnius',
  '러시아 제국군 출신으로 폴란드군을 지휘했다. 1920년 10월 피우수트스키와 협의해 항명을 가장하고 빌뉴스를 점령한 뒤 중부 리투아니아를 수립했다. 훗날 폴란드 군사장관을 지냈다.',
  'A former imperial Russian officer, he commanded Polish troops. In October 1920, in agreement with Piłsudski, he staged a mutiny, seized Vilnius and established Central Lithuania. He later served as Poland’s minister of military affairs.'
) ON CONFLICT (event_id, person_id) DO NOTHING;
INSERT INTO commulingo_history_event_people (event_id, person_id, sort_order, relation_kind, relation_ko, relation_en, note_ko, note_en) VALUES (
  'baltic-wars-of-independence',
  'stanislaw-bulak-balachowicz',
  44,
  'leader',
  '에스토니아에서 벨로루시로 옮겨간 반소비에트 지휘관',
  'Anti-Soviet commander from Estonia to Belarus',
  '적군에서 백군으로 옮겨 에스토니아 전선에서 싸웠고 이후 폴란드와 협력했다. 1920년 휴전 뒤 독자적으로 벌인 벨로루시 원정은 실패했다. 그의 부대가 자행한 반유대인 폭력도 전쟁 기록의 일부다.',
  'Changed from Red to White service, fought on the Estonian front and later cooperated with Poland. His independent Belarusian expedition after the 1920 armistice failed. His troops’ anti-Jewish violence is also part of the war’s record.'
) ON CONFLICT (event_id, person_id) DO NOTHING;
INSERT INTO commulingo_history_event_people (event_id, person_id, sort_order, relation_kind, relation_ko, relation_en, note_ko, note_en) VALUES (
  'soviet-polish-war',
  'stanislaw-bulak-balachowicz',
  45,
  'participant',
  '에스토니아에서 벨로루시로 옮겨간 반소비에트 지휘관',
  'Anti-Soviet commander from Estonia to Belarus',
  '적군에서 백군으로 옮겨 에스토니아 전선에서 싸웠고 이후 폴란드와 협력했다. 1920년 휴전 뒤 독자적으로 벌인 벨로루시 원정은 실패했다. 그의 부대가 자행한 반유대인 폭력도 전쟁 기록의 일부다.',
  'Changed from Red to White service, fought on the Estonian front and later cooperated with Poland. His independent Belarusian expedition after the 1920 armistice failed. His troops’ anti-Jewish violence is also part of the war’s record.'
) ON CONFLICT (event_id, person_id) DO NOTHING;
INSERT INTO commulingo_history_event_people (event_id, person_id, sort_order, relation_kind, relation_ko, relation_en, note_ko, note_en) VALUES (
  'brest-litovsk',
  'pehr-evind-svinhufvud',
  46,
  'leader',
  '독일 지원을 요청한 핀란드 원로원 수반',
  'Finnish Senate leader who sought German assistance',
  '1917년 핀란드 독립을 추진한 원로원을 이끌었다. 1918년 내전에서 백색정부의 수반으로 독일의 개입을 요청했고 섭정을 지냈다. 이후 1931~1937년 대통령을 역임했다.',
  'Led the Senate that pursued Finnish independence in 1917. Heading the White government during the civil war, he sought German intervention and later served as regent. He was president from 1931 to 1937.'
) ON CONFLICT (event_id, person_id) DO NOTHING;
INSERT INTO commulingo_history_event_people (event_id, person_id, sort_order, relation_kind, relation_ko, relation_en, note_ko, note_en) VALUES (
  'ukraine-1917-1921',
  'volodymyr-vynnychenko',
  47,
  'leader',
  '중앙라다 총서기국과 디렉토리아의 지도자',
  'Leader of the Rada’s Secretariat and the Directory',
  '우크라이나 사회주의자이자 작가로 1917년 총서기국을 이끌고 1918년 반헤트만 디렉토리아의 초대 의장을 맡았다. 연합국과의 협력 및 국가 노선을 둘러싼 갈등으로 물러났고 독립 사회주의 우크라이나를 모색했다.',
  'A Ukrainian socialist and writer, he led the General Secretariat in 1917 and became the Directory’s first chairman in 1918. He resigned amid disputes over Entente cooperation and state policy, seeking an independent socialist Ukraine.'
) ON CONFLICT (event_id, person_id) DO NOTHING;
INSERT INTO commulingo_history_event_people (event_id, person_id, sort_order, relation_kind, relation_ko, relation_en, note_ko, note_en) VALUES (
  'ukraine-1917-1921',
  'mykhailo-hrushevsky',
  48,
  'leader',
  '우크라이나 중앙라다 의장인 역사학자',
  'Historian and chairman of Ukraine’s Central Rada',
  '우크라이나 역사를 독자적인 역사로 서술한 학자로 1917~1918년 중앙라다를 이끌었다. 자치에서 독립으로 나아간 공화국의 대표자였으며 망명 뒤 소비에트 우크라이나로 돌아왔지만 탄압과 감시를 겪었다.',
  'A historian who framed Ukraine’s past as a distinct history, he chaired the Central Rada in 1917–1918 as it moved from autonomy to independence. Returning to Soviet Ukraine after exile, he faced repression and surveillance.'
) ON CONFLICT (event_id, person_id) DO NOTHING;
INSERT INTO commulingo_history_event_people (event_id, person_id, sort_order, relation_kind, relation_ko, relation_en, note_ko, note_en) VALUES (
  'ukraine-1917-1921',
  'nykyfor-hryhoriv',
  49,
  'leader',
  '적군과의 동맹을 뒤집은 우크라이나 아타만',
  'Ukrainian otaman who turned against his Red allies',
  '반헤트만 부대에서 디렉토리아와 적군을 거쳐 1919년 5월 반소비에트 봉기를 일으켰다. 그의 부대는 반유대인 학살을 자행했다. 7월 마흐노 측과의 충돌에서 살해됐다. 동명의 사회주의 정치인과 다른 인물이다.',
  'Moved from anti-Hetman forces through the Directory to Red service, then rebelled in May 1919. His troops committed anti-Jewish massacres. He was killed in a confrontation with Makhno’s side in July, and should not be confused with the socialist politician of a similar name.'
) ON CONFLICT (event_id, person_id) DO NOTHING;
INSERT INTO commulingo_history_event_people (event_id, person_id, sort_order, relation_kind, relation_ko, relation_en, note_ko, note_en) VALUES (
  'baltic-wars-of-independence',
  'viktor-kingissepp',
  50,
  'participant',
  '에스토니아 공산주의 지하조직 지도자',
  'Leader of Estonia’s communist underground',
  '1917년 혁명에 참여한 볼셰비키로 독립전쟁기 에스토니아의 공산주의 지하활동을 이끌었다. 독립 공화국의 당국에 체포되어 1922년 처형됐으며 소비에트 시대에 기념 인물이 되었다.',
  'A Bolshevik active in the 1917 revolution, he led communist underground work in Estonia during the independence struggle. Arrested by the republic’s authorities, he was executed in 1922 and became a commemorated figure under Soviet rule.'
) ON CONFLICT (event_id, person_id) DO NOTHING;
INSERT INTO commulingo_history_event_people (event_id, person_id, sort_order, relation_kind, relation_ko, relation_en, note_ko, note_en) VALUES (
  'baltic-wars-of-independence',
  'jaan-anvelt',
  51,
  'leader',
  '에스토니아 노동 코뮌의 지도자',
  'Leader of the Commune of the Working People of Estonia',
  '1918~1919년 적군의 진입과 함께 세워진 에스토니아 노동 코뮌을 이끌었다. 패배 뒤에도 공산주의 운동과 코민테른에서 활동했으며 1937년 소련에서 체포되어 심문 중 사망했다.',
  'Led the Commune established alongside the Red advance in 1918–1919. After its defeat he remained active in communism and the Comintern, and died under interrogation following Soviet arrest in 1937.'
) ON CONFLICT (event_id, person_id) DO NOTHING;
INSERT INTO commulingo_history_event_people (event_id, person_id, sort_order, relation_kind, relation_ko, relation_en, note_ko, note_en) VALUES (
  'brest-litovsk',
  'volodymyr-vynnychenko',
  52,
  'leader',
  '중앙라다의 우크라이나 지도자',
  'Ukrainian Central Rada leader',
  '우크라이나 사회주의자이자 작가로 1917년 총서기국을 이끌고 1918년 반헤트만 디렉토리아의 초대 의장을 맡았다. 연합국과의 협력 및 국가 노선을 둘러싼 갈등으로 물러났고 독립 사회주의 우크라이나를 모색했다.',
  'A Ukrainian socialist and writer, he led the General Secretariat in 1917 and became the Directory’s first chairman in 1918. He resigned amid disputes over Entente cooperation and state policy, seeking an independent socialist Ukraine.'
) ON CONFLICT (event_id, person_id) DO NOTHING;
INSERT INTO commulingo_history_event_people (event_id, person_id, sort_order, relation_kind, relation_ko, relation_en, note_ko, note_en) VALUES (
  'brest-litovsk',
  'mykhailo-hrushevsky',
  53,
  'leader',
  '중앙라다의 우크라이나 지도자',
  'Ukrainian Central Rada leader',
  '우크라이나 역사를 독자적인 역사로 서술한 학자로 1917~1918년 중앙라다를 이끌었다. 자치에서 독립으로 나아간 공화국의 대표자였으며 망명 뒤 소비에트 우크라이나로 돌아왔지만 탄압과 감시를 겪었다.',
  'A historian who framed Ukraine’s past as a distinct history, he chaired the Central Rada in 1917–1918 as it moved from autonomy to independence. Returning to Soviet Ukraine after exile, he faced repression and surveillance.'
) ON CONFLICT (event_id, person_id) DO NOTHING;
INSERT INTO commulingo_history_event_people (event_id, person_id, sort_order, relation_kind, relation_ko, relation_en, note_ko, note_en) VALUES (
  'soviet-polish-war',
  'maxime-weygand',
  54,
  'participant',
  '프랑스 군사고문',
  'French military adviser',
  '1920년 영불 연합사절단에 참여해 폴란드 참모부에 자문했다.',
  'Advised the Polish staff as part of the Interallied Mission in 1920.'
) ON CONFLICT (event_id, person_id) DO NOTHING;
INSERT INTO commulingo_history_event_people (event_id, person_id, sort_order, relation_kind, relation_ko, relation_en, note_ko, note_en) VALUES (
  'soviet-polish-war',
  'symon-petliura',
  55,
  'leader',
  '폴란드와 동맹한 우크라이나 인민공화국 지도자',
  'Ukrainian republican leader allied with Poland',
  '1920년 바르샤바 협정과 키예프 공세에 참여했으나 리가 협상에서 배제됐다.',
  'Joined the Warsaw agreement and Kyiv offensive but was excluded from the Riga negotiations.'
) ON CONFLICT (event_id, person_id) DO NOTHING;
INSERT INTO commulingo_history_event_people (event_id, person_id, sort_order, relation_kind, relation_ko, relation_en, note_ko, note_en) VALUES (
  'civil-war',
  'adolph-joffe',
  4,
  'participant',
  '초기 협상 대표',
  'Initial Soviet negotiator',
  '초기 협상 대표로 이 사건에 관여했다.',
  'Involved in this event as initial Soviet negotiator.'
) ON CONFLICT (event_id, person_id) DO NOTHING;
INSERT INTO commulingo_history_event_people (event_id, person_id, sort_order, relation_kind, relation_ko, relation_en, note_ko, note_en) VALUES (
  'civil-war',
  'carl-gustaf-emil-mannerheim',
  9,
  'leader',
  '핀란드 백군 사령관',
  'Finnish White commander',
  '핀란드 백군 사령관로 이 사건에 관여했다.',
  'Involved in this event as finnish White commander.'
) ON CONFLICT (event_id, person_id) DO NOTHING;
INSERT INTO commulingo_history_event_people (event_id, person_id, sort_order, relation_kind, relation_ko, relation_en, note_ko, note_en) VALUES (
  'civil-war',
  'peteris-stucka',
  12,
  'leader',
  '소비에트 라트비아 정부 수반',
  'Head of Soviet Latvia',
  '소비에트 라트비아 정부 수반로 이 사건에 관여했다.',
  'Involved in this event as head of Soviet Latvia.'
) ON CONFLICT (event_id, person_id) DO NOTHING;
INSERT INTO commulingo_history_event_people (event_id, person_id, sort_order, relation_kind, relation_ko, relation_en, note_ko, note_en) VALUES (
  'civil-war',
  'konstantin-pats',
  29,
  'leader',
  '에스토니아 독립전쟁 초기 정부 수반',
  'Estonian government leader early in the independence war',
  '독립전쟁 초기에 에스토니아 정부를 이끌었다. 1934년 라이도네르와 함께 권위주의 체제를 세웠고, 1940년 소련 점령 뒤 강제이송되어 구금 중 사망했다.',
  'Led Estonia’s government early in the independence war. He established authoritarian rule with Laidoner in 1934 and died in Soviet custody after deportation following the 1940 occupation.'
) ON CONFLICT (event_id, person_id) DO NOTHING;
INSERT INTO commulingo_history_event_people (event_id, person_id, sort_order, relation_kind, relation_ko, relation_en, note_ko, note_en) VALUES (
  'civil-war',
  'johan-laidoner',
  30,
  'leader',
  '에스토니아 독립전쟁 총사령관',
  'Estonian commander-in-chief in the independence war',
  '에스토니아군의 반격과 북라트비아 작전을 지휘했다. 유데니치군과 조건부로 협력했으며, 1934년 페츠의 쿠데타를 도왔다. 소련에 강제이송된 뒤 감옥에서 사망했다.',
  'Commanded Estonia’s counteroffensive and operations in northern Latvia, cooperating conditionally with Yudenich. He supported Päts’s 1934 coup and died in prison after Soviet deportation.'
) ON CONFLICT (event_id, person_id) DO NOTHING;
INSERT INTO commulingo_history_event_people (event_id, person_id, sort_order, relation_kind, relation_ko, relation_en, note_ko, note_en) VALUES (
  'civil-war',
  'jaan-tonisson',
  31,
  'leader',
  '타르투 강화기의 에스토니아 총리',
  'Estonian prime minister during the Tartu settlement',
  '언론인이자 자유주의 정치인으로 1919~1920년 총리를 지냈다. 그의 정부 아래 러시아와 타르투 강화가 체결됐다. 소련 점령 뒤 체포되어 실종됐으며 1941년 사망한 것으로 추정된다.',
  'A journalist and liberal politician, he was prime minister in 1919–1920 when Estonia concluded the Treaty of Tartu. Arrested after Soviet occupation, he disappeared and is presumed to have died in 1941.'
) ON CONFLICT (event_id, person_id) DO NOTHING;
INSERT INTO commulingo_history_event_people (event_id, person_id, sort_order, relation_kind, relation_ko, relation_en, note_ko, note_en) VALUES (
  'civil-war',
  'karlis-ulmanis',
  32,
  'leader',
  '라트비아 독립전쟁기의 총리',
  'Latvian prime minister during the independence war',
  '1918년 임시정부를 이끌었고 소비에트군과 친독 정권, 베르몬트군에 맞서 공화국을 지켰다. 1934년 쿠데타로 독재를 수립했으며 소련 점령 뒤 강제이송되어 사망했다.',
  'Led the provisional government from 1918 against Soviet forces, a pro-German rival government and Bermondt’s army. He established a dictatorship in 1934 and died after Soviet deportation.'
) ON CONFLICT (event_id, person_id) DO NOTHING;
INSERT INTO commulingo_history_event_people (event_id, person_id, sort_order, relation_kind, relation_ko, relation_en, note_ko, note_en) VALUES (
  'civil-war',
  'andrievs-niedra',
  33,
  'leader',
  '1919년 친독 라트비아 정부 수반',
  'Head of Latvia’s pro-German government in 1919',
  '목사이자 작가로 1919년 리예파야 쿠데타 뒤 친독 정부를 이끌었다. 체시스 전투 이후 정권이 무너졌으며, 독립 라트비아에서 반역죄로 재판받고 독일로 추방됐다.',
  'A pastor and writer, he headed the pro-German government formed after the Liepāja coup. His government fell after Cēsis; independent Latvia later tried him for treason and expelled him to Germany.'
) ON CONFLICT (event_id, person_id) DO NOTHING;
INSERT INTO commulingo_history_event_people (event_id, person_id, sort_order, relation_kind, relation_ko, relation_en, note_ko, note_en) VALUES (
  'civil-war',
  'zigfrids-meierovics',
  34,
  'participant',
  '라트비아 독립 승인을 이끈 외교관',
  'Diplomat securing recognition for independent Latvia',
  '라트비아의 초대 외무장관으로 독립전쟁 동안 연합국의 지원과 국제 승인을 추구했다. 이후 총리도 지냈으며 1925년 교통사고로 사망했다.',
  'Latvia’s first foreign minister, he sought Allied support and international recognition during the independence war. He later served as prime minister and died in a traffic accident in 1925.'
) ON CONFLICT (event_id, person_id) DO NOTHING;
INSERT INTO commulingo_history_event_people (event_id, person_id, sort_order, relation_kind, relation_ko, relation_en, note_ko, note_en) VALUES (
  'civil-war',
  'rudiger-von-der-goltz',
  35,
  'leader',
  '핀란드와 발트의 독일군 지휘관',
  'German commander in Finland and the Baltic',
  '1918년 발트 사단을 이끌고 핀란드 백군을 지원했다. 1919년에는 라트비아의 독일군과 자유군단을 지휘했으며 반볼셰비키 전쟁을 독일의 발트 영향력 유지와 결합했다.',
  'Led the Baltic Sea Division supporting Finland’s Whites in 1918. In Latvia in 1919 he commanded German forces and Freikorps, combining anti-Bolshevik warfare with efforts to retain German influence.'
) ON CONFLICT (event_id, person_id) DO NOTHING;
INSERT INTO commulingo_history_event_people (event_id, person_id, sort_order, relation_kind, relation_ko, relation_en, note_ko, note_en) VALUES (
  'civil-war',
  'pavel-bermondt-avalov',
  37,
  'leader',
  '리가를 공격한 서러시아 의용군 사령관',
  'West Russian Volunteer Army commander who attacked Riga',
  '독일계 병력을 대거 받아들인 서러시아 의용군을 지휘했다. 반볼셰비키를 표방했으나 1919년 라트비아·리투아니아의 독립군과 싸웠고 리가 공격 실패 뒤 망명했다.',
  'Commanded the West Russian Volunteer Army, incorporating many German soldiers. Despite an anti-Bolshevik banner, he fought Latvian and Lithuanian forces in 1919 and went into exile after failing at Riga. Accounts of his ethnic background differ.'
) ON CONFLICT (event_id, person_id) DO NOTHING;
INSERT INTO commulingo_history_event_people (event_id, person_id, sort_order, relation_kind, relation_ko, relation_en, note_ko, note_en) VALUES (
  'civil-war',
  'antanas-smetona',
  38,
  'leader',
  '리투아니아 초대 대통령',
  'Lithuania’s first president',
  '리투아니아 평의회 의장으로 1918년 독립 선언에 참여하고 1919년 초대 대통령이 됐다. 1926년 쿠데타 뒤 권위주의 통치를 이끌었으며 소련 점령 뒤 망명해 미국에서 화재로 사망했다.',
  'Chaired Lithuania’s Council, signed the 1918 independence act and became its first president in 1919. He led authoritarian rule after the 1926 coup and died in a fire in American exile after Soviet occupation.'
) ON CONFLICT (event_id, person_id) DO NOTHING;
INSERT INTO commulingo_history_event_people (event_id, person_id, sort_order, relation_kind, relation_ko, relation_en, note_ko, note_en) VALUES (
  'civil-war',
  'augustinas-voldemaras',
  39,
  'leader',
  '리투아니아 초대 총리와 외무장관',
  'Lithuania’s first prime minister and foreign minister',
  '1918년 초대 내각을 이끌고 독립전쟁기에 외무장관으로 활동했다. 1926년 쿠데타 뒤 다시 총리가 됐으나 스메토나와 결별했다. 소련 점령 뒤 체포되어 감옥에서 사망했다.',
  'Headed the first cabinet in 1918 and served as foreign minister during the independence wars. Prime minister again after the 1926 coup, he later broke with Smetona and died in Soviet imprisonment.'
) ON CONFLICT (event_id, person_id) DO NOTHING;
INSERT INTO commulingo_history_event_people (event_id, person_id, sort_order, relation_kind, relation_ko, relation_en, note_ko, note_en) VALUES (
  'civil-war',
  'vincas-kapsukas',
  40,
  'leader',
  '리투아니아와 리트벨의 소비에트 정부 지도자',
  'Leader of Soviet Lithuania and Litbel',
  '리투아니아 공산주의자로 1918~1919년 소비에트 리투아니아와 리투아니아-벨로루시 소비에트 공화국 정부를 이끌었다. 군사적 패배 뒤 소비에트 러시아로 옮겨 코민테른에서 활동했다.',
  'A Lithuanian communist, he led the governments of Soviet Lithuania and the Lithuanian-Belorussian Soviet republic in 1918–1919. After military defeat he moved to Soviet Russia and worked in the Comintern.'
) ON CONFLICT (event_id, person_id) DO NOTHING;
INSERT INTO commulingo_history_event_people (event_id, person_id, sort_order, relation_kind, relation_ko, relation_en, note_ko, note_en) VALUES (
  'civil-war',
  'zigmas-angarietis',
  41,
  'participant',
  '소비에트 리투아니아의 내무 인민위원',
  'Interior commissar of Soviet Lithuania',
  '리투아니아 공산당의 지도자로 1918~1919년 소비에트 국가 수립에 참여했다. 망명 뒤 코민테른에서 일했고 스탈린기 탄압으로 체포되어 1940년 처형됐다.',
  'A Lithuanian Communist Party leader, he participated in Soviet state-building in 1918–1919. He worked in the Comintern after exile and was arrested during Stalinist repression and executed in 1940.'
) ON CONFLICT (event_id, person_id) DO NOTHING;
INSERT INTO commulingo_history_event_people (event_id, person_id, sort_order, relation_kind, relation_ko, relation_en, note_ko, note_en) VALUES (
  'civil-war',
  'lucjan-zeligowski',
  42,
  'leader',
  '빌뉴스를 점령한 폴란드 장군',
  'Polish general who seized Vilnius',
  '러시아 제국군 출신으로 폴란드군을 지휘했다. 1920년 10월 피우수트스키와 협의해 항명을 가장하고 빌뉴스를 점령한 뒤 중부 리투아니아를 수립했다. 훗날 폴란드 군사장관을 지냈다.',
  'A former imperial Russian officer, he commanded Polish troops. In October 1920, in agreement with Piłsudski, he staged a mutiny, seized Vilnius and established Central Lithuania. He later served as Poland’s minister of military affairs.'
) ON CONFLICT (event_id, person_id) DO NOTHING;
INSERT INTO commulingo_history_event_people (event_id, person_id, sort_order, relation_kind, relation_ko, relation_en, note_ko, note_en) VALUES (
  'civil-war',
  'stanislaw-bulak-balachowicz',
  44,
  'leader',
  '에스토니아에서 벨로루시로 옮겨간 반소비에트 지휘관',
  'Anti-Soviet commander from Estonia to Belarus',
  '적군에서 백군으로 옮겨 에스토니아 전선에서 싸웠고 이후 폴란드와 협력했다. 1920년 휴전 뒤 독자적으로 벌인 벨로루시 원정은 실패했다. 그의 부대가 자행한 반유대인 폭력도 전쟁 기록의 일부다.',
  'Changed from Red to White service, fought on the Estonian front and later cooperated with Poland. His independent Belarusian expedition after the 1920 armistice failed. His troops’ anti-Jewish violence is also part of the war’s record.'
) ON CONFLICT (event_id, person_id) DO NOTHING;
INSERT INTO commulingo_history_event_people (event_id, person_id, sort_order, relation_kind, relation_ko, relation_en, note_ko, note_en) VALUES (
  'civil-war',
  'pehr-evind-svinhufvud',
  46,
  'leader',
  '독일 지원을 요청한 핀란드 원로원 수반',
  'Finnish Senate leader who sought German assistance',
  '1917년 핀란드 독립을 추진한 원로원을 이끌었다. 1918년 내전에서 백색정부의 수반으로 독일의 개입을 요청했고 섭정을 지냈다. 이후 1931~1937년 대통령을 역임했다.',
  'Led the Senate that pursued Finnish independence in 1917. Heading the White government during the civil war, he sought German intervention and later served as regent. He was president from 1931 to 1937.'
) ON CONFLICT (event_id, person_id) DO NOTHING;
INSERT INTO commulingo_history_event_people (event_id, person_id, sort_order, relation_kind, relation_ko, relation_en, note_ko, note_en) VALUES (
  'civil-war',
  'volodymyr-vynnychenko',
  47,
  'leader',
  '중앙라다 총서기국과 디렉토리아의 지도자',
  'Leader of the Rada’s Secretariat and the Directory',
  '우크라이나 사회주의자이자 작가로 1917년 총서기국을 이끌고 1918년 반헤트만 디렉토리아의 초대 의장을 맡았다. 연합국과의 협력 및 국가 노선을 둘러싼 갈등으로 물러났고 독립 사회주의 우크라이나를 모색했다.',
  'A Ukrainian socialist and writer, he led the General Secretariat in 1917 and became the Directory’s first chairman in 1918. He resigned amid disputes over Entente cooperation and state policy, seeking an independent socialist Ukraine.'
) ON CONFLICT (event_id, person_id) DO NOTHING;
INSERT INTO commulingo_history_event_people (event_id, person_id, sort_order, relation_kind, relation_ko, relation_en, note_ko, note_en) VALUES (
  'civil-war',
  'mykhailo-hrushevsky',
  48,
  'leader',
  '우크라이나 중앙라다 의장인 역사학자',
  'Historian and chairman of Ukraine’s Central Rada',
  '우크라이나 역사를 독자적인 역사로 서술한 학자로 1917~1918년 중앙라다를 이끌었다. 자치에서 독립으로 나아간 공화국의 대표자였으며 망명 뒤 소비에트 우크라이나로 돌아왔지만 탄압과 감시를 겪었다.',
  'A historian who framed Ukraine’s past as a distinct history, he chaired the Central Rada in 1917–1918 as it moved from autonomy to independence. Returning to Soviet Ukraine after exile, he faced repression and surveillance.'
) ON CONFLICT (event_id, person_id) DO NOTHING;
INSERT INTO commulingo_history_event_people (event_id, person_id, sort_order, relation_kind, relation_ko, relation_en, note_ko, note_en) VALUES (
  'civil-war',
  'nykyfor-hryhoriv',
  49,
  'leader',
  '적군과의 동맹을 뒤집은 우크라이나 아타만',
  'Ukrainian otaman who turned against his Red allies',
  '반헤트만 부대에서 디렉토리아와 적군을 거쳐 1919년 5월 반소비에트 봉기를 일으켰다. 그의 부대는 반유대인 학살을 자행했다. 7월 마흐노 측과의 충돌에서 살해됐다. 동명의 사회주의 정치인과 다른 인물이다.',
  'Moved from anti-Hetman forces through the Directory to Red service, then rebelled in May 1919. His troops committed anti-Jewish massacres. He was killed in a confrontation with Makhno’s side in July, and should not be confused with the socialist politician of a similar name.'
) ON CONFLICT (event_id, person_id) DO NOTHING;
INSERT INTO commulingo_history_event_people (event_id, person_id, sort_order, relation_kind, relation_ko, relation_en, note_ko, note_en) VALUES (
  'civil-war',
  'viktor-kingissepp',
  50,
  'participant',
  '에스토니아 공산주의 지하조직 지도자',
  'Leader of Estonia’s communist underground',
  '1917년 혁명에 참여한 볼셰비키로 독립전쟁기 에스토니아의 공산주의 지하활동을 이끌었다. 독립 공화국의 당국에 체포되어 1922년 처형됐으며 소비에트 시대에 기념 인물이 되었다.',
  'A Bolshevik active in the 1917 revolution, he led communist underground work in Estonia during the independence struggle. Arrested by the republic’s authorities, he was executed in 1922 and became a commemorated figure under Soviet rule.'
) ON CONFLICT (event_id, person_id) DO NOTHING;
INSERT INTO commulingo_history_event_people (event_id, person_id, sort_order, relation_kind, relation_ko, relation_en, note_ko, note_en) VALUES (
  'civil-war',
  'jaan-anvelt',
  51,
  'leader',
  '에스토니아 노동 코뮌의 지도자',
  'Leader of the Commune of the Working People of Estonia',
  '1918~1919년 적군의 진입과 함께 세워진 에스토니아 노동 코뮌을 이끌었다. 패배 뒤에도 공산주의 운동과 코민테른에서 활동했으며 1937년 소련에서 체포되어 심문 중 사망했다.',
  'Led the Commune established alongside the Red advance in 1918–1919. After its defeat he remained active in communism and the Comintern, and died under interrogation following Soviet arrest in 1937.'
) ON CONFLICT (event_id, person_id) DO NOTHING;
INSERT INTO commulingo_history_event_people (event_id, person_id, sort_order, relation_kind, relation_ko, relation_en, note_ko, note_en) VALUES (
  'civil-war',
  'maxime-weygand',
  54,
  'participant',
  '프랑스 군사고문',
  'French military adviser',
  '1920년 영불 연합사절단에 참여해 폴란드 참모부에 자문했다.',
  'Advised the Polish staff as part of the Interallied Mission in 1920.'
) ON CONFLICT (event_id, person_id) DO NOTHING;
INSERT INTO commulingo_history_event_people (event_id, person_id, sort_order, relation_kind, relation_ko, relation_en, note_ko, note_en) VALUES (
  'civil-war',
  'chicherin',
  80,
  'leader',
  '외교 인민위원',
  'People’s Commissar for Foreign Affairs',
  '1918년 외교 인민위원이 된 뒤 봉쇄와 개입 속에서 소비에트 외교와 국경 강화를 이끌었다.',
  'As foreign affairs commissar from 1918, he led Soviet diplomacy and border settlements amid blockade and intervention.'
) ON CONFLICT (event_id, person_id) DO UPDATE SET sort_order=EXCLUDED.sort_order, relation_kind=EXCLUDED.relation_kind, relation_ko=EXCLUDED.relation_ko, relation_en=EXCLUDED.relation_en, note_ko=EXCLUDED.note_ko, note_en=EXCLUDED.note_en;
INSERT INTO commulingo_history_event_people (event_id, person_id, sort_order, relation_kind, relation_ko, relation_en, note_ko, note_en) VALUES (
  'civil-war',
  'sergey-kamenev',
  81,
  'leader',
  '1919년부터 붉은 군대 총사령관',
  'Red Army commander-in-chief from 1919',
  '1919년 7월 바체티스의 뒤를 이어 총사령관이 되어 여러 전선의 작전을 조정했다.',
  'Succeeded Vatsetis in July 1919 and coordinated operations across the fronts.'
) ON CONFLICT (event_id, person_id) DO UPDATE SET sort_order=EXCLUDED.sort_order, relation_kind=EXCLUDED.relation_kind, relation_ko=EXCLUDED.relation_ko, relation_en=EXCLUDED.relation_en, note_ko=EXCLUDED.note_ko, note_en=EXCLUDED.note_en;
INSERT INTO commulingo_term_events (term_id, event_id, sort_order, same_subject) VALUES (
  'brest-litovsk-treaty',
  'brest-litovsk',
  0,
  TRUE
) ON CONFLICT (term_id, event_id) DO UPDATE SET same_subject=EXCLUDED.same_subject;
INSERT INTO commulingo_term_events (term_id, event_id, sort_order, same_subject) VALUES (
  'left-socialist-revolutionaries',
  'brest-litovsk',
  0,
  NULL
) ON CONFLICT (term_id, event_id) DO UPDATE SET same_subject=EXCLUDED.same_subject;
INSERT INTO commulingo_term_events (term_id, event_id, sort_order, same_subject) VALUES (
  'red-guards',
  'brest-litovsk',
  0,
  NULL
) ON CONFLICT (term_id, event_id) DO UPDATE SET same_subject=EXCLUDED.same_subject;
INSERT INTO commulingo_term_events (term_id, event_id, sort_order, same_subject) VALUES (
  'makhnovshchina',
  'ukraine-1917-1921',
  0,
  NULL
) ON CONFLICT (term_id, event_id) DO UPDATE SET same_subject=EXCLUDED.same_subject;
INSERT INTO commulingo_term_events (term_id, event_id, sort_order, same_subject) VALUES (
  'pogrom',
  'ukraine-1917-1921',
  0,
  NULL
) ON CONFLICT (term_id, event_id) DO UPDATE SET same_subject=EXCLUDED.same_subject;
INSERT INTO commulingo_term_events (term_id, event_id, sort_order, same_subject) VALUES (
  'war-communism',
  'ukraine-1917-1921',
  0,
  NULL
) ON CONFLICT (term_id, event_id) DO UPDATE SET same_subject=EXCLUDED.same_subject;
DELETE FROM commulingo_term_events WHERE (term_id, event_id) IN (('brest-litovsk-treaty','civil-war'),('makhnovshchina','civil-war'));
UPDATE commulingo_history_events SET
  sort_order=40,
  period_label='1918–1922',
  sources='["Evan Mawdsley, The Russian Civil War (Birlinn, 2008)", "W. Bruce Lincoln, Red Victory: A History of the Russian Civil War (Simon and Schuster, 1989)", "Jonathan D. Smele, The Russian Civil Wars, 1916–1926: Ten Years That Shook the World (Oxford University Press, 2015)", "Stephen Kotkin, Stalin, vol. 1: Paradoxes of Power, 1878–1928 (Penguin, 2014)", "Sheila Fitzpatrick, The Russian Revolution (Oxford University Press, 4th ed., 2017)", "https://en.wikisource.org/wiki/Peace_Treaty_of_Brest-Litovsk", "https://www.marxists.org/archive/trotsky/1920/terrcomm/index.htm", "https://www.nam.ac.uk/explore/dunsterforce-caucasus", "https://en.wikipedia.org/wiki/Malleson_mission", "https://encyclopedia.1914-1918-online.net/article/international-responses-to-the-russian-civil-war-russian-empire/"]'::jsonb,
  timeline='[{"geo": {"lat": 52.1, "lng": 23.7, "kind": "point", "label": {"en": "Brest-Litovsk", "ko": "브레스트-리토프스크"}}, "body": {"en": "The Soviet government signed a punishing peace with Germany, ceding vast territories including Ukraine and the Baltic region. After fierce debate inside the party, Lenin carried acceptance of the treaty, arguing the revolution needed a breathing space to survive.", "ko": "소비에트 정부는 독일과 가혹한 강화 조약을 맺어 우크라이나와 발트 지역 등 광대한 영토를 내주었다. 격렬한 당내 논쟁 끝에 레닌은 혁명의 생존을 위해 「숨 돌릴 틈」이 필요하다며 조약 수용을 관철했다."}, "date": "1918.03.03", "title": {"en": "The Treaty of Brest-Litovsk", "ko": "브레스트-리토프스크 강화 조약"}}, {"body": {"en": "As People''s Commissar for War, Trotsky rebuilt the volunteer detachments into a regular conscript army, employing tens of thousands of former imperial officers as military specialists under the watch of political commissars. From his armored train he crisscrossed the fronts, imposing discipline and raising morale.", "ko": "전쟁인민위원이 된 트로츠키는 자원병 부대를 징집제 정규군으로 개편하고, 구 제국군 장교 수만 명을 군사전문가로 기용하되 정치위원 제도로 통제했다. 그는 장갑열차를 타고 전선을 누비며 규율과 사기를 세웠다."}, "date": "1918.03–04", "title": {"en": "Trotsky builds the Red Army", "ko": "트로츠키, 붉은 군대를 세우다"}}, {"geo": {"kind": "arrow", "actor": {"en": "Czechoslovak Legion", "ko": "체코슬로바키아 군단"}, "label": {"en": "Trans-Siberian Railway", "ko": "시베리아 횡단철도"}, "points": [[53.2, 45.0], [55.0, 82.9]], "variant": "axis"}, "body": {"en": "Some forty thousand soldiers of the Czechoslovak Legion, traveling along the Trans-Siberian Railway toward Vladivostok, rose in revolt and toppled Soviet power along the railway from the Volga to the Pacific. From this point the scattered civil war widened into full-scale war.", "ko": "시베리아 횡단 철도를 따라 블라디보스토크로 이동하던 4만여 명의 체코슬로바키아 군단이 봉기해 볼가에서 태평양에 이르는 철도 연선의 소비에트 권력을 무너뜨렸다. 산발적이던 내전은 이때부터 전면전으로 확대되었다."}, "date": "1918.05", "title": {"en": "Revolt of the Czechoslovak Legion", "ko": "체코슬로바키아 군단의 반란"}}, {"geo": {"lat": 46.48, "lng": 30.73, "kind": "point", "label": {"en": "Odessa", "ko": "오데사"}}, "body": {"en": "More than a dozen states, including Britain, France, the United States, and Japan, landed troops at Murmansk, Arkhangelsk, Vladivostok, Odessa, and elsewhere, and supplied the White armies with weapons and money. The Soviet republic faced blockade and invasion by the greatest powers of the age at once.", "ko": "영국, 프랑스, 미국, 일본을 비롯한 십여 개 국가가 무르만스크, 아르한겔스크, 블라디보스토크, 오데사 등지에 병력을 상륙시키고 백군에 무기와 자금을 지원했다. 소비에트 공화국은 당대 최강 열강들의 봉쇄와 침공에 동시에 맞서야 했다."}, "date": "1918.03–08", "title": {"en": "The powers intervene", "ko": "열강의 개입"}}, {"body": {"en": "After the attempt on Lenin''s life on August 30 and the assassination of Petrograd Cheka chief Uritsky, Sovnarkom formally proclaimed the Red Terror, and the Cheka carried out hostage executions and mass arrests. In the same period White-held territories saw their own terror and pogroms against workers, communists, and Jews: violence became a weapon of both sides of the civil war.", "ko": "8월 30일 레닌 암살 미수와 페트로그라드 체카 의장 우리츠키 암살 뒤, 인민위원회는 적색 테러를 공식 포고했고 체카는 인질 처형과 대량 체포를 집행했다. 같은 시기 백군 점령지에서도 노동자, 공산주의자, 유대인에 대한 백색 테러와 포그롬이 자행되어, 폭력은 내전 양측 모두의 무기가 되었다."}, "date": "1918.09.05", "title": {"en": "The age of terror, Red and White", "ko": "테러의 시대: 적색과 백색"}}, {"body": {"en": "The state nationalized industry, banned private trade, and sent armed detachments to requisition grain from the peasants under compulsory quotas. Cities and the army survived on this system, but peasant resentment deepened and the money economy effectively collapsed.", "ko": "국가는 산업을 국유화하고 사적 상업을 금지했으며, 무장 징발대를 보내 농민의 곡물을 강제 할당제로 거두었다. 도시와 군대는 이것으로 버텼으나 농민의 불만은 깊어 갔고, 화폐 경제는 사실상 붕괴했다."}, "date": "1918–1920", "title": {"en": "War communism", "ko": "전시 공산주의"}}, {"geo": {"lat": 54.99, "lng": 73.37, "kind": "point"}, "body": {"en": "A coup in Omsk toppled the SR-led provisional government there and installed Admiral Alexander Kolchak as Supreme Ruler. The White movement converged on military dictatorship, and its requisitions and punitive expeditions in the countryside pushed the peasantry toward the Soviets.", "ko": "옴스크에서 쿠데타로 사회혁명당 계열 임시정부가 무너지고 해군제독 알렉산드르 콜차크가 「최고 통치자」로 추대되었다. 백군 운동은 군사 독재로 수렴했고, 점령지의 농민 징발과 처벌 원정은 민심을 소비에트 쪽으로 밀어냈다."}, "date": "1918.11.18", "title": {"en": "Kolchak becomes Supreme Ruler", "ko": "콜차크, 「최고 통치자」가 되다"}}, {"geo": {"kind": "arrow", "actor": {"en": "Red Army", "ko": "붉은 군대"}, "label": {"en": "toward the Urals", "ko": "우랄 방면"}, "points": [[53.4, 51.0], [54.7, 65.0]], "variant": "red"}, "body": {"en": "Kolchak''s spring offensive approached the Volga, but the Southern Group under Frunze and Tukhachevsky''s Fifth Army counterattacked, retook Ufa, and drove the Whites back beyond the Urals. Kolchak''s army then disintegrated in stages across Siberia.", "ko": "콜차크의 춘계 공세가 볼가에 접근했으나, 프룬제가 지휘한 남부집단군과 투하쳅스키의 제5군이 반격해 우파를 탈환하고 백군을 우랄 너머로 밀어냈다. 이후 콜차크군은 시베리아를 가로질러 붕괴를 거듭했다."}, "date": "1919.03–06", "title": {"en": "The counteroffensive in the east", "ko": "동부전선의 반격"}}, {"geo": {"kind": "arrow", "actor": {"en": "Denikin''s White army", "ko": "데니킨의 백군"}, "label": {"en": "Oryol", "ko": "오룔"}, "points": [[47.5, 39.9], [52.9, 36.1]], "variant": "axis"}, "body": {"en": "Denikin''s Armed Forces of South Russia drove toward Moscow as far as Oryol, and Yudenich reached the outskirts of Petrograd, but the Red Army broke both offensives. This counterblow proved the decisive turning point, and by the following spring Denikin''s forces had been pushed back to the Black Sea coast.", "ko": "데니킨의 남러시아군이 모스크바를 향해 오룔까지 진격하고 유데니치가 페트로그라드 교외에 이르렀으나, 붉은 군대는 두 공세를 모두 꺾었다. 이 반격이 내전의 결정적 전환점이 되었고 데니킨군은 이듬해 봄까지 흑해 연안으로 밀려났다."}, "date": "1919.10", "title": {"en": "The peak of the crisis: Oryol and Petrograd", "ko": "위기의 정점: 오룔과 페트로그라드"}}, {"geo": {"kind": "arrow", "actor": {"en": "Red Army", "ko": "붉은 군대"}, "label": {"en": "Irkutsk", "ko": "이르쿠츠크"}, "points": [[55.0, 73.4], [52.3, 104.3]], "variant": "red"}, "body": {"en": "Kolchak, captured at Irkutsk, was executed. Amid antiwar sentiment at home, restive troops, and the failing White cause, Britain, France, and the other intervening powers withdrew their forces one after another.", "ko": "이르쿠츠크에서 붙잡힌 콜차크가 처형되었다. 자국 내 반전 여론과 병사들의 동요, 백군의 패색 속에 영국과 프랑스 등 개입국들은 병력을 차례로 철수시켰다."}, "date": "1920.02.07", "title": {"en": "The end of Kolchak and the ebb of intervention", "ko": "콜차크의 최후와 개입의 퇴조"}}, {"body": {"en": "When Pilsudski''s Polish army seized Kiev, the Red Army counterattacked, and Tukhachevsky''s Western Front advanced to the gates of Warsaw before suffering decisive defeat on the Vistula in August. An armistice in October and the Treaty of Riga in March 1921 fixed the border, ending hopes of carrying the revolution westward.", "ko": "피우수트스키의 폴란드군이 키예프를 점령하자 붉은 군대가 반격했고, 투하쳅스키의 서부전선군은 바르샤바 앞까지 진격했으나 8월 비스와강에서 결정적으로 패퇴했다. 10월 휴전에 이어 1921년 3월 리가 조약으로 국경이 확정되었고, 혁명을 서유럽으로 이어 가려던 기대는 꺾였다."}, "date": "1920.04–10", "title": {"en": "The Polish-Soviet war", "ko": "폴란드-소비에트 전쟁"}}, {"geo": {"kind": "arrow", "actor": {"en": "Red Army", "ko": "붉은 군대"}, "label": {"en": "Perekop", "ko": "페레코프"}, "points": [[46.2, 33.7], [45.0, 34.1]], "variant": "red"}, "body": {"en": "When the Southern Front under Frunze stormed the fortified lines of the Perekop isthmus, Wrangel evacuated roughly 150,000 soldiers and civilians from Crimea by sea. Organized White resistance in European Russia was over.", "ko": "프룬제가 지휘하는 남부전선군이 페레코프 지협의 요새선을 돌파하자, 브란겔은 군대와 민간인 약 15만 명을 배에 태워 크림에서 철수시켰다. 유럽 러시아에서 조직된 백군의 저항은 이것으로 끝났다."}, "date": "1920.11", "title": {"en": "Perekop stormed, Crimea evacuated", "ko": "페레코프 돌파와 크림 철수"}}, {"body": {"en": "The sailors of the Kronstadt fortress, once the pride of the revolution, rose under the slogan of soviets without parties, and the Red Army suppressed the rising across the frozen bay. In the same days as this tragic coda, in which the revolution turned its guns on its own supporters, the Tenth Party Congress voted to replace grain requisitioning with a tax in kind, opening the New Economic Policy.", "ko": "한때 혁명의 자랑이던 크론시타트 요새의 수병들이 「당 없는 소비에트」를 내걸고 봉기했고, 붉은 군대는 얼어붙은 만을 건너 요새를 진압했다. 혁명이 제 지지자들에게 총을 겨눈 이 비극적 종막과 때를 같이해, 제10차 당대회는 곡물 징발을 현물세로 바꾸는 신경제정책으로의 전환을 결정했다."}, "date": "1921.03", "title": {"en": "The tragedy of Kronstadt", "ko": "크론시타트의 비극"}}, {"geo": {"lat": 43.12, "lng": 131.89, "kind": "point"}, "body": {"en": "The People''s Revolutionary Army entered Vladivostok after the Japanese withdrawal, effectively ending the civil war and the intervention. Two months later the Union of Soviet Socialist Republics was founded.", "ko": "일본군이 철수한 블라디보스토크에 인민혁명군이 입성하면서 내전과 개입은 사실상 막을 내렸다. 두 달 뒤 소비에트 사회주의 공화국 연방이 수립되었다."}, "date": "1922.10.25", "title": {"en": "Vladivostok and the end of the civil war", "ko": "블라디보스토크와 내전의 종결"}}]'::jsonb,
  locations='[{"lat": 55.75, "lng": 37.62, "kind": "main", "label": {"en": "Moscow", "ko": "모스크바"}}, {"lat": 54.99, "lng": 73.37, "label": {"en": "Omsk", "ko": "옴스크"}}, {"lat": 47.24, "lng": 39.71, "label": {"en": "Rostov-on-Don", "ko": "로스토프나도누"}}, {"lat": 64.54, "lng": 40.54, "label": {"en": "Arkhangelsk", "ko": "아르한겔스크"}}, {"lat": 43.12, "lng": 131.89, "label": {"en": "Vladivostok", "ko": "블라디보스토크"}}]'::jsonb,
  body_ko='## 군대도, 동맹도, 빵도 없이 ― 1918년 초의 소비에트 권력

1917년 11월 7일 페트로그라드에서 권력을 잡은 볼셰비키는, 1918년 3월이 되기 전까지 사실상 군대라고 부를 만한 것을 가지고 있지 않았다. 구 제국군은 해체 중이었다. 1918년 1월 29일 소비에트 최고총사령관 니콜라이 크릴렌코는 전군의 동원 해제를 명령했고, 수백만 명의 병사들은 총을 버리고 집으로 돌아갔다. 볼셰비키가 가진 무장력은 공장 노동자들이 자발적으로 조직한 적위대뿐이었고, 이들은 도시 방어나 철도 연선의 소규모 작전에는 쓸모가 있었지만 정규전을 수행할 능력은 전혀 없었다. 적군 창설은 1918년 1월 28일 인민위원회 법령으로 공식화되었으나, 그 선언에서 전선의 병사로 이어지는 길은 아직 아무도 닦지 못한 상태였다.

볼셰비키의 정치적 기반도 마찬가지로 허약했다. 10월 혁명 직후의 「소비에트 권력의 승리의 행진」이라는 기간 동안, 적위대와 혁명 수병 분견대는 철도를 따라 모길료프의 옛 군사령부, 키예프, 돈 지역으로 파견되어 산발적인 저항을 진압했다. 그러나 1918년 2월까지도 소비에트 권력이 실제로 통제하는 영토는 페트로그라드, 모스크바와 그 사이를 잇는 철도 축, 그리고 중앙 러시아의 일부 산업 도시들에 국한되어 있었다. 광대한 농촌과 변경 지역은 사실상 권력의 공백 상태였다.

1917년 11월 25일 치러진 제헌의회 선거는 볼셰비키에 냉정한 평결을 내렸다. 사회혁명당이 약 40%의 득표로 다수 의석을 차지했고, 볼셰비키는 25%에 미치지 못했다. 1918년 1월 18일 타브리다 궁에서 소집된 제헌의회는 사회혁명당의 빅토르 체르노프를 의장으로 선출하고 볼셰비키의 「노동과 피착취 인민의 권리 선언」 승인을 거부했다. 다음 날 새벽, 볼셰비키 주도의 전러시아중앙집행위원회는 제헌의회를 강제 해산했다. 혁명 내부의 민주적 대안은 13시간 만에 문을 닫았다.

도시의 상황도 절망적이었다. 전쟁과 혁명의 혼란 속에 공장은 문을 닫았고, 페트로그라드의 산업 노동자 수는 1917년 초 40만 명에서 1918년 봄에는 절반 이하로 줄었다. 식량 부족은 일상이었고, 화폐 가치는 폭락했다. 볼셰비키는 1918년 5월 「식량 독재」를 선포하고 무장 징발대를 농촌으로 보내 곡물을 거두기 시작했지만, 이것이 오히려 농민의 적대를 키우는 불씨가 되었다.

1918년 봄, 소비에트 공화국은 군대도, 동맹도, 빵도 없는 상태에서 존재 자체를 건 싸움을 앞두고 있었다. 남부에서는 코르닐로프의 후계자들이 의용군을 조직하고 있었고, 시베리아 횡단 철도를 따라 이동 중이던 체코슬로바키아 군단 4만 명은 곧 내전 전체를 바꿔놓을 봉화가 될 준비를 하고 있었다.

## 브레스트의 시간으로 세운 붉은 군대

1918년 3월 3일 브레스트 강화는 군대가 해체된 소비에트 정부가 독일의 공세 앞에서 선택한 후퇴였다. 레닌은 즉시 강화를, 부하린은 혁명전쟁을, 트로츠키는 전쟁을 끝내되 강화에는 서명하지 않는 노선을 주장했다. 독일의 2월 공세 뒤 레닌의 노선이 관철됐고 좌파 에스에르는 정부에서 탈퇴했다.

이 강화는 우크라이나·발트·핀란드에 평화를 가져오지 않았다. 독일의 점령과 국내의 권력 투쟁이 이어졌으며, 11월 독일의 패전은 새 공백을 열었다. 협상·당내 논쟁과 독일의 동방 점령은 [브레스트 강화](/commulingo/events/brest-litovsk)에서 자세히 다룬다.

브레스트의 위기는 자원병에 의존하던 붉은 군대를 정규군으로 바꾸는 계기였다. 1918년 3월 전쟁인민위원이 된 트로츠키는 장교 선출제를 폐지하고 옛 제국군의 군사전문가를 기용했다. 4월의 보편적 군사훈련과 뒤이은 징병은 노동자 민병대의 이상을 대규모 전쟁을 수행하는 군사기구로 바꾸었다. 2월 23일 나르바에서 독일군을 격퇴했다는 후대의 기념 서사를 실제 창군 과정과 혼동해서는 안 된다.

정치위원은 군사전문가의 명령과 정치적 충성을 감시하는 장치였다. 전문 지식과 당의 통제를 결합하는 과정은 당내 군사반대파와의 논쟁을 낳았지만, 중앙의 동원·보급·지휘를 갖춘 정규군은 내전의 승패를 좌우했다.

## 한 개의 주먹과 열 개의 상륙지 ― 내전을 전면전으로 바꾼 1918년 5~8월

1918년 초 돈 강의 카자크와 쿠반의 의용군은 반볼셰비키 무장 저항의 거점이었다. 우크라이나의 독일 점령은 그와 성격이 다른, 훨씬 광범한 외국군의 개입이었다. 5월 말부터 8월 사이에 두 개의 사건이 이 국지적 충돌을 전면전으로 바꾸어 놓았다. 체코슬로바키아 군단의 반란과 연합국의 개입이다.

군단은 오스트리아-헝가리 제국군에서 탈영하거나 포로가 된 체코인과 슬로바키아인 약 4만 명으로 이루어져 있었다. 그들은 독립국 건설의 꿈을 품고 러시아 편에서 싸웠으며, 브레스트-리토프스크 강화 후에는 연합국이 독일에 맞서 싸우는 서부전선으로 가고자 했다. 유일한 길은 시베리아 횡단 철도를 타고 블라디보스토크까지 9,700km를 간 다음 배로 프랑스로 가는 것이었다. 1918년 3월 25일 펜자 협정에서 소비에트 정부는 경호용 소총을 제외한 모든 무기를 넘기는 조건으로 이 여정을 보장했다.

협정은 처음부터 삐걱거렸다. 철도는 단선이었고, 브레스트-리토프스크의 조건에 따라 서쪽으로 송환되는 독일·오스트리아·헝가리 포로들에게 열차가 우선 배정되었다. 체코슬로바키아군은 볼셰비키가 자신들을 독일 편으로 넘기려 한다는 의심을, 볼셰비키는 군단이 연합국의 반혁명 도구가 될 것을 의심했다. 5월 14일 첼랴빈스크 역에서 동쪽으로 가는 군단 열차와 서쪽으로 가는 헝가리 포로 열차가 마주쳤다. 헝가리 쪽에서 날아온 쇳조각에 군단원 한 명이 다쳤고, 군단은 해당 헝가리인을 끌어내 린치했다. 현지 소비에트가 개입해 군단원들을 체포하자, 군단은 역을 급습해 동료들을 빼내고 도시를 장악했다.

트로츠키는 5월 25일 「체코슬로바키아 군단의 모든 제대를 즉각 무장해제하고, 저항하는 자는 사살하라」는 명령을 전선에 내렸다. 군단은 첼랴빈스크에서 열린 군대대회에서 무장해제를 거부하고 블라디보스토크까지 무장한 채 가겠다고 결의했다. 6월 초까지 군단은 펜자에서 크라스노야르스크에 이르는 철도 연선의 소비에트 권력을 차례로 무너뜨렸고, 6월 8일에는 사마라를 점령해 사회혁명당 계열의 제헌의회 의원위원회(코무치)라는 첫 반볼셰비키 정부의 출현을 가능케 했다. 7월까지 군단은 블라디보스토크를 포함한 시베리아 횡단 철도 전 구간을 통제했다. 불과 두 달 만에 4만 명의 외국 군대가 볼가에서 태평양에 이르는 대륙의 지정학을 다시 썼다.

이 반란과 병행하여 연합국의 개입도 현실화되었다. 개입의 첫 구실은 방어적이었다: 무르만스크와 아르한겔스크에 쌓아둔 연합국 지원 물자가 독일 손에 넘어가는 것을 막는다는 명분이었다. 1918년 3월 4일, 브레스트-리토프스크 조약 체결 다음 날, 영국 해병대 170명이 무르만스크에 상륙했다. 이 상륙은 현지 무르만스크 소비에트가 독일군의 침공을 두려워해 요청한 것이었고, 트로츠키조차 처음에는 이를 환영했다. 그러나 6월이 되자 연합국 병력은 1만 2천 명을 넘어섰고, 8월 2일에는 아르한겔스크에도 상륙했다. 극동에서는 일본이 1918년 1월 이미 블라디보스토크에 해병대를 상륙시켰고, 4월에는 병력을 증강했다. 8월 3일에는 영국·프랑스·미국 군대도 블라디보스토크에 도착했다. 윌슨 대통령은 개입에 반대하다가 체코슬로바키아 군단 구출이라는 명분으로 5천 명의 북러시아 파견대와 8천 명의 시베리아 파견대를 승인했다. 일본은 최대 7만 명까지 증파해 자국의 시베리아 완충국 구상을 추진했다. 개입국은 14개국에 달했고, 상륙 지점은 북쪽의 무르만스크·아르한겔스크에서 극동의 블라디보스토크, 남쪽의 오데사와 흑해 연안, 카스피 해 너머의 캅카스까지 유라시아 전역에 흩어져 있었다.

반란과 개입은 서로를 먹여살렸다. 체코슬로바키아 군단이 시베리아 철도를 장악하자 연합국은 「체코인 구출」을 개입 확대의 공개적 명분으로 삼았다. 연합국이 상륙하자 군단은 자신들을 연합국 선봉대로 여기며 반볼셰비키 전선 형성을 더욱 과감하게 밀어붙였다. 그 결과 1918년 여름이 끝날 무렵, 소비에트 공화국은 사실상 사방에서 포위되었다. 3월에 체결한 독일과의 강화는 숨 돌릴 틈을 주었을 뿐, 평화를 주지는 않았다. 내전은 이제 러시아인들만의 싸움이 아니었다.

### 독일의 점령과 남쪽의 개입

1918년 독일은 우크라이나·발트·핀란드에 걸쳐 광범한 군사적 영향력을 행사했다. 우크라이나에서는 스코로파츠키의 헤트만 정권을 뒷받침했고, 발트에서는 군정과 친독 국가 구상을 추진했으며, 핀란드에서는 발트 사단이 백군을 지원했다. 이는 연합국의 반볼셰비키 개입과 목적·시기가 다른 중앙동맹국의 전쟁 정책이었다. 11월 정전협정 제12조에 따른 독일군의 조건부 잔류는 이듬해 발트 자유군단 문제로 이어졌다. [브레스트 강화](/commulingo/events/brest-litovsk)와 [발트 독립전쟁](/commulingo/events/baltic-wars-of-independence)이 이 연결을 다룬다.

흑해에서는 프랑스군과 그리스군이 1918년 12월부터 오데사 일대에 개입했다. 그러나 현지의 복잡한 정치적 동맹과 소비에트 측의 군사적 압박, 병사들의 전쟁 피로 속에서 1919년 4월 철수했다. 영국군의 개입도 북러시아와 시베리아에 한정되지 않았다. 던스터포스의 1918년 바쿠 작전은 석유와 교통로, 오스만 진격에 대한 우려와 연결됐고, 뒤이은 캅카스 주둔 및 중앙아시아의 말레슨 사절단은 별도의 지역적 이해를 드러냈다. 이 개입들을 처음부터 하나의 통일된 소련 전복 작전으로 묶으면 각국의 목표와 철수 시점을 놓치게 된다.

## 총력전의 후방: 총살과 징발의 1918~1920년

1918년 8월 30일, 페트로그라드 체카 의장 모이세이 우리츠키가 생도 출신 청년 레오니트 카네기세르의 총에 암살되고, 같은 날 저녁 모스크바에서는 사회혁명당원 파니야 카플란이 공장 노동자 집회를 마치고 나오는 레닌에게 권총 두 발을 쏘아 중상을 입혔다. 이 두 사건은 한 달 전부터 좌파 에스에르 봉기와 V. 볼로다르스키 암살로 긴장이 쌓여 있던 볼셰비키 지도부에 결정적 전환을 가져왔다.

인민위원회는 9월 5일 「적색 테러에 관하여」라는 포고를 발표했다. 드미트리 쿠르스키 법무인민위원이 기초한 이 법령은 "계급 적들을 강제수용소에 격리하고, 백위대 조직·음모·반란에 연루된 모든 자는 총살한다"고 명시했으며, 총살된 자의 이름과 이유를 공개하도록 규정했다. 법령은 테러를 후방 확보의 체계적 수단으로 제도화한 것이다. 페트로그라드에서는 법령 발표 전부터 이미 약 1,300명의 ''부르주아 인질''이 체카에 의해 처형되었고, 공식 발표 후 첫 두 달 동안 전국에서 1만 명에서 1만 5천 명이 약식 처형되었다. 이는 제정 러시아가 1825년부터 1917년까지 92년간 선고한 사형 집행 건수의 두세 배에 달하는 숫자였다.

적색 테러를 백색 테러와 구분한 것은 그 이론화의 정도였다. 체카 간부 마르틴 라치스는 기관지 『적색 테러』에 이렇게 썼다: "우리는 개별 인물과 전쟁하는 것이 아니다. 우리는 부르주아지를 하나의 계급으로서 근절하고 있다. 수사할 때 피의자가 말과 행동으로 소비에트 권력에 맞섰다는 증거를 찾지 말라. 첫 번째 질문은 이것이다: 그는 어느 계급에 속하는가? 그의 출신과 교육과 직업은 무엇인가? 이 질문들이 피의자의 운명을 결정해야 한다." 계급 출신 자체가 사형 선고의 근거가 된 것이다.

백색 테러는 이와 달리 체계적 법령 없이 자행되었으나, 그 잔혹성에서는 뒤지지 않았다. 콜차크군은 점령지에서 노동자와 사회주의자를 대량 처형했다. 1918년 12월 옴스크에서는 크라실니코프 장군의 부대가 수감 중이던 사회주의 활동가와 노동자 수백 명을 학살했다. 남부에서는 데니킨군과 카자크 부대가 유대인 포그롬을 일삼아 수만 명을 학살했으며, 백군의 진격과 후퇴는 곳곳에서 민간인 학살을 동반했다. 특히 도시를 포기하기 직전의 보복 학살이 빈번했다.

이와 병행하여 소비에트 정부는 경제 전체를 전쟁 동원 체제로 재편했다. 그 출발점은 1918년 5월 13일의 식량독재령이었다. 알렉산드르 츠류파가 이끄는 식량인민위원회는 곡물 독점을 무력으로 집행할 권한을 얻었고, 도시 노동자로 편성된 무장 식량분견대가 농촌으로 파견되었다. 1918년 6월에는 빈농위원회가 조직되어 마을 내부에서 부농의 곡물을 적발·몰수하는 임무를 맡았다. 볼셰비키의 구상은 마을을 계급 전선으로 재편해 빈농을 부농에 대립시킨다는 것이었으나, 실제로는 징발대가 종자용 곡식과 최소한의 식량마저 가져가면서 마을 전체가 저항했다.

올랜도 파이지스의 기록에 따르면, 1918년 7월과 8월에만 식량징발대에 맞선 농민 봉기가 200건 이상 발생했다. 사마라 지방의 한 마을에서는 분견대원들이 약탈과 살인을 자행하자, 농민들이 밤에 당 사무소에서 자던 12명 전원의 목을 베어 마을 입구에 장대를 세워 전시했다. 볼셰비키는 이를 ''에스에르-쿨라크의 반란''으로 규정했으나, 실상은 가장 가난한 농민까지 가담한 마을 전체의 저항이었다.

1919년 1월, 식량독재는 식량할당제로 확대되었다. 중앙이 각 현에 할당량을 정하면, 현은 군으로, 군은 향으로, 향은 개별 농가로 할당량을 쪼개 내려보냈다. 모스크바가 결정한 할당량은 수확량 추산이 아니라 국가의 필요량에 맞춰져 있었기 때문에, 남는 곡식이 아니라 종자와 식량까지 징발당하는 일이 빈번했다. 1920년까지 징발 대상은 곡물에서 감자·고기·우유·계란까지 거의 모든 농산물로 확대되었다.

도시에서는 공업 국유화가 가속되었다. 1918년 6월 28일 법령으로 대규모 공장이 국유화된 데 이어, 1920년 11월에는 노동자 5인 이상의 소규모 작업장까지, 마을 대장간과 재봉소조차 국유화 대상에 포함되었다. 사적 상업은 금지되었고, 모스크바의 수하렙카 시장 같은 곳은 ''부르주아 잔재''로 간주되어 폐쇄되었다. 배급은 계급 배급제로 운영되어, 노동자 1범주에서 부르주아 4범주까지 모스크바는 4:3:2:1, 페트로그라드는 8:4:2:1의 비율로 배분했다. 레닌은 부르주아에게 "배급의 8분의 1"만 주거나 아예 주지 말아야 한다고 말했다. 화폐는 무제한 발행으로 가치가 폭락했고, 1920년 말에는 주택·철도·우편·의료가 무료화되면서 화폐 경제 자체가 폐지 대상이 되었다.

전시 공산주의는 붉은 군대에 최소한의 빵과 무기를 공급해 내전을 승리로 이끄는 데는 성공했다. 그러나 농민은 파종 면적을 줄여 대응했고, 1920년 주요 곡창 지대의 수확량은 전쟁 전의 4분의 1로 감소했다. 페트로그라드는 인구의 70퍼센트, 모스크바는 절반 이상을 잃었다. 1920~1921년 사이 탐보프 반란을 비롯한 농민 전쟁이 전국을 휩쓸었고, 결국 1921년 3월 크론시타트에서 혁명이 자기 아들들에게 총을 겨누게 되었다. 테러와 징발로 관통된 이 3년은 소비에트 국가가 생존의 조건을 마련한 시간이었지만, 동시에 그 생존이 스스로의 사회적 토대를 잠식해가는 과정이기도 했다.

## 민주주의의 최후와 군사독재의 탄생 ― 콜차크의 등장과 첫 패배

1918년 11월 17일 밤, 옴스크에서 카자크 부대가 SR 계열 지도부의 자택을 급습했다. 전러시아 임시정부(우파 디렉토리) 의장 니콜라이 압크센티예프, 내무장관 블라디미르 젠지노프 등이 체포되었고, 디렉토리 경비 대대는 무장 해제되었다. 수상 표트르 볼로고츠키는 다음 날 아침 긴급 각료회의를 소집해 "전권을 단일 지도자에게 이양한다"는 결의를 채택했고, 비밀 투표로 전쟁·해군장관 알렉산드르 콜차크가 선출되었다. 콜차크는 "최고 통치자" 칭호를 취하고 자신을 정식 제독으로 진급시켰다. 두 달 전 우파 국가회의에서 타협으로 탄생한 민주 연립정부는 이로써 종말을 맞았다.

반볼셰비키 진영의 주도권이 SR 의회주의에서 군부 독재로 넘어간 이 쿠데타의 배후에는 입헌민주당(카데트) 동부지부, 특히 빅토르 페펠랴예프가 있었다. 영국 군사대표 알프레드 녹스는 몇 달 전부터 "이 나라에는 채찍이 필요하다"고 공언해 왔다. 콜차크 자신은 정치 경험이 전무했다. "나는 군사기술자일 뿐 정치에는 문외한"이라고 말했고, 권력을 "십자가"에 비유했다. 그러나 그가 장악한 자원은 실질적이었다: 카잔에서 탈취한 제정 금 보유고(6억 5천만 금루블 상당), 영국이 1년간 공급한 소총 60만 정과 기관총 6,831정, 그리고 약 10만 명의 병력이었다. 군대는 세 개로 편성되었다: 라돌라 가이다의 시베리아군(북부), 미하일 한진의 서부군(중앙), 알렉산드르 두토프의 오렌부르크군(남부).

1919년 3월 4일, 백군 춘계 공세가 개시되었다. 결정타는 중앙에서 나왔다. 한진의 서부군 약 4만9천 명이 붉은 군대 제5군(약 1만 명)과 제2군 사이를 파고든 것이다. 제5군은 나흘 만에 궤멸했고, 3월 16일 한진은 우파를 무혈 점령했다. 이어 4월 10일까지 부굴마를 확보하며 볼가 강 100km 앞까지 접근했다. 북쪽에서는 가이다군이 사라풀을 점령했고, 남쪽에서는 두토프가 오르스크를 취했다. 백군은 사마라와 카잔을 위협했고, 모스크바는 동부전선으로 예비 병력을 긴급 전환해야 했다.

그러나 승리 자체가 패착이었다. 한진군의 전선은 250~300km로 늘어졌고, 남쪽의 두토프군과는 작전적 간극이 벌어졌다. 이 틈을 미하일 프룬제가 파고들었다. 동부전선 남부집단군 사령관으로서 그의 수중에는 제1군(가야 가이), 제5군(미하일 투하쳅스키), 투르케스탄군(게오르기 지노비예프)이 있었다. 구상은 단순했다: 부줄루크에 타격 집단을 집결시켜, 가장 멀리 튀어나온 한진군의 좌측면을 남에서 북으로 찔러 올라가는 것.

4월 22~25일, 가야 가이의 제1군이 살미시 강에서 바키치 장군의 제4군단을 격멸해 두 개 사단을 소멸시켰다. 이 승리로 한진군의 후방이 노출되었다. 4월 28일, 프룬제의 주력이 부구루슬란 남동쪽에서 한진의 제11·제6사단을 타격했다. 바실리 차파예프의 제25사단과 겐리흐 에이헤의 제26사단이 선봉이었다. 5월 4일 붉은 군대는 부구루슬란을 탈환했고, 5월 13일 부굴마에 입성했다. 예비대로 급파된 블라디미르 카펠의 볼가 군단마저 5월 15~19일 벨레베이 전투에서 분쇄되었다.

한진군이 벨라야 강 너머로 퇴각하자, 북쪽의 가이다 시베리아군은 측면이 위험해졌다. 바실리 쇼린의 북부집단군은 사라풀-봇킨스크 방면에서 반격해 6월 7일 이젭스크를 탈환했고, 같은 날 투르케스탄군은 벨라야 강을 도하했다. 6월 9일 우파가 함락되자 콜차크군은 우랄 산맥 너머로 총퇴각을 시작했다. 두 달 만에 공세는 궤멸로 반전되었고, 동부전선의 주도권은 결정적으로 붉은 군대에 넘어갔다. 옴스크 쿠데타로 탄생한 군사독재의 첫 번째 대시험은 끝났다. 지나치게 늘어진 전선, 후방 농민의 적대, 정치적 정통성의 결여, 패배의 요인은 이미 이 단계에서 선명했다.

## 오룔과 풀코보, 그리고 시베리아의 얼음: 1919년 10월부터 1920년 2월까지의 반전

1919년 10월 둘째 주, 소비에트 정권은 붕괴 직전이었다. 10월 13일 데니킨의 의용군 제1군단(사령관 쿠테포프)이 오룔을 점령했고 정찰대는 툴라주까지 출몰했다. 모스크바까지 350킬로미터, 백군이 여기까지 온 적은 없었다. 열흘 뒤인 10월 20일에는 유데니치의 북서군이 페트로그라드 외곽 풀코보 고지에 도달했다. 적군 총사령관 세르게이 카메네프는 회고록에서 이렇게 썼다: "내전 전체를 통틀어 이보다 어려운 상황을 기억할 수 없다."

데니킨의 「모스크바 지령」(7월 3일)은 원래 세 방향에서 동시에 진격한다는 구상이었다. 브란겔의 캅카스군이 사라토프로, 시도린의 돈군이 보로네시로, 마이-마옙스키의 의용군이 쿠르스크-오룔-툴라 축선으로, 그리고 궁극적으로는 모스크바로. 그러나 7월에 콜차크가 우랄 너머로 밀려나면서 동부전선의 적군 병력이 남부전선으로 쏟아져 내려왔고, 9월에는 폴란드의 피우수트스키가 「통일되고 불가분의 러시아」를 고수하는 데니킨과의 동맹을 거부하고 소비에트 측과 비밀 휴전을 맺었다. 적군은 서부전선 병력까지 남부로 돌릴 수 있었다. 여기에 9월 말 네스토르 마흐노의 혁명반란군이 백군 후방을 뚫고 데니킨의 사령부가 있던 타간로크로 쇄도하자, 의용군은 모스크바 공세의 가장 결정적인 순간에 정예 연대를 후방으로 빼야 했다.

10월 11일, 예고로프가 지휘하는 적군 남부전선이 반격에 나섰다. 핵심은 라트비아 소총병사단과 에스토니아 소총병사단, 그리고 프리마코프의 적색 카자크 기병여단으로 편성된 타격집단이었다. 쿠테포프의 정예 사단들(코르닐로프, 드로즈돕스키, 마르코프)이 오룔을 향해 북진하는 동안, 라트비아 사수들은 측면에서 크로미로 파고들어 의용군의 배후를 위협했다. 오룔은 10월 20일 새벽 에스토니아 사단과 제9소총병사단에 의해 탈환되었다. 동시에 부됸니의 기병군단은 보로네시에서 마몬토프와 시쿠로의 백색 기병대를 격파했다. 부됸니는 전선 사령관의 명령을 어기고 직접 맞붙기를 선택했으며, 10월 24일 보로네시에 입성했다. 11월 15일 카스토르나야 철도 분기점이 함락되면서 의용군과 돈군은 두 동강이 났다.

위기가 무너진 것은 남부만이 아니었다. 페트로그라드 전선에서 트로츠키는 직접 북상해 방어를 조직했다. 유데니치군 제3보병사단이 모스크바-페트로그라드 철도를 차단하라는 명령을 무시하고 페트로그라드에 먼저 입성하려 한 실수 덕에, 토스노의 철도 분기점은 그대로 남아 있었고 트로츠키는 모스크바에서 지원군과 보급품을 실어 나를 수 있었다. 10월 21일 적군 제7군이 풀코보에서 반격을 개시해 백군을 차르스코예 셀로와 파블롭스크에서 몰아냈고, 10월 31일 루가가 탈환되었다. 유데니치군은 에스토니아 국경으로 밀려났고, 소비에트 정부와 평화 협상을 진행 중이던 에스토니아 정부는 백군의 무장 해제를 조건으로만 입국을 허용했다. 북서군은 12월 5일 공식 해산되었다.

동부에서는 그보다 더 근본적인 붕괴가 진행 중이었다. 10월 중순 토볼강 전선이 무너지면서 콜차크군은 조직적 저항력을 상실했고, 11월 14일 옴스크가 적군 제5군(사령관 에이헤)에 함락되었다. 이때부터 시작된 「대시베리아 빙상 행군」은 시베리아 횡단 철도를 따라 동쪽으로 2천 킬로미터를 후퇴하는 참극이었다. 영하 40도의 한파 속에서 발진티푸스가 군대를 휩쓸었고, 철도 통제권은 체코슬로바키아 군단이 쥐고 있어 백군 부대는 열차를 타지도 못했다. 12월 중순 동부전선 총사령관에 임명된 블라디미르 카펠 장군은 보병들을 이끌고 크라스노야르스크의 봉기를 우회해 바이칼 호수 얼음판을 걸어서 건넜으나, 자신은 동상과 폐렴으로 1월 26일 사망했다.

콜차크 자신은 열차로 이르쿠츠크를 향했으나, 체코슬로바키아 군단은 이미 자신들의 귀환을 우선시하고 있었다. 12월 27일 연합군 사령부는 체코 군단에 콜차크의 열차를 확보하라고 지시했고, 1월 14일 체코 군단은 콜차크와 러시아 제국의 금 보유고를 이르쿠츠크의 사회혁명당 계열 「정치중심」에 넘겼다. 정치중심은 곧 볼셰비키 군사혁명위원회에 권력을 이양했고, 2월 6일 밤부터 7일 새벽 사이 콜차크와 총리 빅토르 페펠랴예프는 이르쿠츠크 군사혁명위원회의 결정으로 우샤콥카 강변에서 총살되었다. 그들의 시신은 얼음을 뚫은 앙가라 강 구멍으로 던져졌다. 레닌이 스클랸스키에게 보낸 암호 메모, 즉 "콜차크를 처형하라는 명령을 내렸다는 소식을 퍼뜨리지 말라"는 중앙의 개입을 시사하지만, 현장의 이르쿠츠크 볼셰비키들 또한 자발적으로 같은 결론에 도달해 있었다.

1919년 10월의 동시 위기는 소비에트 권력이 지상 최대의 군사적 시험을 통과한 순간이었다. 3개 전선에서 동시에 벌어진 이 반전은 백군 진영의 구조적 모순, 즉 통일된 지휘의 부재와 점령지 민중의 적대, 그리고 ''통일되고 불가분의 러시아''라는 구호가 연쇄적으로 만들어낸 외교적 실패를 적나라하게 드러냈다. 콜차크의 시베리아 정부가 증발하고 데니킨군이 흑해 연안으로 밀려나며, 개입국들의 정치적 의지도 함께 증발했다. 영국은 1919년 말까지 백군 지원에 약 1억 파운드를 썼으나, 국내 노동계의 반대와 백군의 명백한 패색 속에 철수를 결정했다. 1920년 2월 7일 콜차크의 총살은 한 인물의 최후일 뿐 아니라, 열강의 개입이 결정적으로 실패했음을 알리는 신호였다.

## 1920년: 서쪽의 휴전과 크림의 백군 패배

1920년 봄 소비에트 러시아는 폴란드와 브란겔의 크림 백군이라는 서로 다른 전선을 상대했다. 폴란드·페틀류라의 키예프 공세 뒤 적군은 반격했으나 8월 바르샤바에서 패배했다. 10월 12일 서명한 휴전은 18일 발효됐고, 1921년 3월 18일 리가 조약으로 국경이 정해졌다. 민스크는 소비에트 쪽에 남았으며 우크라이나와 벨로루시의 서부 영토가 폴란드에 편입됐다. 작전과 동맹, 강화의 비용은 [소비에트-폴란드 전쟁](/commulingo/events/soviet-polish-war)에서 다룬다.

### 국경 지대의 강화

에스토니아의 타르투 조약(2월), 리투아니아의 모스크바 조약(7월), 라트비아의 리가 조약(8월), 핀란드의 타르투 조약(10월)은 주변 전선을 줄이려는 소비에트 러시아와 독립을 확보하려는 이웃 국가들의 필요가 만난 결과였다. 폴란드와의 리가 조약은 같은 해가 아니라 1921년 3월이다. 이 일련의 강화는 백군을 지원하던 주변국들을 영구적인 반소비에트 연합으로 묶을 수 없었음을 보여준다. 상세한 경위는 [발트 독립전쟁](/commulingo/events/baltic-wars-of-independence)으로 이어진다.

### 브란겔의 마지막 거점

남쪽에서는 이 패배와 거의 동시에 내전 최후의 막이 올랐다. 브란겔은 1920년 여름 크림에서 북타브리야로 진출해 곡창지대를 장악하고 잠시 숨을 돌렸으나, 10월 붉은 군대의 반격에 다시 반도로 밀려났다. 미하일 프룬제가 지휘하는 남부전선은 14만 6천 명의 병력과 985문의 포를 집결시켜 브란겔의 4만 1천 명을 압도했다. 크림으로 들어가는 문은 좁았다. 페레코프 지협의 튀르크 성벽(터키 성벽)은 폭 11킬로미터, 깊이 10미터의 해자를 갖춘 천연 요새였고, 백군은 3~5줄의 철조망과 3열의 참호로 방어선을 구축했다. 프룬제의 계획은 정면 돌파가 아니라 우회였다. 11월 8일 밤, 기온이 영하 12도까지 떨어진 가운데 6군 소속 15·51·52사단 병력 약 2만 명이 시바시의 얼어붙은 갯벌 7킬로미터를 도하해 방어가 취약한 리투아니아 반도로 상륙했다. 이튿날 튀르크 성벽은 협공에 무너졌고, 백군은 20~25킬로미터 남쪽의 유순 방어선으로 물러났다. 코르닐로프 충격연대의 완강한 저항과 이반 바르보비치 장군의 기병 역습이 있었지만, 네스토르 마흐노의 혁명반란군이 기관총을 장착한 타찬카로 백군 기병대를 분쇄하며 전세를 결정지었다. 11월 11일 유순 방어선이 뚫렸고, 크림으로 가는 길이 열렸다.

브란겔은 이미 철수를 준비하고 있었다. 11월 13일부터 16일까지 126척의 군함과 수송선, 예인선, 바지선에 군인과 민간인 약 14만 5천 명이 올랐다. 피난민들은 콘스탄티노폴리스로 향했고, 이후 갈리폴리 반도의 막사로 흩어졌다. 유럽 러시아에서 조직된 백군의 무장 저항은 이것으로 끝났다. 그러나 그 종말은 바르샤바에서의 패배와 짝을 이루었다. 붉은 군대가 세계혁명의 교두보를 세우려던 서쪽 길이 막힌 바로 그 계절에, 남쪽에서는 마지막 백군 거점을 쓸어내며 제국의 영토를 회복하고 있었던 것이다.

## 「제3의 혁명」인가, 반혁명인가 ― 크론시타트에서 블라디보스토크까지

브란겔이 크림에서 철수한 1920년 11월, 볼셰비키 지도부는 내전이 끝났다고 선언했다. 현실은 달랐다. 전시 공산주의의 연장 속에서 나라는 내전의 연장선에 있는 새로운 종류의 전쟁으로 빠져들었다. 1921년 2월 체카는 전국에서 118건의 농민 봉기를 집계했다. 가장 규모가 큰 탐보프 봉기에서 알렉산드르 안토노프가 이끄는 농민군은 2만 명에 가까운 병력으로 현을 장악하고 ''노동농민동맹''이라는 대안 정부를 세웠다. 시베리아에서는 수천 명의 농민 유격대가 식량 징발대와 충돌했다. 볼가 강 하류와 북캅카스에서도 무장 저항이 번졌다. 레닌은 제10차 당대회에서 이렇게 말했다: 「이 소부르주아적 반혁명은 의심할 여지 없이 데니킨, 유데니치, 콜차크를 합친 것보다 더 위험하다」.

1921년 3월 크론시타트 수병과 주민은 소비에트의 재선거와 정치적 자유, 징발의 종식을 요구하며 봉기했다. 정부는 이를 군사적으로 진압했다. 같은 시기 제10차 당대회는 곡물 징발을 현물세로 바꾸는 신경제정책과 당내 분파 금지를 추진했다. 양보와 통제 강화는 동시에 진행됐으며, 신경제정책이 요새 함락 뒤에야 결정된 것은 아니다. 결의·전투·진압 이후의 처벌은 [크론시타트 봉기](/commulingo/events/kronstadt-1921)에서 다룬다.

전쟁과 징발로 취약해진 농업에 1921년 가뭄이 겹치며 볼가 유역과 주변 지역에 대기근이 발생했다. 소비에트 정부의 정책 전환과 국제 구호는 위기를 완화했지만 막대한 사망과 사회적 붕괴를 막기에는 늦었다. 식량 정책과 미국구호국을 비롯한 구호의 경위는 [볼가 기근](/commulingo/events/volga-famine)에서 이어진다.

한편 극동에서는 아직 총성이 멈추지 않았다. 1920년 4월, 소비에트 러시아는 일본 점령군과의 직접 충돌을 피하기 위해 완충국인 극동공화국을 수립했다. 표면적으로는 다당제 민주공화국이었으나 실질적으로는 모스크바가 통제하는 임시방편이었다. 수도는 베르흐네우딘스크였다가 치타로 옮겼다. 1921년 5월 블라디보스토크에서 일본군의 묵인 아래 백위파 쿠데타가 일어나 메르쿨로프 형제의 프리아무르 임시정부가 들어섰고, 1922년 7월에는 젬스키 소보르가 미하일 디테릭스를 군사 독재자로 추대했다. 그러나 1922년 6월 일본 정부가 시베리아에서 10월 말까지 완전 철수를 선언하면서 백위파의 운명은 결정되었다. 인민혁명군이라는 이름으로 위장한 붉은 군대가 동진했고, 1922년 10월 25일 블라디보스토크에 입성했다. 내전이 시작된 지 4년 반 만의 일이었다. 11월 15일 극동공화국은 스스로를 해산하고 RSFSR에 합병되었으며, 한 달 뒤 소비에트 사회주의 공화국 연방이 수립되었다. 학자 조너선 스밀레가 지적했듯, 이로써 유럽 전역에 걸친 혁명의 물결이라는 1917년의 약속은 사실상 접힌 셈이었다. 살아남은 것은 혁명이 아니라, 내전의 용광로에서 주조된 국가 하나였다.

## 승리인가, 비극인가, 전주곡인가 ― 한 세기 동안의 평가

볼셰비키는 이겼다. 1922년 말 소비에트 권력은 옛 제국 영토의 태반을 장악했고, 12월 30일 소비에트 사회주의 공화국 연방이 수립되었다. 그러나 ''승리''는 좁은 의미의 군사적 승리였다. 핀란드, 에스토니아, 라트비아, 리투아니아는 독립을 지켰고, 폴란드는 리가 조약으로 서부 우크라이나와 벨라루스의 절반을 가져갔다. 소비에트 연방은 제정 러시아보다 작은 나라로 출발했다.

인적·물적 대가는 참혹했다. 전투 사망, 양측의 테러, 1921~22년 볼가 기근, 티푸스와 콜레라 등 전염병까지 합쳐 700만에서 1,200만 명이 목숨을 잃은 것으로 추산된다. 1921년 산업 생산은 1913년의 5분의 1로 추락했고, 도시 인구는 굶주림을 피해 농촌으로 흩어졌다. 소비에트 정권이 이만한 파괴 위에서 출발했다는 사실은 이후 모든 건설의 배경 조건이었다.

역사가들이 오늘날까지 논쟁하는 지점은 크게 셋이다.

첫째, 볼셰비키가 이긴 이유다. 소비에트 사학은 붉은 군대의 우월한 조직과 노동자·농민의 지지를 강조했고, 냉전기 서방 학자들은 백군의 무능과 분열에서 답을 찾았다. 오늘날의 합의는 양쪽 모두 진실의 일부라는 것이다. 백군이 농민에게 줄 토지 개혁도, 소수민족에게 줄 자치 약속도 내놓지 못한 반면, 볼셰비키는 적어도 적으로부터 땅을 지키는 쪽으로는 농민을 자기 편으로 묶을 수 있었다. 붉은 군대가 옛 제국 장교 7만여 명을 군사전문가로 동원한 반면, 백군은 민간 행정조차 세우지 못했다. 에반 모즐리는 "백군은 전쟁에서 이기기에는 충분한 군대를, 평화를 지배하기에는 턱없이 모자란 국가만을 가졌다"고 평했다.

둘째, 전시 공산주의의 성격이다. 레닌 자신도 후에 "실수였다"고 말한 이 정책이 전시 비상조치였는지, 아니면 공산주의로의 이념적 지름길이었는지는 첨예한 논쟁거리다. 라르스 리와 피터 홀퀴스트는 강제 징발과 국가 통제의 뿌리가 제1차 세계대전 당시 러시아를 비롯한 모든 교전국의 전시 동원 체제에 있었다고 보았다. 반면 리처드 파이프스 등은 전시 공산주의에서 이미 스탈린 체제의 원형이 갖추어졌다고 주장한다. 오늘날의 연구는 양쪽 모두를 인정하는 쪽에 가깝다. 전시 공산주의는 분명 비상 상황에 대한 즉흥적 대응이었지만, 볼셰비키 지도부는 그 즉흥성을 이념의 언어로 정당화했고, 그 과정에서 일당 독재, 정치경찰의 광범위한 권한, 경제의 중앙집권화라는 소비에트 체제의 지속적 특징들이 굳어졌다.

셋째, 내전이 소비에트 체제의 유전자에 남긴 흔적이다. 1921년 3월 제10차 당대회는 크론시타트 수병들의 총성을 들으며 두 가지 역사적 결정을 내렸다. 하나는 신경제정책으로의 전환이었고, 다른 하나는 당내 분파 활동의 금지였다. 경제에서는 후퇴하고 정치에서는 조이는 이 이중 결정이 이후 소비에트사의 기본 패턴이 되었다. 시오반 필링은 "일당 국가, 광범한 권한을 가진 정치경찰, 극단적 경제 중앙집권, 토론을 선동으로 대체하는 방식, 국가 이익을 위한 관료적 인구 동원, 이 모든 것이 전시 공산주의 아래서 굳어졌다"고 지적한다.

내전은 혁명의 생존을 보장했지만, 그 생존의 방식이 혁명의 내용을 바꾸었다. 1917년의 노동자 통제와 소비에트 민주주의, 자유로운 논쟁의 공간은 1922년에 이르러 군사적 명령 체계와 일당 독재, 비밀경찰의 감시로 바뀌어 있었다. 이 변형이 내전이라는 용광로 없이 가능했을지는, 한 세기가 지난 지금도 답할 수 없는 질문으로 남아 있다.

우크라이나의 라다·헤트만·디렉토리아와 농민군의 전쟁은 [우크라이나 혁명과 전쟁](/commulingo/events/ukraine-1917-1921)에서 연결해 읽을 수 있다.
',
  body_en='## No Army, No Allies, No Bread: Soviet Power at the Start of 1918

When the Bolsheviks seized power in Petrograd on 7 November 1917, they had almost nothing that could be called an army, and by March 1918 that had not changed. The old Imperial army was disintegrating. On 29 January 1918, the Soviet commander-in-chief Nikolai Krylenko ordered the demobilisation of the entire armed forces; millions of soldiers abandoned their weapons and went home. The only armed force at the Bolsheviks'' disposal was the Red Guards: volunteer detachments of factory workers useful for defending cities or mounting small operations along the railways, but wholly incapable of fighting a regular war. The Workers'' and Peasants'' Red Army was decreed into existence on 28 January 1918, but no one had yet built the road from that proclamation to a soldier at the front.

The Bolsheviks'' political base was equally fragile. During the so-called "triumphal march of Soviet power" in the weeks after October, detachments of Red Guards and revolutionary sailors fanned out along the rail network to Mogilev (the old army headquarters) to Kiev and to the Don region, crushing scattered resistance. Yet by February 1918 the territory under effective Soviet control was still limited to Petrograd, Moscow, the railway axis between them, and a handful of industrial towns in central Russia. The vast countryside and the imperial periphery lay in a power vacuum.

The election to the Constituent Assembly, held on 25 November 1917, delivered a cold verdict on Bolshevik rule. The Socialist Revolutionary Party won roughly 40 percent of the vote and a majority of seats; the Bolsheviks received less than a quarter. When the Assembly convened at the Tauride Palace on 18 January 1918, it elected the SR leader Viktor Chernov as its president and refused to endorse the Bolshevik "Declaration of the Rights of the Working and Exploited People." The following morning the Bolshevik-led All-Russian Central Executive Committee dissolved it by force. The democratic alternative within the revolution was closed after thirteen hours.

The cities were desperate. Amid the chaos of war and revolution, factories closed; Petrograd''s industrial workforce fell from 400,000 in early 1917 to fewer than half that by the spring of 1918. Food shortages were chronic and the currency had collapsed. In May 1918 the Bolsheviks proclaimed a "food dictatorship" and sent armed requisition detachments into the countryside to seize grain: a policy that would fuel peasant hostility for the years to come.

In the spring of 1918, the Soviet republic faced a fight for its existence with no army, no allies, and no bread. In the south, Kornilov''s successors were organising the Volunteer Army, and along the Trans-Siberian Railway the 40,000 men of the Czechoslovak Legion were about to become the spark that turned scattered clashes into full-scale civil war.

## Building a Red Army with the time bought at Brest

The peace of 3 March 1918 was a retreat imposed by German advances on a Soviet government whose army was disintegrating. Lenin demanded immediate peace, Bukharin revolutionary war, and Trotsky an end to fighting without signing a settlement. The February offensive forced acceptance of Lenin''s course; the Left SRs left the government.

Peace did not follow in Ukraine, the Baltic region or Finland. German occupation intersected with domestic struggles, and German defeat in November reopened the contest. Negotiations, party debate and eastern occupation are covered in [Brest-Litovsk](/commulingo/events/brest-litovsk).

The crisis accelerated the transformation of a volunteer Red Army into a regular force. As war commissar from March 1918, Trotsky abolished elected officers and recruited former imperial military specialists. Universal training in April and subsequent conscription created an apparatus capable of mass warfare. Later commemorations of a victory at Narva on 23 February should not be mistaken for this actual process of army-building.

Political commissars supervised specialists'' orders and loyalty. Combining professional knowledge with party control generated opposition inside the party, but centralized mobilization, supply and command proved decisive in the war.

## One Fist and Ten Beachheads: How May–August 1918 Turned the Civil War into Total War

In early 1918, Don Cossacks and the Volunteer Army in the Kuban formed centres of anti-Bolshevik resistance. German occupation in Ukraine belonged to a different, much larger military intervention. Between late May and August, two events transformed these local clashes into total war: the revolt of the Czechoslovak Legion and the Allied intervention.

The Legion was a force of roughly 40,000 Czechs and Slovaks, mostly deserters and prisoners of war from the Austro-Hungarian army. They had fought on the Russian side with the dream of winning an independent state, and after Brest-Litovsk they sought to reach the Western Front, where the Allies were still fighting Germany. The only route was 9,700 kilometers east on the Trans-Siberian Railway to Vladivostok, then by ship to France. Under the Penza Agreement of March 25, 1918, the Soviet government guaranteed this passage on condition that the Legion surrender all weapons except a small number of rifles for guard duty.

The agreement was troubled from the start. The railway was single-track, and under the terms of Brest-Litovsk, priority went to trains repatriating German, Austrian, and Hungarian POWs westward. The Czechoslovaks suspected the Bolsheviks meant to hand them over to the Germans; the Bolsheviks suspected the Legion would become a tool of Allied counter-revolution. On May 14, at the Chelyabinsk station, an eastbound Legion train encountered a westbound train of Hungarian POWs. A piece of iron thrown from the Hungarian side injured one legionnaire. The Legion pulled the culprit off the train and lynched him. When the local soviet intervened and arrested some legionnaires, the Legion stormed the station, freed their men, and seized the city.

On May 25, Trotsky issued the order: "All units of the Czechoslovak Corps must be immediately disarmed; those who resist are to be shot." At an army congress in Chelyabinsk, the Legion, against the wishes of the National Council, refused to disarm and resolved to fight their way to Vladivostok fully armed. By early June, the Legion had toppled Soviet power along the railway from Penza to Krasnoyarsk. On June 8, they captured Samara, enabling the formation of the first anti-Bolshevik government, the Committee of Members of the Constituent Assembly (Komuch), dominated by the Socialist Revolutionaries. By July, the Legion controlled the entire Trans-Siberian Railway, including Vladivostok. In barely two months, 40,000 foreign troops had rewritten the geopolitics of a continent stretching from the Volga to the Pacific.

Parallel to the revolt, the Allied intervention became a reality. Its initial pretext was defensive: preventing the stockpiles of Allied materiel in Murmansk and Arkhangelsk from falling into German hands. On March 4, 1918, the day after the Brest-Litovsk treaty was signed, 170 British Marines landed at Murmansk, at the invitation of the local Murmansk Soviet, which feared a German attack. Even Trotsky initially welcomed their arrival. But by June, the Allied force in the north exceeded 12,000 men, and on August 2 they landed at Arkhangelsk as well. In the Far East, Japan had already put marines ashore at Vladivostok in January 1918 and reinforced them in April. On August 3, British, French, and American troops also arrived at Vladivostok. President Wilson, who had resisted intervention, authorized 5,000 troops for North Russia and 8,000 for Siberia under the banner of rescuing the Czechoslovak Legion. Japan ultimately deployed up to 70,000 men, pursuing its own vision of a buffer state in Siberia. Fourteen nations took part, with landing points scattered across Eurasia: Murmansk and Arkhangelsk in the north, Vladivostok in the Far East, Odessa and the Black Sea coast in the south, and the Caucasus beyond the Caspian.

The revolt and the intervention fed each other. When the Czechoslovak Legion seized the Trans-Siberian Railway, the Allies made "rescuing the Czechs" the public rationale for expanding their intervention. When the Allies landed, the Legion saw itself as the vanguard of Allied forces and pushed even harder to form an anti-Bolshevik front. By the end of summer 1918, Soviet Russia was effectively surrounded on all sides. The peace with Germany signed in March had bought a breathing spell, not peace. The civil war was no longer a Russian fight alone.

### Germany''s occupation and intervention in the south

Germany exercised extensive military power across Ukraine, the Baltic region and Finland in 1918: supporting Skoropadskyi, administering occupied lands and sponsoring dependent states, and sending its Baltic Sea Division to assist the Finnish Whites. These Central Powers'' policies differed in timing and purpose from Allied anti-Bolshevik intervention. Conditional German retention under Article XII of the November armistice helped set the stage for the Baltic Freikorps campaigns. See [Brest-Litovsk](/commulingo/events/brest-litovsk) and the [Baltic wars of independence](/commulingo/events/baltic-wars-of-independence).

French and Greek troops intervened around Odesa from December 1918, withdrawing in April 1919 amid uncertain alliances, Soviet military pressure and war weariness. British intervention likewise extended beyond northern Russia and Siberia. Dunsterforce''s 1918 Baku operation concerned oil, communications and Ottoman advances; later Caucasian deployments and the Malleson mission in Central Asia reflected further regional interests. Treating every deployment as a single coordinated campaign to overthrow Soviet power obscures their differing aims and withdrawal dates.

## The Home Front of Total War: Execution and Requisition, 1918–1920

On 30 August 1918, Moisei Uritsky, chief of the Petrograd Cheka, was assassinated by Leonid Kannegisser, a young former cadet. That same evening in Moscow, the Socialist Revolutionary Fanya Kaplan fired two shots into Lenin as he left a factory workers'' meeting, gravely wounding him. These twin attacks, coming after a mounting crisis that had already seen the Left SR uprising of 6 July and the killing of V. Volodarsky on 20 June, forced a decisive rupture in the Bolshevik leadership.

On 5 September Sovnarkom issued its decree "On the Red Terror." Drafted by Justice Commissar Dmitry Kursky, it directed that "class enemies be isolated in concentration camps" and that "all persons associated with White Guard organizations, plots, and rebellions are liable to be shot," with the names and reasons for execution to be published. The decree institutionalized terror as a systematic instrument of rear security. Even before its publication, Chekists had already killed approximately 1,300 "bourgeois hostages" in Petrograd and Kronstadt, and in the first two months after the decree between 10,000 and 15,000 people were summarily executed nationwide, two to three times the number of death sentences carried out by the tsarist regime over the ninety-two years from 1825 to 1917.

What set the Red Terror apart from the White was how thoroughly it was theorized. Cheka official Martin Latsis wrote in the organ Red Terror: "We are not waging war against individual persons. We are exterminating the bourgeoisie as a class. During the investigation, do not look for evidence that the accused acted in deed or word against Soviet power. The first question you must ask is: to what class does he belong? What is his origin, his education, his profession? It is these questions that should determine the fate of the accused." Class origin itself became grounds for a death sentence.

The White Terror, by contrast, was carried out without a systematic decree, but was no less brutal. Kolchak''s forces executed workers and socialists en masse in occupied territory. In December 1918, General Krasilnikov''s units massacred several hundred imprisoned socialist activists and workers in Omsk. In the south, Denikin''s army and Cossack units carried out pogroms against Jews, killing tens of thousands. The advance and retreat of White armies was everywhere accompanied by civilian massacres, especially as reprisals just before abandoning a town.

In parallel, the Soviet government restructured the entire economy as a war-mobilization system. The starting point was the food dictatorship decree of 13 May 1918. The People''s Commissariat for Food, under Alexander Tsyurupa, gained authority to enforce the grain monopoly by armed force. Armed food detachments drawn from urban workers were dispatched into the countryside. In June 1918 the Committees of the Poor were formed, tasked with identifying and confiscating kulak grain from inside the village. The Bolshevik design was to reorganize the village into a class front, pitting the poor against the kulaks; in practice, when the requisitioning brigades took seed grain and the bare minimum of food, the entire village resisted.

According to Orlando Figes, July and August 1918 alone saw more than 200 peasant uprisings against the food brigades. In one village in Samara province, after the brigade had robbed and murdered several villagers, peasants exacted a savage revenge: one night they beheaded all twelve members of the brigade as they slept in the party offices and placed their heads on poles at the village entrance. The Bolsheviks labeled these "SR-kulak revolts," but they were in fact village-wide rebellions in which even the poorest peasants often took a leading role.

In January 1919 the food dictatorship was extended into the general food levy (prodrazverstka). Fixed quotas were set by Moscow and broken down from guberniya to uezd to volost to individual household. Because the quotas were calculated from state need rather than actual harvests, what was taken was often not surplus but seed and subsistence. By the end of 1920 the levy covered not only grain but potatoes, meat, milk, eggs, nearly every agricultural product.

In the cities, nationalization accelerated. The decree of 28 June 1918 nationalized large-scale industry; by November 1920 even small workshops with as few as five workers, village smithies and tailoring shops, were nationalized. Private trade was banned, and markets like Moscow''s Sukharevka were closed as "bourgeois survivals." Rationing operated on a class system, dividing the urban population into four categories, with distribution ratios of 4:3:2:1 in Moscow and 8:4:2:1 in Petrograd. Lenin said the bourgeoisie should be put on an "eighth ration" or given nothing at all. Unrestricted currency emission devalued the ruble to nothing; by late 1920 housing, transport, post, and medicine were made free, as the regime aimed to abolish money itself.

War communism succeeded in supplying the Red Army with the minimum bread and weapons needed to win the civil war. But the peasantry responded by reducing their sown area; grain yields in major regions plummeted to a quarter of prewar levels by 1920. Petrograd lost 70 per cent of its population, Moscow more than half. Between 1920 and 1921 a full-scale peasant war, the Tambov rebellion drew as many as 120,000 participants, swept the country, until, in March 1921 at Kronstadt, the revolution trained its guns on its own sons. The three years driven through with terror and requisition were the years in which the Soviet state secured the conditions of its survival, but they were also the years in which that survival steadily consumed its own social foundations.

## The Death of Democracy and the Birth of Military Dictatorship: Kolchak''s Rise and First Defeat

On the night of 17 November 1918, Cossack detachments in Omsk raided the residences of the SR leadership. The chairman of the Provisional All-Russian Government (Ufa Directory), Nikolai Avksentiev, and Interior Minister Vladimir Zenzinov were arrested; the Directory''s security battalion was disarmed. The next morning Prime Minister Pyotr Vologodsky convened an emergency cabinet meeting that resolved to "transfer full authority to a single leader," and a secret ballot elected the Minister of War and Navy, Alexander Kolchak. He took the title Supreme Ruler and promoted himself to full admiral. The democratic coalition hammered together at the Ufa State Conference two months earlier was dead.

The coup that shifted the anti-Bolshevik camp from SR parliamentarism to military dictatorship was engineered by the Eastern Section of the Kadet Party, above all Viktor Pepelyaev. The head of the British military mission, General Alfred Knox, had been saying for months that "this people needs the whip." Kolchak himself had no political experience. "I am a military technician who knows nothing of politics," he said, and called power "a cross." But the resources at his disposal were real: the imperial gold reserve seized at Kazan, worth over 650 million gold rubles; 600,000 rifles, 6,831 machine guns, and 200,000 uniforms supplied by Britain in one year; and roughly 100,000 troops. These were organized into three armies: Radola Gajda''s Siberian Army in the north, Mikhail Hanzhin''s Western Army in the center, and Alexander Dutov''s Orenburg Army in the south.

On 4 March 1919, the White spring offensive struck. The decisive blow came in the center, where Hanzhin''s roughly 49,000-strong Western Army drove between the Red Fifth Army (about 10,000 men) and Second Army. The Fifth collapsed within four days; on 16 March Hanzhin took Ufa without a fight. By 10 April he had secured Bugulma and stood within 100 km of the Volga. In the north, Gajda took Sarapul; in the south, Dutov captured Orsk. Samara and Kazan were threatened, and Moscow had to rush reserves east.

But the victory itself created the conditions for defeat. Hanzhin''s front had stretched to 250-300 km, with gaps opening between his divisions and operational contact with Dutov lost to the south. Mikhail Frunze drove into that gap. As commander of the Eastern Front''s Southern Group, he had the First Army (Gaya Gai), the Fifth Army (Mikhail Tukhachevsky), and the Turkestan Army (Georgy Zinoviev). His plan was simple: concentrate a strike group at Buzuluk and drive north into the overextended left flank of Hanzhin.

On 22-25 April, Gaya Gai''s First Army annihilated General Bakich''s IV Corps on the Salmysh River, destroying two divisions. This stripped the rear of Hanzhin''s army bare. On 28 April, Frunze''s main blow struck Hanzhin''s 11th and 6th Divisions southeast of Buguruslan, with Vasily Chapayev''s 25th Division and Genrikh Eikhe''s 26th Division in the lead. The Red Army retook Buguruslan on 4 May and marched into Bugulma on 13 May. Even Vladimir Kappel''s Volga Corps, rushed in as a reserve, was crushed at the Battle of Belebey on 15-19 May.

As Hanzhin retreated beyond the Belaya River, Gajda''s Siberian Army to the north found its flank dangerously exposed. Vasily Shorin''s Northern Group counterattacked on the Sarapul-Votkinsk axis, retaking Izhevsk on 7 June. The same day the Turkestan Army crossed the Belaya. Ufa fell on 9 June, and Kolchak''s forces began a general retreat across the Urals. In two months the March offensive had turned to catastrophe, and the initiative on the Eastern Front decisively passed to the Red Army. The first great test of the military dictatorship born at Omsk was over. The causes of its failure, overextended lines, a hostile peasant rear, and a fatal deficit of political legitimacy, were already unmistakable.

## Oryol, Pulkovo, and the Siberian Ice: The Reversal, October 1919–February 1920

During the second week of October 1919, the Soviet regime stood on the brink. On 13 October the 1st Army Corps of Denikin''s Volunteer Army, under General Alexander Kutepov, captured Oryol, and White patrols pushed into Tula province. Moscow lay 350 kilometres away; the Whites had never come so close. Ten days later, on 20 October, Yudenich''s Northwestern Army reached the Pulkovo Heights on the outskirts of Petrograd. The commander-in-chief of the Red Army, Sergey Kamenev, later wrote: "I cannot recall a more difficult situation during the entire Civil War."

Denikin''s Moscow Directive of 3 July had envisaged a three-pronged advance: Wrangel''s Caucasus Army on Saratov, Sidorin''s Don Army on Voronezh, and May-Mayevsky''s Volunteer Army along the Kursk-Oryol-Tula axis, converging on Moscow. But by July Kolchak had been driven beyond the Urals, freeing Red troops from the Eastern Front for the south. In September, Józef Piłsudski, unwilling to aid a White movement that insisted on a "united and indivisible Russia," concluded a secret truce with the Soviets, allowing the Red Army to redirect forces from the Western Front as well. And in late September, Nestor Makhno''s Revolutionary Insurgent Army broke through the White rear and raced toward Taganrog, where Denikin had his headquarters. At the most decisive moment of the Moscow offensive, elite regiments had to be pulled from the front to save the rear.

On 11 October the Red Southern Front under Alexander Yegorov went over to the counteroffensive. The core of the attack was a shock group built around the Latvian Rifle Division, the Estonian Rifle Division, and Vitaly Primakov''s Red Cossack cavalry brigade. While Kutepov''s elite divisions (the Kornilov, Drozdovsky, and Markov regiments) pushed north toward Oryol, the Latvian riflemen drove into their flank at Kromy, threatening the Volunteer Army''s rear. Oryol was retaken at dawn on 20 October by the Estonian and 9th Rifle Divisions. Meanwhile Semyon Budyonny''s Cavalry Corps, against the orders of the front commander who wanted to bypass the White cavalry rather than face it directly, routed the White horse of Mamontov and Shkuro at Voronezh, entering the city on 24 October. When Budyonny took the Kastornoye railway junction on 15 November, the Volunteer Army and the Don Army were split in two.

The southern front was not the only one collapsing for the Whites. On the Petrograd front, Trotsky travelled north personally to organize the defence. Yudenich''s 3rd Infantry Division had ignored orders to cut the Moscow-Petrograd railway at Tosno in its eagerness to enter Petrograd first, and the junction remained intact; Trotsky used it to bring in reinforcements and supplies from Moscow. On 21 October the Red 7th Army counterattacked from Pulkovo, driving the Whites from Tsarskoye Selo and Pavlovsk, and Luga was retaken on 31 October. Yudenich''s army was pushed toward the Estonian border. Estonia, which was negotiating peace with the Soviet government, refused to admit the Northwestern Army except disarmed and in small groups. The army disbanded on 5 December.

In the east an even more fundamental collapse was underway. By mid-October the Tobol River front had broken, Kolchak''s army lost the capacity for organized resistance, and Omsk fell to the Red 5th Army under Genrikh Eiche on 14 November. What followed, the Great Siberian Ice March, was a 2,000-kilometre retreat along the Trans-Siberian Railway in temperatures that dropped to minus 40 degrees Celsius. Typhus swept through the ranks. The Czechoslovak Legion controlled the railway and refused the White troops access to the trains. General Vladimir Kappel, appointed commander-in-chief of the Eastern Front in mid-December, led his infantry on foot around the insurgent-held city of Krasnoyarsk and across the frozen surface of Lake Baikal, dying of frostbite and pneumonia on 26 January.

Kolchak himself travelled ahead by train toward Irkutsk, but the Czechoslovak Legion had already decided to prioritize its own evacuation. On 27 December the Allied command ordered the legionnaires to secure Kolchak''s train, and on 14 January they handed Kolchak, along with the imperial gold reserve, to the SR-aligned Political Centre in Irkutsk. The Political Centre soon ceded power to a Bolshevik Military-Revolutionary Committee, and on the night of 6–7 February, Kolchak and his prime minister Viktor Pepelyayev were shot by the order of the Irkutsk Military-Revolutionary Committee on the bank of the Ushakovka River. Their bodies were dropped through a hole cut in the ice of the Angara. Lenin''s coded note to deputy war commissar Ephraim Sklyansky, "do not spread the news that you gave the order to execute Kolchak," points to central involvement, but the Irkutsk Bolsheviks on the ground had independently reached the same conclusion.

The simultaneous crisis of October 1919 was the moment Soviet power passed the greatest military test it would ever face. The reversal on three fronts at once laid bare the structural contradictions of the White movement: the absence of unified command, the hostility of the populations under their occupation, and the diplomatic failures that the slogan of "Russia, one and indivisible" set off in a chain reaction. As Kolchak''s Siberian government evaporated and Denikin''s forces tumbled back toward the Black Sea, the political will of the intervening powers evaporated too. Britain had spent roughly £100 million on the White cause by the end of 1919, but opposition from its own labour movement and the manifest failing of the White armies prompted withdrawal. Kolchak''s execution on 7 February 1920 was not only the end of a man, but the signal that foreign intervention had decisively failed.

## 1920: an armistice in the west, White defeat in Crimea

Soviet Russia faced Poland and Wrangel''s Crimean Whites on separate fronts. The Polish-Ukrainian Kyiv offensive prompted a Red counterattack, defeated at Warsaw in August. An armistice signed on 12 October took effect on 18 October; the Treaty of Riga followed on 18 March 1921. Minsk remained Soviet, while western Ukrainian and Belarusian territories passed to Poland. Operations, alliances and the settlement''s costs are covered in the [Polish-Soviet War](/commulingo/events/soviet-polish-war).

### Peace in the borderlands

Estonia''s Tartu treaty in February, Lithuania''s Moscow treaty in July, Latvia''s Riga treaty in August and Finland''s Tartu treaty in October 1920 reflected Soviet efforts to reduce active fronts and neighbours'' efforts to secure independence. The Polish-Soviet Riga treaty came the following March, not in the same year. These settlements showed why neighbouring states could not be bound permanently into a White anti-Soviet alliance. The [Baltic wars of independence](/commulingo/events/baltic-wars-of-independence) explains their distinct paths.

### Wrangel''s last stronghold

In the south, almost simultaneously, the civil war''s final act opened. Wrangel had broken out of Crimea into northern Tavria in the summer of 1920, seizing grainlands and buying time, but by October the Red Army''s counteroffensive had driven his forces back onto the peninsula. Mikhail Frunze''s Southern Front massed 146,400 troops and 985 guns against Wrangel''s 41,000. The gateway into Crimea was narrow. The Turkish Wall at the Perekop isthmus was a natural fortress: an 11-kilometer rampart fronted by a ditch up to 10 meters deep, with three to five rows of barbed wire and three lines of trenches. Frunze''s plan turned on not a frontal assault but a flanking march. On the night of November 8, with the temperature at minus 12 degrees Celsius, roughly 20,000 soldiers of the 6th Army''s 15th, 51st, and 52nd divisions waded seven kilometers across the frozen mudflats of the Syvash and landed on the weakly defended Lithuanian Peninsula. By the next day the Turkish Wall collapsed under the combined pressure, and the Whites fell back to the Yushun line, 20-25 kilometers to the south. Despite stubborn resistance from the Kornilov Shock Regiment and a desperate cavalry counterattack by General Ivan Barbovich, Nestor Makhno''s insurgent anarchists deployed their tachanki (horse-drawn carts mounting machine guns) to mow down the White horsemen, turning the battle. On November 11, the Yushun line was breached and Crimea lay open.

Wrangel had already prepared for evacuation. From November 13 to 16, some 145,000 soldiers and civilians boarded 126 ships (warships, transports, tugs, barges) and sailed for Allied-occupied Constantinople, eventually scattering to camps on the Gallipoli Peninsula and beyond. Organized White armed resistance in European Russia was over. But its end was paired with the defeat at Warsaw: in the very season in which the Red Army''s western road to world revolution was blocked, it swept away the last White bastion in the south and reclaimed the territory of the empire.

## ''Third Revolution'' or Counterrevolution: From Kronstadt to Vladivostok

When Wrangel evacuated Crimea in November 1920, the Bolshevik leadership declared the civil war over. Reality was otherwise. The prolongation of war communism plunged the country into a new kind of war, one that was the civil war''s direct continuation. In February 1921 the Cheka counted 118 peasant uprisings across the country. The largest, the Tambov rebellion, saw Alexander Antonov''s peasant army of nearly twenty thousand men seize control of whole districts and establish an alternative government, the Union of Working Peasants. In Siberia thousands of peasant partisans fought grain-requisitioning detachments. Armed resistance also flared on the lower Volga and in the North Caucasus. Lenin told the Tenth Party Congress: ''This petty-bourgeois counterrevolution is undoubtedly more dangerous than Denikin, Yudenich, and Kolchak combined.''

In March 1921 Kronstadt''s sailors and inhabitants demanded new Soviet elections, political freedoms and an end to requisitioning. The government suppressed the rising militarily. At the same time the Tenth Party Congress pursued both a tax in kind, inaugurating the New Economic Policy, and a ban on party factions. Concession and stronger political control proceeded together; the economic decision did not wait until the fortress fell. The resolutions, fighting and subsequent punishment are examined in the [Kronstadt rebellion](/commulingo/events/kronstadt-1921).

The 1921 drought struck agriculture already damaged by war and requisitioning, producing famine in the Volga region and beyond. Policy changes and international relief mitigated the disaster but came too late to prevent immense loss of life. Food policy and relief, including the American Relief Administration, are discussed in the [Volga famine](/commulingo/events/volga-famine).

Meanwhile, in the Far East the guns had not stopped. In April 1920 Soviet Russia created the Far Eastern Republic, a buffer state meant to avert a direct clash with the Japanese occupying forces. Nominally a multiparty democracy, it was in practice an expedient controlled from Moscow. Its capital moved from Verkhneudinsk to Chita. In May 1921 a White coup in Vladivostok, condoned by the Japanese, installed the Merkulov brothers'' Provisional Government of the Priamur; in July 1922 a Zemsky Sobor named Mikhail Dieterichs military dictator. But in June 1922 the Japanese government announced a complete withdrawal from Siberia by the end of October, and the Whites'' fate was sealed. The Red Army, thinly disguised as the People''s Revolutionary Army of the Far Eastern Republic, advanced eastward, and on 25 October 1922 entered Vladivostok. The civil war was over, four and a half years after it had begun. On 15 November the Far Eastern Republic dissolved itself and was absorbed into the RSFSR; a month later the Union of Soviet Socialist Republics was founded. As the scholar Jonathan Smele has noted, the promise of 1917, a wave of revolution across Europe, was now effectively foreclosed. What survived was not the revolution but a state forged in the crucible of civil war.

## Victory, Tragedy, or Prelude: A Century of Reckoning

The Bolsheviks won. By the end of 1922 Soviet power controlled most of the former empire, and on December 30 the Union of Soviet Socialist Republics was founded. But ''victory'' is the word for a military outcome, and it was only that. Finland, Estonia, Latvia, and Lithuania kept their independence; Poland took western Ukraine and half of Belarus through the Treaty of Riga. The Soviet Union began as a smaller country than Imperial Russia had been.

The human and material cost was catastrophic. Battle deaths, terror from both sides, the Volga famine of 1921-22, and epidemics of typhus and cholera together claimed an estimated 7 to 12 million lives. By 1921 industrial output had collapsed to a fifth of the 1913 level, and the cities emptied as people fled hunger for the countryside. That the Soviet regime began on such a foundation of destruction is the background condition of everything that followed.

Three debates among historians remain open.

The first is why the Bolsheviks won. Soviet historiography stressed the superior organization of the Red Army and the support of workers and peasants; Cold War-era Western scholars found the answer in White incompetence and disunity. The consensus today is that each side holds part of the truth. The Whites offered the peasants no land reform and the empire''s national minorities no promise of autonomy, whereas the Bolsheviks could at least present themselves as the side that would keep the land from the old landlords. The Red Army mobilized some seventy thousand former imperial officers as military specialists; the Whites could not even build a functioning civilian administration. Evan Mawdsley concluded that "the Whites had armies enough to win a war but far too little state to govern a peace."

The second concerns the nature of war communism. Whether the policies that Lenin himself later called "a mistake" were an emergency response to wartime conditions or an ideological shortcut to communism remains sharply contested. Lars Lih and Peter Holquist have argued that the roots of forced requisitioning and state control lay in the wartime mobilization systems that all the belligerent powers, including Imperial Russia, had developed during the First World War. Richard Pipes and others, by contrast, see in war communism the prototype of the Stalinist system already taking shape. The weight of recent scholarship leans toward recognizing both dimensions: war communism was improvisation under emergency, but the Bolshevik leadership justified that improvisation in the language of ideology, and in the process the durable features of the Soviet system, one-party rule, a political police with extensive powers, and extreme economic centralization, solidified.

The third is what mark the civil war left on the genetic code of the Soviet system. The Tenth Party Congress of March 1921, convened as the guns were still trained on the Kronstadt sailors, issued two historic decisions: the turn to the New Economic Policy, and the ban on factional activity inside the party. This twin move, retreat in economics and tightening in politics, became the default pattern of Soviet history thereafter. Siobhan Peeling observes that "a one-party state, buttressed by a radical version of Marxism and a political police with extensive powers, extreme economic centralization, the replacement of debate with agitation, and the bureaucratic mobilization of the population in the interests of the state, all of these features solidified under war communism."

The civil war secured the revolution''s survival, but the method of survival changed the content of the revolution. The workers'' control, soviet democracy, and open debate of 1917 had by 1922 given way to a military chain of command, one-party dictatorship, and secret-police surveillance. Whether that transformation could have happened without the crucible of civil war remains, a century later, a question no one can answer.

The Rada, Hetmanate, Directory and peasant armies are discussed in [Ukraine’s revolution and wars](/commulingo/events/ukraine-1917-1921).
',
  relations='{"related": []}'::jsonb,
  updated_at=NOW() WHERE id='civil-war';
UPDATE commulingo_history_events SET
  relations='{"parent": "civil-war"}'::jsonb,
  updated_at=NOW() WHERE id='kronstadt-1921';
UPDATE commulingo_history_events SET
  relations='{"parent": "civil-war"}'::jsonb,
  updated_at=NOW() WHERE id='volga-famine';
UPDATE commulingo_history_events SET
  sort_order=42,
  period_label='1919–1921',
  sources='["Norman Davies, White Eagle, Red Star: The Polish-Soviet War 1919-1920, London, 1972.", "Красноармейцы в польском плену в 1919-1922 гг. Сборник документов и материалов. М.-СПб., 2004 — российско-польское совместное издание; оценка смертности военнопленных.", "Приказ войскам Западного фронта № 1423 от 2 июля 1920 г. (М. Н. Тухачевский).", "В. И. Ленин, выступление на IX Всероссийской конференции РКП(б) 22 сентября 1920 г. (опубл. 1992) — оценка похода на Варшаву; Clara Zetkin, Reminiscences of Lenin, 1929.", "Wikipedia (en), \"Polish-Soviet War,\" \"Battle of Warsaw (1920),\" \"Peace of Riga,\" for chronology, orders of battle and figures.", "https://www.gov.pl/web/francja/wsparcie-francji-dla-polski-w-wojnie-polsko-bolszewickiej", "https://www2.mfa.gov.lv/en/poland/embassy-of-latvia/history-of-polish-latvian-relations", "https://www.vle.lt/straipsnis/lucjan-zeligowski/"]'::jsonb,
  timeline='[{"body": {"en": "With Germany''s surrender Pilsudski took command in Warsaw. No treaty defined the eastern border of the reborn state.", "ko": "독일의 항복과 함께 피우수트스키가 바르샤바에서 군권을 넘겨받았다. 부활한 폴란드의 동쪽 국경은 어떤 조약에도 정해져 있지 않았다."}, "date": "1918.11.11", "title": {"en": "Poland regains independence after 123 years", "ko": "폴란드, 123년 만의 독립 회복"}}, {"geo": {"lat": 52.53, "lng": 24.98, "kind": "point", "label": {"en": "Bereza Kartuska", "ko": "베레자 카르투스카"}}, "body": {"en": "Advancing into the vacuum left by the withdrawing Germans in Belorussia, Polish and Red Army units met and fought for the first time. War was never formally declared.", "ko": "독일군이 빠져나간 벨로루시의 진공으로 폴란드군과 붉은군대가 마주 들어오다 처음 충돌했다. 선전포고는 끝내 없었다."}, "date": "1919.02.14", "title": {"en": "Bereza Kartuska: the first clash", "ko": "베레자 카르투스카: 첫 교전"}}, {"geo": {"lat": 54.69, "lng": 25.28, "kind": "point", "label": {"en": "Wilno", "ko": "빌노"}}, "body": {"en": "Pilsudski seized Wilno, then capital of the Lithuanian-Belorussian Soviet Republic, by surprise; Minsk followed by summer. In the autumn he halted: with Denikin''s Whites approaching Moscow, he had no wish to help bring down the Soviet government, since a White victory promised Poland worse.", "ko": "피우수트스키가 리트벨 소비에트 공화국의 수도가 된 빌노를 기습으로 빼앗았다. 여름까지 민스크도 폴란드군에 넘어갔다. 가을에 피우수트스키는 진격을 멈췄다. 데니킨의 백군이 모스크바로 다가서던 시점에 소비에트 정권을 무너뜨리는 일을 돕지 않기 위해서였다."}, "date": "1919.04.19", "title": {"en": "Polish forces take Wilno", "ko": "폴란드군, 빌노 점령"}}, {"body": {"en": "Poland recognized Petliura''s Ukrainian People''s Republic; Petliura conceded Eastern Galicia and western Volhynia to Poland. Four days later the joint offensive toward Kiev began.", "ko": "폴란드가 페틀류라의 우크라이나 인민공화국을 승인하고, 페틀류라는 동갈리치아와 볼히니아 서부에 대한 폴란드의 영유를 인정했다. 나흘 뒤 폴란드-우크라이나 연합군이 키예프를 향해 공세를 열었다."}, "date": "1920.04.21", "title": {"en": "The Warsaw agreement: Pilsudski and Petliura", "ko": "바르샤바 협정: 피우수트스키와 페틀류라"}}, {"geo": {"kind": "arrow", "actor": {"en": "Polish army", "ko": "폴란드군"}, "points": [[50.9, 26.5], [50.5, 30.2]], "variant": "axis"}, "body": {"en": "The Red Army withdrew rather than give battle and Kiev fell almost without a fight. But the hoped-for Ukrainian rising and expansion of Petliura''s army never came.", "ko": "붉은군대가 결전을 피해 물러나 키예프는 거의 싸움 없이 넘어갔다. 그러나 기대했던 우크라이나의 대중 봉기와 페틀류라군의 확충은 일어나지 않았다."}, "date": "1920.05.07", "title": {"en": "Polish troops enter Kiev", "ko": "폴란드군, 키예프 입성"}}, {"geo": {"kind": "arrow", "actor": {"en": "First Cavalry Army", "ko": "제1기병군"}, "label": {"en": "breakthrough at Zhytomyr", "ko": "지토미르 돌파"}, "points": [[49.8, 30.0], [50.2, 27.8]], "variant": "red"}, "body": {"en": "The 1st Cavalry Army of the South-Western Front tore open the Polish line near Zhitomir. On 10 June the Poles abandoned Kiev and began a general retreat.", "ko": "남서전선군의 제1기병군이 지토미르 방면에서 폴란드 전선을 찢었다. 폴란드군은 6월 10일 키예프를 버리고 총퇴각에 들어갔다."}, "date": "1920.06.05", "title": {"en": "Budyonny''s 1st Cavalry Army breaks the front", "ko": "부됸니의 제1기병군, 전선 돌파"}}, {"geo": {"kind": "arrow", "actor": {"en": "Western Front", "ko": "서부전선군"}, "label": {"en": "through Minsk", "ko": "민스크 방면"}, "points": [[55.0, 29.5], [53.9, 25.8]], "variant": "red"}, "body": {"en": "Tukhachevsky, the 27-year-old commander of the Western Front, issued Order No. 1423 on 2 July: \"Over the corpse of White Poland lies the road to worldwide conflagration. On our bayonets we shall carry happiness and peace to toiling humanity. To Wilno, Minsk, Warsaw, march!\" Minsk fell on 11 July, Wilno on the 14th, Grodno on the 19th, Bialystok on the 28th.", "ko": "27세의 서부전선군 사령관 투하쳅스키가 7월 2일 명령 제1423호를 내렸다: \"백색 폴란드의 시체를 넘어 세계적 대화재로 가는 길이 놓여 있다. 총검 위에 우리는 근로 인류에게 행복과 평화를 실어 나를 것이다. 빌노로, 민스크로, 바르샤바로, 진군!\" 민스크(7월 11일), 빌노(14일), 그로드노(19일), 비아위스토크(28일)가 차례로 떨어졌다."}, "date": "1920.07.04", "title": {"en": "Tukhachevsky''s July offensive", "ko": "투하쳅스키의 7월 공세"}}, {"body": {"en": "British Foreign Secretary Curzon proposed an armistice on an ethnographic line, the later Curzon Line. Confident of victory, the Soviet government declined mediation, demanded direct talks with Poland, and kept advancing.", "ko": "영국 외무장관 커즌이 민족 분포에 따른 잠정 경계선(훗날의 커즌선)에서의 정전을 제안했다. 승리를 확신한 소비에트 정부는 중재를 거절하고 폴란드와의 직접 교섭을 요구하며 진격을 계속했다."}, "date": "1920.07.11", "title": {"en": "The Curzon note", "ko": "커즌 각서"}}, {"geo": {"lat": 53.13, "lng": 23.16, "kind": "point", "label": {"en": "Białystok", "ko": "비아위스토크"}}, "body": {"en": "In occupied Bialystok the Provisional Polish Revolutionary Committee (Polrevkom) declared itself, headed by Marchlewski with Dzerzhinsky and Kon among its members: a government-in-waiting for a Soviet Poland. The expected response of Polish workers and peasants never came.", "ko": "점령된 비아위스토크에서 마르흘렙스키를 수반으로, 제르진스키와 콘을 위원으로 하는 폴란드 임시혁명위원회(폴레브콤)가 수립을 선포했다. 소비에트 폴란드의 예비 정부였으나, 기대한 폴란드 노동자·농민의 호응은 오지 않았다."}, "date": "1920.07.30", "title": {"en": "The Polrevkom at Bialystok", "ko": "비아위스토크의 폴레브콤"}}, {"geo": {"kind": "arrow", "actor": {"en": "Polish army", "ko": "폴란드군"}, "label": {"en": "Wieprz counterstroke", "ko": "비에프시강 반격"}, "points": [[51.55, 22.6], [52.75, 21.9]], "variant": "axis"}, "body": {"en": "13 to 25 August. Polish radio intercepts and code-breaking laid bare the Red Army''s dispositions. On 16 August Pilsudski struck the exposed Soviet left from the Wieprz river and the Western Front collapsed. The 4th Army and the cavalry corps were pushed into East Prussia and interned; tens of thousands were taken prisoner. In Poland it became the ''Miracle on the Vistula.''", "ko": "8월 13~25일. 폴란드군은 무선 감청과 암호 해독으로 붉은군대의 배치를 읽고 있었다. 8월 16일 피우수트스키가 비에프시 강에서 노출된 소련군 좌익을 쳤고, 서부전선군은 붕괴했다. 제4군과 기병군단은 동프로이센으로 밀려나 억류되었고, 수만 명이 포로가 되었다. 폴란드에서는 「비스와의 기적」으로 불린다."}, "date": "1920.08.13", "title": {"en": "The Battle of Warsaw", "ko": "바르샤바 전투"}}, {"geo": {"kind": "arrow", "actor": {"en": "Polish army", "ko": "폴란드군"}, "label": {"en": "the Niemen", "ko": "네만강"}, "points": [[53.2, 23.4], [53.75, 25.0]], "variant": "axis"}, "body": {"en": "The Poles broke Tukhachevsky''s reorganized line on the Niemen. After this defeat the Soviet side had no option left but peace.", "ko": "재편성한 투하쳅스키의 방어선을 폴란드군이 다시 무너뜨렸다. 이 패배로 소비에트 측에 남은 선택은 강화뿐이었다."}, "date": "1920.09.20", "title": {"en": "The Battle of the Niemen", "ko": "네만 전투"}}, {"body": {"en": "The preliminary peace and armistice signed at Riga on 12 October came into force. Petliura''s Ukrainians and Wrangel''s Whites in the Crimea were left to face the Soviets alone.", "ko": "10월 12일 리가에서 서명된 예비 강화와 정전 협정이 발효했다. 페틀류라의 우크라이나군과 크림의 브란겔 백군은 각자 소련과 홀로 마주하게 되었다."}, "date": "1920.10.18", "title": {"en": "The armistice takes effect", "ko": "정전 발효"}}, {"geo": {"lat": 56.95, "lng": 24.11, "kind": "point", "label": {"en": "Riga", "ko": "리가"}}, "body": {"en": "The border was drawn some 200 kilometres east of the Curzon Line, partitioning Belorussia and Ukraine. It would stand until 17 September 1939. Soviet Russia promised reparations; Poland dropped its support for Petliura.", "ko": "국경은 커즌선보다 약 200킬로미터 동쪽에 그어져 벨로루시와 우크라이나가 분할되었다. 이 국경은 1939년 9월 17일까지 유지된다. 소비에트 러시아는 배상금 지불을 약속했고, 폴란드는 페틀류라 지원을 끊었다."}, "date": "1921.03.18", "title": {"en": "The Peace of Riga", "ko": "리가 조약"}}]'::jsonb,
  locations='[{"lat": 52.23, "lng": 21.01, "kind": "main", "label": {"en": "Warsaw", "ko": "바르샤바"}}, {"lat": 50.45, "lng": 30.52, "label": {"en": "Kiev", "ko": "키예프"}}, {"lat": 49.84, "lng": 24.03, "label": {"en": "Lwów", "ko": "리보프"}}, {"lat": 51.4, "lng": 21.7, "kind": "geo", "label": {"en": "Vistula", "ko": "비스와강"}}]'::jsonb,
  body_ko='## 국경 없는 국경 지대: 전쟁은 어떻게 시작되었나

이 전쟁에는 선전포고가 없었고, 개전일을 특정하기도 어렵다. 1918년 11월 독일이 항복하자 러시아·독일·오스트리아 세 제국이 갈라 가졌던 동유럽 한복판에 거대한 진공이 생겼다. 부활한 폴란드의 동쪽 국경은 어떤 조약에도 정해져 있지 않았고, 소비에트 러시아는 철수하는 독일군의 뒤를 따라 서쪽으로 병력을 밀어 넣고 있었다. 1919년 2월 벨로루시의 베레자 카르투스카에서 마주 들어오던 두 군대가 처음 충돌했다.

두 나라의 목표는 처음부터 양립할 수 없었다. 국가원수 피우수트스키는 러시아와 폴란드 사이에 폴란드가 주도하는 연방(리투아니아, 벨로루시, 우크라이나)을 세워 러시아를 18세기 이전의 경계로 밀어내려 했다. 소비에트 지도부에게 폴란드는 그 자체가 목표라기보다 독일 혁명과 이어지는 다리였다. 1919년 폴란드군은 빌노(4월)와 민스크(8월)를 차례로 점령했으나, 가을이 되자 피우수트스키는 진격을 멈추고 비밀 접촉으로 전선을 사실상 동결했다. 데니킨의 백군이 모스크바로 다가서던 바로 그 시점이었다. 「하나의 불가분한 러시아」를 내건 백군의 승리는 폴란드 독립에 소비에트 정권보다 더 나쁘다는 계산이었고, 이 계산이 백군 최전성기의 소비에트 정권에 숨 쉴 틈을 주었다.

폴란드군의 동진은 독일의 점령 질서가 붕괴한 공간에서 진행됐다. 그 배경은 [브레스트 강화](/commulingo/events/brest-litovsk)에, 라다·헤트만·디렉토리아의 정권 교체와 페틀류라의 협상력 약화는 [우크라이나 혁명과 전쟁](/commulingo/events/ukraine-1917-1921)에 이어진다.

## 북쪽 날개: 라트비아와의 협력, 리투아니아와의 충돌

1920년 1월 폴란드와 라트비아는 다우가프필스에서 합동 작전을 벌여 소비에트군을 밀어냈다. 라트비아에게는 라트갈레 확보를 위한 전쟁이었고, 폴란드에게는 우호국과의 연결을 확보하고 북쪽 전선을 정리하는 작전이었다. 폴란드의 모든 북방 행동을 발트 국가들과의 공통 전쟁으로 볼 수 없는 이유는 리투아니아에서 드러난다.

폴란드군은 이미 1919년 4월 빌뉴스를 점령했다. 1920년 7월 12일 소비에트 러시아는 리투아니아와의 모스크바 조약에서 빌뉴스에 대한 리투아니아의 권리를 인정했지만, 이 합의는 폴란드와의 영토 분쟁을 해결하지 못했다. 적군의 진격과 후퇴에 따라 폴란드·리투아니아의 군사적 충돌도 재개됐다. 10월 7일 수바우키 협정은 제한된 군사분계선과 정전을 정했지만, 9일 젤리고프스키군이 빌뉴스를 점령했다. 중부 리투아니아 수립은 폴란드와 리투아니아 사이에 장기적 적대를 남겼다. 세 나라의 독립전쟁과 별도 강화는 [발트 독립전쟁](/commulingo/events/baltic-wars-of-independence)에서 다룬다.

## 1920년 봄: 키예프로 간 폴란드

1920년 초 양쪽 모두 결전을 준비하며 평화 교섭을 주고받았다. 4월 21일 피우수트스키는 파리에 밀려나 있던 우크라이나 인민공화국 수반 페틀류라와 바르샤바 협정을 맺었다. 폴란드가 페틀류라 정부를 승인하는 대가로 페틀류라는 동갈리치아와 볼히니아 서부를 폴란드 영토로 인정했다. 4월 25일 폴란드-우크라이나 연합군이 공세를 열었고, 붉은군대가 결전을 피해 물러난 키예프에 5월 7일 입성했다.

군사적 성공은 정치적으로 비어 있었다. 페틀류라의 이름으로도 우크라이나 농민의 대중 봉기는 일어나지 않았고, 갈리치아를 폴란드에 내준 협정은 우크라이나 민족운동 안에서 페틀류라의 입지를 갉아먹었다. 반대로 소비에트 쪽에서는 「폴란드 지주의 침공」이 내전에 지친 사회를 다시 묶는 애국적 동원의 계기가 되었다. 브루실로프를 비롯한 제정 시대 장교 수천 명이 이 전쟁에서 붉은군대에 복무를 자원했다.

## 비스와로: 총검에 실린 혁명

반격은 두 갈래로 왔다. 남쪽에서는 6월 5일 부됸니의 제1기병군이 전선을 찢어 폴란드군을 키예프에서 몰아냈고, 북쪽에서는 7월 4일 투하쳅스키의 서부전선군이 총공세에 나섰다. 7월 한 달 동안 민스크, 빌노, 그로드노, 비아위스토크가 차례로 떨어졌다. 7월 11일 영국이 민족 분포선(커즌선)에서의 정전을 제안했으나, 승리를 확신한 소비에트 정부는 중재를 거절했다.

이 지점에서 전쟁의 성격이 바뀌었다. 방어전이 「혁명의 수출」 시험이 된 것이다. 마침 모스크바에서 열리고 있던 코민테른 제2차 대회의 대의원들은 회의장에 걸린 지도로 전선의 이동을 지켜보았다. 7월 30일 점령된 비아위스토크에서 마르흘렙스키, 제르진스키, 콘 등의 폴란드 임시혁명위원회(폴레브콤)가 소비에트 폴란드의 예비 정부로 선포되었다. 그러나 기대는 빗나갔다. 폴란드 노동자와 농민은 붉은군대를 해방자가 아니라 러시아군으로 맞았다. 레닌은 뒷날 클라라 체트킨에게 폴란드의 농민과 노동자들이 "우리가 기대한 동맹자가 아니라 적으로" 붉은군대를 대했다고 인정했고, 1920년 9월 당협의회 비공개 연설에서는 폴란드 진격을 "총검으로 해 본 정찰"이라 부르며 패배를 시인했다. 이 연설은 1992년에야 공개되었다.

## 혁명 정부와 분열된 사령부: 바르샤바로 가는 길의 두 균열

비아위스토크에 도착한 폴레브콤은 취임 선언에서 "지주-부르주아 정부를 권력에서 배제한다"고 천명하고 공장·삼림·대지주의 토지를 인민 소유로 선포했다. 위원장 율리안 마르흘렙스키, 사실상의 지도부 펠릭스 제르진스키, 그리고 펠릭스 콘과 이오시프 운쉴리흐트 등으로 구성된 이 예비 정부는 붉은군대의 진격에 맞춰 장갑열차를 타고 스몰렌스크에서 민스크, 빌노를 거쳐 비아위스토크까지 이동해 왔다. 취임 이틀 전인 7월 28일 투하쳅스키의 군대가 비아위스토크를 점령했고, 폴레브콤은 브라니츠키 궁전에 본부를 두었다.

그러나 기대했던 폴란드 노동자의 봉기는 오지 않았다. 제르진스키는 8월 5일 레닌에게 타전한 전문에서 "나레프 강 너머의 분위기는 적대적이다. 가축과 말을 몰아내고 수레 바퀴를 떼어간다"고 보고했다. 폴레브콤이 편성하려 한 폴란드 적군은 겨우 176명의 적색 소총 연대 하나와 파견된 러시아 적군 병력을 합쳐 총 1,000명 남짓에 그쳤다. 비아위스토크의 유대인 노동자들 사이에서는 상대적으로 호의적인 반응이 있었으나, 가톨릭 폴란드인 다수는 침략군의 꼭두각시로 간주했다. 폴레브콤은 8월 4일 "사회주의 혁명에 위험한 모든 자, 폴란드 대부르주아지와 지주의 대표자들, 백색 폴란드에 동조하는 모든 자를 체포하여 강제수용소로 보내라"는 지시를 내렸으나, 실질적인 행정력은 점령지 일부에만 미쳤다.

바로 이 시기, 붉은군대의 진격을 뒤에서 무너뜨릴 또 다른 균열이 사령부 내부에서 벌어지고 있었다. 투하쳅스키의 서부전선군은 7월 한 달 동안 600킬로미터 이상을 진격하며 바르샤바 동쪽과 북쪽까지 도달했지만, 그 남쪽 측면은 프리페트 습지와 8,000명 규모의 모지리 집단에만 의존한 채 위험할 정도로 노출되어 있었다. 서부전선군과 예고로프의 남서전선군 사이의 이 접점은 전선 전체에서 가장 취약한 지점이었다.

총사령관 세르게이 카메네프는 투하쳅스키의 거듭된 요청에 따라 8월 2일 남서전선군 소속 제12군과 부됸니의 제1기병군을 서부전선으로 전속시키라는 첫 지시를 내렸고, 8월 5일에는 이를 재확인했다. 그러나 남서전선군 혁명군사평의회의 정치위원 이오시프 스탈린은 명령의 부서를 거부했다. 스탈린에게 르부프(리보프)는 단순한 군사 목표가 아니었다. 남서전선군이 르부프를 함락하면 자신이 정치위원으로 있는 전선이 전쟁의 결정적 승리를 거둔 셈이 되며, 동시에 브란겔의 백군이 크림에서 위협하는 상황에서 남부 전선을 방기했다는 비판을 피할 수 있었다. 그는 8월 12일 레닌에게 보낸 편지에서 "총사령관과 그 일당이 브란겔에 대한 승리를 조직하는 일을 태업하고 있다"고 반박했다.

제1기병군은 8월 내내 르부프 공방전에 묶여 있었고, 결국 제1기병군 단 한 개 사단도 바르샤바 전투에 참가하지 못했다. 카를 라데크는 폴란드 민족주의의 폭발적 저항을 경고했고, 레프 트로츠키 역시 바르샤바 진격에 회의적이었다. 그러나 레닌은 유럽 혁명의 교두보라는 확신 아래 진격을 계속 명령했다. 8월 13일 투하쳅스키의 군대가 바르샤바 동쪽 라지민을 공격하며 전투의 막이 올랐지만, 사령부의 분열과 폴란드 민중의 적대라는 두 균열은 이미 승패를 가르는 조건으로 자리잡고 있었다.

## 바르샤바: 전환점

8월 중순 투하쳅스키의 네 개 군이 바르샤바 외곽에 이르렀다. 그러나 폴란드군은 무선 감청과 암호 해독으로 소련군의 명령을 읽고 있었고, 병참선은 한계까지 늘어나 있었으며, 남서전선군과의 협조는 무너져 있었다. 리보프 방면에 묶인 부됸니의 기병군을 바르샤바 방면으로 돌리라는 총사령부의 지시는 남서전선군 혁명군사회의에서 지연되었다. 정치위원 스탈린이 명령 부서를 거부한 이 일화는 뒷날 패배 책임 논쟁의 핵심이 되었고, 투하쳅스키와 스탈린·부됸니 진영의 반목으로 남아 1937년까지 이어진다.

8월 16일 피우수트스키가 비에프시 강에서 노출된 소련군 좌익을 쳤다. 서부전선군은 붕괴했고, 제4군은 국경을 넘어 동프로이센에 억류되었으며, 수만 명이 포로가 되었다. 9월 네만 전투의 패배로 남은 선택은 강화뿐이었다. 10월 12일 리가에서 예비 강화가 서명되었다.

프랑스의 지원은 무기·탄약과 군사교육, 부대에 배치된 고문단이라는 지속적인 기반을 제공했다. 1919년부터 활동한 프랑스 군사사절단과 1920년 여름의 영불 연합사절단은 구별해야 한다. 후자에 참여한 막심 베강은 폴란드 참모부의 고문으로 반격 계획을 협의했다. 이를 베강 한 사람이 승리를 설계한 것으로 설명하면 피우수트스키와 로즈바도프스키, 폴란드 지휘부의 작전 수립과 실제 수행을 지우게 된다.

## 네만에서 리가까지: 패배한 쪽이 더 나은 평화를 얻다

바르샤바에서 퇴각한 투하쳅스키의 서부전선군은 9월 중순 네만 강, 시차라 강, 스비슬라치 강 선에 새로운 방어선을 구축했다. 총사령관 세르게이 카메네프는 반격을 명령했지만, 현실은 달랐다. 서부전선군은 정원 대비 20~40% 수준으로 줄었고, 8월에 6만 8천 명, 9월에 2만 명의 증원이 도착했으나 숙련된 지휘관과 포병은 바르샤바 앞에서 거의 소진된 뒤였다. 그래도 투하쳅스키는 제3군, 제15군, 제16군을 재편하여 브레스트 요새와 비아위스토크 탈환을 노리는 남하 공세를 계획했다.

피우수트스키는 소련군이 방어를 굳히기 전에 네만 선을 돌파하기로 했다. 작전의 핵심은 우회였다. 폴란드 제2군과 제4군이 그로드노와 바우카비스크에서 정면으로 묶는 사이, 오신스키 장군의 수바우키 집단이 리투아니아가 장악한 세이니와 드루스키닝카이 사이의 좁은 회랑을 통해 북쪽으로 돌아 들어가 소련 제3군의 배후를 찌르는 것이었다. 9월 20일 폴란드 제21산악사단이 그로드노를 공격하며 전투가 시작되었다. 사흘간의 교착 끝에 9월 23일 폴란드군이 드루스키닝카이를 점령하고 그로드노와 빌노를 잇는 철도를 차단했다. 소련 제3군의 보급선이 끊겼고, 폴란드 기병대는 리다까지 진출했다. 9월 26일 크라요프스키 장군의 기병이 핀스크를 점령하며 소련 제4군의 보급선마저 위협받자, 투하쳅스키는 총퇴각을 명령할 수밖에 없었다. 시차라 강 전투(10월 중순) 이후 전선은 타르노폴, 두브노, 민스크, 드리사 선까지 밀렸다.

그러나 폴란드군도 지칠 대로 지쳐 있었다. 100만 명을 동원했지만 전선 병력은 35만여 명, 부대 충실도는 정원의 50~60%에 머물렀다. 그리고 피우수트스키에게는 더 근본적인 문제가 있었다. 전쟁의 정치적 목표였던 우크라이나 독립국 건설은 이미 물 건너갔고, 바르샤바 앞에서 얻은 것은 승리였지 페틀류라의 귀환은 아니었다.

그래서 협상장은 예상과 다른 그림을 그렸다. 평화 회담은 8월 17일 민스크에서 시작되었지만, 바르샤바 전투가 한창인 날이었다. 회담은 곧 리가로 옮겨져 9월 21일 재개되었다. 소비에트 대표단은 아돌프 이오페가 이끌었다. 이오페는 모스크바에서 가져온 제안을 제시했다: 국경을 커즌선보다 ''상당히 동쪽''에 긋되 동갈리치아는 폴란드 측에 두고, 민족자결 문제는 일단 제쳐두겠다는 선언이었다. 제안은 10월 5일까지 유효했다. 소비에트 러시아가 이렇게 양보한 데는 이유가 있었다. 레닌은 브란겔의 백군이 크림에서 아직 건재하고, 탐보프 반란을 비롯한 농민 봉기가 번지고 있던 상황에서 폴란드 전선을 더 끌고 갈 여유가 없었다. 레닌은 10월 15일 모스크바현 집행위원장 회의에서 이렇게 말했다: ''우리는 4월에 제안했을 때보다 더 나은 조건으로 평화예비조약에 조인했다. 당시 국경은 50베르스타 동쪽이었으나 지금은 50베르스타 서쪽이다.''

그러나 더 극적인 반전은 폴란드 측에서 일어났다. 전쟁에 이겼으면서도 더 많은 영토를 요구하지 않은 것이다. 리가의 폴란드 대표단을 이끈 얀 돔프스키는 피우수트스키의 측근이 아니었다. 대표단 실세는 국가민주당(엔데치아)이었고, 그 이념적 지도자 스타니스와프 그랍스키는 이렇게 주장했다: 폴란드가 민스크를 포함한 넓은 동부 영토를 병합하면 비(非)폴란드계 소수민족이 전체 인구의 3분의 1을 넘어서고, 이는 폴란드 민족국가의 안정성을 해칠 뿐 아니라 선거에서 피우수트스키 진영에 유리한 유권자를 끌어들이게 된다는 것이었다. 돔프스키는 이오페와의 일대일 비밀교섭에서 민스크를 포기하는 대신 바라노비체, 우니니에츠, 사르니, 루브네를 잇는 전략철도와 라트비아와의 접경을 확보하는 선에서 타협했다. 협정은 10월 5일 합의에 이르렀고, 10월 12일 예비강화 및 정전협정이 서명되어 10월 18일 밤 자정 발효했다. 페틀류라의 우크라이나 인민공화국은 동맹국인 폴란드에 의해 공식 승인을 박탈당했고, 홀로 소비에트 군대와 마주하게 되었다. 피우수트스키는 이 조약을 ''비겁한 행위''라고 불렀고, 이듬해 5월 칼리시의 우크라이나군 수용소를 찾아 페틀류라의 병사들에게 사과했다. 전쟁에 이겼지만, 이긴 쪽이 스스로 평화의 폭을 줄인 역설이었다.

## 리가의 국경과 배제된 동맹국

1921년 3월 18일 리가 조약은 폴란드와 소비에트 러시아·소비에트 우크라이나 사이에 체결됐다. 소비에트 러시아는 소비에트 벨로루시를 대표하기도 했다. 폴란드는 동부의 넓은 영토를 얻었지만 민스크는 소비에트 쪽에 남았다. 이 조약은 1920년 8월 라트비아와 러시아 사이에 체결된 동명의 강화와 별개다.

폴란드 지도부의 목표도 하나가 아니었다. 피우수트스키의 연방 구상과 페틀류라와의 동맹은 독립 우크라이나를 소비에트 러시아와의 사이에 두려는 시도였다. 반면 민족민주파가 중시한 것은 폴란드 국가가 통치할 수 있는 영토와 인구의 구성이었다. 소비에트 측도 브란겔과 농민봉기를 상대하면서 서부전선을 줄일 필요가 있었다. 전쟁 피로와 서로 다른 국가 구상이 군사적 승리를 제한된 강화로 바꾸었다.

그 비용을 가장 직접적으로 치른 동맹은 우크라이나 인민공화국이었다. 페틀류라는 협상장에서 배제됐고, 폴란드는 소비에트 우크라이나를 조약 상대국으로 인정했다. 1920년 11월까지 싸운 인민공화국군은 폴란드로 물러나 억류되었다. 부와크-바와호비치의 별도 벨로루시 원정도 휴전 뒤 실패했다. 강화선 밖의 반소비에트 군대가 전쟁을 계속한다고 폴란드 정부가 다시 전면전에 나서는 것은 아니었다.

조약은 주민의 국적 선택과 소수자의 언어·종교·문화적 권리, 재산·문화재 반환과 재정 정산을 규정했다. 그러나 조문과 실제 이행은 달랐다. 우크라이나인과 벨로루시인은 국경 양쪽으로 갈라졌고, 폴란드의 동부에는 유대인을 비롯한 여러 공동체가 함께 살았다. 국경과 소수자 통치는 안정의 성취인 동시에 갈등의 지속이었다.

전쟁포로의 죽음도 국경 확정으로 해결되지 않았다. 수용소의 전염병·굶주림·열악한 처우와 책임은 포로 기록을 통해 따져야 한다. 후대의 카틴 학살과 숫자를 맞바꾸어 정당화하는 방식은 서로 다른 시기의 사건을 왜곡한다. 바르샤바 패배가 적군을 통한 유럽 혁명 확장에 제동을 걸었다는 점과, 신경제정책·서방과의 관계 전환을 이 전쟁 하나로 설명할 수 없다는 점은 함께 보아야 한다. 전후 국가의 재편은 [러시아 내전](/commulingo/events/civil-war)과 [소련 성립](/commulingo/events/ussr-formation)으로 이어진다.
',
  body_en='## Borderlands Without Borders: How the War Began

The war was never declared, and even its starting date is hard to fix. Germany''s surrender in November 1918 left a vast vacuum in the middle of Eastern Europe, where three empires had ruled. No treaty defined the eastern border of reborn Poland, and Soviet Russia was pushing troops westward on the heels of the withdrawing Germans. In February 1919 the two armies, advancing toward each other, first collided at Bereza Kartuska in Belorussia.

The two states'' aims were incompatible from the start. Pilsudski, Poland''s head of state, wanted a Polish-led federation of Lithuania, Belorussia and Ukraine standing between Poland and Russia, pushing Russia back to its pre-eighteenth-century bounds. For the Soviet leadership Poland was less a goal than a bridge to revolutionary Germany. In 1919 Polish forces took Wilno (April) and Minsk (August); but in the autumn Pilsudski halted and, through secret contacts, in effect froze the front. This was precisely the moment Denikin''s Whites were approaching Moscow. A victory of the Whites, whose slogan was ''Russia one and indivisible,'' would be worse for Polish independence than the Soviet government, he calculated, and the calculation gave the Soviet regime breathing space at the peak of the White advance.

Poland advanced into the space left by collapsing German occupation. That background continues in [Brest-Litovsk](/commulingo/events/brest-litovsk); the Rada, Hetmanate, Directory and Petliura''s declining bargaining position in [Ukraine''s revolution and wars](/commulingo/events/ukraine-1917-1921).

## The northern flank: cooperation with Latvia, conflict with Lithuania

In January 1920 Polish and Latvian forces drove Soviet troops from Daugavpils in a joint operation. Latvia sought control of Latgale; Poland secured contact with a friendly state and reduced its northern commitments. Lithuania shows why this was not a common Polish-Baltic war.

Poland had occupied Vilnius in April 1919. Soviet Russia recognized Lithuania''s claim to the city in the Moscow treaty of 12 July 1920, without settling the dispute with Poland. Red advances and retreats brought renewed Polish-Lithuanian clashes. The Suwałki Agreement of 7 October provided a limited demarcation and ceasefire; Żeligowski''s troops seized Vilnius on 9 October. Central Lithuania left a legacy of enduring hostility. The independence struggles and separate peace settlements are covered in the [Baltic wars of independence](/commulingo/events/baltic-wars-of-independence).

## Spring 1920: Poland Goes to Kiev

In early 1920 both sides exchanged peace proposals while preparing for a decisive campaign. On 21 April Pilsudski concluded the Warsaw agreement with Petliura, the exiled head of the Ukrainian People''s Republic: Poland recognized his government, and Petliura conceded Eastern Galicia and western Volhynia to Poland. The joint offensive opened on 25 April, and on 7 May Polish troops entered Kiev, which the Red Army had abandoned rather than defend.

The military success was politically hollow. Even in Petliura''s name no mass rising of the Ukrainian peasantry occurred, and the surrender of Galicia undercut his standing within the Ukrainian national movement. On the Soviet side, by contrast, the ''invasion of the Polish lords'' became an occasion for patriotic mobilization that rebound a society exhausted by civil war: thousands of former tsarist officers, Brusilov among them, volunteered to serve the Red Army in this war.

## To the Vistula: Revolution on Bayonets

The counterblow came on two axes. In the south, on 5 June, Budyonny''s 1st Cavalry Army tore open the front and drove the Poles from Kiev; in the north, on 4 July, Tukhachevsky''s Western Front went over to a general offensive. In the course of July, Minsk, Wilno, Grodno and Bialystok fell in turn. On 11 July Britain proposed an armistice on the ethnographic line later known as the Curzon Line; confident of victory, the Soviet government declined mediation.

At this point the character of the war changed: a defensive war became a test of exporting revolution. The delegates of the Second Comintern Congress, then meeting in Moscow, followed the front''s movement on a map hung in the hall. On 30 July, in occupied Bialystok, the Provisional Polish Revolutionary Committee (Polrevkom) of Marchlewski, Dzerzhinsky, Kon and others was proclaimed as a government-in-waiting for a Soviet Poland. The expectation failed. Polish workers and peasants met the Red Army not as liberators but as a Russian army. Lenin later admitted to Clara Zetkin that they had faced the Red Army ''as enemies, not the allies we had counted on,'' and in a closed speech to the party conference in September 1920 he called the march on Poland ''a reconnaissance by bayonet'' and conceded the defeat. That speech was published only in 1992.

## A Revolutionary Government and a Divided Command: Two Cracks on the Road to Warsaw

Arriving in Białystok, the Polrevkom declared in its manifesto that it was "depriving the gentry-bourgeois government of power" and proclaimed factories, forests, and landed estates the property of the people. Headed by Julian Marchlewski, with Feliks Dzerzhinsky as its de facto leader and Feliks Kon and Iosif Unshlikht among its members, this government-in-waiting had travelled by armoured train from Smolensk via Minsk and Wilno in the wake of Tukhachevsky''s advancing armies. His troops had taken Białystok on 28 July, two days before the committee''s proclamation; the Polrevkom set up headquarters in the Branicki Palace.

But the expected rising of Polish workers never came. On 5 August Dzerzhinsky cabled Lenin: "The mood beyond the Narew is hostile; they drive off their cattle and horses, they strip the wheels from the carts." The Polish Red Army the committee tried to raise amounted to barely 176 men in a single Red Rifle Regiment, supplemented by detachments from the Russian Red Army, perhaps a thousand in total. Among Białystok''s Jewish working class the reception was relatively warm, but the Catholic Polish majority regarded the committee as little more than an occupier''s puppet. On 4 August the Polrevkom ordered the arrest and dispatch to concentration camps of "all those dangerous to the socialist revolution in Poland, all representatives of the Polish big bourgeoisie and landowners, and all known for their sympathy with White Poland," yet its real administrative reach extended over only a sliver of occupied territory.

At this very moment a second crack was opening inside the Red Army''s own command, one that would undo the whole advance. Tukhachevsky''s Western Front had covered over 600 kilometres in July and now stood east and north of Warsaw, but its southern flank was perilously exposed, held only by the Pripet Marshes and the 8,000-strong Mozyr Group. The seam between Tukhachevsky''s forces and Yegorov''s South-Western Front was the most vulnerable point on the entire line.

At Tukhachevsky''s insistent urging, Commander-in-Chief Sergey Kamenev issued a directive on 2 August transferring the 12th Army and Budyonny''s 1st Cavalry Army from the South-Western Front to the Western Front; he reaffirmed the order on 5 August. But Stalin, the political commissar of the South-Western Front''s Revolutionary Military Council, refused to countersign. For Stalin, Lwów was more than a military objective. Taking it would make his front the war''s decisive victor while insulating him from the charge of abandoning the southern theatre, where Wrangel''s White forces were pressing from the Crimea. On 12 August he wrote to Lenin arguing that "the commander-in-chief and his boys are sabotaging the work of organizing victory over Wrangel."

The 1st Cavalry Army remained tied down in the battle for Lwów throughout August; not a single division of it reached Warsaw. Karl Radek had warned of an explosive Polish nationalist resistance, and Trotsky too was sceptical of the march on Warsaw. But Lenin, convinced that Poland was the bridge to European revolution, ordered the advance to continue. On 13 August Tukhachevsky''s forces opened the battle by attacking Radzymin east of the capital, but by then the two cracks, a divided command and a hostile Polish population, had already set the terms of the coming defeat.

## Warsaw: the Turning Point

By mid-August Tukhachevsky''s four armies stood before Warsaw. But the Poles were reading Soviet orders through radio interception and code-breaking, the supply lines were stretched to breaking, and coordination with the South-Western Front had collapsed. The high command''s instruction to swing Budyonny''s cavalry, tied down before Lwow, toward Warsaw was delayed in the South-Western Front''s revolutionary military council; the refusal of its political commissar, Stalin, to countersign the order became the core of the later controversy over blame, and the feud between Tukhachevsky and the Stalin-Budyonny camp ran on to 1937.

On 16 August Pilsudski struck the exposed Soviet left flank from the Wieprz river. The Western Front collapsed; the 4th Army crossed the border and was interned in East Prussia; tens of thousands were taken prisoner. After the defeat on the Niemen in September, peace was the only option left. The preliminary peace was signed at Riga on 12 October.

French arms, ammunition, military training and attached advisers provided sustained support. The French Military Mission active from 1919 should be distinguished from the Anglo-French Interallied Mission of summer 1920. Maxime Weygand, part of the latter, advised the Polish staff and discussed the counterattack. Attributing victory to him alone would erase the planning and execution by Piłsudski, Rozwadowski and the Polish command.

## From the Niemen to Riga: How the Defeated Side Got the Better Peace

After Warsaw, Tukhachevsky''s Western Front fell back and by mid-September had established a new defensive line along the Niemen, Shchara, and Svislach rivers. Commander-in-Chief Sergey Kamenev ordered a counter-offensive, but the reality on the ground told a different story. The Western Front''s units stood at 20 to 40 percent of their nominal strength; 68,000 reinforcements arrived in August and another 20,500 in September, yet experienced officers and artillery had been largely spent before Warsaw. Still, Tukhachevsky regrouped his 3rd, 15th, and 16th Armies and planned a southward drive to retake Brest Fortress and Białystok.

Pilsudski moved first, determined to break the Niemen line before Soviet defences hardened. The key to his plan was an outflanking manoeuvre. While the Polish 2nd and 4th Armies pinned the Soviets frontally at Grodno and Wołkowysk, General Osiński''s Suwałki Group would slip through a narrow corridor between Sejny and Druskienniki, a strip of territory then held by Lithuania, and strike the rear of the Soviet 3rd Army from the north. The battle opened on 20 September when the Polish 21st Alpine Division attacked Grodno. After three days of stalemate, the Poles took Druskienniki on 23 September and cut the railway linking Grodno and Wilno. The Soviet 3rd Army''s supply line was severed; Polish cavalry reached as far as Lida. On 26 September, General Krajowski''s horsemen took Pinsk, threatening the Soviet 4th Army''s supply line as well. Tukhachevsky had no choice but to order a general retreat. After the Battle of the Szczara River in mid-October, the front had been pushed back to the line of Tarnopol, Dubno, Minsk, and Drissa.

But the Polish army was itself utterly spent. Though Poland had mobilised nearly a million men, only some 350,000 were on the eastern front, and most units stood at 50 to 60 percent of their nominal complement. And Pilsudski faced a deeper problem: the political goal of the war, an independent Ukraine allied with Poland, was already lost. Victory at Warsaw had saved Poland, not restored Petliura.

This is why the negotiating table produced an unexpected picture. Peace talks had opened at Minsk on 17 August, even as the Battle of Warsaw was raging, and were moved to Riga, resuming on 21 September. The Soviet delegation was now led by Adolph Joffe, who brought an offer drafted in Moscow: the border would run ''considerably to the east'' of the Curzon Line, Eastern Galicia would remain on the Polish side, and the question of national self-determination would be set aside. The offer was valid until 5 October. Soviet Russia had compelling reasons for such concessions. Wrangel''s White army still held out in the Crimea, and peasant uprisings, above all the Tambov Rebellion, were spreading across the Russian interior. Lenin could not afford to prolong the Polish front. On 15 October, speaking to a conference of Moscow gubernia committee chairmen, he put it plainly: ''We signed the preliminary peace on terms more favourable than those we proposed in April. Then the border was 50 versts further east; now it is 50 versts further west.''

The more dramatic reversal, however, came from the Polish side. Poland had won the war but did not press for maximal territorial gains. Jan Dąbski, who headed the Polish delegation at Riga, was not a Pilsudski man. The delegation was dominated by the National Democrats (Endecja), and their ideological leader, Stanisław Grabski, argued that incorporating broad eastern territories with Minsk would swell the non-Polish minority beyond a third of the population: a threat to the stability of a Polish nation-state and, not incidentally, an electoral gift to Pilsudski''s camp. In confidential one-on-one talks with Joffe, Dąbski traded away Minsk in return for the strategic railway linking Baranowicze, Łuniniec, Sarny, and Równe and a corridor connecting Poland with friendly Latvia. Agreement was reached on 5 October; the Preliminary Peace Treaty and Armistice was signed on 12 October and came into force at midnight on 18 October. Petliura''s Ukrainian People''s Republic, the very ally for whom the war had been taken to Kiev, was now stripped of Polish recognition and left alone to face the Soviet armies. Pilsudski called the treaty ''an act of cowardice'' and, the following May, visited the Ukrainian internment camp at Kalisz to apologise to Petliura''s soldiers. Poland had won the war, yet the victors themselves narrowed the peace.

## Riga''s border and the allies excluded from peace

The Treaty of Riga of 18 March 1921 was signed by Poland, Soviet Russia and Soviet Ukraine, with Soviet Russia also representing Soviet Belarus. Poland obtained extensive eastern territories, but Minsk remained Soviet. This was distinct from the Latvian-Russian treaty signed at Riga in August 1920.

Polish leaders did not share a single objective. Piłsudski''s federation project and alliance with Petliura sought an independent Ukraine between Poland and Soviet Russia. National Democrats prioritized the territory and population a Polish nation-state could govern. Soviet leaders needed to reduce western commitments while confronting Wrangel and peasant rebellion. Exhaustion and conflicting state projects converted military victory into a limited settlement.

The Ukrainian People''s Republic paid the most direct price among Poland''s allies. Petliura was excluded from negotiations as Poland recognized Soviet Ukraine as its treaty partner. Republican troops fought on until November 1920, then retreated into Polish internment. Bułak-Bałachowicz''s separate expedition into Belarus also failed after the armistice. Continued fighting by anti-Soviet forces beyond the settlement did not commit Warsaw to renewed general war.

The treaty provided for nationality options, minority language, religious and cultural rights, restitution of property and cultural objects, and financial settlement. Implementation differed from the promises. Ukrainians and Belarusians were divided by the border; Jews and other communities also inhabited Poland''s east. State consolidation meant both an achievement of stability and continued conflict over minority rule.

Prisoner deaths were not resolved by drawing a border. Epidemics, hunger, camp conditions and responsibility must be examined through prisoner records. Using them to justify the later Katyn massacre by exchanging casualty totals distorts distinct events. Warsaw checked hopes of extending European revolution through the Red Army, but neither the New Economic Policy nor the turn towards relations with the West can be explained by this war alone. Postwar state-building continues in the [Russian Civil War](/commulingo/events/civil-war) and the [formation of the USSR](/commulingo/events/ussr-formation).
',
  relations='{"parent": "civil-war"}'::jsonb,
  updated_at=NOW() WHERE id='soviet-polish-war';
UPDATE commulingo_history_events SET
  body_ko='## 레닌그라드에서 32킬로미터: 두 나라, 두 공포

1939년 여름, 핀란드만 북쪽 해안에서 레닌그라드까지의 거리는 카렐리야 지협의 가장 좁은 곳에서 32킬로미터에 불과했다. 장거리 포병 사정거리 안이었다. 이 짧은 간격 안에 1917년부터 두 개의 서로 맞물리는 공포가 쌓여 있었다.

핀란드는 1917년 12월 6일 독립을 선언했고, 3주 뒤 볼셰비키 러시아는 이를 승인했다. 그러나 곧 내전이 뒤따랐다. 독일 제국군의 지원을 받은 만네르헤임 남작의 백군이 소비에트 러시아의 지원을 받은 적위대를 제압했고, 그 과정에서 약 3만 7천 명의 핀란드인이 죽었다. 승리한 백군은 동카렐리야로 의용군 원정을 보내 소비에트 영토 깊숙이 들어갔다. 1920년 타르투 조약이 국경을 확정했을 때, 소비에트 러시아는 내전으로 약화된 처지에서 페첸가(페트사모)의 북극해 항구를 넘겨주고 레닌그라드에서 32킬로미터까지 국경을 끌어당기는 조건을 받아들여야 했다. 핀란드 측 협상가인 파시키비조차 이를 "지나치게 좋은 평화"라 불렀다. 1919년 만네르헤임은 런던 《타임스》에 핀란드의 역사적 임무는 "볼셰비즘을 페트로그라드에서 몰아내는 것"이라고 말했고, 이 말은 모스크바에서 잊히지 않았다.

1930년대에 들어서도 신뢰는 싹트지 않았다. 1932년 소련-핀란드 불가침조약이 체결됐지만, 핀란드는 스칸디나비아 중립 노선에 무게를 두었고, 스웨덴과 비밀 군사협력을 모색했으며, 에스토니아와는 핀란드만을 봉쇄하기 위한 합동 작전을 은밀히 연습했다. 지협에는 1920년대에 시작해 1932년에 재개된 요새선이 건설되고 있었는데, 훗날 만네르헤임 선이라 불리게 될 이 방어체계는 1939년 11월까지도 완성되지 못했다.

소련 쪽 공포는 더 크고 더 물질적이었다. 레닌그라드는 소련에서 두 번째로 큰 도시이자 군수산업의 심장부였고, 국경에서 당일 행군 거리에 놓여 있었다. 스탈린은 독일(혹은 독일의 동의 아래 영국이나 프랑스)이 핀란드를 징검다리 삼아 레닌그라드를 치는 시나리오를 현실적인 위협으로 보았다. 이는 단지 편집증이 아니었다. 1918년 독일군은 실제로 핀란드 내전에 개입했고, 1930년대 후반 핀란드의 군사정보는 독일·영국·프랑스 3국 모두와 접촉하고 있었다. 1937년 핀란드 대통령 스빈후부드는 베를린에서 "러시아의 적은 언제나 핀란드의 친구여야 한다"고 말했다.

그러나 이 공포가 작동하는 기관은 이미 손상되어 있었다. 1937-38년 대숙청은 붉은 군대 장교단을 절단했다. 여단장·사단장·군단장의 3분의 2가 처형되거나 투옥되었고, 전체적으로 약 1만 1천 명의 장교가 숙청되었다. 같은 시기 붉은 군대 병력은 150만에서 330만으로膨胀했다. 중대장이 사단을 지휘하고, 대령이 군단을 맡는 상황이 일상이 되었다. 1939년 6월 참모총장 샤포시니코프가 핀란드 작전 계획을 작성했을 때, 그는 수개월이 걸리는 험난한 전역을 예측했다. 그러나 스탈린과 보로실로프는 그 계획을 조롱하며 물리쳤고, 계획은 레닌그라드 군관구 사령관 메레츠코프에게 넘겨졌다. 메레츠코프는 3주 안에 헬싱키에 도달하라는 지시를 받았다.

1938년 4월 NKVD 요원 보리스 야르체프가 헬싱키를 방문해 핀란드 총리 카얀데르에게 경고했다. 소련은 독일을 신뢰하지 않으며, 전쟁은 두 나라 사이에서 가능하다고 보았다. 붉은 군대는 국경 뒤에서 수동적으로 기다리지 않고 "적을 맞아 전진할 것"이었다. 소련은 레닌그라드 방어를 위해 핀란드만의 섬들을 할양하거나 조차할 것을 제안했다. 핀란드는 중립 정책을 고수하며 거부했다. 1년 넘게 이어진 비밀 교섭은 아무런 결과도 내지 못했다.

1939년 8월 23일, 몰로토프와 리벤트로프가 모스크바에서 불가침조약에 서명했을 때, 그 비밀의정서는 핀란드를 소련 세력권에 배정했다. 유럽의 외교 지도가 다시 그려지는 순간, 카렐리야 지협의 32킬로미터는 더 이상 외교로 풀 문제가 아니게 되었다.

1918년 핀란드 내전과 독일 개입은 [브레스트 강화](/commulingo/events/brest-litovsk)에, 1920년 타르투 조약은 [발트 독립전쟁](/commulingo/events/baltic-wars-of-independence)에 자세히 설명되어 있다.

## 지도 위에 그어진 선, 협상 테이블 위에 놓인 나라

1939년 8월 23일 밤 모스크바에서 몰로토프와 리벤트로프가 서명한 문서에는 공개된 불가침 조문과 함께, 동유럽을 두 제국의 이익권역으로 나누는 「비밀 추가 의정서」가 붙어 있었다. 제1조는 핀란드·에스토니아·라트비아·리투아니아를 언급하며 리투아니아 북쪽 경계를 양국의 권역 분할선으로 정했는데, 이는 핀란드가 에스토니아·라트비아와 함께 소련 몫이라는 선언이었다. 불과 한 달 뒤인 9월 28일의 독소 우호·국경 조약은 리투아니아마저 소련 권역으로 넘기며 스탈린의 손을 완전히 풀어 주었다.

발트 3국은 신속히 무너졌다. 에스토니아는 9월 28일, 라트비아는 10월 5일, 리투아니아는 10월 10일에 각각 상호원조조약을 맺고 소련군 기지의 주둔을 받아들였다. 핀란드는 10월 5일 가장 늦게 모스크바로 초청되었다. 스탈린이 협상 테이블에 직접 앉은 것은 그 진지함의 신호였다. 실제로 스탈린은 7차례 회담 중 6차례에 참석했으며, 첫 대면에서 파시키비는 스탈린의 의외로 부드러운 태도에 놀랐다고 술회했다.

10월 12일 시작된 첫 회담에서 소련 측이 제시한 요구는 다섯 가지였다. 상호원조조약 체결, 핀란드만 입구의 섬들 할양, 리바치 반도의 핀란드 구역 양도, 항코 반도에 해군·항공 기지 30년 조차(병력 5천 명), 그리고 레닌그라드에서 불과 32킬로미터 떨어진 카렐리야 지협 국경을 비푸리 방향으로 70여 킬로미터 후퇴시키는 것이었다. 보상으로 소련은 동카렐리야의 레볼라와 포라얘르비 지역(핀란드가 내놓는 면적의 약 두 배)을 제안했다. 스탈린은 이렇게 말했다. 「레닌그라드는 옮길 수 없으니 국경을 옮겨야 한다.」

핀란드 측은 상호원조조약을 즉각 거부했고, 소련도 이 점은 더 밀어붙이지 않았다. 섬들과 리바치 반도는 협상 가능한 사안이었다. 그러나 항코 기지는 달랐다. 핀란드 본토에 외국 군대가 주둔하는 것은 중립의 포기였고, 만네르헤임조차 「항코를 내주면 핀란드의 전략적 위치는 치명적으로 약화된다」고 보았다. 협상은 세 차례(10월 12~14일, 10월 23~24일, 11월 3~9일)에 걸쳐 이어졌다.

헬싱키 내부는 분열되어 있었다. 만네르헤임은 전쟁이 나면 핀란드군이 2주 이상 버티지 못할 것이라며 타협을 권고했다. 반면 외무장관 에르코는 스탈린의 요구를 허세로 보았고, 자신이 소유한 『헬싱긴 사노마트』를 통해 여론을 강경 쪽으로 이끌었다. 총리 카얀데르도 에르코 편에 섰다. 파시키비와 나중에 협상단에 합류한 재무장관 탄네르는 절충을 모색했지만, 헬싱키의 훈령은 단호했다.

10월 23~24일의 두 번째 회담에서 스탈린은 요구를 다소 낮추었다. 카렐리야 지협에서 요구하는 땅을 줄이고, 항코 주둔 병력을 4천 명으로 감축했으며, 조차 기한을 30년에서 유럽 전쟁 종료 시까지로 단축했다. 그러나 이러한 양보는 오히려 핀란드 측에 「더 물러날 수 있다」는 신호로 읽혔다. 파시키비가 절충안으로 유사뢰 섬과 이노 요새를 제안했지만 헬싱키는 거부했다.

10월 31일 몰로토프는 최고회의 연설에서 소련의 요구를 공개적으로 밝혔다. 「우리의 제안은 극히 소박하며, 소련 안보를 보장하는 데 필요한 최소한에 불과하다.」 공개 천명은 협상의 여지를 극적으로 좁혔다. 더 이상 요구를 낮추면 체면 손상이었기 때문이다. 11월 3~4일 세 번째 회담에서 핀란드 측은 최종 반대안을 내놓았다. 테리요키 일대의 작은 영토와 핀란드만 섬들은 넘기겠지만, 항코 기지와 코이비스토를 포함한 실질적 국경 변경은 받아들일 수 없다는 것이었다.

11월 9일 마지막 회담에서 파시키비가 이를 통보하자, 탄네르의 기록에 따르면 「상대방들의 눈이 커졌다.」 스탈린이 물었다. 「이노조차 내놓지 않겠다는 말인가?」 몰로토프가 덧붙였다. 「당신들은 충돌을 일으키고 싶은 것인가?」 더 이상의 협상은 없었다. 11월 13일 핀란드 대표단은 아무도 배웅하지 않는 모스크바 기차역을 떠났다. 그들은 아직도 협상이 이어질 것이라고 믿었지만, 소련 측은 이미 다른 결론에 도달한 뒤였다. 크렘린은 핀란드가 독일이나 영국과 은밀한 약속을 맺었다고 확신했고, 핀란드는 소련이 애초에 협상할 의사가 없었다고 믿었다. 두 확신 사이에서 105일의 전쟁이 다가오고 있었다.

## 일곱 발의 허구, 그리고 굶주린 이웃을 위한 ''빵''

1939년 11월 26일 오후 3시 45분(모스크바 시간), 카렐리야 지협의 소련 국경 마을 마이닐라 인근에서 일곱 발의 포성이 울렸다. 소련은 즉시 핀란드의 도발이라고 발표했고, 몰로토프는 주모스크바 핀란드 대사 위리외코스키넨에게 항의각서를 전달했다. 각서에 따르면 사망 4명(사병 3명과 하사관 1명), 부상 9명이었다. 그러나 핀란드 국경수비대 제4중대의 증언은 정반대였다. 포성은 소련 쪽에서 들렸고 포탄은 국경선에서 약 800미터 소련 내륙에 떨어졌다. 만네르헤임의 사전 명령으로 핀란드 포병은 국경에서 20킬로미터 이상 후퇴한 상태였으며, 마이닐라를 사정거리 안에 둔 포대는 단 한 문도 존재하지 않았다.

핀란드는 즉시 공동조사를 제안했으나, 소련은 거부했다. 1990년대 러시아 역사가 파벨 압테카리가 공개된 소련 군사문서를 분석한 결과, 마이닐라에 주둔하던 제68소총연대의 병력 기록은 11월 25일부터 29일까지 단 한 명의 증감도 없었다. 숫자는 매일 같았다: 지휘관 90명, 정치장교 16명, 행정 12명, 기술 8명, 의무 7명, 수의 2명, 하사관 269명, 사병 528명, 합계 3,041명. 제70소총사단과 제19소총군단의 작전일지도 11월 26일 항목에 "변화 없음"이라고 기록했다. 사상자는 애초에 존재하지 않았다. 연대 전투일지 첫 장에 적힌 "핀란드군의 포격으로 3명 전사, 6명 부상"이라는 문구는 한 사람의 필체로, 실제 연대장 코루노프 대령이 아닌 엉뚱한 이름(살리닌 대위)으로 사후 작성된 위조였다. 흐루쇼프는 훗날 회고록에서 이 작전을 포병 총책임자 그리고리 쿨리크가 지휘했다고 적었다.

사실 전쟁 명령은 이미 내려져 있었다. 제19소총군단의 전투명령 제2호는 11월 23일자로 작성되어 "공격 개시일은 별도 통보한다"는 문구로 끝맺고 있었다. 마이닐라는 구실이었을 뿐, 전쟁은 그 이전에 결정된 것이었다.

11월 28일 소련은 1932년 체결된 불가침조약을 일방적으로 파기했고, 29일 몰로토프는 라디오 연설을 통해 "우리의 목표는 결코 핀란드 영토의 병합이 아니다"라고 선언했다. 이 연설에서 그는 소비에트 카렐리야를 핀란드에 통합해 "하나의 독립된 핀란드 국가"를 이룰 수도 있다는 파격적인 제안까지 꺼냈다. 다음 날 아침, 붉은 군대는 전 국경에서 진격을 시작했고 헬싱키 상공에는 폭격기 편대가 나타났다.

11월 30일 헬싱키는 세 차례의 공습을 겪었다. 오전 9시 20분 첫 경보가 울리자 소련 폭격기는 처음에 삐라를 뿌렸다. "핀란드 동지들이여! 우리는 정복자가 아니라 자본가와 지주의 압제로부터 핀란드 인민을 해방하기 위해 왔다." 그러나 두 번째, 세 번째 파도는 달랐다. 발트함대 소속 제1기뢰어뢰항공연대 제3비행대의 DB-3 폭격기 8대가 항구의 해안방어함을 찾지 못하자 목표를 헬싱키 시내로 전환했고, 구름 속에서 대형이 흐트러지며 주택가와 시내 중심에 폭탄을 퍼부었다. 공과대학 건물이 파괴되고, 캄피 버스 정류장이 직격당했으며, 히에탈라흐티의 기름 저장고는 이틀간 불탔다. 이날 하루 사망 91명, 부상 240명. 종군기자 마사 겔혼은 이 광경을 두고 "바르셀로나의 3월 같았다"고 썼다.

국제적 비난이 쏟아지자, 몰로토프는 라디오에서 소련이 폭격하는 것이 아니라 "굶주리는 핀란드 이웃에게 빵을 투하하는 중"이라고 주장했다. 핀란드인들은 이에 대한 응답으로 소련의 회전분산항공폭탄 RRAB-3를 "몰로토프의 빵바구니"(Molotovin leipäkori)라 불렀고, 곧 소련 전차에 맞설 즉석 화염병에 "몰로토프 칵테일"이라는 이름을 붙여 "빵에 곁들일 음료"를 완성했다. 한편 72세의 만네르헤임은 아침 식탁에서 폭음을 듣자마자 국방부로 달려가 "사령관직에 취임한다"고 통보했고, 그날 밤 전국에는 "만네르헤임이 방어를 지휘한다"는 포고가 울려퍼졌다. 미국 기자 허버트 엘리스턴은 이렇게 기록했다. "나는 장담할 수 있다. 만네르헤임을 총사령관으로 임명한 포고보다 더 신속하게 한 국민을 전투태세로 전환시킨 선언은 없었다."

## 존재하지 않는 나라와의 조약: 테리요키 정부, 세계를 향한 소련의 거짓말

1939년 12월 1일, 붉은 군대가 국경 마을 테리요키를 점령한 지 하루 만에 모스크바 방송은 새로운 소식을 전했다. 핀란드의 ''진정한'' 인민정부가 수립되었으며, 그 수반은 1918년 핀란드 내전에서 패배한 뒤 소련에 망명해 있던 코민테른 간부 오토 빌레 쿠시넨이라는 것이었다. 공식 국호는 ''핀란드 민주공화국''이었지만, 모두가 그냥 테리요키 정부라 불렀다.

내각 구성은 허술했다. 쿠시넨을 제외한 각료들은 대부분 소련 시민권자이거나 내전 이후 소련으로 도피한 핀란드계 공산주의자들로, 핀란드 안에서 그들을 아는 사람은 거의 없었다. ''국방장관'' 악셀리 안틸라는 핀란드계 소련인이었고, 그 아래 편성된 ''핀란드 인민군''은 이른바 제106산악소총사단을 모체로 약 2만 2,500명 규모였으나 실제 전투보다 점령지 치안과 선전 활동에 동원됐다. 소련이 테리요키에서 ''정부'' 수립을 발표한 바로 그날, 핀란드에서는 아이모 카얀데르 내각이 물러나고 리스토 뤼티가 이끄는 거국내각이 들어섰다. 핀란드 사회는 침략을 목전에 두고 ''겨울전쟁의 정신''으로 불릴 만한 단결을 보여주고 있었다.

12월 2일, 쿠시넨은 모스크바로 날아가 몰로토프와 ''상호원조 및 우호 조약''에 서명했다. 그 내용은 10월에 헬싱키가 거부했던 것과 거의 같았다. 카렐리야 지협의 국경을 서쪽으로 밀고, 항코 반도를 30년간 조차하며, 핀란드 만의 여러 섬을 넘긴다. 차이가 있다면, 소련은 그 대가로 동카렐리야의 7만 제곱킬로미터를 주겠다고 약속했다는 점이었다. 그러나 이 조약의 진짜 목적은 따로 있었다.

12월 4일, 국제연맹이 핀란드의 제소를 심의하려 하자 몰로토프는 사무총장에게 전문을 보내 이렇게 선언했다: ''소련은 핀란드와 전쟁 상태에 있지 않으며, 핀란드 국민을 전쟁으로 위협하고 있지도 않다.'' 소련이 하고 있는 것은 만네르헤임과 탄네르의 ''파시스트 도당''에 맞서 싸우는 합법적 쿠시넨 정부를 지원하는 일일 뿐이라는 주장이었다. 테리요키 정부는 침공에 바른 외교적 외투였다.

국제연맹은 이 외투를 벗겼다. 12월 11일 특별위원회를 구성해 청문을 진행했고, 12월 14일 총회와 이사회는 규약 제16조 4항에 따라 만장일치로 소련을 침략국으로 규정하고 ''소련은 스스로를 국제연맹 밖에 두었다''고 선언했다. 강대국이 국제연맹에서 제명된 것은 이때가 유일했다. 소련의 연맹 가입은 불과 5년 전인 1934년의 일이었다. 그러나 때는 절망적이었다. 일본, 독일, 이탈리아가 이미 탈퇴해 버린 연맹은 껍데기였고, 권고 이상의 조치를 취할 힘도 의지도 없었다. 핀란드는 홀로 싸워야 했다.

테리요키 정부의 또 하나의 기능은 평화의 길목을 막는 것이었다. 12월 내내 스웨덴을 통한 비공식 타진이 오갔지만, 몰로토프의 대답은 한결같았다. 소련은 이미 핀란드의 합법 정부와 교섭 중이므로 헬싱키의 뤼티 정부와는 상대하지 않겠다는 것이었다. 쿠시넨 정부를 세운 순간, 소련은 외교적으로 자신의 출구를 봉쇄한 셈이었다. 실패한 전쟁이 수개월 더 끌려야만 마침내 1940년 1월 말, 몰로토프가 스톡홀름의 콜론타이를 통해 뤼티-탄네르 정부를 합법 정부로 인정한다고 통보했고, 그때서야 비로소 진짜 평화 협상이 시작될 수 있었다. 쿠시넨의 정부는 그렇게 버려졌다.

## 도로 위의 장작더미: 수오무살미에서 라테까지, 두 사단의 궤멸과 지휘부의 반격

1939년 12월 7일, 소련 제163소총사단은 수오무살미 마을을 점령했다. 목표는 오울루까지 진격해 핀란드를 반으로 가르는 것이었다. 그러나 그곳에서 사단의 진격은 멈췄다. 도로는 하나뿐이었고, 사단장 안드레이 젤렌초프는 12월 20일 철수 허가를 요청했지만 제9군 사령부는 이를 거부했다. 대신 제44차량화소총사단이 라테 도로를 따라 지원을 위해 진입했다.

햘마르 실라스부오 대령이 지휘하는 핀란드 제9사단은 두 사단을 하나씩 처리하기로 했다. 12월 11일 핀란드군은 라테 도로를 차단해 제163사단의 남쪽 보급로를 끊었다. 12월 27일, 증원받은 실라스부오 부대는 팔로바라를 점령해 제662연대를 본대로부터 분리했다. 12월 28일 아침, 카를레 카리가 북서쪽에서 진격하자 소련군 저항은 돌연 무너졌다. 생존자들은 키안타얘르비 호수의 얼음 위로 도망쳤고, 제163사단은 사실상 존재하지 않게 되었다.

이제 제44사단 차례였다. 사단장 알렉세이 비노그라도프는 제163사단이 들리는 거리에서 궤멸되는 동안 방어진을 구축하라는 명령을 내렸을 뿐이었다. 1월 1일부터 7일까지 핀란드군은 30킬로미터에 걸쳐 도로 위에 늘어진 제44사단을 여러 개의 ''모티''로 잘라냈다. 소련군의 야전취사차량과 모닥불이 핀란드 저격수들의 표적이 됐고, 영하 40도의 추위 속에서 굶주린 병사들은 얼어 죽거나 항복했다. 비노그라도프는 1월 6일 밤 9시 30분에야 후퇴 명령을 내렸다. 부대원 대부분은 국경에 도달하지 못했다. 제44사단은 병력 1만 3,962명 중 스타프카 조사위원회가 공식 집계한 것만 4,674명의 사상자를 냈다.

비노그라도프와 참모장 볼코프, 정치위원 파호모프는 부대를 버리고 탈출했다가 4일 후 소련 측 전선에 도착해 즉결 군사재판에서 사형을 선고받고 부대원들 앞에서 총살됐다. 핀란드군은 이 전투에서 전차 43대, 야포 70문, 트럭 278대, 소총 6,000정 등 방대한 장비를 노획했다. 소련군이 승리를 확신해 승전 퍼레이드용 악대까지 대동했다는 사실은 패배의 상징으로 두고두고 회자됐다.

연이은 참패에 스탈린은 더 이상 보로실로프를 신뢰하지 않았다. 12월 말 전선의 모든 정면 공격이 중단됐고, 1940년 1월 7일 세묜 티모셴코가 핀란드 작전 총지휘관에 임명됐다. 보리스 샤포시니코프 참모총장이 처음 제안했으나 스탈린이 묵살했던 계획, 즉 카렐리야 지협 단일 전선에 전력을 집중해 정면 돌파한다는 구상이 복원됐다. 티모셴코는 60만 병력을 2개 군(제7군과 제13군)으로 재편하고 7개 사단을 예비대로 확보했다. 북부의 우회 기동은 포기됐다. ''숲과 호수를 가로지르는 심층 작전''에서 ''포병과 물량으로 요새를 갈아내는 소모전''으로 전략이 전환된 것이다.

티모셴코는 자신의 전략을 이렇게 요약했다: ''정면 공격에서는 그 어떤 적도 우리와 견줄 수 없다. 연속적인 직접 공격으로 적의 피를 말릴 것이다.'' 하지만 실제 작전은 무모한 인해전술과는 거리가 멀었다. 포병총국장 니콜라이 보로노프는 카렐리야 지협에 포문을 집중했고, 제123소총사단은 실물 크기 모형으로 만네르헤임 선 돌파 훈련을 반복했다. 탱크는 더 이상 도로를 따라 길게 늘어서지 않고 보병과 함께 소규모로 움직였다. 2월 1일, 소련군은 첫 24시간 동안 30만 발의 포탄을 핀란드 진지에 퍼부으며 총공세를 시작했다. 2월 11일, 숨마 전선에서 만네르헤임 선이 마침내 뚫렸다.

## ''이 손이 썩어라'': 피로 쓴 조약과 4월의 결산

1940년 3월 5일, 붉은 군대는 만네르헤임 선을 넘어 비푸리(비보르크) 교외에 진입했고 핀란드군은 탄약이 바닥나고 있었다. 만네르헤임은 "더 이상 버틸 수 없다"고 정부에 알렸다. 핀란드는 3월 6일 휴전을 제안했지만 소련은 거절했다: 군사적 우위가 강해지는 순간이었기 때문이다. 핀란드 대표단이 3월 7일 모스크바에 도착했을 때, 스탈린은 협상장에 나타나지 않았다. 굴욕적인 전쟁의 얼굴이 되고 싶지 않았던 것이다.

몰로토프가 제시한 조건은 전쟁 전 요구보다 훨씬 가혹했다. 카렐리야 지협 전체에 비푸리, 라도가 호수 서·북부 해안, 살라 지역, 리바치 반도와 피스키 곶의 일부, 핀란드 만의 섬들, 그리고 항코 반도의 30년 조차: 총 국토의 약 9%, 산업 자산의 13%에 달했다. 소련이 전쟁 전에 제안했던 영토 교환, 즉 동카렐리야의 더 넓은 땅은 이제 어디에도 없었다. 패배한 쪽이 내놓는 것이었고, 승자는 더 많이 가져갔다.

리스토 뤼티 총리와 파시키비가 이끄는 핀란드 대표단은 3월 12일 저녁 조약에 서명했다. 대통령 퀴외스티 칼리오는 서명을 승인하며 "이 괴물 같은 조약에 서명하는 손이여, 썩어라!"라는 말을 남겼고, 아이러니하게도 그해 여름 그의 오른팔은 실제로 마비되었다. 42만 명이 넘는 카렐리야 주민, 핀란드 인구의 12%가 고향을 떠나 새로운 국경 안쪽으로 피난했다. 총격은 3월 13일 정오(레닌그라드 시간)에 멈췄다.

소련 군부 내부에서는 전쟁이 끝나자마자 책임 공방이 시작됐다. 1940년 4월, 중앙위원회는 전쟁의 교훈을 결산하는 회의를 열었고, 스탈린 앞에서 지휘관들은 서로를 비난했다. 보로실로프는 "모든 것이 예상과 달랐다"고 변명했지만, 15년간 국방인민위원으로 있으면서 대숙청을 주도하고 훈련·장비·전술을 방치한 책임은 피할 수 없었다. 5월 8일, 그는 해임되고 티모셴코가 그 자리를 이었다.

회의는 구체적인 개혁을 명령했다. 전선 정치위원의 권한이 축소되어 지휘관의 단일 명령권이 회복되었고, 차르 시절의 계급 체계와 엄격한 규율이 부활했다. 겨울 작전을 위한 의복과 장비가 개선되었으며, 기계화 부대의 편제와 훈련이 재검토되었다. 하지만 시간은 14개월뿐이었다: 바르바로사가 시작될 때까지 개혁은 완료되지 못했다.

한편, GRU 국장 이반 프로스쿠로프는 회의에서 스탈린이 정보 실패 탓으로 책임을 돌리려 하자 공개적으로 반박했다. 프로스쿠로프는 정보 보고가 핀란드의 방어 준비와 지형의 어려움을 정확히 전달했지만 정치 지도부가 무시했다고 주장했다. 그는 7월에 해임되었고, 이듬해 처형되었다. 겨울전쟁의 교훈을 둘러싼 논쟁은 단순한 군사 개혁의 문제가 아니라, 누가 진실을 말할 수 있고 누가 침묵해야 하는지에 관한 정치적 투쟁이기도 했다.

## 망각 속으로 간 15개월: 왜 핀란드는 나치 독일 편에 섰는가

모스크바 강화조약이 조인된 1940년 3월 13일, 핀란드인들은 국기를 조기로 내렸다. 영토의 9%, 공업력의 5분의 1, 제2의 도시 비푸리를 잃은 상실감은 국가 전체를 덮었다. 그러나 전쟁이 끝난 것이 아니었다. 전시 상태는 유지됐고, 검열은 풀리지 않았으며, 군사비는 1941년 국가예산의 45%까지 치솟았다. 42만 명의 피난민은 잃어버린 집으로 돌아갈 날만 기다렸다. 핀란드인들이 이 15개월을 ''잠정평화''(Välirauha)라 부른 것은 우연이 아니었다.

소련의 압력은 조약 다음날부터 시작됐다. 1940년 6월 14일, 소련 전투기가 탈린발 헬싱키행 핀란드 여객기 칼레바호를 격추해 탑승자 9명 전원이 사망했다. 같은 달, 몰로토프는 페차모 니켈 광산의 채굴권을 소련에 넘기거나 소련-핀란드 합작회사를 세우라고 요구했다. 7월에는 한코 기지로 향하는 소련군의 철도 통행권을, 8월에는 올란드 제도의 요새 철거를 요구했다. 주헬싱키 소련대사 이반 조토프는 핀란드 내각의 구성까지 문제 삼으며 반소 인사로 찍힌 배이뇌 탄네르 외무장관의 사임을 요구했고, 탄네르는 8월 15일 물러났다. 같은 시기 발트 3국이 소련에 병합되는 광경을 지켜본 핀란드 지도부에게 이것은 단순한 외교적 압력 이상으로 읽혔다. 파시키비는 1940년 7월 22일 외무장관에게 보낸 편지에 이렇게 썼다: "발트 3국의 운명과 그들이 소비에트 제국에 종속된 방식을 생각하면, 밤새도록 이 중대한 문제를 곱씹지 않을 수 없다."

핀란드가 독일 쪽으로 기운 것은 이 절박함 속에서였다. 1940년 8월 18일, 괴링의 사자 요제프 펠트옌스가 헬싱키에 도착해 뤼티·만네르헤임과 만났다. 독일은 노르웨이 북부로 가는 병력 통과권을 요구했고, 그 대가로 무기를 풀었다. 9월 22일 첫 독일군 수송대가 바사 항에 도착했다. 몰로토프가 11월 베를린을 방문해 "핀란드 문제를 베사라비아처럼 처리하겠다"고 말했을 때, 히틀러가 거부권을 행사한 것도 이 무렵이었다. 히틀러는 1940년 12월 18일 바르바로사 작전을 재가했고, 만네르헤임의 개인적 특사 파보 탈벨라 소장은 이미 베를린에서 할더·괴링과 만나 독일의 대소전 계획을 전해 듣고 있었다.

1941년 5월 25일부터 28일까지 핀란드 참모장교단이 잘츠부르크와 베를린에서 독일 국방군과 작전 조율 회의를 가졌다. 에리크 하인리히스 장군이 이끄는 핀란드 측은 병력 동원 시기(6월 15일), 작전 구역 분할, 독일 제163보병사단의 핀란드 배속을 합의했다. 핀란드 의회와 내각 대부분은 6월 9일까지 아무것도 몰랐다. 전쟁 결정은 뤼티·만네르헤임·랑겔 총리 등 극소수만이 알고 내린 것이었다.

6월 22일 바르바로사가 개시되자 핀란드는 공식적으로 중립을 선언했지만, 독일군은 이미 핀란드 영토에서 출격하고 있었다. 6월 25일 소련 공군이 핀란드 18개 비행장을 폭격하자 랑겔 총리는 의회에서 "핀란드는 전쟁 상태에 있다"고 선언했다. 정부는 이 전쟁을 ''계속전쟁''(Jatkosota)이라 명명했다. 이 이름은 정치적 선택이었다. 겨울전쟁이 소련의 침략으로 시작된 방어전쟁이었다면, 계속전쟁은 그 연장선 위에 있다는 서사였다. 실제로 만네르헤임은 1941년 7월 10일 유명한 ''칼집 명령''에서 1918년 내전 당시의 선언을 다시 꺼내 들었다: "핀란드와 비엔나 카렐리야가 자유로워질 때까지 칼을 칼집에 넣지 않겠다." 이것은 국경 회복을 넘어 동카렐리야 병합이라는 더 넓은 전쟁 목표를 공개적으로 천명한 것이었다.

전후 핀란드 역사학계는 이 전쟁을 독일과의 ''별도전쟁''(erillissota)으로 서술해 왔다. 핀란드는 추축국 삼국동맹에 서명하지 않았고, 공식적으로는 독일의 동맹국이 아니라 ''공동교전국''이라는 입장이었다. 그러나 2008년 헬싱긴 사노마트가 핀란드 역사학자 28명을 대상으로 한 설문에서 16명이 "핀란드는 나치 독일의 동맹국이었다"고 답했고, 1947년 파리 강화조약은 핀란드를 "히틀러 독일의 동맹국"으로 명시했다. 라우리 한니카이넨의 2020년 국제법 분석은 더 단호하다: 핀란드군이 1939년 국경을 넘어 동카렐리야를 점령하고 병합을 시도한 순간, 계속전쟁은 국제법상 침략전쟁이 되었다는 것이다. 그러나 대부분의 역사가들이 인정하듯, 1940년 여름 소련의 포위 속에서 핀란드에게 독일 외에는 현실적 선택지가 없었다는 사실 또한 부인하기 어렵다.

## 질문은 남고, 답은 갈린다: 겨울전쟁이 80년 넘게 남긴 논쟁들

겨울전쟁은 1940년 3월에 끝났지만, 그 해석을 둘러싼 논쟁은 2025년까지도 진행 중이다. 세 질문이 역사가들을 가장 오래 갈라놓았다.

첫째, 스탈린은 핀란드 전체를 삼키려 했는가. 대다수 역사가는 그렇다고 본다. 테리요키 괴뢰정부 수립, 즈다노프가 쇼스타코비치에게 의뢰한 〈핀란드 모음곡〉(헬싱키 입성 행진곡용), 그리고 12월 21일 이전 완전 항복을 요구한 작전 계획은 단순한 국경 조정 이상을 말해 준다. 러시아 역사가 유리 킬린은 스탈린이 협상 타결을 기대하지 않았으며 영토 교환 제안은 체제 변경을 위한 시간벌기였다고 주장했다. 반대편에서는 윌리엄 트로터가 "스탈린은 1940년에도, 1944년에도 손쉽게 핀란드를 점령할 수 있었지만 그러지 않았다"고 반박한다. 스티븐 코트킨은 발트 3국과의 차이를 지적한다: 소련은 발트 3국에 상호원조조약을 강요해 결국 합병했지만, 핀란드에는 제한적 영토 양보만 요구했고 그 대가로 땅까지 제안했는데, 이는 전면 합병 시나리오와 맞지 않는다는 것이다. 2002년 A. 추바랸은 핀란드 합병 계획을 입증할 문서가 러시아 기록보관소에 단 한 건도 없다고 밝혔다. 코트킨은 스탈린의 궁극적 의도가 내부 문건에 기록되지 않았기에 협상에서의 발언과 행동으로 추론할 수밖에 없다고 덧붙인다.

둘째, 희생자 수. 1940년 3월 몰로토프가 최고회의에 보고한 소련군 전사자는 48,745명이었다. 이 숫자는 소련 붕괴 직전까지 공식 수치였다. 1989년 미하일 세미랴가는 『오고뇨크』에 처음으로 53,522명이라는 다른 숫자를 발표했다. 그리고리 크리보셰예프의 1993년 기밀해제 연구는 회복 불가능 손실 126,875명, 총 손실 391,783명을 제시했다. 유리 킬린은 1991년 63,990명에서 2012년 138,533명으로 추정치를 수정했다. 2013년 파벨 페트로프는 이름·생년월일·계급이 확인된 전사·실종자 167,976명이 러시아국립군사문서보관소에 있다고 보고했다. 4만 8천에서 16만 8천까지, 같은 전쟁을 두고 이만큼 벌어질 수 있다는 사실 자체가 기록 관리의 정치적 성격을 말해 준다.

셋째, 핀란드가 양보했다면 피할 수 있었을까. 발트 3국과의 비교는 이 질문을 더 날카롭게 만든다. 에스토니아·라트비아·리투아니아는 1939년 가을 소련의 기지 요구를 수용했고, 1년 뒤 합병·소비에트화되었다. 핀란드 역사가 티모 비하바이넨은 스탈린이 조약을 신뢰하지 않았고 오직 붉은 군대만 믿었으며, 중립은 소련의 이해와 충돌할 때 적대적인 것으로 간주되었다고 반박한다. 이반 코네프 원수는 개전 무렵 스탈린이 "핀란드 인구는 레닌그라드보다 적으니, 재정착은 가능하다"고 말했다고 회고했다.

이 논쟁들은 단지 학문적인 것만이 아니었다. 핀란드에서 ''별개의 전쟁'' 테제는 수십 년간 공식 기억을 지배했고, 우르호 케코넨 대통령은 1973년 겨울전쟁이 "불필요했다"고 말해 파문을 일으켰다. 1989년 전쟁 50주기와 영화 〈탈비소타〉 개봉, 그리고 모스크바 문서보관소 개방은 핀란드의 기억 풍경을 바꾸었다. 2004년 TV 프로그램 〈위대한 핀란드인〉에서는 만네르헤임이 1위, 겨울전쟁기 총리 리스토 뤼티가 2위에 올랐다. 소련 쪽에서도 1994년 보리스 옐친이 겨울전쟁을 침략전쟁으로 규정한 것은 중요한 전환이었다.

겨울전쟁이 무엇을 해결했는지도 완전하지 않다. 레닌그라드 방위는 달성되었으나 1941년 독일군은 몇 주 만에 레닌그라드에 도달했다. 붉은 군대 개혁은 시작되었지만 바르바로사까지 14개월뿐이었고 상당 부분이 완료되지 못했다. 핀란드는 독립을 지켰지만 잃은 영토는 1941년의 선택을 낳았고, 그 선택은 다시 1944년의 패배로 이어졌다. 105일의 겨울은 그 어떤 교과서적 ''완결''도 허락하지 않았다.

## 승자도 패자도 없는 전쟁: 80년의 평결

겨울전쟁은 누가 이겼는가? 표면적으로는 소련이다. 모스크바 강화조약으로 핀란드가 잃은 영토는 11%, 소련이 얻은 것은 애초 요구보다 넓었다. 그러나 대가는 너무 컸다. 흐루쇼프는 회고록에 이렇게 남겼다: "이 정도 대가를 치른 승리는 사실상 도덕적 패배였다. 우리 모두는, 스탈린부터 맨 먼저, 그 승리 속에서 핀란드인들에게 진 패배를 느꼈다."

핀란드는 땅을 잃었으나 나라는 살았다. 발트 3국이 1940년 여름 소련에 완전히 병합된 것과 달리, 핀란드는 독립을 지켰고 제2차 세계대전의 유럽 교전국 중 점령을 겪지 않은 유일한 나라가 되었다. 42만 명이 고향을 떠났고 비푸리는 핀란드 제2의 도시에서 소련 변경 도시로 바뀌었지만, 그 대가는 이후 계속전쟁과 라플란드 전쟁, 3억 달러의 배상금으로 이어졌다.

사상자 통계는 진실 투쟁의 상징이 되었다. 1940년 몰로토프가 발표한 소련 전사자는 48,745명. 이 숫자는 소련 붕괴 직전까지 공식 기록이었다. 1989년 역사학자 미하일 세미랴가가 《오고뇨크》에 53,522명을 공개하며 균열이 시작됐다. 1993년 크리보셰예프의 연구팀은 126,875명을, 2012년 유리 킬린 교수는 138,533명을 보고했다. 2013년 파벨 페트로프가 러시아 군사기록보관소 데이터베이스에서 확인한 숫자는 167,976명이었다. 하나의 전사자 숫자조차 아직 닫히지 않았다.

더 깊은 논쟁은 전쟁의 불가피성이다. 소련 측 논리는 단순했다: 레닌그라드에서 국경까지 32킬로미터는 방어에 턱없이 짧았다. 2013년 푸틴은 겨울전쟁이 "1917년 이후 국경 획정의 실수를 바로잡기 위한 것"이었다고 말했다. 반대편에서는 테리요키 괴뢰정부와 독소 비밀의정서를 근거로, 소련의 목표가 국경 조정이 아니라 정권 교체와 전면 점령이었다고 본다. 스티븐 코트킨 같은 역사가는 소련이 발트 3국과 달리 핀란드에는 영토 교환을 제안했고 스탈린이 직접 협상장에 일곱 차례나 출석한 점을 들어 전면 병합 의도는 없었다고 반박한다. 이 논쟁은 양측 다 기록으로 완전히 입증되지 않은 채 남아 있다.

전쟁의 판결은 시대를 타고 바뀌었다. 스탈린 시대에는 ''핀란드 반동 세력의 도발''이었고, 브레즈네프 시대에는 ''미국과 서방이 조종한 대소련 책동''이었다. 1994년 옐친이 헬싱키에서 "스탈린의 침략전쟁"이라 부르며 처음으로 사과했다. 푸틴 정권은 다시 ''필요했던 전쟁'' 프레임을 복원하면서도, 동시에 "이 피비린내 나는 에피소드가 왜 다시는 되풀이되어선 안 되는지 보여 주는 본보기"라고 했다. 역사가 정치적 필요에 따라 굴절되는 전형이다.

아이러니는 최종 명부에 있다. 소련은 겨울전쟁에서 얻은 교훈, 즉 겨울 장비와 지휘관 자율성 회복, 포병과 전차의 집중 운용을 1941년 바르바로사에 맞서는 데 썼다. 핀란드 쪽에서는 "겨울전쟁의 정신"이 국가 정체성의 핵심이 되어 1944년 재침공을 다시 막아내는 힘이 되었다. 승자도 패자도 없는 전쟁이란 이런 것이다: 양측이 각자 필요한 것을 얻었으나, 얻은 것보다 더 많이 지불한. 105일의 총성이 남긴 물음은 아직도 하나의 답으로 모이지 않는다.
',
  body_en='## Thirty-Two Kilometres from Leningrad: Two Countries, Two Fears

In the summer of 1939, the distance from the northern shore of the Gulf of Finland to Leningrad was just 32 kilometres at the narrowest point of the Karelian Isthmus, well within the range of long-range artillery. Inside that short interval, two interlocking fears had been accumulating since 1917.

Finland declared independence on 6 December 1917, and Bolshevik Russia recognised it three weeks later. But a civil war followed immediately. Baron Mannerheim''s Whites, backed by the Imperial German Army, defeated the Red Guards, who were supported by Soviet Russia; some 37,000 Finns died in the process. The victorious Whites sent volunteer expeditions deep into Soviet territory in East Karelia. When the Treaty of Tartu settled the border in 1920, Soviet Russia, weakened by its own civil war, had to accept terms that handed Finland the Arctic harbour of Petsamo and drew the frontier to within 32 kilometres of Leningrad. Even Paasikivi, the Finnish negotiator, called it ''too good a peace''. In 1919 Mannerheim had told the London Times that Finland''s historic mission was ''to drive Bolshevism from Petrograd'', and Moscow did not forget the remark.

Trust did not sprout in the 1930s. A Soviet-Finnish non-aggression pact was signed in 1932, but Finland put its weight behind Scandinavian neutrality, sought secret military cooperation with Sweden, and practised clandestine joint operations with Estonia to seal off the Gulf of Finland. Across the isthmus, a line of fortifications begun in the 1920s and resumed in 1932, later called the Mannerheim Line, was still unfinished in November 1939.

The Soviet fear was larger and more material. Leningrad, the Soviet Union''s second city and the heart of its arms industry, lay a day''s march from the border. Stalin regarded the scenario of Germany, or Britain and France with German consent, using Finland as a springboard to strike Leningrad as a real threat. This was not mere paranoia. German troops had actually intervened in the Finnish Civil War in 1918, and in the late 1930s Finnish military intelligence maintained contacts with Germany, Britain, and France alike. In 1937 President Svinhufvud said in Berlin that ''the enemy of Russia must always be the friend of Finland''.

But the instrument through which this fear had to act was already broken. The Great Purge of 1937-38 had decapitated the Red Army officer corps: two-thirds of brigade, division, and corps commanders were executed or imprisoned, and some 11,000 officers in total were purged. At the same time the Red Army expanded from 1.5 million to 3.3 million men. It became normal for a captain to command a division and a colonel to command a corps. When Chief of Staff Shaposhnikov drafted a war plan against Finland in June 1939, he foresaw a difficult campaign lasting months. Stalin and Voroshilov mocked the plan and threw it out; the task passed to Meretskov, commander of the Leningrad Military District, who was told to reach Helsinki within three weeks.

In April 1938 an NKVD agent named Boris Yartsev visited Helsinki and warned Prime Minister Cajander that the Soviet Union did not trust Germany and considered war between the two countries possible. The Red Army would not wait passively behind the border but would ''advance to meet the enemy''. The Soviet Union suggested that Finland cede or lease islands in the Gulf of Finland to defend Leningrad. Finland, committed to neutrality, refused. The secret talks dragged on for more than a year without result.

On 23 August 1939, when Molotov and Ribbentrop signed their non-aggression pact in Moscow, its secret protocol assigned Finland to the Soviet sphere. The moment Europe''s diplomatic map was redrawn, the 32 kilometres of the Karelian Isthmus were no longer a question diplomacy would answer.

Finland’s 1918 civil war and German intervention are discussed in [Brest-Litovsk](/commulingo/events/brest-litovsk); the 1920 Treaty of Tartu in the [Baltic wars of independence](/commulingo/events/baltic-wars-of-independence).

## A Line on the Map, a Country on the Table

On the night of 23 August 1939, in Moscow, Molotov and Ribbentrop signed a document whose public articles promised non-aggression while a secret additional protocol carved Eastern Europe into spheres of influence. Article I listed Finland, Estonia, Latvia, and Lithuania, setting the northern boundary of Lithuania as the dividing line: Finland, along with Estonia and Latvia, fell to the Soviet Union. A month later, on 28 September, the German-Soviet Boundary and Friendship Treaty transferred Lithuania to the Soviet sphere as well, giving Stalin a completely free hand.

The Baltic states collapsed quickly. Estonia signed a mutual assistance pact on 28 September, Latvia on 5 October, Lithuania on 10 October, each accepting Soviet military bases on their soil. Finland, invited to Moscow last on 5 October, would prove harder. That Stalin sat at the negotiating table in person signalled the seriousness of the effort. He attended six of the seven meetings, and at the first session Paasikivi later recorded his surprise at Stalin''s unexpectedly cordial manner.

When the talks opened on 12 October, the Soviet side tabled five demands: a mutual assistance pact, the cession of islands at the mouth of the Gulf of Finland, transfer of the Finnish portion of the Rybachi Peninsula, a 30-year lease on the Hanko Peninsula for a naval and air base (with a garrison of 5,000), and moving the border on the Karelian Isthmus, just 32 kilometres from Leningrad, some 70 kilometres westward toward Viipuri. In exchange, the Soviet Union offered Repola and Porajärvi in East Karelia, an area roughly twice the size of what Finland was being asked to yield. Stalin put it plainly: "Since Leningrad cannot be moved, the border must be."

The Finns rejected the mutual assistance pact at once, and the Soviets did not press the point. The islands and the Rybachi Peninsula were negotiable. But Hanko was different. Placing foreign troops on the Finnish mainland meant the end of neutrality, and even Mannerheim judged that "ceding Hanko would fatally weaken Finland''s strategic position." The negotiations stretched across three rounds: 12–14 October, 23–24 October, and 3–9 November.

Helsinki was divided. Mannerheim, pessimistic about Finland''s prospects in a war, urged compromise; he told the government the army could hold out no more than two weeks. Foreign Minister Eljas Erkko, by contrast, read Stalin''s demands as a bluff, and through Helsingin Sanomat, the leading newspaper he owned, he shaped public opinion firmly against concessions. Prime Minister Aimo Cajander sided with Erkko. Paasikivi, joined in the later rounds by Finance Minister Väinö Tanner, searched for a middle way, but their instructions from Helsinki were rigid.

At the second round on 23–24 October, Stalin softened his terms: he reduced the territory demanded on the Isthmus, cut the Hanko garrison to 4,000, and shortened the lease from 30 years to the duration of the European war. But the concessions backfired. The Finns read them as evidence that more could be extracted. When Paasikivi floated offering the island of Jussarö and the Ino fort as a compromise, Helsinki said no.

On 31 October, Molotov took the demands public in a speech to the Supreme Soviet. "Our proposals are extremely modest and are confined to the minimum necessary to safeguard the security of the USSR." The public announcement narrowed the room for manoeuvre dramatically: any further reduction would cost the Soviets face. At the third round on 3–4 November, the Finns presented their final counteroffer: a small strip of territory near Terijoki and several Gulf islands, but no base at Hanko and no substantial border shift that included Koivisto.

On 9 November, when Paasikivi delivered the rejection, Tanner recorded that "the eyes of our opposite numbers opened wide." Stalin asked, "You won''t even offer Ino?" Molotov added, "Do you want to provoke a conflict?" There would be no further talks. On 13 November, the Finnish delegation left Moscow; no Soviet officials came to see them off. They still believed negotiations would resume. The Kremlin, reading intelligence that convinced Stalin the Finns had already struck a secret deal with Germany or Britain, had reached a different conclusion. Helsinki, for its part, believed the Soviets had never intended to negotiate in good faith. Between these two certainties, 105 days of war were approaching.

## Seven Fictional Shells, and "Bread" for Starving Neighbors

At 3:45 p.m. Moscow time on 26 November 1939, seven artillery shells burst near the Soviet border village of Mainila on the Karelian Isthmus. The Soviet Union immediately declared it a Finnish provocation, and Molotov handed a note of protest to Finnish ambassador Aarno Yrjö-Koskinen in Moscow. According to the note, four were dead (three privates and one NCO) and nine wounded. But the Finnish 4th Border Guard Company reported precisely the opposite: the shots had come from the Soviet side, and the shells had detonated roughly 800 meters inside Soviet territory. By Mannerheim''s prior order, Finnish artillery had already been withdrawn more than 20 kilometers from the border. Not a single Finnish battery could reach Mainila.

Finland immediately proposed a joint investigation. The Soviet Union refused. In the 1990s, Russian historian Pavel Aptekar analyzed declassified Soviet military documents and found that the personnel records of the 68th Rifle Regiment stationed at Mainila showed no change whatsoever from 25 to 29 November. The numbers were identical every day: 90 commanders, 16 political officers, 12 administrative staff, 8 technical, 7 medical, 2 veterinary, 269 NCOs, and 528 enlisted, making 3,041 men total. The operational summaries of the 70th Rifle Division and the 19th Rifle Corps for 26 November recorded "no changes." There were no casualties. The entry on the first page of the regiment''s war diary, reading "the regiment was subjected to provocative shelling by the Finnish military; 3 killed and 6 wounded," was written in a single hand, under the forged signatures of officers who were not actually in command at the time. Khrushchev later wrote in his memoirs that the operation had been organized by Grigory Kulik, the Red Army''s chief of artillery.

In truth, the war orders had already been issued. Combat Order No. 2 of the 19th Rifle Corps, dated 23 November, concluded with the line: "The day of the offensive will be indicated separately." Mainila was a pretext; the war had been decided days before.

On 28 November, the Soviet Union unilaterally renounced the 1932 non-aggression pact. On the 29th, Molotov gave a radio address declaring that "the Soviet Government has not had and does not have" any intention of annexing Finnish territory. He even floated the extraordinary proposal that Soviet Karelia could be unified with Finland into "a single and independent Finnish state" provided Finland adopted a friendly posture. The next morning, the Red Army crossed the border on all fronts, and bomber formations appeared over Helsinki.

Helsinki suffered three waves of air raids on 30 November. At 9:20 a.m., the first sirens wailed. The initial Soviet bombers dropped leaflets: "Finnish Comrades! We come to you not as conquerors, but as liberators of the Finnish people from the oppression of the capitalists and the landlords!" The second and third waves were different. Eight DB-3 bombers of the 3rd Squadron, 1st Mine-Torpedo Air Regiment of the Red Banner Baltic Fleet, having failed to locate the coastal defense ships they were assigned to sink, turned toward Helsinki''s harbor. Disoriented in thick cloud, the formation scattered and unloaded its bombs across the inner city. The Helsinki University of Technology was obliterated. The Kamppi bus station took a direct hit. An oil storage facility at Hietalahti burned for two days. By day''s end, 91 were dead and 240 wounded. War correspondent Martha Gellhorn, watching from the street, wrote to Ernest Hemingway that it was "like March in Barcelona."

As international condemnation poured in, Molotov claimed on Soviet radio that his planes were not bombing Finland at all, they were "dropping bread for the starving Finnish people." In reply, Finns dubbed the Soviet RRAB-3 rotary-dispersal cluster bomb the "Molotov bread basket" (Molotovin leipäkori), and soon christened the improvised firebombs they hurled at Soviet tanks "Molotov cocktails," "a drink to go with the food." Meanwhile, the 72-year-old Mannerheim, startled by the explosions at breakfast, strode into the Defense Ministry and announced, without asking, that he was assuming command. By nightfall, posters and radio broadcasts across the nation proclaimed that Mannerheim was now in charge of Finland''s defense. American journalist Herbert Elliston recorded: "I can vouch for the fact that no proclamation ever geared a nation into fighting mood more successfully than the proclamation making Mannerheim commander-in-chief."

## A Treaty with a Country That Did Not Exist: The Terijoki Government and the Soviet Lie to the World

On 1 December 1939, the day after the Red Army captured the border town of Terijoki, Radio Moscow broke the news: a ''true'' people''s government of Finland had been formed. Its prime minister was Otto Wille Kuusinen, a Comintern functionary who had been living in Soviet exile since the defeat of the Finnish Reds in the 1918 civil war. The official name was the Finnish Democratic Republic, but everyone simply called it the Terijoki Government.

The cabinet was threadbare. Apart from Kuusinen, its ministers were mostly Soviet citizens or Finnish communists who had fled to the Soviet Union after the civil war; barely anyone in Finland knew them. The ''minister of defence'', Akseli Anttila, was a Finnish-born Soviet officer, and the ''Finnish People''s Army'' formed under him, built around the 106th Mountain Rifle Division and eventually reaching some 22,500 men, was used not for combat but for occupation security and propaganda. On the very day Moscow proclaimed the Terijoki Government, Aimo Cajander''s cabinet in Helsinki fell and was replaced by a national unity government under Risto Ryti. Finnish society, facing invasion, was displaying the unity that would be called the Spirit of the Winter War.

On 2 December, Kuusinen flew to Moscow and signed a Treaty of Mutual Assistance and Friendship with Molotov. Its terms were nearly identical to those Helsinki had rejected in October: the Karelian Isthmus border to be moved westward, the Hanko peninsula to be leased for thirty years, and several islands in the Gulf of Finland to be handed over. The one difference was that the Soviet Union now promised to cede 70,000 square kilometres of eastern Karelia in return, a carrot that had never been offered to the real Finnish government. 

The treaty''s real purpose, however, lay elsewhere. On 4 December, as the League of Nations prepared to hear Finland''s appeal, Molotov cabled the Secretary-General: ''The Soviet Union is not in a state of war with Finland and does not threaten the people of Finland with war.'' The USSR was merely assisting the legitimate Kuusinen government in its struggle against the ''fascist clique'' of Mannerheim and Tanner. The Terijoki Government was the diplomatic coat thrown over the invasion.

The League tore the coat off. On 11 December a special committee was formed to hear the Finnish appeal; on 14 December the Assembly and the Council, acting under Article 16, paragraph 4 of the Covenant, unanimously condemned the Soviet Union as an aggressor and declared that it had ''placed itself outside the League of Nations.'' It was the only expulsion of a major power in the League''s history. The Soviet Union had joined the League barely five years earlier, in 1934. But the timing was desperate: the League was already hollowed out by the withdrawals of Japan, Germany, and Italy, and it possessed neither the power nor the will to do more than issue a recommendation. Finland would have to fight alone.

The Terijoki Government had one more function: blocking the road to peace. Throughout December, informal feelers were put out through Swedish channels, but Molotov''s reply was always the same: the Soviet Union was already negotiating with Finland''s legitimate government and would not deal with Ryti''s administration in Helsinki. By installing Kuusinen, the Soviet Union had diplomatically sealed its own exit. Only after months of a failing war, at the end of January 1940, did Molotov finally inform Alexandra Kollontai in Stockholm that the USSR now recognized the Ryti-Tanner government as legitimate. Real peace talks could begin. Kuusinen''s government was quietly discarded.

## Firewood on the Road: The Destruction of Two Divisions from Suomussalmi to Raate, and the Command''s Counterblow

On 7 December 1939 the Soviet 163rd Rifle Division captured the village of Suomussalmi. Its objective was to push west to Oulu and cut Finland in half. But there the division stopped. There was only one road, and on 20 December, divisional commander Andrei Zelentsov asked permission to retreat; 9th Army headquarters refused. Instead, the 44th Motorized Rifle Division was sent in along the Raate road to relieve it.

Colonel Hjalmar Siilasvuo''s Finnish 9th Division decided to destroy the two divisions one at a time. On 11 December the Finns cut the Raate road, severing the 163rd''s southern supply line. On the 27th, reinforced by fresh regiments, Siilasvuo''s forces took Palovaara, isolating the 662nd Regiment from its parent division. On the morning of 28 December, Kaarle Kari attacked from the northwest, and Soviet resistance suddenly collapsed. Survivors fled onto the ice of Lake Kiantajärvi. The 163rd Division simply ceased to exist.

Now it was the 44th Division''s turn. Its commander Alexei Vinogradov, who had not made a serious attempt to rescue the 163rd while it was being destroyed within earshot, ordered his men to dig in along the Raate road. From 1 to 7 January, the Finns carved the 44th, strung out over 30 kilometres of road, into separate mottis. Finnish snipers targeted field kitchens and campfires; in minus-40-degree cold, hungry Soviet soldiers froze to death or surrendered. Vinogradov ordered a retreat only at 9:30 p.m. on 6 January. Most of his men never reached the border. Of the division''s 13,962 troops, the Stavka commission officially counted 4,674 casualties.

Vinogradov, his chief of staff Volkov, and political commissar Pahomov abandoned their men and fled. Reaching Soviet lines four days later, they were court-martialled on the spot, sentenced to death, and shot before the assembled troops. The Finns captured 43 tanks, 70 field guns, 278 trucks, 6,000 rifles, and vast stores of ammunition, equipment the Finnish army desperately needed. That the Soviets had been so confident of victory they brought a military band for a parade became an enduring symbol of the disaster.

The cascade of defeats destroyed Stalin''s faith in Voroshilov. At the end of December all frontal assaults were suspended. On 7 January 1940, Semyon Timoshenko was appointed overall commander of the Finnish theatre. The plan Boris Shaposhnikov had originally proposed and Stalin had dismissed, concentrate everything on the Karelian Isthmus for a single frontal breakthrough, was retrieved from the drawer. Timoshenko reorganized his 600,000 troops into two armies (the 7th and the 13th), held seven divisions in reserve, and abandoned the northern flanking movements. The strategy shifted from deep battle through forest and lake to one of attrition: grind the fortifications down with artillery and mass.

Timoshenko summarized his approach with characteristic bluntness: ''In frontal attack no enemy nor combination of enemies can compare with us. By making a succession of direct attacks we shall compel him to lose blood.'' But the actual plan was not reckless human-wave assault. Artillery chief Nikolai Voronov concentrated his guns on the isthmus; the 123rd Rifle Division rehearsed its assault on life-size mock-ups of Mannerheim Line bunkers. Tanks advanced in small groups with infantry rather than in long road-bound columns. On 1 February the Red Army opened its offensive with 300,000 shells in the first 24 hours. On 11 February the Mannerheim Line was pierced at Summa.

## ''Let This Hand Wither'': A Treaty Written in Blood, and the Reckoning of April

On 5 March 1940, the Red Army crossed the Mannerheim Line and entered the suburbs of Viipuri (Vyborg); Finnish forces were running out of ammunition. Mannerheim told his government they could hold no longer. Finland proposed an armistice on 6 March, but the Soviets refused: their military position was strengthening by the hour. When the Finnish delegation arrived in Moscow on 7 March, Stalin did not appear at the negotiating table. He did not wish to be the public face of a humiliating war.

The terms Molotov laid down were far harsher than the pre-war demands. Finland was to cede the entire Karelian Isthmus with Viipuri, the western and northern shores of Lake Ladoga, the Salla region, parts of the Rybachy and Sredny peninsulas, islands in the Gulf of Finland, and a 30-year lease on the Hanko peninsula: roughly 9% of its territory and 13% of its industrial assets. The territorial exchange the Soviets had offered before the war, a larger slice of eastern Karelia, was nowhere to be found. The defeated side was paying, and the victor was taking more.

The Finnish delegation, led by Prime Minister Risto Ryti and Paasikivi, signed the treaty on the evening of 12 March. President Kyösti Kallio, consenting to the signature, uttered the famous words: "Let the hand wither that signs this monstrous treaty!" and that summer, his right arm was indeed paralysed. More than 420,000 Karelians, 12% of Finland''s population, fled their homes and were evacuated behind the new border. The guns fell silent at noon Leningrad time on 13 March.

Inside the Soviet military, the recriminations began as soon as the shooting stopped. In April 1940, the Central Committee convened to take stock of the war''s lessons, and commanders traded blame before Stalin. Voroshilov protested that "everything had gone differently from what was expected," but after fifteen years as defence commissar, years in which he had overseen the Great Purge of the officer corps while neglecting training, equipment, and tactics, the responsibility could not be shifted. On 8 May, he was removed and Semyon Timoshenko took his place.

The conference ordered concrete reforms. The authority of frontline political commissars was curtailed, restoring unitary command to military officers. Tsarist-era ranks and strict disciplinary codes were reintroduced. Clothing, equipment, and tactics for winter operations were overhauled, and the structure and training of mechanized units were reviewed. But only fourteen months remained: when Barbarossa began, the reforms were still incomplete.

One episode at the conference revealed the deeper political stakes. Ivan Proskurov, the chief of GRU, Soviet military intelligence, openly challenged Stalin''s attempt to pin the disaster on poor intelligence. Proskurov insisted that his reports had accurately conveyed Finnish defensive preparations and the difficulties of the terrain, but the political leadership had ignored them. He was dismissed in July and executed the following year. The argument over the lessons of the Winter War was never only about military reform; it was also a political struggle over who was permitted to speak the truth, and who was required to stay silent.

## Fifteen Months into Oblivion: Why Finland Stood Beside Nazi Germany

On 13 March 1940, the day the Moscow Peace Treaty was signed, Finns lowered their flags to half-mast. The loss of nine per cent of the country''s territory, a fifth of its industrial capacity, and its second city, Viipuri, settled over the nation like a pall. But the war was not over. The state of war was never revoked, censorship remained, and military spending soared to 45 per cent of the state budget in 1941. The 420,000 evacuees from the ceded lands waited only for the day they could go home. It was no coincidence that Finns called these fifteen months the ''Interim Peace'' (Välirauha).

Soviet pressure began the very day after the treaty. On 14 June 1940, Soviet fighters shot down the Finnish passenger plane Kaleva en route from Tallinn to Helsinki, killing all nine aboard. That same month, Molotov demanded that Finland hand over the Petsamo nickel mining concession to the Soviet Union or create a joint Soviet-Finnish company to operate it. In July, Moscow demanded transit rights for Soviet troops to the Hanko base; in August, it demanded the Åland Islands be disarmed. The Soviet ambassador in Helsinki, Ivan Zotov, reached into the composition of the Finnish cabinet itself, demanding the resignation of Foreign Minister Väinö Tanner as an anti-Soviet figure; Tanner stepped down on 15 August. To a leadership that had just watched the Baltic states be annexed into the USSR, this was far more than diplomatic pressure. Paasikivi wrote to the foreign minister on 22 July 1940: ''The fate of the Baltic countries and the way Estonia, Latvia and Lithuania were transformed into Soviet states and subordinated to the Soviet empire makes me think about this grave matter night after night.''

Finland''s turn toward Germany was born of this desperation. On 18 August 1940, Joseph Veltjens, Hermann Göring''s emissary, arrived in Helsinki to meet Ryti and Mannerheim. Germany demanded troop transit rights to northern Norway; in exchange, it lifted the arms embargo. The first German transport ships docked at Vaasa on 22 September. When Molotov visited Berlin that November and said the ''Finnish question'' would be settled the same way as Bessarabia (meaning annexation), Hitler, who had approved Operation Barbarossa on 18 December, said no. By then, Mannerheim''s personal envoy, Major General Paavo Talvela, was already meeting Halder and Göring in Berlin and being briefed on the coming war.

From 25 to 28 May 1941, Finnish general staff officers met their German counterparts in Salzburg and Berlin to coordinate operations. Led by General Erik Heinrichs, the Finnish side agreed on a mobilisation date of 15 June, a division of operational zones, and the attachment of the German 163rd Infantry Division to Finnish command. Most of the Finnish parliament and cabinet knew nothing until 9 June. The decision for war was made by an inner circle: Ryti, Mannerheim, and Prime Minister Jukka Rangell, alone.

When Barbarossa began on 22 June, Finland declared itself neutral, but German forces were already operating from Finnish soil. On 25 June, the Soviet air force bombed eighteen Finnish airfields, and Rangell told parliament that Finland was at war. The government named the conflict Jatkosota: the Continuation War. The name was a political choice. If the Winter War had been a defensive war begun by Soviet aggression, the Continuation War was its sequel, a narrative that cast Finland not as Hitler''s ally but as a nation finishing its own interrupted fight. Indeed, on 10 July 1941, Mannerheim issued his famous Sword Scabbard Order of the Day, reviving a declaration he had first made during the civil war of 1918: ''I shall not sheathe my sword before Finland and East Karelia are free.'' The statement openly proclaimed a war aim beyond the recovery of lost territory: the annexation of Soviet East Karelia.

After the war, Finnish historiography developed the ''separate war thesis'' (erillissotateesi): Finland had not been Germany''s ally but a co-belligerent fighting its own distinct war. Finland never signed the Tripartite Pact, and it pointedly called the Germans ''brothers-in-arms,'' never allies. Yet in a 2008 survey of twenty-eight Finnish historians by Helsingin Sanomat, sixteen answered that Finland had been an ally of Nazi Germany; six said it had not; and six took no position. The 1947 Paris Peace Treaty was unambiguous: Finland had been ''an ally of Hitlerite Germany.'' Lauri Hannikainen''s 2020 analysis in international law is blunter still: the moment Finnish forces crossed the 1939 border to occupy and attempt to annex East Karelia, the Continuation War became a war of aggression in violation of the Kellogg-Briand Pact. And yet, as most historians also acknowledge, in the Soviet encirclement of the summer of 1940, Finland genuinely had no realistic alternative to Germany.

## The Questions That Remain: Debates the Winter War Has Left Open for Over Eighty Years

The Winter War ended in March 1940, but the arguments over its meaning are still unfolding in 2025. Three questions have divided historians the longest.

First: did Stalin intend to swallow all of Finland? Most historians say yes. The Terijoki puppet government, the Suite on Finnish Themes that Zhdanov commissioned from Shostakovich for the Red Army''s victory parade through Helsinki, and operational plans demanding total Finnish capitulation by Stalin''s sixtieth birthday on 21 December all point to something beyond a border adjustment. Russian historian Yuri Kilin argued that Stalin expected no deal from the negotiations and that the territorial-exchange offer was a stalling tactic masking the plan for regime change. On the other side, William Trotter counters with what he calls the strongest argument against full-conquest intent: "it did not happen in either 1939 or during the Continuation War in 1944 even though Stalin could have done so with comparative ease." Stephen Kotkin points to the difference in treatment between Finland and the Baltic states: the Soviets forced mutual-assistance pacts on Estonia, Latvia and Lithuania that led to annexation, but from Finland they demanded only limited territorial concessions and even offered land in return, conduct inconsistent with a full-annexation scenario. In 2002, Russian historian A. Chubaryan stated that not a single document supporting a plan to annex Finland had been found in Russian archives. Kotkin adds that because Stalin''s ultimate aims were never spelled out in internal documents, historians are left to deduce them from his words at the negotiating table and from his actions.

Second: how many died? Molotov reported 48,745 Soviet dead to the Supreme Soviet in March 1940, and that figure stood as the official number almost until the Soviet Union collapsed. In 1989, on the wave of perestroika, Mikhail Semiryaga published a different figure, 53,522, in the weekly Ogoniok. Grigori Krivosheyev''s 1993 declassified study put irretrievable losses at 126,875 and total casualties at 391,783. Yuri Kilin''s estimates climbed from 63,990 in 1991 to 138,533 in 2012. In 2013, Pavel Petrov reported that the Russian State Military Archive held a database confirming 167,976 dead and missing with names, dates of birth and ranks. From 48,000 in Stalin''s era to 168,000 in Putin''s, the sheer range for a single war reveals the political nature of record-keeping itself.

Third: could Finland have avoided the war by yielding? The Baltic comparison sharpens this question. Estonia, Latvia and Lithuania accepted Soviet base demands in the autumn of 1939 and were annexed and Sovietized a year later. Finnish historian Timo Vihavainen counters the counterfactual: Stalin trusted no treaty, only the Red Army; neutrality, when it ran counter to Soviet interests, was treated as hostile. Marshal Ivan Konev recalled Stalin remarking at the start of the war: "The population of Finland is smaller than that of Leningrad, they can be resettled."

These debates have never been purely academic. In Finland, the "separate war" thesis dominated official memory for decades, and President Urho Kekkonen caused an uproar in 1973 by calling the Winter War "unnecessary." The fiftieth anniversary in 1989, the release of the film Talvisota, and the opening of the Moscow archives in the early 1990s reshaped the Finnish memory landscape. Finns could finally honour openly the soldiers of the three wars of 1939-1944; in the 2004 television programme Great Finns, Mannerheim placed first and wartime prime minister Risto Ryti second. On the Soviet side, Boris Yeltsin''s 1994 denunciation of the Winter War as a war of aggression marked a significant reversal.

What the Winter War settled is itself incomplete. Leningrad''s security, the stated Soviet goal, was achieved on paper, but in June 1941 German forces reached Leningrad through the Baltic states in a matter of weeks. Red Army reforms were begun, but only fourteen months remained before Barbarossa, and much of the overhaul was unfinished. Finland kept its independence, but the lost territories drove the choice of 1941, and that choice led to the defeat of 1944 and the reaffirmation of those losses. The 105-day winter permitted no textbook finality.

## A War Without Winners: Eighty Years of Verdicts

Who won the Winter War? On the surface, the Soviet Union did. The Moscow Peace Treaty took 11 per cent of Finland''s territory, more than the pre-war demands had asked for. But the price was staggering. Nikita Khrushchev wrote in his memoirs: "A victory at such a cost was actually a moral defeat. All of us, and Stalin first and foremost, sensed in our victory a defeat by the Finns."

Finland lost land but kept its nation. Unlike the Baltic states, which were fully annexed by the Soviet Union in the summer of 1940, Finland preserved its independence and its democratic system. It became the only European combatant of the Second World War, outside the Soviet Union and the United Kingdom, to escape military occupation. The cost carried forward: 420,000 evacuees left their homes; Viipuri, Finland''s second city, became a Soviet border town; the Continuation War of 1941, the Lapland War of 1944, and 300 million dollars in war reparations followed.

The casualty figures became a symbol of the struggle for truth about the war. In March 1940 Molotov reported 48,745 Soviet dead. That number stood as the official record until the Soviet Union''s final years. The first crack came in 1989, when the historian Mikhail Semiryaga published a figure of 53,522 in the weekly Ogoniok. A research team led by Grigori Krivosheyev reported 126,875 irretrievable losses in 1993. Yuri Kilin, after a project re-examining the records from 2006 to 2009, arrived at 138,533 dead in 2012. In 2013 Pavel Petrov stated that the Russian State Military Archive database confirmed 167,976 names. Even the number of the dead has not been settled.

The deeper debate is whether the war was necessary at all. The Soviet logic was straightforward: thirty-two kilometres from the border to Leningrad was untenable for defence, and in a Europe sliding toward war the risk could not be ignored. In 2013 Vladimir Putin told military historians that the Winter War had been launched to "correct mistakes" in the border drawn after 1917. The opposing view points to the Terijoki puppet government and the secret protocol of the Molotov-Ribbentrop Pact as evidence that the Soviet aim was not border adjustment but regime change and full occupation. Historians such as Stephen Kotkin counter that the Soviet Union treated Finland differently from the Baltic states: it offered a territorial exchange, and Stalin personally attended seven negotiating sessions, behaviour inconsistent with a plan for wholesale annexation. Neither side of this argument has been conclusively proved from the archives.

The verdict on the war has shifted with the era. Under Stalin it was "a border conflict started by Finnish reactionaries." Under Brezhnev it became "a provocation orchestrated by the United States and the West." In 1994 Boris Yeltsin, visiting Helsinki, called it "Stalin''s war of aggression," the first apology from Moscow. The Putin era restored the frame of a necessary war while simultaneously calling it "an example of why nothing similar should ever be allowed to happen again." The Winter War has served as a mirror for whatever political reflection each generation required.

The irony sits in the final ledger. The Soviet Union applied the lessons it learned, proper winter equipment, restored commander autonomy, and the massed use of artillery and armour, against Operation Barbarossa in 1941. The reforms were incomplete when Germany attacked, but without the Winter War the Red Army''s learning curve would have been shallower still. On the Finnish side, the "spirit of the Winter War" became the core of national identity, and it was that cohesion that again held off a Soviet invasion in 1944. This is what a war without winners looks like: both sides got something they needed, and both paid more than they gained. The questions left by those 105 days of gunfire still refuse a single answer.
',
  updated_at=NOW() WHERE id='winter-war';
UPDATE commulingo_history_events SET
  body_ko='## 1987년 이전, 세 나라가 안고 있던 것들

에스토니아·라트비아·리투아니아는 1940년 소련에 강제 병합된 뒤 반세기 가까이 독립국가의 기억을 지워내는 압력 속에 살았다. 1941년 6월과 1949년 3월, 두 차례의 대규모 강제이주로 수십만 명이 시베리아와 중앙아시아로 끌려갔고, 전쟁과 탄압을 피해 서방으로 탈출한 인구까지 합치면 에스토니아는 전 인구의 약 5분의 1을 잃었다. 1940년대 후반부터 1950년대 초까지 이어진 무장 저항, 이른바 숲의 형제들이 진압된 뒤에는 공개적인 반대는 사라졌지만, 저항의 불씨는 결코 꺼지지 않았다. 리투아니아에서는 1972년부터 지하 출판물 『리투아니아 가톨릭 교회 연대기』가 발행되어 탄압의 실상을 기록했고, 1979년 8월 23일에는 세 나라의 양심수 45명이 독소불가침조약 비밀의정서의 공개와 발트 3국의 독립 회복을 요구하는 「발트 호소문」을 유엔에 보냈다. 이 호소문은 서방 언론을 통해 보도되었고, 서명자들은 체포와 구금으로 대가를 치렀다.

인구 구성의 변화는 또 다른 압력이었다. 모스크바는 발트 지역을 소련의 산업화 체계에 편입시키면서 러시아인 노동자를 대거 이주시켰다. 그 결과 에스토니아인의 비율은 전쟁 직전 88퍼센트에서 1989년 61.5퍼센트까지 떨어졌고, 라트비아인 비율은 75퍼센트에서 52퍼센트로 하락했다. 비교적 러시아인 유입이 적었던 리투아니아조차 4퍼센트포인트 감소를 겪었다. 주택, 행정직, 당 간부 자리는 이주민에게 우선 배정되었고, 1970년대 후반부터는 교육 체계에서도 러시아어 사용이 강제되었다. 발트인들은 자기 땅에서 소수자가 되어간다는 위기감을 일상에서 체감했다.

그러나 발트 3국은 다른 소련 공화국들과 뚜렷이 구별되는 조건도 갖고 있었다. 첫째, 서방 세계는 병합 자체를 승인하지 않았다. 미국을 비롯한 다수의 국가들은 발트 3국의 외교 공관을 계속 인정했고, 워싱턴과 런던 등지에 남은 대사관들은 독립국가의 법적 연속성을 유지했다. 이는 나중에 독립 회복의 핵심 논리, 「병합 무효」로 작동한다. 둘째, 서방 라디오 방송(미국의 소리, BBC, 자유유럽방송)을 청취할 수 있는 지리적 위치 덕분에 소련 내부의 검열이 상대적으로 덜 통했다. 핀란드 텔레비전을 시청할 수 있었던 에스토니아 북부 지역은 소련의 공식 담론과 바깥 현실 사이의 간극을 눈으로 확인할 수 있었다. 셋째, 에스토니아와 라트비아는 루터교 전통 아래, 리투아니아는 가톨릭 전통 아래 교회가 민족 정체성의 저장고 역할을 했고, 에스토니아의 합창 축제와 라트비아의 가무 축제 같은 대중문화 전통은 집단적 자기표현의 통로로 남아 있었다.

1985년 미하일 고르바초프가 소련 공산당 서기장에 오르면서 시작된 글라스노스트(개방)와 페레스트로이카(개혁)는 이 축적된 압력이 분출할 틈을 열었다. 고르바초프는 경제난을 타개하기 위해 아래로부터의 비판을 제한적으로 허용했지만, 이 비판이 비러시아계 공화국들에서 어떤 방향으로 흐를지는 통제하지 못했다. 발트 3국에서 「개방」의 첫 시험 무대가 된 것은 환경 문제였다. 1987년 2월 25일, 에스토니아 텔레비전은 모스크바가 비루마 지역에 거대 인광석 광산을 열 계획이라고 보도했다. 이 광산은 에스토니아 하천의 40퍼센트가 발원하는 판디베레 지역의 수질을 오염시키고, 수만 명의 외지 노동자를 유입시켜 이미 위태로운 인구 균형을 결정적으로 무너뜨릴 위험이 있었다. 에스토니아 과학아카데미의 엔델 리프마가 이끄는 과학자들은 이미 몇 년째 내부에서 반대해왔지만, 계획은 비밀리에 추진되고 있었다.

텔레비전 보도가 나간 지 두 달 만에 타르투 대학교 학생들이 대학 강당에서 집회를 열었고, 곧이어 노란 티셔츠에 「인광석은 사양합니다」라고 적은 학생들의 시위가 타르투 거리를 메웠다. 1987년 5월 1일 노동절 퍼레이드에서는 학생들이 인광석 반대 구호를 들고 행진했고, 이 운동은 몇 달 만에 에스토니아 전역의 대중적 저항으로 확산되었다. 당과 행정부 내부에서도 개혁파가 운동을 지지했다. 1987년 9월, 모스크바는 결국 광산 계획을 철회했다. 소련 체제에 대한 집단적 공개 저항이 단지 허용되었을 뿐 아니라 승리할 수 있다는 사실이 입증된 것이다.

바로 이 인광석 전쟁이 두려움의 문화를 깨뜨렸다. 사람들은 글라스노스트가 단지 말로만 존재하는 것이 아니며, 조직된 시민 행동이 실제 결과를 만들어낼 수 있다는 것을 보았다. 공개적으로 금기시되어 온 주제들, 즉 민족의 장래, 이주민 문제, 모스크바의 의사 결정 과정이 신문과 공개 토론의 장에 모습을 드러내기 시작했다. 승리의 맛을 본 에스토니아 시민사회는 다음 행보를 준비하고 있었다. 곧 있을 8월 23일, 독소불가침조약 48주년에 이보다 더 근본적인 문제를 정면으로 제기할 결심을 말이다.

1918년 독립 선언 뒤의 전쟁과 1920년 강화·제헌의회의 배경은 [발트 독립전쟁](/commulingo/events/baltic-wars-of-independence)에서 다룬다.

## 두려움이 무너진 날: 1987년 8월 23일 히르베파르크

1987년 8월 23일 탈린 히르베파르크에 모인 군중은 약 7천 명. 노래 혁명의 3년을 통틀어도 손에 꼽히는 규모는 아니었지만, 이 집회가 가진 무게는 숫자가 아니었다. 에스토니아에서 시민이 자발적으로 조직한 공개 정치 집회는 소련 점령 이래 처음이었고, 주제는 당국이 ''존재하지 않는 문서''라고 부정해 온 독소불가침조약 비밀의정서였다. 이날을 기점으로 에스토니아 사회는 두려움의 마지막 문턱을 넘었다.

집회를 소집한 것은 8월 15일 결성된 MRP-AEG(몰로토프-리벤트로프 조약 공개를 위한 에스토니아 그룹)였다. 전직 정치수들이 주축이었다. 1980년 ''40인의 편지''로 6년을 복역한 티이트 마디손, 1983년부터 4년간 수감된 라글레 파레크, 같은 시기 투옥되었던 헤이키 아호넨, 위리 미크, 마티 키렌드 등이 창립 멤버였다. 이들은 탈린 시 집행위원회에 정식으로 집회 허가를 신청했다. 라에코야 광장(시청 광장)은 거부되었지만, 뜻밖에도 히르베파르크 사용은 승인되었다. 8월 18일 미국 상원의원들이 고르바초프에게 보낸 서한(발트 3국의 집회에 간섭하지 말고 비밀의정서를 공개하라는 내용)이 영향을 미쳤을 가능성이 크다.

집회 당일, 사람들은 먼저 라에코야 광장에 모였다. 당국이 광장 사용을 막자 군중은 ''비밀의정서를 공개하라'' ''발트 국가들의 자결권을'' ''스탈린의 집행자들을 법정에 세워라'' ''엔 타르토와 마르트 니클루스를 석방하라''는 구호를 외치며 하르유 거리를 따라 히르베파르크로 이동했다. 낫과 망치를 하켄크로이츠와 동격으로 그린 플래카드가 등장했고, 야외 카페에 앉은 시민들은 이 ''인간의 강''을 넋을 잃고 바라보았다.

주요 연설자 티이트 마디손은 모임의 핵심을 이렇게 압축했다: 1939년 8월 23일 독소 불가침조약과 그 비밀 추가의정서가 동유럽을 분할했고, 1940년 에스토니아의 병합은 그 직접적 결과라는 사실. 그의 연설은 나안 같은 체제 역사학자가 1950년대에 수행한 역사 왜곡을 정면으로 겨냥했다. 에리크 우담은 독일과 소련 양쪽이 조약의 결과에 책임을 지라고 요구했다. 라글레 파레크는 스탈린 테러 희생자 기념비 건립을 위한 서명을 현장에서 받기 시작했고, 62명이 즉석에서 이름을 올렸다. 위리 미크는 "우리는 우리 땅에서 소수 민족이 되어가고 있다"며 에스토니아인의 생존 자체가 걸린 문제임을 환기했다. 메를레 얘게르와 라이보 라아베가 시를 낭송했고, 군중은 ''우리의 조국은 나의 사랑''과 ''자유로워라, 에스토니아의 바다여''를 불렀다.

집회는 평화롭게 끝났지만, 체제의 반응은 즉각적이고 폭력적이었다. 관영 언론은 참가자들을 ''도둑, 사기꾼, 도발자''로 규정하는 인신공격성 기사를 쏟아냈다. 노르테 핼(당시 에스토니아 청년신문)의 편집장은 히르베파르크가 정상적인 글라스노스트의 발현일 뿐이라고 쓴 한 고등학생의 투고를 실었다는 이유로 에스토니아 공산당 중앙위원회 선전선동부에 소환되어 심한 질책을 받았고, 곧이어 집회를 규탄하는 ''독자 편지''들을 반강제로 실어야 했다. 위리 미크는 언론의 비방에 항의해 9월 1일부터 두 달간 단식 투쟁에 들어갔다. 티이트 마디손은 KGB에 의해 강제 추방되어 가족과 함께 스웨덴으로 떠나야 했다. 1988년 초에는 헤이키 아호넨과 그의 어머니도 추방되었다.

그러나 공포의 주문은 이미 깨졌다. 당시 14세 소년으로 히르베파르크에 갔던 언론인 토마스 실담은 수십 년 뒤 ERR과의 인터뷰에서 이렇게 회고했다: "탈린 경찰 연대의 트럭들, 방패와 곤봉을 든 병력들. 나는 생각했다, 이제 무슨 일이 벌어질까? 그런데 집회가 평화롭게 끝나고 경찰 트럭들이 그냥 떠나갔을 때, 나는 깨달았다. 근본적으로 무엇인가 바뀌었다." 폭력은 없었다. 수천 명이 자발적으로 모여 금기였던 주제를 말하고, 국가를 부르고, 체제가 부정한 문서의 존재를 외쳤는데도 진압은 일어나지 않았다는 사실, 바로 그것이 히르베파르크가 에스토니아 독립운동에 남긴 구조적 유산이었다.

## 1988년, 대중이 거리로 나오다

1988년은 발트 3국에서 두려움이 조직으로, 조직이 대중으로 바뀐 해였다. 4월 1-2일 탈린에서 열린 에스토니아 창작동맹(작가·미술가·건축가·영화인·연극인) 합동 총회는 분수령이었다. 러시아 태생의 카를 바이노 공산당 제1서기의 지도력을 공개적으로 비판하고, 러시아화 정책과 환경 파괴를 규탄했으며, 에스토니아어의 지위 회복을 요구했다. 이 자리에서 예술가 하인츠 발크는 "우리는 살해당할 수 있을지언정 결코 억압될 수 없다"고 선언했다. 지식인들이 먼저 공포의 벽을 허문 것이다.

2주 뒤인 4월 13일, 국가계획위원회 간부였던 에드가르 사비사르가 에스토니아 TV 생방송 「좀 더 생각합시다(Mõtleme veel)」에서 "페레스트로이카를 지지하는 인민전선" 구상을 제안했다. 이는 고르바초프의 개혁 담론을 빌려 합법적 대중운동을 만들겠다는 전략이었다. 사비사르와 사회학자 마리우 라우리스틴이 주축이 된 라흐바린네(에스토니아 인민전선)는 여름 내내 전국적인 지지 기반을 쌓았다. 5월 타르투 대중음악 축제에서 알로 마티센이 작곡한 「다섯 개의 조국 노래」가 첫선을 보였고, 이보 린나의 목소리로 불린 이 노래들은 독립운동의 감정적 동력이 되었다. 6월 10-11일 탈린 노래축제 광장에서 열린 구시가지 축제 이후 군중이 자발적으로 남아 밤새 애국가를 부른 사건 직후, 발크는 신문에 「노래 혁명」이라는 이름을 붙였다.

모스크바도 변화를 감지하고 움직였다. 6월 16일 바이노가 해임되고 에스토니아계인 바이노 밸랴스가 공산당 제1서기로 임명되었다. 밸랴스는 인민전선과 대화를 시작했고, 당과 대중운동의 공존 가능성이 열렸다. 그러나 반대세력도 결집했다. 7월 19일 러시아계 노동자와 보수적 공산당원들이 주축이 된 인테르무브먼트(인테르프론트)가 결성되어, 인민전선을 "민족주의"라고 공격하며 소련 체제 수호를 내세웠다.

리투아니아에서는 6월 3일 빌뉴스 과학아카데미에서 35명의 지식인(17명이 당원)이 사유디스 발기 그룹을 결성했다. 음악학자 비타우타스 란츠베르기스가 비당원으로 참여하여 곧 대변인 역할을 맡았다. 사유디스의 첫 대중집회는 6월 24일 게디미나스 광장에서 열렸고, 7월 9일 빙기스 공원 집회에는 10만 명이 운집했다. 8월 23일 독소불가침조약 49주년 빙기스 공원 집회에는 25만 명이 참여하여 비밀의정서 공개를 요구했다. 당시 산업 담당 당서기였던 알기르다스 브라자우스카스가 집회에 참석한 것은 당과 운동의 거리가 좁혀지고 있음을 보여주었다.

라트비아에서는 6월 1-2일 작가동맹 총회에서 처음으로 자치와 민주화 요구가 공개적으로 제기되었다. 다우가바 강 댐 건설 반대 운동을 이끌었던 언론인 다이니스 이반스가 두각을 나타냈다. 라트비아 인민전선(LTF)은 10월 8-9일 리가에서 창립대회를 열었고 이반스가 의장으로 선출되었다. LTF는 발트 3국의 인민전선 중 가장 먼저 소수민족에게 손을 내밀어, 라트비아어와 러시아어 외의 언어로도 교육을 받을 권리를 지지함으로써 비러시아계 소수민족의 지지를 얻고자 했다. 창립 당시 회원은 10만 명을 넘었고, 곧 25만 명으로 성장했다.

가을은 제도적 도약의 계절이었다. 9월 11일 탈린 노래축제 광장에서 열린 「에스토니아의 노래(Eestimaa Laul)」에는 약 30만 명, 당시 에스토니아 인구의 5분의 1이 모였다. 트리비미 벨리스테 에스토니아 문화유산협회장은 이 자리에서 처음으로 독립 회복을 공개적으로 요구했다. 10월 1-2일 라흐바린네는 탈린 린나홀에서 3,071명의 대의원이 참석한 공식 창립대회를 열었다. 대의원의 22%가 당원이었고, 사유재산의 헌법적 보장과 스탈린주의 범죄자 처벌을 요구하는 급진적 강령을 채택했다. 10월 22-23일 사유디스도 빌뉴스에서 창립대회를 열어 란츠베르기스를 평의회 의장으로 선출했다.

11월 16일, 에스토니아 최고회의는 「에스토니아 소비에트 사회주의 공화국의 주권에 관한 선언」을 채택했다. 이 선언은 에스토니아 법률이 소비에트 연방 법률보다 우선한다고 명시하고, 에스토니아 영토 내 천연자원과 생산수단에 대한 관할권을 주장했다. 법적 표현은 연방 내 주권이라는 신중한 것이었으나, 그 실질은 모스크바의 권위에 대한 정면 도전이었다. 의장 아르놀드 뤼텔이 서명한 이 선언은 모스크바에서 소련 헌법 개정으로 공화국의 권한을 축소하려던 고르바초프의 시도를 무력화시켰다. 한 해가 시작될 때만 해도 불가능해 보였던 일이 12개월 만에 현실이 되었다.

## 200만 명의 사슬, 600킬로미터: 1989년 8월 23일

1989년 8월 23일은 수요일이었다. 오후 7시, 세 나라의 라디오가 동시에 세 언어로 된 노래 「발트가 깨어난다(Bunda jau Baltija)」를 내보냈다. 신호였다. 탈린의 톰페아 언덕 기슭에서 빌뉴스의 게디미나스 탑 기슭까지, 675킬로미터의 도로 위에서 약 200만 명이 손을 잡았다. 에스토니아·라트비아·리투아니아 3국 인구 800만 명 중 4분의 1이 한꺼번에 일어선 셈이었다. 교통은 하루 종일 통제되었고, 에스토니아는 이날을 공휴일로 선포했다.

이 규모의 시위를 준비하는 데 주어진 시간은 겨우 5주였다. 7월 15일 에스토니아 남부 휴양도시 패르누에서 3국 인민전선 대표들이 처음 회합했고, 8월 12일 라트비아 체시스 근처 외딴 마을 렌치에서 공식 합의가 이루어졌다. 라트비아 인민전선 의장 다이니스 이반스는 회고록에서 “체시스 인민전선 조직원들이 미행을 피하려고 샛길로 우리를 데려갔다. 혼자서 다시 찾으라면 못 찾을 것”이라고 적었다. 소련 감시망 아래서 전화와 구두 연락만으로, 700킬로미터 구간을 1킬로미터 단위로 쪼개 배정하고, 부족한 구간을 메울 버스까지 편성한 조직력은 참가자들이 즉석에서 만들어낸 것이었다.

이날 모스크바가 아무것도 하지 않은 것은 아니었다. 8월 18일 『프라우다』는 알렉산드르 야코블레프가 이끄는 비밀의정서 조사위원회의 인터뷰를 실어, 소련이 수십 년간 부인해 온 비밀의정서의 실재를 처음으로 공식 인정했다. 다만 병합 자체는 불가침조약과 무관하다는 단서를 붙였다. 리투아니아 최고회의는 이에 만족하지 않고 8월 22일, 1940년 병합이 독소불가침조약의 직접적 결과이며 따라서 불법이라고 선언했다. 소련 국가기관이 소련 통치의 합법성을 스스로 문제 삼은 첫 사례였다.

사슬 자체는 15분간 이어졌다. 폭력 없는 15분이었고, 체포도 없었다. 대신 헬리콥터와 경비행기에서 찍은 사진 한 장 한 장이 서방 언론을 통해 전 세계로 퍼져나갔다. 로이터는 다음 날 에스토니아 70만, 라트비아 40만, 리투아니아 100만이 참가했다고 보도했다. 소련 관영 타스는 에스토니아 30만, 리투아니아 50만으로 축소 발표했고 라트비아 수치는 아예 공개하지 않았다.

사흘 뒤인 8월 26일, 소련 공산당 중앙위원회는 저녁 뉴스 『브레먀』 첫 19분을 할애해 성명을 발표했다. 발트의 길을 “민족주의적 히스테리”로 규정하고, “민족주의 지도자들이 발트 민족을 밀어넣고 있는 심연”을 경고하며 “결과는 재앙적일 수 있다”고 위협했다. 그러나 실질적 조치는 따르지 않았다. 역사가 알프레드 에리히 센의 평가처럼, 이 성명은 “모스크바가 아직 어느 쪽으로 갈지 결정하지 못했음을 보여주는, 결국 공허한 위협이 되었다.” 8월 31일 발트 활동가들은 유엔 사무총장에게 침략 위협을 호소하는 공동성명을 보냈고, 조지 H. W. 부시 미국 대통령과 헬무트 콜 서독 총리는 평화적 개혁을 촉구하며 소련을 압박했다.

## 제국이 스스로를 부정한 이틀: 1989년 12월 23-24일

1989년 12월은 발트 독립운동이 거리에서 제도 안으로 결정적 진입을 이룬 달이었다. 12월 7일 리투아니아 최고회의는 헌법 제6조, 즉 공산당의 ''지도적 역할''을 보장한 조항을 삭제하고 다당제를 합법화했다. 일주일 뒤 알기르다스 브라자우스카스 리투아니아공산당 제1서기는 당 대회에서 소련공산당으로부터의 분리를 상정했고, 12월 20일 대의원들은 찬성 다수로 독립 정당을 선언했다. 모스크바에 충성하는 소수파는 미콜라스 부로케비추스를 중심으로 별도의 ''소련공산당 강령파''를 결성했다. 소련공산당의 지방 지부가 스스로 중앙으로부터 분리된 것은 70년 역사상 처음 있는 일이었다.

같은 시기 모스크바에서는 제2차 인민대의원대회(12월 12일-24일)가 열리고 있었다. 의제의 핵심은 알렉산드르 야코블레프가 이끄는 26인 위원회가 6개월간 조사한 독소불가침조약 비밀의정서의 정치적·법적 평가였다. 위원회는 5월 말 엔델 리프마 등 에스토니아 인민대의원 18명이 의회에 결의안 초안을 제출하면서 설치되었고, 고르바초프의 지지 연설로 표결 없이 통과되었다. 에드가르 사비사르가 부위원장을, 리프마·마리우 라우리스틴·이고르 그랴진이 위원으로 참여했다.

위원회의 작업은 순탄하지 않았다. 보수파는 역사적 불가피성을 강조하며 비밀의정서를 정당화하는 기사들을 전연방 언론에 쏟아냈다. 위원회 내부의 표결조차 14대 12라는 박빙이었다. 그러나 12월 14일 유리 아파나시예프가 이끄는 지역간대의원그룹이 자신을 의회 다수파에 대한 ''야당''으로 선언하면서 의회 역학이 바뀌었다.

12월 23일, 야코블레프가 본회의에서 위원회 보고를 했다. 핵심 쟁점은 원본의 행방이었다. "원본은 소련 안팎의 어떤 기록보관소에서도 발견되지 않았다"고 위원회는 인정했다. 그러나 사본에 대한 필적·사진기술·어휘 분석과 이후 사건들, 즉 1939년 9월 소련의 폴란드 침공과 1940년 6월 발트 3국 점령이 비밀의정서의 존재를 "사실상 증명한다"고 결론 내렸다. 국방부는 의회 로비에 ''발트 3국의 자발적 합류''를 선전하는 대형 전시를 설치했고, 보수파 의원들은 수정안으로 결정 채택을 막으려 했다. 고르바초프는 이날 발언대에 서지 않았고, 표결은 부결되었다. 에스토니아 대표단은 학술원 위원회가 편찬한 자료집 「1940년의 에스토니아」(175쪽)를 의사당 안으로 들여와 배포했다. 여기에는 비밀의정서 사본이 실려 있었다.

부결 직후 리프마는 회의장에서 야코블레프 및 펠릭스 코발료프 외무부 역사외교국장과 접촉했다. 코발료프는 방청석에서 비밀의정서의 존재를 입증하는 문서들, 즉 문서 이관 기록을 제공할 준비가 되어 있었다. 셋은 외무부가 문서를 공개하고 다음 날 문제를 재상정하기로 합의했다.

12월 24일 크리스마스 이브, 야코블레프가 다시 연단에 섰다. 이번에는 고르바초프도 지지 입장을 밝혔다. 기명 투표 결과는 찬성 1432표, 반대 252표, 기권 264표로 압도적 통과였다. 결의문은 비밀의정서를 "서명 순간부터 법적으로 근거 없고 무효"라고 선언했고, 스탈린과 몰로토프가 중앙위원회·최고회의·정부 어디에도 비밀 협상 사실을 알리지 않았으며 "이 배신적 결탁에 소련 인민은 아무런 책임이 없다"고 명시했다. 의장 미하일 고르바초프의 서명과 함께 이 결의는 「프라우다」 12월 28일자에 게재되었다.

12월 24일은 두 사건이 겹친 날이었다. 모스크바에서는 소련 최고 권력기관이 발트 병합의 법적 토대를 스스로 무효화했고, 빌뉴스에서는 공산당이 모스크바로부터 독립했다. 소련은 이날 자신이 발트 3국에 대해 가졌던 유일한 법적 근거, 즉 1939년 8월의 비밀 조항이 존재했으며 동시에 무효였음을 공식 인정한 셈이었다. 이로부터 석 달 뒤 리투아니아는 이 결의를 근거로 독립 회복을 선언했다.

## 1990년 3월 11일, 한 공화국이 제국을 떠나다

1990년 2월 24일 리투아니아 최고회의 선거는 소련 역사상 최초의 자유 다당제 선거였다. 141석 중 사유디스가 지지한 후보가 96석을 차지했고, 1989년 12월 소련공산당에서 분리된 독립 리투아니아공산당(브라자우스카스)은 46석, 모스크바에 충성하는 공산당(CPSU 강령파)은 6석에 그쳤다. 선거 전 여론조사에서 독립공산당 지지율은 12%에 불과했다. 유권자들은 공산당의 분리 결정을 인정하면서도, 반세기 동안의 협력을 용서하지 않은 것이다.

3월 10일 소집된 새 최고회의는 다음 날 오전 곧바로 의장 선출에 들어갔다. 사유디스 의장 비타우타스 란츠베르기스가 91표, 독립공산당 제1서기 알기르다스 브라자우스카스가 38표를 얻었다. 4명은 두 후보 모두에게 반대했다. 란츠베르기스는 최고회의 의장이자 국가원수 권한을 동시에 부여받았다. 이어 최고회의는 국호를 「리투아니아 소비에트 사회주의 공화국」에서 「리투아니아 공화국」으로, 의회 명칭을 「최고회의」로 변경하고 국장을 중세 기사상 비티스로 복원했다. 건물 정면의 소련 리투아니아 국장은 철거되었다.

핵심 쟁점은 독립의 법적 성격이었다. 사유디스는 「회복」 논리를 취했다: 1940년 병합이 불법이었으므로 1918년 2월 16일 독립선언과 1920년 5월 15일 제헌의회 결의는 법적 효력을 상실한 적이 없으며, 소련 헌법은 리투아니아 영토에서 무효라는 것이다. 이날 최고회의는 소련 헌법과 리투아니아 SSR 헌법의 효력을 정지시키고 1938년 5월 12일 리투아니아 헌법을 복원했으며, 붉은 군대에 대한 리투아니아 청년 징집을 중단했다.

오후 9시 기초위원회가 「리투아니아 국가 회복에 관한 법률」 초안을 완성했다. 오후 10시 39분, 알파벳 순 호명 투표 결과가 발표되었다: 찬성 124명, 기권 6명, 반대 0명. 기권자는 부로케비추스의 모스크바파 공산당 소속 전원이었다. 브라자우스카스를 포함한 독립공산당 의원들은 찬성표를 던졌다. 3명은 투표에 불참했다. 오후 10시 44분, 란츠베르기스는 「법률이 통과되었다. 최고회의에 축하를, 리투아니아에 축하를」이라고 선언했다. 의사당 밖에서는 300~500명이 빗속에서 촛불을 들고 기다리고 있었고, 전국은 텔레비전으로 이 장면을 지켜보았다.

란츠베르기스는 모스크바에 협상을 제안하면서도 독립 선언의 철회·취소·정지는 있을 수 없다고 못 박았다. 고르바초프의 반응은 즉각적이고 적대적이었다. 3월 15일 소련 인민대의원회의는 1,463 대 94로 리투아니아 결정을 무효라고 선언했다. 4월 3일에는 「연방 탈퇴 절차법」을 제정해 공화국 전체 유권자 3분의 2 찬성, 5년 유예기간, 영토분쟁 해결 등 사실상 충족 불가능한 조건을 걸었다. 독립 선언 나흘 뒤 란츠베르기스는 카지미에라 프룬스키에네를 총리로 임명했다. 그러나 모스크바와의 협상은 교착에 빠졌고, 4월 18일 소련은 리투아니아에 대한 경제 봉쇄에 들어갔다.

## 1991년 1월, 탱크 앞에 선 사람들

1991년 1월, 모스크바는 리투아니아 독립을 10개월째 인정하지 않고 있었다. 경제 봉쇄로도 소용없자 강경파들은 군사적 해결을 밀어붙였다. 1월 8일, 가격 인상에 항의하는 친소 군중이 빌뉴스 최고회의 건물로 쇄도했다. 연단에는 대부분 러시아어를 쓰는 공장 노동자들 사이로 사복 차림의 소련 보안요원들이 섞여 있었다. 의회는 가격 인상을 철회했고, 총리 카지미에라 프룬스키에네가 사퇴했다. 같은 날 그녀는 고르바초프에게 군사 행동을 하지 않겠다는 보장을 요청했으나 거부당했다.

1월 10일, 고르바초프는 최고회의에 최후통첩을 보내 소련 헌법의 즉각 회복과 모든 ''반헌법적 법률''의 철회를 요구했다. 다음 날, 유오자스 예르말라비추스가 이끄는 친모스크바 리투아니아공산당(CPSU 강령파)이 「리투아니아 국가구원위원회」의 창설을 선포하고 스스로를 유일한 합법 정부라 칭했다. 동시에 소련군 특수부대(알파 그룹, 프스코프 공수사단)가 빌뉴스의 국방부 청사와 신문인쇄소를 점령하기 시작했다. 1월 12일 블라디슬라프 아찰로프 소련 국방차관이 현지에 도착해 전 작전 지휘를 인수했다.

결정적 순간은 1월 13일 자정 직후 찾아왔다. 탱크와 BMP 장갑차가 TV 타워를 포위했고, 확성기에서는 예르말라비추스의 육성이 흘러나왔다: 「리투아니아 형제들이여, 인민에게 맞섰던 민족주의·분리주의 정부는 전복되었다!」 탱크가 비무장 군중 속으로 돌진했고, 군인들이 실탄을 발사했다. 로레타 아사나비추테(23세)는 탱크 아래 깔려 사망했다. 그날 밤 14명이 목숨을 잃었고 700여 명이 부상당했다. 희생자 중에는 17세 학생 다리우스 게르부타비추스, 기숙사에서 돌아가는 길에 총에 맞은 대학생들, 시베리아 유형에서 살아남은 52세 정육점 주인 알기만타스 페트라스 카볼류카스가 포함되어 있었다. TV 방송은 아나운서의 마지막 말, 「무력으로 우리 입을 막을 수 있을지 몰라도, 누구도 우리에게 자유와 독립을 포기하게 할 수 없다」는 외침을 끝으로 화면이 꺼졌다.

그러나 최고회의 건물은 함락되지 않았다. 5만 명의 시민이 건물 주변을 에워싸고 바리케이드를 쌓았고, 소련군은 진입하지 못한 채 철수했다. 희생은 역설적으로 독립 진영을 단결시켰다. 한 달 뒤 실시된 국민투표에서 유권자의 90.47%가 독립을 지지했다.

빌뉴스의 소식이 전해지자 라트비아도 즉각 움직였다. 라트비아 인민전선은 이미 1990년 12월 「X시간을 위한 지침」이라는 비폭력 저항 계획을 발표해 두었고, 1월 13일 리가 대성당 광장으로 시민들을 소집했다. 약 70만 명이 모였다, 라트비아 전 인구의 3분의 1에 해당하는 숫자였다. 저녁이 되자 트럭과 농업용 중장비, 통나무를 실은 차량들이 도심으로 들어왔다. 시민들은 최고회의, 각료회의, 라트비아 텔레비전·라디오, 국제전화교환국 주변에 바리케이드를 구축했다. 1월 14일 밤부터 리가의 주요 전략거점은 모닥불과 민간인 경비대로 둘러싸였다.

소련 내무부 특수부대 오몬(OMON)은 리가에서 이미 1월 2일부터 활동을 개시해 신문인쇄소 「프레세스 남스」와 전화교환국을 점거한 상태였다. 1월 16일에는 베츠밀그라비스 교량에서 교통부 소속 운전사 로베르츠 무르니엑스가 오몬의 총격으로 사망했다, 바리케이드의 첫 희생자였다. 1월 20일 저녁, 오몬 부대는 라트비아 내무부 청사를 공격했다. 건물 안에는 경찰 15명이 소화기로 방어하고 있었고, 밖에는 비무장 지원자 약 100명이 있었다. 이 공격으로 5명이 사망했다: 경찰관 블라디미르스 고마노비치와 세르게이스 코노넨코, 17세 학생 에디스 리에크스틴슈, 그리고 리가 영화촬영소 소속 다큐멘터리 촬영기사 안드리스 슬라핀슈와 귀도 즈바이그네. 슬라핀슈와 즈바이그네는 건너편 호텔에서 촬영 중 저격수의 총에 맞았다. 국제 언론인 보호 위원회의 조사에 따르면 오몬이 언론인을 의도적으로 표적으로 삼았을 가능성이 제기되었다.

보리스 푸고 소련 내무장관과 드미트리 야조프 국방장관은 거듭 개입을 부인했으나, 야조프는 훗날 1990년 12월 라트비아에서 발생한 최초 4건의 폭탄 테러가 소련군 소행이었음을 시인했다. 빌뉴스와 리가 양쪽 모두에서, ''국가구원위원회''라는 동일한 정치적 장치가 가동되었고, 오몬과 알파 그룹이라는 동일한 특수부대가 투입되었으며, 모스크바의 고위층은 동일한 방식으로 책임을 회피했다.

두 공화국 모두에서 진압은 실패했다. 빌뉴스에서는 인파가 의회를 지켜냈고, 리가에서는 바리케이드가 1월 27일까지 버텨냈다. 가장 결정적이었던 것은 수많은 외신 기자가 현장을 실시간으로 보도하고 있었다는 사실이었다. 페르시아만 전쟁이 임박한 시점에서 미국 부시 행정부조차 이를 외면할 수 없었다. 아이슬란드는 2월 4일 리투아니아를 주권 독립국으로 승인했고, 이것이 첫 번째 국제적 승인이었다. 강경파의 무력 행사는 역효과를 냈다: 죽음 앞에서 물러서지 않은 시민들의 모습은, 총검으로도 돌이킬 수 없는 역사의 방향을 국제사회에 각인시켰다.

## 1991년 9월 6일, 제국이 스스로를 해체하기 시작하다

1991년 8월 19일 모스크바에서 쿠데타가 터졌을 때, 발트 3국은 50년 만에 찾아온 ''기회의 창''을 정확히 인식했다. 에스토니아 최고회의는 8월 20일, 라트비아 최고회의는 8월 21일 각각 완전한 독립 회복을 선언했고, 1990년 3월 리투아니아가 이미 선언한 길을 따랐다. 쿠데타가 8월 21일 저녁 붕괴하자, 3국의 독립은 더 이상 협상의 대상이 아니었다.

관건은 소련이 아니라 러시아였다. 보리스 옐친이 이끄는 러시아소비에트연방공화국(RSFSR)은 쿠데타 진압 과정에서 이미 발트 3국의 편에 섰다. 옐친은 7월 29일 리투아니아와, 8월 24일 에스토니아·라트비아와 각각 국교 수립 조약에 서명하며 3국의 독립을 러시아 차원에서 승인했다. 유럽공동체(EC)도 8월 말 외교 관계 수립 의사를 밝혔고, 미국은 9월 2일 조지 H.W. 부시 대통령이 외교 관계 수립 의사를 발표했다. 1940년 이래 발트 3국의 병합을 한 번도 승인하지 않았던 미국은, 승인이 아니라 ''외교 관계 회복''이라는 절차를 밟았다.

소련 국가평의회는 1991년 9월 5일 인민대의원대회의 법률로 창설된 임시 기관이었다. 고르바초프를 의장으로, 12개 공화국의 최고 지도자들로 구성된 이 기관은 연방의 마지막 집단 지도부였다. 창설 이튿날인 9월 6일 모스크바에서 열린 첫 회의는 개의 30분 만에 발트 3국의 독립을 만장일치로 승인했고, 에스토니아의 에드가르 사비사르 총리가 3국 대표로 참석했다. 외무장관 보리스 판킨은 기자회견에서 "우리는 그들의 독립을 승인했으며, 이 공화국들은 이제 소련에서 분리되었다"고 발표했다.

그러나 이 승인은 의도적인 모호성을 품고 있었다. 국가평의회의 세 건의 결의(ГС-1, ГС-2, ГС-3)는 각각 리투아니아·라트비아·에스토니아의 독립을 승인하면서도, 발트 3국이 줄곧 주장해 온 ''1940년 병합이 처음부터 불법이었으므로 우리는 탈퇴하는 것이 아니라 주권을 회복하는 것이다''라는 논리를 인정하지 않았다. 결의문은 ''구체적인 역사적·정치적 조건''이라는 표현으로 병합의 성격에 대한 판단을 회피했고, 이는 3국이 요구한 ''병합의 불법성 인정''을 끝내 거부한 것이었다.

더욱이 이 승인은 소련 자신의 법률을 명백히 위반했다. 1990년 4월 3일 제정된 「연방 탈퇴 절차법」은 공화국의 탈퇴에 주민투표와 최장 5년의 이행 기간을 요구했지만, 국가평의회는 어떤 절차도 거치지 않았다. 발트 3국은 애초에 이 법의 적용 대상이 아니라고 주장했고, 그들은 ''탈퇴''가 아니라 ''회복''을 말했으므로, 모스크바도 결국 같은 방식으로 행동한 셈이다. 법을 무시함으로써 법이 전제한 연방의 경계를 무화한 것이다.

6일 후인 9월 12일 유엔 안전보장이사회는 결의 709·710·711호로 3국의 회원 가입을 권고했고, 9월 17일 유엔 총회는 3국을 만장일치로 가입시켰다. 1940년 국제연맹 회원국이었던 세 나라가 반세기 만에 국제사회의 정식 구성원으로 복귀한 순간이었다. 국가평의회의 승인은 한 사건의 종결이 아니라 소련 해체라는 더 큰 과정의 첫 공식 절차였고, 남은 12개 공화국은 이 선례가 곧 자신들의 차례임을 알고 있었다.

## 독립은 얻었으나, 그 뒤의 질문들

발트 독립운동이 이룬 것은 분명하다. 1991년 9월 소련이 자멸하기 전, 세 공화국은 이미 독립을 회복했고, 1994년 8월까지 러시아군도 완전히 철수했다. 2004년 세 나라는 북대서양조약기구(NATO)와 유럽연합(EU)에 동시 가입하며 ''유럽으로의 귀환''을 제도적으로 완결했다. 무엇보다도, 발트의 경험은 비폭력 대중 동원으로 제국의 변경을 다시 그릴 수 있다는 선례를 남겼다. 마크 베이신저(Mark Beissinger)가 1987년부터 1991년까지 소련 전역의 6,000여 건의 시위를 계량 분석해 보여주었듯, 발트에서 시작된 민족주의의 ''파도''는 연쇄적으로 다른 공화국으로 확산되었고, 결국 소련 해체의 동력이 되었다.

그러나 해결되지 않은 채 남은 문제도 있다. 가장 큰 것은 시민권이었다. 에스토니아와 라트비아는 독립을 ''새로운 국가의 탄생''이 아니라 ''1940년 불법 병합 이전 국가의 회복''으로 규정했다. 이 ''법적 연속성'' 논리는 소련의 불법성을 국제법상 확정하는 강력한 무기였으나, 동시에 1940년 이후 이주해 온 러시아어 사용자들에게 시민권을 자동 부여하지 않는 근거가 되었다. 그 결과 에스토니아에서는 약 6만 명, 라트비아에서는 약 17만 5천 명이 ''비시민'' 신분으로 남았다. 이들은 지방선거조차 투표할 수 없었다. 아나톨 리벤(Anatol Lieven)은 1993년 저서 『발트 혁명』에서 "만약 시민권법이 서방의 압력으로 완화되지 않았다면 훨씬 위험한 상황을 맞았을 것"이라고 썼고, 25년 후 인터뷰에서도 이 판단이 유효하다고 확인했다. 리투아니아는 러시아계 인구 비율이 10%로 낮아 ''제로 옵션'' 방식으로 전 거주자에게 시민권을 부여했고, 이 대조는 지금도 세 나라 정치 지형의 차이로 남아 있다.

역사가들 사이에서 논쟁은 계속된다. 첫째, 발트 독립운동은 소련 붕괴의 원인이었는가, 아니면 결과였는가. 베이신저는 민족주의 동원의 ''사건-생성적(event-generated)'' 성격을 강조하며, 발트의 시위가 다른 공화국의 행동을 촉발했다고 본다. 반면 세르히 플로히(Serhii Plokhy)는 『최후의 제국』에서 소련 해체의 결정적 계기는 러시아와 우크라이나의 이탈이며, 발트는 이 흐름의 선봉이었을 뿐 ''방아쇠''는 아니었다고 주장한다. 둘째, ''법적 연속성'' 논리는 국제법적으로 승리했지만, 그것이 배제한 이들에게는 모순으로 읽혔다. 리벤이 지적했듯, 발트 민족주의의 내부에는 전간기 권위주의 시대를 미화하는 낭만적 민족사관이 흐르고 있었고, 이는 유럽연합이 지향하는 다원주의와 긴장 관계에 있다. 1991년에 열린 이 질문들은 아직 닫히지 않았다.
',
  body_en='## What the Three Republics Carried into 1987

For nearly half a century after their forced incorporation into the Soviet Union in 1940, Estonia, Latvia, and Lithuania lived under systematic pressure to erase the memory of independent statehood. Two waves of mass deportations, June 1941 and March 1949, shipped hundreds of thousands to Siberia and Central Asia. Estonia alone lost roughly one-fifth of its population when those who fled to the West are counted. After the armed resistance of the Forest Brothers was crushed in the late 1940s and early 1950s, overt opposition disappeared, but the embers never died. In Lithuania, the underground Chronicle of the Catholic Church in Lithuania began publishing in 1972, documenting the regime''s repression. On August 23, 1979, forty-five dissidents from all three republics sent the ''Baltic Appeal'' to the United Nations, demanding the publication of the Molotov-Ribbentrop Pact''s secret protocols and the restoration of Baltic independence. The appeal circulated through Western media; its signatories paid with arrest and imprisonment.

Demographic change was a second, relentless pressure. Moscow folded the Baltic republics into the Soviet industrial system and brought in Russian workers on a massive scale. The ethnic Estonian share of Estonia''s population fell from 88 percent before the war to 61.5 percent in 1989; the Latvian share in Latvia dropped from 75 percent to 52 percent. Even Lithuania, which received fewer migrants, lost four percentage points. Migrants received priority in housing, administrative posts, and Party cadres. From the late 1970s, a renewed Russification drive targeted the education system. Balts lived with the daily sensation of becoming a minority on their own land.

Yet the Baltic republics also possessed conditions that set them apart from other Soviet republics. First, the Western world never recognized the annexation. The United States and many other states continued to accredit Baltic diplomatic missions; the legations operating in Washington, London, and elsewhere preserved the legal continuity of the three independent states. This would later become the core juridical argument for the restoration of independence: ''annexation null and void.'' Second, geography placed the Baltic republics within reach of Western radio (Voice of America, BBC, Radio Free Europe) and, in northern Estonia, Finnish television. The gap between official Soviet discourse and external reality was visible to anyone who tuned in. Third, the churches, Lutheran in Estonia and Latvia and Catholic in Lithuania, functioned as repositories of national identity, while mass cultural traditions such as the Estonian Song Festival and the Latvian Song and Dance Festival remained channels for collective self-expression.

Mikhail Gorbachev''s accession as General Secretary in 1985 and his policies of glasnost (openness) and perestroika (restructuring) opened a crack through which these accumulated pressures could vent. Gorbachev permitted limited criticism from below in hopes of reversing economic decline, but he could not control the direction that criticism took in the non-Russian republics. In the Baltic, the first test of ''openness'' came through an environmental issue. On February 25, 1987, Estonian television revealed that Moscow planned to open enormous phosphorite mines in the Virumaa region. The mines threatened to pollute the watershed of the Pandivere upland, source of forty percent of Estonia''s rivers, and to bring tens of thousands of outside workers who would tip the fragile demographic balance decisively. Scientists led by Endel Lippmaa of the Estonian Academy of Sciences had been opposing the plans internally for years, but the project had been pursued in secrecy.

Within two months of the broadcast, students at Tartu University held a meeting in the university''s main hall. Soon afterward, students marched through Tartu in yellow T-shirts reading ''Phosphorite, no thanks.'' At the May Day parade of 1987, student demonstrators carried anti-mining slogans, and the movement spread within months into a mass campaign across Estonia. Reform Communists lent support from inside the Party and government. In September 1987, Moscow backed down and cancelled the mining project. Collective public resistance against the Soviet system had not merely been tolerated. It had won.

The Phosphorite War broke the culture of fear. People saw that glasnost was not merely a word and that organized civic action could produce real results. Subjects that had been publicly taboo, the nation''s demographic future, the migrant question, Moscow''s opaque decision-making, began appearing in newspapers and open debates. Estonian civil society, having tasted victory, was readying its next move: to confront a more fundamental question head-on at the upcoming anniversary of August 23, the forty-eighth year since the signing of the Molotov-Ribbentrop Pact.

The wars after the 1918 declarations and the background to the 1920 peace settlements and constituent assemblies are covered in the [Baltic wars of independence](/commulingo/events/baltic-wars-of-independence).

## The Day Fear Crumbled: Hirvepark, 23 August 1987

The crowd that gathered in Tallinn''s Hirvepark on 23 August 1987 numbered around seven thousand: not large by the standards of the Singing Revolution''s three years, but the weight of this meeting was not in the numbers. It was the first openly political demonstration organized by citizens on their own initiative in Soviet-occupied Estonia, and its subject was the secret protocols of the Molotov-Ribbentrop Pact, a document the authorities had always denied existed. On this day, Estonian society crossed the last threshold of fear.

The meeting was called by the MRP-AEG (Estonian Group on Publication of the Molotov-Ribbentrop Pact), formed only eight days earlier on 15 August. Its founders were former political prisoners: Tiit Madisson, who had served six years for signing the ''Letter of Forty'' in 1980; Lagle Parek, imprisoned from 1983 to 1987; Heiki Ahonen, Jüri Mikk, and Mati Kiirend, all former inmates. They applied formally to the Tallinn city executive committee for permission to hold the gathering. Town Hall Square was denied, but, surprisingly, Hirvepark was approved. A letter sent on 18 August by U.S. senators to Mikhail Gorbachev, demanding non-interference in the Baltic demonstrations and disclosure of the secret protocols, likely influenced the decision.

On the day, people first assembled at Town Hall Square. When authorities blocked the square, the crowd began moving along Harju Street toward Hirvepark, chanting slogans: ''Disclose the Molotov-Ribbentrop conditions,'' ''Self-determination for the Baltic countries,'' ''Bring Stalinist executioners to justice,'' ''Free Enn Tarto and Mart Niklus.'' Placards appeared equating the hammer and sickle with the swastika. Patrons at an open-air café watched this ''river of people'' in bewilderment.

The principal speaker, Tiit Madisson, laid out the core claim: that the non-aggression pact signed between Germany and the Soviet Union on 23 August 1939, together with its secret additional protocols, had divided Eastern Europe into spheres of influence, and that Estonia''s 1940 annexation was the direct result. He directed his critique at establishment historians like Gustav Naan, who had rewritten Estonian history in the 1950s. Erik Udam demanded that both Germany and the Soviet Union renounce the treaty and its consequences. Lagle Parek launched an on-the-spot signature drive for a monument to the victims of Stalinism; sixty-two people signed up immediately. Jüri Mikk warned that Estonians were ''becoming a minority in our own land,'' framing the issue as one of national survival. Merle Jääger and Raivo Raave read poetry; the crowd sang ''My Fatherland Is My Love'' and ''Stay Free, Estonian Sea.''

The meeting ended peacefully, but the regime''s response was immediate and vicious. The state-controlled press churned out articles branding participants ''thieves, crooks, and provocateurs.'' When the youth newspaper Noorte Hääl published a high school student''s letter suggesting the gathering was simply a normal exercise of glasnost, the editor-in-chief was summoned to the Agitation and Propaganda Department of the Estonian Communist Party Central Committee and severely reprimanded; the paper was then forced to print ''reader letters'' condemning the demonstration. Jüri Mikk began a two-month hunger strike on 1 September to protest the media slander campaign. Tiit Madisson was expelled from the Soviet Union by the KGB and forced into exile in Sweden with his family. In early 1988, Heiki Ahonen and his mother were also expelled.

But the spell of fear was already broken. Journalist Toomas Sildam, who attended Hirvepark as a fourteen-year-old, recalled decades later in an ERR interview: ''I saw the Tallinn police regiment''s trucks, the conscripts sitting under canvas covers, the riot shields and batons. I thought, what is going to happen now? But when the demonstration ended peacefully and those police trucks simply drove away, I realized something fundamental had changed.'' There was no violence. That thousands had gathered of their own volition, spoken about a forbidden subject, sung national songs, and demanded disclosure of a document the regime denied existed, and that no crackdown followed, was the structural legacy Hirvepark bequeathed to the Estonian independence movement.

## 1988: The Masses Take to the Streets

1988 was the year fear turned into organization, and organization into mass mobilization across the Baltic republics. The watershed came on April 1-2, when the Estonian Creative Unions (writers, artists, architects, film and theatre professionals) held a joint plenum in Tallinn. They openly criticized the leadership of Karl Vaino, the Russian-born First Secretary of the Estonian Communist Party, condemned Russification and environmental destruction, and demanded the restoration of the Estonian language''s status. Artist Heinz Valk declared: ''We may be killed, but we can never be suppressed.'' The intelligentsia had broken the wall of fear first.

Two weeks later, on April 13, Edgar Savisaar, an official at the State Planning Committee, appeared on Estonian TV''s live program ''Let''s Think Some More'' (Mõtleme veel) and proposed a ''Popular Front for the Support of Perestroika.'' It was a strategic move: borrow Gorbachev''s reform rhetoric to build a legal mass movement. Savisaar and sociologist Marju Lauristin became the driving force behind the Rahvarinne (Estonian Popular Front), which spent the summer building a nationwide base. In May, Alo Mattiisen''s ''Five Patriotic Songs'' premiered at the Tartu Pop Festival; sung by Ivo Linna, they became the emotional engine of the independence movement. After the Old Town Festival on June 10-11, crowds spontaneously remained at the Tallinn Song Festival Grounds singing patriotic songs through the night. Valk coined the term ''Singing Revolution'' in an article published days later.

Moscow sensed the shift and acted. On June 16, Karl Vaino was dismissed and replaced by the ethnic Estonian Vaino Väljas as First Secretary. Väljas opened dialogue with the Popular Front, creating the possibility of coexistence between Party and mass movement. But opposition also coalesced: on July 19, the Intermovement (Interfront) was founded, drawing Russian-speaking workers and conservative Communists who attacked the Popular Front as ''nationalist'' and vowed to defend the Soviet system.

In Lithuania, 35 intellectuals, 17 of them Party members, formed the Sąjūdis Initiative Group at the Academy of Sciences in Vilnius on June 3. Musicologist Vytautas Landsbergis, a non-Party member, joined and soon became its leading voice. Sąjūdis held its first mass rally in Gediminas Square on June 24, and drew 100,000 to Vingis Park on July 9. On August 23, the 49th anniversary of the Molotov-Ribbentrop Pact, 250,000 gathered in Vingis Park demanding disclosure of the secret protocols. Algirdas Brazauskas, then Party secretary for industrial affairs, attended the rally, a signal that the distance between Party and movement was narrowing.

In Latvia, the Writers Union plenum on June 1-2 saw the first open demands for autonomy and democratization. Journalist Dainis Īvāns, who had led the successful campaign against the Daugavpils hydroelectric dam, emerged as a central figure. The Latvian Popular Front (LTF) held its founding congress in Riga on October 8-9 and elected Īvāns chairman. The LTF was distinctive among the three popular fronts for actively reaching out to ethnic minorities, supporting the right to education in languages beyond Latvian and Russian to win over non-Russian minorities. At its founding it claimed over 100,000 members and soon grew to 250,000.

Autumn brought institutional breakthroughs. On September 11, the ''Eestimaa Laul'' (Estonia''s Song) event drew an estimated 300,000 people, one-fifth of Estonia''s population, to the Tallinn Song Festival Grounds. Trivimi Velliste, chairman of the Estonian Heritage Society, became the first public figure to openly demand the restoration of independence. On October 1-2, Rahvarinne held its official founding congress at Tallinn''s Linnahall with 3,071 delegates, 22% of whom were Party members. It adopted a radical program calling for constitutional guarantees of private property and punishment of Stalinist crimes. On October 22-23, Sąjūdis held its founding conference in Vilnius and elected Landsbergis chairman of its council.

On November 16, the Estonian Supreme Soviet adopted the ''Declaration on the Sovereignty of the Estonian SSR.'' It asserted the supremacy of Estonian laws over Soviet laws and claimed jurisdiction over natural resources and means of production within Estonia''s territory. Though its legal language was careful, sovereignty within the Union, its substance was a direct challenge to Moscow''s authority. Signed by Presidium Chairman Arnold Rüütel, the declaration preempted Gorbachev''s attempt to curtail republic powers through amendments to the Soviet constitution. What had seemed impossible when the year began had, in twelve months, become reality.

## A Chain of Two Million, Six Hundred Kilometres: 23 August 1989

23 August 1989 was a Wednesday. At 7 p.m., radio stations across the three republics simultaneously broadcast a trilingual song composed for the occasion, ''The Baltics Are Waking Up'' (Bunda jau Baltija). That was the signal. From the foot of Toompea Hill in Tallinn to the foot of Gediminas Tower in Vilnius, along 675 kilometres of roadway, roughly two million people joined hands: one in every four of the three republics'' eight million inhabitants. Traffic was shut down for the day and Estonia declared a public holiday.

To mount a protest of this scale, the organisers had just five weeks. On 15 July the popular front leaders met for the first time in the Estonian resort town of Pärnu; on 12 August a formal agreement was reached in the secluded hamlet of Lenči, near Cēsis in Latvia. The Latvian Popular Front chairman Dainis Īvāns wrote in his memoirs that ''Cēsis Popular Front members took us through back roads to prevent anyone from trailing us. If I had to, I doubt I could find the place again.'' Under Soviet surveillance, with only landline telephones and word of mouth, they divided a 700-kilometre stretch kilometre by kilometre and organised buses to fill every gap: logistics conjured on the spot by the participants themselves.

Moscow had not been idle. On 18 August Pravda published an interview with the commission led by Alexander Yakovlev that was investigating the secret protocols, marking the first official Soviet acknowledgement that the protocols had existed after decades of denial. But it tacked on the proviso that the protocols had no bearing on the Baltic annexation. Not satisfied, the Supreme Soviet of the Lithuanian SSR declared on 22 August that the 1940 occupation was a direct consequence of the Nazi-Soviet Pact and therefore illegal: the first time an official Soviet body itself challenged the legitimacy of Soviet rule.

The chain itself lasted fifteen minutes. Fifteen minutes without violence and without arrests. Instead, photograph after photograph, from helicopters and from light planes, travelled across the world through the Western media. Reuters reported the next day that 700,000 had joined in Estonia, 400,000 in Latvia and one million in Lithuania. The Soviet news agency TASS gave reduced figures of 300,000 for Estonia and 500,000 for Lithuania and withheld any number for Latvia.

Three days later, on 26 August, the Central Committee of the CPSU devoted the first nineteen minutes of the evening news programme Vremya to a statement. It branded the Baltic Way ''nationalist hysteria,'' warned of ''the abyss into which nationalist leaders are pushing the Baltic peoples,'' and threatened that ''the consequences could be catastrophic.'' But no concrete action followed. As the historian Alfred Erich Senn assessed, the statement became a source of embarrassment: proof that Moscow had not yet decided which way to go, and an empty threat in the end. On 31 August Baltic activists sent a joint declaration to the UN Secretary-General claiming to be under threat of aggression and requesting an international monitoring commission; President George H. W. Bush and Chancellor Helmut Kohl urged restraint and pressed the Soviet Union for peaceful reform.

## The Two Days the Empire Repudiated Itself: 23–24 December 1989

December 1989 was the month the Baltic independence movement crossed decisively from the street into the institutions. On 7 December the Lithuanian Supreme Soviet struck Article 6, the clause guaranteeing the Communist Party''s ''leading role,'' from the republic''s constitution and legalised a multiparty system. A week later Algirdas Brazauskas, first secretary of the Lithuanian Communist Party, put separation from the CPSU to the party congress; on 20 December the delegates voted overwhelmingly for an independent party. The Moscow-loyal minority, led by Mykolas Burokevičius, formed a separate ''CPSU-platform'' faction. It was the first time in Soviet history that a republican party organisation had split itself from the centre.

Meanwhile in Moscow the Second Congress of People''s Deputies (12–24 December) was underway. The centrepiece of the agenda was the political and legal assessment of the Molotov-Ribbentrop Pact''s secret protocols, investigated for six months by a 26-member commission chaired by Alexander Yakovlev. The commission had been created in late May after 18 Estonian deputies led by Endel Lippmaa submitted a draft resolution to the Congress; Gorbachev''s supportive speech got it through without a vote. Edgar Savisaar served as vice-chairman; Lippmaa, Marju Lauristin and Igor Gräzin sat as members.

The commission''s work was anything but smooth. Conservatives flooded the all-Union press with articles justifying the protocols as historical inevitability. Even within the commission the draft decision passed by the narrowest margin: 14 to 12. But on 14 December Yuri Afanasyev''s Inter-Regional Group declared itself the ''opposition'' to the Congress majority, shifting the parliamentary dynamics.

On 23 December Yakovlev presented the commission''s report to the plenum. The central evidentiary problem was the missing original: ''The original has not been found either in Soviet or foreign archives,'' the commission acknowledged. Yet graphological, phototechnical and lexical study of the copies, plus the compliance of subsequent events (the September 1939 invasion of Poland, the June 1940 takeover of the Baltic states), proved the protocols had ''factually been signed and existed.'' The Ministry of Defence set up a large exhibition in the Congress lobby extolling the ''voluntary accession'' of the Baltic states; conservative deputies tried to block adoption with amendments. Gorbachev did not take the floor that day, and the vote failed. The Estonian delegation brought into the chamber a 175-page collection compiled by an Academy of Sciences commission, The Year 1940 in Estonia, which contained a copy of the secret protocols.

Immediately after the rejection, Lippmaa approached Yakovlev and Felix Kovalyov, head of the Foreign Ministry''s Historical-Diplomatic Directorate, in the plenary hall. Kovalyov was ready to provide, from the guest balcony, the documents proving the protocols'' existence: the transfer records between officials. The three agreed the Foreign Ministry would release the documents and the question would return to the agenda the following day.

On 24 December, Christmas Eve, Yakovlev took the rostrum again. This time Gorbachev signalled his support. The roll-call vote: 1,432 in favour, 252 against, 264 abstaining. An overwhelming passage. The resolution declared the secret protocols ''legally unfounded and invalid from the moment of signing,'' stated that Stalin and Molotov had disclosed the secret negotiations to neither the Central Committee, nor the Supreme Soviet, nor the government, and that ''the Soviet people bear no responsibility for this treacherous collusion.'' Signed by Chairman Gorbachev, the resolution appeared in Pravda on 28 December.

Two events converged on 24 December: in Moscow the USSR''s highest state body voided the legal basis of the Baltic annexation with its own hand, while in Vilnius the Communist Party declared its independence from Moscow. The Soviet Union had now officially acknowledged that the sole legal instrument underpinning its presence in the three republics, the secret clauses of August 1939, had both existed and been void. Three months later, Lithuania would cite this resolution as grounds for restoring its independence.

## 11 March 1990: A Republic Leaves the Empire

On 24 February 1990, Lithuania held the first free multiparty elections to a republican Supreme Soviet in Soviet history. Of the 141 seats, Sąjūdis-backed candidates won 96, the independent Communist Party of Lithuania (which under Algirdas Brazauskas had split from the CPSU in December 1989) took 46, and the pro-Moscow CPL (CPSU platform) took just 6. A pre-election poll had shown only 12 percent support for the independent Communists. Voters had acknowledged the party''s break from Moscow, but they had not forgiven fifty years of collaboration.

When the new Supreme Council assembled on 10 March, it moved to elect its chairman the next morning. Sąjūdis leader Vytautas Landsbergis received 91 votes; Brazauskas received 38; four deputies voted against both. Landsbergis was then vested not only with the chairmanship but with the powers of head of state. In quick succession the Council changed the republic''s name from ''Lithuanian Soviet Socialist Republic'' to ''Republic of Lithuania'', renamed itself the Supreme Council, and restored Vytis, the medieval mounted knight, as the national coat of arms. The bronze Soviet-Lithuanian crest was torn from the building''s façade.

The core legal question was what kind of act independence was. Sąjūdis insisted on ''restoration'': because the 1940 annexation had been illegal, the Act of Independence of 16 February 1918 and the Constituent Assembly resolution of 15 May 1920 had never lost their legal force, and the Soviet constitution had never been valid on Lithuanian soil. That day the Council suspended the USSR Constitution and the Lithuanian SSR Constitution, restored the 12 May 1938 Lithuanian Constitution, and halted the conscription of Lithuanian youths into the Red Army.

At 9 p.m. the drafting committee finished the Act on the Re-Establishment of the State of Lithuania. At 10:39 p.m., the alphabetical roll-call was announced: 124 in favour, 6 abstentions, none against. The six abstainers were the entire pro-Moscow CPL faction led by Mykolas Burokevičius. The independent Communists, Brazauskas among them, voted yes. Three deputies did not take part. At 10:44 p.m., Landsbergis declared, ''The act has been passed. I congratulate the Supreme Council. I congratulate Lithuania.'' Outside, three to five hundred people stood in the rain holding candles; the rest of the country watched on television.

Landsbergis offered negotiations with Moscow but made clear that the act would not be revoked, rescinded, or suspended. Gorbachev''s response was immediate and hostile. On 15 March the Congress of People''s Deputies voted 1,463 to 94 to declare the Lithuanian decision void. On 3 April it passed the Law on the Procedure for Secession, setting virtually impossible conditions: a two-thirds majority in a republic-wide referendum, a five-year transition period, settlement of all territorial claims. Four days after the declaration, Landsbergis appointed Kazimiera Prunskienė as prime minister. But negotiations with Moscow stalled, and on 18 April the Soviet Union imposed an economic blockade on Lithuania.

## January 1991: People Before the Tanks

By January 1991, Moscow had refused to recognise Lithuania''s independence for ten months. When economic blockade failed, hardliners pressed for a military solution. On 8 January, a pro-Soviet crowd protesting price hikes surged toward the Supreme Council building in Vilnius. Russian-speaking factory workers mingled with plainclothes Soviet security operatives. Parliament rescinded the price rise, and Prime Minister Kazimiera Prunskienė resigned. That same day she asked Gorbachev for a guarantee that military action would not be taken; he refused.

On 10 January, Gorbachev sent an ultimatum to the Supreme Council demanding immediate restoration of the Soviet constitution and repeal of all ''anti-constitutional laws''. The next day, the pro-Moscow Lithuanian Communist Party (CPSU platform), led by Juozas Jermalavičius, proclaimed the ''National Salvation Committee of the Lithuanian SSR'' and declared itself the sole legitimate government. At the same time, elite Soviet units, the KGB''s Alpha Group and Pskov-based paratroopers, began seizing the National Defence Department building and the Press House in Vilnius. On 12 January, Deputy Defence Minister Vladislav Achalov arrived in the capital and took command of all military operations.

The decisive moment came just after midnight on 13 January. Tanks and BMP armoured vehicles surrounded the TV tower, and loudspeakers broadcast Jermalavičius''s recorded voice: ''Brother Lithuanians! The nationalist and separatist government, which confronted the people, has been overthrown!'' Tanks drove into the unarmed crowd; soldiers fired live ammunition. Loreta Asanavičiūtė, 23, died crushed under a tank. Fourteen people were killed that night and more than 700 injured. Among the dead were 17-year-old student Darius Gerbutavičius, university students shot on their way from dormitories, and 52-year-old butcher Algimantas Petras Kavoliukas, who had survived Siberian deportation. Television went off air after a presenter''s final words: ''They can close our mouths by force, but no one will make us renounce freedom and independence.''

Yet the Supreme Council building was not taken. Fifty thousand citizens encircled it, building anti-tank barricades, and Soviet forces withdrew without attacking. The sacrifice paradoxically united the independence camp: in a referendum held one month later, 90.47 percent of voters endorsed independence.

News from Vilnius galvanised Latvia. The Latvian Popular Front had already published an ''Instructions for X-hour'' plan for nonviolent resistance in December 1990, and on 13 January it summoned citizens to Riga Cathedral Square. Roughly 700,000 people gathered, a third of Latvia''s entire population. By evening, trucks, agricultural machinery and vehicles loaded with logs rolled into the city centre. Citizens built barricades around the Supreme Council, the Council of Ministers, Latvian Television and Radio, and the international telephone exchange. From the night of 14 January, Riga''s key strategic sites were ringed with bonfires and civilian guard posts.

The Soviet Interior Ministry''s OMON special forces had been operating in Riga since 2 January, seizing the Preses Nams printing house and a telephone exchange. On 16 January, OMON shot and killed Roberts Mūrnieks, a Transport Ministry driver, at the Vecmīlgrāvis bridge: the barricades'' first fatality. On the evening of 20 January, OMON attacked the Latvian Interior Ministry building. Fifteen Latvian policemen defended it with light arms; roughly 100 unarmed volunteers stood outside. Five people were killed: police officers Vladimirs Gomanovičs and Sergejs Konoņenko, 17-year-old schoolboy Edijs Riekstiņš, and Riga Film Studio documentary cameramen Andris Slapiņš and Gvido Zvaigzne. Slapiņš and Zvaigzne were shot by snipers while filming from a hotel across the street. A subsequent investigation by the Committee to Protect Journalists suggested OMON troops deliberately targeted the journalists.

Soviet Interior Minister Boris Pugo and Defence Minister Dmitry Yazov repeatedly denied involvement, though Yazov later admitted the military was responsible for the first four bombings in Latvia in December 1990. In both Vilnius and Riga, the same political device, the ''National Salvation Committee'', was activated; the same elite special forces, OMON and Alpha Group, were deployed; and the same pattern of non-denial denial came from Moscow.

In both republics, the crackdown failed. In Vilnius, the crowd defended the parliament; in Riga, the barricades held until 27 January. Most decisive was the presence of hundreds of foreign journalists reporting in real time. Even the Bush administration, preoccupied with the imminent Gulf War, could not ignore it. Iceland recognised Lithuania as a sovereign independent state on 4 February 1991, the first international recognition. The hardliners'' use of force backfired: the image of unarmed citizens who did not retreat before tanks etched into international consciousness that the direction of history could not be reversed by bayonets.

## 6 September 1991: The Empire Begins to Dismantle Itself

When the coup erupted in Moscow on 19 August 1991, the three Baltic states recognised the ''window of opportunity'' that had not opened in fifty years. The Estonian Supreme Council declared full independence restored on 20 August, Latvia''s followed on 21 August: the path Lithuania had already taken in March 1990. By the evening of 21 August, when the coup collapsed, the independence of the three states was no longer a matter for negotiation.

The pivotal player was not the Soviet Union but Russia. Boris Yeltsin''s RSFSR, having already sided with the Baltic states during the coup''s suppression, signed treaties establishing diplomatic relations with Lithuania on 29 July and with Estonia and Latvia on 24 August, extending Russian recognition. The European Community announced its readiness to establish relations at the end of August; on 2 September, US President George H.W. Bush announced the same. The United States, having never recognised the 1940 annexation, proceeded not by ''recognising'' independence but by ''restoring diplomatic relations'' with governments it had always treated as legitimate in law.

The USSR State Council was created on 5 September 1991 by a law of the Congress of People''s Deputies. Chaired by Gorbachev and composed of the top leaders of twelve republics, it was the Union''s last collective leadership. Its first meeting, held in Moscow on 6 September, took just thirty minutes to vote unanimously for Baltic independence; Estonian Prime Minister Edgar Savisaar attended as the representative of all three states. Foreign Minister Boris Pankin told reporters: ''We have recognised their independence, and those republics are now separate from the Soviet Union.''

But the recognition carried deliberate ambiguity. The three resolutions (ГС-1, ГС-2, ГС-3) recognised the independence of Lithuania, Latvia and Estonia respectively, yet refused to endorse the argument the Baltic states had made all along: that the 1940 annexation had been illegal from the start, and that they were not seceding but restoring sovereignty. The resolutions spoke of ''concrete historical and political conditions'' without ever judging the annexation''s character, and the Soviet side never conceded the illegality the Balts demanded.

Moreover, the recognition openly violated the USSR''s own law. The April 1990 Law on the Procedure for Secession of a Union Republic required a referendum and a transitional period of up to five years; the State Council followed none of those procedures. The Baltic states had always argued that the law did not apply to them, for they spoke of restoration, not secession, and Moscow ultimately acted as though it agreed. By disregarding the law, it extinguished the borders the law had been designed to preserve.

Six days later, on 12 September, the UN Security Council recommended the three states for membership in resolutions 709, 710 and 711; on 17 September the General Assembly admitted them unanimously. Three former League of Nations members returned to the international community after half a century. The State Council''s vote was not the end of one story but the first formal step in a larger one: the dissolution of the Soviet Union. The twelve remaining republics understood that this precedent would soon be theirs.

## Independence Won, and the Questions That Followed

What the Baltic independence movement settled is clear. Before the Soviet Union self-destructed in September 1991, the three republics had already restored their independence, and by August 1994 Russian troops had fully withdrawn. In 2004 all three joined NATO and the European Union simultaneously, institutionally completing their "return to Europe." Above all, the Baltic experience set the precedent that an empire''s periphery could be redrawn through nonviolent mass mobilization. As Mark Beissinger demonstrated by quantitatively analyzing more than 6,000 protest events across the USSR from 1987 to 1991, the "tide" of nationalism that began in the Baltics spread in chain reactions to other republics, ultimately becoming the engine of the Soviet dissolution.

But what remained unresolved is also substantial. The largest question was citizenship. Estonia and Latvia defined independence not as the birth of new states but as the restoration of the republics that had existed before the illegal 1940 annexation. This "legal continuity" argument was a powerful weapon for establishing the illegality of the Soviet occupation under international law, but it also became the basis for denying automatic citizenship to Russian-speaking settlers who had arrived after 1940. As a result, approximately 61,000 people in Estonia and 175,000 in Latvia remained "non-citizens," unable even to vote in local elections. Anatol Lieven wrote in The Baltic Revolution (1993) that had the citizenship laws not been relaxed under Western pressure, "a far more dangerous situation might have developed"; twenty-five years later, he confirmed that assessment still held. Lithuania, where ethnic Russians made up only 10 percent of the population, granted citizenship to all residents under a "zero option," and this contrast remains visible in the three countries'' political landscapes to this day.

The historiographical debates continue. First, was the Baltic independence movement a cause of the Soviet collapse, or its consequence? Beissinger emphasizes the "event-generated" character of nationalist mobilization, arguing that Baltic protests triggered actions in other republics. Serhii Plokhy, in The Last Empire, contends that the decisive factor was the defection of Russia and Ukraine, and that the Baltics were the vanguard but not the trigger. Second, the legal-continuity argument triumphed in international law, yet to those it excluded it read as a contradiction. As Lieven noted, Baltic nationalism carried within it a romantic national historiography that idealized the authoritarian interwar period, a strain that remains in tension with the pluralism the European Union professes. The questions that opened in 1991 have not yet closed.
',
  updated_at=NOW() WHERE id='baltic-independence';
UPDATE commulingo_history_events SET
  body_ko='## 제국의 폐허 위에서: 내전과 조약이 만든 여섯 공화국

1922년 12월, 볼셰비키가 옛 러시아 제국의 영토에서 장악한 것은 단일한 국가가 아니라 여섯 개의 형식적 독립국이었다. 러시아 소비에트 연방 사회주의 공화국(RSFSR), 우크라이나 소비에트 사회주의 공화국, 벨로루시야 소비에트 사회주의 공화국, 그리고 아제르바이잔·아르메니아·그루지야의 세 캅카스 공화국: 이 여섯은 저마다 주권을 가진 별개의 소비에트 공화국으로 존재했다. 어떻게 이런 기묘한 지도가 그려졌는가를 이해하려면 1917년 11월로 거슬러 올라가야 한다.

1917년 11월 15일(구력 2일), 볼셰비키 정부는 「러시아 인민의 권리 선언」을 발표했다. 레닌과 스탈린이 서명한 이 문서는 구제국의 모든 민족에게 평등과 주권, 그리고 분리·독립할 권리까지 천명했다. 차르 체제를 ''인민의 감옥''으로 규정했던 볼셰비키에게 이는 이념적 약속인 동시에, 내전에서 비러시아 민족의 지지를 확보하기 위한 현실적 수단이었다. 핀란드·폴란드·발트 3국은 이 기회에 영구히 이탈했고, 우크라이나·벨로루시야·캅카스에서는 독립 공화국들이 선포되었다가 적군의 재진격으로 소비에트화되었다. 그루지야만 해도 1921년 2월까지 멘셰비키 정부 아래 독립국으로 존속했다.

내전이 막바지로 치닫던 1920년 가을, 볼셰비키 지도부는 한 가지 냉정한 사실을 직시하게 되었다. 러시아 중부의 산업 지대는 우크라이나의 곡물과 돈바스의 석탄, 캅카스의 석유 없이는 돌아가지 않았다. 레닌 자신이 1920년 10월 이렇게 썼다: "중앙 러시아, 세계혁명의 그 화로는 원료·연료·식량이 풍부한 변경 지역의 도움 없이는 오래 버틸 수 없다." 여기서 등장한 것이 1920-21년의 양자 조약 체계였다. 1920년 9월 30일 RSFSR-아제르바이잔 군사·경제 동맹, 12월 28일 RSFSR-우크라이나 ''노동자-농민 동맹 조약'', 1921년 1월 16일 RSFSR-벨로루시야 동맹 조약: 이 조약들은 각 공화국의 주권을 형식상 보존하면서도 군사·경제·외교의 핵심 부문을 통합했다. 우크라이나 혁명위원회는 1920년 1월 27일, RSFSR과의 협정에 관련된 기관들의 모든 법령을 RSFSR의 법령으로 대체한다고 선언하기까지 했다.

그러나 이 조약 체계는 근본적 모순을 안고 있었다. 각 공화국은 헌법상 주권국이었지만, 모든 공화국을 통치하는 러시아 공산당(볼셰비키)은 중앙집권적 단일 조직이었다. 공화국들의 ''독립''은 종이 위의 독립이었고, 실질적 결정은 모스크바의 당 중앙위원회 정치국에서 내려졌다. 내전이 낳은 이 모순은 전시에는 임시방편으로 용인되었지만, 전후 복구가 시작되자 더는 지속될 수 없었다.

1921년의 상황은 급박했다. 제1차 세계대전과 내전을 거치며 산업 생산은 1913년의 20% 이하로 추락했고, 1921-22년의 대기근은 볼가·우크라이나·캅카스에서 약 500만 명의 목숨을 앗아갔다. 전시공산주의의 강제 곡물 징발은 탐보프 반란과 크론시타트 봉기를 촉발했고, 1921년 3월 레닌은 신경제정책(네프)으로 후퇴할 수밖에 없었다.

외교적 압력도 거세졌다. 1922년 4월 제노바 회의에서 구협상국 열강은 소비에트 정권의 차르 채무 승계와 외국 자산 국유화 보상을 요구했다. 외무인민위원 게오르기 치체린은 이 회의를 앞두고 RSFSR이 다른 소비에트 공화국들의 법적 이익까지 대표할 수 있는지에 대한 공식 조회를 러시아 정부에 보냈다. 이는 여러 공화국을 하나로 묶어 외교적 단일 전선을 구축해야 할 필요성을 적나라하게 드러낸 순간이었다. 그 해 4월 16일 라팔로에서 소비에트 러시아와 독일이 맺은 별도 조약은 독일로 하여금 RSFSR의 ''연방 공화국들에 대한 권위''를 사실상 인정하게 한 것이었다.

요컨대 1922년 중반까지, 옛 제국의 폐허 위에는 여섯 개의 소비에트 공화국이 병존하고 있었지만 그 관계는 법적으로도 실무적으로도 모호했다. 경제 복구는 통일된 계획을 요구했고, 국제무대에서는 단일한 목소리가 필요했으며, 당은 하나였지만 국가는 여럿이라는 모순은 점점 더 버티기 어려워졌다. 국가 형태를 둘러싼 싸움(스탈린의 자치화안 대 레닌의 연방안)은 이렇게 이미 가열된 솥 위에서 시작되었다.

## 형식은 독립국, 실질은 하나의 국가: 조약 체계와 자캅카스 연방

내전이 끝나갈 무렵, 구 러시아 제국의 영토에는 여섯 개의 소비에트 공화국이 병존하고 있었다: RSFSR, 우크라이나, 벨로루시야, 아제르바이잔, 아르메니아, 그루지야. 이 공화국들은 형식상 완전히 독립된 주권국가였고, 각자 자체 헌법과 정부, 외교인민위원부까지 두고 있었다. 그러나 내전이라는 공동의 전장은 이미 그것들을 하나의 작동하는 국가 장치 안으로 엮어 놓고 있었다. 붉은 군대의 사령부는 모스크바에 있었고, 철도망과 전신은 단일 체계로 운영되었으며, 경제는 전시 공산주의 아래 사실상 통합되어 있었다.

이 모순적인 상태, 즉 형식적 독립과 실질적 통합을 제도화한 것이 1920년 가을부터 1921년 초까지 체결된 일련의 쌍무 조약들이었다. 가장 먼저 1920년 9월 30일 RSFSR과 아제르바이잔 사이에 「군사·경제 동맹 조약」이 맺어졌고, 이어 12월 28일 RSFSR과 우크라이나 사이에 「노동자-농민 동맹 조약」이, 1921년 1월 16일에는 RSFSR과 벨로루시야 사이에 같은 이름의 조약이 체결되었다. 우크라이나 조약이 이 체계의 전형이었다. 조약 전문은 양 공화국의 「독립과 주권」을 상호 인정한다고 명시했지만, 동시에 군사·해군, 최고경제회의, 대외무역, 재무, 노동, 교통, 체신의 일곱 개 인민위원부를 「통합」한다고 선언했다. 이 통합 인민위원부들은 RSFSR 인민위원회의 산하에 들어갔고, 우크라이나는 자기 인민위원회에 이들 부서의 「전권대표」만을 둘 수 있었다. 우크라이나 대표들은 전러시아 소비에트 대회와 전러시아 중앙집행위원회(VTsIK)에 대표를 파견하는 방식으로 참여했지만, 결정권은 모스크바에 있었다. 요컨대 이 조약들은 공화국들이 대등한 주권국가로서 ''연합''한다고 선언하면서도 실제로는 RSFSR의 제도를 통해 통치하는 구조를 만들었다.

이 조약 체계는 당장 두 가지 상반된 정치적 의미를 낳았다. 한편으로는 공화국들이 ''독립국''으로서 RSFSR과 조약을 맺었다는 사실 자체가 그 주권을 대외적으로 확인해 주었다: 우크라이나는 1922년 초 튀르키예와 독자 조약을 체결하기도 했다. 다른 한편으로는, 통합 인민위원부의 작동은 공화국 경계를 사실상 무력화했고, 모스크바의 몇몇 지도자들, 특히 민족인민위원 스탈린에게 이 체계는 RSFSR로의 완전한 편입을 향한 과도기적 단계에 불과했다.

캅카스에서는 이 긴장이 가장 첨예하게 표출되었다. 아제르바이잔(1920년 4월), 아르메니아(1920년 11월), 그루지야(1921년 2월)가 차례로 적군에 점령되어 소비에트화된 후, 이 세 공화국은 국경 분쟁, 민족 간 충돌, 경제 붕괴의 소용돌이에 빠져 있었다. 바쿠의 석유 산업, 그루지야의 차 재배, 철도 연결망은 분리된 채 운영될 수 없는 것들이었다. RCP(b) 중앙위원회의 캅카스 사무국(카프비우로)을 이끌던 세르고 오르조니키제는 이 혼란을 수습하는 유일한 길이 세 공화국을 하나의 연방으로 묶는 것이라고 확신했다. 스탈린은 전적으로 동의했고, 레닌도 처음에는 반대하지 않았다.

그러나 그루지야 공산당의 상당수는 이 구상을 그루지야 주권의 말살로 받아들였다. 사태의 저변에는 이미 1921년 여름의 충돌이 있었다: 스탈린은 그루지야 혁명위원회 의장 필리프 마하라제가 멘셰비키에 대해 지나치게 관대하고 민족적 자율성을 고수한다는 이유로 해임하고 폴리카르프 므디바니를 그 자리에 앉혔다. 그러나 바로 그 므디바니가 연방 문제에서는 모스크바의 가장 완강한 반대자로 돌아섰다. 그와 그의 동료들은 그루지야가 다른 공화국들처럼 장차의 소비에트 연방에 개별적으로 직접 가입해야 하며, 자캅카스 연방이라는 중간 단계를 거쳐서는 안 된다고 주장했다. 그들의 눈에 자캅카스 연방은 그루지야의 국가성을 아제르바이잔·아르메니아와 함께 희석시키는 장치였다.

1922년 3월 12일, 이 갈등을 덮고 티플리스에서 세 공화국 대표 회의가 열려 자캅카스 소비에트 사회주의 공화국 연방동맹(FSSSRZ)의 결성이 선언되었다. 군사, 경제, 재무, 대외무역 분야에서 통합 기구가 설치되었고, 각 공화국은 형식적 자치를 유지했지만 실질적 권한은 연방 평의회로 넘어갔다. 오르조니키제와 스탈린은 이것을 캅카스의 ''정상화''로 보았다. 므디바니와 그루지야 반대파는 이것을 정복의 제도화로 보았다. 똑같은 문서를 두고 이토록 정반대의 해석이 가능했다는 사실은, 소비에트 연방이라는 건물이 세워지기도 전에 그 설계도 자체가 이미 전쟁터였음을 보여준다.

아르메니아와 아제르바이잔의 지도부는 그루지야보다 연방에 덜 적대적이었다. 아르메니아는 튀르키예와의 국경에서 안보 보장이 절실했고, 아제르바이잔은 바쿠 석유의 수출 경로를 확보해야 했다. 연방은 이들에게 분쟁의 중재자이자 경제 재건의 틀이었다. 그러나 이 ''실용적 수용''조차도 자발적이라기보다는 오르조니키제가 주도한 카프비우로의 집요한 압박의 산물이었다. 이렇게 해서 연방 결성 과정에서 처음으로 드러난 패턴, 즉 모스크바가 밀고 지역 공산주의자들이 저항하며 그 저항이 ''민족적 일탈''로 낙인찍히는 구도는 이후 1922년 가을에 전개될 더 큰 충돌의 예고편이었다.

독립 공화국 간 조약이라는 형식이 갖는 서로 다른 의미는 [우크라이나 혁명과 전쟁](/commulingo/events/ukraine-1917-1921) 및 [발트 독립전쟁](/commulingo/events/baltic-wars-of-independence)의 1920년 강화와 비교해 읽을 수 있다.

## 자치화 대 연방: 레닌과 스탈린이 충돌한 9월

1922년 8월 10일, 정치국은 조직국에 독립 소비에트 공화국들과 러시아 소비에트 연방(RSFSR) 사이의 관계를 검토할 위원회를 설치하라고 지시했다. 민족인민위원 스탈린, 그리고리 소콜니코프, 세르고 오르조니키제, 크리스티안 라콥스키, 그리고 각 공화국 대표들이 위원으로 임명되었다. 위원회는 스탈린이 초안을 쥐고 있었다.

스탈린의 안은 단순했다. 우크라이나·벨로루시야·아제르바이잔·아르메니아·그루지야의 소비에트 공화국들을 「자치공화국 자격으로」 RSFSR에 편입시키는 것이었다. 이 공화국들의 외교·군사·교통·체신 인민위원부는 RSFSR의 해당 인민위원부에 합병되고, 재무·노동·식량·국민경제 인민위원부는 RSFSR의 지시에 복종하며, 독립적인 것은 교육·사법·내무·농업·보건뿐이었다. RSFSR 전러시아 중앙집행위원회와 인민위원회의 결정은 모든 공화국을 구속했다. 공화국들이 이미 누리고 있던 형식적 독립마저 중앙의 통제 아래 두는, 사실상의 흡수 통합이었다.

스탈린이 이 안을 밀어붙인 이유는 분명했다. 1922년 9월 22일 그가 레닌에게 보낸 편지에서 직접 밝혔듯, 4년간의 내전 동안 모스크바가 국제적 고립을 돌파하기 위해 민족 문제에서 「자유주의를 과시할 수밖에 없었던」 결과, 각 공화국의 공산주의자들 사이에 「진짜 사회독립주의자들, 모든 의미에서 진정한 독립을 요구하는」 세력이 자라났다는 것이다. 스탈린에게 독립 공화국들의 연방이란 처음부터 진지한 것이 아니었고, 「게임」이었으며, 그것을 곧이곧대로 믿는 자들이 문제였다.

위원회는 9월 23일과 24일 뱌체슬라프 몰로토프의 사회로 회의를 열어 스탈린 안을 가결했다. 그루지야 대표 폴리카르프 므디바니만이 반대표를 던졌고, 우크라이나 대표 그리고리 페트롭스키는 기권했다. 그루지야 공산당 중앙위원회는 이미 9월 15일 스탈린의 테제를 검토한 뒤 「자치화 형태의 연방은 시기상조」이며 「독립의 모든 속성이 보존되어야 한다」고 결의한 상태였다. 벨로루시야 당 중앙위원회도 독립 공화국들 사이의 조약 관계 유지를 지지했다. 우크라이나 당 중앙위원회는 아예 논의조차 하지 않았다. 크림에서 휴양 중이던 라콥스키는 9월 28일 스탈린에게 장문의 반대 서한을 보내 이 안이 「독립 공화국들의 형식적 폐지」이며 프롤레타리아 러시아의 해방적 역할을 훼손한다고 경고했다.

9월 25일, 위원회의 모든 자료, 즉 스탈린의 초안, 표결 결과, 각 공화국 당 중앙위원회의 결의가 고르키의 병상에 있던 레닌에게 보내졌다. 레닌은 즉시 스탈린을 불러 2시간 40분 동안 면담했고, 전날에는 소콜니코프를, 다음 날에는 므디바니를 만났다. 그리고 9월 26일, 정치국 위원들을 위한 서한을 카메네프에게 보냈다. 이것이 연방 결성의 전체 궤도를 바꾼 문서다.

레닌의 서한은 놀라울 만큼 실무적이고 온건한 어조로 시작된다. 「스탈린은 약간 서두르는 경향이 있다」고 지적한 뒤, 스탈린이 이미 한 가지 양보에 동의했음을 알렸다: 1조에서 「RSFSR에의 편입」 대신 「RSFSR과 함께 유럽과 아시아 소비에트 공화국 연방으로의 형식적 통합」이라는 표현으로 바꾸기로 했다는 것이다. 레닌은 이어서 RSFSR의 전러시아 중앙집행위원회와 별도로 「유럽과 아시아 소비에트 공화국 연방의 연방 전연방 중앙집행위원회」를 두고, 합병되는 인민위원부들에도 각 공화국 대표를 파견하며, 모든 변경은 공화국 중앙집행위원회들의 합의로 하라고 제안했다.

핵심 문장은 이것이다: 「중요한 것은 ''독립파''에게 먹이를 주지 않는 것, 그들의 독립을 파괴하지 않는 것, 그리고 새로운 층, 즉 대등한 공화국들의 연방을 하나 더 만드는 것이다.」

레닌은 스탈린을 공개적으로 공격하지 않았다. 그가 므디바니에 대해 「''독립주의'' 혐의를 받는」이라고 따옴표를 친 것에서 드러나듯, 스탈린의 ''사회독립주의자''라는 낙인을 조용히 무효화하면서도 정면 충돌은 피한 것이다. 그러나 스탈린은 굴욕을 느꼈다. 9월 27일 그가 정치국에 보낸 답신에서, 연방안 자체는 수용하면서도 「이 ''서두름''이 레닌 동지의 민족적 자유주의라는 먹이를 ''독립파''에게 주고 있다」고 반격했다. 이튿날 정치국 회의에서 그와 카메네프가 주고받은 쪽지에는 더 적나라한 감정이 드러난다. 카메네프가 「일리치가 독립을 지키기 위한 전쟁에 나섰다」고 적자, 스탈린은 이렇게 답했다: 「일리치에 대해서는 단호함이 필요하다. 만약 그루지야 멘셰비키 한 쌍이 그루지야 공산주의자들에게 영향을 주고, 그들이 다시 일리치에게 영향을 준다면, 도대체 ''독립''이 무슨 상관이란 말인가?」 카메네프의 응답은 현실적이었다: 「블라디미르 일리치가 고집하는데, 저항하면 더 나쁠 거야.」 스탈린: 「모르겠다. 그가 하고 싶은 대로 하게 두지.」

10월 6일, 레닌이 건강 문제로 불참한 가운데 열린 중앙위원회 전원회의는 레닌이 수정한 연방안을 채택했다. 스탈린은 물러섰고, 자치화안은 폐기되었다. 므디바니가 후일 기록했듯, 「처음에는 (레닌 없이) 우리를 주먹다짐하듯 때리고 조롱했지만, 레닌이 개입하자 사태는 공산주의적 이성 쪽으로 돌아섰다. 대등한 자발적 연방 원칙이 채택되었고, 대국주의자들이 오히려 공격받았다.」 그러나 이 승리는 불안정했다. 스탈린은 양보했을 뿐 설득된 것은 아니었다. 그가 레닌을 「민족적 자유주의자」라 부른 것은 이 논쟁의 마지막 말이 아니었다.

## 구타 한 방과 대회 하루: 그루지야 사건에서 볼쇼이 극장까지

10월 중앙위원회 총회가 레닌의 대등한 연방안을 채택한 지 사흘 만에, 그루지야 공산당은 균열했다. 므디바니와 마하라제가 이끄는 중앙위원회는 자캅카스 연방을 경유하지 않고 그루지야가 소련에 직접 가입할 것을 요구했다. 그들은 오르조니키제의 자캅카스 당위원회(자크크라이콤)가 공화국 주권을 짓밟고 있다고 보았다. 오르조니키제는 이를 ''민족 일탈''로 간주했다. 10월 21일 새벽 2시 55분, 므디바니는 티플리스에서 직통 전신으로 카메네프와 부하린에게 오르조니키제의 ''폭정''을 호소했다. 같은 날 레닌은 므디바니를 질책하는 전보를 보내며 오르조니키제 편에 섰지만, 그루지야 중앙위원회는 다음 날인 10월 22일 전원 사임이라는 전례 없는 수단을 택했다.

오르조니키제는 지체 없이 새로운 중앙위원회를 임명했다. 이제 전면적인 내부 전쟁이었다. 므디바니파는 모스크바에 항의 서한을 쏟아부었고, 오르조니키제의 카프비우로는 이들을 ''민족주의적 일탈자''로 낙인찍었다. 갈등은 11월에 절정에 달했다. 레닌의 개인 특사로 티플리스에 파견된 알렉세이 리코프가 오르조니키제의 아파트에 머물던 중, 리코프의 시베리아 유형 시절 동지이자 므디바니파 지지자인 노볼셰비키 아카키 코바히제가 방문했다. 대화는 필연적으로 그루지야 정치로 번졌고, 격분한 오르조니키제가 코바히제를 구타했다. 리코프와 그의 아내가 말려야만 사태가 진정되었다.

이 사건은 레닌에게 결정적이었다. 그는 펠릭스 제르진스키를 조사 위원장으로 티플리스에 파견했으나, 제르진스키는 오르조니키제와 스탈린에게 우호적인 보고서를 작성해 사건을 축소했다. 제르진스키가 모스크바로 돌아왔을 때 레닌은 이미 리코프로부터 진상을 파악한 뒤였다. 제르진스키의 보고서가 사실상 오르조니키제를 옹호했다는 점은 레닌을 격분시켰고, 이 분노는 곧 「민족 문제 또는 자치화에 관하여」의 구술로 이어졌다.

그러나 이 모든 격렬한 정치 투쟁과 병행하여, 연방 결성의 기계는 멈추지 않았다. 12월 29일, 4개 공화국─러시아·우크라이나·벨로루시야·자캅카스─의 전권 대표단 회의가 스탈린의 사회로 열려 결성 선언과 연방조약을 채택했다. 12월 30일 오후, 모스크바 볼쇼이 극장에 2,215명의 대의원이 모였다. 대의원의 90퍼센트 이상이 러시아 공산당 당원이었다. 병석의 레닌은 명예 의장으로 선출되었으나 참석하지 못했다. 칼리닌이 대회 의장을 맡았다.

스탈린이 결성 보고를 했다. 그의 연설은 소비에트 권력의 5년사를 정리하는 데 바쳐졌다: 내전의 폐허를 이겨내고 붉은 군대를 세운 첫 시기, 그리고 경제 복구를 위해 공화국들의 힘을 하나로 모아야 하는 지금. 그는 선언과 조약을 낭독하고 채택을 요청했고, 대회는 만장일치로 통과시켰다. 프룬제의 제안으로 문서는 각 공화국 중앙집행위원회의 최종 심의를 거쳐 확정하기로 했다. 네 공화국을 대표하는 4명의 의장─칼리닌, 페트롭스키, 체르뱌코프, 나리마노프─으로 구성된 371명의 연방 중앙집행위원회가 선출되었다.

대회장 밖에서 레닌은 이미 다음 전투를 준비하고 있었다. 그가 구술한 「민족 문제 또는 자치화에 관하여」의 첫 문장들은 대회 이틀째인 12월 31일에 받아쓰여졌다. 그루지야 중앙위원회 집단 사임부터 볼쇼이 극장의 박수갈채까지, 불과 70일이 걸렸다.

## 죽어가는 레닌과 살아있는 당: 마지막 구술에서 제12차 대회까지

1922년 12월 30일, 볼쇼이 극장에서 소비에트 연방의 탄생을 선포하던 바로 그날, 레닌은 모스크바 교외 고르키의 침실에서 개인비서 마리야 볼로디체바에게 「민족 문제 또는 자치화에 관하여」를 구술하기 시작했다. 이틀에 걸쳐 받아쓰인 이 글은 연방 결성을 축하하는 문서가 아니었다. 레닌은 "자치화라는 이른바 문제에 충분히 정력적으로 또 날카롭게 개입하지 못한 데 대해 러시아 노동자들 앞에 크게 죄를 지었다"고 적었다. 여름과 가을을 병으로 누워 보내면서 그 문제는 "나를 거의 완전히 비껴갔다"는 것이다.

레닌이 특히 격노한 것은 제르진스키가 보고한 그루지야 조사 결과였다. 오르조니키제가 그루지야 공산주의자 코바히제를 구타한 사건을 제르진스키가 대수롭지 않게 넘겼다는 이야기를 듣고, 레닌은 이렇게 썼다. "오르조니키제가 육체적 폭력을 휘두르는 데까지 이르렀다면 우리가 어떤 늪에 빠졌는지 짐작할 수 있다." 그는 스탈린의 "조급성과 행정가적 열중"과 "그 악명 높은 ''사회민족주의''에 대한 분노"가 "치명적인 역할을 했다"고 진단했고, 정치적 책임을 "물론 스탈린과 제르진스키에게" 물었다.

그러나 이 글의 진짜 폭탄은 인신 공격이 아니라 원칙의 재정립이었다. 레닌은 추상적인 민족주의 논의를 거부하고 "억압하는 민족의 민족주의와 억압받는 민족의 민족주의, 큰 민족의 민족주의와 작은 민족의 민족주의를 구별해야 한다"고 썼다. 억압해온 큰 민족의 인터내셔널리즘은 형식적 평등을 넘어, "억압하는 민족 쪽에서 실제 삶 속에서 생겨나는 불평등을 보상하는 그런 불평등"에까지 나아가야 한다는 것이다. 이 주장은 볼셰비키 민족정책의 철학적 기초를 근본적으로 다시 쓴 것이었다. 레닌은 한발 더 나아가, "다음 소비에트 대회에서 되돌아가서, 소비에트 사회주의 공화국 연방을 군사와 외교에만 남겨두고 다른 모든 면에서는 개별 인민위원부의 완전한 독자성을 회복하는" 방안까지 배제하지 말라고 촉구했다.

이 글은 당대회를 겨냥한 것이었으나, 레닌은 끝내 당대회에 나가지 못했다. 1923년 3월 5일, 세 번째 뇌졸중이 임박한 상태에서 그는 트로츠키에게 편지를 보냈다. "존경하는 트로츠키 동지, 그루지야 사건을 당 중앙위원회에서 방어하는 일을 맡아주시기를 진심으로 부탁합니다. 이 사건은 지금 스탈린과 제르진스키의 ''박해'' 아래 있습니다." 이튿날 그는 그루지야 반대파 지도자 므디바니와 마하라제에게 "나는 전심으로 그대들의 사건을 따르고 있다. 오르조니키제의 오만과 스탈린과 제르진스키의 방조에 분노한다"고 써 보냈다. 그러나 트로츠키는 레닌의 글을 정치국에 즉시 회부하지 않고 한 달 넘게 쥐고 있었다. 그 사이 그는 스탈린의 당대회 테제 초안에 수정을 가하는 방식으로 절충을 모색했다. 그는 대러시아 국수주의를 "주된 위험"으로 명기하는 데는 성공했지만, 정작 대회장에서 레닌의 글을 낭독하거나 므디바니를 위해 발언하지는 않았다.

제12차 당대회(1923년 4월 17-25일)는 레닌이 불참한 첫 대회였다. 카메네프는 개회사에서 레닌이 "곧 다시 세계혁명의 키를 잡을 것"이라고 했지만, 대회의 실질적 무게중심은 스탈린에게로 옮겨가고 있었다. 레닌의 글은 대회 본회의장이 아니라 ''지도자 회의''(세니오렌-콘벤트)에서만 낭독되었고, 카메네프는 므디바니가 그 글을 인용하려는 시도를 저지했다.

스탈린은 민족 문제에 관한 대회 보고에서 두 개의 일탈, 즉 대러시아 국수주의와 지방 민족주의를 모두 공격했다. 대러시아 국수주의를 "주된 위험"으로 인정하면서도, 그는 "민족 문제에는 한계가 있다"며 "노동계급의 권력이라는 더 중요한 문제" 앞에서는 민족자결권도 제한될 수 있음을 분명히 했다. 이는 레닌 구술의 급진적 결론, 즉 연방을 군사·외교로 축소하라는 제안을 우회하는 논리였다.

진짜 싸움은 민족문제 분과회의에서 벌어졌다. 우크라이나 정부수반 라콥스키는 연방의 창설 자체를 "거대한 파괴"라고 부르며, 공화국들의 주권을 형해화하는 중앙집권화를 맹비판했다. 그는 레닌의 12월 구술을 직접 거론하며, 중앙이 공화국의 권한을 잠식할수록 연방은 종이 위의 글자에 불과해질 것이라고 경고했다. 스크리프니크도 우크라이나의 구체적 사례를 들어 "형식적 평등만으로는 충분하지 않다"는 레닌의 논점을 보강했다.

그러나 최종 결의는 양쪽이 모두 일부 승리한 타협이었다. 대러시아 국수주의가 주된 위험으로 명시되었고, 코레니자치야, 즉 각 공화국에서 민족어로 행정·교육·출판을 운영하고 민족 간부를 체계적으로 양성하는 정책이 공식 당 노선으로 채택되었다. 이는 당대 세계에서 유례를 찾기 어려운, 국가가 소수민족의 발전을 제도적으로 지원하는 선언이었다. 하지만 동시에 연방 중앙의 강력한 권한은 유지되었고, 당의 단일한 중앙집권 체제 안에서 공화국 당 조직들은 모스크바 정치국의 결정에 복종하는 지위를 확정받았다. 레닌이 마지막 구술에서 경고한 긴장, 곧 형식적 연방과 실질적 중앙집권 사이의 모순은 이미 대회장 안에서 완성된 형태로 존재하고 있었다. 이 글은 1956년까지 공개되지 않았다.

## 헌법이라는 전장: 연방과 공화국 사이의 권력 배분

1922년 12월 30일의 연방 결성 선언과 조약은 새 국가의 윤곽만 그렸을 뿐, 구체적인 권력 배분은 헌법으로 채워야 했다. 1923년 1월 10일, 연방 중앙집행위원회 상임위원회는 예산·최고재판소·국기와 국장·인민위원부 구성·중앙집행위원회 규정·인사를 각각 다룰 6개 위원회를 설치했다. 그해 4월의 제12차 당대회가 민족 문제의 큰 방향을 정했다면, 헌법 초안 작업은 그 방향을 조문으로 번역하는 싸움이었다.

초안을 둘러싼 가장 치열한 충돌은 인민위원부의 구조에서 일어났다. 헌법 제50조는 연방 인민위원부를 세 부류로 나누었다. 외무·군사해군·대외무역·교통·체신의 5개 인민위원부는 ''전연방 인민위원부''로서 공화국들에 직속 대표만 두었고, 공화국 정부를 거치지 않았다. 최고경제회의·재정·노동·노동자농민감독·식량의 5개는 ''통합 인민위원부''로 불렸는데, 모스크바의 연방 인민위원부와 공화국의 동명 인민위원부가 이중으로 지휘 계통을 이루었다. 나머지 교육·보건·사법·내무·농업·사회보장은 순수한 공화국 인민위원부로 남아, 헌법상 연방이 개입할 수 없는 공화국의 고유 사무였다. 이 삼층 구조는 연방과 공화국 사이의 권력 배분을 조문화한 것이면서, 동시에 중앙집권화의 통로이기도 했다. 통합 인민위원부는 공화국이 형식적으로 보유했지만, 운영 지침과 예산·인사는 연방 인민위원부가 결정했다.

라콥스키가 이 구조에서 본 것은 ''죽은 손의 중앙집권''(dead-handed centralism)이었다. 그는 1923년 6월의 당 중앙위원회 회의에서 스탈린의 안이 연방을 ''더 중앙집권적으로'' 비틀고 있다고 항의했다. "우리 우크라이나인들은 스탈린보다 덜 공산주의자가 아니라고 생각한다"는 그의 발언은 회의록에 남았다. 스탈린은 라콥스키와 스크리프니크의 입장을 ''연방이 아니라 연합(confederation)을 요구하는 것''이라고 반박했고, 다수는 스탈린 편에 섰다. 라콥스키가 끝까지 싸운 조항은 제59조였다. 공화국 중앙집행위원회가 연방 인민위원부의 명령이 ''연방 헌법·연방 법률·공화국 법률과 명백히 저촉될 경우'' 그 효력을 정지할 수 있다는 이 조항은, 그에게 공화국 주권의 마지막 보루였다. "개별 공화국의 주권은 조약에 명시된 범위 내에서만, 그리고 연방 관할의 범위 내에서만 제한된다"는 그의 주장은 받아들여지지 않았지만, 조문 자체는 남았다.

입법부 구조도 첨예한 논쟁의 대상이었다. 헌법은 연방 중앙집행위원회를 양원제로 설계했다. 인구 비례로 선출된 371명의 연방 소비에트와, 각 연방 공화국에서 5명·각 자치공화국에서 1명씩 파견된 민족 소비에트였다. 12차 당대회의 민족 분과 회의에서 라콥스키는 러시아 연방에 속한 15개 자치공화국·자치주가 우크라이나나 벨라루스와 동등한 표를 행사하면, 러시아 연방이 전체 360석 중 최소 280석을 차지하게 된다고 지적했다. 그는 어느 한 공화국도 상원 의석의 5분의 2를 넘을 수 없다는 수정안을 냈다. 스탈린은 이를 ''국가 물신숭배(state fetishism)''라고 불렀고, 표결에서 부결시켰다. 러시아 연방의 압도적 비중은 그대로 제도화되었다.

1923년 6월 26~27일의 당 중앙위원회 전원회의에서 헌법 초안이 논의·보완·승인되었고, 7월 6일 연방 중앙집행위원회 제2차 회기는 「소비에트 사회주의 공화국 연방 헌법의 시행에 관하여」라는 결의와 함께 초안을 승인했다. 이 시점부터 헌법은 사실상 효력을 가졌다. 이후 각 공화국의 중앙집행위원회에서 심의를 거쳐, 1924년 1월 31일 제2차 연방 소비에트 대회가 만장일치로 최종 비준했다. 72개 조문으로 확장된 최종본은 원래의 결성 선언과 조약을 그대로 첫머리에 두었고, 제4조에 "각 연방 공화국은 연방으로부터 자유로이 탈퇴할 권리를 보유한다"는 문구를 명시했다. 그러나 같은 헌법 제1조 (w)항은 연방이 "본 헌법에 저촉되는 공화국 소비에트 대회와 중앙집행위원회의 행위를 폐기할 수 있다"고 규정했다. 주권과 중앙집권은 같은 문서 안에 나란히 새겨졌다.

## 민족을 만드는 국가: 코레니자치야의 현장

1923년 여름, 우크라이나 정부는 두 개의 법령으로 코레니자치야의 실행을 시작했다. 7월 27일 ''학교·교육·문화 기관의 우크라이나화'' 법령은 2년 안에 모든 학교를 우크라이나어로 전환하라고 명령했다. 8월 1일 ''언어 평등 보장과 우크라이나 문화 발전'' 법령은 공무원에게 2년 안에 우크라이나어를 습득하도록 요구하고, 모든 공문서가 우크라이나어로 작성되어야 한다고 규정했다. 문제는 이 법령을 집행해야 할 당과 국가 기구 자체가 압도적으로 러시아어를 쓰고 있었다는 점이다. 1922년 우크라이나 공산당(CP(B)U) 당원 중 우크라이나인은 23%에 불과했고, 우크라이나어를 구사할 수 있는 당원은 11%였다.

저항은 즉각적이었다. CP(B)U의 실권자 드미트로 레비드는 우크라이나화를 ''페틀류라 분자들과의 타협''이라고 공격했다. 그러나 모스크바는 물러서지 않았다. 1925년 4월 당 중앙위원회는 우크라이나화를 가속하라는 결의를 채택했고, 같은 해 스탈린은 CP(B)U 제1서기로 러시아어를 모어로 하는 라자르 카가노비치를 임명했다. 카가노비치는 오히려 자신이 러시아어 화자이기에 거부할 명분이 없다는 역설적 논리로 우크라이나화를 밀어붙였다. 지연하는 공무원은 해고 통보를 받았고, 기관에 불시에 들이닥치는 ''우크라이나화 감독관'' 제도까지 도입되었다.

교육 부문의 변화가 가장 극적이었다. 1922-23학년도에 우크라이나어 학교에 재학 중인 학생은 50%에 못 미쳤으나, 1932-33학년도에는 88%에 도달했다. 대학 교육에서도 1926년 우크라이나어 강의 비율이 33%였던 것이 1929년에는 58%로 올랐다. 신문 발행 부수로 보면 1925년 우크라이나어 신문이 전체의 50%였으나 1932년에는 89%가 되었다. 극장 공연의 4분의 3이 우크라이나어로 올려졌고, 오데사와 키이우 영화 스튜디오에서는 우크라이나어 영화가 제작되었다.

이 급진적 전환의 배후에는 두 명의 교육인민위원이 있었다. 올렉산드르 슘스키(1925-27년)는 우크라이나화를 가장 공격적으로 추진하며 당 지도부에도 민족적 대표성을 요구했다. 그는 CP(B)U 제1서기 자리를 우크라이나인에게 넘기라고 스탈린에게 공개적으로 요구했다가 1927년 ''민족주의 일탈''로 해임되었다. 후임 미콜라 스크리프니크는 스탈린과 충돌하지 않는 선에서 우크라이나화를 더 멀리까지 밀고 나갔다. 우크라이나어 철자법을 러시아어의 영향에서 벗어나게 개정한 ''스크리프니크 철자법''(1928년)과 우크라이나어 학술 용어 사전 편찬이 그의 대표적 유산이다.

당과 국가 기구의 인적 구성도 바뀌었다. CP(B)U 당원 중 우크라이나인 비율은 1922년 23%에서 1933년 60%로 올랐다. 같은 기간 러시아인 비율은 54%에서 23%로 떨어졌다. 도시의 민족 구성도 움직였다. 1923년에서 1933년 사이에 하르키우의 우크라이나인 거주 비율은 38%에서 50%로, 키이우는 27%에서 42%로, 드니프로페트로우스크는 16%에서 48%로 상승했다.

우크라이나의 변화는 가장 크고 가장 잘 기록된 사례이지만, 코레니자치야는 연방 전역에서 동시에 진행된 실험이었다. 벨라루스에서는 1924년 벨라루스화가 선포되었고, 1920년대 중반까지 학교의 28%만이 벨라루스어로 가르쳤으나 1928년에는 80%에 육박했다. 중앙아시아에서는 문자가 없던 민족들에게 라틴 알파벳 기반의 표기 체계가 만들어졌다. 1926년 바쿠에서 열린 제1차 전연방 투르크학 회의는 튀르크계 언어들의 라틴 문자 전환을 결정했고, 아제르바이잔이 이를 선도했다. ''북방 위원회''는 시베리아와 극북의 소수 민족 30여 개에 문자를 보급하고 학교를 세웠다. 1926년 인구 조사에 따르면 카자흐스탄의 문자 해독률은 25.2%, 우즈베키스탄은 10.6%, 타지키스탄은 3.7%에 불과했으나, 10년 뒤에는 대부분의 공화국에서 70%를 넘어섰다.

그러나 코레니자치야에는 애초부터 긴장이 내장되어 있었다. 이 정책의 목표는 민족의 자유로운 발전이 아니라, 민족이라는 형식을 통해 소비에트 권력을 강화하는 것이었다. 민족어 학교와 신문, 민족 간부가 늘어날수록, 중앙과 다른 이해관계를 가진 민족 엘리트도 자라났다. 우크라이나의 슘스키와 스크리프니크, 벨라루스의 프리셰프 등은 처음에는 모스크바가 보낸 집행자였으나 시간이 지나면서 자기 공화국의 이익을 대변하는 목소리가 되었다. 테리 마틴이 ''소수민족 우대 제국''이라 부른 이 체제는, 민족을 키우기 위해 설계되었으면서도 민족이 키워지면 그것을 위험으로 간주해야 하는 모순을 안고 있었다. 1932년 12월, 우크라이나화의 종말을 알리는 첫 조치가 RSFSR 내 우크라이나어 교육의 전면 폐지로 나타났을 때, 그 모순의 대가는 이미 집단화와 기근 속에서 계산되고 있었다.

## 연방인가 제국인가: 한 세기의 논쟁

소련 결성으로 무엇이 해결되었고 무엇이 해결되지 않았는지에 대해서는 역사가들 사이에 100년 가까이 날카로운 대립이 이어져 왔다. 1922년 12월의 타협은 적어도 세 가지 긴장을 봉합하지 않은 채 출발했다. 첫째, 모든 연방 공화국에 탈퇴권을 명시한 헌법과 단일한 중앙집권적 당 사이의 모순이었다. 둘째, 민족 공화국들 사이의 대등한 연방이라는 원칙과 러시아 공화국의 압도적 비중이라는 현실이었다. 셋째, 코레니자치야로 대표되는 민족 육성 정책과 당이 지향하는 단일한 프롤레타리아 국제주의 사이의 충돌이었다. 이 세 긴장은 1991년 연방의 종말까지 소련을 따라다녔다.

냉전기 서방 역사학을 지배한 것은 리처드 파이프스의 해석이었다. 1954년 출간된 『소련의 형성』에서 파이프스는 소비에트 연방제를 겉치레에 불과하다고 보았다. 공화국들의 형식적 주권은 모스크바가 주변부를 장악하기 위한 수단이었으며, 연방 구조는 중앙집권을 은폐하는 위장막이었다. 파이프스에게 소련은 "제국의 탈을 쓴 제국"이었고, 1991년의 붕괴는 이 본질이 드러난 필연적 결말이었다.

1991년 소련 붕괴와 기록물 개방은 이 구도를 근본적으로 바꾸었다. 테리 마틴은 2001년 『소수민족 우대 제국』에서 소련을 "제국"으로 보면서도 정반대의 결론에 도달했다. 마틴은 방대한 당 기록물을 분석해, 1920년대 소비에트 국가가 비러시아 민족의 언어·교육·간부를 전례 없이 체계적으로 육성했음을 실증했다. 그가 "소수민족 우대"라 명명한 코레니자치야는 단순한 위장이 아니라 실제 자원이 투입된 국가 정책이었다. 마틴의 해석에서 소련은 제국주의 열강들과는 반대 방향으로 움직인 독특한 다민족 국가였다.

프랜신 허쉬는 2005년 『민족들의 제국』에서 또 다른 각도에서 개입했다. 허쉬는 소련의 민족 정책이 제정 러시아의 민족지학자들과 그 지식을 계승하여 전개되었음을 보여주며, 마틴이 강조한 단절보다 연속성에 주목했다. 두 연구는 방법론과 강조점에서 갈렸지만, 공통적으로 1991년 이전의 서방 연구가 소련 민족정책의 실제 작동을 과소평가했음을 입증했다.

오늘날 논쟁의 한 축은 "연방 대 제국"이라는 이분법 자체를 문제 삼는다. 정치학자 타니아 라파스는 2012년 저서에서 미국, 스위스 등 서구 연방국들의 형성 과정도 폭력과 강제로 점철되었음을 지적하며, 소련의 "가짜 연방"론이 규범적 잣대에 기댄 이중기준이라고 비판했다. 한편 콜로니츠키는 소련 결성을 당내 다양한 민족공산주의 세력들 사이의 "타협"으로 보면서, 어떤 단일한 설계자의 청사진이 아니라 내전이라는 극한 조건에서 살아남기 위한 냉혹한 선택들의 산물이었다고 평가한다.

소련 결성이라는 사건이 남긴 가장 깊은 물음은 오늘날까지 닫히지 않았다. 제국의 폐허 위에 대등한 민족들의 연방을 세우려 했던 그 실험은 형식이 현실을 바꿀 수 있는지, 다민족 국가가 중앙집권 없이 존속할 수 있는지, 그리고 제국의 유산은 제도로 청산될 수 있는지를 물었다. 1991년 이후의 세계는 이 물음들에 대한 답을 다른 방식으로 내고 있지만, 물음 자체는 1922년 12월 볼쇼이 극장의 것이 그대로 남아 있다.

## 정착된 것, 미해결된 것, 그리고 한 세기의 평가

1922-24년의 결성 과정이 정착시킨 것은 세 가지다. 첫째, 국가 형태로서의 연방이다. 러시아가 다른 공화국들을 삼키는 자치화가 아니라, 명목상으로나마 대등한 공화국들이 모인 하나의 연방이 수립되었다. 이 결과는 레닌의 9월 서한과 12월 구술이라는 두 차례 개입 없이는 불가능했다. 둘째, 민족을 인정하고 육성하는 국가다. 제12차 대회의 코레니자치야 결의는 공화국들에 민족어 학교, 민족 간부, 민족문화 기관을 세울 책임과 자원을 동시에 부여했다. 셋째, 탈퇴권을 포함한 헌법적 건축이다. 1924년 헌법 제4조는 각 연방 공화국이 ''자유로이 연방을 탈퇴할 권리''를 명시했고, 이 조항이 1991년 12월 벨라베자 협정의 법적 근거가 될 것이라는 사실을 그 누구도 예측하지 못했다.

그러나 결성 과정이 해결하지 못한 핵심 긴장은 단일한 당의 중앙집권과 연방적 분권 사이의 모순이었다. 정치국이 공화국 간부의 임면을 결정하고, 국가보안기관이 모스크바의 명령계통 아래 있었으며, 연방 중앙집행위원회는 당의 결정을 추인하는 기구였다. 이 모순은 1930년대 스탈린의 ''위대한 후퇴'' 속에서 폭발했다. 스크리프니크 사건, 우크라이나화의 축소, 러시아어와 러시아 민족의 위상 재확립이 이어졌고, 1920년대의 소수민족 우대 연방은 점차 러시아인이 ''동등한 자들 중 첫째''인 위계적 제국으로 전환되었다.

냉전기 서방 역사학의 지배적 해석은 리처드 파이프스의 『소련의 형성』(1954)으로 대표된다. 파이프스에게 소련은 ''간판만 바꿔 단'' 제국이었고, 연방의 외피는 민족을 분할 통치하기 위한 위장술에 불과했다. 이 시각은 1990년대 ''제국 전환''의 학자들인 테리 마틴, 로널드 수니, 프랜신 허쉬에 의해 근본적으로 수정되었다. 마틴이 ''소수민족 우대 제국''이라는 역설적 개념을 제안한 것은, 소련이 제국적 중앙집권과 민족 육성이라는 양립 불가능해 보이는 두 과제를 동시에 수행했기 때문이다. 허쉬는 소련의 민족 공화국들이 단순히 모스크바가 그은 선이 아니라, 옛 제국의 민족지학자들이 축적한 지식과 현지 엘리트들의 정치적 협상의 산물임을 밝혔다. 수니는 민족 정체성이 ''허위의식''이 아니라 실재하는 정치적 힘이었으며, 연방 구조가 오히려 민족적 동원의 틀을 제공했다고 분석했다.

오늘날의 평가는 두 극단을 거부한다. 소련은 차르 제국의 단순한 계승도, 순수한 반제국적 해방 기획도 아니었다. 그것은 민족을 억압하는 동시에 생산하는, 중앙집권화하는 동시에 토착화하는, 파괴하는 동시에 건설하는 모순된 국가였으며, 그 모순이야말로 연방을 70년 가까이 유지시킨 동력이자 1991년 파국의 설계도였다.
',
  body_en='## On the Ruins of Empire: Six Republics Forged by Civil War and Treaty

In December 1922, what the Bolsheviks held across the territory of the former Russian Empire was not a single state but six formally independent countries. The Russian Soviet Federative Socialist Republic (RSFSR), the Ukrainian Soviet Socialist Republic, the Byelorussian Soviet Socialist Republic, and the three Caucasus republics (Azerbaijan, Armenia, and Georgia) each existed as a separate sovereign Soviet republic. To understand how this strange map came about, one must go back to November 1917.

On 15 November 1917 (2 November Old Style), the Bolshevik government issued the Declaration of the Rights of the Peoples of Russia. Signed by Lenin and Stalin, the document proclaimed equality and sovereignty for all the peoples of the former empire, including the right to secession and the formation of independent states. For the Bolsheviks, who had condemned the Tsarist order as a ''prison of nations,'' this was both an ideological commitment and a practical instrument for securing non-Russian support during the Civil War. Finland, Poland, and the three Baltic states exercised this opportunity to secede permanently; in Ukraine, Belarus, and the Caucasus, independent republics were proclaimed, only to be Sovietized as the Red Army advanced. Georgia alone persisted as an independent state under a Menshevik government until February 1921.

As the Civil War entered its final phase in the autumn of 1920, the Bolshevik leadership confronted a hard reality. The industrial heartland of central Russia could not function without Ukrainian grain, Donbas coal, and Caucasian oil. Lenin himself wrote in October 1920: ''Central Russia, that hearth of the world revolution, cannot hold out long without the assistance of the border regions, which abound in raw materials, fuel, and foodstuffs.'' This is what gave rise to the bilateral treaty system of 1920–21. On 30 September 1920, a military and economic alliance between the RSFSR and Azerbaijan; on 28 December 1920, the Workers'' and Peasants'' Union Treaty between the RSFSR and Ukraine; on 16 January 1921, an analogous treaty with Belarus: these agreements preserved the formal sovereignty of each republic while integrating the key sectors of military affairs, the economy, and foreign policy. As early as 27 January 1920, the Ukrainian Revolutionary Committee had gone so far as to declare that all decrees and resolutions of the Ukrainian SSR relating to bodies connected by agreement with the RSFSR were to be annulled and replaced by RSFSR decrees.

Yet this treaty system carried a fundamental contradiction. Constitutionally, each republic was sovereign, but the Russian Communist Party (Bolsheviks), which governed all of them, was a single centralized organization. The ''independence'' of the republics was independence on paper; real decisions were taken by the Politburo of the Party Central Committee in Moscow. This contradiction, born of civil war, was tolerated as a wartime expedient but could not be sustained once postwar reconstruction began.

The situation in 1921 was urgent. After World War I and the Civil War, industrial output had collapsed to below 20 percent of its 1913 level. The great famine of 1921–22 claimed roughly five million lives across the Volga region, Ukraine, and the Caucasus. The forced grain requisitions of War Communism had triggered the Tambov Rebellion and the Kronstadt uprising, and in March 1921 Lenin was compelled to retreat to the New Economic Policy (NEP).

Diplomatic pressure was mounting as well. At the Genoa Conference in April 1922, the former Entente powers demanded that the Soviet regime assume the Tsarist debts and compensate for the nationalization of foreign assets. Ahead of the conference, People''s Commissar for Foreign Affairs Georgy Chicherin sent an official inquiry to the RSFSR authorities asking whether the RSFSR could legally represent the interests of the other Soviet republics, a moment that laid bare the need to bind the republics together into a single diplomatic front. The separate Treaty of Rapallo, signed between Soviet Russia and Germany on 16 April 1922, saw Germany de facto recognize the RSFSR''s authority over its ''federated republics.''

In short, by mid-1922 six Soviet republics coexisted on the ruins of the old empire, but their relations were legally and practically ambiguous. Economic reconstruction demanded a unified plan; the international arena demanded a single voice; and the contradiction of one party governing multiple states was becoming harder to sustain. The fight over the form of the state (Stalin''s autonomization plan versus Lenin''s federation) thus began in a pot that was already boiling.

## Independent in Form, One State in Fact: The Treaty System and the Transcaucasian Federation

As the Civil War drew to a close, six Soviet republics coexisted on the territory of the former Russian Empire: the RSFSR, Ukraine, Belorussia, Azerbaijan, Armenia, and Georgia. In form, these republics were fully independent sovereign states, each with its own constitution, government, and even a commissariat of foreign affairs. But the shared battlefield of the Civil War had already woven them into a single functioning state apparatus. The Red Army''s high command was in Moscow; the railway network and telegraph operated as a single system; and the economy, under War Communism, was de facto unified.

It was this contradictory condition, formal independence alongside practical integration, that a series of bilateral treaties institutionalized between the autumn of 1920 and early 1921. First came the Military and Economic Union Treaty between the RSFSR and Azerbaijan on 30 September 1920, followed by the Workers'' and Peasants'' Union Treaty between the RSFSR and Ukraine on 28 December 1920, and an identically named treaty between the RSFSR and Belorussia on 16 January 1921. The Ukrainian treaty became the model for the system. Its preamble declared mutual recognition of the two republics'' "independence and sovereignty," yet simultaneously declared seven commissariats "unified": military and naval affairs, the Supreme Council of the National Economy, foreign trade, finance, labor, transport, and posts and telegraph. These unified commissariats were placed under the RSFSR Council of People''s Commissars (Sovnarkom); the Ukrainian side was permitted only to station "plenipotentiaries" for those departments within its own Sovnarkom. Ukrainian representatives participated by sending delegates to the All-Russian Congress of Soviets and the All-Russian Central Executive Committee (VTsIK), but decision-making authority rested with Moscow. In short, these treaties proclaimed that the republics "united" as equal sovereign states while creating a structure that governed through the institutions of the RSFSR.

This treaty system immediately generated two opposing political meanings. On one hand, the very fact that the republics concluded treaties with the RSFSR as "independent states" confirmed their sovereignty vis-a-vis the outside world: Ukraine even signed a separate treaty with Turkey in early 1922. On the other hand, the operation of the unified commissariats rendered republican borders practically irrelevant, and for some leaders in Moscow, particularly People''s Commissar for Nationalities Joseph Stalin, this system was merely a transitional stage on the road to full incorporation into the RSFSR.

In the Caucasus, this tension expressed itself most sharply. After Azerbaijan (April 1920), Armenia (November 1920), and Georgia (February 1921) were each occupied by the Red Army and Sovietized in succession, the three republics found themselves in a vortex of border disputes, interethnic conflict, and economic collapse. The oil industry of Baku, Georgian tea cultivation, and the railway network could not be operated in separation. Sergo Ordzhonikidze, who headed the Caucasian Bureau (Kavbiuro) of the RCP(b) Central Committee, was convinced that the only way to bring order out of this chaos was to bind the three republics into a single federation. Stalin fully agreed, and Lenin initially raised no objection.

A substantial section of the Georgian Communist Party, however, regarded this project as the liquidation of Georgian sovereignty. Underlying the dispute was an earlier confrontation: in the summer of 1921, Stalin had removed Filipp Makharadze as chairman of the Georgian Revolutionary Committee for being too lenient toward the Mensheviks and too insistent on national autonomy, replacing him with Polikarp Mdivani. Yet it was this same Mdivani who now became Moscow''s most stubborn opponent on the federation question. He and his comrades argued that Georgia, like the other republics, should join the future Soviet Union directly as an individual member, not through the intermediate stage of a Transcaucasian federation. In their eyes, the Transcaucasian Federation was a device for diluting Georgian statehood alongside Azerbaijan and Armenia.

On 12 March 1922, overriding this opposition, a conference of representatives from the three republics convened in Tiflis and proclaimed the establishment of the Federative Union of Socialist Soviet Republics of Transcaucasia (FSSSRZ). Unified bodies were created for military affairs, the economy, finance, and foreign trade; each republic retained formal autonomy, but substantive authority passed to the Union Council. Ordzhonikidze and Stalin saw this as the "normalization" of the Caucasus. Mdivani and the Georgian opposition saw it as the institutionalization of conquest. That the same document could sustain two such contradictory interpretations reveals that, even before the edifice of the Soviet Union was erected, its blueprint was already a battlefield.

The leaderships of Armenia and Azerbaijan were less hostile toward the federation than the Georgians. Armenia desperately needed security guarantees on its border with Turkey; Azerbaijan needed to secure export routes for Baku''s oil. For them, the federation offered a framework for arbitration of disputes and economic reconstruction. But even this "pragmatic acceptance" was less voluntary than it appeared: it was substantially the product of relentless pressure from Ordzhonikidze''s Kavbiuro. The pattern that first emerged in this episode, Moscow pushing while local communists resisted and that resistance was branded a "national deviation," was a preview of the larger confrontation that would unfold in the autumn of 1922.

The differing meanings of treaties between formally independent republics can be compared with [Ukraine’s revolution and wars](/commulingo/events/ukraine-1917-1921) and the 1920 settlements in the [Baltic wars of independence](/commulingo/events/baltic-wars-of-independence).

## Autonomization vs. Federation: The September Lenin and Stalin Clashed

On 10 August 1922, the Politburo instructed the Orgburo to set up a commission to examine the relations between the RSFSR and the independent Soviet republics. Appointed to it were Stalin as Commissar of Nationalities, Grigory Sokolnikov, Sergo Ordzhonikidze, Christian Rakovsky, and representatives of each republic. Stalin held the pen.

His draft was simple: the Soviet republics of Ukraine, Byelorussia, Azerbaijan, Armenia, and Georgia were to ''enter'' the RSFSR ''with the rights of autonomous republics.'' Their commissariats for foreign affairs, defense, transport, and post and telegraph would be merged with those of the RSFSR; their commissariats for finance, labor, food, and the national economy would be subject to RSFSR directives; only education, justice, internal affairs, agriculture, and health would remain independent. Decisions of the RSFSR All-Russia Central Executive Committee and Sovnarkom would bind every republic. It was de facto absorption: the formal independence the republics still enjoyed reduced to a shell under central control.

Stalin''s motive was explicit. As he wrote to Lenin on 22 September, four years of civil war had forced Moscow to ''demonstrate liberalism in the national question'' to break international isolation, and the result was the growth among republic communists of ''real and consistent social-independents demanding real independence in every sense.'' For Stalin, the union of independent republics had never been serious; it was a ''game,'' and the problem was those who took the words at face value.

Meeting on 23–24 September under Vyacheslav Molotov''s chairmanship, the commission approved Stalin''s draft. Only the Georgian representative Polikarp Mdivani voted against; the Ukrainian Grigory Petrovsky abstained. The Georgian party Central Committee had already resolved on 15 September, after reviewing Stalin''s theses, that ''a union in the form of autonomization of the independent republics is premature'' and that ''all attributes of independence should be preserved.'' The Byelorussian Central Committee likewise favored preserving treaty relations among independent republics. The Ukrainian Central Committee had not even discussed it. Rakovsky, on leave in Crimea, sent Stalin a long letter of dissent on 28 September, warning that the draft amounted to ''the formal abolition of the independent republics'' and would undermine proletarian Russia''s liberating role.

On 25 September all the commission''s materials (Stalin''s draft, the voting record, the resolutions of each republic''s party central committee) were sent to Lenin at his sickbed in Gorki. Lenin immediately summoned Stalin for a two-hour-forty-minute talk; the day before he had seen Sokolnikov, the next day he would see Mdivani. Then, on 26 September, he sent a letter for the Politburo members to Kamenev. This document changed the entire trajectory of the union''s formation.

Lenin''s letter opens in a strikingly practical, moderate tone. Noting that ''Stalin tends to be somewhat hasty,'' he reports that Stalin has already agreed to one concession: in Clause 1, instead of ''entry into the RSFSR,'' they would write ''formal unification with the RSFSR in a Union of Soviet Republics of Europe and Asia.'' Lenin then proposes: alongside the RSFSR''s All-Russia Central Executive Committee, create a ''Federal All-Union Central Executive Committee of the Union of the Soviet Republics of Europe and Asia''; let merged commissariats have representatives from each republic; make all changes by agreement of the republics'' central executive committees.

The core sentence reads: ''The important thing is not to provide material for the "pro-independence" people, not to destroy their independence, but to create another new storey, a federation of equal republics.''

Lenin did not attack Stalin openly. By placing the word ''independent'' in scare quotes when referring to Mdivani (''suspected of "independent" sentiments''), he quietly invalidated Stalin''s ''social-independist'' label while avoiding a direct clash. But Stalin felt the humiliation. In his reply to the Politburo on 27 September, while accepting the union formula itself, he struck back: ''There can hardly be any doubt that this "hastiness" gives nourishment to the "independents" at the expense of Comrade Lenin''s national liberalism.'' The exchange of notes between Stalin and Kamenev at the Politburo the next day was rawer still. ''Ilyich has gone to war in defense of independence,'' Kamenev wrote. Stalin answered: ''What is needed, in my opinion, is firmness against Ilyich. If a pair of Georgian Mensheviks influences the Georgian communists, and the latter influence Ilyich, then what has "independence" got to do with it?'' Kamenev''s reply was practical: ''I think that since Vladimir Ilyich insists, resisting will make things worse.'' Stalin: ''I don''t know. Let him do as he sees fit.''

On 6 October, the Central Committee plenum (Lenin absent due to his health) adopted the union formula Lenin had revised. Stalin backed down; the autonomization draft was dead. As Mdivani later recorded: ''At first (without Lenin) they beat us like bullies, mocking us, but then, when Lenin intervened, the matter turned toward communist reason. The voluntary union on the basis of equality was adopted, and the Great-Russian chauvinists themselves came under attack.'' But the victory was precarious. Stalin had conceded, not been convinced. His characterization of Lenin as a ''national liberal'' was not the last word in this dispute.

## One Blow and One Congress: From the Georgian Affair to the Bolshoi Theatre

Three days after the October Central Committee plenum adopted Lenin''s formula of a union of equals, the Georgian Communist Party split. The Central Committee led by Mdivani and Makharadze demanded that Georgia enter the USSR directly, not through the Transcaucasian federation. They saw Ordzhonikidze''s Transcaucasian party committee (Zakkraikom) as trampling republican sovereignty. Ordzhonikidze called it ''national deviation.'' At 2:55 a.m. on 21 October, Mdivani appealed by direct telegraph from Tiflis to Kamenev and Bukharin against Ordzhonikidze''s ''tyranny.'' The same day Lenin sent a telegram rebuking Mdivani, siding with Ordzhonikidze. Yet the next day, 22 October, the Georgian Central Committee took the unprecedented step of resigning as a body.

Ordzhonikidze immediately appointed a new Central Committee. Open internal war followed. The Mdivani group flooded Moscow with protest letters, while Ordzhonikidze''s Kavbiuro branded them ''national deviationists.'' The conflict peaked in November. Alexei Rykov, dispatched to Tiflis as Lenin''s personal emissary, was staying at Ordzhonikidze''s apartment when Akaki Kabakhidze, an Old Bolshevik and Mdivani supporter who had known Rykov in Siberian exile, came to visit. The conversation inevitably turned to Georgian politics. Ordzhonikidze, in a fury, struck Kabakhidze. The incident was stopped only by the intervention of Rykov and his wife.

This incident was decisive for Lenin. He sent Felix Dzerzhinsky to Tiflis to head an investigative commission, but Dzerzhinsky filed a report sympathetic to Ordzhonikidze and Stalin, downplaying the abuses. When Dzerzhinsky returned to Moscow, Lenin had already heard the truth from Rykov. That Dzerzhinsky''s report effectively defended Ordzhonikidze enraged Lenin, and that rage fed directly into the dictation of ''The Question of Nationalities or Autonomisation.''

Yet alongside all this furious political combat, the machinery of union formation never stopped. On 29 December, a conference of plenipotentiary delegations from the four republics, Russia, Ukraine, Byelorussia, and Transcaucasia, met under Stalin''s chairmanship and approved the Declaration and the Treaty on the Formation of the USSR. On the afternoon of 30 December, 2,215 delegates gathered in Moscow''s Bolshoi Theatre. Over 90 percent were members of the Russian Communist Party. Lenin, confined to his sickbed, was elected honorary chairman but could not attend. Kalinin chaired the congress.

Stalin delivered the founding report. He framed it as a summation of five years of Soviet power: the first period of civil war ruin, overcome to build the Red Army, and the present period in which the republics must pool their strength for economic recovery. He read out the Declaration and the Treaty and moved their adoption, which the congress passed unanimously. On Frunze''s motion, the documents were to be submitted for final review by each republic''s Central Executive Committee. A Union Central Executive Committee of 371 members was elected, with four chairmen representing the four republics: Kalinin, Petrovsky, Chervyakov, and Narimanov.

Outside the theatre, Lenin was already preparing his next battle. His dictations of ''The Question of Nationalities or Autonomisation'' were taken down on 31 December, the second day of the congress. From the collective resignation of the Georgian Central Committee to the applause in the Bolshoi, seventy days had passed.

## A Dying Lenin and a Living Party: From the Last Dictations to the Twelfth Congress

On 30 December 1922, as the Bolshoi Theatre proclaimed the birth of the Soviet Union, Lenin was in his room at Gorki outside Moscow dictating "The Question of Nationalities or Autonomisation" to his personal secretary Maria Volodicheva. Dictated over two days, it was no celebration. "I seem to have been very guilty before the workers of Russia," Lenin began, "for not intervening energetically and sharply enough in the notorious question of autonomization." Illness that summer and autumn had let the matter "pass me by almost completely."

What enraged him most was Dzerzhinsky''s report on Georgia. Hearing that Dzerzhinsky had dismissed Ordzhonikidze''s striking of the Georgian communist Kabakhidze, Lenin wrote: "If things had gone so far that Ordzhonikidze could lose control and resort to physical violence, you can imagine the swamp we have landed in." He diagnosed the "fatal role" played by Stalin''s "haste and his enthusiasm for administration" and "his spite against the notorious ''social-nationalism.''" He held "Stalin and Dzerzhinsky, of course" politically responsible.

The real explosive charge in the text, however, was not the personal indictment but the refounding of principle. Lenin rejected abstract talk of nationalism and insisted: "One must distinguish the nationalism of an oppressor nation from the nationalism of an oppressed nation, the nationalism of a big nation from that of a small nation." The internationalism of a formerly oppressing great nation required going beyond formal equality to "that inequality which would compensate, on the part of the oppressing nation, the big nation, for the inequality that emerges in actual life." This rewrote the philosophical basis of Bolshevik nationality policy. Lenin went further, urging the party not to rule out "returning at the next Congress of Soviets and leaving the union of Soviet socialist republics only in military and diplomatic respects, while restoring the full independence of the individual commissariats in all others."

The text was aimed at the party congress, but Lenin would never reach the rostrum. On 5 March 1923, with a third stroke imminent, he wrote to Trotsky: "Esteemed Comrade Trotsky! I would ask you very much to undertake the defense of the Georgian case at the Central Committee. The case is now under ''persecution'' by Stalin and Dzerzhinsky, and I cannot rely on their impartiality." The next day he told the Georgian opposition leaders Mdivani and Makharadze: "I follow your case with all my heart. I am outraged by Ordzhonikidze''s arrogance and the connivance of Stalin and Dzerzhinsky." But Trotsky kept Lenin''s text under wraps for more than a month. In the meantime he sought compromise by amending Stalin''s draft theses for the congress. He succeeded in naming Great-Russian chauvinism the "main danger," but on the congress floor itself he neither read Lenin''s text aloud nor spoke for Mdivani.

The Twelfth Party Congress (17–25 April 1923) was the first congress Lenin missed. Kamenev opened by assuring delegates that Lenin would "soon seize once more the helm of world revolution," but the congress''s real center of gravity was shifting toward Stalin. Lenin''s text was read only at the closed ''senior council'' (senioren-konvent) of delegation leaders, not on the congress floor, and Kamenev blocked Mdivani''s attempts to quote from it.

In his report on the national question, Stalin attacked two deviations: Great-Russian chauvinism and local nationalism. While acknowledging Great-Russian chauvinism as the "main danger," he insisted that "the national question has its limits": the "higher question of working-class power" could override the right to self-determination. This logic sidestepped the most radical conclusion of Lenin''s dictation, his proposal to shrink the union to military and diplomatic functions.

The real fight erupted in the congress''s national-section session. Rakovsky, the Ukrainian premier, called the creation of the USSR a "colossal break" (kolossal''naia lomka) and condemned the centralization that was hollowing out the sovereignty of the republics. Invoking Lenin''s December text directly, he warned that the more the center encroached on republican powers, the more the union would become a dead letter. Skrypnyk reinforced the point with concrete Ukrainian cases, insisting that formal equality alone was not enough.

Yet the final resolution was a compromise in which both sides won something. Great-Russian chauvinism was named the main danger, and korenizatsiya, the policy of running administration, schools, and publishing in national languages and systematically training national cadres in every republic, was adopted as official party line. It was a declaration, without precedent in the world of its time, committing the state to the institutional development of minority nations. But the center retained its strong powers, and within the single centralized party the republican party organizations remained subordinated to the decisions of the Moscow Politburo. The tension Lenin''s last dictations had warned of, between formal federation and substantive centralism, already existed in finished form on the congress floor. The text itself remained unpublished until 1956.

## The Constitution as Battlefield: Dividing Power Between Union and Republic

The Declaration and Treaty of 30 December 1922 had sketched only the outlines of the new state; the actual division of powers still had to be filled in by a constitution. On 10 January 1923, the Presidium of the Union Central Executive Committee set up six commissions: on the budget, the Supreme Court, the flag and coat of arms, the structure of the people''s commissariats, the regulations of the CEC, and personnel. If the Twelfth Party Congress of April 1923 had set the broad direction on the national question, the drafting of the constitution was the fight to translate that direction into articles.

The fiercest clash over the draft centered on the structure of the commissariats. Article 50 of the constitution divided the union people''s commissariats into three tiers. Five were "all-union" (Foreign Affairs, Military and Naval Affairs, Foreign Trade, Transport, and Post and Telegraph) and had only direct delegates in the republics, bypassing the republic governments entirely. Another five were "unified" (the Supreme Council of National Economy, Finance, Labor, Workers'' and Peasants'' Inspection, and Supplies), with commissariats of the same name in each republic forming a dual chain of command with Moscow. The remainder (Education, Health, Justice, Internal Affairs, Agriculture, and Social Security) remained purely republican commissariats, spheres into which the union constitution did not reach. This three-tier architecture was at once a codification of the power balance between union and republics and a channel for creeping centralization. The unified commissariats remained formally in republican hands, but their directives, budgets, and personnel were set by the union commissariats.

What Rakovsky saw in this edifice was "dead-handed centralism." At the June 1923 Central Committee conference on implementing the Twelfth Congress decisions, he protested that Stalin was giving the federation "a more centralist twist." "I consider that we Ukrainians are no less communist than Stalin," the transcript records him saying. Stalin shot back that Rakovsky and Skrypnyk were effectively demanding not federation but "confederation," and the majority sided with the General Secretary. The article Rakovsky fought for down to the wire was Article 59: the right of a republic Central Executive Committee to suspend orders of a union people''s commissariat when those orders were "in evident incompatibility with the federal constitution, federal legislation, or legislation of the member republic." For Rakovsky this was the last redoubt of republic sovereignty. His broader demand, that "the sovereignty of the individual republics of the Union is restricted only by the limits specified in the treaties and only within the limits of the Union''s jurisdiction," did not prevail, but the article itself survived.

The legislative structure was no less contested. The constitution created a bicameral CEC: a Federal Soviet of 371 members elected proportionally to population, and a Soviet of Nationalities with five delegates from each union republic and one from each autonomous republic. At the national section of the Twelfth Congress, Rakovsky pointed out that the 15 autonomous republics and oblasts within the RSFSR, each with a vote equal to Ukraine''s or Belorussia''s, would give the Russian federation at least 280 of the 360 seats. He moved that no single republic hold more than two-fifths of the seats in the upper chamber. Stalin dismissed the motion as "state fetishism," and it was voted down. The RSFSR''s overwhelming weight was institutionalized.

At the Central Committee Plenum on 26-27 June 1923, the draft constitution was debated, amended, and approved. On 6 July, the second session of the Union CEC adopted the draft together with a resolution "On Bringing into Effect the Constitution of the Union of Soviet Socialist Republics." From that day the constitution was in force in practice. Each republic''s CEC then reviewed it, and on 31 January 1924 the Second All-Union Congress of Soviets ratified it unanimously. The final text, now 72 articles in eleven chapters, placed the original Declaration and Treaty at its head and inscribed in Article 4 that "each one of the member Republics retains the right to freely withdraw from the union." Yet Article 1(w) of that same constitution empowered the union "to abrogate the acts of the Congresses of Soviets and the Central Executive Committees of the member Republics contrary to the present Constitution." Sovereignty and centralization were carved into the same document, side by side.

## The State That Built Nations: Korenizatsiya on the Ground

In the summer of 1923 the Ukrainian government launched korenizatsiya with two decrees. The 27 July decree ''On Ukrainization of Schools and Cultural Institutions'' ordered all schools switched to Ukrainian within two years. The 1 August decree ''On Ensuring Language Equality and Promoting Ukrainian Culture'' required all public officials to master Ukrainian within two years and mandated that official business be conducted in Ukrainian. The problem was that the party and state apparatus tasked with enforcing these decrees was itself overwhelmingly Russian-speaking. In 1922 ethnic Ukrainians made up only 23 percent of CP(B)U members, and only 11 percent of members could speak Ukrainian.

Resistance was immediate. Dmytro Lebid, the CP(B)U''s real power-holder, attacked Ukrainization as ''a compromise with Petliura elements.'' But Moscow did not retreat. In April 1925 the party Central Committee adopted a resolution to accelerate Ukrainization, and later that year Stalin appointed Lazar Kaganovich, a native Russian speaker, as CP(B)U first secretary. With the paradoxical logic that a Russian speaker had no grounds to refuse, Kaganovich drove Ukrainization harder than anyone. Officials who delayed received dismissal notices; a corps of ''Ukrainization inspectors'' was authorized to descend on institutions without warning.

The transformation of education was the most dramatic. In the 1922-23 school year fewer than 50 percent of students attended Ukrainian-language schools; by 1932-33 the figure reached 88 percent. In higher education, Ukrainian-language instruction rose from 33 percent in 1926 to 58 percent in 1929. By 1932, 89 percent of newspaper circulation in the republic was in Ukrainian, up from 50 percent in 1925. Three-quarters of theater performances were staged in Ukrainian, and the Odesa and Kyiv film studios produced Ukrainian-language films.

Behind this radical turn stood two education commissars. Oleksandr Shumsky (1925-27) drove Ukrainization at its most aggressive pace and also demanded ethnic representation in the party leadership. He publicly called on Stalin to hand the CP(B)U first secretary post to a Ukrainian, and was removed in 1927 for ''national deviationism.'' His successor, Mykola Skrypnyk, advanced Ukrainization further while avoiding direct collision with Stalin. The ''Skrypnyk orthography'' of 1928, which freed Ukrainian spelling from Russian influence, and the compilation of Ukrainian scholarly terminological dictionaries were his signature legacies.

The human composition of the party and state also shifted. The Ukrainian share of CP(B)U membership rose from 23 percent in 1922 to 60 percent in 1933, while the Russian share fell from 54 percent to 23 percent. Cities changed color: between 1923 and 1933 the Ukrainian share of Kharkiv''s population rose from 38 to 50 percent, Kyiv''s from 27 to 42 percent, Dnipropetrovsk''s from 16 to 48 percent.

Ukraine''s transformation was the largest and best-documented case, but korenizatsiya was a simultaneous experiment across the union. In Belarus, Belorussianization was proclaimed in 1924; by 1928 nearly 80 percent of schools taught in Belarusian, up from only 28 percent in the mid-1920s. In Central Asia, Latin-based scripts were devised for peoples who had no writing system. The First All-Union Turkological Congress in Baku in 1926 resolved to convert Turkic languages to the Latin alphabet, a shift led by Azerbaijan. The ''Committee of the North'' brought scripts and schools to some thirty minority peoples of Siberia and the Far North. The 1926 census recorded literacy rates of 25.2 percent in Kazakhstan, 10.6 percent in Uzbekistan, and 3.7 percent in Tajikistan; a decade later most republics had surpassed 70 percent.

Yet korenizatsiya carried an internal tension from the start. Its goal was not the free development of nations but the reinforcement of Soviet power through national forms. The more national-language schools, newspapers, and cadres multiplied, the more they produced national elites with interests distinct from the center. Figures like Shumsky and Skrypnyk in Ukraine, and Pryshchep in Belarus, had arrived as Moscow''s enforcers but over time became voices for their republics'' interests. The system Terry Martin called an ''affirmative action empire'' was designed to cultivate nations, and was bound to perceive those nations as a danger once they were cultivated. When the first measure that spelled the end of Ukrainization came in December 1932, the wholesale abolition of Ukrainian-language education within the RSFSR, the cost of that contradiction was already being tallied in collectivization and famine.

## Federation or Empire: A Century of Argument

What the formation of the USSR settled and what it did not has been the subject of sharp disagreement among historians for nearly a century. The compromise of December 1922 was born carrying at least three unresolved tensions. First, the contradiction between a constitution that guaranteed every republic''s right of secession and a single, centralized party. Second, the gap between the principle of an equal union of national republics and the overwhelming weight of the Russian republic in practice. Third, the collision between the nation-building policy of korenizatsiya and the party''s commitment to a single proletarian internationalism. These three tensions shadowed the Soviet Union until its end in 1991.

Cold War historiography was dominated by the interpretation of Richard Pipes. In The Formation of the Soviet Union (1954), Pipes argued that Soviet federalism was a sham. The republics'' formal sovereignty was a device for Moscow to seize control of the periphery, and the federal structure was camouflage for centralization. For Pipes, the USSR was an "empire in federal disguise," and its collapse in 1991 was the inevitable reckoning when the disguise wore thin.

The dissolution of the USSR and the opening of the archives fundamentally altered this landscape. Terry Martin, in The Affirmative Action Empire (2001), accepted the label "empire" but reached the opposite conclusion. Drawing on vast party records, Martin demonstrated that the Soviet state of the 1920s systematically promoted non-Russian languages, schooling, and cadres on an unprecedented scale. Korenizatsiya, which he termed "affirmative action," was not a ruse but a resource-backed state policy. In Martin''s reading, the USSR was a unique multi-ethnic state that moved in the opposite direction from the imperial powers.

Francine Hirsch''s Empire of Nations (2005) intervened from yet another angle. She showed that Soviet nationality policy inherited and continued the ethnographic knowledge and personnel of the tsarist empire, stressing continuity where Martin had stressed rupture. The two studies diverged in method and emphasis, but together they demonstrated that pre-1991 scholarship had underestimated the real operation of Soviet nationality policy.

One strand of the contemporary debate questions the very dichotomy of "federation versus empire." The political scientist Tania Raffass argued in her 2012 study that the formation of Western federations such as the United States and Switzerland was itself saturated with violence and coercion, and that the "sham federation" thesis applied to the USSR rests on a normative double standard. Boris Kolonitskii, meanwhile, interprets the formation of the USSR as a "compromise" among the various national-communist forces inside the party: the product not of any single architect''s blueprint but of brutal choices made under the extreme conditions of civil war to survive.

The deepest question left by the formation of the Soviet Union remains open. The experiment of erecting a union of equal nations on the ruins of an empire asked whether form could change reality, whether a multi-ethnic state could endure without centralization, and whether the legacy of empire could be liquidated by institutions. The post-1991 world has answered these questions in multiple ways, but the questions themselves are still those first asked in the Bolshoi Theatre in December 1922.

## What Was Settled, What Was Not, and a Century''s Judgment

The formation process of 1922–24 settled three things. First, the state form: a union was established in which Russia joined alongside the other republics on nominally equal terms, rather than absorbing them through autonomization. This outcome was impossible without Lenin''s two interventions, the September letter and the December dictations. Second, a state that recognized and cultivated nations: the Twelfth Congress resolution on korenizatsiya gave the republics both the responsibility and the resources to build national-language schools, national cadres, and national cultural institutions. Third, the constitutional architecture including the right of secession. Article 4 of the 1924 Constitution enshrined each union republic''s ''right freely to secede from the Union,'' and no one could have predicted that this clause would become the legal basis for the Belovezha Accords of December 1991.

What the formation process did not resolve, however, was the central tension between the centralism of a single party and the decentralization of a federation. The Politburo decided the appointment and removal of republic cadres; the security organs operated under Moscow''s chain of command; the Union Central Executive Committee was an instrument for ratifying party decisions. This contradiction exploded in the 1930s during Stalin''s ''Great Retreat'': the Skrypnyk affair, the rollback of Ukrainization, the reassertion of the Russian language and the Russian people''s primacy. The affirmative-action federation of the 1920s gradually turned into a hierarchical empire in which Russians were ''first among equals.''

The dominant Cold War interpretation in Western scholarship is represented by Richard Pipes''s The Formation of the Soviet Union (1954). For Pipes, the USSR was an empire that had merely ''changed the sign on the door,'' and the federation''s outward form was camouflage for a strategy of divide-and-rule among nationalities. This view was fundamentally revised by the scholars of the 1990s ''imperial turn'': Terry Martin, Ronald Suny, and Francine Hirsch. Martin proposed the paradoxical term ''affirmative action empire'' precisely because the Soviet Union simultaneously pursued two apparently incompatible tasks, imperial centralization and the cultivation of nations. Hirsch demonstrated that the Soviet national republics were not simply lines drawn by Moscow but the product of ethnographic knowledge accumulated by former imperial scholars, combined with political negotiation by local elites. Suny argued that national identity was not ''false consciousness'' but a real political force, and that the union''s federal structure provided the very framework for national mobilization.

Today''s assessment rejects both extremes. The Soviet Union was neither a simple continuation of the tsarist empire nor a pure project of anti-imperial liberation. It was a contradictory state that suppressed nations while producing them, centralized while nativizing, destroyed while it built. That contradiction was both the engine that held the union together for nearly seventy years and the blueprint for its undoing in 1991.
',
  updated_at=NOW() WHERE id='ussr-formation';
DO $check$
BEGIN
  IF (SELECT count(*) FROM commulingo_history_events WHERE relations->>'parent'='civil-war') <> 6 THEN
    RAISE EXCEPTION 'Expected six civil-war detail pages';
  END IF;
  IF EXISTS (SELECT 1 FROM commulingo_history_events e WHERE e.relations ? 'parent'
      AND (e.relations->>'parent'=e.id OR NOT EXISTS
        (SELECT 1 FROM commulingo_history_events p WHERE p.id=e.relations->>'parent' AND p.summary_ko<>''))) THEN
    RAISE EXCEPTION 'Invalid event parent';
  END IF;
END $check$;
COMMIT;
