#!/usr/bin/env node
// 1905년 혁명에 제국 변경(발트·폴란드·핀란드·캅카스) 절, 연표, 지도 위치, 출처를 더한다.
// node build.js → ../revolution-1905-periphery-20261002.json (apply-event-text-fixes.js 형식)
const fs = require('fs');
const path = require('path');
const read = name => JSON.parse(fs.readFileSync(path.join(__dirname, name), 'utf8'));
const EVENT = 'revolution-1905';

const sectionKo = `## 제국의 변경에서: 발트에서 캅카스까지

1905년은 수도의 혁명만이 아니었다. 러시아화 정책과 민족 차별이 계급 착취와 겹친 제국의 변경에서 혁명은 오히려 더 넓고 격렬하게 번졌고, 진압도 그만큼 잔혹했다.

가장 거센 곳은 라트비아였다. 이곳에서는 소수의 발트 독일인 귀족이 대토지를 쥐고 라트비아인·에스토니아인 농민과 노동자를 지배하고 있었다. 피의 일요일 소식이 닿자 리가에서 총파업이 시작됐고, 1월 26일 라트비아 사회민주노동당이 이끈 시위대가 다우가바강 둑에서 군대의 일제사격을 받았다. 사망자는 자료에 따라 56명에서 130명까지 엇갈리며, 얼어붙은 강에 빠져 죽은 이들도 있었다. 가을이 되자 혁명은 농촌으로 옮겨 갔다. 12월까지 라트비아 교구의 94%인 470곳에서 혁명 행동위원회가 지방 행정을 대신했고, 지주 저택 400여 곳이 불탔다. 12월 13~15일 투쿰스에서는 약 3,000명의 농민과 농업 노동자가 무장봉기에 나섰다가 포격 끝에 진압돼 약 120명이 죽었다. 리가 근처 소작농의 아들로 열여섯 살에 무기를 든 얀 베르진도 이 싸움에서 혁명가가 됐다.

에스토니아에서는 10월 29일 탈린의 신시장 광장에서 군대가 8,000~1만 명의 군중에게 발포해 94명이 죽었다. 12월 타르투에 모인 전국 대표자회의는 단일한 에스토니아 자치 행정구역을 요구한 온건파와, 납세 거부와 지주·교회 토지의 분배를 외친 급진파로 곧바로 갈라졌다. 그달 북부 에스토니아에서는 110여 곳의 지주 저택이 불탔다. 리투아니아의 혁명은 덜 폭력적이었지만 정치적으로 중요했다. 12월 4~5일 약 2,000명이 모인 빌뉴스 대의회는 차르 정부를 리투아니아의 주적으로 규정하고, 민족 지역의 자치와 모국어 교육, 성별·종교·민족을 가리지 않는 보통선거를 요구했다.

폴란드 왕국에서는 1월 바르샤바 총파업이 90~100명의 사망자를 낳았고, 학생들은 러시아어 수업을 거부하는 학교 파업에 들어가 1905년 10월 사립 폴란드어 학교를 허용받았다. 6월 22~24일 우치에서는 노동자들이 약 100개의 바리케이드를 쌓았다. 공식 집계로만 151명이 죽었고, 폴란드인·유대인·독일인 노동자가 함께 쓰러졌다. 11월 정부는 폴란드 왕국 전역에 계엄령을 선포했고, 페테르부르크 소비에트는 이에 항의해 두 번째 총파업을 벌였다. 12월에는 로자 룩셈부르크가 바르샤바로 잠입해 혁명에 합류했다.

자치 대공국 핀란드의 대응은 달랐다. 10월 30일부터 11월 6일까지 이어진 대파업에 밀려 차르는 11월 4일 러시아화 조치를 거두는 선언을 내놓았다. 1906년 개혁으로 핀란드는 단원제 의회와 보통·평등 선거를 얻었고, 여성도 투표권과 피선거권을 함께 얻었다. 유럽에서 처음이었다. 1905년 혁명이 제국 안에서 남긴 가장 온전한 제도적 성과는 수도가 아니라 이 변경에서 나왔다.

캅카스에서는 1904년 12월 바쿠 총파업이 러시아 노동운동 최초로 꼽히는 단체협약을 얻어 내며 혁명의 서막을 열었다. 그루지야 서부의 구리아에서는 1902년 방목권 분쟁에서 시작된 농민운동이 차르 관리를 몰아내고 스스로 다스리는 「구리아 공화국」으로 자랐다. 1906년 초 정부는 20개 대대와 대포를 보내 3월까지 이를 해체했다. 1905년부터는 바쿠와 나흐치반, 슈샤에서 아르메니아인과 아제르바이잔인 사이의 유혈 충돌이 번져 수천 명이 죽었다. 혁명이 민족 갈등으로 비틀려 터진 사례였다.

변경의 진압은 군법회의와 징벌 원정대가 맡았다. 라트비아 측 집계로는 재판 없이 처형된 사람만 2,000명이 넘고, 2,600여 명이 시베리아로 보내졌으며, 약 5,000명이 망명했다. 에스토니아에서도 1906년 한 해에 징벌대가 300명 넘게 재판 없이 총살했다. 이때 망명하거나 감옥과 유형을 거친 라트비아·에스토니아 혁명가들은 12년 뒤 1917년의 무대에 다시 섰다.`;

