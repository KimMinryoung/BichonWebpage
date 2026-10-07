// 보불전쟁 (1870–1871): queue 2061. Sections come from sec-…-a (1866년 이후 →
// 스당 → 9월 4일 → 포위와 지방의 전쟁) and sec-…-b (인터내셔널과 사회민주주의자의
// 반전 → 제국 선포와 휴전 → 프랑크푸르트 조약 → 평가). Timeline, locations and
// person relations are kept here. `links` carries the link-review decisions for
// the event title and the new glossary terms (terms-franco-prussian-war-1870-1871.js).
const { event: buildEvent, P } = require('./lib');

const parts = ['a', 'b'].map(slug => require(`./sec-franco-prussian-war-1870-1871-${slug}`));
const sections = parts.flatMap(p => p.sections);

const timeline = [
  ['1870-07-13', '엠스 전보', 'The Ems dispatch', '바트엠스에서 빌헬름 1세가 프랑스 대사의 요구를 거절했고, 비스마르크가 보고 전보를 줄여 그날 저녁 공개했다.', 'At Bad Ems Wilhelm I refused the French ambassador\'s demand; Bismarck cut the report down and released it that evening.', 'germany', P(50.3386, 7.7144, '바트엠스', 'Bad Ems')],
  ['1870-07-19', '프랑스의 선전포고', 'France declares war', '입법원이 전쟁 공채를 가결한 뒤 프랑스가 프로이센에 선전포고했다. 남독일 국가들이 곧바로 프로이센 편에 섰다.', 'After the legislature voted war credits, France declared war on Prussia; the South German states at once sided with Prussia.', ['france', 'germany'], P(48.8566, 2.3522, '파리', 'Paris')],
  ['1870-07-21', '베벨·리프크네히트의 전쟁 공채 기권', 'Bebel and Liebknecht abstain on war credits', '북독일연방 제국의회에서 사회민주노동자당의 두 의원이 전쟁 공채 표결에 기권했다(독일어 출처는 19일).', 'In the North German Reichstag the two Social Democratic Workers\' Party deputies abstained in the vote on war credits (19 July in the German source).', 'germany', P(52.5186, 13.3763, '베를린', 'Berlin')],
  ['1870-07-23', '인터내셔널 총평의회의 첫 담화', 'First address of the General Council', '마르크스가 쓴 담화는 전쟁을 왕조 전쟁으로 규탄하고, 독일 노동자에게 방어 전쟁이 프랑스 인민에 대한 전쟁으로 변질되지 않게 하라고 경고했다.', 'Marx\'s address denounced a dynastic war and warned German workers not to let a defensive war degenerate into a war against the French people.', 'uk'],
  ['1870-08-04', '비상부르 전투', 'Battle of Wissembourg', '황태자의 제3군이 두에 사단을 압도하며 첫 전투가 벌어졌다.', 'The crown prince\'s Third Army overwhelmed Douay\'s division in the first action of the war.', ['france', 'germany'], P(49.0372, 7.9456, '비상부르', 'Wissembourg')],
  ['1870-08-06', '뵈르트와 스피슈렌', 'Wörth and Spicheren', '마크마옹의 군대가 뵈르트에서 패해 보주 너머로 물러났고, 같은 날 스피슈렌에서 프로사르 군단이 밀려났다.', 'MacMahon\'s army was beaten at Wörth and fell back beyond the Vosges; the same day Frossard\'s corps was driven from Spicheren.', ['france', 'germany'], P(48.9389, 7.7472, '뵈르트', 'Wörth')],
  ['1870-08-18', '그라블로트·생프리바 전투', 'Battle of Gravelotte-St. Privat', '전쟁 최대의 전투. 독일군 20,163명, 프랑스군 12,275명의 손실을 냈고 바젠의 라인군은 메스로 물러났다.', 'The largest battle of the war: 20,163 German and 12,275 French casualties; Bazaine\'s Army of the Rhine withdrew into Metz.', ['france', 'germany'], P(49.1092, 6.0211, '그라블로트', 'Gravelotte')],
  ['1870-09-02', '스당 항복', 'Capitulation at Sedan', '나폴레옹 3세가 샬롱군 104,000명과 함께 포로가 되었다.', 'Napoleon III passed into captivity with 104,000 men of the Army of Châlons.', ['france', 'germany'], P(49.7019, 4.9403, '스당', 'Sedan')],
  ['1870-09-04', '공화국 선포와 국방정부 수립', 'The Republic proclaimed, Government of National Defence formed', '파리 시청에서 강베타가 공화국을 선포했고 트로쉬를 수반으로 하는 국방정부가 섰다.', 'Gambetta proclaimed the Republic at the Hôtel de Ville and a Government of National Defence was formed under Trochu.', 'france', P(48.8566, 2.3522, '파리 시청', 'Hôtel de Ville, Paris')],
  ['1870-09-05', '브라운슈바이크 선언 (1870)', 'The Brunswick Manifesto of 1870', '사회민주노동자당 중앙위원회가 알자스-로렌 병합에 항의하고 공화국과의 명예로운 강화를 요구했다. 위원 전원이 체포되어 뢰첸으로 끌려갔다.', 'The SDAP central committee protested against the annexation of Alsace-Lorraine and demanded an honourable peace with the republic; all its members were arrested and taken to Lötzen.', 'germany', P(52.2689, 10.5268, '브라운슈바이크', 'Brunswick')],
  ['1870-09-09', '총평의회의 두 번째 담화', 'Second address of the General Council', '마르크스는 방어 전쟁이 스당에서 끝났다고 선언하고 병합이 새 전쟁의 씨앗이라고 경고했다.', 'Marx declared that the defensive war had ended at Sedan and warned that annexation carried the seed of fresh wars.', 'uk'],
  ['1870-09-19', '파리 포위 시작', 'Siege of Paris begins', '독일군이 파리를 에워쌌고 20일 포위망이 완성되었다. 전날 파브르는 페리에르에서 비스마르크를 만나 빈손으로 돌아왔다.', 'German armies surrounded Paris and completed the encirclement on the 20th; the day before, Favre had met Bismarck at Ferrières and come away with nothing.', ['france', 'germany'], P(48.8566, 2.3522, '파리', 'Paris')],
  ['1870-09-28', '스트라스부르 함락', 'Fall of Strasbourg', '한 달 넘는 포격과 공성 끝에 위리히 장군이 요새를 넘겼다. 민간인 341명이 죽었다.', 'After more than a month of bombardment and siege General Uhrich surrendered the fortress; 341 civilians had been killed.', ['france', 'germany'], P(48.5734, 7.7521, '스트라스부르', 'Strasbourg')],
  ['1870-10-07', '강베타의 기구 탈출', 'Gambetta leaves Paris by balloon', '내무장관 강베타가 기구로 포위망을 넘어 투르에서 지방의 전쟁을 지휘했다.', 'Interior minister Gambetta flew over the siege lines by balloon and directed the war from Tours.', 'france', P(47.3941, 0.6848, '투르', 'Tours')],
  ['1870-10-27', '메스 항복', 'Surrender of Metz', '바젠이 굶주린 라인군과 함께 항복했다. 17만 3천에서 19만 3천 명이 포로가 되었다.', 'Bazaine surrendered with the starving Army of the Rhine; 173,000 to 193,000 men became prisoners.', ['france', 'germany'], P(49.1193, 6.1757, '메스', 'Metz')],
  ['1870-10-31', '파리 시청 점거', 'Rising at the Hôtel de Ville', '메스 항복이 확인되자 블랑키·플루랑스·들레클뤼즈가 이끄는 대대들이 시청을 점거해 트로쉬 내각을 인질로 잡았다가 물러났다.', 'When the surrender of Metz was confirmed, battalions under Blanqui, Flourens and Delescluze seized the Hôtel de Ville, held Trochu\'s cabinet hostage and withdrew.', 'france', P(48.8566, 2.3522, '파리 시청', 'Hôtel de Ville, Paris')],
  ['1870-11-09', '쿨미에 전투', 'Battle of Coulmiers', '루아르군이 바이에른군을 꺾고 오를레앙을 되찾았다.', 'The Army of the Loire beat the Bavarians and retook Orléans.', 'france', P(47.9394, 1.7547, '쿨미에', 'Coulmiers')],
  ['1870-11-26', '베벨·리프크네히트의 전쟁 공채 반대', 'Bebel and Liebknecht vote against war credits', '두 의원이 병합 없는 강화를 제안하고 추가 공채에 반대표를 던져 반역자로 몰렸다.', 'The two deputies moved a peace without annexation and voted against further credits, and were branded traitors.', 'germany', P(52.5186, 13.3763, '베를린', 'Berlin')],
  ['1870-12-04', '오를레앙 재함락', 'Orléans lost again', '본라롤랑드와 루아니에서 패한 루아르군이 오를레앙을 다시 내주었고 정부 대표단은 보르도로 옮겼다.', 'Beaten at Beaune-la-Rolande and Loigny, the Army of the Loire gave up Orléans again and the government delegation moved to Bordeaux.', ['france', 'germany'], P(47.9029, 1.9093, '오를레앙', 'Orléans')],
  ['1870-12-17', '베벨·리프크네히트·헤프너 체포', 'Bebel, Liebknecht and Hepner arrested', '세 사람이 국가반역 혐의로 체포되었다(영어 베벨 항목은 1871년 12월로 적는다).', 'The three were arrested on a charge of treason (the English Bebel article dates it to December 1871).', 'germany', P(51.3397, 12.3731, '라이프치히', 'Leipzig')],
  ['1871-01-05', '파리 포격 시작', 'Bombardment of Paris begins', '독일군이 23일 밤 동안 약 12,000발을 시내에 쏘았다. 사상자는 약 400명이었다.', 'The Germans fired some 12,000 shells into the city over 23 nights, killing or wounding about 400.', ['france', 'germany'], P(48.8566, 2.3522, '파리', 'Paris')],
  ['1871-01-12', '르망 전투', 'Battle of Le Mans', '샹지의 제2루아르군이 사상 7천 명, 포로 2만 2천 명, 탈영 5만 명을 내며 무너졌다.', 'Chanzy\'s Second Army of the Loire collapsed with 7,000 casualties, 22,000 prisoners and 50,000 deserters.', ['france', 'germany'], P(47.9960, 0.1970, '르망', 'Le Mans')],
  ['1871-01-17', '리젠 전투', 'Battle of the Lisaine', '부르바키의 동부군이 벨포르 구원에 실패하고 스위스 국경으로 밀려났다.', 'Bourbaki\'s Army of the East failed to relieve Belfort and was driven towards the Swiss border.', ['france', 'germany'], P(47.5774, 6.7631, '에리쿠르', 'Héricourt')],
  ['1871-01-18', '독일 제국 선포', 'Proclamation of the German Empire', '베르사유 궁전 거울의 방에서 빌헬름 1세가 독일 황제로 선포되었다.', 'Wilhelm I was proclaimed German Emperor in the Hall of Mirrors at Versailles.', ['germany', 'france'], P(48.8049, 2.1204, '베르사유 궁전', 'Palace of Versailles')],
  ['1871-01-19', '뷔즈발 전투', 'Battle of Buzenval', '파리 수비군의 마지막 출격이 4천 명 넘는 손실로 끝났고, 트로쉬가 22일 총독직에서 물러났다.', 'The last sortie from Paris ended with more than 4,000 casualties, and Trochu gave up the governorship on the 22nd.', 'france', P(48.8667, 2.1833, '뷔즈발', 'Buzenval')],
  ['1871-01-28', '베르사유 휴전 협정', 'Armistice of Versailles', '파브르와 비스마르크가 서명했다. 요새 인도, 정규군 무장해제, 2억 프랑, 국민방위군의 무장 유지가 조건이었다.', 'Signed by Favre and Bismarck: the forts surrendered, the regular troops disarmed, 200 million francs, and the National Guard kept its arms.', ['france', 'germany'], P(48.8049, 2.1204, '베르사유', 'Versailles')],
  ['1871-02-01', '동부군의 스위스 억류', 'Army of the East interned in Switzerland', '휴전에서 제외된 줄 몰랐던 동부군 8만 7천 명이 퐁타를리에에서 스위스로 넘어가 무장해제되었다.', 'Unaware that it was excluded from the armistice, the 87,000-strong Army of the East crossed from Pontarlier into Switzerland and was disarmed.', ['france', 'switzerland'], P(46.9036, 6.3550, '퐁타를리에', 'Pontarlier')],
  ['1871-02-08', '국민의회 선거', 'Elections to the National Assembly', '43개 주가 점령된 가운데 치른 선거에서 강화를 약속한 왕당파가 큰 다수를 얻었다. 강베타는 6일 사임했다.', 'Held with 43 departments under occupation, the elections returned a large monarchist majority pledged to peace; Gambetta had resigned on the 6th.', 'france', P(44.8378, -0.5792, '보르도', 'Bordeaux')],
  ['1871-02-26', '베르사유 가조약', 'Preliminary peace of Versailles', '티에르 정부가 가조약에 서명했고 3월 1일 독일군이 파리에서 승전 행진을 했다.', 'Thiers\'s government signed the preliminary peace; on 1 March German troops paraded through Paris.', ['france', 'germany'], P(48.8049, 2.1204, '베르사유', 'Versailles')],
  ['1871-03-18', '몽마르트르의 대포와 코뮌', 'The cannon of Montmartre and the Commune', '정규군이 대포를 거두려 하자 국민방위군이 저항했고, 정부는 베르사유로 물러났다.', 'When regular troops tried to remove the cannon, the National Guard resisted and the government withdrew to Versailles.', 'france', P(48.8867, 2.3431, '몽마르트르', 'Montmartre')],
  ['1871-05-10', '프랑크푸르트 조약', 'Treaty of Frankfurt', '알자스와 로렌 일부의 할양, 50억 프랑의 배상, 완납까지의 점령이 확정되었다.', 'The cession of Alsace and part of Lorraine, an indemnity of five billion francs and occupation until payment were confirmed.', ['germany', 'france'], P(50.1109, 8.6821, '프랑크푸르트', 'Frankfurt')],
  ['1871-06-28', '제국령 알자스-로렌 설치', 'Imperial Territory of Alsace-Lorraine created', '병합지는 연방 구성국이 아니라 황제가 임명한 총독이 다스리는 직할 영토가 되었다.', 'The annexed land became a territory governed directly by an imperial governor rather than a constituent state.', 'germany', P(48.5734, 7.7521, '스트라스부르', 'Strasbourg')],
  ['1872-03-26', '라이프치히 내란죄 재판 판결', 'Verdict in the Leipzig treason trial', '베벨과 리프크네히트가 요새금고 2년을 선고받았고 헤프너는 무죄였다. 베벨의 의원직은 박탈되었다.', 'Bebel and Liebknecht were sentenced to two years\' fortress confinement and Hepner acquitted; Bebel lost his seat.', 'germany', P(51.3397, 12.3731, '라이프치히', 'Leipzig')],
];

