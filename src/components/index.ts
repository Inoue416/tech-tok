// 汎用コンポーネント
export { ScrollIndicator } from "./scroll-indicator";

// フィード機能（features/feedから再エクスポート）
export { VerticalScrollFeed, FeedItem } from "@/features/feed";
export { FeedDemo } from "@/features/feed/components/feed-demo";
export { sampleFeedData } from "@/features/feed/data/sample-data";

// 型定義
export type { FeedItemData, VerticalScrollFeedProps } from "@/features/feed";
