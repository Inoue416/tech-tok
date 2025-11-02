"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { ScrollIndicator } from "@/components/scroll-indicator";
import { FeedItem } from "@/features/feed/components/feed-item";
import type { FeedItemData } from "@/features/feed/types";
import { cn } from "@/lib/utils";
import { LoginPromptSlide } from "./login-prompt-slide";
import { PersistentLoginBanner } from "./persistent-login-banner";

/**
 * 未認証ホームのプロパティ
 */
export interface UnauthenticatedHomeProps {
	/** プレビュー記事（3つに制限） */
	articles: FeedItemData[];
}

/**
 * 未認証ホームコンポーネント
 * 3記事のプレビューとログインプロンプトを表示
 */
export function UnauthenticatedHome({ articles }: UnauthenticatedHomeProps) {
	const containerRef = useRef<HTMLDivElement>(null);
	const [currentIndex, setCurrentIndex] = useState(0);

	// 最初の3記事のみを使用
	const previewArticles = useMemo(() => articles.slice(0, 3), [articles]);

	// スクロールイベントを処理してcurrentIndexを更新
	useEffect(() => {
		const container = containerRef.current;
		if (!container) return;

		const handleScroll = () => {
			const scrollTop = container.scrollTop;
			const itemHeight = container.clientHeight;
			const index = Math.round(scrollTop / itemHeight);

			// インデックス3（ログインプロンプト）を超えないように制限
			const clampedIndex = Math.min(index, 3);
			setCurrentIndex(clampedIndex);
		};

		container.addEventListener("scroll", handleScroll);
		return () => container.removeEventListener("scroll", handleScroll);
	}, []);

	// 特定のアイテムにスクロール
	const scrollToItem = (index: number) => {
		const container = containerRef.current;
		if (!container) return;

		// インデックス3を超えないように制限
		const targetIndex = Math.min(index, 3);
		const itemHeight = container.clientHeight;
		container.scrollTo({
			top: targetIndex * itemHeight,
			behavior: "smooth",
		});
	};

	return (
		<div className="relative h-screen w-full">
			{/* 縦スクロールコンテナ */}
			<div
				ref={containerRef}
				className={cn(
					"h-screen w-full overflow-y-auto overflow-x-hidden bg-black",
					"scroll-smooth snap-y snap-mandatory",
					"scrollbar-hide",
				)}
				style={{
					scrollbarWidth: "none",
					msOverflowStyle: "none",
				}}
			>
				{/* プレビュー記事 */}
				{previewArticles.map((item, index) => (
					<div key={item.id} className="h-screen w-full snap-start snap-always">
						<FeedItem
							data={item}
							isActive={index === currentIndex}
							onNext={() => scrollToItem(Math.min(3, index + 1))}
							onPrevious={() => scrollToItem(Math.max(0, index - 1))}
						/>
					</div>
				))}

				{/* ログインプロンプトスライド（4番目の位置） */}
				<div className="h-screen w-full snap-start snap-always">
					<LoginPromptSlide callbackUrl="/feed" />
				</div>
			</div>

			{/* スクロールインジケーター */}
			<ScrollIndicator
				total={4}
				current={currentIndex}
				onItemClick={scrollToItem}
			/>

			{/* 永続的ログインバナー */}
			<PersistentLoginBanner
				currentIndex={currentIndex}
				totalPreview={3}
				callbackUrl="/feed"
			/>
		</div>
	);
}
