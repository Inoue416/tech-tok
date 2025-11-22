import type { Meta, StoryObj } from "@storybook/nextjs";
import { AccountActions } from "./account-actions";

const meta: Meta<typeof AccountActions> = {
	title: "Features/Profile/AccountActions",
	component: AccountActions,
	parameters: {
		layout: "centered",
	},
	tags: ["autodocs"],
	decorators: [
		(Story) => (
			<div className="w-[400px]">
				<Story />
			</div>
		),
	],
};

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * デフォルト状態
 * ログアウトと退会ボタンが表示されます
 */
export const Default: Story = {
	args: {
		onLogout: () => console.log("Logout clicked"),
		onDeleteAccount: () => console.log("Delete account clicked"),
	},
};

/**
 * ホバー状態の確認
 * ボタンにマウスを乗せた時の視覚的フィードバックを確認できます
 */
export const Interactive: Story = {
	args: {
		onLogout: () => {
			console.log("Logout clicked");
			alert("ログアウトが実行されました");
		},
		onDeleteAccount: () => {
			console.log("Delete account clicked");
			alert("アカウント削除の確認ダイアログが表示されます");
		},
	},
};
