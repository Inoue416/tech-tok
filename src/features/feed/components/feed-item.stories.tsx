import type { Meta, StoryObj } from "@storybook/nextjs";
import { FeedItem } from "./feed-item";
import type { FeedItemData } from "../types";

const meta: Meta<typeof FeedItem> = {
	title: "features/feed/FeedItem",
	component: FeedItem,
	tags: ["autodocs"],
	parameters: {
		layout: "fullscreen",
	},
	argTypes: {
		isActive: {
			control: "boolean",
			description: "フィードアイテムがアクティブかどうか",
		},
		onNext: {
			action: "next",
			description: "次のアイテムに移動",
		},
		onPrevious: {
			action: "previous",
			description: "前のアイテムに移動",
		},
		onLike: {
			action: "like",
			description: "いいねボタンクリック",
		},
		onStock: {
			action: "stock",
			description: "ストックボタンクリック",
		},
		onShare: {
			action: "share",
			description: "シェアボタンクリック",
		},
	},
};

export default meta;
type Story = StoryObj<typeof FeedItem>;

// モックデータ
const textFeedData: FeedItemData = {
	id: "text-1",
	type: "text",
	content: {
		title: "React Server Components入門",
		text: "React Server Componentsは新しいパラダイムです。サーバーサイドでコンポーネントをレンダリングすることで、パフォーマンスとユーザー体験を向上させることができます。",
		description: "RSCの基本概念について学ぼう",
	},
	author: {
		id: "author-1",
		name: "Tech Writer",
		avatar:
			"https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=32&h=32&fit=crop&crop=face",
	},
	stats: {
		likes: 1200,
		comments: 85,
		shares: 43,
	},
	hashtags: ["React", "ServerComponents", "Next.js"],
	isLiked: false,
};

const videoFeedData: FeedItemData = {
	id: "video-1",
	type: "video",
	content: {
		url: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4",
		description: "TypeScript基本文法の解説動画",
	},
	author: {
		id: "author-2",
		name: "Code Instructor",
		avatar:
			"https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=32&h=32&fit=crop&crop=face",
	},
	stats: {
		likes: 2500,
		comments: 150,
		shares: 78,
	},
	hashtags: ["TypeScript", "JavaScript", "Tutorial"],
	isLiked: true,
};

/**
 * テキストタイプのFeedItem
 */
export const TextFeedItem: Story = {
	args: {
		data: textFeedData,
		isActive: true,
	},
	render: (args) => (
		<div className="h-screen w-full">
			<FeedItem {...args} />
		</div>
	),
};

/**
 * 動画タイプのFeedItem
 */
export const VideoFeedItem: Story = {
	args: {
		data: videoFeedData,
		isActive: true,
	},
	render: (args) => (
		<div className="h-screen w-full">
			<FeedItem {...args} />
		</div>
	),
};

/**
 * 非アクティブなFeedItem
 */
export const InactiveFeedItem: Story = {
	args: {
		data: textFeedData,
		isActive: false,
	},
	render: (args) => (
		<div className="h-screen w-full">
			<FeedItem {...args} />
		</div>
	),
};

/**
 * 高いいいね数のFeedItem
 */
export const HighLikesFeedItem: Story = {
	args: {
		data: {
			...textFeedData,
			stats: {
				...textFeedData.stats,
				likes: 125000,
			},
		},
		isActive: true,
	},
	render: (args) => (
		<div className="h-screen w-full">
			<FeedItem {...args} />
		</div>
	),
};

/**
 * 長いコンテンツのFeedItem
 */
export const LongContentFeedItem: Story = {
	args: {
		data: {
			...textFeedData,
			content: {
				title: "フルスタック開発の完全ガイド",
				text: "現代のWeb開発では、フロントエンドとバックエンドの境界が曖昧になっています。Next.jsやRemix、SvelteKitなどのフルスタックフレームワークの登場により、開発者は一つの技術スタックで完全なWebアプリケーションを構築できるようになりました。",
				description:
					"フルスタック開発に必要な技術スタックとベストプラクティスについて詳しく解説します。React、TypeScript、Node.js、データベース設計まで幅広くカバーしています。",
			},
			hashtags: [
				"フルスタック",
				"React",
				"TypeScript",
				"Next.js",
				"Node.js",
				"データベース",
				"Web開発",
			],
		},
		isActive: true,
	},
	render: (args) => (
		<div className="h-screen w-full">
			<FeedItem {...args} />
		</div>
	),
};

/**
 * ハッシュタグなしのFeedItem
 */
export const NoHashtagsFeedItem: Story = {
	args: {
		data: {
			...textFeedData,
			hashtags: undefined,
		},
		isActive: true,
	},
	render: (args) => (
		<div className="h-screen w-full">
			<FeedItem {...args} />
		</div>
	),
};

/**
 * アクション付きFeedItem
 */
export const InteractiveFeedItem: Story = {
	args: {
		data: textFeedData,
		isActive: true,
		onNext: () => alert("次のアイテムへ"),
		onPrevious: () => alert("前のアイテムへ"),
		onLike: (id) => alert(`いいね: ${id}`),
		onStock: (id) => alert(`ストック: ${id}`),
		onShare: (id) => alert(`シェア: ${id}`),
	},
	render: (args) => (
		<div className="h-screen w-full">
			<FeedItem {...args} />
		</div>
	),
};
