-- Expand the Great Terror timeline beyond its initial three overview entries.
-- Order numbers and dates below follow the linked primary texts and scholarly
-- overviews; national operations are kept distinct from Order 00447's social
-- category operation.
UPDATE commulingo_history_events
SET timeline = $$[
  {
    "date":"1937.06.11",
    "title":{"ko":"군 지휘부 재판과 처형","en":"Trial and execution of the military leadership"},
    "body":{"ko":"투하쳅스키를 포함한 적군 고위 지휘관들이 비공개 군사재판 뒤 처형됐다. 이는 이후 군·당·국가기관 전체로 번질 숙청의 공개적 신호가 됐다.","en":"Senior Red Army commanders including Tukhachevsky were executed after a secret military trial, a public signal of the purge that would spread through the armed forces, party, and state."}
  },
  {
    "date":"1937.07.25",
    "title":{"ko":"NKVD 비밀 작전명령 제00439호: 독일 작전","en":"NKVD Secret Operational Order No. 00439: German operation"},
    "body":{"ko":"독일 국적자와 독일 관련 인맥을 ‘간첩’ 혐의로 겨냥한 작전이 시작됐다. 이는 뒤따를 민족 작전들의 초기 고리였으며, 국적·국경·해외 연고 자체가 혐의의 재료가 됐다.","en":"An operation targeted German citizens and people with German connections as alleged spies. An early link in the national operations, it turned nationality, borders, and foreign ties themselves into material for accusation."}
  },
  {
    "date":"1937.07.30–31",
    "title":{"ko":"NKVD 작전명령 제00447호: ‘쿨라크·범죄자·반소비에트 요소’","en":"NKVD Operational Order No. 00447: ‘kulaks, criminals, and anti-Soviet elements’"},
    "body":{"ko":"예조프가 서명하고 정치국이 승인한 제00447호는 전직 쿨라크, 전과자, 종교인, 과거 정당·반란 관련자 등을 ‘제1범주’(처형)와 ‘제2범주’(수용·추방)로 나눴다. 지역별 초기 할당량과 NKVD·당·검찰 트로이카가 대량 처리를 제도화했다.","en":"Signed by Yezhov and approved by the Politburo, Order 00447 divided former kulaks, alleged criminals, clergy, and people tied to former parties or rebellions into ‘first category’ (execution) and ‘second category’ (imprisonment or deportation). Regional starting quotas and NKVD-party-prosecution troikas institutionalized mass processing."}
  },
  {
    "date":"1937.08.11",
    "title":{"ko":"NKVD 작전명령 제00485호: 폴란드 작전","en":"NKVD Operational Order No. 00485: Polish operation"},
    "body":{"ko":"이른바 폴란드 군사조직과 폴란드 정보망의 ‘청산’을 지시한 제00485호가 발령됐다. 실제 적용은 폴란드계 주민만이 아니라 폴란드와의 실제·추정 연고를 가진 광범한 사람들에게 번졌으며, 이후 민족 작전의 본보기가 됐다.","en":"Order 00485 ordered the ‘liquidation’ of alleged Polish Military Organization and intelligence networks. In practice it reached far beyond proven espionage, targeting broad populations with real or presumed Polish links, and became a model for subsequent national operations."}
  },
  {
    "date":"1937.08.15",
    "title":{"ko":"NKVD 작전명령 제00486호: ‘조국반역자 가족’","en":"NKVD Operational Order No. 00486: ‘families of traitors to the motherland’"},
    "body":{"ko":"체포된 ‘조국반역자’의 아내를 체포·수용하고, 자녀를 분리 수용하도록 한 명령이다. 대테러가 개인의 혐의를 넘어 가족 단위의 처벌과 낙인을 제도화했음을 보여 준다.","en":"The order directed the arrest and imprisonment of wives of arrested ‘traitors to the motherland’ and the separation of their children. It shows how the terror institutionalized punishment and stigma beyond the accused individual to the family."}
  },
  {
    "date":"1937.09.20",
    "title":{"ko":"NKVD 작전명령 제00593호: 하르빈 귀환자·‘일본 간첩’","en":"NKVD Operational Order No. 00593: Harbin returnees and ‘Japanese spies’"},
    "body":{"ko":"중국 하르빈에서 귀환한 옛 러시아 철도 관계자와 이민자들을 일본 정보망 혐의로 겨냥했다. 국경 이동과 해외 체류의 이력이 간첩 혐의의 근거로 전환됐다.","en":"It targeted former railway personnel and émigrés who had returned from Harbin, China, as alleged Japanese agents. Border crossing and time abroad were turned into grounds for espionage accusations."}
  },
  {
    "date":"1937.11.30",
    "title":{"ko":"NKVD 지령 제49990호: 라트비아 작전","en":"NKVD Directive No. 49990: Latvian operation"},
    "body":{"ko":"라트비아계 조직과 연고를 겨냥한 작전이 시작됐다. 독일·폴란드 작전 뒤, 특정 디아스포라와 국경지대 인맥을 국가안보 위협으로 묶는 민족 작전이 계속 확대됐다.","en":"An operation against Latvian organizations and ties began. After the German and Polish operations, the national operations continued to expand, treating particular diasporas and borderland networks as security threats."}
  },
  {
    "date":"1937.12.11",
    "title":{"ko":"NKVD 지령 제50215호: 그리스 작전","en":"NKVD Directive No. 50215: Greek operation"},
    "body":{"ko":"그리스계 주민과 그리스 관련 조직을 겨냥한 작전이 발령됐다. 핀란드인·에스토니아인·루마니아인 등 여러 국경·디아스포라 집단에 대한 작전도 같은 시기 병행됐다.","en":"An operation targeted Greek communities and Greek-linked organizations. Operations against Finnish, Estonian, Romanian, and other borderland or diaspora groups also proceeded in this period."}
  },
  {
    "date":"1938.01.31",
    "title":{"ko":"민족 작전 연장","en":"National operations extended"},
    "body":{"ko":"정치국은 여러 민족 작전의 기한을 연장했다. 이 과정에서 대량 체포는 일회성 비상조치가 아니라 중앙의 연장 승인과 지방의 집행이 반복되는 행정 절차가 됐다.","en":"The Politburo extended several national operations. Mass arrest thereby became not a one-time emergency measure but a recurring administrative process of central extensions and local implementation."}
  },
  {
    "date":"1938.09–10",
    "title":{"ko":"예조프 체제의 균열과 내부 숙청","en":"The Yezhov apparatus fractures and is purged"},
    "body":{"ko":"대규모 작전이 계속되는 가운데 NKVD 내부의 책임자들이 차례로 제거되기 시작했다. 집행자였던 관리들이 수사의 표적이 되는 역전은 공포 체계가 스스로를 재생산한 방식을 드러낸다.","en":"While mass operations continued, NKVD officials began to be removed in turn. The reversal by which implementers became investigative targets reveals how the system of fear reproduced itself."}
  },
  {
    "date":"1938.11.17",
    "title":{"ko":"대량 작전 중지 결의","en":"Resolution halting mass operations"},
    "body":{"ko":"정치국과 인민위원회는 NKVD·검찰의 대량 체포·재판 절차를 중지하라는 결의를 냈다. 이는 무죄의 회복이 아니라, 집행 방식과 책임자의 교체를 동반한 종결 명령이었다.","en":"The Politburo and Sovnarkom issued a resolution halting the NKVD and prosecution's mass arrest and sentencing procedures. It was not a restoration of innocence, but a termination order accompanied by a change in methods and personnel."}
  },
  {
    "date":"1938.11.25",
    "title":{"ko":"베리야의 NKVD 명령 제00762호","en":"Beria’s NKVD Order No. 00762"},
    "body":{"ko":"베리야가 제00762호로 11월 17일 결의의 집행을 지시했다. 예조프는 해임됐고, 대테러의 기구는 사라지지 않은 채 지휘부와 절차를 바꾸어 다음 시기로 넘어갔다.","en":"Beria's Order 00762 directed implementation of the 17 November resolution. Yezhov was removed; the apparatus of terror did not disappear, but moved into the next period with changed leadership and procedures."}
  }
]$$::jsonb,
sources = $$[
  "https://ru.wikisource.org/wiki/%D0%9F%D1%80%D0%B8%D0%BA%D0%B0%D0%B7_%D0%9D%D0%9A%D0%92%D0%94_%D0%BE%D1%82_30.07.1937_%E2%84%96_00447",
  "https://justiceforpolishvictims.org/resources/documents/11th-august-1937-moscow-operational-order-no-00485-of-the-peoples-commissar-for-internal-affairs-of-the-ussr-nikolai-yezhov-on-the-so-called-polish-operation/",
  "https://www.sciencespo.fr/mass-violence-war-massacre-resistance/en/document/levashovo-cemetery-and-great-terror-leningrad-region.html",
  "https://www.cambridge.org/core/journals/historical-journal/article/understanding-stalins-terror-against-western-minorities-the-national-operations-of-the-nkvd-in-contemporary-academic-research/C857CFCE5920997FA2BFF04444B18760"
]$$::jsonb,
updated_at = NOW()
WHERE id = 'great-terror';
