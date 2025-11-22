/**
 * 型変換ユーティリティ
 * ArticleとFeedItemData間の変換
 */

import type { FeedItemData } from "@/features/feed/types";
import type { Article } from "@/features/feed/types/article";

/**
 * ArticleをFeedItemDataに変換
 */
export function articleToFeedItemData(article: Article): FeedItemData {
	return {
		id: article.id,
		type: article.type === "post" ? "text" : "text", // RSS記事もテキストとして扱う
		content: {
			title: article.title,
			text: article.content,
			url: article.originalUrl,
		},
		author: {
			id: article.id, // 仮のID（実際のユーザーIDがない場合）
			name: article.authorName,
			avatar: article.authorAvatar,
		},
		stats: {
			likes: article.likeCount,
			comments: article.commentCount,
			shares: article.shareCount,
		},
		isLiked: article.isLiked,
		hashtags: article.categories.map((cat) => cat.name),
	};
}
