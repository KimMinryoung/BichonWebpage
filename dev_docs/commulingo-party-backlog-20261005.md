# CommuLingo 카탈로그 밖 정당 인수인계 (2026-10-05)

2026-10-05 정당 소속 전수 점검에서 정당 활동을 넣지 못한 인물이 **144명** 남았다. 위키백과 원문으로 정당 소속은 확인했지만, 그 정당이 소속 카탈로그(`data/commulingo/activity-catalog.json`)에 없었기 때문이다. 이 인물들은 `commulingo_person_enrichment`의 `party` 주제가 `open`이고, 사유(`reason`)에 검수 메모가 그대로 남아 있다. 정당 활동을 넣으면 상태는 자동으로 `complete`가 된다(`data/commulingo/person-editorial-policy.js`).

```bash
scripts/query-db "SELECT person_id, reason FROM commulingo_person_enrichment WHERE topic='party' AND status='open' ORDER BY 1"
```

전체 점검의 규칙과 경과는 [소속 분류 설계 문서](commulingo-role-model-plan.md)의 2026-10-04~05 항목에 있다. 나머지 인물의 상태 분포는 다음과 같다. 1,648명은 정당 활동이 있다(`complete`). 698명은 위키데이터와 위키백과 본문을 확인했으나 당원 자격·당 직책 언급이 없었다(`not_applicable`). 190명은 위키백과 연결이 없어 확인할 본문이 없었다(`sources_unavailable`).

## 처리 방법

1. **정당 등록:** 정당을 카탈로그에 추가하고 용어와 링크 승인을 함께 넣는다. 2026-10-05 사용자 결정에 따라 인원이 적어도 초안이 있으면 등록한다.
   - 카탈로그: `scripts/content/party-catalog-20261005.py`의 `NEW` 목록에 행을 추가한다.
   - 용어 초안: `scripts/content/party-terms-[h-k]-20261005.json`과 같은 형식으로 쓴다. 적용은 컨테이너의 `apply-history-terms.js`로 하고, dry-run 뒤 `--apply`를 붙인다.
   - 링크 승인과 termIds: `scripts/content/party-terms-20261004-finish.py <letters> <date> --write`로 만들고 `review-commulingo-links.js`로 적용한다.
   - 카탈로그를 바꾼 뒤에는 leninbot 계약 사본을 동기화한다(leninbot `scripts/sync_commulingo_contracts.py`). 그다음 frontend를 재시작해 새 카탈로그를 읽게 한다.
2. **활동 추가:** 인물별로 위키백과 원문 발췌를 근거로 정당 활동을 만든다(`scripts/content/party-members-*-20261005.json` 형식). `scripts/commulingo-people-upsert`로 dry-run을 거친 뒤 적용한다. 기능·관계 규칙은 다음과 같다.
   - 단순 당원: 카드의 대표 기능 + `membership`
   - 당 지도부: `political-leadership` + `membership`
   - 비당원 당 직책: `political-leadership` + `service`
3. **보류:** 검토해 보니 카탈로그에 넣을 정당이 아니면(예: 선거 후보로만 나온 소정당) 그 인물의 `party` 상태를 이유와 함께 `not_applicable`로 바꾼다. 기록은 컨테이너의 `scripts/commulingo-person-enrichment-batch.js`로 한다.

## 주의

- **표기가 통일돼 있지 않다:** 메모는 검수 에이전트가 쓴 것이라 정당 이름의 한국어 표기가 제각각이다. 등록 전에 표기 규칙(예: 「사회혁명당」)과 기존 용어를 확인한다.
- **이미 처리한 판정이 섞여 있다:** 일부 메모에는 카탈로그에 이미 있는 정당에 대한 판정이 함께 적혀 있다(예: 「흐라마다 문장 없음」). 메모에서 카탈로그 밖 정당만 골라 처리한다.
- **이름이 같은 정당이 많다:** 자유당·인민당·독립당·국민연합당 같은 이름은 여러 나라에 있다. 나라와 시기로 구분해 별도 항목으로 등록한다.

