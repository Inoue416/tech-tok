"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import {
	deleteAccount,
	updateIcon,
	updateTechnologies,
	updateUsername,
} from "@/app/actions/profile";
import { AccountActions } from "@/features/profile/components/account-actions";
import { DeleteAccountDialog } from "@/features/profile/components/delete-account-dialog";
import { EditIconDialog } from "@/features/profile/components/edit-icon-dialog";
import { EditUsernameDialog } from "@/features/profile/components/edit-username-dialog";
import { ProfileHeader } from "@/features/profile/components/profile-header";
import { ProfileInfoSection } from "@/features/profile/components/profile-info-section";
import { TechnologySelectorDialog } from "@/features/profile/components/technology-selector";
import type { Technology } from "@/features/profile/types";
import { authClient } from "@/lib/auth-client";

interface ClientProfileProps {
	user: {
		id: string;
		username: string | null;
		displayName: string | null;
		image: string | null;
	};
	technologies: Technology[];
	availableTechnologies: Technology[];
}

/**
 * プロフィールページのClient Component
 * 各コンポーネントの統合とダイアログの状態管理を行う
 */
export function ClientProfile({
	user,
	technologies,
	availableTechnologies,
}: ClientProfileProps) {
	const router = useRouter();

	// ダイアログの状態管理
	const [isUsernameDialogOpen, setIsUsernameDialogOpen] = useState(false);
	const [isIconDialogOpen, setIsIconDialogOpen] = useState(false);
	const [isTechDialogOpen, setIsTechDialogOpen] = useState(false);
	const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

	// ユーザー名更新
	const handleUsernameUpdate = async (username: string) => {
		const result = await updateUsername(username);
		if (!result.success) {
			throw new Error(result.error);
		}
		// 成功時はページをリフレッシュ
		router.refresh();
	};

	// アイコン更新
	const handleIconUpdate = async (iconUrl: string) => {
		const result = await updateIcon(iconUrl);
		if (!result.success) {
			throw new Error(result.error);
		}
		// 成功時はページをリフレッシュ
		router.refresh();
	};

	// 技術スタック更新
	const handleTechnologiesUpdate = async (
		selectedTechnologies: Technology[],
	) => {
		const technologyIds = selectedTechnologies.map((t) => t.id);
		const result = await updateTechnologies(technologyIds);
		if (!result.success) {
			throw new Error(result.error);
		}
		// 成功時はページをリフレッシュ
		router.refresh();
	};

	// ログアウト
	const handleLogout = async () => {
		await authClient.signOut({
			fetchOptions: {
				onSuccess: () => {
					router.push("/login");
				},
			},
		});
	};

	// アカウント削除
	const handleAccountDelete = async () => {
		const result = await deleteAccount();
		if (!result.success) {
			throw new Error(result.error);
		}
		// 成功時はログアウトしてホームページにリダイレクト
		await authClient.signOut({
			fetchOptions: {
				onSuccess: () => {
					router.push("/");
				},
			},
		});
	};

	return (
		<div className="min-h-screen bg-background">
			<div className="container max-w-[600px] mx-auto px-4 py-8">
				<div className="space-y-6">
					{/* プロフィールヘッダー */}
					<ProfileHeader
						user={user}
						onUsernameEdit={() => setIsUsernameDialogOpen(true)}
						onIconEdit={() => setIsIconDialogOpen(true)}
					/>

					{/* 技術スタックセクション */}
					<ProfileInfoSection
						technologies={technologies}
						onEdit={() => setIsTechDialogOpen(true)}
					/>

					{/* アカウント操作 */}
					<AccountActions
						onLogout={handleLogout}
						onDeleteAccount={() => setIsDeleteDialogOpen(true)}
					/>
				</div>
			</div>

			{/* ダイアログ群 */}
			<EditUsernameDialog
				open={isUsernameDialogOpen}
				onOpenChange={setIsUsernameDialogOpen}
				currentUsername={user.username}
				onSave={handleUsernameUpdate}
			/>

			<EditIconDialog
				open={isIconDialogOpen}
				onOpenChange={setIsIconDialogOpen}
				currentIcon={user.image}
				onSave={handleIconUpdate}
			/>

			<TechnologySelectorDialog
				open={isTechDialogOpen}
				onOpenChange={setIsTechDialogOpen}
				availableTechnologies={availableTechnologies}
				selectedTechnologies={technologies}
				onSave={handleTechnologiesUpdate}
				maxSelections={10}
			/>

			<DeleteAccountDialog
				open={isDeleteDialogOpen}
				onOpenChange={setIsDeleteDialogOpen}
				onConfirm={handleAccountDelete}
			/>
		</div>
	);
}
