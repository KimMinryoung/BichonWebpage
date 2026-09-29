#!/usr/bin/env node
// Collapse of the Second International event batch (2026-09-29). Source of truth for
// ../second-international-collapse-20260929.json (event + relations) and
// ../second-international-collapse-20260929-people.json (new people for commulingo-people-upsert).
// Edit here, run `node build.js`, commit the JSON with it.
const fs = require('fs');
const path = require('path');

const W = t => 'https://en.wikipedia.org/wiki/' + t;
const DOC = id => 'https://cyber-lenin.com/commulingo/docs/' + id;
const S = {
    si: W('Second_International'),
    stuttgartDoc: DOC('second-international-stuttgart-militarism-1907'),
    baselDoc: DOC('second-international-basel-manifesto-1912'),
    basel: 'https://www.marxists.org/history/international/social-democracy/1912/basel-manifesto.htm',
    isb: W('International_Socialist_Bureau'),
    jaures: W('Jean_Jaur%C3%A8s'),
    burgfrieden: W('Burgfrieden'),
    unionSacree: W('Union_sacr%C3%A9e'),
    guesde: W('Jules_Guesde'),
    vandervelde: W('%C3%89mile_Vandervelde'),
    victorAdler: W('Victor_Adler'),
    bernstein: W('Eduard_Bernstein'),
    macdonald: W('Ramsay_MacDonald'),
    hardie: W('Keir_Hardie'),
    mussolini: W('Benito_Mussolini'),
    zimmerwald: W('Zimmerwald_Conference'),
    lenin1914: 'https://www.marxists.org/archive/lenin/works/1914/aug/x01.htm',
    lenin1914b: 'https://www.marxists.org/archive/lenin/works/1914/sep/28.htm',
    liebknecht: W('Karl_Liebknecht'),
    liebknechtDoc: DOC('liebknecht-war-credits-statement-1914'),
    junius: 'https://www.marxists.org/archive/luxemburg/1915/junius/index.htm',
    uspd: W('Independent_Social_Democratic_Party_of_Germany'),
    zetkin: W('Clara_Zetkin'),
    grimm: W('Robert_Grimm'),
    zimmerwaldManifesto: 'https://www.marxists.org/history/international/social-democracy/zimmerwald/manifesto-1915.htm',
    zimmerwaldLeft: W('Zimmerwald_Left'),
    kienthal: W('Kienthal_Conference'),
    leninCollapse: 'https://www.marxists.org/archive/lenin/works/1915/csi/index.htm',
    imperialism: W('Imperialism,_the_Highest_Stage_of_Capitalism'),
    debs: W('Eugene_V._Debs'),
};

