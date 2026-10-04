// Frames of the three child events of the Russian Civil War; the sections,
// timeline rows and person relations of each come from <id>/sec.js.
const fs = require('fs');
const path = require('path');
const { event: buildEvent } = require('./lib');

// Original-language names of the new glossary terms (apply-history-terms.js
// requires one per term).
const ORIGINAL = {
    'union-of-working-peasantry': 'Союз трудового крестьянства',
    'west-siberian-uprising-1921': 'Западно-Сибирское восстание',
    'chapan-war': 'Чапанная война',
    'tambov-order-171': 'Приказ Полномочной комиссии ВЦИК № 171',
    'green-armies': 'Зелёные',
    'japanese-siberian-intervention': 'シベリア出兵',
    'american-expeditionary-force-siberia': 'American Expeditionary Force, Siberia',
    'nikolayevsk-incident': 'Николаевский инцидент',
    'provisional-priamurye-government': 'Временное Приамурское правительство',
    'battle-of-volochayevka': 'Волочаевский бой',
    'kokand-autonomy': 'Кокандская автономия',
    'basmachi-movement': 'Басмачество',
    'alash-orda': 'Алаш Орда',
    'bukharan-peoples-soviet-republic': 'Бухарская Народная Советская Республика',
    'khorezm-peoples-soviet-republic': 'Хорезмская Народная Советская Республика',
    'persian-socialist-soviet-republic': 'جمهوری شوروی سوسیالیستی ایران',
    turkkomissiya: 'Туркестанская комиссия ВЦИК и СНК РСФСР',
    'finnish-red-guards': 'Punakaarti',
    'finnish-white-guard': 'Suojeluskunta',
    'peoples-delegation-of-finland': 'Suomen kansanvaltuuskunta',
    'battle-of-tampere': 'Tampereen taistelu',
    heimosodat: 'Heimosodat',
    'treaty-of-tartu-finland-1920': 'Tarton rauha',
    'kingdom-of-finland-1918': 'Suomen kuningaskunta',
};

