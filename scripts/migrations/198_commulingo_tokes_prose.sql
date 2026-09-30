-- 198: 퇴케시 라슬로 now reads family-first (his card is Hungarian since the
-- 2026-09-30 citizenship edit), so the one given-first mention in the 1989
-- revolutions body follows. Also drop the misspelled alias 오자키 호츠미 left
-- after 197 corrected the card to 오자키 호쓰미.

BEGIN;
UPDATE commulingo_history_events SET body_ko = replace(body_ko, '목사 라슬로 퇴케시 강제 퇴거', '목사 퇴케시 라슬로 강제 퇴거') WHERE id = 'revolutions-1989';
DELETE FROM commulingo_person_aliases WHERE person_id = 'hotsumi-ozaki' AND lang = 'ko' AND alias = '오자키 호츠미';
COMMIT;
