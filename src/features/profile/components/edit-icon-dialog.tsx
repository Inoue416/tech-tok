"use client";

import { Check, User } from "lucide-react";
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
import type { EditIconDialogProps } from "@/features/profile/types";
import { cn } from "@/lib/utils";

// プリセットアイコンのURL一覧
const PRESET_ICONS = [
	"https://api.dicebear.com/7.x/avataaars/svg?seed=Felix",
	"https://api.dicebear.com/7.x/avataaars/svg?seed=Aneka",
	"https://api.dicebear.com/7.x/avataaars/svg?seed=Luna",
	"https://api.dicebear.com/7.x/avataaars/svg?seed=Max",
	"https://api.dicebear.com/7.x/avataaars/svg?seed=Bella",
	"https://api.dicebear.com/7.x/avataaars/svg?seed=Charlie",
	"https://api.dicebear.com/7.x/avataaars/svg?seed=Lucy",
	"https://api.dicebear.com/7.x/avataaars/svg?seed=Oliver",
	"https://api.dicebear.com/7.x/avataaars/svg?seed=Milo",
	"https://api.dicebear.com/7.x/avataaars/svg?seed=Lily",
	"https://api.dicebear.com/7.x/avataaars/svg?seed=Leo",
	"https://api.dicebear.com/7.x/avataaars/svg?seed=Sophie",
];

/**
 * プロフィールアイコンを編集するダイアログコンポーネント
 */
export function EditIconDialog({
	open,
	onOpenChange,
	currentIcon,
	onSave,
}: EditIconDialogProps) {
	const [selectedIcon, setSelectedIcon] = useState<string | null>(currentIcon);
	const [error, setError] = useState<string | null>(null);
	const [isLoading, setIsLoading] = useState(false);

	// ダイアログが開かれたときに現在のアイコンをリセット
	const handleOpenChange = (newOpen: boolean) => {
		if (newOpen) {
			setSelectedIcon(currentIcon);
			setError(null);
		}
		onOpenChange(newOpen);
	};

	// 保存処理
	const handleSave = async () => {
		if (!selectedIcon) {
			setError("アイコンを選択してください");
			return;
		}

		setIsLoading(true);
		setError(null);

		try {
			await onSave(selectedIcon);
			onOpenChange(false);
		} catch (err) {
			setError(
				err instanceof Error ? err.message : "アイコンの更新に失敗しました",
			);
		} finally {
			setIsLoading(false);
		}
	};

	return (
		<Dialog open={open} onOpenChange={handleOpenChange}>
			<DialogContent className="max-w-2xl">
				<DialogHeader>
					<DialogTitle>プロフィールアイコンを変更</DialogTitle>
					<DialogDescription>
						お好きなアイコンを選択してください。
					</DialogDescription>
				</DialogHeader>

				<div className="space-y-6 py-4">
					{/* プレビュー */}
					<div className="flex flex-col items-center gap-3">
						<p className="text-sm font-medium">プレビュー</p>
						<div className="size-20 rounded-full overflow-hidden bg-muted flex items-center justify-center">
							{selectedIcon ? (
								<img
									src={selectedIcon}
									alt="Preview"
									className="size-full object-cover"
								/>
							) : (
								<User className="size-10 text-muted-foreground" />
							)}
						</div>
					</div>

					{/* アイコン選択グリッド */}
					<div>
						<p className="text-sm font-medium mb-3">アイコンを選択</p>
						<div className="grid grid-cols-4 sm:grid-cols-6 gap-3">
							{PRESET_ICONS.map((iconUrl) => (
								<button
									key={iconUrl}
									type="button"
									onClick={() => {
										setSelectedIcon(iconUrl);
										setError(null);
									}}
									disabled={isLoading}
									className={cn(
										"relative size-16 rounded-full overflow-hidden bg-muted transition-all hover:scale-105 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
										selectedIcon === iconUrl && "ring-2 ring-primary",
										isLoading && "opacity-50 cursor-not-allowed",
									)}
								>
									<img
										src={iconUrl}
										alt="Avatar option"
										className="size-full object-cover"
									/>
									{selectedIcon === iconUrl && (
										<div className="absolute inset-0 flex items-center justify-center bg-primary/20 rounded-full">
											<div className="bg-primary rounded-full p-1">
												<Check className="size-4 text-primary-foreground" />
											</div>
										</div>
									)}
								</button>
							))}
						</div>
					</div>

					{error && (
						<p className="text-sm text-destructive text-center" role="alert">
							{error}
						</p>
					)}
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
