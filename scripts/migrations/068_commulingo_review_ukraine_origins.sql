BEGIN;

DO $$
DECLARE
    legacy_cutoff CONSTANT timestamptz := '2026-07-24 14:30:00+00';
    ukrainian_ids CONSTANT text[] := ARRAY[
        'alexander-tsiurupa',
        'alexander-tsyurupa',
        'balitsky',
        'fedorchuk',
        'gapon',
        'georgy-piatakov',
        'grigory-grinko',
        'grigory-petrovsky',
        'gubenko',
        'hryhoriy-hrynko',
        'ivan-chernyakhovsky',
        'ivashko',
        'kirichenko',
        'kirill-moskalenko',
        'korolev',
        'malinovsky',
        'manuilsky',
        'mykola-khvylovy',
        'mykola-skrypnyk',
        'nestor-makhno',
        'oleksandr-shumsky',
        'pavel-rybalko',
        'petro-shelest',
        'podgorny',
        'podvoisky',
        'polyansky',
        'sudoplatov',
        'sydir-kovpak',
        'timoshenko',
        'trofim-lysenko',
        'valentin-glushko',
        'vladimir-shcherbitsky',
        'vlas-chubar',
        'yuri-pyatakov'
    ];
BEGIN
    -- Legacy origin values were populated from present-day birthplace. Reset
    -- that bounded cohort, then restore only documented Ukrainian backgrounds.
    UPDATE commulingo_people
       SET origin_code = 'russia',
           origin_label_ko = '러시아',
           origin_label_en = 'Russia',
           updated_at = NOW()
     WHERE origin_code = 'ukraine'
       AND created_at < legacy_cutoff;

    -- One code must have one canonical label so the filter cannot split visually.
    UPDATE commulingo_people
       SET origin_label_ko = '러시아',
           origin_label_en = 'Russia',
           updated_at = NOW()
     WHERE origin_code = 'russia'
       AND (origin_label_ko IS DISTINCT FROM '러시아'
         OR origin_label_en IS DISTINCT FROM 'Russia');

    UPDATE commulingo_people
       SET origin_code = 'ukraine',
           origin_label_ko = '우크라이나',
           origin_label_en = 'Ukraine',
           updated_at = NOW()
     WHERE id = ANY(ukrainian_ids);

    -- Vyshinsky was born in Odesa but came from a Polish Catholic family.
    UPDATE commulingo_people
       SET origin_code = 'poland',
           origin_label_ko = '폴란드',
           origin_label_en = 'Poland',
           updated_at = NOW()
     WHERE id = 'vyshinsky';

    IF EXISTS (
        SELECT 1
          FROM commulingo_people
         WHERE id = ANY(ukrainian_ids)
           AND origin_code IS DISTINCT FROM 'ukraine'
    ) THEN
        RAISE EXCEPTION 'one or more reviewed Ukrainian origins were not restored';
    END IF;
END $$;

COMMIT;