const FRAMES = [
    {
        id: 'finland-1917-1920',
        title: { ko: '핀란드 독립과 내전', en: 'Finland: independence and civil war' },
        period: '1917.03–1920.10',
        sortOrder: 41,
        question: {
            ko: '1917년 12월 독립을 선언한 핀란드는 왜 한 달 만에 적위대와 자위대의 내전에 빠졌고, 소비에트 러시아와 독일은 이 전쟁에서 어떤 역할을 했으며, 동쪽 국경은 1920년 타르투 조약으로 어떻게 정리되었나?',
            en: 'Why did Finland, having declared independence in December 1917, fall into a civil war between the Red Guards and the Civil Guards within a month, what part did Soviet Russia and Germany play in it, and how was the eastern border settled by the Treaty of Tartu in 1920?',
        },
        summary: {
            ko: '러시아 혁명 속에 자치를 되찾고 1917년 12월 독립을 선언한 핀란드는 1918년 1월 남부의 적색 핀란드와 북부의 백색 핀란드로 갈라졌다. 소비에트 러시아가 적위대를 거들었으나 만네르헤임의 백군과 독일 발트해 사단이 탐페레·헬싱키·비푸리를 차례로 차지했고, 전쟁 뒤의 처형과 수용소는 3만여 명의 희생 가운데 큰 몫을 차지했다. 독일 왕을 세우려던 계획은 독일의 패전으로 접혔고, 공화국은 동카렐리야 원정을 거쳐 1920년 소비에트 러시아와 타르투 조약을 맺었다.',
            en: 'Having regained its autonomy in the Russian Revolution and declared independence in December 1917, Finland split in January 1918 into a Red south and a White north. Soviet Russia helped the Red Guards, but Mannerheim’s Whites and the German Baltic Sea Division took Tampere, Helsinki and Viipuri in turn, and executions and prison camps after the fighting accounted for a large share of the more than 30,000 dead. The plan for a German king collapsed with Germany’s defeat, and the republic, after expeditions into East Karelia, made the Treaty of Tartu with Soviet Russia in 1920.',
        },
        outcome: {
            ko: '백군이 1918년 5월 승리하고 적위대 지도부는 소비에트 러시아로 망명해 핀란드 공산당을 세웠다. 1919년 공화국 헌법이 채택되었고, 1920년 10월 14일 타르투 조약으로 핀란드는 페차모를 얻고 동카렐리야의 레폴라와 포라얘르비에서 물러났다.',
            en: 'The Whites won in May 1918, and the Red leadership fled to Soviet Russia and founded the Communist Party of Finland. A republican constitution was adopted in 1919, and under the Treaty of Tartu of 14 October 1920 Finland gained Petsamo and withdrew from Repola and Porajärvi in East Karelia.',
        },
        locations: [
            ['헬싱키', 'Helsinki', 60.17, 24.94, 'main'],
            ['탐페레', 'Tampere', 61.5, 23.76, 'place'],
            ['바사', 'Vaasa', 63.1, 21.62, 'place'],
            ['비푸리', 'Viipuri', 60.71, 28.75, 'place'],
            ['라흐티', 'Lahti', 60.98, 25.66, 'place'],
            ['한코', 'Hanko', 59.82, 22.97, 'place'],
            ['타르투', 'Tartu', 58.38, 26.72, 'place'],
        ],
        countries: ['finland', 'russia', 'soviet', 'germany', 'estonia'],
        relations: { parent: 'civil-war', related: ['baltic-wars-of-independence', 'brest-litovsk', 'winter-war'] },
        sides: [
            { id: 'reds', label: { ko: '적색 핀란드·적위대', en: 'Red Finland and the Red Guards' } },
            { id: 'whites', label: { ko: '백색 핀란드·자위대', en: 'White Finland and the Civil Guards' } },
            { id: 'finnish-republic', label: { ko: '핀란드 공화국 정부(1919~1920)', en: 'The government of the Finnish republic (1919–1920)' } },
            { id: 'soviet-russia', label: { ko: '소비에트 러시아', en: 'Soviet Russia' } },
            { id: 'germany', label: { ko: '독일 제국', en: 'The German Empire' } },
            { id: 'russian-whites', label: { ko: '러시아 백군', en: 'The Russian Whites' } },
        ],
        // The Russian Red Guards and Red/White Terror terms must not catch the
        // Finnish ones; "triumvirate" and the Finnish programme's "permanent
        // revolution" point at other subjects. (Bare "Hall" is blocked site-wide, 281.)
        noAutoLink: ['적위대', 'Red Guards', 'Red Guard', '적색 테러', 'Red Terror', '백색 테러', 'White Terror',
            'triumvirate', 'permanent revolution'],
    },
    {
        id: 'central-asia-1917-1924',
        title: { ko: '중앙아시아의 혁명과 전쟁', en: 'Revolution and war in Central Asia' },
        period: '1917.11–1924.10',
        sortOrder: 41,
        question: {
            ko: '러시아 정착민의 타슈켄트 소비에트에서 1924년의 민족 경계 획정까지, 투르키스탄·카자흐 초원·부하라·히바의 혁명은 누구의 혁명이었고, 붉은 군대는 왜 페르시아의 길란까지 나아갔나?',
            en: 'From the settlers’ Tashkent Soviet to the national delimitation of 1924, whose revolution was it in Turkestan, the Kazakh steppe, Bukhara and Khiva, and why did the Red Army go as far as Gilan in Persia?',
        },
        summary: {
            ko: '1917년 타슈켄트에서 권력을 잡은 소비에트는 러시아인 정착민과 철도 노동자의 정권이었고, 무슬림이 세운 코칸트 자치국을 1918년 2월 학살로 무너뜨렸다. 바스마치 봉기, 알라시 오르다의 선택, 영국과 백군에 막힌 고립을 거친 뒤 프룬제의 군대가 1920년 히바와 부하라를 인민소비에트공화국으로 바꾸었고, 같은 해 카스피 함대는 페르시아 길란에 상륙했다. 1924년 소련은 이 지역을 민족별 공화국으로 다시 나누었다.',
            en: 'The soviet that took power in Tashkent in 1917 was a regime of Russian settlers and railway workers, and in February 1918 it destroyed the Muslim Kokand Autonomy in a massacre. After the Basmachi risings, the choices of the Alash Orda and a period cut off by the British and the Whites, Frunze’s armies turned Khiva and Bukhara into people’s soviet republics in 1920, and the same year the Caspian flotilla landed in Persian Gilan. In 1924 the Soviet Union redivided the region into national republics.',
        },
        outcome: {
            ko: '부하라 에미르와 히바 칸은 1920년 쫓겨났고, 바스마치 운동은 엔베르 파샤가 1922년 전사한 뒤 쇠퇴했다. 길란 공화국은 1921년 소련-페르시아 조약에 따라 붉은 군대가 철수한 뒤 무너졌다. 1924년 10월 민족 경계 획정으로 우즈베크·투르크멘 소비에트 사회주의 공화국 등이 세워졌다.',
            en: 'The emir of Bukhara and the khan of Khiva were driven out in 1920, and the Basmachi movement declined after Enver Pasha was killed in 1922. The Gilan republic collapsed after the Red Army withdrew under the Soviet–Persian treaty of 1921. The national delimitation of October 1924 created the Uzbek and Turkmen Soviet Socialist Republics among others.',
        },
        locations: [
            ['타슈켄트', 'Tashkent', 41.3, 69.24, 'main'],
            ['코칸트', 'Kokand', 40.53, 70.94, 'place'],
            ['부하라', 'Bukhara', 39.77, 64.43, 'place'],
            ['히바', 'Khiva', 41.38, 60.36, 'place'],
            ['아슈하바드', 'Ashgabat', 37.96, 58.33, 'place'],
            ['오렌부르크', 'Orenburg', 51.77, 55.1, 'place'],
            ['라슈트', 'Rasht', 37.28, 49.58, 'place'],
        ],
        countries: ['uzbekistan', 'kazakhstan', 'turkmenistan', 'tajikistan', 'kyrgyzstan', 'iran', 'russia', 'soviet', 'uk'],
        relations: { parent: 'civil-war', related: ['transcaucasia-1917-1921', 'ussr-formation'] },
        // Local commissars and officers who share a surname with later cards
        // (Frolov, Shumilov, Kotelnikov, Votintsev), "Bek" from Madamin Bek and
        // Ibrahim Bek read as the writer Alexander Bek, and terms of other eras.
        noAutoLink: ['프롤로프', 'Frolov', '슈밀로프', 'Shumilov', '코텔니코프', 'Kotelnikov', 'Votintsev', '보틴체프', 'Bek',
            '무자헤딘', 'mujahideen', '형제적 원조'],
        sides: [
            { id: 'soviet-forces', label: { ko: '소비에트 세력', en: 'Soviet forces' } },
            { id: 'local-nationalist-governments', label: { ko: '현지 민족 정부', en: 'Local national governments' } },
            { id: 'basmachi', label: { ko: '바스마치', en: 'The Basmachi' } },
            { id: 'emirate-and-khanate', label: { ko: '부하라 에미르국·히바 칸국', en: 'The emirate of Bukhara and the khanate of Khiva' } },
            { id: 'british-and-whites', label: { ko: '영국과 백군', en: 'The British and the Whites' } },
            { id: 'gilan-movement', label: { ko: '정글리 운동', en: 'The Jangali movement' } },
        ],
    },
    {
        id: 'siberia-far-east-1918-1922',
        title: { ko: '시베리아와 극동의 내전', en: 'The Civil War in Siberia and the Far East' },
        period: '1918.05–1922.10',
        sortOrder: 41,
        question: {
            ko: '체코슬로바키아 군단의 반란에서 블라디보스토크 입성까지, 우랄 동쪽의 내전은 왜 4년 넘게 이어졌고 일본의 출병과 극동공화국은 어떤 역할을 했나?',
            en: 'From the revolt of the Czechoslovak Legion to the Red entry into Vladivostok, why did the civil war east of the Urals last more than four years, and what part did the Japanese intervention and the Far Eastern Republic play?',
        },
        summary: {
            ko: '1918년 5월 체코슬로바키아 군단의 반란으로 시베리아의 소비에트 권력이 무너진 뒤, 우랄 동쪽은 옴스크 정부와 콜차크, 아타만 세묘노프·칼미코프의 테러, 일본·미국 등 연합국의 출병, 그리고 마을마다 일어난 파르티잔 전쟁의 무대가 되었다. 콜차크가 몰락한 뒤에도 일본군이 남은 극동에서는 완충국 극동공화국이 세워졌고, 내전은 1922년 10월 블라디보스토크 입성으로 끝났다.',
            en: 'After the revolt of the Czechoslovak Legion overthrew Soviet power in Siberia in May 1918, the land east of the Urals became the stage for the Omsk government and Kolchak, the terror of the atamans Semyonov and Kalmykov, the Allied expeditions led by Japan and the United States, and a partisan war waged village by village. With Japanese troops still in the Far East after Kolchak fell, the buffer Far Eastern Republic was set up, and the war ended only with the Red entry into Vladivostok in October 1922.',
        },
        outcome: {
            ko: '1922년 10월 25일 인민혁명군이 블라디보스토크에 들어가고 일본군이 철수했으며, 11월 극동공화국은 러시아 사회주의 연방 소비에트 공화국에 병합되었다. 북사할린의 일본군은 1925년에야 물러났고, 마지막 백군 원정은 1923년 6월 야쿠티야에서 항복했다.',
            en: 'On 25 October 1922 the People’s Revolutionary Army entered Vladivostok as the Japanese withdrew, and in November the Far Eastern Republic was merged into the Russian Soviet Federative Socialist Republic. Japanese troops left northern Sakhalin only in 1925, and the last White expedition surrendered in Yakutia in June 1923.',
        },
        locations: [
            ['블라디보스토크', 'Vladivostok', 43.12, 131.89, 'main'],
            ['옴스크', 'Omsk', 54.99, 73.37, 'place'],
            ['이르쿠츠크', 'Irkutsk', 52.29, 104.28, 'place'],
            ['치타', 'Chita', 52.03, 113.5, 'place'],
            ['하바롭스크', 'Khabarovsk', 48.48, 135.08, 'place'],
            ['니콜라옙스크나아무레', 'Nikolayevsk-on-Amur', 53.14, 140.72, 'place'],
            ['베르흐네우딘스크', 'Verkhneudinsk', 51.83, 107.58, 'place'],
        ],
        countries: ['russia', 'soviet', 'japan', 'usa', 'czechoslovakia', 'uk', 'mongolia'],
        relations: { parent: 'civil-war', related: ['mongolian-republic-1921-1924', 'ussr-formation'] },
        // Namesakes on other cards (the NKVD's Merkulov and Molchanov, Robert Eikhe,
        // the tank general Kravchenko …), a district name read as a surname, and
        // general phrases that point at other subjects.
        noAutoLink: ['메르쿨로프', 'Merkulov', '몰차노프', 'Molchanov', '마슬렌니코프', '크랍첸코', 'Kravchenko', '에이헤', 'Eiche',
            '마이스키', '군사혁명위원회', '파르티잔 전쟁', 'partisan war', 'partisan struggle', 'buffer state'],
        sides: [
            { id: 'soviet-forces', label: { ko: '소비에트 세력·파르티잔', en: 'Soviet forces and partisans' } },
            { id: 'whites-and-atamans', label: { ko: '백군과 아타만', en: 'The Whites and the atamans' } },
            { id: 'allied-intervention', label: { ko: '연합국 개입군', en: 'Allied intervention forces' } },
            { id: 'czechoslovak-legion', label: { ko: '체코슬로바키아 군단', en: 'The Czechoslovak Legion' } },
        ],
    },
    {
        id: 'peasant-uprisings-1920-1922',
        title: { ko: '탐보프 반란과 농민 봉기', en: 'The Tambov Rebellion and the peasant uprisings' },
        period: '1918–1922',
        sortOrder: 45,
        question: {
            ko: '백군이 무너진 1920~1921년, 볼셰비키는 왜 탐보프와 서시베리아의 농민 수십만 명과 싸워야 했고, 이 「농민 전쟁」은 신경제정책으로의 전환과 어떻게 이어졌나?',
            en: 'In 1920–1921, with the Whites defeated, why did the Bolsheviks have to fight hundreds of thousands of peasants in Tambov and Western Siberia, and how was this “peasant war” tied to the turn to the New Economic Policy?',
        },
        summary: {
            ko: '곡물 할당 징발과 식량 부대의 수색은 1918년부터 농민 봉기를 낳았고, 백군이 패한 1920년 여름부터는 탐보프주의 안토노프 봉기와 1921년 서시베리아 봉기를 비롯한 대규모 농민 전쟁으로 번졌다. 정권은 1921년 3월 징발을 현물세로 바꾸는 한편, 투하쳅스키의 군대와 인질·수용소·독가스 명령으로 봉기를 진압했다.',
            en: 'Grain requisitioning and the searches of the food detachments provoked peasant risings from 1918, and from the summer of 1920, with the Whites beaten, they grew into a large-scale peasant war led by the Antonov rising in Tambov province and the West Siberian uprising of 1921. In March 1921 the regime replaced requisitioning with a tax in kind, while Tukhachevsky’s troops put the risings down with hostage-taking, camps and orders to use poison gas.',
        },
        outcome: {
            ko: '탐보프의 봉기군 주력은 1921년 여름 격파되었고, 안토노프 형제는 1922년 6월 체카와의 총격전에서 죽었다. 서시베리아의 마지막 부대도 1922년 말까지 흩어졌다. 징발 폐지와 현물세 도입은 신경제정책(네프)의 첫걸음이 되었다.',
            en: 'The main insurgent forces in Tambov were broken in the summer of 1921, and the Antonov brothers were killed in a shoot-out with the Cheka in June 1922; the last bands in Western Siberia had dispersed by the end of 1922. The end of requisitioning and the tax in kind became the first step of the New Economic Policy (NEP).',
        },
        locations: [
            ['탐보프', 'Tambov', 52.72, 41.45, 'main'],
            ['라스카조보', 'Rasskazovo', 52.66, 41.88, 'place'],
            ['이심', 'Ishim', 56.11, 69.49, 'place'],
            ['토볼스크', 'Tobolsk', 58.2, 68.25, 'place'],
            ['부줄루크', 'Buzuluk', 52.79, 52.26, 'place'],
            ['사마라', 'Samara', 53.2, 50.15, 'place'],
        ],
        countries: ['russia', 'soviet'],
        relations: { parent: 'civil-war', related: ['kronstadt-1921', 'new-economic-policy', 'volga-famine'] },
        // Historians and officials who share a surname with other cards, and the
        // Boguslavsky prefix read as Bo Gu.
        noAutoLink: ['보구', '글루시코', 'Glushko', 'Bobkov', '라브로프', 'Lavrov', 'Pavlov', '명령 제1호', 'Order No. 1'],
        sides: [
            { id: 'soviet-forces', label: { ko: '소비에트 정부·붉은 군대', en: 'The Soviet government and the Red Army' } },
            { id: 'peasant-insurgents', label: { ko: '농민 봉기군', en: 'Peasant insurgents' } },
        ],
    },
];

