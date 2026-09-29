#!/usr/bin/env node
// Founding of the Communist International event batch (2026-09-29). Source of truth for
// ../comintern-founding-20260929.json (event + relations) and
// ../comintern-founding-20260929-people.json (new people for commulingo-people-upsert).
// Edit here, run `node build.js`, commit the JSON with it.
const fs = require('fs');
const path = require('path');

const W = t => 'https://en.wikipedia.org/wiki/' + t;
const M = p => 'https://www.marxists.org/' + p;
const S = {
    ci: W('Communist_International'),
    first: W('1st_Congress_of_the_Comintern'),
    firstDocs: M('history/international/comintern/1st-congress/index.htm'),
    eberlein: W('Hugo_Eberlein'),
    platten: W('Fritz_Platten'),
    ecci: W('Executive_Committee_of_the_Communist_International'),
    hungary: W('Hungarian_Soviet_Republic'),
    lwc: M('archive/lenin/works/1920/lwc/index.htm'),
    lwcWiki: W('%22Left-Wing%22_Communism:_An_Infantile_Disorder'),
    second: W('2nd_World_Congress_of_the_Comintern'),
    polish: W('Polish%E2%80%93Soviet_War'),
    conditions: W('Twenty-one_Conditions'),
    conditionsText: M('history/international/comintern/2nd-congress/ch07.htm'),
    conditionsDoc: 'https://cyber-lenin.com/commulingo/docs/comintern-21-conditions',
    colonial: M('archive/lenin/works/1920/jun/05.htm'),
    roy: W('M._N._Roy'),
    baku: W('Congress_of_the_Peoples_of_the_East'),
    uspd: W('Independent_Social_Democratic_Party_of_Germany'),
    tours: W('Tours_Congress'),
    cachin: W('Marcel_Cachin'),
    pci: W('Italian_Communist_Party'),
    serrati: W('Giacinto_Menotti_Serrati'),
    march: W('March_Action'),
    levi: W('Paul_Levi'),
    third: W('3rd_World_Congress_of_the_Comintern'),
    unitedFront: W('United_front'),
    profintern: W('Red_International_of_Labour_Unions'),
};

