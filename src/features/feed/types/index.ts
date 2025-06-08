/**
 * フィードアイテムのデータ型定義
 */
export interface FeedItemData {
	id: string;
	type: "video" | "text";
	content: {
		url?: string;
		text?: string;
		title?: string;
		description?: string;
	};
	author: {
		id: string;
		avatar?: string;
		name: string;
	};
	stats: {
		likes: number;
		comments: number;
		shares: number;
	};
	isLiked?: boolean;
	hashtags?: string[];
}

/**
 * フィードアイテムのプロパティ型定義
 */
export interface FeedItemProps {
	data: FeedItemData;
	isActive: boolean;
	onNext?: () => void;
	onPrevious?: () => void;
	onLike?: (id: string) => void;
	onStock?: (id: string) => void;
	onShare?: (id: string) => void;
}

/**
 * 縦スクロールフィードのプロパティ型定義
 */
export interface VerticalScrollFeedProps {
	items: FeedItemData[];
	className?: string;
	onItemChange?: (index: number) => void;
	autoPlay?: boolean;
}

/**
 * フィードアクション関連の型定義
 */
export interface FeedActions {
	onLike: (id: string) => void;
	onStock: (id: string) => void;
	onShare: (id: string) => void;
}
