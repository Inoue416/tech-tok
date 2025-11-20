"use client";

import { useSession } from "@/lib/auth-client";
import { BottomNavigation } from "./bottom-navigation";
import { MobileHeader } from "./mobile-header";
import { SidebarNavigation } from "./sidebar-navigation";

interface MainNavigationProps {
	className?: string;
}

export function MainNavigation({ className }: MainNavigationProps) {
	const { data: session } = useSession();

	// ログイン状態に応じてナビゲーションを表示
	const isAuthenticated = !!session?.user;

	return (
		<>
			{isAuthenticated && <MobileHeader className={className} />}
			<SidebarNavigation className={className} isAuthenticated={isAuthenticated} />
			{isAuthenticated && <BottomNavigation className={className} isAuthenticated={isAuthenticated} />}
		</>
	);
}
