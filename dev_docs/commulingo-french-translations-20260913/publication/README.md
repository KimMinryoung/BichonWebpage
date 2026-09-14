# 프랑스 혁명·혁명 전쟁 참고문헌 출판 — 2026-09-14

사용자의 출판·문헌집 통합 요청에 따라 번역 21건을 공개했다. 기존 문헌집 2개 확장, 새 문헌집 5개와 단독 문헌 1개 등록으로, 이번 출판이 반영된 참고문헌 항목은 8개다.

| 참고문헌 | 이번 추가 | 전체 구성 |
| --- | --- | --- |
| [시민권과 해방](https://cyber-lenin.com/commulingo/docs/france-rights-and-emancipation-1789-1794) | 송토나 해방 포고, 아마르 보고·여성 결사 금지 | 기존 3편 + 2편 |
| [생존권과 평등](https://cyber-lenin.com/commulingo/docs/france-subsistence-and-equality-1792-1796) | 생쥐스트 방토즈 보고·법령 | 기존 3편 + 1편 |
| [특권 폐지와 노동](https://cyber-lenin.com/commulingo/docs/france-privileges-property-and-labor-1789-1793) | 1789년 8월 법령, 르 샤플리에 법, 1793년 봉건 부담 폐지 | 3편 |
| [개전 논쟁과 선언](https://cyber-lenin.com/commulingo/docs/france-war-debate-and-declarations-1791-1792) | 필니츠, 브리소, 로베스피에르, 선전포고, 브라운슈바이크 | 5편 |
| [혁명의 대외정책과 국민총동원](https://cyber-lenin.com/commulingo/docs/france-revolution-abroad-and-mobilization-1792-1793) | 형제애·원조, 점령지 행정, 국민총동원 | 3편 |
| [바젤에서 아미앵까지](https://cyber-lenin.com/commulingo/docs/france-revolutionary-peace-treaties-1795-1802) | 바젤 2개 조약, 캄포포르미오, 뤼네빌, 아미앵 | 큐 4건·조약 5개 |
| [이집트 원정: 포고와 점령의 기록](https://cyber-lenin.com/commulingo/docs/egypt-french-proclamation-and-cairo-chronicle-1798) | 보나파르트 포고, 알자바르티 연대기 발췌 | 2편 |
| [성직자 시민헌법](https://cyber-lenin.com/commulingo/docs/france-civil-constitution-clergy-1790) | 1790년 법문 4편 | 단독 전문 |

## 편집·검증

- 번역은 기존 DeepSeek Flash **추론 ON** 실행의 결과를 사용했다. 이번 출판 과정에서 추가 모델 호출은 없었다. 이전 재시도까지 포함한 전체 사용량은 상위 README와 usage.jsonl에 있다.
- 원래 번역 출력·저본·캐시는 보존했다. 공개본의 지명·날짜 형식·위원회명·조항 표기와 문단 연결 교정은 `editorial-edits.json`에 기록했고, `scripts/publish-french-translations-20260914.py`로 재현할 수 있다.
- 성직자 시민헌법 제1편 제2조의 파미에·디뉴·렌은 1790년 법문 3–4쪽과 대조했다. 제9조 인구 조건의 저본 누락도 동시대 법문에 따라 ‘1만 명 미만’으로 바로잡고 해제에 밝혔다.
- 작성 주체, 번역 저본 링크, 수록 범위와 번역 표시를 각 문헌 앞에 두었다. 법문과 보고자의 주장, 기록자의 평가를 구분한다.
- 확장한 두 문헌집의 기존 6편은 본문·주석·앵커를 보존했다. 통합한 새 문헌 20개의 개별 주소는 문헌집의 해당 제목으로 301 이동한다. 기존 문헌집 주소와 과거 리디렉션도 유지한다.
- 21건 저본 SHA·시작/끝·캐시 원문 해시·번역 블록 검증, 8개 참고문헌의 실제 docs-store 목차/고유 ID/리디렉션 검증 통과. 운영 ‘시민권과 해방’ 모바일 화면에서 신규 글 2개·주석 왕복·가로 넘침·페이지 오류를 확인했다. 검증 결과는 `verification.json`, `store-verification.json`, `browser-production.json`에 있다.
- 호스트 마운트 문헌 파일과 manifest를 원자적으로 교체했다. 관련 Cloudflare 87개 URL과 사이트맵 캐시를 갱신했다. 코드 배포·컨테이너 재시작은 필요하지 않았다.
- 큐 21건을 `done`으로 바꾸고 문헌집 ID와 절 주소를 연결했다. `queue-before.json`과 `queue-verification.json`으로 변경 전후를 확인할 수 있다.

## 범위와 남은 작업

- **2052 주르당-델브렐 징병법은 pending**. Gallica f495 이후 이미지 접근이 이번에도 403을 반환했다. 확보된 f491–494만으로 전문을 꾸며 출판하지 않았다.
- 바젤 두 조약과 캄포포르미오는 **공개조항**을 수록하며 별도 비밀조항은 미수록이다. 뤼네빌은 별도 비밀조항을 포함한다. 이 차이는 공개 해제에도 표시했다.
- 알자바르티는 **히즈라력 1213년 주마다 알아우왈월 전체 기록의 발췌**다. 저작 전체 번역으로 표시하지 않았다. 인명·아랍어 단위·문체에 대한 전문 교열은 추가 개선 대상으로 남는다. 구조 검증과 일부 대조 교정이 전 문장에 대한 전문 번역 감수를 뜻하지 않는다.

`published.json`은 출판 영수증이다. 출판 후 준비 스크립트를 무심코 다시 실행하지 말고, 추가 편집은 현재 공개본과 이 기록을 함께 갱신한다. 공개본에 번역 초안을 덮어쓰지 않는다.
