import type { Meta, StoryObj } from "@storybook/nextjs";
import { Bell, Bookmark, Home, Search, User } from "lucide-react";
import { NavigationItem } from "./navigation-item";

const meta = {
	title: "Layout/NavigationItem",
	component: NavigationItem,
	parameters: {
		layout: "centered",
	},
	tags: ["autodocs"],
	argTypes: {
		href: {
			control: "text",
			description: "The destination URL for the navigation item",
		},
		label: {
			control: "text",
			description: "The text label displayed below the icon",
		},
		isActive: {
			control: "boolean",
			description: "Whether this navigation item is currently active",
		},
		icon: {
			control: false,
			description: "The Lucide icon component to display",
		},
	},
} satisfies Meta<typeof NavigationItem>;

export default meta;
type Story = StoryObj<typeof meta>;

export const FeedActive: Story = {
	args: {
		href: "/feed",
		icon: Home,
		label: "フィード",
		isActive: true,
	},
};

export const FeedInactive: Story = {
	args: {
		href: "/feed",
		icon: Home,
		label: "フィード",
		isActive: false,
	},
};

export const BookmarkActive: Story = {
	args: {
		href: "/bookmarks",
		icon: Bookmark,
		label: "ブックマーク",
		isActive: true,
	},
};

export const BookmarkInactive: Story = {
	args: {
		href: "/bookmarks",
		icon: Bookmark,
		label: "ブックマーク",
		isActive: false,
	},
};

export const ProfileActive: Story = {
	args: {
		href: "/profile",
		icon: User,
		label: "プロフィール",
		isActive: true,
	},
};

export const ProfileInactive: Story = {
	args: {
		href: "/profile",
		icon: User,
		label: "プロフィール",
		isActive: false,
	},
};

export const SearchActive: Story = {
	args: {
		href: "/search",
		icon: Search,
		label: "検索",
		isActive: true,
	},
};

export const NotificationWithBadge: Story = {
	args: {
		href: "/notifications",
		icon: Bell,
		label: "通知",
		isActive: false,
	},
};

export const AllStates: Story = {
	args: {
		href: "/feed",
		icon: Home,
		label: "フィード",
		isActive: true,
	},
	render: () => (
		<div className="flex gap-4 p-4 bg-background border rounded-lg">
			<NavigationItem
				href="/feed"
				icon={Home}
				label="フィード"
				isActive={true}
			/>
			<NavigationItem
				href="/bookmarks"
				icon={Bookmark}
				label="ブックマーク"
				isActive={false}
			/>
			<NavigationItem
				href="/profile"
				icon={User}
				label="プロフィール"
				isActive={false}
			/>
		</div>
	),
};
