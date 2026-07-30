-- Phrases that must never auto-link, moved out of code.
--
-- The linking policy in data/commulingo/linkify.js is stable; what churns is
-- the exception list beside it. Korean has no word boundary, so 레닌그라드
-- contains 레닌 and 비테프스크 contains 비테; English has \b but that does not
-- keep 주코프 out of 유리 주코프, a Pravda journalist who is not the marshal.
-- Every new card can collide with an existing name, so this list grows with the
-- dictionary — people-linkify.js took 14 commits in three weeks, most of them
-- one string added here, each costing a commit, an image rebuild and a
-- container recreate.
--
-- It is data about content, so it lives with the content. An entry found firing
-- in real prose is now one INSERT.
--
-- `note` is why the phrase is blocked, for whoever reads the row later. The
-- groupings below are the ones the code carried as comments.

CREATE TABLE IF NOT EXISTS commulingo_link_blocklist (
    lang       text        NOT NULL CHECK (lang IN ('ko', 'en')),
    phrase     text        NOT NULL,
    note       text        NOT NULL DEFAULT '',
    created_at timestamptz NOT NULL DEFAULT now(),
    PRIMARY KEY (lang, phrase)
);

COMMENT ON TABLE commulingo_link_blocklist IS
    'Strings that contain a dictionary alias but must never link to it. Joined into the person-alias alternation ahead of the aliases themselves, so the longer phrase is consumed first and passes through untouched.';

INSERT INTO commulingo_link_blocklist (lang, phrase) VALUES
    ('ko', '레닌그라드'),
    ('ko', '스탈린그라드'),
    ('ko', '레닌주의'),
    ('ko', '스탈린주의'),
    ('ko', '마르크스주의'),
    ('ko', '트로츠키주의'),
    ('ko', '마르크스-레닌주의'),
    ('ko', '라살레주의'),
    ('ko', '라살레파'),
    ('ko', '탈레반'),
    ('ko', '넵스키 대로'),
    ('ko', '로마노프 왕조'),
    ('ko', '사이버-레닌'),
    ('ko', '사이버 레닌'),
    ('ko', '만네르헤임'),
    ('ko', '만네르하임'),
    ('ko', '디아스포라'),
    ('ko', '베르그송'),
    ('ko', '플린트'),
    ('ko', '노긴스크'),
    ('ko', '바우만스카야'),
    ('ko', '루벤스타인'),
    ('ko', '차야노프시치나'),
    ('ko', '콘드라티예프시치나'),
    ('ko', '콘드라티예프시나'),
    ('ko', '수하노프카'),
    ('ko', '비테프스크'),
    ('ko', '펠셰르'),
    ('ko', '바쿠닌주의'),
    ('ko', '콘드라티예프주의'),
    ('ko', '블랑키즘'),
    ('ko', '블랑키스트'),
    ('ko', '흐빌로비즘'),
    ('ko', '알렉산드르 안드레예프'),
    ('ko', '니콜라이 안드레예프'),
    ('ko', '블라디미르 표도로프'),
    ('ko', '알렉세이 표도로프'),
    ('ko', '세르게이 코로빈'),
    ('ko', '스타니슬라프 멘시코프'),
    ('ko', '니키타 모이세예프'),
    ('ko', '겐리흐 노보질로프'),
    ('ko', '유리 주코프'),
    ('ko', '알렉산드르 지노비예프'),
    ('ko', '세르게이 두비닌'),
    ('ko', '알렉산드르 막시모프'),
    ('ko', '레오니트 파스테르나크'),
    ('ko', '세르게이 불가코프'),
    ('ko', '빌리 피셔'),
    ('ko', '안드레이 카피차'),
    ('ko', '세르게이 플라토노프'),
    ('ko', '예브게니 리프시츠'),
    ('ko', '일리야 리프시츠'),
    ('ko', '드미트리 수하노프'),
    ('ko', '이반 보로딘'),
    ('ko', '알렉산드르 넵스키'),
    ('ko', '알렉산드르 말리놉스키'),
    ('ko', '니콜라이 소콜로프'),
    ('ko', 'A. 베네딕토프'),
    ('ko', '이반 플료로프'),
    ('ko', '아타만 칼미코프'),
    ('ko', '보리스 슬루츠키'),
    ('ko', '알렉산드르 야쿠봅스키'),
    ('ko', '바실리 자이체프'),
    ('ko', '세르게이 이그나티예프'),
    ('ko', '바딤 트라페즈니코프'),
    ('ko', '이반 모로조프'),
    ('ko', '니콜라이 모로조프'),
    ('ko', '니콜라이 볼스키'),
    ('ko', '빅토르 사프로노프'),
    ('ko', '뱌체슬라프 티호노프'),
    ('ko', '안드레이 보즈네센스키'),
    ('ko', '알렉세이 라주몹스키'),
    ('ko', '레프 카르포프'),
    ('ko', '글레프 우스펜스키'),
    ('ko', '스베르들로프 공산대학'),
    ('en', 'Ivan Borodin'),
    ('en', 'Alexander Nevsky'),
    ('en', 'Nevsky Prospect'),
    ('en', 'Sergei Bulgakov'),
    ('en', 'Yuri Zhukov'),
    ('en', 'Alexander Zinoviev'),
    ('en', 'Nikolai Sokolov'),
    ('en', 'Ivan Flyorov'),
    ('en', 'Boris Slutsky'),
    ('en', 'Alexander Yakubovsky'),
    ('en', 'Sergei Ignatiev'),
    ('en', 'Vadim Trapeznikov'),
    ('en', 'Ivan Morozov'),
    ('en', 'Nikolai Morozov'),
    ('en', 'Nikolai Volsky'),
    ('en', 'Viktor Safronov'),
    ('en', 'Vyacheslav Tikhonov'),
    ('en', 'Andrei Voznesensky'),
    ('en', 'Alexei Razumovsky'),
    ('en', 'Lev Karpov'),
    ('en', 'Gleb Uspensky'),
    ('en', 'Leonid Pasternak'),
    ('en', 'Andrei Kapitsa'),
    ('en', 'Sergei Platonov'),
    ('en', 'Evgeny Lifshitz'),
    ('en', 'Ilya Lifshitz'),
    ('en', 'Nikolai Andreyev'),
    ('en', 'Sergei Korovin'),
    ('en', 'Stanislav Menshikov'),
    ('en', 'Sverdlov Communist University'),
    ('en', 'Rumyantsev Museum'),
    ('en', 'Steklov Institute')
