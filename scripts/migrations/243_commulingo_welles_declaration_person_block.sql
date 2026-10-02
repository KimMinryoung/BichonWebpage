-- 2026-10-02: "웰스 선언" / "Welles Declaration" (term welles-declaration) had
-- its first word taken by the person pass and linked to Sumner Welles on the
-- baltic-sovietisation-1944-1953 page. Block the phrase in the person pass
-- everywhere, as 232 did for 레닌 소년단; the term pass still links it.
BEGIN;
INSERT INTO commulingo_link_blocklist (lang, phrase, note, kind) VALUES
    ('ko', '웰스 선언', '1940년 미국의 발트 병합 불승인(용어 welles-declaration). 섬너 웰스 인물로 오링크 방지', 'phrase'),
    ('en', 'Welles Declaration', 'The 1940 US non-recognition statement (term welles-declaration); not the person link', 'phrase')
ON CONFLICT DO NOTHING;
COMMIT;
