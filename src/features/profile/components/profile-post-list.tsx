import { Bookmark, Heart } from "lucide-react";
import { Button } from "@/components/ui/button";
import type {
	ProfilePostDisplayType,
	ProfilePostListProps,
} from "@/features/profile/types";
import { ProfilePostItem } from "./profile-post-item";

/**
 * プロフィール投稿リストを表示するコンポーネント
 */
export function ProfilePostList({
	posts,
	displayType,
	isOwnProfile,
	onPostClick,
	onDisplayTypeChange,
	onUnlike,
	onUnbookmark,
}: ProfilePostListProps) {
	const getEmptyMessage = (type: ProfilePostDisplayType) => {
		switch (type) {
			case "liked":
				return "まだいいねした投稿がありません";
			case "bookmarked":
				return "まだブックマークした投稿がありません";
			default:
				return "投稿がありません";
		}
	};

	const getListTitle = (type: ProfilePostDisplayType) => {
		switch (type) {
			case "liked":
				return "いいねした投稿";
			case "bookmarked":
				return "ブックマークした投稿";
			default:
				return "投稿一覧";
		}
	};

	return (
		<div className="space-y-4">
			{/* タブ切り替え */}
			<div className="flex gap-2">
				<Button
					variant={displayType === "liked" ? "default" : "outline"}
					size="sm"
					onClick={() => onDisplayTypeChange?.("liked")}
					className="flex-1 flex items-center gap-2"
				>
					<Heart className="size-4" />
					いいね
				</Button>
				<Button
					variant={displayType === "bookmarked" ? "default" : "outline"}
					size="sm"
					onClick={() => onDisplayTypeChange?.("bookmarked")}
					className="flex-1 flex items-center gap-2"
				>
					<Bookmark className="size-4" />
					ブックマーク
				</Button>
			</div>

			{/* リストタイトル */}
			<h2 className="text-lg font-semibold text-foreground">
				{getListTitle(displayType)}
			</h2>

			{/* 投稿リスト */}
			{posts.length === 0 ? (
				<div className="text-center py-12">
					<div className="text-muted-foreground text-sm">
						{getEmptyMessage(displayType)}
					</div>
				</div>
			) : (
				<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
					{posts.map((post) => (
						<ProfilePostItem
							key={post.id}
							post={post}
							displayType={displayType}
							isOwnProfile={isOwnProfile}
							onClick={onPostClick}
							onUnlike={onUnlike}
							onUnbookmark={onUnbookmark}
						/>
					))}
				</div>
			)}
		</div>
	);
}
