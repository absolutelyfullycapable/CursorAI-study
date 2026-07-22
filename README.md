# Cursor AI Study 👩🏻‍💻

> [요즘 바이브 코딩 커서 AI 30가지 프로그램 만들기](https://product.kyobobook.co.kr/detail/S000217462860) 실습 기록

책에 나온 프로젝트를 Cursor AI와 함께 만들어 보며 학습한 내용을 정리하는 저장소입니다.

---

## 진행 현황

| # | 프로젝트 | 상태 |
|---|----------|------|
| 01 | 기업 소개 웹사이트 만들기 | ✅ |
| 02 | 사과 게임 만들어 보기 | ✅ |
| 03 | 자기소개 페이지 만들기 | ✅ |
| 04 | 인스타그램과 비슷한 사이트 만들어 보기 | ✅ |
| 05 | 메모 앱 만들어 보기 | ✅ |
| 06 | v0 서비스로 더 쉽게 웹사이트 만들기 | ✅ |
| 07 | 메모 앱에 회원 가입, 로그인, 로그아웃, 메모 저장 기능 더하기 | ✅ |
| 08 | 1년 치 금 시세 크롤링하기 | ✅ |
| 09 | 해외 주식 크롤링 프로그램 만들기 | ✅ |
| 10 | 나만의 QR 코드 생성기 쉽게 만들기 | ✅ |
| 11 | PDF 편집기 만들기 | ✅ |
| 12 | 랜덤 이미지를 주는 API로 미술관 사이트 만들기 | ✅ |
| 13 | 한국거래소 주식 데이터 API로 나만의 대시보드 만들기 | ✅ |
| 14 | 식당 추천 사이트 만들기 | ✅ |
| 15 | 메일 발송 자동화 프로그램 만들기 | ✅ |
| 16 | Claude API로 PDF 요약 프로그램 만들기 | ✅ |
| 17 | 블로그 최적화 글 생성 프로그램 만들기 | ✅ |
| 18 | 고객 리뷰 분석하여 보고서 생성하는 프로그램 만들기 | ✅ |
| 19 | 가계부 대시보드 만들기 | ✅ |
| 20 | 리더보드가 있는 카드 뒤집기 게임 만들기 | ✅ |
| 21 | 나만의 블로그 만들기 | ✅ |
| 22 | 나만의 커뮤니티 게시판 만들기 | ✅ |
| 23 | Firecrawl MCP로 데이터 수집하고 웹페이지 만들기 | ✅ |
| 24 | 네이버 서치 MCP로 인기 블로그 분석해 블로그하기 | ✅ |
| 25 | Sequential Thinking MCP로 테트리스 게임 만들기 | ✅ |
| 26 | 오늘 뭐 먹지? 위치 기반 식당 정하기 룰렛 만들기 | ✅ |
| 27 ~ 30 | — | 🔜 |

---

## 폴더 구조

```
CursorAI-study/
├── 01 기업 소개 웹사이트 만들기/
│   └── test.html
├── 02 사과 게임 만들어 보기/
│   ├── index.html
│   ├── style.css
│   └── script.js
├── 03 자기소개 페이지 만들기/
│   ├── index.html
│   ├── style.css
│   └── script.js
├── 04 인스타그램과 비슷한 사이트 만들어 보기/   # React + Vite
│   ├── index.html
│   ├── package.json
│   ├── vite.config.js
│   ├── public/images/        # 피드 이미지(img01~10), 프로필(man/woman)
│   └── src/
│       ├── main.jsx · App.jsx · App.css · index.css
│       ├── data/posts.js     # 피드 · 스토리 · 추천 데이터
│       └── components/        # LeftNav · Stories · Feed · Post · Sidebar · MobileNav · Icons
├── 05 메모 앱 만들어 보기/                        # React + Vite
│   └── memo-app/
│       ├── index.html        # 파비콘 base64 인라인
│       ├── package.json
│       ├── vite.config.js
│       └── src/
│           ├── main.jsx · App.jsx · App.css · index.css
│           └── components/    # MemoCard
├── 06 v0 서비스로 더 쉽게 웹사이트 만들기/         # Next.js + shadcn/ui (v0 생성)
│   └── maison-eclat/
│       ├── package.json
│       ├── components.json
│       ├── app/               # layout · page · globals.css · careers/
│       ├── components/        # site-header · hero · marquee · ... · ui/button
│       └── lib/utils.ts
├── 07 메모 앱에 회원 가입, 로그인, 로그아웃, 메모 저장 기능 더하기/  # Next.js + Prisma + SQLite
│   └── bright-memo-app/
│       ├── package.json
│       ├── prisma/            # schema.prisma · migrations/
│       ├── app/               # layout · page · actions/auth · actions/notes
│       ├── components/        # auth-form · notes-app · note-card · note-composer
│       └── lib/               # auth · session · prisma · notes-db · site-icons
├── 08 1년 치 금 시세 크롤링하기/                       # Python + openpyxl + matplotlib
│   ├── crawl_gold.py          # 금 시세 API 크롤링 후 엑셀 저장
│   ├── calc_stats.py          # 통계 계산 후 통계 시트 기록
│   ├── visualize_gold.py      # 통계 기반 PNG 시각화 생성
│   └── requirements.txt
├── 09 해외 주식 크롤링 프로그램 만들기/               # Python + BeautifulSoup + openpyxl
│   ├── crawl_stocks.py        # Yahoo Finance 상승 주식 크롤링 후 엑셀 저장
│   ├── requirements.txt
│   └── README.md
├── 10 나만의 QR 코드 생성기 쉽게 만들기/             # Python + Gradio + qrcode + Pillow
│   ├── qr_generator.py        # 로고 삽입 QR 생성 앱
│   ├── requirements.txt
│   └── README.md
├── 11 PDF 편집기 만들기/                           # Python + Gradio + pypdf
│   ├── pdf_app.py             # Gradio 웹 UI (페이지 추출 · PDF 이어붙이기)
│   ├── pdf_page_extractor.py  # 페이지 범위 파싱 및 추출 로직
│   ├── pdf_merger.py          # PDF 이어붙이기 로직
│   └── requirements.txt
├── 12 랜덤 이미지를 주는 API로 미술관 사이트 만들기/  # HTML + CSS + JS + Lorem Picsum API
│   ├── index.html             # 가상 사진 전시회 페이지
│   ├── style.css              # 미술관 갤러리 스타일
│   └── script.js              # 30개 작품 생성 · 라이트박스
├── 13 한국거래소 주식 데이터 API로 나만의 대시보드 만들기/  # HTML + CSS + JS + Python API 프록시
│   ├── index.html             # 주식 TOP 50 대시보드
│   ├── style.css              # 라이트 테마 UI
│   ├── script.js              # 날짜 선택 · 데이터 표시
│   ├── server.py              # 공공데이터 API 프록시 · 정적 파일 서버
│   ├── .env.example           # API 키 환경 변수 예시
│   └── 주식api.txt            # 금융위원회 주식시세정보 API 명세
├── 14 식당 추천 사이트 만들기/                          # HTML + CSS + JS → React + Vite
│   ├── index.html             # 초기 HTML 버전 (API 10건 표시)
│   ├── style.css
│   ├── script.js
│   └── restaurant-app/        # React + Vite 메인 프로젝트
│       ├── index.html
│       ├── package.json
│       ├── .env.example       # API 키 환경 변수 예시
│       └── src/
│           ├── main.jsx · App.jsx · App.css · index.css
│           ├── assets/hero.js          # 히어로 이미지 base64 인라인
│           ├── api/restaurants.js      # 전체 데이터 페이징 fetch
│           ├── utils/restaurant.js     # 필터 · 포맷 유틸
│           └── components/             # Header · Footer · SearchBar · RestaurantCard
├── 15 메일 발송 자동화 프로그램 만들기/           # Python + Flask + Tailwind + Gmail SMTP
│   ├── app.py                 # Flask 웹 UI · 엑셀 파싱 · SMTP 발송 API
│   ├── send_mail.py           # CLI 테스트 발송 (최대 10건)
│   ├── create_sample_excel.py # 실습용 엑셀(고객 50건) 생성
│   ├── templates/index.html   # Tailwind 기반 발송 UI
│   ├── .env.example           # Gmail 앱 비밀번호 예시
│   └── requirements.txt
├── 16 Claude API로 PDF 요약 프로그램 만들기/   # Python + pypdf + Claude API
│   ├── extract_pdf_text.py    # pdf/ 폴더 PDF 텍스트 추출 → extracted_text/
│   ├── summarize_text.py      # extracted_text/ Claude API 요약 → summaries/
│   ├── .env.example           # Anthropic API 키 예시
│   └── requirements.txt
├── 17 블로그 최적화 글 생성 프로그램 만들기/   # Python + Flask + Claude API (Haiku 4.5)
│   ├── app.py                 # Flask 웹 UI (http://127.0.0.1:8517)
│   ├── generate_blog.py       # CLI · 공통 생성 로직
│   ├── templates/index.html   # 키워드 · 관점 · 스타일 · 자료 입력 UI
│   ├── materials/             # 관련 자료 텍스트 파일
│   ├── posts/                 # 생성된 마크다운 글
│   ├── .env.example           # Anthropic API 키 예시
│   └── requirements.txt
├── 18 고객 리뷰 분석하여 보고서 생성하는 프로그램 만들기/  # Python + Flask + openpyxl + Claude API (Haiku 4.5)
│   ├── app.py                 # Flask 웹 UI (http://127.0.0.1:8518)
│   ├── analyze_reviews.py     # CLI · 공통 분석·보고서 생성 로직
│   ├── templates/index.html   # 엑셀 업로드 · 지표 · 보고서 뷰
│   ├── reports/               # 생성된 마크다운 보고서
│   ├── .env.example           # Anthropic API 키 예시
│   └── requirements.txt
├── 19 가계부 대시보드 만들기/                        # Python + Streamlit + gspread + Plotly
│   ├── app.py                 # Streamlit 가계부 대시보드 (http://localhost:8501)
│   ├── read_spreadsheet.py    # 서비스 계정으로 Google 시트 읽기 (CLI)
│   ├── requirements.txt
│   └── my-spreadsheet-automation.json  # 서비스 계정 키 (gitignore, 로컬 전용)
├── 20 리더보드가 있는 카드 뒤집기 게임 만들기/       # HTML + CSS + JS + Supabase (+ Vercel 배포용)
│   ├── README.md            # 배포용 단독 저장소와 동일
│   ├── index.html             # 시작·클리어 모달 · 보드 · 리더보드 UI
│   ├── style.css              # Pretendard · 아케이드 보드 스타일
│   ├── script.js              # 카드 짝 맞추기 · 이름 중복 검사 · 점수 저장
│   ├── config.example.js      # Supabase URL / Publishable key 템플릿
│   ├── config.js              # 실제 키 (gitignore, 로컬 전용)
│   ├── .env.example           # SUPABASE_URL · SUPABASE_ANON_KEY 예시
│   ├── generate-config.js     # 환경 변수로 config.js 생성 (Vercel 빌드)
│   ├── package.json           # npm run build
│   ├── vercel.json            # Vercel 빌드 설정
│   └── .gitignore             # config.js · .env 제외
├── 21 나만의 블로그 만들기/                          # Astro + Markdown + GitHub Pages
│   └── blog/
│       ├── package.json
│       ├── astro.config.mjs   # site · base(/cursor-astro-blog) · Shiki
│       ├── .github/workflows/ # Pages 자동 배포
│       ├── public/            # 정적 자산(필요 시)
│       ├── scripts/           # publish-to-github.sh
│       └── src/
│           ├── pages/         # Home · About · Blog · 글/분류/아카이브
│           ├── content/blog/  # 마크다운 글 (YYYY/MM/) · 예: 2026/07/monchhichi-first-buy-guide.md
│           ├── assets/        # blogfavicon.js · blogicon.js (PNG base64 인라인)
│           ├── components/    # Header · Footer · PostList · Sidebar
│           ├── layouts/       # BaseLayout
│           ├── lib/posts.ts   # 글 로드 · 분류 · base path 유틸
│           └── styles/        # Pretendard · 에디토리얼 UI
├── 22 나만의 커뮤니티 게시판 만들기/                 # Next.js + Tailwind + Supabase
│   └── community/             # 배포용 단독 저장소: community-board
│       ├── README.md          # 프로젝트 소개 · 폴더 구조 · 페이지 구성
│       ├── package.json
│       ├── next.config.ts     # 이미지 remotePatterns · Server Action body 6mb
│       ├── .env.example       # NEXT_PUBLIC_SUPABASE_URL · ANON_KEY
│       ├── .gitignore         # .env* · node_modules · .next · 이미지 바이너리
│       └── src/
│           ├── middleware.ts  # Supabase 세션 갱신
│           ├── app/           # 홈 · 로그인/가입 · 내 정보 · 글 CRUD
│           ├── components/    # Header · 사이드바 · PostCard · 댓글 · 반응 버튼
│           ├── actions/       # auth · posts · comments · reactions · profile
│           └── lib/           # supabase 클라이언트 · posts · profile · types
├── 23 Firecrawl MCP로 데이터 수집하고 웹페이지 만들기/   # HTML + CSS + JS + Firecrawl
│   ├── index.html             # 맛집 안내 랜딩 페이지
│   ├── styles.css             # 프리미엄 다크 테마 · 반응형 UI
│   ├── script.js              # 탭 전환 · 주소 복사 · base64 이미지 연결
│   └── image-data.js          # 블로그 음식 이미지 base64 인라인
├── 24 네이버 서치 MCP로 인기 블로그 분석해 블로그하기/  # Naver Search MCP · Firecrawl · Unsplash MCP
│   └── monchhichi-first-buy-guide.md  # 벤치마킹 후 작성한 몬치치 첫 구매 가이드
├── 25 Sequential Thinking MCP로 테트리스 게임 만들기/  # Sequential Thinking MCP · Canvas 테트리스
│   ├── index.html
│   ├── style.css
│   ├── script.js
│   └── README.md
└── 26 오늘 뭐 먹지? 위치 기반 식당 정하기 룰렛 만들기/  # Sequential Thinking · OSM 위치 기반 식당 룰렛
    ├── index.html
    ├── style.css
    ├── script.js
    ├── server.py
    └── README.md
```




---

## 실행 방법

01~03 프로젝트는 폴더의 HTML 파일을 브라우저에서 열면 됩니다.

```bash
# 예시: 사과 게임
open "02 사과 게임 만들어 보기/index.html"
```

04 인스타그램 클론은 React + Vite 프로젝트이므로 개발 서버로 실행합니다.

```bash
cd "04 인스타그램과 비슷한 사이트 만들어 보기"
npm install
npm run dev
```

05 메모 앱도 React + Vite 프로젝트입니다. 메모 추가 · 수정 · 삭제 · 검색을 지원하며, 작성한 메모는 브라우저 localStorage에 저장됩니다.

```bash
cd "05 메모 앱 만들어 보기/memo-app"
npm install
npm run dev
```

06 v0 웹사이트는 v0로 생성한 Next.js + shadcn/ui 프로젝트입니다. 흑백 미니멀 톤의 패션 브랜드 페이지(MAISON ÉCLAT)이며, 한글 폰트로 Pretendard를 사용하고 채용 안내 페이지(`/careers`)를 포함합니다.

```bash
cd "06 v0 서비스로 더 쉽게 웹사이트 만들기/maison-eclat"
npm install
npm run dev
```

07 메모 앱은 v0로 만든 밝은 톤의 메모 앱에 **회원가입 · 로그인 · 로그아웃**과 **SQLite DB 메모 저장**을 추가한 Next.js 프로젝트입니다. Prisma ORM과 JWT 세션(httpOnly 쿠키)을 사용하며, 로그인한 사용자별로 메모가 DB에 저장됩니다.

```bash
cd "07 메모 앱에 회원 가입, 로그인, 로그아웃, 메모 저장 기능 더하기/bright-memo-app"
npm install

# .env 파일 생성 (DATABASE_URL, AUTH_SECRET)
# DATABASE_URL="file:./prisma/dev.db"
# AUTH_SECRET="임의의-긴-비밀-문자열"

npx prisma migrate dev
npm run dev
```

08 프로젝트는 순금나라 금 시세 데이터를 크롤링해 엑셀로 저장하고, 통계 계산 및 시각화까지 진행하는 Python 실습입니다.

- **금 시세 참고 사이트** · [순금나라 금 시세](https://www.soongumnara.co.kr/price/gold)

```bash
cd "08 1년 치 금 시세 크롤링하기"
pip install -r requirements.txt

# 금 시세 100건 수집 및 엑셀 저장
python3 crawl_gold.py --limit 100

# 통계 시트 생성/갱신
python3 calc_stats.py

# 통계 기반 시각화 PNG 생성 (charts/)
python3 visualize_gold.py
```

09 프로젝트는 Yahoo Finance 상승 주식 페이지에서 표 데이터를 크롤링해 엑셀로 저장하는 Python 실습입니다.

- **참고 사이트** · [Yahoo Finance Top Stock Gainers](https://finance.yahoo.com/markets/stocks/gainers/)

```bash
cd "09 해외 주식 크롤링 프로그램 만들기"
pip3 install -r requirements.txt

# 상승 주식 데이터 수집 및 엑셀 저장
python3 crawl_stocks.py
```

10 프로젝트는 링크와 중앙 이미지를 입력해 QR 코드를 생성하고 저장하는 Python + Gradio 실습입니다.

```bash
cd "10 나만의 QR 코드 생성기 쉽게 만들기"
pip3 install -r requirements.txt
python3 qr_generator.py
```

11 프로젝트는 PDF 페이지 추출과 이어붙이기를 제공하는 Python + Gradio 실습입니다. 터미널에서 실행하면 브라우저에 웹 UI가 열립니다.

- **페이지 추출** · 원하는 페이지 범위를 추출해 `원본파일명_YYYYMMDD.pdf` 형식으로 저장
- **PDF 이어붙이기** · 2개 이상의 PDF를 첨부한 순서대로 합쳐 지정한 폴더에 저장 (파일명 충돌 시 `_(숫자)` 접미사)

```bash
cd "11 PDF 편집기 만들기"
python3 -m pip install -r requirements.txt
python3 pdf_app.py
```

12 프로젝트는 [Lorem Picsum](https://picsum.photos) API로 300×300 랜덤 이미지 30장을 불러와 가상 사진 전시회처럼 보여 주는 HTML 실습입니다. 작품 클릭 시 라이트박스로 크게 볼 수 있습니다.

```bash
# 브라우저에서 바로 열기
open "12 랜덤 이미지를 주는 API로 미술관 사이트 만들기/index.html"

# 또는 로컬 서버로 실행
cd "12 랜덤 이미지를 주는 API로 미술관 사이트 만들기"
python3 -m http.server 8765
```

13 프로젝트는 [공공데이터포털 금융위원회 주식시세정보 API](https://www.data.go.kr/)로 한국거래소 주식 시세를 조회해, **종가 기준 TOP 50**을 보여 주는 대시보드입니다. 날짜를 선택하고 새로고침하면 해당 일자 장 마감 기준 데이터를 확인할 수 있습니다. 브라우저 CORS 제한을 피하기 위해 Python 프록시 서버를 함께 사용합니다.

- **주요 기능** · 최신 거래일 자동 조회 · 날짜별 TOP 50 조회 · 종목명 · 시장구분 · 종가 · 등락률 · 거래량 · 시가총액 표시

```bash
cd "13 한국거래소 주식 데이터 API로 나만의 대시보드 만들기"

# API 키 설정 (공공데이터포털에서 발급)
export DATA_GO_KR_API_KEY='발급받은-API-키'

# 서버 실행 후 브라우저에서 http://127.0.0.1:8080 접속
python3 server.py
```

14 프로젝트는 [공공데이터포털 서울특별시 서초구 휴게음식점 현황 API](https://www.data.go.kr/)로 카페 · 분식 · 패스트푸드 등 휴게음식점 정보를 조회하는 식당 추천 사이트입니다. 초기에는 HTML/CSS/JS로 10곳을 표시했고, 이후 React + Vite로 전환해 전체 데이터 로딩 · 무한 스크롤 · 검색 기능을 구현했습니다.

- **주요 기능** · 전체 2,192곳 데이터 로딩 · 3열 그리드 · 무한 스크롤(12개씩) · 식당 이름 · 주소 검색 · 검색 결과 화면

```bash
cd "14 식당 추천 사이트 만들기/restaurant-app"
npm install

# .env 파일 생성 (.env.example 참고)
# VITE_API_KEY='발급받은-API-키'

npm run dev
```

15 프로젝트는 엑셀 고객 목록을 읽어 Gmail SMTP로 배송 안내 메일을 보내는 실습입니다. Flask + Tailwind 웹 UI에서 보내는 사람 입력 · 엑셀 업로드 · 미리보기 · 전송까지 진행할 수 있고, CLI 스크립트로도 테스트 발송이 가능합니다.

- **주요 기능** · 엑셀 업로드 · 받는 사람·제목·내용 자동 매핑 · 발송 전 미리보기 · Gmail SMTP 발송 · 발송 건수 제한
- **필수 엑셀 컬럼** · 이메일 · 메일제목 · 메일내용

```bash
cd "15 메일 발송 자동화 프로그램 만들기"
pip3 install -r requirements.txt

# .env 파일 생성 (.env.example 참고)
# GMAIL_APP_PASSWORD='Gmail-앱-비밀번호'

# 실습용 엑셀 생성 (메일실습용.xlsx)
python3 create_sample_excel.py

# 웹 UI 실행 후 브라우저에서 http://127.0.0.1:8501 접속
python3 app.py

# 또는 CLI로 10건 테스트 발송
python3 send_mail.py
```

16 프로젝트는 `pdf/` 폴더의 PDF에서 텍스트를 추출한 뒤, Claude API로 요약을 생성하는 Python 실습입니다.

- **주요 기능** · PDF 텍스트 추출 · 파일별 요약 · 전체 통합 요약
- **사용 모델** · `claude-sonnet-5`

```bash
cd "16 Claude API로 PDF 요약 프로그램 만들기"
python3 -m pip install -r requirements.txt

# .env 파일 생성 (.env.example 참고)
# ANTHROPIC_API_KEY='발급받은-Anthropic-API-키'

# PDF → 텍스트 추출 (extracted_text/)
python3 extract_pdf_text.py

# 추출 텍스트 → Claude 요약 (summaries/)
python3 summarize_text.py
```

17 프로젝트는 키워드 · 나의 관점 · 글 스타일 · 관련 자료를 받아 Claude API로 블로그 글을 생성하는 Python 실습입니다. 웹 UI와 CLI를 모두 지원합니다.

- **주요 기능** · 키워드 입력 · 나의 관점(최대 200자) · 글 스타일(친근하게/진지하게) · 관련 자료 붙여넣기·.txt 업로드 · 글 생성 · 복사/다운로드 · posts/ 저장
- **사용 모델** · `claude-haiku-4-5` (가성비 — 입력 $1 / 출력 $5 per 1M tokens)

```bash
cd "17 블로그 최적화 글 생성 프로그램 만들기"
python3 -m pip install -r requirements.txt

# .env 파일 생성 (.env.example 참고)
# ANTHROPIC_API_KEY='발급받은-Anthropic-API-키'

# 웹 UI 실행 후 브라우저에서 http://127.0.0.1:8517 접속
python3 app.py

# 또는 CLI로 생성
python3 generate_blog.py "미니멀 라이프" materials/sample.txt \
  -v "미니멀은 물건을 줄이는 게 아니라 매일 쓰는 것만 남기는 선택이다." \
  -s friendly
```

18 프로젝트는 엑셀 고객 리뷰를 읽어 통계를 내고, Claude API로 경영진용 분석 보고서를 생성하는 Python 실습입니다. 리뷰·평점 열은 컬럼명(`리뷰내용`, `평점`)으로 찾으므로 열 위치가 바뀌어도 동작합니다. 웹 UI와 CLI를 모두 지원합니다.

- **주요 기능** · 엑셀 업로드 · 핵심 지표 카드 · 표·목록 중심 보고서 · 복사/다운로드 · `reports/` 저장
- **사용 모델** · `claude-haiku-4-5` (토큰 비용 최저 — 입력 $1 / 출력 $5 per 1M tokens)

```bash
cd "18 고객 리뷰 분석하여 보고서 생성하는 프로그램 만들기"
python3 -m pip install -r requirements.txt

# .env 파일 생성 (.env.example 참고)
# ANTHROPIC_API_KEY='발급받은-Anthropic-API-키'

# 웹 UI 실행 후 브라우저에서 http://127.0.0.1:8518 접속
python3 app.py

# 또는 CLI로 생성 (엑셀 경로 지정)
python3 analyze_reviews.py "리뷰데이터.xlsx"
```

19 프로젝트는 Google 스프레드시트 가계부 데이터를 서비스 계정으로 읽어 Streamlit 대시보드로 보여 주는 Python 실습입니다. 수입·지출·잔액·분류별 지출을 차트와 표로 확인하고, 화면의 **데이터 갱신** 버튼으로 시트 변경을 다시 불러올 수 있습니다.

- **주요 기능** · 시트 연동 · 총 수입/지출/순이익/잔액 · 월별 수입·지출(축 분리) · 분류·결제방법별 지출 · 잔액 추이 · 필터 · 데이터 갱신 · 라이트/다크 모드 대응
- **사전 준비** · 서비스 계정 JSON을 폴더에 두고, 스프레드시트를 해당 서비스 계정 이메일에 **보기** 권한으로 공유

```bash
cd "19 가계부 대시보드 만들기"
python3 -m pip install -r requirements.txt

# CLI로 시트 데이터 확인
python3 read_spreadsheet.py

# Streamlit 대시보드 실행 후 브라우저에서 http://localhost:8501 접속
python3 -m streamlit run app.py
```

20 프로젝트는 HTML/CSS/Vanilla JS로 만든 카드 짝 맞추기 게임입니다. 이름을 입력해 시작한 뒤 4×4 보드에서 짝을 맞추고, 클리어 기록을 Supabase `scores` 테이블 리더보드에 저장합니다. 배포용 단독 저장소는 [card-flip-leaderboard](https://github.com/absolutelyfullycapable/card-flip-leaderboard) 입니다.

- **주요 기능** · 이름 입력 후 시작 · 이름 중복 검사 · 시간·시도 횟수 · 카드 뒤집기 · Top 10 리더보드 · 기록 저장
- **클리어 후** · `기록 저장` · `한 판 더`(저장 전 바로 재시작 / 저장 후 새 이름) · `처음으로`
- **순위 기준** · `time_ms` 오름차순 → 같으면 `moves` 오름차순
- **보안** · Publishable key만 사용 · `config.js`/`.env`는 gitignore · Secret key 미사용 · RLS로 SELECT/INSERT 보호
- **배포** · Vercel Environment Variables(`SUPABASE_URL`, `SUPABASE_ANON_KEY`) → 빌드 시 `generate-config.js`가 `config.js` 생성

```bash
cd "20 리더보드가 있는 카드 뒤집기 게임 만들기"

# 로컬 A) config.js 직접 설정
cp config.example.js config.js
# config.js에 Project URL · Publishable key 입력

# 로컬 B) .env로 config.js 생성
cp .env.example .env
# .env에 SUPABASE_URL · SUPABASE_ANON_KEY 입력
npm run build

# 브라우저에서 열기 (로컬 서버 권장)
python3 -m http.server 8720
# http://127.0.0.1:8720 접속
```

21 프로젝트는 Astro로 마크다운 블로그를 정적 빌드해 GitHub Pages에 호스팅하는 실습입니다. 기존 `username.github.io` 루트 사이트와 분리된 **프로젝트 Pages** 저장소([cursor-astro-blog](https://github.com/absolutelyfullycapable/cursor-astro-blog))로 배포합니다.

- **배포 주소** · https://absolutelyfullycapable.github.io/cursor-astro-blog/
- **주요 기능** · Home / About / Blog 메뉴 · 마크다운 글 · 월별 폴더(`YYYY/MM`) · 카테고리·태그·월별 아카이브 · Pretendard UI · GitHub Actions 자동 배포
- **파비콘** · `src/assets/blogfavicon.js`에 PNG를 base64 data URL로 인라인 (이미지 바이너리 커밋 회피)
- **대표 아이콘** · `src/assets/blogicon.js` base64 인라인 — 헤더 로고 · 홈 히어로 · About에 배치
- **글 추가** · `src/content/blog/YYYY/MM/slug.md`에 frontmatter(`title`, `description`, `pubDate`, `category`, `tags`)와 본문 작성 후 빌드·배포
- **최근 글** · `2026/07/monchhichi-first-buy-guide.md` (몬치치 첫 구매 가이드, `pubDate: 2026-07-22`) · `2026/07/today-think.md` — [cursor-astro-blog](https://github.com/absolutelyfullycapable/cursor-astro-blog)에 push하여 Pages 반영

```bash
cd "21 나만의 블로그 만들기/blog"
npm install
npm run dev
# http://localhost:4321/cursor-astro-blog/ 접속

# 정적 빌드 후 미리보기
npm run build
npm run preview
# http://127.0.0.1:4321/cursor-astro-blog/blog/2026/07/monchhichi-first-buy-guide/ 등에서 글 확인
```

22 프로젝트는 Next.js(App Router) + Tailwind CSS + Supabase로 만든 커뮤니티 게시판입니다. Reddit 스타일 레이아웃을 참고했고, 이메일/비밀번호 인증(OAuth 없음)과 글·댓글·반응·검색을 지원합니다. 배포용 단독 저장소는 [community-board](https://github.com/absolutelyfullycapable/community-board) 입니다.

- **주요 기능** · 회원가입 · 로그인 · 로그아웃 · 내 정보 · 글 작성/수정/삭제 · 글·댓글 이미지 첨부 · 좋아요/싫어요 · 댓글·답글 · 글 검색
- **DB** · Supabase `profiles` · `posts` · `comments`(parent_id · image_path) · `post_reactions` · Storage `post-images` · RLS
- **UI** · Pretendard · 3열 레이아웃(메뉴 · 피드 · 커뮤니티 소개) · Server Actions
- **보안** · `.env.local`은 gitignore · Publishable/anon key만 클라이언트 사용 · 이메일 확인은 대시보드에서 개발용으로 끌 수 있음
- **배포** · [community-board](https://github.com/absolutelyfullycapable/community-board)를 Vercel에 Import · `NEXT_PUBLIC_SUPABASE_URL` · `NEXT_PUBLIC_SUPABASE_ANON_KEY` 등록 · Supabase Auth URL에 Vercel 도메인 추가

```bash
cd "22 나만의 커뮤니티 게시판 만들기/community"
npm install

# .env.local 생성 (.env.example 참고)
# NEXT_PUBLIC_SUPABASE_URL=...
# NEXT_PUBLIC_SUPABASE_ANON_KEY=...

npm run dev
# http://localhost:3000 접속
```

23 프로젝트는 Firecrawl MCP로 네이버 블로그 맛집 후기를 수집한 뒤, HTML/CSS/Vanilla JS로 정적인 맛집 안내 사이트를 구성하는 실습입니다. 블로그 음식 이미지는 별도 바이너리 파일 없이 `image-data.js`에 base64 데이터 URL로 인라인해 사용합니다.

- **주요 기능** · 히어로 비주얼 · 음식 갤러리 · 방문 정보 패널 · 메뉴 리뷰 탭 · 주소 복사 버튼
- **이미지 처리** · 블로그 음식 이미지 crop · JPEG 압축 · base64 인라인
- **실행 방식** · 빌드 도구 없이 브라우저에서 바로 열기 가능

```bash
# 브라우저에서 바로 열기
open "23 Firecrawl MCP로 데이터 수집하고 웹페이지 만들기/index.html"

# 또는 로컬 서버로 실행
cd "23 Firecrawl MCP로 데이터 수집하고 웹페이지 만들기"
python3 -m http.server 8730
# http://127.0.0.1:8730 접속
```

24 프로젝트는 Naver Search MCP로 인기 블로그를 검색·분석하고, Firecrawl로 본문을 확인한 뒤 벤치마킹해 새 글을 작성하는 실습입니다. Unsplash MCP로 본문용 이미지를 찾아 삽입하고, 완성 글은 Astro 블로그([cursor-astro-blog](https://github.com/absolutelyfullycapable/cursor-astro-blog))에 포스트로 반영합니다.

- **주요 흐름** · 네이버 블로그 검색(관련도순) · 상위 글 description·본문 요약 · 핵심 키워드 벤치마킹 · 창의적 새 글 작성 · Unsplash 이미지 삽입 · Astro 블로그 배포
- **산출물** · `monchhichi-first-buy-guide.md` (실습 원본) · `21 .../blog/src/content/blog/2026/07/monchhichi-first-buy-guide.md` (frontmatter 포함 포스트)
- **MCP** · Naver Search(`NAVER_CLIENT_ID` · `NAVER_CLIENT_SECRET`) · Firecrawl · Unsplash(`UNSPLASH_ACCESS_KEY`) — 키는 `~/.cursor/mcp.json`의 `env`에 설정 (저장소에 커밋하지 않음)
- **이미지** · Unsplash URL 사용 (로컬 이미지 바이너리 커밋 없음)

```bash
# 실습 원본 글 확인
open "24 네이버 서치 MCP로 인기 블로그 분석해 블로그하기/monchhichi-first-buy-guide.md"

# 블로그 포스트로 미리보기 (21 프로젝트)
cd "21 나만의 블로그 만들기/blog"
npm install
npm run dev
# http://localhost:4321/cursor-astro-blog/blog/2026/07/monchhichi-first-buy-guide/
```

25 프로젝트는 Sequential Thinking MCP로 테트리스의 요구사항·아키텍처·게임 루프를 단계적으로 설계한 뒤, 바닐라 HTML/CSS/Canvas로 구현한 아케이드 게임입니다. 배포용 단독 저장소는 [tetris-game](https://github.com/absolutelyfullycapable/tetris-game) 입니다.

- **주요 기능** · 10×20 보드 · 7종 테트로미노 · Ghost piece · Next 미리보기 · 점수/레벨/라인 · 최고 점수 저장 · 일시정지 · 모바일 터치 조작
- **설계** · Sequential Thinking MCP로 collide · merge · clearLines · 7-bag · gravity 루프를 가설 검증 후 구현
- **실행 방식** · 빌드 도구 없이 브라우저에서 바로 열기 가능
- **배포** · [tetris-game](https://github.com/absolutelyfullycapable/tetris-game)을 Vercel에 Import (정적 HTML, 빌드 설정 불필요)

```bash
# 브라우저에서 바로 열기
open "25 Sequential Thinking MCP로 테트리스 게임 만들기/index.html"

# 또는 로컬 서버로 실행
cd "25 Sequential Thinking MCP로 테트리스 게임 만들기"
python3 -m http.server 8731
# http://127.0.0.1:8731 접속
```

26 프로젝트는 근처 식당으로 오늘의 메뉴를 뽑는 **위치 기반 식당 룰렛 웹앱**입니다. 점심·저녁 등 식사 시간에 국한하지 않고 사용할 수 있어요.
처음에는 카카오맵 MCP/API를 쓰려 했으나, 브라우저 CORS·카카오맵 활성화(유료 안내) 등 실습 환경 한계로 **OpenStreetMap(완전 무료)** 으로 전환했습니다.

- **주요 기능** · 시작 위치 팝업 · 현재 위치/장소명 검색 · 원형 룰렛 · 돌리기 / 다시 돌리기
- **설계** · Sequential Thinking으로 HTML/CSS/JS + 로컬 `server.py` 방식 선택
- **데이터** · Nominatim(위치) + Overpass(근처 식당) — API 키·요금 없음 · 공개 서버 혼잡 시 미러 재시도
- **실행** · `python3 server.py` 후 http://127.0.0.1:8765 접속
- **배포** · [what-to-eat-roulette](https://github.com/absolutelyfullycapable/what-to-eat-roulette)을 Vercel에 Import

```bash
cd "26 오늘 뭐 먹지? 위치 기반 식당 정하기 룰렛 만들기"
python3 server.py
# http://127.0.0.1:8765 접속
```

---

## 참고

- **저자** · 박현규
- **출판** · 골든래빗(주), 2025
