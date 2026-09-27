// CommuLingo historical learning: actual documents, bilingual paraphrases and source links.
module.exports = {
  "id": "french-revolution-intro",
  "volumeNumber": 11,
  "format": "short-learning",
  "category": "history",
  "title": {
    "ko": "프랑스 혁명사",
    "en": "History of the French Revolution"
  },
  "bookTitle": {
    "ko": "프랑스 혁명사",
    "en": "History of the French Revolution"
  },
  "badge": {
    "ko": "짧은 학습 · 9편",
    "en": "9 short lessons"
  },
  "description": {
    "ko": "미국 독립전쟁의 파급부터 1799년 브뤼메르까지, 대외전쟁·공포정치·자유와 평등의 쟁점을 혁명의 흐름 속에서 배웁니다. 편마다 그 시기의 권리 선언·헌법·연설·법령 원문을 조항과 논증 단위로 함께 읽습니다.",
    "en": "Trace the Revolution from the impact of the American War to Brumaire in 1799, connecting foreign war, the Terror, liberty, and equality. Each lesson also reads the period’s declarations, constitutions, speeches, and decrees themselves, clause by clause."
  },
  "editorial": {
    "authoredAt": "2026-09-13",
    "revision": 12,
    "interpretation": "Hobsbawm with separately identified primary evidence",
    "method": "Actual historical documents and authored interpretations only; no invented dialogue, documents, or scenarios.",
    "sourceNotesFile": "data/commulingo/docs/french-revolution-intro.html",
    "revisedAt": "2026-09-27",
    "documentsPart": "Close reading of the site's primary-source translations; later practice and historians' interpretations identified separately"
  },
  "factionGuide": {
    "eyebrow": {
      "ko": "1791–1794 · 세력 관계도",
      "en": "1791–1794 · faction map"
    },
    "title": {
      "ko": "혁명기의 세력들은 어디에 서 있었을까?",
      "en": "Where did the forces of the Revolution stand?"
    },
    "intro": {
      "ko": "혁명 내부의 의회 좌석·정치클럽·파리 대중운동뿐 아니라 입헌군주파와 의회 밖 반혁명도 함께 봐야 전체 구도가 보입니다. 네 층을 시기와 성격에 맞는 축으로 나누어 배치했습니다.",
      "en": "The full picture includes constitutional monarchists and counter-revolution outside the legislature as well as parliamentary alignments, clubs, and popular politics. Four layers arrange them along axes appropriate to their moment and character."
    },
    "caveat": {
      "ko": "주의 · 오늘날의 당원명부와 강령을 갖춘 정당 지도가 아닙니다. 푀양파는 1789년의 변화 일부를 인정하면서 1791년 입헌군주제를 유지하려 했습니다. 망명귀족·선서거부 성직자·지역 반란도 하나의 지휘계통이 아니었습니다.",
      "en": "Caution · This is not a map of modern parties with fixed membership and platforms. The Feuillants accepted parts of the changes since 1789 while seeking to preserve the constitutional monarchy of 1791. Émigrés, refractory clergy, and regional insurgents did not form one chain of command."
    },
    "layers": [
      {
        "id": "counterrevolution",
        "number": "01",
        "period": "1791–1794",
        "axis": {
          "left": {
            "ko": "1791년 입헌군주제 유지",
            "en": "Preserve the 1791 constitutional monarchy"
          },
          "right": {
            "ko": "왕정복고·무장 저항",
            "en": "Restore monarchy or resist by force"
          }
        },
        "kind": {
          "ko": "입헌군주파와 반혁명 세력",
          "en": "Constitutional monarchists and counter-revolution"
        },
        "groups": [
          {
            "id": "feuillants",
            "order": 1,
            "name": {
              "ko": "푀양파",
              "en": "Feuillants"
            },
            "alias": {
              "ko": "입헌군주제파 · 1791년 의회 우파",
              "en": "constitutional monarchists · right of the 1791 legislature"
            },
            "description": {
              "ko": "바렌 도주와 샹드마르스 사건을 거치며 자코뱅에서 갈라진 온건파였습니다. 1791년 헌법과 왕의 지위를 지키고 혁명의 추가 급진화를 끝내려 했습니다.",
              "en": "Moderates who split from the Jacobins amid the Varennes and Champ de Mars crises. They defended the Constitution of 1791 and the king’s place within it, seeking to halt further radicalisation."
            },
            "turn": {
              "ko": "1792년 8월 10일 왕권 정지와 푀양파 내각 해임 뒤 정치적 기반 붕괴",
              "en": "Political base collapsed after 10 August 1792 suspended the king and dismissed Feuillant ministers"
            },
            "people": [
              {
                "personId": "antoine-barnave",
                "label": {
                  "ko": "앙투안 바르나브",
                  "en": "Antoine Barnave"
                }
              },
              {
                "personId": "adrien-duport",
                "label": {
                  "ko": "아드리앵 뒤포르",
                  "en": "Adrien Duport"
                }
              },
              {
                "personId": "alexandre-de-lameth",
                "label": {
                  "ko": "알렉상드르 드 라메트",
                  "en": "Alexandre de Lameth"
                }
              }
            ]
          },
          {
            "id": "royalists-emigres",
            "order": 2,
            "name": {
              "ko": "왕정복고파와 망명귀족",
              "en": "Restorationist royalists and émigrés"
            },
            "alias": {
              "ko": "왕실 인맥 · 망명자 군대",
              "en": "court networks · émigré armies"
            },
            "description": {
              "ko": "왕권 회복이나 구체제 복원을 바란 여러 흐름입니다. 망명귀족 일부는 국외에서 군대를 조직하고 유럽 군주국의 개입과 결합했지만, 모든 망명자가 같은 이유나 노선을 가졌던 것은 아닙니다.",
              "en": "Several currents sought renewed royal authority or restoration of the old order. Some aristocratic émigrés organised armies abroad and aligned with monarchical intervention, although not every émigré shared one motive or programme."
            },
            "turn": {
              "ko": "1792년 전쟁과 왕정 붕괴 뒤 국내 왕당파와 국외 망명 세력이 반혁명의 표적이자 기반으로 부각",
              "en": "War and the fall of the monarchy in 1792 made domestic royalists and émigré networks central to counter-revolution"
            },
            "people": [
              {
                "personId": "louis-xvi",
                "label": {
                  "ko": "루이 16세",
                  "en": "Louis XVI"
                }
              },
              {
                "personId": "charles-x-of-france",
                "label": {
                  "ko": "아르투아 백작",
                  "en": "Comte d’Artois"
                }
              },
              {
                "personId": "louis-joseph-prince-of-conde",
                "label": {
                  "ko": "콩데 공",
                  "en": "Prince of Condé"
                }
              }
            ]
          },
          {
            "id": "refractory-clergy",
            "order": 3,
            "name": {
              "ko": "선서거부 성직자와 가톨릭 저항",
              "en": "Refractory clergy and Catholic resistance"
            },
            "alias": {
              "ko": "성직자 시민헌법 선서 거부",
              "en": "refusal of the Civil Constitution oath"
            },
            "description": {
              "ko": "성직자 시민헌법에 대한 선서 거부가 교회와 지역사회를 갈라놓았습니다. 선서거부 성직자는 하나의 왕당파 정당은 아니었지만, 박해와 종교정책 속에서 여러 지역의 반혁명 동원망과 겹쳤습니다.",
              "en": "Refusal of the oath to the Civil Constitution divided the Church and local communities. Refractory clergy were not one royalist party, but persecution and religious policy tied some networks to regional counter-revolution."
            },
            "turn": {
              "ko": "1792년 추방 논쟁과 왕의 거부권이 입헌군주제 위기를 심화",
              "en": "The 1792 deportation dispute and royal veto deepened the constitutional crisis"
            },
            "people": []
          },
          {
            "id": "vendee-chouannerie",
            "order": 4,
            "name": {
              "ko": "방데·슈앙 반란 세력",
              "en": "Vendée and Chouan insurgencies"
            },
            "alias": {
              "ko": "지역적·가톨릭적·왕당파적 무장 저항",
              "en": "regional, Catholic, and royalist armed resistance"
            },
            "description": {
              "ko": "징병, 종교 갈등, 지방의 불만이 결합한 서로 다른 서부 농촌 반란입니다. 가톨릭 왕당군의 이름을 채택했지만 파리의 단일 정파나 하나의 전국 조직으로 보면 안 됩니다.",
              "en": "Distinct western rural insurgencies combining conscription, religious conflict, and local grievances. They adopted Catholic and royalist banners but were neither a Paris faction nor one nationwide organisation."
            },
            "turn": {
              "ko": "1793년 내전의 핵심 전선이 되었고 정규군 패배 뒤에도 슈앙 반란 등 무장 저항 지속",
              "en": "Became a main civil-war front in 1793; armed resistance including the Chouannerie continued after major battlefield defeats"
            },
            "people": [
              {
                "personId": "jacques-cathelineau",
                "label": {
                  "ko": "자크 카틀리노",
                  "en": "Jacques Cathelineau"
                }
              },
              {
                "personId": "henri-de-la-rochejaquelein",
                "label": {
                  "ko": "앙리 드 라 로슈자클랭",
                  "en": "Henri de La Rochejaquelein"
                }
              },
              {
                "personId": "francois-de-charette",
                "label": {
                  "ko": "프랑수아 드 샤레트",
                  "en": "François de Charette"
                }
              }
            ]
          }
        ]
      },
      {
        "id": "convention",
        "number": "02",
        "period": "1792–1795",
        "kind": {
          "ko": "국민공회 의석 집단",
          "en": "National Convention alignments"
        },
        "groups": [
          {
            "id": "gironde",
            "name": {
              "ko": "지롱드파",
              "en": "Girondins"
            },
            "alias": {
              "ko": "브리소파라고도 부름",
              "en": "also called Brissotins"
            },
            "description": {
              "ko": "왕정 폐지에 참여한 공화파였지만 파리 코뮌과 무장 민중의 압력, 중앙집권적 비상정부를 경계했습니다. 1792년 대오스트리아 전쟁을 주도했습니다.",
              "en": "Republicans who helped abolish monarchy but resisted pressure from the Paris Commune and armed crowds, as well as concentrated emergency rule. They led the drive for war with Austria in 1792."
            },
            "turn": {
              "ko": "1793년 6월 봉기 뒤 지도부가 체포되어 의회 세력으로 붕괴",
              "en": "Leadership arrested after the June 1793 rising; collapsed as a parliamentary force"
            },
            "people": [
              {
                "personId": "jacques-pierre-brissot",
                "label": {
                  "ko": "자크 피에르 브리소",
                  "en": "Jacques Pierre Brissot"
                }
              },
              {
                "personId": "pierre-vergniaud",
                "label": {
                  "ko": "피에르 베르니오",
                  "en": "Pierre Vergniaud"
                }
              }
            ],
            "order": 3
          },
          {
            "id": "plain",
            "name": {
              "ko": "평원파",
              "en": "The Plain"
            },
            "alias": {
              "ko": "마레(늪)라고도 부름",
              "en": "also called the Marsh"
            },
            "description": {
              "ko": "국민공회의 가장 큰 중간 지대였습니다. 하나의 강령이나 지도부를 가진 정파라기보다 사안과 정세에 따라 표가 움직인 느슨한 다수였습니다.",
              "en": "The Convention’s largest middle ground: less a faction with one programme and leadership than a loose majority whose votes shifted with issues and circumstances."
            },
            "turn": {
              "ko": "초기에는 지롱드파, 1793년에는 산악파, 테르미도르에는 반로베스피에르 연합의 열쇠",
              "en": "Key to Girondin influence early, Mountain rule in 1793, and the anti-Robespierre coalition at Thermidor"
            },
            "people": [
              {
                "personId": "emmanuel-sieyes",
                "label": {
                  "ko": "에마뉘엘 시에예스",
                  "en": "Emmanuel Sieyès"
                }
              },
              {
                "personId": "bertrand-barere",
                "label": {
                  "ko": "베르트랑 바레르",
                  "en": "Bertrand Barère"
                }
              }
            ],
            "order": 2
          },
          {
            "id": "mountain",
            "name": {
              "ko": "산악파",
              "en": "The Mountain"
            },
            "alias": {
              "ko": "몽타뉴파",
              "en": "the Montagnards"
            },
            "description": {
              "ko": "자코뱅·코르들리에 클럽 출신이 많이 앉은 공회의 좌파였습니다. 강한 공화국과 중앙집권을 지지하고 파리 상퀼로트와 동맹해 지롱드파를 밀어냈습니다.",
              "en": "The Convention’s left, with many deputies from Jacobin and Cordelier circles. It backed a strong, centralised republic and allied with Parisian sans-culottes against the Girondins."
            },
            "turn": {
              "ko": "1793년 6월 이후 주도권 장악, 곧 혁명정부의 방향을 둘러싼 경쟁 격화",
              "en": "Took the initiative after June 1793, then fractured over the direction of revolutionary government"
            },
            "people": [
              {
                "personId": "maximilien-robespierre",
                "label": {
                  "ko": "막시밀리앵 로베스피에르",
                  "en": "Maximilien Robespierre"
                }
              },
              {
                "personId": "georges-danton",
                "label": {
                  "ko": "조르주 당통",
                  "en": "Georges Danton"
                }
              },
              {
                "personId": "jean-paul-marat",
                "label": {
                  "ko": "장폴 마라",
                  "en": "Jean-Paul Marat"
                }
              }
            ],
            "order": 1
          }
        ],
        "axis": {
          "left": {
            "ko": "당시 의회의 좌측",
            "en": "Convention left"
          },
          "right": {
            "ko": "당시 의회의 우측",
            "en": "Convention right"
          }
        }
      },
      {
        "id": "networks",
        "number": "03",
        "period": "1789–1794",
        "kind": {
          "ko": "클럽과 파리의 대중정치",
          "en": "Clubs and popular politics in Paris"
        },
        "groups": [
          {
            "id": "jacobins",
            "name": {
              "ko": "자코뱅 클럽",
              "en": "Jacobin Club"
            },
            "alias": {
              "ko": "전국 지부망을 가진 정치클럽",
              "en": "a political club with a national network"
            },
            "description": {
              "ko": "초기에는 입헌군주파부터 브리소·로베스피에르까지 폭넓게 거쳤습니다. 분열을 거친 1793년에는 산악파와 로베스피에르의 핵심 정치 기반이 됐습니다.",
              "en": "Its earlier membership ranged from constitutional monarchists to Brissot and Robespierre. After successive splits, it became a central base for the Mountain and Robespierre in 1793."
            },
            "turn": {
              "ko": "한 시점의 자코뱅파를 혁명 10년 전체의 고정 정당으로 보면 안 됨",
              "en": "The Jacobins at one moment were not one fixed party across the decade"
            },
            "people": [
              {
                "personId": "maximilien-robespierre",
                "label": {
                  "ko": "막시밀리앵 로베스피에르",
                  "en": "Maximilien Robespierre"
                }
              },
              {
                "personId": "louis-antoine-de-saint-just",
                "label": {
                  "ko": "루이 앙투안 생쥐스트",
                  "en": "Louis Antoine de Saint-Just"
                }
              }
            ],
            "order": 4
          },
          {
            "id": "cordeliers",
            "name": {
              "ko": "코르들리에 클럽",
              "en": "Cordeliers Club"
            },
            "alias": {
              "ko": "더 급진적인 파리 정치클럽",
              "en": "a more radical Paris club"
            },
            "description": {
              "ko": "청원·감시·봉기 정치와 가까웠습니다. 당통·데물랭과 에베르는 서로 다른 시기에 이 클럽을 기반으로 삼았으므로 코르들리에를 하나의 ‘에베르당’으로 볼 수 없습니다.",
              "en": "It stood close to petitioning, vigilance, and insurrectionary politics. Danton, Desmoulins, and Hébert drew on it at different times, so it was never simply one “Hébert party”."
            },
            "turn": {
              "ko": "1794년 에베르파 체포에 반발하지 못했고 이후 영향력 상실",
              "en": "Failed to resist the Hébertist arrests in 1794 and then lost influence"
            },
            "people": [
              {
                "personId": "jacques-rene-hebert",
                "label": {
                  "ko": "자크 르네 에베르",
                  "en": "Jacques René Hébert"
                }
              },
              {
                "personId": "georges-danton",
                "label": {
                  "ko": "조르주 당통",
                  "en": "Georges Danton"
                }
              },
              {
                "personId": "camille-desmoulins",
                "label": {
                  "ko": "카미유 데물랭",
                  "en": "Camille Desmoulins"
                }
              }
            ],
            "order": 3
          },
          {
            "id": "sans-culottes",
            "name": {
              "ko": "상퀼로트와 파리 구역",
              "en": "Sans-culottes and Paris sections"
            },
            "alias": {
              "ko": "정당이 아닌 대중 기반",
              "en": "a popular constituency, not a party"
            },
            "description": {
              "ko": "수공업자·상점주·임금노동자와 구역 활동가들이 가격 통제, 생존권, 직접 참여를 요구했습니다. 여러 세력이 지지를 놓고 경쟁했지만 이들 전체가 한 파벌의 지휘를 받은 것은 아닙니다.",
              "en": "Artisans, shopkeepers, wage workers, and sectional militants demanded price controls, subsistence, and direct participation. Leaders competed for their support, but they were not commanded by one faction."
            },
            "turn": {
              "ko": "1793년 지롱드파 축출을 압박했고 1794년 대중조직 억제로 약화",
              "en": "Pressed against the Girondins in 1793; weakened by restraints on popular organisation in 1794"
            },
            "people": [],
            "order": 2
          },
          {
            "id": "enrages",
            "name": {
              "ko": "앙라제",
              "en": "Enragés"
            },
            "alias": {
              "ko": "‘격앙된 자들’이라 불린 급진 선동가들",
              "en": "radical agitators called the “Enraged”"
            },
            "description": {
              "ko": "자크 루·장 바를레·테오필 르클레르 등이 부와 투기, 식량 문제를 공격했습니다. 산악파 내부의 정식 분파라기보다 산악파와 에베르파 모두를 압박한 별도 흐름이었습니다.",
              "en": "Jacques Roux, Jean Varlet, and Théophile Leclerc attacked wealth, speculation, and food scarcity. They were a distinct current, not a formal inner wing of the Mountain."
            },
            "turn": {
              "ko": "1793년 가을 산악파와 에베르 계열 양쪽의 견제로 지도자들이 체포되거나 고립",
              "en": "Leaders arrested or isolated in autumn 1793 under pressure from both Mountain and Hébertist circles"
            },
            "people": [
              {
                "personId": "jacques-roux",
                "label": {
                  "ko": "자크 루",
                  "en": "Jacques Roux"
                }
              },
              {
                "personId": "jean-francois-varlet",
                "label": {
                  "ko": "장 바를레",
                  "en": "Jean Varlet"
                }
              }
            ],
            "order": 1
          }
        ],
        "axis": {
          "left": {
            "ko": "급진적 민중 압력",
            "en": "Radical popular pressure"
          },
          "right": {
            "ko": "제도화된 클럽 정치",
            "en": "Institutional club politics"
          }
        }
      },
      {
        "id": "mountain-rivals",
        "number": "04",
        "period": "1793–1794",
        "kind": {
          "ko": "산악파 집권기 주변의 세 경쟁 경향",
          "en": "Three rival currents around Mountain rule"
        },
        "groups": [
          {
            "id": "hebertists",
            "name": {
              "ko": "에베르파",
              "en": "Hébertists"
            },
            "alias": {
              "ko": "과격파·과장파(Exagérés)",
              "en": "also labelled Exagérés or ultras"
            },
            "description": {
              "ko": "에베르의 신문 『페르 뒤셴』, 코르들리에 일부, 파리 코뮌 인맥이 느슨하게 연결됐습니다. 더 강한 경제 통제와 대중 압력, 비기독교화를 밀었고 봉기 호소가 실패한 뒤 숙청됐습니다.",
              "en": "Hébert’s Le Père Duchesne, part of the Cordeliers, and Paris Commune networks were loosely connected. They pressed stronger controls, popular pressure, and dechristianisation, then were purged after a failed call for insurrection."
            },
            "turn": {
              "ko": "1794년 3월 24일 에베르와 주요 동료 처형",
              "en": "Hébert and leading associates executed on 24 March 1794"
            },
            "people": [
              {
                "personId": "jacques-rene-hebert",
                "label": {
                  "ko": "자크 르네 에베르",
                  "en": "Jacques René Hébert"
                }
              },
              {
                "personId": "pierre-gaspard-chaumette",
                "label": {
                  "ko": "피에르 가스파르 쇼메트",
                  "en": "Pierre-Gaspard Chaumette"
                }
              }
            ],
            "order": 1
          },
          {
            "id": "robespierrists",
            "name": {
              "ko": "로베스피에르파와 위원회 정부",
              "en": "Robespierrists and committee government"
            },
            "alias": {
              "ko": "공안위원회 전체와 동일하지 않음",
              "en": "not identical with the whole Committee of Public Safety"
            },
            "description": {
              "ko": "로베스피에르·생쥐스트·쿠통의 인맥은 중앙집중적 혁명정부와 ‘덕과 공포’를 정당화했습니다. 공안위원회는 로베스피에르 개인의 당이 아니었지만 이들은 양쪽 경쟁 세력 제거에 책임이 있었습니다.",
              "en": "Networks around Robespierre, Saint-Just, and Couthon defended centralised revolutionary government and “virtue and terror”. The Committee was not Robespierre’s personal party, but they bore responsibility for eliminating both rival currents."
            },
            "turn": {
              "ko": "양쪽 경쟁자 제거 뒤 고립, 1794년 7월 27일 테르미도르 9일에 몰락",
              "en": "Isolated after eliminating both rivals; overthrown on 9 Thermidor, 27 July 1794"
            },
            "people": [
              {
                "personId": "maximilien-robespierre",
                "label": {
                  "ko": "막시밀리앵 로베스피에르",
                  "en": "Maximilien Robespierre"
                }
              },
              {
                "personId": "louis-antoine-de-saint-just",
                "label": {
                  "ko": "루이 앙투안 생쥐스트",
                  "en": "Louis Antoine de Saint-Just"
                }
              },
              {
                "personId": "georges-couthon",
                "label": {
                  "ko": "조르주 쿠통",
                  "en": "Georges Couthon"
                }
              }
            ],
            "order": 2
          },
          {
            "id": "indulgents",
            "name": {
              "ko": "당통파·관용파",
              "en": "Dantonists or Indulgents"
            },
            "alias": {
              "ko": "데물랭의 『비외 코르들리에』",
              "en": "associated with Desmoulins’s Le Vieux Cordelier"
            },
            "description": {
              "ko": "당통·데물랭 주변은 1793년 말부터 공포 완화와 수감자 심사, 부패 공격을 요구했습니다. 처음부터 일관된 온건파였던 것도, 단일한 전복 계획이 입증된 것도 아닙니다.",
              "en": "The circle around Danton and Desmoulins called for easing the Terror, reviewing prisoners, and attacking corruption. They had not always been moderates, nor was a single plot to overthrow the government established."
            },
            "turn": {
              "ko": "1794년 4월 5일 당통·데물랭 등 처형",
              "en": "Danton, Desmoulins, and associates executed on 5 April 1794"
            },
            "people": [
              {
                "personId": "georges-danton",
                "label": {
                  "ko": "조르주 당통",
                  "en": "Georges Danton"
                }
              },
              {
                "personId": "camille-desmoulins",
                "label": {
                  "ko": "카미유 데물랭",
                  "en": "Camille Desmoulins"
                }
              }
            ],
            "order": 3
          }
        ],
        "axis": {
          "left": {
            "ko": "급진화·민중 압력",
            "en": "Pressure for further radicalisation"
          },
          "right": {
            "ko": "공포정치 완화 요구",
            "en": "Pressure to ease the Terror"
          }
        }
      }
    ],
    "timelineTitle": {
      "ko": "동맹이 바뀌는 다섯 장면",
      "en": "Five moments that changed the alliances"
    },
    "timeline": [
      {
        "date": "1791.07",
        "title": {
          "ko": "푀양파 분리",
          "en": "The Feuillants split"
        },
        "text": {
          "ko": "바렌 도주와 샹드마르스 사건 뒤 입헌군주제를 지키려는 푀양파가 자코뱅에서 갈라졌습니다.",
          "en": "After Varennes and the Champ de Mars crisis, constitutional monarchists split from the Jacobins as Feuillants."
        }
      },
      {
        "date": "1792.09",
        "title": {
          "ko": "국민공회 개회",
          "en": "The Convention opens"
        },
        "text": {
          "ko": "지롱드파·평원파·산악파의 의석 구도가 공화정의 첫 권력 경쟁을 만들었습니다.",
          "en": "Girondins, the Plain, and the Mountain formed the first power struggle of the republic."
        }
      },
      {
        "date": "1793.06",
        "title": {
          "ko": "지롱드파 축출",
          "en": "The Girondins fall"
        },
        "text": {
          "ko": "파리 구역과 국민방위대의 압력 아래 평원파가 산악파 쪽으로 이동해 지롱드 지도부 체포를 받아들였습니다.",
          "en": "Under pressure from Paris sections and the National Guard, the Plain moved toward the Mountain and accepted the arrest of Girondin leaders."
        }
      },
      {
        "date": "1794.03–04",
        "title": {
          "ko": "양쪽 날개 숙청",
          "en": "Both flanks are purged"
        },
        "text": {
          "ko": "혁명정부는 먼저 에베르파, 이어 당통파를 혁명재판소로 보내 경쟁 세력을 제거했습니다.",
          "en": "Revolutionary government sent first the Hébertists and then the Dantonists to the Revolutionary Tribunal."
        }
      },
      {
        "date": "1794.07",
        "title": {
          "ko": "테르미도르 9일",
          "en": "9 Thermidor"
        },
        "text": {
          "ko": "평원파와 로베스피에르에 반대한 산악파 의원들이 결합해 로베스피에르파를 무너뜨렸습니다.",
          "en": "The Plain joined Montagnard opponents of Robespierre to overthrow the Robespierrist current."
        }
      }
    ],
    "sources": [
      {
        "label": {
          "ko": "프랑스 국민의회 · 국민공회의 구성",
          "en": "French National Assembly · composition of the National Convention"
        },
        "href": "https://www.assemblee-nationale.fr/dyn/histoire-et-patrimoine/revolution-francaise/la-convention-nationale-et-la-fin-de-la-royaute"
      },
      {
        "label": {
          "ko": "프랑스 국민의회 · 공포정치 1793–1794",
          "en": "French National Assembly · the Terror, 1793–1794"
        },
        "href": "https://www.assemblee-nationale.fr/dyn/histoire-et-patrimoine/revolution-francaise/la-terreur"
      },
      {
        "label": {
          "ko": "프랑스 국립도서관 · 자크 르네 에베르 전거",
          "en": "Bibliothèque nationale de France · Jacques René Hébert authority record"
        },
        "href": "https://catalogue.bnf.fr/ark:/12148/cb12520097x"
      },
      {
        "label": {
          "ko": "프랑스 국민의회 · 바르나브와 푀양파 분리",
          "en": "French National Assembly · Barnave and the Feuillant split"
        },
        "href": "https://www.assemblee-nationale.fr/histoire/7ea.asp"
      },
      {
        "label": {
          "ko": "프랑스 국민의회 · 1792년 6월과 선서거부 성직자",
          "en": "French National Assembly · June 1792 and refractory clergy"
        },
        "href": "https://www.assemblee-nationale.fr/dyn/histoire-et-patrimoine/revolution-francaise/declaration-de-guerre-manifestation-populaire-des-girondins"
      },
      {
        "label": {
          "ko": "프랑스 국민의회 · 1792년 8월 10일과 왕정 폐지",
          "en": "French National Assembly · 10 August 1792 and the fall of monarchy"
        },
        "href": "https://www.assemblee-nationale.fr/dyn/histoire-et-patrimoine/revolution-francaise/journee-insurrectionnelle-parisienne-abolition-de-la-royaute"
      }
    ]
  },
  "chapters": [
    {
      "id": "french-revolution-intro-ch06",
      "volumeNumber": 11,
      "chapterNumber": 1,
      "partNumber": 1,
      "partTitle": {
        "ko": "제1부 · 구체제의 붕괴와 새 헌정",
        "en": "Part I · The Old Regime collapses"
      },
      "title": {
        "ko": "1789년, 구체제는 어떻게 무너지고 무엇이 남았을까?",
        "en": "How did the Old Regime fall in 1789, and what survived it?"
      },
      "sourceUrl": "/commulingo/docs/france-privileges-property-and-labor-1789-1793",
      "summary": {
        "ko": "약 11분 · 재정 위기와 국민의회, 바스티유와 대공포가 8월 4일 밤으로 이어진 과정, 그리고 8월 법령이 없앤 것과 남긴 것을 1791년 르 샤플리에 법, 1793년 무상 폐지와 비교합니다.",
        "en": "About 11 minutes · Follow how fiscal crisis, the National Assembly, the Bastille, and the Great Fear led to the night of 4 August, then compare what the August decrees abolished and kept with the 1791 Le Chapelier law and the 1793 abolition without compensation."
      },
      "learningFocus": {
        "ko": "8월 4일 밤에 봉건제가 한꺼번에 사라졌다고 읽기 쉽습니다. 8월 법령 제1조가 배상 없이 없앤 권리와 되사야 하는 권리를 나누었다는 점, 그리고 남은 부담을 배상 없이 없앤 것은 1793년 7월 17일 법령이었다는 점을 구별하세요.",
        "en": "It is easy to read the night of 4 August as the moment feudalism vanished at once. Separate the rights Article 1 of the August decree abolished without compensation from those it made redeemable, and remember that the remaining dues were abolished without compensation only by the decree of 17 July 1793."
      },
      "conceptBrief": {
        "ko": [
          {
            "title": "재정 위기에서 국민의회로",
            "items": [
              "7년전쟁 뒤 영국을 견제하려던 프랑스 왕정은 1778년부터 미국 독립전쟁에 군사적·재정적으로 참여했습니다. 동기는 미국 공화정에 대한 공감보다 영국과의 외교·통상 경쟁이었습니다.",
              "참전 비용은 기존 전쟁 채무와 특권 신분에 유리한 조세 구조 위에 쌓였습니다. 새 과세를 승인받으려고 1789년 삼부회를 소집하자, 누가 국민을 대표하는가라는 문제가 열렸습니다.",
              "제3신분 대표들은 신분별 표결을 거부하고 자신들이 국민을 대표하는 국민의회라고 선언했습니다."
            ]
          },
          {
            "title": "거리와 농촌이 밀어붙인 8월 4일",
            "items": [
              "7월 14일 바스티유 습격은 파리의 무장한 군중이 의회와 왕 사이의 대립에 직접 개입할 수 있음을 보여주었습니다.",
              "농촌의 대공포와 영주권 문서 공격이 이어지자, 국민의회는 8월 4일 밤 봉건적 특권의 폐지를 선언했고 이 결의는 8월 법령으로 정리됐습니다."
            ]
          },
          {
            "title": "8월 법령: 폐지와 상환의 구별",
            "items": [
              "제1조는 봉건 제도를 완전히 폐지한다고 선언하면서도, 망모르트와 인적 예속에 속한 권리만 배상 없이 없애고 나머지는 되살 수 있는 권리로 두었습니다. 상환 전까지는 계속 걷었습니다.",
              "영주 재판권(제4조), 사냥·비둘기장 독점권(제2·3조), 조세 특권(제9조), 지방과 도시의 특권(제10조)은 폐지하고, 출신과 관계없이 모든 시민이 공직에 오를 수 있게 했습니다(제11조).",
              "십일조는 폐지하되 예배 경비와 빈민 구제 등을 다른 방식으로 충당할 때까지 종전처럼 걷게 했고(제5조), 영구 토지 지대와 샹파르는 상환할 수 있는 부담으로 두었습니다(제6조)."
            ]
          },
          {
            "title": "1791년의 결사 금지와 1793년의 무상 폐지",
            "items": [
              "1791년 6월 14일 르 샤플리에 법은 같은 직업 시민의 조합 폐지를 헌법의 기초로 보고, 업주와 노동자 모두 모여 대표를 뽑거나 공동 이익의 규정을 만드는 것, 정해진 가격으로만 일하자는 협약을 금지했습니다.",
              "1793년 7월 17일 국민공회 법령은 앞선 법령이 유지한 것까지 포함해 옛 영주에 대한 모든 부과금과 봉건적 권리를 배상 없이 폐지하고 증서를 불태우게 했습니다. 봉건적 성격이 없는 순수한 토지 지대는 예외였습니다."
            ]
          },
          {
            "title": "근거 자료",
            "items": [
              "『프랑스 혁명 문헌집: 특권 폐지와 노동』: 1789년 8월 법령 제1~19조, 1791년 르 샤플리에 법 제1~8조, 1793년 7월 17일 법령 제1~12조.",
              "프랑스 국민의회 혁명사: 삼부회, 국민의회, 바스티유, 8월 4일의 사건 순서.",
              "프랑스 국립도서관: 7년전쟁 뒤 영국과의 경쟁과 1778년 미국 독립전쟁 참전의 배경."
            ]
          }
        ],
        "en": [
          {
            "title": "From fiscal crisis to the National Assembly",
            "items": [
              "After the Seven Years' War the French monarchy, seeking to check Britain, joined the American War of Independence militarily and financially from 1778. Rivalry with Britain in diplomacy and trade mattered more than sympathy for an American republic.",
              "The cost of the war piled onto older war debts and a tax system that favoured the privileged orders. Convening the Estates-General in 1789 to approve new taxation opened the question of who represented the nation.",
              "Third Estate deputies refused voting by order and declared themselves the National Assembly representing the nation."
            ]
          },
          {
            "title": "Streets and countryside push toward 4 August",
            "items": [
              "The storming of the Bastille on 14 July showed that the armed crowd of Paris could intervene directly in the conflict between the Assembly and the king.",
              "As the Great Fear and attacks on seigneurial records spread in the countryside, the National Assembly declared the abolition of feudal privilege on the night of 4 August, and the resolution was set out in the August decrees."
            ]
          },
          {
            "title": "The August decrees: abolition versus redemption",
            "items": [
              "Article 1 declared the feudal regime entirely abolished, yet it ended without compensation only rights tied to mainmorte and personal servitude; the rest became redeemable and were collected until bought out.",
              "Seigneurial justice (Art. 4), exclusive hunting and dovecote rights (Arts. 2–3), tax privileges (Art. 9), and provincial and urban privileges (Art. 10) were abolished, and every citizen became eligible for office regardless of birth (Art. 11).",
              "The tithe was abolished but kept being collected until worship, poor relief, and similar costs were funded another way (Art. 5); perpetual ground rents and champart were made redeemable (Art. 6)."
            ]
          },
          {
            "title": "The 1791 ban on combinations and the 1793 abolition without compensation",
            "items": [
              "The Le Chapelier law of 14 June 1791 treated the abolition of trade corporations as a foundation of the constitution and forbade masters and workers alike to elect officers, make rules on their common interests, or agree to work only at fixed prices.",
              "The Convention's decree of 17 July 1793 abolished without compensation every due and feudal right owed to former lords, including those earlier decrees had kept, and ordered the title deeds burned. Purely landed, non-feudal rents were excepted."
            ]
          },
          {
            "title": "Sources",
            "items": [
              "French Revolution collection: abolition of privilege and labour: the August 1789 decree, Articles 1–19; the 1791 Le Chapelier law, Articles 1–8; the decree of 17 July 1793, Articles 1–12.",
              "French National Assembly history: the sequence from the Estates-General to 4 August.",
              "Bibliothèque nationale de France: rivalry after the Seven Years' War and French entry into the American War in 1778."
            ]
          }
        ]
      },
      "conceptMap": {
        "ko": [
          {
            "title": "재정과 대표권",
            "text": "전쟁 채무 속에 소집된 삼부회에서 제3신분이 국민의회를 선언했습니다."
          },
          {
            "title": "민중 행동",
            "text": "바스티유와 대공포가 8월 4일 밤의 특권 폐지 선언을 밀어붙였습니다."
          },
          {
            "title": "폐지와 상환",
            "text": "8월 법령은 인적 예속 등만 무상 폐지하고 나머지 영주적 부담은 되사게 했습니다."
          },
          {
            "title": "1791년과 1793년",
            "text": "르 샤플리에 법은 직업 결사를 금지했고, 1793년 법령은 남은 봉건적 부담을 배상 없이 없앴습니다."
          }
        ],
        "en": [
          {
            "title": "Finance and representation",
            "text": "At the Estates-General called amid war debt, the Third Estate declared the National Assembly."
          },
          {
            "title": "Popular action",
            "text": "The Bastille and the Great Fear pushed the Assembly to declare privilege abolished on 4 August."
          },
          {
            "title": "Abolition and redemption",
            "text": "The August decrees ended personal servitude and similar rights for free but made other seigneurial dues redeemable."
          },
          {
            "title": "1791 and 1793",
            "text": "The Le Chapelier law banned trade combinations; the 1793 decree abolished the remaining feudal dues without compensation."
          }
        ]
      },
      "diagram": {
        "kind": "flow",
        "ko": {
          "title": "재정 위기에서 봉건적 부담의 무상 폐지까지",
          "steps": [
            {
              "label": "1789년 봄 · 삼부회와 국민의회",
              "note": "새 과세 문제가 누가 국민을 대표하는가의 문제로 바뀌었습니다."
            },
            {
              "label": "1789년 7월 · 바스티유와 대공포",
              "note": "파리와 농촌의 행동이 의회에 압력을 가했습니다."
            },
            {
              "label": "1789년 8월 · 8월 법령",
              "note": "인적 예속은 무상 폐지하고 나머지 영주적 부담은 상환 대상으로 남겼습니다."
            },
            {
              "label": "1791년 6월 · 르 샤플리에 법",
              "note": "같은 직업의 조합과 가격 협약을 금지했습니다."
            },
            {
              "label": "1793년 7월 · 무상 폐지",
              "note": "남은 봉건적 부담을 배상 없이 없애고 증서를 불태우게 했습니다."
            }
          ]
        },
        "en": {
          "title": "From fiscal crisis to abolition of feudal dues without compensation",
          "steps": [
            {
              "label": "Spring 1789 · Estates-General and National Assembly",
              "note": "A question of new taxes became a question of who represented the nation."
            },
            {
              "label": "July 1789 · Bastille and Great Fear",
              "note": "Action in Paris and the countryside put pressure on the Assembly."
            },
            {
              "label": "August 1789 · August decrees",
              "note": "Personal servitude ended for free; other seigneurial dues were left to be redeemed."
            },
            {
              "label": "June 1791 · Le Chapelier law",
              "note": "Trade corporations and fixed-price agreements were banned."
            },
            {
              "label": "July 1793 · Abolition without compensation",
              "note": "The remaining feudal dues were abolished for free and the deeds burned."
            }
          ]
        }
      },
      "lessons": [
        {
          "id": "french-revolution-intro-ch06-basic",
          "level": "basic",
          "title": {
            "ko": "1789년, 구체제는 어떻게 무너지고 무엇이 남았을까?",
            "en": "How did the Old Regime fall in 1789, and what survived it?"
          },
          "questions": [
            {
              "id": "q1",
              "type": "multiple_choice",
              "points": 2,
              "prompt": {
                "ko": "프랑스 왕정의 미국 독립전쟁 참전은 1789년 삼부회 소집과 어떻게 이어졌을까요?",
                "en": "How did the French monarchy's entry into the American War of Independence lead to the calling of the Estates-General in 1789?"
              },
              "choices": {
                "ko": [
                  "영국을 견제하려 쓴 전쟁 비용이 채무를 늘렸고, 특권에 막힌 조세로는 메울 수 없어 새 과세 승인을 얻으려 삼부회를 소집했습니다.",
                  "미국 공화정에 공감한 왕정이 참전했고, 전쟁에서 이긴 여세를 몰아 개혁을 추진할 협력 기구로 삼부회를 소집했습니다.",
                  "참전 비용은 차입으로 해결되어 조세 문제가 없었고, 삼부회는 제3신분이 먼저 대표권을 요구하자 이에 응해 소집됐습니다."
                ],
                "en": [
                  "War spending to check Britain swelled the debt, a tax system blocked by privilege could not cover it, and the Estates-General was called to approve new taxes.",
                  "A monarchy sympathetic to the American republic entered the war and, riding its victory, called the Estates-General as a partner for reform.",
                  "Borrowing covered the war so there was no tax problem, and the Estates-General was called because the Third Estate first demanded representation."
                ]
              },
              "answer": 0,
              "choiceFeedback": {
                "ko": [
                  "참전 비용이 기존 채무와 불공평한 조세 구조에 겹쳐 재정 위기가 깊어졌고, 새 과세 승인이 삼부회 소집의 계기였습니다.",
                  "프랑스의 참전 동기는 공화정에 대한 공감보다 영국과의 경쟁이었고, 삼부회는 승리의 여세가 아니라 재정난 속에 소집됐습니다.",
                  "대표권 다툼은 삼부회가 열린 뒤 신분별 표결을 둘러싸고 터졌습니다. 소집의 출발점은 전쟁 채무와 과세 문제였습니다."
                ],
                "en": [
                  "War costs compounded old debts and an unequal tax system, and approving new taxes was the reason for calling the Estates-General.",
                  "France joined the war mainly out of rivalry with Britain, not republican sympathy, and the Estates-General was called in fiscal distress, not triumph.",
                  "The fight over representation broke out after the Estates-General met, over voting by order. The starting point was war debt and taxation."
                ]
              },
              "explanation": {
                "ko": "프랑스는 7년전쟁 뒤 영국을 견제하려고 1778년부터 미국 독립전쟁에 군사적·재정적으로 개입했습니다. 전쟁 비용은 이미 쌓인 채무 위에 더해졌고, 귀족과 성직자에게 유리한 조세 구조 때문에 개혁도 막혀 있었습니다. 왕정은 새 과세를 승인받으려고 1789년 삼부회를 소집했는데, 이 자리가 곧 누가 국민을 대표하는가를 다투는 무대가 됐습니다. 대표권 요구를 소집의 원인으로 보면 순서가 뒤집힙니다. 재정 위기가 삼부회를 불렀고, 대표권 투쟁은 그 삼부회 안에서 시작됐습니다.",
                "en": "After the Seven Years' War, France intervened in the American War of Independence from 1778 to check Britain. Its cost was added to existing debts, and a tax system favouring nobles and clergy blocked reform. The monarchy called the Estates-General in 1789 to approve new taxation, and that assembly then became the arena for the question of who represented the nation. Treating the demand for representation as the cause reverses the order: fiscal crisis summoned the Estates-General, and the struggle over representation began inside it."
              },
              "source": {
                "kind": "reference",
                "href": "https://heritage.bnf.fr/france-ameriques/france-dans-guerre-dindependance-americaine",
                "label": {
                  "ko": "프랑스 국립도서관, 미국 독립전쟁에 참전한 프랑스",
                  "en": "Bibliothèque nationale de France, France in the American War of Independence"
                }
              }
            },
            {
              "id": "q2",
              "type": "multiple_choice",
              "points": 2,
              "prompt": {
                "ko": "1789년 7월 바스티유 습격과 농촌의 대공포는 8월 4일 밤의 결정과 어떤 관계였을까요?",
                "en": "How were the storming of the Bastille and the rural Great Fear of July 1789 related to the decision of the night of 4 August?"
              },
              "choices": {
                "ko": [
                  "파리 군중의 무장 행동과 농민의 영주권 문서 공격이 압력이 되어, 국민의회가 봉건적 특권 폐지를 선언하게 했습니다.",
                  "국민의회가 8월 4일 특권 폐지를 먼저 선언하자, 이에 고무된 농민들이 뒤이어 대공포를 일으켜 영주권 문서를 불태웠습니다.",
                  "바스티유 습격은 파리의 감옥 문제에 그쳤고, 8월 4일 결정은 농촌 소요와 무관하게 의원들의 사상 토론에서 나왔습니다."
                ],
                "en": [
                  "Armed action by the Paris crowd and peasant attacks on seigneurial records put pressure on the National Assembly to declare feudal privilege abolished.",
                  "The Assembly declared privilege abolished on 4 August first, and peasants encouraged by it then launched the Great Fear and burned seigneurial records.",
                  "The Bastille concerned only a Paris prison, and the 4 August decision came from deputies' debate on ideas, unconnected to rural unrest."
                ]
              },
              "answer": 0,
              "choiceFeedback": {
                "ko": [
                  "대공포와 영주권 문서 공격은 8월 4일 이전에 일어났고, 국민의회가 봉건적 특권 폐지를 선언하는 배경이 됐습니다.",
                  "순서가 뒤집혔습니다. 농촌의 대공포는 7월 말에 번졌고, 8월 4일 밤의 선언은 그 뒤에 나온 대응이었습니다.",
                  "바스티유 습격은 군중이 의회와 왕의 대립에 개입한 정치적 사건이었고, 8월 4일 결정은 농촌 소요에 대한 대응이었습니다."
                ],
                "en": [
                  "The Great Fear and attacks on records came before 4 August and formed the background to the Assembly's declaration abolishing feudal privilege.",
                  "The order is reversed. The Great Fear spread in late July, and the declaration of the night of 4 August was a response that came after it.",
                  "The Bastille was a political event in which the crowd entered the conflict between Assembly and king, and 4 August answered rural unrest."
                ]
              },
              "explanation": {
                "ko": "제3신분 대표들이 국민의회를 선언하자 의회와 왕의 대립은 대표권의 문제로 커졌습니다. 7월 14일 바스티유 습격은 파리의 무장한 군중이 이 대립에 직접 개입할 수 있음을 보여주었고, 농촌에서는 대공포 속에 농민들이 영주의 권리를 적은 문서를 공격했습니다. 8월 4일 밤 국민의회의 특권 폐지 선언은 이 압력에 대한 응답이었습니다. 혁명의 시작은 의회의 선언이나 거리의 행동 하나만으로 설명되지 않습니다. 둘이 서로를 밀어붙였습니다.",
                "en": "Once Third Estate deputies declared the National Assembly, the conflict with the king became a question of representation. The storming of the Bastille on 14 July showed that the armed Paris crowd could intervene in that conflict directly, and in the countryside peasants in the Great Fear attacked documents recording seigneurial rights. The Assembly's declaration abolishing privilege on the night of 4 August answered this pressure. The start of the Revolution cannot be explained by the Assembly's declarations or by street action alone; each pushed the other."
              },
              "source": {
                "kind": "reference",
                "href": "https://www.assemblee-nationale.fr/dyn/histoire-et-patrimoine/revolution-francaise",
                "label": {
                  "ko": "프랑스 국민의회 혁명사, 국민의회에서 8월 4일까지",
                  "en": "French National Assembly history, from the National Assembly to 4 August"
                }
              }
            },
            {
              "id": "q3",
              "type": "multiple_choice",
              "points": 2,
              "prompt": {
                "ko": "8월 법령 제1조는 봉건 제도를 완전히 폐지한다고 선언한 뒤, 영주적 권리를 실제로 어떻게 처리했을까요?",
                "en": "After declaring the feudal regime entirely abolished, how did Article 1 of the August decree actually treat seigneurial rights?"
              },
              "choices": {
                "ko": [
                  "망모르트와 인적 예속에 속한 권리는 배상 없이 없애고, 나머지는 되살 수 있게 하되 상환될 때까지 계속 걷게 했습니다.",
                  "모든 봉건적·영주적 부담을 그날부로 배상 없이 폐지하고, 그 권리를 적은 증서를 공개적으로 불태우라고 명령했습니다.",
                  "배상 없이 사라진 권리는 없었고, 인적 예속까지 포함한 모든 영주적 부담을 농민이 값을 치르고 되사야 하는 권리로 바꾸었습니다."
                ],
                "en": [
                  "Rights tied to mainmorte and personal servitude ended without compensation; the rest became redeemable but were collected until bought out.",
                  "Every feudal and seigneurial due was abolished without compensation from that day, and the deeds recording those rights were ordered burned in public.",
                  "No right ended for free; every seigneurial due, personal servitude included, became something peasants had to pay to buy out."
                ]
              },
              "answer": 0,
              "choiceFeedback": {
                "ko": [
                  "제1조는 폐지와 매수를 나누고, 이 법령으로 폐지되지 않은 권리는 상환될 때까지 계속 징수한다고 명시합니다.",
                  "모든 부담의 무상 폐지와 증서 소각은 1793년 7월 17일 법령의 내용입니다. 1789년 법령은 상환을 남겼습니다.",
                  "인적 예속과 망모르트에 속한 권리, 그리고 제4조의 영주 재판권은 배상 없이 폐지됐으므로 모두가 상환 대상은 아니었습니다."
                ],
                "en": [
                  "Article 1 separates abolition from purchase and states that rights not abolished by the decree would be collected until redeemed.",
                  "Abolition of all dues for free and the burning of deeds belong to the decree of 17 July 1793. The 1789 decree kept redemption.",
                  "Rights tied to personal servitude and mainmorte, and seigneurial justice under Article 4, ended for free, so not everything became redeemable."
                ]
              },
              "explanation": {
                "ko": "제1조의 첫 문장만 읽으면 봉건제가 그날 끝난 것처럼 보입니다. 그러나 이어지는 문장은 권리를 둘로 나눕니다. 사람을 예속시키는 권리, 곧 망모르트와 인적 예속에 속한 것은 배상 없이 폐지했고, 그 밖의 권리는 매수할 수 있다고 선언하며 대가와 방식은 의회가 정한다고 했습니다. 그리고 이 법령으로 폐지되지 않은 권리는 상환될 때까지 계속 징수한다고 못박았습니다. 사람에 대한 지배는 끝냈지만 토지에 붙은 부담은 재산으로 보아 값을 치르게 한 셈입니다. 모든 부담을 배상 없이 없애고 증서를 태우게 한 것은 4년 뒤 1793년 법령입니다.",
                "en": "Read only the opening sentence of Article 1 and feudalism seems to end that day. The following sentence divides the rights in two. Rights that bound persons, those of mainmorte and personal servitude, were abolished without compensation; all others were declared redeemable, with price and method to be set by the Assembly. It added that rights not abolished by the decree would be collected until redeemed. Lordship over persons ended, but dues attached to land were treated as property that had to be paid for. Abolishing every due for free and burning the deeds came four years later, in the 1793 decree."
              },
              "source": {
                "kind": "reference",
                "href": "/commulingo/docs/france-privileges-property-and-labor-1789-1793#france-august-decrees-1789",
                "label": {
                  "ko": "특권 폐지에 관한 8월 법령 제1조",
                  "en": "August decree on the abolition of privilege, Article 1"
                }
              }
            },
            {
              "id": "q4",
              "type": "multiple_choice",
              "points": 2,
              "prompt": {
                "ko": "8월 법령이 폐지한다고 하면서도 대체 재원이 마련될 때까지 종전처럼 걷게 한 부담은 무엇이었을까요?",
                "en": "Which burden did the August decree declare abolished yet order collected as before until a substitute was found?"
              },
              "choices": {
                "ko": [
                  "십일조였습니다. 예배 경비와 빈민 구제 등을 다른 방식으로 충당할 방도가 마련될 때까지 계속 걷게 했습니다.",
                  "사냥과 비둘기장 독점권이었습니다. 영주가 상환금을 받을 때까지 독점을 유지하고 농민의 사냥을 계속 금지했습니다.",
                  "귀족과 성직자의 조세 특권이었습니다. 새 과세 방식이 정해질 다음 해까지 이들의 면세를 그대로 두었습니다."
                ],
                "en": [
                  "The tithe. It was to be collected until worship, poor relief, and similar costs could be funded another way.",
                  "Exclusive hunting and dovecote rights. Lords kept the monopoly until paid off, and peasants could not hunt meanwhile.",
                  "The tax exemptions of nobles and clergy. They stayed exempt until a new method of taxation was set the next year."
                ]
              },
              "answer": 0,
              "choiceFeedback": {
                "ko": [
                  "제5조는 십일조를 폐지하되, 대체 방도가 마련되고 옛 소유자가 그것을 누릴 때까지 종전 방식대로 징수하게 했습니다.",
                  "제2·3조는 비둘기장과 사냥 독점권을 곧바로 폐지하고, 소유자가 자기 땅에서 사냥감을 잡을 권리를 인정했습니다.",
                  "제9조는 조세 특권을 영구히 폐지하고, 현재 부과 연도의 마지막 6개월분부터 모든 시민에게 같은 방식으로 걷게 했습니다."
                ],
                "en": [
                  "Article 5 abolished the tithe but kept it collected as before until a replacement was in place and the former holders enjoyed it.",
                  "Articles 2 and 3 abolished dovecote and hunting monopolies at once and recognised owners' right to kill game on their own land.",
                  "Article 9 abolished tax privileges for good and applied equal collection to all citizens even for the last six months of the current tax year."
                ]
              },
              "explanation": {
                "ko": "8월 법령에는 즉시 사라진 특권과 폐지를 선언하고도 당분간 남은 부담이 섞여 있습니다. 영주 재판권(제4조), 사냥·비둘기장 독점권(제2·3조), 조세 특권(제9조)은 곧바로 없앴습니다. 조세 특권은 오히려 현재 부과 연도의 마지막 6개월분부터 모든 시민에게 같은 방식으로 걷게 했습니다. 반면 십일조는 교회의 예배와 빈민 구제, 학교와 병원 운영에 쓰이던 돈이었기 때문에, 제5조는 그 비용을 다른 방식으로 댈 방도가 생길 때까지 계속 걷게 했습니다. 영주 재판소의 관리들도 새 사법 질서가 생길 때까지 직무를 계속했습니다. 선언된 폐지와 실제 부담의 소멸 사이에는 이런 간격이 있었습니다.",
                "en": "The August decree mixes privileges that vanished at once with burdens declared abolished but kept for a time. Seigneurial justice (Art. 4), hunting and dovecote monopolies (Arts. 2–3), and tax privileges (Art. 9) ended immediately; equal taxation even applied to the last six months of the current tax year. The tithe, however, paid for worship, poor relief, schools, and hospitals, so Article 5 kept it collected until those costs could be met another way. Officers of seigneurial courts likewise stayed in post until a new judicial order existed. There was a gap between declared abolition and the actual end of the burden."
              },
              "source": {
                "kind": "reference",
                "href": "/commulingo/docs/france-privileges-property-and-labor-1789-1793#france-august-decrees-1789",
                "label": {
                  "ko": "특권 폐지에 관한 8월 법령 제2~5·9조",
                  "en": "August decree on the abolition of privilege, Articles 2–5 and 9"
                }
              }
            },
            {
              "id": "q5",
              "type": "multiple_choice",
              "points": 2,
              "prompt": {
                "ko": "1791년 르 샤플리에 법은 같은 직업에 속한 사람들의 어떤 행동을 금지했을까요?",
                "en": "What did the 1791 Le Chapelier law forbid people of the same trade to do?"
              },
              "choices": {
                "ko": [
                  "업주든 노동자든 함께 모여 대표를 뽑거나 공동 이익의 규정을 만들고, 정해진 가격으로만 일하자고 협약하는 일을 금지했습니다.",
                  "노동자의 임금 협약만 금지했고, 같은 업종 업주들이 조합을 유지하며 가격과 임금을 정하는 일은 자유 경쟁의 일부로 허용했습니다.",
                  "옛 동업 조합의 부활만 막았고, 조합 없이 노동자들이 임금 인상을 결의하는 협약은 인권선언의 결사 자유로 보호했습니다."
                ],
                "en": [
                  "It forbade masters and workers alike to meet to elect officers, make rules on their common interests, or agree to work only at fixed prices.",
                  "It banned only workers' wage agreements and let masters in a trade keep corporations that fixed prices and wages as free competition.",
                  "It blocked only the revival of old guilds and protected workers' agreements on wage rises without a guild as freedom of association."
                ]
              },
              "answer": 0,
              "choiceFeedback": {
                "ko": [
                  "제2조는 업주·가게 주인·노동자를 함께 적어 모임과 규정 제정을 금지했고, 제4조는 정해진 가격으로만 일하자는 협약을 무효로 했습니다.",
                  "제1·2조는 업주와 노동자를 가리지 않았습니다. 다만 제6~8조의 벌칙은 임금 협약과 노동자 집단을 구체적으로 겨냥합니다.",
                  "제4조는 가격 협약이 오히려 자유와 인권선언을 침해한다며 무효로 했고, 주동자의 능동시민 권리를 1년간 정지했습니다."
                ],
                "en": [
                  "Article 2 lists masters, shopkeepers, and workers together in banning meetings and rules, and Article 4 voids agreements to work only at fixed prices.",
                  "Articles 1 and 2 did not distinguish masters from workers, though the penalties in Articles 6–8 aim specifically at wage agreements and workers' crowds.",
                  "Article 4 voided price agreements as violating liberty and the Declaration of Rights, and suspended ringleaders' active-citizen rights for a year."
                ]
              },
              "explanation": {
                "ko": "8월 법령이 신분과 지역의 특권을 없앴다면, 르 샤플리에 법은 직업 단위의 결속을 같은 논리로 해체했습니다. 제1조는 같은 신분과 직업 시민의 조합 폐지를 헌법의 기본 토대라고 부르고, 제2조는 업주와 노동자 모두에게 모여서 대표를 뽑거나 공동 이익의 규정을 만드는 것을 금지했습니다. 제4조는 정해진 가격으로만 노동을 제공하자는 협약을 자유와 인권선언에 반한다며 무효로 하고, 주동자에게 500리브르 벌금과 1년간 능동시민 권리 정지를 부과했습니다. 여기서 자유는 개인이 각자 계약할 자유였습니다. 그래서 노동자들의 공동 임금 요구는 권리가 아니라 자유의 침해로 취급됐고, 외지 노동자나 낮은 임금을 받는 사람을 위협하는 모임(제6조)과 노동자 집단(제8조)에 대한 처벌은 이 점을 분명히 보여줍니다.",
                "en": "Where the August decree removed privileges of order and region, the Le Chapelier law dissolved trade-based solidarity by the same logic. Article 1 calls the abolition of trade corporations a foundation of the constitution, and Article 2 forbids masters and workers alike to elect officers or make rules on their common interests. Article 4 voids agreements to work only at fixed prices as contrary to liberty and the Declaration of Rights, fining ringleaders 500 livres and suspending their active-citizen rights for a year. Liberty here meant each individual's freedom to contract, so a collective wage demand counted as a violation of liberty, not a right; the penalties for threatening outside or lower-paid workers (Art. 6) and for workers' crowds (Art. 8) make this plain."
              },
              "source": {
                "kind": "reference",
                "href": "/commulingo/docs/france-privileges-property-and-labor-1789-1793#france-le-chapelier-law-1791",
                "label": {
                  "ko": "르 샤플리에 법 제1~8조(1791년 6월 14일)",
                  "en": "Le Chapelier law, Articles 1–8 (14 June 1791)"
                }
              }
            },
            {
              "id": "q6",
              "type": "multiple_choice",
              "points": 2,
              "prompt": {
                "ko": "1793년 7월 17일 국민공회 법령은 1789년 8월 법령이 남긴 부담을 어떻게 바꾸었을까요?",
                "en": "How did the Convention's decree of 17 July 1793 change the burdens left by the August 1789 decree?"
              },
              "choices": {
                "ko": [
                  "앞선 법령이 유지한 것까지 옛 영주에 대한 봉건적 부담을 배상 없이 없애고, 증서를 불태우되 순수한 토지 지대는 남겼습니다.",
                  "순수한 토지 지대와 소작료까지 모든 지대를 폐지해, 봉건적이든 아니든 토지와 관련된 모든 지불 의무를 한꺼번에 없앴습니다.",
                  "폐지된 권리의 시가를 국고에서 영주에게 보상하고, 증서는 보상액 산정을 위해 국가 문서고에 보존하게 했습니다."
                ],
                "en": [
                  "It abolished feudal dues owed to former lords without compensation, even those earlier decrees had kept, and burned the deeds but spared purely landed rents.",
                  "It abolished every rent, purely landed rents and leases included, ending all payments tied to land whether feudal or not.",
                  "It compensated lords from the treasury at market value for the abolished rights and kept the deeds in national archives to assess the sums."
                ]
              },
              "answer": 0,
              "choiceFeedback": {
                "ko": [
                  "제1조는 1792년 8월 25일 법령이 유지한 것까지 배상 없이 폐지했고, 제2조는 순수한 토지 지대를 제외했으며, 제6조는 증서를 불태우게 했습니다.",
                  "제2조가 순전히 토지에 관한 것이고 봉건적이 아닌 지대는 제외했습니다. 법령은 영주적 권리와 일반 토지 소유를 구별했습니다.",
                  "법령은 배상 없는 폐지였고, 폐지된 권리가 담긴 국유 재산 낙찰자에게도 배상 청구를 막았습니다. 증서는 보존이 아니라 소각 대상이었습니다."
                ],
                "en": [
                  "Article 1 abolished for free even what the decree of 25 August 1792 had kept, Article 2 excepted purely landed rents, and Article 6 ordered the deeds burned.",
                  "Article 2 excepted rents that were purely landed and not feudal. The decree separated seigneurial rights from ordinary landed property.",
                  "The abolition was without compensation, and even buyers of national property carrying such rights could claim none. Deeds were to be burned, not kept."
                ]
              },
              "explanation": {
                "ko": "1789년 법령은 인적 예속 등만 무상 폐지하고 나머지 영주적 부담은 상환 대상으로 두었습니다. 농민이 값을 치르지 않는 한 부담은 계속됐습니다. 1793년 7월 17일 국민공회 법령 제1조는 1792년 8월 25일 법령으로 유지된 것까지 포함해 옛 영주에 대한 모든 부과금과 봉건적 권리를 배상 없이 폐지했고, 제3조는 관련 소송을 소멸시켰으며, 제6조는 설정·승인 증서를 코뮌 문서고에 내게 해 시민들 앞에서 불태우게 했습니다. 그러나 이것을 토지 소유 자체에 대한 공격으로 읽으면 과장입니다. 제2조는 봉건적이지 않은 순수한 토지 지대를 예외로 두어, 영주의 권리와 일반적인 지주·차지인 관계를 구별했습니다.",
                "en": "The 1789 decree abolished personal servitude and similar rights for free but left other seigneurial dues to be redeemed; unless peasants paid, the burden continued. Article 1 of the Convention's decree of 17 July 1793 abolished without compensation every due and feudal right owed to former lords, including those kept by the decree of 25 August 1792; Article 3 extinguished related lawsuits; Article 6 required the title deeds to be deposited with the commune and burned before the citizens. Reading this as an attack on landed property itself goes too far. Article 2 excepted purely landed, non-feudal rents, separating lordly rights from ordinary relations between landowner and tenant."
              },
              "source": {
                "kind": "reference",
                "href": "/commulingo/docs/france-privileges-property-and-labor-1789-1793#france-feudal-dues-abolition-1793",
                "label": {
                  "ko": "봉건적 부담의 무상 폐지 법령 제1~12조(1793년 7월 17일)",
                  "en": "Decree abolishing feudal dues without compensation, Articles 1–12 (17 July 1793)"
                }
              }
            }
          ]
        }
      ]
    },
    {
      "id": "french-revolution-intro-ch02",
      "volumeNumber": 11,
      "chapterNumber": 2,
      "partNumber": 1,
      "partTitle": {
        "ko": "제1부 · 구체제의 붕괴와 새 헌정",
        "en": "Part I · The Old Regime collapses"
      },
      "title": {
        "ko": "권리 선언은 누구를 평등한 시민으로 불렀을까?",
        "en": "Whom did the declarations of rights call equal citizens?"
      },
      "sourceUrl": "/commulingo/docs/france-rights-and-emancipation-1789-1794",
      "summary": {
        "ko": "약 11분 · 1789년 권리 선언의 보편 원칙이 1791년 능동시민 제도, 구주의 여성 권리 선언, 생도맹그 해방 포고, 여성 결사 금지, 1794년 노예제 폐지에서 어떻게 좁혀지고 넓혀졌는지 비교합니다.",
        "en": "About 11 minutes · Compare how the universal principles of the 1789 Declaration were narrowed and widened by the 1791 active-citizen rules, Gouges's declaration of women's rights, the Saint-Domingue emancipation proclamation, the ban on women's clubs, and the 1794 abolition of slavery."
      },
      "learningFocus": {
        "ko": "제1조의 보편적 문장만 보고 모두가 같은 권리를 얻었다고 읽기 쉽습니다. 1789년 선언은 누가 시민인지 정하지 않았고, 구주의 선언은 채택된 법이 아니며, 해방 포고와 노예제 폐지 법령도 서로 범위와 조건이 달랐다는 점을 구별하세요.",
        "en": "It is easy to read Article 1's universal sentence as giving everyone the same rights. Note that the 1789 Declaration did not define who was a citizen, that Gouges's declaration was never adopted as law, and that the emancipation proclamation and the abolition decree differed in scope and conditions."
      },
      "conceptBrief": {
        "ko": [
          {
            "title": "보편적 권리와 법률의 몫",
            "items": [
              "1789년 선언 제1조는 인간이 자유롭고 평등한 권리를 지니고 태어난다고 하고, 제6조는 모든 시민이 직접 또는 대표자를 통해 법률 제정에 참여할 권리를 가진다고 합니다.",
              "그러나 선언은 누가 시민인지 정하지 않았고, 제4조처럼 자유의 한계를 법률로 정하게 했습니다. 실제 범위는 뒤따르는 헌법과 법률이 정했습니다. 제17조는 소유권을 불가침의 신성한 권리로 두었습니다."
            ]
          },
          {
            "title": "1791년 헌법의 선거 문턱",
            "items": [
              "1차 집회에 나가는 능동시민은 25세 이상, 최소 3일 치 노동 가치의 직접세 납부, 고용된 하인이 아닐 것, 국민방위대 명부 등재, 시민 선서 등의 조건을 갖춰야 했습니다.",
              "1차 집회가 뽑는 선거인은 여기에 더해 150~200일 치 노동 가치의 소득으로 평가된 재산을 갖거나 100~150일 치 가치의 주택을 빌리는 것 같은 더 높은 재산 조건을 갖춰야 했습니다. 여성은 능동시민이 될 수 없었습니다."
            ]
          },
          {
            "title": "배제에 맞선 요구와 조건부 해방",
            "items": [
              "올랭프 드 구주의 1791년 소책자는 1789년 선언의 서문과 17개 조항을 따라가며 여성 시민과 남성 시민을 함께 주어로 넣었습니다. 의회에 법령으로 제정하라고 촉구한 개인의 저술입니다.",
              "생도맹그에서는 1791년 봉기가 일어났고, 1793년 8월 29일 송토나의 포고는 북부 관구의 노예를 자유인이자 시민으로 선언하면서도 경작자를 옛 농장에 묶는 노동 규정을 달았습니다.",
              "1793년 10월 30일 국민공회는 아마르의 보고를 듣고 여성의 클럽과 민중 결사를 금지했고, 1794년 2월 4일에는 모든 식민지의 흑인 노예제를 폐지했습니다."
            ]
          },
          {
            "title": "근거 자료",
            "items": [
              "『프랑스 혁명 문헌집: 시민권과 해방』: 1789년 권리 선언, 구주의 『여성의 권리』, 송토나의 1793년 8월 29일 포고, 아마르 보고와 1793년 10월 30일 법령, 1794년 2월 4일 노예제 폐지 법령.",
              "『프랑스 혁명 문헌집: 헌법과 공화국』: 1791년 헌법 제3편 제1장 제2절, 1차 집회와 선거인 자격."
            ]
          }
        ],
        "en": [
          {
            "title": "Universal rights and the share left to law",
            "items": [
              "Article 1 of the 1789 Declaration says that men are born free and equal in rights, and Article 6 says that all citizens have the right to take part in making law, personally or through representatives.",
              "Yet the Declaration did not define who was a citizen, and, as in Article 4, it left the limits of liberty to be set by law. The actual scope was fixed by later constitutions and laws. Article 17 made property an inviolable and sacred right."
            ]
          },
          {
            "title": "The electoral threshold of the 1791 Constitution",
            "items": [
              "Active citizens, who attended the primary assemblies, had to be at least 25, pay direct tax worth at least three days' labour, not be hired servants, be enrolled in the National Guard, and have taken the civic oath.",
              "The electors chosen by the primary assemblies needed more: property assessed at an income worth 150 to 200 days' labour, or a rented dwelling worth 100 to 150 days, or similar. Women could not be active citizens."
            ]
          },
          {
            "title": "Demands against exclusion and conditional emancipation",
            "items": [
              "Olympe de Gouges's 1791 pamphlet follows the preamble and seventeen articles of the 1789 Declaration, adding women citizens alongside men as subjects. It is a private work urging the Assembly to enact it.",
              "Saint-Domingue saw an uprising in 1791; Sonthonax's proclamation of 29 August 1793 declared the slaves of the Northern Province free men and citizens, but attached labour rules binding cultivators to their former plantations.",
              "On 30 October 1793 the Convention, after Amar's report, banned women's clubs and popular societies, and on 4 February 1794 it abolished Black slavery in all the colonies."
            ]
          },
          {
            "title": "Sources",
            "items": [
              "French Revolution collection: citizenship and emancipation: the 1789 Declaration, Gouges's The Rights of Woman, Sonthonax's proclamation of 29 August 1793, Amar's report and the decree of 30 October 1793, and the decree of 4 February 1794 abolishing slavery.",
              "French Revolution collection: constitutions and the republic: the 1791 Constitution, Title III, Chapter I, Section II, primary assemblies and electors."
            ]
          }
        ]
      },
      "conceptMap": {
        "ko": [
          {
            "title": "보편 원칙",
            "text": "1789년 선언은 권리의 평등과 법 제정 참여를 내세웠지만 시민 자격은 법률에 맡겼습니다."
          },
          {
            "title": "선거 문턱",
            "text": "1791년 헌법은 나이·납세·신분 조건으로 능동시민과 선거인을 가려냈습니다."
          },
          {
            "title": "확대 요구",
            "text": "구주는 같은 조항에 여성을 넣어 정치적 참여를 요구했지만 1793년 여성 결사는 금지됐습니다."
          },
          {
            "title": "식민지의 해방",
            "text": "송토나의 조건부 해방 포고에 이어 1794년 국민공회가 노예제 폐지를 선언했습니다."
          }
        ],
        "en": [
          {
            "title": "Universal principle",
            "text": "The 1789 Declaration proclaimed equal rights and participation in lawmaking but left citizenship to law."
          },
          {
            "title": "Electoral threshold",
            "text": "The 1791 Constitution sorted active citizens and electors by age, tax, and status."
          },
          {
            "title": "Demand for extension",
            "text": "Gouges put women into the same articles to claim political participation, but women's clubs were banned in 1793."
          },
          {
            "title": "Emancipation in the colonies",
            "text": "Sonthonax's conditional emancipation was followed by the Convention's abolition of slavery in 1794."
          }
        ]
      },
      "diagram": {
        "kind": "contrast",
        "ko": {
          "title": "1789년 선언과 구주의 선언",
          "left": {
            "heading": "1789년 · 인간과 시민의 권리 선언",
            "rows": [
              "제헌국민의회가 채택한 선언입니다.",
              "시민의 법 제정 참여를 말하지만 시민 자격은 정하지 않습니다.",
              "소유권을 불가침의 신성한 권리로 둡니다."
            ]
          },
          "right": {
            "heading": "1791년 · 구주의 여성 권리 선언",
            "rows": [
              "의회에 법령으로 제정하라고 촉구한 개인의 저술입니다.",
              "여성 시민과 남성 시민을 함께 주어로 씁니다.",
              "재산이 두 성 모두에게 속한다고 고쳐 씁니다."
            ]
          }
        },
        "en": {
          "title": "The 1789 Declaration and Gouges's declaration",
          "left": {
            "heading": "1789 · Declaration of the Rights of Man and of the Citizen",
            "rows": [
              "Adopted by the National Constituent Assembly.",
              "Speaks of citizens making law but does not define who is a citizen.",
              "Makes property an inviolable and sacred right."
            ]
          },
          "right": {
            "heading": "1791 · Gouges's declaration of women's rights",
            "rows": [
              "A private work urging the Assembly to enact it as a decree.",
              "Uses women citizens and men citizens together as subjects.",
              "Rewrites property as belonging to both sexes."
            ]
          }
        }
      },
      "lessons": [
        {
          "id": "french-revolution-intro-ch02-basic",
          "level": "basic",
          "title": {
            "ko": "권리 선언은 누구를 평등한 시민으로 불렀을까?",
            "en": "Whom did the declarations of rights call equal citizens?"
          },
          "questions": [
            {
              "id": "q1",
              "type": "multiple_choice",
              "points": 2,
              "prompt": {
                "ko": "1789년 선언 제6조가 모든 시민의 법률 제정 참여를 말했는데도, 뒤이은 헌법이 선거 자격을 제한할 수 있었던 까닭은 무엇일까요?",
                "en": "Article 6 of the 1789 Declaration spoke of every citizen taking part in lawmaking. Why could a later constitution still restrict the right to vote?"
              },
              "choices": {
                "ko": [
                  "선언은 누가 시민이고 어떤 조건으로 권리를 행사하는지 정하지 않았고, 제4조처럼 권리의 한계를 법률에 맡겨 두었습니다.",
                  "제6조가 덕성과 재능에 더해 납세액에 따른 차별도 명시적으로 허용한다고 적었으므로, 헌법은 그 조건을 구체화했을 뿐입니다.",
                  "제17조가 소유권을 신성한 권리로 두면서 재산 소유자만 시민이라고 규정했으므로, 헌법은 그 정의를 그대로 옮겼습니다."
                ],
                "en": [
                  "The Declaration did not say who was a citizen or on what terms rights were exercised, and, as in Article 4, it left their limits to law.",
                  "Article 6 allowed distinctions by tax paid as well as by virtue and talent, so the constitution merely spelled out those conditions.",
                  "Article 17 made property sacred and defined only property owners as citizens, so the constitution simply copied that definition."
                ]
              },
              "answer": 0,
              "choiceFeedback": {
                "ko": [
                  "제1·6조는 원칙을 말하지만 시민 자격은 정의하지 않고, 제4조는 자연권 행사의 한계를 오직 법률로 정한다고 합니다.",
                  "제6조는 공직 취임에서 덕성과 재능 외에는 어떤 차별도 없다고 합니다. 납세액에 따른 차등은 선언이 아니라 1791년 헌법의 규정입니다.",
                  "제17조는 소유권의 박탈 조건을 정할 뿐 시민이 누구인지는 말하지 않습니다. 선거 자격의 재산 조건은 헌법이 따로 만들었습니다."
                ],
                "en": [
                  "Articles 1 and 6 state principles without defining citizenship, and Article 4 says the limits on natural rights can be set only by law.",
                  "Article 6 permits no distinction in access to office other than virtue and talent. Distinctions by tax come from the 1791 Constitution, not the Declaration.",
                  "Article 17 sets conditions for depriving someone of property but does not say who is a citizen. The constitution created the property thresholds."
                ]
              },
              "explanation": {
                "ko": "1789년 선언은 제1조에서 권리의 평등을, 제6조에서 모든 시민의 법률 제정 참여를 선언했습니다. 하지만 선언 어디에도 시민이 누구인지, 몇 살부터 어떤 조건으로 투표하는지는 적혀 있지 않습니다. 제4조는 자연권 행사의 한계를 오직 법률로 정한다고 해, 구체적인 범위를 뒤따르는 헌법과 법률에 넘겼습니다. 그래서 1791년 헌법은 선언을 첫머리에 두면서도 납세 조건이 붙은 능동시민 제도를 만들 수 있었습니다. 선언 자체가 재산에 따른 차등을 명문으로 정했다고 보는 것은 오독입니다. 차등은 선언의 빈칸을 채운 뒤의 법률에서 나왔습니다.",
                "en": "The 1789 Declaration proclaimed equal rights in Article 1 and every citizen's participation in lawmaking in Article 6. Nowhere does it say who a citizen is, from what age, or on what terms one votes. Article 4 says the limits on natural rights can be set only by law, handing the concrete scope to later constitutions and laws. That is how the 1791 Constitution could place the Declaration at its head and still create an active-citizen system with tax conditions. Reading a property distinction into the Declaration itself is a mistake; the distinction came from the laws that filled its blanks."
              },
              "source": {
                "kind": "reference",
                "href": "/commulingo/docs/france-rights-and-emancipation-1789-1794#france-rights-declaration-1789",
                "label": {
                  "ko": "1789년 인간과 시민의 권리 선언 제1·4·6·17조",
                  "en": "Declaration of the Rights of Man and of the Citizen (1789), Articles 1, 4, 6, and 17"
                }
              }
            },
            {
              "id": "q2",
              "type": "multiple_choice",
              "points": 2,
              "prompt": {
                "ko": "1791년 헌법에서 1차 집회에 나가는 능동시민의 자격과, 그 집회가 뽑는 선거인의 자격은 어떻게 달랐을까요?",
                "en": "Under the 1791 Constitution, how did the qualifications of active citizens, who attended the primary assemblies, differ from those of the electors those assemblies chose?"
              },
              "choices": {
                "ko": [
                  "능동시민은 25세 이상과 3일 치 노동 가치의 직접세 등을 갖추면 됐고, 선거인은 더 높은 재산 소득이나 임차 조건이 필요했습니다.",
                  "능동시민은 토지를 소유한 가장이어야 했고, 선거인은 토지 소유와 관계없이 능동시민 가운데 추첨으로 공평하게 뽑았습니다.",
                  "능동시민과 선거인은 납세 조건이 같았고, 둘의 차이는 선거인이 25세가 아니라 30세 이상이어야 한다는 나이 조건뿐이었습니다."
                ],
                "en": [
                  "Active citizens needed age 25 and direct tax worth three days' labour, among other things; electors also needed higher property income or rental thresholds.",
                  "Active citizens had to be landowning heads of household, while electors were drawn by lot from among active citizens regardless of landownership.",
                  "Active citizens and electors had the same tax conditions, and the only difference was that electors had to be 30 rather than 25."
                ]
              },
              "answer": 0,
              "choiceFeedback": {
                "ko": [
                  "제2조는 능동시민 조건으로 25세, 3일 치 노동 가치의 직접세, 하인이 아닐 것 등을 들고, 제7조는 선거인에게 재산 조건을 더합니다.",
                  "능동시민 조건에는 토지 소유가 없고 직접세 납부가 들어갑니다. 선거인은 추첨이 아니라 1차 집회가 100명당 1명꼴로 임명했습니다.",
                  "제7조가 선거인에게 요구한 것은 나이가 아니라 150~200일 치 노동 가치 소득의 재산이나 주택 임차 같은 추가 재산 조건입니다."
                ],
                "en": [
                  "Article 2 lists age 25, direct tax worth three days' labour, not being a servant, and more; Article 7 adds property conditions for electors.",
                  "Landownership is not among the active-citizen conditions; direct tax is. Electors were appointed by the primary assembly, about one per hundred, not by lot.",
                  "What Article 7 required of electors was not a higher age but extra property conditions, such as income worth 150 to 200 days' labour or a rented dwelling."
                ]
              },
              "explanation": {
                "ko": "1791년 헌법의 선거는 두 단계였습니다. 먼저 능동시민이 도시와 캉통의 1차 집회에 모여 선거인을 뽑고, 선거인이 의원을 뽑았습니다. 능동시민이 되려면 25세 이상이고, 최소 3일 치 노동 가치에 해당하는 직접세를 내고, 임금을 받는 하인이 아니며, 국민방위대 명부에 오르고 시민 선서를 해야 했습니다. 선거인은 여기에 더해 도시 규모에 따라 150~200일 치 노동 가치의 소득으로 평가된 재산을 갖거나, 100~150일 치 가치의 주택을 빌리거나, 농촌에서는 400일 치 가치의 땅을 부치는 등의 조건을 갖춰야 했습니다. 문턱은 토지 소유 하나가 아니라 납세액과 재산 소득으로 두 번 걸러졌습니다. 조문에 성별은 따로 적혀 있지 않지만 여성은 능동시민으로 인정되지 않았습니다.",
                "en": "Elections under the 1791 Constitution had two stages: active citizens met in primary assemblies of towns and cantons to choose electors, and the electors chose deputies. An active citizen had to be at least 25, pay direct tax worth at least three days' labour, not be a hired servant, be on the National Guard roll, and have taken the civic oath. Electors also needed, depending on town size, property assessed at an income worth 150 to 200 days' labour, or a rented dwelling worth 100 to 150 days, or in the countryside a farm worth 400 days. The threshold was not landownership alone; it filtered twice, by tax paid and by property income. The article does not mention sex, yet women were not recognised as active citizens."
              },
              "source": {
                "kind": "reference",
                "href": "/commulingo/docs/france-constitutions-and-republic-1791-1793#france-constitution-1791--sec-6",
                "label": {
                  "ko": "1791년 헌법 제3편 제1장 제2절, 1차 집회와 선거인 임명",
                  "en": "Constitution of 1791, Title III, Chapter I, Section II, primary assemblies and electors"
                }
              }
            },
            {
              "id": "q3",
              "type": "multiple_choice",
              "points": 2,
              "prompt": {
                "ko": "올랭프 드 구주의 1791년 「여성과 여성 시민의 권리 선언」은 1789년 선언을 어떻게 고쳐 썼을까요?",
                "en": "How did Olympe de Gouges's 1791 Declaration of the Rights of Woman and of the Female Citizen rewrite the 1789 Declaration?"
              },
              "choices": {
                "ko": [
                  "조항을 따라가며 여성 시민을 주어로 넣고, 국민을 여성과 남성의 결합으로 규정하며 다수가 협력하지 않은 헌법은 무효라고 덧붙였습니다.",
                  "1789년 선언 제6조가 이미 여성의 공직 취임을 명시했다고 보고, 조항은 그대로 둔 채 그 규정을 현실에서 제대로 집행하라고만 요구했습니다.",
                  "입법의회가 법령으로 채택해 효력을 얻었지만, 법 제정 참여와 공직 취임은 재산을 가진 여성에게만 인정하는 조건을 달았습니다."
                ],
                "en": [
                  "Following the articles, it put women citizens in as subjects, defined the nation as the union of woman and man, and voided any constitution most had not helped draft.",
                  "It held that Article 6 of 1789 already provided for women in public office, left the articles unchanged, and demanded only that they be enforced.",
                  "The Legislative Assembly enacted it as a decree, but it granted lawmaking and office only to women who owned property."
                ]
              },
              "answer": 0,
              "choiceFeedback": {
                "ko": [
                  "제3조는 국민이 여성과 남성의 결합일 뿐이라고 하고, 제16조는 개인의 다수가 작성에 협력하지 않은 헌법은 무효라고 덧붙입니다.",
                  "구주는 조항을 그대로 두지 않았습니다. 제6조의 주어를 모든 여성 시민과 남성 시민으로 바꿔 쓴 것이 바로 1789년 선언의 공백을 지적한 방식이었습니다.",
                  "이 글은 의회에 법령으로 제정하라고 촉구한 개인의 저술이며 채택되지 않았습니다. 제6조는 재산 조건 없이 동등한 참여를 요구합니다."
                ],
                "en": [
                  "Article 3 says the nation is nothing but the union of woman and man, and Article 16 voids a constitution most individuals did not help draft.",
                  "Gouges did not leave the articles as they were. Rewriting Article 6's subject as all women and men citizens was exactly how she exposed the gap in 1789.",
                  "It was a private work urging the Assembly to enact it and was never adopted. Its Article 6 demands equal participation without property conditions."
                ]
              },
              "explanation": {
                "ko": "구주는 1789년 선언의 서문과 17개 조항을 거의 같은 순서로 따라가면서 주어를 바꾸었습니다. 제1조는 여성이 자유롭게 태어나 권리에서 남성과 평등하다고 하고, 제6조는 모든 여성 시민과 남성 시민이 법 제정에 참여하고 모든 공직에 동등하게 임용될 수 있어야 한다고 합니다. 여기에 없던 문장도 더했습니다. 제3조는 국민이 여성과 남성의 결합일 뿐이라고 하고, 제10조는 여성이 처형대에 오를 수 있다면 연단에 오를 권리도 있어야 한다고 하며, 제16조는 국민 다수가 협력하지 않은 헌법은 무효라고 합니다. 표제 밑에 의회가 법령으로 제정할 것이라고 적었듯, 이 글은 채택된 법이 아니라 법이 되기를 요구한 개인의 저술입니다.",
                "en": "Gouges followed the preamble and seventeen articles of the 1789 Declaration in nearly the same order while changing the subject. Article 1 says woman is born free and remains equal to man in rights, and Article 6 says all women and men citizens must take part in making law and be equally eligible for every office. She also added sentences that 1789 lacked: Article 3 says the nation is nothing but the union of woman and man, Article 10 that if woman may mount the scaffold she must also be able to mount the rostrum, and Article 16 that a constitution most of the nation did not help draft is void. As the line under her title says, it was to be decreed by the Assembly: it was a private work demanding to become law, not an adopted law."
              },
              "source": {
                "kind": "reference",
                "href": "/commulingo/docs/france-rights-and-emancipation-1789-1794#gouges-rights-of-woman-1791--sec-5",
                "label": {
                  "ko": "구주, 『여성의 권리』 선언 서문과 제1~17조",
                  "en": "Gouges, The Rights of Woman, preamble and Articles 1–17"
                }
              }
            },
            {
              "id": "q4",
              "type": "multiple_choice",
              "points": 2,
              "prompt": {
                "ko": "1791년 봉기 이후 송토나가 1793년 8월 29일 생도맹그 북부에 내린 포고는 해방된 경작자에게 어떤 조건을 두었을까요?",
                "en": "After the 1791 uprising, what conditions did Sonthonax's proclamation of 29 August 1793 in northern Saint-Domingue place on freed cultivators?"
              },
              "choices": {
                "ko": [
                  "자유인이자 시민으로 선언하면서, 경작자는 옛 농장에 남아 1년 단위로 고용되고 수입의 3분의 1을 나누어 받게 했습니다.",
                  "노예제를 폐지하면서 옛 주인의 농장을 몰수해, 그 땅을 경작자 가족의 소유지로 나누어 주고 이동을 자유롭게 했습니다.",
                  "파리 국민공회가 이미 채택한 노예제 폐지 법령을 생도맹그 북부에 공포하고, 그 조항을 현지에서 그대로 집행하라는 명령이었습니다."
                ],
                "en": [
                  "It declared them free men and citizens, but cultivators stayed on former plantations, hired by the year, sharing one third of the revenue.",
                  "It abolished slavery, confiscated the former masters' plantations, divided the land among cultivators' families, and let them move freely.",
                  "It proclaimed in the north a slavery-abolition decree the Convention in Paris had already adopted and ordered its articles carried out as written."
                ]
              },
              "answer": 0,
              "choiceFeedback": {
                "ko": [
                  "제2조는 자유인 선언에 다음 조항의 제도를 따르게 했고, 제9·11·12조는 농장 잔류, 1년 고용, 수입 삼등분을 정합니다.",
                  "포고는 토지를 분배하지 않았습니다. 수입의 3분의 1은 토지 소유자 몫으로 남았고, 경작자는 허가 없이 농장을 옮길 수 없었습니다.",
                  "국민공회의 노예제 폐지 법령은 이 포고보다 뒤인 1794년 2월 4일에 나왔습니다. 송토나는 민사위원의 권한으로 포고했습니다."
                ],
                "en": [
                  "Article 2 subjected the declaration of freedom to the regime in the following articles; Articles 9, 11, and 12 set residence, yearly hire, and the three-way split.",
                  "The proclamation distributed no land. One third of revenue stayed with the landowner, and cultivators could not change plantations without permission.",
                  "The Convention's abolition decree came later, on 4 February 1794. Sonthonax issued his proclamation under his own powers as civil commissioner."
                ]
              },
              "explanation": {
                "ko": "1789년 선언 뒤에도 식민지 노예제는 남아 있었고, 생도맹그에서는 1791년 봉기가 일어났습니다. 1793년 8월 29일 민사위원 송토나는 북부 관구에서 노예를 해방하는 포고를 냈습니다. 제2조는 노예 상태의 흑인과 혼혈인을 프랑스 시민의 권리를 누리는 자유인으로 선언했지만, 뒤따르는 조항의 제도에 복종하게 했습니다. 옛 주인의 농장에 딸린 사람은 그곳에 남아 경작해야 했고(제9조), 1년 단위로 고용되어 치안판사의 허가 없이 농장을 옮길 수 없었으며(제11조), 수입은 세금을 뗀 뒤 소유자 몫, 경영비, 경작자 몫으로 삼등분됐습니다(제12조). 채찍형 폐지(제27조)와 배회자 체포(제33·34조)가 한 문서에 함께 있어, 해방과 노동 규율이 동시에 규정됐습니다. 토지 분배를 떠올리기 쉽지만 포고는 소유를 건드리지 않았습니다.",
                "en": "Colonial slavery survived the 1789 Declaration, and Saint-Domingue rose in 1791. On 29 August 1793 the civil commissioner Sonthonax issued an emancipation proclamation for the Northern Province. Article 2 declared enslaved Black and mixed-race people free with the rights of French citizens, but subject to the regime in the following articles. Those attached to a former master's plantation had to stay and cultivate it (Art. 9), were hired by the year and could not change plantations without a justice of the peace's permission (Art. 11), and revenue after taxes was split three ways among owner, operating costs, and cultivators (Art. 12). Abolition of the whip (Art. 27) and arrest of vagrants (Arts. 33–34) stand in the same document: emancipation and labour discipline were set out together. Land distribution is an easy assumption, but the proclamation left ownership untouched."
              },
              "source": {
                "kind": "reference",
                "href": "/commulingo/docs/france-rights-and-emancipation-1789-1794#sonthonax-emancipation-proclamation-1793",
                "label": {
                  "ko": "송토나, 생도맹그 노예해방 포고 제2·9·11·12조",
                  "en": "Sonthonax, Saint-Domingue emancipation proclamation, Articles 2, 9, 11, and 12"
                }
              }
            },
            {
              "id": "q5",
              "type": "multiple_choice",
              "points": 2,
              "prompt": {
                "ko": "1793년 10월 30일 아마르 보고와 국민공회 법령은 여성의 정치 활동을 어디까지 막았을까요?",
                "en": "How far did Amar's report and the Convention's decree of 30 October 1793 go in restricting women's political activity?"
              },
              "choices": {
                "ko": [
                  "여성의 정치적 권리 행사와 결사 심의를 모두 부정하고 여성 클럽과 민중 결사를 금지했지만, 토론 방청은 할 수 있다고 했습니다.",
                  "시장의 복장 강요 소요만 처벌했을 뿐, 여성이 정치적 권리를 행사할 수 있는가라는 일반 문제는 판단하지 않고 미뤄 두었습니다.",
                  "여성이 구역 회의와 민중 결사의 토론을 방청하는 것까지 금지하고, 가정 밖에서 여성이 모이는 모든 집회를 예외 없이 불법으로 만들었습니다."
                ],
                "en": [
                  "It denied women both the exercise of political rights and deliberation in societies and banned women's clubs, while saying they could still attend debates.",
                  "It punished only the market riot over forced dress and left undecided the general question of whether women could exercise political rights.",
                  "It barred women even from watching section meetings and popular-society debates, and outlawed every gathering of women outside the home."
                ]
              },
              "answer": 0,
              "choiceFeedback": {
                "ko": [
                  "위원회는 두 일반 질문에 모두 부정으로 답했고, 법령 제1조는 여성 클럽을 금지했습니다. 보고는 구역 심의와 결사 토론 참석은 허용했습니다.",
                  "아마르는 소요를 계기로 삼았지만, 여성이 정치적 권리를 행사할 수 있는가라는 일반 질문을 직접 제기하고 부정으로 결정했다고 보고했습니다.",
                  "보고는 여성이 구역의 심의와 민중 결사의 토론에 참석할 수 있다고 했습니다. 금지된 것은 여성이 결사를 이루어 적극적으로 심의하는 일이었습니다."
                ],
                "en": [
                  "The committee answered both general questions in the negative and Article 1 banned women's clubs, yet the report allowed attending section and society debates.",
                  "Amar used the riot as the occasion, but reported that the committee had posed the general question of women's political rights and answered no.",
                  "The report said women could attend section deliberations and society debates. What was banned was women forming societies and deliberating actively."
                ]
              },
              "explanation": {
                "ko": "아마르는 파리 이노상 시장에서 일부 여성이 다른 여성에게 바지와 빨간 모자를 강요해 벌어진 소요를 계기로 보고했습니다. 그러나 위원회는 소요 처리에 그치지 않고 두 일반 질문을 세웠습니다. 여성이 정치적 권리를 행사하고 정부 사무에 참여할 수 있는가, 여성이 정치 결사로 모여 심의할 수 있는가. 두 질문 모두 부정으로 답했고, 근거로 자연이 두 성에 서로 다른 임무를 맡겼다는 주장을 들었습니다. 법령 제1조는 어떤 명칭이든 여성의 클럽과 민중 결사를 금지했고, 제2조는 모든 민중 결사의 회합을 공개하게 했습니다. 다만 보고는 여성이 구역의 심의와 결사의 토론에 참석할 수 있다고 했습니다. 여성은 듣는 자리에 남고, 스스로 결사를 이루어 심의하는 자리에서는 밀려났습니다. 여성의 무능을 말하는 논증은 보고자의 주장입니다.",
                "en": "Amar's report took as its occasion a riot at the Innocents market in Paris, where some women tried to force others into trousers and red caps. The committee went beyond the riot and posed two general questions: can women exercise political rights and take part in government, and can women meet in political societies to deliberate? It answered both in the negative, arguing that nature had given the sexes different tasks. Article 1 of the decree banned women's clubs and popular societies under any name, and Article 2 required all popular-society meetings to be public. Yet the report said women could attend section deliberations and society debates. Women were left in the audience and pushed out of forming societies to deliberate for themselves. The case for women's incapacity is the reporter's claim."
              },
              "source": {
                "kind": "reference",
                "href": "/commulingo/docs/france-rights-and-emancipation-1789-1794#france-womens-clubs-ban-1793",
                "label": {
                  "ko": "아마르 보고와 여성 정치 결사 금지 법령(1793년 10월 30일)",
                  "en": "Amar's report and the decree banning women's political societies (30 October 1793)"
                }
              }
            },
            {
              "id": "q6",
              "type": "multiple_choice",
              "points": 2,
              "prompt": {
                "ko": "1794년 2월 4일 국민공회 법령을 1789년 선언, 송토나의 포고와 비교하면 무엇이 달라졌을까요?",
                "en": "Compared with the 1789 Declaration and Sonthonax's proclamation, what changed with the Convention's decree of 4 February 1794?"
              },
              "choices": {
                "ko": [
                  "모든 식민지의 흑인 노예제 폐지와 피부색 구별 없는 시민권을 선언했고, 집행에 필요한 조치는 공안위원회 보고로 넘겼습니다.",
                  "1789년 선언이 이미 식민지 노예제를 폐지했으므로, 1794년 법령은 그 조항을 식민지 주민에게 다시 알리는 공포 절차였습니다.",
                  "송토나 포고처럼 생도맹그 북부에만 적용됐고, 해방된 경작자를 옛 농장에 1년 단위로 묶는 노동 규정을 함께 담았습니다."
                ],
                "en": [
                  "It declared Black slavery abolished in all colonies and citizenship regardless of colour, and referred the measures for carrying it out to the Committee of Public Safety.",
                  "The 1789 Declaration had already abolished colonial slavery, so the 1794 decree was a formality re-announcing that article to colonial inhabitants.",
                  "Like Sonthonax's proclamation it applied only to northern Saint-Domingue and included labour rules binding freed cultivators to plantations by the year."
                ]
              },
              "answer": 0,
              "choiceFeedback": {
                "ko": [
                  "법령은 모든 식민지를 대상으로 했고, 피부색 구별 없이 식민지 주민이 헌법상 모든 권리를 누린다고 의결한 뒤 집행 조치를 위원회에 회부했습니다.",
                  "1789년 선언은 권리의 평등을 말했지만 노예제를 폐지하지 않았고, 그 뒤에도 식민지 노예제는 남아 있었습니다. 폐지 선언은 1794년이 처음입니다.",
                  "1794년 법령은 두 문단의 짧은 결의로 모든 식민지에 적용됐고, 노동 규정은 없습니다. 농장 잔류와 1년 고용은 송토나 포고의 조항입니다."
                ],
                "en": [
                  "The decree covered all colonies and resolved that colonial inhabitants of every colour enjoyed all constitutional rights, then referred execution to the committee.",
                  "The 1789 Declaration spoke of equal rights but did not abolish slavery, which continued in the colonies. The 1794 decree was the first abolition.",
                  "The 1794 decree was a two-paragraph resolution for all colonies with no labour rules. Staying on plantations and yearly hire came from Sonthonax."
                ]
              },
              "explanation": {
                "ko": "1789년 선언은 인간이 자유롭고 평등한 권리를 지닌다고 했지만 식민지 노예제를 끝내지 않았습니다. 해방은 생도맹그의 1791년 봉기와 1793년 송토나의 지역 포고를 거쳐, 1794년 2월 4일 국민공회 법령에서 공화국 전체의 결정이 됐습니다. 법령은 모든 식민지에서 흑인 노예제를 폐지하고, 피부색 구별 없이 식민지 주민을 헌법상 모든 권리를 누리는 프랑스 시민으로 선언했습니다. 송토나 포고와 달리 경작자를 묶는 노동 규정은 없지만, 집행 조치는 공안위원회에 보고하라고 회부했을 뿐입니다. 엮은이 주가 밝히듯 선언이 모든 식민지에서 같은 때 집행됐다는 뜻은 아닙니다. 법령의 선언과 현지의 집행은 따로 확인해야 합니다.",
                "en": "The 1789 Declaration said men have free and equal rights but did not end colonial slavery. Emancipation passed through the 1791 uprising in Saint-Domingue and Sonthonax's regional proclamation of 1793 before becoming a decision of the whole Republic in the Convention's decree of 4 February 1794. The decree abolished Black slavery in all colonies and declared colonial inhabitants of every colour French citizens with all constitutional rights. Unlike Sonthonax's proclamation it had no labour rules binding cultivators, but it only referred the measures for execution to the Committee of Public Safety. As the editor's note says, this does not mean it was carried out in every colony at the same time. The decree's declaration and its local execution must be checked separately."
              },
              "source": {
                "kind": "reference",
                "href": "/commulingo/docs/france-rights-and-emancipation-1789-1794#france-slavery-abolition-decree-1794",
                "label": {
                  "ko": "노예제 폐지 법령(1794년 2월 4일)",
                  "en": "Decree abolishing slavery (4 February 1794)"
                }
              }
            }
          ]
        }
      ]
    },
    {
      "id": "french-revolution-intro-ch01",
      "volumeNumber": 11,
      "chapterNumber": 3,
      "partNumber": 1,
      "partTitle": {
        "ko": "제1부 · 구체제의 붕괴와 새 헌정",
        "en": "Part I · The Old Regime collapses"
      },
      "title": {
        "ko": "1791년 입헌군주제는 도주한 왕을 어떻게 지키려 했을까?",
        "en": "How did the constitutional monarchy of 1791 try to protect a king who had fled?"
      },
      "sourceUrl": "/commulingo/docs/barnave-royal-inviolability-1791",
      "summary": {
        "ko": "약 11분 · 1791년 헌법이 국민주권과 왕의 행정권을 어떻게 결합했는지, 바렌 도주 뒤 바르나브가 왕의 불가침성과 혁명 종결을 어떤 논리로 옹호했는지, 완성된 헌법이 왕위 포기 사유를 어떻게 정했는지 배웁니다.",
        "en": "About 11 minutes · Learn how the 1791 Constitution combined national sovereignty with royal executive power, how Barnave defended royal inviolability and the end of the Revolution after the flight to Varennes, and how the finished constitution defined when a king was deemed to have abdicated."
      },
      "learningFocus": {
        "ko": "국민주권을 선언한 헌법이면 곧 공화정이라고, 바르나브는 그저 왕당파라고 읽기 쉽습니다. 1791년 헌법이 왕을 입법부와 함께 국민의 대표자로 두면서 거부권은 정지적 효력으로, 행정 행위는 대신의 부서로 묶었다는 점, 그리고 바르나브가 왕위 박탈을 헌법이 미리 정한 경우로만 한정하려 했다는 점을 확인하세요.",
        "en": "It is easy to read a constitution proclaiming national sovereignty as a republic, and Barnave as a plain royalist. Note that the 1791 Constitution made the king a representative of the nation alongside the legislature while limiting his veto to a suspensive one and tying his executive acts to ministerial countersignature, and that Barnave sought to confine deposition to cases the constitution fixed in advance."
      },
      "conceptBrief": {
        "ko": [
          {
            "title": "국민주권과 왕의 자리",
            "items": [
              "1791년 헌법 제3편은 주권이 국민에게 속하고 모든 권력은 국민에게서 나온다고 하면서, 입법부와 왕을 함께 국민의 대표자로 규정했습니다. 정부는 군주제이고 행정권은 왕에게 위임됐습니다.",
              "입법부는 상설 단원제이고 왕이 해산할 수 없었습니다. 왕은 법령에 동의를 거부할 수 있었지만 그 거부는 정지적 효력만 가졌고, 뒤이은 두 입법기가 같은 법령을 다시 내면 재가한 것으로 보았습니다.",
              "왕의 명령은 해당 장관의 부서가 없으면 집행될 수 없었고, 왕의 명령이 있어도 장관의 책임은 면제되지 않았습니다."
            ]
          },
          {
            "title": "바렌 도주와 바르나브의 변론",
            "items": [
              "1791년 6월 루이 16세 일가는 파리를 떠났다가 바렌에서 붙잡혔습니다. 제헌의회는 왕을 재판하거나 왕위를 박탈할지, 헌법의 틀 안에 둘지를 두고 논쟁했습니다.",
              "바르나브는 7월 15일 연설에서 넓은 나라의 안정과 자유가 세습 군주정에 달려 있고 그 토대가 행정권의 불가침성이라고 주장했습니다. 집행의 책임은 부서한 대신에게 있고, 정치적 범죄의 불가침성은 헌법이 정한 왕위 박탈로만 끝난다고 했습니다.",
              "그는 외국 열강에 대한 두려움이 이유라는 말을 부정하고, 끝나지 않는 혁명의 동요를 더 두려워한다고 했습니다. 자유의 길에서 다음 걸음은 왕정의 소멸, 평등의 길에서 다음 걸음은 재산에 대한 침해라고 경고했습니다."
            ]
          },
          {
            "title": "완성된 헌법의 왕위 포기 사유",
            "items": [
              "1791년 9월 3일 헌법은 왕이 맹세를 거부하거나 철회할 때, 군대의 선두에서 국민에게 무력을 지휘할 때, 왕국을 떠난 뒤 입법부의 요청에도 기한 안에 돌아오지 않을 때 왕위를 포기한 것으로 간주한다고 정했습니다.",
              "포기 뒤 왕은 시민이 되어 그 이후의 행위에 대해 재판받을 수 있었습니다. 이 입헌군주제는 오래가지 못해, 1792년 9월 21일 국민공회가 왕정 폐지를 의결했습니다."
            ]
          },
          {
            "title": "근거 자료",
            "items": [
              "『프랑스 혁명 문헌집: 헌법과 공화국』: 1791년 헌법 제3편 제1~4조, 제1장 제5조, 제2장 제1절·제4절, 제3장 제3절.",
              "바르나브, 「국왕의 불가침성, 권력 분립과 프랑스 혁명의 종결」, 1791년 7월 15일 제헌국민의회 연설."
            ]
          }
        ],
        "en": [
          {
            "title": "National sovereignty and the king's place",
            "items": [
              "Title III of the 1791 Constitution says sovereignty belongs to the nation and all powers come from it, and names the legislature and the king together as the nation's representatives. The government is monarchical, and executive power is delegated to the king.",
              "The legislature was permanent and single-chambered, and the king could not dissolve it. The king could refuse consent to decrees, but only with suspensive effect: if the next two legislatures presented the same decree again, he was deemed to have sanctioned it.",
              "No royal order could be executed without the countersignature of the minister concerned, and a royal order never relieved a minister of responsibility."
            ]
          },
          {
            "title": "The flight to Varennes and Barnave's defence",
            "items": [
              "In June 1791 Louis XVI and his family left Paris and were stopped at Varennes. The Constituent Assembly debated whether to try or depose the king, or keep him within the constitution.",
              "In his speech of 15 July Barnave argued that the stability and liberty of a large country depended on hereditary monarchy, founded on the inviolability of the executive. Responsibility for execution lay with the countersigning minister, and inviolability for political crimes ended only with deposition as defined by the constitution.",
              "He denied that fear of foreign powers was the motive and said he feared more the endless agitation of revolution. On the path of liberty, he warned, the next step was the end of monarchy; on the path of equality, an attack on property."
            ]
          },
          {
            "title": "Grounds for abdication in the finished constitution",
            "items": [
              "The Constitution of 3 September 1791 deemed the king to have abdicated if he refused or retracted his oath, led an army against the nation, or left the kingdom and failed to return within the period set by the legislature.",
              "After abdication he became a citizen and could be tried for later acts. This constitutional monarchy did not last: on 21 September 1792 the Convention voted to abolish the monarchy."
            ]
          },
          {
            "title": "Sources",
            "items": [
              "French Revolution collection: constitutions and the republic: the 1791 Constitution, Title III, Articles 1–4; Chapter I, Article 5; Chapter II, Sections I and IV; Chapter III, Section III.",
              "Barnave, “Royal inviolability, the separation of powers, and the ending of the French Revolution”, speech to the National Constituent Assembly, 15 July 1791."
            ]
          }
        ]
      },
      "conceptMap": {
        "ko": [
          {
            "title": "대표자로서의 왕",
            "text": "주권은 국민에게 두고, 왕은 입법부와 함께 국민의 대표자로 행정권을 맡았습니다."
          },
          {
            "title": "제한된 견제",
            "text": "왕은 정지적 거부권만 가졌고 입법부를 해산할 수 없었습니다."
          },
          {
            "title": "불가침과 부서",
            "text": "왕의 행정 행위는 대신의 부서가 있어야 효력이 있고, 책임은 대신이 졌습니다."
          },
          {
            "title": "혁명의 종결론",
            "text": "바르나브는 왕위 박탈을 거부하며 더 나아가면 왕정과 재산이 흔들린다고 경고했습니다."
          }
        ],
        "en": [
          {
            "title": "The king as representative",
            "text": "Sovereignty lay with the nation, and the king held executive power as its representative alongside the legislature."
          },
          {
            "title": "Limited checks",
            "text": "The king had only a suspensive veto and could not dissolve the legislature."
          },
          {
            "title": "Inviolability and countersignature",
            "text": "Royal executive acts needed a minister's countersignature, and the minister bore responsibility."
          },
          {
            "title": "Ending the Revolution",
            "text": "Barnave rejected deposition, warning that going further would shake monarchy and property."
          }
        ]
      },
      "diagram": {
        "kind": "contrast",
        "ko": {
          "title": "왕을 헌법에 묶는 두 장치",
          "left": {
            "heading": "책임은 대신에게",
            "rows": [
              "왕의 명령은 장관의 부서 없이는 집행될 수 없습니다.",
              "왕의 명령이 있어도 장관의 책임은 면제되지 않습니다.",
              "바르나브는 그래서 왕은 불가침이어도 행정에는 책임이 따른다고 했습니다."
            ]
          },
          "right": {
            "heading": "끝은 헌법이 정한 경우에만",
            "rows": [
              "맹세 거부·철회, 국민을 향한 무력 지휘, 귀국 요청 불응을 왕위 포기로 간주합니다.",
              "포기 뒤에는 시민으로서 그 이후의 행위에 대해 재판받습니다.",
              "바르나브는 도주가 그런 경우에 해당하지 않으므로 불가침성이 남는다고 했습니다."
            ]
          }
        },
        "en": {
          "title": "Two devices binding the king to the constitution",
          "left": {
            "heading": "Responsibility lies with ministers",
            "rows": [
              "A royal order cannot be executed without a minister's countersignature.",
              "A royal order never relieves a minister of responsibility.",
              "Hence Barnave said the king could be inviolable while administration remained accountable."
            ]
          },
          "right": {
            "heading": "The end comes only in defined cases",
            "rows": [
              "Refusing or retracting the oath, leading force against the nation, or failing to return count as abdication.",
              "After abdication the king is tried as a citizen for later acts.",
              "Barnave said the flight fitted no such case, so inviolability remained."
            ]
          }
        }
      },
      "lessons": [
        {
          "id": "french-revolution-intro-ch01-basic",
          "level": "basic",
          "title": {
            "ko": "1791년 입헌군주제는 도주한 왕을 어떻게 지키려 했을까?",
            "en": "How did the constitutional monarchy of 1791 try to protect a king who had fled?"
          },
          "questions": [
            {
              "id": "q1",
              "type": "multiple_choice",
              "points": 2,
              "prompt": {
                "ko": "1791년 헌법 제3편은 주권이 국민에게 속한다고 선언하면서 왕을 어떤 자리에 두었을까요?",
                "en": "Title III of the 1791 Constitution declared that sovereignty belongs to the nation. Where did it place the king?"
              },
              "choices": {
                "ko": [
                  "입법부와 함께 국민의 대표자로 규정하고, 군주제 정부의 행정권을 왕에게 위임해 책임 있는 장관들이 그 아래에서 행사하게 했습니다.",
                  "주권이 국민에게 있으므로 왕을 대표자에서 빼고, 입법부가 뽑은 집행위원회에 행정권을 맡기되 왕에게는 의전상의 칭호와 왕실비만 남겼습니다.",
                  "왕을 여전히 주권자로 두고, 국민에게는 왕이 필요할 때 소집하는 의회를 통해 새 조세에 동의할 권한만 돌려주었습니다."
                ],
                "en": [
                  "It named him a representative of the nation alongside the legislature and delegated executive power to him, exercised under him by responsible ministers.",
                  "Since sovereignty lay with the nation, it removed him from the representatives and gave executive power to a committee chosen by the legislature, leaving him a ceremonial title.",
                  "It kept the king as sovereign and returned to the nation only the power to consent to new taxes through an assembly he called when needed."
                ]
              },
              "answer": 0,
              "choiceFeedback": {
                "ko": [
                  "제3편 제2조는 대표자가 입법부와 왕이라고 하고, 제4조는 정부가 군주제이며 행정권이 왕에게 위임된다고 합니다.",
                  "집행위원회는 바렌 도주 뒤 거론된 대안이었고, 바르나브는 이를 약하고 분열된 기구라며 반대했습니다. 헌법은 왕에게 행정권을 맡겼습니다.",
                  "제3편 제1조는 주권이 국민에게 속하며 어떤 개인도 그 행사를 차지할 수 없다고 하고, 입법부는 상설 기구였습니다."
                ],
                "en": [
                  "Title III, Article 2 names the legislature and the king as representatives, and Article 4 says the government is monarchical with executive power delegated to the king.",
                  "An executive committee was an alternative raised after Varennes, which Barnave opposed as weak and divided. The constitution gave executive power to the king.",
                  "Title III, Article 1 says sovereignty belongs to the nation and no individual may seize its exercise, and the legislature was permanent."
                ]
              },
              "explanation": {
                "ko": "국민주권을 선언했다면 왕이 없는 공화정일 것이라고 생각하기 쉽습니다. 1791년 헌법은 다른 길을 택했습니다. 제3편 제1조는 주권이 단일하고 양도할 수 없으며 국민에게 속한다고 하고, 제2조는 국민이 위임을 통해서만 권력을 행사하며 그 대표자가 입법부와 왕이라고 합니다. 제4조는 정부를 군주제로 규정하고 행정권을 왕에게 위임하되, 책임 있는 장관들이 왕의 권위 아래 행사하게 했습니다. 왕은 주권자가 아니라 국민이 권력을 맡긴 대표자 가운데 하나가 됐습니다. 왕이 여전히 주권자로 남았다고 보는 것도, 왕이 이미 대표자에서 빠졌다고 보는 것도 이 구조를 놓칩니다.",
                "en": "It is tempting to think that proclaiming national sovereignty means a republic without a king. The 1791 Constitution took another path. Title III, Article 1 says sovereignty is one, inalienable, and belongs to the nation; Article 2 says the nation exercises power only by delegation and that its representatives are the legislature and the king. Article 4 defines the government as monarchical and delegates executive power to the king, exercised by responsible ministers under his authority. The king was no longer sovereign but one of the representatives to whom the nation entrusted power. Seeing him as still sovereign, or as already removed from the representatives, misses this structure."
              },
              "source": {
                "kind": "reference",
                "href": "/commulingo/docs/france-constitutions-and-republic-1791-1793#france-constitution-1791--sec-3",
                "label": {
                  "ko": "1791년 헌법 제3편 제1~4조",
                  "en": "Constitution of 1791, Title III, Articles 1–4"
                }
              }
            },
            {
              "id": "q2",
              "type": "multiple_choice",
              "points": 2,
              "prompt": {
                "ko": "1791년 헌법에서 왕이 입법부를 견제할 수 있었던 수단과 가질 수 없었던 수단은 무엇이었을까요?",
                "en": "Under the 1791 Constitution, what means did the king have to check the legislature, and what means was he denied?"
              },
              "choices": {
                "ko": [
                  "법령에 정지적 거부권은 있었지만 두 입법기가 같은 법령을 다시 내면 재가로 간주됐고, 입법부 해산권은 없었습니다.",
                  "법령을 거부할 권한은 없었지만, 입법부가 헌법을 어긴다고 판단하면 언제든 해산하고 새 선거를 명령할 수 있었습니다.",
                  "거부는 최종적이어서 거부된 법령은 다시 낼 수 없었고, 입법부는 왕이 해마다 소집할 때에만 모일 수 있었습니다."
                ],
                "en": [
                  "He could use a suspensive veto, but a decree presented again by the next two legislatures counted as sanctioned, and he had no power to dissolve the legislature.",
                  "He had no power to refuse decrees, but could dissolve the legislature and order new elections if he judged it had broken the constitution.",
                  "His refusal was final, so a rejected decree could never be presented again, and the legislature could meet only when he convened it each year."
                ]
              },
              "answer": 0,
              "choiceFeedback": {
                "ko": [
                  "제3장 제3절 제1·2조는 거부를 정지적 효력으로 한정하고, 제1장 제5조는 왕이 입법부를 해산할 수 없다고 명시합니다.",
                  "해산권이 거꾸로 적혔습니다. 제1장 제5조는 왕이 입법부를 해산할 수 없다고 하며, 왕에게 있던 것은 정지적 거부권입니다.",
                  "거부는 정지적이었고 같은 입법기에만 재제출이 막혔습니다. 입법부는 상설이며 갱신도 법률상 당연히 이루어졌습니다."
                ],
                "en": [
                  "Chapter III, Section III, Articles 1–2 limit the refusal to suspensive effect, and Chapter I, Article 5 states the king cannot dissolve the legislature.",
                  "The dissolution power is reversed. Chapter I, Article 5 says the king cannot dissolve the legislature; what he had was a suspensive veto.",
                  "The veto was suspensive and blocked resubmission only within the same legislature. The legislature was permanent and renewed itself by law."
                ]
              },
              "explanation": {
                "ko": "1791년 헌법은 왕에게 입법을 늦출 힘은 주되 멈출 힘은 주지 않았습니다. 입법부의 법령은 왕에게 제출되고 왕은 동의를 거부할 수 있었지만, 그 거부는 정지적 효력만 가졌습니다. 법령을 낸 입법기에 이어지는 두 입법기가 같은 법령을 같은 문안으로 다시 내면 왕이 재가한 것으로 보았습니다. 조세 법령과 입법부 내부 사항 등은 재가 없이 집행됐습니다. 반대로 입법부는 상설 단원제로 2년마다 법률상 당연히 갱신됐고, 왕은 이를 해산할 수 없었습니다. 바르나브가 왕의 불가침성을 옹호하며 든 근거도 바로 이 거부권이었습니다. 법을 거부하거나 유예하는 권한을 가진 왕은 입법부로부터 독립해야 한다는 논리였습니다.",
                "en": "The 1791 Constitution let the king delay legislation but not stop it. Decrees were presented to him and he could refuse consent, but only with suspensive effect: if the two legislatures following the one that passed a decree presented it again in the same words, he was deemed to have sanctioned it. Tax decrees and the legislature's internal matters, among others, took effect without sanction. The legislature, for its part, was a permanent single chamber renewed by law every two years, and the king could not dissolve it. This veto was also the ground Barnave gave for royal inviolability: a king with the power to refuse or suspend laws had to be independent of the legislature."
              },
              "source": {
                "kind": "reference",
                "href": "/commulingo/docs/france-constitutions-and-republic-1791-1793#france-constitution-1791--sec-18",
                "label": {
                  "ko": "1791년 헌법 제3편 제3장 제3절(국왕의 재가)과 제1장 제5조",
                  "en": "Constitution of 1791, Title III, Chapter III, Section III (royal sanction) and Chapter I, Article 5"
                }
              }
            },
            {
              "id": "q3",
              "type": "multiple_choice",
              "points": 2,
              "prompt": {
                "ko": "바르나브는 왕이 불가침인데도 행정의 잘못에는 책임을 물을 수 있다고 어떻게 설명했을까요?",
                "en": "How did Barnave explain that the king could be inviolable while wrongs in administration could still be answered for?"
              },
              "choices": {
                "ko": [
                  "왕은 대신의 부서 없이 행정 명령을 낼 수 없고 왕의 이름만 있는 행위는 무효이므로, 책임은 부서한 대신에게 있다고 했습니다.",
                  "대신이 왕의 서면 명령에 따라 행동했다면 책임을 면하고, 그 경우에는 왕이 의회에 출석해 직접 해명해야 한다고 했습니다.",
                  "불가침성은 법률 재가에만 적용되므로, 집행 과정에서 생긴 잘못에 대해서는 왕 개인이 일반 법원에서 형사 재판을 받는다고 했습니다."
                ],
                "en": [
                  "The king could issue no executive order without a minister's countersignature, and acts bearing only his name were void, so responsibility lay with the minister.",
                  "A minister who acted on the king's written order was relieved of responsibility, and in that case the king had to appear before the Assembly and answer himself.",
                  "Inviolability covered only the sanction of laws, so for wrongs in execution the king personally stood criminal trial in the ordinary courts."
                ]
              },
              "answer": 0,
              "choiceFeedback": {
                "ko": [
                  "바르나브는 부서가 필요하고 왕의 이름만 적힌 행정 행위는 무효이므로 책임이 권력의 대리인들에게만 있다고 말했습니다.",
                  "헌법 제4절 제6조는 구두나 서면으로 된 국왕의 명령이 어떤 경우에도 장관의 책임을 면제할 수 없다고 합니다.",
                  "바르나브는 왕이 집행을 직접 행사할 수 없게 한 것이 불가침성의 조건이라고 보았습니다. 왕을 집행 책임으로 재판하는 구조가 아닙니다."
                ],
                "en": [
                  "Barnave said countersignature was required and an executive act bearing only the king's name was void, so responsibility lay only with the agents of power.",
                  "Section IV, Article 6 of the constitution says a royal order, spoken or written, can never relieve a minister of responsibility.",
                  "Barnave held that barring the king from executing directly was the condition of inviolability. The system did not try the king for execution."
                ]
              },
              "explanation": {
                "ko": "바르나브의 논리는 거부권에서 출발합니다. 법을 거부하거나 유예하는 권한 때문에 왕은 입법부로부터 독립해야 하고, 그래서 인격적으로 공격받을 수 없어야 합니다. 그러나 집행에는 본성상 책임이 따라야 합니다. 그래서 헌법은 왕이 혼자서는 어떤 행정 명령도 낼 수 없게 하고 부서를 요구했습니다. 왕의 이름만 적힌 행정 행위는 무효이고, 그것을 집행한 사람이 유죄입니다. 헌법 제2장 제4절도 왕의 명령은 장관의 부서 없이 집행될 수 없고, 왕의 명령이 있어도 장관의 책임은 면제되지 않는다고 규정합니다. 불가침한 왕과 책임지는 대신이 짝을 이루는 구조입니다. 왕의 명령을 핑계로 대신이 빠져나갈 수 있다고 보면 이 장치 전체가 무너집니다.",
                "en": "Barnave's reasoning starts from the veto. Because the king could refuse or suspend laws, he had to be independent of the legislature and therefore personally immune from attack. Yet execution by its nature requires responsibility. So the constitution barred the king from issuing any executive order alone and required countersignature; an executive act bearing only his name was void, and whoever carried it out was guilty. Chapter II, Section IV of the constitution likewise says no royal order can be executed without a minister's countersignature and no royal order relieves a minister of responsibility. An inviolable king is paired with accountable ministers. If a minister could escape by pointing to the king's order, the whole device would collapse."
              },
              "source": {
                "kind": "reference",
                "href": "/commulingo/docs/barnave-royal-inviolability-1791#paragraph-12",
                "label": {
                  "ko": "바르나브 연설, 불가침성과 부서에 관한 대목",
                  "en": "Barnave's speech, passage on inviolability and countersignature"
                }
              }
            },
            {
              "id": "q4",
              "type": "multiple_choice",
              "points": 2,
              "prompt": {
                "ko": "1791년 6월 바렌에서 붙잡힌 왕을 두고, 바르나브는 어떤 법적 근거로 왕위 박탈을 거부했을까요?",
                "en": "With the king caught at Varennes in June 1791, on what legal ground did Barnave reject deposing him?"
              },
              "choices": {
                "ko": [
                  "정치적 범죄의 불가침성은 헌법이 미리 정한 박탈 사유로만 끝나는데, 도주는 그 사유에 해당하지 않는다고 했습니다.",
                  "영국 의회가 사정에 따라 왕을 폐위해 온 선례처럼, 프랑스 의회도 정세를 보아 왕을 그대로 두는 편이 낫다고 판단했습니다.",
                  "조사 결과 왕의 도주가 범죄가 아님이 입증되었으므로, 헌법 조항을 따질 필요 없이 왕위를 그대로 유지하면 된다고 했습니다."
                ],
                "en": [
                  "Inviolability for political crimes ended only with deposition in cases the constitution fixed in advance, and the flight was not one of them.",
                  "Following the English Parliament's practice of deposing kings as circumstances required, the French Assembly should judge the situation and keep the king.",
                  "The inquiry had proved the flight was no crime, so the throne could simply be kept without examining the constitution's articles."
                ]
              },
              "answer": 0,
              "choiceFeedback": {
                "ko": [
                  "바르나브는 왕위 박탈이 헌법이 정식으로 명시한 경우에만 일어나며, 왕의 행위는 그 경우에 해당하지 않는다고 결론지었습니다.",
                  "바르나브는 영국 방식을 따르지 않고 오히려 비판했습니다. 성문 헌법이 없는 영국은 법이 아니라 정파와 정세로 폐위를 정했다고 했습니다.",
                  "그는 도주가 범죄인지 검토하지 않았습니다. 설령 범죄라 해도 헌법이 정하지 않은 경우이므로 박탈은 일어나지 않는다고 했습니다."
                ],
                "en": [
                  "Barnave concluded that deposition occurred only in cases the constitution formally specified, and the king's acts did not fall under any of them.",
                  "Barnave did not follow the English model but criticised it: without a written constitution, England decided depositions by faction and circumstance.",
                  "He did not examine whether the flight was a crime. Even if it were, he said, it was not a case the constitution defined, so there was no deposition."
                ]
              },
              "explanation": {
                "ko": "1791년 6월 루이 16세 일가가 파리를 떠났다가 바렌에서 붙잡히자, 제헌의회는 왕을 재판하거나 왕위를 박탈할지 논쟁했습니다. 7월 15일 바르나브는 사실 문제는 앞선 연설자 뒤포르에게 맡기고 법의 문제를 다뤘습니다. 그에 따르면 정치적 범죄에 대한 불가침성의 끝은 왕위 박탈 하나뿐이고, 그 경우는 헌법이 미리 명시해야 합니다. 그렇지 않으면 독립해야 할 왕이 박탈을 판단하는 사람에게 의존하게 되기 때문입니다. 왕의 행위는 헌법이 정한 경우에 해당하지 않으므로, 그것이 범죄이더라도 박탈은 일어나지 않고 불가침성은 그대로 남는다는 결론입니다. 뷔조가 든 영국 선례에 대해서는, 성문 헌법이 없는 영국은 그때그때 정파와 정세로 폐위를 정했다며 프랑스가 택한 체계가 아니라고 반박했습니다.",
                "en": "When Louis XVI and his family left Paris in June 1791 and were stopped at Varennes, the Constituent Assembly debated whether to try or depose the king. On 15 July Barnave left the facts to the previous speaker, Duport, and took up the question of law. For him, inviolability for political crimes had only one end, deposition, and its cases had to be stated in the constitution in advance; otherwise a king meant to be independent would depend on whoever judged his deposition. Since the king's acts fell under no case the constitution defined, there was no deposition even if they were a crime, and inviolability remained whole. To Buzot's English precedent he replied that England, lacking a written constitution, settled depositions by faction and circumstance, which was not the system France had chosen."
              },
              "source": {
                "kind": "reference",
                "href": "/commulingo/docs/barnave-royal-inviolability-1791#paragraph-14",
                "label": {
                  "ko": "바르나브 연설, 왕위 박탈과 영국 선례에 관한 대목",
                  "en": "Barnave's speech, passage on deposition and the English precedent"
                }
              }
            },
            {
              "id": "q5",
              "type": "multiple_choice",
              "points": 2,
              "prompt": {
                "ko": "바르나브가 지금 혁명을 멈춰야 한다고 주장하며 가장 두려워한 것은 무엇이었을까요?",
                "en": "In arguing that the Revolution had to stop now, what did Barnave fear most?"
              },
              "choices": {
                "ko": [
                  "끝나지 않는 혁명의 동요였습니다. 자유의 길에서 다음 걸음은 왕정의 소멸, 평등의 길에서 다음 걸음은 재산 침해라고 했습니다.",
                  "외국 열강과 망명자들의 침공이었습니다. 이를 막을 힘이 없으므로 헌법 논쟁을 서둘러 끝내고 왕과 타협해야 한다고 했습니다.",
                  "민중의 공화정 요구였습니다. 왕정을 지키려면 선거권을 모든 성인 남성에게 넓혀 민중의 지지를 되찾아야 한다고 했습니다."
                ],
                "en": [
                  "The endless agitation of revolution. On the path of liberty the next step was the end of monarchy; on the path of equality, an attack on property.",
                  "Invasion by foreign powers and émigrés. Lacking strength to resist, France had to end the constitutional debate quickly and compromise with the king.",
                  "The people's demand for a republic. To save the monarchy, the vote had to be extended to every adult man to win back popular support."
                ]
              },
              "answer": 0,
              "choiceFeedback": {
                "ko": [
                  "바르나브는 혁명이 한 걸음 더 나아가면 자유의 노선에서는 왕정 소멸, 평등의 노선에서는 재산 침해가 뒤따른다고 경고했습니다.",
                  "그는 외국 열강에 대한 두려움이 이유라는 말을 악의적 거짓이라고 부정하고, 밖에서는 우리에게 해를 끼칠 수 없다고 했습니다.",
                  "그는 선거권 확대를 제안하지 않았습니다. 오히려 평등의 노선에서 더 나아가면 재산에 대한 침해가 온다고 경고했습니다."
                ],
                "en": [
                  "Barnave warned that one more step would bring the end of monarchy on the path of liberty and an attack on property on the path of equality.",
                  "He called the claim that fear of foreign powers was the motive a malicious falsehood, and said no harm could come from outside.",
                  "He proposed no extension of the vote. He warned instead that going further on the path of equality would lead to an attack on property."
                ]
              },
              "explanation": {
                "ko": "바르나브는 헌법 논증을 마친 뒤 혁명의 관점에서 말하겠다고 했습니다. 그는 외국 열강에 대한 두려움 때문에 위원회 안을 지지한다는 말을 거짓이라고 부정하고, 자신이 두려워하는 것은 우리의 약함이 아니라 혁명적 열병의 무한한 지속이라고 했습니다. 제헌의회는 전제 권력과 특권을 무너뜨리고 모든 사람을 시민법과 정치법 앞에서 평등하게 만들었으니, 여기서 한 걸음 더 나아가면 자유의 노선에서는 왕정의 소멸이, 평등의 노선에서는 재산에 대한 침해가 뒤따른다는 것입니다. 그는 8월 4일 밤 다음에 남은 것은 소유에 반대하는 법률뿐이라고도 했습니다. 왕을 지키는 일은 곧 재산 질서를 지키는 일이었습니다. 1792년 9월 21일 국민공회가 왕정 폐지를 의결하면서 그가 경고한 첫 걸음은 1년여 만에 현실이 됐습니다.",
                "en": "Having finished the constitutional argument, Barnave said he would speak from the standpoint of the Revolution. He denied as false the claim that fear of foreign powers drove support for the committees' proposal, and said what he feared was not weakness but the endless duration of revolutionary fever. The Constituent Assembly had overthrown despotic power and privilege and made everyone equal before civil and political law; one step further, on the path of liberty, meant the end of monarchy, and on the path of equality, an attack on property. He added that after the night of 4 August only a law against property remained. Protecting the king meant protecting the order of property. When the Convention voted to abolish the monarchy on 21 September 1792, the first step he had warned of came true barely a year later."
              },
              "source": {
                "kind": "reference",
                "href": "/commulingo/docs/barnave-royal-inviolability-1791#paragraph-20",
                "label": {
                  "ko": "바르나브 연설, 혁명 종결에 관한 대목",
                  "en": "Barnave's speech, passage on ending the Revolution"
                }
              }
            },
            {
              "id": "q6",
              "type": "multiple_choice",
              "points": 2,
              "prompt": {
                "ko": "1791년 9월 3일 완성된 헌법은 왕이 왕위를 포기한 것으로 간주되는 경우를 어떻게 정했을까요?",
                "en": "How did the finished Constitution of 3 September 1791 define the cases in which the king was deemed to have abdicated?"
              },
              "choices": {
                "ko": [
                  "맹세 거부·철회, 국민을 향한 무력 지휘, 출국 뒤 귀국 요청 불응을 미리 열거했고, 포기 뒤에는 시민으로서 재판받게 했습니다.",
                  "왕이 입법부의 허가 없이 수도를 떠나기만 해도 즉시 포기한 것으로 보고, 입법부가 곧바로 왕을 재판하게 했습니다.",
                  "포기 사유는 따로 적지 않고, 사태가 생길 때마다 입법부가 국민대표회의를 소집해 왕의 지위를 판단하게 했습니다."
                ],
                "en": [
                  "It listed in advance refusing or retracting the oath, leading force against the nation, and failing to return from abroad, and after abdication he was tried as a citizen.",
                  "Merely leaving the capital without the legislature's permission counted at once as abdication, and the legislature then tried the king straight away.",
                  "It listed no grounds, leaving the legislature to convene a national convention whenever events arose and judge the king's status."
                ]
              },
              "answer": 0,
              "choiceFeedback": {
                "ko": [
                  "제2장 제1절 제5~7조가 세 경우를 열거하고, 제8조는 포기 뒤 왕이 시민이 되어 그 이후의 행위로 재판받을 수 있다고 합니다.",
                  "제7조는 왕국을 떠난 경우에도 입법부의 요청과 두 달 이상의 기한을 두었습니다. 떠나는 것만으로 즉시 포기가 되지는 않았습니다.",
                  "사정에 따라 국민대표회의로 판단하는 방식은 바르나브가 영국식이라며 거부한 것입니다. 헌법은 경우를 미리 적었습니다."
                ],
                "en": [
                  "Chapter II, Section I, Articles 5–7 list the three cases, and Article 8 says that after abdication the king becomes a citizen, triable for later acts.",
                  "Article 7 required, even when the king left the kingdom, a summons from the legislature and a deadline of at least two months. Leaving alone was not abdication.",
                  "Judging case by case through a national convention was the English way Barnave rejected. The constitution stated the cases in advance."
                ]
              },
              "explanation": {
                "ko": "바르나브는 왕위 박탈이 헌법이 미리 명시한 경우에만 일어나야 한다고 주장했습니다. 1791년 9월 3일 완성된 헌법 제3편 제2장 제1절은 바로 그런 목록을 담았습니다. 입법부의 요청 뒤 한 달이 지나도록 맹세하지 않거나 맹세를 철회할 때(제5조), 군대의 선두에서 국민에게 무력을 지휘하거나 자기 이름으로 된 그런 기도에 반대하지 않을 때(제6조), 왕국을 떠난 뒤 입법부의 요청을 받고도 두 달 이상으로 정한 기한 안에 돌아오지 않을 때(제7조) 왕위를 포기한 것으로 간주합니다. 제8조는 포기 뒤 왕이 시민의 계급에 속해 그 이후의 행위로 재판받을 수 있다고 했습니다. 왕이 떠나기만 하면 곧바로 포기가 된다고 읽으면 틀립니다. 헌법은 요청과 기한이라는 절차를 거치게 했습니다. 불가침성은 이렇게 정해진 경우 안에서만 끝날 수 있었습니다.",
                "en": "Barnave argued that deposition should occur only in cases the constitution specified in advance. Title III, Chapter II, Section I of the finished Constitution of 3 September 1791 contains exactly such a list. The king was deemed to have abdicated if, a month after the legislature's request, he had not taken the oath or retracted it (Art. 5); if he led an army against the nation or failed to oppose formally such an attempt made in his name (Art. 6); or if, having left the kingdom, he did not return within a period of at least two months after the legislature's summons (Art. 7). Article 8 made him, after abdication, a member of the class of citizens, triable for later acts. Reading mere departure as immediate abdication is wrong: the constitution required a summons and a deadline. Inviolability could end only within these defined cases."
              },
              "source": {
                "kind": "reference",
                "href": "/commulingo/docs/france-constitutions-and-republic-1791-1793#france-constitution-1791--sec-11",
                "label": {
                  "ko": "1791년 헌법 제3편 제2장 제1절 제5~8조",
                  "en": "Constitution of 1791, Title III, Chapter II, Section I, Articles 5–8"
                }
              }
            }
          ]
        }
      ]
    },
    {
      "id": "french-revolution-intro-ch07",
      "volumeNumber": 11,
      "chapterNumber": 4,
      "partNumber": 2,
      "partTitle": {
        "ko": "제2부 · 공화정과 혁명정부",
        "en": "Part II · Republic and revolutionary government"
      },
      "title": {
        "ko": "전쟁은 어떻게 왕정을 무너뜨리고 공화정을 낳았을까?",
        "en": "How did war bring down the monarchy and give birth to a republic?"
      },
      "sourceUrl": "/commulingo/docs/france-war-debate-and-declarations-1791-1792",
      "summary": {
        "ko": "약 11분 · 필니츠 선언, 자코뱅 클럽의 개전 논쟁, 1792년 4월 선전포고, 브라운슈바이크 선언을 읽고, 패전과 8월 10일 봉기, 발미를 거쳐 9월 21일 왕정 폐지에 이르는 과정을 따라갑니다.",
        "en": "About 11 minutes · Read the Declaration of Pillnitz, the war debate at the Jacobin Club, the declaration of war of April 1792 and the Brunswick Manifesto, then follow defeat, the rising of 10 August and Valmy to the abolition of the monarchy on 21 September."
      },
      "learningFocus": {
        "ko": "혁명전쟁을 외국 군대가 먼저 쳐들어와 시작된 방어전으로만 읽지 마세요. 1792년 4월 전쟁을 선포한 쪽은 왕의 제안을 받은 입법의회였고, 로베스피에르가 반대한 것도 전쟁 일반이 아니라 궁정이 이끌 전쟁이었습니다.",
        "en": "Do not read the revolutionary war simply as a defence against a foreign army that struck first. In April 1792 it was the Legislative Assembly, on the king's proposal, that declared war, and what Robespierre opposed was not war in general but a war led by the court."
      },
      "conceptBrief": {
        "ko": [
          {
            "title": "국경 밖의 압력과 조건부 위협",
            "items": [
              "1791년 6월 바렌 도주로 왕이 새 헌정을 받아들였는지에 대한 불신이 커졌고, 망명귀족은 코블렌츠 등 국경 밖에서 왕정 복구를 꾀했습니다.",
              "1791년 8월 27일 필니츠 선언에서 레오폴트 2세와 프리드리히 빌헬름 2세는 프랑스 왕의 처지를 유럽 군주 공동의 관심사로 선언했지만, 다른 열강이 함께할 때에만 행동하고 그때까지는 군대를 대기시키겠다고 했습니다."
            ]
          },
          {
            "title": "자코뱅 클럽의 개전 논쟁",
            "items": [
              "브리소는 1791년 12월 16일, 코블렌츠를 파괴하면 국내의 음모와 신용 하락도 사라지고, 대국들은 재정난 때문에 개입하지 못하며, 전쟁이 집행부의 충성을 시험해 배신을 드러낼 것이라고 주장했습니다.",
              "로베스피에르는 1792년 1월 2일, 궁정과 대신들이 제안하고 이끌 전쟁을 경계하며 참된 코블렌츠는 프랑스 안에 있다고 했습니다. 무장한 선교사를 좋아하는 사람은 아무도 없다며, 군대가 들어가면 다른 민족이 프랑스 헌법을 받아들이리라는 기대도 비판했습니다."
            ]
          },
          {
            "title": "선전포고에서 8월 10일까지",
            "items": [
              "1792년 4월 20일 입법의회는 왕의 정식 제안을 심의해 헝가리·보헤미아 왕에게 전쟁을 선포하고, 이것은 민족 대 민족의 전쟁이 아니라 한 왕의 부당한 침략에 맞선 방어라고 선언했습니다.",
              "초기 패전과 루이 16세의 거부권 행사는 왕실이 혁명의 패배를 바란다는 의심을 키웠습니다. 7월 25일 브라운슈바이크 선언은 왕실이 해를 입으면 파리를 군사적으로 응징하겠다고 위협했고, 8월 10일 봉기 뒤 왕의 직무가 정지됐습니다."
            ]
          },
          {
            "title": "발미와 왕정 폐지",
            "items": [
              "1792년 9월 20일 발미에서 침공군의 진격이 멈췄고, 다음 날 새로 모인 국민공회는 프랑스에서 왕정이 폐지됨을 만장일치로 의결했습니다.",
              "이 결의는 왕정을 폐지하는 한 문장이었습니다. 루이 16세의 재판과 1793년 1월 처형은 그 뒤 따로 내려진 결정입니다."
            ]
          },
          {
            "title": "근거 자료",
            "items": [
              "『프랑스 혁명 문헌집: 개전 논쟁과 선언』: 필니츠 선언, 브리소 연설(1791년 12월 16일), 로베스피에르 연설(1792년 1월 2일), 4월 20일 선전포고, 7월 25일 브라운슈바이크 선언.",
              "『프랑스 혁명 문헌집: 헌법과 공화국』: 1792년 9월 21일 왕정 폐지 결의.",
              "프랑스 국민의회 혁명사 해설: 선전포고와 초기 패전, 왕의 거부권, 발미."
            ]
          }
        ],
        "en": [
          {
            "title": "Pressure from beyond the frontier and a conditional threat",
            "items": [
              "The flight to Varennes in June 1791 deepened distrust of whether the king had accepted the new constitution, while émigré nobles at Coblenz and elsewhere plotted a restoration from beyond the frontier.",
              "In the Declaration of Pillnitz of 27 August 1791, Leopold II and Frederick William II called the French king's situation a common concern of all European sovereigns, but said they would act only if the other powers joined them, and until then would merely keep their troops ready."
            ]
          },
          {
            "title": "The war debate at the Jacobin Club",
            "items": [
              "On 16 December 1791 Brissot argued that destroying Coblenz would also end plots and the collapse of credit at home, that the great powers were too short of money to intervene, and that war would test the executive's loyalty and expose any betrayal.",
              "On 2 January 1792 Robespierre warned against a war proposed and led by the court and ministers, and said the real Coblenz was inside France. Declaring that nobody loves armed missionaries, he also rejected the hope that other peoples would accept the French constitution once an army marched in."
            ]
          },
          {
            "title": "From the declaration of war to 10 August",
            "items": [
              "On 20 April 1792 the Legislative Assembly, deliberating on the king's formal proposal, declared war on the king of Hungary and Bohemia, stating that this was not a war of nation against nation but a defence against a king's unjust aggression.",
              "Early defeats and Louis XVI's use of his veto fed suspicion that the court wanted the Revolution to lose. On 25 July the Brunswick Manifesto threatened military vengeance on Paris if the royal family came to harm, and after the rising of 10 August the king was suspended from his functions."
            ]
          },
          {
            "title": "Valmy and the end of the monarchy",
            "items": [
              "On 20 September 1792 the invading army's advance was halted at Valmy, and the next day the newly assembled National Convention unanimously decreed that royalty was abolished in France.",
              "The decree was a single sentence abolishing the monarchy. Louis XVI's trial and his execution in January 1793 were separate decisions taken later."
            ]
          },
          {
            "title": "Sources",
            "items": [
              "French Revolution Documents: War Debates and Declarations: the Declaration of Pillnitz, Brissot's speech (16 December 1791), Robespierre's speech (2 January 1792), the declaration of war of 20 April, and the Brunswick Manifesto of 25 July.",
              "French Revolution Documents: Constitutions and the Republic: the decree abolishing the monarchy, 21 September 1792.",
              "French National Assembly history pages: the declaration of war and early defeats, the king's vetoes, and Valmy."
            ]
          }
        ]
      },
      "conceptMap": {
        "ko": [
          {
            "title": "필니츠",
            "text": "다른 열강이 함께할 때에만 움직이겠다는 조건부 위협이었습니다."
          },
          {
            "title": "브리소와 로베스피에르",
            "text": "적의 근거지가 코블렌츠인지 프랑스 안인지를 두고 갈라졌습니다."
          },
          {
            "title": "선전포고와 브라운슈바이크",
            "text": "둘 다 정복을 부정했지만 적과 인민의 경계를 정반대로 그었습니다."
          },
          {
            "title": "8월 10일에서 9월 21일로",
            "text": "왕의 직무 정지 뒤 발미 이튿날 국민공회가 왕정을 폐지했습니다."
          }
        ],
        "en": [
          {
            "title": "Pillnitz",
            "text": "A conditional threat to act only if the other powers joined."
          },
          {
            "title": "Brissot and Robespierre",
            "text": "They split over whether the enemy's base was Coblenz or inside France."
          },
          {
            "title": "Declaration of war and Brunswick",
            "text": "Both disclaimed conquest but drew the line between enemy and people in opposite places."
          },
          {
            "title": "From 10 August to 21 September",
            "text": "After the king's suspension, the Convention abolished the monarchy the day after Valmy."
          }
        ]
      },
      "diagram": {
        "kind": "flow",
        "ko": {
          "title": "개전 논쟁에서 왕정 폐지까지",
          "steps": [
            {
              "label": "1791년 8월 · 필니츠",
              "note": "외국 군주가 조건부로 공동 개입 의사를 밝혔습니다."
            },
            {
              "label": "1791년 12월~1792년 1월 · 자코뱅 논쟁",
              "note": "브리소는 개전을, 로베스피에르는 궁정이 이끄는 전쟁의 위험을 말했습니다."
            },
            {
              "label": "1792년 4월 20일 · 선전포고",
              "note": "왕의 제안을 받아 입법의회가 헝가리·보헤미아 왕에게 전쟁을 선포했습니다."
            },
            {
              "label": "7월 25일~8월 10일 · 위협과 봉기",
              "note": "브라운슈바이크 선언 뒤 봉기가 일어나 왕의 직무가 정지됐습니다."
            },
            {
              "label": "9월 20~21일 · 발미와 결의",
              "note": "침공을 멈춘 이튿날 국민공회가 왕정을 폐지했습니다."
            }
          ]
        },
        "en": {
          "title": "From the war debate to the end of the monarchy",
          "steps": [
            {
              "label": "August 1791 · Pillnitz",
              "note": "Foreign monarchs announced a conditional joint intervention."
            },
            {
              "label": "Dec 1791 to Jan 1792 · Jacobin debate",
              "note": "Brissot urged war; Robespierre warned of a war led by the court."
            },
            {
              "label": "20 April 1792 · Declaration of war",
              "note": "On the king's proposal the Assembly declared war on the king of Hungary and Bohemia."
            },
            {
              "label": "25 July to 10 August · Threat and rising",
              "note": "After the Brunswick Manifesto a rising led to the king's suspension."
            },
            {
              "label": "20–21 September · Valmy and the decree",
              "note": "The day after the invasion was halted, the Convention abolished the monarchy."
            }
          ]
        }
      },
      "lessons": [
        {
          "id": "french-revolution-intro-ch07-basic",
          "level": "basic",
          "title": {
            "ko": "전쟁은 어떻게 왕정을 무너뜨리고 공화정을 낳았을까?",
            "en": "How did war bring down the monarchy and give birth to a republic?"
          },
          "questions": [
            {
              "id": "q1",
              "type": "multiple_choice",
              "points": 2,
              "prompt": {
                "ko": "1791년 8월 필니츠 선언에서 두 군주는 프랑스 왕을 위해 언제, 어떻게 행동하겠다고 했을까요?",
                "en": "In the Declaration of Pillnitz of August 1791, when and how did the two monarchs say they would act for the French king?"
              },
              "choices": {
                "ko": [
                  "다른 열강이 함께할 때에만 공동으로 움직이고, 그때까지는 군대를 대기시키겠다고 했습니다.",
                  "저항하는 주민의 집을 불태우고, 왕실이 해를 입으면 파리를 군사적으로 응징하겠다고 했습니다.",
                  "망명한 왕족의 요청을 물리치고, 프랑스 왕의 처지는 프랑스 국민이 정할 일이라고 했습니다."
                ],
                "en": [
                  "They would move jointly only if the other powers joined them, and until then keep their troops ready.",
                  "They would burn the houses of inhabitants who resisted and take military vengeance on Paris if the royal family were harmed.",
                  "They rejected the exiled princes' appeal and said the French king's situation was for the French nation to settle."
                ]
              },
              "answer": 0,
              "choiceFeedback": {
                "ko": [
                  "선언은 열강이 협력하기를 기대한다고 한 뒤 \"그때, 그리고 그러한 경우에\" 행동하겠다고 했고, 그때까지는 군대가 움직일 수 있는 위치에 있게 하겠다고만 했습니다.",
                  "주민 처벌과 파리 응징의 위협은 1년 뒤인 1792년 7월 브라운슈바이크 선언에 나옵니다. 필니츠 단계에서는 군대가 아직 대기 상태였습니다.",
                  "선언은 무슈와 아르투아 백작의 바람을 들은 뒤 나온 것이고, 프랑스 왕의 처지를 유럽 모든 군주의 공동 관심사로 규정했습니다."
                ],
                "en": [
                  "The declaration hoped the powers would cooperate and said the monarchs would act \"then, and in that case\"; until then they would only keep their troops in a position to move.",
                  "Punishing inhabitants and threatening Paris belong to the Brunswick Manifesto of July 1792, a year later. At Pillnitz the troops were still only on standby.",
                  "The declaration was issued after hearing Monsieur and the Count of Artois, and it called the French king's situation a common concern of all European sovereigns."
                ]
              },
              "explanation": {
                "ko": "필니츠 선언의 무게는 조건절에 있습니다. 두 군주는 프랑스 왕이 군주정의 기초를 확고히 할 수 있게 하는 일을 유럽 군주 공동의 관심사로 선언했지만, 실제 행동은 다른 열강이 함께하는 경우로 미뤘습니다. 그래서 이 문서는 당장의 침공 명령이 아니었습니다. 그러나 바렌 도주 두 달 뒤 외국 군주가 프랑스 왕의 처지를 자기 일로 선언했다는 사실만으로도, 국내의 반혁명 의혹은 국제정치와 얽히기 시작했습니다. 파리를 응징하겠다는 구체적 위협은 전쟁이 이미 시작된 뒤의 브라운슈바이크 선언에서 나왔습니다.",
                "en": "The weight of the Declaration of Pillnitz lies in its conditional clause. The two monarchs declared that enabling the French king to secure the foundations of monarchical government was a common concern of European sovereigns, but deferred actual action until the other powers joined them. The text was therefore not an order to invade. Yet two months after Varennes, the mere fact that foreign monarchs declared the French king's plight their own business tied suspicion of counter-revolution at home to international politics. The concrete threat to punish Paris came later, in the Brunswick Manifesto, after war had already begun."
              },
              "source": {
                "kind": "reference",
                "href": "/commulingo/docs/france-war-debate-and-declarations-1791-1792#declaration-pillnitz-1791",
                "label": {
                  "ko": "필니츠 선언(1791년 8월 27일)",
                  "en": "Declaration of Pillnitz (27 August 1791)"
                }
              }
            },
            {
              "id": "q2",
              "type": "multiple_choice",
              "points": 2,
              "prompt": {
                "ko": "브리소는 1791년 12월 연설에서 망명귀족을 보호하는 독일 제후들을 쳐야 할 이유를 무엇이라고 했을까요?",
                "en": "In his speech of December 1791, what reasons did Brissot give for striking the German princes who sheltered the émigrés?"
              },
              "choices": {
                "ko": [
                  "국내의 음모와 신용 하락의 근원이 코블렌츠에 있고, 전쟁이 집행부의 충성을 시험할 것이라고 했습니다.",
                  "대국들이 곧 개입할 것이 확실하므로, 먼저 유럽 모든 군주정을 상대로 전면전을 벌여야 한다고 했습니다.",
                  "궁정이 전쟁을 원하는 것은 배신의 증거이므로, 궁정과 대신들을 먼저 처벌한 뒤 전쟁에 나서야 한다고 했습니다."
                ],
                "en": [
                  "The source of plots and falling credit at home was Coblenz, and war would test the executive's loyalty.",
                  "Since the great powers were sure to intervene soon, France should first wage general war on every monarchy in Europe.",
                  "The court's wish for war proved its betrayal, so the court and ministers should be punished before any war began."
                ]
              },
              "answer": 0,
              "choiceFeedback": {
                "ko": [
                  "브리소는 환율이 떨어지고 아시냐가 위협받는 원인을 코블렌츠에서 찾아야 한다고 했고, 집행부가 불성실하면 전쟁 속에서 스스로를 드러낼 것이라고 했습니다.",
                  "브리소는 오히려 황제를 비롯한 대국들이 재정난과 이해관계 때문에 무장 개입을 하지 못할 것이라고 보았고, 그래서 전쟁이 길어지지 않으리라 했습니다.",
                  "궁정의 전쟁 열의를 배신의 증거로 본 것은 반대편의 논리입니다. 브리소는 그 의심을 인정하면서도 전쟁이 배신을 드러낼 것이라고 답했습니다."
                ],
                "en": [
                  "Brissot said the fall of the exchange and the threat to the assignats had to be traced to Coblenz, and that an unfaithful executive would reveal itself in war.",
                  "Brissot argued the opposite: the emperor and the other great powers were held back by their finances and interests, so the war would not drag on.",
                  "Treating the court's zeal for war as proof of betrayal was his opponents' reasoning. Brissot accepted the suspicion but answered that war would expose any betrayal."
                ]
              },
              "explanation": {
                "ko": "브리소의 개전론은 국내 문제를 밖에서 풀 수 있다는 주장이었습니다. 그는 파벌과 음모, 귀족의 오만, 환율과 신용의 하락을 부채질하는 횃불이 코블렌츠의 망명귀족 근거지에서 온다고 보고 \"코블렌츠를 파괴하라\"고 했습니다. 궁정이 갑자기 전쟁을 원하는 것이 수상하다는 의심에는, 장교들에게는 천 개의 눈이 붙어 있어 그들의 배신이 위험하지 않고, 전쟁이 집행부를 최후의 시험에 부칠 것이라고 답했습니다. 대국이 개입하리라는 두려움도 그는 재정난을 들어 물리쳤습니다. 전면전을 원한 것도, 궁정 처벌을 먼저 요구한 것도 아니었습니다.",
                "en": "Brissot's case for war held that problems at home could be solved abroad. He traced the torch that lit faction, plots, noble arrogance and the fall of exchange and credit to the émigré base at Coblenz, and called for Coblenz to be destroyed. To the suspicion that the court's sudden wish for war was suspect, he replied that officers had a thousand eyes on them and could not betray dangerously, and that war would put the executive to its final test. He also dismissed fears of great-power intervention by pointing to their finances. He did not seek a general war, nor did he demand that the court be punished first."
              },
              "source": {
                "kind": "reference",
                "href": "/commulingo/docs/france-war-debate-and-declarations-1791-1792#brissot-war-speech-1791",
                "label": {
                  "ko": "브리소, 개전 찬성 연설(1791년 12월 16일)",
                  "en": "Brissot, speech for war (16 December 1791)"
                }
              }
            },
            {
              "id": "q3",
              "type": "multiple_choice",
              "points": 2,
              "prompt": {
                "ko": "로베스피에르가 \"무장한 선교사를 좋아하는 사람은 아무도 없다\"고 말했을 때 겨냥한 기대는 무엇이었을까요?",
                "en": "When Robespierre said that \"nobody loves armed missionaries\", which expectation was he attacking?"
              },
              "choices": {
                "ko": [
                  "군대가 다른 나라에 들어가기만 하면 그 나라 인민이 프랑스의 법과 헌법을 반기리라는 기대였습니다.",
                  "혁명이 어떤 경우에도 국경 밖으로 퍼지지 않고 프랑스 안에만 머물리라는 기대였습니다.",
                  "망명귀족을 궐석 재판하고 재산을 몰수하면 전쟁 없이도 코블렌츠가 무너지리라는 기대였습니다."
                ],
                "en": [
                  "The hope that once an army entered another country its people would welcome the French constitution.",
                  "The hope that the Revolution would never spread beyond France's borders under any circumstances.",
                  "The hope that trying the émigrés in absentia and seizing their property would bring Coblenz down without war."
                ]
              },
              "answer": 0,
              "choiceFeedback": {
                "ko": [
                  "그는 한 민족이 무장한 채 다른 민족의 땅에 들어가 자기 법과 헌법을 받아들이게 할 수 있다는 생각을 정치가가 떠올릴 수 있는 가장 터무니없는 생각이라고 했습니다.",
                  "로베스피에르는 자유의 지배를 넓히는 전쟁을 자신도 브리소 못지않게 좋아한다고 했습니다. 문제 삼은 것은 지금 누가, 어떤 의도로 전쟁을 이끄느냐였습니다.",
                  "망명자 재판과 재산 몰수는 로베스피에르가 전쟁 대신 가능한 수단으로 인정한 조치였습니다. 그가 비판한 기대가 아니라 그가 내놓은 대안 쪽에 가깝습니다."
                ],
                "en": [
                  "He called the idea that one people could march armed into another's land and make it accept its laws and constitution the most extravagant notion a politician could conceive.",
                  "Robespierre said he loved a war to extend the reign of liberty as much as Brissot did. His question was who would lead the war now, and with what intent.",
                  "Trying the émigrés and seizing their property were measures Robespierre accepted as alternatives to war. They were closer to his own proposal than to the hope he attacked."
                ]
              },
              "explanation": {
                "ko": "로베스피에르는 브리소 쪽이 그리는 장면, 곧 장군은 헌법의 선교사가 되고 외국 군주의 앞잡이들이 프랑스군을 마중하러 달려오는 모습을 비꼬았습니다. 무장한 외국 군대는 해방자로 반겨지기보다 적으로 물리쳐질 것이라는 반론입니다. 그의 더 큰 논점은 전쟁의 방향이었습니다. 참된 코블렌츠는 프랑스 안에 있고, 망명자를 보호해 온 궁정과 대신들이 이 전쟁을 이끈다는 것입니다. 그래서 그는 재정 질서를 바로잡고 민중과 국민위병을 무장시키는 일을 먼저 요구했습니다. 그를 모든 전쟁에 반대한 평화주의자로 읽으면 이 논점이 사라집니다.",
                "en": "Robespierre mocked the scene Brissot's side imagined, in which generals became missionaries of the constitution and the agents of foreign princes ran out to greet the French army. His rebuttal was that an armed foreign force would be repelled as an enemy rather than welcomed as a liberator. His larger point concerned the direction of the war: the real Coblenz was inside France, and the court and ministers who had protected the émigrés would conduct this war. He therefore demanded that finances be put in order and the people and National Guards be armed first. Reading him as a pacifist opposed to all war loses this point."
              },
              "source": {
                "kind": "reference",
                "href": "/commulingo/docs/france-war-debate-and-declarations-1791-1792#robespierre-war-speech-1792-01-02",
                "label": {
                  "ko": "로베스피에르, 전쟁에 관한 연설(1792년 1월 2일)",
                  "en": "Robespierre, speech on the war (2 January 1792)"
                }
              }
            },
            {
              "id": "q4",
              "type": "multiple_choice",
              "points": 2,
              "prompt": {
                "ko": "1792년 4월 20일 전쟁은 누구의 발의로, 누구를 상대로 선포되었을까요?",
                "en": "On whose initiative, and against whom, was war declared on 20 April 1792?"
              },
              "choices": {
                "ko": [
                  "입법의회가 왕의 정식 제안을 심의해 헝가리·보헤미아 왕에게 전쟁을 선포했습니다.",
                  "오스트리아군이 먼저 국경을 넘자 입법의회가 오스트리아 인민 전체에 선포했습니다.",
                  "왕의 직무를 정지한 국민공회가 공화국의 이름으로 유럽의 모든 군주에게 선포했습니다."
                ],
                "en": [
                  "The Legislative Assembly, deliberating on the king's formal proposal, declared it on the king of Hungary and Bohemia.",
                  "After Austrian troops crossed the frontier first, the Legislative Assembly declared it on the whole Austrian people.",
                  "The National Convention, having suspended the king, declared it on every monarch in Europe in the Republic's name."
                ]
              },
              "answer": 0,
              "choiceFeedback": {
                "ko": [
                  "선전포고문은 \"왕의 정식 제안을 심의하면서\"로 시작해 \"헝가리와 보헤미아의 왕에 대한 전쟁을 의결한다\"로 끝납니다.",
                  "선전포고문이 든 이유는 빈 궁정의 망명자 보호와 적대적 준비, 각서에 대한 거부였지 선제 침공이 아니었습니다. 또한 민족 대 민족의 전쟁이 아니라고 못 박았습니다.",
                  "국민공회는 1792년 9월에야 모였고 왕의 직무 정지도 8월 10일 뒤의 일입니다. 4월에는 입헌군주정 아래의 입법의회와 왕이 전쟁을 결정했습니다."
                ],
                "en": [
                  "The declaration opens by \"deliberating on the formal proposal of the king\" and ends by decreeing \"war against the king of Hungary and Bohemia\".",
                  "The grievances listed were Vienna's protection of émigrés, its hostile preparations and its refusal of French notes, not a prior invasion. The text also insisted this was not a war of nation against nation.",
                  "The Convention met only in September 1792, and the king was suspended after 10 August. In April the war was decided by the king and the Legislative Assembly under constitutional monarchy."
                ]
              },
              "explanation": {
                "ko": "혁명전쟁은 외국 군대가 먼저 국경을 넘어와 시작된 전쟁이 아니었습니다. 1792년 4월 20일 입법의회는 빈 궁정이 반역한 프랑스인들을 보호하고 열강의 공동 행동을 부추겼으며, 병력을 평화 상태로 되돌리자는 제안을 거부했다는 이유를 들고, 왕의 정식 제안에 따라 헝가리·보헤미아 왕에게 전쟁을 선포했습니다. 동시에 헌법의 정복 전쟁 포기 원칙을 내세워 이것은 한 왕의 부당한 침략에 맞선 방어라고 규정하고, 적의 편을 떠나 오는 외국인을 받아들이겠다고 했습니다. 개전을 결정한 것은 아직 입헌군주정의 기관들이었고, 이 전쟁이 곧 왕의 운명을 바꾸게 됩니다.",
                "en": "The revolutionary war did not begin with a foreign army crossing the frontier first. On 20 April 1792 the Legislative Assembly, on the king's formal proposal, declared war on the king of Hungary and Bohemia, citing Vienna's protection of rebel Frenchmen, its encouragement of a concert of powers, and its refusal to return troops to a peace footing. Invoking the constitution's renunciation of wars of conquest, it defined the war as a defence against a king's unjust aggression and promised to welcome foreigners who left the enemy's cause. The war was decided by the institutions of constitutional monarchy, and it was this war that would soon change the king's fate."
              },
              "source": {
                "kind": "reference",
                "href": "/commulingo/docs/france-war-debate-and-declarations-1791-1792#france-war-declaration-austria-1792",
                "label": {
                  "ko": "헝가리·보헤미아 왕에 대한 선전포고(1792년 4월 20일)",
                  "en": "Declaration of war on the king of Hungary and Bohemia (20 April 1792)"
                }
              }
            },
            {
              "id": "q5",
              "type": "multiple_choice",
              "points": 2,
              "prompt": {
                "ko": "4월 선전포고와 7월 브라운슈바이크 선언을 나란히 놓으면, 두 문서는 적과 보호할 사람을 각각 어떻게 갈랐을까요?",
                "en": "Set side by side, how did the April declaration of war and the July Brunswick Manifesto each divide enemies from those to be protected?"
              },
              "choices": {
                "ko": [
                  "선전포고는 한 왕과 그에 결탁한 자들을 적으로 삼았고, 선언은 왕에게 복종하는 주민만 보호하겠다고 했습니다.",
                  "선전포고는 오스트리아 인민 전체를 적으로 삼았고, 선언은 국왕을 포함해 무기를 든 모든 프랑스인을 적으로 삼았습니다.",
                  "두 문서 모두 상대 영토의 정복을 전쟁 목적으로 밝혔고, 점령지 주민의 재산을 군대 비용으로 거두겠다고 했습니다."
                ],
                "en": [
                  "The declaration targeted a king and those in league with him; the manifesto protected only inhabitants who obeyed their king.",
                  "The declaration targeted the whole Austrian people; the manifesto treated every armed Frenchman, the king included, as an enemy.",
                  "Both texts announced conquest as their war aim and said they would take occupied inhabitants' property to pay for their armies."
                ]
              },
              "answer": 0,
              "choiceFeedback": {
                "ko": [
                  "선전포고는 형제와 진정한 적을 혼동하지 않겠다고 했고, 브라운슈바이크 선언은 왕에게 복종하는 도시와 주민은 보호하되 저항하는 국민위병과 주민은 처벌하겠다고 했습니다.",
                  "선전포고는 민족 대 민족의 전쟁이 아니라고 선언했고, 브라운슈바이크 선언은 왕과 왕실을 적이 아니라 포로 상태에서 해방할 대상으로 내세웠습니다.",
                  "두 문서는 모두 정복을 원하지 않는다고 밝혔습니다. 선전포고는 재산을 아껴 보전하겠다고, 브라운슈바이크 선언은 복종하는 주민의 재산을 보호하겠다고 했습니다."
                ],
                "en": [
                  "The declaration promised never to confuse brothers with the true enemy; the Brunswick Manifesto protected towns and inhabitants that submitted to the king but threatened resisting National Guards and inhabitants.",
                  "The declaration said this was not a war of nation against nation, and the Brunswick Manifesto presented the king and his family not as enemies but as captives to be freed.",
                  "Both texts disclaimed conquest. The declaration promised to spare property, and the Brunswick Manifesto promised to protect the property of inhabitants who submitted."
                ]
              },
              "explanation": {
                "ko": "두 문서는 모두 정복을 부정하고 적과 인민을 나누었지만, 그 선을 정반대로 그었습니다. 입법의회의 선전포고에서 적은 헝가리·보헤미아 왕과 프랑스의 자유에 맞서 결탁한 자들이고, 외국 인민은 형제였습니다. 브라운슈바이크 선언에서 적은 행정의 고삐를 찬탈한 파벌이었고, 연합군에 맞서 싸운 국민위병은 자기 왕에 대한 반역자로 처벌되며 저항하는 주민의 집은 허물거나 불태워질 것이었습니다. 튈르리 궁이 공격받거나 왕실이 조금이라도 해를 입으면 파리를 군사적으로 응징하겠다는 조항은 외국 군대가 루이 16세의 보호자를 자처한 셈이어서, 전쟁 초기 패전과 왕의 거부권으로 이미 커진 왕실에 대한 의심을 더 짙게 했습니다.",
                "en": "Both texts disclaimed conquest and separated enemies from the people, but drew that line in opposite places. In the Legislative Assembly's declaration the enemy was the king of Hungary and Bohemia and those leagued against French liberty, while foreign peoples were brothers. In the Brunswick Manifesto the enemy was the faction that had usurped the reins of administration; National Guards who fought the allied armies would be punished as rebels against their king, and the houses of resisting inhabitants would be demolished or burned. The clause threatening Paris with military vengeance if the Tuileries were attacked or the royal family harmed made a foreign army the self-appointed protector of Louis XVI, deepening suspicion of the court that early defeats and the king's vetoes had already raised."
              },
              "source": {
                "kind": "reference",
                "href": "/commulingo/docs/france-war-debate-and-declarations-1791-1792#brunswick-manifesto-1792",
                "label": {
                  "ko": "브라운슈바이크 선언(1792년 7월 25일)",
                  "en": "Brunswick Manifesto (25 July 1792)"
                }
              }
            },
            {
              "id": "q6",
              "type": "multiple_choice",
              "points": 2,
              "prompt": {
                "ko": "8월 10일 봉기에서 9월 21일 국민공회의 결의까지, 왕의 지위는 어떤 순서로 바뀌었을까요?",
                "en": "Between the rising of 10 August and the Convention's decree of 21 September, in what order did the king's position change?"
              },
              "choices": {
                "ko": [
                  "봉기 뒤 왕의 직무가 먼저 정지됐고, 발미 이튿날 새 국민공회가 왕정 폐지를 만장일치로 의결했습니다.",
                  "봉기 당일 왕정이 폐지됐고, 발미 이튿날 국민공회는 루이 16세의 처형을 의결해 곧바로 집행했습니다.",
                  "국민공회는 9월 21일 왕의 직무 정지를 확인했을 뿐이고, 왕정 폐지는 1793년 1월 처형과 함께 선언됐습니다."
                ],
                "en": [
                  "After the rising the king was suspended, and the day after Valmy the Convention unanimously decreed the abolition of the monarchy.",
                  "The monarchy was abolished on the day of the rising, and the day after Valmy the Convention voted Louis XVI's execution and carried it out at once.",
                  "On 21 September the Convention merely confirmed the king's suspension; the monarchy was abolished only with the execution of January 1793."
                ]
              },
              "answer": 0,
              "choiceFeedback": {
                "ko": [
                  "왕정 폐지 결의는 \"국민공회는 프랑스에서 왕정이 폐지됨을 만장일치로 의결한다\"는 한 문장이며, 9월 20일 발미에서 침공군이 멈춘 다음 날 나왔습니다.",
                  "8월 10일 봉기 뒤 이루어진 것은 왕의 직무 정지였습니다. 루이 16세의 재판과 처형은 왕정 폐지 뒤 따로 결정돼 1793년 1월에 집행됐습니다.",
                  "직무 정지는 8월 10일 봉기 뒤의 조치였고, 9월 21일 결의는 그보다 나아가 왕정 자체를 폐지했습니다. 처형은 그 뒤의 별개 결정입니다."
                ],
                "en": [
                  "The decree is a single sentence, \"the National Convention unanimously decrees that royalty is abolished in France\", and came the day after the invaders were halted at Valmy on 20 September.",
                  "What followed 10 August was the king's suspension. Louis XVI's trial and execution were decided separately after the monarchy's abolition and carried out in January 1793.",
                  "Suspension followed the rising of 10 August; the decree of 21 September went further and abolished the monarchy itself. The execution was a later, separate decision."
                ]
              },
              "explanation": {
                "ko": "입헌군주정은 한 번에 끝나지 않았습니다. 전쟁 초기의 패전, 왕의 거부권 행사, 브라운슈바이크 선언의 위협이 겹친 뒤 8월 10일 봉기가 일어났고, 그 결과 왕은 직무가 정지되었습니다. 제도로서의 왕정을 끝낸 것은 새로 선출된 국민공회였습니다. 9월 20일 발미에서 침공군의 진격이 멈춘 이튿날, 국민공회는 왕정 폐지를 만장일치로 의결했습니다. 채택된 전사본이 이 결의를 9월 21~22일 법령으로 적는 것은 문서 표제의 날짜이고, 의결은 21일입니다. 루이 16세의 재판과 1793년 1월 처형은 이 결의에 포함되지 않은 별도 결정이었습니다. 전쟁은 공화정 탄생의 핵심 맥락이었지만, 봉기와 새 의회의 결정이라는 국내 정치의 단계를 거쳤습니다.",
                "en": "Constitutional monarchy did not end in one stroke. After early defeats, the king's vetoes and the threats of the Brunswick Manifesto came the rising of 10 August, which led to the king's suspension. What ended monarchy as an institution was the newly elected National Convention: on the day after the invaders' advance was halted at Valmy on 20 September, it unanimously decreed the abolition of the monarchy. The transcription heads the text as the decree of 21–22 September, but the vote was on the 21st. Louis XVI's trial and execution in January 1793 were not part of this decree but separate decisions. War was the central context for the republic's birth, yet it passed through the domestic steps of a rising and a new assembly's decision."
              },
              "source": {
                "kind": "reference",
                "href": "/commulingo/docs/france-constitutions-and-republic-1791-1793#france-abolition-monarchy-1792",
                "label": {
                  "ko": "국민공회의 왕정 폐지 결의(1792년 9월 21일)",
                  "en": "Decree abolishing the monarchy (21 September 1792)"
                }
              }
            }
          ]
        }
      ]
    },
    {
      "id": "french-revolution-intro-ch09",
      "volumeNumber": 11,
      "chapterNumber": 5,
      "partNumber": 2,
      "partTitle": {
        "ko": "제2부 · 공화정과 혁명정부",
        "en": "Part II · Republic and revolutionary government"
      },
      "title": {
        "ko": "해방 전쟁의 약속은 어떻게 점령과 총동원이 되었을까?",
        "en": "How did the promise of a war of liberation turn into occupation and mass mobilization?"
      },
      "sourceUrl": "/commulingo/docs/france-revolution-abroad-and-mobilization-1792-1793",
      "summary": {
        "ko": "약 11분 · 1792년 11월 형제애 법령과 12월 점령지 법령의 조문을 읽고, 1793년 연합국 전쟁과 방데전쟁의 위기 속에서 나온 국민총동원령이 무엇을 누구에게 요구했는지 확인합니다.",
        "en": "About 11 minutes · Read the articles of the fraternity decree of November 1792 and the decree on occupied territories of December, then see what the levée en masse, issued amid the coalition war and the Vendée rising of 1793, demanded and of whom."
      },
      "learningFocus": {
        "ko": "형제애 법령만 보고 점령지 주민이 자기 정부를 완전히 자유롭게 정했다고 읽지 마세요. 12월 법령은 누가 처음 투표할 수 없는지, 어떤 정부를 세워야 하는지까지 정했습니다. 1793년의 전쟁 위기도 비상권력의 배경일 뿐 모든 억압의 정당화는 아닙니다.",
        "en": "Do not read the fraternity decree alone and conclude that occupied peoples chose their governments with complete freedom. The December decree also fixed who could not vote at first and what kind of government had to be set up. The war crisis of 1793 is likewise the background of emergency power, not a justification of every act of repression."
      },
      "conceptBrief": {
        "ko": [
          {
            "title": "원조의 약속",
            "items": [
              "1792년 11월 19일 국민공회는 자유를 되찾고자 하는 모든 민족에게 형제애와 원조를 베풀겠다고 선언하고, 자유의 대의 때문에 박해받는 시민을 보호하게 했습니다.",
              "장군들은 공화국 군대가 지나가는 모든 지역에서 이 법령을 여러 언어로 인쇄해 공포해야 했습니다."
            ]
          },
          {
            "title": "점령지의 규칙",
            "items": [
              "12월 15일 법령 제1·2조는 장군들이 인민 주권과 기존 권위·세금·십일조·봉건제·특권의 폐지를 선포하고, 인민을 1차 회의나 코뮌 회의에 소집해 임시 행정기구를 만들게 했습니다.",
              "제3조는 구정부의 관리, 이전 귀족, 특권 단체 구성원이 이번 한 번은 투표하거나 선출될 수 없게 했습니다. 제4조는 군주와 교회 단체 등의 재산을 공화국의 보호 아래 두고 목록을 만들게 했고, 제10조는 공동 방위 비용을 새 정부와 협정으로 정산하게 했습니다.",
              "제11조는 자유와 평등을 거부하고 군주와 특권 신분을 보존하려는 민중을 적으로 취급하며, 자유롭고 민중적인 정부가 확고해지기 전에는 무기를 놓지 않겠다고 서약했습니다."
            ]
          },
          {
            "title": "1793년의 복합 위기",
            "items": [
              "1793년 공화국은 오스트리아·프로이센에 더해 영국·네덜란드·에스파냐 등이 가담한 연합국과 싸웠고, 패전과 장군 뒤무리에의 망명이 이어졌습니다.",
              "서부의 방데전쟁과 여러 지방의 반란까지 겹쳐 국민공회는 국경 전쟁과 내전을 동시에 맞았습니다. 이 위기는 비상권력 확대의 실제 배경이었지만, 뒤이은 개별 억압 조치가 정당했는지는 따로 따져야 합니다."
            ]
          },
          {
            "title": "국민총동원령",
            "items": [
              "1793년 8월 23일 법령은 적이 쫓겨날 때까지 모든 프랑스인을 상시 징발 상태에 두고, 젊은이·기혼 남자·여자·아이·노인에게 각각 전투·무기와 수송·천막과 병원·붕대용 실피·광장 연설을 맡겼습니다.",
              "18~25세 미혼 시민과 자식 없는 홀아비가 먼저 출발했고 대리 복무는 금지됐습니다. 공안위원회와 파견된 인민대표는 무기 제조를 위해 시설·물자·노동자를 징발할 권한을 받았습니다."
            ]
          },
          {
            "title": "근거 자료",
            "items": [
              "『프랑스 혁명 문헌집: 혁명의 대외정책과 국민총동원』: 1792년 11월 19일 법령, 1792년 12월 15일 법령 제1~12조와 선포문, 1793년 8월 23일 법령 제1~18조.",
              "프랑스 국민의회, 「공포정치 1793~1794」: 연합국 전쟁·방데전쟁과 혁명정부 기구."
            ]
          }
        ],
        "en": [
          {
            "title": "The promise of aid",
            "items": [
              "On 19 November 1792 the National Convention declared that it would grant fraternity and aid to all peoples wishing to recover their liberty, and ordered protection for citizens persecuted in the cause of liberty.",
              "The generals were to have the decree printed and proclaimed in several languages wherever the Republic's armies passed."
            ]
          },
          {
            "title": "Rules for occupied lands",
            "items": [
              "Articles 1 and 2 of the decree of 15 December had the generals proclaim popular sovereignty and the abolition of existing authorities, taxes, tithes, feudalism and privileges, and summon the people to primary or communal assemblies to form provisional administrations.",
              "Article 3 barred officials of the old government, former nobles and members of privileged corporations from voting or being elected, this time only. Article 4 placed the property of the prince, ecclesiastical bodies and others under the Republic's protection and had it inventoried, and Article 10 left the costs of common defence to be settled by agreement with the new government.",
              "Article 11 declared that a people refusing liberty and equality and seeking to keep the prince and privileged castes would be treated as an enemy, and swore not to lay down arms until a free and popular government was firmly established."
            ]
          },
          {
            "title": "The compound crisis of 1793",
            "items": [
              "In 1793 the Republic fought a coalition in which Britain, the Netherlands, Spain and others joined Austria and Prussia, and defeats were followed by the defection of General Dumouriez.",
              "With the Vendée war in the west and revolts in several regions, the Convention faced frontier war and civil war at once. The crisis was the real background of expanding emergency power, but whether each act of repression that followed was justified is a separate question."
            ]
          },
          {
            "title": "The levée en masse",
            "items": [
              "The decree of 23 August 1793 placed all French people in permanent requisition until the enemy was expelled, assigning young men to battle, married men to arms and transport, women to tents and hospitals, children to lint for bandages, and old men to speeches in public squares.",
              "Unmarried citizens aged 18 to 25 and childless widowers were to leave first, and substitution was forbidden. The Committee of Public Safety and the representatives on mission received power to requisition premises, materials and workers for arms production."
            ]
          },
          {
            "title": "Sources",
            "items": [
              "French Revolution Documents: Revolutionary Foreign Policy and the Levée en Masse: the decree of 19 November 1792, Articles 1–12 and the proclamation of the decree of 15 December 1792, and Articles 1–18 of the decree of 23 August 1793.",
              "French National Assembly, \"The Terror 1793–1794\": the coalition war, the Vendée war and the organs of revolutionary government."
            ]
          }
        ]
      },
      "conceptMap": {
        "ko": [
          {
            "title": "형제애 법령",
            "text": "자유를 되찾으려는 민족에게 원조를 약속했습니다."
          },
          {
            "title": "점령지 법령",
            "text": "특권 폐지와 새 행정을 선포하되 투표 자격과 받아들일 정부의 형태를 정했습니다."
          },
          {
            "title": "1793년 위기",
            "text": "연합국 전쟁과 방데전쟁이 겹쳐 국경과 국내가 함께 전선이 됐습니다."
          },
          {
            "title": "국민총동원",
            "text": "나이와 성별에 따라 모든 프랑스인에게 전쟁의 몫을 배정했습니다."
          }
        ],
        "en": [
          {
            "title": "Fraternity decree",
            "text": "It promised aid to peoples seeking to recover their liberty."
          },
          {
            "title": "Occupied territories decree",
            "text": "It proclaimed the end of privilege and new administrations while fixing who could vote and what government must follow."
          },
          {
            "title": "The 1793 crisis",
            "text": "Coalition war and the Vendée made both the frontier and the interior into fronts."
          },
          {
            "title": "Levée en masse",
            "text": "It gave every French person a share of the war by age and sex."
          }
        ]
      },
      "diagram": {
        "kind": "flow",
        "ko": {
          "title": "원조의 약속에서 총동원까지",
          "steps": [
            {
              "label": "1792년 11월 19일 · 형제애 법령",
              "note": "자유를 원하는 민족에게 원조를 약속하고 여러 언어로 공포하게 했습니다."
            },
            {
              "label": "1792년 12월 15일 · 점령지 법령",
              "note": "특권 폐지를 선포하고 임시 행정을 세우되 옛 특권층의 투표를 막았습니다."
            },
            {
              "label": "1793년 봄 · 복합 위기",
              "note": "연합국과의 패전, 뒤무리에 망명, 방데전쟁이 겹쳤습니다."
            },
            {
              "label": "1793년 8월 23일 · 국민총동원령",
              "note": "모든 프랑스인을 징발하고 젊은 미혼 시민을 먼저 보냈습니다."
            }
          ]
        },
        "en": {
          "title": "From the promise of aid to mass mobilization",
          "steps": [
            {
              "label": "19 November 1792 · Fraternity decree",
              "note": "Aid was promised to peoples seeking liberty and proclaimed in several languages."
            },
            {
              "label": "15 December 1792 · Occupied territories decree",
              "note": "Privilege was abolished and provisional administrations set up, but former privileged groups could not vote."
            },
            {
              "label": "Spring 1793 · Compound crisis",
              "note": "Defeats by the coalition, Dumouriez's defection and the Vendée war came together."
            },
            {
              "label": "23 August 1793 · Levée en masse",
              "note": "All French people were requisitioned and young unmarried citizens left first."
            }
          ]
        }
      },
      "lessons": [
        {
          "id": "french-revolution-intro-ch09-basic",
          "level": "basic",
          "title": {
            "ko": "해방 전쟁의 약속은 어떻게 점령과 총동원이 되었을까?",
            "en": "How did the promise of a war of liberation turn into occupation and mass mobilization?"
          },
          "questions": [
            {
              "id": "q1",
              "type": "multiple_choice",
              "points": 2,
              "prompt": {
                "ko": "1792년 11월 19일 형제애 법령은 외국 민족에게 무엇을 약속하고 장군들에게 무엇을 시켰을까요?",
                "en": "What did the fraternity decree of 19 November 1792 promise foreign peoples, and what did it tell the generals to do?"
              },
              "choices": {
                "ko": [
                  "자유를 되찾으려는 민족에게 원조를 약속하고, 장군들에게 법령을 여러 언어로 인쇄해 공포하게 했습니다.",
                  "프랑스 병합을 청원한 지역에만 원조를 약속하고, 장군들에게 그 주민에게 프랑스 시민권을 주게 했습니다.",
                  "외국 인민이 먼저 봉기해 정부를 세운 뒤에만 돕겠다고 하고, 장군들에게 국경을 넘지 말라고 명했습니다."
                ],
                "en": [
                  "It promised aid to peoples seeking to recover their liberty and had the generals print and proclaim it in several languages.",
                  "It promised aid only to regions that petitioned for annexation and told the generals to grant their inhabitants French citizenship.",
                  "It offered help only after foreign peoples had risen and formed governments, and ordered the generals not to cross the frontier."
                ]
              },
              "answer": 0,
              "choiceFeedback": {
                "ko": [
                  "법령은 \"자유를 되찾고자 하는 모든 민족\"에게 형제애와 원조를 약속하고, 공화국 군대가 지나가는 모든 지역에서 여러 언어로 인쇄해 공포하게 했습니다.",
                  "형제애 법령에는 병합 청원이나 시민권 부여 조건이 없습니다. 원조 대상은 병합을 원하는 지역이 아니라 자유를 되찾고자 하는 모든 민족이었습니다.",
                  "법령은 군대가 지나가는 지역에서 공포하라고 명했으므로 국경 밖 작전을 전제했습니다. 원조의 조건은 정부 수립이 아니라 자유를 되찾으려는 의지였습니다."
                ],
                "en": [
                  "The decree promised fraternity and aid to \"all peoples wishing to recover their liberty\" and had it printed in several languages wherever the Republic's armies passed.",
                  "The fraternity decree says nothing about petitions for annexation or grants of citizenship. Its aid was for all peoples wishing to recover their liberty.",
                  "The decree ordered proclamation wherever the armies passed, which assumed operations beyond the frontier. The condition for aid was a wish to recover liberty, not an established government."
                ]
              },
              "explanation": {
                "ko": "형제애 법령은 두 문단짜리 짧은 결의입니다. 첫 문단은 자유를 되찾고자 하는 모든 민족에게 형제애와 원조를 약속하고, 행정부가 장군들에게 명령을 내려 그들을 돕고 자유의 대의 때문에 박해받는 시민을 보호하게 했습니다. 둘째 문단은 군대가 지나가는 모든 곳에서 이 법령을 여러 언어로 인쇄해 공포하라고 했습니다. 1792년 4월 선전포고가 방어 전쟁을 내세웠다면, 이 법령은 군대가 국경 밖으로 나가 다른 민족의 자유를 돕는 전쟁을 약속한 셈입니다. 원조가 구체적으로 어떤 규칙으로 집행될지는 한 달 뒤 점령지 법령이 정했습니다.",
                "en": "The fraternity decree is a short resolution in two paragraphs. The first promises fraternity and aid to all peoples wishing to recover their liberty and has the executive order the generals to help them and protect citizens persecuted in the cause of liberty. The second orders the decree printed and proclaimed in several languages wherever the armies pass. Where the declaration of war of April 1792 had spoken of a defensive war, this decree promised a war in which armies went beyond the frontier to help other peoples' liberty. The rules by which that aid would be carried out were set a month later by the decree on occupied territories."
              },
              "source": {
                "kind": "reference",
                "href": "/commulingo/docs/france-revolution-abroad-and-mobilization-1792-1793#france-fraternity-decree-1792",
                "label": {
                  "ko": "외국 인민에 대한 형제애와 원조 법령(1792년 11월 19일)",
                  "en": "Decree of fraternity and aid to foreign peoples (19 November 1792)"
                }
              }
            },
            {
              "id": "q2",
              "type": "multiple_choice",
              "points": 2,
              "prompt": {
                "ko": "1792년 12월 15일 점령지 법령은 새 임시 행정기구를 뽑는 1차 회의에서 누구의 투표를 막았을까요?",
                "en": "Whose votes did the decree on occupied territories of 15 December 1792 bar from the primary assemblies that chose the new provisional administrations?"
              },
              "choices": {
                "ko": [
                  "구정부의 관리와 이전 귀족, 특권 단체 구성원의 투표와 피선을 이번 한 번 막았습니다.",
                  "직접세를 내지 못하는 가난한 주민과 임금 받는 하인의 투표를 막아 재산 있는 시민만 뽑게 했습니다.",
                  "프랑스 장군이 추천하지 않은 주민의 투표를 막고, 현지 행정은 프랑스가 임명한 국가위원이 맡게 했습니다."
                ],
                "en": [
                  "Officials of the old government, former nobles and members of privileged corporations were barred from voting or election, this time only.",
                  "Poor inhabitants who paid no direct tax and wage-earning servants were barred, so that only propertied citizens voted.",
                  "Inhabitants not recommended by the French generals were barred, and local administration went to commissioners appointed by France."
                ]
              },
              "answer": 0,
              "choiceFeedback": {
                "ko": [
                  "제3조는 이들이 \"이번 한 번만은\" 1차 회의나 코뮌 회의에서 투표할 수 없고 임시 행정기구나 사법권의 자리에 선출될 수도 없다고 정했습니다.",
                  "납세액과 하인 여부로 투표권을 가른 것은 1791년 프랑스 헌법의 능동시민 조건입니다. 점령지 법령은 재산이 아니라 옛 체제에서의 지위로 배제 대상을 정했습니다.",
                  "임시 행정기구는 인민이 임명했습니다. 프랑스의 국가위원은 그 행정기구와 함께 공동 방위와 군대 비용을 협의하는 역할이었습니다."
                ],
                "en": [
                  "Article 3 provided that they could not, \"this time only\", vote in primary or communal assemblies or be elected to provisional administrative or judicial posts.",
                  "Dividing voters by taxes paid and servant status was the 1791 French constitution's rule for active citizens. The occupation decree excluded people by their position under the old order, not by property.",
                  "The provisional administrations were named by the people. The French national commissioners were to confer with them on common defence and the army's costs."
                ]
              },
              "explanation": {
                "ko": "12월 15일 법령은 먼저 장군들이 인민 주권과 기존 권위·세금·십일조·봉건제·귀족 신분 등 모든 특권의 폐지를 선포하게 했습니다(제1조). 이어서 인민을 1차 회의나 코뮌 회의에 소집해 임시 행정기구와 사법기구를 만들게 했습니다(제2조). 그러나 제3조는 그 첫 투표에서 구정부의 관리, 이전 귀족, 특권 단체의 구성원을 빼고 그들이 선출될 수도 없게 했습니다. 인민 주권을 선포하는 법령이 누가 그 주권을 처음 행사할지도 함께 정한 것입니다. 이 배제의 기준은 1791년 헌법처럼 납세액이 아니라 옛 체제에서 누리던 지위였습니다.",
                "en": "The decree of 15 December first had the generals proclaim popular sovereignty and the abolition of existing authorities, taxes, tithes, feudalism, nobility and every other privilege (Article 1). It then had them summon the people to primary or communal assemblies to form provisional administrative and judicial bodies (Article 2). Article 3, however, excluded officials of the old government, former nobles and members of privileged corporations from that first vote and from election. A decree proclaiming popular sovereignty also decided who would first exercise it. The test of exclusion was not tax paid, as in the 1791 constitution, but position under the old order."
              },
              "source": {
                "kind": "reference",
                "href": "/commulingo/docs/france-revolution-abroad-and-mobilization-1792-1793#france-occupied-territories-decree-1792",
                "label": {
                  "ko": "점령지의 혁명 행정에 관한 법령(1792년 12월 15일) 제1~3조",
                  "en": "Decree on revolutionary administration of occupied territories (15 December 1792), Articles 1–3"
                }
              }
            },
            {
              "id": "q3",
              "type": "multiple_choice",
              "points": 2,
              "prompt": {
                "ko": "점령지 법령은 군주와 교회 단체의 재산, 그리고 프랑스 군대의 주둔 비용을 어떻게 처리하게 했을까요?",
                "en": "How did the decree on occupied territories have the property of princes and church bodies, and the costs of the French army's presence, handled?"
              },
              "choices": {
                "ko": [
                  "그 재산은 공화국의 보호 아래 두고 목록을 만들게 했고, 공동 방위 비용은 새 정부와 협정으로 정하게 했습니다.",
                  "그 재산은 곧바로 경매해 현지 빈민에게 나누게 했고, 군대 비용은 프랑스 국고가 모두 부담하겠다고 했습니다.",
                  "그 재산은 프랑스로 옮겨 아시냐의 담보로 삼게 했고, 군대 비용은 점령지 주민 모두에게 같은 액수로 물리게 했습니다."
                ],
                "en": [
                  "The property was placed under the Republic's protection and inventoried, and common defence costs were to be settled by agreement with the new government.",
                  "The property was to be auctioned at once and shared among local poor, while the French treasury bore all of the army's costs.",
                  "The property was to be moved to France as security for the assignats, and the army's costs levied equally on every inhabitant."
                ]
              },
              "answer": 0,
              "choiceFeedback": {
                "ko": [
                  "제4조는 이 재산을 프랑스 공화국의 보호와 안전조치 아래 두고 상세 목록을 집행위원회에 보내게 했고, 제10조는 비용을 계산에 올려 수립될 정부와 협정하게 했습니다.",
                  "법령은 재산의 매각이나 분배를 명하지 않았고, 프랑스가 비용을 모두 부담한다고 하지도 않았습니다. 제7·10조는 오히려 군대 비용을 현지와 협의하고 정산하게 했습니다.",
                  "법령에는 재산을 프랑스로 옮기거나 아시냐의 담보로 삼는 규정이 없습니다. 제5조는 오히려 부과금을 물릴 때 빈곤하고 노동하는 인민이 부담하지 않게 하라고 했습니다."
                ],
                "en": [
                  "Article 4 placed this property under the protection and safeguard of the French Republic and sent detailed inventories to the Executive Council; Article 10 had costs entered in an account and settled by agreement with the future government.",
                  "The decree did not order the property sold or distributed, nor did France promise to bear all costs. Articles 7 and 10 instead had the army's costs discussed and settled with the local authorities.",
                  "The decree contains no provision for moving the property to France or pledging it for the assignats. Article 5 instead required that any levy spare the poor and labouring part of the people."
                ]
              },
              "explanation": {
                "ko": "점령지 법령은 해방을 선포하면서 동시에 재산과 비용의 규칙을 세웠습니다. 제4조에 따라 국고, 군주와 그 추종자, 공공 시설, 세속·교회 단체의 재산은 프랑스 공화국의 보호 아래 놓이고 목록이 작성되었으며, 제5조는 인민이 임명한 임시 행정기구가 이를 관리하되 부과금은 빈곤하고 노동하는 인민이 부담하지 않게 하라고 했습니다. 제7조의 국가위원은 군대의 피복·식량과 주둔 비용을 마련할 방도를 현지와 협의했고, 제10조는 공화국이 지출한 비용을 계산에 올려 새 정부와 협정을 맺게 했습니다. 원조를 받는 쪽이 그 전쟁 비용의 일부를 함께 지는 구조가 조문에 들어 있었던 것입니다.",
                "en": "While proclaiming liberation, the decree also set rules for property and costs. Under Article 4 the property of the treasury, the prince and his followers, public establishments, and lay and ecclesiastical bodies came under the French Republic's protection and was inventoried; Article 5 had the people's provisional administration manage it and required that any levy spare the poor and labouring people. The national commissioners of Article 7 were to arrange with local authorities for the army's clothing, food and costs of stay, and Article 10 entered the Republic's expenses in an account to be settled by agreement with the new government. The text built in a structure in which those receiving aid shared the cost of the war."
              },
              "source": {
                "kind": "reference",
                "href": "/commulingo/docs/france-revolution-abroad-and-mobilization-1792-1793#france-occupied-territories-decree-1792",
                "label": {
                  "ko": "점령지의 혁명 행정에 관한 법령 제4~10조",
                  "en": "Decree on occupied territories, Articles 4–10"
                }
              }
            },
            {
              "id": "q4",
              "type": "multiple_choice",
              "points": 2,
              "prompt": {
                "ko": "11월 형제애 법령과 12월 점령지 법령 제11조를 비교하면, 원조의 약속에는 어떤 조건이 붙었을까요?",
                "en": "Comparing the November fraternity decree with Article 11 of the December decree, what condition came attached to the promise of aid?"
              },
              "choices": {
                "ko": [
                  "군주와 특권 신분을 지키려는 민중은 적으로 삼고, 자유롭고 민중적인 정부가 서기 전에는 무기를 놓지 않겠다고 했습니다.",
                  "4월 선전포고처럼 적은 왕들뿐이라고 하며, 어떤 민중도 그 선택 때문에 적으로 삼지 않겠다고 거듭 밝혔습니다.",
                  "민중이 스스로 정부 형태를 정할 권리를 존중해, 군주정을 다시 택하더라도 곧바로 군대를 철수하겠다고 했습니다."
                ],
                "en": [
                  "A people seeking to keep the prince and privileged castes would be an enemy, and arms would not be laid down until a free, popular government stood.",
                  "Like the April declaration of war, it said the only enemies were kings and that no people would be treated as an enemy for its choice.",
                  "Respecting a people's right to choose its government, it promised to withdraw the army at once even if the people restored monarchy."
                ]
              },
              "answer": 0,
              "choiceFeedback": {
                "ko": [
                  "제11조는 자유와 평등을 거부하고 군주와 특권 신분을 보존·복귀시키거나 그들과 교섭하려는 민중을 적으로 취급하겠다고 선언하고, 평등의 원칙과 자유로운 정부가 확고해질 때까지 조약도 맺지 않겠다고 서약했습니다.",
                  "4월 선전포고는 민족 대 민족의 전쟁이 아니라고 했지만, 제11조는 바로 그 선을 넘어 특정한 선택을 하는 민중 자체를 적으로 규정했습니다.",
                  "제9조는 주민이 자유롭고 민중적인 정부를 조직하면 임시 행정이 끝난다고 했을 뿐, 군주정을 택할 권리를 인정하지 않았습니다. 제11조는 그런 선택을 적대 행위로 보았습니다."
                ],
                "en": [
                  "Article 11 declared that a people refusing liberty and equality and seeking to keep, restore or treat with the prince and privileged castes would be treated as an enemy, and swore to sign no treaty until equality and a free government were secure.",
                  "The April declaration denied that the war was nation against nation, but Article 11 crossed that very line by naming a people that made a certain choice as the enemy.",
                  "Article 9 ended the provisional regime once inhabitants organized a free and popular government; it recognized no right to choose monarchy. Article 11 treated such a choice as hostile."
                ]
              },
              "explanation": {
                "ko": "11월 법령만 읽으면 원조는 조건 없는 연대처럼 보입니다. 12월 법령 제11조는 그 반대편을 정했습니다. 자유와 평등을 거부하거나 포기하면서 군주와 특권 신분을 보존하거나 복귀시키려는 민중, 또는 그들과 교섭하려는 민중은 프랑스 민족의 적이 됩니다. 프랑스는 군대가 들어간 영토에서 평등의 원칙이 채택되고 자유롭고 민중적인 정부가 확고해지기 전에는 조약도 맺지 않고 무기도 놓지 않겠다고 서약했습니다. 1792년 4월 선전포고는 적을 한 왕과 그 결탁자로 한정했지만, 제11조에서는 받아들여야 할 정치 질서가 미리 정해졌고 그것을 거부하는 민중도 적이 될 수 있었습니다.",
                "en": "Read alone, the November decree makes aid look like unconditional solidarity. Article 11 of the December decree set out the other side. A people that refused or renounced liberty and equality and sought to preserve or restore the prince and privileged castes, or to treat with them, would be the French nation's enemy. France swore to sign no treaty and lay down no arms until the principle of equality was adopted and a free and popular government was secure in the territory its armies had entered. The April 1792 declaration had limited the enemy to a king and his allies; under Article 11 the political order to be accepted was fixed in advance, and a people rejecting it could itself become the enemy."
              },
              "source": {
                "kind": "reference",
                "href": "/commulingo/docs/france-revolution-abroad-and-mobilization-1792-1793#france-occupied-territories-decree-1792",
                "label": {
                  "ko": "점령지의 혁명 행정에 관한 법령 제9·11조",
                  "en": "Decree on occupied territories, Articles 9 and 11"
                }
              }
            },
            {
              "id": "q5",
              "type": "multiple_choice",
              "points": 2,
              "prompt": {
                "ko": "1793년 봄 공화국이 맞은 위기는 어떤 성격이었고, 그 위기로 무엇까지 설명할 수 있을까요?",
                "en": "What kind of crisis did the Republic face in spring 1793, and how much can that crisis explain?"
              },
              "choices": {
                "ko": [
                  "연합국 전선의 패전, 뒤무리에 망명, 방데전쟁이 겹친 위기였고, 비상권력 확대의 배경이지 모든 억압의 정당화는 아닙니다.",
                  "연합국 전선의 패전, 뒤무리에 망명, 방데전쟁이 겹친 위기였으므로, 뒤이은 구금과 약식 재판은 모두 군사적으로 불가피했습니다.",
                  "위기는 국경의 전투에만 있었고 국내 반란은 없었으므로, 비상권력은 전쟁과 무관한 파리 정파 싸움에서만 나왔습니다."
                ],
                "en": [
                  "Defeats by the coalition, Dumouriez's defection and the Vendée war combined; this was the background of emergency power, not a justification of all repression.",
                  "Defeats by the coalition, Dumouriez's defection and the Vendée war combined, so all the detentions and summary trials that followed were militarily unavoidable.",
                  "The crisis lay only in frontier battles, with no revolt at home, so emergency power came solely from Parisian factional struggle unconnected to the war."
                ]
              },
              "answer": 0,
              "choiceFeedback": {
                "ko": [
                  "영국·네덜란드·에스파냐 등이 가담한 연합국과의 전쟁, 뒤무리에의 망명, 서부 방데전쟁과 지방 반란이 겹쳤습니다. 이것은 원인을 설명하지만 개별 조치의 정당성까지 입증하지는 않습니다.",
                  "위기의 묘사는 맞지만 결론이 넘칩니다. 배경을 설명하는 일과 각 체포·재판이 필요하거나 정당했는지 판단하는 일은 따로 따져야 합니다.",
                  "1793년 공화국은 방데전쟁과 여러 지방의 반란을 국경 전쟁과 동시에 맞았습니다. 전쟁을 지우면 공안위원회와 파견의원 제도가 커진 배경도 사라집니다."
                ],
                "en": [
                  "War with a coalition joined by Britain, the Netherlands, Spain and others, Dumouriez's defection, and the Vendée and provincial revolts came together. This explains causes but does not prove each measure justified.",
                  "The description of the crisis is right, but the conclusion overreaches. Explaining the background and judging whether each arrest or trial was necessary or just are separate questions.",
                  "In 1793 the Republic faced the Vendée war and provincial revolts together with the frontier war. Erasing the war also erases the background to the growth of the Committee of Public Safety and representatives on mission."
                ]
              },
              "explanation": {
                "ko": "1793년 공화국은 오스트리아·프로이센에 더해 영국·네덜란드·에스파냐 등이 가담한 연합국과 싸웠고, 패전과 장군 뒤무리에의 망명으로 군 지휘부에 대한 불신이 커졌습니다. 서부의 방데전쟁과 여러 지방의 반란은 국경 전쟁을 내전과 겹치게 했습니다. 이 복합 위기는 공안위원회와 파견의원을 통한 중앙집중적 동원의 실제 배경이었습니다. 그러나 위기가 있었다는 사실에서 뒤이은 모든 구금과 재판이 불가피했다는 결론을 끌어낼 수는 없습니다. 반대로 전쟁을 지우고 파리의 정파 싸움만 보면 비상권력이 왜 그 시점에 커졌는지 설명할 수 없습니다. 원인의 설명과 정당성의 판단을 따로 해야 합니다.",
                "en": "In 1793 the Republic fought a coalition in which Britain, the Netherlands, Spain and others joined Austria and Prussia, and defeats and the defection of General Dumouriez deepened distrust of the army command. The Vendée war in the west and revolts in several regions overlapped frontier war with civil war. This compound crisis was the real background to centralized mobilization through the Committee of Public Safety and representatives on mission. But the existence of the crisis does not prove that every detention and trial that followed was unavoidable. Conversely, erasing the war and looking only at factional struggle in Paris leaves no explanation of why emergency power grew at that moment. Explaining causes and judging justification must be kept apart."
              },
              "source": {
                "kind": "reference",
                "href": "https://www.assemblee-nationale.fr/dyn/histoire-et-patrimoine/revolution-francaise/la-terreur",
                "label": {
                  "ko": "프랑스 국민의회, 「공포정치 1793~1794」",
                  "en": "French National Assembly, \"The Terror 1793–1794\""
                }
              }
            },
            {
              "id": "q6",
              "type": "multiple_choice",
              "points": 2,
              "prompt": {
                "ko": "1793년 8월 23일 국민총동원령은 누가 먼저 출발하고, 대신 복무할 사람을 세울 수 있는지를 어떻게 정했을까요?",
                "en": "How did the levée en masse of 23 August 1793 decide who left first and whether someone could serve in another's place?"
              },
              "choices": {
                "ko": [
                  "18~25세 미혼 시민과 자식 없는 홀아비가 먼저 출발하고, 누구도 대리 복무를 시킬 수 없게 했습니다.",
                  "18~25세 기혼 남자가 먼저 출발하고 미혼자는 무기 제조에 남되, 공직자도 예외 없이 징집했습니다.",
                  "모든 성인 남성이 제비뽑기로 출발 순서를 정하고, 돈을 내고 대리인을 세우면 복무를 면할 수 있게 했습니다."
                ],
                "en": [
                  "Unmarried citizens aged 18 to 25 and childless widowers left first, and no one could have another serve in his place.",
                  "Married men aged 18 to 25 left first while the unmarried stayed to make arms, and public officials were drafted without exception.",
                  "All adult men drew lots for the order of departure, and anyone could escape service by paying for a substitute."
                ]
              },
              "answer": 0,
              "choiceFeedback": {
                "ko": [
                  "제8조는 징집을 전면적으로 하되 18~25세 미혼 시민과 자식 없는 홀아비가 먼저 출발한다고 했고, 제7조는 대리 복무를 금지했습니다.",
                  "제1조에서 기혼 남자에게 맡긴 일은 무기를 벼리고 식량을 운반하는 것이었습니다. 제7조는 공직자가 자기 직위에 남는다고 했습니다.",
                  "대리 복무를 허용하는 방식은 제7조가 명시적으로 막은 것입니다. 출발 순서는 제비뽑기가 아니라 나이와 혼인 여부로 정해졌습니다."
                ],
                "en": [
                  "Article 8 made the levy general but sent unmarried citizens of 18 to 25 and childless widowers first, and Article 7 forbade substitution.",
                  "Article 1 assigned married men to forging arms and carrying food. Article 7 kept public officials at their posts.",
                  "Substitution for payment is exactly what Article 7 forbade. The order of departure was set by age and marital status, not by lot."
                ]
              },
              "explanation": {
                "ko": "국민총동원령 제1조는 적이 공화국 영토에서 쫓겨날 때까지 모든 프랑스인을 군 복무를 위한 상시 징발 상태에 두고, 젊은이는 싸움터, 기혼 남자는 무기와 식량 운반, 여자는 천막·옷·병원, 아이는 실피 만들기, 노인은 광장에서 전사를 북돋우는 일을 맡게 했습니다. 실제로 먼저 떠나는 사람은 제8조가 정한 18~25세 미혼 시민과 자식 없는 홀아비였고, 제7조는 돈 있는 사람이 대리인을 세워 빠지는 길을 막으면서 공직자는 자리에 남게 했습니다. 제5조는 공안위원회에 무기 제조를 위해 시설·물자·노동자를 징발할 권한을 주었고, 제3조는 규격 화기를 적을 향해 진군하는 자에게만 지급하게 했습니다. 동원은 병력만이 아니라 생산과 수송까지 국가가 조직하는 일이었습니다.",
                "en": "Article 1 of the levée en masse placed all French people in permanent requisition for military service until the enemy was driven from the Republic's territory, sending young men to battle, married men to forge arms and carry food, women to make tents and clothes and serve in hospitals, children to make lint, and old men to the squares to rouse the fighters. Those who actually left first were, under Article 8, unmarried citizens of 18 to 25 and childless widowers; Article 7 closed the path by which men of means could buy a substitute, while keeping public officials at their posts. Article 5 gave the Committee of Public Safety power to requisition premises, materials and workers for arms production, and Article 3 reserved regulation firearms for those marching against the enemy. Mobilization meant the state organizing not only soldiers but production and transport."
              },
              "source": {
                "kind": "reference",
                "href": "/commulingo/docs/france-revolution-abroad-and-mobilization-1792-1793#france-levee-en-masse-1793",
                "label": {
                  "ko": "국민총동원령(1793년 8월 23일) 제1·5·7·8조",
                  "en": "Levée en masse (23 August 1793), Articles 1, 5, 7 and 8"
                }
              }
            }
          ]
        }
      ]
    },
    {
      "id": "french-revolution-intro-ch03",
      "volumeNumber": 11,
      "chapterNumber": 6,
      "partNumber": 2,
      "partTitle": {
        "ko": "제2부 · 공화정과 혁명정부",
        "en": "Part II · Republic and revolutionary government"
      },
      "title": {
        "ko": "1793년 공화국은 생존의 권리를 어떻게 약속했을까?",
        "en": "How did the Republic of 1793 promise a right to exist?"
      },
      "sourceUrl": "/commulingo/docs/france-subsistence-and-equality-1792-1796",
      "summary": {
        "ko": "약 12분 · 로베스피에르의 1792년 12월 생필품 연설, 1793년 6월 헌법과 권리 선언의 시민권·법률 제정·재산·공공 구호 조항, 9월 일반 최고가격법의 가격·임금 상한을 차례로 읽습니다.",
        "en": "About 12 minutes · Read Robespierre's speech on subsistence of December 1792, the citizenship, law-making, property and public-assistance articles of the June 1793 constitution and declaration of rights, and the price and wage ceilings of the General Maximum of September."
      },
      "learningFocus": {
        "ko": "생존권을 내세운 문서를 사유재산 폐지로 읽지 마세요. 로베스피에르도 1793년 권리 선언도 소유권을 인정했습니다. 또 1793년 헌법은 승인됐지만 시행되지 않았고, 일반 최고가격법은 실제로 제정된 법이라는 차이도 놓치지 마세요.",
        "en": "Do not read texts that invoke the right to exist as abolishing private property: both Robespierre and the declaration of 1793 recognized property. Keep in mind too that the 1793 constitution was approved but never applied, while the General Maximum was a law actually enacted."
      },
      "conceptBrief": {
        "ko": [
          {
            "title": "로베스피에르의 생필품 연설",
            "items": [
              "1792년 12월 2일 국민공회 연설에서 로베스피에르는 첫 번째 권리가 존재할 권리이고, 생존에 꼭 필요한 식량은 사회 전체의 공동 재산이며 잉여분만 상업의 자유에 맡겨진다고 했습니다.",
              "그는 상업과 합법적 재산을 빼앗지 않고 독점의 약탈만 막는다고 하면서, 곡물 생산량 확인, 시장 판매 강제, 야간 운송 금지를 요구했습니다."
            ]
          },
          {
            "title": "1793년 헌법: 누가, 어떻게 법을 만드는가",
            "items": [
              "1791년 헌법의 능동시민은 25세 이상으로 3일 치 노동 가치의 직접세를 내야 했고, 왕은 법률에 정지적 거부권을 가졌습니다.",
              "1793년 헌법 제4조는 프랑스에서 태어나 거주하는 21세 이상 모든 남성과 일정한 조건의 외국인에게 시민권 행사를 인정했습니다. 납세 조건은 없었지만 여성은 포함되지 않았습니다.",
              "법률안은 모든 코뮌에 보내졌고, 40일 안에 과반 데파르트망에서 기초의회 10분의 1이 이의를 내지 않으면 법률이 되었습니다(제58~60조)."
            ]
          },
          {
            "title": "1793년 권리 선언: 재산과 구호",
            "items": [
              "제16조는 소유권을 재산·수입·노동과 생업의 결실을 누리고 처분하는 권리로 규정했고, 제21조는 공공 구호를 신성한 채무로 선언해 불행한 시민에게 노동을, 노동할 수 없는 사람에게 생존 수단을 보장하게 했습니다.",
              "제35조는 정부가 인민의 권리를 침해할 때 봉기를 가장 신성한 권리이자 의무로 규정했습니다. 이 헌법은 승인됐지만 시행되지 않았습니다."
            ]
          },
          {
            "title": "일반 최고가격법",
            "items": [
              "1793년 9월 29일 법은 제1조에 열거한 생필품 대부분의 최고 가격을 1790년 가격에 3분의 1을 더한 값으로 정했습니다(제3조).",
              "제8조는 임금에도 1790년 수준에 절반을 더한 상한을 두었고, 제9조는 정당한 이유 없이 일을 거부하는 노동자를 징발할 수 있게 했습니다."
            ]
          },
          {
            "title": "근거 자료",
            "items": [
              "『프랑스 혁명 문헌집: 생존권과 평등』: 로베스피에르, 생필품에 관한 의견(1792년 12월 2일), 일반최고가격법(1793년 9월 29일).",
              "『프랑스 혁명 문헌집: 헌법과 공화국』: 1791년 헌법, 1793년 6월 24일 헌법과 권리 선언."
            ]
          }
        ],
        "en": [
          {
            "title": "Robespierre's speech on subsistence",
            "items": [
              "In his speech to the Convention of 2 December 1792 Robespierre said the first right is the right to exist, that the food necessary to life is the common property of society as a whole, and that only the surplus is left to freedom of trade.",
              "Saying he took away neither commerce nor lawful property but only the monopolist's plunder, he called for checking how much grain was produced, obliging dealers to sell in the market, and banning transport at night."
            ]
          },
          {
            "title": "The 1793 constitution: who makes law, and how",
            "items": [
              "Active citizens under the 1791 constitution had to be 25 or older and pay direct tax worth three days' labour, and the king held a suspensive veto over laws.",
              "Article 4 of the 1793 constitution granted the exercise of citizenship to every man of 21 or over born and living in France and to foreigners meeting certain conditions. There was no tax qualification, but women were not included.",
              "A proposed law was sent to every commune and became law if, within forty days, a tenth of the primary assemblies in half the departments plus one did not object (Articles 58–60)."
            ]
          },
          {
            "title": "The 1793 declaration: property and relief",
            "items": [
              "Article 16 defined property as the right to enjoy and dispose of one's goods, income and the fruit of one's labour and industry; Article 21 declared public relief a sacred debt, owing work to unfortunate citizens and the means of existence to those unable to work.",
              "Article 35 made insurrection the most sacred right and duty when government violates the people's rights. The constitution was approved but never applied."
            ]
          },
          {
            "title": "The General Maximum",
            "items": [
              "The law of 29 September 1793 set the maximum price of most necessities listed in Article 1 at the 1790 price plus one third (Article 3).",
              "Article 8 also capped wages at the 1790 level plus one half, and Article 9 allowed workers who refused their usual work without good reason to be requisitioned."
            ]
          },
          {
            "title": "Sources",
            "items": [
              "French Revolution Documents: Subsistence and Equality: Robespierre, Opinion on Subsistence (2 December 1792); the Law of the General Maximum (29 September 1793).",
              "French Revolution Documents: Constitutions and the Republic: the constitution of 1791; the constitution and declaration of rights of 24 June 1793."
            ]
          }
        ]
      },
      "conceptMap": {
        "ko": [
          {
            "title": "존재할 권리",
            "text": "로베스피에르는 생존에 필요한 몫과 상업에 맡길 잉여를 나누었습니다."
          },
          {
            "title": "1793년 시민권과 입법",
            "text": "납세 조건을 없애고 법률안을 기초의회의 이의 절차에 부쳤습니다."
          },
          {
            "title": "재산과 공공 구호",
            "text": "권리 선언은 소유권과 생계에 대한 사회의 채무를 함께 적었습니다."
          },
          {
            "title": "최고가격법",
            "text": "생필품 가격과 임금에 각각 1790년 기준의 상한을 두었습니다."
          }
        ],
        "en": [
          {
            "title": "The right to exist",
            "text": "Robespierre separated the share needed for life from the surplus left to trade."
          },
          {
            "title": "Citizenship and law-making in 1793",
            "text": "The tax qualification disappeared and bills went through an objection procedure in the primary assemblies."
          },
          {
            "title": "Property and public relief",
            "text": "The declaration wrote property and society's debt of subsistence side by side."
          },
          {
            "title": "The Maximum",
            "text": "Prices of necessities and wages each received a ceiling based on 1790."
          }
        ]
      },
      "diagram": {
        "kind": "contrast",
        "ko": {
          "title": "1793년의 두 법문",
          "left": {
            "heading": "헌법과 권리 선언 · 6월 24일",
            "rows": [
              "승인됐지만 시행되지 않았습니다.",
              "소유권(제16조)과 공공 구호의 채무(제21조)를 원칙으로 적었습니다.",
              "생계를 노동 제공과 생존 수단 보장으로 약속했습니다."
            ]
          },
          "right": {
            "heading": "일반 최고가격법 · 9월 29일",
            "rows": [
              "제정되어 이듬해 9월까지의 상한을 정했습니다.",
              "소유를 없애지 않고 거래 가격과 임금의 한도를 정했습니다.",
              "가격은 1790년 값에 3분의 1, 임금은 절반을 더한 선까지 허용했습니다."
            ]
          }
        },
        "en": {
          "title": "Two texts of 1793",
          "left": {
            "heading": "Constitution and declaration · 24 June",
            "rows": [
              "Approved but never applied.",
              "It set property (Art. 16) and the debt of public relief (Art. 21) as principles.",
              "It promised subsistence through work or the means of existence."
            ]
          },
          "right": {
            "heading": "General Maximum · 29 September",
            "rows": [
              "Enacted, with ceilings running to the following September.",
              "It left ownership in place and limited trading prices and wages.",
              "Prices could reach 1790 plus a third, wages 1790 plus a half."
            ]
          }
        }
      },
      "lessons": [
        {
          "id": "french-revolution-intro-ch03-basic",
          "level": "basic",
          "title": {
            "ko": "1793년 공화국은 생존의 권리를 어떻게 약속했을까?",
            "en": "How did the Republic of 1793 promise a right to exist?"
          },
          "questions": [
            {
              "id": "q1",
              "type": "multiple_choice",
              "points": 2,
              "prompt": {
                "ko": "로베스피에르는 1792년 12월 생필품 연설에서 식량 가운데 어느 부분을 상업의 자유에 맡길 수 있다고 했을까요?",
                "en": "In his speech on subsistence of December 1792, which part of the food supply did Robespierre say could be left to freedom of trade?"
              },
              "choices": {
                "ko": [
                  "모두의 생존에 필요한 몫을 채우고 남은 잉여분만 상업의 자유에 맡길 수 있다고 했습니다.",
                  "어떤 부분도 맡길 수 없으며, 곡물 상업을 없애고 수확 전체를 국가가 거두어 배급해야 한다고 했습니다.",
                  "전부 맡길 수 있으며, 다만 굶주린 사람이 있는 지역에서는 정부가 가격을 대신 치러 주어야 한다고 했습니다."
                ],
                "en": [
                  "Only the surplus left after everyone's share for survival could be left to freedom of trade.",
                  "No part could; the grain trade should be abolished and the state should collect and ration the whole harvest.",
                  "All of it could; the government should simply pay the price for the hungry in districts where people were starving."
                ]
              },
              "answer": 0,
              "choiceFeedback": {
                "ko": [
                  "그는 생명 유지에 꼭 필요한 것은 사회 전체의 공동 재산이고 \"개인의 재산이 되어 상인들의 영업에 맡겨지는 것은 잉여분뿐\"이라고 했습니다.",
                  "로베스피에르는 자신이 상업을 파괴하는 것이 아니라 독점자의 약탈을 파괴한다고 했고, 지주와 경작자에게 노동의 값을 보장하라고 했습니다.",
                  "그는 무제한의 자유가 독점의 변명이요 원인이라고 비판했습니다. 문제를 가격 보조가 아니라 곡물의 유통을 막는 사재기에서 찾았습니다."
                ],
                "en": [
                  "He said what is indispensable to life is the common property of society, and \"only the surplus is individual property, left to the industry of merchants\".",
                  "Robespierre said he was destroying not commerce but the monopolist's plunder, and asked that owners and cultivators be guaranteed the price of their labour.",
                  "He attacked unlimited freedom as the excuse and cause of monopoly. He located the problem not in prices to be subsidized but in hoarding that blocked the circulation of grain."
                ]
              },
              "explanation": {
                "ko": "로베스피에르의 출발점은 사회의 목적이 사람의 불멸의 권리를 지키는 것이고, 그 첫째가 존재할 권리라는 주장입니다. 여기서 그는 식량을 두 층으로 나눕니다. 모든 구성원이 살아가는 데 필요한 몫은 사회 전체의 공동 재산이고, 그것을 넘는 잉여분은 개인의 재산으로 상업의 자유에 맡겨집니다. 그래서 그의 요구는 곡물 상업의 폐지가 아니라 생존에 필요한 몫이 사재기에 막히지 않게 하는 규율이었습니다. 그는 스스로 빈민이 아니라 재산 소유자와 상인들의 대의를 변호한다고 말했습니다. 연설을 사유재산 폐지론으로 읽으면 이 잉여분의 구분을 놓치게 됩니다.",
                "en": "Robespierre started from the claim that the purpose of society is to protect the imprescriptible rights of man, the first of which is the right to exist. From there he divided food into two layers. The share every member needs to live is the common property of society as a whole; the surplus beyond it is individual property left to freedom of trade. His demand was therefore not the abolition of the grain trade but rules ensuring that the share needed for life was not locked up by hoarding. He even said he was pleading the cause not of the poor but of property owners and merchants themselves. Reading the speech as a case for abolishing private property misses this division of the surplus."
              },
              "source": {
                "kind": "reference",
                "href": "/commulingo/docs/france-subsistence-and-equality-1792-1796#robespierre-subsistence-1792",
                "label": {
                  "ko": "로베스피에르, 생필품에 관한 의견(1792년 12월 2일)",
                  "en": "Robespierre, Opinion on Subsistence (2 December 1792)"
                }
              }
            },
            {
              "id": "q2",
              "type": "multiple_choice",
              "points": 2,
              "prompt": {
                "ko": "로베스피에르가 곡물 사재기를 막기 위해 그 연설에서 내놓은 구체적 방안은 무엇이었을까요?",
                "en": "What concrete measures against grain hoarding did Robespierre put forward in that speech?"
              },
              "choices": {
                "ko": [
                  "지역별 수확량을 확인하고, 곡물 상인이 시장에서 팔게 하며, 밤에 산 곡물의 운송을 금지하자고 했습니다.",
                  "모든 생필품과 임금에 1790년 수준을 기준으로 한 전국 상한을 정하고, 어긴 사람을 혐의자 명단에 올리자고 했습니다.",
                  "곡물 수출을 완전히 자유화해 값이 오르면 공급이 저절로 늘게 하고, 소요를 일으킨 주민은 군대로 진압하자고 했습니다."
                ],
                "en": [
                  "Check each district's harvest, oblige grain dealers to sell in the market, and forbid transporting grain bought at night.",
                  "Set nationwide ceilings on all necessities and wages based on 1790 levels and put violators on the list of suspects.",
                  "Free grain exports entirely so that rising prices would draw supply, and put down rioting inhabitants with troops."
                ]
              },
              "answer": 0,
              "choiceFeedback": {
                "ko": [
                  "그는 정체의 원인을 비밀, 무제한의 자유, 처벌 면제로 꼽고, 비밀에 맞서 수확량 확인과 시장 판매 강제, 야간 운송 금지라는 두 가지 간단한 방안을 들었습니다.",
                  "1790년 기준의 가격·임금 상한과 혐의자 명단 등재는 열 달 뒤인 1793년 9월 일반 최고가격법의 조문입니다. 1792년 12월 연설은 가격표가 아니라 유통 감시를 요구했습니다.",
                  "로베스피에르는 제헌의회의 무제한 상업 자유와 굶주림을 누르는 총검을 비판했고, 총검의 사용을 잔학 행위라고 불렀습니다."
                ],
                "en": [
                  "He named secrecy, unlimited freedom and impunity as the causes of stagnation, and against secrecy proposed two simple measures: checking harvests, and forcing sale in the market with no night transport.",
                  "Price and wage ceilings based on 1790 and listing violators as suspects are articles of the General Maximum of September 1793, ten months later. The December 1792 speech asked for oversight of circulation, not a price schedule.",
                  "Robespierre attacked the Constituent Assembly's unlimited freedom of trade and the bayonets used to suppress hunger, calling the use of bayonets an atrocity."
                ]
              },
              "explanation": {
                "ko": "로베스피에르는 기근이 인위적이라고 보았습니다. 프랑스 땅은 주민을 먹이고도 남을 만큼 생산하는데, 곡물이 소수의 창고에 쌓여 유통되지 않는다는 것입니다. 그는 식량을 민중의 피에 비유하며 피가 온몸을 돌아야 하듯 곡물도 막힘없이 돌아야 한다고 했고, 막힘의 원인으로 비밀, 무제한의 자유, 처벌 면제를 들었습니다. 그래서 내놓은 방안은 수확량을 드러내고, 시장에서 대낮에 팔게 하며, 야간 운송을 막는 유통 감시였습니다. 가격 자체에 상한을 두는 방식은 이 연설의 제안이 아니라, 1793년 9월 일반 최고가격법에서 법으로 나타났습니다. 두 문서를 섞으면 연설의 논점이 가격 통제로 바뀌어 버립니다.",
                "en": "Robespierre considered the famine artificial: French land produced more than enough to feed its people, but grain piled up in a few warehouses and did not circulate. Comparing food to the people's blood, which must flow through the whole body, he named secrecy, unlimited freedom and impunity as the causes of blockage. His remedies were therefore oversight of circulation: reveal harvests, make sales happen openly in the market, and stop night transport. Capping prices themselves was not proposed in this speech; it appeared in law with the General Maximum of September 1793. Mixing the two texts turns the speech's argument into one about price control."
              },
              "source": {
                "kind": "reference",
                "href": "/commulingo/docs/france-subsistence-and-equality-1792-1796#robespierre-subsistence-1792",
                "label": {
                  "ko": "로베스피에르, 생필품에 관한 의견(1792년 12월 2일)",
                  "en": "Robespierre, Opinion on Subsistence (2 December 1792)"
                }
              }
            },
            {
              "id": "q3",
              "type": "multiple_choice",
              "points": 2,
              "prompt": {
                "ko": "1793년 헌법 제4조는 시민권을 행사할 사람을 1791년 헌법의 능동시민과 어떻게 다르게 정했을까요?",
                "en": "How did Article 4 of the 1793 constitution define those who could exercise citizenship differently from the active citizens of 1791?"
              },
              "choices": {
                "ko": [
                  "납세 조건 없이 21세 이상 남성에게 인정했고, 1년 거주 등 조건을 갖춘 외국인도 포함했습니다.",
                  "납세 조건을 없애고 21세 이상의 모든 성인 남녀에게 인정했으며, 외국인은 입법부가 공로를 인정할 때만 포함했습니다.",
                  "나이만 25세에서 21세로 낮추었고, 3일 치 노동 가치의 직접세를 내야 한다는 조건은 그대로 두었습니다."
                ],
                "en": [
                  "It granted it to men of 21 or over with no tax qualification, and included foreigners meeting conditions such as a year's residence.",
                  "It abolished the tax qualification and granted it to all adult men and women over 21, admitting foreigners only when the legislature recognized their merit.",
                  "It only lowered the age from 25 to 21, keeping the requirement to pay direct tax worth three days' labour."
                ]
              },
              "answer": 0,
              "choiceFeedback": {
                "ko": [
                  "제4조는 프랑스에서 태어나 거주하는 21세 이상 모든 남성과, 1년 전부터 거주하며 노동으로 생계를 유지하거나 재산을 취득하는 등의 외국인에게 시민권 행사를 인정했습니다.",
                  "제4조의 대상은 남성이었고 여성은 포함되지 않았습니다. 외국인도 인류에 공헌했다고 입법부가 판단한 경우 외에 거주·노동·결혼 등 여러 길이 있었습니다.",
                  "1793년 헌법은 나이뿐 아니라 납세 조건 자체를 없앴습니다. 3일 치 노동 가치의 직접세는 1791년 능동시민의 조건이었습니다."
                ],
                "en": [
                  "Article 4 granted citizenship to every man of 21 or over born and living in France, and to foreigners resident for a year who lived by their labour, acquired property and so on.",
                  "Article 4 covered men; women were not included. Foreigners had several routes through residence, labour or marriage, besides being judged by the legislature to have served humanity.",
                  "The 1793 constitution dropped the tax qualification itself, not only the age limit. Direct tax worth three days' labour was a condition for active citizens in 1791."
                ]
              },
              "explanation": {
                "ko": "1791년 헌법은 모든 권력이 국민에게서 나온다고 하면서도 1차 집회에 나갈 능동시민에게 25세 이상, 3일 치 노동 가치의 직접세 납부, 임금 받는 하인이 아닐 것 같은 조건을 붙였습니다. 1793년 헌법 제4조는 이 납세 조건을 없애고, 프랑스에서 태어나 거주하는 21세 이상 모든 남성에게 시민권 행사를 인정했습니다. 외국인도 1년 거주하며 노동으로 생계를 잇거나 재산을 취득하거나 프랑스 여성과 결혼하거나 아이를 입양하거나 노인을 부양하면 포함되었습니다. 재산에 따른 구분은 사라졌지만 성별의 경계는 남았습니다. 그리고 이 규정은 승인된 헌법의 법문일 뿐, 이 헌법은 시행되지 않았습니다.",
                "en": "The 1791 constitution declared that all powers come from the nation, yet required active citizens attending primary assemblies to be 25 or older, to pay direct tax worth three days' labour, and not to be wage-earning servants. Article 4 of the 1793 constitution removed the tax qualification and granted the exercise of citizenship to every man of 21 or over born and living in France. Foreigners were included if, after a year's residence, they lived by their labour, acquired property, married a Frenchwoman, adopted a child or supported an old person. The property line disappeared, but the line of sex remained. And this was the text of an approved constitution that was never applied."
              },
              "source": {
                "kind": "reference",
                "href": "/commulingo/docs/france-constitutions-and-republic-1791-1793#france-constitution-1793--sec-6",
                "label": {
                  "ko": "1793년 헌법 제4조(시민의 지위)",
                  "en": "Constitution of 1793, Article 4 (status of citizens)"
                }
              }
            },
            {
              "id": "q4",
              "type": "multiple_choice",
              "points": 2,
              "prompt": {
                "ko": "1793년 헌법에서 입법부가 제안한 법률안은 어떤 절차를 거쳐 법률이 되었고, 1791년 헌법의 국왕 거부권과는 무엇이 달랐을까요?",
                "en": "Under the 1793 constitution, by what procedure did a bill proposed by the legislature become law, and how did this differ from the king's veto of 1791?"
              },
              "choices": {
                "ko": [
                  "40일 안에 기초의회의 충분한 이의가 없으면 법률이 되었고, 법을 멈출 권한이 왕에게서 기초의회로 옮겨졌습니다.",
                  "모든 법률안이 전국 기초의회의 과반 찬성을 얻어야 했고, 국왕 거부권은 인민의 절대 거부권으로 바뀌었습니다.",
                  "입법부 의결 뒤 집행평의회가 정지적 거부권을 행사했으므로, 1791년 국왕의 거부권을 평의회가 이어받았습니다."
                ],
                "en": [
                  "It became law unless enough primary assemblies objected within forty days; the power to halt a law passed from the king to the primary assemblies.",
                  "Every bill needed a majority vote of the primary assemblies across the country, turning the king's veto into an absolute popular veto.",
                  "After the legislature voted, the Executive Council used a suspensive veto, so the council inherited the king's veto of 1791."
                ]
              },
              "answer": 0,
              "choiceFeedback": {
                "ko": [
                  "제58~59조에 따라 법률안은 모든 코뮌에 보내지고, 40일 뒤 과반 데파르트망에서 기초의회 10분의 1이 이의를 내지 않으면 법률이 되었습니다. 이의가 있으면 입법부가 기초의회를 소집했습니다(제60조).",
                  "찬성 투표가 기본 절차는 아니었습니다. 이의가 없으면 그대로 법률이 되었고, 충분한 이의가 있을 때 기초의회가 소집되었습니다.",
                  "집행평의회는 입법부의 법률과 법령을 집행할 때만 행동할 수 있었고(제65조) 거부권을 갖지 않았습니다."
                ],
                "en": [
                  "Under Articles 58–59 the bill was sent to every commune and became law if, after forty days, a tenth of the primary assemblies in half the departments plus one had not objected. If they did, the legislature convened the primary assemblies (Article 60).",
                  "A vote of approval was not the default. Without objection the bill simply became law; only sufficient objection led to the primary assemblies being convened.",
                  "The Executive Council could act only to execute the legislature's laws and decrees (Article 65) and had no veto."
                ]
              },
              "explanation": {
                "ko": "1791년 헌법에서 왕은 입법부의 법령에 동의를 거부할 수 있었고, 그 거부는 뒤이은 두 입법기가 같은 법령을 다시 낼 때까지 효력을 가졌습니다. 1793년 헌법은 이 자리에 인민을 두었습니다. 제10조는 인민이 법률에 관해 심의한다고 했고, 제58~60조가 방법을 정했습니다. 법률안은 인쇄되어 모든 코뮌에 보내지고, 40일 동안 과반 데파르트망에서 기초의회 10분의 1이 이의를 내지 않으면 법률이 됩니다. 기본값은 승인이고, 인민의 몫은 멈춰 세우는 권한이었습니다. 집행평의회는 법률을 집행할 뿐 거부권이 없었습니다. 다만 이 절차는 설계였을 뿐 한 번도 운영되지 않았습니다.",
                "en": "Under the 1791 constitution the king could refuse assent to the legislature's decrees, and his refusal held until the two following legislatures presented the same decree again. The 1793 constitution put the people in that place. Article 10 said the people deliberate on laws, and Articles 58–60 set the method: a bill was printed and sent to every commune and became law unless, within forty days, a tenth of the primary assemblies in half the departments plus one objected. Approval was the default; the people's share was the power to halt. The Executive Council only executed laws and held no veto. But this procedure remained a design and never operated."
              },
              "source": {
                "kind": "reference",
                "href": "/commulingo/docs/france-constitutions-and-republic-1791-1793#france-constitution-1793--sec-14",
                "label": {
                  "ko": "1793년 헌법 제56~60조(법률의 제정)",
                  "en": "Constitution of 1793, Articles 56–60 (making of laws)"
                }
              }
            },
            {
              "id": "q5",
              "type": "multiple_choice",
              "points": 2,
              "prompt": {
                "ko": "1793년 권리 선언 제16조와 제21조는 소유권과 생계를 각각 어떻게 규정했을까요?",
                "en": "How did Articles 16 and 21 of the 1793 declaration of rights each treat property and subsistence?"
              },
              "choices": {
                "ko": [
                  "제16조는 재산과 노동의 결실을 누리고 처분할 권리를, 제21조는 노동이나 생존 수단을 보장할 사회의 채무를 규정했습니다.",
                  "제16조는 생존에 필요한 식량을 사회의 공동 재산으로 규정했고, 제21조는 잉여분만 상업의 자유에 맡긴다고 했습니다.",
                  "제16조는 소유권을 인정했고, 제21조는 소득과 관계없이 모든 시민에게 같은 생활비를 지급할 의무를 규정했습니다."
                ],
                "en": [
                  "Article 16 gave the right to enjoy and dispose of one's goods and labour; Article 21 made it society's debt to provide work or means of existence.",
                  "Article 16 declared the food needed for life common property of society, and Article 21 left only the surplus to freedom of trade.",
                  "Article 16 recognized property, and Article 21 obliged society to pay every citizen the same living allowance regardless of income."
                ]
              },
              "answer": 0,
              "choiceFeedback": {
                "ko": [
                  "제16조는 소유권을 재산·수입·노동과 생업의 결실을 뜻대로 누리고 처분하는 권리로, 제21조는 공공 구호를 신성한 채무로 규정했습니다.",
                  "식량의 공동 재산과 잉여분 구분은 로베스피에르의 1792년 연설에 나오는 논증입니다. 1793년 권리 선언은 그 구분을 조문으로 옮기지 않았습니다.",
                  "제21조의 대상은 모든 시민이 아니라 불행한 시민과 노동할 수 없는 사람이었고, 방법도 일률 지급이 아니라 노동 제공과 생존 수단 보장이었습니다."
                ],
                "en": [
                  "Article 16 defined property as the right to enjoy and dispose freely of one's goods, income and the fruit of one's labour and industry; Article 21 called public relief a sacred debt.",
                  "Common property in food and the surplus left to trade come from Robespierre's speech of 1792. The 1793 declaration did not turn that distinction into an article.",
                  "Article 21 addressed unfortunate citizens and those unable to work, not every citizen, and its means were work or the means of existence, not a uniform payment."
                ]
              },
              "explanation": {
                "ko": "1793년 권리 선언은 소유권과 생계를 한 문서 안에 나란히 두었습니다. 제16조는 소유권을 모든 시민이 자기 재산, 수입, 노동과 생업의 결실을 누리고 뜻대로 처분하는 권리로 규정했고, 제19조는 정당한 사전 보상 없이 재산을 빼앗을 수 없다고 했습니다. 제21조는 공공 구호를 신성한 채무로 선언하고, 사회가 불행한 시민에게는 노동을, 노동할 수 없는 사람에게는 생존 수단을 보장해야 한다고 했습니다. 생계의 보장은 재산 몰수가 아니라 사회의 의무로 표현되었습니다. 로베스피에르의 연설과 방향은 닮았지만, 식량을 공동 재산이라 부르는 그의 논증이 조문에 들어간 것은 아닙니다.",
                "en": "The 1793 declaration placed property and subsistence side by side in one text. Article 16 defined property as every citizen's right to enjoy and dispose at will of his goods, income and the fruit of his labour and industry, and Article 19 forbade taking property without just and prior compensation. Article 21 declared public relief a sacred debt: society must provide work to unfortunate citizens and the means of existence to those unable to work. Subsistence was framed as a duty of society, not as confiscation. The direction resembles Robespierre's speech, but his argument calling food common property did not enter the articles."
              },
              "source": {
                "kind": "reference",
                "href": "/commulingo/docs/france-constitutions-and-republic-1791-1793#france-constitution-1793--sec-2",
                "label": {
                  "ko": "1793년 인간과 시민의 권리 선언 제16·19·21조",
                  "en": "Declaration of the Rights of Man and of the Citizen of 1793, Articles 16, 19 and 21"
                }
              }
            },
            {
              "id": "q6",
              "type": "multiple_choice",
              "points": 2,
              "prompt": {
                "ko": "1793년 9월 일반 최고가격법은 생필품 가격과 임금의 상한을 각각 어떤 기준으로 정했을까요?",
                "en": "By what standard did the General Maximum of September 1793 set the ceilings on the prices of necessities and on wages?"
              },
              "choices": {
                "ko": [
                  "가격은 대부분 1790년 값에 3분의 1을, 임금은 1790년 수준에 절반을 더한 값을 넘지 못하게 했습니다.",
                  "가격은 대부분 1790년 값에 절반을, 임금은 1790년 수준에 3분의 1을 더한 값을 넘지 못하게 했습니다.",
                  "가격은 1790년 값 그대로 묶었고, 임금에는 상한을 두지 않아 노동자가 자유롭게 올려 받을 수 있게 했습니다."
                ],
                "en": [
                  "Most prices could not exceed the 1790 price plus a third, and wages the 1790 level plus a half.",
                  "Most prices could not exceed the 1790 price plus a half, and wages the 1790 level plus a third.",
                  "Prices were frozen at their 1790 level, while wages had no ceiling so that workers could raise them freely."
                ]
              },
              "answer": 0,
              "choiceFeedback": {
                "ko": [
                  "제3조는 제1조의 생필품 대부분을 1790년 가격에 3분의 1을 더한 금액으로, 제8조는 임금을 1790년 요율에 절반을 더한 금액으로 정했습니다. 장작·목탄·석탄은 제2조에 따로 20분의 1이 붙었습니다.",
                  "두 비율이 뒤바뀌었습니다. 상품에 붙은 것이 3분의 1, 임금에 붙은 것이 절반이었습니다.",
                  "제8조는 임금에도 분명히 상한을 두었고, 제9조는 정당한 이유 없이 일을 거부하는 노동자를 징발하고 구금할 수 있게 했습니다."
                ],
                "en": [
                  "Article 3 set most necessities in Article 1 at the 1790 price plus a third, and Article 8 set wages at the 1790 rate plus a half. Firewood, charcoal and coal received a separate one-twentieth in Article 2.",
                  "The two ratios are reversed: goods received a third, wages a half.",
                  "Article 8 plainly capped wages too, and Article 9 allowed workers refusing their usual work without good reason to be requisitioned and detained."
                ]
              },
              "explanation": {
                "ko": "일반 최고가격법은 1793년 헌법과 달리 실제로 제정된 법이었습니다. 제1조는 고기·버터·포도주·장작·소금·비누·가죽·직물 등 생필품과 상품을 열거했고, 제3조는 그 대부분의 최고 가격을 이듬해 9월까지 1790년 가격에 3분의 1을 더한 값으로 정했습니다. 제8조는 임금에도 1790년 수준에 절반을 더한 상한을 두었고, 제9조는 일을 거부하는 노동자를 징발할 수 있게 했습니다. 최고가를 넘겨 사고판 사람은 벌금과 함께 혐의자 명단에 올랐습니다(제7조). 이 법은 소유를 폐지하지 않고 거래의 한도를 정했습니다. 노동자의 생활이 나아졌는지는 이 비율만으로 알 수 없고, 실제 가격과 공급, 집행을 따로 확인해야 합니다.",
                "en": "Unlike the 1793 constitution, the General Maximum was a law actually enacted. Article 1 listed necessities and goods such as meat, butter, wine, firewood, salt, soap, leather and cloth, and Article 3 set the maximum price of most of them, until the following September, at the 1790 price plus a third. Article 8 capped wages too, at the 1790 level plus a half, and Article 9 allowed workers who refused their work to be requisitioned. Anyone buying or selling above the maximum was fined and placed on the list of suspects (Article 7). The law did not abolish ownership; it set limits on exchange. Whether workers' lives improved cannot be read from these ratios alone; actual prices, supply and enforcement must be checked separately."
              },
              "source": {
                "kind": "reference",
                "href": "/commulingo/docs/france-subsistence-and-equality-1792-1796#france-general-maximum-law-1793--sec-8",
                "label": {
                  "ko": "일반최고가격법(1793년 9월 29일) 제3·8조",
                  "en": "Law of the General Maximum (29 September 1793), Articles 3 and 8"
                }
              }
            }
          ]
        }
      ]
    },
    {
      "id": "french-revolution-intro-ch04",
      "volumeNumber": 11,
      "chapterNumber": 7,
      "partNumber": 2,
      "partTitle": {
        "ko": "제2부 · 공화정과 혁명정부",
        "en": "Part II · Republic and revolutionary government"
      },
      "title": {
        "ko": "공포정치는 어떤 기구와 법으로 작동했을까?",
        "en": "Through which institutions and laws did the Terror operate?"
      },
      "sourceUrl": "/commulingo/docs/france-revolutionary-government-and-justice-1793-1794",
      "summary": {
        "ko": "약 12분 · 국민공회와 두 위원회, 감시위원회와 혁명재판소가 나눠 맡은 일, 혐의자법(1793년 9월 17일)의 구금 조문, 로베스피에르의 1794년 2월 5일 보고, 프레리알 22일 법령(1794년 6월 10일)의 재판 조문을 차례로 읽습니다.",
        "en": "About 12 minutes · Follow how the Convention, its two committees, the surveillance committees, and the Revolutionary Tribunal divided the work, then read the detention articles of the Law of Suspects (17 September 1793), Robespierre’s report of 5 February 1794, and the trial articles of the decree of 22 Prairial (10 June 1794)."
      },
      "learningFocus": {
        "ko": "혐의자법의 체포를 곧 사형 판결로, 프레리알 법령의 절차를 혐의자법에 붙여 읽는 실수가 가장 흔합니다. 구금을 정한 법과 재판을 정한 법, 그리고 둘을 정당화한 보고의 문장을 따로 확인하세요.",
        "en": "The commonest slips are reading an arrest under the Law of Suspects as a death sentence, or attaching the Prairial trial rules to the Law of Suspects. Check separately the law on detention, the law on trial, and the report that justified both."
      },
      "conceptBrief": {
        "ko": [
          {
            "title": "혁명정부의 기구: 누가 체포하고 누가 재판했나",
            "items": [
              "1793년 3월 혁명재판소, 4월 6일 공안위원회가 설치됐고, 10월 10일 국민공회는 평화가 올 때까지 정부를 혁명적으로 운영하기로 했습니다. 1793년 헌법의 통상 통치체제는 시행되지 않았습니다.",
              "국민공회는 법령을 만들고 위원을 뽑고 파견의원에게 임무를 주었습니다. 공안위원회는 전쟁과 집행을 조정했고, 일반안전위원회(치안위원회)는 감시와 치안을 맡아 지역 감시위원회가 보낸 체포 명단을 받았습니다.",
              "지역 감시위원회는 혐의자 명단을 만들고 영장을 발부했으며, 혁명재판소는 회부된 사건을 공소관·배심원·판사가 나눠 심리했습니다. 체포와 재판은 서로 다른 기관, 서로 다른 법의 일이었습니다.",
              "로베스피에르는 공안위원회의 가장 영향력 있는 위원 가운데 하나였고 공포를 공개적으로 정당화했습니다. 그러나 이 체제는 국민공회가 만든 여러 기구를 거쳐 작동했으므로 그 한 사람의 명령으로 줄일 수 없습니다."
            ]
          },
          {
            "title": "혐의자법: 범죄 입증에서 정치적 신뢰의 심사로",
            "items": [
              "제2조는 행동뿐 아니라 관계·발언·글로 자유의 적임이 드러난 자, 생계 수단과 시민적 의무 이행을 증명하지 못한 자, 충성 증명서를 거부당한 자, 애착을 꾸준히 보이지 않은 이전 귀족과 망명자 가족을 혐의자로 보았습니다.",
              "제4조는 감시위원 7인 이상이 모여 절대다수가 찬성해야 체포를 명하게 했습니다. 제7조는 평화가 올 때까지 구금하고, 제8조는 감시 비용을 구금자에게 물렸으며, 제10조는 불기소나 무죄 판결을 받은 자도 계속 구금할 수 있게 했습니다."
            ]
          },
          {
            "title": "정치적 도덕 보고: 덕과 공포",
            "items": [
              "1794년 2월 5일 로베스피에르는 공안위원회 이름으로, 평시 민중 정부의 원동력은 덕이지만 혁명 시에는 덕과 공포 둘 다라고 했습니다. 덕 없는 공포는 해롭고, 공포 없는 덕은 무력하다는 것입니다.",
              "그는 공포를 신속하고 엄격하며 굽히지 않는 정의, 곧 덕의 발현으로 규정했습니다. 공포를 평화로운 시민에게 돌린 남용은 규탄했지만, 그 때문에 엄격함을 버리자는 결론은 거부했고, 나약함으로 모는 파벌과 과도함으로 모는 파벌을 같은 목표의 공범으로 묶었습니다."
            ]
          },
          {
            "title": "프레리알 22일 법령과 파리의 처형",
            "items": [
              "쿠통이 제출해 1794년 6월 10일 채택된 법령은 인민의 적에 여론을 그릇되게 이끌거나 풍속을 타락시키려 한 자까지 넣고(제6조), 관할 범죄의 형을 사형으로 정했습니다(제7조).",
              "물질적이든 정신적이든 모든 자료와 조국애로 깨우쳐진 배심원의 양심이 판단 기준이 됐고(제8조), 다른 증거가 있으면 증인을 심문하지 않을 수 있었으며(제13조), 음모자에게는 변호인을 허용하지 않았습니다(제16조). 공개 심문을 정한 제12조도 같은 법령에 있습니다.",
              "라루스의 집계로 6월 10일부터 7월 26일까지 파리에서 1,376명이 처형됐습니다. 파리 한 곳의 재판·처형 수이며, 방데나 지방 진압의 사망자를 합한 전국 수치와는 범위가 다릅니다. 6월 26일 플뢰뤼스 승리로 대외 형세가 나아지던 때였습니다."
            ]
          },
          {
            "title": "근거 자료",
            "items": [
              "『프랑스 혁명 문헌집: 혁명정부와 재판』: 혐의자법 제1~10조, 로베스피에르 「정치적 도덕의 원칙에 관한 보고」, 프레리알 22일 법령 제1~21조.",
              "『프랑스 혁명의 세력 관계와 혁명정부, 1791–1794』 제4·5·7·9절: 기구의 역할, 혐의자법과 프레리알 법령의 절차, 파리 처형 집계."
            ]
          }
        ],
        "en": [
          {
            "title": "The institutions: who arrested and who tried",
            "items": [
              "The Revolutionary Tribunal was set up in March 1793 and the Committee of Public Safety on 6 April; on 10 October the Convention declared the government revolutionary until the peace. The ordinary system of the 1793 Constitution was never put into effect.",
              "The Convention made decrees, elected committee members, and gave representatives on mission their tasks. The Committee of Public Safety coordinated war and execution, while the Committee of General Security handled surveillance and policing and received the arrest lists sent by local surveillance committees.",
              "Local surveillance committees drew up lists of suspects and issued warrants; the Revolutionary Tribunal heard referred cases through a public prosecutor, jurors, and judges. Arrest and trial belonged to different bodies and different laws.",
              "Robespierre was among the most influential members of the Committee of Public Safety and publicly justified terror. Yet the system ran through several bodies created by the Convention, so it cannot be reduced to his orders."
            ]
          },
          {
            "title": "The Law of Suspects: from proving crimes to vetting loyalty",
            "items": [
              "Article 2 counted as suspects those shown by conduct, connections, words, or writings to be enemies of liberty, those unable to prove their means of living and civic duties, those refused certificates of civic loyalty, and former nobles and émigrés’ relatives who had not constantly shown attachment.",
              "Article 4 required at least seven committee members and an absolute majority to order an arrest. Article 7 held detainees until the peace, Article 8 made them pay for their guard, and Article 10 allowed even those not charged or acquitted to be kept in detention."
            ]
          },
          {
            "title": "The report on political morality: virtue and terror",
            "items": [
              "On 5 February 1794, for the Committee of Public Safety, Robespierre said the spring of popular government in peace was virtue, but in revolution virtue and terror together: terror without virtue is harmful, virtue without terror powerless.",
              "He defined terror as prompt, severe, inflexible justice, an emanation of virtue. He denounced abuses that turned terror on peaceful citizens but refused to conclude that severity should be dropped, and he cast the faction pushing toward weakness and the one pushing toward excess as accomplices with the same aim."
            ]
          },
          {
            "title": "The decree of 22 Prairial and executions in Paris",
            "items": [
              "Introduced by Couthon and adopted on 10 June 1794, the decree counted among enemies of the people those who misled opinion or corrupted morals (Article 6) and fixed death as the penalty for crimes within the tribunal’s jurisdiction (Article 7).",
              "Any material or moral evidence and the conscience of jurors enlightened by love of country became the standard (Article 8); witnesses need not be heard when other proof existed (Article 13); conspirators were allowed no defenders (Article 16). Article 12, requiring open questioning, stands in the same decree.",
              "By Larousse’s count, 1,376 people were executed in Paris from 10 June to 26 July. That is a Paris count of trials and executions, not a national total including the Vendée or provincial repression. It came as the victory of Fleurus on 26 June improved the military situation."
            ]
          },
          {
            "title": "Sources",
            "items": [
              "French Revolution Documents: Revolutionary Government and Justice: Law of Suspects, Articles 1–10; Robespierre, Report on the Principles of Political Morality; decree of 22 Prairial, Articles 1–21.",
              "Political Forces and Revolutionary Government in France, 1791–1794, sections 4, 5, 7, and 9: the institutions, the procedures of the two laws, and the Paris execution count."
            ]
          }
        ]
      },
      "conceptMap": {
        "ko": [
          {
            "title": "여러 기구",
            "text": "국민공회가 만든 위원회·감시위원회·혁명재판소가 체포와 재판을 나눠 맡았습니다."
          },
          {
            "title": "혐의자법",
            "text": "관계와 발언까지 구금 근거로 삼고 무죄 판결과 석방을 떼어 놓았습니다."
          },
          {
            "title": "덕과 공포",
            "text": "로베스피에르는 공포를 덕에서 나온 신속하고 엄격한 정의로 정당화했습니다."
          },
          {
            "title": "프레리알 법령",
            "text": "형을 사형 하나로 정하고 증인과 변호인을 줄여 재판을 빠르게 만들었습니다."
          }
        ],
        "en": [
          {
            "title": "Several institutions",
            "text": "Committees, surveillance committees, and the Tribunal created by the Convention shared arrest and trial."
          },
          {
            "title": "Law of Suspects",
            "text": "It made connections and words grounds for detention and separated acquittal from release."
          },
          {
            "title": "Virtue and terror",
            "text": "Robespierre justified terror as prompt, severe justice flowing from virtue."
          },
          {
            "title": "Decree of Prairial",
            "text": "It fixed death as the single penalty and cut witnesses and defenders to speed trials."
          }
        ]
      },
      "diagram": {
        "kind": "contrast",
        "ko": {
          "title": "1789년 선언의 사법 조항과 프레리알 22일 법령",
          "left": {
            "heading": "1789년 인권선언",
            "rows": [
              "법률이 정한 경우와 절차에 의하지 않고는 기소·체포·구금할 수 없습니다(제7조).",
              "법률은 엄격하고 명백하게 필요한 형벌만 정해야 합니다(제8조).",
              "유죄 선고 전까지 무죄로 추정합니다(제9조)."
            ]
          },
          "right": {
            "heading": "프레리알 22일 법령",
            "rows": [
              "인민의 적의 범주를 여론과 풍속을 해친 자까지 넓혔습니다(제6조).",
              "관할 범죄에 대한 형은 사형 하나입니다(제7조).",
              "다른 증거가 있으면 증인을 생략하고, 음모자에게는 변호인이 없습니다(제13·16조)."
            ]
          }
        },
        "en": {
          "title": "The judicial articles of 1789 and the decree of 22 Prairial",
          "left": {
            "heading": "Declaration of 1789",
            "rows": [
              "No one may be accused, arrested, or detained except in cases and forms fixed by law (Article 7).",
              "The law must set only strictly and evidently necessary penalties (Article 8).",
              "Everyone is presumed innocent until declared guilty (Article 9)."
            ]
          },
          "right": {
            "heading": "Decree of 22 Prairial",
            "rows": [
              "Enemies of the people include those who mislead opinion or corrupt morals (Article 6).",
              "The single penalty for crimes within its jurisdiction is death (Article 7).",
              "Witnesses may be skipped when other proof exists, and conspirators get no defenders (Articles 13 and 16)."
            ]
          }
        }
      },
      "lessons": [
        {
          "id": "french-revolution-intro-ch04-basic",
          "level": "basic",
          "title": {
            "ko": "공포정치는 어떤 기구와 법으로 작동했을까?",
            "en": "Through which institutions and laws did the Terror operate?"
          },
          "questions": [
            {
              "id": "q1",
              "type": "multiple_choice",
              "points": 2,
              "prompt": {
                "ko": "1793년 가을 한 지역 감시위원회가 이웃 주민을 혐의자로 체포했다면, 혐의자법에 따라 그 뒤 어떤 일이 이어졌을까요?",
                "en": "If a local surveillance committee arrested a neighbour as a suspect in autumn 1793, what followed under the Law of Suspects?"
              },
              "choices": {
                "ko": [
                  "명단·체포 사유·압수 서류가 일반안전위원회로 갔고, 그는 국가 건물에서 평화가 올 때까지 구금됐습니다.",
                  "감시위원회가 그를 곧바로 파리의 혁명재판소에 세웠고, 배심원이 유죄를 인정하면 그 자리에서 사형이 선고됐습니다.",
                  "공안위원회가 감시위원회의 체포 사유를 심사해 한 달 안에 석방할지 혁명재판소에 넘길지를 정했습니다."
                ],
                "en": [
                  "The list, the grounds for arrest, and the seized papers went to the Committee of General Security, and he was held in a national building until the peace.",
                  "The surveillance committee put him straight before the Revolutionary Tribunal, and if the jury found him guilty he was sentenced to death.",
                  "The Committee of Public Safety reviewed the grounds and decided within a month whether to release him or send him to the Tribunal."
                ]
              },
              "answer": 0,
              "choiceFeedback": {
                "ko": [
                  "제9조의 보고 의무와 제6·7조의 이송·구금 기한입니다. 혐의자법은 구금과 보고의 절차를 정한 법입니다.",
                  "혐의자법에는 재판이나 형벌 절차가 없습니다. 혁명재판소 회부와 사형은 재판소 쪽 법령, 특히 프레리알 법령이 다룹니다.",
                  "보고를 받는 곳은 공안위원회가 아니라 일반안전위원회였고, 법에는 한 달 같은 심사 기한이 없이 평화가 올 때까지로 정해져 있었습니다."
                ],
                "en": [
                  "These are the reporting duty of Article 9 and the transfer and term of Articles 6 and 7. The law set detention and reporting procedure.",
                  "The Law of Suspects contains no trial or penalty procedure. Referral to the Tribunal and the death penalty belong to the tribunal laws, above all the Prairial decree.",
                  "Reports went to the Committee of General Security, not Public Safety, and the law set no one-month review, only detention until the peace."
                ]
              },
              "explanation": {
                "ko": "혐의자법에서 감시위원회의 일은 명단 작성, 영장 발부, 서류 봉인이었습니다(제3조). 체포된 사람은 구치소나 자기 거처에 있다가 8일 안에 국가 건물로 옮겨져 평화가 올 때까지 그곳에 남았고(제5~7조), 감시위원회는 명단·사유·서류를 일반안전위원회에 보냈습니다(제9조). 체포가 곧 사형 판결로 이어졌다고 생각하기 쉽지만, 재판은 혁명재판소가 따로 맡았고 그 절차는 다른 법령이 정했습니다. 오히려 재판 없이도 석방 시점을 알 수 없는 구금이 이 법의 핵심적인 효과였습니다.",
                "en": "Under the Law of Suspects the surveillance committee drew up lists, issued warrants, and sealed papers (Article 3). The arrested person went to a jail or stayed guarded at home, was moved within eight days to a national building, and stayed there until the peace (Articles 5–7), while the committee sent the list, grounds, and papers to the Committee of General Security (Article 9). It is tempting to think arrest led straight to a death sentence, but trial belonged to the Revolutionary Tribunal under other laws. The law’s main effect was open-ended detention with no trial at all."
              },
              "source": {
                "kind": "reference",
                "href": "/commulingo/docs/france-revolutionary-government-and-justice-1793-1794#france-law-of-suspects-1793--sec-1",
                "label": {
                  "ko": "혐의자법 제3~9조(1793년 9월 17일)",
                  "en": "Law of Suspects, Articles 3–9 (17 September 1793)"
                }
              }
            },
            {
              "id": "q2",
              "type": "multiple_choice",
              "points": 2,
              "prompt": {
                "ko": "혐의자법 제10조는 형사재판에서 불기소되거나 무죄 판결을 받은 사람을 어떻게 다루게 했을까요?",
                "en": "How did Article 10 of the Law of Suspects treat people who were not charged or were acquitted in criminal court?"
              },
              "choices": {
                "ko": [
                  "법원이 필요하다고 보면 그들을 계속 구금 상태로 두고 혐의자 구금 시설로 보낼 수 있게 했습니다.",
                  "그들을 즉시 석방하고, 근거 없이 체포를 요구한 감시위원회 위원을 자의적 조치로 처벌하게 했습니다.",
                  "무죄 판결을 확정하지 않고 혁명재판소에 다시 회부해 사형 여부를 새로 심리하게 했습니다."
                ],
                "en": [
                  "Courts could, if they thought it necessary, keep them in detention and send them to the suspects’ detention buildings.",
                  "They were to be freed at once, and committee members who had demanded arrest without grounds punished for arbitrary acts.",
                  "Their acquittal was not final; they were referred again to the Revolutionary Tribunal for a fresh hearing on death."
                ]
              },
              "answer": 0,
              "choiceFeedback": {
                "ko": [
                  "제10조의 문장입니다. 재판에서 범죄를 입증하지 못해도 정치적 의심만으로 자유를 계속 제한할 수 있었습니다.",
                  "자의적 조치를 한 자를 처벌한다는 원칙은 테르미도르 뒤 1795년 헌법 권리 선언 제9조의 것이고, 혐의자법은 반대 방향이었습니다.",
                  "제10조는 재심을 정하지 않았습니다. 판결 결과와 상관없이 구금을 이어 가는 것이 이 조문의 내용입니다."
                ],
                "en": [
                  "That is Article 10. Even when a crime could not be proved in court, political suspicion alone could keep a person confined.",
                  "Punishing those who order arbitrary acts is Article 9 of the rights declaration in the 1795 Constitution after Thermidor; the Law of Suspects went the other way.",
                  "Article 10 sets no retrial. Its content is continuing detention whatever the verdict."
                ]
              },
              "explanation": {
                "ko": "제10조는 민사·형사 법원이 불기소 처분이나 무죄 판결을 받은 피의자를 필요하면 구금 상태로 유지하고 혐의자 구금 시설로 보낼 수 있게 했습니다. 여기에 평화가 올 때까지라는 제7조의 기한과 구금자 부담이라는 제8조의 비용이 더해졌습니다. 그래서 이 법의 효과는 사형 선고보다 예방적 구금을 넓히고 재판 결과와 석방을 떼어 놓은 데 있었습니다. 1795년 헌법이 자의적 조치를 한 자를 처벌한다고 쓴 것은 바로 이런 경험에 대한 반작용으로 읽을 수 있습니다.",
                "en": "Article 10 let civil and criminal courts keep suspects who had not been charged or had been acquitted in detention when necessary and send them to the suspects’ buildings. Add Article 7’s term, until the peace, and Article 8’s cost borne by detainees. The law’s effect lay less in death sentences than in widening preventive detention and cutting the link between verdict and release. The 1795 Constitution’s rule that those ordering arbitrary acts are guilty can be read as a reaction to this experience."
              },
              "source": {
                "kind": "reference",
                "href": "/commulingo/docs/france-revolutionary-government-and-justice-1793-1794#france-law-of-suspects-1793--sec-1",
                "label": {
                  "ko": "혐의자법 제7·8·10조(1793년 9월 17일)",
                  "en": "Law of Suspects, Articles 7, 8, and 10 (17 September 1793)"
                }
              }
            },
            {
              "id": "q3",
              "type": "multiple_choice",
              "points": 2,
              "prompt": {
                "ko": "1794년 2월 5일 보고에서 로베스피에르는 덕과 공포의 관계를 어떻게 설명했을까요?",
                "en": "In the report of 5 February 1794, how did Robespierre explain the relation between virtue and terror?"
              },
              "choices": {
                "ko": [
                  "평시의 원동력은 덕이지만 혁명 시에는 덕과 공포 둘 다이며, 덕 없는 공포는 해롭고 공포 없는 덕은 무력하다고 했습니다.",
                  "공포는 덕과 별개인 특수한 원리로서, 전쟁이 끝날 때까지 덕을 잠시 멈추어 두는 예외 조치라고 했습니다.",
                  "공포는 전제정의 원동력이므로, 공화국은 공포를 버리고 덕과 교육만으로 적을 다스려야 한다고 했습니다."
                ],
                "en": [
                  "In peace the spring is virtue, but in revolution it is virtue and terror together; terror without virtue is harmful and virtue without terror powerless.",
                  "Terror was a particular principle separate from virtue, an exception that suspended virtue until the war ended.",
                  "Since terror is the spring of despotism, the Republic should give it up and rule its enemies by virtue and education alone."
                ]
              },
              "answer": 0,
              "choiceFeedback": {
                "ko": [
                  "보고의 중심 문장입니다. 그는 이어서 공포를 신속하고 엄격하며 굽히지 않는 정의, 곧 덕의 발현이라고 규정했습니다.",
                  "그는 반대로 공포가 특수한 원리가 아니라 민주정의 일반 원리에서 나온 결과라고 했습니다. 덕을 멈추는 것이 아니라 덕이 드러나는 방식이라는 것입니다.",
                  "공포가 전제정의 원동력이라는 말은 그가 반론으로 소개한 뒤, 자유의 칼과 폭정의 칼이 닮았을 뿐이라며 물리친 주장입니다."
                ],
                "en": [
                  "That is the report’s central sentence. He went on to define terror as prompt, severe, inflexible justice, an emanation of virtue.",
                  "He said the opposite: terror is not a particular principle but a consequence of democracy’s general principle, a way virtue shows itself rather than its suspension.",
                  "That terror is despotism’s spring is an objection he raised and dismissed, saying the sword of liberty only resembles the sword of tyranny."
                ]
              },
              "explanation": {
                "ko": "로베스피에르는 먼저 평시 민중 정부의 원동력을 조국과 법에 대한 사랑인 덕으로 두고, 혁명 시에는 여기에 공포가 더해진다고 했습니다. 공포를 덕과 다른 비상 원리로 보면 이 논증의 힘을 놓칩니다. 그는 공포를 덕의 발현인 정의로 규정해, 강제력을 공화국의 도덕적 목적 안으로 끌어들였습니다. 그 결과 혁명의 적은 통상적인 정치 경쟁자가 아니라 정의가 벌해야 할 대상이 됩니다. 이것은 당사자의 정당화 논리이지, 각 체포와 재판이 정당했다는 독립적 증거가 아닙니다.",
                "en": "Robespierre first set virtue, love of country and its laws, as the spring of popular government in peace, then said revolution adds terror. Reading terror as an emergency principle separate from virtue misses the force of the argument. By defining terror as justice flowing from virtue, he drew coercion inside the Republic’s moral purpose, so enemies of the Revolution became not ordinary political rivals but objects of justice. This is an actor’s justification, not independent evidence that each arrest or trial was just."
              },
              "source": {
                "kind": "reference",
                "href": "/commulingo/docs/france-revolutionary-government-and-justice-1793-1794#robespierre-political-morality-1794",
                "label": {
                  "ko": "로베스피에르, 정치적 도덕의 원칙에 관한 보고(1794년 2월 5일)",
                  "en": "Robespierre, Report on the Principles of Political Morality (5 February 1794)"
                }
              }
            },
            {
              "id": "q4",
              "type": "multiple_choice",
              "points": 2,
              "prompt": {
                "ko": "같은 보고는 공포의 남용과 혁명 진영 안의 두 파벌을 어떻게 다루었을까요?",
                "en": "How did the same report deal with abuses of terror and with the two factions inside the revolutionary camp?"
              },
              "choices": {
                "ko": [
                  "시민을 추격한 남용은 규탄하되 엄격함을 버리자는 결론은 거부했고, 온건파와 과격파를 같은 목표의 공범으로 묶었습니다.",
                  "남용 주장은 귀족이 지어낸 거짓이라며 부정하고, 초혁명파만이 공화국의 진짜 적이니 온건파는 설득해 되돌리자고 했습니다.",
                  "남용이 드러났으므로 엄격함을 늦추고, 관용을 요구하는 쪽과 손잡아 과격파의 요원들부터 정리하자고 제안했습니다."
                ],
                "en": [
                  "He admitted and denounced abuses against peaceful citizens yet refused to conclude that severity should end, and he cast moderates and ultras as accomplices with one aim.",
                  "He denied the abuses as aristocratic inventions and said only the ultra-revolutionaries were enemies, while moderates should be won back by persuasion.",
                  "Since abuses had come to light, he proposed easing severity and joining those demanding clemency to clear out the ultras’ agents first."
                ]
              },
              "answer": 0,
              "choiceFeedback": {
                "ko": [
                  "그는 「이러한 악용은 존재했다」고 인정했지만 그것이 오히려 엄격함의 필요를 입증한다고 했고, 한 파벌은 나약함으로 다른 파벌은 과도함으로 몬다고 했습니다.",
                  "그는 남용이 귀족 세력에 의해 과장됐을 것이라고 했을 뿐 존재 자체는 인정했고, 두 파벌을 모두 적으로 보았습니다.",
                  "관용과 엄격함 완화는 그가 거부한 결론입니다. 그는 왕당파에게 관용을 외치는 목소리에 「악당들에게 자비를」이라며 맞섰습니다."
                ],
                "en": [
                  "He conceded that such abuses existed but said they proved the need for severity, and that one faction pushed toward weakness, the other toward excess.",
                  "He said the abuses had probably been exaggerated by the aristocracy, but admitted they existed, and he treated both factions as enemies.",
                  "Easing severity and clemency are the conclusions he rejected; he answered calls for clemency to royalists with scorn."
                ]
              },
              "explanation": {
                "ko": "보고는 적에게만 가야 할 공포를 민중에게 돌리고 평화로운 시민을 추격하는 자를 규탄합니다. 그러나 곧바로 그런 박해에서 엄격함을 포기해야 한다고 결론지어서는 안 된다고 말합니다. 이어 내부의 적을 두 군단으로 나누어, 하나는 나약함으로, 다른 하나는 과도함으로 몰지만 목표는 같다고 규정합니다. 이 틀에서는 억압을 줄이자는 요구도, 정부를 더 급진적으로 밀어붙이는 압력도 모두 공화국을 해치는 행위로 설명될 수 있었습니다. 한 달 남짓 뒤 에베르파와 당통파가 차례로 처형된 과정을 이해하는 데 이 논리가 중요합니다.",
                "en": "The report denounces those who turn on the people a terror meant for enemies and who hunt peaceful citizens. But it immediately says such persecution must not lead to giving up severity. It then divides internal enemies into two corps, one pushing toward weakness and one toward excess, but with the same aim. In this frame both demands to reduce repression and pressure to radicalise the government could be described as attacks on the Republic, which matters for understanding the execution of the Hébertists and then the Dantonists a month or so later."
              },
              "source": {
                "kind": "reference",
                "href": "/commulingo/docs/france-revolutionary-government-and-justice-1793-1794#robespierre-political-morality-1794",
                "label": {
                  "ko": "로베스피에르, 정치적 도덕 보고의 남용과 두 파벌 대목(1794년 2월 5일)",
                  "en": "Robespierre, report on political morality, passages on abuses and the two factions (5 February 1794)"
                }
              }
            },
            {
              "id": "q5",
              "type": "multiple_choice",
              "points": 2,
              "prompt": {
                "ko": "1789년 인권선언 제7~9조와 나란히 놓으면, 프레리알 22일 법령의 어느 조문이 선언과 가장 분명하게 어긋날까요?",
                "en": "Set beside Articles 7–9 of the 1789 Declaration, which article of the decree of 22 Prairial most clearly departs from it?"
              },
              "choices": {
                "ko": [
                  "엄격히 필요한 형벌만 정하라는 제8조와 달리, 관할하는 모든 범죄의 형을 사형 하나로 정한 제7조입니다.",
                  "법률이 정한 절차를 요구한 제7조와 달리, 피고를 공개 법정 없이 비공개로만 심문하도록 정한 제12조입니다.",
                  "무죄 추정을 정한 제9조와 달리, 공소관이 기소 사유가 없으면 스스로 사건을 끝내게 한 제18조입니다."
                ],
                "en": [
                  "Unlike Article 8’s strictly necessary penalties, Article 7 fixed death as the single penalty for every crime within its jurisdiction.",
                  "Unlike Article 7’s requirement of legal forms, Article 12 had the accused questioned only in secret.",
                  "Unlike Article 9’s presumption of innocence, Article 18 let the prosecutor close a case himself when he found no grounds."
                ]
              },
              "answer": 0,
              "choiceFeedback": {
                "ko": [
                  "제7조는 관할 범죄에 대한 형이 사형이라고만 씁니다. 유죄가 인정되면 더 가벼운 형을 고를 여지가 없었습니다.",
                  "제12조는 거꾸로 피고를 공개 법정에서 심문하고 비공개 심문을 원칙적으로 폐지했습니다. 공개성 자체는 이 법령이 줄이지 않았습니다.",
                  "제18조는 반대로 공소관이 스스로 피고를 돌려보내지 못하게 하고, 두 위원회의 심사 전에는 누구도 재판에서 빠질 수 없게 했습니다."
                ],
                "en": [
                  "Article 7 simply says the penalty is death. Once guilt was found, no lighter penalty could be chosen.",
                  "Article 12 did the reverse: the accused were questioned in open court and secret questioning was abolished as a rule.",
                  "Article 18 did the reverse: the prosecutor could not release an accused himself, and no one left trial before the two committees reviewed it."
                ]
              },
              "explanation": {
                "ko": "1789년 선언은 법이 정한 절차 없는 체포 금지(제7조), 엄격히 필요한 형벌(제8조), 무죄 추정(제9조)을 약속했습니다. 프레리알 법령은 관할 범죄의 형을 사형 하나로 두어 제8조의 비례 원칙과 가장 정면으로 부딪칩니다. 흔한 오해는 이 법령이 재판을 비밀리에 했다는 것인데, 제12조는 오히려 공개 심문을 명시했습니다. 절차를 줄인 곳은 증인 생략(제13조), 변호인 불허(제16조), 공소관의 종결 금지(제18조)였습니다. 공개 법정이라는 형식과 방어 수단의 축소가 한 법령 안에 함께 있었다는 점을 기억하세요.",
                "en": "The 1789 Declaration promised no arrest outside legal forms (Article 7), only strictly necessary penalties (Article 8), and the presumption of innocence (Article 9). By making death the single penalty, the Prairial decree collides most directly with Article 8’s proportionality. A common mistake is to think the decree made trials secret; Article 12 in fact required open questioning. The cuts lay in skipping witnesses (Article 13), refusing defenders (Article 16), and barring the prosecutor from closing cases (Article 18). The open courtroom and the shrinking of defence stood in the same decree."
              },
              "source": {
                "kind": "reference",
                "href": "/commulingo/docs/france-revolutionary-government-and-justice-1793-1794#france-law-22-prairial-1794",
                "label": {
                  "ko": "프레리알 22일 법령 제7·12·18조(1794년 6월 10일)",
                  "en": "Decree of 22 Prairial, Articles 7, 12, and 18 (10 June 1794)"
                }
              }
            },
            {
              "id": "q6",
              "type": "multiple_choice",
              "points": 2,
              "prompt": {
                "ko": "1794년 6월 10일부터 7월 26일까지 파리에서 1,376명이 처형됐다는 집계는 무엇을 보여 주고, 무엇을 보여 주지 않을까요?",
                "en": "What does the count of 1,376 executions in Paris from 10 June to 26 July 1794 show, and what does it not show?"
              },
              "choices": {
                "ko": [
                  "증인 생략과 변호인 불허로 빨라진 파리 재판의 속도를 보여 주지만, 방데와 지방 진압을 합한 전국 희생자 수는 아닙니다.",
                  "전선이 가장 위급했던 시기 전국의 처형 수로, 전쟁 위기의 크기가 억압의 규모를 그대로 정했음을 보여 줍니다.",
                  "혐의자법으로 구금된 사람이 평화 때까지 풀려나지 못하고 옥중에서 숨진 수로, 재판 절차와는 관계가 없습니다."
                ],
                "en": [
                  "It shows the speed of Paris trials once witnesses and defenders were cut, but it is not a national total including the Vendée and provincial repression.",
                  "It is the national number of executions at the most dangerous moment at the front, proving that the war crisis set the scale of repression.",
                  "It counts people held under the Law of Suspects who died in prison before the peace, unrelated to trial procedure."
                ]
              },
              "answer": 0,
              "choiceFeedback": {
                "ko": [
                  "라루스 집계는 프레리알 법령 채택일부터 테르미도르 8일까지 파리의 처형 수입니다. 집계 범위를 지켜 읽어야 합니다.",
                  "범위는 파리 한 곳이고, 6월 26일 플뢰뤼스 승리로 대외 형세가 나아지던 때였습니다. 전쟁 위기만으로는 이 증가를 설명할 수 없습니다.",
                  "이 수치는 혁명재판소 판결에 따른 처형입니다. 혐의자법의 구금과 프레리알 법령의 재판을 섞으면 안 됩니다."
                ],
                "en": [
                  "Larousse’s count covers Paris executions from the day the Prairial decree passed to 8 Thermidor. Keep to that scope.",
                  "The scope is Paris alone, and the period followed the victory of Fleurus on 26 June; the war crisis alone cannot explain the rise.",
                  "The figure counts executions following Revolutionary Tribunal verdicts. Do not mix detention under the Law of Suspects with trial under Prairial."
                ]
              },
              "explanation": {
                "ko": "프레리알 법령은 형을 사형 하나로 정하고, 다른 증거가 있으면 증인 심문을 생략하며, 음모자에게 변호인을 허용하지 않았습니다. 그 뒤 파리의 처형이 급증했고, 라루스는 6월 10일부터 7월 26일까지를 1,376명으로 집계합니다. 이 수치를 전국 희생자 수로 읽으면 방데의 전투·학살과 지방 진압을 빠뜨리고, 반대로 전쟁 위기의 자동적 결과로 읽으면 대외 형세가 나아지던 때 처형이 늘었다는 사실을 놓칩니다. 전쟁은 비상권력의 배경이었지만, 이 시기의 억압을 모두 설명해 주지는 않습니다.",
                "en": "The Prairial decree made death the single penalty, allowed witnesses to be skipped when other proof existed, and gave conspirators no defenders. Executions in Paris then rose sharply; Larousse counts 1,376 from 10 June to 26 July. Reading this as a national total leaves out the Vendée and provincial repression; reading it as an automatic result of war misses that executions rose as the military situation improved. War was the setting for emergency power, but it does not explain all the repression of this period."
              },
              "source": {
                "kind": "reference",
                "href": "/commulingo/docs/france-national-assembly-terror-guide-1793-1794#prairial",
                "label": {
                  "ko": "프랑스 혁명의 세력 관계와 혁명정부, 제9절 프레리알 22일 법",
                  "en": "Political Forces and Revolutionary Government, section 9: the law of 22 Prairial"
                }
              }
            }
          ]
        }
      ]
    },
    {
      "id": "french-revolution-intro-ch10",
      "volumeNumber": 11,
      "chapterNumber": 8,
      "partNumber": 2,
      "partTitle": {
        "ko": "제2부 · 공화정과 혁명정부",
        "en": "Part II · Republic and revolutionary government"
      },
      "title": {
        "ko": "로베스피에르는 왜 혁명파를 숙청하고 스스로 몰락했을까?",
        "en": "Why did Robespierre purge fellow revolutionaries, and how did he fall?"
      },
      "sourceUrl": "/commulingo/docs/robespierre-republican-morality-supreme-being-thermidor-1794",
      "summary": {
        "ko": "약 12분 · 1794년 3~4월 에베르파와 당통파의 처형, 5월 7일 종교·도덕 보고와 법령, 6월 8일 최고존재 축제, 7월 26일 테르미도르 8일 연설과 이튿날의 체포를 시간순으로 따라갑니다.",
        "en": "About 12 minutes · Follow in order the executions of the Hébertists and Dantonists in March and April 1794, the report and decree on religion and morality of 7 May, the Festival of the Supreme Being on 8 June, and the speech of 8 Thermidor on 26 July with the arrest the next day."
      },
      "learningFocus": {
        "ko": "최고존재 숭배를 가톨릭의 부활로, 테르미도르 9일을 파리 코뮌의 반로베스피에르 봉기로 읽기 쉽습니다. 법령이 기존 예배를 어떻게 다루었는지, 코뮌과 국민공회가 각각 누구 편에 섰는지 확인하세요.",
        "en": "It is easy to read the cult of the Supreme Being as a Catholic revival and 9 Thermidor as a Paris Commune rising against Robespierre. Check how the decree treated existing worship, and whose side the Commune and the Convention each took."
      },
      "conceptBrief": {
        "ko": [
          {
            "title": "1794년 봄: 혁명 진영의 양쪽을 숙청하다",
            "items": [
              "3월에 에베르와 롱생·뱅상·모모로 등이 체포돼 3월 24일 처형됐고, 이어 당통·데물랭 등이 체포돼 4월 5일 처형됐습니다. 대중운동 쪽의 경쟁 세력과 억압 완화를 요구한 세력이 연달아 사라졌습니다.",
              "에베르파는 코르들리에 클럽·신문·코뮌과 군사행정 인맥에 기반을 두었고, 앞서 몰락한 앙라제의 요구 일부를 흡수했습니다. 당통과 데물랭의 관용파도 혁명정부 형성에 참여한 경력이 있었습니다.",
              "숙청으로 공안위원회와 일반안전위원회 사이의 갈등까지 사라지지는 않았습니다."
            ]
          },
          {
            "title": "5월 7일 보고와 법령: 입법자의 기준으로 본 종교",
            "items": [
              "로베스피에르는 형이상학 논쟁은 입법자의 일이 아니며, 입법자에게는 세상에 유용하고 실천하기 좋은 것이 진리라고 했습니다. 최고존재와 영혼 불멸의 관념은 정의를 끊임없이 일깨우므로 사회적이고 공화주의적이라는 것입니다.",
              "그는 폭력으로 모든 신앙을 공격한 탈기독교화를 음모로 규정했고, 처형된 당통과 에베르파를 같은 음모의 일부로 다시 묘사했습니다. 사제들도 비판하며 사제는 내버려 두고 신성으로 돌아가자고 했습니다.",
              "법령 제1조는 프랑스 인민이 최고존재와 영혼 불멸을 인정한다고, 제2조는 합당한 숭배가 인간의 의무 실천이라고 했습니다. 제11조는 예배의 자유를 유지했고, 제13조는 예배를 계기로 한 소요에서 광신적 설교로 선동한 자와 부당한 폭력으로 유발한 자를 똑같이 처벌하게 했습니다."
            ]
          },
          {
            "title": "6월 8일 축제에서 테르미도르 9일까지",
            "items": [
              "로베스피에르는 국민공회 의장으로 최고존재 축제를 주재하고 두 차례 연설했습니다. 두 번째 연설은 무신론을 상징하는 형상이 불탄 뒤에 했습니다.",
              "6월 26일 플뢰뤼스 승리로 대외 형세가 나아지는데도 파리의 처형은 늘었습니다. 두 위원회의 갈등과 의원들의 신변 불안이 로베스피에르에 반대하는 세력이 손잡을 조건을 만들었습니다.",
              "7월 26일 연설에서 그는 독재 비난을 반박하고, 혁명정부는 파괴할 것이 아니라 단순화하고 요원을 줄여 숙청해야 한다고 했습니다. 재정 관리자로 캉봉 등을 지목했지만, 중상 계획의 다른 배후는 이름을 입에 올리지 못하겠다고 했습니다.",
              "이튿날 국민공회는 그의 발언을 막고 로베스피에르·생쥐스트·쿠통 등의 체포를 의결했습니다. 파리 코뮌이 저항했지만 국민공회 쪽 무력이 시청을 장악했고, 이들은 7월 28일 처형됐습니다."
            ]
          },
          {
            "title": "근거 자료",
            "items": [
              "『로베스피에르 문헌집: 공화국의 도덕, 최고존재, 테르미도르』: 1794년 5월 7일 보고와 법령 제1~15조, 6월 8일 두 연설, 7월 26일 국민공회 연설.",
              "『프랑스 혁명의 세력 관계와 혁명정부, 1791–1794』 제3·8·10절: 정파의 구성, 봄의 숙청, 테르미도르의 경위."
            ]
          }
        ],
        "en": [
          {
            "title": "Spring 1794: purging both flanks of the revolutionary camp",
            "items": [
              "In March Hébert, Ronsin, Vincent, Momoro, and others were arrested and executed on 24 March; then Danton, Desmoulins, and others were arrested and executed on 5 April. Rivals on the popular-movement side and those demanding less repression disappeared in turn.",
              "The Hébertists drew on the Cordeliers club, newspapers, the Commune, and military-administration networks, and had absorbed some demands of the Enragés, who fell earlier. Danton and Desmoulins’s Indulgents had also helped build revolutionary government.",
              "The purges did not end the conflict between the Committee of Public Safety and the Committee of General Security."
            ]
          },
          {
            "title": "The report and decree of 7 May: religion judged as a legislator",
            "items": [
              "Robespierre said metaphysical disputes were not the legislator’s business; for the legislator, whatever is useful to the world and good in practice is truth. The ideas of the Supreme Being and the immortality of the soul constantly recall justice, so they are social and republican.",
              "He branded the violent dechristianisation that attacked all belief a conspiracy, and redescribed the executed Danton and Hébertists as parts of the same plot. He also attacked priests: leave the priests and return to the Divinity.",
              "Article 1 of the decree said the French people recognise the Supreme Being and the immortality of the soul; Article 2 said the worthy worship is the practice of man’s duties. Article 11 kept freedom of worship, and Article 13 punished alike those who stirred up disturbances over worship by fanatical preaching and those who provoked them by unjust violence."
            ]
          },
          {
            "title": "From the festival of 8 June to 9 Thermidor",
            "items": [
              "As president of the Convention Robespierre led the Festival of the Supreme Being and spoke twice; the second speech followed the burning of a figure representing atheism.",
              "After the victory of Fleurus on 26 June the military situation improved, yet executions in Paris rose. Conflict between the two committees and deputies’ fears for their own safety created conditions for an anti-Robespierre coalition.",
              "On 26 July he rejected the charge of dictatorship and said revolutionary government should not be destroyed but simplified, its agents reduced and purged. He named Cambon and others as managers of finance, but said he dared not name the other authors of the slander.",
              "The next day the Convention stopped him speaking and voted the arrest of Robespierre, Saint-Just, Couthon, and others. The Paris Commune resisted, but the Convention’s forces took the Hôtel de Ville, and they were executed on 28 July."
            ]
          },
          {
            "title": "Sources",
            "items": [
              "Robespierre Documents: Republican Morality, the Supreme Being, and Thermidor: the report and decree of 7 May 1794, Articles 1–15; the two speeches of 8 June; the speech to the Convention of 26 July.",
              "Political Forces and Revolutionary Government in France, 1791–1794, sections 3, 8, and 10: the factions, the spring purges, and Thermidor."
            ]
          }
        ]
      },
      "conceptMap": {
        "ko": [
          {
            "title": "양쪽 숙청",
            "text": "3월에는 에베르파, 4월에는 당통파가 혁명재판소를 거쳐 처형됐습니다."
          },
          {
            "title": "최고존재",
            "text": "로베스피에르는 신앙을 사회적 유용성으로 옹호하며 예배의 자유는 유지했습니다."
          },
          {
            "title": "테르미도르",
            "text": "승전 뒤에도 늘어난 처형과 이름 없는 고발이 반대 연합을 만들었습니다."
          }
        ],
        "en": [
          {
            "title": "Purging both flanks",
            "text": "The Hébertists in March and the Dantonists in April were executed through the Revolutionary Tribunal."
          },
          {
            "title": "Supreme Being",
            "text": "Robespierre defended belief by its social usefulness while keeping freedom of worship."
          },
          {
            "title": "Thermidor",
            "text": "Rising executions after victory and unnamed accusations built the coalition against him."
          }
        ]
      },
      "diagram": {
        "kind": "flow",
        "ko": {
          "title": "1794년 3월에서 7월까지",
          "steps": [
            {
              "label": "3월 24일 · 에베르파 처형",
              "note": "코르들리에와 코뮌 쪽 경쟁 세력이 제거됐습니다."
            },
            {
              "label": "4월 5일 · 당통파 처형",
              "note": "억압 완화를 요구한 관용파가 제거됐습니다."
            },
            {
              "label": "5월 7일 · 보고와 법령",
              "note": "최고존재와 영혼 불멸을 인정하고 예배의 자유를 유지했습니다."
            },
            {
              "label": "6월 8일 · 최고존재 축제",
              "note": "국민공회 의장으로 두 차례 연설했습니다."
            },
            {
              "label": "7월 26일 · 테르미도르 8일",
              "note": "혁명정부의 숙청을 요구하고 일부 배후의 이름은 밝히지 않았습니다."
            },
            {
              "label": "7월 27~28일 · 체포와 처형",
              "note": "코뮌의 저항이 무너지고 로베스피에르 일파가 처형됐습니다."
            }
          ]
        },
        "en": {
          "title": "From March to July 1794",
          "steps": [
            {
              "label": "24 March · Hébertists executed",
              "note": "Rivals based in the Cordeliers and the Commune were removed."
            },
            {
              "label": "5 April · Dantonists executed",
              "note": "The Indulgents who demanded less repression were removed."
            },
            {
              "label": "7 May · Report and decree",
              "note": "The Supreme Being and immortality were recognised and freedom of worship kept."
            },
            {
              "label": "8 June · Festival of the Supreme Being",
              "note": "He spoke twice as president of the Convention."
            },
            {
              "label": "26 July · 8 Thermidor",
              "note": "He demanded a purge of revolutionary government and withheld some names."
            },
            {
              "label": "27–28 July · Arrest and execution",
              "note": "The Commune’s resistance collapsed and Robespierre’s group was executed."
            }
          ]
        }
      },
      "lessons": [
        {
          "id": "french-revolution-intro-ch10-basic",
          "level": "basic",
          "title": {
            "ko": "로베스피에르는 왜 혁명파를 숙청하고 스스로 몰락했을까?",
            "en": "Why did Robespierre purge fellow revolutionaries, and how did he fall?"
          },
          "questions": [
            {
              "id": "q1",
              "type": "multiple_choice",
              "points": 2,
              "prompt": {
                "ko": "1794년 3월과 4월의 두 차례 처형은 혁명 진영에서 누구를 어떤 순서로 제거했을까요?",
                "en": "Whom did the two rounds of executions in March and April 1794 remove from the revolutionary camp, and in what order?"
              },
              "choices": {
                "ko": [
                  "3월에는 코르들리에와 코뮌 인맥의 에베르·롱생·뱅상·모모로를, 4월에는 억압 완화를 요구한 당통·데물랭을 처형했습니다.",
                  "3월에는 억압 완화를 요구한 당통·데물랭을, 4월에는 코르들리에와 코뮌 인맥의 에베르·롱생·뱅상·모모로를 처형했습니다.",
                  "3월에는 식량 통제를 요구한 앙라제의 자크 루·바를레를, 4월에는 그 요구를 이어받은 에베르와 그 동료들을 처형했습니다."
                ],
                "en": [
                  "In March Hébert, Ronsin, Vincent, and Momoro of the Cordeliers and Commune networks; in April Danton and Desmoulins, who demanded less repression.",
                  "In March Danton and Desmoulins, who demanded less repression; in April Hébert, Ronsin, Vincent, and Momoro of the Cordeliers and Commune networks.",
                  "In March the Enragés Jacques Roux and Varlet, who demanded food controls; in April Hébert and his associates, who took up those demands."
                ]
              },
              "answer": 0,
              "choiceFeedback": {
                "ko": [
                  "에베르파는 3월 24일, 당통파는 4월 5일 처형됐습니다. 대중운동 쪽 경쟁자를 먼저, 의회 내부의 완화 요구를 다음에 제거한 순서입니다.",
                  "순서가 뒤바뀌었습니다. 에베르파가 먼저 3월 24일에, 당통과 데물랭이 뒤이어 4월 5일에 처형됐습니다.",
                  "앙라제는 에베르파보다 먼저 몰락했고 에베르파가 그 요구 일부를 흡수했습니다. 두 이름을 한 흐름으로 합치면 1794년 봄의 숙청 순서가 사라집니다."
                ],
                "en": [
                  "The Hébertists died on 24 March and the Dantonists on 5 April: first rivals on the popular-movement side, then the demand for moderation within the Convention.",
                  "The order is reversed. The Hébertists were executed first on 24 March, Danton and Desmoulins after them on 5 April.",
                  "The Enragés fell before the Hébertists, who absorbed some of their demands. Merging the two erases the sequence of the spring 1794 purges."
                ]
              },
              "explanation": {
                "ko": "에베르파는 코르들리에 클럽과 신문, 코뮌과 군사행정 인맥에 기반을 둔 세력이었고, 3월에 체포돼 24일 처형됐습니다. 이어 당통과 데물랭 등 억압의 완화를 요구한 관용파가 체포돼 4월 5일 처형됐습니다. 두 집단 모두 혁명 진영 안에 있었고, 당통파는 혁명정부 형성에도 참여했습니다. 따라서 이 숙청은 왕당파에 대한 억압이 아니라, 비상통치의 지속과 강도를 둘러싼 혁명 진영 내부의 대립이 재판과 처형으로 끝난 사건이었습니다. 로베스피에르와 공안위원회는 이 과정에 책임이 있지만, 위원회 사이의 갈등까지 사라지지는 않았습니다.",
                "en": "The Hébertists, based in the Cordeliers club, newspapers, the Commune, and military administration, were arrested in March and executed on the 24th. Then Danton, Desmoulins, and other Indulgents who demanded less repression were arrested and executed on 5 April. Both groups stood inside the revolutionary camp, and the Dantonists had helped build revolutionary government. These purges were therefore not repression of royalists but a conflict within the camp over how long and how hard emergency rule should last, ended by trial and execution. Robespierre and the Committee of Public Safety bore responsibility, yet conflict between the committees did not vanish."
              },
              "source": {
                "kind": "reference",
                "href": "/commulingo/docs/france-national-assembly-terror-guide-1793-1794#virtue-and-factions",
                "label": {
                  "ko": "프랑스 혁명의 세력 관계와 혁명정부, 제8절 덕과 공포의 논리와 1794년 봄의 숙청",
                  "en": "Political Forces and Revolutionary Government, section 8: virtue, terror, and the spring 1794 purges"
                }
              }
            },
            {
              "id": "q2",
              "type": "multiple_choice",
              "points": 2,
              "prompt": {
                "ko": "5월 7일 보고에서 로베스피에르는 이미 처형된 당통과 에베르파를 어떻게 다시 묘사했을까요?",
                "en": "In the report of 7 May, how did Robespierre redescribe the already executed Danton and Hébertists?"
              },
              "choices": {
                "ko": [
                  "서로 맞선 듯 보인 두 쪽을 한 음모로 묶어, 당통이 롱생과 서신을 주고받고 에베르를 부추겼다고 했습니다.",
                  "에베르파의 탈기독교화는 이성의 승리를 앞당긴 공적이었고, 다만 그 방법이 지나치게 과격했을 뿐이라고 평가했습니다.",
                  "당통은 관용을 주장한 성실한 애국자였으나 판단을 그르쳤고, 에베르파만이 외국과 결탁했다고 했습니다."
                ],
                "en": [
                  "He bound the two seemingly opposed sides into one plot, saying Danton corresponded with Ronsin and egged on Hébert.",
                  "He judged the Hébertists’ dechristianisation a service that hastened the triumph of reason, merely too violent in method.",
                  "He called Danton a sincere patriot who argued for clemency but erred, and said only the Hébertists had colluded abroad."
                ]
              },
              "answer": 0,
              "choiceFeedback": {
                "ko": [
                  "보고는 가장 분열된 듯 보인 당수들의 행보가 늘 같았다고 하며, 당통이 브리소와 타협하고 롱생과 서신을 주고받고 에베르를 부추겼다고 씁니다.",
                  "그는 폭력으로 모든 신앙을 공격한 이들이 이성을 혐오스럽게 만들고 광신에 무기를 주었다며, 이를 동맹한 왕들을 위한 음모로 규정했습니다.",
                  "보고는 당통을 「가장 비겁하지만 않았다면 가장 위험했을」 조국의 적으로 그렸습니다. 한쪽만 적으로 보는 구도는 2월 보고 이래 그가 거부한 것입니다."
                ],
                "en": [
                  "The report says the leaders who seemed most divided always moved alike, and that Danton compromised with Brissot, corresponded with Ronsin, and egged on Hébert.",
                  "He said those who violently attacked all belief made reason odious and armed fanaticism, and called it a plot serving the allied kings.",
                  "The report calls Danton the enemy who would have been the most dangerous had he not been the most cowardly; treating only one side as the enemy is what he had rejected since February."
                ]
              },
              "explanation": {
                "ko": "5월 7일 보고는 라파예트와 뒤무리에, 브리소와 지롱드파, 에베르와 당통을 한 줄로 세워 겉으로는 서로 달라도 같은 음모를 꾸몄다고 서술합니다. 특히 폭력적 탈기독교화를 광신에 무기를 주고 이성을 혐오스럽게 만든 음모로 규정해, 에베르파 처형을 종교 정책의 논리 안에서 다시 정당화합니다. 이것은 2월 보고의 두 파벌 논리를 사후에 적용한 것입니다. 이 서술은 당사자가 숙청을 설명한 주장이며, 당통과 에베르가 실제로 공모했다는 독립적 증거로 읽으면 안 됩니다.",
                "en": "The 7 May report lines up Lafayette and Dumouriez, Brissot and the Girondins, Hébert and Danton, saying they differed on the surface but pursued the same plot. By branding violent dechristianisation a conspiracy that armed fanaticism and made reason odious, it re-justified the Hébertists’ execution inside the logic of religious policy. This applies the February report’s two-faction logic after the fact. It is the actor’s account of the purges, not independent evidence that Danton and Hébert actually conspired."
              },
              "source": {
                "kind": "reference",
                "href": "/commulingo/docs/robespierre-republican-morality-supreme-being-thermidor-1794",
                "label": {
                  "ko": "로베스피에르, 종교·도덕 관념과 공화국 원리에 관한 보고(1794년 5월 7일)",
                  "en": "Robespierre, report on religious and moral ideas and republican principles (7 May 1794)"
                }
              }
            },
            {
              "id": "q3",
              "type": "multiple_choice",
              "points": 2,
              "prompt": {
                "ko": "로베스피에르는 최고존재와 영혼 불멸의 관념을 입법자로서 어떤 근거로 옹호했을까요?",
                "en": "On what grounds did Robespierre, speaking as a legislator, defend the ideas of the Supreme Being and the immortality of the soul?"
              },
              "choices": {
                "ko": [
                  "입법자에게는 유용하고 실천하기 좋은 것이 진리이며, 이 관념은 정의를 끊임없이 일깨우므로 공화주의적이라고 했습니다.",
                  "철학적으로 증명된 진리이므로, 무신론을 믿는 철학자는 견해만으로도 공화국의 적으로 처벌해야 한다고 했습니다.",
                  "사제들이 지켜 온 교회의 가르침이 곧 자연의 신이므로, 교회를 공화국 도덕을 가르칠 기관으로 삼자고 했습니다."
                ],
                "en": [
                  "For the legislator, what is useful and good in practice is truth, and these ideas are republican because they constantly recall justice.",
                  "They were philosophically proven truths, so philosophers holding atheist views should be punished as enemies for their views alone.",
                  "The Church’s teaching kept by priests was the God of nature itself, so the Church should become the institution teaching republican morals."
                ]
              },
              "answer": 0,
              "choiceFeedback": {
                "ko": [
                  "그는 입법자가 형이상학자나 신학자로서 문제를 보아서는 안 된다고 하고, 사회적 효과를 기준으로 이 관념을 옹호했습니다.",
                  "그는 특정 철학적 견해를 재판하려는 것이 아니라고 굳이 밝히고, 문제는 무신론을 국가적인 것으로 삼는 일이라고 했습니다.",
                  "그는 사제들이 신을 자기 형상대로 만들었고 사제와 도덕의 관계는 돌팔이와 의학의 관계라며, 사제는 내버려 두고 신성으로 돌아가자고 했습니다."
                ],
                "en": [
                  "He said the legislator must not view such questions as a metaphysician or theologian, and defended the ideas by their social effect.",
                  "He took care to say he was not putting any philosophical opinion on trial; the issue was making atheism national.",
                  "He said priests made God in their own image and stood to morality as quacks to medicine: leave the priests and return to the Divinity."
                ]
              },
              "explanation": {
                "ko": "로베스피에르는 철학자들이 자연 현상을 설명하는 가설은 입법자와 상관이 없다고 말합니다. 입법자의 눈에는 세상에 유용하고 실천하기 좋은 것이 진리이고, 최고존재와 영혼 불멸의 관념은 정의를 끊임없이 일깨우므로 사회적이고 공화주의적이라는 것입니다. 그래서 최고존재 숭배를 가톨릭 복귀로 읽으면 틀립니다. 그는 사제의 권위를 강하게 공격했고, 신앙을 교리의 참이 아니라 시민의 도덕을 떠받치는 효과로 옹호했습니다. 동시에 개인 철학자를 재판하려는 것은 아니라고 선을 그었습니다.",
                "en": "Robespierre says the hypotheses by which philosophers explain nature are no concern of the legislator. In the legislator’s eyes whatever is useful to the world and good in practice is truth, and the ideas of the Supreme Being and immortality constantly recall justice, so they are social and republican. Reading the cult as a Catholic revival is therefore wrong: he attacked priestly authority hard and defended belief not for doctrinal truth but for its effect in sustaining civic morals. He also drew a line against putting individual philosophers on trial."
              },
              "source": {
                "kind": "reference",
                "href": "/commulingo/docs/robespierre-republican-morality-supreme-being-thermidor-1794",
                "label": {
                  "ko": "로베스피에르, 1794년 5월 7일 보고의 입법자와 종교 대목",
                  "en": "Robespierre, report of 7 May 1794, passages on the legislator and religion"
                }
              }
            },
            {
              "id": "q4",
              "type": "multiple_choice",
              "points": 2,
              "prompt": {
                "ko": "5월 7일 법령은 최고존재를 인정하면서 기존 예배와 예배를 둘러싼 소요를 어떻게 다루었을까요?",
                "en": "While recognising the Supreme Being, how did the decree of 7 May treat existing worship and disturbances over worship?"
              },
              "choices": {
                "ko": [
                  "제11조로 예배의 자유를 유지하고, 제13조로 광신적 설교로 소요를 선동한 자와 부당한 폭력으로 유발한 자를 똑같이 처벌하게 했습니다.",
                  "제1조로 최고존재 숭배를 유일한 국가 예배로 정하고, 제11조로 가톨릭 예배를 금지하며 옛 사제들에게 새 국민 축제의 집전을 맡겼습니다.",
                  "제13조로 예배를 둘러싼 소요에서는 광신적 설교자만 처벌하고, 예배를 막으려고 폭력을 쓴 탈기독교화 활동가는 처벌 대상에서 뺐습니다."
                ],
                "en": [
                  "Article 11 kept freedom of worship, and Article 13 punished alike those who stirred up disturbances by fanatical preaching and those who provoked them by unjust violence.",
                  "Article 1 made the Supreme Being the sole state worship, and Article 11 banned Catholic worship and gave priests the new festivals to conduct.",
                  "Article 13 punished only fanatical preachers in disturbances over worship and exempted dechristianisers who used violence to stop it."
                ]
              },
              "answer": 0,
              "choiceFeedback": {
                "ko": [
                  "제11조는 프리메르 18일 법령에 따라 예배의 자유가 유지된다고, 제13조는 두 쪽을 「마찬가지로」 처벌한다고 씁니다.",
                  "제1조는 인정을 선언했을 뿐 다른 예배를 금지하지 않았고, 제11조는 오히려 예배의 자유를 유지했습니다. 축제는 혁명의 사건과 덕목을 기리는 국민 축제였습니다.",
                  "제13조는 부당하고 까닭 없는 폭력으로 소요를 유발한 자도 똑같이 처벌합니다. 폭력적 탈기독교화에도 제동을 건 조항입니다."
                ],
                "en": [
                  "Article 11 says freedom of worship is maintained under the decree of 18 Frimaire, and Article 13 punishes both sides alike.",
                  "Article 1 declared recognition without banning other worship, and Article 11 kept freedom of worship; the festivals honoured events and virtues of the Revolution.",
                  "Article 13 equally punishes those who provoke disturbances by unjust and gratuitous violence, a brake on violent dechristianisation too."
                ]
              },
              "explanation": {
                "ko": "법령은 제1조에서 프랑스 인민이 최고존재와 영혼 불멸을 인정한다고 하고, 제2조에서 그에 합당한 숭배를 인간의 의무 실천으로 정의했습니다. 숭배의 내용이 의례가 아니라 시민의 의무라는 점이 중요합니다. 제4~7조는 혁명의 사건과 덕목, 자연의 은혜에서 이름을 딴 국민 축제를 두었습니다. 그렇다고 기존 예배를 없애지는 않았습니다. 제11조는 예배의 자유를 유지했고, 제13조는 광신적 설교로 소요를 부추긴 쪽과 폭력으로 예배를 공격한 쪽을 함께 처벌 대상으로 삼아, 급진적 탈기독교화와도 거리를 두었습니다.",
                "en": "Article 1 says the French people recognise the Supreme Being and immortality, and Article 2 defines the worthy worship as practising man’s duties: the content of worship is civic duty, not ritual. Articles 4–7 created national festivals named after revolutionary events, virtues, and nature’s gifts. Existing worship was not abolished. Article 11 kept freedom of worship, and Article 13 made both those who incited disturbances by fanatical preaching and those who attacked worship with violence punishable, distancing the decree from radical dechristianisation as well."
              },
              "source": {
                "kind": "reference",
                "href": "/commulingo/docs/robespierre-republican-morality-supreme-being-thermidor-1794",
                "label": {
                  "ko": "1794년 5월 7일 법령 제1·2·11~13조",
                  "en": "Decree of 7 May 1794, Articles 1, 2, and 11–13"
                }
              }
            },
            {
              "id": "q5",
              "type": "multiple_choice",
              "points": 2,
              "prompt": {
                "ko": "테르미도르 8일 연설에서 로베스피에르는 혁명정부의 앞날과 자신을 공격한 이들에 대해 무엇을 말했을까요?",
                "en": "In the speech of 8 Thermidor, what did Robespierre say about the future of revolutionary government and about those attacking him?"
              },
              "choices": {
                "ko": [
                  "혁명정부는 파괴하지 말고 단순화해 요원을 줄이고 숙청해야 한다고 했으며, 캉봉 등은 지목했지만 다른 배후의 이름은 대지 않았습니다.",
                  "공포정치가 목적을 다했으니 혁명정부를 해체하고 프레리알 법령을 폐지하자며, 반대파 의원들에게도 사면을 제안했습니다.",
                  "자신이 공안위원회를 실제로 이끌고 있음을 인정하며, 반대 의원들의 이름을 하나하나 낭독해 즉시 체포하자고 요구했습니다."
                ],
                "en": [
                  "Revolutionary government should not be destroyed but simplified, its agents reduced and purged; he named Cambon and others but withheld the other plotters’ names.",
                  "The Terror had served its purpose, so revolutionary government should be dissolved and the Prairial decree repealed, with amnesty for opposing deputies.",
                  "He admitted that he actually ran the Committee of Public Safety and read out the names of opposing deputies one by one, demanding their immediate arrest."
                ]
              },
              "answer": 0,
              "choiceFeedback": {
                "ko": [
                  "그는 재정 관리자로 캉봉·말라르메 등을 들었지만, 중상 계획의 다른 주동자는 「감히 그들의 이름을 입에 올리지 못하겠다」고 했습니다.",
                  "해체와 관용은 그가 거부한 결론입니다. 그는 배신한 의원들을 위해 사면을 선고하자는 제안이라면 부끄러운 일이라고 했습니다.",
                  "그는 반대로 자신의 독재가 끝난 지 최소 6주가 지났고 정부에 영향력을 행사하지 않는다고 주장했으며, 대부분의 이름을 밝히지 않았습니다."
                ],
                "en": [
                  "He listed Cambon, Mallarmé, and others as finance managers, but of the slander’s other authors said he dared not speak their names.",
                  "Dissolution and clemency are the conclusions he rejected; he said a proposal to amnesty traitor deputies would shame them all.",
                  "He claimed the opposite, that his so-called dictatorship had ended at least six weeks earlier and he had no influence on the government, and he withheld most names."
                ]
              },
              "explanation": {
                "ko": "연설에서 로베스피에르는 독재라는 말이 혁명의 제도와 국가적 정의를 한 사람의 야심의 산물처럼 그려 혐오스럽게 만든다고 반박했습니다. 그는 혁명정부가 조국을 구했으니 이제 혁명정부 자체를 구해야 하며, 방법은 파괴가 아니라 원칙을 상기시키고 단순화하며 요원을 줄이고 숙청하는 것이라고 했습니다. 재정 행정에 반혁명이 있다며 캉봉 등을 지목했지만, 음모의 다른 주동자는 이름을 밝히지 않았습니다. 누가 숙청 대상인지 모르는 상황이 많은 의원에게 위협으로 들렸다는 점이 이튿날의 결과를 이해하는 열쇠입니다.",
                "en": "Robespierre retorted that the word dictatorship made the Revolution’s institutions and national justice look like the work of one man’s ambition. Revolutionary government had saved the country, he said, and now had to be saved itself, not by destruction but by recalling its principles, simplifying it, reducing and purging its agents. He located counter-revolution in the finance administration and named Cambon and others, but left the plot’s other leaders unnamed. Not knowing who would be purged sounded like a threat to many deputies, which is key to what happened the next day."
              },
              "source": {
                "kind": "reference",
                "href": "/commulingo/docs/robespierre-republican-morality-supreme-being-thermidor-1794",
                "label": {
                  "ko": "로베스피에르, 테르미도르 8일 국민공회 연설(1794년 7월 26일)",
                  "en": "Robespierre, speech to the Convention of 8 Thermidor (26 July 1794)"
                }
              }
            },
            {
              "id": "q6",
              "type": "multiple_choice",
              "points": 2,
              "prompt": {
                "ko": "봄에는 숙청을 주도한 로베스피에르가 7월 27일에는 체포된 까닭을 봄과 여름의 조건을 비교해 설명하면 어떻게 될까요?",
                "en": "Comparing spring and summer conditions, how can we explain why Robespierre, who led purges in spring, was himself arrested on 27 July?"
              },
              "choices": {
                "ko": [
                  "플뢰뤼스 승리 뒤에도 처형이 늘어 비상 논리가 약해졌고, 두 위원회의 갈등과 이름 없는 고발에 불안해진 의원들이 손잡았습니다.",
                  "연합군이 다시 국경을 넘어 파리에 다가오자, 국민공회가 전쟁 패배의 책임을 물어 공안위원회 전체를 곧바로 해산하고 그를 체포했습니다.",
                  "파리 코뮌이 그의 독재에 맞서 봉기해 시청에서 그를 붙잡았고, 국민공회는 코뮌의 요구에 따라 뒤늦게 체포를 의결했습니다."
                ],
                "en": [
                  "After Fleurus executions still rose, weakening the emergency case, and deputies alarmed by committee conflict and unnamed accusations joined forces.",
                  "As the allies crossed the frontier again toward Paris, the Convention blamed the Committee of Public Safety for defeat, dissolved it, and arrested him.",
                  "The Paris Commune rose against his dictatorship and seized him at the Hôtel de Ville, and the Convention voted the arrest belatedly at its demand."
                ]
              },
              "answer": 0,
              "choiceFeedback": {
                "ko": [
                  "6월 26일 승리로 대외 형세가 나아지는데도 처형은 늘었고, 두 위원회 갈등과 의원들의 신변 불안이 반대 연합의 조건이 됐습니다.",
                  "7월에는 오히려 플뢰뤼스 승리로 프랑스군이 저지대로 진출할 길이 열려 있었습니다. 전쟁 패배가 체포의 이유였다는 근거는 없습니다.",
                  "코뮌은 거꾸로 체포된 로베스피에르 일파 편에서 저항했고, 국민공회 쪽 무력이 시청을 장악해 그 저항을 꺾었습니다."
                ],
                "en": [
                  "Executions rose even as the 26 June victory improved the war, and committee conflict and deputies’ fears for their safety set the conditions for the coalition.",
                  "In July Fleurus had in fact opened the way for French armies into the Low Countries; there is no basis for defeat as the reason for the arrest.",
                  "The Commune resisted on the side of Robespierre’s group, and the Convention’s forces broke that resistance by taking the Hôtel de Ville."
                ]
              },
              "explanation": {
                "ko": "봄의 숙청은 전쟁과 음모의 위협을 내세운 비상통치의 논리 안에서 이루어졌습니다. 여름에는 사정이 달랐습니다. 플뢰뤼스 승리로 대외 형세가 나아졌는데 파리의 처형은 늘었고, 공안위원회와 일반안전위원회의 갈등이 커졌습니다. 테르미도르 8일 연설이 이름 없는 음모자를 겨냥하자 여러 의원이 자신이 다음 표적일 수 있다고 느꼈습니다. 7월 27일 국민공회는 그의 발언을 막고 체포를 의결했고, 코뮌이 저항했지만 국민공회 쪽 무력이 시청을 장악해 7월 28일 처형이 이루어졌습니다. 공포정치의 제도 안에서 권력을 쥔 지도자가 같은 의회의 다수 연합에 의해 무너진 것입니다.",
                "en": "The spring purges took place inside the logic of emergency rule, invoking war and conspiracy. Summer was different. Fleurus improved the war, yet executions in Paris rose, and conflict between the two committees grew. When the 8 Thermidor speech targeted unnamed plotters, many deputies felt they might be next. On 27 July the Convention silenced him and voted his arrest; the Commune resisted, but the Convention’s forces took the Hôtel de Ville, and the executions followed on 28 July. A leader who held power inside the institutions of the Terror was brought down by a majority coalition of the same assembly."
              },
              "source": {
                "kind": "reference",
                "href": "/commulingo/docs/france-national-assembly-terror-guide-1793-1794#thermidor",
                "label": {
                  "ko": "프랑스 혁명의 세력 관계와 혁명정부, 제10절 테르미도르",
                  "en": "Political Forces and Revolutionary Government, section 10: Thermidor"
                }
              }
            }
          ]
        }
      ]
    },
    {
      "id": "french-revolution-intro-ch08",
      "volumeNumber": 11,
      "chapterNumber": 9,
      "partNumber": 3,
      "partTitle": {
        "ko": "제3부 · 테르미도르 이후와 혁명의 유산",
        "en": "Part III · After Thermidor and the Revolution's legacy"
      },
      "title": {
        "ko": "테르미도르 뒤 혁명은 어떻게 끝났을까?",
        "en": "How did the Revolution end after Thermidor?"
      },
      "sourceUrl": "/commulingo/docs/france-directoire-consulat-1795-1799",
      "summary": {
        "ko": "약 12분 · 1795년 헌법의 선거권과 권력 분산 장치, 1796년 「평등파 선언」의 도전, 이탈리아 원정과 캄포포르미오 조약, 1799년 브뤼메르 쿠데타와 혁명력 8년 헌법을 조문으로 비교합니다.",
        "en": "About 12 minutes · Compare, article by article, the franchise and safeguards of the 1795 Constitution, the challenge of the 1796 Manifesto of the Equals, the Italian campaign and the Treaty of Campo Formio, and the coup of Brumaire 1799 with the Constitution of Year VIII."
      },
      "learningFocus": {
        "ko": "1795년 헌법의 납세 조건을 투표권 전체에 붙이거나, 평등파의 요구를 토지 분할로 읽거나, 브뤼메르 뒤 체제를 곧바로 왕정 복원으로 보는 오독이 흔합니다. 조문이 누구에게 무엇을 허용하고 금지했는지를 따라가세요.",
        "en": "Common misreadings attach the 1795 property threshold to all voting, read the Equals’ demand as land division, or treat the post-Brumaire regime as an immediate return of monarchy. Follow what each article allowed or forbade, and to whom."
      },
      "conceptBrief": {
        "ko": [
          {
            "title": "테르미도르 뒤의 재편과 1795년 헌법",
            "items": [
              "테르미도르 뒤 위원회 권력이 줄고, 자코뱅 운동이 억압되고, 경제 통제가 해체됐습니다. 1795년에는 1793년 헌법을 시행하는 대신 새 헌법을 만들었습니다.",
              "권리 선언 제3조는 평등을 법이 모두에게 동일한 것으로 정의했고, 제5조는 소유를 재산과 노동의 결실을 향유하고 처분할 권리로 정했습니다. 의무 선언 제8조는 경작·생산·사회 질서가 소유의 유지에 달려 있다고 했습니다.",
              "직접세를 내는 21세 이상 주민이 기초의회에서 투표했고(제8조), 입법부 의원을 뽑는 선거인은 노동 가치 100~200일 치 수익의 재산을 소유하거나 임차해야 했습니다(제35조). 입법부는 500인회와 원로원으로 나뉘었고, 집행권은 매년 1인씩 교체되는 5인 총재에게 맡겨졌습니다(제132·137조).",
              "총재는 무장 부대를 직접 지휘할 수 없었고(제144조), 군 총지휘권을 한 사람에게 줄 수 없었습니다(제289조). 정치 결사는 민중 협회를 자칭하거나 서로 서신을 주고받을 수 없었고, 집단 청원도 금지됐습니다(제361~364조)."
            ]
          },
          {
            "title": "1796년 평등파의 도전",
            "items": [
              "바뵈프와 동료들은 비밀 조직으로 총재정부를 무너뜨리고 공동의 경제 질서를 세우려 했지만 1796년 체포됐습니다.",
              "마레샬이 쓴 「평등파 선언」은 법 앞의 평등을 「법의 아름답고도 무익한 허구」라 하고, 토지를 나누는 농지법이 아니라 토지의 개인 소유를 없애고 결실을 함께 누리는 공동재산을 요구했습니다. 1791·1795년 헌장은 귀족적이라 하고, 1793년 헌장은 거대한 발걸음이지만 목표에 닿지 못했다고 평가했습니다.",
              "선언은 봉기 지도부의 만장일치 지지를 받지 못했고, 특히 「필요하다면 모든 예술이 파멸해도 좋다」는 대목이 반대에 부딪혔습니다. 홉스봄은 평등파 운동을 후대 혁명적 공산주의 전통의 출발점으로 보지만, 바뵈프가 후대와 같은 사상과 전술을 가졌다는 뜻은 아닙니다."
            ]
          },
          {
            "title": "이탈리아 원정과 캄포포르미오",
            "items": [
              "1796~1797년 보나파르트의 이탈리아 원정은 오스트리아 세력을 밀어내고 자매공화국을 조직해 특권 폐지와 공화주의를 퍼뜨렸습니다. 동시에 프랑스군은 점령지에 기여금과 물자를 요구하고 정치 질서를 통제했습니다.",
              "1797년 10월 17일 캄포포르미오 조약에는 이탈리아군 총사령관 보나파르트가 프랑스 전권으로 서명했습니다. 오스트리아는 벨기에를 포기하고(제3조) 시살피나 공화국을 독립국으로 승인했지만(제8조), 베네치아 시와 이스트리아·달마티아 등 옛 베네치아령은 오스트리아에 넘어갔습니다(제6조)."
            ]
          },
          {
            "title": "총재정부의 군대 의존과 브뤼메르",
            "items": [
              "왕당파와 급진파 사이에서 총재정부는 선거 결과를 뒤집는 쿠데타와 군대의 지원에 거듭 의존했습니다. 이탈리아의 승리와 선전은 보나파르트에게 정부와 별개의 정치적 자산을 주었습니다.",
              "1799년 11월 보나파르트는 시에예스 등과 손잡고 군인을 동원해 의회를 압박했고 총재정부는 끝났습니다. 12월 13일 혁명력 8년 헌법은 임기 10년의 세 통령을 두고 보나파르트를 제1통령으로 명시했으며(제39조), 장관과 장교 임명권을 제1통령에게 주고(제41조) 나머지 두 통령에게는 자문권만 두었습니다(제42조). 헌법은 인민의 승인에 부쳐졌습니다(제95조)."
            ]
          },
          {
            "title": "근거 자료",
            "items": [
              "『프랑스 혁명 문헌집: 총재정부와 통령정부 헌법』: 혁명력 3년 헌법(1795년 8월 22일)과 혁명력 8년 헌법(1799년 12월 13일) 전문.",
              "『프랑스 혁명 문헌집: 생필품·최고가격·평등』의 마레샬 「평등파 선언」(1796), 『바젤에서 아미앵까지』의 캄포포르미오 조약(1797).",
              "나폴레옹 재단: 이탈리아 원정과 자매공화국, 1799년 브뤼메르 쿠데타. 홉스봄, 『혁명의 시대』 112~113쪽."
            ]
          }
        ],
        "en": [
          {
            "title": "Reorganisation after Thermidor and the 1795 Constitution",
            "items": [
              "After Thermidor committee power shrank, the Jacobin movement was repressed, and economic controls were dismantled. In 1795 a new constitution was written instead of putting the 1793 one into effect.",
              "Article 3 of its declaration of rights defined equality as the law being the same for all, and Article 5 defined property as the right to enjoy and dispose of one’s goods and the fruits of one’s labour. Article 8 of the declaration of duties said cultivation, production, and the social order depend on maintaining property.",
              "Residents aged 21 who paid a direct tax voted in the primary assemblies (Article 8), but the electors who chose deputies had to own or rent property yielding 100–200 days’ labour value (Article 35). The legislature was split into the Five Hundred and the Elders, and executive power went to five Directors, one replaced each year (Articles 132, 137).",
              "Directors could not command armed forces (Article 144), and supreme command of the armies could not be given to one person (Article 289). Political associations could not call themselves popular societies or correspond with one another, and collective petitions were banned (Articles 361–364)."
            ]
          },
          {
            "title": "The challenge of the Equals, 1796",
            "items": [
              "Babeuf and his comrades organised in secret to overthrow the Directory and establish a common economic order, but were arrested in 1796.",
              "The Manifesto of the Equals, written by Maréchal, called equality before the law “a beautiful and sterile fiction of the law” and demanded not an agrarian law dividing land but common property: no individual ownership of land and common enjoyment of its fruits. It called the charters of 1791 and 1795 aristocratic and that of 1793 a giant step that still fell short.",
              "The manifesto did not win unanimous support from the leaders of the revolt, who objected especially to “let all the arts perish, if need be.” Hobsbawm sees the movement as the starting point of the later revolutionary communist tradition, which does not mean Babeuf shared later thinkers’ ideas or tactics."
            ]
          },
          {
            "title": "The Italian campaign and Campo Formio",
            "items": [
              "Bonaparte’s Italian campaign of 1796–1797 drove back Austrian power and organised sister republics, spreading the abolition of privilege and republicanism. At the same time the French army demanded contributions and supplies from occupied lands and controlled their politics.",
              "Bonaparte, commander of the Army of Italy, signed the Treaty of Campo Formio of 17 October 1797 for France. Austria gave up Belgium (Article 3) and recognised the Cisalpine Republic as independent (Article 8), but Venice itself, Istria, Dalmatia, and other former Venetian lands passed to Austria (Article 6)."
            ]
          },
          {
            "title": "The Directory’s reliance on the army and Brumaire",
            "items": [
              "Caught between royalists and radicals, the Directory repeatedly relied on coups overturning election results and on the army’s support. Victory and propaganda in Italy gave Bonaparte political capital independent of the government.",
              "In November 1799 Bonaparte, allied with Sieyès and others, used soldiers to press the legislature, and the Directory ended. The Constitution of Year VIII of 13 December created three consuls with ten-year terms, naming Bonaparte First Consul (Article 39), gave the First Consul power to appoint ministers and officers (Article 41), and left the other two consuls only a consultative voice (Article 42). It was submitted to the people for approval (Article 95)."
            ]
          },
          {
            "title": "Sources",
            "items": [
              "French Revolution Documents: Constitutions of the Directory and Consulate: full texts of the Constitution of Year III (22 August 1795) and Year VIII (13 December 1799).",
              "Maréchal, Manifesto of the Equals (1796), in French Revolution Documents: Subsistence, Maximum, and Equality; the Treaty of Campo Formio (1797), in From Basel to Amiens.",
              "Fondation Napoléon: the Italian campaign and sister republics; the coup of Brumaire 1799. Hobsbawm, The Age of Revolution, pp. 112–113."
            ]
          }
        ]
      },
      "conceptMap": {
        "ko": [
          {
            "title": "1795년 헌법",
            "text": "소유와 법적 평등을 앞세우고 선거인 재산 자격과 권력 분산 장치를 두었습니다."
          },
          {
            "title": "평등파",
            "text": "법 앞의 평등을 허구라 하고 토지 분할이 아닌 재산 공동체를 요구했습니다."
          },
          {
            "title": "이탈리아",
            "text": "자매공화국 수립과 점령·기여금, 영토 교환이 한 원정 안에 겹쳤습니다."
          },
          {
            "title": "브뤼메르",
            "text": "군대에 기댄 총재정부가 제1통령에게 권한을 모은 체제로 바뀌었습니다."
          }
        ],
        "en": [
          {
            "title": "1795 Constitution",
            "text": "It put property and legal equality first, with property qualifications for electors and dispersed power."
          },
          {
            "title": "The Equals",
            "text": "They called equality before the law a fiction and demanded common property, not land division."
          },
          {
            "title": "Italy",
            "text": "Sister republics, occupation and contributions, and territorial bargains came in one campaign."
          },
          {
            "title": "Brumaire",
            "text": "A Directory reliant on the army gave way to a regime concentrating power in the First Consul."
          }
        ]
      },
      "diagram": {
        "kind": "contrast",
        "ko": {
          "title": "1795년 헌법과 1799년 혁명력 8년 헌법의 집행권",
          "left": {
            "heading": "1795년 헌법(총재정부)",
            "rows": [
              "집행권은 5인 총재에게 있고 매년 1인씩 교체됩니다(제132·137조).",
              "총재는 무장 부대를 직접 지휘할 수 없습니다(제144조).",
              "총재정부는 법률안을 제출할 수 없고 500인회가 발의권을 독점합니다(제76·163조)."
            ]
          },
          "right": {
            "heading": "혁명력 8년 헌법(통령정부)",
            "rows": [
              "세 통령의 임기는 10년이고 연임 제한이 없으며, 보나파르트가 제1통령입니다(제39조).",
              "제1통령이 장관과 육해군 장교를 임의로 임명·해임합니다(제41조).",
              "제2·3통령은 자문권만 가지며 제1통령의 결정으로 족합니다(제42조)."
            ]
          }
        },
        "en": {
          "title": "Executive power in the Constitutions of 1795 and Year VIII",
          "left": {
            "heading": "1795 Constitution (Directory)",
            "rows": [
              "Executive power lies with five Directors, one replaced each year (Articles 132, 137).",
              "Directors may not command armed forces (Article 144).",
              "The Directory may not submit bills; the Five Hundred alone initiate laws (Articles 76, 163)."
            ]
          },
          "right": {
            "heading": "Constitution of Year VIII (Consulate)",
            "rows": [
              "Three consuls serve ten years with unlimited re-election, and Bonaparte is First Consul (Article 39).",
              "The First Consul appoints and dismisses ministers and army and navy officers at will (Article 41).",
              "The Second and Third Consuls only advise; the First Consul’s decision suffices (Article 42)."
            ]
          }
        }
      },
      "lessons": [
        {
          "id": "french-revolution-intro-ch08-basic",
          "level": "basic",
          "title": {
            "ko": "테르미도르 뒤 혁명은 어떻게 끝났을까?",
            "en": "How did the Revolution end after Thermidor?"
          },
          "questions": [
            {
              "id": "q1",
              "type": "multiple_choice",
              "points": 2,
              "prompt": {
                "ko": "1795년 헌법에서 기초의회의 투표권과 선거인 자격은 각각 어떤 조건에 묶였을까요?",
                "en": "In the 1795 Constitution, what conditions governed voting in the primary assemblies and eligibility as an elector?"
              },
              "choices": {
                "ko": [
                  "직접세를 내면 기초의회에서 투표할 수 있었지만, 선거인이 되려면 노동 100~200일 치 수익의 재산을 소유하거나 임차해야 했습니다.",
                  "선거인에게는 재산 조건이 없었지만, 기초의회에서 투표하려면 노동 200일 치 수익을 내는 토지를 소유해야 했습니다.",
                  "납세나 재산 조건 없이 21세 이상 주민 모두가 기초의회에서 입법부 의원을 직접 선출하도록 했습니다."
                ],
                "en": [
                  "Paying a direct tax let one vote in a primary assembly, but an elector had to own or rent property yielding 100–200 days’ labour.",
                  "Electors faced no property condition, but voting in a primary assembly required owning land yielding 200 days’ labour.",
                  "All residents aged 21 elected deputies directly in the primary assemblies, with no tax or property condition."
                ]
              },
              "answer": 0,
              "choiceFeedback": {
                "ko": [
                  "제8조는 직접세 납부를 시민의 조건으로, 제35조는 코뮌 규모에 따라 100~200일 치 노동 가치의 재산을 선거인의 조건으로 정했습니다.",
                  "두 조건이 뒤바뀌었습니다. 재산 문턱은 기초의회 투표가 아니라 입법부 의원을 뽑는 선거인 단계에 있었습니다.",
                  "기초의회는 선거인을 뽑았고(제33조), 입법부 의원은 선거의회가 선출했습니다(제41조). 직접세 조건도 있었습니다."
                ],
                "en": [
                  "Article 8 made paying a direct tax a condition of citizenship; Article 35 set property worth 100–200 days’ labour, by commune size, for electors.",
                  "The two conditions are swapped. The property threshold sat at the level of electors choosing deputies, not primary voting.",
                  "Primary assemblies chose electors (Article 33), and electoral assemblies chose deputies (Article 41); there was also a direct-tax condition."
                ]
              },
              "explanation": {
                "ko": "1795년 헌법은 두 단계 선거를 두었습니다. 직접세를 내는 21세 이상 주민이 기초의회에서 시민으로 투표했고, 직접세 명부에 없는 사람도 노동 3일 치의 대인세를 내겠다고 등록할 수 있었습니다(제304조). 공화국을 위해 원정에 참여한 사람은 납세 조건 없이 시민이 됐습니다(제9조). 그러나 실제로 입법부 의원을 뽑는 선거인은 노동 100~200일 치 수익의 재산을 소유하거나 임차해야 했습니다(제35조). 재산 문턱을 투표 전체에 붙이면 이 구조를 놓칩니다. 넓은 투표와 좁은 선거인단의 조합으로 재산을 가진 시민의 영향력을 보장하려 한 것입니다.",
                "en": "The 1795 Constitution had two-stage elections. Residents aged 21 who paid a direct tax voted as citizens in primary assemblies, and those not on the tax rolls could register to pay a personal tax worth three days’ labour (Article 304); those who had served in a campaign for the Republic became citizens without tax (Article 9). But the electors who actually chose deputies had to own or rent property yielding 100–200 days’ labour (Article 35). Attaching the threshold to all voting misses the structure: wide voting combined with a narrow electorate secured the influence of propertied citizens."
              },
              "source": {
                "kind": "reference",
                "href": "/commulingo/docs/france-directoire-consulat-1795-1799",
                "label": {
                  "ko": "1795년 헌법 제8·9·35·304조",
                  "en": "Constitution of 1795, Articles 8, 9, 35, and 304"
                }
              }
            },
            {
              "id": "q2",
              "type": "multiple_choice",
              "points": 2,
              "prompt": {
                "ko": "1795년 헌법 제정자들은 공안위원회 같은 권력 집중과 자코뱅 클럽 같은 민중 동원을 막으려고 어떤 장치를 두었을까요?",
                "en": "What devices did the framers of 1795 build in against concentrated power like the Committee of Public Safety and popular mobilisation like the Jacobin clubs?"
              },
              "choices": {
                "ko": [
                  "집행권을 매년 1인씩 교체되는 5인 총재에게 나누고 총재의 군 지휘를 금했으며, 정치 결사의 상호 서신과 집단 청원을 금지했습니다.",
                  "집행권을 입법부가 매달 갱신하는 위원회에 맡기고, 전국 자코뱅계 정치 클럽의 연결망을 입법부의 공식 자문 기관으로 삼아 보호했습니다.",
                  "집행권을 한 명의 총재에게 모으는 대신 임기를 1년으로 제한하고, 파리의 구역 총회가 법률안을 직접 발의할 수 있게 했습니다."
                ],
                "en": [
                  "It divided executive power among five Directors, one replaced yearly, barred them from commanding troops, and banned political associations from corresponding or petitioning collectively.",
                  "It gave executive power to a committee renewed monthly by the legislature and made the national network of political clubs its official advisory body.",
                  "It concentrated executive power in one Director with a one-year term, and let the Paris section assemblies initiate bills directly."
                ]
              },
              "answer": 0,
              "choiceFeedback": {
                "ko": [
                  "제132·137·144조가 집행권을 나누고 군 지휘를 막았고, 제361~364조가 민중 협회라는 이름과 결사 사이의 서신, 집단 청원을 막았습니다.",
                  "입법부 안에서 갱신되는 위원회는 1793~1794년 혁명정부의 방식입니다. 1795년 헌법은 클럽 연결망을 오히려 금지했습니다.",
                  "총재는 다섯 명이었고, 법률 발의권은 500인회만 가졌습니다(제76조). 기초의회도 헌법이 부여한 선거 외에는 다른 선거를 치를 수 없었습니다(제30조)."
                ],
                "en": [
                  "Articles 132, 137, and 144 divided executive power and barred command of troops; Articles 361–364 banned the name popular society, correspondence between associations, and collective petitions.",
                  "Committees renewed within the legislature were the method of revolutionary government in 1793–1794; the 1795 Constitution banned club networks outright.",
                  "There were five Directors, and only the Five Hundred could initiate laws (Article 76); primary assemblies could hold no elections beyond those the constitution assigned (Article 30)."
                ]
              },
              "explanation": {
                "ko": "1795년 헌법은 1793~1794년의 경험에 대한 대답처럼 읽힙니다. 집행권은 입법부가 뽑는 5인 총재에게 나뉘고 매년 한 명씩 교체됐으며, 총재는 재임 중과 퇴임 뒤 2년 동안 무장 부대를 지휘할 수 없었습니다. 군 총지휘권을 한 사람에게 줄 수도 없었습니다. 동시에 어떤 시민 집회도 민중 협회를 자칭할 수 없었고, 정치 결사는 서로 서신을 주고받거나 가입 관계를 맺을 수 없었으며, 청원은 개인적이어야 했습니다. 자코뱅 클럽이 지방 클럽과 맺었던 연결망 자체를 불법으로 만든 조항입니다.",
                "en": "The 1795 Constitution reads like an answer to 1793–1794. Executive power was divided among five Directors chosen by the legislature, one replaced each year, and Directors could not command armed forces during office or for two years after. Supreme command could not go to one person. At the same time no gathering of citizens could call itself a popular society, political associations could not correspond or affiliate with each other, and petitions had to be individual. These articles made the very network the Jacobin club had built with provincial clubs illegal."
              },
              "source": {
                "kind": "reference",
                "href": "/commulingo/docs/france-directoire-consulat-1795-1799",
                "label": {
                  "ko": "1795년 헌법 제132·137·144·289·361~364조",
                  "en": "Constitution of 1795, Articles 132, 137, 144, 289, and 361–364"
                }
              }
            },
            {
              "id": "q3",
              "type": "multiple_choice",
              "points": 2,
              "prompt": {
                "ko": "「평등파 선언」은 법 앞의 평등과 토지 문제에 대해 무엇을 주장했을까요?",
                "en": "What did the Manifesto of the Equals argue about equality before the law and the land question?"
              },
              "choices": {
                "ko": [
                  "법 앞의 평등은 아름답고도 무익한 허구라 하고, 농지 분할이 아니라 토지의 개인 소유를 없애는 재산 공동체를 요구했습니다.",
                  "법 앞의 평등조차 아직 실현되지 않았다며, 대지주의 토지를 빈농에게 똑같이 나누어 작은 소유자를 늘리는 농지법을 요구했습니다.",
                  "법 앞의 평등은 이미 이루어졌으니, 1793년의 생필품 최고가격과 임금 상한을 영구 제도로 되살리자고 요구했습니다."
                ],
                "en": [
                  "It called equality before the law a beautiful and sterile fiction and demanded, not land division, but a community of goods abolishing private land ownership.",
                  "It said even equality before the law was unrealised and demanded an agrarian law dividing great estates equally among poor peasants.",
                  "It said equality before the law was achieved and demanded that the 1793 price maximum and wage ceiling be revived as permanent institutions."
                ]
              },
              "answer": 0,
              "choiceFeedback": {
                "ko": [
                  "선언은 농지 분할을 원칙 없는 이들의 즉각적 소망이라 하고, 「토지는 누구의 것도 아니다」, 결실은 모든 사람의 것이라고 썼습니다.",
                  "선언은 적들이 자신들을 농지법의 재현이라고 몰아붙인다고 반박하며, 토지 분할보다 더 숭고한 공동재산을 지향한다고 했습니다.",
                  "최고가격법은 1793년의 가격·임금 통제이고, 선언은 가격 통제가 아니라 소유 자체의 폐지와 공동 향유를 요구했습니다."
                ],
                "en": [
                  "The manifesto called land division the immediate wish of men without principles and wrote that the land belongs to no one and its fruits to all.",
                  "The manifesto rebutted enemies who branded it a revival of the agrarian law, saying it aimed at something more sublime: common property.",
                  "The Maximum was the price and wage control of 1793; the manifesto demanded not price control but the abolition of ownership and common enjoyment."
                ]
              },
              "explanation": {
                "ko": "선언은 시민 사회가 존재한 이래 평등이 인정은 받았지만 한 번도 실현되지 않았고, 「너희는 모두 법 앞에 평등하다」는 대답은 가난한 이들을 달래는 말에 불과했다고 봅니다. 그래서 인권 선언에 기록된 평등이 아니라 「우리 집 지붕 아래」의 평등을 요구했습니다. 가장 흔한 오독은 이를 토지를 나누어 소유자를 늘리자는 요구로 읽는 것입니다. 선언은 농지법과 명시적으로 선을 긋고, 토지의 개인 소유를 없애고 대지의 결실을 공동으로 누리는 공동재산을 요구했습니다. 소유자를 늘리는 것과 소유를 없애는 것은 정반대의 방향입니다.",
                "en": "The manifesto holds that since civil society began equality has been acknowledged but never realised, and that telling the poor they are all equal before the law merely placates them. It therefore wanted not the equality written in the Declaration of Rights but equality under our own roofs. The commonest misreading takes this as a call to divide land and multiply owners. The manifesto explicitly rejects the agrarian law and demands common property: no private ownership of land and common enjoyment of its fruits. Multiplying owners and abolishing ownership point in opposite directions."
              },
              "source": {
                "kind": "reference",
                "href": "/commulingo/docs/france-subsistence-and-equality-1792-1796#marechal-manifesto-equals-1796",
                "label": {
                  "ko": "마레샬, 평등파 선언(1796), 법 앞의 평등과 농지법 대목",
                  "en": "Maréchal, Manifesto of the Equals (1796), passages on legal equality and the agrarian law"
                }
              }
            },
            {
              "id": "q4",
              "type": "multiple_choice",
              "points": 2,
              "prompt": {
                "ko": "「평등파 선언」은 1791년·1793년·1795년의 헌법을 어떻게 비교했고, 봉기 지도부는 선언의 어느 대목에 이견을 보였을까요?",
                "en": "How did the Manifesto of the Equals compare the constitutions of 1791, 1793, and 1795, and which passage did the revolt’s leaders dispute?"
              },
              "choices": {
                "ko": [
                  "1791·1795년 헌장은 귀족적, 1793년 헌장은 거대한 발걸음이나 미완이라 했고, 지도부 일부는 예술이 파멸해도 좋다는 대목에 반대했습니다.",
                  "1793년 헌법이 이미 공동의 행복을 온전히 실현했으니 그 시행만 요구하면 된다고 했고, 지도부는 마레샬의 초안을 수정 없이 만장일치로 채택했습니다.",
                  "권리에 의무를 더한 1795년 헌법이 1793년보다 진전했다고 평가했고, 지도부 일부는 무장 봉기와 폭력을 직접 언급한 대목에만 반대했습니다."
                ],
                "en": [
                  "The 1791 and 1795 charters were aristocratic chains, 1793 a giant step but unfinished; some leaders objected to letting the arts perish.",
                  "The 1793 Constitution had already realised common happiness and needed only to be applied, and the leaders adopted Maréchal’s draft unanimously.",
                  "The 1795 Constitution, adding duties to rights, was an advance on 1793, and some leaders objected only to passages mentioning revolt and violence."
                ]
              },
              "answer": 0,
              "choiceFeedback": {
                "ko": [
                  "선언의 헌법 평가와, 마레샬의 「필요하다면 모든 예술이 파멸해도 좋다」는 문장에 대한 지도부 일부의 반대입니다.",
                  "선언은 1793년 헌장이 공동의 행복이라는 원칙을 천명했지만 아직 목표에 닿지 못했다고 했고, 선언은 지도부의 만장일치 지지를 받지 못했습니다.",
                  "선언은 1795년 헌장을 1791년과 함께 족쇄를 단단히 채운 귀족적 헌장으로 묶었습니다. 의무 선언을 진전으로 보지 않았습니다."
                ],
                "en": [
                  "That is the manifesto’s verdict on the constitutions and some leaders’ objection to Maréchal’s line about letting all the arts perish if need be.",
                  "The manifesto said the 1793 charter proclaimed common happiness but had not reached it, and the manifesto did not win the leaders’ unanimous support.",
                  "The manifesto grouped the 1795 charter with 1791 as aristocratic charters that tightened the chains; it did not see the declaration of duties as progress."
                ]
              },
              "explanation": {
                "ko": "선언은 헌법의 탁월함을 사실상의 평등에 얼마나 기반을 두었는지로 잽니다. 그 잣대로 1791년과 1795년 헌장은 족쇄를 부수기는커녕 단단히 채운 귀족적 헌장이고, 1793년 헌장은 공동의 행복을 천명한 거대한 발걸음이지만 아직 목표에 닿지 못했습니다. 1795년 헌법이 평등을 법의 동일성으로, 소유를 사회 질서의 토대로 정의했다는 점과 나란히 보면 이 평가의 과녁이 분명해집니다. 다만 선언은 마레샬 한 사람이 쓴 문서였고, 지도부는 모든 예술이 파멸해도 좋다는 대목 등을 두고 이견을 보였습니다. 선언 전체를 운동의 합의된 강령으로 읽으면 안 됩니다.",
                "en": "The manifesto measures a constitution by how far it rests on real equality. By that yardstick the charters of 1791 and 1795 tightened the chains rather than breaking them, and that of 1793, though a giant step proclaiming common happiness, still fell short. Set beside the 1795 Constitution’s definition of equality as sameness before the law and of property as the basis of social order, the target of this verdict is clear. Yet the manifesto was written by Maréchal alone, and the leaders disagreed over passages such as letting all the arts perish, so it should not be read as the movement’s agreed programme."
              },
              "source": {
                "kind": "reference",
                "href": "https://www.marxists.org/history/france/revolution/conspiracy-equals/1796/manifesto.htm",
                "label": {
                  "ko": "「평등파 선언」(1796)과 편집 안내: 마레샬의 작성과 지도부의 이견",
                  "en": "Manifesto of the Equals (1796) and editorial note: Maréchal’s authorship and the leaders’ disagreement"
                }
              }
            },
            {
              "id": "q5",
              "type": "multiple_choice",
              "points": 2,
              "prompt": {
                "ko": "1797년 캄포포르미오 조약은 이탈리아에서 혁명의 확산과 강대국 거래가 겹친 모습을 어떻게 보여 줄까요?",
                "en": "How does the Treaty of Campo Formio of 1797 show the spread of revolution in Italy overlapping with great-power bargaining?"
              },
              "choices": {
                "ko": [
                  "이탈리아군 총사령관 보나파르트가 서명해 오스트리아가 시살피나 공화국을 승인하게 했지만, 베네치아 시와 옛 베네치아령은 오스트리아에 넘겼습니다.",
                  "총재정부 외무장관이 서명해 이탈리아의 옛 군주국을 모두 공화국으로 바꾸고, 오스트리아를 이탈리아에서 완전히 물러나게 했습니다.",
                  "보나파르트가 서명했지만 자매공화국 문제는 다루지 않았고, 프랑스가 벨기에를 포기하는 대신 롬바르디아를 프랑스에 병합했습니다."
                ],
                "en": [
                  "Bonaparte, commander of the Army of Italy, signed; Austria recognised the Cisalpine Republic, but Venice and former Venetian lands went to Austria.",
                  "The Directory’s foreign minister signed; every old Italian monarchy became a republic and Austria withdrew from Italy entirely.",
                  "Bonaparte signed but left sister republics aside, and France gave up Belgium in exchange for annexing Lombardy to France."
                ]
              },
              "answer": 0,
              "choiceFeedback": {
                "ko": [
                  "조약 서문의 프랑스 전권은 보나파르트이고, 제8조가 시살피나 공화국 승인, 제6조가 베네치아 시와 이스트리아·달마티아의 오스트리아 귀속입니다.",
                  "프랑스 전권은 장군 보나파르트였고, 오스트리아는 베네치아 시와 옛 베네치아령을 얻어 이탈리아에 오히려 남았습니다.",
                  "제3조는 오스트리아가 벨기에를 프랑스에 넘긴다고 씁니다. 옛 오스트리아령 롬바르디아는 병합되지 않고 시살피나 공화국에 들어갔습니다(제8조)."
                ],
                "en": [
                  "The treaty names Bonaparte as France’s plenipotentiary; Article 8 recognises the Cisalpine Republic and Article 6 gives Venice, Istria, and Dalmatia to Austria.",
                  "France’s plenipotentiary was General Bonaparte, and Austria actually stayed in Italy by gaining Venice and former Venetian lands.",
                  "Article 3 has Austria cede Belgium to France; former Austrian Lombardy was not annexed but formed part of the Cisalpine Republic (Article 8)."
                ]
              },
              "explanation": {
                "ko": "이탈리아 원정은 옛 군주국 자리에 자매공화국을 세우고 특권 폐지와 공화주의를 퍼뜨렸지만, 프랑스군은 점령지에 기여금과 물자를 요구하고 새 정부를 통제했습니다. 캄포포르미오 조약은 이 이중성을 조문으로 보여 줍니다. 오스트리아는 벨기에를 포기하고 시살피나 공화국을 독립국으로 승인했지만, 같은 조약에서 베네치아 시와 석호, 이스트리아, 달마티아가 오스트리아에 넘어갔고 프랑스는 레반트의 옛 베네치아령 섬들을 얻었습니다(제5조). 혁명의 확산이 영토 교환과 함께 진행된 것입니다. 또 프랑스를 대표해 서명한 이가 파리의 외교관이 아니라 현지 군 총사령관이었다는 점은 장군의 정치적 비중이 커졌음을 보여 줍니다.",
                "en": "The Italian campaign set up sister republics in place of old monarchies and spread the abolition of privilege and republicanism, yet the French army demanded contributions and supplies and controlled the new governments. Campo Formio shows this double face in its articles. Austria gave up Belgium and recognised the Cisalpine Republic, but in the same treaty Venice and its lagoons, Istria, and Dalmatia went to Austria, while France took the former Venetian islands of the Levant (Article 5). The spread of revolution went hand in hand with territorial exchange. And the man who signed for France was not a Paris diplomat but the local army commander, a sign of the general’s growing political weight."
              },
              "source": {
                "kind": "reference",
                "href": "/commulingo/docs/france-revolutionary-peace-treaties-1795-1802#treaty-campo-formio-1797",
                "label": {
                  "ko": "캄포포르미오 조약(1797년 10월 17일) 서문과 제3·5·6·8조",
                  "en": "Treaty of Campo Formio (17 October 1797), preamble and Articles 3, 5, 6, and 8"
                }
              }
            },
            {
              "id": "q6",
              "type": "multiple_choice",
              "points": 2,
              "prompt": {
                "ko": "브뤼메르 쿠데타 뒤의 혁명력 8년 헌법은 1795년 헌법의 집행권 구조를 어떻게 바꾸었을까요?",
                "en": "How did the Constitution of Year VIII, after the Brumaire coup, change the executive structure of the 1795 Constitution?"
              },
              "choices": {
                "ko": [
                  "5인 총재 대신 임기 10년의 세 통령을 두고, 제1통령 보나파르트에게 장관·장교 임명권을 주며 다른 두 통령은 자문만 하게 했습니다.",
                  "5인 총재의 합의제는 그대로 두고 보나파르트를 한 전역의 전시 총사령관으로만 임명해, 군을 민간 집행부의 통제 아래 계속 묶어 두었습니다.",
                  "총재정부를 폐지하고 제1통령을 국민이 직접 뽑아 세습하게 해, 권리 선언과 봉건적 특권의 폐지까지 함께 취소했습니다."
                ],
                "en": [
                  "Instead of five Directors, three consuls with ten-year terms; First Consul Bonaparte appointed ministers and officers, and the other two only advised.",
                  "It kept the five-Director collegial system and appointed Bonaparte only wartime commander, binding the army under civilian executive control.",
                  "It abolished the Directory, made the First Consul directly elected and hereditary, and also revoked the declaration of rights and the abolition of feudal privilege."
                ]
              },
              "answer": 0,
              "choiceFeedback": {
                "ko": [
                  "제39조가 세 통령과 10년 임기, 보나파르트의 제1통령 지명을, 제41·42조가 제1통령의 임명권과 두 통령의 자문권을 정했습니다.",
                  "총재정부는 쿠데타로 끝났습니다. 1795년 헌법의 군 통제 장치와 달리 새 헌법은 장교 임명권까지 제1통령에게 주었습니다.",
                  "제1통령은 선거가 아니라 헌법 본문이 지명했고 세습 규정도 없었습니다. 쿠데타는 법적 평등과 봉건적 특권 폐지 같은 혁명기의 변화를 모두 취소하지는 않았습니다."
                ],
                "en": [
                  "Article 39 sets three consuls, ten-year terms, and names Bonaparte First Consul; Articles 41 and 42 give him appointments and the others only advice.",
                  "The Directory ended with the coup. Unlike the 1795 safeguards on the army, the new constitution gave even the appointment of officers to the First Consul.",
                  "The constitution itself named the First Consul, not an election, and set no heredity; the coup did not undo all revolutionary changes such as legal equality and the end of feudal privilege."
                ]
              },
              "explanation": {
                "ko": "1795년 헌법은 집행권을 다섯 총재에게 나누고, 총재가 군을 지휘하지 못하게 하며, 법률 발의권을 500인회에 두었습니다. 그러나 왕당파와 급진파 사이에서 총재정부는 선거 결과를 뒤집는 쿠데타와 군대에 거듭 기댔고, 이탈리아의 승리로 명성을 얻은 보나파르트는 1799년 11월 시에예스 등과 손잡고 군인을 동원해 의회를 압박했습니다. 혁명력 8년 헌법은 헌법 본문에서 그를 제1통령으로 지명하고, 장관·대사·장교·지방 행정 위원의 임명과 해임을 맡겼으며, 나머지 두 통령의 의견은 기록될 뿐 제1통령의 결정으로 족하게 했습니다. 왕정 복원은 아니었지만, 권력 분산을 목표로 한 1795년의 설계가 한 사람에게 권한을 모으는 설계로 뒤집힌 것입니다.",
                "en": "The 1795 Constitution split executive power among five Directors, barred them from commanding the army, and left initiative of laws to the Five Hundred. Yet between royalists and radicals the Directory kept leaning on coups against election results and on the army, and Bonaparte, famous from Italy, joined Sieyès and others in November 1799 to press the legislature with soldiers. The Constitution of Year VIII named him First Consul in its own text, gave him the appointment and dismissal of ministers, ambassadors, officers, and local administrators, and let the other consuls’ views be recorded while his decision alone sufficed. It was not a restoration of monarchy, but the 1795 design for dispersing power was turned into one concentrating it in one man."
              },
              "source": {
                "kind": "reference",
                "href": "/commulingo/docs/france-directoire-consulat-1795-1799",
                "label": {
                  "ko": "1795년 헌법 제132·144조와 혁명력 8년 헌법 제39~42조",
                  "en": "Constitution of 1795, Articles 132 and 144; Constitution of Year VIII, Articles 39–42"
                }
              }
            }
          ]
        }
      ]
    }
  ],
  "noAutoLink": [
    "6조",
    "헌법 6조",
    "헌법 제6조",
    "테르미도르",
    "Article 6",
    "Article Six",
    "Thermidor"
  ]
};
