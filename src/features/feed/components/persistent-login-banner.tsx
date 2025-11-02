"use client";

import { Button } from "@/components/ui/button";
import { usePersistentLoginBanner } from "../hooks/use-persistent-login-banner";

/**
 * 永続的ログインバナーのプロパティ
 */
export interface PersistentLoginBannerProps {
	/** 現在の記事インデックス（0-2） */
	currentIndex: number;
	/** プレビュー記事の合計数 */
	totalPreview: number;
	/** ログイン後のオプションのコールバックURL */
	callbackUrl?: string;
}

/**
 * 永続的ログインバナーコンポーネント
 * 画面下部に固定表示され、進捗インジケーターとログインボタンを提供
 */
export function PersistentLoginBanner({
	currentIndex,
	totalPreview,
	callbackUrl = "/feed",
}: PersistentLoginBannerProps) {
	const { isVisible, isLoading, handleLogin } = usePersistentLoginBanner({
		currentIndex,
		totalPreview,
		callbackUrl,
	});

	return (
		<div
			className={`fixed bottom-0 left-0 right-0 z-50 transition-all duration-300 ${
				isVisible
					? "translate-y-0 opacity-100"
					: "translate-y-full opacity-0 pointer-events-none"
			}`}
		>
			<div className="bg-gray-900/95 backdrop-blur-sm border-t border-gray-800 px-4 py-3">
				<div className="max-w-screen-xl mx-auto flex items-center justify-between gap-4">
					{/* 進捗インジケーター */}
					<div className="flex items-center gap-2">
						<span className="text-sm text-gray-400">記事</span>
						<span className="text-base font-semibold text-white">
							{currentIndex + 1} / {totalPreview}
						</span>
					</div>

					{/* ログインボタン */}
					<Button
						size="sm"
						onClick={handleLogin}
						disabled={isLoading}
						className="bg-green-600 hover:bg-green-700 text-white"
					>
						{isLoading ? "ログイン中..." : "ログインして続きを見る"}
					</Button>
				</div>
			</div>
		</div>
	);
}