const SIDES = {
  france: 'french-empire-and-republic',
  germany: 'prussia-and-german-states',
  international: 'international-and-socialists',
};

// [personId, kind, relationKo, relationEn, noteKo, noteEn, side]
const people = [
  ['napoleon-iii', 'leader', '프랑스 황제', 'Emperor of the French', '1870년 7월 19일 프로이센에 선전포고했고 9월 2일 스당에서 군대와 함께 항복해 빌헬름스회에에 억류되었다. 1873년 영국 망명지에서 죽었다.', 'Declared war on Prussia on 19 July 1870, surrendered with his army at Sedan on 2 September and was held at Wilhelmshöhe; died in exile in England in 1873.', SIDES.france],
  ['louis-jules-trochu', 'leader', '국방정부 수반·파리 총독', 'President of the Government of National Defence and governor of Paris', '9월 4일 국방정부의 수반이 되어 파리 방어를 지휘했으나 출격이 모두 실패하자 1871년 1월 22일 총독직에서 물러났다.', 'Headed the Government of National Defence from 4 September and directed the defence of Paris; after every sortie failed he gave up the governorship on 22 January 1871.', SIDES.france],
  ['jules-favre', 'leader', '국방정부 부수반·외무장관', 'Vice-president and foreign minister of the Government of National Defence', '「한 치의 영토도」 내주지 않겠다고 선언했으나 페리에르에서 비스마르크를 만났고, 1871년 1월 28일 휴전 협정과 5월 프랑크푸르트 조약을 교섭했다.', 'Declared that France would not yield "an inch of its territory", met Bismarck at Ferrières, and negotiated the armistice of 28 January 1871 and the Treaty of Frankfurt.', SIDES.france],
  ['leon-gambetta', 'leader', '국방정부 내무장관·투르 대표단', 'Interior minister and head of the Tours delegation', '9월 4일 공화국을 선포했고, 10월 7일 기구로 파리를 벗어나 지방에서 새 군대를 조직했다. 휴전에 반대하다 1871년 2월 6일 사임했다.', 'Proclaimed the Republic on 4 September, left Paris by balloon on 7 October and raised new armies in the provinces; opposed the armistice and resigned on 6 February 1871.', SIDES.france],
  ['patrice-de-mac-mahon', 'executor', '제1군단장·샬롱군 사령관', 'Commander of I Corps and of the Army of Châlons', '뵈르트에서 패한 뒤 샬롱군을 이끌고 메스 구원에 나섰다가 스당에서 부상했고, 1871년 베르사유군을 지휘해 코뮌을 진압했다.', 'Beaten at Wörth, led the Army of Châlons to relieve Metz and was wounded at Sedan; in 1871 commanded the Versailles army that crushed the Commune.', SIDES.france],
  ['adolphe-thiers', 'participant', '중립국 순방 특사·행정 수반', 'Envoy to the neutral capitals and chief executive', '7월 의회에서 전쟁에 반대했고 10~11월 중립국을 돌며 휴전을 교섭했다. 1871년 2월 국민의회가 그를 행정 수반으로 세웠고 프랑크푸르트 조약을 맺었다.', 'Spoke against war in July, toured the neutral capitals and negotiated for an armistice in October and November; made chief executive by the National Assembly in February 1871, he concluded the Treaty of Frankfurt.', SIDES.france],
  ['louis-auguste-blanqui', 'participant', '10월 31일 봉기 지도자', 'Leader of the rising of 31 October', '메스 항복이 확인된 10월 31일 플루랑스·들레클뤼즈와 함께 파리 시청을 점거했다가 물러났다.', 'On 31 October, when the surrender of Metz was confirmed, occupied the Hôtel de Ville with Flourens and Delescluze before withdrawing.', SIDES.france],
  ['charles-delescluze', 'participant', '10월 31일 봉기 지도자', 'Leader of the rising of 31 October', '10월 31일 시청 점거에 가담했고, 포격 속에서 「1870년의 프랑스인은 전투가 축제였던 갈리아인의 후손」이라고 선언했다.', 'Took part in the seizure of the Hôtel de Ville on 31 October and declared under the bombardment that "the Frenchmen of 1870 are the sons of those Gauls for whom battles were holidays".', SIDES.france],
  ['wilhelm-i', 'leader', '프로이센 국왕·독일 황제', 'King of Prussia and German Emperor', '바트엠스에서 베네데티의 요구를 거절했고 그라블로트와 스당에서 독일군을 총지휘했다. 1871년 1월 18일 베르사유에서 독일 황제로 선포되었다.', 'Refused Benedetti\'s demand at Bad Ems and was in command of the German forces at Gravelotte and Sedan; proclaimed German Emperor at Versailles on 18 January 1871.', SIDES.germany],
  ['otto-von-bismarck', 'leader', '프로이센 총리·북독일연방 재상', 'Minister president of Prussia and chancellor of the North German Confederation', '엠스 전보를 줄여 공개해 프랑스의 선전포고를 끌어냈고, 파브르·티에르와 교섭해 휴전과 프랑크푸르트 조약을 받아냈다. 남독일 국가들을 끌어들여 제국을 세웠다.', 'Published the edited Ems dispatch that drew France\'s declaration of war, negotiated the armistice and the Treaty of Frankfurt with Favre and Thiers, and brought in the South German states to found the empire.', SIDES.germany],
  ['helmuth-von-moltke', 'executor', '프로이센군 참모총장', 'Chief of the Prussian General Staff', '철도 동원과 세 개 군의 우회 기동으로 바젠을 메스에 가두고 마크마옹을 스당에서 포위했다. 파리 포격을 둘러싸고 비스마르크와 대립했다.', 'Through railway mobilisation and the wheeling of three armies shut Bazaine in Metz and encircled MacMahon at Sedan; clashed with Bismarck over the bombardment of Paris.', SIDES.germany],
  ['karl-marx', 'participant', '인터내셔널 총평의회 담화의 집필자', 'Author of the General Council\'s addresses', '1870년 7월 23일과 9월 9일 총평의회 담화를 써서 왕조 전쟁을 규탄하고 알자스-로렌 병합에 반대했으며, 브라운슈바이크 위원회의 체포를 영국 신문에 알렸다.', 'Wrote the General Council\'s addresses of 23 July and 9 September 1870 denouncing a dynastic war and opposing the annexation of Alsace-Lorraine, and publicised the arrest of the Brunswick committee in the British press.', SIDES.international],
  ['friedrich-engels', 'participant', '브라운슈바이크 위원회에 보낸 편지의 공동 집필자', 'Co-author of the letter to the Brunswick committee', '1870년 9월 1일 무렵 마르크스와 함께 브라운슈바이크 위원회에 편지를 보내 병합이 강화를 휴전으로 만들 것이라고 썼다.', 'With Marx wrote to the Brunswick committee around 1 September 1870 that annexation would turn the peace into a mere armistice.', SIDES.international],
  ['august-bebel', 'participant', '북독일연방 제국의회 의원', 'Deputy in the North German Reichstag', '7월 전쟁 공채 표결에서 기권하고 11월 26일 병합 없는 강화를 제안하며 반대표를 던졌다. 12월 체포되었고 1872년 라이프치히에서 요새금고 2년을 선고받았다.', 'Abstained on war credits in July and voted against them on 26 November while proposing a peace without annexation; arrested in December and sentenced at Leipzig in 1872 to two years in a fortress.', SIDES.international],
  ['wilhelm-liebknecht', 'participant', '북독일연방 제국의회 의원', 'Deputy in the North German Reichstag', '베벨과 함께 기권·반대했고 「이 체제에는 한 사람도, 한 푼도」라는 구호를 냈다. 1872년 라이프치히 재판에서 「혁명의 병사」를 자처하며 요새금고 2년을 받았다.', 'Abstained and voted against with Bebel and coined "not one man and not one penny for this system"; called himself "a soldier of the revolution" at the Leipzig trial of 1872 and received two years in a fortress.', SIDES.international],
  ['alexander-ii', 'participant', '러시아 황제', 'Emperor of Russia', '비스마르크가 흑해 조항 폐기를 도와주기로 약속해 중립을 샀고, 러시아는 1870년 11월 흑해 해군 기지를 다시 짓기 시작했다.', 'Bismarck bought his neutrality by promising to help undo the Black Sea clauses, and in November 1870 Russia began rebuilding its Black Sea naval bases.'],
];

