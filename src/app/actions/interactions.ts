"use server";

/**
 * インタラクション関連のServer Actions
 * いいね、ブックマーク、共有機能
 */

import { revalidatePath } from "next/cache";
import { getSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

/**
 * いいね機能をトグル
 */
export async function toggleLike(articleId: string) {
	try {
		const session = await getSession();

		if (!session?.user?.id) {
			return {
				success: false,
				error: "認証が必要です",
				isLiked: false,
			};
		}

		const userId = session.user.id;

		// 既存のいいねを確認
		const existingLike = await prisma.like.findUnique({
			where: {
				userId_feedItemId: {
					userId,
					feedItemId: articleId,
				},
			},
		});

		if (existingLike) {
			// いいねを削除
			await prisma.like.delete({
				where: {
					id: existingLike.id,
				},
			});

			return {
				success: true,
				isLiked: false,
			};
		}

		// いいねを作成
		await prisma.like.create({
			data: {
				userId,
				feedItemId: articleId,
			},
		});

		return {
			success: true,
			isLiked: true,
		};
	} catch (error) {
		console.error("Error toggling like:", error);
		return {
			success: false,
			error: "いいねの処理に失敗しました",
			isLiked: false,
		};
	}
}

/**
 * ブックマーク機能をトグル
 */
export async function toggleBookmark(articleId: string) {
	try {
		const session = await getSession();

		if (!session?.user?.id) {
			return {
				success: false,
				error: "認証が必要です",
				isBookmarked: false,
			};
		}

		const userId = session.user.id;

		// 既存のブックマークを確認
		const existingBookmark = await prisma.bookmark.findUnique({
			where: {
				userId_feedItemId: {
					userId,
					feedItemId: articleId,
				},
			},
		});

		if (existingBookmark) {
			// ブックマークを削除
			await prisma.bookmark.delete({
				where: {
					id: existingBookmark.id,
				},
			});

			return {
				success: true,
				isBookmarked: false,
			};
		}

		// ブックマークを作成
		await prisma.bookmark.create({
			data: {
				userId,
				feedItemId: articleId,
			},
		});

		return {
			success: true,
			isBookmarked: true,
		};
	} catch (error) {
		console.error("Error toggling bookmark:", error);
		return {
			success: false,
			error: "ブックマークの処理に失敗しました",
			isBookmarked: false,
		};
	}
}

/**
 * 共有をトラッキング
 * Note: PostShareは引き続きpostIdを使用（実際の投稿のみ共有可能）
 */
export async function trackShare(articleId: string) {
	try {
		const session = await getSession();

		if (!session?.user?.id) {
			return {
				success: false,
				error: "認証が必要です",
			};
		}

		const userId = session.user.id;

		// FeedItemから実際のpostIdを取得
		const feedItem = await prisma.feedItem.findUnique({
			where: { id: articleId },
			select: { postId: true },
		});

		if (!feedItem?.postId) {
			return {
				success: false,
				error: "この記事は共有できません",
			};
		}

		// 共有レコードを作成
		await prisma.postShare.create({
			data: {
				userId,
				postId: feedItem.postId,
			},
		});

		// フィードページを再検証
		revalidatePath("/feed");

		return {
			success: true,
		};
	} catch (error) {
		console.error("Error tracking share:", error);
		return {
			success: false,
			error: "共有のトラッキングに失敗しました",
		};
	}
}

/**
 * いいね数を取得
 */
export async function getLikeCount(articleId: string) {
	try {
		const count = await prisma.like.count({
			where: {
				feedItemId: articleId,
			},
		});

		return {
			success: true,
			count,
		};
	} catch (error) {
		console.error("Error getting like count:", error);
		return {
			success: false,
			count: 0,
		};
	}
}

/**
 * 共有数を取得
 */
export async function getShareCount(articleId: string) {
	try {
		// FeedItemから実際のpostIdを取得
		const feedItem = await prisma.feedItem.findUnique({
			where: { id: articleId },
			select: { postId: true },
		});

		if (!feedItem?.postId) {
			return {
				success: true,
				count: 0,
			};
		}

		const count = await prisma.postShare.count({
			where: {
				postId: feedItem.postId,
			},
		});

		return {
			success: true,
			count,
		};
	} catch (error) {
		console.error("Error getting share count:", error);
		return {
			success: false,
			count: 0,
		};
	}
}
