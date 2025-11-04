import type { Meta, StoryObj } from "@storybook/nextjs";
import { AppLogo } from "./app-logo";

const meta = {
	title: "UI/AppLogo",
	component: AppLogo,
	parameters: {
		layout: "centered",
	},
	tags: ["autodocs"],
	argTypes: {
		size: {
			control: "select",
			options: ["small", "medium", "large"],
		},
		showText: {
			control: "boolean",
		},
	},
} satisfies Meta<typeof AppLogo>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Small: Story = {
	args: {
		size: "small",
		showText: true,
	},
};

export const Medium: Story = {
	args: {
		size: "medium",
		showText: true,
	},
};

export const Large: Story = {
	args: {
		size: "large",
		showText: true,
	},
};

export const IconOnly: Story = {
	args: {
		size: "medium",
		showText: false,
	},
};

export const InDarkBackground: Story = {
	args: {
		size: "medium",
		showText: true,
	},
	decorators: [
		(Story) => (
			<div className="bg-black p-8 rounded-lg">
				<Story />
			</div>
		),
	],
};
