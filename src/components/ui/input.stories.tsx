import type { Meta, StoryObj } from "@storybook/nextjs";
import { Input } from "./input";

const meta: Meta<typeof Input> = {
	title: "ui/Input",
	component: Input,
	tags: ["autodocs"],
	argTypes: {
		type: {
			control: "select",
			options: ["text", "email", "password", "number", "search"],
			description: "Input type",
		},
		placeholder: {
			control: "text",
			description: "Placeholder text",
		},
		disabled: {
			control: "boolean",
			description: "Disabled state",
		},
	},
};

export default meta;
type Story = StoryObj<typeof Input>;

/**
 * デフォルトのInput
 */
export const Default: Story = {
	args: {
		placeholder: "テキストを入力してください",
	},
};

/**
 * Email type
 */
export const Email: Story = {
	args: {
		type: "email",
		placeholder: "example@email.com",
	},
};

/**
 * Password type
 */
export const Password: Story = {
	args: {
		type: "password",
		placeholder: "パスワードを入力",
	},
};

/**
 * 無効状態のInput
 */
export const Disabled: Story = {
	args: {
		placeholder: "無効なInput",
		disabled: true,
	},
};

/**
 * 値が設定されたInput
 */
export const WithValue: Story = {
	args: {
		defaultValue: "入力済みのテキスト",
		placeholder: "テキストを入力してください",
	},
};
