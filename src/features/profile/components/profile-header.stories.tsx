import type { Meta, StoryObj } from "@storybook/nextjs";
import { ProfileHeader } from "./profile-header";

const meta: Meta<typeof ProfileHeader> = {
	title: "Features/Profile/ProfileHeader",
	component: ProfileHeader,
	parameters: {
		layout: "centered",
	},
	tags: ["autodocs"],
	decorators: [
		(Story) => (
			<div className="w-[600px]">
				<Story />
			</div>
		),
	],
};

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * デフォルトアイコンの状態
 * ユーザーがカスタムアイコンを設定していない場合、
 * ユーザー名の最初の文字を使用したデフォルトアイコンが表示されます
 */
export const DefaultIcon: Story = {
	args: {
		user: {
			id: "1",
			username: "techuser",
			displayName: "Tech User",
			image: null,
		},
	},
};

/**
 * カスタムアイコンの状態
 * ユーザーがプロフィールアイコンを設定している場合の表示
 */
export const CustomIcon: Story = {
	args: {
		user: {
			id: "2",
			username: "johndoe",
			displayName: "John Doe",
			image: "https://api.dicebear.com/7.x/avataaars/svg?seed=johndoe",
		},
	},
};

/**
 * ユーザー名のみの状態
 * displayNameが設定されていない場合、ユーザー名のみが表示されます
 */
export const UsernameOnly: Story = {
	args: {
		user: {
			id: "3",
			username: "developer",
			displayName: null,
			image: "https://api.dicebear.com/7.x/avataaars/svg?seed=developer",
		},
	},
};

/**
 * ユーザー名未設定の状態
 * ユーザー名が設定されていない場合、プレースホルダーテキストが表示されます
 */
export const NoUsername: Story = {
	args: {
		user: {
			id: "4",
			username: null,
			displayName: "New User",
			image: null,
		},
	},
};

/**
 * 長いユーザー名の状態
 * 長いユーザー名とdisplayNameが適切に切り詰められることを確認
 */
export const LongUsername: Story = {
	args: {
		user: {
			id: "5",
			username: "verylongusernamethatmightoverflow",
			displayName: "Very Long Display Name That Might Overflow The Container",
			image: "https://api.dicebear.com/7.x/avataaars/svg?seed=longname",
		},
	},
};
