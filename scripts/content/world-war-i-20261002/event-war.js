// World War I, 1914 – 11 November 1918: rewrite of the existing overview event
// `world-war-i` (2026-10-02) as an account of the war itself. The postwar
// settlement, new states and the revolutionary wave of 1918–1923 belong to the
// separate overview `world-war-i-aftermath-1918-1923`; the socialist response is
// told in the child event `second-international-collapse-1914`.
// The 29 timeline entries already stored carry the map's points and arrows, so
// they are copied verbatim (currentTimeline below) and merged with the new rows.
// People links (~263, set by the people pipeline) are left untouched: people: [].
const { W, P, event: buildEvent } = require('../baltic-1940-1953-20261002/lib');

const E = t => W(encodeURI(t));
const S = {
    ww1: E('World_War_I'),
    causes: E('Causes_of_World_War_I'),
    july: E('July_Crisis'),
    imp: E('Imperialism,_the_Highest_Stage_of_Capitalism'),
    sleep: E('The_Sleepwalkers:_How_Europe_Went_to_War_in_1914'),
    allies: E('Allies_of_World_War_I'),
    who: 'https://www.warmuseum.ca/firstworldwar/introduction/who-fought/',
    usa: 'https://history.state.gov/departmenthistory/short-history/war',
    china: E('China_in_World_War_I'),
    nam: 'https://www.nam.ac.uk/explore/commonwealth-and-first-world-war',
    seneg: E('Senegalese_Tirailleurs'),
    clc: E('Chinese_Labour_Corps'),
    marne: E('First_Battle_of_the_Marne'),
    verdun: E('Battle_of_Verdun'),
    somme: E('Battle_of_the_Somme'),
    brusilov: E('Brusilov_offensive'),
    blockade: E('Blockade_of_Germany_(1914–1919)'),
    gallipoli: E('Gallipoli_campaign'),
    caporetto: E('Battle_of_Caporetto'),
    hindenburg: E('Hindenburg_Programme'),
    turnip: E('Turnip_Winter'),
    januar: 'https://de.wikipedia.org/wiki/Januarstreik',
    mutiny: E('1917_French_Army_mutinies'),
    easter: E('Easter_Rising'),
    zimmerwald: E('Zimmerwald_Conference'),
    liebknecht: E('Karl_Liebknecht'),
    russrev: E('Russian_Revolution'),
    brest: E('Treaty_of_Brest-Litovsk'),
    zimmermann: E('Zimmermann_telegram'),
    spring: E('German_spring_offensive'),
    hundred: E('Hundred_Days_Offensive'),
    kiel: E('Kiel_mutiny'),
    armistice: E('Armistice_of_11_November_1918'),
    casualties: E('World_War_I_casualties'),
    flu: E('Spanish_flu'),
    stab: E('Stab-in-the-back_myth'),
};
const ev = id => `/commulingo/events/${id}`;

