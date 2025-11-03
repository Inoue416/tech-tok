"use client";

import type { LucideIcon } from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";

interface NavigationItemProps {
	href: string;
	icon: LucideIcon;
	label: string;
	isActive: boolean;
	variant?: "bottom" | "sidebar";
}

export function NavigationItem({
	href,
	icon: Icon,
	label,
	isActive,
	variant = "bottom",
}: NavigationItemProps) {
	if (variant === "sidebar") {
		return (
			<Link
				href={href}
				className={cn(
					"flex items-center gap-3 px-4 py-3",
					"transition-all duration-300",
					"focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
					"rounded-lg",
					isActive
						? "bg-primary text-primary-foreground"
						: "text-muted-foreground hover:bg-muted hover:text-foreground",
				)}
				aria-label={label}
				aria-current={isActive ? "page" : undefined}
			>
				<Icon
					className={cn(
						"h-5 w-5 transition-transform",
						isActive && "scale-110",
					)}
					aria-hidden="true"
				/>
				<span
					className={cn("text-sm font-medium", isActive && "font-semibold")}
				>
					{label}
				</span>
			</Link>
		);
	}

	return (
		<Link
			href={href}
			className={cn(
				"flex items-center justify-center",
				"transition-all duration-300",
				"focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
				"rounded-full",
			)}
			aria-label={label}
			aria-current={isActive ? "page" : undefined}
		>
			<div
				className={cn(
					"flex items-center justify-center",
					"w-11 h-11 rounded-full",
					"transition-all duration-300",
					isActive
						? "bg-primary text-primary-foreground shadow-md shadow-primary/40"
						: "bg-transparent text-muted-foreground hover:bg-muted/50 hover:text-foreground",
				)}
			>
				<Icon
					className={cn(
						"h-5 w-5 transition-transform",
						isActive && "scale-110",
					)}
					aria-hidden="true"
				/>
			</div>
		</Link>
	);
}
