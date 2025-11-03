"use client";

/**
 * 共有ダイアログコンポーネント
 */

import { Check, Copy, Share2 } from "lucide-react";
import { useState } from "react";
import { trackShare } from "@/app/actions/interactions";
import { Button } from "@/components/ui/button";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogHeader,
	DialogTitle,
} from "@/components/ui/dialog";

export interface ShareDialogProps {
	articleId: string;
	articleTitle: string;
	isOpen: boolean;
	onClose: () => void;
	onShareComplete?: () => void;
}

export function ShareDialog({
	articleId,
	articleTitle,
	isOpen,
	onClose,
	onShareComplete,
}: ShareDialogProps) {
	const [isCopied, setIsCopied] = useState(false);

	// 共有URL（現在のページURL + 記事ID）
	const shareUrl =
		typeof window !== "undefined"
			? `${window.location.origin}/feed?article=${articleId}`
			: "";

	// Web Share API を使用した共有（モバイル）
	const handleNativeShare = async () => {
		if (navigator.share) {
			try {
				await navigator.share({
					title: articleTitle,
					url: shareUrl,
				});

				// 共有をトラッキング
				await trackShare(articleId);
				onShareComplete?.();
				onClose();
			} catch (error) {
				// ユーザーがキャンセルした場合はエラーを無視
				if ((error as Error).name !== "AbortError") {
					console.error("Share error:", error);
				}
			}
		}
	};

	// URLをクリップボードにコピー
	const handleCopyLink = async () => {
		try {
			await navigator.clipboard.writeText(shareUrl);
			setIsCopied(true);

			// 共有をトラッキング
			await trackShare(articleId);
			onShareComplete?.();

			// 2秒後にアイコンをリセット
			setTimeout(() => {
				setIsCopied(false);
			}, 2000);
		} catch (error) {
			console.error("Copy error:", error);
		}
	};

	return (
		<Dialog open={isOpen} onOpenChange={onClose}>
			<DialogContent className="sm:max-w-md">
				<DialogHeader>
					<DialogTitle>記事を共有</DialogTitle>
					<DialogDescription>この記事を友達と共有しましょう</DialogDescription>
				</DialogHeader>

				<div className="space-y-4">
					{/* Web Share API（モバイル） */}
					{typeof window !== "undefined" && "share" in navigator && (
						<Button
							type="button"
							onClick={handleNativeShare}
							className="w-full"
							variant="default"
						>
							<Share2 className="w-4 h-4 mr-2" />
							共有する
						</Button>
					)}

					{/* URLコピー */}
					<div className="flex items-center gap-2">
						<input
							type="text"
							value={shareUrl}
							readOnly
							className="flex-1 px-3 py-2 text-sm border rounded-md bg-background"
						/>
						<Button
							type="button"
							size="sm"
							variant="outline"
							onClick={handleCopyLink}
							className="flex-shrink-0"
						>
							{isCopied ? (
								<>
									<Check className="w-4 h-4 mr-2" />
									コピー済み
								</>
							) : (
								<>
									<Copy className="w-4 h-4 mr-2" />
									コピー
								</>
							)}
						</Button>
					</div>
				</div>
			</DialogContent>
		</Dialog>
	);
}
