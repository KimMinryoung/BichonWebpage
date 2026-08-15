# SEO 색인 개선 계획

> 최초 점검: 2026-08-15
>
> 대상: `https://cyber-lenin.com` 운영 프론트엔드
>
> 목표: 한국어 원문을 검색엔진이 안정적으로 대표 문서로 선택하게 하고, 중복 URL에 쓰는 크롤 예산을 줄이며, 콘텐츠 유형별 색인 상태를 추적한다.

## 운영 기준선

- `robots.txt`, `sitemap.xml`: HTTP 200
- sitemap: 고유 URL 3,319개, 약 368 KB
  - CommuLingo 2,678
  - AI diary 429
  - research/reports 174
  - 기타 38
- Google Search Console 도메인 인증 TXT 존재
- Bing `BingSiteAuth.xml` 존재
- canonical, description, robots, Open Graph, RSS/Atom discovery link 적용됨
- 공개 검색에서 홈, 목록, 개별 보고서 색인이 확인됨

## P0 — 대표 언어와 중복 색인

- [x] 쿠키가 없는 공개 HTML의 기본 언어를 한국어로 고정한다.
  - 종전에는 접속 국가와 `Accept-Language`에 따라 동일 canonical URL의 본문이 한국어/영어로 바뀌었다.
  - Googlebot의 쿠키 없는 요청이 영어판을 받던 문제를 우선 차단한다.
  - 사용자가 언어 메뉴에서 영어를 선택하면 기존 `lang=en` 쿠키로 영어판을 계속 제공한다.
- [x] `/commulingo/**` 공개 상세 페이지와 `/chat`도 동일한 공개 언어 정책을 적용한다.
- [x] 한국어 `siteDescription`을 실제 한국어 설명으로 교체한다.
- [x] 홈 `<title>`에 정세 분석·정치경제·AI 주권이라는 주제 신호를 넣는다.
- [x] Markdown 원문과 Markdown 목록에 `X-Robots-Tag: noindex`를 보낸다.
- [x] Markdown 응답에 HTML 대표 문서를 가리키는 HTTP `Link: rel="canonical"` 헤더를 보낸다.

## P1 — 구조화 데이터와 발견성

- [x] 공개 research `Article` JSON-LD에 `datePublished`, `dateModified`를 넣는다.
- [x] JSON-LD publisher에 로고를 넣고 선택적으로 저자 URL과 대표 이미지를 받을 수 있게 한다.
- [x] research 영구 캐시 키를 `v4`로 올려 발행일·수정일 필드가 없는 기존 캐시를 자동 폐기한다.
- [ ] 글마다 실제 내용을 대표하는 1:1, 4:3, 16:9 이미지를 제공하고 Article JSON-LD 및 OG에 연결한다.
- [x] 홈 JSON-LD를 `WebSite` + `Organization` + 현재 `ItemList`의 `@graph`로 구성한다.
- [x] 글·보고서·큐레이션·정적 페이지와 CommuLingo 상세 문서에 `BreadcrumbList`를 추가한다.
- [x] 전용 head를 쓰는 CommuLingo 참고 문헌 리더에도 canonical, hreflang, robots, Open Graph, JSON-LD를 적용한다.

## P1 — 고정 다국어 URL 전환

- [x] 기존 무접두 URL을 한국어 canonical로 유지한다.
- [x] 영어판을 `/en/...` 고정 URL로 제공한다.
- [x] 한국어/영어 문서 쌍에 상호 `hreflang="ko"`, `hreflang="en"`, `x-default`를 추가한다.
- [x] 영어판의 공개 내부 링크가 모두 `/en/...`을 유지하도록 HTML 링크 현지화와 공통 URL helper를 적용한다.
- [x] sitemap에 번역이 실제 존재하는 문서만 영어 URL과 hreflang 쌍으로 싣는다.
- [x] 기존 `?lang=en` 요청은 대응하는 `/en/...`으로 303 전환하고, 영어 쿠키로 무접두 URL에 접근하면 `/en/...`으로 302 전환한다.
- [x] 영어 고정 URL 방문 시 언어 쿠키도 영어로 맞춰 인증·관리 경로처럼 접두사를 쓰지 않는 페이지에서도 언어 선택을 유지한다.
- [ ] Search Console에서 canonical 선택과 국가/언어별 노출 변화를 확인한다.