const sections = [
    {
        heading: { ko: '새 인터내셔널의 요구', en: 'The call for a new International' },
        paragraphs: [
            {
                ko: '레닌은 1914년 8월 대다수 사회주의 정당이 전쟁공채에 찬성한 것을 「사회주의에 대한 완전한 배신」으로 보고, 그해 가을부터 제2인터내셔널이 죽었으니 제3인터내셔널을 세워야 한다고 주장했다. 치머발트와 킨탈의 반전 회의에서 형성된 치머발트 좌파는 새 인터내셔널의 사상적 기초가 되었다. 볼셰비키에게 1917년 10월 혁명은 세계 혁명의 첫 막이었고, 유럽 노동자가 뒤따르려면 개량주의 「배신자」를 걸러 낸 새 조직이 필요했다.',
                en: 'Lenin saw the socialist parties’ votes for war credits in August 1914 as a “sheer betrayal of socialism” and from that autumn declared the Second International dead and called for a Third. The Zimmerwald Left formed at the anti-war conferences of Zimmerwald and Kienthal laid its ideological foundations. For the Bolsheviks the October Revolution of 1917 was the first act of a world revolution, and for European workers to follow they needed a new organisation purged of reformist “traitors”.',
                sources: [S.ci],
            },
            {
                ko: '1918년 가을 독일과 오스트리아에서 제정이 무너지고 평의회가 들어서자 볼셰비키는 세계 혁명이 임박했다고 믿었다. 1919년 1월 24일 모스크바는 39개 공산당과 혁명 그룹을 초청하는 편지를 무선으로 보냈다. 2월 초 베른에서 개량주의 사회주의자들이 제2인터내셔널을 되살리려는 회의를 열기 전에 선수를 치려는 것이었다.',
                en: 'When the monarchies fell in Germany and Austria in autumn 1918 and councils took power, the Bolsheviks believed world revolution imminent. On 24 January 1919 Moscow sent by wireless a letter inviting thirty-nine communist parties and revolutionary groups — timed to pre-empt the conference in Bern in early February where reformist socialists tried to revive the Second International.',
                sources: [S.ci, S.first],
            },
        ],
    },
    {
        heading: { ko: '1919년 3월 창립 대회', en: 'The founding congress of March 1919' },
        paragraphs: [
            {
                ko: '1919년 3월 2일 크렘린에서 대회가 열렸다. 연합국의 봉쇄로 51명의 대표 가운데 해외에서 온 사람은 9명뿐이었고, 나머지는 러시아에 머물던 사람들이었으며 다수는 정식 위임장이 없었다. 독일 공산당 대표 후고 에벌라인은 새 인터내셔널을 서둘러 세우면 볼셰비키가 지배하게 된다는 룩셈부르크의 우려에 따라 즉시 창립에 반대하라는 지시를 받고 왔다. 3월 4일 대회는 에벌라인의 기권 속에 압도적 다수로 제3인터내셔널 창립을 의결했다. 스위스의 프리츠 플라텐은 의장단에 앉았다.',
                en: 'The congress opened in the Kremlin on 2 March 1919. Because of the Allied blockade only nine of the fifty-one delegates came from abroad; the rest lived in Soviet Russia and many lacked proper credentials. Hugo Eberlein, the German Communist Party’s delegate, came mandated to oppose immediate founding, reflecting Luxemburg’s fear that a premature International would be dominated by the Bolsheviks. On 4 March the congress voted overwhelmingly, with Eberlein abstaining, to found the Third International. The Swiss Fritz Platten sat on the presidium.',
                sources: [S.ci, S.first, S.eberlein, S.platten],
            },
            {
                ko: '대회의 핵심 문서는 트로츠키가 쓴 「전 세계 프롤레타리아에게 보내는 선언」이었다. 선언은 소비에트를 노동계급 단결의 도구로 내세우고, 「부르주아 민주주의」를 거부하며 프롤레타리아 독재를 재확인했다. 규약은 채택되지 않았고, 그리고리 지노비예프를 의장으로 하는 집행위원회가 선출되었다. 외국 정당의 자리도 마련되었지만 러시아 혁명의 권위와 외국 정당들의 약세로 볼셰비키가 주도했다.',
                en: 'The congress’s principal document was Trotsky’s “Manifesto to the Proletariat of the Entire World”, which put forward soviets as the instrument of working-class unity, dismissed “bourgeois democracy” and reaffirmed the dictatorship of the proletariat. No statutes were adopted, but an Executive Committee was elected with Grigory Zinoviev as president. Places were provided for foreign parties, but the prestige of the Russian Revolution and the weakness of the foreign parties left the Bolsheviks in charge.',
                sources: [S.ci, S.firstDocs, S.ecci],
            },
            {
                ko: '창립 직후인 3월 21일 헝가리에서 쿤 벨러의 평의회 공화국이 섰고, 4월에는 바이에른 평의회 공화국이 선포되었다. 그러나 둘 다 여름을 넘기지 못했다. 카우츠키가 볼셰비키 독재를 비판하자 레닌은 「프롤레타리아 민주주의는 어떤 부르주아 민주주의보다 백만 배 더 민주적」이라고 반박했다.',
                en: 'Soon after the founding, Béla Kun’s Soviet Republic was proclaimed in Hungary on 21 March, and a Bavarian Soviet Republic in April, but neither survived the summer. When Kautsky condemned the Bolshevik dictatorship, Lenin replied that “proletarian democracy is a million times more democratic than any bourgeois democracy”.',
                sources: [S.hungary, S.ci],
            },
        ],
    },
    {
        heading: { ko: '제2차 대회와 21개 가입 조건', en: 'The Second Congress and the Twenty-one Conditions' },
        paragraphs: [
            {
                ko: '1920년 4월 레닌은 『공산주의에서의 「좌익」 소아병』에서 러시아 혁명의 「근본 특징」이 국제적 의미를 가진다고 쓰고, 의회와 개량주의 노조 참여를 거부하는 서유럽 좌익 공산주의자들을 비판했다. 1920년 7월 19일부터 8월 7일까지 페트로그라드와 모스크바에서 열린 제2차 대회는 사실상의 창립 대회로 여겨진다. 대표들은 봉쇄와 내전을 뚫고 몇 주씩 걸려 왔고, 대회는 붉은 군대가 바르샤바로 진격하던 때에 열렸다.',
                en: 'In “Left-Wing” Communism: An Infantile Disorder (April 1920) Lenin wrote that certain “fundamental features” of the Russian Revolution had international significance, and criticised Western left communists who refused to work in parliaments and reformist unions. The Second Congress, held in Petrograd and Moscow from 19 July to 7 August 1920, is considered the true founding congress. Delegates travelled for weeks through blockade and civil war, and the congress met as the Red Army advanced on Warsaw.',
                sources: [S.lwc, S.lwcWiki, S.ci, S.polish],
            },
            {
                ko: '대회는 지노비예프가 레닌의 지도 아래 초안을 쓴 「21개 가입 조건」을 채택했다. 개량주의자와 중도파를 모든 책임 있는 자리에서 몰아낼 것, 합법·비합법 활동을 결합할 것, 카우츠키와 맥도널드 같은 인물과 완전히 절연할 것, 노조 안에 공산주의 세포를 만들 것, 철의 규율의 민주집중제, 모든 소비에트 공화국에 대한 무조건 지지, 당명을 「공산당」으로 바꿀 것이 요구되었다. 제16조는 대회와 집행위원회의 결정이 모든 당을 구속한다고 정했다.',
                en: 'The congress adopted the “Twenty-one Conditions” for admission, drafted mainly by Zinoviev under Lenin’s guidance. Parties had to remove reformists and centrists from every responsible post, combine legal and illegal work, break completely with figures such as Kautsky and MacDonald, form communist cells in the unions, adopt democratic centralism with iron discipline, support every Soviet republic unconditionally and call themselves “Communist Party”. Point sixteen made the decisions of congresses and the Executive binding on all parties.',
                sources: [S.conditions, S.conditionsText, S.conditionsDoc, S.ci],
            },
            {
                ko: '대회는 또 인도의 공산주의자 M. N. 로이와의 토론을 거쳐 레닌의 민족·식민지 문제 테제를 채택했다. 식민지에서는 공산주의자가 프롤레타리아 운동의 독립성을 지키는 조건으로 「부르주아 민주주의적」 민족주의 세력과 일시적으로 동맹할 수 있다는 것이었다. 9월 바쿠에서 열린 동방 민족 대회에는 1,891명이 모였고, 지노비예프는 영국 제국주의에 맞선 「성전」을 호소했다.',
                en: 'After debate with the Indian communist M. N. Roy the congress also adopted Lenin’s theses on the national and colonial questions: in the colonies communists could ally temporarily with “bourgeois-democratic” nationalist forces provided the proletarian movement kept its independence. At the Congress of the Peoples of the East in Baku that September, 1,891 delegates gathered and Zinoviev called for a “holy war” against British imperialism.',
                sources: [S.colonial, S.roy, S.baku, S.ci],
            },
        ],
    },
    {
        heading: { ko: '할레·투르·리보르노: 유럽 사회주의의 분열', en: 'Halle, Tours, Livorno: the split of European socialism' },
        paragraphs: [
            {
                ko: '21개 조건은 유럽 사회주의 정당들의 평당원을 「기회주의」 지도부에서 떼어 내려는 것이었다. 1920년 10월 할레에서 독일 독립사회민주당(USPD)은 236 대 156으로 코민테른 가입을 결의하고 둘로 갈라졌다. 좌파는 12월 공산당과 합쳐 통합공산당을 만들었고, 우파는 1922년 사민당으로 돌아갔다.',
                en: 'The Twenty-one Conditions were meant to split the rank and file of Europe’s socialist parties from their “opportunist” leaders. At Halle in October 1920 the German Independent Social Democrats (USPD) voted 236 to 156 to join the Comintern and broke in two; the left merged with the KPD into a united Communist party that December, while the right returned to the SPD in 1922.',
                sources: [S.uspd, S.conditions],
            },
            {
                ko: '1920년 12월 25~30일 투르에서 열린 프랑스 사회당(SFIO) 대회에서는 마르셀 카섕과 뤼도비크오스카르 프로사르, 보리스 수바린 등이 이끈 다수가 3,208표 대 1,022표로 가입을 결정해 뒷날의 프랑스 공산당을 세웠다. 레옹 블룸은 「누군가는 남아서 낡은 집을 지켜야 한다」며 소수와 함께 SFIO에 남았다. 젊은 응우옌 아이 꾸옥(호찌민)은 이 대회에서 식민지 착취를 고발하며 가입을 지지했다.',
                en: 'At the congress of the French Socialist Party (SFIO) in Tours on 25–30 December 1920, a majority led by Marcel Cachin, Ludovic-Oscar Frossard and Boris Souvarine voted 3,208 to 1,022 to join, founding what became the French Communist Party. Léon Blum stayed in the SFIO with the minority, declaring that “someone has to stay and keep the old house”. The young Nguyen Ai Quoc (Ho Chi Minh) spoke at the congress against colonial exploitation and for joining.',
                sources: [S.tours, S.cachin],
            },
            {
                ko: '이탈리아 사회당의 1921년 1월 리보르노 대회는 21개 조건이 요구한 개량주의파 축출을 거부했다. 지도자 자친토 메노티 세라티는 당의 통일을 택했다. 이에 아마데오 보르디가와 토리노 『오르디네 누오보』의 안토니오 그람시가 이끈 좌파가 1월 21일 탈당해 이탈리아 공산당을 세웠다.',
                en: 'The Italian Socialist Party’s Livorno congress of January 1921 refused to expel the reformists as the Twenty-one Conditions required; its leader Giacinto Menotti Serrati chose party unity. The left under Amadeo Bordiga and Antonio Gramsci of Turin’s L’Ordine Nuovo walked out on 21 January to found the Communist Party of Italy.',
                sources: [S.pci, S.serrati],
            },
        ],
    },
    {
        heading: { ko: '3월 행동과 「대중 속으로」', en: 'The March Action and “To the masses!”' },
        paragraphs: [
            {
                ko: '1921년 3월 독일 공산당은 프로이센령 작센의 만스펠트·로이나·할레 일대에서 봉기를 일으켰다. 「3월 행동」은 참패로 끝났다. 180명이 죽고 6천 명이 체포되었다. 2월까지 당 의장이던 파울 레비는 당의 전술을 공개 비판했다가 제명되었다.',
                en: 'In March 1921 the German Communists launched a rising in the Mansfeld, Leuna and Halle districts of Prussian Saxony. The “March Action” ended in defeat, with 180 dead and 6,000 arrested. Paul Levi, party chairman until February, publicly criticised the party’s tactics and was expelled.',
                sources: [S.march, S.levi],
            },
            {
                ko: '유럽 혁명의 물결이 가라앉자 레닌은 프롤레타리아 혁명이 당장의 과제가 아니라고 결론지었다. 1921년 6~7월 제3차 대회의 구호는 「대중 속으로!」였고, 12월 18일 집행위원회는 사민당 평당원과 함께 자본의 공세에 맞서는 「노동자 통일전선」 테제를 내놓았다. 노조 안의 공산주의 활동을 조율할 적색노동조합 인터내셔널(프로핀테른)이 1921년 7월 3일 창설되었다.',
                en: 'As the revolutionary wave in Europe subsided, Lenin concluded that proletarian revolution was no longer on the immediate agenda. The slogan of the Third Congress of June–July 1921 was “To the masses!”, and on 18 December the Executive issued theses on the “united workers’ front” — joint defensive struggles with socialist rank-and-file against the capitalist offensive. The Red International of Labour Unions (Profintern), to co-ordinate communist work in the unions, was founded on 3 July 1921.',
                sources: [S.ci, S.third, S.unitedFront, S.profintern],
            },
        ],
    },
    {
        heading: { ko: '모스크바의 권위와 그 대가', en: 'Moscow’s authority and its price' },
        paragraphs: [
            {
                ko: '규약은 세계 대회를 최고 기관으로, 집행위원회를 대회 사이의 지도 기관으로 정했지만, 집행위원회의 일은 주로 본부가 있는 나라의 당, 곧 러시아 공산당이 맡았다. 러시아 당은 표결권 있는 대표 5명을, 다른 큰 당들은 1명씩을 두었다. 1921년부터 국제연락부가 소련 국고의 자금으로 각국 당과 비밀 활동을 지원하면서 각국 당은 경제적으로도 모스크바에 의존하게 되었다.',
                en: 'The statutes made the world congress the supreme body and the Executive the leading body between congresses, but the Executive’s work fell mainly to the party of the host country, the Russian Communist Party, which had five voting representatives to one for each other major party. From 1921 the International Liaison Department funded foreign parties and clandestine work from the Soviet treasury, making the parties economically dependent on Moscow as well.',
                sources: [S.ci, S.ecci],
            },
            {
                ko: '그래도 레닌 시대의 코민테른에는 뒷날 없던 논쟁의 여지가 있었다. 레비나 보르디가처럼 모스크바의 지시에 순응하지 않는 지도자들이 있었고, 각국 당은 지시를 거부하거나 달리 해석하기도 했다. 코민테른의 창설은 국제 노동운동의 공산주의와 사회민주주의 분열을 제도로 굳혔고, 그 분열은 20세기 내내 이어졌다.',
                en: 'Even so, the Comintern of Lenin’s time left room for debate that later vanished. Leaders such as Levi and Bordiga were not docile, and national parties resisted or reinterpreted Moscow’s directives. The founding of the Comintern institutionalised the split of the international labour movement between communism and social democracy, a split that lasted through the twentieth century.',
                sources: [S.ci],
            },
        ],
    },
];