const sections = [
    {
        heading: { ko: '전쟁의 배경: 동맹 체제와 군비 경쟁', en: 'Background: alliances and the arms race' },
        paragraphs: [
            {
                ko: '1871년 독일 제국의 성립은 유럽의 오랜 세력균형을 흔들었다. 독일과 오스트리아-헝가리의 1879년 동맹은 1882년 이탈리아가 가담하며 삼국동맹이 되었고, 그 맞은편에서는 1894년 프랑스-러시아 동맹, 1904년 영국과 프랑스의 협상, 1907년 영국-러시아 협정이 차례로 맺어졌다. 영국이 프랑스나 러시아 편에 설 의무를 진 정식 동맹은 아니었지만, 아시아와 아프리카의 식민지 분쟁을 정리한 이 협상들은 영국이 장차 두 나라를 지원할 가능성을 열었다.',
                en: 'The foundation of the German Empire in 1871 unsettled Europe’s long-standing balance of power. The 1879 alliance of Germany and Austria-Hungary became the Triple Alliance when Italy joined in 1882; on the other side came the Franco-Russian Alliance of 1894, the Anglo-French Entente Cordiale of 1904 and the Anglo-Russian Convention of 1907. These were not formal alliances obliging Britain to fight for France or Russia, but by settling colonial disputes in Asia and Africa they made British support for either in a future war a real possibility.',
                sources: [S.ww1, S.causes],
            },
            {
                ko: '군비 경쟁은 바다에서 먼저 불붙었다. 티르피츠 제독의 함대 건설은 영국 해군과 맞서려 했지만, 1906년 영국의 드레드노트 진수로 기존 전함이 모두 낡은 것이 되었고, 1911년 독일은 지출의 무게를 해군에서 육군으로 옮겼다. 1913년 독일이 상비군을 17만 명 늘리자 프랑스는 복무 기간을 2년에서 3년으로 늘렸고, 발칸 국가들과 이탈리아·오스만 제국·오스트리아-헝가리도 뒤따랐다. 1908~1913년 유럽 6대 강국의 군사비는 실질 기준으로 50% 넘게 늘었다.',
                en: 'The arms race began at sea. Admiral Tirpitz’s fleet-building programme set out to rival the Royal Navy, but the launch of HMS Dreadnought in 1906 made every existing battleship obsolete, and in 1911 Germany shifted spending from the navy to the army. When Germany enlarged its standing army by 170,000 men in 1913, France extended compulsory service from two to three years, and the Balkan states, Italy, the Ottoman Empire and Austria-Hungary followed. From 1908 to 1913 the military spending of the six major European powers rose by more than 50% in real terms.',
                sources: [S.ww1],
            },
            {
                ko: '발칸은 「유럽의 화약고」였다. 1908~1909년 오스트리아-헝가리가 보스니아-헤르체고비나를 병합하자 러시아와의 협력 가능성이 사라졌고, 1912~1913년 두 차례 발칸 전쟁은 오스만 제국을 몰아낸 뒤 승전국들 사이에도 원한을 남겼다. 오스트리아는 세르비아의 팽창을 제국의 존립을 위협하는 일로 보았고, 범슬라브주의를 내건 러시아는 세르비아의 보호자를 자처했다.',
                en: 'The Balkans were the “powder keg of Europe”. Austria-Hungary’s annexation of Bosnia and Herzegovina in 1908–1909 ended any chance of cooperation with Russia in the region, and the two Balkan Wars of 1912–1913 drove out the Ottomans only to leave resentment among the victors themselves. Vienna saw Serbian expansion as a threat to the empire’s existence, while Pan-Slav Russia regarded itself as Serbia’s protector.',
                sources: [S.ww1],
            },
            {
                ko: '원인을 둘러싼 해석은 지금도 갈린다. 레닌은 1916년에 쓴 『제국주의론』에서 이 전쟁을 독점 단계에 이른 자본주의 열강이 이미 분할을 끝낸 세계를 다시 나누려는 「병합적이고 약탈적인」 전쟁이라고 규정했다. 1960년대 독일 역사가 프리츠 피셔는 독일의 보수 지도부가 의도적으로 전쟁을 추구했다고 주장해 세계적인 논쟁을 불렀다. 그의 주장을 온전히 받아들인 학자는 적었지만, 1980년대에는 독일의 책임이 다른 열강보다 크다는 데 대체로 의견이 모였다. 반면 2012년 크리스토퍼 클라크의 『몽유병자들』은 어느 한 나라의 책임으로 돌릴 수 없으며, 각국 지도자들이 위험을 제대로 보지 못한 채 연쇄적인 결정으로 전쟁에 걸어 들어갔다고 보았다.',
                en: 'Interpretations of the causes remain divided. In Imperialism, the Highest Stage of Capitalism, written in 1916, Lenin called the conflict “an annexationist, predatory, plunderous war” in which capitalist powers at the monopoly stage fought to redivide a world they had already partitioned. In the 1960s the German historian Fritz Fischer argued that Germany’s conservative leaders had deliberately sought war, setting off a worldwide debate. Few historians accepted his thesis in full, but by the 1980s it was generally agreed that Germany’s share of responsibility was larger than that of the other powers. Christopher Clark’s The Sleepwalkers (2012), by contrast, argued that no single country was to blame and that leaders stumbled into war through a chain of decisions whose risks they failed to see.',
                sources: [S.imp, S.causes, S.sleep],
            },
        ],
    },
    {
        heading: { ko: '7월 위기: 사라예보에서 벨기에까지', en: 'The July Crisis: from Sarajevo to Belgium' },
        paragraphs: [
            {
                ko: '1914년 6월 28일 사라예보에서 보스니아 세르비아계 청년 가브릴로 프린치프가 오스트리아-헝가리의 황위 계승자 프란츠 페르디난트 대공 부부를 쏘아 죽였다. 암살자들은 「청년 보스니아」 운동에 속했고, 세르비아 정보기관 안의 비밀조직 「검은 손」에게서 무기를 받았다. 빈은 세르비아를 군사적으로 응징하기로 했고, 7월 초 독일은 이른바 「백지수표」로 무조건적인 지원을 약속하며 러시아가 끼어들기 전에 빨리 공격하라고 재촉했다.',
                en: 'On 28 June 1914 in Sarajevo Gavrilo Princip, a young Bosnian Serb, shot dead Archduke Franz Ferdinand, heir to the Austro-Hungarian throne, and his wife. The assassins belonged to the Young Bosnia movement and had been armed by the Black Hand, a secret organisation within Serbian intelligence. Vienna resolved to punish Serbia militarily, and in early July Germany promised its unconditional support — the so-called “blank cheque” — while urging a quick strike before Russia could intervene.',
                sources: [S.ww1, S.july],
            },
            {
                ko: '7월 23일 오스트리아-헝가리는 일부러 받아들일 수 없게 만든 10개 항의 최후통첩을 세르비아에 보냈다. 세르비아는 25일 총동원령을 내리면서도 오스트리아 관리가 세르비아 안의 수사와 재판에 참여하는 조항만 빼고 모든 요구를 받아들였다. 빈은 이를 거부로 간주해 국교를 끊고, 28일 선전포고와 함께 베오그라드를 포격했다. 러시아는 30일 세르비아를 지원하는 총동원에 들어갔다.',
                en: 'On 23 July Austria-Hungary sent Serbia an ultimatum of ten demands, framed to be unacceptable. Serbia ordered general mobilisation on 25 July but accepted every term except those allowing Austrian officials to take part in investigations and trials inside Serbia. Vienna treated this as rejection, broke off relations and on 28 July declared war and began shelling Belgrade. Russia ordered general mobilisation in Serbia’s support on 30 July.',
                sources: [S.ww1, S.july],
            },
            {
                ko: '독일 참모본부는 오래전부터 양면 전쟁을 상정했다. 슐리펜 계획은 육군의 80%로 먼저 프랑스를 꺾은 뒤 러시아로 돌아선다는 구상이었고, 그래서 시간이 무엇보다 중요했다. 독일은 7월 31일 러시아에 12시간 시한의 최후통첩을 보냈고, 8월 1일 두 나라는 전쟁 상태에 들어갔다. 독일은 2일 룩셈부르크를 점령하고 3일 프랑스에 선전포고한 뒤 벨기에에 통과를 요구했으며, 거부당하자 4일 아침 벨기에를 침공했다. 1839년 런던 조약에 따라 벨기에 중립을 보장한 영국은 철군을 요구하는 최후통첩을 보냈고, 그 시한이 그날 자정에 지나며 영국도 참전했다.',
                en: 'The German General Staff had long planned for a two-front war. The Schlieffen Plan envisaged using 80% of the army to defeat France first and then turning on Russia, which made speed paramount. Germany sent Russia a 12-hour ultimatum on 31 July, and on 1 August the two countries were at war. Germany occupied Luxembourg on 2 August, declared war on France on 3 August and demanded free passage through Belgium; refused, it invaded early on 4 August. Britain, a guarantor of Belgian neutrality under the 1839 Treaty of London, sent an ultimatum demanding withdrawal, and when it expired at midnight Britain too was at war.',
                sources: [S.ww1, S.allies],
            },
        ],
    },
    {
        heading: { ko: '교전국: 협상국과 그 협력국 {france russia uk serbia belgium montenegro japan italy portugal romania usa greece thailand china brazil cuba panama liberia guatemala nicaragua costa-rica haiti honduras}', en: 'The belligerents: the Entente and its associates {france russia uk serbia belgium montenegro japan italy portugal romania usa greece thailand china brazil cuba panama liberia guatemala nicaragua costa-rica haiti honduras}' },
        paragraphs: [
            {
                ko: '협상국의 중심은 프랑스·러시아 제국·영국 제국이었고, 1914년 여름 세르비아·몬테네그로·벨기에가 함께 싸웠다. 일본은 8월 23일 독일에 선전포고하고 칭다오와 태평양의 독일 식민지를 점령했으며, 1915년 중국에 「21개조 요구」를 내밀어 동아시아에서 세력을 넓혔다. 삼국동맹의 일원이던 이탈리아는 1914년 중립을 지키다가 1915년 4월 런던 조약에서 오스트리아 영토를 약속받고 5월 23일 오스트리아-헝가리에 선전포고했다. 독일과의 전쟁은 15개월 뒤였다.',
                en: 'The core of the Entente was France, the Russian Empire and the British Empire, joined in the summer of 1914 by Serbia, Montenegro and Belgium. Japan declared war on Germany on 23 August, seized Qingdao and Germany’s Pacific colonies, and in 1915 presented China with the Twenty-One Demands to extend its influence in East Asia. Italy, a member of the Triple Alliance, stayed neutral in 1914; promised Austrian territory in the Treaty of London of April 1915, it declared war on Austria-Hungary on 23 May. War with Germany came fifteen months later.',
                sources: [S.allies, S.ww1, S.who],
            },
            {
                ko: '1916년 3월에는 독일이 포르투갈에 선전포고했고, 루마니아는 8월 27일 트란실바니아를 노리고 참전했다. 미국은 1917년 4월 6일 독일에 선전포고했지만 정식 동맹국이 아니라 「협력국(associated power)」으로 싸웠다. 같은 해 국왕이 물러난 그리스가 6월 협상국에 합류했고, 중화민국은 8월 14일 독일과 오스트리아-헝가리에 선전포고했다. 시암(오늘날 태국)과 브라질도 1917년 협상국 편에 섰다. 라이베리아는 1917년 8월 4일 독일에 선전포고했고, 쿠바·파나마·과테말라·니카라과·코스타리카·아이티·온두라스 등 중남미 나라들도 선전포고했다.',
                en: 'In March 1916 Germany declared war on Portugal, and Romania entered the war on 27 August with an eye on Transylvania. The United States declared war on Germany on 6 April 1917, but fought as an “associated power” rather than a formal ally. That year Greece, after the king was forced out, joined the Entente in June; the Republic of China declared war on Germany and Austria-Hungary on 14 August. Siam (now Thailand) and Brazil also joined the Allied side in 1917. Liberia declared war on Germany on 4 August 1917, and Latin American states including Cuba, Panama, Guatemala, Nicaragua, Costa Rica, Haiti and Honduras also declared war.',
                sources: [S.allies, S.usa, S.china, S.who],
            },
            {
                ko: '참여 방식은 저마다 달랐다. 브라질은 해군 전대를 지브롤터의 영국 함대에 합류시키고 의료단을 유럽에 보냈다. 중국은 대규모 전투부대 대신 노동자를 보냈는데, 영국과 프랑스를 위해 일한 중국인 노동자는 약 14만 명이었다. 선전포고만 한 나라와 대군을 주요 전선에 투입한 열강을 같은 무게로 셀 수는 없다.',
                en: 'The forms of participation varied. Brazil sent a naval division to join the British fleet at Gibraltar and a medical mission to Europe. China sent labourers rather than combat divisions: some 140,000 Chinese workers served the British and French. A state that only declared war cannot be weighed alongside the powers that put mass armies on the main fronts.',
                sources: [S.allies, S.clc],
            },
        ],
    },
    {
        heading: { ko: '교전국: 동맹국 {germany austria hungary turkey bulgaria}', en: 'The belligerents: the Central Powers {germany austria hungary turkey bulgaria}' },
        paragraphs: [
            {
                ko: '동맹국은 독일 제국, 오스트리아-헝가리, 오스만 제국, 불가리아 왕국의 네 나라였다. 그 출발점은 1879년 독일과 오스트리아-헝가리의 양국 동맹이었다. 오스트리아와 헝가리는 별개의 교전국이 아니라 하나의 이중제국을 이루었고, 1914년 7월 28일 세르비아에 선전포고하며 전쟁을 열었다. 독일은 서부와 동부 두 전선에서 싸우며 동맹국 전쟁 수행의 중심이 되었다.',
                en: 'The Central Powers were four states: the German Empire, Austria-Hungary, the Ottoman Empire and the Kingdom of Bulgaria. Their origin was the German–Austro-Hungarian alliance of 1879. Austria and Hungary formed a single Dual Monarchy rather than two belligerents, and it opened the war by declaring war on Serbia on 28 July 1914. Germany, fighting on both the Western and Eastern Fronts, became the centre of the coalition’s war effort.',
                sources: [S.ww1, S.allies, S.who],
            },
            {
                ko: '오스만 제국은 개전 뒤에도 몇 달 동안 공식 참전을 미루었다. 1914년 10월 29일 오스만 깃발을 단 옛 독일 군함들이 오데사 등 러시아 흑해 항구를 포격하자, 11월 협상국이 오스만 제국에 선전포고했다. 1913년 제2차 발칸 전쟁에서 마케도니아 대부분을 잃은 불가리아는 1915년 10월 14일 세르비아에 선전포고하며 동맹국에 가담했다.',
                en: 'The Ottoman Empire held back from formal entry for some months after the outbreak of war. On 29 October 1914 former German warships under the Ottoman flag bombarded Odessa and other Russian Black Sea ports, and in November the Entente declared war on the Ottoman Empire. Bulgaria, which had lost most of Macedonia in the Second Balkan War of 1913, joined the Central Powers by declaring war on Serbia on 14 October 1915.',
                sources: [S.gallipoli, S.allies, S.ww1],
            },
        ],
    },
    {
        heading: { ko: '제국의 동원: 자치령과 식민지 {uk canada australia new-zealand south-africa india france}', en: 'Imperial mobilisation: dominions and colonies {uk canada australia new-zealand south-africa india france}' },
        paragraphs: [
            {
                ko: '영국의 선전포고는 자치령과 식민지를 자동으로 전쟁에 끌어들였다. 캐나다·오스트레일리아·뉴질랜드·뉴펀들랜드·남아프리카 연방 같은 자치령은 내정과 군사비는 스스로 정했지만 외교권은 없었다. 영국 국립육군박물관에 따르면 제국 전역에서 300만 명이 넘는 군인과 노동자가 영국군과 함께 복무했다. 캐나다는 62만 명이 입대해 6만여 명이 전사했고, 오스트레일리아 제국군에는 41만 명 넘게 복무했으며, 뉴질랜드는 약 10만 명을 해외에 보내 1만 8000명가량을 잃었다. 1949년에야 캐나다에 편입된 뉴펀들랜드도 따로 연대를 보냈다.',
                en: 'Britain’s declaration of war automatically brought in its dominions and colonies. Dominions such as Canada, Australia, New Zealand, Newfoundland and South Africa controlled their own domestic policy and military spending but not their foreign policy. According to the National Army Museum, more than three million soldiers and labourers from across the empire served alongside the British Army. Some 620,000 Canadians enlisted and over 60,000 were killed; more than 410,000 Australians served in the Australian Imperial Force; New Zealand sent almost 100,000 overseas and lost around 18,000. Newfoundland, which joined Canada only in 1949, sent its own regiment.',
                sources: [S.allies, S.nam],
            },
            {
                ko: '1914년 영국령 인도군은 영국 육군보다 컸다. 약 127만~130만 명의 인도인이 전투병과 노동자로 복무했고, 서부전선에 14만 명, 중동에 70만 명 가까이 투입되었다. 아프리카에서는 서아프리카 변경군과 왕립 아프리카 소총대가 동아프리카 전역을 떠받쳤고, 적어도 18만 명이 짐꾼 부대에서 일했다. 남아프리카는 흑인을 무장시키기를 꺼려 6만 명이 넘는 노동자만 보냈다. 인도 국민회의 지도자들은 전쟁 협력이 자치를 앞당기리라 기대했지만, 전후 자치가 주어지지 않자 실망은 완전 독립 운동으로 이어졌다.',
                en: 'In 1914 the British Indian Army was larger than the British Army itself. Some 1.27–1.3 million Indians served as soldiers and labourers, about 140,000 on the Western Front and nearly 700,000 in the Middle East. In Africa the West African Frontier Force and the King’s African Rifles carried the East African campaign, and at least 180,000 Africans worked in the Carrier Corps; South Africa, unwilling to arm Black South Africans, sent over 60,000 as labourers only. Indian National Congress leaders hoped wartime support would hasten home rule; when self-government did not follow, disillusion fed the campaign for full independence.',
                sources: [S.ww1, S.nam],
            },
            {
                ko: '프랑스도 인구의 열세를 식민지 병력으로 메우려 했다. 1914년 8~12월 서부전선에서만 30만 명 가까이 전사한 프랑스는 그 빈자리를 식민지 군대로 일부 채웠고, 1914~1918년 50만 명이 넘는 식민지 병사가 서부전선에서 싸웠다. 서아프리카의 세네갈 저격병은 약 20만 명이 동원되어 13만 5000명 이상이 유럽에서 싸웠고 3만 명이 전사했다. 그들은 이프르와 딕스뮈드, 베르됭의 두오몽 요새 탈환, 슈맹데담 공세에서 싸웠고, 특히 플랑드르와 슈맹데담에서 손실이 컸다.',
                en: 'France too looked to its colonies to offset its demographic weakness. Having lost nearly 300,000 dead on the Western Front between August and December 1914 alone, it partly filled the gaps with colonial troops, over 500,000 of whom served on the Western Front in 1914–1918. Around 200,000 Senegalese Tirailleurs were raised in West Africa; more than 135,000 fought in Europe and 30,000 were killed. They fought at Ypres and Dixmude, in the recapture of Fort Douaumont at Verdun and on the Chemin des Dames, with especially heavy losses in Flanders and on the Chemin des Dames.',
                sources: [S.allies, S.seneg],
            },
        ],
    },
    {
        heading: { ko: '기동전에서 참호전으로: 1914~1916년의 육상 전선', en: 'From movement to trenches: the land fronts, 1914–1916' },
        paragraphs: [
            {
                ko: '독일군은 벨기에를 거쳐 프랑스 북부로 밀고 내려가 파리 40km 앞까지 다가섰다. 그러나 9월 5~12일 마른 전투에서 프랑스군과 영국 원정군이 독일군 사이에 벌어진 틈을 반격하자, 독일 제1·2군은 엔강까지 후퇴했다. 양측은 서로의 측면을 돌려고 북쪽으로 달려 나갔고, 1914년 말 영국 해협에서 스위스 국경까지 참호선이 끊김 없이 이어졌다. 독일은 단기 결전으로 양면 전쟁을 피한다는 목표를 이루지 못했다.',
                en: 'The German armies swept through Belgium into northern France and came within 40 km of Paris. But at the Battle of the Marne on 5–12 September French troops and the British Expeditionary Force struck at a gap that had opened between the German armies, and the German First and Second Armies fell back to the Aisne. Each side then tried to turn the other’s flank in a “race to the sea”, and by the end of 1914 an unbroken line of trenches ran from the Channel to the Swiss border. Germany had failed in its central aim of avoiding a long two-front war.',
                sources: [S.marne, S.ww1],
            },
            {
                ko: '동부전선은 더 유동적이었다. 러시아는 프랑스와의 약속대로 일찍 동프로이센에 진격했지만, 8~9월 탄넨베르크와 마주리 호수 전투에서 패해 동프로이센에서 물러났다. 갈리치아에서는 러시아가 오스트리아-헝가리군을 크게 이겼지만, 1915년 봄 갈리치아에서 밀려났고 5월 고를리체-타르누프 공세로 동맹국이 러시아령 폴란드에 진입했다. 1916년 6월 4일 시작된 브루실로프 공세는 오스트리아-헝가리군에 회복할 수 없는 손실을 입혔지만, 러시아군도 막대한 인명 손실을 치렀고 그 피로는 이듬해 혁명의 배경이 되었다.',
                en: 'The Eastern Front was more fluid. Russia advanced early into East Prussia as promised to France, but defeats at Tannenberg and the Masurian Lakes in August and September forced it out of East Prussia. In Galicia the Russians defeated Austria-Hungary heavily, but by spring 1915 the Russians had been driven from Galicia, and the Gorlice–Tarnów offensive of May let the Central Powers invade Russian Poland. The Brusilov offensive, launched on 4 June 1916, inflicted irreparable losses on the Austro-Hungarian army, yet its cost in Russian lives was enormous and the exhaustion it left became a background to the revolution of the following year.',
                sources: [S.ww1, S.brusilov],
            },
            {
                ko: '서부전선에서 참호와 철조망, 기관총과 포병은 공격을 극도로 어렵게 만들었다. 1915년 4월 22일 독일군은 이프르에서 처음으로 염소가스를 대규모로 썼고, 이후 모든 주요 교전국이 독가스를 사용해 약 130만 명의 사상자와 9만 명가량의 사망자를 냈다. 1916년 2월 21일부터 12월 18일까지 이어진 베르됭 전투는 전쟁에서 가장 긴 전투였고, 양측 사상자는 70만~97만 5000명으로 추산된다. 7월 1일 시작된 솜 전투 첫날 영국군은 1만 9240명의 전사자를 포함해 5만 7470명의 사상자를 냈으며, 11월 18일까지 300만 명 넘게 싸워 100만 명 이상이 죽거나 다쳤다.',
                en: 'On the Western Front trenches, barbed wire, machine guns and artillery made attacking extraordinarily costly. On 22 April 1915 at Ypres the Germans used chlorine gas on a large scale for the first time; all the major belligerents went on to use gas, which caused about 1.3 million casualties and some 90,000 deaths. The Battle of Verdun, from 21 February to 18 December 1916, was the longest of the war, with an estimated 700,000 to 975,000 casualties on both sides. On the first day of the Somme, 1 July, the British Army suffered 57,470 casualties including 19,240 killed; by 18 November more than three million men had fought there and over a million had been killed or wounded.',
                sources: [S.ww1, S.verdun, S.somme],
            },
        ],
    },
    {
        heading: { ko: '바다와 남부 전선: 봉쇄, 잠수함, 갈리폴리', en: 'The sea and the southern fronts: blockade, U-boats, Gallipoli' },
        paragraphs: [
            {
                ko: '영국은 개전 직후 독일 해상 봉쇄에 들어갔고, 식량까지 금제품으로 선언해 동맹국의 수입을 끊었다. 독일 해군은 1916년 5~6월 유틀란트 해전에서 영국 대함대와 맞섰지만 결정적 승부를 내지 못했고, 이후 독일 대양함대는 대부분 항구에 묶였다. 독일은 잠수함으로 맞섰다. 1915년 여객선 루시타니아호가 격침되어 미국이 항의하자, 독일은 여객선을 공격하지 않겠다고 약속했다.',
                en: 'Britain began a naval blockade of Germany soon after the outbreak of war and, by declaring foodstuffs contraband, cut the Central Powers’ imports. The German navy met the Grand Fleet at Jutland in May–June 1916 without a decisive result, and thereafter the High Seas Fleet was largely confined to port. Germany answered with submarines. After the sinking of the liner Lusitania in 1915 drew American protests, Germany promised not to target passenger liners.',
                sources: [S.blockade, S.ww1],
            },
            {
                ko: '1917년 2월 1일 독일은 미국이 참전하기 전에 영국의 해상 보급로를 끊겠다며 무제한 잠수함전을 재개했다. 잠수함은 5000척이 넘는 연합국 선박을 격침했지만 199척을 잃었고, 1917년 호위 선단 체제가 도입되자 손실은 크게 줄었다. 전함 중심의 해전보다 봉쇄와 잠수함전이 민간인의 삶과 중립국의 태도에 더 큰 영향을 미쳤다.',
                en: 'On 1 February 1917 Germany resumed unrestricted submarine warfare, aiming to sever Britain’s sea lanes before the United States could intervene. U-boats sank more than 5,000 Allied ships at the cost of 199 submarines, but losses fell sharply once escorted convoys were introduced in 1917. Blockade and submarine warfare shaped civilian life and the attitudes of neutrals more than any clash of battleships.',
                sources: [S.zimmermann, S.ww1],
            },
            {
                ko: '협상국은 해협을 장악해 오스만 제국을 굴복시키려고 1915년 갈리폴리 반도에 상륙했다. 3월 함대의 해협 돌파가 실패한 뒤 4월 상륙전이 시작되었지만, 1916년 1월 철수할 때까지 양측이 각각 약 25만 명의 사상자를 냈고 작전은 실패로 끝났다. 이 전투에서 이름을 얻은 무스타파 케말은 훗날 터키 공화국을 세웠다. 오스만 제국은 1914년 12월 사르카미시에서 엔베르 파샤가 이끈 10만 병력의 86%를 잃었다. 메소포타미아에서는 쿠트 포위에서 영국군을 꺾었지만 1917년 3월 바그다드를, 12월 예루살렘을 잃었고, 1916년 6월에는 영국의 지원을 받은 아랍 반란이 일어났다.',
                en: 'The Entente tried to knock the Ottoman Empire out by seizing the Straits, landing on the Gallipoli peninsula in 1915. After the fleet failed to force the Dardanelles in March, landings began in April, but by the withdrawal in January 1916 each side had suffered some 250,000 casualties and the campaign had failed. Mustafa Kemal, who rose to prominence there, later founded the Republic of Turkey. In December 1914 at Sarıkamış the Ottomans had lost 86% of Enver Pasha’s 100,000-strong force. In Mesopotamia they defeated the British at the siege of Kut, but lost Baghdad in March 1917 and Jerusalem in December, while in June 1916 the British-backed Arab Revolt began.',
                sources: [S.gallipoli, S.ww1],
            },
            {
                ko: '오스만 정부는 전쟁을 틈타 아르메니아인을 동부 지방에서 시리아로 강제 이송하며 죽음의 행진과 학살을 벌였다. 사망자는 정확히 알 수 없지만 국제제노사이드학자협회는 약 150만 명으로 추산하며, 아시리아인과 그리스인도 비슷한 공격을 받았다. 터키 정부는 지금도 제노사이드를 부인하지만 대부분의 역사가는 그 주장을 받아들이지 않는다.',
                en: 'Under cover of war the Ottoman government deported Armenians from the eastern provinces to Syria, in death marches and massacres. The exact toll is unknown, but the International Association of Genocide Scholars estimates around 1.5 million; Assyrians and Greeks suffered similar attacks. The Turkish government still denies the genocide, a position most historians reject.',
                sources: [S.ww1],
            },
            {
                ko: '이탈리아군은 1915~1917년 이손초 강을 따라 카도르나 장군의 정면 공격을 되풀이했지만 큰 진전 없이 피를 흘렸다. 1917년 10월 24일 독일군의 증원을 받은 오스트리아-헝가리군이 카포레토에서 침투 전술과 독가스로 이탈리아 제2군을 무너뜨리자, 이탈리아군은 150km를 물러나 피아베 강에서 버텼고 보셀리 내각이 무너졌다. 발칸에서 세르비아는 1914년 오스트리아의 침공을 두 차례 물리쳤지만, 1915년 10월 불가리아가 가세한 동맹국의 공세에 무너져 알바니아를 넘어 퇴각했다. 살아남은 세르비아군은 그리스로 옮겨져 살로니카 전선에서 싸움을 이어 갔다.',
                en: 'Between 1915 and 1917 the Italian army under General Cadorna made repeated frontal assaults along the Isonzo, bleeding heavily for little gain. On 24 October 1917 Austro-Hungarian forces reinforced by German units broke the Italian Second Army at Caporetto with infiltration tactics and gas; the Italians fell back 150 km to hold the Piave, and the Boselli government fell. In the Balkans Serbia repulsed two Austrian invasions in 1914, but collapsed under the Central Powers’ offensive of October 1915, now joined by Bulgaria, and retreated across Albania. The surviving Serbian troops were evacuated to Greece and fought on from the Salonika front.',
                sources: [S.ww1, S.caporetto],
            },
        ],
    },
    {
        heading: { ko: '후방의 총력전: 전시 경제, 굶주림, 파업과 항명', en: 'Total war at home: war economy, hunger, strikes and mutiny' },
        paragraphs: [
            {
                ko: '장기전은 국가가 생산과 노동, 식량을 통제하는 총력전으로 바뀌었다. 모든 교전국에서 국내총생산 중 정부 몫이 커져 독일과 프랑스에서는 50%를 넘었다. 1916년 8월 참모본부를 맡은 힌덴부르크와 루덴도르프는 군수 생산을 크게 늘리려는 「힌덴부르크 계획」을 세웠고, 같은 해 조국봉사법은 군대나 군수산업에 있지 않은 17~60세 남성을 모두 전시 노동에 동원했다. 남성이 전선으로 떠난 자리는 여성이 메웠다. 여성들은 전례 없는 규모로 노동 현장에 들어갔고, 이는 전후 여성 참정권 확대의 한 배경이 되었다.',
                en: 'The long war turned into total war, with the state directing production, labour and food. In every belligerent the government’s share of GDP rose, exceeding 50% in Germany and France. Hindenburg and Ludendorff, who took over the General Staff in August 1916, launched the Hindenburg Programme to multiply munitions output, and the Auxiliary Services Act of the same year required every man aged 17 to 60 not already in the forces or war industry to perform national service. Women filled the places of men sent to the front, entering the workforce in unprecedented numbers — one background to the postwar extension of women’s suffrage.',
                sources: [S.ww1, S.hindenburg],
            },
            {
                ko: '봉쇄와 흉작, 농업 인력과 비료의 군사 전용이 겹치며 독일은 1916~1917년 「순무의 겨울」을 맞았다. 감자 대신 순무가 주식이 되었고, 겨울 배급량은 하루 1000칼로리까지 떨어져 성인 남성에게 필요하다던 3000칼로리의 3분의 1에 그쳤다. 식량 부족은 곧바로 노동 쟁의로 이어졌다. 리프크네히트 체포에 항의한 1916년 6월의 파업, 1917년 4월의 「빵 파업」에 이어 1918년 1월에는 오스트리아-헝가리에서 3~25일 대파업이 벌어졌고, 독일에서도 100만 명 넘는 노동자가 생활·노동 조건 개선과 종전, 헌정 민주화를 요구하며 일손을 놓았다.',
                en: 'Blockade, poor harvests and the diversion of farm labour and fertiliser to the war brought Germany the “Turnip Winter” of 1916–1917. Turnips replaced potatoes as the staple, and winter rations fell to 1,000 calories a day, a third of the 3,000 deemed necessary for an adult man. Hunger fed directly into labour unrest. After a strike in June 1916 against Liebknecht’s arrest and the “bread strike” of April 1917, a mass strike gripped Austria-Hungary from 3 to 25 January 1918, and in Germany more than a million workers downed tools demanding better living and working conditions, an end to the war and democratisation of the constitution.',
                sources: [S.turnip, S.januar],
            },
            {
                ko: '베를린 파업은 리하르트 뮐러가 이끈 혁명적 직장위원들이 조직했고, 이때 처음으로 노동자 평의회가 폭넓게 선출되었다. 사민당 지도자 에베르트와 샤이데만은 노동자들의 압력으로 파업 지도부에 들어갔지만 운동을 누그러뜨리려 했다. 파업은 경찰과 군대에 진압되었고, 뮌헨에서 군수 노동자 파업을 조직한 쿠르트 아이스너 같은 지도자들은 체포되었으며 많은 노동자가 징집되어 전선으로 보내졌다. 1918년 11월 각지에서 생긴 노동자·병사 평의회 가운데 다수가 이 1월 파업을 본떴다.',
                en: 'The Berlin strike was organised by the Revolutionary Shop Stewards under Richard Müller, and workers’ councils were elected on a wide scale for the first time. The SPD leaders Ebert and Scheidemann joined the strike committee under pressure from the workers but worked to moderate it. Police and troops broke the strike; leaders such as Kurt Eisner, who had organised the munitions workers’ strike in Munich, were arrested, and many workers were drafted and sent to the front. Many of the workers’ and soldiers’ councils of November 1918 followed the pattern of the January strike.',
                sources: [S.januar],
            },
            {
                ko: '협상국 쪽 후방과 군대도 흔들렸다. 1917년 4월 16일 시작된 니벨 공세가 48시간 안의 결정적 승리라는 약속과 달리 큰 손실만 남기자, 5월 3일 한 사단이 공격 명령을 거부한 것을 시작으로 서부전선 프랑스 보병 사단의 절반 가까이가 항명에 휩싸였다. 병사들은 참호를 지키면서도 공격만은 거부했다. 후임 페탱은 무모한 공격을 멈추고 휴가를 늘리는 한편 3400건의 군법회의를 열어 554명에게 사형을 선고했고, 그중 26명이 처형되었다. 아일랜드에서는 1916년 4월 24일 부활절 봉기가 일어나 엿새 만에 진압되었고, 지도자 16명의 처형은 오히려 독립 지지를 키웠다.',
                en: 'Entente armies and home fronts wavered too. When the Nivelle offensive, begun on 16 April 1917 with the promise of decisive victory within 48 hours, produced only heavy losses, a division’s refusal to attack on 3 May set off mutinies that touched nearly half the French infantry divisions on the Western Front. The soldiers held their trenches but refused to attack. Nivelle’s successor Pétain halted futile assaults and granted more leave, while 3,400 courts-martial sentenced 554 mutineers to death, 26 of whom were executed. In Ireland the Easter Rising began on 24 April 1916 and was crushed within six days; the execution of sixteen of its leaders instead swelled support for independence.',
                sources: [S.ww1, S.mutiny, S.easter],
            },
        ],
    },
    {
        heading: { ko: '사회주의자와 전쟁', en: 'The socialists and the war' },
        paragraphs: [
            {
                ko: '계급투쟁과 국제주의를 내건 사회주의 정당들도 1914년 8월 다수가 자국 정부 편에 섰다. 독일 제국의회의 정당들은 정쟁을 멈추는 「성내 평화(Burgfrieden)」에 합의했고, 8월 4일 사민당 의원들은 전쟁공채에 만장일치로 찬성했다. 당내 회의에서는 92명 가운데 14명이 반대했지만 당의 규율에 따랐다. 같은 날 프랑스의 사회주의자들도 「신성 연합」으로 전쟁을 지지했다. 오스트리아·영국·러시아의 사회주의자 다수도 마찬가지였다.',
                en: 'In August 1914 most socialist parties, for all their commitment to class struggle and internationalism, sided with their own governments. The parties of the Reichstag agreed to a Burgfrieden, a political truce, and on 4 August the SPD deputies voted unanimously for war credits — fourteen of the ninety-two had opposed them in the party caucus but bowed to discipline; the same day French socialists rallied behind the war in what became known as the union sacrée. Most Austrian, British and Russian socialists did likewise.',
                sources: [S.zimmerwald, S.ww1],
            },
            {
                ko: '반대는 소수에서 시작해 넓어졌다. 카를 리프크네히트는 1914년 12월 2일 제국의회에서 두 번째 전쟁공채에 홀로 반대했고, 1916년 5월 1일 베를린에서 「전쟁 타도」를 외치다 체포되었다. 1915년 9월 5~8일 스위스 치머발트에 모인 반전 사회주의자들은 전쟁의 책임을 반동적 자본주의 정부들에 돌리고 무병합·무배상 평화를 요구했다. 이 흐름은 뒤이은 킨탈 회의로 이어져 「치머발트 운동」이라 불렸다. 미국의 유진 뎁스와 영국의 버트런드 러셀처럼 전쟁에 반대하다 투옥된 이들도 있었다. 인터내셔널이 무너진 과정과 치머발트 운동의 분열은 「[제2인터내셔널의 붕괴](' + ev('second-international-collapse-1914') + ')」 항목이 자세히 다룬다.',
                en: 'Opposition began with a few and widened. Karl Liebknecht cast the lone vote against the second war credits in the Reichstag on 2 December 1914 and was arrested in Berlin on 1 May 1916 after crying “Down with the war!”. Anti-war socialists meeting at Zimmerwald in Switzerland on 5–8 September 1915 blamed the war on reactionary capitalist governments and called for a peace without annexations or reparations; with the later conference at Kienthal they became known as the Zimmerwald movement. Some, like Eugene Debs in the United States and Bertrand Russell in Britain, were jailed for opposing the war. The collapse of the International and the splits of the Zimmerwald movement are told in [The Collapse of the Second International](' + ev('second-international-collapse-1914') + ').',
                sources: [S.liebknecht, S.zimmerwald, S.ww1],
            },
        ],
    },
    {
        heading: { ko: '1917년: 러시아 혁명과 미국의 참전 {russia usa germany}', en: '1917: revolution in Russia and American entry {russia usa germany}' },
        paragraphs: [
            {
                ko: '1916년 말까지 러시아의 사상자는 죽거나 다치거나 포로가 된 이를 합쳐 500만 명에 가까웠고, 도시는 식량 부족과 물가 폭등에 시달렸다. 1917년 3월 7일 페트로그라드 최대 공장인 푸틸로프 공장이 파업으로 멈추고, 이튿날 세계 여성의 날 집회가 빵을 요구하는 시위로 번졌다. 군대가 군중에게 발포하기를 거부하자 니콜라이 2세는 물러났다. 임시정부는 전쟁을 계속하겠다고 했지만, 페트로그라드 소비에트와 권력이 갈린 가운데 전선의 병사들은 갈수록 사기를 잃었다. 즉각적인 평화를 내건 볼셰비키는 11월 7일 권력을 잡았고, 12월 휴전에 이어 1918년 3월 3일 브레스트-리토프스크 강화로 전쟁에서 빠졌다. 러시아는 옛 제국 인구의 34%, 산업 지대의 54%, 탄전의 89%를 잃었다. 이 과정은 「[2월 혁명](' + ev('february-revolution') + ')」, 「[10월 혁명](' + ev('october-revolution') + ')」, 「[브레스트 강화와 독일의 동방 점령](' + ev('brest-litovsk') + ')」 항목에서 이어진다. 이 문서의 날짜는 그레고리력 기준이다.',
                en: 'By the end of 1916 Russian casualties — killed, wounded or captured — approached five million, and the cities suffered food shortages and soaring prices. On 7 March 1917 a strike shut the Putilov works, Petrograd’s largest plant, and the next day International Women’s Day rallies turned into demonstrations for bread. When troops refused to fire on the crowds, Nicholas II abdicated. The Provisional Government pledged to fight on, but with power divided between it and the Petrograd Soviet, frontline soldiers grew ever more demoralised. The Bolsheviks, promising immediate peace, took power on 7 November; an armistice in December was followed on 3 March 1918 by the Treaty of Brest-Litovsk, by which Russia left the war, losing 34% of the former empire’s population, 54% of its industrial land and 89% of its coalfields. The story continues in [The February Revolution](' + ev('february-revolution') + '), [The October Revolution](' + ev('october-revolution') + ') and [Brest-Litovsk and the German occupation of the East](' + ev('brest-litovsk') + '). Dates in this article follow the Gregorian calendar.',
                sources: [S.ww1, S.russrev, S.brest],
            },
            {
                ko: '미국은 1914년 중립을 지키면서도 연합국의 주요 물자 공급국이었다. 무제한 잠수함전 재개에 더해, 미국이 참전하면 멕시코에 텍사스·애리조나·뉴멕시코를 되찾게 해 주겠다는 1917년 1월 17일의 「치머만 전보」가 영국 정보기관에 해독되어 공개되자 여론이 돌아섰다. 의회는 4월 6일 독일에 선전포고했다. 윌슨 대통령은 미국이 전후 강화를 주도하기를 바랐고, 1918년 1월 「14개조」로 새로운 국제 질서와 국제연맹을 구상했다. 1917년 선발징병법으로 280만 명이 징집되었고, 1918년 11월 말까지 200만 명의 미국 원정군이 프랑스에 건너갔다.',
                en: 'Neutral in 1914, the United States was nonetheless a major supplier of the Allies. Besides the resumption of unrestricted submarine warfare, the Zimmermann telegram of 17 January 1917 — offering Mexico Texas, Arizona and New Mexico if the US entered the war — was decrypted by British intelligence and made public, turning opinion. Congress declared war on Germany on 6 April. President Wilson wanted the United States to shape the peace, and in January 1918 set out his vision of a new international order and a League of Nations in the Fourteen Points. The Selective Service Act of 1917 drafted 2.8 million men, and by the end of November 1918 two million soldiers of the American Expeditionary Forces had crossed to France.',
                sources: [S.zimmermann, S.ww1, S.usa],
            },
        ],
    },
    {
        heading: { ko: '1918년: 마지막 공세와 동맹국의 붕괴 {germany austria hungary turkey bulgaria}', en: '1918: the last offensives and the collapse of the Central Powers {germany austria hungary turkey bulgaria}' },
        paragraphs: [
            {
                ko: '러시아의 이탈로 동부에서 50개 가까운 사단을 빼낸 독일은 미군이 본격적으로 도착하기 전에 결판을 내려 했다. 1918년 3월 21일 루덴도르프는 「미하엘 작전」으로 춘계 공세를 시작해 생캉탱 부근 영국군 전선을 60km나 밀어냈고, 이어 다섯 차례 공세로 다시 마른 강까지 다가섰다. 그러나 보급이 따라가지 못해 7월 공세는 멈췄고, 3월 연합군 총사령관이 된 포슈가 반격에 나섰다. 8월 8일 아미앵 전투에서 오스트레일리아·캐나다·영국·프랑스군이 500대 넘는 전차를 앞세워 독일 전선을 뚫자 루덴도르프는 이날을 「독일군의 암흑의 날」이라 불렀다. 이로써 시작된 「백일 공세」에서 연합군은 9월 29일 힌덴부르크선을 돌파했다.',
                en: 'With Russia out of the war and nearly fifty divisions freed in the east, Germany tried to force a decision before American troops arrived in strength. On 21 March 1918 Ludendorff opened the spring offensive with Operation Michael, driving the British front near Saint-Quentin back 60 km, and in five offensives the Germans again reached the Marne. But supply could not keep pace, the offensives ended in July, and Foch, Allied supreme commander since March, counter-attacked. On 8 August at Amiens Australian, Canadian, British and French troops with over 500 tanks broke the German line, and Ludendorff called it “the Black Day of the German Army”. In the Hundred Days Offensive that followed, the Allies breached the Hindenburg Line from 29 September.',
                sources: [S.spring, S.ww1, S.allies, S.hundred],
            },
            {
                ko: '동맹국은 남쪽부터 무너졌다. 9월 15일 살로니카 전선에서 프랑스·세르비아·그리스군이 도브로폴레를 돌파하자 불가리아군이 무너졌고, 불가리아는 9월 29일 살로니카 휴전에 서명해 동맹국 가운데 처음으로 전쟁에서 이탈했다. 같은 날 독일 최고사령부는 황제에게 군사적 상황이 절망적이라고 보고했다. 다마스쿠스까지 잃은 오스만 제국은 10월 30일 무드로스 휴전에 서명했다.',
                en: 'The Central Powers crumbled from the south. On 15 September French, Serbian and Greek troops broke through at Dobro Pole on the Salonika front; the Bulgarian army collapsed, and on 29 September Bulgaria signed the Armistice of Salonica, the first of the Central Powers to leave the war. That same day the German Supreme Army Command told the Kaiser the military situation was hopeless. The Ottoman Empire, which had lost Damascus, signed the Armistice of Mudros on 30 October.',
                sources: [S.ww1],
            },
            {
                ko: '10월 24일 이탈리아군이 비토리오 베네토 공세를 시작했을 때 오스트리아-헝가리는 이미 안에서부터 해체되고 있었다. 10월 마지막 주 프라하·자그레브·부다페스트에서 독립이 선언되었고, 헝가리 사단들은 귀국을 요구했다. 제국군은 해체되었고 이탈리아군은 30만 명이 넘는 포로를 잡았다. 11월 3일 오스트리아-헝가리는 빌라 주스티 휴전을 받아들였고, 합스부르크 왕정이 무너진 뒤 오스트리아와 헝가리는 따로 휴전을 맺었다.',
                en: 'When the Italians opened the Vittorio Veneto offensive on 24 October, Austria-Hungary was already coming apart from within. In the last week of October independence was declared in Prague, Zagreb and Budapest, and Hungarian divisions demanded to be sent home. The imperial army disintegrated and the Italians took over 300,000 prisoners. On 3 November Austria-Hungary accepted the Armistice of Villa Giusti; after the fall of the Habsburg monarchy, Austria and Hungary signed separate armistices.',
                sources: [S.ww1],
            },
            {
                ko: '독일에서는 10월 3일 막스 폰 바덴이 총리가 되어 윌슨 대통령에게 14개조를 바탕으로 한 휴전을 요청했다. 그런데 해군 지휘부가 정부도 모르게 영국 함대와의 마지막 결전을 명령하자, 10월 30일 빌헬름스하펜의 수병들이 출항을 거부했고 11월 3일 킬에서 봉기가 일어났다. 수병과 노동자의 평의회는 며칠 만에 전국으로 번졌고, 11월 9일 공화국이 선포되며 빌헬름 2세가 퇴위했다. 그 과정은 「[독일 11월 혁명](' + ev('german-revolution-1918-1919') + ')」 항목이 다룬다. 11월 11일 오전 5시 콩피에뉴 숲의 열차 안에서 휴전이 조인되어 오전 11시에 발효되었다. 독일군은 라인강 서쪽에서 철수하고 함대와 무기를 넘겨야 했으며 해상 봉쇄는 그대로 유지되었다. 마지막 날에도 2738명이 전사했다.',
                en: 'In Germany Prince Max of Baden became chancellor on 3 October and asked President Wilson for an armistice based on the Fourteen Points. But when the naval command, without the government’s knowledge, ordered a final battle against the British fleet, sailors at Wilhelmshaven refused to sail on 30 October, and on 3 November revolt broke out in Kiel. Sailors’ and workers’ councils spread across the country within days; on 9 November a republic was proclaimed and Wilhelm II abdicated, as told in [The German Revolution of 1918–1919](' + ev('german-revolution-1918-1919') + '). At 5 a.m. on 11 November the armistice was signed in a railway carriage in the Compiègne forest and took effect at 11 a.m. Germany had to withdraw west of the Rhine and surrender its fleet and weapons, while the naval blockade remained in force. Even on the last day 2,738 men were killed.',
                sources: [S.ww1, S.kiel, S.armistice],
            },
        ],
    },
    {
        heading: { ko: '희생과 쟁점, 그리고 여파', en: 'The cost, the debates and the aftermath' },
        paragraphs: [
            {
                ko: '희생자 수는 집계 방식에 따라 크게 다르다. 흔히 인용되는 추계는 사망자 1500만~2200만 명이며, 그 가운데 군인이 900만~1100만 명, 민간인이 600만~1300만 명이다. 클로드펠터는 민간인 사망자에 대해 「일반적으로 받아들여지는 수치는 650만 명」이라고 하면서도 추산이 위험하다고 경고한다. 유럽에서 동원된 6000만 명 가운데 약 800만 명이 죽었고, 독일은 경제활동 남성 인구의 15.1%, 오스트리아-헝가리는 17.1%, 프랑스는 10.5%를 잃었다. 세르비아는 민간인과 질병 사망자를 합쳐 인구의 30% 가까운 120만 명 이상을 잃은 것으로 추산된다.',
                en: 'Death tolls vary widely with the method of counting. Commonly cited estimates give 15 to 22 million deaths, 9 to 11 million of them military and 6 to 13 million civilian. Clodfelter notes that “the generally accepted figure of noncombatant deaths is 6.5 million” while warning that civilian deaths are hazardous to estimate. Of the 60 million Europeans mobilised, some 8 million died; Germany lost 15.1% of its active male population, Austria-Hungary 17.1% and France 10.5%. Serbia is estimated to have lost over 1.2 million people including civilians and deaths from disease, nearly 30% of its population.',
                sources: [S.casualties, S.ww1, S.allies],
            },
            {
                ko: '봉쇄의 희생도 논쟁거리다. 독일 보건청은 1918년 12월 봉쇄로 76만 3000명의 민간인이 죽었다고 발표했지만, 1928년 연구는 42만 4000명, 제이 윈터는 독감을 뺀 초과 사망을 30만 명으로 추산했다. 이 수치는 봉쇄 해제를 바라던 독일의 선전 맥락에서 나온 것이라는 비판도 있다. 1918년 봄부터 퍼진 이른바 스페인 독감은 군대의 대규모 이동으로 확산이 빨라졌지만, 그 사망자 추산은 1700만~5000만 명, 많게는 1억 명까지 엇갈린다. 독감을 비롯한 질병은 군인 사망의 약 3분의 1을 차지했으므로, 전쟁 사망자와 독감 사망자의 경계도 분명하지 않다.',
                en: 'The cost of the blockade is also disputed. The German Board of Public Health claimed in December 1918 that 763,000 civilians had died because of it; a 1928 study put the figure at 424,000, and Jay Winter estimated 300,000 excess deaths after excluding influenza. Critics note that the German figure was produced amid a campaign to have the blockade lifted. The so-called Spanish flu, spreading from the spring of 1918, was accelerated by mass troop movements, but estimates of its toll range from 17 to 50 million and possibly as high as 100 million. Since disease, the 1918 pandemic included, caused about a third of all military deaths, the line between war deaths and influenza deaths is itself blurred.',
                sources: [S.blockade, S.flu, S.casualties],
            },
            {
                ko: '역사가들은 전쟁이 왜 시작되었는지만이 아니라 연합국이 왜 이겼는지, 장군들이 막대한 사상자에 얼마나 책임이 있는지, 병사들이 참호의 조건을 어떻게 견뎠는지, 후방이 전쟁을 어디까지 받아들였는지를 두고 오래 논쟁해 왔다. 21세기에는 점령, 정치의 급진화, 인종, 젠더, 정신 건강 같은 새로운 질문이 더해졌다. 전후 독일에서는 군대가 전장에서 진 것이 아니라 파업과 혁명을 일으킨 후방의 「배신」 때문에 졌다는 「등 뒤의 칼」 신화가 퍼졌다. 그러나 독일 최고사령부 스스로 9월 말 패배를 인정했고, 봉쇄가 패전을 얼마나 앞당겼는지에 대해서도 연구자들의 평가가 엇갈린다.',
                en: 'Historians have long debated not only why the war began but why the Allies won, how far the generals were responsible for the enormous casualties, how soldiers endured the trenches and how far the home fronts accepted the war. In the 21st century a cultural turn has added new questions about occupation, the radicalisation of politics, race, gender and mental health. In postwar Germany the “stab-in-the-back” myth held that the army had not been beaten in the field but betrayed by a home front of strikers and revolutionaries; yet the German high command itself had conceded defeat at the end of September, and scholars still differ over how far the blockade hastened the collapse.',
                sources: [S.ww1, S.stab, S.blockade],
            },
            {
                ko: '11월 11일의 휴전은 서부전선의 전투를 멈추었을 뿐 강화가 아니었다. 전쟁은 러시아·독일·오스트리아-헝가리·오스만의 네 제국과 로마노프·호엔촐레른·합스부르크·오스만 왕조를 무너뜨렸다. 1919~1920년 파리 강화 회의와 베르사유 조약을 비롯한 강화 조약들, 폴란드·핀란드·발트 3국·체코슬로바키아·유고슬라비아 같은 새 국가들, 1918~1919년의 혁명 물결과 1923년의 위기는 「[1차 세계대전의 여파](' + ev('world-war-i-aftermath-1918-1923') + ')」 항목에서 이어진다.',
                en: 'The armistice of 11 November halted the fighting on the Western Front; it was not a peace. The war brought down four empires — the Russian, German, Austro-Hungarian and Ottoman — and with them the Romanov, Hohenzollern, Habsburg and Ottoman dynasties. The Paris Peace Conference of 1919–1920 and the treaties beginning with Versailles, the new states such as Poland, Finland, the Baltic states, Czechoslovakia and Yugoslavia, the revolutionary wave of 1918–1919 and the crisis of 1923 are continued in [The aftermath of the First World War](' + ev('world-war-i-aftermath-1918-1923') + ').',
                sources: [S.ww1, S.armistice],
            },
        ],
    },
];

