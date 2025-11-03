"use client";

import { useState, useTransition } from "react";
import {
	type GetBookmarkedArticlesResult,
	getBookmarkedArticles,
	removeBookmark,
} from "@/app/actions/bookmarks";
import { BookmarksEmpty } from "@/features/bookmarks/components/bookmarks-empty";
import { BookmarksError } from "@/features/bookmarks/components/bookmarks-error";
import { BookmarksList } from "@/features/bookmarks/components/bookmarks-list";

interface ClientBookmarksProps {
	initialData: GetBookmarkedArticlesResult;
}

export function ClientBookmarks({ initialData }: ClientBookmarksProps) {
	const [data, setData] = useState(initialData);
	const [error, setError] = useState<Error | null>(null);
	const [isPending, startTransition] = useTransition();

	// ブックマーク削除ハンドラー（楽観的UI更新）
	const handleRemove = async (feedItemId: string) => {
		// 楽観的UI更新：即座にUIから削除
		const previousArticles = data.articles;
		setData((prev) => ({
			...prev,
			articles: prev.articles.filter((article) => article.id !== feedItemId),
		}));

		try {
			await removeBookmark(feedItemId);
		} catch (err) {
			// エラー時はロールバック
			console.error("Failed to remove bookmark:", err);
			setData((prev) => ({
				...prev,
				articles: previousArticles,
			}));
			setError(
				err instanceof Error
					? err
					: new Error("ブックマークの削除に失敗しました"),
			);
		}
	};

	// 無限スクロールハンドラー
	const handleLoadMore = () => {
		if (!data.hasMore || isPending) return;

		startTransition(async () => {
			try {
				const result = await getBookmarkedArticles({
					cursor: data.nextCursor || undefined,
					limit: 20,
				});

				setData((prev) => ({
					articles: [...prev.articles, ...result.articles],
					nextCursor: result.nextCursor,
					hasMore: result.hasMore,
				}));
			} catch (err) {
				console.error("Failed to load more bookmarks:", err);
				setError(
					err instanceof Error
						? err
						: new Error("追加のブックマークの読み込みに失敗しました"),
				);
			}
		});
	};

	// 再試行ハンドラー
	const handleRetry = () => {
		setError(null);
		startTransition(async () => {
			try {
				const result = await getBookmarkedArticles({ limit: 20 });
				setData(result);
			} catch (err) {
				console.error("Failed to retry:", err);
				setError(
					err instanceof Error
						? err
						: new Error("ブックマークの読み込みに失敗しました"),
				);
			}
		});
	};

	// エラー状態
	if (error) {
		return <BookmarksError error={error} onRetry={handleRetry} />;
	}

	// 空状態
	if (data.articles.length === 0 && !isPending) {
		return <BookmarksEmpty />;
	}

	// 通常表示
	return (
		<BookmarksList
			articles={data.articles}
			hasMore={data.hasMore}
			isLoading={isPending}
			onLoadMore={handleLoadMore}
			onRemove={handleRemove}
		/>
	);
}