const P = (lat, lng, ko, en) => ({ kind: 'point', lat, lng, label: { ko, en } });
const timeline = [
    ['1919.01.24', '창립 대회 초청장', 'Letter of invitation', '모스크바가 39개 공산당·혁명 그룹에 무선으로 초청장을 보냈다.', 'Moscow invited thirty-nine communist parties and groups by wireless.', ['russia']],
    ['1919.02', '베른 사회주의자 회의', 'Bern socialist conference', '개량주의 사회주의자들이 제2인터내셔널 재건을 시도했다.', 'Reformist socialists tried to revive the Second International.', ['switzerland'], P(46.95, 7.45, '베른', 'Bern')],
    ['1919.03.02', '창립 대회 개막', 'Founding congress opens', '크렘린에서 51명의 대표가 모였다.', 'Fifty-one delegates met in the Kremlin.', ['russia'], P(55.752, 37.617, '모스크바 크렘린', 'Moscow Kremlin')],
    ['1919.03.04', '제3인터내셔널 창립 의결', 'Third International founded', '독일 대표 에벌라인의 기권 속에 창립이 의결되었다.', 'The founding was voted with the German delegate Eberlein abstaining.', ['russia']],
    ['1919.03.21', '헝가리 평의회 공화국', 'Hungarian Soviet Republic', '쿤 벨러의 평의회 정부가 들어섰다.', 'Béla Kun’s council government took power.', ['hungary'], P(47.5, 19.04, '부다페스트', 'Budapest')],
    ['1920.04', '『「좌익」 소아병』', '“Left-Wing” Communism', '레닌이 볼셰비즘의 국제적 의미와 좌익 공산주의 비판을 폈다.', 'Lenin argued Bolshevism’s international significance and criticised left communism.', ['russia']],
    ['1920.07.19', '제2차 대회 개막', 'Second Congress opens', '페트로그라드에서 개막해 모스크바에서 이어졌다.', 'It opened in Petrograd and continued in Moscow.', ['russia'], P(59.94, 30.31, '페트로그라드', 'Petrograd')],
    ['1920.08', '21개 가입 조건', 'Twenty-one Conditions', '가입 정당에 개량주의자 축출과 민주집중제를 요구했다.', 'Member parties were required to purge reformists and adopt democratic centralism.', ['russia']],
    ['1920.09', '바쿠 동방 민족 대회', 'Baku Congress of the Peoples of the East', '1,891명의 대표가 제국주의에 맞선 연대를 호소했다.', '1,891 delegates called for unity against imperialism.', ['azerbaijan'], P(40.41, 49.87, '바쿠', 'Baku')],
    ['1920.10', '할레 대회', 'Halle congress', 'USPD가 가입을 결의하고 분열했다.', 'The USPD voted to join and split.', ['germany'], P(51.48, 11.97, '할레', 'Halle')],
    ['1920.12.25', '투르 대회', 'Tours congress', 'SFIO 다수가 가입해 프랑스 공산당의 기원이 되었다.', 'The SFIO majority joined, founding the French Communist Party.', ['france'], P(47.39, 0.69, '투르', 'Tours')],
    ['1921.01.21', '이탈리아 공산당 창당', 'Communist Party of Italy founded', '리보르노 대회에서 좌파가 사회당을 떠났다.', 'The left walked out of the Socialist congress at Livorno.', ['italy'], P(43.55, 10.31, '리보르노', 'Livorno')],
    ['1921.03', '3월 행동', 'March Action', '독일 공산당의 봉기가 참패하고 레비가 제명되었다.', 'The German Communist rising failed and Levi was expelled.', ['germany']],
    ['1921.06', '제3차 대회', 'Third Congress', '「대중 속으로!」를 구호로 내걸었다.', 'It adopted the slogan “To the masses!”', ['russia']],
    ['1921.12.18', '통일전선 테제', 'United front theses', '집행위원회가 노동자 통일전선 전술을 채택했다.', 'The Executive adopted the tactic of the united workers’ front.', ['russia']],
].map(([date, tko, ten, bko, ben, country, geo]) => ({
    date, title: { ko: tko, en: ten }, body: { ko: bko, en: ben }, country, ...(geo ? { geo } : {}),
}));

