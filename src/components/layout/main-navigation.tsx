"use client";

import { useSession } from "@/lib/auth-client";
import { BottomNavigation } from "./bottom-navigation";
import { SidebarNavigation } from "./sidebar-navigation";

interface MainNavigationProps {
	className?: string;
}

export function MainNavigation({ className }: MainNavigationProps) {
	const { data: session } = useSession();

	// セッションがない場合は何も表示しない
	if (!session) {
		return null;
	}

	return (
		<>
			<SidebarNavigation className={className} />
			<BottomNavigation className={className} />
		</>
	);
}
