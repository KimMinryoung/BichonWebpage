// Event links for the people registered from the queue in
// dev_docs/commulingo-wwi-east-germany-people-queue-20261002.md, keyed by event.
// rows: [personId, relationKind, relationKo, relationEn, noteKo, noteEn, side?]
// sort_order is set per event in build.js. Events with sides take no opponent.
module.exports = {
    'world-war-i': [
        ['wilhelm-ii', 'leader', '독일 황제', 'German Emperor', '1918년 11월 9일 공화국이 선포되면서 퇴위했다.', 'Abdicated as the republic was proclaimed on 9 November 1918.', 'central-powers'],
        ['woodrow-wilson', 'leader', '미국 대통령', 'President of the United States', '1917년 4월 참전을 이끌고 1918년 1월 14개조를 내놓았으며, 독일은 이를 근거로 휴전을 청했다.', 'Took the United States into the war in April 1917 and set out the Fourteen Points in January 1918, on which Germany asked for an armistice.', 'entente'],
        ['erich-ludendorff', 'leader', '독일군 병참총감', 'First Quartermaster General of the German army', '1916년 8월 힌덴부르크와 함께 참모본부를 넘겨받았고, 1918년 3월 미하엘 작전으로 춘계 공세를 열었다.', 'Took over the General Staff with Hindenburg in August 1916 and opened the spring offensive with Operation Michael in March 1918.', 'central-powers'],
        ['ferdinand-foch', 'leader', '연합군 총사령관', 'Allied supreme commander', '1918년 3월부터 연합군을 지휘했고, 춘계 공세가 멎은 7월부터 반격을 이끌었다.', 'Commanded the Allied armies from March 1918 and led the counter-attack after the spring offensive stalled in July.', 'entente'],
        ['enver-pasha', 'leader', '오스만 제국 육군장관', 'Ottoman war minister', '1914년 12월 사르카미시에서 10만 병력의 86%를 잃었다.', 'Lost 86% of his 100,000-strong force at Sarıkamış in December 1914.', 'central-powers'],
        ['mustafa-kemal-ataturk', 'executor', '오스만군 지휘관', 'Ottoman commander', '갈리폴리 전투에서 이름을 떨쳤고, 뒤에 튀르키예 공화국을 세웠다.', 'Rose to prominence at Gallipoli and later founded the Republic of Turkey.', 'central-powers'],
    ],
    'world-war-i-aftermath-1918-1923': [
        ['woodrow-wilson', 'leader', '미국 대통령, 「4거두」', 'US President; one of the Big Four', '14개조로 강화의 출발점을 놓고 국제연맹 창설을 이끌었지만, 미국 상원이 조약 비준을 거부했다.', 'Set the starting point of the peace with the Fourteen Points and championed the League of Nations, but the US Senate refused to ratify the treaty.'],
        ['david-lloyd-george', 'leader', '영국 총리, 「4거두」', 'British prime minister; one of the Big Four', '프랑스의 패권을 막고 볼셰비키 러시아에 대한 방벽으로 독일을 어느 정도 되살려 두려 했다.', 'Sought to prevent French domination and keep a revived Germany as a bulwark against Bolshevik Russia.'],
        ['vittorio-emanuele-orlando', 'leader', '이탈리아 총리, 「4거두」', 'Italian prime minister; one of the Big Four', '참전 대가로 약속받은 영토를 요구했으나 이루지 못하고 한때 회의를 떠났다.', 'Pressed for the territory promised for Italy’s entry into the war, failed, and at one point left the conference.'],
        ['mustafa-kemal-ataturk', 'leader', '튀르키예 민족운동 지도자', 'Leader of the Turkish national movement', '1919년 그리스군의 스미르나 상륙 뒤 민족운동을 이끌었고, 앙카라의 대국민의회는 세브르 조약 서명자들의 시민권을 박탈했다.', 'Led the national movement after the Greek landing at Smyrna in 1919; the Grand National Assembly in Ankara stripped the signatories of Sèvres of their citizenship.'],
        ['karl-renner', 'leader', '독일-오스트리아 총리', 'Chancellor of German-Austria', '사회민주당이 이끈 연립정부의 총리로, 1919년 9월 10일 연합국의 최후통첩 아래 생제르맹 조약에 서명했다.', 'Chancellor of the Social Democrat-led coalition, he signed the Treaty of Saint-Germain under an Allied ultimatum on 10 September 1919.'],
        ['gustav-stresemann', 'leader', '독일 총리', 'German chancellor', '1923년 9월 26일 소극적 저항을 끝냈고, 두 달 뒤 렌텐마르크를 도입해 통화를 안정시켰다.', 'Ended passive resistance on 26 September 1923 and two months later stabilised the currency with the Rentenmark.'],
        ['ferdinand-foch', 'participant', '연합군 총사령관', 'Allied supreme commander', '독일에 대한 휴전 조건을 작성했고, 베르사유 조약이 독일에 너무 관대하다고 비판했다.', 'Drew up the armistice terms for Germany and criticised the Treaty of Versailles as too lenient.'],
        ['erich-ludendorff', 'participant', '맥주홀 폭동의 공동 지도자', 'Co-leader of the Beer Hall Putsch', '1923년 11월 히틀러와 함께 뮌헨 맥주홀 폭동을 이끌었다.', 'Led the Munich Beer Hall Putsch with Hitler in November 1923.'],
    ],
};
