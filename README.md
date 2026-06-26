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
| 06 ~ 30 | — | 🔜 |

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
└── 05 메모 앱 만들어 보기/                        # React + Vite
    └── memo-app/
        ├── index.html        # 파비콘 base64 인라인
        ├── package.json
        ├── vite.config.js
        └── src/
            ├── main.jsx · App.jsx · App.css · index.css
            └── components/    # MemoCard
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

---

## 참고

- **저자** · 박현규
- **출판** · 골든래빗(주), 2025
