import type { Meta, StoryObj } from "@storybook/nextjs";
import { SidebarNavigation } from "./sidebar-navigation";

const meta = {
	title: "Layout/SidebarNavigation",
	component: SidebarNavigation,
	parameters: {
		layout: "fullscreen",
		nextjs: {
			appDirectory: true,
		},
		viewport: {
			defaultViewport: "desktop",
		},
	},
	decorators: [
		(Story) => (
			<div className="min-h-screen bg-background">
				<Story />
				<div className="ml-64 p-8">
					<h1 className="text-2xl font-bold mb-4">デスクトップビュー</h1>
					<p className="text-muted-foreground">
						デスクトップサイズでは左サイドバーにナビゲーションが表示されます。
					</p>
				</div>
			</div>
		),
	],
	tags: ["autodocs"],
} satisfies Meta<typeof SidebarNavigation>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Authenticated: Story = {
	args: {
		isAuthenticated: true,
	},
	parameters: {
		nextjs: {
			navigation: {
				pathname: "/feed",
			},
		},
	},
};

export const Unauthenticated: Story = {
	args: {
		isAuthenticated: false,
	},
	parameters: {
		nextjs: {
			navigation: {
				pathname: "/",
			},
		},
	},
};

export const FeedActive: Story = {
	args: {
		isAuthenticated: true,
	},
	parameters: {
		nextjs: {
			navigation: {
				pathname: "/feed",
			},
		},
	},
};

export const BookmarksActive: Story = {
	args: {
		isAuthenticated: true,
	},
	parameters: {
		nextjs: {
			navigation: {
				pathname: "/bookmarks",
			},
		},
	},
};

export const ProfileActive: Story = {
	args: {
		isAuthenticated: true,
	},
	parameters: {
		nextjs: {
			navigation: {
				pathname: "/profile",
			},
		},
	},
};

export const HomeActive: Story = {
	args: {
		isAuthenticated: true,
	},
	parameters: {
		nextjs: {
			navigation: {
				pathname: "/",
			},
		},
	},
};
