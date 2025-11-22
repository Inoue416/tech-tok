/**
 * Article型定義
 * フィード表示用の統合型（RssEntryまたはPostから生成）
 */

import type {
	FeedItem,
	Post,
	RssEntry,
	Technology,
	User,
} from "@/generated/prisma/client";

/**
 * カテゴリー（技術スタック）
 */
export interface Category {
	id: string;
	name: string;
	color: string | null;
}

/**
 * 記事（フィード表示用の統合型）
 */
export interface Article {
	id: string;
	type: "rss" | "post";
	title: string;
	content: string;
	authorName: string;
	authorAvatar?: string;
	originalUrl?: string; // 元記事URL
	publishedAt: Date;
	likeCount: number;
	commentCount: number;
	shareCount: number;
	isLiked: boolean; // 現在のユーザーがいいね済みか
	isBookmarked: boolean; // 現在のユーザーがブックマーク済みか
	categories: Category[];
}

/**
 * FeedItemとその関連データの型
 */
export type FeedItemWithRelations = FeedItem & {
	rssEntry:
		| (RssEntry & {
				source: {
					title: string | null;
				};
				technologies: {
					technology: Technology;
				}[];
		  })
		| null;
	post:
		| (Post & {
				author: User;
				hashtags: {
					hashtag: {
						id: string;
						name: string;
					};
				}[];
		  })
		| null;
};

/**
 * RssEntryをArticleに変換
 */
export function rssEntryToArticle(
	feedItem: FeedItemWithRelations,
	entry: NonNullable<FeedItemWithRelations["rssEntry"]>,
	userId?: string,
	userLikes?: Set<string>,
	userBookmarks?: Set<string>,
): Article {
	const categories: Category[] =
		entry.technologies.map((et) => ({
			id: et.technology.id,
			name: et.technology.name,
			color: et.technology.color,
		})) || [];

	return {
		id: feedItem.id,
		type: "rss",
		title: entry.title,
		content: entry.aiSummary || entry.contentText || entry.description || "",
		authorName: entry.authorName || entry.source.title || "Unknown",
		authorAvatar: entry.imageUrl || undefined,
		originalUrl: entry.link || undefined,
		publishedAt: entry.publishedAt,
		likeCount: 0, // RSS記事のいいね数は別途集計が必要
		commentCount: 0, // RSS記事のコメント数は別途集計が必要
		shareCount: 0, // RSS記事の共有数は別途集計が必要
		isLiked: userId ? userLikes?.has(feedItem.id) || false : false,
		isBookmarked: userId ? userBookmarks?.has(feedItem.id) || false : false,
		categories,
	};
}

/**
 * PostをArticleに変換
 */
export function postToArticle(
	feedItem: FeedItemWithRelations,
	post: NonNullable<FeedItemWithRelations["post"]>,
	userId?: string,
	userLikes?: Set<string>,
	userBookmarks?: Set<string>,
): Article {
	const categories: Category[] =
		post.hashtags.map((h) => ({
			id: h.hashtag.id,
			name: h.hashtag.name,
			color: null,
		})) || [];

	return {
		id: feedItem.id,
		type: "post",
		title: post.title,
		content: post.body || "",
		authorName: post.author.displayName || post.author.name || "Unknown",
		authorAvatar: post.author.image || undefined,
		originalUrl: undefined, // ユーザー投稿には元記事URLはない
		publishedAt: post.createdAt,
		likeCount: 0, // 投稿のいいね数は別途集計が必要
		commentCount: 0, // 投稿のコメント数は別途集計が必要
		shareCount: 0, // 投稿の共有数は別途集計が必要
		isLiked: userId ? userLikes?.has(feedItem.id) || false : false,
		isBookmarked: userId ? userBookmarks?.has(feedItem.id) || false : false,
		categories,
	};
}

/**
 * FeedItemをArticleに変換
 */
export function feedItemToArticle(
	feedItem: FeedItemWithRelations,
	userId?: string,
	userLikes?: Set<string>,
	userBookmarks?: Set<string>,
): Article | null {
	if (feedItem.rssEntry) {
		return rssEntryToArticle(
			feedItem,
			feedItem.rssEntry,
			userId,
			userLikes,
			userBookmarks,
		);
	}

	if (feedItem.post) {
		return postToArticle(
			feedItem,
			feedItem.post,
			userId,
			userLikes,
			userBookmarks,
		);
	}

	return null;
}
