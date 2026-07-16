// @ts-check
import { defineConfig } from 'astro/config';

// GitHub Pages 프로젝트 사이트 배포용 설정
// 배포 URL: https://absolutelyfullycapable.github.io/cursor-astro-blog/
// 기존 루트 사이트(absolutelyfullycapable.github.io)와 분리된 실습용 저장소입니다.
export default defineConfig({
	site: 'https://absolutelyfullycapable.github.io',
	base: '/cursor-astro-blog',
	markdown: {
		shikiConfig: {
			theme: 'everforest-dark',
		},
	},
});
