import type { Meta, StoryObj } from "@storybook/nextjs";
import { PreviewErrorState } from "./preview-error-state";

const meta = {
	title: "Features/Feed/PreviewErrorState",
	component: PreviewErrorState,
	parameters: {
		layout: "fullscreen",
	},
	tags: ["autodocs"],
} satisfies Meta<typeof PreviewErrorState>;

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * デフォルトのエラー状態
 */
export const Default: Story = {
	args: {
		message: "記事の読み込みに失敗しました",
		onRetry: () => console.log("Retry clicked"),
		showLoginPrompt: true,
	},
};

/**
 * カスタムエラーメッセージ
 */
export const CustomMessage: Story = {
	args: {
		message: "ネットワーク接続を確認してください",
		onRetry: () => console.log("Retry clicked"),
		showLoginPrompt: true,
	},
};

/**
 * リトライボタンなし
 */
export const NoRetry: Story = {
	args: {
		message: "記事の読み込みに失敗しました",
		onRetry: undefined,
		showLoginPrompt: true,
	},
};

/**
 * ログインプロンプトなし
 */
export const NoLoginPrompt: Story = {
	args: {
		message: "記事の読み込みに失敗しました",
		onRetry: () => console.log("Retry clicked"),
		showLoginPrompt: false,
	},
};

/**
 * 記事が見つからない場合
 */
export const NoArticles: Story = {
	args: {
		message: "現在表示できる記事がありません",
		onRetry: () => console.log("Retry clicked"),
		showLoginPrompt: true,
	},
};

/**
 * データベース接続エラー
 */
export const DatabaseError: Story = {
	args: {
		message:
			"データベースへの接続に失敗しました。しばらくしてから再度お試しください。",
		onRetry: () => console.log("Retry clicked"),
		showLoginPrompt: true,
	},
};
