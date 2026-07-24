-- Kim Jong Il's national/ethnic background is Korean / DPRK, not the country
-- attached to one disputed birthplace account. Never infer origin_* from P19.
UPDATE commulingo_people
SET origin_code = 'north-korea',
    origin_label_ko = '조선민주주의인민공화국',
    origin_label_en = 'Democratic People''s Republic of Korea',
    updated_at = NOW()
WHERE id = 'kim-jong-il';