const people = [
    ['lenin', 'leader', '코민테른 창설자', 'Founder of the Comintern', '제3인터내셔널을 주창하고 21개 조건과 식민지 테제를 이끌었다.', 'Called for the Third International and guided the Twenty-one Conditions and the colonial theses.'],
    ['zinoviev', 'leader', '집행위원회 초대 의장', 'First president of the Executive Committee', '21개 조건의 초안을 쓰고 바쿠 대회에서 기조 연설을 했다.', 'Drafted the Twenty-one Conditions and gave the keynote at Baku.'],
    ['trotsky', 'leader', '창립 선언 집필', 'Author of the founding manifesto', '「전 세계 프롤레타리아에게 보내는 선언」을 썼다.', 'Wrote the Manifesto to the Proletariat of the Entire World.'],
    ['bukharin', 'participant', '러시아 공산당 대표', 'Russian Communist Party delegate', '볼셰비키 대표로 창립 대회와 초기 대회에 참여했다.', 'Took part in the founding and early congresses for the Bolsheviks.'],
    ['radek', 'participant', '집행위원회 서기', 'Secretary of the Executive', '창립 대회 때는 독일 감옥에 있었고, 풀려난 뒤 1920년 집행위원회 서기를 지냈다.', 'Was in a German prison during the founding congress and after his release served as secretary of the Executive in 1920.'],
    ['angelica-balabanova', 'participant', '집행위원회 초대 서기', 'First secretary of the Executive', '창립 직후 집행위원회 서기를 맡았으나 1921년 떠났다.', 'Served as the Executive’s first secretary after the founding and left in 1921.'],
    ['christian-rakovsky', 'participant', '발칸 혁명 연맹 대표', 'Balkan Revolutionary Federation delegate', '창립 대회에 참석해 발칸 공산주의자들을 대표했다.', 'Attended the founding congress for the Balkan communists.'],
    ['hugo-eberlein', 'participant', '독일 공산당 대표', 'German Communist Party delegate', '룩셈부르크의 우려를 전하며 창립 표결에 기권했다.', 'Conveyed Luxemburg’s misgivings and abstained on the founding vote.'],
    ['fritz-platten', 'participant', '스위스 공산주의자 · 창립 대회 의장단', 'Swiss communist, founding presidium', '창립 대회 의장단에 앉았다.', 'Sat on the founding congress presidium.'],
    ['bela-kun', 'participant', '헝가리 평의회 공화국 지도자', 'Leader of the Hungarian Soviet Republic', '창립 직후 헝가리에 평의회 공화국을 세웠다.', 'Founded the Hungarian Soviet Republic just after the founding.'],
    ['mn-roy', 'participant', '식민지 문제 보충 테제', 'Supplementary colonial theses', '제2차 대회에서 레닌과 식민지 문제를 토론했다.', 'Debated the colonial question with Lenin at the Second Congress.'],
    ['john-reed', 'participant', '미국 공산주의자', 'American communist', '제2차 대회에 참석하고 바쿠에 간 뒤 1920년 모스크바에서 숨졌다.', 'Attended the Second Congress, went to Baku and died in Moscow in 1920.'],
    ['paul-levi', 'participant', '독일 공산당 의장', 'KPD chairman', '3월 행동을 공개 비판했다가 제명되었다.', 'Publicly criticised the March Action and was expelled.'],
    ['zetkin', 'participant', '독일 공산당 지도부', 'KPD leadership', '레비와 함께 3월 행동에 비판적이었으나 당에 남았다.', 'Shared Levi’s criticism of the March Action but stayed in the party.'],
    ['marcel-cachin', 'participant', '투르 대회 가입파 지도자', 'Leader of the pro-Comintern majority at Tours', 'SFIO 다수를 이끌어 프랑스 공산당을 세웠다.', 'Led the SFIO majority into founding the French Communist Party.'],
    ['ludovic-oscar-frossard', 'participant', 'SFIO 사무총장 · 프랑스 공산당 초대 서기장', 'SFIO general secretary, first PCF secretary', '투르에서 가입을 이끌었으나 1923년 당을 떠났다.', 'Led the Tours majority but left the party in 1923.'],
    ['boris-souvarine', 'participant', '투르 대회 가입파', 'Pro-Comintern leader at Tours', '가입파를 이끌고 뒤에 집행위원회에서 일했다.', 'Led the pro-Comintern faction and later sat on the Executive.'],
    ['giacinto-menotti-serrati', 'participant', '이탈리아 사회당 지도자', 'Italian Socialist leader', '개량주의파 축출을 거부해 리보르노 분열을 낳았다.', 'Refused to expel the reformists, causing the Livorno split.'],
    ['lozovsky', 'participant', '프로핀테른 지도자', 'Profintern leader', '1921년 창설된 적색노동조합 인터내셔널을 이끌었다.', 'Led the Red International of Labour Unions founded in 1921.'],
    ['amadeo-bordiga', 'participant', '이탈리아 공산당 창립자', 'Founder of the Communist Party of Italy', '리보르노에서 좌파를 이끌고 공산당을 세웠다.', 'Led the left out at Livorno and founded the Communist Party.'],
    ['gramsci', 'participant', '『오르디네 누오보』 · 이탈리아 공산당 창립', 'L’Ordine Nuovo, co-founder of the PCd’I', '토리노 공장평의회 운동을 이끌고 공산당 창당에 참여했다.', 'Led the Turin factory councils and co-founded the Communist Party.'],
    ['karl-kautsky', 'witness', '볼셰비키 독재 비판자', 'Critic of the Bolshevik dictatorship', '『프롤레타리아 독재』로 볼셰비키를 비판해 레닌과 논쟁했다.', 'Attacked the Bolsheviks in The Dictatorship of the Proletariat and clashed with Lenin.'],
].map(([person_id, relation_kind, relation_ko, relation_en, note_ko, note_en], sort_order) => ({
    person_id, sort_order, relation_kind, relation_ko, relation_en, note_ko, note_en,
}));

