-- Four late-Stalin / early-Khrushchev events, placed between the Great
-- Patriotic War (80) and the space program (90): the Leningrad Affair,
-- the Doctors' Plot, the fall of Beria, and the Anti-Party Group. Idempotent.

INSERT INTO commulingo_history_events
    (id, sort_order, period_label, title_ko, title_en, question_ko, question_en,
     summary_ko, summary_en, outcome_ko, outcome_en, timeline, sources, updated_at)
VALUES
    ('leningrad-affair', 82, '1949–1950',
     '레닌그라드 사건', 'The Leningrad Affair',
     '전쟁을 견뎌 낸 도시의 지도부는 왜 승리 뒤에 숙청되었는가?',
     'Why was the leadership of the city that survived the war purged after victory?',
     '레닌그라드 사건은 900일 봉쇄를 견뎌 낸 도시의 당·국가 간부들이 전후에 숙청된 사건이다. 즈다노프가 1948년 사망하자 말렌코프와 베리야는 그의 레닌그라드 인맥을 겨냥했고, 아바쿠모프의 국가보안부(MGB)가 조작된 혐의로 수백 명을 체포했다. 계획경제를 이끈 보즈네센스키와 당 서기 쿠즈네초프를 비롯한 핵심 인물들이 1950년 처형됐다.',
     'The Leningrad Affair was the postwar purge of the party and state cadres of the city that had endured a 900-day siege. When Zhdanov died in 1948, Malenkov and Beria turned on his Leningrad network, and Abakumov’s Ministry of State Security (MGB) arrested hundreds on fabricated charges. Key figures, including the planning chief Voznesensky and the party secretary Kuznetsov, were executed in 1950.',
     '수백 명이 처형되거나 수감·추방되었고, 전시에 도시를 지킨 세대의 지도부가 거의 사라졌다. 이 사건은 스탈린 말기 권력투쟁의 잔혹함을 드러냈으며, 스탈린 사후 흐루쇼프 시기에 피해자 대부분이 복권되었다.',
     'Hundreds were executed, imprisoned, or exiled, and the leadership of the generation that had defended the city in wartime was all but erased. The affair exposed the brutality of the late-Stalin power struggle, and most of the victims were rehabilitated under Khrushchev after Stalin’s death.',
     $$[
       {"date":"1948.08","title":{"ko":"즈다노프의 죽음","en":"Zhdanov’s death"},"body":{"ko":"레닌그라드 인맥의 후원자였던 즈다노프가 사망하면서 그의 사람들이 무방비 상태가 됐다.","en":"Zhdanov, patron of the Leningrad network, died, leaving his people exposed."}},
       {"date":"1949","title":{"ko":"체포의 시작","en":"Arrests begin"},"body":{"ko":"조작된 사건을 구실로 국가보안부가 레닌그라드 간부들을 대거 체포했다.","en":"On fabricated pretexts, the MGB arrested Leningrad cadres en masse."}},
       {"date":"1950.10","title":{"ko":"보즈네센스키·쿠즈네초프 처형","en":"Voznesensky and Kuznetsov executed"},"body":{"ko":"비밀재판 뒤 핵심 피고인들이 처형됐다.","en":"After a secret trial the leading defendants were executed."}},
       {"date":"1954","title":{"ko":"복권의 시작","en":"Rehabilitation begins"},"body":{"ko":"스탈린 사후 사건이 조작으로 밝혀지고 피해자들이 복권되기 시작했다.","en":"After Stalin’s death the case was exposed as fabricated and the victims began to be rehabilitated."}}
     ]$$::jsonb,
     '["Oleg Khlevniuk, Stalin: New Biography of a Dictator", "Encyclopaedia Britannica: Leningrad Affair"]'::jsonb,
     NOW()),
    ('doctors-plot', 84, '1952–1953',
     '의사들의 음모', 'The Doctors’ Plot',
     '스탈린 말기의 반유대 캠페인은 어떻게 조작되었고 무엇으로 끝났는가?',
     'How was the antisemitic campaign of Stalin’s last months fabricated, and how did it end?',
     '의사들의 음모는 크렘린 의료진(주로 유대인)이 소련 지도자들을 독살하려 했다는 조작된 혐의로 1953년 1월 공표된 사건이다. 그것은 스탈린 말기 반유대 캠페인과 국가보안부의 고문 수사가 결합한 결과였으며, 즈다노프와 셰르바코프의 죽음이 그 구실로 이용됐다. 1953년 3월 스탈린이 죽자 사건은 곧 조작으로 발표되고 체포된 의사들은 석방됐다.',
     'The Doctors’ Plot was announced in January 1953 on the fabricated charge that Kremlin physicians, mostly Jewish, had tried to poison Soviet leaders. It combined the antisemitic campaign of Stalin’s last years with the tortured interrogations of the Ministry of State Security, and the deaths of Zhdanov and Shcherbakov were used as its pretext. When Stalin died in March 1953 the case was soon declared a fabrication and the arrested doctors were released.',
     '스탈린의 죽음으로 대규모 탄압으로 번질 수 있던 캠페인은 중단됐고, 새 지도부는 사건이 조작이었음을 공개했다. 그러나 그 몇 달 동안 확산된 공포와 반유대 선전은 소련 사회에 깊은 상처를 남겼다.',
     'Stalin’s death halted a campaign that could have grown into mass repression, and the new leadership publicly declared the case a fabrication. Yet the fear and antisemitic propaganda spread during those months left deep wounds in Soviet society.',
     $$[
       {"date":"1948–1952","title":{"ko":"반유대 캠페인","en":"The antisemitic campaign"},"body":{"ko":"유대인 반파시스트 위원회가 해산되고 1952년 그 지도자들이 총살되는 등 「뿌리 없는 세계주의」에 대한 공격이 이어졌다.","en":"The Jewish Anti-Fascist Committee was dissolved and its leaders shot in 1952, part of an assault on so-called rootless cosmopolitanism."}},
       {"date":"1953.01.13","title":{"ko":"음모의 공표","en":"The plot announced"},"body":{"ko":"프라우다가 크렘린 의사들의 「살인 음모」를 공표하며 대대적 캠페인이 시작됐다.","en":"Pravda announced a murder plot by Kremlin doctors, launching a mass campaign."}},
       {"date":"1953.03.05","title":{"ko":"스탈린의 죽음","en":"Stalin’s death"},"body":{"ko":"스탈린이 사망하면서 캠페인의 정치적 동력이 사라졌다.","en":"Stalin died, and the campaign lost its political driving force."}},
       {"date":"1953.04","title":{"ko":"의사들의 석방","en":"The doctors freed"},"body":{"ko":"새 지도부가 사건을 조작으로 발표하고 체포된 의사들을 석방했다.","en":"The new leadership declared the case a fabrication and released the arrested doctors."}}
     ]$$::jsonb,
     '["Jonathan Brent & Vladimir Naumov, Stalin’s Last Crime", "Encyclopaedia Britannica: Doctors’ Plot"]'::jsonb,
     NOW()),
    ('beria-purge', 86, '1953',
     '베리야의 몰락', 'The Fall of Beria',
     '스탈린의 비밀경찰 총수는 어떻게, 왜 그의 동료들에게 제거되었는가?',
     'How and why was Stalin’s secret-police chief brought down by his own colleagues?',
     '스탈린 사후 베리야는 제1부총리이자 내무부(MVD) 수장으로 사면·탈스탈린화·대외 완화 등 개혁을 주도하며 강력해졌다. 그의 야심과 보안기구 장악을 두려워한 흐루쇼프·말렌코프·몰로토프 등 간부단은 1953년 6월 주코프 휘하 군 장교들의 도움으로 그를 체포했다. 베리야는 12월 재판 뒤 측근들과 함께 처형됐다.',
     'After Stalin’s death, Beria grew powerful as first deputy premier and head of the Ministry of Internal Affairs (MVD), driving reforms such as amnesties, early de-Stalinization, and a softer foreign line. Fearing his ambition and grip on the security organs, a Presidium coalition of Khrushchev, Malenkov, Molotov and others arrested him in June 1953 with the help of army officers under Zhukov. Beria was executed after a December trial, together with his closest associates.',
     '베리야의 몰락으로 비밀경찰은 당의 통제 아래 놓였고, 스탈린주의적 대숙청의 재발 가능성이 크게 줄었다. 그것은 「패자가 죽지 않게 되는」 집단지도 체제로 가는 전환점이자, 흐루쇼프가 권력의 중심으로 떠오르는 계기가 됐다.',
     'Beria’s fall brought the secret police under party control and sharply reduced the chance of another Stalinist mass purge. It was a turning point toward a collective leadership in which losers would no longer be killed, and the moment Khrushchev rose toward the center of power.',
     $$[
       {"date":"1953.03","title":{"ko":"스탈린의 죽음과 베리야의 부상","en":"Stalin’s death and Beria’s rise"},"body":{"ko":"베리야가 내무부를 장악하고 사면·개혁을 주도했다.","en":"Beria seized control of the MVD and led amnesties and reforms."}},
       {"date":"1953.06.26","title":{"ko":"주석단 회의의 체포","en":"Arrest at the Presidium"},"body":{"ko":"주석단 회의에서 흐루쇼프 등이 베리야를 고발하고 주코프 휘하 장교들이 그를 체포했다.","en":"At a Presidium session Khrushchev and others denounced Beria, and officers under Zhukov arrested him."}},
       {"date":"1953.12","title":{"ko":"재판과 처형","en":"Trial and execution"},"body":{"ko":"비밀재판 뒤 베리야와 메르쿨로프·코불로프 등 측근이 처형됐다.","en":"After a secret trial Beria and close aides such as Merkulov and Kobulov were executed."}}
     ]$$::jsonb,
     '["Amy Knight, Beria: Stalin’s First Lieutenant", "Encyclopaedia Britannica: Lavrenty Beria"]'::jsonb,
     NOW()),
    ('anti-party-group', 88, '1957',
     '반당 그룹 사건', 'The Anti-Party Group',
     '스탈린의 옛 동료들은 왜 흐루쇼프를 몰아내려다 오히려 밀려났는가?',
     'Why did Stalin’s old comrades fail to remove Khrushchev and end up removed themselves?',
     '1957년 6월, 몰로토프·말렌코프·카가노비치를 비롯한 주석단 다수파는 비밀연설과 개혁으로 자신들의 입지를 위협한 흐루쇼프를 제1서기직에서 몰아내려 했다. 흐루쇼프는 문제를 중앙위원회 전원회의로 넘겼고, 주코프의 도움으로 소집된 중앙위원들이 그를 지지했다. 다수파는 「반당 그룹」으로 규정되어 패배했다.',
     'In June 1957 a Presidium majority led by Molotov, Malenkov and Kaganovich moved to remove Khrushchev as First Secretary, whose Secret Speech and reforms had threatened their standing. Khrushchev pushed the question to a full plenum of the Central Committee, whose members, convened with Zhukov’s help, backed him. The majority was branded the Anti-Party Group and defeated.',
     '패배한 지도자들은 처형되지 않고 지방으로 좌천되거나 당직에서 밀려났다 — 스탈린 시대와 달리 정치적 패배가 곧 죽음을 뜻하지 않게 된 전환이었다. 흐루쇼프는 권력을 굳혔으나, 결정적 도움을 준 주코프마저 몇 달 뒤 해임했다.',
     'The defeated leaders were not executed but demoted to the provinces or removed from party posts — a shift in which, unlike under Stalin, political defeat no longer meant death. Khrushchev consolidated his power, yet within months he also dismissed Zhukov, whose help had been decisive.',
     $$[
       {"date":"1956.02","title":{"ko":"비밀연설","en":"The Secret Speech"},"body":{"ko":"흐루쇼프가 스탈린 개인숭배를 비판하면서 옛 간부들과의 긴장이 커졌다.","en":"Khrushchev denounced the cult of Stalin, sharpening tensions with the old cadres."}},
       {"date":"1957.06","title":{"ko":"주석단의 반란","en":"The Presidium revolt"},"body":{"ko":"주석단 다수파가 흐루쇼프의 사임을 요구했다.","en":"A Presidium majority demanded Khrushchev’s resignation."}},
       {"date":"1957.06","title":{"ko":"중앙위 전원회의","en":"The Central Committee plenum"},"body":{"ko":"소집된 중앙위원회가 흐루쇼프를 지지하고 다수파를 「반당 그룹」으로 규정했다.","en":"The convened Central Committee backed Khrushchev and branded the majority the Anti-Party Group."}},
       {"date":"1957.10","title":{"ko":"주코프의 해임","en":"Zhukov dismissed"},"body":{"ko":"흐루쇼프가 자신을 도운 주코프마저 국방장관직에서 해임했다.","en":"Khrushchev dismissed even Zhukov, who had helped him, from the defense ministry."}}
     ]$$::jsonb,
     '["William Taubman, Khrushchev: The Man and His Era", "Encyclopaedia Britannica: Anti-Party Group"]'::jsonb,
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
SELECT v.event_id, v.person_id, v.sort_order, v.relation_kind, v.relation_ko, v.relation_en, v.note_ko, v.note_en
FROM (VALUES
    -- Leningrad Affair
    ('leningrad-affair','stalin',0,'executor','최종 승인자','Final authority','전후 권력투쟁 속에서 레닌그라드 숙청을 최종적으로 승인했다.','He gave final approval to the Leningrad purge amid the postwar power struggle.'),
    ('leningrad-affair','malenkov',1,'executor','숙청 주도','Purge driver','즈다노프 인맥과 경쟁한 간부로 사건을 앞장서 몰고 갔다.','A rival of the Zhdanov network, he drove the case forward.'),
    ('leningrad-affair','beria',2,'executor','보안기구 배후','Security backer','국가보안기구를 통해 사건을 뒷받침했다.','He backed the case through the state-security apparatus.'),
    ('leningrad-affair','abakumov',3,'executor','MGB 수사 집행','MGB investigator','국가보안부 장관으로 조작된 수사와 체포를 지휘했다.','As Minister of State Security, he directed the fabricated investigation and arrests.'),
    ('leningrad-affair','zhdanov',4,'leader','레닌그라드 인맥의 후원자','Patron of the network','레닌그라드 간부들의 후원자였으나 1948년 사망하면서 그들이 무방비 상태가 됐다.','Patron of the Leningrad cadres, whose death in 1948 left them exposed.'),
    ('leningrad-affair','voznesensky',5,'target','표적','Target','계획경제를 이끈 정치국원으로 1950년 처형됐다.','The Politburo member who led the planned economy, executed in 1950.'),
    ('leningrad-affair','alexei-kuznetsov',6,'target','표적','Target','전후 당 서기국의 2인자로 1950년 처형됐다.','The number-two in the postwar party secretariat, executed in 1950.'),
    ('leningrad-affair','kosygin',7,'participant','살아남은 레닌그라드 사람','Leningrad survivor','레닌그라드 인맥과 가까웠으나 연루를 피해 살아남아 훗날 총리가 됐다.','Close to the Leningrad network, he escaped implication and survived to become premier.'),
    -- Doctors' Plot
    ('doctors-plot','stalin',0,'executor','배후 지도','Directing hand','말기의 반유대 캠페인과 음모 조작을 배후에서 이끌었다.','He directed the late antisemitic campaign and the fabrication from behind the scenes.'),
    ('doctors-plot','ignatiev',1,'executor','MGB 장관','Minister of State Security','국가보안부 장관으로 의사들에 대한 고문 수사를 지휘했다.','As Minister of State Security, he directed the tortured interrogation of the doctors.'),
    ('doctors-plot','alexander-shcherbakov',2,'target','음모의 구실이 된 죽음','A death used as pretext','1945년 사망한 그의 죽음이 의사들의 「살해」 증거로 조작됐다.','His death in 1945 was fabricated into evidence of murder by the doctors.'),
    ('doctors-plot','zhdanov',3,'target','음모의 구실이 된 죽음','A death used as pretext','1948년 그의 죽음에 대한 고발 편지가 음모 사건의 발단이 됐다.','A denunciation over his 1948 death became the trigger for the case.'),
    ('doctors-plot','lozovsky',4,'target','반유대 캠페인의 희생자','Victim of the campaign','유대인 반파시스트 위원회 지도자로 관련 캠페인 속에서 1952년 총살됐다.','A leader of the Jewish Anti-Fascist Committee, shot in 1952 amid the linked campaign.'),
    ('doctors-plot','beria',5,'opponent','음모를 끝낸 사람','The man who ended it','스탈린 사후 사건을 조작으로 발표하고 체포된 의사들을 석방했다.','After Stalin’s death he declared the case a fabrication and freed the arrested doctors.'),
    ('doctors-plot','malenkov',6,'participant','전환의 참여자','Party to the reversal','스탈린 사후 새 지도부의 일원으로 캠페인의 종결에 참여했다.','As part of the new leadership after Stalin, he took part in ending the campaign.'),
    -- Fall of Beria
    ('beria-purge','khrushchev',0,'executor','제거를 조직','Organizer of the takedown','주석단 내에서 베리야 제거를 조직한 핵심 인물이었다.','The key figure who organized Beria’s removal within the Presidium.'),
    ('beria-purge','malenkov',1,'executor','주석단 의장','Chair of the Presidium','정부 수반으로 체포를 주재했다.','As head of government, he chaired the session that arrested Beria.'),
    ('beria-purge','molotov',2,'executor','간부단의 지지','Presidium backer','베리야에 반대하는 간부단의 결의를 뒷받침했다.','He backed the Presidium’s resolve against Beria.'),
    ('beria-purge','zhukov',3,'executor','체포 실행','He made the arrest','휘하 군 장교들과 함께 회의장에서 베리야를 직접 체포했다.','With army officers under his command, he arrested Beria in the meeting room.'),
    ('beria-purge','bulganin',4,'executor','간부단 일원','Presidium member','흐루쇼프 편에 서서 베리야 제거에 가담했다.','He sided with Khrushchev in removing Beria.'),
    ('beria-purge','kaganovich',5,'executor','간부단 일원','Presidium member','간부단의 반베리야 결의에 가담했다.','He joined the Presidium’s move against Beria.'),
    ('beria-purge','mikoyan',6,'executor','간부단 일원','Presidium member','신중한 태도를 보이면서도 최종적으로 제거에 동참했다.','Cautious at first, he ultimately joined the removal.'),
    ('beria-purge','beria',7,'target','숙청의 표적','Target of the purge','스탈린의 비밀경찰 총수로 1953년 12월 재판 뒤 처형됐다.','Stalin’s secret-police chief, executed after a December 1953 trial.'),
    ('beria-purge','merkulov',8,'target','표적','Target','베리야의 측근 보안 간부로 함께 처형됐다.','A close security aide of Beria, executed with him.'),
    ('beria-purge','bogdan-kobulov',9,'target','표적','Target','베리야의 가장 가까운 부관으로 함께 처형됐다.','Beria’s closest deputy, executed with him.'),
    -- Anti-Party Group
    ('anti-party-group','khrushchev',0,'executor','승리한 제1서기','The victorious First Secretary','문제를 중앙위원회로 넘겨 다수파를 역전시켰다.','He turned the tables on the majority by taking the question to the Central Committee.'),
    ('anti-party-group','zhukov',1,'executor','결정적 지원','Decisive support','군용기로 중앙위원들을 소집해 흐루쇼프를 지지하게 한 뒤, 몇 달 뒤 자신도 해임됐다.','He flew Central Committee members in to back Khrushchev, then was himself dismissed months later.'),
    ('anti-party-group','mikoyan',2,'executor','흐루쇼프 지지','Khrushchev ally','주석단에서 흐루쇼프를 지지한 소수 중 하나였다.','One of the few in the Presidium who backed Khrushchev.'),
    ('anti-party-group','suslov',3,'executor','흐루쇼프 지지','Khrushchev ally','중앙위원회에서 흐루쇼프 편에 선 이념 담당 서기였다.','The ideology secretary who sided with Khrushchev at the plenum.'),
    ('anti-party-group','brezhnev',4,'executor','흐루쇼프 측근','Khrushchev protégé','흐루쇼프의 지지 세력으로 사건 이후 승진했다.','A Khrushchev supporter who rose after the affair.'),
    ('anti-party-group','molotov',5,'target','반당 그룹','Anti-Party Group','흐루쇼프 축출을 주도했으나 패배해 몽골 대사로 좌천됐다.','A leader of the move against Khrushchev, defeated and demoted to ambassador to Mongolia.'),
    ('anti-party-group','malenkov',6,'target','반당 그룹','Anti-Party Group','패배 뒤 카자흐스탄의 발전소 소장으로 좌천됐다.','After defeat he was demoted to manage a power station in Kazakhstan.'),
    ('anti-party-group','kaganovich',7,'target','반당 그룹','Anti-Party Group','스탈린의 오랜 조직가로 패배 뒤 당에서 밀려났다.','A long-time Stalin organizer, pushed out of the party after defeat.'),
    ('anti-party-group','shepilov',8,'target','「그들에게 가담한」','“And Shepilov who joined them”','뒤늦게 다수파에 가담해 관용구가 된 이름으로 함께 밀려났다.','He joined the majority late and was ousted under the phrase that became idiom.'),
    ('anti-party-group','bulganin',9,'participant','주저한 다수파','A wavering member','다수파에 섰으나 즉각적 처벌은 면했고 뒤에 좌천됐다.','He sided with the majority but escaped immediate punishment, demoted later.'),
    ('anti-party-group','voroshilov',10,'participant','주저한 다수파','A wavering member','다수파에 가담했으나 원로 예우로 즉각적 숙청은 피했다.','He joined the majority but was spared immediate purge as an elder.'),
    ('anti-party-group','mikhail-pervukhin',11,'participant','주저한 다수파','A wavering member','다수파에 섰다가 강등된 기술관료였다.','A technocrat who sided with the majority and was demoted.'),
    ('anti-party-group','saburov',12,'participant','주저한 다수파','A wavering member','다수파에 가담했다가 계획 부문에서 밀려난 관료였다.','A planning official who joined the majority and was pushed out.')
) AS v(event_id, person_id, sort_order, relation_kind, relation_ko, relation_en, note_ko, note_en)
WHERE EXISTS (SELECT 1 FROM commulingo_people p WHERE p.id = v.person_id)
ON CONFLICT (event_id, person_id) DO UPDATE SET
    sort_order = EXCLUDED.sort_order, relation_kind = EXCLUDED.relation_kind,
    relation_ko = EXCLUDED.relation_ko, relation_en = EXCLUDED.relation_en,
    note_ko = EXCLUDED.note_ko, note_en = EXCLUDED.note_en;
