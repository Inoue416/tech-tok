import type { Meta, StoryObj } from "@storybook/nextjs";
import { FeedInfo } from "./feed-info";
import type { FeedItemData } from "../types";

const meta: Meta<typeof FeedInfo> = {
	title: "features/feed/FeedInfo",
	component: FeedInfo,
	tags: ["autodocs"],
	parameters: {
		layout: "centered",
		backgrounds: {
			default: "dark",
			values: [
				{ name: "dark", value: "#000000" },
				{ name: "light", value: "#ffffff" },
			],
		},
	},
};

export default meta;
type Story = StoryObj<typeof FeedInfo>;

// モックデータ
const basicFeedData: FeedItemData = {
	id: "feed-1",
	type: "text",
	content: {
		title: "React Server Components",
		description: "Next.js 13のApp Routerで導入された React Server Components について詳しく解説します。パフォーマンスの向上と開発者体験の改善を両立する新しいアプローチです。",
	},
	author: {
		id: "author-1",
		name: "田中太郎",
		avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=32&h=32&fit=crop&crop=face",
	},
	stats: {
		likes: 1234,
		comments: 89,
		shares: 45,
	},
	hashtags: ["React", "Next.js", "ServerComponents", "JavaScript"],
};

/**
 * 基本的なFeedInfo
 */
export const Default: Story = {
	args: {
		data: basicFeedData,
	},
	render: (args) => (
		<div className="max-w-md p-4">
			<FeedInfo {...args} />
		</div>
	),
};

/**
 * アバターなしのFeedInfo
 */
export const WithoutAvatar: Story = {
	args: {
		data: {
			...basicFeedData,
			author: {
				...basicFeedData.author,
				avatar: undefined,
			},
		},
	},
	render: (args) => (
		<div className="max-w-md p-4">
			<FeedInfo {...args} />
		</div>
	),
};

/**
 * 説明なしのFeedInfo
 */
export const WithoutDescription: Story = {
	args: {
		data: {
			...basicFeedData,
			content: {
				...basicFeedData.content,
				description: undefined,
			},
		},
	},
	render: (args) => (
		<div className="max-w-md p-4">
			<FeedInfo {...args} />
		</div>
	),
};

/**
 * ハッシュタグなしのFeedInfo
 */
export const WithoutHashtags: Story = {
	args: {
		data: {
			...basicFeedData,
			hashtags: undefined,
		},
	},
	render: (args) => (
		<div className="max-w-md p-4">
			<FeedInfo {...args} />
		</div>
	),
};

/**
 * 長いユーザー名とコンテンツのFeedInfo
 */
export const LongContent: Story = {
	args: {
		data: {
			...basicFeedData,
			author: {
				...basicFeedData.author,
				name: "フロントエンド開発者の山田花子",
			},
			content: {
				...basicFeedData.content,
				description: "これは非常に長い説明文の例です。フィード内でのテキストの折り返しや表示がどのように処理されるかを確認するために使用します。React Server Componentsは、従来のクライアントサイドレンダリングとサーバーサイドレンダリングの利点を組み合わせた画期的な技術です。この技術により、パフォーマンスの向上とともに開発者体験も大幅に改善されます。",
			},
			hashtags: ["React", "Next.js", "ServerComponents", "JavaScript", "TypeScript", "Web開発", "フロントエンド", "パフォーマンス"],
		},
	},
	render: (args) => (
		<div className="max-w-md p-4">
			<FeedInfo {...args} />
		</div>
	),
};

/**
 * シンプルなコンテンツのFeedInfo
 */
export const Simple: Story = {
	args: {
		data: {
			...basicFeedData,
			content: {
				description: "Clean Code",
			},
			hashtags: ["プログラミング"],
		},
	},
	render: (args) => (
		<div className="max-w-md p-4">
			<FeedInfo {...args} />
		</div>
	),
};

/**
 * 最小限の情報のFeedInfo
 */
export const Minimal: Story = {
	args: {
		data: {
			...basicFeedData,
			content: {},
			hashtags: [],
		},
	},
	render: (args) => (
		<div className="max-w-md p-4">
			<FeedInfo {...args} />
		</div>
	),
};