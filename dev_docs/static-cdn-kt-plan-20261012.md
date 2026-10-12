# KT 회선 지연과 정적 파일 CDN 계획 (2026-10-12)

상태: 계획만 있음. 1단계(효과 확인)부터 사용자가 진행한다.

## 진단

- 증상: KT 회선(서울, AS4766) PC에서 첫 화면·페이지 이동이 약 3초, 엣지에 캐시된 9KB 이미지도 10초 넘게 걸리거나 중간에 끊겨 엑스박스가 됐다. Brave·Chrome 모두 같았다.
- `/cdn-cgi/trace` 결과는 `colo=SEA`. KT 회선은 서울(ICN)이 아니라 시애틀 엣지로 붙는다.
- `curl -4`로 받으면 처음 9초 동안 0바이트, 5,464바이트(58%)에서 다시 멈췄다. PC와 Cloudflare 사이 구간에서 패킷이 유실된다.
- 원본(헬싱키 Hetzner)은 수 ms에 응답하고, 서버 근처 엣지(ARN)를 거쳐도 0.1~0.2초였다. 그 시각 nginx 오류도 없었다.
- LG U+ 모바일 데이터로는 매우 빠르다. Tailscale은 출구 노드를 쓰지 않아 무관하다. PC 네트워크에는 IPv6가 없다.
- 결론: KT와 Cloudflare(무료 플랜) 사이 경로 문제다. 서버·사이트 설정 문제가 아니다. KT는 국내 가정용 인터넷 점유율 1위라 한국어 방문자 상당수가 같은 지연을 겪을 수 있다.

## 이미 한 조치

- 홈 초상화를 1200px 원본(123KB) 대신 256·384px WebP(9·14KB)로 바꿨다(38686411).
- 폰트 미리받기 주소를 배포 해시 주소로 바꿔, 한국어 페이지가 Pretendard(330KB)를 두 번 받던 문제를 없앴다(731601ad).
- 비로그인 공개 HTML의 엣지 `stale-while-revalidate`를 300에서 86400으로 늘렸다(f980da13). 만료된 사본을 엣지가 바로 내주므로, 방문이 드문 엣지에서도 페이지 이동마다 원본까지 왕복하지 않는다.
- 위 조치로 받는 양과 원본 왕복은 줄었지만, KT↔Cloudflare 구간의 패킷 유실 자체는 남는다.

## Cloudflare 유료 플랜은 해결책이 아니다

Cloudflare 커뮤니티에 KT 사용자가 LAX·SJC·SEA로 붙는다는 보고가 여러 건 있다.

- Pro로 올리고 경로 최적화(Argo Smart Routing)까지 켰는데도 `colo`가 바뀌지 않았다는 보고가 있다.
- Business 플랜으로 해결됐다는 보고는 찾지 못했다.
- 통신사의 망 연결 비용 때문에 하위 플랜은 그 통신사에 서울 경로를 알리지 않는다는 포럼 답변이 있다. 공식 문서는 아니다.
- 같은 KT PC에서 www.cloudflare.com은 ICN으로 붙었다는 보고도 있다. 플랜보다 사이트에 배정된 IP 대역 문제일 수 있다.

확실한 것은 Enterprise(별도 계약)뿐이라 업그레이드는 하지 않는다.

