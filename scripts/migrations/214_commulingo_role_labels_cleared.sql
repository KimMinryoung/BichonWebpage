-- 214: Clear the 25 free-text labels on legacy role rows.
--
-- Reviewed 2026-09-30 before retiring commulingo_person_roles. None carried
-- information found nowhere else: 21 repeat the category or office name
-- (비소련 혁명가 ×13, 작가 ×3, 사회주의권 개혁 지도자 ×2, 국가보안 기관 ×2,
-- 편집인) or the person's stored activity (란즈베르기스, 리조바), and the
-- epithet already says the rest (옐친, 미로노바). Yeltsin, Langfang and
-- Nikolayev-Zhurid, whose cards showed only this label, received sourced
-- activities first (scripts/content/person-activity-edits-label-only-20260930.json).

BEGIN;
UPDATE commulingo_person_roles
   SET label_ko = '', label_en = '', updated_at = now()
 WHERE COALESCE(label_ko, '') <> '' OR COALESCE(label_en, '') <> '';
COMMIT;
