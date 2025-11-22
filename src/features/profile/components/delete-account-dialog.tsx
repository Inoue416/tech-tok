"use client";

import { AlertTriangle } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import type { DeleteAccountDialogProps } from "@/features/profile/types";

const CONFIRMATION_TEXT = "削除する";

/**
 * アカウント削除確認ダイアログ
 * 二重確認（テキスト入力）を要求します
 */
export function DeleteAccountDialog({
	open,
	onOpenChange,
	onConfirm,
}: DeleteAccountDialogProps) {
	const [confirmationInput, setConfirmationInput] = useState("");
	const [error, setError] = useState<string | null>(null);
	const [isLoading, setIsLoading] = useState(false);

	// ダイアログが開かれたときに状態をリセット
	const handleOpenChange = (newOpen: boolean) => {
		if (newOpen) {
			setConfirmationInput("");
			setError(null);
		}
		onOpenChange(newOpen);
	};

	// 削除実行
	const handleDelete = async () => {
		// 二次確認チェック
		if (confirmationInput !== CONFIRMATION_TEXT) {
			setError(`「${CONFIRMATION_TEXT}」と入力してください`);
			return;
		}

		setIsLoading(true);
		setError(null);

		try {
			await onConfirm();
			// 成功時はダイアログを閉じる（親コンポーネントでリダイレクト処理）
			onOpenChange(false);
		} catch (err) {
			setError(
				err instanceof Error
					? err.message
					: "アカウントの削除に失敗しました。もう一度お試しください。",
			);
		} finally {
			setIsLoading(false);
		}
	};

	const isConfirmationValid = confirmationInput === CONFIRMATION_TEXT;

	return (
		<Dialog open={open} onOpenChange={handleOpenChange}>
			<DialogContent>
			<DialogHeader>
				<div className="flex items-center gap-2 text-destructive">
					<AlertTriangle className="size-5" />
					<DialogTitle>アカウントを削除しますか？</DialogTitle>
				</div>
				<DialogDescription>
					この操作は取り消せません。
				</DialogDescription>
			</DialogHeader>

			<div className="space-y-2 text-sm">
				<div className="font-semibold text-foreground">
					アカウントを削除すると、以下のデータがすべて完全に削除されます：
				</div>
				<ul className="list-disc list-inside space-y-1 text-muted-foreground">
					<li>プロフィール情報</li>
					<li>投稿したすべてのコンテンツ</li>
					<li>いいね、ブックマーク、コメント</li>
					<li>フォロー/フォロワー情報</li>
					<li>技術スタック設定</li>
				</ul>
			</div>

				<div className="space-y-4 py-4">
					<div className="space-y-2">
						<Label htmlFor="confirmation">
							続行するには、
							<span className="font-bold text-destructive">
								「{CONFIRMATION_TEXT}」
							</span>
							と入力してください
						</Label>
						<Input
							id="confirmation"
							value={confirmationInput}
							onChange={(e) => {
								setConfirmationInput(e.target.value);
								setError(null);
							}}
							placeholder={CONFIRMATION_TEXT}
							disabled={isLoading}
							aria-invalid={!!error}
							autoComplete="off"
						/>
						{error && (
							<p className="text-sm text-destructive" role="alert">
								{error}
							</p>
						)}
					</div>
				</div>

				<DialogFooter>
					<Button
						variant="outline"
						onClick={() => onOpenChange(false)}
						disabled={isLoading}
					>
						キャンセル
					</Button>
					<Button
						variant="destructive"
						onClick={handleDelete}
						disabled={!isConfirmationValid || isLoading}
					>
						{isLoading ? "削除中..." : "アカウントを削除"}
					</Button>
				</DialogFooter>
			</DialogContent>
		</Dialog>
	);
}
