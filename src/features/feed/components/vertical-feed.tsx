"use client";

/**
 * TikTok風の縦スクロールフィードコンポーネント
 * Article型に対応した新しい実装
 */

import { useCallback, useEffect, useRef, useState } from "react";
import { ScrollIndicator } from "@/components/scroll-indicator";
import type { Article } from "@/features/feed/types/article";
import { cn } from "@/lib/utils";
import { ArticleCard } from "./article-card";

export interface VerticalFeedProps {
	articles: Article[];
	className?: string;
	onItemChange?: (index: number) => void;
	onLoadMore?: () => void;
	hasMore?: boolean;
	isLoading?: boolean;
}

/**
 * 縦スクロールフィードコンポーネント
 */
export function VerticalFeed({
	articles,
	className,
	onItemChange,
	onLoadMore,
	hasMore = false,
	isLoading = false,
}: VerticalFeedProps) {
	const containerRef = useRef<HTMLDivElement>(null);
	const [currentIndex, setCurrentIndex] = useState(0);
	const observerRef = useRef<IntersectionObserver | null>(null);

	// Intersection Observerでスクロール検知
	useEffect(() => {
		if (!containerRef.current) return;

		const options = {
			root: containerRef.current,
			threshold: 0.5, // 50%表示されたらアクティブとみなす
		};

		observerRef.current = new IntersectionObserver((entries) => {
			entries.forEach((entry) => {
				if (entry.isIntersecting) {
					const index = Number(entry.target.getAttribute("data-index"));
					setCurrentIndex(index);
					onItemChange?.(index);

					// 最後から2番目の記事に到達したら次のページをロード
					if (index >= articles.length - 2 && hasMore && !isLoading) {
						onLoadMore?.();
					}
				}
			});
		}, options);

		// すべての記事要素を監視
		const elements = containerRef.current.querySelectorAll("[data-index]");
		elements.forEach((el) => {
			observerRef.current?.observe(el);
		});

		return () => {
			observerRef.current?.disconnect();
		};
	}, [articles.length, hasMore, isLoading, onItemChange, onLoadMore]);

	// 指定したインデックスの記事にスクロール
	const scrollToItem = useCallback((index: number) => {
		const element = containerRef.current?.querySelector(
			`[data-index="${index}"]`,
		);
		if (element) {
			element.scrollIntoView({ behavior: "smooth", block: "start" });
		}
	}, []);

	// キーボードナビゲーション（↑↓キー）
	useEffect(() => {
		const handleKeyDown = (e: KeyboardEvent) => {
			if (e.key === "ArrowDown") {
				e.preventDefault();
				scrollToItem(Math.min(articles.length - 1, currentIndex + 1));
			} else if (e.key === "ArrowUp") {
				e.preventDefault();
				scrollToItem(Math.max(0, currentIndex - 1));
			}
		};

		window.addEventListener("keydown", handleKeyDown);
		return () => window.removeEventListener("keydown", handleKeyDown);
	}, [currentIndex, articles.length, scrollToItem]);

	if (!articles.length) {
		return (
			<div className="flex h-screen items-center justify-center bg-black text-white">
				<p className="text-lg">記事がありません</p>
			</div>
		);
	}

	return (
		<div
			ref={containerRef}
			className={cn(
				"h-screen w-full overflow-y-auto overflow-x-hidden bg-black",
				"scroll-smooth snap-y snap-mandatory",
				"scrollbar-hide",
				className,
			)}
			style={{
				scrollbarWidth: "none",
				msOverflowStyle: "none",
			}}
		>
			{articles.map((article, index) => (
				<div
					key={article.id}
					data-index={index}
					className="h-screen w-full snap-start snap-always"
				>
					<ArticleCard article={article} isActive={index === currentIndex} />
				</div>
			))}

			{/* ローディングインジケーター */}
			{isLoading && (
				<div className="h-screen w-full snap-start snap-always flex items-center justify-center">
					<div className="text-white">読み込み中...</div>
				</div>
			)}

			{/* スクロールインジケーター */}
			<ScrollIndicator
				total={articles.length}
				current={currentIndex}
				onItemClick={scrollToItem}
			/>
		</div>
	);
}
