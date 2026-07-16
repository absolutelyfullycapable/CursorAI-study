---
title: '마크다운으로 글 쓰는 법'
description: 'frontmatter에 제목·날짜·카테고리·태그를 넣고 본문을 마크다운으로 작성합니다.'
pubDate: 2026-07-16
category: '개발'
tags: ['markdown', 'writing', 'astro']
---

글은 `src/content/blog/YYYY/MM/slug.md` 경로에 추가합니다.

## Frontmatter 예시

```yaml
---
title: '글 제목'
description: '짧은 요약'
pubDate: 2026-07-16
category: '개발'
tags: ['markdown', 'astro']
---
```

## 본문에서 쓸 수 있는 것

- **굵게**, *기울임*, `인라인 코드`
- 제목, 목록, 인용구
- 코드 블록 (언어 지정 가능)

> 좋은 글은 짧게 시작하고, 한 가지 주제만 다룹니다.

## 분류 페이지

- 카테고리: `/blog/category/<이름>/`
- 태그: `/blog/tag/<이름>/`
- 월별: `/blog/archive/YYYY-MM/`
