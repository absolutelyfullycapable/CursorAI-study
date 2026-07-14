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
| 17 ~ 30 | — | 🔜 |

---

## 폴더 구조

```
@스터디/
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
└── 16 Claude API로 PDF 요약 프로그램 만들기/   # Python + pypdf + Claude API
    ├── extract_pdf_text.py    # pdf/ 폴더 PDF 텍스트 추출 → extracted_text/
    ├── summarize_text.py      # extracted_text/ Claude API 요약 → summaries/
    ├── .env.example           # Anthropic API 키 예시
    └── requirements.txt
```

---

## 실행 방법

01~03 프로젝트는 폴더의 HTML 파일을 브라우저에서 열면 됩니다.

```bash
# 예시: 사과 게임
open "@스터디/02 사과 게임 만들어 보기/index.html"
```

04 인스타그램 클론은 React + Vite 프로젝트이므로 개발 서버로 실행합니다.

```bash
cd "@스터디/04 인스타그램과 비슷한 사이트 만들어 보기"
npm install
npm run dev
```

05 메모 앱도 React + Vite 프로젝트입니다. 메모 추가 · 수정 · 삭제 · 검색을 지원하며, 작성한 메모는 브라우저 localStorage에 저장됩니다.

```bash
cd "@스터디/05 메모 앱 만들어 보기/memo-app"
npm install
npm run dev
```

06 v0 웹사이트는 v0로 생성한 Next.js + shadcn/ui 프로젝트입니다. 흑백 미니멀 톤의 패션 브랜드 페이지(MAISON ÉCLAT)이며, 한글 폰트로 Pretendard를 사용하고 채용 안내 페이지(`/careers`)를 포함합니다.

```bash
cd "@스터디/06 v0 서비스로 더 쉽게 웹사이트 만들기/maison-eclat"
npm install
npm run dev
```

07 메모 앱은 v0로 만든 밝은 톤의 메모 앱에 **회원가입 · 로그인 · 로그아웃**과 **SQLite DB 메모 저장**을 추가한 Next.js 프로젝트입니다. Prisma ORM과 JWT 세션(httpOnly 쿠키)을 사용하며, 로그인한 사용자별로 메모가 DB에 저장됩니다.

```bash
cd "@스터디/07 메모 앱에 회원 가입, 로그인, 로그아웃, 메모 저장 기능 더하기/bright-memo-app"
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
cd "@스터디/08 1년 치 금 시세 크롤링하기"
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
cd "@스터디/09 해외 주식 크롤링 프로그램 만들기"
pip3 install -r requirements.txt

# 상승 주식 데이터 수집 및 엑셀 저장
python3 crawl_stocks.py
```

10 프로젝트는 링크와 중앙 이미지를 입력해 QR 코드를 생성하고 저장하는 Python + Gradio 실습입니다.

```bash
cd "@스터디/10 나만의 QR 코드 생성기 쉽게 만들기"
pip3 install -r requirements.txt
python3 qr_generator.py
```

11 프로젝트는 PDF 페이지 추출과 이어붙이기를 제공하는 Python + Gradio 실습입니다. 터미널에서 실행하면 브라우저에 웹 UI가 열립니다.

- **페이지 추출** · 원하는 페이지 범위를 추출해 `원본파일명_YYYYMMDD.pdf` 형식으로 저장
- **PDF 이어붙이기** · 2개 이상의 PDF를 첨부한 순서대로 합쳐 지정한 폴더에 저장 (파일명 충돌 시 `_(숫자)` 접미사)

```bash
cd "@스터디/11 PDF 편집기 만들기"
python3 -m pip install -r requirements.txt
python3 pdf_app.py
```

12 프로젝트는 [Lorem Picsum](https://picsum.photos) API로 300×300 랜덤 이미지 30장을 불러와 가상 사진 전시회처럼 보여 주는 HTML 실습입니다. 작품 클릭 시 라이트박스로 크게 볼 수 있습니다.

```bash
# 브라우저에서 바로 열기
open "@스터디/12 랜덤 이미지를 주는 API로 미술관 사이트 만들기/index.html"

# 또는 로컬 서버로 실행
cd "@스터디/12 랜덤 이미지를 주는 API로 미술관 사이트 만들기"
python3 -m http.server 8765
```

13 프로젝트는 [공공데이터포털 금융위원회 주식시세정보 API](https://www.data.go.kr/)로 한국거래소 주식 시세를 조회해, **종가 기준 TOP 50**을 보여 주는 대시보드입니다. 날짜를 선택하고 새로고침하면 해당 일자 장 마감 기준 데이터를 확인할 수 있습니다. 브라우저 CORS 제한을 피하기 위해 Python 프록시 서버를 함께 사용합니다.

- **주요 기능** · 최신 거래일 자동 조회 · 날짜별 TOP 50 조회 · 종목명 · 시장구분 · 종가 · 등락률 · 거래량 · 시가총액 표시

```bash
cd "@스터디/13 한국거래소 주식 데이터 API로 나만의 대시보드 만들기"

# API 키 설정 (공공데이터포털에서 발급)
export DATA_GO_KR_API_KEY='발급받은-API-키'

# 서버 실행 후 브라우저에서 http://127.0.0.1:8080 접속
python3 server.py
```

14 프로젝트는 [공공데이터포털 서울특별시 서초구 휴게음식점 현황 API](https://www.data.go.kr/)로 카페 · 분식 · 패스트푸드 등 휴게음식점 정보를 조회하는 식당 추천 사이트입니다. 초기에는 HTML/CSS/JS로 10곳을 표시했고, 이후 React + Vite로 전환해 전체 데이터 로딩 · 무한 스크롤 · 검색 기능을 구현했습니다.

- **주요 기능** · 전체 2,192곳 데이터 로딩 · 3열 그리드 · 무한 스크롤(12개씩) · 식당 이름 · 주소 검색 · 검색 결과 화면

```bash
cd "@스터디/14 식당 추천 사이트 만들기/restaurant-app"
npm install

# .env 파일 생성 (.env.example 참고)
# VITE_API_KEY='발급받은-API-키'

npm run dev
```

15 프로젝트는 엑셀 고객 목록을 읽어 Gmail SMTP로 배송 안내 메일을 보내는 실습입니다. Flask + Tailwind 웹 UI에서 보내는 사람 입력 · 엑셀 업로드 · 미리보기 · 전송까지 진행할 수 있고, CLI 스크립트로도 테스트 발송이 가능합니다.

- **주요 기능** · 엑셀 업로드 · 받는 사람·제목·내용 자동 매핑 · 발송 전 미리보기 · Gmail SMTP 발송 · 발송 건수 제한
- **필수 엑셀 컬럼** · 이메일 · 메일제목 · 메일내용

```bash
cd "@스터디/15 메일 발송 자동화 프로그램 만들기"
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
cd "@스터디/16 Claude API로 PDF 요약 프로그램 만들기"
python3 -m pip install -r requirements.txt

# .env 파일 생성 (.env.example 참고)
# ANTHROPIC_API_KEY='발급받은-Anthropic-API-키'

# PDF → 텍스트 추출 (extracted_text/)
python3 extract_pdf_text.py

# 추출 텍스트 → Claude 요약 (summaries/)
python3 summarize_text.py
```

---

## 참고

- **저자** · 박현규
- **출판** · 골든래빗(주), 2025
