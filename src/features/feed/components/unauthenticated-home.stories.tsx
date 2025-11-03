import type { Meta, StoryObj } from "@storybook/nextjs";
import { sampleFeedData } from "../mocks/sample-data";
import { UnauthenticatedHome } from "./unauthenticated-home";

const meta: Meta<typeof UnauthenticatedHome> = {
	title: "Feed/UnauthenticatedHome",
	component: UnauthenticatedHome,
	parameters: {
		layout: "fullscreen",
	},
	argTypes: {
		articles: {
			description: "プレビュー記事の配列（最初の3つのみ使用）",
		},
	},
};

export default meta;
type Story = StoryObj<typeof UnauthenticatedHome>;

/**
 * デフォルトの未認証ホーム
 * 3記事のプレビューとログインプロンプトを表示
 */
export const Default: Story = {
	args: {
		articles: sampleFeedData,
	},
};

/**
 * 記事が少ない場合（2記事のみ）
 */
export const FewArticles: Story = {
	args: {
		articles: sampleFeedData.slice(0, 2),
	},
};

/**
 * 記事が1つのみ
 */
export const SingleArticle: Story = {
	args: {
		articles: sampleFeedData.slice(0, 1),
	},
};

/**
 * モバイルビュー
 */
export const Mobile: Story = {
	args: {
		articles: sampleFeedData,
	},
	parameters: {
		viewport: {
			defaultViewport: "mobile1",
		},
	},
};

/**
 * タブレットビュー
 */
export const Tablet: Story = {
	args: {
		articles: sampleFeedData,
	},
	parameters: {
		viewport: {
			defaultViewport: "tablet",
		},
	},
};
