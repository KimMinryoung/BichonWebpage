# 웹서비스 코드와 기능 설계 개선 검토

작성일: 2026-10-04. 검토 기준 커밋: `3f1a5d4497d42251df936fc502a6891b908b4501`.

이 문서는 cyber-lenin.com의 개선 작업을 맡을 인간 개발자와 AI Agent를 위한 인수인계 자료다. 현재 구현을 설명하고, 개선이 필요한 이유와 수정 방향, 완료를 확인할 방법을 함께 적었다. 이번 작업은 조사와 문서 작성이며 애플리케이션·운영 데이터·배포 설정은 변경하지 않았다.

우선순위가 높은 일은 새 기능 추가보다 **개인화 화면의 캐시 경계, 관리자 API의 설정 누락 대응, 학습 기록의 계정 분리와 동기화, 문헌 저장의 안전성**이다. 서버와 클라이언트에 이미 유용한 공통 모듈·캐시·검증이 있으므로 전면 재작성보다 문제별로 작은 변경을 진행하는 편이 적절하다. 기능 설계에서는 학습을 마쳤다는 표시의 의미를 분명히 하고, 첫 방문자의 시작 부담과 실제 학습 흐름을 검증하는 것이 먼저다.

## 반영 현황 (2026-10-04)

| ID | 상태 | 반영 내용 / 남은 범위 |
| --- | --- | --- |
| A01 | 반영 | engines·Dockerfile·검사 대체 이미지를 `node:24.21.0-alpine`(24.x)로 전환. |
| A02 | 반영 | `setShortPublicCache`가 세션 쿠키 요청에는 `private, no-cache`+Vary를 유지. `GET /commulingo/progress`는 `no-store`. |
| A03 | 반영 | 운영에서 빈 ADMIN_ALLOWED_IPS는 전면 거부(개발 환경만 허용). 쉼표·공백만 있는 값도 빈 값으로 판정. |
| A04 | 일부 | import 시 `data/commulingo/doc-sanitize.js` 허용 목록 정화. 기존 144편은 정화로 내용이 바뀌지 않음을 검사로 고정. 읽기 경로 정화·CSP 강화는 미착수. |
| A05 | 반영 | 브라우저 기록에 계정 소유자 표시. 다른 계정·로그아웃이면 지우고 서버 기록만 받음. 익명 기록은 첫 로그인 계정에 자동 합류(선택 UI는 두지 않음). |
| A06 | 반영 | 문항별 변경 세대로 ACK 처리, 단일 전송, 실패 시 5초~5분 backoff, 401/403 보류. |
| A07 | 반영 | 강좌 진도 저장과 채팅 localStorage/sessionStorage 접근을 예외 안전하게 처리. |
| A08 | 닫음 | manifest·본문을 임시 파일+rename으로 교체, 본문을 먼저 씀. revision 계약은 하지 않기로 함: 관리자 문헌 편집 화면(`/admin/commulingo-docs`)은 쓰이지 않고, 저장 시 링크 표현·별칭·자동 링크 제외를 보내지 않아 링크 반려를 덮어쓰지 않는다. 남는 동시 저장 경합은 드물고, 서버 밖 `manifest.json` 직접 편집은 잠금으로도 막을 수 없다. |
| A12 | 일부 | 세션 이력도 최신 N행을 시간순으로 반환. 이전 구간 cursor 페이지는 미착수. |
| A13 | 반영 | 목록 page를 1~1000으로 clamp, 숫자가 아닌 상세 ID는 404. |
| A15 | 일부 | `scripts/test-access-boundaries.js`(A02·A03), schedule smoke의 계정 소유 검사(A05), 문헌 정화 smoke(A04) 추가. |
| A16 | 일부 | 전체 재조회 주기·cache-policy 설명 정정. 모듈 분리는 미착수. |
| A10 | 반영 | `/ready`(DB 필수·Redis는 보고만, 실패 시 503)를 deploy 대기·주 컨테이너 검사에 연결, Redis 장애 시 비로그인 기능만 제공하고 장애 공지(2026-10-04 후속), 네트워크 연결 실패 즉시 중단. 목록 원본 실패 시 안내+`no-store`, 빈 목록이면 503. 홈은 일부 실패 안내만(200). |
| A14 | 반영 | `/p/:slug` 본문을 서버에서 정화해 HTML로 보냄(`services/static-page-render.js`, sanitize-html). 브라우저 DOMPurify·CDN 의존 제거. 운영 14개 페이지(영어 포함 17개)를 브라우저에서 기존 DOMPurify 결과와 비교했고 본문 텍스트·요소·높이가 같았다. 차이는 개선 세 가지: `id="timeline"` 유지(목차 링크 복구), `target="_blank"` 유지, 영어 페이지 본문 링크의 `/en/` 현지화. JavaScript를 꺼도 본문·SVG가 보인다. |
| A11 | 반영 | 문항 의미 버전 대신 ID 규칙(소유자 결정): 사소한 수정·개선은 ID 유지, 통째로 바꾸면 `q3-r20261004`처럼 새 ID. 재작업 하네스(`candidate.js`)가 자동 적용, `scripts/check-commulingo-question-ids.js`가 `npm test`에서 HEAD 대비 위반을 막는다(9월 실제 커밋으로 보정: 교체 111·26건 전부, 문구 수정 119건 0건 검출). |
| F01 | 반영 | 오답 재시도로 다 맞혀도 완료는 유지, 저장 점수는 첫 시도 점수(재수강 시 가장 높은 첫 시도). |
| F02·F04 | 닫음 | 소유자 판단: 첫 화면 문제 없음, 실사용에서 탐색 문제 없음. |
| F03 | 검토 중 | 소유자 방향: 메뉴 페이지별 접근 횟수 집계. 엣지 캐시 때문에 서버 집계 불가 — 방식 결정 대기. |
| A09 | 닫음 | 소유자 판단: 실제 문제 없음. |

## 검토 기준과 읽는 방법

근거 링크는 이 문서 기준 상대 경로다. `#L번호`는 위 커밋에서의 위치를 나타내며, 이후 코드가 바뀌면 함께 적힌 함수명을 기준으로 찾는다. 운영 환경변수 값·실제 CDN 규칙·사용자 데이터는 조회하지 않았다.

- **확인:** 코드에서 해당 동작을 읽었거나 부작용 없는 격리 검사로 재현했다.
- **위험:** 발생 조건을 코드로 설명할 수 있지만 운영에서 실제 발생했는지는 확인하지 않았다.
- **제품 가설:** 사용자 경험 개선 제안이다. 이용률이나 학습 효과가 입증되었다는 뜻이 아니다.

우선순위는 P1이 권한·정보 노출·기록 손실·운영 판정에 영향을 주는 작업, P2가 사용자 흐름과 지속적인 변경의 신뢰성을 개선하는 작업, P3가 관찰 결과에 따라 착수할 후속 작업이다. 작업 규모의 소·중·대는 상대적인 구현·검증 범위이며 일정 추정이 아니다. 확인된 침해나 운영 장애가 없어 긴급 사고를 뜻하는 P0는 부여하지 않았다.

## 서비스 구조와 기능 지도

Express 4와 EJS가 HTML을 만들고, 일반 JavaScript가 화면을 보강한다. PostgreSQL에는 계정·글·보고서·사전·학습 기록 등이 있고, Redis는 세션과 응답 재료 캐시에 쓰인다. 문헌 HTML·manifest, 강좌 원본·생성 shard, 사전 스냅숏은 `data/`에 있다. 이 디렉터리는 운영 컨테이너에 호스트 마운트되므로 파일 수정 자체가 서비스에 영향을 준다.

