import type { Meta, StoryObj } from "@storybook/nextjs";
import { ProfileStats } from "./profile-stats";

const meta: Meta<typeof ProfileStats> = {
	title: "features/profile/ProfileStats",
	component: ProfileStats,
	tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<typeof ProfileStats>;

/**
 * デフォルトの統計情報
 */
export const Default: Story = {
	args: {
		stats: {
			followers: 1234,
			following: 567,
			likedPosts: 89,
			bookmarkedPosts: 45,
		},
	},
};

/**
 * 高い数値の統計情報
 */
export const HighNumbers: Story = {
	args: {
		stats: {
			followers: 125000,
			following: 2300,
			likedPosts: 5600,
			bookmarkedPosts: 1800,
		},
	},
};

/**
 * 非常に高い数値の統計情報
 */
export const VeryHighNumbers: Story = {
	args: {
		stats: {
			followers: 2500000,
			following: 12000,
			likedPosts: 350000,
			bookmarkedPosts: 89000,
		},
	},
};

/**
 * 低い数値の統計情報
 */
export const LowNumbers: Story = {
	args: {
		stats: {
			followers: 5,
			following: 12,
			likedPosts: 3,
			bookmarkedPosts: 8,
		},
	},
};

/**
 * ゼロの統計情報
 */
export const ZeroStats: Story = {
	args: {
		stats: {
			followers: 0,
			following: 0,
			likedPosts: 0,
			bookmarkedPosts: 0,
		},
	},
};

/**
 * 数値フォーマットの比較
 */
export const FormatComparison: Story = {
	render: () => (
		<div className="space-y-8">
			<div className="text-center">
				<h3 className="text-lg font-semibold mb-4">通常の数値</h3>
				<ProfileStats
					stats={{
						followers: 1234,
						following: 567,
						likedPosts: 89,
						bookmarkedPosts: 45,
					}}
				/>
			</div>

			<div className="text-center">
				<h3 className="text-lg font-semibold mb-4">K表示</h3>
				<ProfileStats
					stats={{
						followers: 15600,
						following: 2300,
						likedPosts: 5600,
						bookmarkedPosts: 1800,
					}}
				/>
			</div>

			<div className="text-center">
				<h3 className="text-lg font-semibold mb-4">M表示</h3>
				<ProfileStats
					stats={{
						followers: 2500000,
						following: 12000,
						likedPosts: 350000,
						bookmarkedPosts: 89000,
					}}
				/>
			</div>
		</div>
	),
};

/**
 * アクティブユーザーの例
 */
export const ActiveUser: Story = {
	args: {
		stats: {
			followers: 8500,
			following: 1200,
			likedPosts: 2300,
			bookmarkedPosts: 890,
		},
	},
};

/**
 * インフルエンサーレベルの例
 */
export const InfluencerLevel: Story = {
	args: {
		stats: {
			followers: 150000,
			following: 500,
			likedPosts: 12000,
			bookmarkedPosts: 3400,
		},
	},
};
