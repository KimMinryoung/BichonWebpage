-- Follow-up to 096: the entry was renamed 대테러 → 대숙청, but its own question
-- and summary still opened with the old name, so the first line of the page
-- contradicted the heading above it. The name is used once, up front, in each;
-- 대테러 / Great Terror stays in the glossary entry, which is where the two
-- names and Conquest's coinage are actually explained.

UPDATE commulingo_history_events SET
    question_ko = '대숙청은 누가, 어떤 기구로, 무엇을 가능하게 했는가?',
    summary_ko  = '1937–38년의 대숙청은 NKVD·당 조직·검찰이 결합해 대규모 체포와 처형을 '
                  || '수행한 국가폭력이었다. 그것은 단일 명령이 아니라 할당량, 작전명령, '
                  || '자백 강요, 지방의 경쟁과 공포가 서로 증폭한 과정이었다.',
    question_en = 'Who made the Great Purge possible, through which institutions, and at what cost?',
    summary_en  = 'The Great Purge of 1937–38 was state violence carried out through the combined '
                  || 'machinery of the NKVD, party organizations, and prosecution. It was not one '
                  || 'order alone, but a process in which quotas, operational orders, coerced '
                  || 'confessions, local competition, and fear amplified one another.',
    updated_at  = NOW()
 WHERE id = 'great-terror';
