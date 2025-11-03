"use server";

/**
 * プロフィール関連のServer Actions
 */

import { revalidatePath } from "next/cache";
import { getSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

/**
 * Server Actions の結果型定義
 */
export type UpdateUsernameResult =
	| { success: true; username: string }
	| { success: false; error: string };

export type UpdateIconResult =
	| { success: true; iconUrl: string }
	| { success: false; error: string };

export type UpdateTechnologiesResult =
	| { success: true; technologies: Technology[] }
	| { success: false; error: string };

export type DeleteAccountResult =
	| { success: true }
	| { success: false; error: string };

/**
 * Technology型定義
 */
export interface Technology {
	id: string;
	name: string;
	category: string | null;
	color: string | null;
}

/**
 * ユーザー名を更新
 * 要件: 2.2, 2.3, 2.4, 2.5
 */
export async function updateUsername(
	username: string,
): Promise<UpdateUsernameResult> {
	try {
		// セッション検証
		const session = await getSession();
		if (!session?.user?.id) {
			return { success: false, error: "認証が必要です" };
		}

		const userId = session.user.id;

		// バリデーション: 空文字チェック
		const trimmedUsername = username.trim();
		if (!trimmedUsername) {
			return { success: false, error: "ユーザー名を入力してください" };
		}

		// バリデーション: 文字数制限（1-50文字）
		if (trimmedUsername.length > 50) {
			return {
				success: false,
				error: "ユーザー名は50文字以内で入力してください",
			};
		}

		// バリデーション: 重複チェック
		const existingUser = await prisma.user.findUnique({
			where: { username: trimmedUsername },
		});

		if (existingUser && existingUser.id !== userId) {
			return {
				success: false,
				error: "このユーザー名は既に使用されています",
			};
		}

		// ユーザー名を更新
		await prisma.user.update({
			where: { id: userId },
			data: { username: trimmedUsername },
		});

		// キャッシュを無効化
		revalidatePath("/profile");

		return { success: true, username: trimmedUsername };
	} catch (error) {
		console.error("Error updating username:", error);
		return {
			success: false,
			error: "ユーザー名の更新に失敗しました",
		};
	}
}

/**
 * プロフィールアイコンを更新
 * 要件: 3.2, 3.3, 3.4
 */
export async function updateIcon(iconUrl: string): Promise<UpdateIconResult> {
	try {
		// セッション検証
		const session = await getSession();
		if (!session?.user?.id) {
			return { success: false, error: "認証が必要です" };
		}

		const userId = session.user.id;

		// アイコンURLを更新
		await prisma.user.update({
			where: { id: userId },
			data: { image: iconUrl },
		});

		// キャッシュを無効化
		revalidatePath("/profile");

		return { success: true, iconUrl };
	} catch (error) {
		console.error("Error updating icon:", error);
		return {
			success: false,
			error: "アイコンの更新に失敗しました",
		};
	}
}

/**
 * 技術スタックを更新
 * 要件: 4.2, 4.3, 4.4, 4.5
 */
export async function updateTechnologies(
	technologyIds: string[],
): Promise<UpdateTechnologiesResult> {
	try {
		// セッション検証
		const session = await getSession();
		if (!session?.user?.id) {
			return { success: false, error: "認証が必要です" };
		}

		const userId = session.user.id;

		// トランザクションで既存のレコードを削除し、新しいレコードを作成
		await prisma.$transaction(async (tx) => {
			// 既存のUserTechnologyレコードを削除
			await tx.userTechnology.deleteMany({
				where: { userId },
			});

			// 新しいUserTechnologyレコードを作成
			if (technologyIds.length > 0) {
				await tx.userTechnology.createMany({
					data: technologyIds.map((technologyId) => ({
						userId,
						technologyId,
					})),
				});
			}
		});

		// 更新後の技術スタックを取得
		const userTechnologies = await prisma.userTechnology.findMany({
			where: { userId },
			include: {
				technology: true,
			},
		});

		const technologies: Technology[] = userTechnologies.map((ut) => ({
			id: ut.technology.id,
			name: ut.technology.name,
			category: ut.technology.category,
			color: ut.technology.color,
		}));

		// キャッシュを無効化
		revalidatePath("/profile");

		return { success: true, technologies };
	} catch (error) {
		console.error("Error updating technologies:", error);
		return {
			success: false,
			error: "技術スタックの更新に失敗しました",
		};
	}
}

/**
 * アカウントを削除
 * 要件: 6.3, 6.4, 6.5, 6.6
 */
export async function deleteAccount(): Promise<DeleteAccountResult> {
	try {
		// セッション検証
		const session = await getSession();
		if (!session?.user?.id) {
			return { success: false, error: "認証が必要です" };
		}

		const userId = session.user.id;

		// ユーザーを削除（Cascade削除により関連データも削除される）
		// 削除されるデータ:
		// - Posts
		// - Likes
		// - Bookmarks
		// - Comments
		// - Notifications
		// - PostShares
		// - UserTechnologies
		// - Follows（フォロワー/フォロー中）
		// - Accounts（OAuth連携情報）
		await prisma.user.delete({
			where: { id: userId },
		});

		// セッションの無効化はクライアント側で signOut() を呼び出すことで行う
		// Server Action からは直接セッションを無効化できないため、
		// クライアント側で signOut() を呼び出す必要がある

		return { success: true };
	} catch (error) {
		console.error("Error deleting account:", error);
		return {
			success: false,
			error: "アカウントの削除に失敗しました",
		};
	}
}
