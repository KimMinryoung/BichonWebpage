// New people for the Czechoslovakia 1945–1948 batch, in the
// commulingo-people-upsert payload shape. Communists and their allies follow
// Gottwald (international-revolutionary, socialist-bloc-leader); the
// non-Communist ministers follow Jan Masaryk (foreign-statesmen).
const W = t => 'https://en.wikipedia.org/wiki/' + t;
const person = (id, groupId, [gko, gen], [fko, fen], nativeName, years, citizenship, origin, role, epithet, bio, fate, aliases, sources) => ({
    id, groupId,
    givenName: { ko: gko, en: gen }, familyName: { ko: fko, en: fen },
    nativeName, years,
    citizenship: { code: citizenship }, nationalOrigin: typeof origin === 'string' ? { code: origin } : origin,
    role: { category: role },
    epithet: { ko: epithet[0], en: epithet[1] },
    bio: { ko: bio[0], en: bio[1] },
    fate: { kind: fate[0], label: { ko: fate[1], en: fate[2] } },
    aliases, sources,
    evidence: [
        { field: 'bio', claim: bio[1] },
        { field: 'years', claim: years },
        { field: 'citizenship', claim: `${id}: citizenship ${citizenship}` },
        { field: 'nationalOrigin', claim: `${id}: national background ${typeof origin === 'string' ? origin : origin.code}` },
    ].map(e => ({ ...e, source: sources[0], locator: 'Wikipedia article: lead, biography sections' })),
});
const COUP = W('1948_Czechoslovak_coup_d%27%C3%A9tat');

