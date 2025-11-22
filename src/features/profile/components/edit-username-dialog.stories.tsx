import type { Meta, StoryObj } from "@storybook/nextjs";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { EditUsernameDialog } from "./edit-username-dialog";

const meta: Meta<typeof EditUsernameDialog> = {
	title: "Features/Profile/EditUsernameDialog",
	component: EditUsernameDialog,
	parameters: {
		layout: "centered",
	},
	tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * ダイアログが開いた状態
 * ユーザーが編集ボタンをクリックした後の状態を表示します
 */
export const Open: Story = {
	args: {
		open: true,
		onOpenChange: () => {},
		currentUsername: "techuser",
		onSave: async (username: string) => {
			console.log("Saving username:", username);
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
		currentUsername: "techuser",
		onSave: async () => {},
	},
};

/**
 * ユーザー名が未設定の状態
 * 新規ユーザーの場合、空の入力フィールドが表示されます
 */
export const NoUsername: Story = {
	args: {
		open: true,
		onOpenChange: () => {},
		currentUsername: null,
		onSave: async (username: string) => {
			console.log("Saving username:", username);
			await new Promise((resolve) => setTimeout(resolve, 1000));
		},
	},
};

/**
 * 日本語のユーザー名
 * 日本語を含むユーザー名も使用できます
 */
export const JapaneseUsername: Story = {
	args: {
		open: true,
		onOpenChange: () => {},
		currentUsername: "田中太郎",
		onSave: async (username: string) => {
			console.log("Saving username:", username);
			await new Promise((resolve) => setTimeout(resolve, 1000));
		},
	},
};

/**
 * バリデーションエラーの状態
 * 無効な入力を試みた場合のエラー表示をシミュレートします
 */
export const ValidationError: Story = {
	render: () => {
		const [open, setOpen] = useState(true);
		return (
			<div>
				<Button onClick={() => setOpen(true)}>ダイアログを開く</Button>
				<EditUsernameDialog
					open={open}
					onOpenChange={setOpen}
					currentUsername="techuser"
					onSave={async (username: string) => {
						// 空文字や無効な文字を入力するとバリデーションエラーが表示されます
						if (username.includes("@")) {
							throw new Error("特殊文字は使用できません");
						}
						await new Promise((resolve) => setTimeout(resolve, 1000));
					}}
				/>
			</div>
		);
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
		currentUsername: "techuser",
		onSave: async (username: string) => {
			console.log("Saving username:", username);
			// 長い保存処理をシミュレート
			await new Promise((resolve) => setTimeout(resolve, 5000));
		},
	},
};

/**
 * インタラクティブな例
 * ダイアログの開閉と保存処理を実際に試すことができます
 */
export const Interactive: Story = {
	render: () => {
		const [open, setOpen] = useState(false);
		const [currentUsername, setCurrentUsername] = useState("techuser");

		return (
			<div className="space-y-4">
				<div className="text-sm">
					<p>現在のユーザー名: {currentUsername}</p>
				</div>
				<Button onClick={() => setOpen(true)}>ユーザー名を編集</Button>
				<EditUsernameDialog
					open={open}
					onOpenChange={setOpen}
					currentUsername={currentUsername}
					onSave={async (username: string) => {
						console.log("Saving username:", username);
						await new Promise((resolve) => setTimeout(resolve, 1000));
						setCurrentUsername(username);
					}}
				/>
			</div>
		);
	},
};
