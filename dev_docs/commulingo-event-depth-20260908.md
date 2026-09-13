# CommuLingo 사건 본문 심화 — 2026-09-08

앞선 현실 사회주의 국가 확충 작업에서 추가한 16개 사건을 심화했다. 사용자가 알바니아 항목의 짧은 분량을 지적한 뒤, 같은 세션에서 알바니아를 먼저 보강하고 나머지 사건에도 적용하도록 승인했다. 운영 DB 반영 및 공개 페이지 확인을 마친 2026-09-08 작업 기록이다.

2026-09-13 재검토에서 16개 사건 모두의 `body_ko`·`body_en`이 이 배치 이후 다시 확장된 것을 확인했다. 질문·결과·연표·출처 필드는 이 스펙의 최종값과 일치한다. 따라서 아래 JSON은 당시 변경의 감사·복구 기준이지 현재 운영 본문의 정본이 아니다. 적용 스크립트가 후속 본문을 `concurrent change`로 거부하는 것이 정상이다.

## 변경 범위

- 한국어·영어 각각 87개 절, 119개 문단. 항목별 5~6개 절, 7~10개 문단.
- 배경, 국가 형성 과정, 주요 인물과 정치적 갈등, 경제·사회제도, 결과와 후속 전개를 국가별로 서술.
- 모든 문단에 근거 링크를 배치하고 본문 전체에서 출처 번호를 일관되게 사용. 핵심 질문·결과·연표도 양언어로 보강.
- 사건 ID·제목·요약·시기·국가·지도 좌표·자동링크 예외 및 인물·용어·계보도 연결 유지. 인물 데이터는 수정하지 않았다.

분량은 제목과 출처 링크를 제외한 한국어 본문 문자 수다.

