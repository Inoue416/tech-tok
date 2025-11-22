"use client";

import { Bookmark, Home, LogIn, User } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useMemo } from "react";
import { AppLogo } from "@/components/ui/app-logo";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { NavigationItem } from "./navigation-item";

interface SidebarNavigationProps {
	className?: string;
	isAuthenticated: boolean;
}

export function SidebarNavigation({
	className,
	isAuthenticated,
}: SidebarNavigationProps) {
	const pathname = usePathname();

	const items = useMemo(
		() => [
			{
				href: "/feed",
				icon: Home,
				label: "フィード",
				isActive: pathname === "/feed" || pathname === "/",
			},
			{
				href: "/bookmarks",
				icon: Bookmark,
				label: "ブックマーク",
				isActive: pathname === "/bookmarks",
			},
			{
				href: "/profile",
				icon: User,
				label: "プロフィール",
				isActive: pathname.startsWith("/profile"),
			},
		],
		[pathname],
	);

	return (
		<nav
			className={cn(
				"hidden md:flex",
				"fixed left-0 top-0 bottom-0 z-40",
				"w-64 flex-col gap-2 p-4",
				"bg-background border-r border-border",
				className,
			)}
			aria-label="メインナビゲーション"
		>
			<div className="px-2 py-4 border-b border-border">
				<AppLogo size="medium" showText />
			</div>

			{isAuthenticated ? (
				<div className="flex flex-col gap-1 mt-4">
					{items.map((item) => (
						<NavigationItem key={item.href} {...item} variant="sidebar" />
					))}
				</div>
			) : (
				<div className="flex flex-col gap-4 mt-4 px-2">
					<div className="space-y-2">
						<h3 className="text-sm font-semibold text-foreground">
							ログインして始めよう
						</h3>
						<p className="text-xs text-muted-foreground">
							記事のブックマークやいいねなど、さまざまな機能が利用できます
						</p>
					</div>
					<Button asChild size="lg" className="w-full">
						<Link href="/login">
							<LogIn className="mr-2 h-4 w-4" />
							ログイン
						</Link>
					</Button>
				</div>
			)}
		</nav>
	);
}