const event = buildEvent({
  id: 'franco-prussian-war-1870-1871',
  title: { ko: '보불전쟁', en: 'The Franco-Prussian War' },
  period: '1870–1871',
  sortOrder: 4,
  question: {
    ko: '비스마르크의 프로이센과 나폴레옹 3세의 제2제정은 왜 1870년 여름 전쟁에 들어갔고, 스당의 항복 뒤에도 다섯 달을 더 끈 이 전쟁은 독일 통일과 알자스-로렌 병합, 파리 코뮌을 어떻게 낳았으며, 양쪽 나라의 노동자 조직과 제1인터내셔널은 이 전쟁에 어떻게 맞섰나?',
    en: 'Why did Bismarck\'s Prussia and Napoleon III\'s Second Empire go to war in the summer of 1870, how did a war that lasted five more months after the capitulation at Sedan produce German unification, the annexation of Alsace-Lorraine and the Paris Commune, and how did the workers\' organisations of both countries and the First International stand against it?',
  },
  summary: {
    ko: '에스파냐 왕위를 둘러싼 호엔촐레른 후보 문제와 비스마르크가 손질해 공개한 엠스 전보로 1870년 7월 19일 프랑스가 프로이센에 선전포고했다. 남독일 국가들이 프로이센 편에 서면서 독일군은 국경 전투에서 잇달아 이겨 바젠의 군대를 메스에 가두고 9월 2일 스당에서 나폴레옹 3세를 포로로 잡았다. 파리에서는 공화국과 국방정부가 섰고, 강베타가 지방에서 새 군대를 조직하는 동안 파리는 넉 달 동안 포위되었다. 1871년 1월 18일 베르사유에서 독일 제국이 선포되었고 28일 휴전, 5월 10일 프랑크푸르트 조약으로 프랑스는 알자스와 로렌 일부를 넘기고 50억 프랑을 물었다. 그 사이 국제노동자협회 총평의회는 두 차례 담화로 왕조 전쟁과 병합을 규탄했고, 베벨과 리프크네히트는 전쟁 공채에 기권·반대했으며, 사회민주노동자당 브라운슈바이크 위원회는 병합에 항의하다 쇠사슬에 묶여 끌려갔다.',
    en: 'The Hohenzollern candidacy for the Spanish throne and the Ems dispatch, edited and published by Bismarck, led France to declare war on Prussia on 19 July 1870. With the South German states at Prussia\'s side, the German armies won the frontier battles, shut Bazaine\'s army in Metz and took Napoleon III prisoner at Sedan on 2 September. Paris proclaimed a republic and a Government of National Defence, and while Gambetta raised new armies in the provinces the capital was besieged for four months. The German Empire was proclaimed at Versailles on 18 January 1871, an armistice followed on the 28th, and by the Treaty of Frankfurt of 10 May France ceded Alsace and part of Lorraine and paid five billion francs. Meanwhile the General Council of the International Working Men\'s Association denounced the dynastic war and the annexation in two addresses, Bebel and Liebknecht abstained and then voted against war credits, and the Brunswick committee of the Social Democratic Workers\' Party was marched off in chains for protesting against the annexation.',
  },
  outcome: {
    ko: '프랑스는 제2제정을 잃고 제3공화국을 얻었으며, 약 13만 9천 명이 죽고 38만 명 넘게 포로가 되었다. 독일은 프로이센 주도로 통일되어 대륙의 최강국이 되었고, 알자스-로렌은 1918년까지 제국령으로 남아 프랑스의 보복심과 독일 포위 외교의 원천이 되었다. 국민방위군이 무기를 간직한 파리에서는 1871년 3월 코뮌이 일어났다. 독일 사회민주주의는 전쟁 공채 반대와 라이프치히 재판으로 「이 체제에는 한 사람도, 한 푼도」라는 전통을 얻었으나, 1914년에는 이 전통을 지키지 못했다.',
    en: 'France lost the Second Empire and gained the Third Republic, at a cost of some 139,000 dead and more than 380,000 prisoners. Germany was unified under Prussian leadership and became the strongest power on the continent, while Alsace-Lorraine remained an imperial territory until 1918, a source of French revanchism and of Germany\'s diplomacy of isolating France. In Paris, where the National Guard had kept its arms, the Commune rose in March 1871. German Social Democracy drew from the war-credit votes and the Leipzig trial the tradition of "not one man and not one penny for this system", a tradition it failed to keep in 1914.',
  },
  sections,
  timeline,
  locations: [
    ['파리', 'Paris', 48.8566, 2.3522, 'main'],
    ['베르사유', 'Versailles', 48.8049, 2.1204, 'place'],
    ['스당', 'Sedan', 49.7019, 4.9403, 'place'],
    ['메스', 'Metz', 49.1193, 6.1757, 'place'],
    ['스트라스부르', 'Strasbourg', 48.5734, 7.7521, 'place'],
    ['바트엠스', 'Bad Ems', 50.3386, 7.7144, 'place'],
    ['오를레앙', 'Orléans', 47.9029, 1.9093, 'place'],
    ['투르', 'Tours', 47.3941, 0.6848, 'place'],
    ['보르도', 'Bordeaux', 44.8378, -0.5792, 'place'],
    ['벨포르', 'Belfort', 47.6380, 6.8629, 'place'],
    ['브라운슈바이크', 'Brunswick', 52.2689, 10.5268, 'place'],
    ['프랑크푸르트', 'Frankfurt', 50.1109, 8.6821, 'place'],
  ],
  countries: ['france', 'germany', 'uk', 'switzerland'],
  relations: { related: ['paris-commune-1871', 'second-international-collapse-1914'] },
  sides: [
    { id: SIDES.france, label: { ko: '프랑스 제2제정과 국방정부', en: 'The French Second Empire and the Government of National Defence' } },
    { id: SIDES.germany, label: { ko: '프로이센·북독일연방·남독일 국가들', en: 'Prussia, the North German Confederation and the South German states' } },
    { id: SIDES.international, label: { ko: '제1인터내셔널과 반전 사회주의자들', en: 'The First International and the anti-war socialists' } },
  ],
  // The 1792 term brunswick-manifesto carries the bare alias 브라운슈바이크 선언 /
  // Brunswick Manifesto; this page means the SDAP manifesto of 1870 (new term
  // brunswick-manifesto-1870). 임시정부 would link to the Russian Provisional
  // Government; the text says 국방정부 instead but the guard stays.
  noAutoLink: ['브라운슈바이크 선언', 'Brunswick Manifesto', '임시정부'],
  people,
});

