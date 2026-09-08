# 인물 등록의 국가 분류 기준 (2026-09-07)

소속 국가(citizenship)는 실제 소속 국가, 출신 배경(nationalOrigin, legacy origin)은 출처로 확인한 민족·국가적 배경이다.

공통 정책은 `data/commulingo/nationality-policy.json`. Soviet/Yugoslav는 소속 국가 전용이며 Admin 생성·수정 검증에서 출신 배경으로 저장할 수 없다. Python 등록 스키마도 동일 제외 목록을 읽는다.

출생지·활동지·시민권만으로 출신 배경을 추정하지 않는다. 러시아 등의 자동 기본값을 사용하지 않는다. 혼합 출신은 한·영 label에 보존한다. 근거가 부족하면 추가 조사하거나 등록을 보류한다. 유지보수 프롬프트와 과거 일괄 보완 도구에서도 추정 기본값을 제거했다.

`scripts/commulingo-person-service.js`를 운영 이미지에 포함해 Python의 공통 Admin RPC 연결을 제공한다. CLI도 공통 편집 서비스를 사용한다.

회귀 검사: `node scripts/smoke-commulingo-nationality-policy.js` (소속 국가 허용, 출신 배경/별칭 거부, 구체 국가 허용, 혼합 설명 유지).

국가 코드 차단은 기계적으로 검증하지만, 사료의 신뢰도와 혼합 출신의 대표 국가 선택은 근거 검토가 필요하다.
