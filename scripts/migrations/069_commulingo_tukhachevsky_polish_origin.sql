BEGIN;

UPDATE commulingo_people
   SET origin_code = 'poland',
       origin_label_ko = '폴란드',
       origin_label_en = 'Poland',
       updated_at = NOW()
 WHERE id = 'tukhachevsky';

DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1
          FROM commulingo_people
         WHERE id = 'tukhachevsky'
           AND origin_code = 'poland'
           AND origin_label_ko = '폴란드'
           AND origin_label_en = 'Poland'
    ) THEN
        RAISE EXCEPTION 'failed to set Tukhachevsky national origin to Poland';
    END IF;
END $$;

COMMIT;
