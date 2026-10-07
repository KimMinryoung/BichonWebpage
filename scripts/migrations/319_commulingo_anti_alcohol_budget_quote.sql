-- 2026-10-07 follow-up to 318: the "drunken budget" sentence and the Shevardnadze
-- proposal sit in separate paragraphs, so 318's single replacement did not match.
UPDATE commulingo_history_events
   SET body_ko = replace(replace(body_ko,
         '이어 "우리는 더 이상 이 취한 예산을 용납할 수 없다"고 못 박았다.',
         '토론이 이어진 끝에 그는 "알코올 중독 퇴치 문제의 핵심은 보드카 생산 감축입니다. 우리의 취한 예산을 더는 참을 수 없습니다"라고 못 박았다.'),
         '에두아르트 셰바르드나제는 그루지야의 전통 증류주 차차 생산을',
         '솔로멘체프가 회의에 소개한 사전 서면 제안에서 에두아르트 셰바르드나제는 그루지야의 전통 증류주 차차 생산을'),
       updated_at = now()
 WHERE id = 'anti-alcohol-campaign' AND strpos(body_ko, '이 취한 예산을 용납할 수 없다') > 0;
