"use client";

import { cn } from "@/lib/utils";
import { ScrollIndicator } from "@/components/scroll-indicator";
import { useVerticalScroll } from "../hooks/use-vertical-scroll";
import { FeedItem } from "./feed-item";
import type { VerticalScrollFeedProps } from "../types";

/**
 * TikTok風の縦スクロールフィードコンポーネント
 * スナップスクロール機能とフルスクリーン表示を提供
 */
export function VerticalScrollFeed({
	items,
	className,
	onItemChange,
	autoPlay = false,
}: VerticalScrollFeedProps) {
	const { containerRef, currentIndex, scrollToItem } = useVerticalScroll({
		items,
		onItemChange,
		autoPlay,
	});

	if (!items.length) {
		return (
			<div className="flex h-screen items-center justify-center bg-black text-white">
				<p className="text-lg">コンテンツがありません</p>
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
			{items.map((item, index) => (
				<div key={item.id} className="h-screen w-full snap-start snap-always">
					<FeedItem
						data={item}
						isActive={index === currentIndex}
						onNext={() => scrollToItem(Math.min(items.length - 1, index + 1))}
						onPrevious={() => scrollToItem(Math.max(0, index - 1))}
					/>
				</div>
			))}

			{/* スクロールインジケーター */}
			<ScrollIndicator
				total={items.length}
				current={currentIndex}
				onItemClick={scrollToItem}
			/>
		</div>
	);
}
