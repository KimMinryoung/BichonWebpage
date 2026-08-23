-- 145: seed map locations for every published history event (column: 144).
--
-- One 'main' marker per event (the focal site), plus supporting markers where
-- the geography IS the story — fronts of a war, capitals of a split, summit
-- sites of a détente. Labels follow the site's era-naming conventions
-- (페트로그라드/하리코프/키예프·Kiev in Soviet-era entries, 비푸리 for the
-- Finnish city of the Winter War). Coordinates are city-center precision;
-- the map never zooms past a regional frame, so ±0.1° is invisible.

UPDATE commulingo_history_events SET locations = '[
  {"lat":59.94,"lng":30.31,"label":{"ko":"상트페테르부르크","en":"St. Petersburg"},"kind":"main"},
  {"lat":55.75,"lng":37.62,"label":{"ko":"모스크바","en":"Moscow"}},
  {"lat":46.48,"lng":30.73,"label":{"ko":"오데사","en":"Odessa"}}
]'::jsonb WHERE id = 'revolution-1905';

UPDATE commulingo_history_events SET locations = '[
  {"lat":59.94,"lng":30.31,"label":{"ko":"페트로그라드","en":"Petrograd"},"kind":"main"}
]'::jsonb WHERE id = 'february-revolution';

UPDATE commulingo_history_events SET locations = '[
  {"lat":59.94,"lng":30.31,"label":{"ko":"페트로그라드","en":"Petrograd"},"kind":"main"},
  {"lat":55.75,"lng":37.62,"label":{"ko":"모스크바","en":"Moscow"}}
]'::jsonb WHERE id = 'october-revolution';

UPDATE commulingo_history_events SET locations = '[
  {"lat":55.75,"lng":37.62,"label":{"ko":"모스크바","en":"Moscow"},"kind":"main"},
  {"lat":54.99,"lng":73.37,"label":{"ko":"옴스크","en":"Omsk"}},
  {"lat":47.24,"lng":39.71,"label":{"ko":"로스토프나도누","en":"Rostov-on-Don"}},
  {"lat":64.54,"lng":40.54,"label":{"ko":"아르한겔스크","en":"Arkhangelsk"}},
  {"lat":43.12,"lng":131.89,"label":{"ko":"블라디보스토크","en":"Vladivostok"}}
]'::jsonb WHERE id = 'civil-war';

UPDATE commulingo_history_events SET locations = '[
  {"lat":52.23,"lng":21.01,"label":{"ko":"바르샤바","en":"Warsaw"},"kind":"main"},
  {"lat":50.45,"lng":30.52,"label":{"ko":"키예프","en":"Kiev"}},
  {"lat":49.84,"lng":24.03,"label":{"ko":"리보프","en":"Lwów"}}
]'::jsonb WHERE id = 'soviet-polish-war';

UPDATE commulingo_history_events SET locations = '[
  {"lat":60.01,"lng":29.77,"label":{"ko":"크론시타트","en":"Kronstadt"},"kind":"main"}
]'::jsonb WHERE id = 'kronstadt-1921';

UPDATE commulingo_history_events SET locations = '[
  {"lat":53.24,"lng":50.22,"label":{"ko":"사마라","en":"Samara"},"kind":"main"},
  {"lat":51.53,"lng":46.03,"label":{"ko":"사라토프","en":"Saratov"}},
  {"lat":55.79,"lng":49.11,"label":{"ko":"카잔","en":"Kazan"}}
]'::jsonb WHERE id = 'volga-famine';

UPDATE commulingo_history_events SET locations = '[
  {"lat":55.75,"lng":37.62,"label":{"ko":"모스크바","en":"Moscow"},"kind":"main"},
  {"lat":49.99,"lng":36.23,"label":{"ko":"하리코프","en":"Kharkov"}},
  {"lat":53.90,"lng":27.56,"label":{"ko":"민스크","en":"Minsk"}},
  {"lat":41.69,"lng":44.80,"label":{"ko":"트빌리시","en":"Tbilisi"}}
]'::jsonb WHERE id = 'ussr-formation';

UPDATE commulingo_history_events SET locations = '[
  {"lat":55.75,"lng":37.62,"label":{"ko":"모스크바","en":"Moscow"},"kind":"main"}
]'::jsonb WHERE id = 'new-economic-policy';

