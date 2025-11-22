import type { Meta, StoryObj } from "@storybook/nextjs";
import { BottomNavigation } from "./bottom-navigation";

const meta = {
	title: "Layout/BottomNavigation",
	component: BottomNavigation,
	parameters: {
		layout: "fullscreen",
		nextjs: {
			appDirectory: true,
		},
		viewport: {
			defaultViewport: "mobile1",
		},
	},
	decorators: [
		(Story) => (
			<div className="min-h-screen bg-background">
				<div className="p-4 pb-20">
					<h1 className="text-2xl font-bold mb-4">コンテンツエリア</h1>
					<p className="text-muted-foreground">
						ボトムナビゲーションは画面下部に固定表示されます。
					</p>
				</div>
				<Story />
			</div>
		),
	],
	tags: ["autodocs"],
} satisfies Meta<typeof BottomNavigation>;

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

export const DesktopView: Story = {
	args: {
		isAuthenticated: true,
	},
	parameters: {
		viewport: {
			defaultViewport: "desktop",
		},
		nextjs: {
			navigation: {
				pathname: "/feed",
			},
		},
	},
	decorators: [
		(Story) => (
			<div className="min-h-screen bg-background">
				<div className="p-4">
					<h1 className="text-2xl font-bold mb-4">デスクトップビュー</h1>
					<p className="text-muted-foreground">
						デスクトップサイズではボトムナビゲーションは非表示になります（md:hidden）。
					</p>
				</div>
				<Story />
			</div>
		),
	],
};