const sections = [
    {
        heading: { ko: '반전의 약속: 슈투트가르트에서 바젤까지', en: 'The pledge against war: from Stuttgart to Basel' },
        paragraphs: [
            {
                ko: '1905년 러시아 혁명 뒤 제2인터내셔널의 대회는 전쟁을 어떻게 막을지를 두고 논쟁했다. 1907년 슈투트가르트 대회에서는 군대 안의 파업과 봉기를 외친 에르베, 계급투쟁이 전쟁을 없앨 것이라며 특별한 행동이 필요 없다고 본 게드, 의회 압력을 주장한 베벨, 대중 파업까지 고려한 조레스의 입장이 맞섰다. 타협 결의안 끝에 룩셈부르크와 레닌이 쓴 수정안이 붙었다. 전쟁이 터지면 그 위기를 이용해 「자본주의 계급 지배의 폐지를 앞당기라」는 것이었다.',
                en: 'After the Russian Revolution of 1905 the Second International’s congresses argued over how to stop a war. At Stuttgart in 1907 four positions clashed: Hervé’s strikes and insurrection in the army; Guesde’s view that class struggle would abolish war without special action; Bebel’s parliamentary pressure; and Jaurès’s readiness to use the mass strike. The compromise resolution ended with an amendment drafted by Luxemburg and Lenin: if war broke out, socialists were to use the crisis to “hasten the abolition of capitalist class rule”.',
                sources: [S.si, S.stuttgartDoc],
            },
            {
                ko: '1910년 코펜하겐 대회에서는 키어 하디와 바양이 군수 산업의 총파업을 전쟁 방지 수단으로 명시하자고 제안했지만, 결정은 1914년 빈 대회로 미뤄졌다. 1912년 11월 발칸 전쟁이 유럽 전쟁으로 번질 위기에 바젤에서 임시 대회가 열렸다. 대표들은 대성당까지 행진했고, 대회는 슈투트가르트 결의를 재확인하는 선언을 만장일치로 채택했다. 조레스는 인터내셔널이 권력자들에게 「명령하는 어조로 말할 만큼 강하다」고 말했다.',
                en: 'At the Copenhagen congress of 1910 Keir Hardie and Vaillant proposed naming a general strike in the arms industries as the means to prevent war, but the decision was put off to a Vienna congress in 1914. In November 1912, as the Balkan Wars threatened to become a European war, an extraordinary congress met in Basel. Delegates marched to the cathedral, and the congress unanimously adopted a manifesto reaffirming the Stuttgart resolution. Jaurès declared the International “strong enough to speak in this tone of command to those in power”.',
                sources: [S.si, S.basel, S.baselDoc],
            },
        ],
    },
    {
        heading: { ko: '1914년 7월의 위기', en: 'The July crisis of 1914' },
        paragraphs: [
            {
                ko: '발칸 전쟁이 대전으로 번지지 않자 1913년 인터내셔널에는 낙관이 퍼졌다. 카우츠키 등은 열강의 경제적 상호의존이 전쟁을 비합리적으로 만든다는 「초제국주의」론을 내놓았다. 1914년 7월 23일 오스트리아의 대세르비아 최후통첩은 이들을 허를 찔렀다. SPD는 25일 평화를 호소했지만 구체적인 행동 계획은 내놓지 않았다.',
                en: 'When the Balkan Wars did not become a general war, optimism spread through the International in 1913. Kautsky and others argued that the great powers’ economic interdependence made war irrational — the theory of “ultra-imperialism”. Austria’s ultimatum to Serbia on 23 July 1914 caught them off guard. The SPD appealed for peace on the 25th but offered no concrete plan of action.',
                sources: [S.si],
            },
            {
                ko: '7월 29일 브뤼셀에서 열린 국제사회주의사무국 긴급회의에는 조레스, 오스트리아의 빅토어 아들러, 독일의 후고 하제, 영국의 하디가 모였다. 아들러는 「전쟁은 이미 우리 곁에 있다」며 오스트리아 당이 아무것도 할 수 없다고 고백했고, 하제는 독일 노동자를 동원할 수 있다고 자신했다. 사무국이 내린 유일한 결정은 빈 대회를 8월 9일 파리로 앞당겨 옮기는 것이었다. 그날 밤 조레스는 시르크 루아얄 집회에서 마지막 평화 연설을 했다.',
                en: 'On 29 July the International Socialist Bureau met in emergency session in Brussels: Jaurès, Victor Adler of Austria, Hugo Haase of Germany and Hardie of Britain. Adler confessed that “the war is already with us” and that his party could do nothing; Haase was confident that German workers could be mobilised. The Bureau’s only decision was to move the Vienna congress forward to Paris on 9 August. That evening Jaurès gave his last speech for peace at a rally in the Cirque Royal.',
                sources: [S.si, S.isb, S.victorAdler],
            },
        ],
    },
    {
        heading: { ko: '조레스 암살과 8월 4일', en: 'The murder of Jaurès and 4 August' },
        paragraphs: [
            {
                ko: '7월 31일 밤 파리 크루아상 카페에서 식사하던 조레스가 29세의 민족주의자 라울 빌랭의 총에 맞아 숨졌다. 인터내셔널은 가장 강력한 반전 지도자를 잃었다. 8월 1일 독일이 러시아에 선전포고하고 프랑스와 독일이 총동원에 들어갔다. SPD가 파리에 보낸 헤르만 뮐러는 조레스를 잃고 독일의 침공을 앞둔 프랑스 사회주의자들이 전쟁공채 반대를 고려조차 하지 않는다는 것을 확인했다. 빌랭은 전후 재판에서 무죄로 풀려났다.',
                en: 'On the night of 31 July Jaurès was shot dead in the Café du Croissant in Paris by Raoul Villain, a 29-year-old nationalist. The International lost its most powerful anti-war leader. On 1 August Germany declared war on Russia and France and Germany mobilised. Hermann Müller, sent by the SPD to Paris, found the French socialists, bereaved of Jaurès and facing German invasion, unwilling even to consider voting against war credits. Villain was acquitted after the war.',
                sources: [S.jaures, S.si],
            },
            {
                ko: '8월 4일 베를린에서 SPD 의원단은 전쟁공채에 만장일치로 찬성했다. 내부 표결은 78 대 14였고, 반대했던 하제가 당의 결정에 따라 「성내 평화」를 선언하는 성명을 읽었다. 같은 날 파리의 사회주의자들도 공채에 찬성해 「신성 연합」에 들어갔다. 오스트리아·벨기에·영국의 사회주의자들도 정부 편에 섰고, 프랑스에서는 쥘 게드와 마르셀 상바가, 벨기에에서는 에밀 반데르벨데가 입각했다. 전쟁에 반대표를 던진 것은 세르비아와 러시아의 사회주의 의원들뿐이었다.',
                en: 'On 4 August in Berlin the SPD deputies voted unanimously for war credits. The internal vote had been 78 to 14, and Haase, who had opposed them, read the party’s declaration proclaiming the Burgfrieden, the civil truce. The same day the socialists in Paris voted for the credits and joined the Union sacrée. Socialists in Austria, Belgium and Britain rallied to their governments; Jules Guesde and Marcel Sembat entered the French government and Émile Vandervelde the Belgian. Only in Serbia and Russia did socialist deputies vote against the war.',
                sources: [S.si, S.burgfrieden, S.unionSacree, S.guesde, S.vandervelde],
            },
        ],
    },
    {
        heading: { ko: '사회애국주의와 반대자들', en: 'Social patriots and dissenters' },
        paragraphs: [
            {
                ko: '영국 노동당이 정부의 1억 파운드 전쟁공채 요청을 지지하자 램지 맥도널드는 당 의장직에서 물러났고, 아서 헨더슨이 뒤를 이었다. 노동당 창립자 하디는 반전 입장을 지키다 1915년 숨졌다. 이탈리아 사회당은 중립을 지켰지만, 기관지 『아반티!』 편집장 베니토 무솔리니는 참전을 주장하다 제명되어 『포폴로 디탈리아』를 창간했다. 러시아의 플레하노프는 조국 방위를 지지했다. 미국 사회당의 유진 뎁스는 전쟁에 반대하다 1918년 투옥되었다.',
                en: 'When the British Labour Party backed the government’s request for £100 million in war credits, Ramsay MacDonald resigned the party chairmanship and Arthur Henderson took over. Hardie, Labour’s founder, held to his opposition to the war until his death in 1915. The Italian Socialist Party stayed neutral, but Benito Mussolini, editor of Avanti!, was expelled for advocating intervention and founded Il Popolo d’Italia. In Russia Plekhanov backed national defence. In the United States the Socialist leader Eugene Debs opposed the war and was jailed in 1918.',
                sources: [S.macdonald, S.hardie, S.mussolini, S.zimmerwald, S.debs],
            },
            {
                ko: '패배를 받아들이는 방식도 갈렸다. 룩셈부르크는 「모든 것을 잃었고 남은 것은 우리의 명예뿐」이라고 했고, 트로츠키는 제2인터내셔널을 사회주의가 벗어나야 할 「굳은 껍데기」라 불렀다. 레닌은 이를 「썩은 시체」라 부르며, 1914년 가을부터 제국주의 전쟁을 내란으로 전환하고 새로운 제3인터내셔널을 세우자고 주장했다.',
                en: 'Responses to the defeat diverged. Luxemburg said that “everything is lost, all that remains is our honour”; Trotsky called the Second International a “rigid shell” from which socialism must be freed. Lenin denounced it as a “stinking corpse” and from autumn 1914 called for turning the imperialist war into a civil war and founding a new, Third International.',
                sources: [S.zimmerwald, S.lenin1914, S.lenin1914b],
            },
        ],
    },
    {
        heading: { ko: '독일 사민당의 균열', en: 'The split in German Social Democracy' },
        paragraphs: [
            {
                ko: '1914년 12월 2일 카를 리프크네히트는 제국의회에서 두 번째 전쟁공채에 홀로 반대표를 던지고, 이 전쟁이 방어 전쟁이 아니라 제국주의 전쟁이라는 성명을 냈다. 1916년 5월 1일 베를린에서 반전 시위를 이끌다 체포되어 4년 1개월 형을 선고받았다. 룩셈부르크는 옥중에서 쓴 『유니우스 팸플릿』에서 엥겔스를 인용해 부르주아 사회가 「사회주의로의 이행이냐 야만으로의 퇴행이냐」의 기로에 섰다고 썼다.',
                en: 'On 2 December 1914 Karl Liebknecht cast the only vote in the Reichstag against the second war credits, declaring that this was not a defensive but an imperialist war. Arrested while leading an anti-war demonstration in Berlin on 1 May 1916, he was sentenced to four years and one month. In the Junius Pamphlet, written in prison, Luxemburg quoted Engels: bourgeois society stood at the crossroads of “transition to socialism or regression into barbarism”.',
                sources: [S.liebknecht, S.liebknechtDoc, S.junius],
            },
            {
                ko: '반대는 점차 넓어졌다. 8월 4일 당의 규율에 따라 찬성했던 베른슈타인은 1915년 하제·카우츠키와 함께 반대 쪽으로 돌아섰다. SPD 지도부가 1916년부터 반대파를 축출하자, 이들은 사회민주주의 노동공동체를 거쳐 1917년 4월 고타에서 독립사회민주당(USPD)을 세웠다. 스파르타쿠스단도 그 안에 들어갔다. 에베르트와 샤이데만이 이끄는 다수파는 전쟁 지지를 계속했다.',
                en: 'Opposition widened. Bernstein, who had voted for the credits on 4 August out of party discipline, turned against them in 1915 with Haase and Kautsky. When the SPD leadership began expelling the opponents in 1916, they formed the Social Democratic Working Group and in April 1917 founded the Independent Social Democratic Party (USPD) at Gotha, with the Spartacus League inside it. The majority under Ebert and Scheidemann kept supporting the war.',
                sources: [S.bernstein, S.uspd],
            },
        ],
    },
    {
        heading: { ko: '치머발트와 킨탈', en: 'Zimmerwald and Kienthal' },
        paragraphs: [
            {
                ko: '사무국은 중립국 네덜란드로 옮겨 1915년 1월 코펜하겐에서 중립국 정당 회의를 열었지만 성과가 없었다. 협상국 쪽 사회주의 정당들은 2월 런던에서, 동맹국 쪽은 4월 빈에서 따로 모였다. 클라라 체트킨은 1915년 국제 사회주의 여성 반전 회의를 조직했다. 스위스의 로베르트 그림은 이탈리아 사회당과 함께 독자적인 반전 회의를 준비했고, 1915년 9월 5~8일 베른 근교 마을 치머발트에 38명이 모였다. 참석자들은 반세기 전 제1인터내셔널을 세운 뒤에도 유럽의 국제주의자들이 「마차 네 대에 다 탈 수 있다」고 농담했다.',
                en: 'The Bureau moved to the neutral Netherlands and convened neutral parties in Copenhagen in January 1915 without result; the Allied parties met separately in London in February and those of the Central Powers in Vienna in April. Clara Zetkin organised an international socialist women’s conference against the war in 1915. Robert Grimm of Switzerland prepared an independent anti-war conference with the Italian Socialist Party, and from 5 to 8 September 1915 thirty-eight delegates met in the village of Zimmerwald near Bern. They joked that half a century after the First International all Europe’s internationalists could still fit into four coaches.',
                sources: [S.si, S.zetkin, S.zimmerwald, S.grimm],
            },
            {
                ko: '볼셰비키의 레닌과 지노비예프, 멘셰비키의 마르토프와 악셀로드, 『나셰 슬로보』의 트로츠키, 루마니아의 라콥스키, 불가리아의 콜라로프, 독일 반대파 의원 레데부어 등이 참석했다. 채택된 선언은 전쟁을 반동적 자본주의 정부들의 책임으로 돌리고 무병합·무배상 평화를 요구했지만, 공채 반대와 새 인터내셔널 같은 레닌의 요구는 담지 않았다. 레닌·라데크·지노비예프는 「치머발트 좌파」를 꾸렸고, 1916년 4월 킨탈 회의에서 분열은 더 깊어졌다.',
                en: 'Lenin and Zinoviev for the Bolsheviks, Martov and Axelrod for the Mensheviks, Trotsky for Nashe Slovo, Rakovsky of Romania, Kolarov of Bulgaria and German opposition deputies such as Ledebour attended. The manifesto blamed the war on reactionary capitalist governments and called for peace without annexations or indemnities, but left out Lenin’s demands — voting against war credits, a new International. Lenin, Radek and Zinoviev formed the “Zimmerwald Left”, and the Kienthal conference of April 1916 deepened the split.',
                sources: [S.zimmerwald, S.zimmerwaldManifesto, S.zimmerwaldLeft, S.kienthal],
            },
        ],
    },
    {
        heading: { ko: '1917년과 새 인터내셔널로의 길', en: '1917 and the road to a new International' },
        paragraphs: [
            {
                ko: '레닌은 1915년 『제2인터내셔널의 붕괴』에서 붕괴의 원인을 지도자 개인의 배신이 아니라 기회주의, 곧 제국주의의 초과 이윤으로 매수된 노동귀족과 관료층에서 찾았고, 1916년 『제국주의론』에서 이를 이론화했다. 2월 혁명 뒤 중립국 사회주의자들과 페트로그라드 소비에트가 1917년 스톡홀름에 모든 사회주의 정당을 모아 강화를 중재하려 했지만, 협상국 정부들이 여권을 내주지 않아 무산되었다. 치머발트 운동의 의장 그림은 그해 스위스 외무장관과의 강화 교섭 연루 사건으로 물러났다.',
                en: 'In The Collapse of the Second International (1915) Lenin located the cause not in individual leaders’ treachery but in opportunism — a labour aristocracy and bureaucracy bribed from imperialist superprofits — and theorised it in Imperialism (1916). After the February Revolution neutral socialists and the Petrograd Soviet tried to gather every socialist party in Stockholm in 1917 to broker peace, but the Allied governments refused passports and the conference collapsed. Grimm, chairman of the Zimmerwald movement, had to step down that year over the Grimm–Hoffmann affair.',
                sources: [S.leninCollapse, S.imperialism, S.si, S.grimm],
            },
            {
                ko: '1919년 2월 베른에서 전후 첫 회의가 열렸지만, 벨기에 대표는 독일 대표와 한자리에 앉기를 거부했고 치머발트 좌파를 지지한 프랑스·이탈리아·스위스 정당은 오지 않았다. 회의는 볼셰비키 독재를 규탄하고 의회 민주주의를 지지했다. 한 달 뒤인 3월 모스크바에서 제2인터내셔널의 「사회애국주의」를 전면 거부하는 공산주의 인터내셔널이 창설되었다. 남은 정당들은 1921년 「2½ 인터내셔널」을 거쳐 1923년 노동사회주의 인터내셔널로 합쳐졌다.',
                en: 'The first post-war conference met in Bern in February 1919, but the Belgians refused to sit with the Germans and the French, Italian and Swiss parties that had backed the Zimmerwald Left stayed away. The conference condemned the Bolshevik dictatorship and endorsed parliamentary democracy. A month later, in March, the Communist International was founded in Moscow on a total rejection of the Second International’s “social patriotism”. The remaining parties passed through the “Two-and-a-half International” of 1921 and merged in 1923 into the Labour and Socialist International.',
                sources: [S.si],
            },
        ],
    },
    {
        heading: { ko: '붕괴의 해석', en: 'Explaining the collapse' },
        paragraphs: [
            {
                ko: '레닌의 「배신」론과 달리, 조르주 하우프트 같은 역사가들은 붕괴를 인터내셔널의 오래된 모순이 드러난 결과로 보았다. 반전 전략은 전쟁 예방에 맞춰져 있어 선전포고 뒤에는 쓸모가 없었고, 자율적인 정당들의 연합체에는 공동 행동을 강제할 장치가 없었다. 지도자들은 대중의 애국심이 계급 충성을 누를 수 있다는 점과 동원의 속도를 과소평가했다. 그럼에도 인터내셔널은 노동절, 세계 여성의 날, 「인터내셔널가」 같은 대중 사회민주주의의 전통을 남겼다.',
                en: 'Against Lenin’s thesis of betrayal, historians such as Georges Haupt saw the collapse as the outcome of the International’s long-standing contradictions. Its anti-war strategy was built for prevention and useless once war was declared; a federation of autonomous parties had no means of enforcing joint action; and its leaders underestimated how far mass patriotism could outweigh class loyalty and how fast mobilisation would move. Even so, the International left the traditions of mass social democracy — May Day, International Women’s Day, “The Internationale”.',
                sources: [S.si, S.leninCollapse],
            },
            {
                ko: '붕괴는 인터내셔널 안에 오래 공존하던 두 흐름을 갈라놓았다. 개혁주의자들은 기존 민주 국가를 다수가 장악해 쓸 수 있는 중립적 도구로 보았고, 혁명주의자들은 국가를 타도해야 할 계급 지배의 기관으로 보았다. 혁명주의 안에서도 긴 준비 끝의 혁명을 기대한 SPD 주류와, 전쟁이나 공황으로 자본주의가 곧 무너질 것이라 본 레닌·룩셈부르크의 좌파가 갈렸다. 1914년은 이 차이를 공채 표결이라는 하나의 선택으로 드러냈고, 그 선이 전후 사회민주주의와 공산주의의 경계가 되었다.',
                en: 'The collapse separated two currents that had long coexisted in the International. Reformists saw the existing democratic state as a neutral instrument the majority could capture and use; revolutionaries saw it as an organ of class rule to be overthrown. Among the revolutionaries, too, the SPD mainstream expecting revolution after long preparation parted from the left of Lenin and Luxemburg, who expected capitalism’s imminent breakdown through war or crisis. 1914 exposed these differences in a single choice — the vote on war credits — and that line became the post-war boundary between social democracy and communism.',
                sources: [S.si],
            },
        ],
    },
];

