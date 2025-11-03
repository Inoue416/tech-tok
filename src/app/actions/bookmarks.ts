"use server";

/**
 * ブックマーク関連のServer Actions
 */

import {
	type Article,
	type FeedItemWithRelations,
	feedItemToArticle,
} from "@/features/feed/types/article";
import { getSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

/**
 * ブックマーク取得のパラメータ
 */
export interface GetBookmarkedArticlesParams {
	cursor?: string; // ページネーション用のカーソル（BookmarkのID）
	limit?: number; // 取得件数（デフォルト: 20）
}

/**
 * ブックマーク取得の戻り値
 */
export interface GetBookmarkedArticlesResult {
	articles: Article[];
	nextCursor: string | null;
	hasMore: boolean;
}

/**
 * ユーザーのブックマーク一覧を取得
 * ページネーション対応、ユーザーのいいね/ブックマーク状態を含む
 */
export async function getBookmarkedArticles(
	params: GetBookmarkedArticlesParams = {},
): Promise<GetBookmarkedArticlesResult> {
	const { cursor, limit = 20 } = params;

	try {
		// セッション取得（認証必須）
		const session = await getSession();
		if (!session?.user?.id) {
			throw new Error("認証が必要です");
		}

		const userId = session.user.id;

		// ブックマークを取得（作成日時降順）
		const bookmarks = await prisma.bookmark.findMany({
			where: {
				userId,
				...(cursor && {
					id: {
						lt: cursor, // カーソルより前のブックマークを取得
					},
				}),
			},
			include: {
				feedItem: {
					include: {
						rssEntry: {
							include: {
								source: {
									include: {
										sourceTechnologies: {
											include: {
												technology: true,
											},
										},
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
						likes: {
							where: { userId },
							select: { feedItemId: true },
						},
					},
				},
			},
			orderBy: {
				createdAt: "desc",
			},
			take: limit + 1, // 次のページがあるか確認するため+1
		});

		// 次のページがあるかチェック
		const hasMore = bookmarks.length > limit;
		const items = hasMore ? bookmarks.slice(0, limit) : bookmarks;
		const nextCursor = hasMore ? items[items.length - 1].id : null;

		// ユーザーのいいね状態を取得（feedItemのlikesから）
		const feedItemIds = items.map((bookmark) => bookmark.feedItemId);
		const userLikes = new Set(
			items.flatMap((bookmark) =>
				bookmark.feedItem.likes.map((like) => like.feedItemId),
			),
		);

		// すべてのfeedItemIdはブックマーク済み
		const userBookmarks = new Set(feedItemIds);

		// Article型に変換
		const articles = items
			.map((bookmark) =>
				feedItemToArticle(
					bookmark.feedItem as FeedItemWithRelations,
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
		console.error("Error fetching bookmarked articles:", error);
		if (error instanceof Error && error.message === "認証が必要です") {
			throw error;
		}
		throw new Error("ブックマークの取得に失敗しました");
	}
}

/**
 * ブックマークを削除
 */
export async function removeBookmark(feedItemId: string): Promise<void> {
	try {
		// セッション取得（認証必須）
		const session = await getSession();
		if (!session?.user?.id) {
			throw new Error("認証が必要です");
		}

		const userId = session.user.id;

		// ブックマークを削除
		await prisma.bookmark.delete({
			where: {
				userId_feedItemId: {
					userId,
					feedItemId,
				},
			},
		});
	} catch (error) {
		console.error("Error removing bookmark:", error);
		if (error instanceof Error && error.message === "認証が必要です") {
			throw error;
		}
		throw new Error("ブックマークの削除に失敗しました");
	}
}
