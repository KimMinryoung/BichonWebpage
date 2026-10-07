# 추가 인물 카드 a (queue-events-20261007 후속, 2026-10-07)

파일: `people-extra-20261007-a.js` (`module.exports` 카드 8장, `.collections`, `.relations`).
근거: 영어 위키백과 각 항목의 plain-text extract(2026-10-07 수집), excerpt는 글자 그대로.
중복 확인: `people_search`로 id·한글·로마자 모두 검색, 기존 카드 없음.

## 카드

| id | 표기 | 생몰 | 그룹 | 국적/출신 | fate | 입장 모음 |
|---|---|---|---|---|---|---|
| etienne-polverel | 에티엔 폴브렐 | 1740–1795 | france-revolution | france / france | natural 재판 중 병사 | jacobin |
| donatien-de-rochambeau | 도나시앵 드 로샹보 | 1755–1813 | france-revolution | france / france | killed 전사 | (없음) |
| jean-baptiste-belley | 장바티스트 벨레 | 1746–1805 | france-revolution | france / (비움) | natural 연금 중 사망 | jacobin |
| thomas-maitland | 토머스 메이틀랜드 | 1760–1824 | france-revolution | uk / uk | natural 자연사 | (없음) |
| achille-bazaine | 아실 바젠 | 1811–1888 | world-before-1917 | france / france | exile 망명지에서 사망 | monarchist |
| wilhelm-bracke | 빌헬름 브라케 | 1842–1880 | world-before-1917 | germany / germany | natural 자연사 | non-bolshevik-socialist |
| charles-de-freycinet | 샤를 드 프레시네 | 1828–1923 | world-before-1917 | france / france | natural 자연사 | liberal-republican |
| auguste-alexandre-ducrot | 오귀스트알렉상드르 뒤크로 | 1817–1882 | world-before-1917 | france / france | natural 자연사 | (없음) |

표기는 모두 사건 본문 표기와 같다(본문은 「바젠」「뒤크로」「샤를 드 프레시네」「빌헬름 브라케」「폴브렐」「로샹보」「메이틀랜드」「장바티스트 벨레」).

### 벨레 인물 확정
사건 본문(민사위원 절, 연표 1794-02-04)의 「장바티스트 벨레」는 **Jean-Baptiste Belley**(국민공회 첫 흑인 의원, 고레섬 출생)다. 본문 문장 「세네갈 고레섬에서 태어나 두 살에 팔려 온 뒤 스스로 자유를 산 사람으로, 국민공회에 앉은 첫 흑인 의원」이 Belley 항목과 일치한다. 지시에 적힌 Charles Bélair(투생의 조카, 1802년 처형)는 사건 본문 ko/en 어디에도 나오지 않는다. 그래서 카드는 `jean-baptiste-belley`로 만들었다. Charles Bélair 카드는 만들지 않았다.

### 활동
- 폴브렐: government·french-first-republic 1792–1794 (대표, 민사위원) / government·jacobin-club membership.
- 로샹보: military·french-napoleonic-state 1802–1803 (대표) / military·french-monarchy 1781–1782 (미국 독립전쟁) / military·french-first-republic 연도 없음 (1790년대 마르티니크·생도맹그 원정; 출처가 연도를 특정하지 않음).
- 벨레: legislature·french-first-republic 1793–1797 (대표) / legislature·french-montagnards membership 1794–1795 (「sat with the Montagnards」) / military·french-first-republic 1793 / military·french-napoleonic-state 1802.
- 메이틀랜드: military·state-uk 1778–1812 (대표) / government·state-uk 1805–1824 / legislature·state-uk 1790–1813.
- 바젠: military·state-france 1831–1870 (대표) / legislature·state-france 1864–1870 (제2제정 상원).
- 브라케: political-leadership·party-german-spd 1869–1879 (대표; 출처는 SDAP를 「SPD의 전신」으로 씀, 베벨·리프크네히트 카드도 party-german-spd) / political-leadership·party-german-adav membership 1865–1869 / legislature·state-germany 1877–1879.
- 프레시네: government·state-france 1870–1899 (대표) / legislature·state-france 1876– / political-leadership 온건 공화파 membership (카탈로그 없음, unresolved).
- 뒤크로: military·state-france –1871 (대표, 시작 연도 출처에 없음).