UPDATE commulingo_history_events SET locations = '[
  {"lat":55.75,"lng":37.62,"label":{"ko":"모스크바","en":"Moscow"},"kind":"main"}
]'::jsonb WHERE id = 'succession-struggle';

UPDATE commulingo_history_events SET locations = '[
  {"lat":53.41,"lng":59.05,"label":{"ko":"마그니토고르스크","en":"Magnitogorsk"},"kind":"main"},
  {"lat":47.87,"lng":35.09,"label":{"ko":"드네프르 댐","en":"Dnieper Dam"}},
  {"lat":53.76,"lng":87.11,"label":{"ko":"쿠즈네츠크","en":"Kuznetsk"}}
]'::jsonb WHERE id = 'five-year-plans';

UPDATE commulingo_history_events SET locations = '[
  {"lat":49.99,"lng":36.23,"label":{"ko":"하리코프","en":"Kharkov"},"kind":"main"},
  {"lat":50.45,"lng":30.52,"label":{"ko":"키예프","en":"Kiev"}},
  {"lat":45.04,"lng":38.98,"label":{"ko":"쿠반","en":"Kuban"}},
  {"lat":43.25,"lng":76.90,"label":{"ko":"알마아타","en":"Alma-Ata"}}
]'::jsonb WHERE id = 'holodomor';

UPDATE commulingo_history_events SET locations = '[
  {"lat":48.86,"lng":2.35,"label":{"ko":"파리","en":"Paris"},"kind":"main"}
]'::jsonb WHERE id = 'february-1934-crisis';

UPDATE commulingo_history_events SET locations = '[
  {"lat":48.86,"lng":2.35,"label":{"ko":"파리","en":"Paris"},"kind":"main"}
]'::jsonb WHERE id = 'french-popular-front';

UPDATE commulingo_history_events SET locations = '[
  {"lat":40.42,"lng":-3.70,"label":{"ko":"마드리드","en":"Madrid"},"kind":"main"},
  {"lat":41.39,"lng":2.17,"label":{"ko":"바르셀로나","en":"Barcelona"}},
  {"lat":43.31,"lng":-2.68,"label":{"ko":"게르니카","en":"Guernica"}}
]'::jsonb WHERE id = 'spanish-civil-war';

UPDATE commulingo_history_events SET locations = '[
  {"lat":55.75,"lng":37.62,"label":{"ko":"모스크바","en":"Moscow"},"kind":"main"},
  {"lat":59.56,"lng":150.80,"label":{"ko":"콜리마 수용소","en":"Kolyma camps"}}
]'::jsonb WHERE id = 'great-terror';

UPDATE commulingo_history_events SET locations = '[
  {"lat":47.63,"lng":118.63,"label":{"ko":"할힌골","en":"Khalkhin Gol"},"kind":"main"},
  {"lat":42.43,"lng":130.64,"label":{"ko":"하산 호","en":"Lake Khasan"}}
]'::jsonb WHERE id = 'soviet-japanese-border-wars';

UPDATE commulingo_history_events SET locations = '[
  {"lat":55.75,"lng":37.62,"label":{"ko":"모스크바","en":"Moscow"},"kind":"main"},
  {"lat":52.10,"lng":23.70,"label":{"ko":"브레스트","en":"Brest"}}
]'::jsonb WHERE id = 'nazi-soviet-pact';

UPDATE commulingo_history_events SET locations = '[
  {"lat":60.71,"lng":28.75,"label":{"ko":"비푸리","en":"Viipuri"},"kind":"main"},
  {"lat":60.17,"lng":24.94,"label":{"ko":"헬싱키","en":"Helsinki"}},
  {"lat":64.88,"lng":28.91,"label":{"ko":"수오무살미","en":"Suomussalmi"}}
]'::jsonb WHERE id = 'winter-war';

UPDATE commulingo_history_events SET locations = '[
  {"lat":48.86,"lng":2.35,"label":{"ko":"파리","en":"Paris"},"kind":"main"},
  {"lat":49.70,"lng":4.94,"label":{"ko":"스당","en":"Sedan"}},
  {"lat":51.03,"lng":2.38,"label":{"ko":"됭케르크","en":"Dunkirk"}},
  {"lat":46.13,"lng":3.42,"label":{"ko":"비시","en":"Vichy"}}
]'::jsonb WHERE id = 'fall-of-france';

