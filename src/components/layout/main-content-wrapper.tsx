"use client";

import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

interface MainContentWrapperProps {
	children: React.ReactNode;
}

/**
 * メインコンテンツラッパー
 * ページに応じて適切なpaddingとmarginを適用
 */
export function MainContentWrapper({ children }: MainContentWrapperProps) {
	const pathname = usePathname();

	// 全画面表示が必要なページ（TikTok風のフィード表示）
	const isFullScreenPage = pathname === "/feed" || pathname === "/";

	return (
		<div
			className={cn(
				"min-h-screen",
				isFullScreenPage
					? // 全画面ページ: paddingなし、PCでサイドバー分のマージンのみ
						"md:ml-64"
					: // その他のページ: 通常のpadding
						"pt-16 md:pt-0 pb-24 md:pb-0 md:ml-64",
			)}
		>
			{children}
		</div>
	);
}

