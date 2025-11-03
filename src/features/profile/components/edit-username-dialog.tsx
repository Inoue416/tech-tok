"use client";

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
import type { EditUsernameDialogProps } from "@/features/profile/types";

/**
 * ユーザー名を編集するダイアログコンポーネント
 */
export function EditUsernameDialog({
	open,
	onOpenChange,
	currentUsername,
	onSave,
}: EditUsernameDialogProps) {
	const [username, setUsername] = useState(currentUsername || "");
	const [error, setError] = useState<string | null>(null);
	const [isLoading, setIsLoading] = useState(false);

	// ダイアログが開かれたときに現在のユーザー名をリセット
	const handleOpenChange = (newOpen: boolean) => {
		if (newOpen) {
			setUsername(currentUsername || "");
			setError(null);
		}
		onOpenChange(newOpen);
	};

	// バリデーション
	const validateUsername = (value: string): string | null => {
		if (!value.trim()) {
			return "ユーザー名を入力してください";
		}
		if (value.length > 50) {
			return "ユーザー名は50文字以内で入力してください";
		}
		return null;
	};

	// 保存処理
	const handleSave = async () => {
		const validationError = validateUsername(username);
		if (validationError) {
			setError(validationError);
			return;
		}

		setIsLoading(true);
		setError(null);

		try {
			await onSave(username);
			onOpenChange(false);
		} catch (err) {
			setError(
				err instanceof Error ? err.message : "ユーザー名の更新に失敗しました",
			);
		} finally {
			setIsLoading(false);
		}
	};

	return (
		<Dialog open={open} onOpenChange={handleOpenChange}>
			<DialogContent>
				<DialogHeader>
					<DialogTitle>ユーザー名を編集</DialogTitle>
					<DialogDescription>
						新しいユーザー名を入力してください。50文字以内で入力できます。
					</DialogDescription>
				</DialogHeader>

				<div className="space-y-4 py-4">
					<div className="space-y-2">
						<Label htmlFor="username">ユーザー名</Label>
						<Input
							id="username"
							value={username}
							onChange={(e) => {
								setUsername(e.target.value);
								setError(null);
							}}
							placeholder="username"
							maxLength={50}
							disabled={isLoading}
							aria-invalid={!!error}
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
					<Button onClick={handleSave} disabled={isLoading}>
						{isLoading ? "保存中..." : "保存"}
					</Button>
				</DialogFooter>
			</DialogContent>
		</Dialog>
	);
}