module.exports = [
    person('zdenek-fierlinger', 'international-revolutionary', ['즈데네크', 'Zdeněk'], ['피를링게르', 'Fierlinger'], 'Zdeněk Fierlinger', '1891–1976', 'czechoslovakia', 'czechia', 'socialist-bloc-leader',
        ['해방 뒤 첫 총리를 지내고 1948년 2월 공산당 편에 서서 사회민주당을 공산당에 합친 친소 사회민주주의자',
            'Pro-Soviet Social Democrat and first post-liberation premier who sided with the Communists in 1948 and merged his party into theirs'],
        ['올로모우츠 출신의 외교관으로 네덜란드·루마니아·미국·스위스·오스트리아 대사를 거쳐 전쟁 중 모스크바 주재 망명정부 대사를 지내며 소련과 가까워졌다. 1945년 4월 코시체 정부의 총리가 되어 1946년 6월까지 민족전선 정부를 이끌었다. 사회민주당 지도자로서 공산당과의 긴밀한 협력을 주장했고, 1948년 2월 비공산당 장관들이 사임할 때 자리를 지키며 공개적으로 공산당을 지지했다. 쿠데타 뒤 사회민주당을 공산당에 합쳤고 공산 정권에서 고위직을 지냈다.',
            'A diplomat from Olomouc, he served as envoy to the Netherlands, Romania, the United States, Switzerland and Austria and, as the exile government’s ambassador in Moscow during the war, grew close to the Soviet Union. Prime minister of the Košice government from April 1945, he led the National Front government until June 1946. As Social Democratic leader he advocated close co-operation with the Communists, and when the non-Communist ministers resigned in February 1948 he stayed and openly backed the Communists. After the coup he merged the Social Democrats into the Communist Party and held high office under the regime.'],
        ['natural', '자연사', 'Natural causes'], { ko: ['피를링게르'], en: ['Fierlinger'] }, [W('Zden%C4%9Bk_Fierlinger'), COUP]),
    person('antonin-zapotocky', 'international-revolutionary', ['안토닌', 'Antonín'], ['자포토츠키', 'Zápotocký'], 'Antonín Zápotocký', '1884–1957', 'czechoslovakia', 'czechia', 'socialist-bloc-leader',
        ['노동조합 중앙평의회를 이끌고 1948년 2월 사건 뒤 총리, 1953년 대통령이 된 체코슬로바키아 공산주의자',
            'Czechoslovak Communist who led the trade-union central council, became prime minister after February 1948 and president in 1953'],
        ['보헤미아 자콜라니 출신의 석공으로 사회민주당을 거쳐 공산당 창립에 참여했다. 독일 점령기에 체포되어 판크라츠 감옥과 드레스덴을 거쳐 1940년부터 작센하우젠 수용소에 갇혔다. 해방 뒤 귀국해 노동조합 중앙평의회 의장과 공산당 간부회 위원이 되었고, 1946년 제헌의회 의장을 잠시 지냈다. 1948년 6월 대통령이 된 고트발트의 뒤를 이어 총리가 되었고, 1953년 고트발트가 죽자 대통령이 되었다. 보다 온건한 통치를 원했으나 노보트니에게 밀렸다.',
            'A stonemason from Zákolany in Bohemia, he came from the Social Democrats to help found the Communist Party. Arrested under the German occupation, he was held in Pankrác prison and Dresden and from 1940 in Sachsenhausen concentration camp. Back home after liberation he became chairman of the Central Council of Trade Unions and a member of the Communist presidium, and briefly chaired the Constituent Assembly in 1946. He succeeded Gottwald as prime minister in June 1948 when Gottwald became president, and became president himself on Gottwald’s death in 1953. He favoured a more humane rule but was outflanked by Novotný.'],
        ['natural', '자연사', 'Natural causes'], { ko: ['자포토츠키'], en: ['Zápotocký', 'Zapotocky'] }, [W('Anton%C3%ADn_Z%C3%A1potock%C3%BD'), COUP]),
    person('vladimir-clementis', 'international-revolutionary', ['블라디미르', 'Vladimír'], ['클레멘티스', 'Clementis'], 'Vladimír Clementis', '1902–1952', 'czechoslovakia', 'slovakia', 'socialist-bloc-leader',
        ['얀 마사리크의 뒤를 이어 외무장관이 되었다가 1952년 슬란스키 재판에서 처형된 슬로바키아 공산주의자',
            'Slovak Communist who succeeded Jan Masaryk as foreign minister and was executed after the Slánský trial of 1952'],
        ['슬로바키아 티소베츠 출신의 법률가로, 전간기 슬로바키아 지식인에게 큰 영향을 준 문화·정치 잡지 『다우』를 함께 편집한 좌파 지식인이었다. 공산당 의원으로 활동했다. 1948년 3월 얀 마사리크가 숨진 뒤 외무장관이 되어 1950년까지 재임했다. 「티토주의」와 「민족주의 편향」 혐의로 1952년 슬란스키 재판에서 사형을 선고받고 12월 3일 처형되었다. 뒷날 복권되었다.',
            'A lawyer from Tisovec in Slovakia, he was a left-wing intellectual who co-edited Dav, a cultural and political journal of great influence among interwar Slovak intellectuals. He sat as a Communist deputy. He became foreign minister after Jan Masaryk’s death in March 1948 and served until 1950. Accused of “Titoism” and “national deviation”, he was sentenced to death at the Slánský trial of 1952 and executed on 3 December; he was later rehabilitated.'],
        ['executed', '처형', 'Executed'], { ko: ['클레멘티스'], en: ['Clementis'] }, [W('Vladim%C3%ADr_Clementis'), W('Rudolf_Sl%C3%A1nsk%C3%BD')]),
    person('petr-zenkl', 'foreign-statesmen', ['페트르', 'Petr'], ['젠클', 'Zenkl'], 'Petr Zenkl', '1884–1975', 'czechoslovakia', 'czechia', 'foreign-statesman',
        ['1948년 2월 장관 사임을 이끌고 망명해 자유 체코슬로바키아 평의회를 이끈 국민사회당 의장',
            'National Socialist leader who led the ministers’ resignation in February 1948 and headed the exile Council of Free Czechoslovakia'],
        ['보헤미아 타보르의 소상인 집안에서 태어나 교사가 되었고, 1937~1939년 프라하 시장을 지냈다. 독일 점령 뒤 체포되어 다하우와 부헨발트에 갇혔다가 1945년 미군에 의해 풀려났다. 전후 국민사회당 의장으로 다시 프라하 시장이 되었고, 1946년 선거에서 제2당을 이끌어 부총리가 되었다. 1947년 9월 마사리크·드르티나와 함께 폭발물 상자를 받았다. 1948년 2월 다른 비공산당 장관들과 함께 사임했고, 쿠데타 뒤 감시를 피해 망명해 1949~1974년 자유 체코슬로바키아 평의회 의장을 지냈다.',
            'Born to a small tradesman in Tábor in Bohemia, he became a teacher and was mayor of Prague from 1937 to 1939. Arrested after the German occupation, he was held in Dachau and Buchenwald until American troops freed him in 1945. As postwar chairman of the National Socialists he was again mayor of Prague and, after leading the second party in 1946, deputy prime minister. In September 1947 he, Masaryk and Drtina received boxes of explosives. He resigned with the other non-Communist ministers in February 1948, escaped surveillance after the coup and chaired the exile Council of Free Czechoslovakia from 1949 to 1974.'],
        ['exile', '망명지에서 사망', 'Died in exile'], { ko: ['젠클'], en: ['Zenkl'] }, [W('Petr_Zenkl'), COUP]),
    person('hubert-ripka', 'foreign-statesmen', ['후베르트', 'Hubert'], ['립카', 'Ripka'], 'Hubert Ripka', '1895–1958', 'czechoslovakia', 'czechia', 'foreign-statesman',
        ['전후 대외무역장관을 지내고 1948년 2월 사임 뒤 다시 망명한 국민사회당 정치가',
            'Postwar foreign trade minister who resigned in February 1948 and went back into exile'],
        ['언론인 출신의 국민사회당 정치가로, 1940년 영국으로 건너가 런던 망명정부 외무부의 국무장관이 되었다. 1945년 귀국해 대외무역장관을 맡았고 1946~1948년 제헌의회 의원이었다. 1948년 2월 경찰 숙청에 항의해 사임한 비공산당 장관 가운데 하나였고, 공산당이 권력을 잡자 다시 나라를 떠났다. 망명 중에 체코슬로바키아와 뮌헨 협정, 1948년 2월 사건에 관한 책을 썼고, 1958년 1월 런던에서 숨졌다.',
            'A journalist turned National Socialist politician, he went to England in 1940 and became secretary of state in the foreign ministry of the London exile government. Returning in 1945, he became minister of foreign trade and sat in the Constituent Assembly from 1946 to 1948. One of the non-Communist ministers who resigned over the police purge in February 1948, he left the country again when the Communists took power. In exile he wrote on Czechoslovakia, Munich and the events of February 1948, and he died in London in January 1958.'],
        ['exile', '망명지에서 사망', 'Died in exile'], { ko: ['립카'], en: ['Ripka'] }, [W('Hubert_Ripka'), COUP]),
    person('milada-horakova', 'foreign-statesmen', ['밀라다', 'Milada'], ['호라코바', 'Horáková'], 'Milada Horáková', '1901–1950', 'czechoslovakia', 'czechia', 'dissident',
        ['나치와 공산당 모두에 맞서다 1950년 조작된 반역 재판으로 교수형에 처해진 체코의 여성 정치가',
            'Czech politician who resisted both the Nazis and the Communists and was hanged in 1950 after a fabricated treason trial'],
        ['프라하 출신의 법률가로, 전간기 여성 권리 운동에 앞장섰다. 독일 점령기 지하 저항 운동에 참여했다가 1940년 게슈타포에 체포되어 테레진과 독일의 감옥을 거쳤고, 1945년 4월 미군에 의해 풀려났다. 전후 국민사회당 의원이 되었고 1947년 여성 잡지 『블라스타』를 창간했다. 1948년 2월 쿠데타 직후 항의의 뜻으로 의원직을 내놓았지만 망명하지 않고 프라하에서 활동을 이어 갔다. 1949년 9월 체포되어 고문을 동반한 신문 끝에 음모·반역 혐의로 사형을 선고받았고, 1950년 6월 27일 판크라츠 감옥에서 교수형에 처해졌다.',
            'A Prague lawyer, she was prominent in the interwar women’s rights movement. Active in the underground resistance under German occupation, she was arrested by the Gestapo in 1940, passed through Terezín and German prisons and was freed by American troops in April 1945. After the war she became a National Socialist deputy and in 1947 founded the women’s magazine Vlasta. She resigned her seat in protest shortly after the February 1948 coup but chose not to emigrate and stayed politically active in Prague. Arrested in September 1949 and interrogated under torture, she was sentenced to death for conspiracy and treason and hanged in Pankrác prison on 27 June 1950.'],
        ['executed', '처형', 'Executed'], { ko: ['호라코바'], en: ['Horáková', 'Milada Horakova'] }, [W('Milada_Hor%C3%A1kov%C3%A1'), COUP]),
];
