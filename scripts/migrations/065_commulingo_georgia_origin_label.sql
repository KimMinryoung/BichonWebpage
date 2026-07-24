-- In the Soviet-history dictionary's national/ethnic-background facet, use the
-- Soviet-era Korean name 그루지야 consistently. Do not rewrite prose referring
-- to the modern state of Georgia; this migration is limited to the facet label.
UPDATE commulingo_people
SET origin_label_ko = '그루지야',
    updated_at = NOW()
WHERE origin_code = 'georgia'
  AND origin_label_ko IS DISTINCT FROM '그루지야';
