// New people for the Comintern founding batch, in the commulingo-people-upsert
// payload shape. All join international-revolutionary.
const W = t => 'https://en.wikipedia.org/wiki/' + t;
const person = (id, groupId, [gko, gen], [fko, fen], nativeName, years, citizenship, origin, role, epithet, bio, fate, aliases, sources) => ({
    id, groupId,
    givenName: { ko: gko, en: gen }, familyName: { ko: fko, en: fen },
    nativeName, years,
    citizenship: { code: citizenship }, nationalOrigin: typeof origin === 'string' ? { code: origin } : origin,
    role: { category: role },
    epithet: { ko: epithet[0], en: epithet[1] },
    bio: { ko: bio[0], en: bio[1] },
    fate: { kind: fate[0], label: { ko: fate[1], en: fate[2] } },
    aliases, sources,
    evidence: [
        { field: 'bio', claim: bio[1] },
        { field: 'years', claim: years },
        { field: 'citizenship', claim: `${id}: citizenship ${citizenship}` },
        { field: 'nationalOrigin', claim: `${id}: national background ${typeof origin === 'string' ? origin : origin.code}` },
    ].map(e => ({ ...e, source: sources[0], locator: 'Wikipedia article: lead, biography sections' })),
});
const CI = W('Communist_International');

