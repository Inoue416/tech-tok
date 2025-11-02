"use client";

import { BottomNavigation } from "./bottom-navigation";
import { SidebarNavigation } from "./sidebar-navigation";

interface MainNavigationProps {
	className?: string;
}

export function MainNavigation({ className }: MainNavigationProps) {
	return (
		<>
			<SidebarNavigation className={className} />
			<BottomNavigation className={className} />
		</>
	);
}