UPDATE commulingo_history_events SET locations = '[
  {"lat":51.51,"lng":-0.13,"label":{"ko":"런던","en":"London"},"kind":"main"},
  {"lat":52.41,"lng":-1.51,"label":{"ko":"코번트리","en":"Coventry"}}
]'::jsonb WHERE id = 'battle-of-britain';

UPDATE commulingo_history_events SET locations = '[
  {"lat":55.75,"lng":37.62,"label":{"ko":"모스크바","en":"Moscow"},"kind":"main"},
  {"lat":52.10,"lng":23.70,"label":{"ko":"브레스트","en":"Brest"}},
  {"lat":48.71,"lng":44.51,"label":{"ko":"스탈린그라드","en":"Stalingrad"}},
  {"lat":51.73,"lng":36.19,"label":{"ko":"쿠르스크","en":"Kursk"}},
  {"lat":52.52,"lng":13.40,"label":{"ko":"베를린","en":"Berlin"}}
]'::jsonb WHERE id = 'great-patriotic-war';

UPDATE commulingo_history_events SET locations = '[
  {"lat":59.94,"lng":30.31,"label":{"ko":"레닌그라드","en":"Leningrad"},"kind":"main"},
  {"lat":60.84,"lng":31.49,"label":{"ko":"라도가 호","en":"Lake Ladoga"}}
]'::jsonb WHERE id = 'siege-of-leningrad';

UPDATE commulingo_history_events SET locations = '[
  {"lat":21.36,"lng":-157.95,"label":{"ko":"진주만","en":"Pearl Harbor"},"kind":"main"},
  {"lat":28.21,"lng":-177.37,"label":{"ko":"미드웨이","en":"Midway"}},
  {"lat":35.68,"lng":139.69,"label":{"ko":"도쿄","en":"Tokyo"}},
  {"lat":26.33,"lng":127.80,"label":{"ko":"오키나와","en":"Okinawa"}},
  {"lat":34.39,"lng":132.45,"label":{"ko":"히로시마","en":"Hiroshima"}}
]'::jsonb WHERE id = 'pacific-war';

UPDATE commulingo_history_events SET locations = '[
  {"lat":48.71,"lng":44.51,"label":{"ko":"스탈린그라드","en":"Stalingrad"},"kind":"main"}
]'::jsonb WHERE id = 'stalingrad';

UPDATE commulingo_history_events SET locations = '[
  {"lat":49.34,"lng":-0.60,"label":{"ko":"노르망디","en":"Normandy"},"kind":"main"},
  {"lat":49.92,"lng":1.08,"label":{"ko":"디에프","en":"Dieppe"}},
  {"lat":48.86,"lng":2.35,"label":{"ko":"파리","en":"Paris"}}
]'::jsonb WHERE id = 'second-front-normandy';

UPDATE commulingo_history_events SET locations = '[
  {"lat":41.90,"lng":12.50,"label":{"ko":"로마","en":"Rome"},"kind":"main"},
  {"lat":37.60,"lng":14.02,"label":{"ko":"시칠리아","en":"Sicily"}},
  {"lat":41.49,"lng":13.81,"label":{"ko":"몬테카시노","en":"Monte Cassino"}},
  {"lat":45.46,"lng":9.19,"label":{"ko":"밀라노","en":"Milan"}}
]'::jsonb WHERE id = 'italian-campaign';

UPDATE commulingo_history_events SET locations = '[
  {"lat":48.86,"lng":2.35,"label":{"ko":"파리","en":"Paris"},"kind":"main"},
  {"lat":45.76,"lng":4.84,"label":{"ko":"리옹","en":"Lyon"}},
  {"lat":44.93,"lng":5.42,"label":{"ko":"베르코르","en":"Vercors"}}
]'::jsonb WHERE id = 'french-resistance';

UPDATE commulingo_history_events SET locations = '[
  {"lat":52.23,"lng":21.01,"label":{"ko":"바르샤바","en":"Warsaw"},"kind":"main"}
]'::jsonb WHERE id = 'warsaw-uprising';

UPDATE commulingo_history_events SET locations = '[
  {"lat":44.79,"lng":20.45,"label":{"ko":"베오그라드","en":"Belgrade"},"kind":"main"},
  {"lat":44.34,"lng":17.27,"label":{"ko":"야이체","en":"Jajce"}}
]'::jsonb WHERE id = 'yugoslav-partisans';

