"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
	ownProfile,
	sampleBookmarkedPosts,
	sampleLikedPosts,
	sampleProfile,
} from "@/features/profile/data/sample-data";
import type {
	ProfileEditData,
	ProfilePost,
	ProfilePostDisplayType,
	UserProfile,
} from "@/features/profile/types";
import { Profile } from "./profile";
import { ProfileEditDialog } from "./profile-edit-dialog";

/**
 * プロフィールコンポーネントのデモ
 */
export function ProfileDemo() {
	const [currentProfile, setCurrentProfile] =
		useState<UserProfile>(sampleProfile);
	const [likedPosts, setLikedPosts] = useState<ProfilePost[]>(sampleLikedPosts);
	const [bookmarkedPosts, setBookmarkedPosts] = useState<ProfilePost[]>(
		sampleBookmarkedPosts,
	);
	const [displayType, setDisplayType] =
		useState<ProfilePostDisplayType>("liked");
	const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);

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

	const handleDisplayTypeChange = (type: ProfilePostDisplayType) => {
		setDisplayType(type);
	};

	const handleUnlike = (postId: string) => {
		console.log("いいね取り消し:", postId);
		setLikedPosts((prev) => prev.filter((post) => post.id !== postId));
		setCurrentProfile((prev) => ({
			...prev,
			stats: {
				...prev.stats,
				likedPosts: Math.max(0, prev.stats.likedPosts - 1),
			},
		}));
		alert("いいねを取り消しました！");
	};

	const handleUnbookmark = (postId: string) => {
		console.log("ブックマーク削除:", postId);
		setBookmarkedPosts((prev) => prev.filter((post) => post.id !== postId));
		setCurrentProfile((prev) => ({
			...prev,
			stats: {
				...prev.stats,
				bookmarkedPosts: Math.max(0, prev.stats.bookmarkedPosts - 1),
			},
		}));
		alert("ブックマークを削除しました！");
	};

	const toggleProfileType = () => {
		setCurrentProfile((prev) =>
			prev.isOwnProfile ? sampleProfile : ownProfile,
		);
		// プロフィールタイプが変わったときにデータもリセット
		if (currentProfile.isOwnProfile) {
			setLikedPosts(sampleLikedPosts);
			setBookmarkedPosts(sampleBookmarkedPosts);
		} else {
			// 自分のプロフィール用のデータ（簡単なサンプル）
			setLikedPosts(sampleLikedPosts.slice(0, 2));
			setBookmarkedPosts(sampleBookmarkedPosts.slice(0, 2));
		}
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
					likedPosts={likedPosts}
					bookmarkedPosts={bookmarkedPosts}
					displayType={displayType}
					onFollow={handleFollow}
					onUnfollow={handleUnfollow}
					onShare={handleShare}
					onPostClick={handlePostClick}
					onProfileEdit={handleProfileEdit}
					onDisplayTypeChange={handleDisplayTypeChange}
					onUnlike={handleUnlike}
					onUnbookmark={handleUnbookmark}
				/>

				{/* プロフィール編集ダイアログ */}
				<ProfileEditDialog
					open={isEditDialogOpen}
					onOpenChange={setIsEditDialogOpen}
					profile={currentProfile}
					onSave={handleProfileSave}
				/>
			</div>
		</div>
	);
}
