import type { Meta, StoryObj } from "@storybook/nextjs";
import { LoginForm } from "@/features/auth/components/login-form";

const meta: Meta<typeof LoginForm> = {
	title: "Auth/LoginForm",
	component: LoginForm,
	parameters: {
		layout: "fullscreen",
	},
	argTypes: {
		callbackUrl: {
			control: "text",
			description: "ログイン後のリダイレクト先",
		},
		error: {
			control: "text",
			description: "エラーメッセージ",
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
		callbackUrl: "/feed",
	},
};

/**
 * エラー状態のログインフォーム
 */
export const WithError: Story = {
	args: {
		callbackUrl: "/feed",
		error: "ログインに失敗しました。もう一度お試しください。",
	},
};
