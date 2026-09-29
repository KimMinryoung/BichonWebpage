#!/usr/bin/env node
// Second Indochina War event batch (2026-09-29). Source of truth for
// ../second-indochina-war-20260929.json and ../second-indochina-war-20260929-people.json.
// Edit here, run `node build.js`, commit the JSON with it.
// Scope: 1955 to the Paris Peace Accords and their collapse. The 1975 spring
// offensive and the fall of Saigon belong to vietnam-reunification-1975-1976;
// the last section only points there.
const fs = require('fs');
const path = require('path');

const W = t => 'https://en.wikipedia.org/wiki/' + t;
const S = {
    war: W('Vietnam_War'),
    referendum: W('1955_State_of_Vietnam_referendum'),
    vietcong: W('Viet_Cong'),
    trail: W('Ho_Chi_Minh_trail'),
    hamlet: W('Strategic_Hamlet_Program'),
    apBac: W('Battle_of_Ap_Bac'),
    buddhist: W('Buddhist_crisis'),
    coup1963: W('1963_South_Vietnamese_coup_d%27%C3%A9tat'),
    tonkin: W('Gulf_of_Tonkin_incident'),
    tonkinResolution: W('Gulf_of_Tonkin_Resolution'),
    rollingThunder: W('Operation_Rolling_Thunder'),
    tet: W('Tet_Offensive'),
    hue: W('Hue_massacre'),
    myLai: W('My_Lai_massacre'),
    opposition: W('Opposition_to_United_States_involvement_in_the_Vietnam_War'),
    vietnamization: W('Vietnamization'),
    cambodianCoup: W('1970_Cambodian_coup_d%27%C3%A9tat'),
    cambodianCampaign: W('Cambodian_campaign'),
    lamSon: W('Operation_Lam_Son_719'),
    easter: W('Easter_Offensive'),
    linebacker2: W('Operation_Linebacker_II'),
    paris: W('Paris_Peace_Accords'),
    leDucTho: W('L%C3%AA_%C4%90%E1%BB%A9c_Th%E1%BB%8D'),
    laos: W('Laotian_Civil_War'),
    casualties: W('Vietnam_War_casualties'),
    ranchHand: W('Operation_Ranch_Hand'),
};