const P = (lat, lng, ko, en) => ({ kind: 'point', lat, lng, label: { ko, en } });
const timeline = [
    ['1907.08', '슈투트가르트 대회', 'Stuttgart congress', '룩셈부르크·레닌의 수정안이 붙은 반전 결의가 채택되었다.', 'An anti-war resolution with the Luxemburg–Lenin amendment was adopted.', ['germany'], P(48.78, 9.18, '슈투트가르트', 'Stuttgart')],
    ['1912.11', '바젤 임시 대회', 'Basel extraordinary congress', '발칸 전쟁의 위기 속에 반전 선언을 만장일치로 채택했다.', 'Amid the Balkan crisis the congress unanimously adopted an anti-war manifesto.', ['switzerland'], P(47.56, 7.59, '바젤', 'Basel')],
    ['1914.07.29', '브뤼셀 사무국 긴급회의', 'Emergency ISB meeting in Brussels', '파리 대회를 앞당기기로 했고, 조레스가 마지막 평화 연설을 했다.', 'The Bureau brought the Paris congress forward; Jaurès made his last speech for peace.', ['belgium'], P(50.85, 4.35, '브뤼셀', 'Brussels')],
    ['1914.07.31', '조레스 암살', 'Jaurès assassinated', '파리의 카페에서 민족주의자의 총에 맞아 숨졌다.', 'He was shot dead by a nationalist in a Paris café.', ['france'], P(48.87, 2.34, '파리', 'Paris')],
    ['1914.08.04', 'SPD의 전쟁공채 찬성', 'SPD votes for war credits', '독일과 프랑스의 사회주의 의원들이 같은 날 공채에 찬성했다.', 'German and French socialist deputies voted for war credits on the same day.', ['germany', 'france'], P(52.5186, 13.3762, '베를린 제국의회', 'Reichstag, Berlin')],
    ['1914.08.05', '맥도널드의 사임', 'MacDonald resigns', '노동당이 전쟁공채를 지지하자 당 의장직에서 물러났다.', 'He resigned as Labour chairman when the party backed war credits.', ['uk']],
    ['1914.08.26', '게드·상바 입각', 'Guesde and Sembat join the government', '프랑스 사회주의자들이 「신성 연합」 정부에 들어갔다.', 'French socialists entered the Union sacrée government.', ['france']],
    ['1914.12.02', '리프크네히트의 반대표', 'Liebknecht votes no', '제국의회에서 두 번째 전쟁공채에 홀로 반대했다.', 'He cast the only vote in the Reichstag against the second war credits.', ['germany']],
    ['1915.02', '협상국 사회주의자 런던 회의', 'Allied socialists meet in London', '교전국 정당들이 진영별로 따로 모이기 시작했다.', 'Belligerent parties began meeting separately by camp.', ['uk']],
    ['1915.09.05', '치머발트 회의', 'Zimmerwald conference', '38명의 반전 사회주의자가 무병합·무배상 평화를 요구했다.', 'Thirty-eight anti-war socialists called for peace without annexations or indemnities.', ['switzerland'], P(46.88, 7.47, '치머발트', 'Zimmerwald')],
    ['1916.04', '킨탈 회의', 'Kienthal conference', '치머발트 운동의 두 번째 회의에서 좌파와 다수파의 분열이 깊어졌다.', 'At the second Zimmerwald conference the split between left and majority deepened.', ['switzerland']],
    ['1916.05.01', '리프크네히트 체포', 'Liebknecht arrested', '베를린 반전 시위를 이끌다 체포되어 4년 1개월 형을 받았다.', 'Arrested leading an anti-war demonstration in Berlin, he was sentenced to four years and a month.', ['germany']],
    ['1917.04.06', '독립사회민주당 창당', 'USPD founded', 'SPD에서 축출된 반전파가 고타에서 새 당을 세웠다.', 'Anti-war members expelled from the SPD founded a new party at Gotha.', ['germany'], P(50.95, 10.7, '고타', 'Gotha')],
    ['1917', '스톡홀름 회의 무산', 'Stockholm conference fails', '협상국 정부들이 대표들에게 여권을 내주지 않았다.', 'Allied governments refused passports to delegates.', ['sweden']],
    ['1919.02', '베른 회의', 'Bern conference', '전후 첫 회의가 볼셰비키 독재를 규탄했다.', 'The first post-war conference condemned the Bolshevik dictatorship.', ['switzerland']],
    ['1919.03', '공산주의 인터내셔널 창설', 'Communist International founded', '모스크바에서 제3인터내셔널이 창설되었다.', 'The Third International was founded in Moscow.', ['russia']],
].map(([date, tko, ten, bko, ben, country, geo]) => ({
    date, title: { ko: tko, en: ten }, body: { ko: bko, en: ben }, country, ...(geo ? { geo } : {}),
}));

