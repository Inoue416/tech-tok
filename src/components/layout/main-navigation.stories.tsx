import type { Meta, StoryObj } from "@storybook/nextjs";
import { MainNavigation } from "./main-navigation";

const meta = {
	title: "Layout/MainNavigation",
	component: MainNavigation,
	parameters: {
		layout: "fullscreen",
		nextjs: {
			appDirectory: true,
		},
	},
	decorators: [
		(Story) => (
			<div className="min-h-screen bg-background">
				<Story />
				<div className="p-4 pb-24 md:ml-64 md:pb-4">
					<h1 className="text-2xl font-bold mb-4">
						レスポンシブナビゲーション
					</h1>
					<div className="space-y-4">
						<div>
							<h2 className="text-lg font-semibold mb-2">
								モバイル（&lt; 768px）
							</h2>
							<p className="text-muted-foreground">
								画面下部にボトムナビゲーションが表示されます。
							</p>
						</div>
						<div>
							<h2 className="text-lg font-semibold mb-2">
								デスクトップ（≥ 768px）
							</h2>
							<p className="text-muted-foreground">
								左サイドバーにナビゲーションが表示されます。
							</p>
						</div>
					</div>
				</div>
			</div>
		),
	],
	tags: ["autodocs"],
} satisfies Meta<typeof MainNavigation>;

export default meta;
type Story = StoryObj<typeof meta>;

export const FeedActive: Story = {
	parameters: {
		nextjs: {
			navigation: {
				pathname: "/feed",
			},
		},
	},
};

export const BookmarksActive: Story = {
	parameters: {
		nextjs: {
			navigation: {
				pathname: "/bookmarks",
			},
		},
	},
};

export const ProfileActive: Story = {
	parameters: {
		nextjs: {
			navigation: {
				pathname: "/profile",
			},
		},
	},
};

export const MobileView: Story = {
	parameters: {
		viewport: {
			defaultViewport: "mobile1",
		},
		nextjs: {
			navigation: {
				pathname: "/feed",
			},
		},
	},
};

export const DesktopView: Story = {
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
};
