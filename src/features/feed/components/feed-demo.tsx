"use client";

import { useState } from "react";
import { VerticalScrollFeed } from "./vertical-scroll-feed";
import { sampleFeedData } from "../data/sample-data";

/**
 * フィード機能のデモコンポーネント
 * 使用例とサンプルデータを提供
 */
export function FeedDemo() {
	const [currentItemIndex, setCurrentItemIndex] = useState(0);

	const handleItemChange = (index: number) => {
		setCurrentItemIndex(index);
		console.log(`現在のアイテム: ${index + 1}/${sampleFeedData.length}`);
	};

	const handleLike = (id: string) => {
		console.log(`アイテム ${id} にいいねしました`);
	};

	const handleComment = (id: string) => {
		console.log(`アイテム ${id} にコメントします`);
	};

	const handleShare = (id: string) => {
		console.log(`アイテム ${id} をシェアします`);
	};

	return (
		<div className="h-screen w-full">
			<VerticalScrollFeed
				items={sampleFeedData}
				onItemChange={handleItemChange}
				autoPlay={false}
			/>

			{/* デバッグ情報（開発時のみ表示） */}
			{process.env.NODE_ENV === "development" && (
				<div className="fixed left-4 top-4 z-50 rounded bg-black/80 p-2 text-white">
					<p className="text-sm">
						現在: {currentItemIndex + 1} / {sampleFeedData.length}
					</p>
					<p className="text-xs text-gray-300">
						{sampleFeedData[currentItemIndex]?.type} -{" "}
						{sampleFeedData[currentItemIndex]?.author.name}
					</p>
				</div>
			)}
		</div>
	);
}
