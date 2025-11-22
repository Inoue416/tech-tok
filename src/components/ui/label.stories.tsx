import type { Meta, StoryObj } from "@storybook/nextjs";
import { Label } from "./label";

const meta: Meta<typeof Label> = {
	title: "ui/Label",
	component: Label,
	tags: ["autodocs"],
	argTypes: {
		children: {
			control: "text",
			description: "Label text",
		},
	},
};

export default meta;
type Story = StoryObj<typeof Label>;

/**
 * デフォルトのLabel
 */
export const Default: Story = {
	args: {
		children: "ラベルテキスト",
	},
};

/**
 * フォームラベル
 */
export const FormLabel: Story = {
	args: {
		children: "メールアドレス",
		htmlFor: "email",
	},
	render: (args) => (
		<div className="space-y-2">
			<Label {...args} />
			<input
				id="email"
				type="email"
				placeholder="example@email.com"
				className="border border-gray-300 rounded px-3 py-2 w-full"
			/>
		</div>
	),
};

/**
 * 必須項目のLabel
 */
export const Required: Story = {
	args: {
		children: "ユーザー名（必須）",
		htmlFor: "username",
	},
	render: (args) => (
		<div className="space-y-2">
			<Label {...args} />
			<span className="text-red-500 ml-1">*</span>
			<input
				id="username"
				type="text"
				placeholder="ユーザー名を入力"
				className="border border-gray-300 rounded px-3 py-2 w-full"
			/>
		</div>
	),
};

/**
 * 長いラベルテキスト
 */
export const LongText: Story = {
	args: {
		children:
			"このラベルは非常に長いテキストを含んでいる例です。フォームの項目説明として使用されます。",
	},
};
