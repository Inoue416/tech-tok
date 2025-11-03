"use client";

/**
 * いいねボタンコンポーネント
 */

import { Heart } from "lucide-react";
import { useState } from "react";
import { toggleLike } from "@/app/actions/interactions";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export interface LikeButtonProps {
	articleId: string;
	initialIsLiked: boolean;
	initialCount: number;
	className?: string;
}

export function LikeButton({
	articleId,
	initialIsLiked,
	initialCount,
	className,
}: LikeButtonProps) {
	const [isLiked, setIsLiked] = useState(initialIsLiked);
	const [count, setCount] = useState(initialCount);
	const [isLoading, setIsLoading] = useState(false);

	const handleClick = async () => {
		if (isLoading) return;

		// Optimistic Update
		const previousIsLiked = isLiked;
		const previousCount = count;

		setIsLiked(!isLiked);
		setCount((prev) => (isLiked ? prev - 1 : prev + 1));
		setIsLoading(true);

		try {
			const result = await toggleLike(articleId);

			if (!result.success) {
				// ロールバック
				setIsLiked(previousIsLiked);
				setCount(previousCount);
				console.error("Like failed:", result.error);
			} else {
				// サーバーの結果で確定
				setIsLiked(result.isLiked);
			}
		} catch (error) {
			// エラー時もロールバック
			setIsLiked(previousIsLiked);
			setCount(previousCount);
			console.error("Like error:", error);
		} finally {
			setIsLoading(false);
		}
	};

	return (
		<Button
			type="button"
			variant="ghost"
			size="sm"
			onClick={handleClick}
			disabled={isLoading}
			className={cn(
				"flex items-center gap-2 text-white hover:text-red-500 transition-colors",
				isLiked && "text-red-500",
				className,
			)}
		>
			<Heart
				className={cn(
					"w-6 h-6 transition-all",
					isLiked && "fill-current scale-110",
				)}
			/>
			<span className="text-sm">{count}</span>
		</Button>
	);
}