// The 29 timeline entries stored before this rewrite, copied verbatim from the DB
// (they carry the map's points and arrows).
const currentTimeline = [
    {
        "geo": {
            "lat": 43.86,
            "lng": 18.41,
            "kind": "point",
            "label": {
                "en": "Sarajevo",
                "ko": "사라예보"
            }
        },
        "body": {
            "en": "The assassination of Franz Ferdinand and his wife triggered the July Crisis.",
            "ko": "프란츠 페르디난트 부부 암살이 7월 위기의 계기가 됐다."
        },
        "date": "1914.06.28",
        "title": {
            "en": "Sarajevo assassination",
            "ko": "사라예보 암살"
        },
        "country": [
            "austria",
            "hungary"
        ]
    },
    {
        "geo": {
            "lat": 48.21,
            "lng": 16.37,
            "kind": "point",
            "label": {
                "en": "Vienna",
                "ko": "빈"
            }
        },
        "body": {
            "en": "Austria-Hungary declared war on Serbia.",
            "ko": "오스트리아-헝가리가 세르비아에 선전포고했다."
        },
        "date": "1914.07.28",
        "title": {
            "en": "Austria-Hungary opens the war",
            "ko": "오스트리아-헝가리의 개전"
        },
        "country": [
            "austria",
            "hungary",
            "serbia"
        ]
    },
    {
        "body": {
            "en": "The war widened through great-power intervention and Germany's invasion of Belgium. Montenegro sided with Serbia.",
            "ko": "독일·러시아·프랑스·영국의 참전과 벨기에 침공으로 전쟁이 확대됐다. 몬테네그로도 세르비아 편에 섰다."
        },
        "date": "1914.08",
        "title": {
            "en": "European powers enter",
            "ko": "유럽 열강의 참전"
        },
        "country": [
            "germany",
            "russia",
            "france",
            "uk",
            "belgium",
            "montenegro"
        ]
    },
    {
        "body": {
            "en": "Dominions and British India began contributing troops, labour and resources. Newfoundland was a separate dominion.",
            "ko": "자치령과 영국령 인도가 병력·노동·자원을 제공하기 시작했다. 뉴펀들랜드는 별도 자치령이었다."
        },
        "date": "1914.08",
        "title": {
            "en": "British imperial mobilization",
            "ko": "영국 제국의 동원"
        },
        "country": [
            "uk",
            "canada",
            "australia",
            "new-zealand",
            "south-africa",
            "india"
        ]
    },
    {
        "geo": {
            "kind": "arrow",
            "actor": {
                "en": "Central Powers",
                "ko": "동맹국군"
            },
            "label": {
                "en": "1914: Belgium → Marne",
                "ko": "1914: 벨기에 → 마른"
            },
            "points": [
                [
                    50.63,
                    5.57
                ],
                [
                    50.85,
                    4.35
                ],
                [
                    50.45,
                    3.95
                ],
                [
                    49.85,
                    3.29
                ],
                [
                    49.04,
                    3.4
                ]
            ],
            "variant": "axis"
        },
        "body": {
            "en": "German forces advanced through Belgium into northern France. The arrow schematically follows Liège–Brussels–Mons toward the Marne, where the advance was checked in September.",
            "ko": "독일군은 벨기에를 거쳐 프랑스 북부로 진격했다. 화살표는 리에주–브뤼셀–몽스–마른 방면의 서진·남진을 개략적으로 보여 준다. 9월 마른 전투에서 진격이 저지됐다."
        },
        "date": "1914.08–09",
        "title": {
            "en": "German advance through Belgium and France",
            "ko": "독일군의 벨기에·프랑스 진격"
        },
        "country": [
            "germany",
            "belgium",
            "france",
            "uk"
        ]
    },
    {
        "body": {
            "en": "Japan declared war on Germany.",
            "ko": "일본이 독일에 선전포고했다."
        },
        "date": "1914.08.23",
        "title": {
            "en": "Japan enters",
            "ko": "일본 참전"
        },
        "country": [
            "japan",
            "germany"
        ]
    },
    {
        "geo": {
            "lat": 44.62,
            "lng": 33.53,
            "kind": "point",
            "label": {
                "en": "Sevastopol",
                "ko": "세바스토폴"
            }
        },
        "body": {
            "en": "The Ottoman attack on Russian Black Sea ports was followed by declarations of war.",
            "ko": "오스만 함대의 러시아 흑해 항구 공격 뒤 상호 선전포고가 이어졌다."
        },
        "date": "1914.10.29–11",
        "title": {
            "en": "Ottoman entry",
            "ko": "오스만 제국 참전"
        },
        "country": [
            "turkey",
            "russia",
            "uk",
            "france"
        ]
    },
    {
        "geo": {
            "lat": 40.21,
            "lng": 26.28,
            "kind": "point",
            "label": {
                "en": "Gallipoli landing area",
                "ko": "갈리폴리 상륙지 일대"
            }
        },
        "body": {
            "en": "British, French, Australian and New Zealand forces landed at Gallipoli.",
            "ko": "영국·프랑스 및 오스트레일리아·뉴질랜드 병력이 갈리폴리에 상륙했다."
        },
        "date": "1915.04.25",
        "title": {
            "en": "Gallipoli landings",
            "ko": "갈리폴리 상륙"
        },
        "country": [
            "turkey",
            "uk",
            "france",
            "australia",
            "new-zealand"
        ]
    },
    {
        "geo": {
            "lat": 41.9,
            "lng": 12.5,
            "kind": "point",
            "label": {
                "en": "Rome",
                "ko": "로마"
            }
        },
        "body": {
            "en": "Italy declared war on Austria-Hungary.",
            "ko": "이탈리아가 오스트리아-헝가리에 선전포고했다."
        },
        "date": "1915.05.23",
        "title": {
            "en": "Italy joins the Allies",
            "ko": "이탈리아의 협상국 참전"
        },
        "country": [
            "italy",
            "austria",
            "hungary"
        ]
    },
    {
        "geo": {
            "kind": "arrow",
            "actor": {
                "en": "Central Powers",
                "ko": "동맹국군"
            },
            "label": {
                "en": "1915: Belgrade → Morava",
                "ko": "1915: 베오그라드 → 모라바"
            },
            "points": [
                [
                    44.82,
                    20.46
                ],
                [
                    44.66,
                    20.93
                ],
                [
                    43.98,
                    21.26
                ],
                [
                    43.58,
                    21.33
                ]
            ],
            "variant": "axis"
        },
        "body": {
            "en": "German and Austro-Hungarian forces attacked from the north, Bulgaria from the east. The arrow represents the northern advance from Belgrade down the Morava valley. Serbian forces retreated toward Albania.",
            "ko": "독일·오스트리아-헝가리군은 북쪽에서, 불가리아군은 동쪽에서 공격했다. 화살표는 베오그라드에서 모라바 계곡을 따라 남하한 북부 공격축을 나타낸다. 세르비아군은 알바니아 방면으로 후퇴했다."
        },
        "date": "1915.10–11",
        "title": {
            "en": "Central Powers invasion of Serbia",
            "ko": "동맹국의 세르비아 공세"
        },
        "country": [
            "germany",
            "austria",
            "hungary",
            "bulgaria",
            "serbia"
        ]
    },
    {
        "geo": {
            "lat": 42.7,
            "lng": 23.32,
            "kind": "point",
            "label": {
                "en": "Sofia",
                "ko": "소피아"
            }
        },
        "body": {
            "en": "Bulgaria declared war on Serbia.",
            "ko": "불가리아가 세르비아에 선전포고했다."
        },
        "date": "1915.10.14",
        "title": {
            "en": "Bulgaria joins the Central Powers",
            "ko": "불가리아의 동맹국 참전"
        },
        "country": [
            "bulgaria",
            "serbia",
            "germany",
            "austria",
            "hungary"
        ]
    },
    {
        "geo": {
            "lat": 49.16,
            "lng": 5.38,
            "kind": "point",
            "label": {
                "en": "Verdun",
                "ko": "베르됭"
            }
        },
        "body": {
            "en": "France and Germany fought a prolonged battle of attrition.",
            "ko": "프랑스와 독일 사이의 장기 소모전이 벌어졌다."
        },
        "date": "1916.02–12",
        "title": {
            "en": "Battle of Verdun",
            "ko": "베르됭 전투"
        },
        "country": [
            "france",
            "germany"
        ]
    },
    {
        "body": {
            "en": "The seizure of German ships was followed by a formal state of war.",
            "ko": "독일 선박 나포 뒤 두 나라가 공식 교전 상태에 들어갔다."
        },
        "date": "1916.03.09",
        "title": {
            "en": "Germany declares war on Portugal",
            "ko": "독일의 대포르투갈 선전포고"
        },
        "country": [
            "portugal",
            "germany"
        ]
    },
    {
        "geo": {
            "kind": "arrow",
            "actor": {
                "en": "Russian army",
                "ko": "러시아군"
            },
            "label": {
                "en": "1916: Lutsk breakthrough",
                "ko": "1916: 루츠크 돌파"
            },
            "points": [
                [
                    50.62,
                    26.25
                ],
                [
                    50.75,
                    25.33
                ],
                [
                    51.02,
                    25.1
                ]
            ],
            "variant": "red"
        },
        "body": {
            "en": "Russia’s Southwestern Front broke through Austro-Hungarian positions. The arrow sketches the northern axis from the Rovno area through Lutsk toward Kovel; Kovel was not captured.",
            "ko": "러시아 남서전선군이 오스트리아-헝가리군 전선을 돌파했다. 화살표는 로브노 방면에서 루츠크를 거쳐 코벨 쪽으로 나아간 북부 공격축의 개략이다. 코벨은 함락하지 못했다."
        },
        "date": "1916.06–09",
        "title": {
            "en": "Brusilov offensive: Lutsk breakthrough",
            "ko": "브루실로프 공세: 루츠크 돌파"
        },
        "country": [
            "russia",
            "austria",
            "hungary",
            "germany"
        ]
    },
    {
        "geo": {
            "lat": 50,
            "lng": 2.65,
            "kind": "point",
            "label": {
                "en": "Somme battlefield",
                "ko": "솜 전장"
            }
        },
        "body": {
            "en": "British imperial and French forces fought Germany in a major battle of attrition.",
            "ko": "영국 제국·프랑스군과 독일군의 대규모 소모전이 계속됐다."
        },
        "date": "1916.07–11",
        "title": {
            "en": "Battle of the Somme",
            "ko": "솜 전투"
        },
        "country": [
            "uk",
            "france",
            "germany",
            "canada",
            "australia",
            "new-zealand",
            "south-africa"
        ]
    },
    {
        "geo": {
            "lat": 44.43,
            "lng": 26.1,
            "kind": "point",
            "label": {
                "en": "Bucharest",
                "ko": "부쿠레슈티"
            }
        },
        "body": {
            "en": "Romania declared war on Austria-Hungary.",
            "ko": "루마니아가 오스트리아-헝가리에 선전포고했다."
        },
        "date": "1916.08.27",
        "title": {
            "en": "Romania enters",
            "ko": "루마니아 참전"
        },
        "country": [
            "romania",
            "austria",
            "hungary"
        ]
    },
    {
        "geo": {
            "kind": "arrow",
            "actor": {
                "en": "British imperial forces",
                "ko": "영국 제국군"
            },
            "label": {
                "en": "1917: Kut → Baghdad",
                "ko": "1917: 쿠트 → 바그다드"
            },
            "points": [
                [
                    32.51,
                    45.82
                ],
                [
                    32.78,
                    45.07
                ],
                [
                    33.09,
                    44.58
                ],
                [
                    33.32,
                    44.37
                ]
            ],
            "variant": "red"
        },
        "body": {
            "en": "Reorganized after the 1916 surrender at Kut, British and Indian forces recaptured the town in February 1917 and advanced northwest along the Tigris, entering Baghdad on 11 March.",
            "ko": "영국·인도군은 1916년 쿠트에서의 항복 이후 재편해 공세를 재개했다. 1917년 2월 쿠트를 되찾고 티그리스강을 따라 북서진해 3월 11일 바그다드에 입성했다."
        },
        "date": "1917.02–03",
        "title": {
            "en": "Recapture of Kut and advance to Baghdad",
            "ko": "쿠트 재점령과 바그다드 진격"
        },
        "country": [
            "uk",
            "india",
            "turkey"
        ]
    },
    {
        "geo": {
            "lat": 59.94,
            "lng": 30.31,
            "kind": "point",
            "label": {
                "en": "Petrograd",
                "ko": "페트로그라드"
            }
        },
        "body": {
            "en": "Tsarism fell, but the Provisional Government continued the war. The name follows the Julian calendar.",
            "ko": "러시아 제정이 붕괴했으나 임시정부는 전쟁을 계속했다. 명칭은 율리우스력에서 유래한다."
        },
        "date": "1917.03",
        "title": {
            "en": "February Revolution",
            "ko": "2월 혁명"
        },
        "country": [
            "russia"
        ]
    },
    {
        "body": {
            "en": "The United States declared war on Germany.",
            "ko": "미국이 독일에 선전포고했다."
        },
        "date": "1917.04.06",
        "title": {
            "en": "US entry",
            "ko": "미국 참전"
        },
        "country": [
            "usa",
            "germany"
        ]
    },
    {
        "geo": {
            "lat": 37.98,
            "lng": 23.73,
            "kind": "point",
            "label": {
                "en": "Athens",
                "ko": "아테네"
            }
        },
        "body": {
            "en": "Greece entered on the Allied side after a domestic split.",
            "ko": "국내 분열 끝에 그리스가 협상국 편으로 참전했다."
        },
        "date": "1917.06",
        "title": {
            "en": "Greece joins the Allies",
            "ko": "그리스의 협상국 합류"
        },
        "country": [
            "greece"
        ]
    },
    {
        "body": {
            "en": "Siam declared war on Germany and Austria-Hungary.",
            "ko": "시암이 독일·오스트리아-헝가리에 선전포고했다."
        },
        "date": "1917.07.22",
        "title": {
            "en": "Siam enters",
            "ko": "시암 참전"
        },
        "country": [
            "thailand",
            "germany",
            "austria",
            "hungary"
        ]
    },
    {
        "body": {
            "en": "China declared war on Germany and Austria-Hungary; Chinese labourers were already supporting the Allies.",
            "ko": "중화민국이 독일·오스트리아-헝가리에 선전포고했다. 중국인 노동자는 이미 협상국을 지원하고 있었다."
        },
        "date": "1917.08.14",
        "title": {
            "en": "China enters",
            "ko": "중화민국 참전"
        },
        "country": [
            "china",
            "germany",
            "austria",
            "hungary"
        ]
    },
    {
        "geo": {
            "kind": "arrow",
            "actor": {
                "en": "Central Powers",
                "ko": "동맹국군"
            },
            "label": {
                "en": "1917: Caporetto → Piave",
                "ko": "1917: 카포레토 → 피아베"
            },
            "points": [
                [
                    46.25,
                    13.58
                ],
                [
                    46.07,
                    13.24
                ],
                [
                    45.96,
                    12.94
                ],
                [
                    45.76,
                    12.49
                ]
            ],
            "variant": "axis"
        },
        "body": {
            "en": "German and Austro-Hungarian troops broke through at Caporetto. Italian forces withdrew across the Tagliamento to the Piave. The arrow shows the broad southwestward advance via Udine.",
            "ko": "독일·오스트리아-헝가리군이 카포레토에서 이탈리아군 전선을 돌파했다. 이탈리아군은 타글리아멘토강을 넘어 피아베강 방어선으로 물러났다. 화살표는 우디네를 거치는 남서쪽 진격 방향을 나타낸다."
        },
        "date": "1917.10.24–11",
        "title": {
            "en": "Caporetto breakthrough and advance to the Piave",
            "ko": "카포레토 돌파와 피아베강 진출"
        },
        "country": [
            "germany",
            "austria",
            "hungary",
            "italy"
        ]
    },
    {
        "body": {
            "en": "Brazil declared war on Germany.",
            "ko": "브라질이 독일에 선전포고했다."
        },
        "date": "1917.10.26",
        "title": {
            "en": "Brazil enters",
            "ko": "브라질 참전"
        },
        "country": [
            "brazil",
            "germany"
        ]
    },
    {
        "geo": {
            "lat": 59.94,
            "lng": 30.31,
            "kind": "point",
            "label": {
                "en": "Petrograd",
                "ko": "페트로그라드"
            }
        },
        "body": {
            "en": "The Bolsheviks seized power in Petrograd.",
            "ko": "볼셰비키가 페트로그라드에서 권력을 장악했다."
        },
        "date": "1917.11.07",
        "title": {
            "en": "October Revolution",
            "ko": "10월 혁명"
        },
        "country": [
            "russia"
        ]
    },
    {
        "geo": {
            "lat": 52.1,
            "lng": 23.69,
            "kind": "point",
            "label": {
                "en": "Brest-Litovsk",
                "ko": "브레스트-리토프스크"
            }
        },
        "body": {
            "en": "Soviet Russia made peace with the Central Powers and withdrew.",
            "ko": "소비에트 러시아가 동맹국과 강화해 전쟁에서 이탈했다."
        },
        "date": "1918.03.03",
        "title": {
            "en": "Brest-Litovsk treaty",
            "ko": "브레스트 강화"
        },
        "country": [
            "russia",
            "germany",
            "austria",
            "hungary",
            "turkey",
            "bulgaria"
        ]
    },
    {
        "geo": {
            "lat": 49.43,
            "lng": 2.91,
            "kind": "point",
            "label": {
                "en": "Compiègne",
                "ko": "콩피에뉴"
            }
        },
        "body": {
            "en": "Bulgaria, the Ottoman Empire and Austria-Hungary concluded armistices; Germany's armistice ended Western Front fighting on 11 November.",
            "ko": "불가리아·오스만 제국·오스트리아-헝가리가 차례로 휴전하고, 11월 11일 독일과의 휴전으로 서부전선 전투가 중단됐다."
        },
        "date": "1918.09–11",
        "title": {
            "en": "Successive Central Powers armistices",
            "ko": "동맹국의 연쇄 휴전"
        },
        "country": [
            "bulgaria",
            "turkey",
            "austria",
            "hungary",
            "germany"
        ]
    },
    {
        "geo": {
            "kind": "arrow",
            "actor": {
                "en": "British imperial forces",
                "ko": "영국 제국군"
            },
            "label": {
                "en": "1918: Palestine → Damascus",
                "ko": "1918: 팔레스타인 → 다마스쿠스"
            },
            "points": [
                [
                    32.2,
                    34.89
                ],
                [
                    32.6,
                    35.29
                ],
                [
                    32.7,
                    35.58
                ],
                [
                    33,
                    35.65
                ],
                [
                    33.51,
                    36.29
                ]
            ],
            "variant": "red"
        },
        "body": {
            "en": "The Egyptian Expeditionary Force broke the Ottoman front in Palestine; the Desert Mounted Corps and other formations pursued north via the Sea of Galilee. Arab forces advanced on a separate inland axis; Damascus fell on 1 October. The arrow sketches the British imperial advance.",
            "ko": "이집트 원정군은 팔레스타인의 오스만 전선을 돌파했고, 사막기마군단 등이 갈릴리호 방면을 거쳐 북진했다. 아랍군도 별도의 내륙 축에서 진격했으며 10월 1일 다마스쿠스가 함락됐다. 화살표는 영국 제국군의 북진 축을 개략적으로 표시한다."
        },
        "date": "1918.09.19–10.01",
        "title": {
            "en": "Megiddo breakthrough and pursuit to Damascus",
            "ko": "메기도 돌파와 다마스쿠스 추격"
        },
        "country": [
            "uk",
            "india",
            "australia",
            "new-zealand",
            "turkey"
        ]
    },
    {
        "geo": {
            "lat": 48.8,
            "lng": 2.13,
            "kind": "point",
            "label": {
                "en": "Versailles",
                "ko": "베르사유"
            }
        },
        "body": {
            "en": "The settlement with Germany was signed at Versailles; the US Senate did not ratify it.",
            "ko": "전후 강화의 일부로 독일과 베르사유 조약이 체결됐다. 미국 상원은 비준하지 않았다."
        },
        "date": "1919.06.28",
        "title": {
            "en": "Treaty of Versailles",
            "ko": "베르사유 조약"
        },
        "country": [
            "germany",
            "france",
            "uk",
            "usa",
            "italy",
            "japan"
        ]
    }
];

