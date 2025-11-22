"use client";

import { useCallback, useEffect, useRef } from "react";
import { Spinner } from "@/components/ui/spinner";
import type { Article } from "@/features/feed/types/article";
import { BookmarkCard } from "./bookmark-card";

interface BookmarksListProps {
	articles: Article[];
	hasMore: boolean;
	isLoading?: boolean;
	onLoadMore: () => void;
	onRemove: (feedItemId: string) => Promise<void>;
}

export function BookmarksList({
	articles,
	hasMore,
	isLoading = false,
	onLoadMore,
	onRemove,
}: BookmarksListProps) {
	const observerTarget = useRef<HTMLDivElement>(null);

	// 無限スクロール実装
	const handleObserver = useCallback(
		(entries: IntersectionObserverEntry[]) => {
			const [entry] = entries;
			if (entry.isIntersecting && hasMore && !isLoading) {
				onLoadMore();
			}
		},
		[hasMore, isLoading, onLoadMore],
	);

	useEffect(() => {
		const element = observerTarget.current;
		if (!element) return;

		const observer = new IntersectionObserver(handleObserver, {
			threshold: 0.1,
		});

		observer.observe(element);

		return () => {
			observer.disconnect();
		};
	}, [handleObserver]);

	return (
		<div className="container mx-auto px-4 py-6">
			<h1 className="text-2xl font-bold mb-6">ブックマーク</h1>

			{/* レスポンシブグリッド */}
			<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
				{articles.map((article) => (
					<BookmarkCard
						key={article.id}
						article={article}
						onRemove={onRemove}
					/>
				))}
			</div>

			{/* 無限スクロールトリガー */}
			{hasMore && (
				<div
					ref={observerTarget}
					className="h-20 flex items-center justify-center mt-8"
				>
					<Spinner size="lg" />
				</div>
			)}

			{/* 初回ローディング表示 */}
			{isLoading && articles.length === 0 && (
				<div className="flex items-center justify-center py-16">
					<Spinner size="lg" />
				</div>
			)}
		</div>
	);
}
