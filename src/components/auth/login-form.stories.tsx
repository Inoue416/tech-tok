import type { Meta, StoryObj } from "@storybook/nextjs";
import { LoginForm } from "./login-form";

type OAuthProvider = "github" | "google";

const meta: Meta<typeof LoginForm> = {
	title: "Auth/LoginForm",
	component: LoginForm,
	parameters: {
		layout: "fullscreen",
	},
	argTypes: {
		isLoading: {
			control: "boolean",
			description: "ログイン処理中の状態",
		},
		error: {
			control: "text",
			description: "エラーメッセージ",
		},
		onOAuthLogin: {
			action: "oauth-login",
			description: "OAuthログインのコールバック関数",
		},
	},
};

export default meta;
type Story = StoryObj<typeof LoginForm>;

/**
 * デフォルトのログインフォーム
 */
export const Default: Story = {
	args: {
		isLoading: false,
		onOAuthLogin: (provider) => {
			console.log(`OAuth login with ${provider}`);
		},
	},
};

/**
 * ローディング状態のログインフォーム
 */
export const Loading: Story = {
	args: {
		isLoading: true,
		onOAuthLogin: (provider) => {
			console.log(`OAuth login with ${provider}`);
		},
	},
};

/**
 * エラー状態のログインフォーム
 */
export const WithError: Story = {
	args: {
		isLoading: false,
		error: "ログインに失敗しました。もう一度お試しください。",
		onOAuthLogin: (provider) => {
			console.log(`OAuth login with ${provider}`);
		},
	},
};
