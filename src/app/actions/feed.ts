"use server";

/**
 * フィード関連のServer Actions
 */

import {
	type Article,
	type FeedItemWithRelations,
	feedItemToArticle,
} from "@/features/feed/types/article";
import { getSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

/**
 * JSTで今日の開始時刻（00:00:00）をUTCで取得
 * データベースのcreatedAtはUTCで保存されているため、JSTの日付範囲をUTCに変換して検索する
 */
function getTodayStartJST(): Date {
	// 現在のUTC時刻を取得
	const now = new Date();
	
	// UTC時刻をJST（UTC+9）に変換
	const jstTime = new Date(now.getTime() + 9 * 60 * 60 * 1000);
	
	// JSTで今日の開始時刻（00:00:00）を設定
	const jstYear = jstTime.getUTCFullYear();
	const jstMonth = jstTime.getUTCMonth();
	const jstDate = jstTime.getUTCDate();
	
	// JSTの00:00:00をUTC時刻として表現
	const jstDayStart = new Date(Date.UTC(jstYear, jstMonth, jstDate, 0, 0, 0, 0));
	
	// JSTで設定した時刻をUTCに戻す（-9時間）
	const utcTime = new Date(jstDayStart.getTime() - 9 * 60 * 60 * 1000);
	
	return utcTime;
}

/**
 * JSTで今日の終了時刻（23:59:59.999）をUTCで取得
 * データベースのcreatedAtはUTCで保存されているため、JSTの日付範囲をUTCに変換して検索する
 */
function getTodayEndJST(): Date {
	// 現在のUTC時刻を取得
	const now = new Date();
	
	// UTC時刻をJST（UTC+9）に変換
	const jstTime = new Date(now.getTime() + 9 * 60 * 60 * 1000);
	
	// JSTで今日の終了時刻（23:59:59.999）を設定
	const jstYear = jstTime.getUTCFullYear();
	const jstMonth = jstTime.getUTCMonth();
	const jstDate = jstTime.getUTCDate();
	
	// JSTの23:59:59.999をUTC時刻として表現
	const jstDayEnd = new Date(Date.UTC(jstYear, jstMonth, jstDate, 23, 59, 59, 999));
	
	// JSTで設定した時刻をUTCに戻す（-9時間）
	const utcTime = new Date(jstDayEnd.getTime() - 9 * 60 * 60 * 1000);
	
	return utcTime;
}

/**
 * フィード取得のパラメータ
 */
export interface GetFeedArticlesParams {
	cursor?: string; // ページネーション用のカーソル（FeedItemのID）
	categoryId?: string; // カテゴリーフィルター（TechnologyのID）
	limit?: number; // 取得件数（デフォルト: 10）
}

/**
 * フィード取得の戻り値
 */
export interface GetFeedArticlesResult {
	articles: Article[];
	nextCursor: string | null;
	hasMore: boolean;
}

/**
 * フィード記事を取得
 * ページネーション、カテゴリーフィルタリング、ユーザーのいいね/ブックマーク状態を含む
 */
export async function getFeedArticles(
	params: GetFeedArticlesParams = {},
): Promise<GetFeedArticlesResult> {
	const { cursor, categoryId, limit = 10 } = params;

	try {
		// セッション取得（オプショナル - 未認証でも閲覧可能）
		const session = await getSession();
		const userId = session?.user?.id;

		// FeedItemを取得（公開済みのもののみ、今日のデータのみ）
		const feedItems = await prisma.feedItem.findMany({
			where: {
				isPublished: true,
				createdAt: {
					gte: getTodayStartJST(),
					lte: getTodayEndJST(),
				},
				...(cursor && {
					id: {
						lt: cursor, // カーソルより前のアイテムを取得
					},
				}),
			// カテゴリーフィルター
			...(categoryId && {
				OR: [
					{
						rssEntry: {
							technologies: {
								some: {
									technologyId: categoryId,
								},
							},
						},
					},
					{
						post: {
							hashtags: {
								some: {
									hashtagId: categoryId,
								},
							},
						},
					},
				],
			}),
		},
		include: {
			rssEntry: {
				include: {
					source: true,
					technologies: {
						include: {
							technology: true,
						},
					},
				},
			},
			post: {
				include: {
					author: true,
					hashtags: {
						include: {
							hashtag: true,
						},
					},
				},
			},
		},
		orderBy: {
			publishedAt: "desc",
		},
			take: limit + 1, // 次のページがあるか確認するため+1
		});

		// 次のページがあるかチェック
		const hasMore = feedItems.length > limit;
		const items = hasMore ? feedItems.slice(0, limit) : feedItems;
		const nextCursor = hasMore ? items[items.length - 1].id : null;

		// ユーザーのいいね/ブックマーク状態を取得
		let userLikes: Set<string> | undefined;
		let userBookmarks: Set<string> | undefined;

		if (userId) {
			const feedItemIds = items.map((item) => item.id);

			// いいね状態を取得
			const likes = await prisma.like.findMany({
				where: {
					userId,
					feedItemId: {
						in: feedItemIds,
					},
				},
				select: {
					feedItemId: true,
				},
			});
			userLikes = new Set(likes.map((like) => like.feedItemId));

			// ブックマーク状態を取得
			const bookmarks = await prisma.bookmark.findMany({
				where: {
					userId,
					feedItemId: {
						in: feedItemIds,
					},
				},
				select: {
					feedItemId: true,
				},
			});
			userBookmarks = new Set(bookmarks.map((bookmark) => bookmark.feedItemId));
		}

		// FeedItemをArticleに変換
		const articles = items
			.map((item) =>
				feedItemToArticle(
					item as FeedItemWithRelations,
					userId,
					userLikes,
					userBookmarks,
				),
			)
			.filter((article): article is Article => article !== null);

		return {
			articles,
			nextCursor,
			hasMore,
		};
	} catch (error) {
		console.error("Error fetching feed articles:", error);
		throw new Error("フィード記事の取得に失敗しました");
	}
}

/**
 * 記事詳細を取得
 */
export async function getArticleById(id: string): Promise<Article | null> {
	try {
		const session = await getSession();
		const userId = session?.user?.id;

		const feedItem = await prisma.feedItem.findUnique({
			where: { id },
			include: {
				rssEntry: {
					include: {
						source: true,
						technologies: {
							include: {
								technology: true,
							},
						},
					},
				},
				post: {
					include: {
						author: true,
						hashtags: {
							include: {
								hashtag: true,
							},
						},
					},
				},
			},
		});

		if (!feedItem) {
			return null;
		}

		// ユーザーのいいね/ブックマーク状態を取得
		let userLikes: Set<string> | undefined;
		let userBookmarks: Set<string> | undefined;

		if (userId) {
			const [like, bookmark] = await Promise.all([
				prisma.like.findUnique({
					where: {
						userId_feedItemId: {
							userId,
							feedItemId: id,
						},
					},
				}),
				prisma.bookmark.findUnique({
					where: {
						userId_feedItemId: {
							userId,
							feedItemId: id,
						},
					},
				}),
			]);

			userLikes = like ? new Set([id]) : new Set();
			userBookmarks = bookmark ? new Set([id]) : new Set();
		}

		return feedItemToArticle(
			feedItem as FeedItemWithRelations,
			userId,
			userLikes,
			userBookmarks,
		);
	} catch (error) {
		console.error("Error fetching article by id:", error);
		throw new Error("記事の取得に失敗しました");
	}
}

/**
 * カテゴリー（技術スタック）一覧を取得
 */
export async function getCategories() {
	try {
		const technologies = await prisma.technology.findMany({
			orderBy: {
				name: "asc",
			},
		});

		return technologies.map((tech) => ({
			id: tech.id,
			name: tech.name,
			color: tech.color,
		}));
	} catch (error) {
		console.error("Error fetching categories:", error);
		throw new Error("カテゴリーの取得に失敗しました");
	}
}