const sectionEn = `## On the Empire's Edges: From the Baltic to the Caucasus

1905 was not only a revolution of the capitals. On the empire's periphery, where Russification and national discrimination were layered on top of class exploitation, the revolution spread wider and burned hotter, and the repression was crueller to match.

It was fiercest in Latvia, where a small Baltic German nobility held the great estates and ruled over Latvian and Estonian peasants and workers. When news of Bloody Sunday arrived, Riga went on general strike, and on 26 January troops fired volleys into a demonstration led by the Latvian Social Democratic Workers' Party on the bank of the Daugava. Accounts of the dead range from 56 to 130; some drowned in the frozen river. In the autumn the revolution moved to the countryside. By December revolutionary action committees had replaced local government in 470 parishes, 94 per cent of the parishes in Latvia, and more than 400 manor houses had been burned. On 13–15 December some 3,000 peasants and rural workers rose in arms at Tukums and were put down by artillery, at a cost of about 120 lives. Yan Berzin, the son of farm labourers near Riga, took up arms at sixteen and became a revolutionary in this fighting.

In Estonia, on 29 October, troops fired on a crowd of 8,000 to 10,000 in Tallinn's New Market square, killing 94. The all-Estonian congress that met in Tartu in December split at once between moderates, who asked for a single autonomous Estonian province, and radicals, who called for tax refusal and the distribution of manor and church land. That month more than 110 manor houses were burned in northern Estonia. In Lithuania the revolution was less violent but politically significant. On 4–5 December the Great Seimas of Vilnius, some 2,000 strong, named the tsarist government Lithuania's chief enemy and demanded autonomy for the Lithuanian lands, schooling in the native language, and universal suffrage regardless of sex, religion, or nationality.

In the Kingdom of Poland the January general strike in Warsaw left 90 to 100 dead, and students went on a school strike against Russian-language teaching, winning permission for private Polish-language schools in October 1905. On 22–24 June the workers of Łódź threw up about a hundred barricades; the official count alone was 151 dead, Polish, Jewish, and German workers among them. In November the government placed the whole kingdom under martial law, and the Petersburg Soviet answered with its second general strike. In December Rosa Luxemburg slipped into Warsaw to join the revolution.

The autonomous Grand Duchy of Finland took another road. Forced by the Great Strike of 30 October to 6 November, the tsar issued a manifesto on 4 November reversing the Russification measures. The reform of 1906 gave Finland a single-chamber parliament elected by universal and equal suffrage, with women gaining both the vote and the right to stand at the same time, the first in Europe. The most complete institutional gain the revolution won anywhere in the empire came not in the capital but on this edge.

In the Caucasus the Baku general strike of December 1904 had already opened the revolution, winning what is counted as the first collective agreement in the Russian labour movement. In Guria, in western Georgia, a peasant movement that began in 1902 as a dispute over grazing rights drove out tsarist officials and grew into the self-governing "Gurian Republic". In early 1906 the government sent twenty battalions and artillery and dismantled it by March. From 1905 bloody clashes between Armenians and Azerbaijanis spread through Baku, Nakhchivan, and Shusha, killing thousands, a revolution twisted into ethnic conflict.

On the periphery the repression was left to courts-martial and punitive expeditions. By Latvian counts more than 2,000 people were executed without trial, some 2,600 were sent to Siberia, and about 5,000 emigrated. In Estonia punitive squads shot more than 300 people without trial in 1906 alone. The Latvian and Estonian revolutionaries who went into exile, prison, or banishment would return to the stage twelve years later, in 1917.`;