const RANK = ['leader', 'executor', 'participant', 'target', 'witness', 'historian'];
const OVERRIDES = {
    'finland-1917-1920': {
        'nikolai-yudenich': { 6: 'russian-whites' },
        'alexander-kolchak': { 6: 'russian-whites' },
        'kaarlo-juho-stahlberg': { 6: 'finnish-republic' },
        'vaino-tanner': { 6: 'finnish-republic' },
        'vaino-voionmaa': { 6: 'finnish-republic' },
    },
};

const events = FRAMES.filter(f => fs.existsSync(path.join(__dirname, f.id, 'sec.js'))).map(frame => {
    const part = require(`./${frame.id}/sec`);
    const people = [];
    for (const row of part.people) {
        const seen = people.find(p => p[0] === row[0]);
        if (!seen) { people.push([...row]); continue; }
        if (RANK.indexOf(row[1]) < RANK.indexOf(seen[1])) seen[1] = row[1];
        if (!seen[4].includes(row[4])) { seen[4] += ' ' + row[4]; seen[5] += ' ' + row[5]; }
    }
    for (const row of people) Object.assign(row, (OVERRIDES[frame.id] || {})[row[0]] || {});
    const timeline = [...part.timeline].sort((x, y) => x[0].localeCompare(y[0]));
    return buildEvent({ ...frame, sections: part.sections, timeline, people, noAutoLink: frame.noAutoLink || [] });
});

module.exports = { events, ORIGINAL };
