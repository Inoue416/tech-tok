import type { Meta, StoryObj } from "@storybook/nextjs";
import { Separator } from "./separator";

const meta: Meta<typeof Separator> = {
	title: "ui/Separator",
	component: Separator,
	tags: ["autodocs"],
	argTypes: {
		orientation: {
			control: "select",
			options: ["horizontal", "vertical"],
			description: "Separator orientation",
		},
		decorative: {
			control: "boolean",
			description: "Whether the separator is decorative",
		},
	},
};

export default meta;
type Story = StoryObj<typeof Separator>;

/**
 * 水平のSeparator
 */
export const Horizontal: Story = {
	args: {
		orientation: "horizontal",
	},
	render: (args) => (
		<div className="w-full max-w-md mx-auto space-y-4">
			<p>上のコンテンツ</p>
			<Separator {...args} />
			<p>下のコンテンツ</p>
		</div>
	),
};

/**
 * 垂直のSeparator
 */
export const Vertical: Story = {
	args: {
		orientation: "vertical",
	},
	render: (args) => (
		<div className="flex items-center space-x-4 h-16">
			<p>左のコンテンツ</p>
			<Separator {...args} />
			<p>右のコンテンツ</p>
		</div>
	),
};

/**
 * コンテンツ区切りの例
 */
export const ContentDivider: Story = {
	render: () => (
		<div className="max-w-md mx-auto space-y-4">
			<div>
				<h3 className="text-lg font-semibold">セクション1</h3>
				<p className="text-gray-600">最初のセクションの内容です。</p>
			</div>
			<Separator />
			<div>
				<h3 className="text-lg font-semibold">セクション2</h3>
				<p className="text-gray-600">二番目のセクションの内容です。</p>
			</div>
			<Separator />
			<div>
				<h3 className="text-lg font-semibold">セクション3</h3>
				<p className="text-gray-600">三番目のセクションの内容です。</p>
			</div>
		</div>
	),
};