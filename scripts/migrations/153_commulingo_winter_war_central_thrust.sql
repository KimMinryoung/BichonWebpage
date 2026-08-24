-- 153: the Winter War's central thrust.
--
-- The map drew Red Army arrows only on the Karelian Isthmus, so the
-- Suomussalmi beat (the motti destruction of the 163rd and 44th divisions)
-- floated with no context — as if the war happened only in the south. The
-- invasion crossed the whole border; the column destroyed at Suomussalmi
-- was the mid-country drive along the Raate road toward Oulu. The beat's
-- point becomes that arrow, approaching from Soviet Karelia and ending
-- southeast of the town so the arrowhead clears the 수오무살미 marker
-- label (the 152 lesson: labels span ~2° at regional frames).

UPDATE commulingo_history_events SET timeline =
  jsonb_set(timeline, '{6,geo}',
    '{"kind":"arrow","variant":"red","points":[[64.5,31.4],[64.6,29.3]],"actor":{"ko":"붉은 군대","en":"Red Army"},"label":{"ko":"라테 도로","en":"the Raate road"}}')
WHERE id = 'winter-war';
