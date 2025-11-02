"use client";

/**
 * 共有ボタンコンポーネント
 */

import { Share2 } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { ShareDialog } from "@/features/interactions/components/share-dialog";
import { cn } from "@/lib/utils";

export interface ShareButtonProps {
	articleId: string;
	articleTitle: string;
	initialCount: number;
	className?: string;
}

export function ShareButton({
	articleId,
	articleTitle,
	initialCount,
	className,
}: ShareButtonProps) {
	const [isDialogOpen, setIsDialogOpen] = useState(false);
	const [count, setCount] = useState(initialCount);

	const handleShareComplete = () => {
		setCount((prev) => prev + 1);
	};

	return (
		<>
			<Button
				type="button"
				variant="ghost"
				size="sm"
				onClick={() => setIsDialogOpen(true)}
				className={cn(
					"flex items-center gap-2 text-white hover:text-blue-500 transition-colors",
					className,
				)}
			>
				<Share2 className="w-6 h-6" />
				<span className="text-sm">{count}</span>
			</Button>

			<ShareDialog
				articleId={articleId}
				articleTitle={articleTitle}
				isOpen={isDialogOpen}
				onClose={() => setIsDialogOpen(false)}
				onShareComplete={handleShareComplete}
			/>
		</>
	);
}
