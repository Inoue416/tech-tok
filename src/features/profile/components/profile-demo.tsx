"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
	ownProfile,
	samplePosts,
	sampleProfile,
} from "@/features/profile/data/sample-data";
import type {
	ProfileEditData,
	ProfilePost,
	UserProfile,
} from "@/features/profile/types";
import { DeleteConfirmationDialog } from "./delete-confirmation-dialog";
import { Profile } from "./profile";
import { ProfileEditDialog } from "./profile-edit-dialog";

/**
 * プロフィールコンポーネントのデモ
 */
export function ProfileDemo() {
	const [currentProfile, setCurrentProfile] =
		useState<UserProfile>(sampleProfile);
	const [posts, setPosts] = useState<ProfilePost[]>(samplePosts);
	const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
	const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
	const [postToDelete, setPostToDelete] = useState<string | null>(null);

	const handleFollow = (userId: string) => {
		console.log("フォロー:", userId);
		setCurrentProfile((prev) => ({
			...prev,
			isFollowing: true,
			stats: {
				...prev.stats,
				followers: prev.stats.followers + 1,
			},
		}));
	};

	const handleUnfollow = (userId: string) => {
		console.log("フォロー解除:", userId);
		setCurrentProfile((prev) => ({
			...prev,
			isFollowing: false,
			stats: {
				...prev.stats,
				followers: Math.max(0, prev.stats.followers - 1),
			},
		}));
	};

	const handleShare = (profile: UserProfile) => {
		console.log("シェア:", profile);
		// 実際の実装では、シェア機能（URL共有など）を実装
		alert(`${profile.displayName}のプロフィールをシェアしました！`);
	};

	const handlePostClick = (post: ProfilePost) => {
		console.log("投稿クリック:", post);
		// 実際の実装では、投稿詳細ページに遷移など
		alert(`投稿「${post.content.title}」をクリックしました！`);
	};

	const handleProfileEdit = (data: ProfileEditData) => {
		console.log("プロフィール編集:", data);
		setCurrentProfile((prev) => ({
			...prev,
			displayName: data.displayName,
			username: data.username,
			bio: data.bio,
			technologies: data.technologies,
		}));
		setIsEditDialogOpen(true);
	};

	const handleProfileSave = (data: ProfileEditData) => {
		setCurrentProfile((prev) => ({
			...prev,
			displayName: data.displayName,
			username: data.username,
			bio: data.bio,
			technologies: data.technologies,
		}));
		alert("プロフィールを更新しました！");
	};

	const handlePostEdit = (post: ProfilePost) => {
		console.log("投稿編集:", post);
		// 実際の実装では、投稿編集ダイアログを表示
		alert(`投稿「${post.content.title}」を編集します（実装予定）`);
	};

	const handlePostDelete = (postId: string) => {
		setPostToDelete(postId);
		setIsDeleteDialogOpen(true);
	};

	const handleDeleteConfirm = () => {
		if (postToDelete) {
			setPosts((prev) => prev.filter((post) => post.id !== postToDelete));
			setPostToDelete(null);
			alert("投稿を削除しました！");
		}
	};

	const toggleProfileType = () => {
		setCurrentProfile((prev) =>
			prev.isOwnProfile ? sampleProfile : ownProfile,
		);
	};

	return (
		<div className="min-h-screen bg-background p-4">
			<div className="max-w-4xl mx-auto space-y-6">
				{/* デモ用コントロール */}
				<div className="text-center space-y-4">
					<h1 className="text-3xl font-bold">
						プロフィールコンポーネント デモ
					</h1>
					<Button onClick={toggleProfileType} variant="outline">
						{currentProfile.isOwnProfile
							? "他のユーザー"
							: "自分のプロフィール"}
						に切り替え
					</Button>
				</div>

				{/* プロフィールコンポーネント */}
				<Profile
					profile={currentProfile}
					posts={posts}
					onFollow={handleFollow}
					onUnfollow={handleUnfollow}
					onShare={handleShare}
					onPostClick={handlePostClick}
					onProfileEdit={handleProfileEdit}
					onPostDelete={handlePostDelete}
					onPostEdit={handlePostEdit}
				/>

				{/* プロフィール編集ダイアログ */}
				<ProfileEditDialog
					open={isEditDialogOpen}
					onOpenChange={setIsEditDialogOpen}
					profile={currentProfile}
					onSave={handleProfileSave}
				/>

				{/* 削除確認ダイアログ */}
				<DeleteConfirmationDialog
					open={isDeleteDialogOpen}
					onOpenChange={setIsDeleteDialogOpen}
					onConfirm={handleDeleteConfirm}
				/>
			</div>
		</div>
	);
}