const point = (lat, lng, ko, en) => ({ lat, lng, kind: 'point', label: { ko, en } });
const entry = (date, titleKo, titleEn, bodyKo, bodyEn, geo) => ({
    ...(geo ? { geo } : {}), body: { ko: bodyKo, en: bodyEn }, date, title: { ko: titleKo, en: titleEn },
});
// 새 연표 항목: 앞에 올 기존 항목의 date를 키로 둔다.
const inserts = [
    ['1905.01.22', entry('1905.01.26', '리가 다우가바강 둑의 발포', 'Shooting on the Daugava embankment in Riga',
        '피의 일요일 소식에 리가가 총파업에 들어갔고, 라트비아 사회민주노동당이 이끈 시위대에 군대가 발포했다. 사망자는 자료에 따라 56~130명으로 엇갈린다.',
        'Riga struck at the news of Bloody Sunday, and troops fired on a demonstration led by the Latvian Social Democratic Workers’ Party. Accounts of the dead range from 56 to 130.',
        point(56.95, 24.11, '리가', 'Riga'))],
    ['1905.06.27', entry('1905.06.22–24', '우치 봉기', 'The Łódź insurrection',
        '폴란드 왕국의 섬유 도시 우치에서 노동자들이 약 100개의 바리케이드를 쌓고 군대와 싸웠다. 공식 집계로만 151명이 죽었다.',
        'In the textile city of Łódź in the Kingdom of Poland, workers built about a hundred barricades and fought the army. The official count alone was 151 dead.',
        point(51.78, 19.45, '우치', 'Łódź'))],
    ['1905.10.26', entry('1905.10.29', '탈린 신시장 광장의 발포', 'Shooting in Tallinn’s New Market square',
        '총파업 중 탈린 신시장 광장에 모인 8,000~1만 명의 군중에게 군대가 발포해 94명이 죽었다.',
        'During the general strike, troops fired on a crowd of 8,000 to 10,000 in Tallinn’s New Market square, killing 94.',
        point(59.44, 24.75, '탈린', 'Tallinn'))],
    ['1905.10.30', entry('1905.10.30–11.06', '핀란드 대파업', 'The Finnish Great Strike',
        '핀란드 대공국 전역의 총파업에 밀려 차르가 11월 4일 러시아화 조치를 거두는 선언을 냈다. 이듬해 개혁으로 핀란드는 보통선거 단원제 의회와 유럽 최초의 여성 참정권을 얻었다.',
        'A general strike across the Grand Duchy forced the tsar to issue a manifesto on 4 November reversing the Russification measures. The next year’s reform gave Finland a single-chamber parliament elected by universal suffrage and Europe’s first full women’s suffrage.',
        point(60.17, 24.94, '헬싱키', 'Helsinki'))],
    ['1905.11.21', entry('1905.12.04–05', '빌뉴스 대의회', 'The Great Seimas of Vilnius',
        '약 2,000명이 모인 리투아니아 대의회가 차르 정부를 주적으로 규정하고 자치와 모국어 교육, 보통선거를 요구했다.',
        'Some 2,000 people gathered in a Lithuanian assembly that named the tsarist government the chief enemy and demanded autonomy, native-language schooling, and universal suffrage.',
        point(54.69, 25.28, '빌뉴스', 'Vilnius'))],
    ['1905.12.04–05', entry('1905.12.13–15', '투쿰스 무장봉기', 'The Tukums armed uprising',
        '지주 저택 방화와 행동위원회로 번진 라트비아 농촌 봉기의 정점에서 약 3,000명이 투쿰스를 장악했다가 포격 끝에 진압됐다. 약 120명이 죽었다.',
        'At the height of the Latvian rural rising of manor burnings and action committees, some 3,000 people took Tukums before being put down by artillery. About 120 died.',
        point(56.97, 23.15, '투쿰스', 'Tukums'))],
    ['1905.12.20–31', entry('1905.12–1906', '발트 지방의 징벌 원정', 'Punitive expeditions in the Baltic provinces',
        '징벌 원정대와 군법회의가 라트비아·에스토니아 농촌을 휩쓸었다. 라트비아 측 집계로 재판 없이 처형된 사람이 2,000명을 넘고 약 5,000명이 망명했다.',
        'Punitive expeditions and courts-martial swept the Latvian and Estonian countryside. By Latvian counts more than 2,000 people were executed without trial and about 5,000 emigrated.')],
    ['1905.12–1906', entry('1906.03', '구리아 공화국의 해체', 'The end of the Gurian Republic',
        '1902년부터 차르 관리를 몰아내고 스스로 다스리던 그루지야 서부 구리아의 농민 자치가 20개 대대와 대포를 앞세운 진압군에 해체됐다.',
        'The peasant self-government of Guria in western Georgia, which had driven out tsarist officials since 1902, was dismantled by a force of twenty battalions with artillery.',
        point(41.93, 42.00, '오주르게티 (구리아)', 'Ozurgeti (Guria)'))],
];

