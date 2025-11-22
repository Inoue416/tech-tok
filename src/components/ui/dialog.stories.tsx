import type { Meta, StoryObj } from "@storybook/nextjs";
import { useState } from "react";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from "./dialog";
import { Button } from "./button";

const meta: Meta<typeof Dialog> = {
	title: "ui/Dialog",
	component: Dialog,
	tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<typeof Dialog>;

/**
 * 基本的なDialog
 */
export const Default: Story = {
	render: () => (
		<Dialog>
			<DialogTrigger asChild>
				<Button>ダイアログを開く</Button>
			</DialogTrigger>
			<DialogContent>
				<DialogHeader>
					<DialogTitle>ダイアログタイトル</DialogTitle>
					<DialogDescription>
						これはダイアログの説明文です。ユーザーに何かを伝えたい時に使用します。
					</DialogDescription>
				</DialogHeader>
				<div className="py-4">
					<p>ダイアログの内容がここに表示されます。</p>
				</div>
				<DialogFooter>
					<Button variant="outline">キャンセル</Button>
					<Button>確認</Button>
				</DialogFooter>
			</DialogContent>
		</Dialog>
	),
};

/**
 * 確認ダイアログ
 */
export const Confirmation: Story = {
	render: () => (
		<Dialog>
			<DialogTrigger asChild>
				<Button variant="destructive">削除</Button>
			</DialogTrigger>
			<DialogContent>
				<DialogHeader>
					<DialogTitle>削除の確認</DialogTitle>
					<DialogDescription>
						この操作は元に戻すことができません。本当に削除しますか？
					</DialogDescription>
				</DialogHeader>
				<DialogFooter>
					<Button variant="outline">キャンセル</Button>
					<Button variant="destructive">削除</Button>
				</DialogFooter>
			</DialogContent>
		</Dialog>
	),
};

/**
 * フォーム付きDialog
 */
export const WithForm: Story = {
	render: () => (
		<Dialog>
			<DialogTrigger asChild>
				<Button>プロフィール編集</Button>
			</DialogTrigger>
			<DialogContent>
				<DialogHeader>
					<DialogTitle>プロフィール編集</DialogTitle>
					<DialogDescription>
						プロフィール情報を更新してください。
					</DialogDescription>
				</DialogHeader>
				<div className="grid gap-4 py-4">
					<div className="grid grid-cols-4 items-center gap-4">
						<label htmlFor="name" className="text-right">
							名前
						</label>
						<input
							id="name"
							defaultValue="田中太郎"
							className="col-span-3 border rounded px-3 py-2"
						/>
					</div>
					<div className="grid grid-cols-4 items-center gap-4">
						<label htmlFor="email" className="text-right">
							メール
						</label>
						<input
							id="email"
							defaultValue="tanaka@example.com"
							className="col-span-3 border rounded px-3 py-2"
						/>
					</div>
				</div>
				<DialogFooter>
					<Button variant="outline">キャンセル</Button>
					<Button>保存</Button>
				</DialogFooter>
			</DialogContent>
		</Dialog>
	),
};

/**
 * 制御されたDialog
 */
export const Controlled: Story = {
	render: () => {
		const [open, setOpen] = useState(false);

		return (
			<Dialog open={open} onOpenChange={setOpen}>
				<DialogTrigger asChild>
					<Button>制御されたダイアログ</Button>
				</DialogTrigger>
				<DialogContent>
					<DialogHeader>
						<DialogTitle>制御されたダイアログ</DialogTitle>
						<DialogDescription>
							このダイアログは状態で制御されています。
						</DialogDescription>
					</DialogHeader>
					<div className="py-4">
						<p>現在の状態: {open ? "開いている" : "閉じている"}</p>
					</div>
					<DialogFooter>
						<Button variant="outline" onClick={() => setOpen(false)}>
							閉じる
						</Button>
					</DialogFooter>
				</DialogContent>
			</Dialog>
		);
	},
};
