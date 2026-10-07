# 발칸 전쟁 후속 인물 카드 b (2026-10-07)

파일: `people-extra-20261007-b.js` (`module.exports` 카드 3장, `.collections`, `.relations`). 사건 `balkan-wars-1912-1913`(운영 적용됨)의 본문 표기를 따랐다.
근거는 모두 영어 위키백과 본문(plain-text extract, 2026-10-07)에서 글자 그대로 뽑았다.

## 카드

| id | 표제어 ko / en | 원어 | 연도 | 국적/출신 | 그룹 | 입장 모음 | fate |
|---|---|---|---|---|---|---|---|
| `dimitrije-tucovic` | 디미트리예 투초비치 / Dimitrije Tucović | Димитрије Туцовић | 1881–1914 | serbia/serbia | world-before-1917 | `communist` | killed 「전사」 |
| `talat-pasha` | 탈라트 파샤 / Talat Pasha | Mehmed Talât Paşa | 1874–1921 | turkey/turkey | world-before-1917 | `nationalist` | assassinated 「베를린에서 암살」 |
| `constantine-i-of-greece` | 콘스탄티노스 1세 / Constantine I of Greece | Κωνσταντίνος Αʹ | 1868–1923 | greece/greece | world-before-1917 | `monarchist` | exile 「망명지에서 사망」 |

- 활동
  - 투초비치: political-leadership(세르비아 사회민주당, primary), propaganda(『노동자 신문』 편집), organizing(1910 발칸 사회민주당 대회), military(세르비아군 동원). 세르비아 사회민주당·세르비아 왕국이 카탈로그에 없어 모두 `unresolved`(라프체비치 카드와 같은 처리). 당원 자격은 근거가 있지만 소속이 미해결이라 membership 행을 따로 두지 않았다.
  - 탈라트: government `state-turkey` 1913–1918(primary, 내무장관·대재상; 엔베르 카드처럼 오스만은 state-turkey), political-leadership `party-cup` membership 1896–1918(「1896년 CUP 세포 가담으로 투옥」 근거).
  - 콘스탄티노스: monarchy `state-greece` 1913–1922(primary), military `state-greece` 1912–1913(테살리아군 총사령관).
- 별칭
  - 투초비치: ko 미타 투초비치 / en Dimitrije Tucovic, Mita Tucović
  - 탈라트: ko 메흐메트 탈라트, 메흐메트 탈라트 파샤 / en Talaat Pasha, Talât Pasha, Mehmed Talat, Mehmed Talaat, Mehmed Talât Pasha
  - 콘스탄티노스: ko 그리스 국왕 콘스탄티노스 1세(게오르기오스 2세 카드 형식) / en Konstantinos I, King Constantine I of Greece. 「Constantine I」 단독은 로마 황제와 겹쳐 넣지 않았다.
- 「탈라트」 단독 판단: 성이 아니라(오스만 시기 성 없음) 표제어 「탈라트 파샤」에 포함된 짧은 형태이고, 별칭 표준상 표제어에 없는 관용 약칭만 별칭으로 둔다. 스토어 규칙(한 단어 성 거부)에는 걸리지 않지만, 화면 「다른 이름」에도 표제어에 포함돼 숨겨지므로 별칭이 아니라 `linkExpressions`(ko 탈라트, en Talat, Talaat; policy auto)로 넣었다. 사건 본문·용어(committee-of-union-and-progress, raid-on-the-sublime-porte-1913)·엔베르 카드가 모두 「탈라트」로 쓰므로 링크가 붙는다. 「Talat」은 흔한 튀르키예 이름이라 중의 위험이 있으면 search로 낮출 것.
- 콘스탄티노스 linkExpressions: ko 콘스탄티노스 왕, 왕세자 콘스탄티노스 / en King Constantine, Crown Prince Constantine (사건 본문 표기). 단독 「콘스탄티노스」는 콘스탄티노스 마니아다키스와 겹쳐 넣지 않았다.

## 기존 표기·중복 확인
- people_search(탈라트/talat/talaat/탈랴트, 투초비치/tucovi, 콘스탄티노스/constantine): 해당 카드 없음(콘스탄티노스 마니아다키스만 있음).
- 탈라트 표기: 용어 `committee-of-union-and-progress`, `raid-on-the-sublime-porte-1913`, 카드 `enver-pasha`가 모두 「탈라트」/「Talat」. 아르메니아 학살 사건·용어는 아직 없다(event_search·term_search 0건; 다슈나크추튠 용어만 있음).

## 입장 모음 판단
- 투초비치 `communist`: 「마르크스주의 사상을 전개하거나 공산주의 운동을 조직·지지한 사람들」. 같은 시기 좌파 사민주의자 블라고예프·메링·룩셈부르크가 이 모음이고, 세르비아 사회민주당 좌파는 유고슬라비아 공산당으로 이어졌다. 우파·중도였던 라프체비치는 `non-bolshevik-socialist`. `revolutionary-socialist`는 블랑키·리사가레·마투셴코 같은 직접 행동 계열이라 맞지 않는다고 봤다. 지시대로 non-bolshevik-socialist를 원하면 바꾸면 된다.
- 탈라트 `nationalist`(엔베르·아타튀르크와 같음). 그룹은 world-before-1917: 활동이 1896–1918이고 1921년 사망. 엔베르는 바스마치 시기 때문에 world-interwar지만, 탈라트는 전간기 활동이 망명뿐이다. 1차 세계대전 전용 그룹은 없다.
- 콘스탄티노스 `monarchist`(페르디난트 1세·니콜라 1세·게오르기오스 2세와 같음).

## 관계 행 (`module.exports.relations`)
| 사건 | 인물 | kind | side |
|---|---|---|---|
| balkan-wars-1912-1913 | dimitrije-tucovic | participant | anti-war-socialists |
| balkan-wars-1912-1913 | talat-pasha | leader | ottoman-empire |
| balkan-wars-1912-1913 | constantine-i-of-greece | leader | serbia-greece-montenegro |
| world-war-i (제안) | talat-pasha | leader | central-powers |
| world-war-i (제안) | dimitrije-tucovic | participant | antiwar-socialists |
| brest-litovsk (제안) | talat-pasha | participant | germany-and-allies |

world-war-i와 brest-litovsk의 본문에는 두 사람이 이름으로 나오지 않는다. 엔베르가 world-war-i에 central-powers leader로 걸려 있어 탈라트도 맞춰 제안했다. 탈라트는 브레스트-리토프스크 조약을 직접 교섭했다(위키백과 Premiership 절). 콘스탄티노스는 1차 세계대전에서 중립을 고집하다 퇴위해 world-war-i 진영에 넣기 애매해서 제안하지 않았다.

## 검증
`scratchpad/people-extra-b.json`(`changedBy: queue-events-20261007-extra`) → `scripts/commulingo-people-upsert --dry-run`: 3명 모두 approved, 「dry run: 3 person(s) validated, nothing written」. 처음에는 bio.ko 380자 제한에 걸려 약력을 줄였다(ko 342/373/347자, en ≤900).

## 적용 시 할 일
- upsert 뒤 `commulingo_person_collection_members`에 위 모음 3행(마이그레이션 파일), 사건 관계 행 적용.
- 탈라트 en linkExpression 「Talat」 정책(auto/search) 확인.
