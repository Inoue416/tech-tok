import type { Meta, StoryObj } from "@storybook/nextjs";
import { Button } from "./button";

const meta: Meta<typeof Button> = {
	title: "ui/Button",
	component: Button,
	tags: ["autodocs"],
};
export default meta;

type Story = StoryObj<typeof Button>;

export const Default: Story = {
	args: {
		children: "デフォルトボタン",
	},
};

export const Outline: Story = {
	args: {
		variant: "outline",
		children: "アウトラインボタン",
	},
};

export const Disabled: Story = {
	args: {
		children: "無効ボタン",
		disabled: true,
	},
};
