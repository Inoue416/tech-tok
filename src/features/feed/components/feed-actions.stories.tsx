import type { Meta, StoryObj } from "@storybook/nextjs";
import { FeedActions } from "./feed-actions";
import type { FeedItemData } from "../types";

const meta: Meta<typeof FeedActions> = {
	title: "features/feed/FeedActions",
	component: FeedActions,
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
	argTypes: {
		onLike: {
			action: "liked",
			description: "いいねボタンクリック時のコールバック",
		},
		onStock: {
			action: "stocked",
			description: "ストックボタンクリック時のコールバック",
		},
		onShare: {
			action: "shared",
			description: "シェアボタンクリック時のコールバック",
		},
		onNext: {
			action: "next",
			description: "次へボタンクリック時のコールバック",
		},
	},
};

export default meta;
type Story = StoryObj<typeof FeedActions>;

// モックデータ
const feedData: FeedItemData = {
	id: "feed-1",
	type: "text",
	content: {
		title: "React Hooks入門",
		description: "React Hooksの基本的な使い方について",
	},
	author: {
		id: "author-1",
		name: "Developer",
	},
	stats: {
		likes: 1234,
		comments: 89,
		shares: 45,
	},
	isLiked: false,
};

/**
 * デフォルトのFeedActions
 */
export const Default: Story = {
	args: {
		data: feedData,
	},
};

/**
 * 高いいいね数のFeedActions
 */
export const HighLikes: Story = {
	args: {
		data: {
			...feedData,
			stats: {
				...feedData.stats,
				likes: 15000,
			},
		},
	},
};

/**
 * 非常に高いいいね数のFeedActions
 */
export const VeryHighLikes: Story = {
	args: {
		data: {
			...feedData,
			stats: {
				...feedData.stats,
				likes: 2500000,
			},
		},
	},
};

/**
 * いいね済みのFeedActions
 */
export const Liked: Story = {
	args: {
		data: {
			...feedData,
			isLiked: true,
		},
	},
};

/**
 * 少ないいいね数のFeedActions
 */
export const LowLikes: Story = {
	args: {
		data: {
			...feedData,
			stats: {
				...feedData.stats,
				likes: 5,
			},
		},
	},
};

/**
 * コールバック付きFeedActions
 */
export const WithCallbacks: Story = {
	args: {
		data: feedData,
		onLike: (id) => alert(`いいね: ${id}`),
		onStock: (id) => alert(`ストック: ${id}`),
		onShare: (id) => alert(`シェア: ${id}`),
		onNext: () => alert("次へ"),
	},
	render: (args) => (
		<div className="p-8">
			<p className="mb-4 text-white">各ボタンをクリックしてアクションを確認</p>
			<FeedActions {...args} />
		</div>
	),
};
