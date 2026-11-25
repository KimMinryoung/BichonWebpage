# 개발 문서 색인

현재 작업에 해당하는 문서만 읽는다. 실행 규칙은 [AGENTS.md](../AGENTS.md), 주제별 구현의 최종 기준은 해당 코드다. 계획 문서의 완료 여부와 과거 수치는 현재 코드·DB로 재확인한다.

- 남은 일 모음: [TODO.md](TODO.md) — 문서마다 흩어진 「남은 일」을 한곳에 모았다(2026-11-20).
- 끝난 작업 기록(사건·카드·용어 묶음, 검토 보고, 지난 계획): [archive/](archive/README.md). 같은 주제를 다시 할 때만 연다.

## 사이트·운영

| 작업 | 문서 |
| --- | --- |
| 배포·미리보기·데이터·인증·장애 점검 | [Frontend 운영 참고](frontend-operations.md) |
| 사이트 디자인·레이아웃·공통 UI | [디자인 기준](design-system.md) |
| 통합 검색·메뉴별 영어 지원 | [범위·일치 기준·영어 판정](site-search.md) |
| 모바일 첫 방문·시스템 글꼴·공개 모델 캐시 | [구현과 검증](page-speed.md) |
| SEO 인덱싱·크롤 관측 | [계획과 2026-09-27 관측](seo-indexing-plan.md) |
| 한국(KT) 방문자 지연·정적 파일 CDN | [2026-10-12 진단과 도입 계획(미착수)](static-cdn-kt-plan-20261012.md) |

## 게임

| 작업 | 문서 |
| --- | --- |
| 파업 게임 | [설계·규칙·구현·테스트](strike-game-handoff.md) |
| 러시아 내전 게임 「붉은 전선」 | [설계·규칙·전투·밸런스 기준](civil-war-game.md) |
| 대조국전쟁 게임 「조국 전선」 | [전선·시기·갈림길·전투·적의 힘 맞추기](great-patriotic-war-game.md) |
| 전쟁 게임 공통 엔진·새 전쟁 시나리오 | [모듈·시나리오 스키마·조건 언어·저장 세대·골든 마스터](war-engine.md) |
| 노노그램 | [화면·입력·저장](nonogram.md) |

## CommuLingo 구조·기준

| 작업 | 문서 |
| --- | --- |
| 관리자 MCP·leninbot 연동 경계 | [설계·단계·등록](commulingo-admin-mcp.md) |
| 보강 파이프라인(frontend 주관·leninbot 일꾼) | [설계·일꾼 API·단계](commulingo-agent-pipeline.md) |
| DB·캐시·동시성·복구 | [저장 구조와 검증](commulingo-database.md) |
| 데이터 git 분리(작업물 R2, 문헌·강좌 DB) | [단계·상태·설계](commulingo-data-off-git.md) |
| 인물 모델 | [인물 사전 인수인계](commulingo_people_handoff.md) |
| 인물 편집 | [현행 규칙·구현 체크리스트](commulingo-people-editing-plan.md) |
| 인물 별칭 | [별칭 표준](commulingo-alias-standard.md) |
| 인물 국가·출신 분류 | [국가 분류 기준](commulingo-registration-nationality.md) |
| 기능·활동과 소속 분류 | [설계·구현·전환 상태](commulingo-role-model-plan.md) |
| 정치적 입장 이름·용어 연결 | [입장 이름 규칙·term_ids](commulingo-position-terms-20261023.md) |
| 직책 계보·정치국/서기국/조직국 명부 | [구조·적용 스크립트·출처 판단](commulingo-office-lineages-20261006.md) |
| 사건 진영(sides) | [진영 구조·배정 기준](commulingo-event-sides-20260929.md) |
| 용어 편집·파이프라인 | [근거·revision·검토와 private RPC](commulingo-term-editorial.md) |
| 자동 링크 중의성 | [데이터 수정·재발 방안](commulingo-link-ambiguity.md) |
| 세계지도·국가 허브·사건 지도 세력 범위 | [지도·국가·사건 연결](commulingo-world-map.md) |
| 참고 문헌 안 검색 | [구조·정규화 계약](commulingo-doc-search.md) |
| 참고 문헌 서지 구조화 | [칸 정의·단계·남은 rights 정리](commulingo-doc-bibliography.md) |
| 참고 문헌 저장·렌더링 개선 | [구조 검사·outline·남은 rights 정리](commulingo-docs-structure-todo.md), [2026-11-04 설계 검토](commulingo-docs-design-review-20261104.md) |
| 설치형 앱(PWA)·오프라인 | [매니페스트·서비스 워커·캐시 규칙](commulingo-pwa.md) |

## CommuLingo 학습

| 작업 | 문서 |
| --- | --- |
| 학습 활동 계측·집계 | [운영 계측 참고](commulingo-learning-measurement.md) |
| 짧은 학습·이용 측정 설계 | [학습 콘텐츠 개선 제안](commulingo-learning-design.md) |
| 쇼츠(이야기 카드) | [카드 재료·순서](commulingo-shorts.md) |
| 혁명사·사회주의 비교 강좌 | [학습 강좌와 출처 기준](commulingo-ideology-learning.md) |
| 원문 끊어 읽기 형식(`guided-reading`) | [형식 근거·플레이어·검증 규칙·샤드 함정](commulingo-guided-reading.md) |
| 실습 형식(`workshop`: 순서·분류·빈칸) | [형식·필드·검증 규칙·화면](commulingo-workshop-format.md) |
| 기존 강좌 개선 이어받기(『자본』 2·3권 남음) | [2026-11-10 인수인계](commulingo-course-improvement-handoff-20261110.md) |
| 마르크스주의와 성 이론 강좌 | [구성·원어 대조 기준·출처](commulingo-sex-gender-theory.md) |
| 「동아시아 운동사」 강좌 | [기반 작업(2026-11-15)](commulingo-east-asia-foundation-20261115.md), [1부 구성안·상태](commulingo-east-asia-course-plan-20261115.md), [2부 구성·결과](commulingo-east-asia-course-part2-plan-20261117.md) |

새로운 주제는 별도 문서로 추가하고 이 색인에 링크한다. 작업이 끝난 날짜형 기록 문서는 `archive/`로 옮기고 남은 일은 [TODO.md](TODO.md)에 옮겨 적는다. 완료된 작업 이력을 AGENTS.md/CLAUDE.md에 누적하지 않는다.
