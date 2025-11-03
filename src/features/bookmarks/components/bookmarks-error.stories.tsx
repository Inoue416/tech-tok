import type { Meta, StoryObj } from "@storybook/nextjs";
import { fn } from "storybook/test";
import { BookmarksError } from "./bookmarks-error";

const meta: Meta<typeof BookmarksError> = {
	title: "features/Bookmarks/BookmarksError",
	component: BookmarksError,
	tags: ["autodocs"],
	parameters: {
		layout: "fullscreen",
	},
	args: {
		onRetry: fn(),
	},
};
export default meta;

type Story = StoryObj<typeof BookmarksError>;

export const NetworkError: Story = {
	args: {
		error: new Error(
			"ネットワークエラーが発生しました。接続を確認してください。",
		),
	},
};

export const GenericError: Story = {
	args: {
		error: new Error("ブックマークの読み込みに失敗しました"),
	},
};

export const AuthenticationError: Story = {
	args: {
		error: new Error("認証エラー: ログインセッションが無効です"),
	},
};

export const TimeoutError: Story = {
	args: {
		error: new Error(
			"リクエストがタイムアウトしました。しばらくしてから再試行してください。",
		),
	},
};

export const DatabaseError: Story = {
	args: {
		error: new Error("データベース接続エラー: サーバーに接続できません"),
	},
};