| 사건 | 기존 | 보강 후 | 절 / 문단 |
|---|---:|---:|---:|
| [알바니아 해방과 인민공화국 수립](https://cyber-lenin.com/commulingo/events/albanian-socialist-transition-1944-1946) | 283 | 1984 | 5 / 10 |
| [라오스 인민민주공화국 수립](https://cyber-lenin.com/commulingo/events/lao-republic-1975) | 317 | 1450 | 5 / 7 |
| [베트남 전쟁 종결과 국가 통일](https://cyber-lenin.com/commulingo/events/vietnam-reunification-1975-1976) | 314 | 1385 | 5 / 7 |
| [몽골 혁명과 인민공화국 수립](https://cyber-lenin.com/commulingo/events/mongolian-republic-1921-1924) | 291 | 1455 | 5 / 7 |
| [앙골라 독립과 MPLA 정권 형성](https://cyber-lenin.com/commulingo/events/angolan-independence-1975-1977) | 299 | 1613 | 5 / 8 |
| [에티오피아 혁명과 데르그의 권력투쟁](https://cyber-lenin.com/commulingo/events/ethiopian-revolution-1974-1977) | 277 | 1445 | 5 / 7 |
| [소말리아 군사정권과 사회주의 선언](https://cyber-lenin.com/commulingo/events/somali-socialist-transition-1969-1976) | 281 | 1554 | 5 / 8 |
| [모잠비크 독립과 사회주의 노선](https://cyber-lenin.com/commulingo/events/mozambican-independence-1975-1977) | 295 | 1391 | 6 / 7 |
| [베냉 인민공화국과 국민회의 전환](https://cyber-lenin.com/commulingo/events/beninese-socialist-transition-1974-1990) | 289 | 1403 | 6 / 7 |
| [콩고인민공화국과 일당체제의 전환](https://cyber-lenin.com/commulingo/events/congo-peoples-republic-1969-1991) | 277 | 1427 | 6 / 7 |
| [마다가스카르의 군정과 사회주의 제2공화국](https://cyber-lenin.com/commulingo/events/malagasy-socialist-transition-1972-1975) | 301 | 1369 | 6 / 7 |
| [중화인민공화국 수립](https://cyber-lenin.com/commulingo/events/chinese-revolution-1949) | 314 | 1422 | 6 / 7 |
| [북조선의 사회개혁과 공화국 수립](https://cyber-lenin.com/commulingo/events/dprk-foundation-1946-1948) | 311 | 1561 | 5 / 8 |
| [쿠바 혁명과 사회주의 전환](https://cyber-lenin.com/commulingo/events/cuban-revolution-1959-1961) | 284 | 1437 | 5 / 7 |
| [남예멘 독립과 사회주의 국가의 변천](https://cyber-lenin.com/commulingo/events/south-yemen-socialist-state-1967-1990) | 336 | 1414 | 6 / 7 |
| [민주캄푸치아와 1979년 정권 교체](https://cyber-lenin.com/commulingo/events/cambodian-regime-change-1975-1979) | 343 | 1652 | 6 / 8 |

## 자료 검토

- 미국 의회도서관 Country Studies의 해당 역사·경제 장을 기본 자료로 사용하되, 오래된 자료의 시각과 오류를 그대로 일반화하지 않았다.
- 몽골 헌법 채택일은 몽골 의회 자료의 1924년 11월 26일로 대조했다.
- 북한의 1946년 법령은 국사편찬위원회 자료를 대조했다. 토지 분배와 전후 협동화를 구분했다.
- 쿠바의 1959년 집권, 1960년 국유화·무역 제한, 1961년 사회주의 선언과 1962년 전면 금수를 구분했다.
- 베냉·콩고의 헌법과 전환기 문서, IMF·세계은행 경제 자료, 모잠비크 루사카 협정 자료를 사용했다.
- 앙골라 1977년 체포·처형 문단에는 국제앰네스티의 당시 조사 보고서를 추가했다. 불확실한 희생자 수를 단일 확정치로 제시하지 않았다.
- 캄보디아는 특별재판소의 사건별 자료와 피해자 증언을 포함하며, 민주캄푸치아와 1979년 이후 인민공화국의 경제제도를 구분했다.

## 재현 가능한 파일

- `scripts/content/socialist-event-depth-20260908.json`: 원문 기대값, 최종 수정 필드, 구조화된 양언어 문단·출처.
- `scripts/apply-socialist-event-depth.js`: 기본 읽기 전용 사전 검사. `--production` 및 `DB_HOST=leninbot-pg`를 명시해야 운영에 접근하며, `--apply`가 있어야 쓴다. 현재값 충돌 시 전체 중단; 동일한 최종값은 재수정하지 않는다.
- `scripts/test-socialist-event-depth-db.js`: 빈 일회용 DB에서 사전 검사·트랜잭션 롤백·충돌 거부·메타데이터 보존·재실행을 검증한다.

## 반영 및 검증

- 16개 사건을 단일 트랜잭션으로 갱신했다. 이후 앙골라 문단에 동시대 조사 보고서 출처를 한 차례 추가했고, 최종 일괄 스펙과 DB가 일치함을 대조했다.
- 공식 `snapshotCommuLingoHistoryEvents()`로 스냅샷 갱신. 프런트엔드 재시작이나 이미지 배포 없음.
- `npm test`: 전체 통과. 이후 추가한 DB 검증 스크립트까지 개별 ESLint 통과.
- 격리 DB: 읽기 전용 무변경, 마지막 UPDATE 실패 시 전부 롤백, 기대값 충돌 차단, 정상 적용 및 동일값 재실행 통과.
- 운영 최종 대조: 16개 수정 필드 일치, 다른 사건 77개 무변경, 전체 인물·용어 관계 및 대상 사건의 나머지 메타데이터 보존.
- 운영에서 최종 스펙 재실행: 16개 모두 unchanged.
- Playwright: 운영 서버의 16개 사건 × 한국어·영어 = 32개 페이지 HTTP 200, 모든 문단·질문·결과·목차 앵커·외부 출처·계보도 링크 확인, 페이지 스크립트 오류 없음.
- 공개 도메인의 알바니아 항목 HTTP 200 및 보강된 5개 절 확인. 공개 도메인의 일시적 접속 지연 후 전체 검증은 운영 서버 직접 접속으로 수행했다.
- 1440px 데스크톱 및 390px 모바일 화면 확인. 밝은/어두운 테마 캡처, 모바일 가로 넘침 없음, 목차 이동 정상.

작업 증거와 백업은 `/tmp/commulingo-event-depth-20260908/`에 보관했다. `production-before.json`, `production-after.json`, `production-apply.log`, `production-repeat.log`, `npm-test.log`, `browser-results.json`, `albania-*.png`가 있다. 장기 복구 기준은 저장소 스펙의 `expected` 값이다. 과거 값 복원 시에도 이후 편집이 없는지 먼저 대조해야 한다.
