"use client";

import { useState } from "react";
import { Archive, BookOpen, Heart, Share } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import type { FeedItemData } from "../types";

interface FeedActionsProps {
	data: FeedItemData;
	onLike?: (id: string) => void;
	onStock?: (id: string) => void;
	onShare?: (id: string) => void;
	onNext?: () => void;
}

/**
 * フィードアイテムのアクションボタンコンポーネント
 * いいね、コメント、シェア、次へのボタンを表示
 */
export function FeedActions({
	data,
	onLike,
	onStock,
	onShare,
	onNext,
}: FeedActionsProps) {
	const [isLiked, setIsLiked] = useState(data.isLiked || false);

	const handleLike = () => {
		setIsLiked(!isLiked);
		onLike?.(data.id);
	};

	const formatCount = (count: number): string => {
		if (count >= 1000000) {
			return `${(count / 1000000).toFixed(1)}M`;
		}
		if (count >= 1000) {
			return `${(count / 1000).toFixed(1)}K`;
		}
		return count.toString();
	};

	return (
		<div className="flex flex-col items-center gap-4">
			{/* いいねボタン */}
			<Button
				type="button"
				variant="ghost"
				size="sm"
				className={cn(
					"flex flex-col items-center gap-1 text-white hover:bg-white/20",
					isLiked && "text-red-500",
				)}
				onClick={handleLike}
			>
				<Heart className={cn("h-6 w-6", isLiked && "fill-current")} />
				<span className="text-xs">
					{formatCount(data.stats.likes + (isLiked ? 1 : 0))}
				</span>
			</Button>

			{/* 記事のストック */}
			<Button
				type="button"
				variant="ghost"
				size="sm"
				className={cn(
					"flex flex-col items-center gap-1 text-white hover:bg-white/20",
					isLiked && "text-red-500",
				)}
				onClick={() => onStock?.(data.id)}
			>
				<Archive className={cn("h-6 w-6", isLiked && "fill-current")} />
			</Button>

			{/* 記事詳細へ移動 */}
			<a href="/" target="_blank" rel="noopener noreferrer">
				<Button
					type="button"
					variant="ghost"
					size="sm"
					className="flex flex-col items-center gap-1 text-white hover:bg-white/20"
				>
					<BookOpen className="h-6 w-6" />
				</Button>
			</a>

			{/* シェアボタン */}
			<Button
				type="button"
				variant="ghost"
				size="sm"
				className="flex flex-col items-center gap-1 text-white hover:bg-white/20"
				onClick={() => onShare?.(data.id)}
			>
				<Share className="h-6 w-6" />
			</Button>

			{/* 次へボタン */}
			<Button
				type="button"
				variant="ghost"
				size="sm"
				className="text-white hover:bg-white/20"
				onClick={onNext}
			>
				↓
			</Button>
		</div>
	);
}
