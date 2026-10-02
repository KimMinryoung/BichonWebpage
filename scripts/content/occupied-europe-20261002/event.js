// Axis-occupied Europe, 1939–1945: an overview of occupation, collaboration
// and resistance (2026-10-02). Parent of the occupation/resistance documents
// (fall-of-france, french-resistance, yugoslav-partisans, greek-resistance,
// warsaw-uprising, baltic-german-occupation-1941-1944, hungary-1944-1945);
// migration 245 moves them under it. Built with the Baltic batch's lib.js.
const { W, P, event: buildEvent } = require('../baltic-1940-1953-20261002/lib');

const E = t => W(encodeURI(t));
const S = {
    occ: E('German-occupied_Europe'),
    annex: E('Areas_annexed_by_Nazi_Germany'),
    polocc: E('Occupation_of_Poland_(1939–1945)'),
    gg: E('General_Government'),
    rk: E('Reichskommissariat'),
    rkn: E('Reichskommissariat_Niederlande'),
    rku: E('Reichskommissariat_Ukraine'),
    serbia: E('Territory_of_the_Military_Commander_in_Serbia'),
    ndh: E('Independent_State_of_Croatia'),
    grocc: E('Axis_occupation_of_Greece'),
    itfr: E('Italian_occupation_of_France_during_World_War_II'),
    hunger: E('Hunger_Plan'),
    gpo: E('Generalplan_Ost'),
    famine: E('Great_Famine_(Greece)'),
    forced: E('Forced_labour_under_German_rule_during_World_War_II'),
    sto: E('Service_du_travail_obligatoire'),
    collab: E('Collaborationism'),
    quisling: E('Vidkun_Quisling'),
    waffen: E('Waffen-SS_foreign_volunteers_and_conscripts'),
    holo: E('The_Holocaust'),
    danish: E('Rescue_of_the_Danish_Jews'),
    resist: E('Resistance_during_World_War_II'),
    ak: E('Home_Army'),
    ftp: E('Francs-Tireurs_et_Partisans'),
    feb: E('February_strike'),
    wgu: E('Warsaw_Ghetto_Uprising'),
    kragujevac: E('Kragujevac_massacre'),
    nn: E('Night_and_Fog_decree'),
    lidice: E('Lidice_massacre'),
    oradour: E('Oradour-sur-Glane_massacre'),
    distomo: E('Distomo_massacre'),
    kalavryta: E('Kalavryta_massacre'),
    paris: E('Liberation_of_Paris'),
    snu: E('Slovak_National_Uprising'),
    epur: E('Épuration_légale'),
};
const ev = id => `/commulingo/events/${id}`;

