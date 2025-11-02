"use client";

import { Bookmark, Home, User } from "lucide-react";
import { usePathname } from "next/navigation";
import { useMemo } from "react";
import { cn } from "@/lib/utils";
import { NavigationItem } from "./navigation-item";

interface SidebarNavigationProps {
	className?: string;
}

export function SidebarNavigation({ className }: SidebarNavigationProps) {
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
			<div className="flex flex-col gap-1 mt-4">
				{items.map((item) => (
					<NavigationItem key={item.href} {...item} variant="sidebar" />
				))}
			</div>
		</nav>
	);
}
