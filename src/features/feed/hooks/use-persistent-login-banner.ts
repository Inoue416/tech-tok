import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

/**
 * 永続的ログインバナーのフックオプション
 */
export interface UsePersistentLoginBannerOptions {
	/** 現在の記事インデックス */
	currentIndex: number;
	/** プレビュー記事の合計数 */
	totalPreview: number;
	/** ログイン後のコールバックURL */
	callbackUrl?: string;
}

/**
 * 永続的ログインバナーのロジックを管理するカスタムフック
 */
export function usePersistentLoginBanner({
	currentIndex,
	totalPreview,
	callbackUrl = "/feed",
}: UsePersistentLoginBannerOptions) {
	const router = useRouter();
	const [isVisible, setIsVisible] = useState(true);
	const [isLoading, setIsLoading] = useState(false);

	// スクロール位置に基づいてバナーの表示/非表示を制御
	useEffect(() => {
		// ログインプロンプト（インデックス3）に到達したら非表示
		if (currentIndex >= totalPreview) {
			setIsVisible(false);
		} else {
			setIsVisible(true);
		}
	}, [currentIndex, totalPreview]);

	/**
	 * ログインボタンのクリックハンドラー
	 */
	const handleLogin = () => {
		setIsLoading(true);
		// コールバックURLをクエリパラメータとして付与してログイン画面に遷移
		const loginUrl = callbackUrl ? `/login?callbackUrl=${encodeURIComponent(callbackUrl)}` : "/login";
		router.push(loginUrl);
	};

	return {
		isVisible,
		isLoading,
		handleLogin,
	};
}
