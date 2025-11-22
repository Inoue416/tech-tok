import type { Meta, StoryObj } from "@storybook/nextjs";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { DeleteAccountDialog } from "./delete-account-dialog";

const meta: Meta<typeof DeleteAccountDialog> = {
	title: "Features/Profile/DeleteAccountDialog",
	component: DeleteAccountDialog,
	parameters: {
		layout: "centered",
	},
	tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * ダイアログが開いた状態
 * 警告メッセージと二次確認の入力フィールドが表示されます
 */
export const Open: Story = {
	args: {
		open: true,
		onOpenChange: () => {},
		onConfirm: async () => {
			console.log("Account deletion confirmed");
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
		onConfirm: async () => {},
	},
};

/**
 * 削除中の状態
 * Server Actionの実行中、ボタンが無効化されローディング表示になります
 */
export const Deleting: Story = {
	args: {
		open: true,
		onOpenChange: () => {},
		onConfirm: async () => {
			console.log("Deleting account...");
			// 長い削除処理をシミュレート
			await new Promise((resolve) => setTimeout(resolve, 5000));
		},
	},
};

/**
 * エラー状態
 * 削除に失敗した場合のエラー表示をシミュレートします
 */
export const WithError: Story = {
	args: {
		open: true,
		onOpenChange: () => {},
		onConfirm: async () => {
			console.log("Simulating error...");
			await new Promise((resolve) => setTimeout(resolve, 1000));
			throw new Error("アカウントの削除に失敗しました");
		},
	},
};

/**
 * インタラクティブな例
 * ダイアログの開閉と削除処理を実際に試すことができます
 */
export const Interactive: Story = {
	render: () => {
		const [open, setOpen] = useState(false);
		const [isDeleted, setIsDeleted] = useState(false);

		if (isDeleted) {
			return (
				<div className="text-center space-y-4">
					<p className="text-lg font-semibold">アカウントが削除されました</p>
					<Button onClick={() => setIsDeleted(false)}>リセット</Button>
				</div>
			);
		}

		return (
			<div className="space-y-4">
				<Button variant="destructive" onClick={() => setOpen(true)}>
					アカウントを削除
				</Button>
				<DeleteAccountDialog
					open={open}
					onOpenChange={setOpen}
					onConfirm={async () => {
						console.log("Deleting account...");
						await new Promise((resolve) => setTimeout(resolve, 2000));
						setIsDeleted(true);
					}}
				/>
			</div>
		);
	},
};

/**
 * 確認テキスト入力のデモ
 * 正しいテキストを入力しないと削除ボタンが有効にならないことを確認できます
 */
export const ConfirmationDemo: Story = {
	render: () => {
		const [open, setOpen] = useState(true);

		return (
			<div className="space-y-4">
				<div className="text-sm text-muted-foreground">
					<p>「削除する」と入力すると削除ボタンが有効になります</p>
				</div>
				<DeleteAccountDialog
					open={open}
					onOpenChange={setOpen}
					onConfirm={async () => {
						console.log("Account deletion confirmed");
						await new Promise((resolve) => setTimeout(resolve, 1000));
						alert("アカウントが削除されました");
					}}
				/>
			</div>
		);
	},
};