const sections = [
    {
        heading: { ko: '분단 뒤의 두 국가(1954~1959)', en: 'Two states after partition (1954–1959)' },
        paragraphs: [
            {
                ko: '1954년 제네바 협정은 프랑스와 베트민의 전쟁을 끝냈지만, 국제적으로 승인된 두 베트남 정부의 대립은 풀지 못한 채 17도선에서 나라를 잠정적으로 갈랐다. 300일의 이주 기간에 북부 주민 최대 100만 명이 남쪽으로 내려갔고, 그 가운데 가톨릭 신자가 적어도 50만 명이었다. 베트민 전투원 10만여 명은 「집결」을 위해 북쪽으로 올라갔고, 남부에는 간부 5천~1만 명이 남았다. 협정이 약속한 1956년 통일 선거는 치러지지 않았고, 1957년 국제감시위원회는 남북 어느 쪽도 휴전 합의를 지키지 않아 공정한 선거가 불가능하다고 보고했다.',
                en: 'The Geneva Accords of 1954 ended the war between France and the Viet Minh but left the conflict between two internationally recognised Vietnamese governments unresolved, temporarily dividing the country at the 17th parallel. During the 300-day relocation period up to one million northerners moved south, at least 500,000 of them Catholics. Over 100,000 Viet Minh fighters went north for “regroupment”, leaving 5,000 to 10,000 cadres in the south. The reunification elections promised for 1956 were never held; in 1957 the International Control Commission reported that fair elections were impossible because neither side had honoured the armistice.',
                sources: [S.war],
            },
            {
                ko: '남쪽에서 응오딘지엠은 1955년 4~6월 까오다이·호아하오와 빈쑤옌 같은 무장 세력을 제압했다. 10월 그의 동생 응오딘뉴가 관리한 국민투표에서 98%를 얻어 바오다이를 몰아냈고, 사이공에서는 유권자 수의 133%가 찬성표로 집계되었다. 지엠은 베트남 공화국을 선포하고 대통령이 되었다. 1955년 7월 시작된 「공산주의자 고발」 운동은 남부에 남은 간부를 찾아 체포했고, 1956년에는 공산주의 활동에 사형이 도입되었다. 북베트남 정부는 1957년 11월까지 6만 5천여 명이 투옥되고 2,148명이 살해되었다고 주장했으며, 1959년 정치범은 4만 명에 이르렀다. 1959년에는 정치적 폭력을 사형으로 다스리는 법 10/59호가 제정되었다.',
                en: 'In the south, Ngô Đình Diệm crushed the Cao Đài, Hòa Hảo and Bình Xuyên armed groups in April–June 1955. In October he ousted Bảo Đại in a referendum run by his brother Ngô Đình Nhu, being credited with 98 per cent and, in Saigon, with votes equal to 133 per cent of the electorate. Diệm proclaimed the Republic of Vietnam with himself as president. The “Denounce the Communists” campaign launched in July 1955 hunted and arrested the cadres left in the south, and in 1956 communist activity was made a capital offence. The North Vietnamese government claimed that by November 1957 over 65,000 people had been imprisoned and 2,148 killed, and political prisoners numbered 40,000 by 1959. In 1959 Law 10/59 made political violence punishable by death.',
                sources: [S.war, S.referendum],
            },
            {
                ko: '북쪽의 베트남 노동당은 1953~1956년 토지개혁을 추진했다. 처형된 사람의 수는 학자들 사이에서 5만 명 정도로 받아들여지며, 헝가리 외교 문서는 적어도 1만 3,500명으로 본다. 1956년 하노이 지도부는 과오를 인정하고 「오류 시정」에 나서 많은 토지를 원래 주인에게 돌려주었고, 같은 해 지식인들의 잡지 『냔반』과 『자이펌』을 억눌렀다. 남부 지도자 레주언은 1956년 3월 남부 봉기를 되살리자는 「남으로 가는 길」을 정치국에 냈지만, 대결을 원하지 않은 중국과 소련 때문에 받아들여지지 않았다. 1959년 1월 당은 남부에서의 「인민전쟁」을 승인했고, 5월 호찌민 루트를 정비할 559단이 창설되었다.',
                en: 'In the north, the Vietnam Workers’ Party carried out a land reform in 1953–1956. Scholars have come to accept a figure of about 50,000 executions, while Hungarian diplomatic documents suggest at least 13,500. In 1956 the Hanoi leadership admitted excesses, launched a “correction of errors” and returned much of the land to its owners, and in the same year suppressed the intellectuals’ periodicals Nhân văn and Giai phẩm. The southern leader Lê Duẩn presented “The Road to the South”, a plan to revive the southern insurgency, to the Politburo in March 1956, but it was rejected because China and the Soviet Union opposed confrontation. In January 1959 the party approved a “people’s war” in the south, and in May Group 559 was set up to develop the Ho Chi Minh trail.',
                sources: [S.war, S.trail],
            },
        ],
    },
    {
        heading: { ko: '민족해방전선과 지엠 정권의 몰락(1960~1963)', en: 'The Liberation Front and the fall of Diệm (1960–1963)' },
        paragraphs: [
            {
                ko: '1960년 9월 베트남 노동당 제3차 당대회는 남부 민족해방전선의 창설을 승인하면서 당의 지휘를 드러내지 않기로 했다. 12월 캄보디아의 메못에서 창설된 민족해방전선(미국과 사이공 정부는 「베트콩」이라 불렀다)은 비공산주의자까지 포함한 반정부 세력을 묶으려 했고, 미국 고문단과 영향력의 철수, 토지개혁과 정부의 자유화, 연립정부와 베트남의 중립화를 내걸었다. 반군과 정부군의 충돌은 1960년 1월 180건에서 9월 545건으로 늘었다.',
                en: 'In September 1960 the Third Congress of the Vietnam Workers’ Party authorised the creation of a National Liberation Front in the south while concealing the party’s control. Founded in December at Memot in Cambodia, the Front (called the “Viet Cong” by the United States and the Saigon government) sought to unite all anti-government forces, non-communists included, and stressed the withdrawal of American advisers and influence, land reform and liberalisation of the government, a coalition government and the neutralisation of Vietnam. Clashes between insurgents and government forces rose from 180 in January 1960 to 545 in September.',
                sources: [S.war, S.vietcong],
            },
            {
                ko: '케네디 정부는 전투 병력 파견은 거부했지만 군사 원조를 늘려, 아이젠하워 때 900명이던 군사고문단을 1963년 11월까지 1만 6천 명으로 키웠다. 1962년 시작된 전략촌 계획은 농민을 요새화된 마을로 강제 이주시켜 게릴라와 떼어 놓으려 했으나, 1963년 11월 무렵 힘을 잃고 1964년 끝났다. 같은 해 7월에는 14개국이 라오스 중립에 관한 국제 협정에 서명했다. 1963년 1월 2일 압박 전투에서 민족해방전선 부대는 훨씬 크고 잘 무장한 남베트남군을 물리쳤다. 남베트남군은 83명과 미군 헬리콥터 5대를 잃었고, 민족해방전선의 전사자는 18명이었다.',
                en: 'The Kennedy administration refused to send combat troops but increased military aid, raising the adviser contingent from Eisenhower’s 900 to 16,000 by November 1963. The Strategic Hamlet Program begun in 1962 forcibly resettled peasants into fortified villages to separate them from the guerrillas, but it had waned by November 1963 and ended in 1964. In July 1962 fourteen nations signed the International Agreement on the Neutrality of Laos. At the Battle of Ấp Bắc on 2 January 1963 Front forces defeated a much larger and better-equipped South Vietnamese force, which lost 83 soldiers and five US helicopters against 18 Front dead.',
                sources: [S.war, S.hamlet, S.apBac, S.laos],
            },
            {
                ko: '1963년 5월 후에에서 석가탄신일에 불교기 게양 금지에 항의하던 불교도 9명이 총격으로 숨지면서 불교도 위기가 시작되었다. 6월 11일 승려 틱꽝득이 사이공의 교차로에서 분신했고, 8월 응오딘뉴에게 충성하는 특수부대가 사원들을 습격했다. 미국 국무부는 쿠데타를 부추기는 쪽이었고, 중앙정보국은 지엠 제거를 계획하던 장군들에게 미국이 반대하지 않고 원조도 끊지 않겠다고 알렸다. 즈엉반민 장군이 이끈 쿠데타는 11월 1일 시작되었고, 이튿날 지엠과 응오딘뉴가 붙잡혀 살해되었다. 그 뒤 남베트남은 군사정부가 잇달아 뒤바뀌는 혼란에 빠졌다.',
                en: 'In May 1963 nine Buddhists protesting a ban on flying the Buddhist flag on Vesak were shot dead in Huế, starting the Buddhist crisis. On 11 June the monk Thích Quảng Đức burned himself to death at a Saigon intersection, and in August special forces loyal to Ngô Đình Nhu raided pagodas. The US State Department favoured encouraging a coup, and the CIA told generals planning to remove Diệm that the United States would neither oppose them nor cut off aid. The coup led by General Dương Văn Minh began on 1 November; the next day Diệm and Nhu were captured and killed. South Vietnam then fell into instability as one military government toppled another.',
                sources: [S.buddhist, S.coup1963, S.war],
            },
        ],
    },
    {
        heading: { ko: '통킹만에서 지상전으로(1964~1967)', en: 'From the Gulf of Tonkin to the ground war (1964–1967)' },
        paragraphs: [
            {
                ko: '1964년 8월 2일 남베트남 특공대의 북부 해안 기습을 지원하던 미 구축함 매덕스호가 통킹만에서 북베트남 어뢰정과 교전했다. 이틀 뒤 두 번째 공격이 보고되었지만, 2005년 기밀 해제된 문서는 8월 4일의 공격이 없었고 국가안보국이 공격이 있었던 것처럼 정보를 왜곡했음을 보여 주었다. 8월 7일 미국 의회는 하원 416 대 0, 상원 88 대 2로 통킹만 결의를 통과시켜, 대통령에게 「미군에 대한 어떤 무력 공격도 격퇴하고 추가 침략을 막기 위해 필요한 모든 조치」를 취할 권한을 주었다. 존슨은 선전포고 없이 전쟁을 넓히는 근거로 이 결의를 썼다.',
                en: 'On 2 August 1964 the destroyer USS Maddox, supporting South Vietnamese commando raids on the northern coast, exchanged fire with North Vietnamese torpedo boats in the Gulf of Tonkin. A second attack was reported two days later, but a document declassified in 2005 showed that there was no attack on 4 August and that the National Security Agency had skewed intelligence to suggest one. On 7 August Congress passed the Gulf of Tonkin Resolution, 416–0 in the House and 88–2 in the Senate, empowering the president “to take all necessary measures to repel any armed attack against the forces of the United States and to prevent further aggression”. Johnson relied on it to expand the war without a declaration of war.',
                sources: [S.tonkin, S.tonkinResolution, S.war],
            },
            {
                ko: '1965년 3월 2일 북베트남 폭격 작전 「롤링 선더」가 시작되어 1968년 11월 2일까지 이어졌고, 3년 동안 100만 톤의 폭탄과 미사일이 북부에 떨어졌다. 3월 8일 미 해병대 3,500명이 다낭 근처에 상륙하면서 미국의 지상전이 시작되었고, 병력은 그해 12월 20만 명 가까이로 늘었다. 남베트남 주둔 미군 사령관 웨스트모얼랜드는 미군이 직접 적을 찾아 섬멸하는 소모전을 추진했고, 그 성과는 사살 집계로 측정되었다. 1965년 11월 이아드랑 전투는 미군과 북베트남 정규군의 첫 대규모 전투였다. 1967년까지 남베트남에서 200만 명이 국내 피난민이 되었다.',
                en: 'Operation Rolling Thunder, the bombing of North Vietnam, began on 2 March 1965 and lasted until 2 November 1968, dropping a million tons of bombs, rockets and missiles on the north over three years. On 8 March 3,500 US Marines landed near Da Nang, beginning America’s ground war; by December the deployment had risen to nearly 200,000. General Westmoreland, commanding US forces in the south, pursued an attrition war in which American troops sought out and destroyed the enemy, with success measured by body count. The Battle of Ia Drang in November 1965 was the first major clash between US forces and the North Vietnamese army. By 1967 the war had made two million South Vietnamese internal refugees.',
                sources: [S.rollingThunder, S.war],
            },
            {
                ko: '1965년 중반 응우옌까오끼가 총리, 응우옌반티에우가 국가원수가 되면서 사이공의 정치는 안정되기 시작했고, 티에우는 1967년 부정 선거로 대통령이 되었다. 미국은 동남아시아조약기구 동맹국에 파병을 요청해 오스트레일리아·뉴질랜드·타이·필리핀이 응했고, 한국은 경제적 보상을 받는 조건으로 참전했다. 캐나다와 영국은 파병 요청을 거절했다. 라오스에서는 1964년 12월 수반나 푸마 총리의 동의 아래 호찌민 루트 폭격이 시작되었고, 1964~1973년 라오스에 떨어진 폭탄 200만 톤은 인구 대비 역사상 가장 많은 양이다.',
                en: 'Saigon’s politics began to stabilise in mid-1965 with Air Marshal Nguyễn Cao Kỳ as prime minister and General Nguyễn Văn Thiệu as head of state, and Thiệu became president after rigged elections in 1967. Washington asked its SEATO allies for troops: Australia, New Zealand, Thailand and the Philippines agreed, and South Korea joined in return for economic compensation, while Canada and Britain declined. In Laos, bombing of the Ho Chi Minh trail began in December 1964 with Prime Minister Souvanna Phouma’s consent; the two million tons dropped on Laos between 1964 and 1973 make it the most heavily bombed country in history per person.',
                sources: [S.war],
            },
        ],
    },
    {
        heading: { ko: '사회주의 진영의 지원과 중소분열', en: 'Socialist-bloc aid and the Sino-Soviet split' },
        paragraphs: [
            {
                ko: '1960년부터 베트남 노동당 정치국의 레주언과 응우옌찌타인은 흐루쇼프의 평화공존 노선에 반대했고, 1963년 하노이는 평화공존을 전략 원칙으로 받아들이지 않는다고 공식화했다. 같은 해 중소분열이 깊어지자 북베트남 지도부는 더 공세적인 전쟁에 대한 중국의 지지를 얻어 냈고, 베이징은 소련의 「수정주의」를 비판하며 하노이의 남부 전쟁을 갈수록 지지했다. 1961~1963년 약 4만 명의 병력이 남부로 들어갔다.',
                en: 'From 1960 Lê Duẩn and Nguyễn Chí Thanh in the Workers’ Party Politburo opposed Khrushchev’s policy of peaceful coexistence, and in 1963 Hanoi formally rejected peaceful coexistence as a strategic principle. As the Sino-Soviet split deepened that year, the North Vietnamese leaders obtained Chinese assurances of support for a more aggressive war, and Beijing, denouncing Soviet “revisionism”, increasingly endorsed Hanoi’s war in the south. About 40,000 troops infiltrated the south in 1961–1963.',
                sources: [S.war],
            },
            {
                ko: '중국은 1962년 여름 소총과 총포 9만 정을 무상으로 주기로 했고, 1965년부터 방공부대와 공병대를 보내 미군 폭격으로 부서진 도로와 철도를 복구하고 고사포를 운용했다. 이로써 북베트남군은 전투에 병력을 돌릴 수 있었다. 중국은 모두 32만 명을 파견했고 해마다 1억 8천만 달러어치의 무기를 보냈다. 소련은 전차·항공기·지대공 미사일 같은 무기와 의약품을 보내 해마다 4억 5천만 달러어치를 공급했고, 1965년에는 소련 요원이 직접 미군기에 미사일을 쏘았다. 소련 해체 뒤 러시아는 최대 3천 명을 베트남에 주둔시켰고 16명이 죽었다고 인정했다.',
                en: 'In summer 1962 China agreed to give Hanoi 90,000 rifles and guns free of charge, and from 1965 it sent anti-aircraft units and engineering battalions to man anti-aircraft batteries and rebuild the roads and railways wrecked by American bombing, freeing North Vietnamese units for combat. China sent 320,000 troops in all and annual arms shipments worth $180 million. The Soviet Union supplied tanks, aircraft, surface-to-air missiles and other weapons as well as medical supplies, worth $450 million a year, and in 1965 Soviet crews fired missiles at US aircraft themselves. After 1991 Russia acknowledged that up to 3,000 Soviet troops had been stationed in Vietnam and that 16 had been killed.',
                sources: [S.war],
            },
            {
                ko: '두 후원국의 경쟁은 전쟁 후반의 방향도 바꾸었다. 1969년 이후 중국은 소련에 맞서 미국과 손잡는 쪽으로 돌아섰고, 닉슨은 소련과의 데탕트와 중국과의 화해를 추구했다. 그래도 소련은 북베트남에 무기를 계속 공급했다. 중국은 북베트남을 견제하는 세력으로 크메르루주를 지원하기 시작했는데, 이 선택은 1975년 뒤 캄보디아와 베트남의 전쟁, 1979년 중월전쟁으로 이어지는 갈등의 한 갈래가 되었다.',
                en: 'The rivalry between the two patrons also shaped the later war. From 1969 China turned towards an alignment with the United States against the Soviet Union, and Nixon pursued détente with Moscow and rapprochement with Beijing; the Soviets nevertheless kept supplying North Vietnam. China began financing the Khmer Rouge as a counterweight to North Vietnam, a choice that fed into the conflicts leading after 1975 to war between Cambodia and Vietnam and to the Sino-Vietnamese War of 1979.',
                sources: [S.war],
            },
        ],
    },
    {
        heading: { ko: '1968년 뗏 공세', en: 'The Tet Offensive of 1968' },
        paragraphs: [
            {
                ko: '1967년 말 북베트남군은 닥또와 케산 기지로 미군을 산간 지대에 끌어들였다. 레주언은 도시 봉기와 남베트남군의 이탈을 일으켜 교착을 끝내는 결정적 승리를 노렸다. 뗏 공세는 1968년 1월 30일 일부 지역에서 먼저 시작되어 31일 본격화했고, 8만 5천 명이 넘는 병력이 사이공의 미국 대사관을 포함해 100개가 넘는 도시를 공격했다. 대부분의 도시는 몇 주 안에 되찾아졌지만 옛 수도 후에는 26일 동안 점령되었다. 점령군은 후에에서 비무장 민간인과 포로 등 약 2,800명을 처형했고, 미군의 대량 화력은 도시의 80%를 폐허로 만들었다.',
                en: 'In late 1967 the North Vietnamese army drew American forces into the hinterlands at Đắk Tô and Khe Sanh. Lê Duẩn sought a decisive victory that would end the stalemate by sparking uprisings in the cities and defections in the South Vietnamese army. The Tet Offensive began prematurely in some areas on 30 January 1968 and in full on the 31st, as more than 85,000 troops attacked over 100 cities, including the US Embassy in Saigon. Most cities were retaken within weeks, but the former imperial capital Huế was held for 26 days. The occupying forces executed about 2,800 unarmed civilians, prisoners and others in Huế, and American firepower left 80 per cent of the city in ruins.',
                sources: [S.tet, S.hue, S.war],
            },
            {
                ko: '총봉기는 일어나지 않았고, 1968년의 공세들에서 공산군은 4만 5,267명이 전사했다. 하노이의 목표는 막대한 대가를 치르고도 이루어지지 않았다. 그러나 미국 여론은 크게 흔들렸다. 1967년 11월 웨스트모얼랜드가 「끝이 보인다」고 말한 뒤였기에 전쟁 지지율은 40%에서 26%로 떨어졌다. 3월 웨스트모얼랜드가 교체되었고, 3월 31일 존슨은 재선에 나서지 않겠다며 협상을 제안했다. 5월 10일 파리에서 미국과 북베트남의 평화 회담이 시작되었고, 하노이는 「싸우면서 협상하고 협상하면서 싸운다」는 전략을 택했다.',
                en: 'No general uprising came, and communist forces lost 45,267 killed in the offensives of 1968; Hanoi’s goals had failed at enormous cost. American opinion, however, was badly shaken. Coming after Westmoreland had said in November 1967 that “the end comes into view”, the offensive drove support for the war down from 40 to 26 per cent. Westmoreland was replaced in March, and on 31 March Johnson announced he would not seek re-election and offered negotiations. Peace talks between the United States and North Vietnam opened in Paris on 10 May, and Hanoi adopted a strategy of “talking while fighting, fighting while talking”.',
                sources: [S.war, S.tet],
            },
            {
                ko: '1968년 3월 16일 꽝응아이 성 선미 마을에서 미군 부대가 여성·어린이·노인이 대부분인 민간인 347~504명을 학살했다. 사건은 1969년에 알려져 분노를 일으켰다. 미국 안의 반전 운동도 커져, 1967년 1월 파병이 잘못이라고 본 미국인은 32%였지만 1970년에는 60%가 되었다. 1969년 10월 전국 모라토리엄 시위에는 수백만 명이 참여했다.',
                en: 'On 16 March 1968 a US Army unit massacred between 347 and 504 civilians, almost all women, children and old men, at Sơn Mỹ village in Quảng Ngãi province. When it came to light in 1969 it provoked outrage. The anti-war movement grew: in January 1967, 32 per cent of Americans thought sending troops had been a mistake, and by 1970 the figure was 60 per cent. The Vietnam Moratorium of October 1969 drew millions.',
                sources: [S.myLai, S.war, S.opposition],
            },
        ],
    },
    {
        heading: { ko: '베트남화와 인도차이나 전역의 전쟁(1969~1972)', en: 'Vietnamization and the war across Indochina (1969–1972)' },
        paragraphs: [
            {
                ko: '닉슨은 1969년 철군을 시작하며 남베트남군을 키워 방어를 넘기는 「베트남화」를 추진했다. 미군은 1970년 26만 5,500명, 1971년 19만 6,700명으로 줄었다. 같은 해 9월 2일 호찌민이 죽었다. 뗏 공세가 봉기를 일으키지 못하자 하노이에서는 보응우옌잡과 쯔엉찐의 「북부 우선」파가 레주언의 「남부 우선」파로부터 군사 문제의 주도권을 되찾았고, 대규모 공세 대신 소부대 공격으로 돌아섰다.',
                en: 'Nixon began withdrawing troops in 1969 and pursued “Vietnamization”, building up the South Vietnamese army to take over the war. US troop numbers fell to 265,500 in 1970 and 196,700 in 1971. Ho Chi Minh died on 2 September 1969. Because Tet had failed to spark an uprising, the “North-First” faction of Võ Nguyên Giáp and Trường Chinh regained control of military affairs from Lê Duẩn’s “South-First” faction in Hanoi, and large offensives gave way to small-unit attacks.',
                sources: [S.war, S.vietnamization],
            },
            {
                ko: '1969년 3월 닉슨은 캄보디아 국경의 북베트남군·민족해방전선 거점을 비밀 폭격하게 했다. 1970년 3월 18일 캄보디아 국회가 국가원수 시아누크를 해임했고, 친미 총리 론 놀이 권력을 잡아 베트남계 주민을 붙잡아 학살했다. 4~5월 북베트남군이 크메르루주의 요청으로 캄보디아에 들어갔고, 5월 미군과 남베트남군도 국경의 거점을 공격했다. 확전에 항의하던 켄트 주립대학교 학생 4명이 5월 4일 주 방위군의 총격으로 숨졌다. 1971년 2월 남베트남군이 라오스의 호찌민 루트를 끊으려 한 람선 719 작전은 절반의 병력이 죽거나 붙잡히는 패주로 끝났다. 같은 해 국방부의 비밀 보고서 「펜타곤 페이퍼스」가 『뉴욕 타임스』에 실려 정부가 전쟁에 관해 대중을 속여 왔음이 드러났다.',
                en: 'In March 1969 Nixon ordered secret bombing of North Vietnamese and Front sanctuaries along the Cambodian border. On 18 March 1970 Cambodia’s National Assembly removed the head of state, Prince Sihanouk, and the pro-American prime minister Lon Nol took power and began rounding up and massacring Vietnamese civilians. In April–May North Vietnamese forces entered Cambodia at the Khmer Rouge’s request, and in May US and South Vietnamese forces attacked the border bases. On 4 May four students protesting the widening war were killed by National Guardsmen at Kent State University. In February 1971 Operation Lam Sơn 719, a South Vietnamese thrust into Laos to cut the Ho Chi Minh trail, ended in a rout in which half the troops were killed or captured. That year the Pentagon Papers, the Defense Department’s secret history of the war, were published in The New York Times, revealing public deceptions by the government.',
                sources: [S.war, S.cambodianCoup, S.cambodianCampaign, S.opposition, S.lamSon],
            },
            {
                ko: '1972년 3월 30일 북베트남은 30만 명과 전차 수백 대로 「부활절 공세」를 시작해 북부 성들을 점령하고 캄보디아 쪽에서 사이공을 향해 진격했다. 미국은 지상군을 빼면서도 라인배커 작전으로 공중 지원을 했고, 5월 하이퐁항을 기뢰로 봉쇄했다. 안록과 꼰뚬에서 격전이 벌어졌고, 공세는 10월 양측 병사와 민간인 20만 명 넘는 사상자를 낸 끝에 멈추었다.',
                en: 'On 30 March 1972 North Vietnam launched the Easter Offensive with 300,000 troops and hundreds of tanks, overrunning the northern provinces and advancing on Saigon from Cambodia. While withdrawing its ground forces, the United States provided air support in Operation Linebacker and in May mined Haiphong harbour. After fierce fighting at An Lộc and Kon Tum the offensive was halted by October, with over 200,000 casualties among soldiers and civilians on both sides.',
                sources: [S.easter, S.war],
            },
        ],
    },
    {
        heading: { ko: '파리 협정과 끝나지 않은 전쟁(1972~1975)', en: 'The Paris Accords and the war that did not end (1972–1975)' },
        paragraphs: [
            {
                ko: '파리 회담에서 북베트남 대표단을 실질적으로 이끈 레득토는 1970년 2월부터 키신저와 비밀 협상을 벌여 1972년 10월 합의에 이르렀다. 티에우가 수정을 요구하며 협상이 막히자, 닉슨은 12월 18~29일 하노이와 하이퐁에 「라인배커 2」 폭격을 퍼부었다. 2만 톤이 넘는 폭탄이 떨어졌고 민간인 적어도 1,624명이 숨졌다. 1973년 1월 27일 레득토와 키신저, 임시혁명정부 외무장관 응우옌티빈, 마지못해 나선 티에우가 파리 협정에 서명했다. 협정은 휴전과 60일 안의 미군 철수, 포로 교환을 정하고 공산군 20만 명의 남부 잔류를 허용했으며, 임시혁명정부와 사이공 정부의 선거나 정치적 해결을 요구했다. 3월까지 미군은 모두 철수했다.',
                en: 'Lê Đức Thọ, the effective head of the North Vietnamese delegation in Paris, held secret talks with Kissinger from February 1970 and reached an agreement in October 1972. When Thiệu demanded changes and the talks deadlocked, Nixon ordered Operation Linebacker II against Hanoi and Haiphong from 18 to 29 December. More than 20,000 tons of ordnance were dropped and at least 1,624 civilians killed. On 27 January 1973 Lê Đức Thọ, Kissinger, the Provisional Revolutionary Government’s foreign minister Nguyễn Thị Bình and a reluctant Thiệu signed the Paris Peace Accords, which provided for a ceasefire, US withdrawal within 60 days and an exchange of prisoners, allowed 200,000 communist troops to remain in the south, and called for elections or a political settlement between the PRG and the Saigon government. All US forces were out by March.',
                sources: [S.leDucTho, S.linebacker2, S.paris, S.war],
            },
            {
                ko: '그해 레득토는 키신저와 함께 노벨 평화상 수상자로 정해졌지만 받기를 거부했다. 그는 협정 서명 뒤에도 미국과 사이공 정부가 핵심 조항을 어기고 있다며 「남베트남에는 아직 평화가 실제로 오지 않았다」고 밝혔다. 휴전 직전부터 양측은 땅과 주민을 더 차지하려 싸웠고, 전투는 미군 없이 계속되었다. 미국 상원은 케이스-처치 수정안으로 재개입을 막았고, 1974년 1월 티에우는 전쟁이 다시 시작되어 협정이 더는 효력이 없다고 선언했다. 미국 의회는 남베트남 원조를 연 10억 달러에서 7억 달러로 줄였다.',
                en: 'That year Lê Đức Thọ was named joint winner of the Nobel Peace Prize with Kissinger but declined it, stating that the United States and the Saigon administration continued in grave violation of key clauses of the agreement and that “peace has not yet really been established in South Vietnam”. Both sides had fought to seize land and population right up to the ceasefire, and fighting went on without American participation. The Senate barred renewed intervention with the Case–Church Amendment, and in January 1974 Thiệu announced that the war had restarted and the accords were no longer in effect. Congress cut aid to South Vietnam from $1 billion a year to $700 million.',
                sources: [S.leDucTho, S.war],
            },
            {
                ko: '1974년 12월 북베트남군은 푸억롱 성을 공격해 1975년 1월 6일 성도를 점령했고, 미국은 대응하지 않았다. 3월 반띠엔중이 지휘한 중부고원 공세에서 남베트남군이 무너졌고, 4월 30일 사이공이 함락되어 전쟁이 끝났다. 1975년 봄 공세와 사이공 함락, 1976년의 통일 과정은 「베트남 전쟁 종결과 국가 통일」 문서에서 다룬다. 같은 해 크메르루주가 프놈펜을 점령했고, 12월 라오스에서는 파테트라오가 왕정을 폐지하고 인민민주공화국을 세웠다.',
                en: 'In December 1974 North Vietnamese forces attacked Phước Long province, taking its capital on 6 January 1975 without an American response. In March the South Vietnamese army collapsed before the Central Highlands offensive commanded by Văn Tiến Dũng, and the fall of Saigon on 30 April ended the war. The 1975 spring offensive, the fall of Saigon and the reunification of 1976 are covered in “The End of the Vietnam War and Reunification”. That year the Khmer Rouge took Phnom Penh, and in December the Pathet Lao abolished the monarchy of Laos and founded the Lao People’s Democratic Republic.',
                sources: [S.war],
            },
        ],
    },
    {
        heading: { ko: '전쟁의 대가', en: 'The cost of the war' },
        paragraphs: [
            {
                ko: '사망자 추정은 자료마다 크게 다르다. 죽은 베트남 군인과 민간인은 97만~300만 명으로 추정되며, 한 인구학 연구는 1965~1975년 전쟁 관련 사망자를 79만 1천~114만 1천 명으로 계산했다. 2013년 베트남 정부 자료는 1955~1975년 북베트남군과 민족해방전선의 확인된 전사자를 84만 9,018명, 실종자를 23만 2천 명으로 집계했다. 남베트남군은 1960~1974년에 약 25만 4천 명이 죽었다. 캄보디아인 27만 5천~31만 명, 라오스인 2만~6만 2천 명이 숨졌고, 미군 전사자는 5만 8천여 명이었다.',
                en: 'Death toll estimates vary widely. Estimates of Vietnamese soldiers and civilians killed range from 970,000 to three million, and one demographic study calculated 791,000 to 1,141,000 war-related deaths for 1965–1975. Vietnamese government figures of 2013 counted 849,018 confirmed military deaths among the North Vietnamese army and the Front for 1955–1975, with a further 232,000 missing. The South Vietnamese army lost an estimated 254,000 killed in 1960–1974. Some 275,000 to 310,000 Cambodians and 20,000 to 62,000 Laotians died, and over 58,000 US military personnel were killed.',
                sources: [S.war, S.casualties],
            },
            {
                ko: '미국은 전쟁 동안 인도차이나에 700만 톤이 넘는 폭탄을 떨어뜨렸다. 2차 대전 때 유럽과 아시아에 떨어뜨린 210만 톤의 세 배가 넘는 양이다. 불발탄은 전쟁 뒤에도 4만 2천 명의 목숨을 앗았다. 1962~1971년 「랜치 핸드」 작전 등으로 에이전트 오렌지 같은 제초제 2천만 갤런이 600만 에이커의 숲과 농지에 뿌려졌다. 2006년 베트남 정부는 다이옥신 피해자를 400만 명 넘게, 베트남 적십자는 최대 100만 명으로 추산했으나, 미국은 이 수치가 믿을 수 없다며 인과관계를 인정하지 않았다. 스웨덴 총리 올로프 팔메와 법률가·학자들은 이 환경 파괴를 「에코사이드」라고 불렀다.',
                en: 'The United States dropped over seven million tons of bombs on Indochina during the war, more than triple the 2.1 million tons it dropped on Europe and Asia in the Second World War, and unexploded ordnance has killed 42,000 people since. In Operation Ranch Hand and related programmes in 1962–1971, 20 million gallons of herbicides such as Agent Orange were sprayed over six million acres of forest and cropland. In 2006 the Vietnamese government estimated over four million victims of dioxin poisoning and the Vietnamese Red Cross up to one million, figures the United States called unreliable while denying a conclusive link. Swedish Prime Minister Olof Palme, lawyers and academics described the environmental destruction as “ecocide”.',
                sources: [S.war, S.ranchHand],
            },
        ],
    },
];