- [Korean visitors routed to LAX/SJC/SEA instead of ICN (Free plan)](https://community.cloudflare.com/t/korean-visitors-routed-to-lax-sjc-sea-instead-of-icn-free-plan-origin-in-seoul/962794)
- [Argo made no difference](https://community.cloudflare.com/t/zone-consistently-routed-to-lax-sjc-instead-of-icn-for-korean-traffic-argo-made-n/950006)
- [Korean KT traffic routed to LAX instead of ICN](https://community.cloudflare.com/t/korean-kt-traffic-to-blog-ssakdiet-com-is-routed-to-lax-instead-of-icn/948760)

## 계획: 정적 파일만 서울 거점 CDN으로

끌어오기(pull) 방식 CDN을 붙인다. 서버는 지금처럼 파일을 내주고, CDN 서울 거점이 처음 한 번만 원본에서 받아 캐시한 뒤 방문자에게 내준다. 업로드는 필요 없다. 페이지 HTML·API·로그인은 그대로 Cloudflare를 거친다. HTML은 15KB 안팎이고 엣지 캐시가 길어져 영향이 상대적으로 작다.

후보는 Bunny CDN(서울 거점, 사용량 과금, 최소 월 1달러 정도)이다. 효과가 없으면 Amazon CloudFront(서울 거점)를 시험한다. 국내 CDN(KT Cloud·네이버 클라우드)은 국내 품질은 좋지만 해외 방문자에게 약하고 설정이 번거롭다. 가입 전에 요금표를 다시 확인한다.

### 1단계. 효과 확인 (사용자, 코드 변경 없음)

1. Bunny에 가입하고 Pull Zone을 만든다. Origin URL은 `https://cyber-lenin.com`으로 한다.
2. 생성된 임시 주소(`xxx.b-cdn.net`)로 KT PC에서 아래를 두 번 이상 실행한다.
   ```
   curl -4 -o NUL -w "%{time_total}s\n" https://xxx.b-cdn.net/images/home/portrait-256.webp
   ```
3. 두 번째부터 0.1초대면 진행한다. 느리면 멈추고 CloudFront로 같은 시험을 한다.

### 2단계. 주소 연결 (사용자, 대시보드)

- Pull Zone에 `static.cyber-lenin.com`을 추가하고 무료 SSL을 켠다.
- Cloudflare DNS에 `static` CNAME → `xxx.b-cdn.net`을 **회색 구름(DNS only)**으로 추가한다. 주황 구름이면 다시 Cloudflare를 거친다.
- Claude가 API로 작업하려면 Bunny API 키를 서버 `.env`에 넣는다.

### 3단계. 코드 변경 (Claude)

- 환경 변수 `STATIC_ORIGIN`(예: `https://static.cyber-lenin.com`)이 있을 때만 켠다. 비우면 지금처럼 동작하므로 이 값만 지우고 재시작하면 즉시 되돌릴 수 있다.
- HTML 속 정적 파일 주소(`/css/`, `/js/`, `/fonts/`, `/images/`, `/flags/`, `/assets/<해시>/`)를 `STATIC_ORIGIN` 주소로 바꾼다. 지금 CSS 주소를 릴리스 해시 주소로 바꾸는 `config/css-releases.js`의 `rewrite`가 출발점이다. 폰트 preload도 같은 곳에서 바뀐다.
- CSS 안의 `url(/assets/<해시>/fonts/...)`는 CSS 파일 기준으로 풀리므로 그대로 둔다.
- CSP(`script-src`, `style-src`, `font-src`, `img-src`)에 정적 주소를 추가한다. Web Worker는 다른 출처에서 띄울 수 없으므로 worker 스크립트는 같은 출처에 남긴다(`worker-src 'self' blob:`).
- 다른 출처 폰트에는 CORS가 필요하므로 `config/static-assets.js`와 `releasedAssets`가 폰트에 `Access-Control-Allow-Origin`을 붙이게 한다. 붙인 헤더가 CDN 캐시에도 남는지 확인한다.
- 수정 중인 파일(노노그램 페이지, 퍼즐 JSON 등 `no-store` 대상)은 옮기지 않는다.
- 확인: KT PC와 LG U+에서 홈·CommuLingo 페이지의 Network 탭, 폰트 CORS 오류, CSP 위반이 없는지. `?v=` 붙은 JS가 CDN에서 새 버전으로 바뀌는지.
- 끝나면 [운영 참고](frontend-operations.md)와 [page-speed](page-speed.md)를 갱신한다.

## 함께 정할 것

- 대시보드의 Cloudflare Web Analytics 자동 삽입(`static.cloudflareinsights.com/beacon.min.js`)이 CSP에 막히고 있다. 자체 집계(`/metrics/menu-view`)가 있으니 끄는 쪽을 추천한다. 데이터를 원하면 CSP에 허용한다.
- 다음에 느림을 조사할 때 원인을 바로 가를 수 있게 nginx 로그에 `$request_time`, `$upstream_response_time`, `$http_cf_ray`를 기록할지 정한다(적용에 sudo 필요).