const beforeTimeline = read('before-timeline.json');
const timeline = [...beforeTimeline];
for (const [after, item] of inserts) {
    const i = timeline.findIndex(e => e.date === after);
    if (i < 0) throw new Error(`no timeline entry ${after}`);
    timeline.splice(i + 1, 0, item);
}

const beforeLocations = read('before-locations.json');
const locations = [...beforeLocations,
    { lat: 56.95, lng: 24.11, label: { ko: '리가', en: 'Riga' } },
    { lat: 52.23, lng: 21.01, label: { ko: '바르샤바', en: 'Warsaw' } },
    { lat: 60.17, lng: 24.94, label: { ko: '헬싱키', en: 'Helsinki' } },
    { lat: 41.93, lng: 42.00, label: { ko: '구리아', en: 'Guria' } },
];

const beforeSources = read('before-sources.json');
const sources = [...beforeSources,
    'https://lv.wikipedia.org/wiki/1905._gada_revolūcija_Latvijā',
    'https://lv.wikipedia.org/wiki/Tukuma_bruņotā_sacelšanās',
    'https://et.wikipedia.org/wiki/1905._aasta_revolutsioon_Eestis',
    'https://en.wikipedia.org/wiki/Great_Seimas_of_Vilnius',
    'https://en.wikipedia.org/wiki/Łódź_insurrection_(1905)',
    'https://pl.wikipedia.org/wiki/Rewolucja_1905_roku_w_Królestwie_Polskim',
    'https://pl.wikipedia.org/wiki/Strajk_szkolny_(1905)',
    'https://fi.wikipedia.org/wiki/Vuoden_1905_suurlakko',
    'https://en.wikipedia.org/wiki/Gurian_Republic',
    'https://en.wikipedia.org/wiki/Armenian–Tatar_massacres_of_1905–1907',
    'https://ru.wikipedia.org/wiki/Бакинская_стачка_1904_года',
];

const spec = {
    id: 'revolution-1905-periphery-20261002',
    changes: [
        { event: EVENT, column: 'body_ko', from: '\n\n## 올가미와 선거법:', to: `\n\n${sectionKo}\n\n## 올가미와 선거법:` },
        { event: EVENT, column: 'body_en', from: '\n\n## The Noose and the Electoral Law:', to: `\n\n${sectionEn}\n\n## The Noose and the Electoral Law:` },
        { event: EVENT, column: 'summary_ko', from: '농민 봉기가 결합한 차르 전제에 대한', to: '농민 봉기가 결합해 발트·폴란드·핀란드·캅카스까지 번진, 차르 전제에 대한' },
        { event: EVENT, column: 'summary_en', from: 'and peasant risings.', to: 'and peasant risings, and reaching from the capitals to the Baltic, Poland, Finland, and the Caucasus.' },
        { event: EVENT, column: 'timeline', expected: beforeTimeline, value: timeline },
        { event: EVENT, column: 'locations', expected: beforeLocations, value: locations },
        { event: EVENT, column: 'sources', expected: beforeSources, value: sources },
    ],
};
fs.writeFileSync(path.join(__dirname, '..', `${spec.id}.json`), JSON.stringify(spec, null, 2) + '\n');
console.log(`timeline ${beforeTimeline.length} → ${timeline.length}, locations ${beforeLocations.length} → ${locations.length}, sources ${beforeSources.length} → ${sources.length}`);
