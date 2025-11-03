import type { Meta, StoryObj } from "@storybook/nextjs";
import { PersistentLoginBanner } from "./persistent-login-banner";

const meta: Meta<typeof PersistentLoginBanner> = {
	title: "Feed/PersistentLoginBanner",
	component: PersistentLoginBanner,
	parameters: {
		layout: "fullscreen",
	},
	argTypes: {
		currentIndex: {
			control: { type: "number", min: 0, max: 2 },
			description: "現在の記事インデックス（0-2）",
		},
		totalPreview: {
			control: { type: "number", min: 1, max: 10 },
			description: "プレビュー記事の合計数",
		},
		callbackUrl: {
			control: "text",
			description: "ログイン後のコールバックURL",
		},
	},
};

export default meta;
type Story = StoryObj<typeof PersistentLoginBanner>;

/**
 * デフォルト状態 - 最初の記事
 */
export const Default: Story = {
	args: {
		currentIndex: 0,
		totalPreview: 3,
		callbackUrl: "/feed",
	},
	render: (args) => (
		<div className="h-screen bg-gray-950 relative">
			<div className="h-full flex items-center justify-center">
				<p className="text-white text-lg">記事コンテンツエリア</p>
			</div>
			<PersistentLoginBanner {...args} />
		</div>
	),
};

/**
 * 2番目の記事
 */
export const SecondArticle: Story = {
	args: {
		currentIndex: 1,
		totalPreview: 3,
		callbackUrl: "/feed",
	},
	render: Default.render,
};

/**
 * 最後の記事（3番目）
 */
export const LastArticle: Story = {
	args: {
		currentIndex: 2,
		totalPreview: 3,
		callbackUrl: "/feed",
	},
	render: Default.render,
};

/**
 * ログインプロンプト到達時（非表示）
 */
export const AtLoginPrompt: Story = {
	args: {
		currentIndex: 3,
		totalPreview: 3,
		callbackUrl: "/feed",
	},
	render: Default.render,
};

/**
 * モバイルビュー
 */
export const Mobile: Story = {
	args: {
		currentIndex: 0,
		totalPreview: 3,
		callbackUrl: "/feed",
	},
	parameters: {
		viewport: {
			defaultViewport: "mobile1",
		},
	},
	render: Default.render,
};

/**
 * タブレットビュー
 */
export const Tablet: Story = {
	args: {
		currentIndex: 1,
		totalPreview: 3,
		callbackUrl: "/feed",
	},
	parameters: {
		viewport: {
			defaultViewport: "tablet",
		},
	},
	render: Default.render,
};
