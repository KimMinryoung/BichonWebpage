-- CommuLingo history archive: the 1905 Revolution ("dress rehearsal" for 1917).
-- Dates are Gregorian (New Style); Old Style equivalents are noted as 구력 where useful.
-- Idempotent: safe to re-run.

INSERT INTO commulingo_history_events
    (id, sort_order, period_label, title_ko, title_en, question_ko, question_en,
     summary_ko, summary_en, outcome_ko, outcome_en, timeline, sources, updated_at)
VALUES
    ('revolution-1905', 10, '1905–1907',
     '1905년 혁명', 'The Revolution of 1905',
     '1905년 혁명에서 노동자들은 어떻게 소비에트를 발명했고, 그 패배는 1917년에 무엇을 가르쳤는가?',
     'How did workers invent the soviet in the Revolution of 1905, and what did its defeat teach for 1917?',
     '피의 일요일 학살로 시작된 1905년 혁명은 대중 파업과 육해군 반란, 농민 봉기가 결합한 차르 전제에 대한 최초의 전국적 도전이었다. 투쟁 속에서 노동자들은 공장에서 선출되고 즉시 소환할 수 있는 대의원 평의회, 곧 소비에트를 발명했으며, 이 기구는 파업위원회에서 인민 권력의 기관으로 성장했다. 혁명은 1907년까지 진압됐으나, 1917년에 승리할 계급과 당을 단련시켰다.',
     'Beginning with the Bloody Sunday massacre, the Revolution of 1905 was the first nationwide challenge to the tsarist autocracy, combining mass strikes, mutinies in the army and navy, and peasant risings. In the course of the struggle workers invented the soviet, a council of factory-elected, instantly recallable delegates, which grew from a strike committee into an organ of popular power. The revolution was beaten down by 1907, but it trained the class and the party that would win in 1917.',
     '혁명은 스톨리핀의 1907년 6월 친위쿠데타로 막을 내렸고, 뒤이은 반동기에 수천 명이 처형되거나 유형에 처해졌다. 그러나 전제가 양보 없이는 통치할 수 없다는 사실이 입증됐고, 소비에트라는 형태와 무장봉기의 경험은 노동자운동의 기억 속에 보존됐다. 레닌은 1905년을 1917년의 「총연습」이라 불렀다: 그것 없이 10월의 승리는 불가능했을 것이다.',
     'The revolution ended with Stolypin’s coup of June 1907, and in the reaction that followed thousands were executed or exiled. Yet it proved that the autocracy could not rule without concessions, and the soviet form and the experience of armed insurrection were preserved in the memory of the workers’ movement. Lenin called 1905 the dress rehearsal without which the victory of October 1917 would have been impossible.',
     $$[
  {
    "date":"1904.02",
    "title":{"ko":"러일전쟁 발발","en":"The Russo-Japanese War begins"},
    "body":{"ko":"일본의 뤼순항(포트아르투르) 기습으로 러일전쟁이 시작됐다. 잇단 패전과 전시 경제난은 차르 전제에 대한 불만을 전국적으로 응축시켰다.","en":"The Russo-Japanese War began with Japan’s surprise attack on Port Arthur. Successive defeats and wartime economic strain concentrated nationwide discontent against the tsarist autocracy."}
  },
  {
    "date":"1905.01.22",
    "title":{"ko":"피의 일요일","en":"Bloody Sunday"},
    "body":{"ko":"구력 1월 9일, 가폰 신부가 이끄는 노동자와 그 가족 수만 명이 청원서를 들고 겨울궁전으로 평화 행진을 벌였으나 군대가 발포해 수백 명이 죽거나 다쳤다. 「인민의 아버지 차르」라는 신화는 그날의 총성과 함께 무너졌다.","en":"On 9 January Old Style, tens of thousands of workers and their families, led by Father Gapon, marched peacefully to the Winter Palace with a petition; troops opened fire, killing or wounding hundreds. The myth of the tsar as father of his people collapsed with the gunfire."}
  },
  {
    "date":"1905.05",
    "title":{"ko":"이바노보-보즈네센스크 총파업과 최초의 소비에트","en":"The Ivanovo-Voznesensk general strike and the first soviet"},
    "body":{"ko":"섬유 도시 이바노보-보즈네센스크에서 7만여 명의 노동자가 파업에 들어가 전권대표 소비에트를 세웠다. 프룬제 등 볼셰비키가 활동한 이 기구는 최초의 노동자대표 소비에트로 꼽힌다.","en":"In the textile city of Ivanovo-Voznesensk some seventy thousand workers struck and elected an assembly of plenipotentiary delegates. This body, in which Bolsheviks such as Frunze were active, is counted as the first soviet of workers’ deputies."}
  },
  {
    "date":"1905.05.27–28",
    "title":{"ko":"쓰시마 해전","en":"The Battle of Tsushima"},
    "body":{"ko":"발트 함대가 쓰시마 해협에서 궤멸하면서 전쟁 수행 능력과 정권의 권위가 함께 무너졌다. 패전은 혁명운동에 결정적 추진력을 주었다.","en":"The Baltic Fleet was annihilated in the Tsushima Strait, shattering both the war effort and the regime’s authority. The defeat gave the revolutionary movement decisive momentum."}
  },
  {
    "date":"1905.06.27",
    "title":{"ko":"전함 포템킨의 반란","en":"Mutiny on the battleship Potemkin"},
    "body":{"ko":"흑해함대 전함 포템킨의 수병들이 썩은 고기 배급과 장교들의 학대에 맞서 봉기해 붉은 기를 올렸다. 봉기는 고립된 채 끝났으나, 군대조차 전제의 확실한 도구가 아님을 보여 주었다.","en":"Sailors of the Black Sea Fleet battleship Potemkin rose against rotten meat rations and abusive officers and raised the red flag. The mutiny ended in isolation, but it showed that even the armed forces were no longer a reliable instrument of autocracy."}
  },
  {
    "date":"1905.10",
    "title":{"ko":"10월 전국 정치 총파업","en":"The October all-Russian political general strike"},
    "body":{"ko":"모스크바 인쇄공들의 파업이 철도 노동자들을 거쳐 제국 전체로 번지며 나라를 멈춰 세우는 정치 총파업이 됐다. 어떤 중앙의 명령도 없이 아래로부터 확산된 이 파업은 대중 자기조직의 위력을 입증했다.","en":"A strike of Moscow printers spread through the railway workers across the whole empire, becoming a political general strike that brought the country to a halt. Spreading from below without any central command, it demonstrated the power of mass self-organization."}
  },
  {
    "date":"1905.10.26",
    "title":{"ko":"상트페테르부르크 소비에트 결성","en":"The St. Petersburg Soviet is formed"},
    "body":{"ko":"구력 10월 13일, 파업 노동자 대표들이 상트페테르부르크 노동자대표 소비에트를 결성했다. 공장에서 선출되고 즉시 소환 가능한 대의원들로 이루어진 이 기구는 파업 지도부에서 사실상의 대항권력으로 성장했으며, 트로츠키가 지도적 역할을 맡았다.","en":"On 13 October Old Style, delegates of striking workers formed the St. Petersburg Soviet of Workers’ Deputies. Composed of factory-elected, instantly recallable deputies, it grew from a strike leadership into a de facto counter-power, with Trotsky in a leading role."}
  },
  {
    "date":"1905.10.30",
    "title":{"ko":"10월 선언","en":"The October Manifesto"},
    "body":{"ko":"구력 10월 17일, 총파업에 몰린 니콜라이 2세는 비테의 권고에 따라 시민적 자유와 입법 두마를 약속하는 선언에 서명했다. 자유주의자들은 이 양보에 만족해 이탈했으나, 노동자와 사회주의자들은 그것을 혁명을 무장해제시키기 위한 종잇조각으로 보았다.","en":"On 17 October Old Style, cornered by the general strike, Nicholas II signed a manifesto on Witte’s advice promising civil liberties and a legislative Duma. Liberals, satisfied by the concession, fell away, while workers and socialists saw in it a piece of paper meant to disarm the revolution."}
  },
  {
    "date":"1905.11.21",
    "title":{"ko":"레닌의 귀국","en":"Lenin returns to Russia"},
    "body":{"ko":"레닌이 망명을 끝내고 페테르부르크로 돌아왔다. 그는 소비에트를 당의 경쟁자가 아니라 봉기의 기관이자 새로운 혁명 권력의 맹아로 받아들여야 한다고 주장했다.","en":"Lenin returned from exile to St. Petersburg. He argued that the soviet should be embraced not as a rival to the party but as an organ of insurrection and the embryo of a new revolutionary power."}
  },
  {
    "date":"1905.12.16",
    "title":{"ko":"페테르부르크 소비에트 체포","en":"The Petersburg Soviet is arrested"},
    "body":{"ko":"구력 12월 3일, 정부가 트로츠키를 비롯한 소비에트 대의원 수백 명을 체포했다. 수도의 소비에트는 진압됐으나, 그 응답으로 모스크바에서 무장봉기가 일어났다. 트로츠키는 이듬해 재판에서 법정을 연단으로 바꾸어 봉기의 권리를 변론했다.","en":"On 3 December Old Style, the government arrested hundreds of Soviet deputies, Trotsky among them. The Soviet of the capital was crushed, but Moscow answered with armed insurrection. At his trial the following year, Trotsky turned the courtroom into a tribune to defend the right of insurrection."}
  },
  {
    "date":"1905.12.20–31",
    "title":{"ko":"모스크바 12월 무장봉기","en":"The Moscow December uprising"},
    "body":{"ko":"모스크바 소비에트의 총파업 호소가 무장봉기로 전화했다. 노동자 전투대는 프레스냐 구역의 바리케이드를 지켰으나 세묘놉스키 근위연대의 포격으로 진압됐고, 천여 명이 목숨을 잃었다. 레닌은 이 봉기에서 다음 혁명이 배워야 할 군사적 교훈을 끌어냈다.","en":"The Moscow Soviet’s call for a general strike passed over into armed insurrection. Workers’ fighting squads held the barricades of the Presnya district until artillery of the Semyonovsky Guards regiment crushed them, at the cost of about a thousand lives. Lenin drew from the rising the military lessons the next revolution would need."}
  },
  {
    "date":"1906.05.10",
    "title":{"ko":"제1차 국가두마 개원","en":"The First State Duma opens"},
    "body":{"ko":"구력 4월 27일, 제1차 국가두마가 개원했으나 직전에 공포된 기본법은 차르의 전제 대권을 온존시켰다. 두마는 토지문제를 둘러싼 충돌 끝에 두 달여 만에 해산됐다.","en":"On 27 April Old Style the First State Duma opened, but the Fundamental Laws promulgated just before it preserved the tsar’s autocratic prerogatives. After clashing with the government over the land question, the Duma was dissolved in little more than two months."}
  },
  {
    "date":"1906.08",
    "title":{"ko":"스톨리핀의 야전군법회의","en":"Stolypin’s field courts-martial"},
    "body":{"ko":"총리 스톨리핀은 야전군법회의를 도입해 약식 재판과 교수형으로 혁명운동을 진압했다. 수천 명이 처형되거나 유형에 처해졌고, 교수대의 올가미는 「스톨리핀의 넥타이」라 불렸다.","en":"Prime Minister Stolypin introduced field courts-martial, suppressing the revolutionary movement with summary trials and hangings. Thousands were executed or exiled, and the hangman’s noose came to be called the Stolypin necktie."}
  },
  {
    "date":"1907.06.16",
    "title":{"ko":"6월 3일 체제: 스톨리핀의 친위쿠데타","en":"The coup of 3 June: the Stolypin system"},
    "body":{"ko":"구력 6월 3일, 스톨리핀은 제2차 두마를 해산하고 기본법을 어기며 선거법을 개정해 노동자와 농민의 대표권을 대폭 축소했다. 이 친위쿠데타로 혁명은 막을 내렸으나, 소비에트의 경험은 1917년에 되살아나게 된다.","en":"On 3 June Old Style, Stolypin dissolved the Second Duma and, in violation of the Fundamental Laws, rewrote the electoral law to slash the representation of workers and peasants. This coup from above closed the revolution, but the experience of the soviets would return in 1917."}
  }
]$$::jsonb,
     $$[
  "https://www.marxists.org/archive/lenin/works/1917/jan/09.htm",
  "https://www.marxists.org/archive/trotsky/1907/1905/",
  "https://www.marxists.org/archive/luxemburg/1906/mass-strike/",
  "Abraham Ascher, The Revolution of 1905, 2 vols., Stanford University Press, 1988–1992",
  "Teodor Shanin, Russia, 1905–07: Revolution as a Moment of Truth, Yale University Press, 1986",
  "Solomon M. Schwarz, The Russian Revolution of 1905: The Workers’ Movement and the Formation of Bolshevism and Menshevism, University of Chicago Press, 1967"
]$$::jsonb,
     NOW())
