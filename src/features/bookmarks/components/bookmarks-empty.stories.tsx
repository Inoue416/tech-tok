import type { Meta, StoryObj } from "@storybook/nextjs";
import { BookmarksEmpty } from "./bookmarks-empty";

const meta: Meta<typeof BookmarksEmpty> = {
	title: "features/Bookmarks/BookmarksEmpty",
	component: BookmarksEmpty,
	tags: ["autodocs"],
	parameters: {
		layout: "fullscreen",
	},
};
export default meta;

type Story = StoryObj<typeof BookmarksEmpty>;

export const Default: Story = {};