| 영역 | 사용자 흐름과 구현 경로 | 검토 결과 |
| --- | --- | --- |
| 홈과 사이트 메뉴 | [public.js](../routes/public.js) → [index.ejs](../views/public/index.ejs), [nav.ejs](../views/partials/nav.ejs) | 최근 콘텐츠를 병렬로 읽고 채팅·CommuLingo·글로 연결한다. 부분 실패와 개인화 캐시 경계를 개선할 여지가 있다. |
| 게시물과 AI 일기 | [entry-routes.js](../routes/entry-routes.js), [ai-diary.js](../routes/ai-diary.js) → Redis/DB → EJS | 목록·상세·이전/다음·사전 자동 링크가 공통화되어 있다. 페이지 입력과 오류 표현을 보강한다. |
| 보고서와 허브 | [reports.js](../routes/reports.js), [hub.js](../routes/hub.js), [research-render.js](../services/research-render.js) | 공개 연구·정적 페이지와 관리자 전용 작업 보고서가 구분되어 있다. 연구 본문은 서버에서 렌더링하지만 `/p/:slug`와 작업 보고서는 클라이언트 렌더링에 의존한다. |
| 채팅과 작성 도구 | [proxies.js](../config/proxies.js), [chat-history.js](../routes/chat-history.js), [chat.js](../public/js/chat.js) | 백엔드 프록시와 로컬 이력 조회를 함께 사용한다. 계정 이력과 익명 fingerprint 이력의 경계, 긴 대화 복원, 저장 불가 환경을 검토했다. 작성 도구는 별도 관리자 호스트·세션을 요구한다. |
| 계정과 관리자 | [auth.js](../routes/auth.js), [webauthn.js](../routes/webauthn.js), [admin.js](../routes/admin.js), [commulingo-admin-api.js](../routes/commulingo-admin-api.js) | 일반 계정은 비밀번호·passkey, 관리자는 passkey를 사용한다. 화면용 세션 인증과 자동화용 IP 인증의 차이를 명시적으로 관리해야 한다. |
| CommuLingo 강좌와 훈련 | [commulingo-books.js](../routes/commulingo-books.js), [commulingo-drills.js](../routes/commulingo-drills.js) → [commulingo.js](../public/js/commulingo.js), [commulingo-progress.js](../routes/commulingo-progress.js) | 강좌·개념도·역사 선택형·퀴즈·연표·쇼츠가 있다. 비로그인 기록은 브라우저에, 로그인 기록은 DB에도 저장된다. 계정 경계와 동기화에 구체적 개선 지점이 있다. |
| 사전과 문헌 | [commulingo-people.js](../routes/commulingo-people.js), [commulingo-terms.js](../routes/commulingo-terms.js), [commulingo-events.js](../routes/commulingo-events.js), [commulingo-docs.js](../routes/commulingo-docs.js) | 인물·용어·사건·문헌을 자동 링크·관련 보고서·학습 링크로 연결한다. 검색 요청 제어와 revision 기반 편집은 유지할 설계다. 문헌 파일 쓰기는 다른 편집 경로보다 보호가 약하다. |
| 지도와 계보 | [commulingo-map.js](../routes/commulingo-map.js), [commulingo-genealogy.js](../routes/commulingo-genealogy.js), [commulingo-politburo.js](../routes/commulingo-politburo.js) | 국가 허브·사건·인물과 시각 자료를 연결한다. 확대·키보드 접근의 일부가 구현되어 있다. 실제 이용 과제와 보조기술 검증은 별도로 필요하다. |
| 게임 | [strike-engine.js](../public/js/strike-engine.js), [strike.js](../public/js/strike.js), [nonogram-logic.js](../public/js/nonogram-logic.js), [nonogram.js](../public/js/nonogram.js) | 순수 규칙과 화면 코드가 분리되어 있고 게임 규칙·퍼즐 검사가 있다. 메뉴에서 게임을 덜 드러내는 것은 의도된 설계이므로 결함으로 취급하지 않는다. |
| 공통 운영 | [server.js](../server.js), [route-policy.js](../config/route-policy.js), [scripts/deploy](../scripts/deploy), [nginx 설정](../nginx/leninbot-frontend.conf) | 세션 생략·언어·캐시 정책과 standby 배포가 있다. HTTP 200만으로 콘텐츠와 의존 서비스의 준비 여부를 판정하는 한계가 있다. |

### 유지할 설계와 이미 해결된 과제

