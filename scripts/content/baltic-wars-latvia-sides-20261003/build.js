#!/usr/bin/env node
// Rewrites the two Latvia sections of baltic-wars-of-independence (2026-10-03)
// so the reader knows whose side each actor was on before the names come:
// Ulmanis's national government, Stučka's Bolshevik Soviet Latvia, the German
// forces under von der Goltz, and Bermondt's army as their continuation, and
// why Bermondt had 50,000 men. Also dates Stučka's republic to its
// proclamation on 17 December, as the cited sources do.
// `node build.js <current-sources.json>` writes ../baltic-wars-latvia-sides-20261003.json
// for scripts/apply-event-text-fixes.js.
const fs = require('fs');
const path = require('path');

const W = t => 'https://en.wikipedia.org/wiki/' + t;
const NEW_SOURCES = [W('Latvian_Socialist_Soviet_Republic'), W('P%C4%93teris_Stu%C4%8Dka'), W('K%C4%81rlis_Ulmanis'),
    W('Andrievs_Niedra'), W('Baltische_Landeswehr'), W('R%C3%BCdiger_von_der_Goltz'), W('West_Russian_Volunteer_Army'),
    W('Pavel_Bermondt-Avalov')];

const OLD_KO_HEAD = '## 라트비아: 세 정부, 리예파야 쿠데타, 체시스 전투 {latvia}';
const OLD_EN_HEAD = '## Latvia: three governments, the Liepāja coup and Cēsis {latvia}';
const END_KO = '## 리투아니아: 리트벨의 실패 {lithuania}';
const END_EN = '## Lithuania: the failure of Litbel {lithuania}';

