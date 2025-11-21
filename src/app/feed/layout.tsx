import type { ReactNode } from "react";

/**
 * フィードページ専用レイアウト
 * TikTok風の完全な全画面体験を提供
 * 実際のpadding/margin制御はMainContentWrapperで行う
 */
export default function FeedLayout({
	children,
}: {
	children: ReactNode;
}) {
	return <>{children}</>;
}

