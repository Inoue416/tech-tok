import type { Meta, StoryObj } from "@storybook/nextjs";
import { fn } from "storybook/test";
import type { Article } from "@/features/feed/types/article";
import { BookmarksList } from "./bookmarks-list";

const meta: Meta<typeof BookmarksList> = {
	title: "features/Bookmarks/BookmarksList",
	component: BookmarksList,
	tags: ["autodocs"],
	parameters: {
		layout: "fullscreen",
	},
	args: {
		onLoadMore: fn(),
		onRemove: fn(),
	},
};
export default meta;

type Story = StoryObj<typeof BookmarksList>;

// サンプルデータ生成関数
const createArticle = (
	id: number,
	type: "rss" | "post",
	daysAgo: number,
): Article => ({
	id: `article-${id}`,
	type,
	title:
		type === "rss"
			? `Next.js ${id}の新機能：App Routerの改善とパフォーマンス最適化`
			: `TypeScriptの型安全性を活用したReactコンポーネント設計 Part ${id}`,
	content:
		type === "rss"
			? "Next.js 15では、App Routerの安定性が大幅に向上し、新しいキャッシング戦略が導入されました。"
			: "TypeScriptを使ったReactコンポーネントの設計パターンについて、実践的な例を交えて紹介します。",
	authorName: type === "rss" ? "Vercel Blog" : `開発者${id}`,
	authorAvatar:
		id % 3 === 0 ? undefined : `https://picsum.photos/seed/${id}/400/300`,
	originalUrl: type === "rss" ? `https://example.com/article-${id}` : undefined,
	publishedAt: new Date(Date.now() - daysAgo * 24 * 60 * 60 * 1000),
	likeCount: Math.floor(Math.random() * 200),
	commentCount: Math.floor(Math.random() * 50),
	shareCount: Math.floor(Math.random() * 100),
	isLiked: Math.random() > 0.5,
	isBookmarked: true,
	categories: [
		{ id: "1", name: type === "rss" ? "Next.js" : "TypeScript", color: null },
		{ id: "2", name: "React", color: "#61DAFB" },
	],
});

// 複数アイテムのサンプルデータ
const multipleArticles: Article[] = [
	createArticle(1, "rss", 1),
	createArticle(2, "post", 2),
	createArticle(3, "rss", 3),
	createArticle(4, "post", 5),
	createArticle(5, "rss", 7),
	createArticle(6, "post", 10),
];

const manyArticles: Article[] = Array.from({ length: 15 }, (_, i) =>
	createArticle(i + 1, i % 2 === 0 ? "rss" : "post", i + 1),
);

export const Default: Story = {
	args: {
		articles: multipleArticles,
		hasMore: false,
		isLoading: false,
	},
};

export const WithMoreItems: Story = {
	args: {
		articles: multipleArticles,
		hasMore: true,
		isLoading: false,
	},
};

export const Loading: Story = {
	args: {
		articles: [],
		hasMore: false,
		isLoading: true,
	},
};

export const LoadingMore: Story = {
	args: {
		articles: multipleArticles,
		hasMore: true,
		isLoading: true,
	},
};

export const ManyItems: Story = {
	args: {
		articles: manyArticles,
		hasMore: true,
		isLoading: false,
	},
};

export const SingleColumn: Story = {
	args: {
		articles: multipleArticles,
		hasMore: false,
		isLoading: false,
	},
	parameters: {
		viewport: {
			defaultViewport: "mobile1",
		},
	},
};

export const TwoColumns: Story = {
	args: {
		articles: multipleArticles,
		hasMore: false,
		isLoading: false,
	},
	parameters: {
		viewport: {
			defaultViewport: "tablet",
		},
	},
};

export const ThreeColumns: Story = {
	args: {
		articles: manyArticles,
		hasMore: false,
		isLoading: false,
	},
	parameters: {
		viewport: {
			defaultViewport: "desktop",
		},
	},
};