### 별칭·링크 표현
- 로샹보: 별칭 ko 「도나시앵마리조제프 드 비뫼르 드 로샹보」, en 2개. linkExpressions ko 「로샹보」 en 「Rochambeau」(auto). 다만 **아버지 로샹보 백작(미국 독립전쟁 원정군 사령관)도 「Rochambeau」**라서 다른 본문에서 아버지가 이 카드로 걸릴 수 있다. 아버지 카드는 없다. 필요하면 링크 표현을 search로 낮춘다.
- 프레시네: linkExpressions ko 「프레시네」 en 「Freycinet」(auto). 항해가 루이 드 프레시네(삼촌)와 겹칠 수 있으나 코퍼스 발화는 확인하지 않았다.
- 벨레: 위키백과의 별명 「Mars」는 영어 일반어(화성·군신) 오링크 위험 때문에 별칭에 넣지 않았다.
- 메이틀랜드: 「King Tom」/「킹 톰」(몰타 시절 별명).

## 관계 행 (`module.exports.relations`)

| 사건 | 인물 | kind | side |
|---|---|---|---|
| haitian-revolution-1791-1804 | etienne-polverel | leader | french-republic |
| haitian-revolution-1791-1804 | jean-baptiste-belley | participant | french-republic |
| haitian-revolution-1791-1804 | donatien-de-rochambeau | leader | french-expedition |
| haitian-revolution-1791-1804 | thomas-maitland | leader | britain-spain-royalists |
| franco-prussian-war-1870-1871 | achille-bazaine | executor | french-empire-and-republic |
| franco-prussian-war-1870-1871 | auguste-alexandre-ducrot | participant | french-empire-and-republic |
| franco-prussian-war-1870-1871 | charles-de-freycinet | participant | french-empire-and-republic |
| franco-prussian-war-1870-1871 | wilhelm-bracke | participant | international-and-socialists |

두 사건 모두 sides를 써서 opponent는 쓰지 않았다. side id는 `event_get`으로 확인한 기존 값이다.

## 검증
`{changedBy:'queue-events-20261007-extra', people:[...]}`를 scratchpad `people-extra-a.json`으로 떠서 `scripts/commulingo-people-upsert --dry-run`: **8명 모두 approved, nothing written**.
처음에는 bio·epithet이 편집 한도(epithet ko 60/en 140, bio ko 380/en 900; `person-editorial-contract.json`)를 넘어서 거부되었고, 약력을 줄여 통과시켰다.

## 확인할 점
1. 메스 항복일: 사건 본문은 10월 27일(Siege of Metz 항목), 바젠 항목은 「capitulated on 28 October」. 카드는 출처대로 28일로 썼다. 항복 병력도 사건 본문 17만 3천~19만 3천, 바젠 항목은 「prisoners of war to the number of 180,000」.
2. 벨레 출생 연도는 출처가 「1746/1747」. years는 1746으로 두었고 약력에 두 해를 적었다. 출신(nationalOrigin)은 세네갈 출생이지만 flag-icons에 senegal 코드가 없어 비워 두었다.
3. 브라케 대표 활동을 party-german-spd로 둔 것(SDAP 1869–1875를 SPD로 묶음)은 베벨·리프크네히트 카드의 관행을 따른 것이다. SDAP를 따로 카탈로그에 올릴지는 상위에서 판단한다.
4. 메이틀랜드 출신은 스코틀랜드 귀족(로더데일 백작가)이지만 출처 문구에 「Scottish」가 없고 flag 코드도 없어 uk로 두었다.
5. 입장 모음을 비운 인물: 로샹보, 메이틀랜드, 뒤크로(출처에 정치적 입장이 명시되지 않음).