// Link-review decisions for the event title and the new glossary terms, in the
// shape of scripts/reviews/commulingo-links-20261004-transcaucasia.json decisions.
const NOTE_KO = '2026-10-07 보불전쟁 사건 등록과 함께 검토: 이 항목만 가리키는 고유 표제어·별칭이라 자동 연결. 맨 「국방정부」「국민방위군」 같은 일반형과 약어는 별칭에 넣지 않았거나 검색 전용.';
const NOTE_EN = '2026-10-07 reviewed with the Franco-Prussian War event registration: unique headword or alias of a new entry, auto link. Bare generic forms and acronyms stay search-only.';
const decision = (kind, id, lang, text, policy = 'auto', note) => ({
  kind, id, lang, text, role: 'identity', policy,
  note: note || (lang === 'ko' ? NOTE_KO : NOTE_EN), original479: false, beforePolicy: 'search',
});
const terms = require('./terms-franco-prussian-war-1870-1871');
const SEARCH_ONLY = new Set(['국민방위정부', 'Government of National Defense', '엠스 급보', '알자스로렌 병합', 'Reichsland', '독일 제국 건국', 'Reichsgründung']);
const links = [
  decision('event', event.id, 'ko', event.fields.title_ko, 'auto', '2026-10-07 사건 등록과 함께 검토: 사건 제목 전체 문자열이라 다른 대상과 겹치지 않음. 자동 연결.'),
  decision('event', event.id, 'en', event.fields.title_en, 'auto', '2026-10-07 reviewed with the event registration: the full event title, unique to this event. Auto link.'),
  ...terms.flatMap(t => [
    decision('term', t.id, 'ko', t.fields.term.ko),
    decision('term', t.id, 'en', t.fields.term.en),
    ...(t.fields.aliases.ko || []).map(a => decision('term', t.id, 'ko', a, SEARCH_ONLY.has(a) ? 'search' : 'auto')),
    ...(t.fields.aliases.en || []).map(a => decision('term', t.id, 'en', a, SEARCH_ONLY.has(a) ? 'search' : 'auto')),
  ]),
];

module.exports = { event, links };
