import { Separator } from "@/components/ui/separator";
import type { ProfileProps } from "@/features/profile/types";
import { ProfileHeader } from "./profile-header";
import { ProfilePostList } from "./profile-post-list";

/**
 * ユーザープロフィールを表示するメインコンポーネント
 */
export function Profile({
	profile,
	likedPosts,
	bookmarkedPosts,
	displayType,
	onFollow,
	onUnfollow,
	onShare,
	onPostClick,
	onProfileEdit,
	onDisplayTypeChange,
	onUnlike,
	onUnbookmark,
}: ProfileProps) {
	const currentPosts = displayType === "liked" ? likedPosts : bookmarkedPosts;

	return (
		<div className="max-w-2xl mx-auto space-y-8">
			{/* プロフィールヘッダー */}
			<ProfileHeader
				profile={profile}
				onFollow={onFollow}
				onUnfollow={onUnfollow}
				onShare={onShare}
				onProfileEdit={onProfileEdit}
			/>

			{/* セパレーター */}
			<Separator />

			{/* 投稿リスト */}
			<ProfilePostList
				posts={currentPosts}
				displayType={displayType}
				isOwnProfile={profile.isOwnProfile}
				onPostClick={onPostClick}
				onDisplayTypeChange={onDisplayTypeChange}
				onUnlike={onUnlike}
				onUnbookmark={onUnbookmark}
			/>
		</div>
	);
}
