"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import type { FeedItemData } from "@/features/feed/types";
import { PreviewErrorState } from "./preview-error-state";
import { UnauthenticatedHome } from "./unauthenticated-home";

/**
 * 未認証ホームラッパーのプロパティ
 */
export interface UnauthenticatedHomeWrapperProps {
	/** プレビュー記事（3つに制限） */
	articles: FeedItemData[];
	/** 初期エラー状態 */
	error?: string | null;
}

/**
 * 未認証ホームラッパーコンポーネント
 * エラーハンドリングとリトライ機能を提供
 */
export function UnauthenticatedHomeWrapper({
	articles,
	error: initialError,
}: UnauthenticatedHomeWrapperProps) {
	const router = useRouter();
	const [error, setError] = useState<string | null>(initialError || null);

	// グローバルエラーハンドラー
	useEffect(() => {
		// グローバルエラーハンドラー（オプション）
		const handleGlobalError = (event: ErrorEvent) => {
			console.error("Global error:", event.error);
		};

		window.addEventListener("error", handleGlobalError);

		return () => {
			window.removeEventListener("error", handleGlobalError);
		};
	}, []);

	// リトライハンドラー
	const handleRetry = () => {
		setError(null);
		// ページをリロードして再試行
		router.refresh();
	};

	// エラー状態の場合
	if (error) {
		return (
			<PreviewErrorState
				message={error}
				onRetry={handleRetry}
				showLoginPrompt={true}
			/>
		);
	}

	// 記事が空の場合もエラーとして扱う
	if (!articles || articles.length === 0) {
		return (
			<PreviewErrorState
				message="表示できる記事がありません"
				onRetry={handleRetry}
				showLoginPrompt={true}
			/>
		);
	}

	// 正常な場合は未認証ホームを表示
	return <UnauthenticatedHome articles={articles} />;
}
