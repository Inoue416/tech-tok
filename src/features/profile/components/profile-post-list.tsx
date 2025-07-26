import type { ProfilePostListProps } from "@/features/profile/types";
import { ProfilePostItem } from "./profile-post-item";

/**
 * プロフィール投稿リストを表示するコンポーネント
 */
export function ProfilePostList({
	posts,
	isOwnProfile,
	onPostClick,
	onPostDelete,
	onPostEdit,
}: ProfilePostListProps) {
	if (posts.length === 0) {
		return (
			<div className="text-center py-12">
				<div className="text-muted-foreground text-sm">
					まだ投稿がありません
				</div>
			</div>
		);
	}

	return (
		<div className="space-y-4">
			<h2 className="text-lg font-semibold text-foreground">投稿一覧</h2>
			<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
				{posts.map((post) => (
					<ProfilePostItem
						key={post.id}
						post={post}
						isOwnProfile={isOwnProfile}
						onClick={onPostClick}
						onEdit={onPostEdit}
						onDelete={onPostDelete}
					/>
				))}
			</div>
		</div>
	);
}