const P = (lat, lng, ko, en) => ({ kind: 'point', lat, lng, label: { ko, en } });
const timeline = [
    ['1955.10.23', '남베트남 국민투표', 'South Vietnamese referendum', '지엠이 98%를 얻어 바오다이를 몰아내고 베트남 공화국을 선포했다.', 'Diệm, credited with 98 per cent, ousted Bảo Đại and proclaimed the Republic of Vietnam.', ['vietnam'], P(10.78, 106.7, '사이공', 'Saigon')],
    ['1959.05', '559단 창설', 'Group 559 founded', '호찌민 루트의 정비가 시작되었다.', 'Work began on the Ho Chi Minh trail.', ['vietnam', 'laos']],
    ['1960.12', '민족해방전선 창설', 'National Liberation Front founded', '캄보디아 메못에서 남부의 반정부 세력을 묶는 전선이 세워졌다.', 'A front uniting the south’s anti-government forces was founded at Memot, Cambodia.', ['vietnam', 'cambodia']],
    ['1963.01.02', '압박 전투', 'Battle of Ấp Bắc', '민족해방전선이 훨씬 큰 남베트남군을 물리쳤다.', 'The Front defeated a much larger South Vietnamese force.', ['vietnam', 'usa']],
    ['1963.11.01', '지엠 정권 전복', 'Overthrow of Diệm', '쿠데타 이튿날 지엠과 응오딘뉴가 살해되었다.', 'Diệm and Nhu were killed the day after the coup began.', ['vietnam', 'usa']],
    ['1964.08.07', '통킹만 결의', 'Gulf of Tonkin Resolution', '미국 의회가 대통령에게 군사행동의 전권을 주었다.', 'Congress gave the president sweeping authority for military action.', ['usa', 'vietnam'], P(19.7, 106.8, '통킹만', 'Gulf of Tonkin')],
    ['1965.03.02', '롤링 선더 개시', 'Rolling Thunder begins', '북베트남에 대한 3년 반의 폭격이 시작되었다.', 'Three and a half years of bombing of North Vietnam began.', ['usa', 'vietnam']],
    ['1965.03.08', '다낭 상륙', 'Landing at Da Nang', '미 해병대 3,500명이 상륙해 지상전이 시작되었다.', '3,500 US Marines landed and the ground war began.', ['usa', 'vietnam'], P(16.05, 108.2, '다낭', 'Da Nang')],
    ['1968.01.30', '뗏 공세', 'Tet Offensive', '100개가 넘는 도시가 공격받았고 후에는 26일 동안 점령되었다.', 'Over 100 cities were attacked; Huế was held for 26 days.', ['vietnam', 'usa'], P(16.46, 107.59, '후에', 'Huế')],
    ['1968.03.16', '선미 학살', 'Mỹ Lai massacre', '미군이 민간인 347~504명을 학살했다.', 'US troops massacred 347–504 civilians.', ['vietnam', 'usa'], P(15.18, 108.87, '선미 (꽝응아이)', 'Sơn Mỹ (Quảng Ngãi)')],
    ['1968.05.10', '파리 평화 회담 개시', 'Paris peace talks open', '미국과 북베트남이 협상을 시작했다.', 'The United States and North Vietnam began negotiating.', ['usa', 'vietnam', 'france']],
    ['1969.09.02', '호찌민 사망', 'Death of Ho Chi Minh', '베트남민주공화국 주석 호찌민이 하노이에서 죽었다.', 'President Ho Chi Minh died in Hanoi.', ['vietnam'], P(21.0285, 105.8542, '하노이', 'Hanoi')],
    ['1970.03.18', '캄보디아 정변', 'Cambodian coup', '국회가 시아누크를 해임하고 론 놀이 권력을 잡았다.', 'The National Assembly removed Sihanouk and Lon Nol took power.', ['cambodia'], P(11.56, 104.92, '프놈펜', 'Phnom Penh')],
    ['1971.02', '람선 719 작전', 'Operation Lam Sơn 719', '남베트남군의 라오스 진공이 패주로 끝났다.', 'The South Vietnamese thrust into Laos ended in a rout.', ['vietnam', 'laos', 'usa'], P(16.69, 106.22, '체폰', 'Tchepone')],
    ['1972.03.30', '부활절 공세', 'Easter Offensive', '북베트남군 30만 명이 남부로 진격했다.', '300,000 North Vietnamese troops advanced into the south.', ['vietnam', 'usa']],
    ['1972.12.18', '라인배커 2 폭격', 'Linebacker II bombing', '하노이와 하이퐁에 2만 톤이 넘는 폭탄이 떨어졌다.', 'Over 20,000 tons of bombs fell on Hanoi and Haiphong.', ['usa', 'vietnam']],
    ['1973.01.27', '파리 평화 협정', 'Paris Peace Accords', '휴전과 60일 안의 미군 철수가 합의되었다.', 'A ceasefire and US withdrawal within 60 days were agreed.', ['usa', 'vietnam', 'france']],
    ['1975.04.30', '사이공 함락', 'Fall of Saigon', '남베트남 정부가 항복해 전쟁이 끝났다.', 'The South Vietnamese government surrendered, ending the war.', ['vietnam']],
].map(([date, tko, ten, bko, ben, country, geo]) => ({
    date, title: { ko: tko, en: ten }, body: { ko: bko, en: ben }, country, ...(geo ? { geo } : {}),
}));

