-- Cross-links for the 맬서스주의 entry registered by LeninBot
-- (scripts/register_malthusianism_term.py).
--
-- 임금철칙 is the load-bearing one: Marx's second line of attack in Part II of
-- the Critique is that Lassalle's law comes with a Malthusian substantiation,
-- and the entry that carries that substantiation did not exist until now. The
-- rest are the entries where scarcity-as-nature arguments recur.

INSERT INTO commulingo_term_relations (term_id, related_id) VALUES
('malthusianism', 'iron-law-of-wages'),
('malthusianism', 'critique-of-the-gotha-programme'),
('malthusianism', 'ecosocialism'),
('malthusianism', 'food-sovereignty')
ON CONFLICT DO NOTHING;
