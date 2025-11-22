import type { Meta, StoryObj } from "@storybook/nextjs";
import type { Article } from "@/features/feed/types/article";
import { ArticleCard } from "./article-card";

const sampleArticle: Article = {
	id: "1",
	type: "rss",
	title: "Next.js 15の新機能を徹底解説",
	content:
		"Next.js 15がリリースされ、多くの新機能が追加されました。この記事では、主要な新機能について詳しく解説します。特に注目すべきは、パフォーマンスの向上とDeveloper Experienceの改善です。新しいキャッシング戦略により、ページの読み込み速度が大幅に向上しました。",
	authorName: "山田太郎",
	authorAvatar: "https://i.pravatar.cc/150?img=1",
	originalUrl: "https://example.com/article/nextjs-15",
	publishedAt: new Date("2024-01-15"),
	likeCount: 42,
	commentCount: 8,
	shareCount: 15,
	isLiked: false,
	isBookmarked: false,
	categories: [
		{ id: "1", name: "Next.js", color: "#000000" },
		{ id: "2", name: "React", color: "#61DAFB" },
	],
};

const longArticle: Article = {
	...sampleArticle,
	id: "2",
	title: "TypeScriptの型システムを深く理解する",
	content:
		"TypeScriptの型システムは非常に強力で、JavaScriptに静的型付けをもたらします。この記事では、基本的な型から高度な型まで、TypeScriptの型システムを深く掘り下げていきます。まず、プリミティブ型について説明します。number、string、boolean、null、undefinedなどの基本的な型があります。次に、オブジェクト型について見ていきましょう。インターフェースと型エイリアスの違いや、使い分けについても解説します。さらに、ジェネリクスやユニオン型、インターセクション型などの高度な型についても詳しく説明します。最後に、型ガードやアサーション、型推論についても触れていきます。".repeat(
			3,
		),
};

const meta: Meta<typeof ArticleCard> = {
	title: "Feed/ArticleCard",
	component: ArticleCard,
	parameters: {
		layout: "fullscreen",
		backgrounds: {
			default: "dark",
			values: [{ name: "dark", value: "#000000" }],
		},
	},
	argTypes: {
		isActive: {
			control: "boolean",
			description: "記事がアクティブかどうか",
		},
	},
};

export default meta;
type Story = StoryObj<typeof ArticleCard>;

/**
 * デフォルトの記事カード
 */
export const Default: Story = {
	args: {
		article: sampleArticle,
		isActive: true,
	},
};

/**
 * 長文の記事カード
 */
export const LongContent: Story = {
	args: {
		article: longArticle,
		isActive: true,
	},
};

/**
 * 元記事URLなし
 */
export const NoOriginalUrl: Story = {
	args: {
		article: {
			...sampleArticle,
			originalUrl: undefined,
		},
		isActive: true,
	},
};

/**
 * カテゴリーなし
 */
export const NoCategories: Story = {
	args: {
		article: {
			...sampleArticle,
			categories: [],
		},
		isActive: true,
	},
};

/**
 * アバターなし
 */
export const NoAvatar: Story = {
	args: {
		article: {
			...sampleArticle,
			authorAvatar: undefined,
		},
		isActive: true,
	},
};
