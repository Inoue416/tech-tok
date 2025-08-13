import type { Meta, StoryObj } from "@storybook/nextjs";
import { ProfileAvatar } from "./profile-avatar";

const meta: Meta<typeof ProfileAvatar> = {
	title: "features/profile/ProfileAvatar",
	component: ProfileAvatar,
	tags: ["autodocs"],
	argTypes: {
		size: {
			control: "select",
			options: ["sm", "md", "lg", "xl"],
			description: "アバターのサイズ",
		},
		alt: {
			control: "text",
			description: "画像の代替テキスト",
		},
		src: {
			control: "text",
			description: "画像のURL",
		},
	},
};

export default meta;
type Story = StoryObj<typeof ProfileAvatar>;

/**
 * 画像付きアバター（デフォルト）
 */
export const Default: Story = {
	args: {
		src: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face",
		alt: "田中太郎",
		size: "lg",
	},
};

/**
 * 画像なしアバター（イニシャル表示）
 */
export const WithoutImage: Story = {
	args: {
		alt: "田中太郎",
		size: "lg",
	},
};

/**
 * 小サイズアバター
 */
export const SmallSize: Story = {
	args: {
		src: "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=100&h=100&fit=crop&crop=face",
		alt: "佐藤花子",
		size: "sm",
	},
};

/**
 * 中サイズアバター
 */
export const MediumSize: Story = {
	args: {
		src: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face",
		alt: "山田次郎",
		size: "md",
	},
};

/**
 * 大サイズアバター
 */
export const LargeSize: Story = {
	args: {
		src: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&h=100&fit=crop&crop=face",
		alt: "鈴木一郎",
		size: "lg",
	},
};

/**
 * 特大サイズアバター
 */
export const ExtraLargeSize: Story = {
	args: {
		src: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop&crop=face",
		alt: "高橋美咲",
		size: "xl",
	},
};

/**
 * 複数サイズ比較
 */
export const SizeComparison: Story = {
	render: () => (
		<div className="flex items-center gap-4">
			<div className="text-center space-y-2">
				<ProfileAvatar
					src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face"
					alt="Small"
					size="sm"
				/>
				<p className="text-xs text-gray-600">sm</p>
			</div>
			<div className="text-center space-y-2">
				<ProfileAvatar
					src="https://images.unsplash.com/photo-1494790108755-2616b612b786?w=100&h=100&fit=crop&crop=face"
					alt="Medium"
					size="md"
				/>
				<p className="text-xs text-gray-600">md</p>
			</div>
			<div className="text-center space-y-2">
				<ProfileAvatar
					src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face"
					alt="Large"
					size="lg"
				/>
				<p className="text-xs text-gray-600">lg</p>
			</div>
			<div className="text-center space-y-2">
				<ProfileAvatar
					src="https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&h=100&fit=crop&crop=face"
					alt="Extra Large"
					size="xl"
				/>
				<p className="text-xs text-gray-600">xl</p>
			</div>
		</div>
	),
};

/**
 * イニシャル表示の比較
 */
export const InitialsComparison: Story = {
	render: () => (
		<div className="flex items-center gap-4">
			<ProfileAvatar alt="田中太郎" size="lg" />
			<ProfileAvatar alt="佐藤花子" size="lg" />
			<ProfileAvatar alt="山田次郎" size="lg" />
			<ProfileAvatar alt="鈴木美咲" size="lg" />
		</div>
	),
};

/**
 * カスタムスタイル
 */
export const CustomStyle: Story = {
	args: {
		src: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face",
		alt: "カスタムスタイル",
		size: "lg",
		className: "ring-4 ring-blue-500 ring-offset-2",
	},
};