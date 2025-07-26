import { Separator } from "@/components/ui/separator";
import type { ProfileProps } from "@/features/profile/types";
import { ProfileHeader } from "./profile-header";
import { ProfilePostList } from "./profile-post-list";

/**
 * ユーザープロフィールを表示するメインコンポーネント
 */
export function Profile({
	profile,
	posts,
	onFollow,
	onUnfollow,
	onShare,
	onPostClick,
	onProfileEdit,
	onPostDelete,
	onPostEdit,
}: ProfileProps) {
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
				posts={posts}
				isOwnProfile={profile.isOwnProfile}
				onPostClick={onPostClick}
				onPostDelete={onPostDelete}
				onPostEdit={onPostEdit}
			/>
		</div>
	);
}
