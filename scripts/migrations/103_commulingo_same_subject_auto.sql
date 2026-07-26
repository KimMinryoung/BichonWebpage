-- same_subject becomes a three-state override instead of a hand-set flag.
--
--   NULL   decide by name — paired when the glossary headword and the event
--          title are the same string, in either language
--   TRUE   paired regardless of the names
--   FALSE  never paired, for two entries that share a name by accident
--
-- Flagging each pair by hand was work that the data already answers: if the two
-- dictionaries print the same headword they are writing up the same subject,
-- and if they do not, no flag should be papering over it. The name test also
-- requires the entries to be linked already, so a coincidence of wording cannot
-- staple two unrelated pages together.
--
-- Every existing row is FALSE by the old column default, which under the new
-- reading would mean 'suppressed'. They become NULL — undecided, judged by name.

ALTER TABLE commulingo_term_events ALTER COLUMN same_subject DROP NOT NULL;
ALTER TABLE commulingo_term_events ALTER COLUMN same_subject DROP DEFAULT;

UPDATE commulingo_term_events SET same_subject = NULL WHERE same_subject = FALSE;

-- 대숙청 goes back to NULL as well: its two headwords match, so the rule finds
-- it without being told. Nothing is flagged by hand at present.
UPDATE commulingo_term_events SET same_subject = NULL
 WHERE term_id = 'great-purge' AND event_id = 'great-terror';
