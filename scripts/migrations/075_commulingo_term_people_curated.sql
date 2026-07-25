-- Three person links the text-evidence audit could not propose, because these
-- definitions describe the institution without naming anyone. Unlike 074 these
-- are curated rather than derived: Stalin directed collectivization and
-- dekulakization, and the nomenklatura system was consolidated under him as
-- General Secretary.
--
-- The 22 entries still without a related person are contemporary and Korean
-- political-economy terms (precariat, gap-investment, chaebol-state, …). The
-- people dictionary is Soviet-focused, so there is no correct link to make; an
-- invented one would be worse than none.

INSERT INTO commulingo_term_people (term_id, person_id, sort_order) VALUES
('kolkhoz', 'stalin', 0),
('kulak', 'stalin', 0),
('nomenklatura', 'stalin', 0)
ON CONFLICT DO NOTHING;