const sections = [
    {
        heading: { ko: '점령의 지도: 병합, 총독부, 판무관부, 군정', en: 'The map of occupation: annexation, General Government, Reichskommissariats, military rule' },
        paragraphs: [
            {
                ko: '1941~1942년 절정기에 독일과 이탈리아를 비롯한 추축국은 유럽 대륙 인구의 절반 이상을 직접 통치, 민정 점령, 군사 점령, 괴뢰국가를 통해 다스렸다. 지배 방식은 하나가 아니었다. 오스트리아·주데텐란트·메멜·폴란드 일부·오이펜말메디는 법으로 제국에 편입되었고, 룩셈부르크·알자스·로렌·하부 슈타이어마르크·상부 크라인·비아위스토크 지구는 「민정장관」 아래 국제법상 선언 없이 사실상 병합되었다. 보헤미아·모라비아 보호령과 폴란드 총독부는 반(半)자치 지역이면서도 제국의 일부로 여겨졌다.',
                en: 'At their peak in 1941–1942, Germany and the other Axis powers, Italy above all, governed more than half of the continent’s population through direct administration, civil and military occupation and puppet states. There was no single model. Austria, the Sudetenland, the Memel Territory, parts of Poland and Eupen-Malmedy were incorporated into the Reich by law; Luxembourg, Alsace, Lorraine, Lower Styria, Upper Carniola and the Białystok District were placed under a “Chief of Civil Administration” and annexed de facto without any declaration under international law. The Protectorate of Bohemia and Moravia and the General Government were semi-autonomous yet considered an inherent part of the Reich.',
                sources: [S.occ, S.annex],
            },
            {
                ko: '폴란드는 그 모든 방식의 실험장이었다. 1939년 10월 8일과 12일 히틀러의 포고로 서부 폴란드가 독일에 병합되었고, 나머지 땅에는 10월 26일 한스 프랑크를 총독으로 하는 총독부가 세워졌다. 1940년 10월 2일 히틀러와 프랑크의 회동을 적은 마르틴 보어만의 메모는 총독부를 「폴란드인 보호구역, 거대한 폴란드인 노동수용소」라 부르고 폴란드 지식인은 모두 죽여야 한다고 적었다. 1941년 3월 프랑크는 히틀러가 이 지역을 15~20년 안에 「순수한 독일 땅」으로 만들기로 했다고 부하들에게 전했다.',
                en: 'Poland was the laboratory for all of these forms. By two decrees of Hitler on 8 and 12 October 1939 western Poland was annexed to Germany, and on 26 October the rest became the General Government under Governor-General Hans Frank. Martin Bormann’s note of a meeting between Hitler and Frank on 2 October 1940 called the General Government “a Polish reservation, a great Polish labor camp” and stated that all representatives of the Polish intelligentsia were to be killed. In March 1941 Frank told his subordinates that Hitler had decided to “turn this region into a purely German area within 15–20 years”.',
                sources: [S.polocc, S.gg],
            },
            {
                ko: '네덜란드와 노르웨이에는 민간인 국가판무관이 들어섰다. 네덜란드의 판무관은 오스트리아 마지막 총리였던 아르투어 자이스잉크바르트였다. 서·북유럽의 판무관부는 기존 행정 구조를 유지하며 「대게르만 제국」으로의 편입을 준비하는 과도 단계로 구상되었다. 반면 독소전 개전 직후 알프레트 로젠베르크가 제안한 동부의 판무관부, 곧 발트 3국과 벨라루스의 오스트란트와 1941년 8월 20일 에리히 코흐가 맡은 우크라이나는 독일인 정착을 위한 「생존공간」과 자원 수탈의 땅으로서 새 통치 구조를 받았다. 오스트란트의 사정은 「[독일 점령하의 발트 3국](' + ev('baltic-german-occupation-1941-1944') + ')」 항목이 다룬다.',
                en: 'The Netherlands and Norway received civilian Reich commissioners; the one in the Netherlands was Arthur Seyss-Inquart, Austria’s last chancellor before the Anschluss. The Reichskommissariats of Western and Northern Europe kept the existing administrative structure and were conceived as transitional stages towards incorporation into a Greater Germanic Reich. Their eastern counterparts, proposed by Alfred Rosenberg just after the invasion of the Soviet Union — Ostland in the Baltic states and Belarus, and Ukraine, where Hitler appointed Erich Koch on 20 August 1941 — were given new structures and served colonial ends, as Lebensraum for German settlement and sources of resources. Ostland is covered in [The Baltic states under German occupation](' + ev('baltic-german-occupation-1941-1944') + ').',
                sources: [S.rk, S.rkn, S.rku],
            },
            {
                ko: '그 밖의 땅은 군정이나 현지 협력 정권 아래 놓였다. 벨기에와 북프랑스는 1940~1944년 군정 아래 있었다. 세르비아에서는 독일 군사령관이 최고 권한을 쥐었고, 밀란 네디치의 「구국정부」는 국제법상 지위도 독일이 준 것 이상의 권한도 없는 독일 통치의 도구였다. 1941년 4월 10일에는 안테 파벨리치의 파시스트 조직 우스타샤가 다스리는 크로아티아 독립국이 히틀러와 무솔리니의 후원으로 세워졌다. 그리스는 독일·이탈리아·불가리아의 점령 구역으로 나뉘었고 아테네와 테살로니키 같은 요지는 독일이 차지했다. 이탈리아는 1940년 6월부터 프랑스 남동부 일부를 점령했고, 1942년 11월 독일이 비시 정부의 자유지대를 점령할 때 점령 구역을 크게 넓혔다. 프랑스의 경우는 「[프랑스 침공과 비시 정부](' + ev('fall-of-france') + ')」 항목에서 이어진다.',
                en: 'The remaining lands were put under military government or local collaborating regimes. Belgium and northern France were under military administration from 1940 to 1944. In Serbia supreme authority lay with the German Military Commander, and Milan Nedić’s “Government of National Salvation” had no status under international law and no powers beyond those granted by the Germans — it was simply an instrument of German rule. On 10 April 1941 the Independent State of Croatia was set up under Ante Pavelić’s fascist Ustaše with the backing of Hitler and Mussolini. Greece was divided into German, Italian and Bulgarian occupation zones, with the Germans holding the most important regions, including Athens and Thessaloniki. Italy occupied part of south-eastern France from June 1940 and greatly expanded its zone in November 1942, when Germany occupied the Vichy free zone. France is continued in [The Fall of France and the Vichy Regime](' + ev('fall-of-france') + ').',
                sources: [S.rk, S.serbia, S.ndh, S.grocc, S.itfr],
            },
        ],
    },
    {
        heading: { ko: '수탈: 굶주림과 강제노동', en: 'Plunder: hunger and forced labour' },
        paragraphs: [
            {
                ko: '점령은 무엇보다 수탈이었다. 1941년 5월 2일 독소전을 준비하는 독일 차관 회의에서 처음 정식화된 「기아 계획」은 헤르베르트 바케가 설계한 것으로, 소련 점령지의 식량을 거두어 독일군과 독일 본국에 돌리고 그 결과 동유럽에서 3,100만~4,500만 명이 굶어 죽는 인위적 기근을 의도했다. 계획은 부분적으로만 실행되었지만 수백만 명을 죽였다. 동유럽에 독일인을 정착시키고 슬라브인 등 원주민을 학살·추방하려던 「동부 종합계획」도 전쟁 중 부분적으로 실행되었다.',
                en: 'Occupation was first of all plunder. The Hunger Plan, devised by Herbert Backe and first formulated at a meeting of state secretaries on 2 May 1941 in preparation for the invasion of the Soviet Union, ordered the seizure of food in the occupied territories for German troops and the home front and intended an artificial famine in Eastern Europe that would have killed around 31 to 45 million people. It was only partially implemented, but it killed millions. Generalplan Ost, the plan to settle Eastern Europe with Germans and to murder and expel its Slavic and other inhabitants, was also partially carried out during the war.',
                sources: [S.hunger, S.gpo],
            },
            {
                ko: '그리스에서 독일과 이탈리아는 서·북유럽에서 쓰던 「합리적」 착취 대신 약탈을 택했다. 헤르만 괴링은 1942년 8월 6일 점령지 판무관과 군사령관들에게 보낸 편지에서 「당신 관할의 사람들이 굶어 죽는다 해도 나는 조금도 개의치 않는다. 독일인이 굶지 않는 한 그들은 죽게 내버려 두라」고 썼다. 징발과 연합국의 해상봉쇄, 침공으로 망가진 기반시설과 암시장이 겹쳐 1941~1942년 겨울 대기근이 닥쳤고, 독일군 기록으로 1941년 12월 아테네에서만 하루 300명이 죽었다(적십자 추산 400명). 1942년 2월 봉쇄가 풀리고 스웨덴 배가 캐나다 밀을 실어 오면서 사망률이 내려갔지만, 점령기 그리스의 기아·영양실조 사망은 약 30만 명으로 추산된다.',
                en: 'In Greece, unlike the rational exploitation applied in Western and Northern Europe, the Germans and Italians resorted to plunder. Hermann Göring wrote to the Reich commissioners and military commanders of the occupied territories on 6 August 1942: “I could not care less when you say that people under your administration are dying of hunger. Let them perish so long as no German starves.” Requisitions, the Allied blockade, infrastructure wrecked by the invasion and a powerful black market produced the Great Famine, which peaked in the winter of 1941–42; according to German army records 300 people a day died in Athens alone in December 1941, while the Red Cross estimated 400. Mortality fell after the blockade was lifted in February 1942 and Swedish ships brought Canadian wheat, but Greece is estimated to have suffered some 300,000 deaths from famine and malnutrition during the occupation.',
                sources: [S.famine],
            },
            {
                ko: '노동력도 거두어 갔다. 독일은 스무 나라 가까이에서 약 1,200만 명을 끌고 갔고 그 3분의 2가 중·동유럽 출신이었다. 1944년 늦여름 독일 기록에는 외국인 민간 노동자와 전쟁포로 760만 명이 올라 있었는데, 대부분 강제로 데려온 이들로 독일 전체 노동력의 4분의 1에 이르렀다. 「OST」 표지를 달고 철조망 친 수용소에서 감시받으며 산 소련·폴란드 출신 「동방 노동자」는 280만~300만 명이었고, 총독부 출신 폴란드인 노동자는 옷에 「P」 표지를 달아야 했다.',
                en: 'Labour was taken too. The Germans abducted approximately 12 million people from almost twenty European countries, about two thirds of them from Central and Eastern Europe. In the late summer of 1944 German records listed 7.6 million foreign civilian workers and prisoners of war on German territory, most brought there by coercion; by then slave labour made up a quarter of Germany’s entire work force. The Soviet and Polish Ostarbeiter, who wore an “OST” badge and lived under guard in camps fenced with barbed wire, numbered between 2.8 and 3 million, and Polish workers from the General Government had to wear a “P” on their clothing.',
                sources: [S.forced],
            },
            {
                ko: '서유럽에서는 협력 정부가 동원을 맡았다. 비시 정부의 피에르 라발은 1942년 6월 22일 노동자 세 명이 독일로 가면 프랑스 포로 한 명을 돌려받는다는 「교대(relève)」를 발표했다. 자원자가 모자라자 라발이 서명한 1943년 2월 16일 법은 20세 이상 남성 전부를 강제노동징용(STO)의 대상으로 삼았다. 1942년 6월부터 1944년 7월까지 프랑스 노동자 60만~65만 명이 독일로 보내졌고, 프랑스는 소련과 폴란드 다음가는 강제노동 공급지가 되었다.',
                en: 'In the West collaborating governments ran the mobilisation. On 22 June 1942 Pierre Laval, head of the Vichy government, announced the relève, under which one French prisoner of war would be released for every three French workers sent to Germany. When volunteers fell short, the law of 16 February 1943, signed by Laval, made all males over 20 subject to the Service du travail obligatoire. Between June 1942 and July 1944, 600,000 to 650,000 French workers were sent to Germany, making France the third largest source of forced labour after the Soviet Union and Poland.',
                sources: [S.sto],
            },
        ],
    },
    {
        heading: { ko: '협력의 여러 얼굴', en: 'The faces of collaboration' },
        paragraphs: [
            {
                ko: '「협력(collaboration)」이 적과의 반역적 협조라는 오늘날의 뜻을 얻은 것은 1940년 10월 24일 몽투아르에서 필리프 페탱이 히틀러를 만난 뒤였다. 독일이 전쟁에 이겼다고 믿은 페탱은 독일과의 「협력」을 받아들인다고 프랑스인들에게 알렸다. 역사가 스탠리 호프먼은 협력을 필요를 마지못해 인정한 「비자발적」 협력과 그 필요를 이용하려 한 「자발적」 협력으로 나누었고, 반공이나 이념 때문에 히틀러 독일과의 더 강한 협력을 원한 파시스트와 나치 동조자를 따로 「협력주의자(collaborationnistes)」라 불렀다.',
                en: '“Collaboration” acquired its modern meaning of traitorous cooperation with the enemy after Marshal Philippe Pétain met Hitler at Montoire-sur-le-Loir on 24 October 1940. Believing that Germany had won the war, Pétain informed the French people that he accepted “collaboration” with Germany. The historian Stanley Hoffmann divided collaboration into involuntary — reluctant recognition of necessity — and voluntary, an attempt to exploit necessity, and used the term collaborationnistes for the fascists and Nazi sympathisers who, for anti-communist or other ideological reasons, wanted a reinforced collaboration with Hitler’s Germany.',
                sources: [S.collab],
            },
            {
                ko: '노르웨이의 비드쿤 크비슬링은 1940년 4월 9일 독일 침공이 진행되던 중 라디오 방송으로 권력을 잡으려 했으나, 독일이 합법 정부를 통해 점령을 정당화하려 했기에 실패했다. 1942년 2월 1일 그는 독일이 승인한 정부의 총리가 되었고, 그의 성은 전쟁이 끝나기도 전에 여러 북유럽 언어에서 「협력자」·「반역자」의 동의어가 되었다. 협력은 군복으로도 이어졌다. 전쟁 말까지 무장친위대에 복무한 외국인은 압력을 받거나 징집된 이들을 포함해 약 50만 명이었고, 자원·강압·징집이 뒤섞여 만들어진 이 부대들과 친위대 경찰 부대 가운데 여럿이 동유럽과 발칸에서 전쟁범죄에 연루되었다.',
                en: 'In Norway Vidkun Quisling tried to seize power on 9 April 1940, with the German invasion in progress, in a radio-broadcast coup, but failed because the Germans sought to have the recognised government legitimise the occupation. On 1 February 1942 he became minister president of a government approved by the Germans, and before the war was over his surname had become a synonym for “collaborator” or “traitor” in several North European languages. Collaboration also wore uniform: by the end of the war the foreigners who served in the Waffen-SS numbered some 500,000, including those pressured into service or conscripted, and several of these units — raised through a mix of volunteering, coercion and conscription — and of the SS police formations were implicated in war crimes in Eastern Europe and the Balkans.',
                sources: [S.quisling, S.waffen],
            },
            {
                ko: '홀로코스트의 집행도 협력 정부와 현지 행정에 달려 있었다. 불가리아 정부는 자국이 점령한 그리스와 유고슬라비아 땅의 유대인 1만 1,000명을 넘겨 트레블링카에서 죽게 했지만, 국내 저명인사와 단체들의 반대로 전쟁 전 영토의 유대인 이송은 허락하지 않았다. 헝가리 정부는 1944년 3월 독일이 헝가리를 점령할 때까지 약 84만 6,000명의 유대인 대부분을 넘기지 않았다. 그러나 3월부터 7월 9일까지 43만 4,000명이 기차에 실려 대부분 아우슈비츠로 보내져 도착 즉시 살해되었다. 그 과정은 「[독일 점령하의 헝가리](' + ev('hungary-1944-1945') + ')」 항목에 있다.',
                en: 'The Holocaust, too, depended on collaborating governments and local administrations. The Bulgarian government deported 11,000 Jews from the parts of Greece and Yugoslavia it occupied, who were murdered at Treblinka, but because of widespread opposition from prominent individuals and groups within Bulgaria it did not allow the deportation of Jews from its prewar territory. Until the German occupation of March 1944, the Hungarian government did not deport very many of its approximately 846,000 Jews; between March and 9 July 1944, however, 434,000 were deported on trains, mostly to Auschwitz, where the great majority were murdered immediately. That story is told in [Hungary under German occupation](' + ev('hungary-1944-1945') + ').',
                sources: [S.holo],
            },
        ],
    },
    {
        heading: { ko: '점령지의 홀로코스트', en: 'The Holocaust in occupied Europe' },
        paragraphs: [
            {
                ko: '1941년부터 1945년까지 나치 독일과 그 협력자들은 독일 점령하 유럽에서 유대인 약 600만 명, 유럽 유대인의 약 3분의 2를 조직적으로 살해했다. 살인은 주로 동유럽 곳곳의 대량 총살과, 점령된 폴란드 땅의 절멸수용소 아우슈비츠비르케나우·트레블링카·베우제츠·소비보르·헤움노·마이다네크의 가스실에서 이루어졌다. 첫 절멸수용소인 헤움노는 병합된 바르텔란트에서 1941년 12월 가스 트럭으로 가동을 시작했고, 1942년 1월 20일 라인하르트 하이드리히가 주재한 반제 회의 뒤 유럽의 모든 유대인을 죽이는 「최종 해결」이 실행에 들어갔다.',
                en: 'From 1941 to 1945 Nazi Germany and its collaborators systematically murdered around six million Jews across German-occupied Europe, approximately two-thirds of Europe’s Jewish population. The killing was done primarily through mass shootings across Eastern Europe and in the gas chambers of the extermination camps in occupied Poland — Auschwitz-Birkenau, Treblinka, Belzec, Sobibor, Chełmno and Majdanek. The first, Chełmno in the annexed Wartheland, began operating in December 1941 with gas vans, and after the Wannsee Conference presided over by Reinhard Heydrich on 20 January 1942 the Final Solution to murder all the Jews of Europe was put into effect.',
                sources: [S.holo],
            },
            {
                ko: '폴란드에서는 유대인 학살과 함께 폴란드 사회의 지도층 제거가 진행되었다. 전쟁 전에 이미 만들어 둔 수배 명부는 「독일에 비우호적인」 폴란드 엘리트와 지식인 6만 1,000여 명을 올려 두었고, 성직자·공무원·의사·교사·언론인 수만 명이 처형되거나 수용소로 보내졌다. 대학 교수와 교사, 사제를 겨냥한 「AB 작전」, 크라쿠프 교수들을 체포한 「크라쿠프 특별작전」이 그 예다. 총독부 지역의 1939년 인구 가운데 400만 명이 1944년 말 소련군이 들어올 때까지 목숨을 잃었고, 그 가운데 200만 명에 이르는 유대인이 있었다.',
                en: 'In Poland the murder of the Jews went together with the destruction of Polish society’s leadership. Proscription lists prepared before the war identified more than 61,000 members of the Polish elite and intelligentsia deemed unfriendly to Germany, and tens of thousands — clergymen, officials, doctors, teachers, journalists — were executed or sent to camps, in operations such as the AB-Aktion against university professors, teachers and priests and Sonderaktion Krakau. Four million of the General Government’s 1939 population had lost their lives by the time Soviet forces entered the area in late 1944, among them perhaps as many as two million Jews.',
                sources: [S.polocc, S.gg],
            },
            {
                ko: '구출의 길이 열린 곳도 있었다. 덴마크에서는 독일 외교관 게오르크 페르디난트 두크비츠가 1943년 9월 28일 체포 계획을 사회민주당에 흘렸고, 저항운동과 시민들이 유대인 8,000명 가운데 7,500명을 바다 건너 중립국 스웨덴으로 피신시켰다. 이송된 464명을 위한 덴마크의 개입까지 더해 덴마크 유대인의 99%가 살아남았다. 폴란드에서는 1942년 9월 유대인 지원 비밀조직 「제고타」가 세워져, 전쟁에서 살아남은 폴란드 유대인의 절반, 5만 명이 넘는 이들을 어떤 식으로든 도왔다. 이탈리아 점령하의 남프랑스로도 비시 프랑스의 박해를 피해 유대인 수천 명이 옮겨 갔다.',
                en: 'In some places a way out opened. In Denmark the German diplomat Georg Ferdinand Duckwitz leaked word of the planned round-up to the Social Democratic leader Hans Hedtoft on 28 September 1943, and the resistance and ordinary citizens evacuated 7,500 of the country’s 8,000 Jews by sea to neutral Sweden; with Danish intercession for the 464 who were deported, 99 per cent of Denmark’s Jews survived. In Poland the Council to Aid Jews, Żegota, was founded in September 1942, and half of the Jews who survived the war — over 50,000 — were aided by it in some way. Many thousands of Jews also moved into the Italian zone of occupation in southern France to escape persecution in Vichy France.',
                sources: [S.danish, S.resist, S.itfr],
            },
        ],
    },
    {
        heading: { ko: '저항: 누가, 어떻게', en: 'Resistance: who and how' },
        paragraphs: [
            {
                ko: '저항은 비협조와 선전에서 추락한 조종사 숨기기, 도시 탈환을 위한 전투까지 여러 형태를 띠었다. 무장 저항에는 배급표와 신분증을 빼앗는 습격, 암살, 봉기, 게릴라전이 있었고, 비무장 저항에는 사보타주, 파업과 시위, 첩보, 지하 신문, BBC 방송 몰래 듣기, 강제노동과 이송을 피하는 사람 숨기기, 연합군 병사 탈출로, 문서 위조가 있었다. 조직된 저항에 참여한 사람은 소수였다. 서유럽에서는 인구의 1~3%로 추정되고, 점령이 훨씬 가혹했던 동유럽에서는 비율이 높아 폴란드는 10~15%에 이르렀다. 수동적 비협조는 훨씬 흔했다.',
                en: 'Resistance took many forms, from non-cooperation and propaganda to hiding crashed pilots and outright warfare to recapture towns. Armed resistance meant raids for food coupons and documents, assassinations, uprisings and guerrilla war; unarmed resistance meant sabotage, strikes and demonstrations, espionage, the underground press, covert listening to the BBC, hiding people from forced labour and deportation, escape lines for Allied servicemen and forged documents. Only a minority took part in organised resistance — an estimated one to three per cent of the population in Western Europe, more in the East where Nazi rule was harsher, some 10–15 per cent in Poland. Passive non-cooperation was much more common.',
                sources: [S.resist],
            },
            {
                ko: '저항운동은 정치적으로 크게 두 갈래였다. 하나는 거의 모든 나라에 있던 국제주의적이고 대개 공산당이 이끄는 반파시스트 저항이었고, 다른 하나는 나치 독일과 공산주의 모두에 맞선 민족주의 단체들이었다. 폴란드에서는 1939년 11월 17일 망명정부의 브와디스와프 시코르스키 장군의 명령으로 무장투쟁연맹이 세워져 1942년 2월 14일 국내군이 되었고, 1944년 여름 약 40만 명으로 유럽 최대의 저항 조직이 되었다. 유고슬라비아에서는 드라자 미하일로비치의 체트니크와 요시프 브로즈 티토의 파르티잔이, 그리스에서는 공산당이 이끄는 민족해방전선(EAM)과 다른 조직들이 따로 싸웠다. 그 경과는 「[유고슬라비아 파르티잔 전쟁](' + ev('yugoslav-partisans') + ')」과 「[그리스 저항과 12월 사건](' + ev('greek-resistance') + ')」 항목에 있다.',
                en: 'Politically the resistance movements fell into two broad streams: the internationalist, usually Communist-led anti-fascist resistance found in nearly every country, and nationalist groups that opposed both Nazi Germany and the Communists. In Poland the Union of Armed Struggle was created on 17 November 1939 on the orders of General Władysław Sikorski of the government-in-exile and became the Home Army on 14 February 1942; by the summer of 1944, at around 400,000 members, it was the largest resistance organisation in Europe. In Yugoslavia Draža Mihailović’s Chetniks and Josip Broz Tito’s Partisans, and in Greece the Communist-led National Liberation Front (EAM) and other organisations, fought separately; their course is followed in [The Yugoslav Partisan War](' + ev('yugoslav-partisans') + ') and [Greek Resistance and the Dekemvriana](' + ev('greek-resistance') + ').',
                sources: [S.resist, S.ak],
            },
            {
                ko: '공산당의 저항은 1941년 6월을 경계로 달라졌다. 프랑스 공산당은 처음에 이 전쟁을 제국주의 열강 사이의 싸움으로 본 소련의 공식 견해를 따라 중립을 지켰다가, 독일이 소련을 침공한 뒤 무장 저항으로 돌아섰다. 샤를 티용이 군사 부문을 맡은 의용유격대(FTP)가 그 무장 조직이었다. 다만 그 전에도 공산당이 앞장선 저항은 있었다. 1941년 2월 25일 비합법 네덜란드 공산당은 암스테르담 유대인 구역의 체포와 포그롬에 맞서 총파업을 조직했고, 이튿날까지 30만 명이 참여했다. 6월 이후에는 1941년 7월 7일 세르비아와 13일 몬테네그로에서 공산당이 시작한 봉기가 일어났고, 그해 가을 세르비아 서부의 「우지체 공화국」은 점령된 유럽에서 처음 해방된 땅이 되었다. 그리스의 그리스인민해방군(ELAS)은 1942년 6월 7일 첫 작전을 벌였다.',
                en: 'Communist resistance changed at June 1941. The French Communist Party was neutral at first, following the Soviet Union’s official view that the war was a struggle between imperialists, and turned to armed resistance after Germany invaded the Soviet Union; its armed organisation was the Francs-Tireurs et Partisans, with Charles Tillon in charge of military matters. Yet Communist-led resistance had come earlier too: on 25 February 1941 the outlawed Communist Party of the Netherlands organised a general strike against the arrests and pogroms in Amsterdam’s Jewish quarter, which 300,000 people had joined by the next day. After June came the Communist-initiated uprisings in Serbia on 7 July 1941 and in Montenegro six days later, and that autumn the Republic of Užice in western Serbia became the first part of occupied Europe to be liberated. In Greece ELAS began its actions against the occupiers on 7 June 1942.',
                sources: [S.ftp, S.feb, S.resist],
            },
            {
                ko: '저항운동은 연합국의 지원에 크게 기댔다. 영국은 1940년 7월 22일 점령지에서 저항의 기운을 키우고 반격 때 공개 투쟁에 나설 세력을 준비하려고 특수작전집행부(SOE)를 세웠다. 소련 파르티잔이나 프랑스 레지스탕스 같은 큰 조직도 1943년 말까지는 독일군 작전을 크게 방해하지 못했다고 평가되며, 그 군사적 효과는 지금도 논쟁거리다. 군사사가 에번 모즐리는 저항이 연합국의 전략 목표에 크게 이바지하지 못했다고 보는 반면, 예르겐 해스트루프는 저항이 특히 심리 면에서 전쟁의 흐름에 결정적인 영향을 주었다고 본다.',
                en: 'Resistance movements depended heavily on Allied support. Britain formed the Special Operations Executive on 22 July 1940 to develop a spirit of resistance in the occupied countries and to prepare fighters for open opposition when Britain returned to the continent. Even large networks such as the Soviet partisans and the French Resistance are assessed not to have significantly hampered German operations until late 1943, and their military effect is still debated: Evan Mawdsley holds that the resistance “did not do a great deal to achieve the strategic objectives” of the major Allied powers, while Jørgen Hæstrup argued that it “influenced the course of the War decisively”, particularly in the psychological sphere.',
                sources: [S.resist],
            },
            {
                ko: '절멸에 맞선 유대인의 저항도 있었다. 1943년 4월 19일 바르샤바 게토는 게토를 한 구역씩 파괴하라는 친위대 경찰 사령관 위르겐 슈트로프의 항복 요구를 거부하고 봉기했다. 싸움은 5월 16일까지 이어졌고, 슈트로프는 유대인 최소 5만 6,065명을 죽이거나 붙잡았으며 독일 측 사상자는 사망 16명을 포함한 110명이라고 보고했다. 같은 해 소비보르, 이듬해 아우슈비츠에서도 수감자 봉기가 일어났다.',
                en: 'Jews resisted extermination as well. On 19 April 1943 the Warsaw Ghetto refused to surrender to the SS and police commander Jürgen Stroop, who ordered the ghetto destroyed block by block; the fighting lasted until 16 May, and Stroop reported at least 56,065 Jews killed or captured and 110 German casualties, including 16 killed. Prisoners rose in Sobibor the same year and in Auschwitz in 1944.',
                sources: [S.wgu, S.resist],
            },
        ],
    },
    {
        heading: { ko: '보복의 논리', en: 'The logic of reprisal' },
        paragraphs: [
            {
                ko: '점령군은 저항을 집단 처벌로 다스렸다. 1941년 9월 16일 국방군 최고사령부는 빌헬름 카이텔이 서명한 히틀러의 명령을 내려, 점령지의 모든 공격을 「공산주의자의 소행」으로 보고 독일군 한 명이 죽으면 인질 100명, 다치면 50명을 쏘게 했다. 세르비아에서는 같은 방침이 이미 1941년 4월 28일부터 시행되고 있었다. 10월 21일 크라구예바츠에서 독일군은 고등학생 144명을 포함해 2,778~2,794명의 세르비아인 남성과 소년을 총살했다. 이 비율은 1943년 2월 절반으로 줄었다가 그해 안에 폐지되었다.',
                en: 'The occupiers met resistance with collective punishment. On 16 September 1941 the Wehrmacht High Command issued Hitler’s order, signed by Wilhelm Keitel, that all attacks in the occupied East were to be “regarded as being of communist origin” and that 100 hostages were to be shot for every German soldier killed and 50 for every one wounded; an identical policy had been in force in Serbia since 28 April 1941. On 21 October German soldiers shot between 2,778 and 2,794 mostly Serb men and boys in Kragujevac, including 144 high school students. The ratio was halved in February 1943 and dropped altogether later that year.',
                sources: [S.kragujevac],
            },
            {
                ko: '1941년 12월 7일 히틀러는 점령지의 정치 활동가와 저항 「협력자」를 가두거나 처형하거나 제국의 「밤과 안개」 속으로 사라지게 하라는 「밤과 안개 명령」을 내렸고, 카이텔은 이를 곧바로 시행 지침으로 내려보냈다. 1942년 5월 27일 프라하에서 망명 체코슬로바키아군의 얀 쿠비시와 요제프 가브치크가 보헤미아·모라비아 부보호관 하이드리히를 습격해 죽음에 이르게 하자, 6월 10일 리디체 마을의 15세 이상 남성 173명이 모두 총살되었다. 이 보복으로 죽은 체코인은 1만 5,000명이 넘었다.',
                en: 'On 7 December 1941 Hitler issued the Night and Fog decree, under which political activists and resistance “helpers” in the occupied territories were to be imprisoned, executed or made to disappear into the “night and fog” of the Reich; Keitel immediately passed it on as guidelines. When Jan Kubiš and Jozef Gabčík of the Czechoslovak army in exile attacked Heydrich, the Deputy Protector of Bohemia and Moravia, in Prague on 27 May 1942 and he died of his wounds, all 173 men aged 15 and over in the village of Lidice were shot on 10 June. More than fifteen thousand Czechs were killed in the reprisals.',
                sources: [S.nn, S.resist, S.lidice],
            },
            {
                ko: '파르티잔 토벌은 마을 전체를 겨냥했다. 1943년 12월 13일 국방군 제117엽병사단은 주변 산악의 그리스 저항군을 포위하는 작전 중에 칼라브리타의 남성 주민을 거의 모두 죽이고 마을을 불태웠다. 노르망디 상륙 나흘 뒤인 1944년 6월 10일에는 같은 날 두 곳에서 학살이 일어났다. 프랑스 오라두르쉬르글란에서는 무장친위대 중대가 여성과 어린이를 포함한 주민 642명을 죽였고, 그리스 디스토모에서는 파르티잔의 습격에 대한 보복으로 친위대가 남녀노소 228명을 죽였다.',
                en: 'Anti-partisan operations targeted whole villages. On 13 December 1943 the Wehrmacht’s 117th Jäger Division, in an operation to encircle Greek resistance fighters in the surrounding mountains, nearly exterminated the male population of Kalavryta and destroyed the town. On 10 June 1944, four days after D-Day, two massacres took place on the same day: at Oradour-sur-Glane in France a Waffen-SS company killed 642 civilians, women and children among them, and at Distomo in Greece SS troops killed 228 men, women and children in reprisal for a partisan attack on their convoy.',
                sources: [S.kalavryta, S.oradour, S.distomo],
            },
        ],
    },
    {
        heading: { ko: '해방과 청산, 1944~1945년', en: 'Liberation and reckoning, 1944–1945' },
        paragraphs: [
            {
                ko: '연합군이 다가오자 저항운동은 봉기로 해방에 직접 참여하려 했다. 파리에서는 몇 주에 걸친 파업 끝에 1944년 8월 19일 레지스탕스의 군사 조직인 프랑스 국내군(FFI)이 독일 수비대에 맞서 봉기했다. 임시정부 수반 샤를 드골은 연합군 군정과, 앙리 롤탕기 대령이 이끄는 공산당 계열 의용유격대의 통제되지 않는 봉기를 모두 앞지르려 파리 해방을 서둘렀다. 8월 25일 디트리히 폰 콜티츠가 독일 수비대를 항복시켰고, 같은 날 파리에 들어온 드골은 해방을 프랑스 인민의 공으로 돌렸다. 그 경과는 「[프랑스 레지스탕스와 해방](' + ev('french-resistance') + ')」 항목에 있다.',
                en: 'As Allied armies approached, resistance movements sought a direct share in liberation through uprisings. In Paris, after weeks of strikes, the French Forces of the Interior — the military structure of the Resistance — rose against the German garrison on 19 August 1944. Charles de Gaulle, head of the Provisional Government, pressed for the liberation of the city to pre-empt both Allied military rule and an uncontrolled uprising led by the Communist FTP under Colonel Henri Rol-Tanguy. Dietrich von Choltitz surrendered the garrison on 25 August, and de Gaulle, arriving the same day, credited the liberation to the French people themselves. The story is told in [The French Resistance and the Liberation of France](' + ev('french-resistance') + ').',
                sources: [S.paris],
            },
            {
                ko: '모든 봉기가 성공하지는 않았다. 폴란드 국내군은 「폭풍 작전」의 하나로 8월 1일 바르샤바에서 봉기했으나 10월 2일 진압되었고, 1943년 7월부터 국내군을 지휘한 타데우시 부르코모로프스키는 독일군에 항복했다(「[바르샤바 봉기](' + ev('warsaw-uprising') + ')」). 슬로바키아에서는 8월 29일 독일군의 진주에 맞서 군 일부가 요제프 티소의 협력 정권과 독일에 대항해 봉기했고, 중심지 반스카비스트리차는 10월 27일 함락되었다. 불가리아에서는 9월 9일 공산당이 이끈 조국전선이 친추축 정부를 무너뜨렸고, 1945년 5월 5일에는 연합군이 다가오는 가운데 프라하에서 봉기가 일어났다.',
                en: 'Not every rising succeeded. The Polish Home Army rose in Warsaw on 1 August as part of Operation Tempest and was crushed by 2 October, when Tadeusz Bór-Komorowski, its commander since July 1943, surrendered to the Germans ([Warsaw Uprising](' + ev('warsaw-uprising') + ')). In Slovakia parts of the army rose on 29 August against the German invasion and Jozef Tiso’s collaborationist regime; their centre, Banská Bystrica, fell on 27 October. In Bulgaria the Communist-led movement overthrew the pro-Axis government on 9 September, and on 5 May 1945, as Allied forces advanced, Prague rose.',
                sources: [S.resist, S.ak, S.snu],
            },
            {
                ko: '해방 뒤에는 청산이 따랐다. 프랑스에서는 레지스탕스와 군중이 밀고자·지방 관리·민병대원으로 의심받은 이들을 9,000~1만 명 즉결 처형했고, 「수평적 협력」을 했다는 여성 약 2만 명의 머리를 공개적으로 깎았다. 드골의 임시정부가 세운 특별법원은 1944~1951년 사형 6,763건(궐석 3,910건)을 선고했고, 출석 사형수 2,853명 가운데 약 73%가 감형되어 피에르 라발을 포함한 791명이 처형되었다. 5만 명 가까이는 새로 만든 「국민 모욕죄」로 공민권을 잃었다. 페탱은 사형을 선고받았으나 드골이 종신형으로 감형했다. 크비슬링은 1945년 10월 24일 총살되었고, 한스 프랑크는 뉘른베르크 재판에서 사형을 선고받아 1946년 10월 16일 교수형에 처해졌다.',
                en: 'Liberation brought a reckoning. In France local Resistance groups and crowds carried out an estimated 9,000 to 10,000 summary executions of suspected informants, municipal officials and members of the Milice, and publicly shaved the heads of some 20,000 women accused of “horizontal collaboration”. The courts set up by de Gaulle’s Provisional Government pronounced 6,763 death sentences between 1944 and 1951 (3,910 in absentia); about 73 per cent of the 2,853 sentenced in person were commuted, leaving 791 executions, Pierre Laval’s among them, and nearly 50,000 people lost their civic rights for the new offence of indignité nationale. Pétain was sentenced to death and had his sentence commuted to life imprisonment by de Gaulle. Quisling was shot on 24 October 1945, and Hans Frank, sentenced to death at Nuremberg, was hanged on 16 October 1946.',
                sources: [S.epur, S.quisling, S.gg],
            },
            {
                ko: '1945년 독일이 패하자 약 1,100만 명의 외국인이 「난민(DP)」으로 풀려났고, 그 대부분이 강제노동자와 전쟁포로였다. 소련으로 520만 명, 폴란드로 160만 명, 프랑스로 150만 명, 이탈리아로 90만 명이 돌아갔다. 점령의 경험과 저항의 분열은 전후 유럽 각국의 정치를 갈랐고, 동유럽에서 그것이 어떻게 이어졌는지는 「[동유럽 인민민주주의 정권의 수립](' + ev('eastern-europe-peoples-democracies') + ')」 항목이 다룬다.',
                en: 'Germany’s defeat in 1945 freed approximately 11 million foreigners classed as displaced persons, most of them forced labourers and prisoners of war; 5.2 million were repatriated to the Soviet Union, 1.6 million to Poland, 1.5 million to France and 900,000 to Italy. The experience of occupation and the divisions within the resistance shaped post-war politics across Europe; how they carried over in the East is covered in [The People’s Democracies of Eastern Europe](' + ev('eastern-europe-peoples-democracies') + ').',
                sources: [S.forced],
            },
        ],
    },
];

