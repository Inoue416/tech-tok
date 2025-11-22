"use client";

import { Edit, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { ProfileHeaderProps } from "@/features/profile/types";

/**
 * プロフィールヘッダーを表示するコンポーネント
 * プロフィールアイコン、ユーザー名、編集ボタンを表示します
 */
export function ProfileHeader({
	user,
	onUsernameEdit,
	onIconEdit,
}: ProfileHeaderProps) {
	return (
		<div className="flex items-center gap-4 p-6 bg-card rounded-lg border">
			{/* プロフィールアイコン */}
			<div className="relative">
				<div className="size-20 rounded-full overflow-hidden bg-muted flex items-center justify-center">
					{user.image ? (
						<img
							src={user.image}
							alt={user.displayName || user.username || "User"}
							className="size-full object-cover"
						/>
					) : (
						<User className="size-10 text-muted-foreground" />
					)}
				</div>
				<Button
					onClick={onIconEdit}
					variant="outline"
					size="icon"
					className="absolute -bottom-1 -right-1 size-8 rounded-full shadow-md"
					aria-label="アイコンを編集"
				>
					<Edit className="size-3.5" />
				</Button>
			</div>

			{/* ユーザー名と編集ボタン */}
			<div className="flex-1 min-w-0">
				<div className="flex items-center gap-2">
					<h1 className="text-xl font-bold text-foreground truncate">
						{user.username || "ユーザー名未設定"}
					</h1>
					<Button
						onClick={onUsernameEdit}
						variant="ghost"
						size="sm"
						className="shrink-0"
						aria-label="ユーザー名を編集"
					>
						<Edit className="size-4" />
					</Button>
				</div>
				{user.displayName && (
					<p className="text-sm text-muted-foreground truncate">
						{user.displayName}
					</p>
				)}
			</div>
		</div>
	);
}
