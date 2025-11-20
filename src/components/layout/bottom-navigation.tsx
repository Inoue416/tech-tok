"use client";

import { Bookmark, Home, LogIn, User } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useMemo } from "react";
import { NavigationItem } from "@/components/layout/navigation-item";
import { cn } from "@/lib/utils";

interface BottomNavigationProps {
	className?: string;
	isAuthenticated: boolean;
}

export function BottomNavigation({
	className,
	isAuthenticated,
}: BottomNavigationProps) {
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
				"fixed bottom-8 left-0 right-0 z-50",
				"flex justify-center",
				"md:hidden",
				className,
			)}
			aria-label="メインナビゲーション"
		>
			<div
				className={cn(
					"flex items-center gap-1",
					"bg-background/80 backdrop-blur-lg",
					"border border-border",
					"rounded-full px-3 py-2",
					"shadow-lg shadow-black/10",
				)}
			>
				{isAuthenticated ? (
					items.map((item) => (
						<NavigationItem key={item.href} {...item} />
					))
				) : (
					<Link
						href="/login"
						className={cn(
							"flex items-center gap-2",
							"px-4 py-2 rounded-full",
							"text-sm font-medium",
							"bg-primary text-primary-foreground",
							"hover:bg-primary/90",
							"transition-colors",
						)}
					>
						<LogIn className="h-4 w-4" />
						<span>ログイン</span>
					</Link>
				)}
			</div>
		</nav>
	);
}
