# community-board

Next.js + Supabase로 만든 Reddit 스타일 커뮤니티 게시판입니다.  
이메일 회원가입·로그인, 게시글 CRUD, 이미지 첨부, 좋아요/싫어요, 댓글·답글을 지원합니다.

## 기술 스택

- **Frontend** — Next.js (App Router), React, Tailwind CSS, Pretendard
- **Backend** — Supabase (Auth, Postgres, Storage, RLS)

## 주요 기능

- 이메일·비밀번호 회원가입 / 로그인 / 로그아웃
- 프로필(닉네임·소개) 수정
- 게시글 작성 · 수정 · 삭제 · 검색
- 게시글·댓글 이미지 첨부
- 좋아요 / 싫어요
- 댓글 · 답글 (1단계)

## 폴더 구조

```text
community/
├── public/                 # 정적 자산
├── src/
│   ├── app/                # App Router 페이지
│   │   ├── page.tsx        # 홈 (게시글 목록)
│   │   ├── login/          # 로그인
│   │   ├── signup/         # 회원가입
│   │   ├── me/             # 내 프로필
│   │   └── posts/          # 게시글 상세 · 작성 · 수정
│   ├── components/         # UI 컴포넌트
│   ├── actions/            # Server Actions (auth, posts, comments …)
│   ├── lib/
│   │   ├── supabase/       # Supabase 클라이언트 (browser / server / middleware)
│   │   ├── posts.ts        # 게시글 조회 헬퍼
│   │   ├── profile.ts      # 프로필 헬퍼
│   │   └── types.ts        # 공통 타입
│   └── middleware.ts       # 세션 갱신
├── .env.example
├── next.config.ts
└── package.json
```

## 페이지 구성

| 경로 | 설명 |
|------|------|
| `/` | 게시글 목록 · 검색 |
| `/login`, `/signup` | 로그인 · 회원가입 |
| `/me` | 내 프로필 |
| `/posts/new` | 게시글 작성 |
| `/posts/[id]` | 게시글 상세 · 댓글 |
| `/posts/[id]/edit` | 게시글 수정 |
