-- Metadata catch-up for two terms added after 071/072. New rows arrive with an
-- empty category and only period_label, which the store and the chips handle
-- (they collect under 'Uncategorized'), but leaving them there is untidy.

UPDATE commulingo_terms SET
    period_ko = '1936, 1946–1948',
    period_en = '1936, 1946–1948',
    start_year = 1936,
    end_year = 1948,
    category = 'repression'
WHERE id = 'anti-formalism-campaign';

UPDATE commulingo_terms SET
    period_ko = '2023–현재',
    period_en = '2023–present',
    start_year = 2023,
    end_year = NULL,
    category = 'contemporary'
WHERE id = 'ai-bubble';

INSERT INTO commulingo_term_relations (term_id, related_id) VALUES
('anti-formalism-campaign', 'socialist-realism'),
('anti-formalism-campaign', 'rootless-cosmopolitanism'),
('anti-formalism-campaign', 'proletkult'),
('ai-bubble', 'law-of-the-tendency-of-the-rate-of-profit-to-fall'),
('ai-bubble', 'real-financial-divergence'),
('ai-bubble', 'semiconductor-supercycle')
ON CONFLICT DO NOTHING;