UPDATE commulingo_history_events SET locations = '[
  {"lat":37.98,"lng":23.73,"label":{"ko":"아테네","en":"Athens"},"kind":"main"},
  {"lat":38.78,"lng":22.38,"label":{"ko":"고르고포타모스","en":"Gorgopotamos"}}
]'::jsonb WHERE id = 'greek-resistance';

UPDATE commulingo_history_events SET locations = '[
  {"lat":44.50,"lng":34.17,"label":{"ko":"얄타","en":"Yalta"},"kind":"main"},
  {"lat":52.40,"lng":13.06,"label":{"ko":"포츠담","en":"Potsdam"}}
]'::jsonb WHERE id = 'yalta-potsdam';

UPDATE commulingo_history_events SET locations = '[
  {"lat":45.80,"lng":126.53,"label":{"ko":"하얼빈","en":"Harbin"},"kind":"main"},
  {"lat":41.79,"lng":129.79,"label":{"ko":"청진","en":"Chongjin"}},
  {"lat":38.82,"lng":121.26,"label":{"ko":"뤼순","en":"Port Arthur"}}
]'::jsonb WHERE id = 'manchurian-operation';

UPDATE commulingo_history_events SET locations = '[
  {"lat":48.86,"lng":2.35,"label":{"ko":"파리","en":"Paris"},"kind":"main"},
  {"lat":38.90,"lng":-77.04,"label":{"ko":"워싱턴","en":"Washington"}}
]'::jsonb WHERE id = 'marshall-plan';

UPDATE commulingo_history_events SET locations = '[
  {"lat":52.52,"lng":13.40,"label":{"ko":"베를린","en":"Berlin"},"kind":"main"}
]'::jsonb WHERE id = 'berlin-blockade';

UPDATE commulingo_history_events SET locations = '[
  {"lat":44.79,"lng":20.45,"label":{"ko":"베오그라드","en":"Belgrade"},"kind":"main"},
  {"lat":55.75,"lng":37.62,"label":{"ko":"모스크바","en":"Moscow"}}
]'::jsonb WHERE id = 'tito-stalin-split';

UPDATE commulingo_history_events SET locations = '[
  {"lat":59.94,"lng":30.31,"label":{"ko":"레닌그라드","en":"Leningrad"},"kind":"main"},
  {"lat":55.75,"lng":37.62,"label":{"ko":"모스크바","en":"Moscow"}}
]'::jsonb WHERE id = 'leningrad-affair';

UPDATE commulingo_history_events SET locations = '[
  {"lat":50.43,"lng":78.40,"label":{"ko":"세미팔라틴스크","en":"Semipalatinsk"},"kind":"main"},
  {"lat":54.93,"lng":43.32,"label":{"ko":"아르자마스-16","en":"Arzamas-16"}}
]'::jsonb WHERE id = 'soviet-atomic-project';

UPDATE commulingo_history_events SET locations = '[
  {"lat":55.75,"lng":37.62,"label":{"ko":"모스크바","en":"Moscow"},"kind":"main"}
]'::jsonb WHERE id = 'doctors-plot';

UPDATE commulingo_history_events SET locations = '[
  {"lat":37.57,"lng":126.98,"label":{"ko":"서울","en":"Seoul"},"kind":"main"},
  {"lat":39.03,"lng":125.75,"label":{"ko":"평양","en":"Pyongyang"}},
  {"lat":35.10,"lng":129.03,"label":{"ko":"부산","en":"Busan"}}
]'::jsonb WHERE id = 'korean-war';

UPDATE commulingo_history_events SET locations = '[
  {"lat":55.75,"lng":37.62,"label":{"ko":"모스크바","en":"Moscow"},"kind":"main"}
]'::jsonb WHERE id = 'beria-purge';

UPDATE commulingo_history_events SET locations = '[
  {"lat":52.23,"lng":21.01,"label":{"ko":"바르샤바","en":"Warsaw"},"kind":"main"},
  {"lat":55.75,"lng":37.62,"label":{"ko":"모스크바","en":"Moscow"}}
]'::jsonb WHERE id = 'warsaw-pact';

UPDATE commulingo_history_events SET locations = '[
  {"lat":55.75,"lng":37.62,"label":{"ko":"모스크바","en":"Moscow"},"kind":"main"}
]'::jsonb WHERE id = 'twentieth-party-congress';

