export interface PostFrontmatter {
	title: string;
	description: string;
	pubDate: string | Date;
	category: string;
	tags?: string[];
	draft?: boolean;
}

export interface BlogPost {
	id: string;
	data: {
		title: string;
		description: string;
		pubDate: Date;
		category: string;
		tags: string[];
		draft: boolean;
	};
	Content: unknown;
}

type MarkdownModule = {
	frontmatter: PostFrontmatter;
	file: string;
	Content: unknown;
};

const modules = import.meta.glob<MarkdownModule>('/src/content/blog/**/*.md', { eager: true });

function idFromFile(file: string): string {
	const normalized = file.replace(/\\/g, '/');
	const match = normalized.match(/content\/blog\/(.+)\.md$/);
	return match?.[1] ?? normalized;
}

function toPost(mod: MarkdownModule): BlogPost {
	const pubDate = new Date(mod.frontmatter.pubDate);
	return {
		id: idFromFile(mod.file),
		data: {
			title: mod.frontmatter.title,
			description: mod.frontmatter.description,
			pubDate,
			category: mod.frontmatter.category,
			tags: mod.frontmatter.tags ?? [],
			draft: Boolean(mod.frontmatter.draft),
		},
		Content: mod.Content,
	};
}

export function withBase(path: string): string {
	const base = import.meta.env.BASE_URL;
	const normalized = path.startsWith('/') ? path : `/${path}`;
	return `${base.replace(/\/$/, '')}${normalized}`;
}

export function getPublishedPosts(): BlogPost[] {
	return Object.values(modules)
		.map(toPost)
		.filter((post) => !post.data.draft)
		.sort((a, b) => b.data.pubDate.valueOf() - a.data.pubDate.valueOf());
}

export function postUrl(post: BlogPost): string {
	return withBase(`/blog/${post.id}/`);
}

export function formatDate(date: Date): string {
	return new Intl.DateTimeFormat('ko-KR', {
		year: 'numeric',
		month: 'long',
		day: 'numeric',
	}).format(date);
}

export function monthKey(date: Date): string {
	const y = date.getFullYear();
	const m = String(date.getMonth() + 1).padStart(2, '0');
	return `${y}-${m}`;
}

export function monthLabel(date: Date): string {
	return new Intl.DateTimeFormat('ko-KR', {
		year: 'numeric',
		month: 'long',
	}).format(date);
}

export function groupByMonth(posts: BlogPost[]): { key: string; label: string; posts: BlogPost[] }[] {
	const map = new Map<string, BlogPost[]>();
	for (const post of posts) {
		const key = monthKey(post.data.pubDate);
		const list = map.get(key) ?? [];
		list.push(post);
		map.set(key, list);
	}
	return [...map.entries()].map(([key, groupPosts]) => ({
		key,
		label: monthLabel(groupPosts[0].data.pubDate),
		posts: groupPosts,
	}));
}

export function uniqueCategories(posts: BlogPost[]): string[] {
	return [...new Set(posts.map((p) => p.data.category))].sort((a, b) => a.localeCompare(b, 'ko'));
}

export function uniqueTags(posts: BlogPost[]): string[] {
	return [...new Set(posts.flatMap((p) => p.data.tags))].sort((a, b) => a.localeCompare(b, 'ko'));
}