const ko = `## 라트비아: 네 진영, 리예파야 쿠데타, 체시스 전투 {latvia}

라트비아의 전쟁이 가장 복잡했던 것은 같은 땅을 두고 네 진영이 싸웠고, 그 편이 해마다 바뀌었기 때문이다. 첫째는 1918년 11월 18일 독립을 선언한 카를리스 울마니스의 임시정부였다. 울마니스는 라트비아 농민동맹을 세운 농업 전문가였고, 정부는 영국을 비롯한 연합국의 지원을 받았다. 둘째는 페테리스 스투치카의 라트비아 사회주의 소비에트 공화국이었다. 스투치카는 레닌의 첫 정부에서 법무 인민위원을 지낸 라트비아인 볼셰비키 법률가였고, 그의 정부는 모스크바의 라트비아 사회민주당 지도부가 꾸려 12월 17일 선포했으며 소비에트 러시아의 정치·경제·군사적 뒷받침을 받았다. 그 군대의 중심은 앞 절에서 본 붉은 라트비아 소총병이었다. 셋째는 독일 세력이었다. 패전 뒤에도 남은 독일군, 독일에서 새로 모집된 자유군단의 철사단, 발트 독일계 지주층의 향토방위군이 뤼디거 폰 데어 골츠의 지휘를 받았다. 연합국은 이들을 볼셰비키를 막는 방벽으로 남겨 두었지만, 골츠의 목표는 발트를 독일의 영향권에 두는 것이었다. 넷째는 1919년 가을에 나타난 베르몬트-아발로프의 서러시아 의용군으로, 이름은 러시아 백군이었으나 실체는 셋째 진영의 연장이었다. 자기 군대가 거의 없던 울마니스 정부는 처음에 독일 세력과 손잡고 스투치카 정부와 싸웠고, 리가를 되찾은 뒤에는 그 독일 세력과 싸웠으며, 가을에는 베르몬트와 싸웠다.

1919년 1월 3일 붉은 군대가 리가에 들어오자 울마니스 정부는 리예파야로 물러났다. 정부에 남은 병력은 오스카르스 칼파크스가 지휘하는 라트비아 대대 수백 명이 전부였고, 칼파크스는 3월 6일 독일군과의 오인 사격으로 죽었다. 리예파야를 지킨 것은 향토방위군과 철사단이었다. 1918년 12월 29일 울마니스 정부는 라트비아의 해방을 위해 싸운 외국인 병사에게 라트비아 시민권을 주기로 약속했는데, 이것이 토지 분배 약속으로 번져 독일 각지의 자유군단 병사들이 몰려왔다. 2월 1일 골츠가 독일 제6예비군단 사령관으로 리예파야에 도착했다. 그는 라트비아 민족정부를 자기 계획의 장애물로 보았다. 한편 리가의 스투치카 정부는 부르주아의 재산을 몰수했지만 모든 농지를 국유화해 농민에게 나누지 않았다. 농민이 정부의 조건으로 도시에 식량을 대지 않자 리가는 굶주렸고, 혁명재판소가 반혁명 혐의자를 처형하는 적색 테러가 뒤따랐다.

3월 18일 옐가바가 회복되었다. 4월 16일 폰 만토이펠 남작의 향토방위군 돌격대가 리예파야에서 쿠데타를 일으켜 울마니스 내각을 체포하려 했고, 울마니스는 영국 함정의 보호 아래 항구의 배 「사라토프」로 피신했다. 5월 10일 사회주의에 반대해 온 라트비아인 목사이자 작가 안드리에우스 니에드라가 독일 군정이 세운 꼭두각시 정부의 수반이 되었다. 5월 22일 향토방위군과 철사단은 리가에서 붉은 군대를 몰아냈다. 탈환 뒤에는 볼셰비키 지지 혐의자에 대한 처형이 이어졌고, 그 수는 리가 헌병대장의 174명부터 사회민주당과 공산당 쪽의 4,000~5,000명까지 엇갈린다. 리가를 되찾은 독일계 부대는 북쪽으로 계속 진격해 6월 초 북부 라트비아에 들어와 있던 에스토니아군과 마주쳤다. 6월 19일부터 23일까지 체시스 전투에서 에스토니아 제3사단과 제미탄스의 북라트비아 여단은 향토방위군과 철사단을 격파했다. 이 전투로 독일 세력은 라트비아 민족정부의 동맹에서 적으로 바뀌었다. 연합국 사절단의 중재로 7월 3일 스트라즈두무이자에서 휴전이 맺어졌고, 독일군은 리가에서 물러났다. 7월 8일 울마니스가 리가로 돌아왔다. 향토방위군은 영국 장교 해럴드 알렉산더의 지휘 아래 라트비아군에 편입되어 동부 라트갈레 전선으로 보내졌다.

## 라트비아: 베르몬트의 리가 공격과 리가 조약 {latvia}

휴전으로 전쟁이 끝나지는 않았다. 6월 베르사유 조약 뒤 연합국은 독일군의 철수를 명령했지만, 발트의 자유군단 가운데 돌아간 것은 일부뿐이었고 나머지는 골츠 아래 남았다. 시민권과 땅을 약속받고 온 병사들에게 돌아갈 곳은 패전국 독일뿐이었다. 독일 정부가 연합국의 비난을 받지 않도록 골츠는 뒤로 물러났고, 8월 그의 병력을 파벨 베르몬트-아발로프의 「특별 러시아 군단」과 합쳤다. 베르몬트는 키예프에서 포로가 되어 독일로 보내진 코사크 장교 출신의 모험가였다. 이렇게 모인 약 5만 명은 대부분 자유군단과 발트 독일계였고, 일부는 볼셰비키와 싸운다는 조건으로 풀려난 러시아인 전쟁포로였다. 이 서러시아 의용군은 독일에서 찍은 돈을 쓰고 크루프 같은 독일 대기업의 돈과 무기를 받았다. 시베리아의 콜차크를 지지한다고 선언했지만, 베르몬트와 골츠의 관심은 볼셰비키보다 라트비아 민족정부를 없애고 발트에서 독일 세력을 지키는 데 있었다.

연합국의 압력에 바이마르 정부는 러시아군으로 병사를 넘기는 것을 금지하고 동프로이센 국경을 막았으며, 골츠는 10월 4일 소환되었다. 그러자 베르몬트는 라트비아를 협상에 끌어내려고 1919년 10월 8일 리가를 공격해 다우가바 강 서안의 교외를 점령했다. 울마니스 정부는 이웃 나라에 도움을 청했고, 라트비아군은 영국·프랑스 함정의 함포와 에스토니아 장갑열차의 지원을 받아 11월 3일부터 반격해 11월 11일 강 서안을 되찾았다. 이날은 라트비아의 라츠플레시스 기념일이 되었다. 베르몬트군은 리투아니아 북부에서도 11월 21일과 22일 라드빌리슈키스에서 리투아니아군에 패했고, 12월 독일로 철수했다. 지그프리츠 메이에로비츠의 외교는 이 군사적 생존을 국제적 승인으로 바꾸는 작업이었다. 남은 것은 스투치카 정부가 마지막까지 버티던 동부 라트갈레였다. 1920년 1월 3일 라트비아군과 폴란드군은 합동으로 다우가프필스를 공격해 점령했고, 1월 말까지 라트갈레에서 붉은 군대를 밀어냈다. 2월 1일 휴전이 발효되었고, 8월 11일 리가에서 소비에트 러시아는 라트비아의 독립을 「영원히」 승인하는 조약에 서명했다. 이 조약은 폴란드와 소비에트 측이 맺은 1921년 리가 조약과 다르다. 9월 16일 제헌의회는 장원을 몰수하는 토지개혁법을 통과시켰다. 발트 독일계 지배층 700년의 토지 질서가 끝났다.`;

