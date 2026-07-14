INSERT INTO commulingo_role_categories
    (id, sort_order, icon, label_ko, label_en, updated_at)
VALUES ('theorist', 2, 'book-open', '이론가', 'Theorist', NOW())
ON CONFLICT (id) DO UPDATE SET
    sort_order = EXCLUDED.sort_order,
    icon = EXCLUDED.icon,
    label_ko = EXCLUDED.label_ko,
    label_en = EXCLUDED.label_en,
    updated_at = NOW();

UPDATE commulingo_role_categories
SET sort_order = CASE id
        WHEN 'writer' THEN 1
        WHEN 'theorist' THEN 2
        WHEN 'intl-revolutionary' THEN 3
        WHEN 'bloc-reformer' THEN 4
        WHEN 'russian-republic-leader' THEN 5
        WHEN 'left-opposition' THEN 6
        WHEN 'socialist-bloc-leader' THEN 7
        ELSE sort_order
    END,
    updated_at = NOW()
WHERE id IN (
    'writer',
    'theorist',
    'intl-revolutionary',
    'bloc-reformer',
    'russian-republic-leader',
    'left-opposition',
    'socialist-bloc-leader'
);

UPDATE commulingo_person_roles
SET category_id = 'theorist',
    updated_at = NOW()
WHERE category_id = 'writer'
  AND person_id IN (
      'aleksei-gastev',
      'alexander-herzen',
      'alexander-svechin',
      'anton-makarenko',
      'boris-arvatov',
      'chernyshevsky',
      'david-riazanov',
      'dmitry-likhachev',
      'emelyan-yaroslavsky',
      'fyodor-burlatsky',
      'ivan-michurin',
      'konstantin-tsiolkovsky',
      'leonid-sabsovich',
      'lev-vygotsky',
      'merab-mamardashvili',
      'mikhail-bakhtin',
      'mikhail-lifshitz',
      'nikolai-dobrolyubov',
      'nikolai-fyodorov',
      'nikolai-mikhailovsky',
      'nikolai-sukhanov',
      'nikolai-ustryalov',
      'peteris-stucka',
      'platon-kerzhentsev',
      'pyotr-struve',
      'pyotr-stuchka',
      'pyotr-tkachev',
      'roy-medvedev',
      'vladimir-adoratsky',
      'yakov-kronrod',
      'yevgeny-korovin',
      'yevgeny-tarle',
      'yuri-steklov'
  );
