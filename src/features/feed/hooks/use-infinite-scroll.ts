"use client";

/**
 * 無限スクロール用のカスタムフック
 */

import { useCallback, useState } from "react";
import { getFeedArticles } from "@/app/actions/feed";
import type { Article } from "@/features/feed/types/article";

export interface UseInfiniteScrollOptions {
	initialArticles?: Article[];
	initialCursor?: string | null;
	categoryId?: string;
	limit?: number;
}

export interface UseInfiniteScrollReturn {
	articles: Article[];
	isLoading: boolean;
	hasMore: boolean;
	error: string | null;
	loadMore: () => Promise<void>;
	refresh: () => Promise<void>;
}

/**
 * 無限スクロール機能を提供するカスタムフック
 */
export function useInfiniteScroll({
	initialArticles = [],
	initialCursor = null,
	categoryId,
	limit = 10,
}: UseInfiniteScrollOptions = {}): UseInfiniteScrollReturn {
	const [articles, setArticles] = useState<Article[]>(initialArticles);
	const [cursor, setCursor] = useState<string | null>(initialCursor);
	const [isLoading, setIsLoading] = useState(false);
	const [hasMore, setHasMore] = useState(initialCursor !== null);
	const [error, setError] = useState<string | null>(null);

	/**
	 * 次のページを読み込む
	 */
	const loadMore = useCallback(async () => {
		if (isLoading || !hasMore) return;

		try {
			setIsLoading(true);
			setError(null);

			const result = await getFeedArticles({
				cursor: cursor || undefined,
				categoryId,
				limit,
			});

			setArticles((prev) => [...prev, ...result.articles]);
			setCursor(result.nextCursor);
			setHasMore(result.hasMore);
		} catch (err) {
			console.error("Error loading more articles:", err);
			setError("記事の読み込みに失敗しました");
		} finally {
			setIsLoading(false);
		}
	}, [cursor, categoryId, limit, isLoading, hasMore]);

	/**
	 * フィードをリフレッシュ（最初から読み込み直す）
	 */
	const refresh = useCallback(async () => {
		try {
			setIsLoading(true);
			setError(null);

			const result = await getFeedArticles({
				categoryId,
				limit,
			});

			setArticles(result.articles);
			setCursor(result.nextCursor);
			setHasMore(result.hasMore);
		} catch (err) {
			console.error("Error refreshing articles:", err);
			setError("記事の読み込みに失敗しました");
		} finally {
			setIsLoading(false);
		}
	}, [categoryId, limit]);

	return {
		articles,
		isLoading,
		hasMore,
		error,
		loadMore,
		refresh,
	};
}