const people = [
    ['ho-chi-minh', 'leader', '베트남민주공화국 주석', 'President of the DRV', '프랑스에 이어 미국과 맞선 북베트남을 1969년 죽을 때까지 이끌었다.', 'Led North Vietnam against the United States, as against France before, until his death in 1969.'],
    ['le-duan', 'leader', '베트남 노동당 제1서기', 'First Secretary of the Workers’ Party', '1956년 「남으로 가는 길」을 썼고, 1960년 제1서기가 되어 남부 무장투쟁과 1968년 뗏 공세를 이끌었다.', 'Wrote “The Road to the South” in 1956, became First Secretary in 1960 and drove the southern armed struggle and the 1968 Tet Offensive.'],
    ['vo-nguyen-giap', 'executor', '국방장관 겸 인민군 총사령관', 'Defence minister and army commander-in-chief', '뗏 공세 뒤 「북부 우선」파와 함께 군사 문제의 주도권을 되찾았다.', 'Regained control of military affairs with the “North-First” faction after Tet.'],
    ['van-tien-dung', 'executor', '베트남 인민군 총참모장', 'Chief of the General Staff', '1975년 중부고원 공세와 호찌민 작전을 지휘해 사이공 함락을 이끌었다.', 'Commanded the 1975 Central Highlands offensive and the Ho Chi Minh Campaign that took Saigon.'],
    ['pham-van-dong', 'participant', '북베트남 총리', 'Prime minister of North Vietnam', '전쟁 기간 내내 북베트남 정부의 대외적 얼굴이었다.', 'Was the public face of the North Vietnamese government throughout the war.'],
    ['le-duc-tho', 'participant', '파리 협상 북베트남 수석 협상가', 'Chief North Vietnamese negotiator in Paris', '키신저와 비밀 협상으로 파리 협정을 맺고 노벨 평화상을 거부했다.', 'Negotiated the Paris Accords in secret talks with Kissinger and declined the Nobel Peace Prize.'],
    ['nguyen-thi-binh', 'participant', '임시혁명정부 외무장관', 'Foreign minister of the Provisional Revolutionary Government', '파리 협상 대표단을 이끌고 1973년 협정에 서명한 유일한 여성이었다.', 'Led the PRG delegation in Paris and was the only woman to sign the 1973 accords.'],
    ['souvanna-phouma', 'participant', '라오스 중립파 총리', 'Neutralist prime minister of Laos', '중립을 지키려 했으나 미국 원조에 기댔고, 1964년 호찌민 루트 폭격에 동의했다.', 'Sought to keep Laos neutral but depended on US aid and consented to the bombing of the Ho Chi Minh trail from 1964.'],
    ['robert-f-kennedy', 'participant', '전쟁 반대로 돌아선 상원의원', 'Senator who turned against the war', '형의 암살 뒤 상원에서 베트남 전쟁 반대에 나섰고 1968년 대선 경선 중 암살되었다.', 'After his brother’s assassination he opposed the war in the Senate and was assassinated during the 1968 primaries.'],
    ['ngo-dinh-diem', 'opponent', '베트남 공화국 초대 대통령', 'First president of the Republic of Vietnam', '1955년 국민투표로 공화국을 세웠고 1963년 쿠데타 때 살해되었다.', 'Founded the republic through the 1955 referendum and was killed in the 1963 coup.'],
    ['nguyen-van-thieu', 'opponent', '베트남 공화국 대통령', 'President of the Republic of Vietnam', '1967~1975년 대통령으로 파리 협정에 마지못해 서명했고 1975년 4월 사임했다.', 'President from 1967 to 1975, he reluctantly signed the Paris Accords and resigned in April 1975.'],
    ['lyndon-b-johnson', 'opponent', '미국 대통령', 'US president', '통킹만 결의를 근거로 폭격과 지상군 파병을 늘렸고, 1968년 재선을 포기했다.', 'Used the Gulf of Tonkin Resolution to escalate the bombing and troop deployment, and gave up re-election in 1968.'],
    ['robert-mcnamara', 'opponent', '미국 국방장관', 'US secretary of defense', '병력 증강과 계량적 전쟁 관리를 주도했고 1967년 「펜타곤 페이퍼스」 연구를 지시했다.', 'Drove the build-up and quantitative management of the war and commissioned the Pentagon Papers study in 1967.'],
    ['dean-rusk', 'opponent', '미국 국무장관', 'US secretary of state', '케네디·존슨 정부에서 개입을 강하게 옹호했다.', 'Strongly advocated intervention under Kennedy and Johnson.'],
    ['william-westmoreland', 'opponent', '베트남 군사원조사령관', 'Commander of MACV', '소모전과 사살 집계를 앞세웠고 뗏 공세 뒤 교체되었다.', 'Pursued attrition measured by body count and was replaced after Tet.'],
    ['richard-nixon', 'opponent', '미국 대통령', 'US president', '「베트남화」로 철군하면서 캄보디아와 라오스로 전쟁을 넓혔고 1972년 말 하노이 폭격을 명령했다.', 'Withdrew troops under Vietnamization while widening the war into Cambodia and Laos, and ordered the bombing of Hanoi in late 1972.'],
    ['henry-kissinger', 'opponent', '미국 국가안보보좌관', 'US national security adviser', '레득토와의 비밀 협상으로 파리 협정을 맺었다.', 'Concluded the Paris Accords through secret talks with Lê Đức Thọ.'],
].map(([person_id, relation_kind, relation_ko, relation_en, note_ko, note_en], sort_order) => ({
    person_id, sort_order, relation_kind, relation_ko, relation_en, note_ko, note_en,
}));

