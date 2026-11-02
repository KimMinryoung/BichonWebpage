# 공산링고 설치형 앱(PWA)

2026-11-02 도입. 범위는 공산링고만이다(사용자 결정). 블로그·채팅·보고서 등 나머지 사이트에는 서비스 워커가 관여하지 않는다.

## 구성

- `routes/commulingo-pwa.js`(`routes/commulingo.js`가 맨 앞에 붙임): `/commulingo/manifest.webmanifest`, `/commulingo/sw.js`. `/en/commulingo/...`도 같은 처리기를 쓰며, 주소 언어(`req.urlLanguage`)로 이름·`start_url`·`scope`가 정해진다. 두 응답 모두 `Cache-Control: no-cache`이고 엣지 캐시(`Cloudflare-CDN-Cache-Control`)를 뺀다.
- 서비스 워커 원본은 `public/js/commulingo-sw.js`다. 라우트가 이 파일을 읽어 `Service-Worker-Allowed: /commulingo`(영어 `/en/commulingo`)와 함께 보낸다. `/js/` 정적 경로로도 읽히지만 1년 캐시라서 그 주소로는 등록하지 않는다.
- 등록: `views/partials/head.ejs`가 `/commulingo` 경로(관리 화면 제외)에만 매니페스트 링크와 `public/js/commulingo-pwa.js`를 넣는다. 등록 범위는 `/commulingo`(영어 `/en/commulingo`)다.
- 아이콘: `public/icons/commulingo-{192,512,maskable-512}.png`. 사이트 마스코트 그림(`assets.cyber-lenin.com/og-image.jpg`)에서 `scripts/build-pwa-icons.js`로 만든다(개발 의존성 sharp).

## 캐시 규칙 (`commulingo-sw.js`)

온라인 사용자가 받는 응답은 바뀌지 않는다. 캐시는 오프라인일 때만 쓰인다.

| 요청 | 방식 | 캐시(상한) |
| --- | --- | --- |
| 범위 안 화면 이동 | 네트워크 먼저, 실패하면 저장본(Vary 무시), 저장본도 없으면 오프라인 안내(503) | `commulingo-pages-v1`(150) |
| 강좌·덱·쇼츠 데이터(`catalog.json`, `lesson/<id>`, `drill/deck/<id>`, `drill/shorts/feed/<n>`) | 네트워크 먼저, 실패하면 저장본 | `commulingo-data-v1`(150) |
| `/assets/`·`/css/`·`/js/`·`/fonts/`·`/icons/`·`/flags/` | 저장본을 바로 주고 뒤에서 갱신 | `commulingo-static-v1`(200) |
| 그 밖(POST, 진도, 다른 도메인, 범위 밖 화면) | 관여하지 않음 | — |

200·같은 출처(`basic`) 응답만 저장하고, 상한을 넘으면 오래된 항목부터 지운다. 활성화 때 이름이 `commulingo-`로 시작하는데 위 목록에 없는 캐시를 지운다. 캐시 구조를 바꿀 때는 이름의 `-v1`을 올린다.

진도는 원래대로 localStorage와 서버 동기화 대기열을 쓰므로 오프라인에서 푼 문제도 연결되면 보내진다.

## 검사

`tests/browser/commulingo-pwa.js`: 매니페스트·헤더, 등록 범위, 연 화면과 강좌 데이터의 오프라인 재생, 열지 않은 화면의 안내, 범위 밖 화면 불간섭. Playwright의 `context.setOffline`은 서비스 워커의 fetch에 적용되지 않으므로 테스트는 서버를 닫아 오프라인을 만든다.

## 끄기

서비스 워커를 거둬야 하면 `commulingo-sw.js`를 `self.registration.unregister()`와 캐시 삭제만 하는 내용으로 바꿔 배포한다. 파일을 404로 만들면 이미 설치된 워커가 그대로 남는다.
