# 프랑스 혁명 기관 용어와 사건 연결 — 2026-09-17

사용자 요청으로 여섯 용어의 등록 여부와 프랑스 혁명 사건 연결을 확인했다. 기존 국민공회·공안위원회는 사건 관계가 없었고, 일반안전위원회·파견의원·지역 감시위원회·프랑스 혁명재판소는 미등록이었다.

requests.json의 한영 정의·본문·명칭·출처·필드별 근거를 공통 term-editorial-service의 submit/review 경로로 검증했다. 먼저 전체 트랜잭션을 롤백하는 검증을 수행하고, 통과한 동일 요청을 제출·검토 승인해 새 용어 4건과 기존 용어의 사건 연결 2건을 한 트랜잭션으로 저장했다. 적용 영수증은 receipt.json이다. apply.cjs는 컨테이너 안에서 requests.json을 SPEC 상수로 주입해 실행하는 기록이며, 기본은 롤백 검증, --apply만 커밋한다. 신규 항목이 이미 있으면 중복 실행을 거절한다.

사건: /commulingo/events/french-revolution-1789-1799

- national-convention: 기존, 사건 관계 추가
- committee-of-public-safety: 기존, 사건 관계 추가
- committee-of-general-security: 신규, 일반보안위원회·일반치안위원회 별칭
- representatives-on-mission: 신규
- local-surveillance-committees-french-revolution: 신규
- revolutionary-tribunal-france: 신규. 다른 나라의 혁명재판소와 자동 연결이 섞이지 않도록 프랑스·파리 한정 별칭 사용

참고 문헌의 혁명정부 안내와 혁명정부·재판 문헌집에 여섯 용어의 역방향 관계를 추가했다. 안내의 기관별 목록에는 직접 링크도 넣었다. 사전 스냅샷을 강제 갱신하고 관련 한영 URL 21개를 purge했다. 코드·CSS·스키마 변경 및 재시작 없음.

운영 브라우저에서 사건의 관련 용어 여섯 개와 모바일 가로 넘침 없음 확인. 공개 HTTP로 안내의 여섯 링크, 일반안전위원회 용어에서 사건·참고 문헌으로 가는 역방향 연결, 200 응답을 확인했다. verification.json 참조.
