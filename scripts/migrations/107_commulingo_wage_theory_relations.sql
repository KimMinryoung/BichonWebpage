-- Cross-links for the 임금기금설 and 한계생산력설 entries registered by LeninBot
-- (scripts/register_wage_theory_terms.py).
--
-- The four wage-theory entries now form a chain in time — 맬서스주의 →
-- 임금철칙 → 임금기금설 → 한계생산력설 — so each is linked to its neighbours
-- rather than to all of them, and each reaches out to where its argument is
-- still in use.

INSERT INTO commulingo_term_relations (term_id, related_id) VALUES
-- 임금기금설: the doctrine 임금철칙 sat beside, answered in Value, Price and
-- Profit, and still audible in the fixed-pie form of the minimum-wage argument.
('wages-fund-doctrine', 'iron-law-of-wages'),
('wages-fund-doctrine', 'malthusianism'),
('wages-fund-doctrine', 'marginal-productivity-theory'),
('wages-fund-doctrine', 'undiminished-proceeds-of-labour'),

-- 한계생산력설: the theory that replaced both, and the present-day entries
-- written in its grammar.
('marginal-productivity-theory', 'law-of-the-tendency-of-the-rate-of-profit-to-fall'),
('marginal-productivity-theory', 'jobless-growth'),
('marginal-productivity-theory', 'robot-tax'),
('marginal-productivity-theory', 'seniority-biased-technological-change')
ON CONFLICT DO NOTHING;
