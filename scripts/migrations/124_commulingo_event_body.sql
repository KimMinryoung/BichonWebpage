-- 124: history events get a prose body, the way glossary terms already have one.
--
-- Until now an event entry carried only two blocks of prose, a 개요 above the
-- timeline and a 결과 below it, so everything else had to be pushed into the
-- timeline. That made long entries a wall of dated fragments: the Spanish Civil
-- War ran to 5,200 characters of timeline against 1,500 of prose, and the detail
-- that belongs in a paragraph (why the two lines inside the Republic could not
-- be reconciled, what the Soviet intervention actually consisted of) had nowhere
-- to live except as another dated bullet.
--
-- body_ko/body_en are markdown with `## ` subheadings, exactly like
-- commulingo_terms.body_ko — the same renderMarkdown + linkify path, rendered
-- into the same .commu-person-markdown container. Empty by default, so every
-- existing event keeps its current shape and the section simply does not print.

ALTER TABLE commulingo_history_events
    ADD COLUMN IF NOT EXISTS body_ko text NOT NULL DEFAULT '',
    ADD COLUMN IF NOT EXISTS body_en text NOT NULL DEFAULT '';
