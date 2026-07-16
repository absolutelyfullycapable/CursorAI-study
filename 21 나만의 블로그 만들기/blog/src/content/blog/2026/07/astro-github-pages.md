---
title: 'Astro를 GitHub Pages에 배포하기'
description: '프로젝트 사이트 방식으로 Astro 정적 빌드를 GitHub Pages에 올리는 방법입니다.'
pubDate: 2026-07-10
category: '개발'
tags: ['astro', 'github-pages', 'deploy']
---

기존에 `username.github.io` 루트 사이트가 있다면, 실습용으로는 **별도 저장소 + 프로젝트 Pages**가 안전합니다.

## 핵심 설정

`astro.config.mjs`에서 `site`와 `base`를 맞춥니다.

```js
export default defineConfig({
  site: 'https://absolutelyfullycapable.github.io',
  base: '/cursor-astro-blog',
});
```

## GitHub Actions

`withastro/action`으로 빌드하고 `actions/deploy-pages`로 배포합니다. Astro 7은 **Node.js 22 이상**이 필요합니다.

## 체크리스트

1. 저장소 Settings → Pages → Source: **GitHub Actions**
2. `main`에 push
3. Actions가 성공했는지 확인
4. `https://…github.io/<repo-name>/` 접속
