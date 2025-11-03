"use client";

import { AppLogo } from "@/components/ui/app-logo";
import { cn } from "@/lib/utils";

interface MobileHeaderProps {
	className?: string;
}

export function MobileHeader({ className }: MobileHeaderProps) {
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
			<AppLogo size="small" showText={false} />
		</header>
	);
}
