-- Backfills related people / events for glossary entries that had none. 26 of
-- 86 terms had no related person and 43 no related event, which left most detail
-- pages with nothing but their own definition.
--
-- Every pair below comes from scripts/audit-commulingo-term-links.js, which only
-- proposes a link when the term's own definition or body names that person or
-- event, so each one has textual evidence on the page itself. The proposals were
-- then reviewed by hand and five were dropped as era labels rather than
-- references to the person: 'the Stalin era' (socialist-realism, glasnost),
-- 'the 1936 Stalin Constitution' (socialist-legality), 'a Stalinist
-- industrialization strategy' (hukou-system), and 'through late Perestroika' as
-- an event link (socialist-realism).

INSERT INTO commulingo_term_people (term_id, person_id, sort_order) VALUES
('article-58', 'iona-yakir', 4),
('article-58', 'osip-piatnitsky', 5),
('article-58', 'vasily-blyukher', 6),
('bonapartism', 'trotsky', 0),
('state-capitalism', 'anton-pannekoek', 2),
('state-capitalism', 'liebknecht', 3),
('state-capitalism', 'osinsky', 4),
('state-capitalism', 'raya-dunayevskaya', 5),
('state-capitalism', 'trotsky', 6),
('socialist-legality', 'gorbachev', 3),
('socialist-legality', 'khrushchev', 4),
('left-communists', 'lenin', 3),
('left-communists', 'osinsky', 4),
('left-communists', 'sverdlov', 5),
('left-communists', 'trotsky', 6),
('national-delimitation', 'molotov', 6),
('sharashka', 'beria', 3),
('sharashka', 'stalin', 4),
('sharashka', 'valentin-glushko', 5),
('yezhovshchina', 'stalin', 1),
('left-opposition', 'kamenev', 5),
('left-opposition', 'stalin', 6),
('comprador-monopoly-capitalism', 'mao-zedong', 1),
('right-opposition', 'august-thalheimer', 4),
('right-opposition', 'stalin', 5),
('proletkult', 'lenin', 3),
('reformism', 'eduard-bernstein', 2),
('likbez', 'lenin', 3),
('khozraschet', 'lenin', 2),
('zveno', 'brezhnev', 1),
('zveno', 'khrushchev', 2),
('great-purge', 'stalin', 1),
('primitive-socialist-accumulation', 'stalin', 3),
('goelro', 'lenin', 1),
('juche', 'kim-jong-il', 1),
('workers-opposition', 'lenin', 2),
('workers-opposition', 'sergei-medvedev', 3),
('autonomization', 'lenin', 0),
('autonomization', 'stalin', 1),
('menshevizing-idealism', 'lenin', 4),
('menshevizing-idealism', 'stalin', 5),
('chayanovshchina', 'stalin', 2),
('kondratievshchina', 'stalin', 2),
('dual-power', 'kornilov', 1),
('dual-power', 'mao-zedong', 2),
('rootless-cosmopolitanism', 'stalin', 1)
ON CONFLICT DO NOTHING;

INSERT INTO commulingo_term_events (term_id, event_id, sort_order) VALUES
('nep', 'five-year-plans', 0),
('nep', 'new-economic-policy', 1),
('prodrazvyorstka', 'new-economic-policy', 1),
('little-october', 'october-revolution', 1),
('state-capitalism', 'new-economic-policy', 0),
('liquidationism', 'revolution-1905', 0),
('korenizatsiya', 'great-terror', 1),
('old-bolshevik', 'october-revolution', 1),
('glasnost', 'soviet-collapse', 1),
('right-opposition', 'new-economic-policy', 2),
('khozraschet', 'new-economic-policy', 2),
('primitive-socialist-accumulation', 'new-economic-policy', 0),
('chervonets', 'five-year-plans', 0),
('chervonets', 'new-economic-policy', 1),
('revolutionary-legal-consciousness', 'new-economic-policy', 0),
('food-dictatorship', 'new-economic-policy', 0),
('declaration-of-46', 'great-terror', 0)
ON CONFLICT DO NOTHING;