고정 URL 예시:

- 한국어: `https://cyber-lenin.com/reports/research/labor-history-01`
- 영어: `https://cyber-lenin.com/en/reports/research/labor-history-01`

번역이 없는 문서의 `/en/...` 접근은 사용자 언어 UI를 유지하지만 `noindex`와 한국어 canonical을 내보내며, 영어 sitemap에서는 제외한다.

## P2 — sitemap 관측성과 콘텐츠 품질

- [ ] `sitemap.xml`을 sitemap index로 바꾸고 `core`, `reports`, `commulingo`, `diary`, `hub/pages`로 분리한다.
- [ ] 각 sitemap에는 canonical이면서 200이고 `index,follow`인 URL만 포함한다.
- [ ] CommuLingo 2,678개 URL에서 본문이 짧거나 관계 정보만 있는 thin page를 별도 표본 검사한다.
- [ ] 실제 수정 시각을 알 수 있는 CommuLingo 문서에 정확한 `<lastmod>`를 추가한다.
- [ ] `priority`와 `changefreq`에 의존하지 않고 내부 링크와 정확한 `lastmod`를 관리한다.
- [ ] 저자 소개, 편집 원칙, 출처 사용법, 수정 이력 페이지를 공개하고 콘텐츠에서 연결한다.

## 검증 체크리스트

- [x] 변경 파일 `node --check` 통과
- [x] SEO 회귀 테스트 추가
- [x] dev preview에서 쿠키 없는 `/`, `/reports`, report detail, CommuLingo detail이 `lang="ko"`인지 확인
- [x] `lang=en` 쿠키가 있는 같은 URL이 영어판을 유지하는지 확인
- [x] Markdown URL이 `200 text/markdown`, `X-Robots-Tag: noindex, follow`, HTML canonical `Link`를 반환하는지 확인
- [x] research JSON-LD에 올바른 발행일·수정일이 있는지 확인
- [x] 한국어·영어 고정 URL이 각각 200이며 서로 reciprocal hreflang을 제공하는지 확인
- [x] 영어 홈·목록·상세 페이지의 공개 내부 링크가 `/en/...`을 유지하는지 확인
- [x] 기존 무접두 URL이 쿠키 없는 요청에서 계속 한국어 200을 제공하는지 확인
- [x] sitemap URL 6,626개가 모두 고유하며 번역 없는 영어 URL을 제외하는지 확인
- [x] `/en/rss.xml`, `/en/atom.xml`, `/en/*.md`가 영어 self/canonical URL을 제공하는지 확인
- [x] dev preview 홈 JSON-LD가 `Organization` + `WebSite` + `ItemList` graph를 출력하는지 확인
- [x] 한국어·영어 보고서와 각 CommuLingo 상세 유형이 자기 언어 URL의 `BreadcrumbList`를 출력하는지 확인
- [x] CommuLingo 참고 문헌 상세 canonical이 목록이 아닌 자기 상세 URL을 가리키는지 확인
- [x] 구조화 데이터 변경 전후 sitemap XML이 byte-identical인지 확인
- [x] Search Console에서 동일한 `sitemap.xml`을 다시 제출함 (2026-08-15, 처리 결과 대기)
- [x] 배포 후 `scripts/deploy --restart`만 사용해 재시작 (`2b0188a`, `5b49469`, `56c1f83`; 2026-08-15)
- [x] 배포 후 `/`, `/posts`, `/reports`, `/hub`, `/ai-diary` 콘텐츠와 DB 연결 정상 여부 확인
- [x] 구조화 데이터 배포 후 운영 한국어·영어 보고서/참고 문헌 canonical·hreflang·breadcrumb와 영어 내부 링크를 재검증 (`56c1f83`; 2026-08-15)
- [ ] 배포 후 Search Console에서 sitemap 읽기 및 대표 URL 검사를 실행

## 참고

- Google 다국어 사이트: <https://developers.google.com/search/docs/specialty/international/managing-multi-regional-sites>
- Google canonical: <https://developers.google.com/search/docs/crawling-indexing/consolidate-duplicate-urls>
- Google sitemap: <https://developers.google.com/search/docs/crawling-indexing/sitemaps/build-sitemap>
- Google Article 구조화 데이터: <https://developers.google.com/search/docs/appearance/structured-data/article>
