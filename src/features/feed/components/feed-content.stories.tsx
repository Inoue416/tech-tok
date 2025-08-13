import type { Meta, StoryObj } from "@storybook/nextjs";
import { FeedContent } from "./feed-content";
import type { FeedItemData } from "../types";

const meta: Meta<typeof FeedContent> = {
	title: "features/feed/FeedContent",
	component: FeedContent,
	tags: ["autodocs"],
	parameters: {
		layout: "fullscreen",
	},
	argTypes: {
		isActive: {
			control: "boolean",
			description: "コンテンツがアクティブかどうか",
		},
	},
};

export default meta;
type Story = StoryObj<typeof FeedContent>;

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
		avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=32&h=32&fit=crop&crop=face",
	},
	stats: {
		likes: 1200,
		comments: 85,
		shares: 43,
	},
	hashtags: ["React", "ServerComponents", "Next.js"],
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
		avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=32&h=32&fit=crop&crop=face",
	},
	stats: {
		likes: 2500,
		comments: 150,
		shares: 78,
	},
	hashtags: ["TypeScript", "JavaScript", "Tutorial"],
};

/**
 * テキストコンテンツの表示
 */
export const TextContent: Story = {
	args: {
		data: textFeedData,
		isActive: true,
	},
	render: (args) => (
		<div className="h-screen w-full">
			<FeedContent {...args} />
		</div>
	),
};

/**
 * 動画コンテンツの表示
 */
export const VideoContent: Story = {
	args: {
		data: videoFeedData,
		isActive: true,
	},
	render: (args) => (
		<div className="h-screen w-full">
			<FeedContent {...args} />
		</div>
	),
};

/**
 * 非アクティブな動画コンテンツ
 */
export const InactiveVideoContent: Story = {
	args: {
		data: videoFeedData,
		isActive: false,
	},
	render: (args) => (
		<div className="h-screen w-full">
			<FeedContent {...args} />
		</div>
	),
};

/**
 * 長いテキストコンテンツ
 */
export const LongTextContent: Story = {
	args: {
		data: {
			...textFeedData,
			content: {
				title: "フルスタック開発の現在と未来",
				text: "現代のフルスタック開発では、フロントエンドとバックエンドの境界が曖昧になっています。Next.jsのようなフレームワークにより、一つの技術スタックで完全なWebアプリケーションを構築できるようになりました。React Server Componentsの登場により、サーバーサイドレンダリングとクライアントサイドインタラクションの最適なバランスを実現できます。さらに、TypeScriptの普及により型安全性が向上し、大規模なプロジェクトでも保守性の高いコードを書けるようになりました。",
			},
		},
		isActive: true,
	},
	render: (args) => (
		<div className="h-screen w-full">
			<FeedContent {...args} />
		</div>
	),
};

/**
 * シンプルなテキストコンテンツ
 */
export const SimpleTextContent: Story = {
	args: {
		data: {
			...textFeedData,
			content: {
				title: "Clean Code",
				text: "コードは書くよりも読む時間の方が長い",
			},
		},
		isActive: true,
	},
	render: (args) => (
		<div className="h-screen w-full">
			<FeedContent {...args} />
		</div>
	),
};