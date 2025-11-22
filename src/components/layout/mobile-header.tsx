"use client";

import { usePathname } from "next/navigation";
import { AppLogo } from "@/components/ui/app-logo";
import { cn } from "@/lib/utils";

interface MobileHeaderProps {
	className?: string;
}

export function MobileHeader({ className }: MobileHeaderProps) {
	const pathname = usePathname();

	// 全画面表示ページでは非表示（完全な全画面体験を提供）
	if (pathname === "/feed" || pathname === "/") {
		return null;
	}

	// profileとbookmarkページでは中央にテキストを表示
	const showCenteredText =
		pathname === "/profile" || pathname === "/bookmarks";

	return (
		<header
			className={cn(
				"md:hidden",
				"fixed top-0 left-0 right-0 z-50",
				"bg-background/80 backdrop-blur-lg",
				"border-b border-border",
				"px-4 py-3",
				className,
			)}
		>
			<div className="relative flex items-center">
				{/* 左側：ロゴ */}
				<AppLogo size="small" showText={false} />

				{/* 中央：TECHTOK テキスト（profileとbookmarkのみ） */}
				{showCenteredText && (
					<div className="absolute left-1/2 -translate-x-1/2">
						<h1 className="text-lg font-bold">TECHTOK</h1>
					</div>
				)}
			</div>
		</header>
	);
}