## 인물별 목록

| 인물 | 생몰 | 근거에 나온 카탈로그 밖 정당(검수 메모) |
|---|---|---|
| 게오르기오스 파판드레우 (`georgios-papandreou`) | 1888–1968 | 그리스 자유당·중도연합 |
| 고노에 후미마로 (`konoe-fumimaro`) | 1891–1945 | 대정익찬회 |
| 고트하르트 하인리치 (`gotthard-heinrici`) | 1886–1971 | 독일 국가인민당 지지자 — 당원 아님, 카탈로그에도 없음 |
| 구스타프 슈트레제만 (`gustav-stresemann`) | 1878–1929 | 국민자유당·독일인민당(DVP) |
| 귀스타브 폴 클뤼세레 (`gustave-cluseret`) | 1823–1900 | 프랑스 사회혁명파 — 러시아 사회혁명당 아님, |
| 그레이스 리 보그스 (`grace-lee-boggs`) | 1915–2015 | 미국 노동자당(Workers Party)·SWP 경향 활동 — 노동자당은 카탈로그에 없고 SWP 당원 문장 불명확 |
| 나자티 시드키 (`najati-sidqi`) | 1905–1979 | 팔레스타인 공산당 |
| 나즘 히크메트 (`nazim-hikmet`) | 1902–1963 | 터키 공산당 |
| 나폴레온 제르바스 (`napoleon-zervas`) | 1891–1957 | 그리스 민족당 |
| 노로돔 시아누크 (`norodom-sihanouk`) | 1922–2012 | 상쿰·FUNCINPEC |
| 노만 첼레비지한 (`noman-celebicihan`) | 1885–1918 | 크림 타타르 지도자, 카탈로그 정당 없음 |
| 니세포르 소글로 (`nicephore-soglo`) | 1934– | 베냉 르네상스당 |
| 니콜라 페트코프 (`nikola-petkov`) | 1893–1947 | 불가리아 농민민족동맹 — 근거 문장 없고 |
| 니콜라이 모로조프 (`nikolai-morozov`) | 1854–1946 | 인민의 의지(정당 카탈로그에 없음); 소련공산당 비당원 명시 |
| 니콜라이 미하일롭스키 (`nikolai-mikhailovsky`) | 1842–1904 | 인민의 의지와 접촉만, 당원 근거 없음(카탈로그에도 없음) |
| 니키포르 흐리호리우 (`nykyfor-hryhoriv`) | c.1885–1919 | 보로트비스트당 |
| 데이비드 로이드 조지 (`david-lloyd-george`) | 1863–1945 | 자유당(영국) |
| 디디에 라치라카 (`didier-ratsiraka`) | 1936–2021 | AREMA(마다가스카르) |
| 라글레 파레크 (`lagle-parek`) | 1941– | 에스토니아 국민독립당 |
| 라돌라 가이다 (`radola-gajda`) | 1892–1948 | 국민파시스트공동체(NOF) |
| 레흐 바웬사 (`lech-walesa`) | 1943– | BBWR 등 |
| 루이 오귀스트 블랑키 (`louis-auguste-blanqui`) | 1805–1881 | 「사회주의 정당」 선동으로 당선 — 특정 카탈로그 정당 아님 |
| 마난다피 라코토니리나 (`manandafy-rakotonirina`) | 1938–2019 | MFM(마다가스카르) |
| 마누엘 아사냐 (`manuel-azana`) | 1880–1940 | 공화좌파 등 |
| 마리우 라우리스틴 (`marju-lauristin`) | 1940– | 에스토니아 사회민주당 계열 — 카탈로그에 없음(공산당 언급은 부모) |
| 마쓰오카 요스케 (`yosuke-matsuoka`) | 1880–1946 | 입헌정우회 |
| 마티외 케레쿠 (`mathieu-kerekou`) | 1933–2015 | 베냉 인민혁명당 |
| 마흐무트 가레예프 (`makhmut-gareev`) | 1923–2019 | 러시아 재향군인당 |
| 모함마드 알리 사마타르 (`mohammad-ali-samatar`) | 1931–2016 | 소말리아 혁명사회당 |
| 무스타파 케말 아타튀르크 (`mustafa-kemal-ataturk`) | 1881–1938 | 공화인민당 |
| 무함마드 다우드 칸 (`mohammad-daoud-khan`) | 1909–1978 | 민족혁명당(아프가니스탄) |
| 무함마드 시아드 바레 (`mohamed-siad-barre`) | ?–1995 | 소말리아 혁명사회주의당 |
| 미클로시 벨러 (`bela-miklos`) | 1890–1948 | 헝가리 독립당(MFP) |
| 미하일로 흐루셰프스키 (`mykhailo-hrushevsky`) | 1866–1934 | 우크라이나 사회혁명당(UPSR) — 카탈로그에 없음(러시아 사회혁명당과 별개) |
| 바실리 슐긴 (`vasily-shulgin`) | 1878–1976 | 민족주의자당·진보블록 |
| 바츨라프 클라우스 (`vaclav-klaus`) | 1941– | 시민민주당(ODS) |
| 뱅상 바디 (`vincent-badie`) | 1902–1989 | 급진사회당 |
| 버키 라슬로 (`laszlo-baky`) | 1898–1946 | 헝가리 국가사회주의당(화살십자 계열) |
| 베르나르 콜렐라 (`bernard-kolelas`) | 1933–2009 | MCDDI |
| 비타우타스 란츠베르기스 (`landsbergis`) | 1932– | 조국연합(리투아니아 보수당) |
| 비토리오 에마누엘레 오를란도 (`vittorio-emanuele-orlando`) | 1860–1952 | 자유주의 계열·민주자유연합 |
| 빌헬름 쿠노 (`wilhelm-cuno`) | 1876–1933 | 독일 인민당(DVP) 잠시 입당 — 카탈로그에 없음, 이후 무소속 |
| 사드리 막수디 (`sadri-maksudi`) | 1878–1957 | 이티파크 알무슬리민 |
| 사아드 자글룰 (`saad-zaghloul`) | 1857–1927 | 와프드당 |
| 살러시 페렌츠 (`ferenc-szalasi`) | 1897–1946 | 화살십자당·민족의지당 |
| 살바도르 아옌데 (`salvador-allende`) | 1908–1973 | 칠레 사회당 |
| 샤를 드골 (`charles-de-gaulle`) | 1890–1970 | 드골파 정당(RPF) — 근거 문장도 없고 |
| 소피야 페롭스카야 (`sofia-perovskaya`) | 1853–1881 | 인민의 의지(나로드나야 볼랴) |
| 손 산 (`son-sann`) | 1911–2000 | 민주당·상쿰·BLDP |
| 수반나 푸마 (`souvanna-phouma`) | 1901–1984 | 라오스 국민진보당 |
| 스테판 반데라 (`stepan-bandera`) | 1909–1959 | 우크라이나 민족주의자 조직(OUN) |
| 시게미쓰 마모루 (`mamoru-shigemitsu`) | 1887–1957 | 개진당·일본민주당·자민당 |
| 시몬 페틀류라 (`symon-petliura`) | 1879–1926 | 혁명우크라이나당(RUP)·우크라이나 사회민주노동당(USDRP) |
| 아구스틴 파라분도 마르티 (`farabundo-marti`) | 1893–1932 | 중앙아메리카 공산당·살바도르 공산당 |
| 아르툠 타라소프 (`artyom-tarasov`) | 1950–2017 | 야블로코 |
| 아불파즈 엘치베이 (`abulfaz-elchibey`) | 1938–2000 | 아제르바이잔 인민전선당 |
| 아우구스티나스 볼데마라스 (`augustinas-voldemaras`) | 1883–1942 | 리투아니아 민족진보당 |
| 아우후스틴 볼로신 (`avgustyn-voloshyn`) | 1874–1945 | 루테니아 인민기독당 |
| 안드라니크 오자냔 (`andranik-ozanian`) | 1865–1927 | 훈차크당·다슈나크추튠 |
| 안드레이 젤랴보프 (`andrei-zhelyabov`) | 1851–1881 | 인민의 의지당 |
| 안드리에우스 니에드라 (`andrievs-niedra`) | 1871–1942 | 라트비아 농민연합 |
| 안타나스 스메토나 (`antanas-smetona`) | 1874–1944 | 리투아니아 민주당·민족주의자연합 |
| 알렉산드로스 스볼로스 (`alexandros-svolos`) | 1892–1956 | 인민민주연합·민주노동당(그리스) |
| 알렉산드로스 파파고스 (`georgios-papagos`) | 1883–1955 | 그리스 연합 |
| 알렉산드르 슈빈 (`aleksandr-shubin`) | 1965– | 녹색당·해적당 |
| 알렉산드르 오볼렌스키 (`alexander-obolensky`) | 1943– | 러시아 사회민주당(SDPR) 공동의장 |
| 알렉산드르 울리야노프 (`alexander-ulyanov`) | 1866–1887 | 인민의 의지(나로드나야 볼랴) |
| 알렉산드르 하티샨 (`alexander-khatisian`) | 1874–1945 | 다슈나크춘(아르메니아 혁명연맹) |
| 알렉세이 야블로코프 (`alexei-yablokov`) | 1933–2017 | 야블로코·녹색 러시아 |
| 알렉세이 카잔니크 (`alexei-kazannik`) | 1941–2019 | 근로자 자치당 |
| 알로이스 모크 (`alois-mock`) | 1934–2017 | 오스트리아 국민당(ÖVP) |
| 알리 압둘라 살레 (`ali-abdullah-saleh`) | 1942/1947–2017 | 국민전체회의(GPC) |
| 알베르 르브룅 (`albert-lebrun`) | 1871–1950 | 좌파공화당(Alliance démocratique 계열) |
| 알베르 테보에즈르 (`albert-tevoedjre`) | 1929–2019 | 다호메 통일당 |
| 알베르타스 시메나스 (`albertas-simenas`) | 1950– | 리투아니아 기독민주당 |
| 알프레트 티르피츠 (`alfred-von-tirpitz`) | 1849–1930 | 독일 조국당·독일국가인민당 |
| 앙드레 밀롱고 (`andre-milongo`) | 1935–2007 | 민주공화연합(UDR) |
| 야시 오스카르 (`oszkar-jaszi`) | 1875–1957 | 급진당(헝가리) |
| 얀 스뮈츠 (`jan-smuts`) | 1870–1950 | 남아프리카당·연합당 |
| 얀 퇴니손 (`jaan-tonisson`) | 1868–1941? | 에스토니아 국민진보당·인민당 |
| 어포니 얼베르트 (`albert-apponyi`) | 1846–1933 | 헝가리 국민당·자유당·독립당 |
| 에두아르 달라디에 (`edouard-daladier`) | 1884–1970 | 프랑스 급진사회당 |
| 에드가르 사비사르 (`edgar-savisaar`) | 1950–2022 | 에스토니아 중앙당·인민전선 — 카탈로그에 없음; 캐시에 소련공산당 당원 문장 없음 |
| 에드바르트 베네시 (`edvard-benes`) | 1884–1948 | 체코 민족사회당 |
| 에티바르 마메도프 (`etibar-mammadov`) | 1955– | 아제르바이잔 민족독립당 |
| 엔델 리프마 (`endel-lippmaa`) | 1930–2015 | 연립당(에스토니아) |
| 엔베르 파샤 (`enver-pasha`) | 1881–1922 | 통일진보위원회 |
| 엥겔베르트 돌푸스 (`engelbert-dollfuss`) | 1892–1934 | 오스트리아 기독사회당 |
| 여로시 언도르 (`andor-jaross`) | 1896–1946 | 통일헝가리당·헝가리 쇄신당 — 카탈로그에 없음; 집권당 당원 명시 없음 |
| 예브게니 야신 (`yevgeny-yasin`) | 1934–2023 | 우파연합(SPS) |
| 예브헨 코노발레츠 (`yevhen-konovalets`) | 1891–1938 | 우크라이나 민족민주당·OUN |
| 예센스키 게저 (`geza-jeszenszky`) | 1941– | 헝가리 민주포럼(MDF) |
| 오르반 빅토르 (`viktor-mihaly-orban`) | 1963– | 피데스 |
| 오토 누슈케 (`otto-nuschke`) | 1883–1957 | lead review: 1948+ chair of the East German CDU, a different party from the catalog CDU |
| 외젠 바를랭 (`eugene-varlin`) | 1839–1871 | 「사회주의혁명파」 후보 출마 — 카탈로그 정당 아님(제1인터내셔널 활동) |
| 우르호 케코넨 (`urho-kekkonen`) | 1900–1986 | 농민동맹(중앙당) |
| 월터 로드니 (`walter-rodney`) | 1942–1980 | 노동인민동맹(WPA, 가이아나) |
| 유호 쿠스티 파시키비 (`juho-kusti-paasikivi`) | 1870–1956 | 핀란드당·국민연합당 |
| 율리우 마니우 (`iuliu-maniu`) | 1873–1953 | 트란실바니아 루마니아 국민당·국민농민당 |
| 이동휘 (`yi-dong-hwi`) | 1873–1935 | 한인사회당·고려공산당(1918–1921) — 카탈로그의 조선공산당(1925–1946)과 다른 당, |
| 이바르스 고드마니스 (`ivars-godmanis`) | 1951– | 라트비아의 길 등 |
| 이스메트 이뇌뉘 (`ismet-inonu`) | 1884–1973 | 공화인민당(CHP) |
| 이승만 (`syngman-rhee`) | 1875–1965 | 자유당(한국) — 근거 문장 없고 |
| 이오아니스 메탁사스 (`ioannis-metaxas`) | 1871–1941 | 자유사상가당 |
| 자페르 세이다흐메트 (`cafer-seydahmet`) | 1889–1960 | 밀리 피르카 |
| 조르주 비도 (`georges-bidault`) | 1899–1983 | 인민공화운동(MRP) |
| 조르주 클레망소 (`georges-clemenceau`) | 1841–1929 | 급진당 — 근거 문장 없음, |
| 존 메이너드 케인스 (`john-maynard-keynes`) | 1883–1946 | 영국 자유당 |
| 줄리어스 니에레레 (`julius-nyerere`) | 1922–1999 | TANU·혁명당(CCM) |
| 카로이 미하이 (`mihaly-karolyi`) | 1875–1955 | 독립당·카로이당 |
| 카를 레너 (`karl-renner`) | 1870–1950 | 오스트리아 사회민주노동자당(SDAP) |
| 카를 마르크스 (`karl-marx`) | 1818–1883 | 공산주의자동맹 |
| 카즘 카라베키르 (`kazim-karabekir`) | 1882–1948 | 진보공화당 |
| 카지스 시키르파 (`kazys-skirpa`) | 1895–1979 | 리투아니아 인민사회민주당 |
| 커티스 E. 르메이 (`curtis-e-lemay`) | 1906–1990 | 미국 독립당 부통령 후보 |
| 콰메 은크루마 (`kwame-nkrumah`) | 1909–1972 | 통일황금해안회의·회의인민당(CPP) |
| 콴유 리 (`lee-kuan-yew`) | 1923–2015 | 인민행동당(PAP) |
| 퀴외스티 칼리오 (`kyosti-kallio`) | 1873–1940 | 청년핀란드당·농민동맹 |
| 토니 클리프 (`tony-cliff`) | 1917–2000 | 영국 혁명공산당·국제사회주의자·영국 사회주의노동자당 — 카탈로그에 없음(카탈로그 SWP는 미국) |
| 토마시 가리그 마사리크 (`tomas-garrigue-masaryk`) | 1850–1937 | 청년체코당·체코 진보당 |
| 퇴케시 라슬로 (`laszlo-tokes`) | 1952– | 헝가리인민주연합(RMDSZ)·피데스 명부 무소속 |
| 티서 이슈트반 (`istvan-tisza`) | 1861–1918 | 헝가리 자유당 |
| 파보 탈벨라 (`paavo-talvela`) | 1897–1973 | 국민연합당(핀란드) |
| 페르 에빈드 스빈후부드 (`pehr-evind-svinhufvud`) | 1861–1944 | 청년핀란드당·국민연합당 |
| 페르디난트 라살레 (`ferdinand-lassalle`) | 1825–1864 | 전독일노동자협회(ADAV) — 카탈로그에 없음(SPD 전신) |
| 페트루 그로자 (`petru-groza`) | 1884–1958 | 루마니아 국민당·인민당·농민전선 — 카탈로그에 없음, 공산당 비당원 명시 |
| 페트르 젠클 (`petr-zenkl`) | 1884–1975 | 체코슬로바키아 국민사회당 |
| 폴 레노 (`paul-reynaud`) | 1878–1966 | 민주공화동맹 |
| 폴 로브슨 (`paul-robeson`) | 1898–1976 | 미국 공산당 비당원으로 명시; 진보당은 |
| 풀헨시오 바티스타 (`fulgencio-batista`) | 1901–1973 | 진보행동당 |
| 프란시스코 프랑코 (`francisco-franco`) | 1892–1975 | 팔랑헤(FET y de las JONS) |
| 프랑수아 드 라 로크 (`francois-de-la-rocque`) | 1885–1946 | 프랑스 사회당(PSF, 우파)·불의 십자단 |
| 프랑수아 뷔조 (`francois-buzot`) | 1760–1794 | 지롱드파 |
| 프리드리히 엥겔스 (`friedrich-engels`) | 1820–1895 | 공산주의자동맹 |
| 프리드리히 이슈트반 (`istvan-friedrich`) | 1883–1951 | 독립당·기독교민족당 |
| 프리츠 플라텐 (`fritz-platten`) | 1883–1942 | 스위스 사회민주당·스위스 공산당 — 카탈로그에 없음; 소련공산당 입당 문장 없음 |
| 피에르 테탱제 (`pierre-taittinger`) | 1887–1965 | 공화연맹(프랑스) |
| 피오트라 크레체우스키 (`piotra-krecheuski`) | 1879–1928 | 흐라마다 문장 없음; '사회주의 연방주의자당'(벨라루스 사회주의 연방주의자당) 입당만, |
| 하일레 피다 (`haile-fida`) | 1939–1979 | 전에티오피아 사회주의운동(MEISON) |
| 해럴드 함즈워스 (`harold-harmsworth`) | 1868–1940 | 제국통일당(United Empire Party) |
| 햘마르 매에 (`hjalmar-mae`) | 1901–1978 | 지주당·국민중앙당(에스토니아) |
| 호세 카를로스 마리아테기 (`mariategui`) | 1894–1930 | 페루 사회당 |
| 후세인 쿨미예 아프라 (`hussein-kulmiye-afrah`) | 1920–1993 | 소말리아 혁명사회당 |
| 훌리오 안토니오 메야 (`julio-antonio-mella`) | 1903–1929 | 1925년 쿠바 공산당(카탈로그 쿠바 공산당은 1959– 기간)·멕시코 공산당 — 카탈로그 범위 밖 |
