import type { Meta, StoryObj } from "@storybook/nextjs";
import { Textarea } from "./textarea";

const meta: Meta<typeof Textarea> = {
	title: "ui/Textarea",
	component: Textarea,
	tags: ["autodocs"],
	argTypes: {
		placeholder: {
			control: "text",
			description: "Placeholder text",
		},
		disabled: {
			control: "boolean",
			description: "Disabled state",
		},
		rows: {
			control: "number",
			description: "Number of rows",
		},
	},
};

export default meta;
type Story = StoryObj<typeof Textarea>;

/**
 * デフォルトのTextarea
 */
export const Default: Story = {
	args: {
		placeholder: "テキストを入力してください",
	},
};

/**
 * 複数行のTextarea
 */
export const MultipleRows: Story = {
	args: {
		placeholder: "複数行のテキストを入力してください",
		rows: 5,
	},
};

/**
 * 無効状態のTextarea
 */
export const Disabled: Story = {
	args: {
		placeholder: "無効なTextarea",
		disabled: true,
	},
};

/**
 * 値が設定されたTextarea
 */
export const WithValue: Story = {
	args: {
		defaultValue: "入力済みのテキスト\n複数行にわたって\n記述されています。",
		placeholder: "テキストを入力してください",
	},
};

/**
 * 長いテキストのTextarea
 */
export const LongText: Story = {
	args: {
		defaultValue:
			"これは非常に長いテキストの例です。\nユーザーが技術記事や説明を書く際に使用されることを想定しています。\n\nReactやTypeScriptについて学んだことを\nここに記述できます。\n\nコンポーネントの設計や状態管理について\n詳しく説明することも可能です。",
		rows: 8,
	},
};
