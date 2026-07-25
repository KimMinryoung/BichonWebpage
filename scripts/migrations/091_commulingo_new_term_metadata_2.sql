-- Metadata catch-up for two more terms added while the bodies were being
-- written. Both are Soviet reform-economics entries, so they join the economy
-- category rather than 'contemporary'.

UPDATE commulingo_terms SET
    period_ko = '1962–1965',
    period_en = '1962–1965',
    start_year = 1962,
    end_year = 1965,
    category = 'economy'
WHERE id = 'liberman-debate';

UPDATE commulingo_terms SET
    period_ko = '1990',
    period_en = '1990',
    start_year = 1990,
    end_year = 1990,
    category = 'economy'
WHERE id = '500-day-program';

INSERT INTO commulingo_term_relations (term_id, related_id) VALUES
('liberman-debate', 'khozraschet'),
('liberman-debate', 'control-figures'),
('liberman-debate', 'zveno'),
('500-day-program', 'perestroika'),
('500-day-program', 'khozraschet'),
('500-day-program', 'nomenklatura')
ON CONFLICT DO NOTHING;