const en = `## Latvia: four camps, the Liepāja coup and Cēsis {latvia}

Latvia's war was the most complex because four camps fought over the same land and the alignments changed from season to season. The first was the provisional government of Kārlis Ulmanis, which had proclaimed independence on 18 November 1918. Ulmanis, an agronomist, had founded the Latvian Farmers' Union, and his government was backed by Britain and the other Allies. The second was Pēteris Stučka's Latvian Socialist Soviet Republic. Stučka was a Latvian Bolshevik jurist who had been People's Commissar for Justice in Lenin's first government; his government was formed by the leadership of Latvian Social Democracy in Moscow, proclaimed on 17 December, and backed politically, economically and militarily by Soviet Russia. Its army was built around the Red Latvian Riflemen of the previous section. The third was the German camp: the German troops left behind after the defeat, the Iron Division of Freikorps volunteers newly recruited in Germany, and the Landeswehr of the Baltic German landowners, all under Rüdiger von der Goltz. The Allies kept them there as a barrier against the Bolsheviks, but Goltz's aim was to keep the Baltic in Germany's sphere. The fourth, which appeared in autumn 1919, was Bermondt-Avalov's West Russian Volunteer Army, a White Russian army in name and in substance a continuation of the German camp. Ulmanis's government, which had almost no army of its own, first fought Stučka's government alongside the Germans, then, after Riga was retaken, fought the Germans, and in the autumn fought Bermondt.

When the Red Army entered Riga on 3 January 1919 the Ulmanis government withdrew to Liepāja. Its only troops were a few hundred men of the Latvian battalion under Oskars Kalpaks, who was killed on 6 March in an exchange of fire with German troops who mistook them for the enemy. Liepāja was held by the Landeswehr and the Iron Division. On 29 December 1918 the Ulmanis government had promised Latvian citizenship to foreign soldiers who fought for Latvia's freedom; the promise grew into a rumour of land grants and Freikorps men poured in from across Germany. On 1 February Goltz arrived at Liepāja as commander of the German VI Reserve Corps. He saw the Latvian national government as an obstacle to his plans. In Riga, meanwhile, Stučka's government expropriated the bourgeoisie but nationalised all farmland instead of giving it to the peasants. When the peasants would not supply the towns with food on the government's terms, Riga went hungry, and a Red Terror followed in which revolutionary tribunals executed alleged counter-revolutionaries.

Jelgava was retaken on 18 March. On 16 April a Landeswehr strike detachment under Baron von Manteuffel staged a coup in Liepāja and tried to arrest the Ulmanis cabinet; Ulmanis took refuge on the ship Saratov in the harbour under British protection. On 10 May the Latvian pastor and writer Andrievs Niedra, a long-standing opponent of socialism, became head of a puppet government set up by the German military. On 22 May the Landeswehr and the Iron Division drove the Red Army from Riga. Executions of suspected Bolshevik supporters followed the recapture; estimates range from 174, the figure of Riga's chief of gendarmerie, to 4,000–5,000 according to the Social Democrats and Communists. The German formations pressed north from Riga and in early June met the Estonian army, which had entered northern Latvia. In the battle of Cēsis from 19 to 23 June the Estonian 3rd Division and Zemitāns's Northern Latvian brigade defeated the Landeswehr and the Iron Division. With this battle the German camp turned from the Latvian national government's ally into its enemy. An armistice brokered by the Allied mission was signed at Strazdumuiža on 3 July and the Germans left Riga; Ulmanis returned on 8 July. The Landeswehr was placed under the British officer Harold Alexander, absorbed into the Latvian army and sent to the Latgale front in the east.

## Latvia: Bermondt's attack on Riga and the treaty of Riga {latvia}

The armistice did not end the war. After the Treaty of Versailles in June the Allies ordered the German troops out, but only part of the Freikorps in the Baltic went home; the rest stayed under Goltz. For men who had come for citizenship and land, the only place to return to was defeated Germany. To keep the German government clear of Allied blame, Goltz stepped into the background and in August merged his forces with Pavel Bermondt-Avalov's "Special Russian Corps". Bermondt was a former Cossack officer and adventurer who had been captured at Kiev and sent to Germany. The roughly 50,000 men thus gathered were mostly Freikorps members and Baltic Germans, with some Russian prisoners of war released on condition that they fight the Bolsheviks. This West Russian Volunteer Army used money printed in Germany and received funds and weapons from German industrialists such as Krupp. It declared its support for Kolchak in Siberia, but Bermondt and Goltz were more interested in eliminating the Latvian national government and preserving German power in the Baltic than in fighting the Bolsheviks.

Under Allied pressure the Weimar government banned the transfer of German soldiers to the Russians and closed the East Prussian border, and Goltz was recalled on 4 October. Bermondt then attacked Riga on 8 October 1919 to force Latvia to negotiate, and took the suburbs on the west bank of the Daugava. The Ulmanis government asked its neighbours for help, and, supported by the guns of British and French warships and by Estonian armoured trains, the Latvian army counterattacked from 3 November and cleared the west bank on 11 November, now Latvia's Lāčplēsis Day. Bermondt's forces were also beaten by the Lithuanians at Radviliškis in northern Lithuania on 21 and 22 November and withdrew to Germany in December. Zigfrīds Meierovics's diplomacy worked to convert this military survival into international recognition. What remained was eastern Latgale, where Stučka's government held out to the end. On 3 January 1920 Latvian and Polish troops jointly attacked and took Daugavpils, and by the end of January they had pushed the Red Army out of Latgale. An armistice took effect on 1 February, and on 11 August in Riga Soviet Russia signed a treaty recognizing Latvia's independence "for all time". This treaty is distinct from the Treaty of Riga of 1921 between Poland and the Soviets. On 16 September the Constituent Assembly passed a land reform law expropriating the manors. Seven centuries of Baltic German landholding came to an end.`;

