# Cursor Notes (실습용 Astro 블로그)

Astro + Markdown + GitHub Pages로 만든 정적 블로그입니다.  

## 배포 주소

- 사이트: https://absolutelyfullycapable.github.io/cursor-astro-blog/
- 저장소: https://github.com/absolutelyfullycapable/cursor-astro-blog

## 기능

- Home / About / Blog 메뉴
- 마크다운 글 작성 (`src/content/blog/YYYY/MM/`)
- 카테고리·태그·월별 아카이브 분류
- 정적 빌드 + GitHub Actions 자동 배포

## 글 추가 방법

`src/content/blog/2026/07/my-post.md`처럼 파일을 만들고 frontmatter를 채웁니다.

```yaml
---
title: '글 제목'
description: '짧은 요약'
pubDate: 2026-07-16
category: '개발'
tags: ['astro', 'markdown']
---
```

## 로컬 개발

```bash
npm install
npm run dev
```

## 빌드

```bash
npm run build
npm run preview
```
