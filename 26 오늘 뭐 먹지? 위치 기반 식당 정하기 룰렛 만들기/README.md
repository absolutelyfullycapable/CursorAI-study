# 26. 오늘 뭐 먹지? 위치 기반 식당 정하기 룰렛 만들기

근처 식당으로 오늘의 메뉴를 뽑는 **위치 기반 식당 룰렛 웹앱**입니다. 점심·저녁 등 식사 시간에 국한하지 않고 사용할 수 있어요.

## 배포용 저장소

Vercel 배포용 단독 저장소: [what-to-eat-roulette](https://github.com/absolutelyfullycapable/what-to-eat-roulette)

1. 위 저장소를 Vercel에 Import
2. Framework는 기본값으로 Deploy
3. `/api/nearby` 서버리스 함수가 근처 식당 검색을 담당합니다

## 왜 OpenStreetMap으로 바꿨나

처음에는 카카오맵 MCP / 카카오 로컬 API로 근처 식당을 불러오려 했습니다.  
다만 아래 한계 때문에 **완전 무료인 OpenStreetMap**으로 전환했습니다.

- 브라우저에서 카카오 REST API를 직접 호출하기 어려움 (CORS)
- 카카오맵(로컬) API 활성화·앱 설정이 필요하고, 콘솔에 유료 안내가 떠 실습용으로 부담스러움
- Cursor 안의 카카오맵 MCP는 에이전트 작업용이라, 사용자가 브라우저에서 여는 룰렛 앱 런타임과는 별개

그래서 `server.py`가 아래처럼 동작합니다.

- **위치 검색**: 네이버 지역 검색(`.env`에 키가 있을 때) + Nominatim 보완  
  → 아파트·상호명처럼 OSM에 없는 장소도 찾을 수 있어요
- **근처 식당**: Overpass (API 키 없음)

## 네이버 검색 API (선택, 권장)

한국 아파트·상호는 OpenStreetMap에 없는 경우가 많습니다.  
로컬에서 더 잘 찾으려면 프로젝트 폴더에 `.env`를 만드세요.

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
| 돌리기 | 현재 목록에서 식당 1곳을 뽑음 |

## 데이터 출처

- 위치 검색: 네이버 지역 검색(선택) + [Nominatim](https://nominatim.openstreetmap.org/)
- 근처 식당: [Overpass API](https://overpass-api.de/) (restaurant / cafe / fast_food 등)

OpenStreetMap 데이터 밀도에 따라, 지역마다 식당 개수·이름 품질이 다를 수 있습니다.

## Sequential Thinking 설계 요약

1. **목표**: 언제든 쓸 수 있는 위치 기반 식당 룰렛 (점심 전용 아님)
2. **방식**: HTML/CSS/JS + 무료 OSM 프록시(`server.py`)
3. **시작 UX**: 위치 검색 → 후보 선택 → 근처 식당 최대 15곳 조회
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