if (require.main === module) {
    const [sourcesFile, bodyFile] = process.argv.slice(2);
    const current = JSON.parse(fs.readFileSync(sourcesFile, 'utf8'));
    const body = JSON.parse(fs.readFileSync(bodyFile, 'utf8'));
    const slice = (t, a, b) => { const i = t.indexOf(a), j = t.indexOf(b); if (i < 0 || j < i) throw new Error('section not found: ' + a); return t.slice(i, j); };
    const id = 'baltic-wars-of-independence';
    const changes = [
        { event: id, column: 'body_ko', from: slice(body.ko, OLD_KO_HEAD, END_KO), to: ko + '\n\n' },
        { event: id, column: 'body_en', from: slice(body.en, OLD_EN_HEAD, END_EN), to: en + '\n\n' },
        { event: id, column: 'body_ko', from: '12월 4일 페테리스 스투치카의 라트비아 소비에트 정부가', to: '12월 17일 페테리스 스투치카의 라트비아 소비에트 정부가' },
        { event: id, column: 'body_en', from: "Pēteris Stučka's Soviet government of Latvia followed on 4 December", to: "Pēteris Stučka's Soviet government of Latvia followed on 17 December" },
        { event: id, column: 'sources', expected: current, value: [...current, ...NEW_SOURCES.filter(u => !current.includes(u))] },
    ];
    fs.writeFileSync(path.join(__dirname, '..', 'baltic-wars-latvia-sides-20261003.json'), JSON.stringify({ id: 'baltic-wars-latvia-sides-20261003', changes }, null, 2) + '\n');
    console.log('written', changes.length, 'changes');
}
module.exports = { ko, en, NEW_SOURCES };