const event = buildEvent({
    id: 'axis-occupied-europe-1939-1945',
    title: { ko: '추축국 점령하의 유럽: 협력과 저항', en: 'Axis-occupied Europe: collaboration and resistance' },
    period: '1939–1945',
    sortOrder: 101,
    question: {
        ko: '1939년부터 1945년까지 나치 독일과 추축국은 유럽 각지를 어떤 방식으로 다스리고 수탈했으며, 점령지의 사람들은 누가 왜 협력하고 누가 어떻게 저항했는가?',
        en: 'How did Nazi Germany and its Axis partners rule and exploit the lands they occupied in Europe from 1939 to 1945, and who among the occupied collaborated, and who resisted, why and how?',
    },
    summary: {
        ko: '1941~1942년 절정기에 추축국은 유럽 대륙 인구의 절반 이상을 다스렸다. 지배 방식은 병합, 폴란드 총독부, 국가판무관부, 군정, 크비슬링·네디치·파벨리치·비시 정부 같은 협력 정권으로 제각각이었지만, 어디서나 점령은 수탈이었다. 「기아 계획」과 그리스의 대기근, 약 1,200만 명의 강제노동, 그리고 점령된 폴란드의 절멸수용소와 동유럽 곳곳의 대량 총살로 유대인 약 600만 명이 살해된 홀로코스트가 점령 체제 아래 이루어졌고, 협력 정부와 현지 행정, 무장친위대의 외국인 약 50만 명이 그 집행에 가담했다. 저항은 지하 신문과 파업에서 게릴라전과 봉기까지 이어졌고, 1941년 6월 이후 공산당이 이끄는 운동과 망명정부 계열 운동이 나란히, 때로는 서로 맞서며 커졌다. 점령군은 인질 처형 비율과 「밤과 안개 명령」, 리디체·크라구예바츠·오라두르 같은 학살로 보복했다. 1944~1945년 파리·바르샤바·슬로바키아·프라하의 봉기와 함께 점령은 끝났고, 해방된 나라들은 협력자 청산에 들어갔다.',
        en: 'At their peak in 1941–1942 the Axis powers ruled more than half of the continent’s population. Their methods varied — annexation, the General Government in Poland, Reichskommissariats, military administration and collaborating regimes such as Quisling’s, Nedić’s, Pavelić’s and Vichy — but everywhere occupation meant plunder. The Hunger Plan and the Greek famine, the forced labour of some 12 million people, and the Holocaust, in which about six million Jews were murdered in the extermination camps of occupied Poland and in mass shootings across Eastern Europe, all took place under occupation, carried out with the help of collaborating governments, local administrations and some 500,000 foreigners in the Waffen-SS. Resistance ranged from the underground press and strikes to guerrilla war and uprisings, and after June 1941 Communist-led movements grew alongside, and sometimes against, those loyal to the governments-in-exile. The occupiers answered with hostage quotas, the Night and Fog decree and massacres such as Lidice, Kragujevac and Oradour. Occupation ended in 1944–1945 amid risings in Paris, Warsaw, Slovakia and Prague, and the liberated countries turned to purging collaborators.',
    },
    outcome: {
        ko: '1945년 점령이 끝났을 때 약 1,100만 명의 강제노동자·전쟁포로가 난민으로 남았고, 유럽 유대인의 3분의 2가 살해된 뒤였다. 프랑스의 즉결 처형과 특별법원, 크비슬링과 한스 프랑크의 처형처럼 각국은 협력자를 처벌했지만, 그 범위와 방식은 나라마다 달랐다. 저항운동 안의 분열은 해방 뒤에도 이어졌다. 그리스에서는 1944년 12월 아테네 시가전으로, 유고슬라비아와 알바니아에서는 공산당 파르티잔의 집권으로, 폴란드에서는 국내군과 소련이 후원한 정부의 대립으로 나타났다. 저항의 기억은 전후 프랑스·이탈리아 공산당의 정치적 위신과 동유럽 새 정권의 정통성 주장의 바탕이 되었다.',
        en: 'When occupation ended in 1945, some 11 million forced labourers and prisoners of war were left as displaced persons, and two-thirds of Europe’s Jews had been murdered. Every country punished collaborators — summary executions and special courts in France, the executions of Quisling and Hans Frank — but in different measure and by different means. The divisions within the resistance outlasted liberation: in Greece they led to street fighting in Athens in December 1944, in Yugoslavia and Albania to the Communist partisans taking power, and in Poland to the conflict between the Home Army and the Soviet-backed government. The memory of resistance underpinned the political standing of the post-war French and Italian Communist parties and the claims to legitimacy of the new regimes in Eastern Europe.',
    },
    sections,
    timeline: [
        ['1939.10.26', '폴란드 총독부', 'General Government', '서부 폴란드를 병합한 독일이 나머지 땅에 한스 프랑크의 총독부를 세웠다.', 'Having annexed western Poland, Germany set up Hans Frank’s General Government in the rest.', ['poland', 'germany'], P(50.0614, 19.9366, '크라쿠프', 'Kraków')],
        ['1940.04.09', '크비슬링의 방송 쿠데타', 'Quisling’s radio coup', '독일의 노르웨이 침공 중 크비슬링이 라디오로 권력을 잡으려다 실패했다.', 'During the German invasion of Norway Quisling tried and failed to seize power by radio.', ['norway', 'germany']],
        ['1940.07.22', '특수작전집행부 창설', 'SOE founded', '영국이 점령지 저항을 키우고 지원할 특수작전집행부를 세웠다.', 'Britain created the Special Operations Executive to foster and supply resistance in occupied Europe.', 'uk'],
        ['1940.10.24', '몽투아르 회담', 'Montoire meeting', '페탱이 히틀러를 만난 뒤 독일과의 「협력」을 받아들인다고 알렸다.', 'After meeting Hitler, Pétain announced that he accepted “collaboration” with Germany.', ['france', 'germany']],
        ['1941.02.25', '2월 파업', 'February strike', '네덜란드 공산당이 유대인 체포에 맞선 총파업을 조직해 30만 명이 참여했다.', 'The Dutch Communist Party organised a general strike against the persecution of Jews; 300,000 joined.', ['netherlands', 'germany'], P(52.3676, 4.9041, '암스테르담', 'Amsterdam')],
        ['1941.04.10', '크로아티아 독립국', 'Independent State of Croatia', '점령된 유고슬라비아에 우스타샤의 크로아티아 독립국이 세워졌다.', 'The Ustaše state was set up in occupied Yugoslavia.', ['yugoslavia', 'germany', 'italy']],
        ['1941.05.02', '기아 계획', 'Hunger Plan', '독일 차관 회의가 소련 점령지의 식량 수탈과 인위적 기근을 계획했다.', 'A meeting of German state secretaries planned the seizure of Soviet food and an artificial famine.', ['germany', 'soviet']],
        ['1941.07.07', '세르비아 봉기', 'Serbian uprising', '공산당이 시작한 봉기가 세르비아에서, 13일에는 몬테네그로에서 일어났다.', 'Communist-initiated uprisings broke out in Serbia and, on the 13th, in Montenegro.', ['yugoslavia', 'germany', 'italy']],
        ['1941.10.21', '크라구예바츠 학살', 'Kragujevac massacre', '인질 처형 비율에 따라 독일군이 약 2,800명을 총살했다.', 'Applying the hostage ratio, German troops shot nearly 2,800 people.', ['yugoslavia', 'germany'], P(44.0128, 20.9114, '크라구예바츠', 'Kragujevac')],
        ['1941.12.07', '밤과 안개 명령', 'Night and Fog decree', '점령지의 저항 혐의자를 흔적 없이 사라지게 하라는 히틀러의 명령이 내려졌다.', 'Hitler ordered suspected resisters in the occupied territories to vanish without trace.', 'germany'],
        ['1942.01.20', '반제 회의', 'Wannsee Conference', '하이드리히가 주재한 회의 뒤 유럽 유대인 전부를 죽이는 「최종 해결」이 실행되었다.', 'After the conference chaired by Heydrich the Final Solution was put into effect.', 'germany'],
        ['1942.06.10', '리디체 학살', 'Lidice massacre', '하이드리히 습격의 보복으로 리디체의 남성 173명이 총살되었다.', 'In reprisal for the attack on Heydrich, 173 men of Lidice were shot.', ['czechoslovakia', 'germany'], P(50.1433, 14.1919, '리디체', 'Lidice')],
        ['1943.02.16', '강제노동징용법', 'STO law', '비시 정부가 20세 이상 남성 전부를 독일 노동 징용 대상으로 삼았다.', 'Vichy made all men over 20 liable to labour service in Germany.', ['france', 'germany']],
        ['1943.04.19', '바르샤바 게토 봉기', 'Warsaw Ghetto Uprising', '게토가 항복을 거부하고 5월 16일까지 싸웠다.', 'The ghetto refused to surrender and fought until 16 May.', ['poland', 'germany']],
        ['1943.10', '덴마크 유대인 구출', 'Rescue of the Danish Jews', '유대인 8,000명 가운데 7,500명이 바다 건너 스웨덴으로 피신했다.', 'Some 7,500 of Denmark’s 8,000 Jews were taken across the sea to Sweden.', ['denmark', 'sweden', 'germany']],
        ['1943.12.13', '칼라브리타 학살', 'Kalavryta massacre', '독일군이 칼라브리타의 남성 주민을 거의 모두 죽이고 마을을 불태웠다.', 'German troops killed nearly all the men of Kalavryta and destroyed the town.', ['greece', 'germany'], P(38.0322, 22.1122, '칼라브리타', 'Kalavryta')],
        ['1944.06.10', '오라두르와 디스토모', 'Oradour and Distomo', '같은 날 프랑스에서 642명, 그리스에서 228명이 친위대에 학살되었다.', 'On the same day SS troops massacred 642 people in France and 228 in Greece.', ['france', 'greece', 'germany'], P(45.9286, 1.0353, '오라두르쉬르글란', 'Oradour-sur-Glane')],
        ['1944.08.19', '파리 봉기', 'Paris uprising', '프랑스 국내군이 봉기했고 25일 독일 수비대가 항복했다.', 'The French Forces of the Interior rose; the German garrison surrendered on the 25th.', ['france', 'germany'], P(48.8566, 2.3522, '파리', 'Paris')],
        ['1944.08.29', '슬로바키아 민족봉기', 'Slovak National Uprising', '독일군 진주에 맞선 봉기가 10월 27일 반스카비스트리차 함락으로 꺾였다.', 'The rising against the German invasion was broken with the fall of Banská Bystrica on 27 October.', ['czechoslovakia', 'germany'], P(48.7363, 19.1462, '반스카비스트리차', 'Banská Bystrica')],
        ['1945.05.05', '프라하 봉기', 'Prague uprising', '연합군이 다가오는 가운데 체코 저항운동이 프라하에서 봉기했다.', 'As Allied forces approached, the Czech resistance rose in Prague.', ['czechoslovakia', 'germany']],
    ],
    locations: [
        ['바르샤바', 'Warsaw', 52.2297, 21.0122, 'main'],
        ['크라쿠프', 'Kraków', 50.0614, 19.9366, 'place'],
        ['파리', 'Paris', 48.8566, 2.3522, 'place'],
        ['암스테르담', 'Amsterdam', 52.3676, 4.9041, 'place'],
        ['크라구예바츠', 'Kragujevac', 44.0128, 20.9114, 'place'],
        ['리디체', 'Lidice', 50.1433, 14.1919, 'place'],
        ['칼라브리타', 'Kalavryta', 38.0322, 22.1122, 'place'],
    ],
    countries: ['germany', 'italy', 'poland', 'france', 'netherlands', 'norway', 'denmark', 'greece', 'yugoslavia', 'czechoslovakia', 'soviet', 'uk', 'sweden', 'hungary', 'bulgaria'],
    relations: { related: ['great-patriotic-war', 'eastern-europe-peoples-democracies', 'nazi-soviet-pact'] },
    sides: [
        { id: 'occupiers', label: { ko: '점령국과 협력 정권', en: 'The occupiers and collaborating regimes' } },
        { id: 'resistance', label: { ko: '저항운동과 망명정부', en: 'Resistance movements and governments-in-exile' } },
    ],
    people: [
        ['adolf-hitler', 'leader', '독일 총통', 'German Führer', '서부 폴란드 병합을 포고하고 인질 처형 명령과 「밤과 안개 명령」을 내렸다.', 'Decreed the annexation of western Poland and issued the hostage order and the Night and Fog decree.', 'occupiers'],
        ['benito-mussolini', 'leader', '이탈리아 총리', 'Italian prime minister', '크로아티아 독립국을 후원했고, 이탈리아군은 프랑스 남동부·유고슬라비아·그리스의 점령 구역을 맡았다.', 'Backed the Independent State of Croatia; Italian forces held occupation zones in south-eastern France, Yugoslavia and Greece.', 'occupiers'],
        ['hermann-goring', 'executor', '제국 원수', 'Reichsmarschall', '1942년 8월 점령지 지휘관들에게 「독일인이 굶지 않는 한 그들은 죽게 내버려 두라」고 썼다.', 'Wrote to occupation chiefs in August 1942: “Let them perish so long as no German starves.”', 'occupiers'],
        ['heinrich-himmler', 'executor', '친위대 전국지도자', 'Reichsführer-SS', '바르텔란트의 첫 절멸수용소 헤움노 설치를 승인했다.', 'Approved the first extermination camp, Chełmno in the Wartheland.', 'occupiers'],
        ['reinhard-heydrich', 'executor', '국가보안본부장, 보헤미아·모라비아 부보호관', 'Head of the RSHA; Deputy Protector of Bohemia and Moravia', '반제 회의를 주재했고, 1942년 프라하에서 습격당해 숨지자 리디체 학살이 뒤따랐다.', 'Chaired the Wannsee Conference; his assassination in Prague in 1942 was followed by the Lidice massacre.', 'occupiers'],
        ['alfred-rosenberg', 'executor', '동부 점령지 장관', 'Reich Minister for the Occupied Eastern Territories', '소련 점령지를 여러 국가판무관부로 나누어 다스리자고 제안했다.', 'Proposed administering the conquered Soviet lands as separate Reichskommissariats.', 'occupiers'],
        ['wilhelm-keitel', 'executor', '국방군 최고사령부 총장', 'Chief of the OKW', '인질 100 대 50의 처형 명령에 서명하고 「밤과 안개 명령」을 시행 지침으로 내려보냈다.', 'Signed the order setting the 100:50 hostage ratio and passed on the Night and Fog decree as guidelines.', 'occupiers'],
        ['philippe-petain', 'participant', '비시 프랑스 국가원수', 'Head of State of Vichy France', '몽투아르에서 히틀러를 만난 뒤 독일과의 「협력」을 선언했고, 해방 뒤 사형 선고가 종신형으로 감형되었다.', 'Declared “collaboration” with Germany after meeting Hitler at Montoire; his death sentence was commuted after the Liberation.', 'occupiers'],
        ['pierre-laval', 'participant', '비시 정부 총리', 'Head of the Vichy government', '노동자 교대(relève)를 발표하고 강제노동징용법에 서명했으며, 해방 뒤 처형되었다.', 'Announced the relève and signed the STO law; executed after the Liberation.', 'occupiers'],
        ['dietrich-von-choltitz', 'executor', '파리 군정사령관', 'Military governor of Paris', '1944년 8월 25일 파리의 독일 수비대를 항복시켰다.', 'Surrendered the German garrison of Paris on 25 August 1944.', 'occupiers'],
        ['wladyslaw-sikorski', 'leader', '폴란드 망명정부의 장군', 'General of the Polish government-in-exile', '1939년 11월 무장투쟁연맹을 세우게 했고, 이 조직이 국내군이 되었다.', 'Ordered the creation of the Union of Armed Struggle in November 1939, which became the Home Army.', 'resistance'],
        ['tadeusz-bor-komorowski', 'leader', '국내군 사령관', 'Commander of the Home Army', '1943년 7월부터 국내군을 지휘했고 바르샤바 봉기가 진압되자 항복했다.', 'Commanded the Home Army from July 1943 and surrendered when the Warsaw Uprising was crushed.', 'resistance'],
        ['charles-de-gaulle', 'leader', '프랑스 임시정부 수반', 'Head of the Provisional Government of the French Republic', '파리 해방을 서둘러 8월 25일 입성했고, 그의 임시정부가 협력자 재판을 제도화했다.', 'Pressed for the liberation of Paris and entered it on 25 August; his government set up the courts that tried collaborators.', 'resistance'],
        ['charles-tillon', 'leader', '의용유격대 군사 책임자', 'Military chief of the FTP', '프랑스 공산당의 무장 조직 의용유격대의 군사 부문을 맡았다.', 'Was in charge of military matters for the French Communist Party’s Francs-Tireurs et Partisans.', 'resistance'],
        ['henri-rol-tanguy', 'leader', '프랑스 국내군 파리 지역 사령관', 'FFI regional commander in Paris', '1944년 8월 18일 총파업과 총동원을 호소해 파리 봉기를 일으켰다.', 'Called a general strike and mass mobilisation on 18 August 1944, turning the walkouts into the Paris insurrection.', 'resistance'],
        ['josip-broz-tito', 'leader', '유고슬라비아 파르티잔 총사령관', 'Commander-in-chief of the Yugoslav Partisans', '파르티잔 최고사령부를 이끌고 네레트바 전투에서 본대를 빼냈으며, 1944년 그를 노린 드바르 공수 습격의 표적이 되었다.', 'Led the Partisan Supreme Command that brought the main force out at the Neretva, and was the target of the 1944 airborne raid on Drvar.', 'resistance'],
        ['draza-mihailovic', 'leader', '체트니크 지도자', 'Chetnik leader', '세르비아의 체트니크를 이끌었고, 1944년 미국의 추락 조종사 구출 작전을 도왔다.', 'Led the Chetniks in Serbia and aided the 1944 US operation to evacuate downed airmen.', 'resistance'],
        ['aris-velouchiotis', 'leader', '그리스인민해방군(ELAS)을 일으킨 공산당원', 'Communist who launched ELAS', '1942년 2월 민족해방전선의 승인을 받아 무장 저항을 준비했고, 이것이 ELAS가 되었다.', 'Was authorised by EAM in February 1942 to prepare armed resistance, which became ELAS.', 'resistance'],
    ],
});

module.exports = { event };
