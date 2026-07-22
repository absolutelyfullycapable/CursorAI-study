# 26. 오늘 뭐 먹지? 위치 기반 식당 정하기 룰렛 만들기

근처 식당으로 오늘의 메뉴를 뽑는 **위치 기반 식당 룰렛 웹앱**입니다. 점심·저녁 등 식사 시간에 국한하지 않고 사용할 수 있어요.

## 배포용 저장소

Vercel 배포용 단독 저장소: [what-to-eat-roulette](https://github.com/absolutelyfullycapable/what-to-eat-roulette)

1. 위 저장소를 Vercel에 Import
2. Framework는 기본값으로 Deploy
3. `/api/places`(위치 후보) · `/api/nearby`(근처 식당) · `/api/reverse`(확정 식당 주소) 서버리스 함수가 검색을 담당합니다
4. (권장) Vercel 환경 변수에 `NAVER_CLIENT_ID` / `NAVER_CLIENT_SECRET` 설정 시 아파트·상호명 검색이 잘 됩니다

## 왜 OpenStreetMap으로 바꿨나

처음에는 카카오맵 MCP / 카카오 로컬 API로 근처 식당을 불러오려 했습니다.  
다만 아래 한계 때문에 **근처 식당 데이터는 OpenStreetMap(Overpass)** 으로 전환했습니다.

- 브라우저에서 카카오 REST API를 직접 호출하기 어려움 (CORS)
- 카카오맵(로컬) API 활성화·앱 설정이 필요하고, 콘솔에 유료 안내가 떠 실습용으로 부담스러움
- Cursor 안의 카카오맵 MCP는 에이전트 작업용이라, 사용자가 브라우저에서 여는 룰렛 앱 런타임과는 별개

근처 식당은 Overpass로 주변 후보를 모은 뒤 **매번 15곳을 랜덤 추출**하며 **API 키·요금이 없습니다.**

## 왜 네이버 검색 API를 쓰게 됐나

위치만 Nominatim(OpenStreetMap)으로 찾으면 **한국 아파트·상호명이 안 나오는 경우**가 많습니다.  
예: `우방목련아파트`는 OSM에 이름 데이터가 없어 검색 결과가 0건이고,  
도로명(`경기 군포시 고산로643번길 9`)으로는 길만 잡히거나 건물 단위가 부정확했습니다.

그래서 **위치 검색만** 네이버 지역 검색을 선택적으로 붙였습니다.

- 역할: 장소명 → 후보 목록(이름·주소·좌표)
- 키: `.env`의 `NAVER_CLIENT_ID` / `NAVER_CLIENT_SECRET` (없으면 Nominatim만 사용)
- 근처 식당 목록 자체는 여전히 Overpass(무료)로 가져옵니다

카카오 대신 네이버를 쓴 이유:

- 이미 실습/MCP용으로 네이버 검색 API 키를 쓰고 있어 추가 유료 맵 활성화 부담이 적음
- 한국 아파트·상호명 검색 품질이 Nominatim보다 실사용에 맞음
- 서버(`server.py` / Vercel `/api/places`)에서만 호출하므로 브라우저 CORS 문제가 없음

## 네이버 검색 API (선택, 권장)

로컬에서 아파트·상호명 검색을 쓰려면 프로젝트 폴더에 `.env`를 만드세요.

```bash
cp env.example .env
# .env 에 NAVER_CLIENT_ID / NAVER_CLIENT_SECRET 입력
```

[네이버 개발자 센터](https://developers.naver.com/apps/#/list)에서 애플리케이션을 만들고 **검색** API를 켜면 됩니다.  
키가 없어도 역·도로명 등 OSM에 있는 장소는 검색됩니다.

## 실행 방법

1. 터미널에서 서버를 실행합니다.

```bash
cd "26 오늘 뭐 먹지? 위치 기반 식당 정하기 룰렛 만들기"
python3 server.py
```

2. 브라우저에서 [http://127.0.0.1:8765](http://127.0.0.1:8765) 를 엽니다.
3. 팝업에 위치를 입력하고 **위치 검색**을 누른 뒤, 나온 후보 중 하나를 고릅니다. (또는 **현재 위치 사용**)
4. 근처 식당으로 룰렛이 만들어지면 **돌리기**를 누릅니다.

> `index.html`을 더블클릭(file://)으로 열면 식당 검색이 동작하지 않습니다.

## 사용 방법

| 동작 | 설명 |
|------|------|
| 위치 검색 | 예: `네이버 1784`, `강남역` → 후보 목록에서 하나 선택 |
| 현재 위치 사용 | 브라우저 위치 권한으로 주변 식당 검색 |
| 위치 변경 | 다른 장소로 룰렛을 다시 구성 |
| 돌리기 | 현재 목록에서 식당 1곳을 뽑고, 확정 시 주소 표시 |

## 데이터 출처

- 위치 검색: 네이버 지역 검색(선택) + [Nominatim](https://nominatim.openstreetmap.org/)
- 근처 식당: [Overpass API](https://overpass-api.de/) (restaurant / cafe / fast_food 등)

OpenStreetMap 데이터 밀도에 따라, 지역마다 식당 개수·이름 품질이 다를 수 있습니다.

## Sequential Thinking 설계 요약

1. **목표**: 언제든 쓸 수 있는 위치 기반 식당 룰렛 (점심 전용 아님)
2. **방식**: HTML/CSS/JS + 로컬 `server.py` (위치: 네이버 선택 + Nominatim / 식당: Overpass)
3. **시작 UX**: 위치 검색 → 후보 선택 → 근처 식당 후보 중 15곳 랜덤 조회
4. **룰렛**: SVG로 칸·글자를 같은 좌표계에 배치해 중앙 정렬
5. **결과**: 당첨 칸을 먼저 정한 뒤 그 칸에 멈추도록 회전

## 파일 구조

```
26 오늘 뭐 먹지? 위치 기반 식당 정하기 룰렛 만들기/
├── index.html   # 화면 · 위치 팝업
├── style.css    # 디자인
├── script.js    # 룰렛 · 위치 검색 연동
├── server.py    # 로컬 서버 + 위치/식당 검색
├── env.example  # 네이버 API 키 예시
└── README.md
```

## 참고

무료 Overpass 공개 서버가 바쁠 때 일시적으로 오류가 날 수 있습니다.  
앱은 여러 미러 서버로 자동 재시도하며, 그래도 실패하면 몇 초 뒤 다시 시도하면 됩니다.