- [route-policy.js](../config/route-policy.js)는 세션·언어·캐시 분류의 공통 기준이다. 공개 요청마다 Redis 세션을 만드는 방식으로 되돌리지 않는다.
- [public-model-cache.js](../utils/public-model-cache.js)는 공개 데이터만 캐시하고 갱신 실패 시 기존 값을 유지한다. [db-change-listener.js](../utils/db-change-listener.js)는 공개 콘텐츠 변경을 전달한다. 새 캐시를 만들기 전에 이 경로를 재사용한다.
- [read-snapshot.js](../data/commulingo/read-snapshot.js)는 한 사전을 동일한 읽기 트랜잭션으로 묶고, [snapshot-store.js](../data/commulingo/snapshot-store.js)는 동일 데이터의 객체 참조를 유지한다. 자동 링크 캐시가 이 참조에 의존하므로 단순 복사·폴링 변경도 영향을 줄 수 있다.
- 인물 편집의 [submitPersonEdit](../data/commulingo/person-editorial-service.js#L29)는 revision과 근거를 검사한다. [직책 저장소](../data/commulingo/people-offices-store.js)는 잠금을 사용한다. 동시성 보호가 전혀 없다는 식의 제안은 현재 코드와 맞지 않는다.
- [검색 요청 제어](../public/js/commulingo-search-utils.js)는 취소와 늦은 응답 무시를 처리한다. 이번 검사에서도 통과했다. 검색을 클라이언트 전체 데이터 다운로드 방식으로 되돌리지 않는다.
- 문헌의 [목차와 페이지 분할](../data/commulingo/docs-store.js), 연구 보고서의 [서버 렌더링](../services/research-render.js), [보고서 역색인](../services/report-mentions.js)의 작업 양보·캐시는 기존 성능 개선이다. 새 측정 없이 같은 최적화를 다시 제안하지 않는다.
- [이전 최적화 계획](site-optimization-plan.md)에는 폰트 분할·에셋 버전·공통화 등의 완료 기록이 있다. [DB 후속 후보](commulingo-database-followups.md)의 revision·마이그레이션 이력·직책 잠금도 완료 항목이다. 문서에 남은 과거 후보를 그대로 백로그로 복사하지 않는다.

## 우선순위 요약

| ID | 개선 작업 | 우선순위 | 규모 | 근거 수준 |
| --- | --- | --- | --- | --- |
| A01 | 지원 중인 Node.js로 실행 환경 통일 | P1 | 중 | 설정 확인·공식 지원 일정 확인 |
| A02 | 개인화 HTML의 공유 캐시 차단 | P1 | 중 | 헤더 조합 재현·운영 캐시 공유 여부 미확인 |
| A03 | 관리자 IP 설정 누락 시 접근 차단 | P1 | 소 | 미설정 허용 재현·운영 설정 미확인 |
| A04 | 문헌 HTML의 능동 콘텐츠 제거 | P1 | 중 | 위험 속성 잔존 재현·브라우저 실행 미검증 |
| A05 | 학습 기록의 계정별 브라우저 저장 분리 | P1 | 중 | 읽기·병합·업로드 경로 확인 |
| A06 | 답안 전송 경합과 실패 재시도 개선 | P1 | 중 | 늦은 ACK 경합 재현 |
| A07 | 저장 불가 환경에서도 학습과 채팅 유지 | P1 | 소 | 예외 전파 재현 |
| A08 | 문헌 파일 교체와 편집 충돌 보호 | P1 | 중 | 비원자적 쓰기·revision 부재 확인 |
| A09 | DB 이력과 문헌 파일 변경의 복구 설계 | P2 | 중 | 파일 변경 후 DB COMMIT 순서 확인 |
| A10 | 빈 목록과 장애 구분 및 배포 준비 검사 | P1 | 중 | HTTP 상태·배포 검사 경로 확인 |
| A11 | 문항 의미 변경과 기록 버전 분리 | P2 | 대 | 진도 API·저장 키 확인 |
| A12 | 긴 채팅 이력의 최신 구간 복원과 페이지 이동 | P2 | 중 | 정렬·상한·클라이언트 경로 확인 |
| A13 | 목록 페이지와 상세 ID 입력 정규화 | P2 | 소 | 입력·쿼리 경로 확인 |
| A14 | 정적 페이지 본문의 서버 렌더링 | P2 | 중 | 초기 HTML·CDN 의존 확인 |
| A15 | 인증·동기화·캐시 경계의 회귀 검사 보강 | P2 | 중 | 기본 검사 진입점 확인 |
| A16 | 클라이언트 경계와 운영 문서의 정합성 개선 | P3 | 중 | 중복·모듈 책임·문서 차이 확인 |
| F01 | 학습 종료와 정답·이해 상태의 의미 분리 | P2 | 중 | 상태 계산 확인·제품 가설 |
| F02 | 첫 방문자가 한 가지 학습을 바로 시작하도록 설계 | P2 | 중 | 현재 화면 확인·제품 가설 |
| F03 | 학습 입구부터 완료까지 측정 범위 연결 | P2 | 중 | 현행 계측 범위 확인·제품 가설 |
| F04 | 콘텐츠 탐색과 접근성의 실제 과제 검증 | P3 | 중 | 연결 구조 확인·사용성 미검증 |

## 코드와 운영 개선 항목

### A01 지원 중인 Node.js로 실행 환경 통일

**근거와 영향.** [package.json](../package.json#L6)은 `20.x`, [Dockerfile](../Dockerfile#L2)은 `node:20.20.2-alpine`을 지정한다. [scripts/test](../scripts/test#L19)와 [scripts/lint](../scripts/lint#L13)도 같은 20 이미지로 대체 실행한다. 검토일 기준 Node 20은 공식 지원 종료 상태이며, 공식 일정의 종료일은 2026-04-30이다. 특정 패키지 취약점이 확인되었다는 뜻은 아니다. [Node.js 릴리스 상태](https://nodejs.org/en/about/previous-releases), [공식 일정 원본](https://raw.githubusercontent.com/nodejs/Release/main/schedule.json).

**권장 작업.** 지원 기간이 더 긴 Node 24 LTS를 기본 후보로 삼아 engines·Docker·검사 대체 이미지·개발 안내를 함께 전환한다. 구현 시점의 지원 중인 패치 이미지와 digest를 확인해 고정하고 lockfile 호환성을 검사한다. Express 대규모 업그레이드와 묶지 않는다. 개발 스크립트가 최소 버전만 보고 다른 major를 허용할지, 운영 major와 일치하도록 검사할지도 통일한다.

**완료 기준.** 새 실행 환경에서 `npm ci`, 전체 기본 검사, 이미지 시작·종료가 통과한다. 실제 passkey 인증과 채팅 스트리밍은 격리 환경 또는 승인된 테스트 계정으로 확인한다. 운영은 기존 `scripts/deploy`를 사용하며 이미지 교체로 바뀌지 않는 host-mounted 데이터는 되돌리기 대상으로 혼동하지 않는다.

### A02 개인화 HTML의 공유 캐시 차단

**근거와 영향.** [viewLocals](../middleware/view-locals.js#L41)는 세션의 계정·관리자 정보를 템플릿에 전달한다. [nav.ejs](../views/partials/nav.ejs)에는 사용자 이름, 관리자 메뉴, 로그아웃 폼의 CSRF 토큰이 있다. 반면 [setShortPublicCache](../data/commulingo/page-helpers.js#L22)는 무조건 `public, max-age=30, stale-while-revalidate=300`을 설정하고 [용어 화면 등](../routes/commulingo-terms.js#L106)이 이를 호출한다.

[cachePolicy](../middleware/cache-policy.js#L20)와 이 함수를 순서대로 실행한 격리 검사에서 일반 계정의 최종 헤더는 `Vary: Cookie, Accept-Language`와 `public`, 관리자 응답은 이 경로에서 Vary 없이 `public`이었다. 따라서 개인화된 HTML을 공유 캐시가 저장해도 된다고 선언하는 코드상의 위험이다. 저장소 nginx는 `proxy_cache off`이며, 실제 Cloudflare 규칙이나 다른 사용자에게 노출된 사례는 확인하지 않았다. 토큰 표시 자체가 권한 획득을 의미하지도 않는다.

**권장 작업.** 공용 캐시 헬퍼를 요청·응답 맥락을 받는 형태로 변경하거나, HTML 최종 응답 단계에서 정책을 강제한다. 세션 쿠키가 있는 개인화 HTML은 `private, no-store`, 세션 없는 공개 HTML만 기존 언어 정책에 맞춰 캐시한다. 계정과 무관한 catalog·덱 JSON의 버전 캐시는 별도로 유지한다. 하위 라우트가 보호 헤더를 덮어쓰지 못하도록 검사한다.

**완료 기준.** 동일 URL의 익명·일반 계정·관리자·한영 응답을 검사한다. 계정 정보·CSRF 토큰을 담은 HTML은 항상 공유 캐시 금지이며 익명 응답에 개인 정보가 없어야 한다. 운영에서는 테스트 계정으로 헤더와 CDN 캐시 상태를 확인하되 실제 타인 계정의 캐시를 수집하지 않는다.

### A03 관리자 IP 설정 누락 시 접근 차단

**근거와 영향.** [isAllowedIp](../middleware/auth.js#L22)는 allowlist가 비어 있으면 `true`를 반환하고 [validateEnv](../config/env.js#L46)는 경고만 출력한다. [CommuLingo 관리자 API](../routes/commulingo-admin-api.js#L25)는 공통 IP 검사 뒤 people·offices·docs 등 일부 경로에 관리자 세션을 요구하지 않는다. 문헌 쓰기는 [CSRF 예외](../server.js#L99)이며, 이는 자동화 도구를 지원하는 의도된 경로다. 빈 설정으로 임의 IP가 통과하는 동작을 격리 검사로 확인했다.

저장소 nginx의 공개 `/admin` 차단은 `/commulingo/admin/api`까지 차단하지 않는다. 운영 allowlist의 실제 설정 여부는 확인하지 않았으므로 현재 누구나 쓰기가 가능하다고 단정하지 않는다. 문제는 설정 누락이 쓰기 권한 확대가 되는 구조다.

**권장 작업.** 운영에서 빈 allowlist는 부팅 실패 또는 관리자 API 전면 거부로 처리한다. 문자열이 쉼표·공백만인 경우에도 파싱 결과로 판정한다. 개발 환경의 예외는 명시적인 로컬 설정으로 제한한다. 세션 없이 허용하는 자동화 경로와 세션이 필요한 GUI 경로를 문서·검사에서 구별한다. 기존 CLI를 깨뜨리지 않도록 IP 인증을 무조건 세션 인증으로 바꾸지는 않는다.

**완료 기준.** 빈 값·공백·허용 IPv4·IPv6-mapped IPv4·비허용 IP를 검사한다. 문헌 API의 잘못된 content type·교차 출처 요청이 거부되는지도 확인한다. 비밀값은 로그에 남기지 않는다.

### A04 문헌 HTML의 능동 콘텐츠 제거

**근거와 영향.** [extractFragment](../data/commulingo/docs-import.js#L28)는 script·style 블록 등을 정규식으로 제거하지만 HTML 안전성 검사기는 아니다. `onerror` 속성과 `javascript:` 링크를 넣은 입력이 출력에 남는 것을 격리 검사로 확인했다. [문헌 읽기](../data/commulingo/docs-store.js#L235)는 파일을 읽어 목차를 만들고 [linkDocHtml](../data/commulingo/doc-presentation.js#L49)은 링크를 보강한다. [뷰](../views/public/commulingo-doc.ejs#L116)는 결과를 이스케이프하지 않고 넣는다. CSP의 [scriptSrc](../config/security.js#L11)는 `unsafe-inline`도 허용한다.

문헌 등록은 관리 권한 경로이지만 외부 HTML을 가져오는 편집 작업이므로 작성자의 신뢰와 원본 HTML의 안전성은 분리해야 한다. 현재 저장된 문헌에 악성 코드가 있거나 브라우저에서 실제 실행된 것은 검사하지 않았다.

**권장 작업.** 문헌용 서버 sanitizer를 import 직전과 기존 파일 읽기 경로에 적용한다. 본문·표·각주·목차 ID·허용된 SVG 등 현재 문헌에서 필요한 구조를 먼저 조사해 허용 목록을 정한다. 이벤트 속성·실행 가능한 URL·외부 능동 요소는 제거한다. 일반 글용 `sanitizeBasic`을 그대로 적용해 문헌 구조를 손상시키지 않는다. CSP 강화는 인라인 스크립트 정리와 함께 별도 단계로 한다.

**완료 기준.** 이벤트 속성·URL 프로토콜·SVG·잘못 닫힌 태그에 대한 표적 검사와 실제 대표 문헌의 렌더 비교가 통과한다. 긴 문헌의 페이지 이동·각주 왕복·기존 주소 redirect가 유지되어야 한다. 운영 데이터 대량 재작성은 읽기 보호가 검증된 뒤 별도 작업으로 진행한다.

### A05 학습 기록의 계정별 브라우저 저장 분리

**근거와 영향.** [강좌](../public/js/commulingo.js#L10), [홈](../public/js/commulingo-index.js#L35), [복습 기록](../public/js/commulingo-schedule.js#L11)은 계정과 무관한 고정 localStorage 키를 쓴다. 강좌의 [syncServerProgress](../public/js/commulingo.js#L361)는 서버 자료와 로컬 자료를 병합하고 로컬 진도를 현재 로그인 계정으로 업로드한다. [로그아웃](../routes/auth.js#L341)은 서버 세션만 제거한다.

따라서 같은 브라우저에서 A가 학습하고 로그아웃한 뒤 B가 로그인해 강좌를 열면 A의 기록이 B의 진도와 병합될 수 있다. 이 경로는 코드로 확인했지만 실제 운영 계정 두 개로 재현하지는 않았다. DB의 `user_id` 조건이 있어도 업로드 출처가 잘못되면 해결되지 않는다.

**권장 작업.** 진도·답안·이어하기 저장 키를 익명 저장소와 계정 ID별 저장소로 분리한다. 현재 사용자의 안정적 ID를 bootstrap 자료 또는 진도 응답으로 전달하고, 사용자 확인 전에 이전 계정 기록을 화면에 표시하거나 업로드하지 않는다. 기존 v1 기록은 소유자를 알 수 없으므로 자동으로 현재 계정 기록이라고 간주하지 않는다. 익명 기록의 계정 가져오기는 사용자의 선택으로 수행한다.

**완료 기준.** A 학습 → 로그아웃 → B 로그인, 익명 → 가입, 계정 변경 중 열려 있는 탭, 오래된 전송 응답을 검사한다. B는 A 기록을 보거나 올리지 않아야 한다. 정상 계정의 기기 간 동기화와 익명 학습은 유지한다.

### A06 답안 전송 경합과 실패 재시도 개선

**근거와 영향.** [queueAnswerSync와 flushAnswerSync](../public/js/commulingo.js#L160)는 dirty 표시를 boolean으로 관리하고 전송 성공 시 같은 문항 키를 무조건 지운다. 답안 v1 전송 중 v2를 기록하고 v1 성공 응답이 늦게 오는 순서를 검사했더니, 메모리에는 v2가 있지만 dirty 표시는 사라졌고 예약된 다음 flush는 요청을 보내지 않았다. 같은 문항 재시도와 느린 네트워크에서 가능한 순서다.

실패 시에도 `.catch(function() {})` 또는 `!res.ok` 반환으로 끝나며 그 실패만으로 재시도를 예약하지 않는다. 로컬 기록은 남아 재방문·새 답안으로 복구될 수 있으므로 모든 기록이 영구 소실된다는 뜻은 아니다. 사용자가 이번 세션의 저장 완료를 신뢰하기 어렵다는 문제다.

**권장 작업.** dirty 항목에 변경 세대를 두고 요청에 실은 세대와 현재 세대가 같을 때만 ACK로 제거한다. 한 전송 큐가 최대 200개씩 순서대로 보내도록 하고 실패는 제한된 backoff로 재시도한다. 계정 전환 시 큐를 이전 계정에 묶거나 취소한다. 진도 저장도 성공·대기·실패를 구별하고 계정 재확인이 필요한 401/403과 재시도 가능한 통신 오류를 구분한다.

**완료 기준.** 늦은 ACK, 전송 중 같은 문항 변경, 201개 이상 기록, 응답 실패·네트워크 복귀·계정 변경을 검사한다. 성공한 옛 응답이 새 기록을 전송 대상에서 빼면 안 된다. DB의 기존 `lastAt` 비교와 미래 시각 보정은 유지한다.

### A07 저장 불가 환경에서도 학습과 채팅 유지

**근거와 영향.** 강좌의 [saveLocalProgress](../public/js/commulingo.js#L326)는 localStorage 예외를 처리하지 않는다. [finishLesson](../public/js/commulingo.js#L1092)은 이를 서버 전송과 결과 화면 구성보다 먼저 호출하므로 저장 예외가 완료 흐름을 중단한다. 채팅의 [getUserId](../public/js/chat.js#L77)와 persona 초기 읽기도 예외를 처리하지 않는다. 저장 접근이 거부되거나 용량이 부족한 상황을 stub으로 재현했다. 게임과 일부 다른 저장 경로에는 이미 try/catch가 있다.

**권장 작업.** 브라우저 저장 어댑터를 공통화하고 읽기·쓰기 실패 시 현재 페이지의 메모리 상태로 계속 동작시킨다. `null`·배열 등 유효하지 않은 저장 JSON도 검증한다. 채팅 익명 ID를 저장할 수 없으면 이번 방문용 ID를 사용하고 장기 이력이 유지되지 않음을 안내한다. 서버 저장까지 실패했을 때만 복구 가능한 상태를 표시한다.

**완료 기준.** getItem·setItem이 예외를 던지는 조건, 손상된 JSON, 용량 부족을 검사한다. 학습 결과와 다음 행동·채팅 입력은 사용 가능해야 하며 저장 성공으로 잘못 표시하지 않아야 한다.

### A08 문헌 파일 교체와 편집 충돌 보호

**근거와 영향.** [writeManifest](../data/commulingo/docs-import.js#L88)는 대상 파일에 바로 쓰고, [importDoc](../data/commulingo/docs-import.js#L187)는 본문을 쓴 뒤 manifest를 쓴다. [updateDocMeta](../data/commulingo/docs-import.js#L198)는 최신 파일을 읽지만 편집 화면의 expectedRevision을 받지 않는다. 같은 프로세스의 동기 함수끼리는 실행이 겹치지 않더라도, 운영·standby·CLI처럼 서로 다른 프로세스와 오래된 편집 화면까지 보호하지는 못한다.

**권장 작업.** 같은 디렉터리의 고유 임시 파일에 작성·검증하고 rename으로 교체한다. 파일 전체 교체 보호와 오래된 화면의 필드 덮어쓰기 보호는 별개이므로 manifest hash 또는 항목 revision을 쓰기 계약에 추가한다. 공유 잠금 아래 재읽기·revision 비교·교체를 수행한다. 본문과 manifest의 두 파일을 한 번의 rename으로 원자적으로 바꿀 수는 없으므로, import는 새 본문 파일을 먼저 완성하고 manifest 참조를 마지막에 전환하는 방식 등 실패 복구 절차를 마련한다.

**완료 기준.** 두 프로세스의 같은/다른 문헌 편집, 오래된 revision 제출, 교체 중 강제 실패를 임시 디렉터리에서 검사한다. 독자는 부분 JSON을 읽지 않고, 충돌은 409 등 명확한 응답이며 기존 본문과 메타데이터가 복구 가능해야 한다. 실제 `data/`를 테스트 fixture로 사용하지 않는다.

### A09 DB 이력과 문헌 파일 변경의 복구 설계

**근거와 영향.** [rejectExpression](../data/commulingo/link-review-service.js#L305)은 DB 검토 기록을 변경하고 문헌이면 `updateDocMeta`를 호출한 다음 `COMMIT`한다. 파일 변경 뒤 COMMIT이 실패하면 DB는 롤백되어도 파일은 돌아가지 않는다. DB 트랜잭션으로 파일까지 보호된다는 가정이 성립하지 않는 구간이다. 실제 실패 사례는 재현하지 않았다.

**권장 작업.** A08의 파일 안전성을 먼저 마련한다. 이후 문헌 변경 작업에 작업 ID·대상 revision·적용 상태를 기록하고 재시도 가능한 조정 절차를 둔다. DB의 변경 의도를 먼저 기록한 뒤 파일을 적용하고 완료를 기록하는 방식으로 실패 상태를 식별할 수 있게 한다. 작업이 미완료인 동안 API가 성공 완료를 반환하지 않도록 한다. 장기적으로 DB를 문헌 메타데이터의 원본으로 옮길 수 있으나 이번 개선에 전체 이전을 요구하지 않는다.

**완료 기준.** DB 기록 실패, 파일 교체 실패, 파일 성공 후 상태 기록 실패를 주입한다. 작업 재실행으로 같은 변경이 중복되지 않고, 운영자가 미완료 상태와 복구 결과를 확인할 수 있어야 한다. 링크 반려의 이력과 실제 표현 목록이 일치해야 한다.

### A10 빈 목록과 장애 구분 및 배포 준비 검사

**근거와 영향.** [홈](../routes/public.js#L89)은 개별 조회 실패를 빈 배열로 바꾸고, [hub 목록](../routes/hub.js#L42)과 [entry 목록](../routes/entry-routes.js#L75)은 catch에서도 기본 상태인 200으로 빈 목록을 렌더링한다. 이는 부분 서비스를 유지하려는 장점이 있지만 실제 콘텐츠가 없는 경우와 장애를 구분하지 못한다. [health](../server.js#L126)는 항상 `ok`이고 [deploy route sweep](../scripts/deploy#L182)은 200 여부를 검사한다. [DB 초기 연결](../config/database.js)은 실패를 로그에만 남기며, deploy의 [network connect](../scripts/deploy#L144) 실패도 즉시 중단하지 않는다.

**권장 작업.** 조회 결과에 `ok`·`stale`·`unavailable` 상태를 구분하고 마지막 정상 자료가 있으면 제공한다. 홈의 일부 실패는 정상인 다른 영역을 유지하되 해당 영역에 재시도 안내를 표시한다. 주 자료를 읽을 수 없고 대체 자료도 없는 목록은 503을 반환한다. `/health`는 가벼운 생존 검사로 유지하고 별도 readiness에서 DB·필수 데이터·세션에 필요한 Redis 상태를 역할별로 판정한다. 배포 스크립트에 이 준비 검사를 연결하고 네트워크 연결 실패를 명확히 보고한다.

**완료 기준.** 정상 빈 DB, 읽기 실패, 정상 캐시를 가진 실패, DB 복구를 구별한다. 생존만 하는 새 컨테이너가 standby 검사를 통과해 교체되면 안 된다. 기존 deploy가 하는 검사를 외부에서 중복 실행하지 말고 스크립트 안의 판정 자체를 보강한다.

### A11 문항 의미 변경과 기록 버전 분리

**근거와 영향.** [답안 DB 계약](../scripts/migrations/163_commulingo_question_progress.sql)은 계정·lesson·question ID를 키로 쓰며 내용 버전은 없다. [진도 API](../routes/commulingo-progress.js#L141)도 `questionId`와 시각을 기준으로 병합한다. [shards](../data/commulingo/shards.js#L140)의 version은 콘텐츠 전달·캐시용으로 사용되지만 이 답안 계약에 포함되지 않는다. 같은 ID의 의미·정답이 바뀌면 예전 정답과 복습 상태가 새 문항의 기록으로 읽힐 수 있다.

**권장 작업.** 문항의 의미 버전을 도입하고 정답·핵심 의미 변경과 단순 오탈자 수정을 구별한다. 답안·복습·진도 계약에 그 버전을 전달한다. 전체 카탈로그 hash가 바뀔 때 모든 기록을 초기화하는 방식은 피한다. 기존 ID·폐기된 오프라인 기록의 읽기를 유지하고, 의미가 바뀐 기록은 과거 기록으로 남기되 현재 문항의 완료로 계산하지 않는다.

**완료 기준.** 오탈자 수정은 기록 유지, 정답 변경은 새 상태로 평가, 이전 클라이언트 기록은 안전하게 수신하는 검사가 있어야 한다. DB·브라우저 저장 마이그레이션을 단계적으로 적용한다. 현행 시각 기반 병합은 여러 기기의 독립 답안 횟수를 합산하지 않으므로, 정확한 시도 이력까지 필요해지는 경우에는 별도 이벤트 모델을 검토한다.

### A12 긴 채팅 이력의 최신 구간 복원과 페이지 이동

**근거와 영향.** [listChatHistory](../config/chat-log-store.js#L34)는 sessionId가 있으면 오래된 순서로 정렬한 뒤 LIMIT을 적용한다. [resumeSession](../public/js/chat.js#L350)은 `limit=200`으로 요청하고 결과를 복원하며 이후 페이지를 요청하지 않는다. 따라서 DB 행 200개를 넘는 세션에서는 처음 200개만 받고 최근 대화가 빠지는 경로다. 한 행에 사용자 질의와 AI 답이 함께 있을 수 있으므로 이 상한을 화면 말풍선 200개라고 설명해서는 안 된다.

**권장 작업.** 초기 복원은 최신 구간을 가져와 시간순으로 보여 주고, 앞선 구간은 `(created_at, id)` cursor로 읽는다. 응답에 `hasMore`와 다음 cursor를 추가한다. 연결 끊김 후 답 복구도 최신 응답을 찾을 수 있도록 같은 계약을 사용한다. 로그인 조회는 현재처럼 계정 ID 조건을 유지한다.

**완료 기준.** 0·1·200·201개 이상의 행, 같은 시각의 여러 행, 삭제된 말풍선, persona 분리, 다른 계정 요청을 격리 DB에서 검사한다. 중복·누락 없이 최신 답변을 복원해야 한다.

익명 조회는 [요청 fingerprint](../routes/chat-history.js#L20)를 받아 DB 조건에 사용한다. 로그인 조회의 계정 경계는 확인했지만 익명 fingerprint의 소유 증명·백엔드의 결합 정책까지 감사하지는 않았다. 익명 이력 접근 계약을 백엔드와 함께 별도로 확인하고, 단순 식별자를 본인 인증과 동일하게 취급하지 않는다는 점을 문서화한다.

### A13 목록 페이지와 상세 ID 입력 정규화

**근거와 영향.** [entry 목록](../routes/entry-routes.js#L45)은 `parseInt(page) || 1`만 사용하므로 음수와 매우 큰 값이 남아 DB OFFSET으로 전달된다. 범위 밖 페이지는 `COUNT(*) OVER()` 결과 행이 없어 전체 개수를 0으로 처리한다. [상세](../routes/entry-routes.js#L84)는 `parseInt`이므로 숫자 뒤 문자가 붙은 ID도 같은 글로 해석될 수 있다. 다른 [hub](../routes/hub.js#L22)·reports 라우트는 이미 clamp를 사용한다.

**권장 작업.** 공통 [clampInteger](../utils/http.js)를 이용해 page의 기본값·하한·상한을 통일한다. 문자가 섞인 상세 ID는 404로 처리하고 실제 빈 목록과 범위 밖 페이지를 구별한다. 큰 페이지 요청으로 불필요한 OFFSET 쿼리·캐시 키를 만들지 않도록 한다. 전체 건수 조회를 분리할지는 실제 목록 규모를 확인한 뒤 결정한다.

**완료 기준.** page의 누락·0·음수·비숫자·큰 수·마지막 페이지 다음 값, 상세의 잘못된 ID를 검사한다. 응답·canonical URL·페이지 표시가 서로 맞아야 한다. SQL 보간의 table은 내부 상수이므로 이 항목은 확인된 SQL injection이라는 주장이 아니다.

### A14 정적 페이지 본문의 서버 렌더링

**근거와 영향.** [page-view.ejs](../views/public/page-view.ejs#L25)의 초기 본문은 빈 div이고, raw JSON을 브라우저 DOMPurify로 처리한다. CDN 또는 JavaScript가 동작하지 않으면 본문 읽기가 막힌다. [report-view.ejs](../views/public/report-view.ejs#L38)도 클라이언트 렌더링이지만 이것은 관리자 작업 보고서다. 모든 공개 보고서가 같은 문제를 갖는 것은 아니며 연구 보고서는 이미 서버에서 렌더링한다.

**권장 작업.** 공개 `/p/:slug`를 먼저 문헌·도해 구조를 보존하는 서버 sanitizer로 렌더링한다. style·SVG 사용의 허용 범위를 페이지 계약으로 정하고 사용자 코드와 사이트 UI를 분리한다. 클라이언트는 점진적 기능 보강만 맡긴다. 채팅과 passkey에 남는 외부 라이브러리는 self-host 여부와 갱신 절차를 별도로 평가한다. 현재 SRI가 있는 자산을 검증 없이 교체하지 않는다.

**완료 기준.** JavaScript 비활성화와 CDN 실패 조건에서도 공개 본문·목차·링크가 읽힌다. 도해·표·한영·다크/라이트를 대표 페이지 하나로 확인하며 위험 HTML은 실행되지 않는다. UI 변경이므로 실제 구현·배포 때 브라우저 검사를 한 번 수행한다.

### A15 인증과 동기화와 캐시 경계의 회귀 검사 보강

**근거와 영향.** [scripts/test](../scripts/test#L38)는 템플릿·SEO·게임·CommuLingo 정책·콘텐츠 검사를 실행한다. 그러나 그 진입점에는 일반 계정 로그인과 진도 API의 통합 동작, 개인화 HTML 캐시 정책에 대한 전용 검사가 없다. [check-ui](../scripts/check-ui.js#L21)는 EJS 컴파일과 정적 규칙 검사이며 전체 템플릿이 실제 locals로 렌더링되고 조작되는 것을 보장하지 않는다. 이번에 기존 검사가 통과하면서도 A02·A06·A07을 별도 검사로 재현했다는 점이 이 공백의 근거다.

**권장 작업.** 각 수정과 함께 최소 회귀 검사를 추가한다. 순수 계정 저장·전송 큐·헤더 정책은 DB 없이 실행하고, 진도 API·권한·cursor 검사는 격리 DB로 실행한다. 기존 [계측 DB 검사](../scripts/test-commulingo-measurement-db.js)의 격리 원칙을 참고한다. 통합 검사 fixture는 운영 데이터와 분리하고, 전체 단위 검사를 브라우저로 대체하지 않는다.

**완료 기준.** A02의 개인화 캐시, A05의 계정 변경, A06의 늦은 ACK, A07의 저장 예외를 수정 전 실패·수정 후 성공하는 검사로 남긴다. 기본 검사의 DB 없는 실행을 유지한다. 서버 환경에서 추가 통합 검사를 언제 실행하는지 운영 문서에 적고 배포 검사를 중복하지 않는다.

### A16 클라이언트 경계와 운영 문서의 정합성 개선

**근거와 영향.** [commulingo.js](../public/js/commulingo.js)는 저장·동기화·레슨 선택·문항 상태·결과 표시를 한 IIFE에서 처리한다. [홈 클라이언트](../public/js/commulingo-index.js#L75)에도 별도 진도 병합이 있어 A05·A07을 한쪽만 고치기 쉽다. 서버에는 entry·검색·snapshot 등 공통화가 이미 있으므로 파일이 많거나 CommonJS라는 사실 자체는 재작성 근거가 아니다.

운영 설명도 코드와 차이가 있다. [DB 후속 문서](commulingo-database-followups.md)는 전체 재조회가 10주기라고 설명하지만 현재 [FULL_REFRESH_EVERY](../data/commulingo/snapshot-store.js#L37)는 60이다. [cache-policy.js](../middleware/cache-policy.js#L1)의 익명 HTML 캐시 설명과 공통 `private` 정책도 읽는 사람에게 혼동을 줄 수 있다.

**권장 작업.** A05~A07을 구현할 때 저장·계정 병합·전송 큐를 공통 모듈로 분리하고 플레이어 표시와 상태 전환은 그대로 둔다. 문서의 상수·응답·원본 저장 위치는 코드와 맞춰 정정한다. API·DB·파일의 계약 변경에 필요한 마이그레이션과 leninbot 측 사본·클라이언트 영향을 작은 표로 정리한다. 이 과정에 프레임워크 전환이나 전체 TypeScript 도입을 묶지 않는다.

**완료 기준.** 홈과 강좌가 같은 계정 저장·병합 규칙을 사용하고 기존 공개 URL·JSON·진도가 유지된다. 동작을 보존하는 리팩터는 격리 검사와 대표 렌더 비교로 확인한다. 성능 개선은 대표 홈·사전·긴 문헌·큰 강좌의 cold/warm 응답과 이벤트 루프·메모리·DB 질의를 먼저 측정하고 병목에만 적용한다. 이 검토에서는 새 성능 수치를 측정하지 않았다.

## 기능 설계 개선 항목

### F01 학습 종료와 정답과 이해 상태의 의미 분리

**현재 동작.** [finishLesson](../public/js/commulingo.js#L1079)은 오답 재시도가 모두 맞으면 `completed=true`, `score=total`로 저장한다. 첫 점수는 화면 계산에 쓰이지만 서버 계약에는 별도 필드가 없다. 반면 [활동 계측](commulingo-learning-measurement.md)은 completed를 결과 화면 도달로 정의한다. 같은 완료라는 말이 서로 다른 상태를 나타낸다.

**제품 가설과 권장 작업.** 결과 화면 도달, 최초 시도 점수, 해설을 본 뒤 재시도 성공을 구분해 표시한다. 같은 문제를 다시 맞힌 상태를 새 사례 적용 능력이나 장기 숙달로 해석하지 않는다. 기존 completed의 호환 의미를 유지하면서 화면 문구를 먼저 명확히 하고, 필요한 기록만 확장한다. 이미 문항별 출처와 [선택지 피드백](../public/js/commulingo.js#L1011)이 있으므로 모든 해설을 새로 만들 필요는 없다.

**완료 기준.** 첫 시도 전부 정답, 오답 후 재시도 성공, 중도 종료, 결과 화면만 도달한 경우를 화면과 집계에서 구별한다. 새 사례 적용으로 이해를 확인하는 파일럿은 [학습 설계](commulingo-learning-design.md)를 재사용한다. 효과 수치는 사용자 관찰 전 주장하지 않는다.

### F02 첫 방문자가 한 가지 학습을 바로 시작하도록 설계

**현재 동작.** [CommuLingo 첫 화면](../views/public/commulingo-index.ejs#L14)은 전체 진도, 사전, 업데이트, 이어하기, 훈련장, 책 선택을 제공한다. 첫 방문자에게 0%와 여러 선택지가 보인다. [쇼츠](../routes/commulingo-drills.js#L70)는 이미 구현되어 있으므로 짧은 형식이 없다는 주장은 틀리다.

**제품 가설과 권장 작업.** 새 방문자는 책을 고르는 것보다 질문 하나와 학습 결과 약속을 보고 시작하는 편이 쉬울 수 있다. 기존 [짧은 학습 제안](commulingo-learning-design.md)의 질문 → 설명 → 새 사례 적용 흐름을 작은 파일럿으로 검증한다. 첫 화면에는 편집자가 고른 하나의 입구와 예상 분량을 두고, 기록이 있는 사용자에게는 이어하기를 우선한다. 사전과 긴 강좌는 유지한다. 매일 방문·연속 출석을 전제로 하지 않는다.

**완료 기준.** 초심자가 모바일에서 로그인 없이 하나의 학습을 찾아 시작·완료할 수 있는지 관찰한다. 제목 이해·선택 부담·어려운 문장을 기록한다. 사람이 적으면 파일럿의 성공률을 전체 이용자의 행동으로 일반화하지 않는다. 기능 확장보다 검수된 콘텐츠 소량으로 시작한다.

### F03 학습 입구부터 완료까지 측정 범위 연결

**현재 동작.** [계측 서비스](../services/commulingo-measurement.js)와 [클라이언트](../public/js/commulingo-measurement.js#L66)는 강좌·드릴의 started·answered·completed를 다룬다. 운영자·자동화 제외, 수집 거부, 중복 제거, 30일 보관은 이미 구현되어 있다. [현행 설명](commulingo-learning-measurement.md)은 쇼츠·사전 열람·복습·개념도·역사 선택형을 제외한다. 시작하지 않은 사람이 학습 입구를 봤는지도 이 기록만으로 알 수 없다.

**제품 가설과 권장 작업.** F02 파일럿의 카드 노출·시작을 먼저 연결해 입구 노출 부족과 시작 후 이탈을 구분한다. 콘텐츠 ID·의미 버전·언어·진입 영역 정도만 기록하고 계정·IP·원문 referrer는 추가하지 않는다. 쇼츠는 정답이 없으므로 answered·정답률로 억지 변환하지 않는다. 카드 읽기 목표를 먼저 정의한 뒤 필요하면 별도 이벤트를 추가한다.

**완료 기준.** 테스트·거부 이용이 빠지고 같은 이벤트 재전송은 중복되지 않는다. 결과에는 분모·표본 수·미측정 범위를 붙인다. 라운드 ID는 사람 수가 아니며 retry 완료는 최초 정답과 다르다. [계측 API](../routes/commulingo-measurement.js#L29)의 204는 제외·중복·미삽입에도 쓰이므로 HTTP 성공 건수를 저장된 학습 건수로 집계하지 않는다.

### F04 콘텐츠 탐색과 접근성의 실제 과제 검증

**현재 동작.** 사전별 검색, 관련 문헌·보고서·강좌, 국가 허브·지도·계보가 풍부하다. [courseChaptersFor](../data/commulingo/book-page.js#L308)와 [학습 링크 partial](../views/partials/commulingo-practice-links.ejs)이 이미 읽기와 학습을 연결한다. 지도에는 [focus 가능한 영역과 확대](../public/js/commulingo-world-map.js#L27), 강좌에는 [키보드 단축키](../public/js/commulingo.js#L95)와 live 영역, 공통 UI에는 focus 스타일이 있다. 접근성 지원이 전혀 없다고 볼 수 없다.

**제품 가설과 권장 작업.** 독자가 인물·사건·용어 중 어떤 종류인지 모르는 상태에서 찾을 때 분류별 입구가 부담일 수 있다. 우선 기존 검색과 관련 링크로 실제 과제를 수행해 보고, 반복되는 실패가 확인되면 종류별 결과를 묶는 얇은 통합 검색 입구를 추가한다. 범용 AI 검색이나 개인화 추천부터 만들지 않는다. 긴 문헌에서 관련 항목을 열었다 돌아오는 흐름, 영어 본문 제공 여부, 모바일 지도에서 국가를 찾는 과제도 함께 본다.

**완료 기준.** 이름으로 검색 → 관련 사건 → 근거 문헌 → 관련 학습, 문헌 각주 왕복, 한국어/영어 전환을 대표 과제로 정한다. 키보드·화면 읽기 도구에서 초점 이동·정오 피드백·로딩 오류가 전달되어야 한다. 지도와 계보의 핵심 관계는 텍스트 경로로도 찾을 수 있어야 한다. 관찰한 실패와 실제 수정 항목을 연결하고 [디자인 기준](design-system.md)의 토큰·공통 셸을 재사용한다.

## 권장 작업 순서와 인수인계 조건

1. **기반과 경계부터:** A01 실행 환경 전환은 별도 변경으로 진행한다. A02 캐시·A03 관리자 설정·A04 문헌 HTML을 각각 수정하고 해당 회귀 검사를 붙인다. 운영 설정 확인은 값 공개 없이 통과/실패로 보고한다.
2. **학습 기록 신뢰성:** A05 계정 저장 계약을 먼저 정하고 A06 전송 큐·A07 저장 실패를 같은 계약으로 구현한다. A16의 작은 모듈 분리는 이 작업에 포함하되 학습 화면 전면 변경은 피한다.
3. **편집과 운영 판정:** A08 파일 저장 보호 → A09 DB/파일 복구 순서로 진행한다. A10의 상태와 준비 검사, A13의 입력 검사는 독립적으로 진행할 수 있다.
4. **사용자 흐름 보강:** A12 긴 이력·A14 본문 렌더링을 개선한다. F01의 화면 의미를 먼저 정리하고 A11 기록 버전과 필요한 데이터 확장을 연결한다. F02 파일럿에는 F03의 최소 측정을 함께 둔다.
5. **관찰 후 확장:** F04 탐색·접근성 과제를 보고 통합 검색·추천 등 후속 범위를 정한다. 새 성능 측정에서 확인된 병목만 추가로 최적화한다.

각 작업 PR은 이 문서 ID, 수정 전 발생 조건, 유지할 API·저장 계약, 실제 수행한 검사, 남은 운영 검증을 설명한다. 인물·용어·직책 편집의 기존 validation·revision·잠금을 우회하지 않는다. contract JSON을 바꾼 작업은 AGENTS.md에 따라 leninbot 사본도 동기화한다. 모든 UI 변경에는 필요한 브라우저 검사 한 번을 포함하며 정상 deploy가 수행한 검사를 반복하지 않는다.

배포·DB 마이그레이션·운영 데이터 적용은 별도 실행 작업이다. `data/` 변경은 즉시 운영에 반영될 수 있으므로 임시 fixture나 격리 DB에서 검증한 뒤 적용한다. 이 문서의 제안만으로 운영 데이터 실험이나 타인 계정 접근을 허가받았다고 해석하지 않는다.

## 이번 검증 결과와 한계

| 수행한 검사 | 결과와 해석 |
| --- | --- |
| `node scripts/smoke-commulingo-schedule.js` | 통과. 현행 복습 일정·최신 시각 병합을 확인했다. 계정 저장 분리나 전송 큐 검사는 아니다. |
| `node scripts/smoke-commulingo-search-requests.js` | 통과. debounce·취소·늦은 응답 무시·페이지 요청 오류를 확인했다. |
| `node scripts/check-ui.js` | 통과. 88개 EJS 컴파일과 공통 CSS·정적 규칙을 검사했다. 브라우저 렌더링이나 접근성 검사는 아니다. |
| `node scripts/test-strike.js` | 통과. 캠페인·결정적 복원·저장 마이그레이션 등 현재 규칙을 확인했다. |
| `node scripts/test-nonogram.js` | 통과. 공개 퍼즐의 유일해와 풀이·모순 검사를 확인했다. |
| 실제 함수의 격리 VM 검사 | A03 IP 허용, A04 위험 HTML 잔존, A06 ACK 경합, A07 강좌/채팅 저장 예외를 재현했다. fs·DB·네트워크 쓰기 없이 함수와 stub을 사용했다. |
| 실제 캐시 미들웨어와 헬퍼 조합 | A02의 일반 계정·관리자 최종 `public` 헤더를 재현했다. 실제 CDN을 사용한 사용자 간 정보 노출 검사는 아니다. |

검사 환경의 호스트 Node는 `v18.19.1`이었다. 위 순수 검사 통과는 목표 운영 Node 20 또는 제안 Node 24에서 전체 검사를 통과했다는 뜻이 아니다. 이번 문서 작성에는 배포·이미지 빌드·전체 `npm test`·운영 DB 검사·브라우저 검사를 수행하지 않았다. Node 지원 상태만 공식 출처를 확인했고 패키지별 취약점 감사를 수행하지 않았다.

전 라우트의 등록과 주요 기능 경로를 살펴보고 위험 구간을 심화 검토했지만 모든 콘텐츠·쿼리·백엔드 구현을 전수 감사하지는 않았다. 실제 트래픽·사용자 수·학습 효과·메모리·지연 수치는 새로 측정하지 않았다. 운영 설정·CDN 캐시 키·DB 제약과 인덱스의 실제 적용 상태·백엔드의 익명 이력 권한은 후속 작업자가 해당 환경에서 확인해야 한다. 기존 문서의 날짜별 관측 수치를 현재 상태로 인용하지 않았다.

### 답안 ACK 경합의 최소 재현

다음 코드는 저장소 루트에서 실행한다. 현재 파일에서 함수만 추출해 실행하고 요청·타이머·DOM을 대체하므로 DB나 운영 서비스에 접속하지 않는다. 마지막 출력이 `1 undefined 1`이면 전송한 정답 횟수는 1, 새 답의 dirty 표시는 없음, 다음 flush까지 요청 수는 1회라는 뜻이다. 메모리에 남은 최신 정답 횟수 2는 전송되지 않는다. 수정 후에는 최신 답이 큐에 남거나 두 번째 요청이 발생해야 한다. 함수 추출은 검토 커밋의 형태에 맞춘 것이므로 리팩터 이후에는 회귀 검사로 옮긴다.

```bash
node <<'NODE'
const fs = require('fs'), vm = require('vm');
const source = fs.readFileSync('public/js/commulingo.js', 'utf8');
function extract(name) {
  const start = source.indexOf('    function ' + name + '(');
  if (start < 0) throw new Error('function missing: ' + name);
  return source.slice(start, source.indexOf('\n    }', start) + 6);
}
const pending = [], timers = new Map();
let timerId = 0;
const context = {
  dirtyAnswers: { 'l/q1': true },
  answers: { 'l/q1': { right: 1, lastAt: '2026-10-04T00:00:00Z' } },
  answerSyncTimer: null,
  document: { querySelector: () => ({ getAttribute: () => 'test-token' }) },
  Schedule: {
    splitKey: k => ({ lessonId: k.split('/')[0], questionId: k.split('/')[1] }),
    key: (l, q) => l + '/' + q
  },
  setTimeout: fn => { timers.set(++timerId, fn); return timerId; },
  clearTimeout: id => timers.delete(id),
  fetch: (url, options) => new Promise(resolve => {
    pending.push({ resolve, body: JSON.parse(options.body) });
  })
};
vm.createContext(context);
vm.runInContext(extract('queueAnswerSync') + '\n' + extract('flushAnswerSync'), context);
context.flushAnswerSync();
context.answers['l/q1'] = { right: 2, lastAt: '2026-10-04T00:00:01Z' };
context.queueAnswerSync(['l/q1']);
pending[0].resolve({ ok: true });
setImmediate(() => {
  const dirty = context.dirtyAnswers['l/q1'];
  for (const fn of timers.values()) fn();
  console.log(pending[0].body.answers[0].right, dirty, pending.length);
});
NODE
```
