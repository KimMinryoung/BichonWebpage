# 프랑스 혁명·혁명 전쟁 추가 문헌 번역

2026-09-14 UTC 기준: 큐 22건 중 **21건을 참고문헌에 출판**, **주르당 징병법 1건은 원문 접근 장애로 보류**. 7개 문헌집과 단독 문헌 1개로 편집했다. 기존 문헌집 2개를 확장하고 새 참고문헌 6개를 등록했다. 출판한 큐 21건은 `done`과 실제 문헌집 `resolved_id`를 기록했고, 2052번만 `pending`이다. [출판 목록과 검증](publication/README.md)을 참조한다. 아래 `translations/` 링크는 재현용으로 보존한 최초 번역이며, 공개본은 `publication/`의 교정·편집본이다.

## 실행 설정과 사용량

- 기존 `scripts/translate-course-fulltext.py`와 backend `runtime_tools.archival_translation` 실행·캐시·검증기를 사용했다.
- DeepSeek Flash / `deepseek_anthropic`, **thinking enabled**, effort high, timeout 600초, 청크 동시성 5. 프랑스어 기본 Gemini 호출은 이 실행 프로세스에서 DeepSeek으로 대체했다.
- 최초 응답 한도 **48,000 토큰**, 공유 실행기의 출력 부족 재시도 상한 **65,536 토큰**. 두 값 모두 **추론 + 가시 출력** 한도이다. 별도의 전체 배치 토큰 상한은 사용자가 지정하지 않았다.
- 전체 **118회** provider 호출: 추론 포함 출력 **768,293**, 캐시를 포함한 입력 **305,203**, 합계 **1,073,496 토큰**. 원판 교정 후 브리소 재번역과 알자바르티 검증 재시도까지 포함한다. provider가 추론 토큰을 별도로 분리해 주지는 않았다.
- [호출별 사용량](usage.jsonl), [전체 상태](status.json), [실행 로그](runs/). 최종 `.result.json`만 합산하면 이전 브리소 실행을 빠뜨리므로 전체 실행 로그의 usage 이벤트를 합산한다.

## 번역 초안 검증과 출판 교정

21개 모두 저본 파일 SHA-256, 시작·끝 경계, 모든 원문 블록의 캐시 source hash 및 번역 결과 존재, HTML 조립 문단 수, 번역 실패 0건을 확인했다. 본문에 `[원문 판독 불명]` 표지는 남아 있지 않다. 공유 검증기의 숫자·날짜·표기 검토 목록은 각 `.deepseek.cache.review.json`에 있다. **자동 구조 검증은 번역의 정확성과 문체에 대한 교열 완료를 뜻하지 않는다.**

- 브리소: 당시 12월 16일 연설 전문. 난외 기호·쪽번호를 제거하고 페이지를 넘어간 문장을 연결했다. 판독 불명 구절을 원판 4·8·11·13·14쪽과 대조한 후 재번역했다.
- 성직자 시민헌법: 4편·조항 표제 보존. 출판본은 제1편 제2조의 파미에·디뉴·렌과 제9조의 인구 조건을 동시대 법문과 대조하여 교정했다.
- 캄포포르미오: 공개 25조·서명·비준문. 별도 비밀조항은 미수록이며, 공개본 해제에 그 범위를 명시했다. 바젤 두 조약 역시 사용한 전사에 비밀조항은 수록되어 있지 않다.
- 방토즈: 8일·13일 보고 및 최종 법령을 구분했다. 13일 보고의 OCR가 없는 22쪽은 이미지에서 전사했다. 후대 교감 주석과 다른 초안을 본문에 섞지 않았다.
- 알자바르티: 아랍어 제4권 37–45쪽에서 히즈라력 1213년 주마다 알아우왈월 기록 전체를 선택했다. 1798년 카이로 봉기를 포함하는 날짜 경계가 있는 발췌이며, 저작 전체 번역은 아니다. 아랍어 PDF 합자·인명과 단위의 추가 전문 교열이 필요하다.
- 아랍어 실행은 기존 공통 실행기에 프로세스 내부 언어 어댑터만 추가했다. 원문 그대로 반환·괄호 밖 아랍어 잔존·무관한 문자 혼입을 계속 차단하고, 아랍어 저본의 괄호 안 인명 원어 병기만 허용한다. 이 분기와 프랑스어 검증 격리를 별도 확인했다.

## 문헌별 결과

