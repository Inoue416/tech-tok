"use client";

/**
 * 記事カードコンポーネント
 * 個々の記事を表示するカードUI
 */

import { ExternalLink } from "lucide-react";
import Image from "next/image";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import type { Article } from "@/features/feed/types/article";
import { BookmarkButton } from "@/features/interactions/components/bookmark-button";
import { LikeButton } from "@/features/interactions/components/like-button";
import { ShareButton } from "@/features/interactions/components/share-button";
import { cn } from "@/lib/utils";

export interface ArticleCardProps {
	article: Article;
	isActive: boolean;
	className?: string;
}

/**
 * 記事カードコンポーネント
 */
export function ArticleCard({
	article,
	isActive: _isActive,
	className,
}: ArticleCardProps) {
	const [isExpanded, setIsExpanded] = useState(false);
	const maxLength = 300; // 省略表示の文字数

	// コンテンツが長い場合は省略
	const shouldTruncate = article.content.length > maxLength;
	const displayContent =
		shouldTruncate && !isExpanded
			? `${article.content.slice(0, maxLength)}...`
			: article.content;

	return (
		<div
			className={cn(
				"h-full w-full flex items-center justify-center p-4 md:p-8",
				className,
			)}
		>
			<div className="max-w-2xl w-full">
				{/* 記事ヘッダー */}
				<div className="mb-6">
					<div className="flex items-center gap-3 mb-4">
						{article.authorAvatar && (
							<div className="relative w-12 h-12 rounded-full overflow-hidden flex-shrink-0">
								<Image
									src={article.authorAvatar}
									alt={article.authorName}
									fill
									className="object-cover"
								/>
							</div>
						)}
						<div className="flex-1 min-w-0">
							<p className="text-white font-semibold truncate">
								{article.authorName}
							</p>
							<p className="text-gray-400 text-sm">
								{new Date(article.publishedAt).toLocaleDateString("ja-JP", {
									year: "numeric",
									month: "long",
									day: "numeric",
								})}
							</p>
						</div>
					</div>

					{/* タイトル */}
					<h2 className="text-white text-2xl md:text-3xl font-bold mb-4 leading-tight">
						{article.title}
					</h2>

					{/* カテゴリー */}
					{article.categories.length > 0 && (
						<div className="flex flex-wrap gap-2 mb-4">
							{article.categories.map((category) => (
								<span
									key={category.id}
									className="px-3 py-1 rounded-full bg-white/10 text-white text-sm"
									style={
										category.color
											? { backgroundColor: `${category.color}20` }
											: undefined
									}
								>
									{category.name}
								</span>
							))}
						</div>
					)}
				</div>

				{/* 記事コンテンツ */}
				<div className="mb-6">
					<p className="text-white text-base md:text-lg leading-relaxed whitespace-pre-wrap">
						{displayContent}
					</p>

					{/* 続きを読むボタン */}
					{shouldTruncate && (
						<button
							type="button"
							onClick={() => setIsExpanded(!isExpanded)}
							className="text-blue-400 hover:text-blue-300 text-sm mt-2 transition-colors"
						>
							{isExpanded ? "閉じる" : "続きを読む"}
						</button>
					)}
				</div>

				{/* 元記事リンク */}
				{article.originalUrl && (
					<div className="mb-6">
						<Button
							variant="outline"
							size="sm"
							className="bg-white/10 border-white/20 text-white hover:bg-white/20"
							asChild
						>
							<a
								href={article.originalUrl}
								target="_blank"
								rel="noopener noreferrer"
								className="flex items-center gap-2"
							>
								<ExternalLink className="w-4 h-4" />
								元記事を読む
							</a>
						</Button>
					</div>
				)}

				{/* インタラクションボタン */}
				<div className="flex items-center gap-4">
					<LikeButton
						articleId={article.id}
						initialIsLiked={article.isLiked}
						initialCount={article.likeCount}
					/>
					<BookmarkButton
						articleId={article.id}
						initialIsBookmarked={article.isBookmarked}
					/>
					<div className="flex items-center gap-2 text-white/80">
						<span className="text-2xl">💬</span>
						<span className="text-sm">{article.commentCount}</span>
					</div>
					<ShareButton
						articleId={article.id}
						articleTitle={article.title}
						initialCount={article.shareCount}
					/>
				</div>
			</div>
		</div>
	);
}