ON CONFLICT (id) DO UPDATE SET
    sort_order = EXCLUDED.sort_order, period_label = EXCLUDED.period_label,
    title_ko = EXCLUDED.title_ko, title_en = EXCLUDED.title_en,
    question_ko = EXCLUDED.question_ko, question_en = EXCLUDED.question_en,
    summary_ko = EXCLUDED.summary_ko, summary_en = EXCLUDED.summary_en,
    outcome_ko = EXCLUDED.outcome_ko, outcome_en = EXCLUDED.outcome_en,
    timeline = EXCLUDED.timeline, sources = EXCLUDED.sources, updated_at = NOW();

INSERT INTO commulingo_history_event_people
    (event_id, person_id, sort_order, relation_kind, relation_ko, relation_en, note_ko, note_en)
SELECT 'revolution-1905', v.person_id, v.sort_order, v.relation_kind, v.relation_ko, v.relation_en, v.note_ko, v.note_en
FROM (VALUES
    ('lenin', 0, 'leader', '볼셰비키 지도자', 'Bolshevik leader',
     '망명지에서 무장봉기를 주장하다 11월에 귀국해 소비에트를 새 혁명 권력의 맹아로 파악했으며, 훗날 1905년을 1917년의 「총연습」이라 불렀다.',
     'He argued for armed insurrection from exile, returned in November to grasp the soviet as the embryo of a new revolutionary power, and later called 1905 the dress rehearsal for 1917.'),
    ('trotsky', 1, 'leader', '페테르부르크 소비에트 의장', 'Chairman of the Petersburg Soviet',
     '26세에 상트페테르부르크 소비에트의 지도적 인물로 떠올라 총파업을 이끌었고, 체포된 뒤 재판에서 봉기의 권리를 변론했다.',
     'At twenty-six he emerged as the leading figure of the St. Petersburg Soviet and led the general strike; after his arrest he defended the right of insurrection at his trial.'),
    ('frunze', 2, 'leader', '이바노보 파업 지도자', 'Ivanovo strike leader',
     '이바노보-보즈네센스크 총파업을 이끌며 최초의 노동자대표 소비에트 건설에 참여했고, 12월에는 모스크바 봉기의 바리케이드에서 싸웠다.',
     'He led the Ivanovo-Voznesensk general strike, helped build the first soviet of workers’ deputies, and in December fought on the barricades of the Moscow uprising.'),
    ('martov', 3, 'participant', '멘셰비키 지도자', 'Menshevik leader',
     '1905년 귀국해 소비에트와 멘셰비키 언론에서 활동했으며, 혁명의 전술과 전망을 놓고 볼셰비키와 논쟁했다.',
     'He returned to Russia in 1905, worked in the Soviet and the Menshevik press, and debated the Bolsheviks over the tactics and prospects of the revolution.'),
    ('luxemburg', 4, 'participant', '국제 혁명가', 'International revolutionary',
     '1905년 12월 바르샤바로 잠입해 혁명에 뛰어들었다가 이듬해 체포됐고, 이 경험에서 「대중파업」을 썼다.',
     'She slipped into Warsaw in December 1905 to join the revolution, was arrested the following year, and out of the experience wrote The Mass Strike.'),
    ('kollontai', 5, 'participant', '선동가', 'Agitator',
     '피의 일요일 행진의 현장에 있었고, 이후 파업 지원과 여성 노동자 조직화에 뛰어들었다.',
     'She was present at the Bloody Sunday march and threw herself into strike support and the organization of women workers.'),
    ('nadezhda-krupskaya', 6, 'participant', '지하조직 서기', 'Underground secretary',
     '당 중앙위원회의 서기로 귀국해 지하 연락망과 통신을 운영했다.',
     'Returning as secretary of the party Central Committee, she ran the underground network of contacts and correspondence.'),
    ('stalin', 7, 'participant', '캅카스 조직가', 'Caucasus organizer',
     '캅카스에서 파업과 전투대를 조직했고, 1905년 말 탐메르포르스 당협의회에서 레닌을 처음 만났다.',
     'He organized strikes and fighting squads in the Caucasus and first met Lenin at the Tammerfors party conference at the end of 1905.'),
    ('lunacharsky', 8, 'participant', '선전가', 'Propagandist',
     '1905년 페테르부르크로 돌아와 합법 볼셰비키 일간지 「노바야 지즌」에서 혁명의 선전을 맡았다.',
     'Back in St. Petersburg in 1905, he carried the revolution’s propaganda in the legal Bolshevik daily Novaya Zhizn.'),
    ('gapon', 9, 'participant', '청원 행진 주도자', 'Petition march leader',
     '겨울궁전 청원 행진을 조직한 사제로, 학살 뒤 혁명과 경찰 사이를 오가다 경찰과의 연계가 드러나 1906년 살해됐다.',
     'The priest who organized the petition march to the Winter Palace; after the massacre he drifted between revolution and the police, and was killed in 1906 when his police ties came to light.'),
    ('gorky', 10, 'witness', '증언자 작가', 'Writer and witness',
     '피의 일요일 전야의 대표단에 참여하고 학살을 규탄하는 호소문을 써 체포됐으며, 혁명운동의 자금을 모았다.',
     'He joined the delegation on the eve of Bloody Sunday, was arrested for an appeal denouncing the massacre, and raised funds for the revolutionary movement.'),
    ('plekhanov', 11, 'witness', '망명지의 원로 이론가', 'Senior theorist in exile',
     '망명지에서 모스크바 봉기를 두고 「무기를 들지 말았어야 했다」고 평해, 봉기의 교훈을 강조한 레닌의 반박을 불렀다.',
     'From exile he judged of the Moscow uprising that the workers should not have taken up arms, drawing a rebuttal from Lenin, who insisted on learning the lessons of the insurrection.'),
    ('nicholas-ii', 12, 'opponent', '차르', 'Tsar',
     '발포와 계엄으로 혁명에 맞섰고, 총파업에 몰려 서명한 10월 선언의 양보를 반동기에 하나씩 되물렸다.',
     'He met the revolution with gunfire and martial law, and in the reaction took back one by one the concessions of the October Manifesto he had signed under the pressure of the general strike.'),
    ('witte', 13, 'opponent', '초대 총리', 'First prime minister',
     '10월 선언을 기초해 자유주의자들을 정권 편으로 돌려세움으로써 혁명 진영을 분열시켰다.',
     'He drafted the October Manifesto, winning the liberals over to the regime and splitting the revolutionary camp.'),
    ('stolypin', 14, 'executor', '진압 책임자', 'Chief of repression',
     '야전군법회의의 약식 처형과 1907년 6월의 친위쿠데타로 혁명을 종결시킨 총리였다.',
     'As prime minister he closed the revolution with the summary executions of the field courts-martial and the coup of June 1907.')
) AS v(person_id, sort_order, relation_kind, relation_ko, relation_en, note_ko, note_en)
WHERE EXISTS (SELECT 1 FROM commulingo_people p WHERE p.id = v.person_id)
ON CONFLICT (event_id, person_id) DO UPDATE SET
    sort_order = EXCLUDED.sort_order, relation_kind = EXCLUDED.relation_kind,
    relation_ko = EXCLUDED.relation_ko, relation_en = EXCLUDED.relation_en,
    note_ko = EXCLUDED.note_ko, note_en = EXCLUDED.note_en;
