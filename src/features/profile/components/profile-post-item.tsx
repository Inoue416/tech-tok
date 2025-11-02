import {
	BookmarkCheck,
	Heart,
	MessageCircle,
	Play,
	Share2,
} from "lucide-react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import type {
	ProfilePost,
	ProfilePostDisplayType,
} from "@/features/profile/types";
import { cn } from "@/lib/utils";

interface ProfilePostItemProps {
	post: ProfilePost;
	displayType: ProfilePostDisplayType;
	isOwnProfile?: boolean;
	onClick?: (post: ProfilePost) => void;
	onUnlike?: (postId: string) => void;
	onUnbookmark?: (postId: string) => void;
}

/**
 * プロフィール投稿アイテムを表示するコンポーネント
 */
export function ProfilePostItem({
	post,
	displayType,
	isOwnProfile,
	onClick,
	onUnlike,
	onUnbookmark,
}: ProfilePostItemProps) {
	const handleClick = () => {
		onClick?.(post);
	};

	const handleUnlike = (e: React.MouseEvent) => {
		e.stopPropagation();
		onUnlike?.(post.id);
	};

	const handleUnbookmark = (e: React.MouseEvent) => {
		e.stopPropagation();
		onUnbookmark?.(post.id);
	};

	const formatNumber = (num: number): string => {
		if (num >= 1000000) {
			return `${(num / 1000000).toFixed(1)}M`;
		}
		if (num >= 1000) {
			return `${(num / 1000).toFixed(1)}K`;
		}
		return num.toString();
	};

	return (
		<Card
			className={cn(
				"cursor-pointer transition-all hover:shadow-md hover:scale-[1.02]",
				"overflow-hidden",
			)}
			onClick={handleClick}
		>
			<CardContent className="p-0">
				{/* サムネイル/コンテンツエリア */}
				<div className="relative aspect-[4/5] bg-muted">
					{/* アクションボタン（自分のプロフィールのみ） */}
					{isOwnProfile && (
						<div className="absolute top-2 right-2 z-10">
							{displayType === "liked" && post.isLiked && (
								<Button
									size="icon"
									variant="secondary"
									className="size-8 bg-black/50 hover:bg-black/70 text-white border-0"
									onClick={handleUnlike}
								>
									<Heart className="size-4 fill-red-500 text-red-500" />
								</Button>
							)}
							{displayType === "bookmarked" && post.isBookmarked && (
								<Button
									size="icon"
									variant="secondary"
									className="size-8 bg-black/50 hover:bg-black/70 text-white border-0"
									onClick={handleUnbookmark}
								>
									<BookmarkCheck className="size-4 fill-blue-500 text-blue-500" />
								</Button>
							)}
						</div>
					)}
					{post.type === "video" && post.content.thumbnail ? (
						<>
							<Image
								src={post.content.thumbnail}
								alt={post.content.title || "投稿画像"}
								fill
								className="object-cover"
							/>
							<div className="absolute inset-0 bg-black/20 flex items-center justify-center">
								<div className="bg-black/50 rounded-full p-3">
									<Play className="size-6 text-white fill-white" />
								</div>
							</div>
						</>
					) : post.type === "text" ? (
						<div className="size-full flex items-center justify-center p-6">
							<div className="text-center space-y-2">
								{post.content.title && (
									<h3 className="font-semibold text-lg line-clamp-2">
										{post.content.title}
									</h3>
								)}
								{post.content.text && (
									<p className="text-muted-foreground text-sm line-clamp-4">
										{post.content.text}
									</p>
								)}
							</div>
						</div>
					) : (
						<div className="size-full flex items-center justify-center">
							<div className="text-muted-foreground">
								コンテンツが見つかりません
							</div>
						</div>
					)}
				</div>

				{/* 投稿情報 */}
				<div className="p-4 space-y-3">
					{/* タイトルと説明 */}
					{(post.content.title || post.content.description) && (
						<div className="space-y-1">
							{post.content.title && (
								<h4 className="font-medium text-sm line-clamp-2">
									{post.content.title}
								</h4>
							)}
							{post.content.description && (
								<p className="text-muted-foreground text-xs line-clamp-2">
									{post.content.description}
								</p>
							)}
						</div>
					)}

					{/* ハッシュタグ */}
					{post.hashtags && post.hashtags.length > 0 && (
						<div className="flex flex-wrap gap-1">
							{post.hashtags.slice(0, 3).map((tag) => (
								<span
									key={tag}
									className="text-xs text-blue-600 dark:text-blue-400"
								>
									#{tag}
								</span>
							))}
							{post.hashtags.length > 3 && (
								<span className="text-xs text-muted-foreground">
									+{post.hashtags.length - 3}
								</span>
							)}
						</div>
					)}

					{/* 統計情報 */}
					<div className="flex items-center gap-3 text-xs text-muted-foreground">
						<div className="flex items-center gap-1">
							<Heart className="size-3" />
							{formatNumber(post.stats.likes)}
						</div>
						<div className="flex items-center gap-1">
							<MessageCircle className="size-3" />
							{formatNumber(post.stats.comments)}
						</div>
						<div className="flex items-center gap-1">
							<Share2 className="size-3" />
							{formatNumber(post.stats.shares)}
						</div>
					</div>
				</div>
			</CardContent>
		</Card>
	);
}