UPDATE commulingo_history_events SET locations = '[
  {"lat":52.41,"lng":16.93,"label":{"ko":"포즈난","en":"Poznań"},"kind":"main"}
]'::jsonb WHERE id = 'poznan-1956';

UPDATE commulingo_history_events SET locations = '[
  {"lat":47.50,"lng":19.04,"label":{"ko":"부다페스트","en":"Budapest"},"kind":"main"}
]'::jsonb WHERE id = 'hungarian-revolution';

UPDATE commulingo_history_events SET locations = '[
  {"lat":55.75,"lng":37.62,"label":{"ko":"모스크바","en":"Moscow"},"kind":"main"}
]'::jsonb WHERE id = 'anti-party-group';

UPDATE commulingo_history_events SET locations = '[
  {"lat":45.62,"lng":63.31,"label":{"ko":"바이코누르","en":"Baikonur"},"kind":"main"},
  {"lat":55.75,"lng":37.62,"label":{"ko":"모스크바","en":"Moscow"}}
]'::jsonb WHERE id = 'soviet-space-program';

UPDATE commulingo_history_events SET locations = '[
  {"lat":55.75,"lng":37.62,"label":{"ko":"모스크바","en":"Moscow"},"kind":"main"},
  {"lat":39.90,"lng":116.40,"label":{"ko":"베이징","en":"Beijing"}},
  {"lat":46.48,"lng":133.84,"label":{"ko":"다만스키 섬","en":"Damansky Island"}}
]'::jsonb WHERE id = 'sino-soviet-split';

UPDATE commulingo_history_events SET locations = '[
  {"lat":52.52,"lng":13.40,"label":{"ko":"베를린","en":"Berlin"},"kind":"main"}
]'::jsonb WHERE id = 'berlin-wall';

UPDATE commulingo_history_events SET locations = '[
  {"lat":23.13,"lng":-82.38,"label":{"ko":"아바나","en":"Havana"},"kind":"main"},
  {"lat":38.90,"lng":-77.04,"label":{"ko":"워싱턴","en":"Washington"}}
]'::jsonb WHERE id = 'cuban-missile-crisis';

UPDATE commulingo_history_events SET locations = '[
  {"lat":55.75,"lng":37.62,"label":{"ko":"모스크바","en":"Moscow"},"kind":"main"}
]'::jsonb WHERE id = 'kosygin-reform';

UPDATE commulingo_history_events SET locations = '[
  {"lat":50.09,"lng":14.42,"label":{"ko":"프라하","en":"Prague"},"kind":"main"}
]'::jsonb WHERE id = 'prague-spring';

UPDATE commulingo_history_events SET locations = '[
  {"lat":55.75,"lng":37.62,"label":{"ko":"모스크바","en":"Moscow"},"kind":"main"},
  {"lat":38.90,"lng":-77.04,"label":{"ko":"워싱턴","en":"Washington"}},
  {"lat":48.21,"lng":16.37,"label":{"ko":"빈","en":"Vienna"}}
]'::jsonb WHERE id = 'detente-salt';

UPDATE commulingo_history_events SET locations = '[
  {"lat":60.17,"lng":24.94,"label":{"ko":"헬싱키","en":"Helsinki"},"kind":"main"}
]'::jsonb WHERE id = 'helsinki-accords';

UPDATE commulingo_history_events SET locations = '[
  {"lat":34.53,"lng":69.17,"label":{"ko":"카불","en":"Kabul"},"kind":"main"},
  {"lat":31.61,"lng":65.71,"label":{"ko":"칸다하르","en":"Kandahar"}},
  {"lat":35.35,"lng":69.70,"label":{"ko":"판지시르 계곡","en":"Panjshir Valley"}}
]'::jsonb WHERE id = 'afghanistan-war';

UPDATE commulingo_history_events SET locations = '[
  {"lat":54.35,"lng":18.65,"label":{"ko":"그단스크","en":"Gdańsk"},"kind":"main"},
  {"lat":52.23,"lng":21.01,"label":{"ko":"바르샤바","en":"Warsaw"}}
]'::jsonb WHERE id = 'solidarity-martial-law';

UPDATE commulingo_history_events SET locations = '[
  {"lat":55.75,"lng":37.62,"label":{"ko":"모스크바","en":"Moscow"},"kind":"main"},
  {"lat":46.96,"lng":142.74,"label":{"ko":"사할린","en":"Sakhalin"}}
]'::jsonb WHERE id = 'war-scare-1983';

