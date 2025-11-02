"use client";

/**
 * ブックマークボタンコンポーネント
 */

import { Bookmark } from "lucide-react";
import { useState } from "react";
import { toggleBookmark } from "@/app/actions/interactions";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export interface BookmarkButtonProps {
	articleId: string;
	initialIsBookmarked: boolean;
	className?: string;
}

export function BookmarkButton({
	articleId,
	initialIsBookmarked,
	className,
}: BookmarkButtonProps) {
	const [isBookmarked, setIsBookmarked] = useState(initialIsBookmarked);
	const [isLoading, setIsLoading] = useState(false);

	const handleClick = async () => {
		if (isLoading) return;

		// Optimistic Update
		const previousIsBookmarked = isBookmarked;

		setIsBookmarked(!isBookmarked);
		setIsLoading(true);

		try {
			const result = await toggleBookmark(articleId);

			if (!result.success) {
				// ロールバック
				setIsBookmarked(previousIsBookmarked);
				console.error("Bookmark failed:", result.error);
			} else {
				// サーバーの結果で確定
				setIsBookmarked(result.isBookmarked);
			}
		} catch (error) {
			// エラー時もロールバック
			setIsBookmarked(previousIsBookmarked);
			console.error("Bookmark error:", error);
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
				"flex items-center gap-2 text-white hover:text-yellow-500 transition-colors",
				isBookmarked && "text-yellow-500",
				className,
			)}
		>
			<Bookmark
				className={cn(
					"w-6 h-6 transition-all",
					isBookmarked && "fill-current scale-110",
				)}
			/>
		</Button>
	);
}
