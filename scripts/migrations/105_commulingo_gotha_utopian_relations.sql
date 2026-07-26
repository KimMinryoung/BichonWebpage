-- Cross-links for the two work entries registered by LeninBot
-- (scripts/register_gotha_utopian_terms.py): 『고타강령 비판』 and
-- 『공상에서 과학으로』 plus their six nested concept entries.
--
-- The entries themselves, their aliases, people links and parent nesting are
-- written through the commulingo_term_* write tools. Term↔term relations are
-- not in that tool's patch allow-list, so they live here, the way every other
-- relation set in this directory does (072, 077, 091, 095).
--
-- Only cross-family links are listed. Siblings already show up together under
-- their parent on the entry page, so pairing them here would just repeat the
-- nesting in a second place.

INSERT INTO commulingo_term_relations (term_id, related_id) VALUES
-- The two works to each other, and to the entries they are the origin of.
('critique-of-the-gotha-programme', 'socialism-utopian-and-scientific'),
('critique-of-the-gotha-programme', 'state-socialism'),
('critique-of-the-gotha-programme', 'state-capitalism'),
('critique-of-the-gotha-programme', 'dictatorship-of-the-proletariat'),
('critique-of-the-gotha-programme', 'free-association-of-producers'),
('critique-of-the-gotha-programme', 'reformism'),
('socialism-utopian-and-scientific', 'state-socialism'),
('socialism-utopian-and-scientific', 'state-capitalism'),
('socialism-utopian-and-scientific', 'dictatorship-of-the-proletariat'),
('socialism-utopian-and-scientific', 'reformism'),

-- 공산주의의 낮은 단계와 높은 단계 — the phases feed the transition-state
-- entries and the socialism-in-one-country debate over how far the USSR had got.
('lower-and-higher-phase-of-communism', 'dictatorship-of-the-proletariat'),
('lower-and-higher-phase-of-communism', 'free-association-of-producers'),
('lower-and-higher-phase-of-communism', 'socialism-in-one-country'),

-- 노동전수익권 / 철의 임금법칙 — the two Lassallean demands.
('undiminished-proceeds-of-labour', 'free-association-of-producers'),
('iron-law-of-wages', 'reformism'),

-- 국가의 사멸 — the entry that carries the state question from Engels through
-- Lenin's correction to the 1939 reversal.
('withering-away-of-the-state', 'state-socialism'),
('withering-away-of-the-state', 'state-capitalism'),
('withering-away-of-the-state', 'dictatorship-of-the-proletariat'),
('withering-away-of-the-state', 'council-communism'),

-- 공상적 사회주의 / 과학적 사회주의.
('utopian-socialism', 'free-association-of-producers'),
('scientific-socialism', 'state-socialism')
ON CONFLICT DO NOTHING;
