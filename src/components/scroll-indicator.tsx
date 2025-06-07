import { cn } from "@/lib/utils";

interface ScrollIndicatorProps {
	total: number;
	current: number;
	onItemClick?: (index: number) => void;
	className?: string;
}

/**
 * 汎用的なスクロールインジケーターコンポーネント
 * 現在位置の表示とナビゲーション機能を提供
 */
export function ScrollIndicator({
	total,
	current,
	onItemClick,
	className,
}: ScrollIndicatorProps) {
	// インジケーターアイテムの配列を生成
	const indicators = Array.from({ length: total }, (_, index) => ({
		id: `indicator-${index}`,
		index,
		isActive: index === current,
	}));

	return (
		<div
			className={cn(
				"fixed right-4 top-1/2 z-50 flex -translate-y-1/2 flex-col gap-2",
				className,
			)}
		>
			{indicators.map((indicator) => (
				<button
					key={indicator.id}
					type="button"
					onClick={() => onItemClick?.(indicator.index)}
					className={cn(
						"h-2 w-2 rounded-full transition-all duration-200",
						indicator.isActive
							? "bg-white scale-125"
							: "bg-white/50 hover:bg-white/75",
					)}
					aria-label={`アイテム ${indicator.index + 1} に移動`}
				/>
			))}
		</div>
	);
}
