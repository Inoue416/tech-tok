import type { Meta, StoryObj } from "@storybook/nextjs";
import { VerticalSwipeFeed } from "./VerticalSwipeFeed";

const meta: Meta<typeof VerticalSwipeFeed> = {
	title: "organisms/VerticalSwipeFeed",
	component: VerticalSwipeFeed,
	tags: ["autodocs"],
};

export default meta;

type Story = StoryObj<typeof VerticalSwipeFeed>;

export const Default: Story = {
	render: () => <VerticalSwipeFeed />,
};
