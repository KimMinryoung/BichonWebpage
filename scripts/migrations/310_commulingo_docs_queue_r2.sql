-- 2026-10-07 docs queue R2a/R2b/G/F1 (dev_docs/commulingo-queue-docs-20261007/PLAN.md):
-- seven documents translated from the original language and published under
-- data/commulingo/docs; items without a public original-language text, with an
-- existing Korean translation, or that could not be identified are skipped with
-- the reason from their REPORT.md. 188 (missing pages in the only copy) stays pending.
BEGIN;
UPDATE commulingo_curation_gaps SET status='done', resolved_id=v.doc, resolution=v.note, updated_at=now()
  FROM (VALUES
    (1817, 'soviet-angolan-friendship-treaty-1976', '2026-10-07 러시아어 원문 완역 게재'),
    (141,  'soviet-law-on-state-enterprise-1987', '2026-10-07 러시아어 원문 완역 게재'),
    (691,  'politburo-1989-01-24-afghanistan-withdrawal', '2026-10-07 러시아어 원문 완역 게재(정치국 결정 발췌와 1월 23일 의견서)'),
    (719,  'gosbank-minfin-1990-12-14-monetary-reform', '2026-10-07 러시아어 원문 완역 게재'),
    (1599, 'stulpnagel-hostage-code-1941', '2026-10-07 독일어 원문 완역 게재(1588-PS 중 9월 28일 훈령)'),
    (1825, 'congo-acte-fondamental-1991', '2026-10-07 프랑스어 원문 완역 게재'),
    (1838, 'benin-constitution-1990', '2026-10-07 프랑스어 원문 완역 게재(2019년 개정 전 원문)')
  ) AS v(id, doc, note)
 WHERE commulingo_curation_gaps.id = v.id AND status = 'pending';
UPDATE commulingo_curation_gaps SET status='skipped', resolution=v.note, updated_at=now()
  FROM (VALUES
    (257,  '2026-10-07 제외: 한국어 전문 번역 기존재'),
    (432,  '2026-10-07 제외: 공개본은 체르냐예프 메모 발췌(영어 번역)뿐, 러시아어는 저작권 편찬서에만'),
    (766,  '2026-10-07 제외: 러시아어 전문 온라인 미공개(인쇄본만), 공개본은 영어 번역'),
    (117,  '2026-10-07 제외: 문서 특정 불가(본문·보관 위치·간행본 미확인)'),
    (1307, '2026-10-07 제외: 러시아어 원문 미공개, 독일어·영어는 번역본(중역 금지). 실제로는 모스크바 대면 회담'),
    (1370, '2026-10-07 제외: 원문은 Jacobsen 1956 사료집·BA-MA에만 있고 디지털본 없음'),
    (1810, '2026-10-07 제외: 원문 전문 입수 불가, 약 200쪽 분량')
  ) AS v(id, note)
 WHERE commulingo_curation_gaps.id = v.id AND status = 'pending';
COMMIT;
