# 기존 사건 16편 보강 (2026-11-14)

소유자 요청 「공산링고 역사 사건 보강할 거 찾아봐라」 → 후보 다섯 묶음 가운데 「1(한국전쟁) → 3(주제에 비해 얇은 편) → 4(아시아·아프리카 사회주의 정권)」 승인. 사건 id·제목·기간·진영/초점은 그대로 두고 본문·출처·연표·지도 지점을 다시 썼다. DB 데이터 작업이라 커밋하지 않는다(작업물은 R2 보관).

## 작업물

- `scripts/content/events-depth-20261114/`(gitignore): `BRIEF.md`(공통 지침·편별 메모), `kit/event-enrich.js`(기존 사건 재작성 빌더: `baseline.json`의 옛 절 제목으로 절을 모두 지우고 새 절을 만들며 출처·연표·지점을 한 `editorial_batch`로 바꿈), `kit/baseline.sql`, 편별 폴더, `handoff-notes.txt`(편별 보고 요약과 남은 일).
- 편당 에이전트 하나, 동시 6개(하네스 상한), 편당 25~48분, 7만~33만 토큰. 하네스가 서브에이전트의 REPORT.md 쓰기를 자주 막아 보고는 마지막 메시지로 받았다.

## 반영

| 사건 | body_ko(인용 포함) | 연표 | 출처 | 지점 | 인물 |
| --- | --- | --- | --- | --- | --- |
| korean-war | 33,614 | 43 | 69 | 13 | 68 |
| ukraine-1917-1921 | 32,396 | 31 | 58 | 11 | 57 |
| sino-soviet-split | 29,252 | 29 | 42 | 9 | 45 |
| south-yemen-socialist-state-1967-1990 | 28,731 | 27 | 42 | 9 | 17 |
| dprk-foundation-1946-1948 | 27,146 | 28 | 46 | 5 | 24 |
| mongolian-republic-1921-1924 | 26,712 | 26 | 40 | 8 | 21 |
| beninese-socialist-transition-1974-1990 | 25,507 | 24 | 39 | 6 | 10 |
| congo-peoples-republic-1969-1991 | 24,780 | 28 | 38 | 4 | 15 |
| ethiopian-revolution-1974-1977 | 23,418 | 29 | 29 | 9 | 15 |
| mozambican-independence-1975-1977 | 22,703 | 26 | 33 | 7 | 6 |
| vietnam-reunification-1975-1976 | 22,120 | 22 | 39 | 8 | 21 |
| cambodian-regime-change-1975-1979 | 22,054 | 28 | 35 | 7 | 20 |
| malagasy-socialist-transition-1972-1975 | 22,004 | 26 | 40 | 6 | 10 |
| lao-republic-1975 | 20,796 | 19 | 45 | 5 | 10 |
| angolan-independence-1975-1977 | 20,613 | 22 | 37 | 7 | 19 |
| somali-socialist-transition-1969-1976 | 19,996 | 20 | 45 | 6 | 13 |

- 이전 한국어 본문은 4.2천~16.6천 자, 출처 3~11개(일부는 URL 없는 책 제목), 연표 6~8행이었다. 모든 문단에 출처 링크가 붙었다.
- 새 인물 카드 약 80장, 새 용어 약 90개, 카탈로그 정당 약 15개, 링크 승인 약 450건. 편별 id 목록은 `handoff-notes.txt`.
- 기존 본문의 근거 없는 수치·일화를 걷어내거나 출처대로 고쳤다(한국전쟁의 「48차례 승인 요청」·소련 조종사 일화, 북조선 1948년 헌법의 수도(서울), 에티오피아 붉은 테러 수치, 우크라이나 포그롬 수치, 중소분열 1958년 위기 서술 등).

## 같은 날 함께 한 일

- 사건 진영 정리: 진영이 있는 사건에서 소속이 분명한데 진영 밖에 있던 인물 49명(1차 세계대전 5명 포함)을 제 진영으로. 중재자·제3국 관찰자·나중의 회고자·역사가는 진영 밖에 둔다. 목록 `scripts/content/side-sweep-20261114/build.py`.
- 코드: `history_event` 수정에 `countries`를 받게 했다(a15877d9). 연표 행의 나라는 사건 countries 안에 있어야 한다. **MCP 컨테이너 배포 전**이라 아직 못 쓴다.
- `mykhailo-omelianovych-pavlenko` 카드: 활동·경력 연표·독소전쟁기 협력 절, 대조국전쟁·추축국 점령 유럽 사건 연결.

## 남은 일

- MCP 배포(`scripts/deploy --mcp-only`) 뒤 사건 countries 추가: 에티오피아 +somalia(오가덴 연표 행 다시 태깅), 모잠비크 +portugal·zambia·tanzania·south-africa 등, 베트남 통일 +china, 라오스 +vietnam·thailand, 민주캄푸치아 +thailand·china·malaysia, 콩고 +angola·france·soviet 등, 몽골 +china.
- 소유자 결정 대기: `proposal-concerning-the-general-line-1963` 용어(문헌 `sino-soviet-letters-1963`과 중복) 삭제 여부, 새 표기들(편별 `handoff-notes.txt`), 입장 모음을 비운 카드들, 박헌영 처형 연도(1955 / 1956.7.19).
