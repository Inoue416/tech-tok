import type { Meta, StoryObj } from "@storybook/nextjs";
import { useState } from "react";
import {
	DropdownMenu,
	DropdownMenuCheckboxItem,
	DropdownMenuContent,
	DropdownMenuGroup,
	DropdownMenuItem,
	DropdownMenuLabel,
	DropdownMenuRadioGroup,
	DropdownMenuRadioItem,
	DropdownMenuSeparator,
	DropdownMenuShortcut,
	DropdownMenuSub,
	DropdownMenuSubContent,
	DropdownMenuSubTrigger,
	DropdownMenuTrigger,
} from "./dropdown-menu";
import { Button } from "./button";

const meta: Meta<typeof DropdownMenu> = {
	title: "ui/DropdownMenu",
	component: DropdownMenu,
	tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<typeof DropdownMenu>;

/**
 * 基本的なDropdownMenu
 */
export const Default: Story = {
	render: () => (
		<DropdownMenu>
			<DropdownMenuTrigger asChild>
				<Button>メニューを開く</Button>
			</DropdownMenuTrigger>
			<DropdownMenuContent>
				<DropdownMenuItem>プロフィール</DropdownMenuItem>
				<DropdownMenuItem>設定</DropdownMenuItem>
				<DropdownMenuSeparator />
				<DropdownMenuItem>ログアウト</DropdownMenuItem>
			</DropdownMenuContent>
		</DropdownMenu>
	),
};

/**
 * ラベル付きDropdownMenu
 */
export const WithLabel: Story = {
	render: () => (
		<DropdownMenu>
			<DropdownMenuTrigger asChild>
				<Button>アカウント</Button>
			</DropdownMenuTrigger>
			<DropdownMenuContent>
				<DropdownMenuLabel>マイアカウント</DropdownMenuLabel>
				<DropdownMenuSeparator />
				<DropdownMenuItem>プロフィール</DropdownMenuItem>
				<DropdownMenuItem>請求情報</DropdownMenuItem>
				<DropdownMenuItem>設定</DropdownMenuItem>
				<DropdownMenuSeparator />
				<DropdownMenuItem variant="destructive">ログアウト</DropdownMenuItem>
			</DropdownMenuContent>
		</DropdownMenu>
	),
};

/**
 * ショートカット付きDropdownMenu
 */
export const WithShortcuts: Story = {
	render: () => (
		<DropdownMenu>
			<DropdownMenuTrigger asChild>
				<Button>編集</Button>
			</DropdownMenuTrigger>
			<DropdownMenuContent>
				<DropdownMenuItem>
					元に戻す
					<DropdownMenuShortcut>⌘Z</DropdownMenuShortcut>
				</DropdownMenuItem>
				<DropdownMenuItem>
					やり直し
					<DropdownMenuShortcut>⌘Y</DropdownMenuShortcut>
				</DropdownMenuItem>
				<DropdownMenuSeparator />
				<DropdownMenuItem>
					切り取り
					<DropdownMenuShortcut>⌘X</DropdownMenuShortcut>
				</DropdownMenuItem>
				<DropdownMenuItem>
					コピー
					<DropdownMenuShortcut>⌘C</DropdownMenuShortcut>
				</DropdownMenuItem>
				<DropdownMenuItem>
					貼り付け
					<DropdownMenuShortcut>⌘V</DropdownMenuShortcut>
				</DropdownMenuItem>
			</DropdownMenuContent>
		</DropdownMenu>
	),
};

/**
 * チェックボックス付きDropdownMenu
 */
export const WithCheckboxes: Story = {
	render: () => {
		const [showStatusBar, setShowStatusBar] = useState(true);
		const [showActivityBar, setShowActivityBar] = useState(false);
		const [showPanel, setShowPanel] = useState(false);

		return (
			<DropdownMenu>
				<DropdownMenuTrigger asChild>
					<Button>表示</Button>
				</DropdownMenuTrigger>
				<DropdownMenuContent>
					<DropdownMenuLabel>パネル</DropdownMenuLabel>
					<DropdownMenuSeparator />
					<DropdownMenuCheckboxItem
						checked={showStatusBar}
						onCheckedChange={setShowStatusBar}
					>
						ステータスバー
					</DropdownMenuCheckboxItem>
					<DropdownMenuCheckboxItem
						checked={showActivityBar}
						onCheckedChange={setShowActivityBar}
					>
						アクティビティバー
					</DropdownMenuCheckboxItem>
					<DropdownMenuCheckboxItem
						checked={showPanel}
						onCheckedChange={setShowPanel}
					>
						パネル
					</DropdownMenuCheckboxItem>
				</DropdownMenuContent>
			</DropdownMenu>
		);
	},
};

/**
 * ラジオボタン付きDropdownMenu
 */
export const WithRadioGroup: Story = {
	render: () => {
		const [position, setPosition] = useState("bottom");

		return (
			<DropdownMenu>
				<DropdownMenuTrigger asChild>
					<Button>パネル位置</Button>
				</DropdownMenuTrigger>
				<DropdownMenuContent>
					<DropdownMenuLabel>パネル位置</DropdownMenuLabel>
					<DropdownMenuSeparator />
					<DropdownMenuRadioGroup value={position} onValueChange={setPosition}>
						<DropdownMenuRadioItem value="top">上</DropdownMenuRadioItem>
						<DropdownMenuRadioItem value="bottom">下</DropdownMenuRadioItem>
						<DropdownMenuRadioItem value="right">右</DropdownMenuRadioItem>
					</DropdownMenuRadioGroup>
				</DropdownMenuContent>
			</DropdownMenu>
		);
	},
};

/**
 * サブメニュー付きDropdownMenu
 */
export const WithSubmenu: Story = {
	render: () => (
		<DropdownMenu>
			<DropdownMenuTrigger asChild>
				<Button>ファイル</Button>
			</DropdownMenuTrigger>
			<DropdownMenuContent>
				<DropdownMenuItem>新規作成</DropdownMenuItem>
				<DropdownMenuItem>開く</DropdownMenuItem>
				<DropdownMenuSub>
					<DropdownMenuSubTrigger>最近使用したファイル</DropdownMenuSubTrigger>
					<DropdownMenuSubContent>
						<DropdownMenuItem>project1.tsx</DropdownMenuItem>
						<DropdownMenuItem>component.stories.tsx</DropdownMenuItem>
						<DropdownMenuItem>utils.ts</DropdownMenuItem>
					</DropdownMenuSubContent>
				</DropdownMenuSub>
				<DropdownMenuSeparator />
				<DropdownMenuItem>保存</DropdownMenuItem>
				<DropdownMenuItem>名前を付けて保存</DropdownMenuItem>
			</DropdownMenuContent>
		</DropdownMenu>
	),
};