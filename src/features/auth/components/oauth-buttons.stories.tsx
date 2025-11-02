import type { Meta, StoryObj } from "@storybook/nextjs";
import { OAuthButtons } from "./oauth-buttons";

const meta: Meta<typeof OAuthButtons> = {
	title: "Auth/OAuthButtons",
	component: OAuthButtons,
	parameters: {
		layout: "centered",
	},
	argTypes: {
		callbackUrl: {
			control: "text",
			description: "ログイン後のリダイレクト先",
		},
	},
};

export default meta;
type Story = StoryObj<typeof OAuthButtons>;

/**
 * デフォルトのOAuthボタン
 */
export const Default: Story = {
	args: {
		callbackUrl: "/feed",
	},
};
