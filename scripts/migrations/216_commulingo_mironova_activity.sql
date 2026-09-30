-- 216: The last person without an activity, agnessa-mironova, whose card rested
-- on an icon-only legacy role row. She is in the dictionary for her oral memoir
-- of a Chekist household (epithet), so the carried-over activity is literature
-- and the arts with the affiliation unresolved, marked like migration 215.
-- Needed before commulingo_person_roles is dropped: the card audit now requires
-- a primary activity for every person.

BEGIN;
UPDATE commulingo_people
   SET activities = '[{"functionId":"arts","affiliationId":null,"affiliationStatus":"unresolved","relation":"unresolved","primary":true,"startYear":null,"endYear":null,"evidence":[],"basis":"legacy-classification"}]'::jsonb,
       updated_at = now()
 WHERE id = 'agnessa-mironova' AND jsonb_array_length(activities) = 0;
COMMIT;
