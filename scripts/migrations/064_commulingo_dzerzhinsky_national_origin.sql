-- Dzerzhinsky was born on an estate that is now in Belarus, but into a Polish
-- noble family. origin_* is national/ethnic background, never modern birthplace.
UPDATE commulingo_people
SET origin_code = 'poland',
    origin_label_ko = '폴란드',
    origin_label_en = 'Poland',
    cyrillic = 'Feliks Dzierżyński',
    updated_at = NOW()
WHERE id = 'dzerzhinsky';

-- Polish names do not carry the Russian patronymic in their own-script line.
-- Keep the localized Soviet-context patronymic, as with Radek, but do not
-- present a Russian form as the person's native-script patronymic.
UPDATE commulingo_person_patronymics
SET cyrillic_patronymic = '',
    updated_at = NOW()
WHERE person_id = 'dzerzhinsky';