module.exports = [
    person('hugo-eberlein', 'international-revolutionary', ['후고', 'Hugo'], ['에벌라인', 'Eberlein'], 'Hugo Eberlein', '1887–1941', 'germany', 'germany', 'non-soviet-revolutionary',
        ['코민테른 창립 대회에서 독일 공산당을 대표해 창립에 기권하고, 뒤에 대숙청으로 총살된 공산주의자',
            'German Communist who abstained on the Comintern’s founding at its first congress and was later shot in the Great Purge'],
        ['튀링겐 잘펠트 출신의 설계 기술자로 SPD에 들어갔고, 전쟁 중 룩셈부르크와 함께 스파르타쿠스단을 세웠다. 1919년 3월 독일 공산당 대표로 코민테른 창립 대회에 참석해, 서둘러 새 인터내셔널을 세우면 볼셰비키가 지배하게 된다는 룩셈부르크와 요기헤스의 권고에 따라 창립 표결에 기권했다. 창립 뒤에는 코민테른과 독일 당에서 조직·재정 일을 맡았고 프로이센 주의회 의원을 지냈다. 1933년 소련으로 망명했다가 1937년 체포되어 1941년 10월 모스크바에서 총살되었다.',
            'A draughtsman from Saalfeld, he joined the SPD and during the war co-founded the Spartacus League with Luxemburg. As the KPD’s delegate to the Comintern’s founding congress in March 1919 he abstained on the founding vote, as Luxemburg and Jogiches had advised, believing a premature International would be dominated by the Bolsheviks. Afterwards he did organisational and financial work for the Comintern and the German party and sat in the Prussian Landtag. He fled to the Soviet Union in 1933, was arrested in 1937 and was shot in Moscow in October 1941.'],
        ['executed', '총살', 'Shot'], { ko: ['에벌라인', '에버라인'], en: ['Eberlein'] }, [W('Hugo_Eberlein'), W('1st_Congress_of_the_Comintern')]),
    person('fritz-platten', 'international-revolutionary', ['프리츠', 'Fritz'], ['플라텐', 'Platten'], 'Fritz Platten', '1883–1942', 'switzerland', 'switzerland', 'non-soviet-revolutionary',
        ['1917년 레닌의 봉인 열차 귀국을 조직하고 코민테른 창립 대회 의장단에 앉은 스위스 공산주의자',
            'Swiss communist who organised Lenin’s sealed-train journey in 1917 and sat on the Comintern’s founding presidium'],
        ['장크트갈렌 출신으로 스위스 사회민주당 좌파에서 활동했고 치머발트 운동에 참여했다. 1917년 2월 혁명 뒤 스위스에 있던 레닌 일행이 독일을 거쳐 러시아로 돌아가는 봉인 열차 여행을 주선한 주역이었다. 1919년 스위스 공산주의자 대표로 코민테른 창립 대회에 참석해 의장단에 앉았고, 스위스 공산당 창당에 참여했다. 1917~1922년 연방 하원 의원을 지낸 뒤 소련으로 이주했다. 1938년 대숙청 때 체포되어 1942년 수용소에서 총살되었고 1956년 복권되었다.',
            'From St. Gallen, he worked on the left of the Swiss Social Democrats and joined the Zimmerwald movement. After the February Revolution of 1917 he was the chief organiser of the sealed-train journey that took Lenin’s party from Switzerland across Germany back to Russia. At the Comintern’s founding congress in 1919 he represented the Swiss communists and sat on the presidium, and he helped found the Communist Party of Switzerland. A member of the National Council from 1917 to 1922, he later moved to the Soviet Union, was arrested in the purges in 1938 and was shot in a camp in 1942; he was rehabilitated in 1956.'],
        ['executed', '총살', 'Shot'], { ko: ['플라텐'], en: ['Platten'] }, [W('Fritz_Platten'), CI]),
    person('giacinto-menotti-serrati', 'international-revolutionary', ['자친토 메노티', 'Giacinto Menotti'], ['세라티', 'Serrati'], 'Giacinto Menotti Serrati', '1872–1926', 'italy', 'italy', 'non-soviet-revolutionary',
        ['이탈리아 사회당을 코민테른에 가입시켰으나 개량주의파 축출을 거부해 1921년 리보르노 분열을 낳은 지도자',
            'Italian Socialist leader who took his party into the Comintern but refused to expel the reformists, causing the Livorno split of 1921'],
        ['스포토르노 출신으로 이탈리아 사회당의 중심 지도자가 되었고, 1914년 참전론으로 쫓겨난 무솔리니의 뒤를 이어 『아반티!』 편집장을 맡았다. 전쟁 중 당을 왼쪽으로 이끌며 치머발트 운동에 참여했고, 10월 혁명 뒤 사회당을 코민테른에 가입시켰다. 1920년 제2차 대회에서 의장단과 집행위원회에 들었지만, 1921년 개량주의자와 절연하라는 원칙을 거부하고 공산당이 떨어져 나간 뒤에도 사회당을 이끌었다. 1924년 사회당 좌파를 이끌고 공산당에 합류했고, 1926년 지하 당 회의로 가던 길에 심부전으로 숨졌다.',
            'Born in Spotorno, he became a central leader of the Italian Socialist Party and in 1914 succeeded the ousted Mussolini as editor of Avanti!. He pushed the party left during the war, joined the Zimmerwald movement and after the October Revolution led the PSI into the Comintern. At the Second Congress of 1920 he sat on the presiding committee and was elected to the Executive, but in 1921 he rejected the principle of breaking with the reformists and stayed at the head of the Socialist Party as the Communists split away. In 1924 he led the party’s left wing into the Communist Party, and in 1926 died of heart failure on his way to an underground party meeting.'],
        ['natural', '심부전', 'Heart failure'], { ko: ['세라티'], en: ['Serrati'] }, [W('Giacinto_Menotti_Serrati'), W('Italian_Communist_Party')]),
    person('marcel-cachin', 'international-revolutionary', ['마르셀', 'Marcel'], ['카섕', 'Cachin'], 'Marcel Cachin', '1869–1958', 'france', 'france', 'non-soviet-revolutionary',
        ['투르 대회에서 SFIO 다수를 코민테른으로 이끌어 프랑스 공산당을 세운 『뤼마니테』 지도자',
            'Leader who took the SFIO majority into the Comintern at Tours in 1920, founding the French Communist Party, and ran L’Humanité'],
        ['브르타뉴 팽폴 출신으로 1891년 게드의 프랑스 노동자당에 들어갔고, 1905년 통합 사회당(SFIO)에 참여했다. 1918년부터 평생 『뤼마니테』를 이끌었다. 전쟁 뒤 지지자들이 10월 혁명 쪽으로 기울자, 1920년 투르 대회에서 코민테른 가입을 이끌어 프랑스 공산당의 창립자가 되었다. 1923년 프랑스의 루르 점령을 비난했다가 투옥되었다. 하원 의원과 상원 의원을 지내며 공산당의 원로로 남았고, 1958년 숨졌다.',
            'Born in Paimpol in Brittany, he joined Guesde’s French Workers’ Party in 1891 and the unified SFIO in 1905, and from 1918 ran L’Humanité for the rest of his life. As his supporters swung towards the October Revolution after the war, he led the vote to join the Comintern at the Tours congress of 1920 and became a founder of the French Communist Party. He was jailed in 1923 for denouncing the French occupation of the Ruhr. A deputy and senator, he remained the party’s elder statesman until his death in 1958.'],
        ['natural', '자연사', 'Natural causes'], { ko: ['카섕', '카생'], en: ['Cachin'] }, [W('Marcel_Cachin'), W('Tours_Congress')]),
    person('ludovic-oscar-frossard', 'international-revolutionary', ['뤼도비크오스카르', 'Ludovic-Oscar'], ['프로사르', 'Frossard'], 'Ludovic-Oscar Frossard', '1889–1946', 'france', 'france', 'non-soviet-revolutionary',
        ['투르 대회의 코민테른 가입을 이끌고 프랑스 공산당 초대 서기장이 되었다가 1923년 떠난 정치가',
            'SFIO general secretary who led the Tours vote to join the Comintern, became the first PCF general secretary and left in 1923'],
        ['벨포르 지방 출신의 교사로 SFIO에 들어가 1918년 당 사무총장이 되었다. 1920년 카섕과 함께 모스크바를 방문한 뒤 투르 대회에서 코민테른 가입을 지지했고, 새로 선 프랑스 공산당의 초대 서기장이 되었다. 그러나 코민테른의 규율 요구와 충돌해 1923년 1월 당을 떠나 SFIO로 돌아갔다. 1930년대 여러 내각에서 장관을 지냈고, 1940년 6~7월 페탱의 첫 내각에 들어갔으나 비시 정부에는 참여하지 않았다. 전후 부역 혐의 재판에서 무죄를 받았다.',
            'A teacher from the Belfort region, he joined the SFIO and became its general secretary in 1918. After visiting Moscow with Cachin in 1920 he backed joining the Comintern at the Tours congress and became the first general secretary of the new French Communist Party. Clashing with the Comintern’s demands for discipline, he left in January 1923 and returned to the SFIO. He served as a minister in several governments in the 1930s and joined Pétain’s first cabinet in June–July 1940, but declined to serve Vichy; after the war he was tried for collaboration and acquitted.'],
        ['natural', '자연사', 'Natural causes'], { ko: ['프로사르', 'L.-O. 프로사르'], en: ['Frossard', 'Ludovic Frossard', 'L.-O. Frossard'] }, [W('Ludovic-Oscar_Frossard'), W('Tours_Congress')]),
];