UPDATE commulingo_history_events SET locations = '[
  {"lat":55.75,"lng":37.62,"label":{"ko":"모스크바","en":"Moscow"},"kind":"main"}
]'::jsonb WHERE id = 'perestroika';

UPDATE commulingo_history_events SET locations = '[
  {"lat":55.75,"lng":37.62,"label":{"ko":"모스크바","en":"Moscow"},"kind":"main"}
]'::jsonb WHERE id = 'anti-alcohol-campaign';

UPDATE commulingo_history_events SET locations = '[
  {"lat":51.39,"lng":30.10,"label":{"ko":"체르노빌","en":"Chernobyl"},"kind":"main"},
  {"lat":50.45,"lng":30.52,"label":{"ko":"키예프","en":"Kiev"}}
]'::jsonb WHERE id = 'chernobyl';

UPDATE commulingo_history_events SET locations = '[
  {"lat":55.75,"lng":37.62,"label":{"ko":"모스크바","en":"Moscow"},"kind":"main"},
  {"lat":46.20,"lng":6.14,"label":{"ko":"제네바","en":"Geneva"}},
  {"lat":64.15,"lng":-21.94,"label":{"ko":"레이캬비크","en":"Reykjavík"}},
  {"lat":35.90,"lng":14.51,"label":{"ko":"몰타","en":"Malta"}}
]'::jsonb WHERE id = 'new-thinking-diplomacy';

UPDATE commulingo_history_events SET locations = '[
  {"lat":55.75,"lng":37.62,"label":{"ko":"모스크바","en":"Moscow"},"kind":"main"}
]'::jsonb WHERE id = 'nineteenth-party-conference';

UPDATE commulingo_history_events SET locations = '[
  {"lat":39.83,"lng":46.75,"label":{"ko":"카라바흐","en":"Karabakh"},"kind":"main"},
  {"lat":41.69,"lng":44.80,"label":{"ko":"트빌리시","en":"Tbilisi"}},
  {"lat":40.41,"lng":49.87,"label":{"ko":"바쿠","en":"Baku"}},
  {"lat":54.69,"lng":25.28,"label":{"ko":"빌뉴스","en":"Vilnius"}}
]'::jsonb WHERE id = 'nationalities-crisis';

UPDATE commulingo_history_events SET locations = '[
  {"lat":54.69,"lng":25.28,"label":{"ko":"빌뉴스","en":"Vilnius"},"kind":"main"},
  {"lat":56.95,"lng":24.11,"label":{"ko":"리가","en":"Riga"}},
  {"lat":59.44,"lng":24.75,"label":{"ko":"탈린","en":"Tallinn"}}
]'::jsonb WHERE id = 'baltic-independence';

UPDATE commulingo_history_events SET locations = '[
  {"lat":52.52,"lng":13.40,"label":{"ko":"베를린","en":"Berlin"},"kind":"main"},
  {"lat":52.23,"lng":21.01,"label":{"ko":"바르샤바","en":"Warsaw"}},
  {"lat":50.09,"lng":14.42,"label":{"ko":"프라하","en":"Prague"}},
  {"lat":44.43,"lng":26.10,"label":{"ko":"부쿠레슈티","en":"Bucharest"}}
]'::jsonb WHERE id = 'revolutions-1989';

UPDATE commulingo_history_events SET locations = '[
  {"lat":55.75,"lng":37.62,"label":{"ko":"모스크바","en":"Moscow"},"kind":"main"}
]'::jsonb WHERE id = 'economic-reform-debate';

UPDATE commulingo_history_events SET locations = '[
  {"lat":55.72,"lng":37.30,"label":{"ko":"노보오가료보","en":"Novo-Ogaryovo"},"kind":"main"}
]'::jsonb WHERE id = 'novo-ogaryovo-process';

UPDATE commulingo_history_events SET locations = '[
  {"lat":55.75,"lng":37.62,"label":{"ko":"모스크바","en":"Moscow"},"kind":"main"},
  {"lat":44.39,"lng":33.79,"label":{"ko":"포로스","en":"Foros"}},
  {"lat":52.70,"lng":23.85,"label":{"ko":"벨로베시 숲","en":"Belovezha Forest"}}
]'::jsonb WHERE id = 'soviet-collapse';
