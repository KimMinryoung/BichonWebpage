-- 123: DPRK loyalists carry a DPRK national background.
--
-- Editorial line of this dictionary: the Korean nation of the DPRK (조선민족)
-- and of the ROK (한민족) are treated as one lineage that has since separated
-- into distinct national bodies. A person who served and was loyal to the DPRK
-- therefore carries nationalOrigin 'north-korea', never 'south-korea' — and not
-- the undivided 'korea' code either, whose taegukgi-style flag reads as the
-- South. 'korea' stays reserved for figures whose activity ended before the
-- division (김산, 여운형, 이동휘, 알렉산드라 킴); Soviet Koreans keep their
-- 고려인 designation (허가이).
--
-- These four were filed citizenship 'north-korea' but origin 'korea': all four
-- (김무정, 김정숙, 김두봉, 박헌영) served the DPRK state or its founding
-- leadership, so their background follows their allegiance.

UPDATE commulingo_people
SET origin_code = 'north-korea',
    origin_label_ko = '조선민주주의인민공화국',
    origin_label_en = 'North Korea',
    updated_at = NOW()
WHERE id IN ('mu-chong', 'kim-jong-suk', 'kim-tu-bong', 'pak-hon-yong')
  AND citizenship_code = 'north-korea';
