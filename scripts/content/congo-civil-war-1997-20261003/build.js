#!/usr/bin/env node
// The 1997–1999 civil war in the Republic of the Congo (curation gap 1895, raised
// from the congo-peoples-republic-1969-1991 event). `node build.js` writes
// ../congo-civil-war-1997-20261003-terms.json for scripts/apply-history-terms.js.
// Evidence claims are verbatim sentences of the cited pages.
const fs = require('fs');
const path = require('path');

const BATCH = 'congo-civil-war-1997-20261003';
const EN = 'https://en.wikipedia.org/wiki/Republic_of_the_Congo_Civil_War_(1997%E2%80%931999)';
const FR = 'https://fr.wikipedia.org/wiki/Guerre_civile_de_la_r%C3%A9publique_du_Congo';
const ev = (field, locator, claim, source = EN) => ({ field, claim, source, locator });

const term = {
    id: 'congo-civil-war-1997',
    sources: [EN, FR],
    fields: {
        term: { ko: '콩고 공화국 내전 (1997–1999)', en: 'Republic of the Congo Civil War (1997–1999)' },
        original: 'Guerre civile du Congo-Brazzaville (1997–1999)',
        category: 'international',
        period: { ko: '1997–1999', en: '1997–1999' }, startYear: 1997, endYear: 1999,
        definition: {
            ko: '1997년 6월 5일부터 1999년 12월 29일까지 콩고 공화국(콩고-브라자빌)에서 파스칼 리수바 대통령, 드니 사수응게소 전 대통령, 베르나르 콜렐라의 민병대가 벌인 두 번째 내전. 1997년 10월 앙골라군의 개입으로 사수응게소가 권력을 되찾았고, 남부의 반군 저항은 1999년 말 평화협정으로 끝났다.',
            en: 'The second civil war in the Republic of the Congo (Congo-Brazzaville), fought from 5 June 1997 to 29 December 1999 by the militias of President Pascal Lissouba, former president Denis Sassou Nguesso and Bernard Kolelas. Angolan intervention returned Sassou Nguesso to power in October 1997; the rebel resistance in the south ended with a peace agreement at the end of 1999.',
        },
        body: {
            ko: '1990년 다당제로 넘어간 뒤 1992년 선거에서 리수바가 대통령이 되었고 콜렐라가 2위, 사수응게소가 3위였다. 세 지도자는 각자 민병대(콜렐라의 닌자, 리수바의 코코예, 사수응게소의 코브라)를 거느렸고, 민병대는 라리·니볼레크·음보치 등 지도자의 종족·정치 기반에서 대원을 모았다. 1993~1994년의 첫 내전 뒤에도 민병대는 무장을 풀지 않았다.\n\n1997년 6월 5일 리수바가 사수응게소의 체포와 코브라의 무장해제를 명령하면서 브라자빌 시가전이 시작되었다. 양측은 인구가 밀집한 지역에 포격을 퍼부었고, 종족을 기준으로 민간인을 골라 약탈하고 괴롭혔다. 9월 리수바는 콜렐라를 총리로 임명해 닌자를 정부 편에 끌어들였다. 리수바 정권이 앙골라의 반정부 게릴라 UNITA를 지원해 왔기 때문에 앙골라는 사수응게소 편에 섰고, 프랑스도 석유 이권을 지키려 코브라에 무기를 대 주었다. 10월 앙골라군의 공습과 지상군 지원 속에 코브라가 수도를 장악했고, 사수응게소가 스스로 대통령에 올랐다.\n\n브라자빌에서 밀려난 코코예와 닌자는 남부에서 저항을 이어 갔다. 1998년 12월 브라자빌 바콩고·마켈레켈레 지구 전투로 20만 명이 피란했고, 정부군의 약탈과 즉결 처형까지 더해 최소 1,000명이 죽었다. 1999년 12월 29일 닌자와 코코예 반군 2,000명이 정부와 평화협정을 맺고 투항하면서 전쟁은 공식적으로 끝났다. 일당체제가 끝난 뒤에도 정파별 무장세력과 국가 자원을 둘러싼 갈등이 풀리지 않았음을 보여 준 전쟁이다.',
            en: 'After the move to a multiparty system in 1990, Lissouba won the 1992 presidential election, with Kolelas second and Sassou Nguesso third. Each of the three led a militia — Kolelas the Ninja, Lissouba the Cocoye, Sassou Nguesso the Cobra — recruited from their leaders’ ethnic and political bases among the Lari, the Nibolek and the Mbochi. After the first civil war of 1993–1994 the militias kept their weapons.\n\nOn 5 June 1997 Lissouba ordered Sassou Nguesso detained and the Cobra disarmed, and fighting broke out across Brazzaville. Both sides shelled densely populated districts and singled out civilians for extortion and harassment by ethnicity. In September Lissouba made Kolelas prime minister, bringing the Ninja in on the government side. Because Lissouba’s government had backed the Angolan rebel movement UNITA, Angola entered the war on Sassou Nguesso’s side, and France armed the Cobra to secure its oil interests. In October, with Angolan air strikes and troops, the Cobra took the capital and Sassou Nguesso declared himself president.\n\nDriven out of Brazzaville, the Cocoye and Ninja fought on in the south. Fighting in Brazzaville’s Bacongo and Makelekele districts in December 1998 displaced 200,000 people and, with looting and summary executions by government forces, left at least 1,000 dead. On 29 December 1999 some 2,000 Ninja and Cocoye rebels signed a peace agreement and surrendered, officially ending the war. It showed that the end of one-party rule had not settled the conflict between armed party factions over the resources of the state.',
        },
        aliases: {
            ko: ['1997년 콩고 내전', '1997~1999년 콩고 공화국 내전', '제2차 콩고 공화국 내전', '제2차 브라자빌 내전'],
            en: ['Second Republic of the Congo Civil War', 'Second Brazzaville-Congolese Civil War', 'Congo-Brazzaville civil war of 1997'],
        },
        people: ['pascal-lissouba', 'denis-sassou-nguesso', 'bernard-kolelas'],
        events: ['congo-peoples-republic-1969-1991'],
        evidence: [
            ev('definition', 'lead', 'The Second Republic of the Congo Civil War, also known as the Second Brazzaville-Congolese Civil War, was the second of two ethnopolitical civil conflicts in the Republic of the Congo which lasted from 5 June 1997 to 29 December 1999.'),
            ev('definition', 'lead', 'The conflict ended following the intervention of the Angolan military, which reinstated former president Denis Sassou Nguesso to power.'),
            ev('body', 'Background', 'Tensions continued to rise as Kolelas, Lissouba and Sassou formed the Ninja, Cocoye, and Cobra militia respectively.'),
            ev('body', 'Background', "The militia drew members from their leaders' ethnic and political backgrounds: the Mbochi supported Sassou, and the Nibolek and the Lari sided with Lissouba and Kolelas respectively."),
            ev('body', 'Conflict', 'On 5 June 1997, anticipating a Sassou-led coup, Lissouba ordered the Cocoye militia to detain Sassou and forcibly disarm the Cobra militia, thus initiating a second civil war.'),
            ev('body', 'Conflict', 'Angola seized the opportunity to destroy UNITA\'s last supply line by entering the conflict on Sassou-Nguesso\'s side.'),
            ev('body', 'Conflict', "France also supported the Cobra militia by offering armaments, aiming to secure its interests in the country's oil industry."),
            ev('body', 'Conflict', 'In September 1997, following Sassou\'s refusal to accept five ministerial portfolios, Lissouba granted Bernard Kolelas the position of Prime Minister, as the Ninja militia officially entered the conflict on the side of the government.'),
            ev('body', 'Conflict', 'Denis Sassou Nguesso assumed power on the following day, declaring himself president.'),
            ev('body', 'Conflict', 'The areas were targeted by heavy mortar and artillery shelling which caused widespread destruction, internally displacing 200,000 civilians.'),
            ev('endYear', 'Conflict', 'On 29 December 1999, amidst continuous government offensives, a total of 2,000 Ninja and Cocoye rebels surrendered to the authorities after signing a peace agreement with the government, officially ending the conflict.'),
            ev('period', 'lead', 'which lasted from 5 June 1997 to 29 December 1999'),
            ev('startYear', 'Conflict', 'On 5 June 1997, anticipating a Sassou-led coup, Lissouba ordered the Cocoye militia to detain Sassou and forcibly disarm the Cobra militia, thus initiating a second civil war.'),
            ev('original', 'Introduction', "La guerre civile du Congo-Brazzaville, du début du mois de juin 1997 au mois d'octobre 1997, est un conflit à la fois ethnique et politique qui a opposé le président Pascal Lissouba et sa milice, les Zoulous, à Denis Sassou Nguesso et sa milice, les Cobras.", FR),
        ],
    },
};

fs.writeFileSync(path.join(__dirname, '..', `${BATCH}-terms.json`), JSON.stringify({ id: BATCH, terms: [term] }, null, 2) + '\n');
console.log(`1 term: ${term.id}`);
