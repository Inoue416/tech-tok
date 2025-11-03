import type { Meta, StoryObj } from "@storybook/nextjs";
import { fn } from "storybook/test";
import type { Article } from "@/features/feed/types/article";
import { BookmarkCard } from "./bookmark-card";

const meta: Meta<typeof BookmarkCard> = {
	title: "features/Bookmarks/BookmarkCard",
	component: BookmarkCard,
	tags: ["autodocs"],
	parameters: {
		layout: "padded",
	},
	decorators: [
		(Story) => (
			<div className="max-w-sm">
				<Story />
			</div>
		),
	],
	args: {
		onRemove: fn(),
	},
};
export default meta;

type Story = StoryObj<typeof BookmarkCard>;

const rssArticle: Article = {
	id: "1",
	type: "rss",
	title: "Next.js 15の新機能：App Routerの改善とパフォーマンス最適化",
	content:
		"Next.js 15では、App Routerの安定性が大幅に向上し、新しいキャッシング戦略が導入されました。この記事では、主要な変更点と実装方法について詳しく解説します。",
	authorName: "Vercel Blog",
	authorAvatar: "https://picsum.photos/seed/nextjs/400/300",
	originalUrl: "https://nextjs.org/blog/next-15",
	publishedAt: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2 hours ago
	likeCount: 42,
	commentCount: 8,
	shareCount: 15,
	isLiked: false,
	isBookmarked: true,
	categories: [
		{ id: "1", name: "Next.js", color: "#000000" },
		{ id: "2", name: "React", color: "#61DAFB" },
	],
};

const userPost: Article = {
	id: "2",
	type: "post",
	title: "TypeScriptの型安全性を活用したReactコンポーネント設計",
	content:
		"TypeScriptを使ったReactコンポーネントの設計パターンについて、実践的な例を交えて紹介します。ジェネリクスや条件型を活用することで、より堅牢なコンポーネントを作成できます。",
	authorName: "田中太郎",
	authorAvatar: "https://picsum.photos/seed/user1/400/300",
	publishedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000), // 1 day ago
	likeCount: 128,
	commentCount: 23,
	shareCount: 45,
	isLiked: true,
	isBookmarked: true,
	categories: [
		{ id: "3", name: "TypeScript", color: "#3178C6" },
		{ id: "4", name: "React", color: "#61DAFB" },
	],
};

const noThumbnailArticle: Article = {
	id: "3",
	type: "rss",
	title: "Rustで学ぶメモリ管理の基礎",
	content:
		"Rustの所有権システムとライフタイムについて、初心者にもわかりやすく解説します。",
	authorName: "Rust公式ブログ",
	publishedAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000), // 1 week ago
	likeCount: 89,
	commentCount: 12,
	shareCount: 34,
	isLiked: false,
	isBookmarked: true,
	categories: [{ id: "5", name: "Rust", color: "#CE422B" }],
};

const longTitleArticle: Article = {
	id: "4",
	type: "post",
	title:
		"大規模Webアプリケーション開発におけるマイクロフロントエンドアーキテクチャの設計と実装：実践的なアプローチとベストプラクティス",
	content:
		"この記事では、マイクロフロントエンドアーキテクチャを採用する際の設計原則、技術選定、実装方法について、実際のプロジェクト経験を基に詳しく解説します。",
	authorName: "山田花子",
	authorAvatar: "https://picsum.photos/seed/user2/400/300",
	publishedAt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000), // 1 month ago
	likeCount: 256,
	commentCount: 67,
	shareCount: 123,
	isLiked: false,
	isBookmarked: true,
	categories: [
		{ id: "6", name: "Architecture", color: "#FF6B6B" },
		{ id: "7", name: "Frontend", color: "#4ECDC4" },
	],
};

export const RSSArticle: Story = {
	args: {
		article: rssArticle,
	},
};

export const UserPost: Story = {
	args: {
		article: userPost,
	},
};

export const NoThumbnail: Story = {
	args: {
		article: noThumbnailArticle,
	},
};

export const LongTitle: Story = {
	args: {
		article: longTitleArticle,
	},
};

export const Removing: Story = {
	args: {
		article: rssArticle,
		onRemove: async () => {
			await new Promise((resolve) => setTimeout(resolve, 2000));
		},
	},
};