const people = [
    ['emile-vandervelde', 'leader', '국제사회주의사무국 의장', 'Chairman of the International Socialist Bureau', '인터내셔널을 이끌다 1914년 벨기에 정부에 입각했다.', 'Led the International and joined the Belgian government in 1914.'],
    ['camille-huysmans', 'leader', '국제사회주의사무국 서기', 'Secretary of the International Socialist Bureau', '전쟁 중 사무국을 중립국으로 옮겨 재건을 시도했다.', 'Kept the Bureau going from neutral territory and tried to revive it during the war.'],
    ['jean-jaures', 'leader', '프랑스 사회당 지도자', 'Leader of French socialism', '7월 29일 마지막 평화 연설을 하고 이틀 뒤 암살되었다.', 'Gave his last speech for peace on 29 July and was assassinated two days later.'],
    ['victor-adler', 'leader', '오스트리아 사회민주당 지도자', 'Leader of Austrian Social Democracy', '브뤼셀 회의에서 당의 무력함을 고백하고 전쟁을 지지했다.', 'Confessed his party’s powerlessness in Brussels and backed the war.'],
    ['hugo-haase', 'leader', 'SPD 공동의장 · 뒤에 USPD 의장', 'SPD co-chairman, later USPD chairman', '반대하면서도 8월 4일 찬성 성명을 읽었고, 뒤에 반전파를 이끌었다.', 'Read the pro-credits declaration on 4 August despite opposing them, then led the anti-war opposition.'],
    ['lenin', 'leader', '치머발트 좌파 지도자', 'Leader of the Zimmerwald Left', '제국주의 전쟁을 내란으로 바꾸고 새 인터내셔널을 세우자고 주장했다.', 'Called for turning the imperialist war into civil war and founding a new International.'],
    ['luxemburg', 'leader', '독일 반전 좌파 · 『유니우스 팸플릿』', 'German anti-war left, Junius Pamphlet', '「사회주의냐 야만이냐」를 제기하며 옥중에서 반전 운동을 이끌었다.', 'Posed “socialism or barbarism” and led the anti-war left from prison.'],
    ['liebknecht', 'leader', '전쟁공채 단독 반대', 'Sole vote against war credits', '1914년 12월 홀로 반대표를 던졌고 1916년 반전 시위로 투옥되었다.', 'Cast the lone vote against war credits in December 1914 and was jailed for an anti-war demonstration in 1916.'],
    ['robert-grimm', 'leader', '치머발트 회의 조직자', 'Organiser of the Zimmerwald conference', '치머발트 회의를 조직하고 국제사회주의위원회 의장을 지냈다.', 'Organised the Zimmerwald conference and chaired the International Socialist Commission.'],
    ['friedrich-ebert', 'participant', 'SPD 공동의장', 'SPD co-chairman', '다수파를 이끌며 전쟁 지지를 유지했다.', 'Led the majority in continued support for the war.'],
    ['philipp-scheidemann', 'participant', 'SPD 다수파 지도자', 'SPD majority leader', '에베르트와 함께 전쟁 지지 노선을 이끌었다.', 'Led the pro-war line alongside Ebert.'],
    ['jules-guesde', 'participant', '프랑스 무임소 장관', 'French minister of state', '프랑스 마르크스주의의 원로로 「신성 연합」 정부에 입각했다.', 'The veteran of French Marxism entered the Union sacrée government.'],
    ['karl-kautsky', 'participant', '「초제국주의」론 · 뒤에 USPD', 'Ultra-imperialism theorist, later USPD', '전쟁 전 낙관론을 폈고 1915년부터 반대파에 섰다.', 'Voiced pre-war optimism and joined the opposition from 1915.'],
    ['eduard-bernstein', 'participant', 'SPD 수정주의자 · 뒤에 USPD', 'SPD revisionist, later USPD', '당의 규율로 찬성했다가 1915년 반대로 돌아섰다.', 'Voted for the credits out of discipline, then turned against them in 1915.'],
    ['ramsay-macdonald', 'participant', '영국 노동당 의장', 'Labour Party chairman', '노동당이 전쟁공채를 지지하자 의장직에서 물러났다.', 'Resigned the chairmanship when Labour backed war credits.'],
    ['keir-hardie', 'participant', '영국 노동당 창립자', 'Founder of the Labour Party', '총파업 반전안을 제안했고 전쟁 반대를 지키다 1915년 숨졌다.', 'Proposed the anti-war general strike and held to opposition until his death in 1915.'],
    ['benito-mussolini', 'participant', '『아반티!』 편집장', 'Editor of Avanti!', '참전을 주장하다 이탈리아 사회당에서 제명되었다.', 'Was expelled from the Italian Socialist Party for advocating intervention.'],
    ['plekhanov', 'participant', '러시아 조국방위파', 'Russian defencist', '러시아 마르크스주의의 아버지로 조국 방위를 지지했다.', 'The father of Russian Marxism backed national defence.'],
    ['zetkin', 'participant', '국제 사회주의 여성 반전 회의 조직', 'Organiser of the socialist women’s anti-war conference', '1915년 여성 반전 회의를 조직하고 여러 차례 체포되었다.', 'Organised the 1915 women’s anti-war conference and was arrested several times.'],
    ['martov', 'participant', '멘셰비키 국제주의파', 'Menshevik internationalist', '치머발트 회의를 제안하고 참석했다.', 'Urged and attended the Zimmerwald conference.'],
    ['trotsky', 'participant', '『나셰 슬로보』 대표', 'Nashe Slovo delegate', '제2인터내셔널을 「굳은 껍데기」라 부르고 치머발트에 참석했다.', 'Called the Second International a “rigid shell” and attended Zimmerwald.'],
    ['zinoviev', 'participant', '치머발트 좌파 사무국', 'Zimmerwald Left bureau', '레닌과 함께 치머발트 좌파를 이끌었다.', 'Led the Zimmerwald Left with Lenin.'],
    ['radek', 'participant', '치머발트 좌파 선언 초안', 'Drafted the Zimmerwald Left manifesto', '좌파의 선언 초안을 쓰고 좌파 사무국에 들어갔다.', 'Wrote the left’s draft manifesto and joined its bureau.'],
    ['angelica-balabanova', 'participant', '이탈리아 사회당 · 치머발트 준비 회의', 'Italian Socialist Party, Zimmerwald preparatory meeting', '치머발트 준비 회의에 참석했다.', 'Attended the Zimmerwald preparatory meeting.'],
    ['christian-rakovsky', 'participant', '루마니아 사회민주당 대표', 'Romanian Social Democratic delegate', '발칸 사회주의 연맹을 대표해 치머발트에 참석했다.', 'Attended Zimmerwald for the Balkan socialists.'],
    ['vasil-kolarov', 'participant', '불가리아 협의파 대표', 'Bulgarian Narrow Socialist delegate', '불가리아 협의파를 대표해 치머발트에 참석했다.', 'Attended Zimmerwald for the Bulgarian Narrow Socialists.'],
    ['eugene-v-debs', 'participant', '미국 사회당 지도자', 'American Socialist leader', '전쟁에 반대하다 1918년 투옥되었다.', 'Opposed the war and was jailed in 1918.'],
].map(([person_id, relation_kind, relation_ko, relation_en, note_ko, note_en], sort_order) => ({
    person_id, sort_order, relation_kind, relation_ko, relation_en, note_ko, note_en,
}));