const sources = [];
for (const s of sections) for (const p of s.paragraphs) for (const u of p.sources) if (!sources.includes(u)) sources.push(u);
const body = lang => sections.map(s => '## ' + s.heading[lang] + '\n\n' + s.paragraphs.map(p =>
    p[lang] + ' ' + p.sources.map(u => `[${sources.indexOf(u) + 1}](${u})`).join(' ')).join('\n\n')).join('\n\n');

const event = {
    id: 'comintern-founding-1919-1921',
    expected: null,
    fields: {
        title_ko: '코민테른의 창설',
        title_en: 'The founding of the Comintern',
        period_label: '1919–1921',
        sort_order: 43,
        question_ko: '세계 혁명을 위해 세운 공산주의 인터내셔널은 어떻게 유럽 사회주의를 둘로 가르고 모스크바 중심의 조직이 되었는가?',
        question_en: 'How did the Communist International, founded for world revolution, split European socialism in two and become an organisation centred on Moscow?',
        summary_ko: '1919년 3월 볼셰비키는 세계 혁명이 임박했다고 보고 모스크바에서 공산주의 인터내셔널(코민테른)을 창설했다. 1920년 제2차 대회는 21개 가입 조건과 민족·식민지 테제를 채택했고, 독일·프랑스·이탈리아의 사회주의 정당은 가입 여부를 두고 갈라져 공산당이 생겨났다. 1921년 3월 행동이 실패하자 코민테른은 「대중 속으로」와 통일전선으로 방향을 틀었다.',
        summary_en: 'In March 1919 the Bolsheviks, believing world revolution imminent, founded the Communist International (Comintern) in Moscow. Its Second Congress in 1920 adopted the Twenty-one Conditions and the national and colonial theses, and the socialist parties of Germany, France and Italy split over joining, giving birth to communist parties. After the failed March Action of 1921 the Comintern turned to “To the masses!” and the united front.',
        outcome_ko: '각국에 코민테른 지부인 공산당이 서고 국제 노동운동의 공산주의·사회민주주의 분열이 제도화되었다. 식민지 테제와 바쿠 대회는 아시아 공산주의 운동의 출발점이 되었다. 러시아 당의 주도와 모스크바의 재정 지원으로 각국 당의 자율성은 점점 줄었다.',
        outcome_en: 'Communist parties were founded as Comintern sections, institutionalising the split of the international labour movement between communism and social democracy. The colonial theses and the Baku congress became a starting point for communism in Asia. The Russian party’s dominance and Moscow’s funding steadily narrowed the national parties’ autonomy.',
        body_ko: body('ko'),
        body_en: body('en'),
        timeline,
        sources,
        locations: [
            { label: { ko: '모스크바 크렘린', en: 'Moscow Kremlin' }, lat: 55.752, lng: 37.617, kind: 'main' },
            { label: { ko: '페트로그라드', en: 'Petrograd' }, lat: 59.94, lng: 30.31, kind: 'place' },
            { label: { ko: '바쿠', en: 'Baku' }, lat: 40.41, lng: 49.87, kind: 'place' },
            { label: { ko: '투르', en: 'Tours' }, lat: 47.39, lng: 0.69, kind: 'place' },
            { label: { ko: '리보르노', en: 'Livorno' }, lat: 43.55, lng: 10.31, kind: 'place' },
            { label: { ko: '할레', en: 'Halle' }, lat: 51.48, lng: 11.97, kind: 'place' },
        ],
        countries: ['russia', 'germany', 'france', 'italy', 'hungary', 'azerbaijan', 'switzerland'],
        relations: { related: ['second-international-collapse-1914', 'german-revolution-1918-1919', 'october-revolution', 'first-united-front-1924-1927'] },
        no_auto_link: [],
        link_expressions: [],
        focus: null,
    },
    sections,
    people,
};

fs.writeFileSync(path.join(__dirname, '..', 'comintern-founding-20260929.json'),
    JSON.stringify({ id: 'comintern-founding-20260929', events: [event] }, null, 2) + '\n');
fs.writeFileSync(path.join(__dirname, '..', 'comintern-founding-20260929-people.json'),
    JSON.stringify({ changedBy: 'comintern-founding-20260929', people: require('./people') }, null, 2) + '\n');
console.log(`event ${event.id}: ${sections.length} sections, ${sources.length} sources, ${timeline.length} timeline, ${people.length} relations`);
