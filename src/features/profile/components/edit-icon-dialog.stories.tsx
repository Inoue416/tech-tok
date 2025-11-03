import type { Meta, StoryObj } from "@storybook/nextjs";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { EditIconDialog } from "./edit-icon-dialog";

const meta: Meta<typeof EditIconDialog> = {
	title: "Features/Profile/EditIconDialog",
	component: EditIconDialog,
	parameters: {
		layout: "centered",
	},
	tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * ダイアログが開いた状態
 * ユーザーがアイコン編集ボタンをクリックした後の状態を表示します
 */
export const Open: Story = {
	args: {
		open: true,
		onOpenChange: () => {},
		currentIcon: "https://api.dicebear.com/7.x/avataaars/svg?seed=Felix",
		onSave: async (iconUrl: string) => {
			console.log("Saving icon:", iconUrl);
			await new Promise((resolve) => setTimeout(resolve, 1000));
		},
	},
};

/**
 * ダイアログが閉じた状態
 */
export const Closed: Story = {
	args: {
		open: false,
		onOpenChange: () => {},
		currentIcon: "https://api.dicebear.com/7.x/avataaars/svg?seed=Felix",
		onSave: async () => {},
	},
};

/**
 * アイコン未設定の状態
 * 新規ユーザーやアイコンを設定していない場合の表示
 */
export const NoIcon: Story = {
	args: {
		open: true,
		onOpenChange: () => {},
		currentIcon: null,
		onSave: async (iconUrl: string) => {
			console.log("Saving icon:", iconUrl);
			await new Promise((resolve) => setTimeout(resolve, 1000));
		},
	},
};

/**
 * 保存中の状態
 * Server Actionの実行中、ボタンが無効化されローディング表示になります
 */
export const Saving: Story = {
	args: {
		open: true,
		onOpenChange: () => {},
		currentIcon: "https://api.dicebear.com/7.x/avataaars/svg?seed=Felix",
		onSave: async (iconUrl: string) => {
			console.log("Saving icon:", iconUrl);
			// 長い保存処理をシミュレート
			await new Promise((resolve) => setTimeout(resolve, 5000));
		},
	},
};

/**
 * インタラクティブな例
 * ダイアログの開閉とアイコン選択を実際に試すことができます
 */
export const Interactive: Story = {
	render: () => {
		const [open, setOpen] = useState(false);
		const [currentIcon, setCurrentIcon] = useState<string | null>(
			"https://api.dicebear.com/7.x/avataaars/svg?seed=Felix",
		);

		return (
			<div className="space-y-4">
				<div className="flex items-center gap-4">
					<Button onClick={() => setOpen(true)}>アイコンを変更</Button>
					<p className="text-sm text-muted-foreground">
						現在のアイコン: {currentIcon ? "設定済み" : "未設定"}
					</p>
				</div>
				<EditIconDialog
					open={open}
					onOpenChange={setOpen}
					currentIcon={currentIcon}
					onSave={async (iconUrl: string) => {
						console.log("Saving icon:", iconUrl);
						await new Promise((resolve) => setTimeout(resolve, 1000));
						setCurrentIcon(iconUrl);
					}}
				/>
			</div>
		);
	},
};