// New timeline rows; merged with the stored entries below.
const newTimeline = [
    ['1914.08.26–30', '탄넨베르크 전투', 'Battle of Tannenberg', '독일 제8군이 동프로이센에 들어온 러시아 제2군을 포위해 거의 섬멸했다.', 'The German Eighth Army encircled and almost destroyed the Russian Second Army in East Prussia.', ['germany', 'russia'], P(53.49, 20.13, '탄넨베르크', 'Tannenberg')],
    ['1914.09.05–12', '마른 전투', 'First Battle of the Marne', '프랑스군과 영국 원정군의 반격으로 독일군이 엔강까지 물러났고, 이후 서부전선은 참호전으로 굳었다.', 'A Franco-British counter-attack drove the Germans back to the Aisne; the Western Front then settled into trench warfare.', ['france', 'uk', 'germany'], P(49.04, 3.4, '마른 전장', 'Marne battlefield')],
    ['1915.04.22', '이프르에서 독가스 대규모 사용', 'Chlorine gas at Ypres', '독일군이 서부전선에서 처음으로 염소가스를 대규모로 썼다.', 'German troops used chlorine gas on a large scale for the first time on the Western Front.', ['germany', 'france', 'belgium'], P(50.85, 2.88, '이프르', 'Ypres')],
    ['1915.05.07', '루시타니아호 격침', 'Sinking of the Lusitania', '독일 잠수함이 여객선 루시타니아호를 경고 없이 격침해 1197명이 숨졌다.', 'A German U-boat sank the liner Lusitania without warning; 1,197 people died.', ['germany', 'uk', 'usa']],
    ['1916.05.31–06.01', '유틀란트 해전', 'Battle of Jutland', '영국 대함대와 독일 대양함대가 맞붙은 전쟁 중 유일한 대규모 전함 해전으로, 결정적 승부는 나지 않았다.', 'The war’s only full-scale clash of battleship fleets ended without a decisive result.', ['uk', 'germany']],
    ['1917.02.01', '무제한 잠수함전 재개', 'Unrestricted submarine warfare resumed', '독일이 대서양의 모든 선박을 경고 없이 공격하는 무제한 잠수함전을 재개했다.', 'Germany resumed unrestricted submarine warfare against all shipping in the Atlantic.', ['germany', 'uk', 'usa']],
    ['1917.05.03', '프랑스군 항명', 'French Army mutinies', '니벨 공세가 실패한 뒤 공격 명령 거부가 서부전선 프랑스 보병 사단의 절반 가까이로 번졌다.', 'After the failed Nivelle offensive, refusals to attack spread to nearly half the French infantry divisions on the Western Front.', ['france']],
    ['1918.01', '1월 대파업', 'January strikes', '오스트리아-헝가리와 독일에서 노동자들이 생활 조건 개선과 종전을 요구하며 파업했고, 베를린에서는 노동자 평의회가 선출되었다.', 'Workers in Austria-Hungary and Germany struck for better living conditions and an end to the war; in Berlin workers’ councils were elected.', ['austria', 'hungary', 'germany'], P(52.52, 13.405, '베를린', 'Berlin')],
    ['1918.03.21', '독일 춘계 공세', 'German spring offensive', '루덴도르프가 미하엘 작전으로 서부전선 최후의 대공세를 시작했다.', 'Ludendorff launched Operation Michael, Germany’s last great offensive in the west.', ['germany', 'uk', 'france'], P(49.85, 3.29, '생캉탱', 'Saint-Quentin')],
    ['1918.08.08', '아미앵 전투와 백일 공세', 'Amiens and the Hundred Days', '연합군이 아미앵에서 독일 전선을 뚫었고, 루덴도르프는 이날을 「독일군의 암흑의 날」이라 불렀다.', 'The Allies broke the German line at Amiens; Ludendorff called it the Black Day of the German Army.', ['uk', 'australia', 'canada', 'france', 'germany'], P(49.89, 2.3, '아미앵', 'Amiens')],
    ['1918.11.03', '킬 수병 봉기', 'Kiel mutiny', '출항 명령을 거부한 수병들이 킬에서 봉기해 노동자·병사 평의회가 전국으로 번졌다.', 'Sailors who refused to sail rose in Kiel; workers’ and soldiers’ councils spread across Germany.', ['germany'], P(54.32, 10.14, '킬', 'Kiel')],
];

