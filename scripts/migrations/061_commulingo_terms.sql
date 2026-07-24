-- CommuLingo glossary (용어 사전): a third dictionary alongside people and
-- history events, following the same table shapes. term_* aliases feed the
-- auto-linking pipeline (data/commulingo/term-linkify.js); definition is the
-- one-paragraph card text, body_* an optional long-form markdown section.

CREATE TABLE IF NOT EXISTS commulingo_terms (
    id            TEXT PRIMARY KEY,
    sort_order    INTEGER NOT NULL DEFAULT 0,
    term_ko       TEXT NOT NULL,
    term_en       TEXT NOT NULL,
    original      TEXT NOT NULL DEFAULT '',   -- native-script form (нэпман, ГУЛАГ …)
    period_label  TEXT NOT NULL DEFAULT '',
    definition_ko TEXT NOT NULL DEFAULT '',
    definition_en TEXT NOT NULL DEFAULT '',
    body_ko       TEXT NOT NULL DEFAULT '',   -- optional long-form markdown
    body_en       TEXT NOT NULL DEFAULT '',
    sources       JSONB NOT NULL DEFAULT '[]',
    updated_at    TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS commulingo_term_aliases (
    term_id    TEXT NOT NULL REFERENCES commulingo_terms(id) ON DELETE CASCADE,
    lang       TEXT NOT NULL CHECK (lang IN ('ko', 'en')),
    alias      TEXT NOT NULL,
    sort_order INTEGER NOT NULL DEFAULT 0,
    PRIMARY KEY (term_id, lang, alias)
);

CREATE TABLE IF NOT EXISTS commulingo_term_people (
    term_id    TEXT NOT NULL REFERENCES commulingo_terms(id) ON DELETE CASCADE,
    person_id  TEXT NOT NULL REFERENCES commulingo_people(id) ON DELETE CASCADE,
    sort_order INTEGER NOT NULL DEFAULT 0,
    PRIMARY KEY (term_id, person_id)
);

CREATE TABLE IF NOT EXISTS commulingo_term_events (
    term_id    TEXT NOT NULL REFERENCES commulingo_terms(id) ON DELETE CASCADE,
    event_id   TEXT NOT NULL REFERENCES commulingo_history_events(id) ON DELETE CASCADE,
    sort_order INTEGER NOT NULL DEFAULT 0,
    PRIMARY KEY (term_id, event_id)
);

-- ── Seed terms ──────────────────────────────────────────────────────────

INSERT INTO commulingo_terms
    (id, sort_order, term_ko, term_en, original, period_label, definition_ko, definition_en)
VALUES
('nepman', 10, '네프맨', 'NEPman', 'нэпман', '1921–1929',
 '신경제정책(네프) 시기에 합법화된 사적 상업으로 부를 쌓은 상인, 중개인, 소기업가 계층. 당 내부에서는 자본주의 부활의 상징으로 경계되었고, 1920년대 말 네프 폐기와 함께 과세와 체포, 재산 몰수로 소멸했다.',
 'The merchants, middlemen and small entrepreneurs who grew rich on the private trade legalized under the New Economic Policy. Inside the party they came to symbolize a capitalist revival, and they were wiped out by taxation, arrests and confiscation when NEP was abandoned at the end of the 1920s.'),

('kulak', 20, '쿨라크', 'Kulak', 'кулак', '~1930년대',
 '고용 노동이나 대부, 농기구 임대로 이웃보다 부유해진 농민을 가리킨 말. 원래는 농촌의 착취적 부농을 뜻했지만, 전면적 집단화 시기에는 집단화에 저항하는 농민 일반에게 붙는 낙인이 되어 ''계급으로서의 쿨라크 청산'' 아래 수십만 가구가 추방되거나 처형되었다.',
 'A peasant who had grown richer than his neighbours through hired labour, moneylending or renting out equipment. Originally a term for exploitative rich farmers, under full collectivization it became a label pinned on any peasant resisting the kolkhoz, and ''liquidation of the kulaks as a class'' deported or executed hundreds of thousands of households.'),

('kolkhoz', 30, '콜호스', 'Kolkhoz', 'колхоз', '1929–1991',
 '''집단 경리''의 약어로, 농민들의 토지와 가축을 합쳐 만든 집단농장. 형식상 협동조합이었지만 국가가 파종 계획과 수매 가격을 통제했고, 1929년 이후 전면적 집단화로 소련 농업의 기본 단위가 되었다. 국영농장인 솝호스와 구별된다.',
 'Short for ''collective economy'', a collective farm pooling peasants'' land and livestock. Nominally a cooperative, it worked under state control of sowing plans and procurement prices, and after 1929 full collectivization made it the basic unit of Soviet agriculture, distinct from the state-owned sovkhoz.'),

('gulag', 40, '굴라크', 'Gulag', 'ГУЛАГ', '1930–1960',
 '''수용소 총국''의 러시아어 약어로, 강제노동 수용소망 전체를 가리키는 말이 되었다. 벌목과 광산, 운하와 철도 건설에 수인 노동을 동원했으며, 대숙청기와 전후에 수백만 명이 거쳐 갔다. 솔제니친의 기록 이후 소련 국가폭력의 대명사가 되었다.',
 'The Russian acronym for the ''Main Camp Administration'', which came to stand for the entire network of forced labour camps. It mobilized prisoner labour for logging, mining, canals and railways; millions passed through it during the Great Terror and the postwar years, and after Solzhenitsyn''s chronicle it became a byword for Soviet state violence.'),

('nomenklatura', 50, '노멘클라투라', 'Nomenklatura', 'номенклатура', '1920년대~',
 '당 위원회의 승인 없이는 임명될 수 없는 직위 목록, 그리고 그 목록을 채우는 간부층을 함께 가리키는 말. 임명권을 통한 지배는 서기국이 당을 장악하는 핵심 기제였고, 훗날 소련 지배층을 가리키는 사회학적 용어로 굳어졌다.',
 'The list of posts that could not be filled without party committee approval, and by extension the stratum of officials who filled them. Rule through appointment was the secretariat''s key mechanism for controlling the party, and the word later hardened into a sociological name for the Soviet ruling stratum.'),

('soviet-thermidor', 60, '테르미도르', 'Thermidor', 'термидор', '개념',
 '프랑스혁명에서 로베스피에르를 무너뜨린 테르미도르 반동에 빗대어, 혁명이 관료적 반동으로 후퇴하는 국면을 가리키는 말. 트로츠키는 스탈린 체제를 ''소비에트 테르미도르''로 규정하며, 재산 형태는 유지된 채 권력이 관료층으로 넘어갔다고 분석했다.',
 'By analogy with the Thermidorian reaction that toppled Robespierre, the phase in which a revolution slides back into bureaucratic reaction. Trotsky called the Stalin regime a ''Soviet Thermidor'': property forms survived while power passed to the bureaucracy.'),

('socialism-in-one-country', 70, '일국사회주의', 'Socialism in One Country', 'социализм в одной стране', '1924~',
 '세계혁명의 지원 없이도 소련 한 나라에서 사회주의를 완성할 수 있다는 노선. 1924년 말 스탈린이 정식화하고 부하린이 이론적으로 뒷받침했으며, 연속혁명론과의 대결 속에서 당의 공식 교리가 되었다.',
 'The doctrine that socialism could be completed in the Soviet Union alone, without the support of world revolution. Formulated by Stalin in late 1924 and given theoretical backing by Bukharin, it became party orthodoxy in the struggle against the theory of permanent revolution.'),

('permanent-revolution', 80, '연속혁명', 'Permanent Revolution', 'перманентная революция', '1905~',
 '후진국의 민주주의 혁명이 프롤레타리아 권력으로 넘어가고, 그 생존은 다시 혁명의 국제적 확산에 달려 있다는 트로츠키의 이론. 1905년 혁명의 경험에서 정식화되었고, 일국사회주의 노선과 대립하는 축이 되었다.',
 'Trotsky''s theory that a democratic revolution in a backward country must pass over into proletarian power, whose survival in turn depends on the revolution''s international extension. Formulated out of the experience of 1905, it became the axis of opposition to socialism in one country.'),

('democratic-centralism', 90, '민주집중제', 'Democratic Centralism', 'демократический централизм', '개념',
 '자유로운 토론과, 결정 이후의 행동 통일을 결합한 볼셰비키의 조직 원칙. 토론의 자유가 실질일 때와 집중만 남을 때의 간극이 당내 민주주의 논쟁의 핵심이었고, 1921년 분파 금지 이후 급속히 후자로 기울었다.',
 'The Bolshevik organizational principle combining free debate with unity in action once a decision is made. The gap between genuine freedom of discussion and bare centralism was the heart of every inner-party democracy fight, and after the 1921 ban on factions the balance tipped rapidly toward the latter.'),

('dictatorship-of-the-proletariat', 100, '프롤레타리아 독재', 'Dictatorship of the Proletariat', 'диктатура пролетариата', '개념',
 '혁명 이후의 과도기에 노동계급이 국가권력을 장악해야 한다는 마르크스주의 국가론의 핵심 개념. 레닌은 「국가와 혁명」에서 이를 부르주아 국가기구의 분쇄와 소비에트 권력으로 구체화했고, 이후 이 개념의 해석은 소련 체제의 성격 논쟁의 중심이 되었다.',
 'The core concept of the Marxist theory of the state: in the transition after the revolution the working class must hold state power. Lenin made it concrete in The State and Revolution as the smashing of the bourgeois state machine and soviet power, and its interpretation later became central to every debate on the nature of the Soviet system.'),

('stakhanovite-movement', 110, '스타하노프 운동', 'Stakhanovite Movement', 'стахановское движение', '1935~',
 '1935년 광부 스타하노프의 기록 채탄에서 시작된 노동생산성 운동. 기록 달성자에게 임금과 특권을 몰아주는 방식으로 생산 규범을 끌어올렸고, 노동계급 내부에 특권층을 만든다는 비판을 받았다.',
 'The productivity movement launched by the miner Stakhanov''s record coal shift in 1935. It raised output norms by showering record-setters with pay and privileges, and was criticized for creating a privileged stratum inside the working class.'),

('sovnarkom', 120, '소브나르콤', 'Sovnarkom', 'Совнарком', '1917–1946',
 '''인민위원 소비에트''의 약어로, 10월 혁명 직후 수립된 소비에트 정부의 내각. 레닌이 초대 의장을 맡았고, 1946년 각료회의로 개편될 때까지 소련의 공식 정부 기구였다.',
 'Short for the ''Council of People''s Commissars'', the cabinet of the soviet government formed right after the October Revolution. Lenin was its first chairman, and it remained the formal government of the USSR until it was renamed the Council of Ministers in 1946.')
ON CONFLICT (id) DO NOTHING;

INSERT INTO commulingo_term_aliases (term_id, lang, alias, sort_order) VALUES
('nepman', 'ko', '네프맨', 0), ('nepman', 'ko', '네프만', 1),
('nepman', 'en', 'NEPman', 0), ('nepman', 'en', 'NEPmen', 1), ('nepman', 'en', 'Nepman', 2),
('kulak', 'ko', '쿨라크', 0), ('kulak', 'ko', '쿨락', 1),
('kulak', 'en', 'kulak', 0), ('kulak', 'en', 'kulaks', 1), ('kulak', 'en', 'Kulak', 2), ('kulak', 'en', 'Kulaks', 3),
('kolkhoz', 'ko', '콜호스', 0), ('kolkhoz', 'ko', '콜호즈', 1), ('kolkhoz', 'ko', '집단농장', 2),
('kolkhoz', 'en', 'kolkhoz', 0), ('kolkhoz', 'en', 'kolkhozy', 1), ('kolkhoz', 'en', 'kolkhozes', 2),
('gulag', 'ko', '굴라크', 0), ('gulag', 'ko', '굴라그', 1), ('gulag', 'ko', '굴락', 2),
('gulag', 'en', 'Gulag', 0), ('gulag', 'en', 'GULAG', 1), ('gulag', 'en', 'gulag', 2),
('nomenklatura', 'ko', '노멘클라투라', 0),
('nomenklatura', 'en', 'nomenklatura', 0), ('nomenklatura', 'en', 'Nomenklatura', 1),
('soviet-thermidor', 'ko', '테르미도르', 0), ('soviet-thermidor', 'ko', '소비에트 테르미도르', 1),
('soviet-thermidor', 'en', 'Thermidor', 0), ('soviet-thermidor', 'en', 'Soviet Thermidor', 1),
('socialism-in-one-country', 'ko', '일국사회주의', 0), ('socialism-in-one-country', 'ko', '일국 사회주의', 1),
('socialism-in-one-country', 'en', 'Socialism in One Country', 0), ('socialism-in-one-country', 'en', 'socialism in one country', 1),
('permanent-revolution', 'ko', '연속혁명', 0), ('permanent-revolution', 'ko', '연속 혁명', 1), ('permanent-revolution', 'ko', '영구혁명', 2),
('permanent-revolution', 'en', 'Permanent Revolution', 0), ('permanent-revolution', 'en', 'permanent revolution', 1),
('democratic-centralism', 'ko', '민주집중제', 0), ('democratic-centralism', 'ko', '민주적 집중제', 1), ('democratic-centralism', 'ko', '민주주의적 중앙집권제', 2),
('democratic-centralism', 'en', 'democratic centralism', 0), ('democratic-centralism', 'en', 'Democratic Centralism', 1),
('dictatorship-of-the-proletariat', 'ko', '프롤레타리아 독재', 0), ('dictatorship-of-the-proletariat', 'ko', '프롤레타리아트 독재', 1),
('dictatorship-of-the-proletariat', 'en', 'dictatorship of the proletariat', 0), ('dictatorship-of-the-proletariat', 'en', 'Dictatorship of the Proletariat', 1),
('stakhanovite-movement', 'ko', '스타하노프 운동', 0), ('stakhanovite-movement', 'ko', '스타하노프주의', 1),
('stakhanovite-movement', 'en', 'Stakhanovite movement', 0), ('stakhanovite-movement', 'en', 'Stakhanovism', 1),
('sovnarkom', 'ko', '소브나르콤', 0),
('sovnarkom', 'en', 'Sovnarkom', 0), ('sovnarkom', 'en', 'Council of People''s Commissars', 1)
ON CONFLICT DO NOTHING;

INSERT INTO commulingo_term_people (term_id, person_id, sort_order) VALUES
('soviet-thermidor', 'trotsky', 0), ('soviet-thermidor', 'stalin', 1),
('socialism-in-one-country', 'stalin', 0), ('socialism-in-one-country', 'bukharin', 1), ('socialism-in-one-country', 'trotsky', 2),
('permanent-revolution', 'trotsky', 0),
('democratic-centralism', 'lenin', 0),
('dictatorship-of-the-proletariat', 'lenin', 0),
('stakhanovite-movement', 'alexei-stakhanov', 0),
('gulag', 'solzhenitsyn', 0),
('sovnarkom', 'lenin', 0)
ON CONFLICT DO NOTHING;

INSERT INTO commulingo_term_events (term_id, event_id, sort_order) VALUES
('nepman', 'new-economic-policy', 0),
('kulak', 'five-year-plans', 0),
('kolkhoz', 'five-year-plans', 0),
('gulag', 'great-terror', 0),
('permanent-revolution', 'revolution-1905', 0),
('stakhanovite-movement', 'five-year-plans', 0),
('sovnarkom', 'october-revolution', 0)
ON CONFLICT DO NOTHING;
