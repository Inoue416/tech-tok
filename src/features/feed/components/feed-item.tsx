import { MoreHorizontal } from "lucide-react";
import { Button } from "@/components/ui/button";
import { FeedContent } from "./feed-content";
import { FeedInfo } from "./feed-info";
import { FeedActions } from "./feed-actions";
import type { FeedItemProps } from "../types";

/**
 * フィードアイテムコンポーネント
 * コンテンツ、情報、アクションを組み合わせて表示
 */
export function FeedItem({
	data,
	isActive,
	onNext,
	onPrevious,
	onLike,
	onStock,
	onShare,
}: FeedItemProps) {
	return (
		<div className="relative h-full w-full bg-black">
			{/* メインコンテンツ */}
			<div className="h-full w-full">
				<FeedContent data={data} isActive={isActive} />
			</div>

			{/* オーバーレイコンテンツ */}
			<div className="absolute inset-0 flex flex-col justify-between p-4">
				{/* 上部：ナビゲーション */}
				<div className="flex justify-between">
					<div className="flex items-center gap-2">
						<Button
							type="button"
							variant="ghost"
							size="sm"
							className="text-white hover:bg-white/20"
							onClick={onPrevious}
						>
							↑
						</Button>
					</div>
					<Button
						type="button"
						variant="ghost"
						size="sm"
						className="text-white hover:bg-white/20"
					>
						<MoreHorizontal className="h-5 w-5" />
					</Button>
				</div>

				{/* 下部：情報とアクション */}
				<div className="flex items-end justify-between">
					{/* 左側：コンテンツ情報 */}
					<FeedInfo data={data} />

					{/* 右側：アクションボタン */}
					<FeedActions
						data={data}
						onLike={onLike}
						onStock={onStock}
						onShare={onShare}
						onNext={onNext}
					/>
				</div>
			</div>
		</div>
	);
}
