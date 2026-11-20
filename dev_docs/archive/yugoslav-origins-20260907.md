# 유고슬라비아 출신 배경 재분류 (2026-09-07)

유고슬라비아 소속 이력과 민족·국가적 출신 배경을 분리한다. 출생지를 민족으로 치환하지 않는다. 현재 모델은 국가 코드 하나만 저장하므로 혼합 배경은 대표 분류 코드와 함께 전체 한영 라벨 및 근거에 남긴다. 이 작업은 유고슬라비아인이라는 역사적 자기인식 자체를 부정하거나 정치적 입장을 민족에서 추론하는 작업이 아니다.

| 인물 | 출신 분류 코드 | 출신 라벨 | 근거 |
|---|---|---|---|
| 요시프 브로즈 티토 (josip-broz-tito) | croatia | 크로아티아·슬로베니아계 / Croat-Slovene descent | [자료](https://novaonline.nvcc.edu/eli/evans/his135/events/tito80/tito80.html), Biography: parents |
| 블라디미르 벨레비트 (vladimir-velebit) | serbia | 세르비아·슬로베니아·크로아티아계 / Serb-Slovene-Croat descent | [자료](https://en.wikipedia.org/wiki/Vladimir_Velebit), Early life and education |
| 에드바르트 카르델 (edvard-kardelj) | slovenia | 슬로베니아 / Slovenia | [자료](https://www.enciklopedija.hr/clanak/kardelj-edvard), Opening biographical identification |
| 보리스 키드리치 (boris-kidric) | slovenia | 슬로베니아 / Slovenia | [자료](https://www.enciklopedija.hr/clanak/kidric-boris), Opening biographical identification |
| 알렉산다르 란코비치 (aleksandar-rankovic) | serbia | 세르비아 / Serbia | [자료](https://www.enciklopedija.hr/clanak/rankovic-aleksandar), Opening biographical identification |
| 밀란 질라스 (milovan-djilas) | serbia | 세르비아 (몬테네그로계) / Serb from Montenegro | [자료](https://vreme.com/vreme/intervju-milovan-djilas/), Vreme no. 45, 2 September 1991; answer about nostalgia for communism |
| 예로님 페로비치 (jeronim-perovi) | croatia | 크로아티아계 / Croatian descent | [자료](https://croatis.ch/wp-content/uploads/libra/Libra_33.pdf), PDF page 14 (index 13), interview with Nada Boskovska: origin of teaching staff |
| 이반 리바르 (ivan-ribar) | croatia | 크로아티아 / Croatia | [자료](https://www.enciklopedija.hr/clanak/ribar-ivan), Opening biographical identification |
| 페코 다프체비치 (peko-dapcevic) | montenegro | 몬테네그로 / Montenegro | [자료](https://en.wikipedia.org/wiki/Peko_Dap%C4%8Devi%C4%87), Biography and Montenegrin politician classification |
| 드라자 미하일로비치 (draza-mihailovic) | serbia | 세르비아 / Serbia | [자료](https://en.wikipedia.org/wiki/Dra%C5%BEa_Mihailovi%C4%87), Lead: Yugoslav Serb general |
| 블라디미르 제르야비치 (vladimir-zerjavic) | croatia | 크로아티아 / Croatia | [자료](https://www.enciklopedija.hr/clanak/zerjavic-vladimir), Opening biographical identification |
| 보골류브 코초비치 (bogoljub-kocovic) | serbia | 세르비아·프랑스계 / Serb-French descent | [자료](https://en.wikipedia.org/wiki/Bogoljub_Ko%C4%8Dovi%C4%87), Biography: parents |
| 이반 슈바시치 (ivan-subasic) | croatia | 크로아티아 / Croatia | [자료](https://www.enciklopedija.hr/clanak/subasic-ivan), Opening biographical identification |
| 페타르 2세 (peter-ii-of-yugoslavia) | serbia | 세르비아 (모계 루마니아 왕가) / Serbian; maternal Romanian royal family | [자료](https://en.wikipedia.org/wiki/Peter_II_of_Yugoslavia), Early life and family infobox |
| 두샨 시모비치 (dusan-simovic) | serbia | 세르비아 / Serbia | [자료](https://en.wikipedia.org/wiki/Du%C5%A1an_Simovi%C4%87), Lead: Yugoslav Serb army general |
| 누리야 포즈데라츠 (nurija-pozderac) | bosnia-herzegovina | 보스니아 (보슈냐크계) / Bosnia (Bosniak) | [자료](https://en.wikipedia.org/wiki/Nurija_Pozderac), Biography, family background and references |
| 아르소 요바노비치 (arso-jovanovic) | montenegro | 몬테네그로 / Montenegro | [자료](https://en.wikipedia.org/wiki/Arso_Jovanovi%C4%87), Biography: Piperi family and Montenegrin background |
| 블라디미르 바카리치 (vladimir-bakaric) | croatia | 크로아티아 / Croatia | [자료](https://www.enciklopedija.hr/clanak/bakaric-vladimir), Opening biographical identification |
| 스레텐 주요비치 (sreten-zujovic) | serbia | 세르비아 / Serbia | [자료](https://en.wikipedia.org/wiki/Sreten_%C5%BDujovi%C4%87), Biography: Serb by nationality |
| 안드리야 헤브랑 (andrija-hebrang) | croatia | 크로아티아 / Croatia | [자료](https://www.enciklopedija.hr/clanak/hebrang-andrija-1899-1949), Opening biographical identification |

페로비치는 기존 소속 라벨이 스위스인데 코드가 austria였으므로 switzerland로 정정한다. 다른 19명의 소속 국가는 그대로 유지한다.

공통 Admin 서비스에서 expectedRevision·sources·evidence를 제출하여 검증과 변경 이력을 남긴다. 수정 전 기록: `/tmp/yugoslav-origin-before.json`, 제출 사양: `/tmp/yugoslav-origin-spec.json`.

## 반영 결과

- Admin 사전 검증 후 20명 한 트랜잭션 저장. 유고슬라비아 출신 코드 0명.
- 대표 분류: 세르비아 8, 크로아티아 7, 슬로베니아 2, 몬테네그로 2, 보스니아 헤르체고비나 1.
- 페로비치 외 19명의 소속 국가와 20명 전체 소개문 보존 검증.
- 새 국기 6개(위 5개국과 스위스), 지도 경계·원어 문자 검증, Python 허용 목록 75개 동기화.
- 전체 npm test/lint 통과. 배포 후 기본 30초 경로 점검이 시간 초과하여 120초로 재검사: 23개 경로 HTTP 200. 코드/DB 일치 및 2,201명 카드 감사 통과.
- Frontend acdf577, Python 8491a28. 공식 frontend 배포 및 API/Telegram 서비스 active 확인.