ON CONFLICT (lang, phrase) DO NOTHING;

-- The reasons the code kept as section comments, attached to their rows.
UPDATE commulingo_link_blocklist SET note = '이름을 품은 지명·사상·조직 (레닌그라드는 레닌이 아니다)'
 WHERE lang = 'ko' AND phrase IN ('레닌그라드','스탈린그라드','레닌주의','스탈린주의','마르크스주의','트로츠키주의',
   '마르크스-레닌주의','라살레주의','라살레파','탈레반','넵스키 대로','로마노프 왕조','사이버-레닌','사이버 레닌',
   '바쿠닌주의','콘드라티예프주의','블랑키즘','블랑키스트','흐빌로비즘');
UPDATE commulingo_link_blocklist SET note = '별칭으로 시작하는 더 긴 단어 (비테프스크는 비테 백작이, 펠셰르는 펠셰가 아니다)'
 WHERE lang = 'ko' AND phrase IN ('만네르헤임','만네르하임','디아스포라','베르그송','플린트','노긴스크','바우만스카야',
   '루벤스타인','차야노프시치나','콘드라티예프시치나','콘드라티예프시나','수하노프카','비테프스크','펠셰르');
UPDATE commulingo_link_blocklist SET note = '사전 인물과 성이 같은 동명이인 — 성 자체는 계속 링크된다'
 WHERE note = '' AND phrase ~ ' ';
UPDATE commulingo_link_blocklist SET note = '사전 인물의 별칭을 품은 문자열'
 WHERE note = '';
