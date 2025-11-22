import type { Meta, StoryObj } from "@storybook/nextjs";
import { VerticalScrollFeed } from "./vertical-scroll-feed";
import type { FeedItemData } from "../types";

const meta: Meta<typeof VerticalScrollFeed> = {
	title: "features/feed/VerticalScrollFeed",
	component: VerticalScrollFeed,
	tags: ["autodocs"],
	parameters: {
		layout: "fullscreen",
	},
	argTypes: {
		autoPlay: {
			control: "boolean",
			description: "自動再生機能の有効/無効",
		},
		onItemChange: {
			action: "item-changed",
			description: "アイテム変更時のコールバック",
		},
	},
};

export default meta;
type Story = StoryObj<typeof VerticalScrollFeed>;

// モックデータ
const mockFeedItems: FeedItemData[] = [
	{
		id: "feed-1",
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
	},
	{
		id: "feed-2",
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
	},
	{
		id: "feed-3",
		type: "text",
		content: {
			title: "Clean Code の原則",
			text: "コードは書くよりも読む時間の方が長い。だからこそ、読みやすく保守しやすいコードを書くことが重要です。",
			description: "保守しやすいコードを書くためのベストプラクティス",
		},
		author: {
			id: "author-3",
			name: "Software Engineer",
			avatar:
				"https://images.unsplash.com/photo-1494790108755-2616b612b786?w=32&h=32&fit=crop&crop=face",
		},
		stats: {
			likes: 890,
			comments: 62,
			shares: 29,
		},
		hashtags: ["CleanCode", "プログラミング", "ベストプラクティス"],
	},
	{
		id: "feed-4",
		type: "text",
		content: {
			title: "WebAssemblyの未来",
			text: "WebAssemblyはWeb開発の新たな可能性を開きます。高性能なアプリケーションをブラウザ上で実行できる革新的な技術です。",
			description: "WebAssemblyがもたらす変革について",
		},
		author: {
			id: "author-4",
			name: "WASM Expert",
			avatar:
				"https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=32&h=32&fit=crop&crop=face",
		},
		stats: {
			likes: 1580,
			comments: 94,
			shares: 67,
		},
		hashtags: ["WebAssembly", "パフォーマンス", "Web技術"],
	},
	{
		id: "feed-5",
		type: "text",
		content: {
			title: "GraphQLとREST API",
			text: "GraphQLは柔軟なデータ取得を可能にしますが、REST APIにも依然として多くの利点があります。適切な場面で適切な技術を選択することが重要です。",
			description: "API設計における技術選択について",
		},
		author: {
			id: "author-5",
			name: "API Architect",
			avatar:
				"https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=32&h=32&fit=crop&crop=face",
		},
		stats: {
			likes: 2100,
			comments: 128,
			shares: 85,
		},
		hashtags: ["GraphQL", "REST", "API設計"],
	},
];

/**
 * デフォルトの縦スクロールフィード
 */
export const Default: Story = {
	args: {
		items: mockFeedItems,
		autoPlay: false,
	},
};

/**
 * 自動再生機能付きの縦スクロールフィード
 */
export const AutoPlay: Story = {
	args: {
		items: mockFeedItems,
		autoPlay: true,
	},
};

/**
 * 少数のアイテムの縦スクロールフィード
 */
export const FewItems: Story = {
	args: {
		items: mockFeedItems.slice(0, 2),
		autoPlay: false,
	},
};

/**
 * 単一アイテムの縦スクロールフィード
 */
export const SingleItem: Story = {
	args: {
		items: mockFeedItems.slice(0, 1),
		autoPlay: false,
	},
};

/**
 * コンテンツなしの縦スクロールフィード
 */
export const EmptyFeed: Story = {
	args: {
		items: [],
		autoPlay: false,
	},
};

/**
 * 動画メインの縦スクロールフィード
 */
export const VideoHeavy: Story = {
	args: {
		items: [
			mockFeedItems[1], // video
			{
				...mockFeedItems[1],
				id: "video-2",
				content: {
					url: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4",
					description: "JavaScript非同期処理の解説",
				},
				author: {
					id: "author-6",
					name: "JS Guru",
					avatar:
						"https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=32&h=32&fit=crop&crop=face",
				},
				hashtags: ["JavaScript", "非同期処理", "Promise"],
			},
			mockFeedItems[0], // text
		],
		autoPlay: false,
	},
};

/**
 * コールバック付きの縦スクロールフィード
 */
export const WithCallback: Story = {
	args: {
		items: mockFeedItems,
		autoPlay: false,
		onItemChange: (index) => {
			console.log(`Current item index: ${index}`);
		},
	},
};

/**
 * カスタムスタイルの縦スクロールフィード
 */
export const CustomStyle: Story = {
	args: {
		items: mockFeedItems,
		autoPlay: false,
		className: "border-4 border-red-500",
	},
};