| 큐 | 문헌 | 상태·번역 |
| --- | --- | --- |
| 2009 | 특권 폐지에 관한 8월 법령 (1789) | [번역 초안](translations/france-august-decrees-1789.html) |
| 2010 | 봉건적 부담의 무상 폐지 법령 (1793년 7월 17일) | [번역 초안](translations/france-feudal-dues-abolition-1793.html) |
| 2011 | 성직자민사기본법 (1790년 7월 12일) | [번역 초안](translations/france-civil-constitution-clergy-1790.html) |
| 2012 | 르 샤플리에 법 (1791년 6월 14일) | [번역 초안](translations/france-le-chapelier-law-1791.html) |
| 2044 | 로베스피에르, 전쟁에 관한 연설 (1792년 1월 2일) | [번역 초안](translations/robespierre-war-speech-1792-01-02.html) |
| 2045 | 브리소의 개전 찬성 연설 (1791년 12월) | [번역 초안](translations/brissot-war-speech-1791.html) |
| 2046 | 필니츠 선언 (1791년 8월 27일) | [번역 초안](translations/declaration-pillnitz-1791.html) |
| 2047 | 브라운슈바이크 선언 (1792년 7월 25일) | [번역 초안](translations/brunswick-manifesto-1792.html) |
| 2048 | 오스트리아 군주에 대한 선전포고 (1792년 4월 20일) | [번역 초안](translations/france-war-declaration-austria-1792.html) |
| 2049 | 외국 인민에 대한 형제애와 원조 법령 (1792년 11월 19일) | [번역 초안](translations/france-fraternity-decree-1792.html) |
| 2050 | 점령지의 혁명 행정에 관한 법령 (1792년 12월 15일) | [번역 초안](translations/france-occupied-territories-decree-1792.html) |
| 2051 | 국민총동원령 (1793년 8월 23일) | [번역 초안](translations/france-levee-en-masse-1793.html) |
| 2052 | 주르당-델브렐 징병법 (1798년 9월 5일) | 원문 확보 보류 |
| 2013 | 생쥐스트의 방토즈 보고와 법령 (1794) | [번역 초안](translations/saint-just-ventose-reports-decrees-1794.html) |
| 2014 | 여성 정치 결사 금지 보고와 법령 (1793년 10월 30일) | [번역 초안](translations/france-womens-clubs-ban-1793.html) |
| 2053 | 바젤 평화조약: 프로이센·스페인 (1795) | [번역 초안](translations/treaties-basel-1795.html) |
| 2054 | 캄포포르미오 조약 (1797년 10월 17일) | [번역 초안](translations/treaty-campo-formio-1797.html) |
| 2055 | 뤼네빌 조약 (1801년 2월 9일) | [번역 초안](translations/treaty-luneville-1801.html) |
| 2056 | 아미앵 조약 (1802년 3월 25일) | [번역 초안](translations/treaty-amiens-1802.html) |
| 2057 | 보나파르트의 이집트 주민에게 보내는 포고 (1798년 7월) | [번역 초안](translations/bonaparte-egypt-proclamation-1798.html) |
| 2015 | 송토나의 생도맹그 노예해방 포고 (1793년 8월 29일) | [번역 초안](translations/sonthonax-emancipation-proclamation-1793.html) |
| 2058 | 알자바르티의 프랑스 점령 기록 (1798) | [번역 초안](translations/al-jabarti-french-occupation-1798.html) |

## 주르당 법 원문 접근 장애

확인한 저본은 BnF/Gallica `bpt6k56398t`, Bulletin des lois 제223호, 법령 제1995호이다. 원판 `f491`에서 표제·1798년 9월 5일 날짜를 확인했고 `f491–494`(인쇄 1–4쪽)를 확보했다. 이후 `f495–502` 이미지 요청은 크기·연결 방식·요청 간격을 달리해도 서버가 연결을 종료했다. 공식 ALTO OCR 경로는 500 오류, 일반 텍스트/PDF 경로는 보안 확인 화면이었다. 4쪽에서 제15조가 끝나며 나머지 조항이 없으므로, 이 자료를 전문 번역한 것처럼 처리하지 않았다.

재개 시 [IIIF manifest](sources/jourdan-iiif.json)의 `f495` 이후 실제 법령 종료·서명 경계를 먼저 확인한다. 원판 요청 URL 예: `https://gallica.bnf.fr/iiif/ark:/12148/bpt6k56398t/f495/full/1000,/0/native.jpg`. 현재 이 문헌의 번역 스펙은 없다.

## 재개·재검증

```bash
/home/grass/leninbot/venv/bin/python scripts/translate-course-fulltext.py --thinking enabled --concurrency 5 dev_docs/commulingo-french-translations-20260913/specs/*.json
/home/grass/leninbot/venv/bin/python dev_docs/commulingo-french-translations-20260913/audit.py
```

스펙·원문·체크포인트는 이 디렉터리에 있다. 기존 성공 캐시는 검증 후 재사용한다. 새 실행 로그도 `runs/`에 저장하고 audit를 실행해야 전체 사용량 집계에 반영된다. `sourceLang: ar`는 이 runner에만 추가했으므로 backend 기본 CLI로 직접 실행하지 않는다.