const built = buildEvent({
    id: 'world-war-i',
    title: { ko: '1차 세계대전', en: 'First World War' },
    period: '1914–1918',
    sortOrder: 15,
    question: { ko: '발칸의 위기는 어떻게 세계전쟁으로 번졌는가?', en: 'How did a Balkan crisis become a world war?' },
    summary: {
        ko: '1914–1918년 협상국과 동맹국이 벌인 세계전쟁. 프랑스·러시아·영국 제국을 중심으로 일본·이탈리아·미국 등이 가담한 협상국이 독일·오스트리아-헝가리·오스만 제국·불가리아와 싸웠다. 전쟁은 자치령·식민지의 병력과 노동까지 동원했으며 러시아 혁명과 제국들의 붕괴로 이어졌다.',
        en: 'A global war in 1914–1918. The Allies, centred on France, Russia and the British Empire and joined by Japan, Italy, the United States and others, fought Germany, Austria-Hungary, the Ottoman Empire and Bulgaria. Mobilization extended to dominions and colonies; revolution and imperial collapse transformed the settlement.',
    },
    outcome: {
        ko: '1918년 9~11월 불가리아·오스만 제국·오스트리아-헝가리·독일이 차례로 휴전하며 동맹국의 패배로 끝났다. 러시아·독일·오스트리아-헝가리·오스만의 네 제국이 무너졌고, 강화 회의와 새 국가들, 혁명의 물결은 「1차 세계대전의 여파」로 이어진다.',
        en: 'The war ended in the defeat of the Central Powers, as Bulgaria, the Ottoman Empire, Austria-Hungary and Germany signed armistices between September and November 1918. Four empires fell — the Russian, German, Austro-Hungarian and Ottoman; the peace conference, the new states and the revolutionary wave are continued in “The aftermath of the First World War”.',
    },
    sections,
    timeline: newTimeline,
    locations: [
        ['사라예보', 'Sarajevo', 43.86, 18.41, 'main'],
        ['리에주', 'Liège', 50.63, 5.57, 'place'],
        ['베르됭', 'Verdun', 49.16, 5.38, 'place'],
        ['솜 전장', 'Somme battlefield', 50, 2.65, 'place'],
        ['마른 전장', 'Marne battlefield', 49.04, 3.4, 'place'],
        ['베오그라드', 'Belgrade', 44.82, 20.46, 'place'],
        ['루츠크', 'Lutsk', 50.75, 25.33, 'place'],
        ['카포레토', 'Caporetto', 46.25, 13.58, 'place'],
        ['갈리폴리', 'Gallipoli', 40.21, 26.28, 'place'],
        ['브레스트-리토프스크', 'Brest-Litovsk', 52.1, 23.69, 'place'],
        ['바그다드', 'Baghdad', 33.32, 44.37, 'place'],
        ['다마스쿠스', 'Damascus', 33.51, 36.29, 'place'],
        ['탄넨베르크', 'Tannenberg', 53.49, 20.13, 'place'],
        ['이프르', 'Ypres', 50.85, 2.88, 'place'],
        ['킬', 'Kiel', 54.32, 10.14, 'place'],
        ['콩피에뉴', 'Compiègne', 49.43, 2.91, 'place'],
    ],
    countries: ['france', 'russia', 'uk', 'serbia', 'belgium', 'montenegro', 'japan', 'italy', 'portugal', 'romania', 'usa', 'greece', 'thailand', 'china', 'brazil', 'cuba', 'panama', 'liberia', 'guatemala', 'nicaragua', 'costa-rica', 'haiti', 'honduras', 'germany', 'austria', 'hungary', 'turkey', 'bulgaria', 'canada', 'australia', 'new-zealand', 'south-africa', 'india'],
    relations: { related: ['february-revolution', 'october-revolution', 'brest-litovsk', 'german-revolution-1918-1919'] },
    sides: [
        { id: 'entente', label: { en: 'Entente Powers', ko: '협상국' } },
        { id: 'central-powers', label: { en: 'Central Powers', ko: '동맹국' } },
        { id: 'antiwar-socialists', label: { en: 'Anti-war socialists', ko: '반전 사회주의자' } },
    ],
    people: [],
});

// Keep the stored link expressions (policy 'auto') and merge the timeline:
// the 29 stored entries verbatim plus the new rows, in date order (stable).
built.fields.link_expressions = [
    { lang: 'ko', role: 'identity', text: '제1차 세계대전', policy: 'auto' },
    { lang: 'ko', role: 'identity', text: '제1차세계대전', policy: 'auto' },
    { lang: 'ko', role: 'identity', text: '1차세계대전', policy: 'auto' },
    { lang: 'en', role: 'identity', text: 'World War I', policy: 'auto' },
    { lang: 'en', role: 'identity', text: 'First World War', policy: 'auto' },
];
const dateKey = d => { const [y, m = 0, day = 0] = d.match(/^\d{4}(?:\.\d{2}){0,2}/)[0].split('.').map(Number); return y * 10000 + m * 100 + day; };
// The 1919 Versailles row moves out: the peace treaties belong to the aftermath cluster.
built.fields.timeline = [...currentTimeline.filter(row => row.date !== '1919.06.28'), ...built.fields.timeline]
    .map((row, i) => ({ row, i }))
    .sort((a, b) => dateKey(a.row.date) - dateKey(b.row.date) || a.i - b.i)
    .map(({ row }) => row);

const event = built;
module.exports = { event };
