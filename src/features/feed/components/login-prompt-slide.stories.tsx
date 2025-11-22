import type { Meta, StoryObj } from "@storybook/nextjs";
import { LoginPromptSlide } from "./login-prompt-slide";

const meta: Meta<typeof LoginPromptSlide> = {
	title: "Feed/LoginPromptSlide",
	component: LoginPromptSlide,
	parameters: {
		layout: "fullscreen",
	},
	argTypes: {
		callbackUrl: {
			control: "text",
			description: "ログイン後のリダイレクト先",
		},
	},
};

export default meta;
type Story = StoryObj<typeof LoginPromptSlide>;

/**
 * デフォルトのログインプロンプトスライド
 */
export const Default: Story = {
	args: {
		callbackUrl: "/feed",
	},
};

/**
 * カスタムコールバックURL
 */
export const CustomCallback: Story = {
	args: {
		callbackUrl: "/profile",
	},
};