const sources = [];
for (const s of sections) for (const p of s.paragraphs) for (const u of p.sources) if (!sources.includes(u)) sources.push(u);
const body = lang => sections.map(s => '## ' + s.heading[lang] + '\n\n' + s.paragraphs.map(p =>
    p[lang] + ' ' + p.sources.map(u => `[${sources.indexOf(u) + 1}](${u})`).join(' ')).join('\n\n')).join('\n\n');

const event = {
    id: 'second-international-collapse-1914',
    expected: null,
    fields: {
        title_ko: '제2인터내셔널의 붕괴',
        title_en: 'The collapse of the Second International',
        period_label: '1907–1919',
        sort_order: 16,
        question_ko: '전쟁이 나면 막겠다고 거듭 결의한 사회주의 정당들은 왜 1914년 8월 저마다 자국 정부의 전쟁을 지지했는가?',
        question_en: 'Why did socialist parties that had repeatedly resolved to stop a war each back their own government’s war in August 1914?',
        summary_ko: '제2인터내셔널은 1907년 슈투트가르트와 1912년 바젤에서 전쟁에 맞서겠다고 결의했다. 그러나 1914년 7월 조레스가 암살되고, 8월 4일 독일과 프랑스의 사회주의 의원들이 전쟁공채에 찬성하면서 국제 연대는 무너졌다. 소수 반전파는 리프크네히트의 반대표와 1915년 치머발트 회의로 모였고, 레닌의 치머발트 좌파는 새 인터내셔널을 요구했다.',
        summary_en: 'The Second International resolved at Stuttgart in 1907 and Basel in 1912 to stand against war. But after Jaurès was assassinated in July 1914, German and French socialist deputies voted for war credits on 4 August and international solidarity collapsed. An anti-war minority gathered around Liebknecht’s dissenting vote and the Zimmerwald conference of 1915, and Lenin’s Zimmerwald Left called for a new International.',
        outcome_ko: '교전국 사회주의 정당 다수는 전쟁 내내 정부를 지지했고, 반전파는 독일의 USPD와 치머발트 운동으로 갈라져 나왔다. 1919년 공산주의 인터내셔널이 창설되면서 사회민주주의와 공산주의의 분열이 제도화되었다.',
        outcome_en: 'Most socialist parties in the belligerent countries backed their governments throughout the war, while the anti-war minority split off into the German USPD and the Zimmerwald movement. The founding of the Communist International in 1919 institutionalised the split between social democracy and communism.',
        body_ko: body('ko'),
        body_en: body('en'),
        timeline,
        sources,
        locations: [
            { label: { ko: '브뤼셀 (국제사회주의사무국)', en: 'Brussels (International Socialist Bureau)' }, lat: 50.85, lng: 4.35, kind: 'main' },
            { label: { ko: '베를린', en: 'Berlin' }, lat: 52.52, lng: 13.405, kind: 'place' },
            { label: { ko: '파리', en: 'Paris' }, lat: 48.8566, lng: 2.3522, kind: 'place' },
            { label: { ko: '바젤', en: 'Basel' }, lat: 47.56, lng: 7.59, kind: 'place' },
            { label: { ko: '치머발트', en: 'Zimmerwald' }, lat: 46.88, lng: 7.47, kind: 'place' },
        ],
        countries: ['germany', 'france', 'belgium', 'uk', 'switzerland', 'sweden', 'russia'],
        relations: { related: ['world-war-i', 'german-revolution-1918-1919', 'paris-commune-1871'] },
        no_auto_link: [],
        link_expressions: [],
        focus: null,
    },
    sections,
    people,
};

fs.writeFileSync(path.join(__dirname, '..', 'second-international-collapse-20260929.json'),
    JSON.stringify({ id: 'second-international-collapse-20260929', events: [event] }, null, 2) + '\n');
fs.writeFileSync(path.join(__dirname, '..', 'second-international-collapse-20260929-people.json'),
    JSON.stringify({ changedBy: 'second-international-collapse-20260929', people: require('./people') }, null, 2) + '\n');
console.log(`event ${event.id}: ${sections.length} sections, ${sources.length} sources, ${timeline.length} timeline, ${people.length} relations`);