const sources = [];
for (const s of sections) for (const p of s.paragraphs) for (const u of p.sources) if (!sources.includes(u)) sources.push(u);
const body = lang => sections.map(s => '## ' + s.heading[lang] + '\n\n' + s.paragraphs.map(p =>
    p[lang] + ' ' + p.sources.map(u => `[${sources.indexOf(u) + 1}](${u})`).join(' ')).join('\n\n')).join('\n\n');

const event = {
    id: 'second-indochina-war-1955-1975',
    expected: null,
    fields: {
        title_ko: '제2차 인도차이나 전쟁',
        title_en: 'The Second Indochina War',
        period_label: '1955–1975',
        sort_order: 196,
        question_ko: '분단된 베트남의 내전은 어떻게 미국과 사회주의 진영이 맞선 인도차이나 전역의 전쟁이 되었고, 미국은 왜 이기지 못하고 물러났는가?',
        question_en: 'How did the civil war in divided Vietnam become a war across Indochina between the United States and the socialist bloc, and why did the United States withdraw without winning?',
        summary_ko: '1954년 제네바 협정이 약속한 통일 선거가 무산되자, 남베트남의 응오딘지엠 정권에 맞서 북베트남의 지원을 받는 민족해방전선의 무장투쟁이 커졌다. 1964년 통킹만 사건 뒤 미국은 북베트남을 폭격하고 50만 명이 넘는 지상군을 보냈으며, 중국과 소련은 북베트남에 병력과 무기를 댔다. 1968년 뗏 공세 뒤 미국은 협상과 철군으로 돌아섰지만 전쟁은 캄보디아와 라오스로 번졌다. 1973년 파리 협정으로 미군이 떠났고, 1975년 4월 사이공 함락으로 전쟁이 끝났다.',
        summary_en: 'When the reunification elections promised by the 1954 Geneva Accords were abandoned, the armed struggle of the North-backed National Liberation Front against Ngô Đình Diệm’s South Vietnam grew. After the Gulf of Tonkin incident of 1964 the United States bombed North Vietnam and sent more than half a million ground troops, while China and the Soviet Union supplied the North with troops and weapons. After the Tet Offensive of 1968 Washington turned to negotiation and withdrawal, but the war spread into Cambodia and Laos. The Paris Peace Accords of 1973 took American forces out, and the fall of Saigon in April 1975 ended the war.',
        outcome_ko: '베트남민주공화국과 민족해방전선이 이겨 1976년 베트남이 통일되었고, 1975년 캄보디아와 라오스에서도 공산주의 세력이 집권했다. 베트남인 사망자는 97만~300만 명으로 추정되며, 폭탄과 제초제의 피해는 전쟁 뒤에도 이어졌다. 미국 안에서는 해외 군사 개입을 꺼리는 「베트남 증후군」이 생겼다. 전쟁 중 크메르루주를 지원한 중국과 소련에 기댄 통일 베트남의 대립은 1978~1979년 캄보디아 침공과 중월전쟁으로 이어졌다.',
        outcome_en: 'The Democratic Republic of Vietnam and the Liberation Front won, Vietnam was reunified in 1976, and communist forces also took power in Cambodia and Laos in 1975. Vietnamese deaths are estimated at 970,000 to three million, and the damage done by bombs and herbicides outlasted the war. In the United States the war gave rise to the “Vietnam syndrome”, an aversion to overseas military intervention. The antagonism between China, which had backed the Khmer Rouge during the war, and a reunified Vietnam reliant on the Soviet Union led to the invasion of Cambodia and the Sino-Vietnamese War of 1978–1979.',
        body_ko: body('ko'),
        body_en: body('en'),
        timeline,
        sources,
        locations: [
            { label: { ko: '사이공', en: 'Saigon' }, lat: 10.78, lng: 106.7, kind: 'main' },
            { label: { ko: '하노이', en: 'Hanoi' }, lat: 21.0285, lng: 105.8542, kind: 'place' },
            { label: { ko: '후에', en: 'Huế' }, lat: 16.46, lng: 107.59, kind: 'place' },
            { label: { ko: '다낭', en: 'Da Nang' }, lat: 16.05, lng: 108.2, kind: 'place' },
            { label: { ko: '프놈펜', en: 'Phnom Penh' }, lat: 11.56, lng: 104.92, kind: 'place' },
            { label: { ko: '비엔티안', en: 'Vientiane' }, lat: 17.97, lng: 102.6, kind: 'place' },
        ],
        countries: ['vietnam', 'usa', 'china', 'soviet', 'laos', 'cambodia', 'france', 'south-korea', 'australia', 'new-zealand', 'thailand', 'philippines'],
        relations: { related: ['first-indochina-war-1945-1954', 'sino-soviet-split', 'vietnam-reunification-1975-1976', 'lao-republic-1975', 'cambodian-regime-change-1975-1979', 'sino-vietnamese-war-1979', 'detente-salt'] },
        no_auto_link: [],
        link_expressions: [
            { lang: 'ko', role: 'identity', text: '제2차 인도차이나 전쟁', policy: 'auto' },
            { lang: 'en', role: 'identity', text: 'Second Indochina War', policy: 'auto' },
            { lang: 'ko', role: 'identity', text: '베트남 전쟁', policy: 'search' },
            { lang: 'en', role: 'identity', text: 'Vietnam War', policy: 'search' },
        ],
        focus: { ko: '베트남민주공화국과 남베트남 민족해방전선', en: 'The Democratic Republic of Vietnam and the National Liberation Front' },
    },
    sections,
    people,
};

fs.writeFileSync(path.join(__dirname, '..', 'second-indochina-war-20260929.json'),
    JSON.stringify({ id: 'second-indochina-war-20260929', events: [event] }, null, 2) + '\n');
fs.writeFileSync(path.join(__dirname, '..', 'second-indochina-war-20260929-people.json'),
    JSON.stringify({ changedBy: 'second-indochina-war-20260929', people: require('./people') }, null, 2) + '\n');
console.log(`event ${event.id}: ${sections.length} sections, ${sources.length} sources, ${timeline.length} timeline, ${people.length} relations`);
