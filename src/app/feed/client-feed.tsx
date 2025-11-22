"use client";

/**
 * フィードページのクライアントコンポーネント
 * 無限スクロールとインタラクション機能を提供
 */

import { VerticalFeed } from "@/features/feed/components/vertical-feed";
import { useInfiniteScroll } from "@/features/feed/hooks/use-infinite-scroll";
import type { Article } from "@/features/feed/types/article";

export interface ClientFeedProps {
	initialArticles: Article[];
	initialCursor: string | null;
	hasMore: boolean;
}

export function ClientFeed({
	initialArticles,
	initialCursor,
	hasMore: initialHasMore,
}: ClientFeedProps) {
	const { articles, isLoading, hasMore, loadMore } = useInfiniteScroll({
		initialArticles,
		initialCursor,
		limit: 10,
	});

	// 初期状態のhasMoreを使用
	const effectiveHasMore =
		articles.length === initialArticles.length ? initialHasMore : hasMore;

	return (
		<VerticalFeed
			articles={articles}
			onLoadMore={loadMore}
			hasMore={effectiveHasMore}
			isLoading={isLoading}
		/>
	);
}
