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
| 11 ~ 30 | — | 🔜 |

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
└── 06 v0 서비스로 더 쉽게 웹사이트 만들기/         # Next.js + shadcn/ui (v0 생성)
    └── maison-eclat/
        ├── package.json
        ├── components.json
        ├── app/               # layout · page · globals.css · careers/
        ├── components/        # site-header · hero · marquee · ... · ui/button
        └── lib/utils.ts
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
└── 10 나만의 QR 코드 생성기 쉽게 만들기/             # Python + Gradio + qrcode + Pillow
    ├── qr_generator.py        # 로고 삽입 QR 생성 앱
    ├── requirements.txt
    └── README.md
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

---

## 참고

- **저자** · 박현규
- **출판** · 골든래빗(주), 2025
