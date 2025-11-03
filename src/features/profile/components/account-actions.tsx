"use client";

import { LogOut, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { AccountActionsProps } from "@/features/profile/types";

/**
 * アカウント操作（ログアウト、退会）を提供するコンポーネント
 */
export function AccountActions({
	onLogout,
	onDeleteAccount,
}: AccountActionsProps) {
	return (
		<div className="space-y-4 p-6 bg-card rounded-lg border">
			<h2 className="text-lg font-semibold text-foreground">アカウント操作</h2>

			<div className="space-y-3">
				{/* ログアウトボタン */}
				<Button
					onClick={onLogout}
					variant="outline"
					className="w-full justify-start"
				>
					<LogOut className="size-4" />
					ログアウト
				</Button>

				{/* 退会ボタン */}
				<Button
					onClick={onDeleteAccount}
					variant="destructive"
					className="w-full justify-start"
				>
					<Trash2 className="size-4" />
					アカウントを削除
				</Button>
			</div>

			<p className="text-xs text-muted-foreground">
				アカウントを削除すると、すべてのデータが完全に削除されます。この操作は取り消せません。
			</p>
		</div>
	);
}
