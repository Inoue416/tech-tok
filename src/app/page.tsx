import { redirect } from "next/navigation";
import { getFeedArticles } from "@/app/actions/feed";
import { UnauthenticatedHomeWrapper } from "@/features/feed/components/unauthenticated-home-wrapper";
import { articleToFeedItemData } from "@/features/feed/types/converters";
import { getSession } from "@/lib/auth";

/**
 * ホームページコンポーネント（サーバーコンポーネント）
 * - 認証済みユーザーを/feedにリダイレクト
 * - 未認証ユーザーには最初の3記事のプレビューを表示
 * - エラーハンドリングを実装
 */
export default async function Home() {
	// セッションチェック（エラー時は未認証として扱う）
	let session = null;
	try {
		session = await getSession();
	} catch (error) {
		console.error("Session check error:", error);
		// 未認証として扱い、処理を継続
		// セッションチェックエラーは致命的ではないため、プレビューを表示
	}

	// 認証済みユーザーは/feedにリダイレクト
	if (session?.user) {
		try {
			redirect("/feed");
		} catch (error) {
			// リダイレクトエラーの処理
			// Next.jsのredirect()は内部的にエラーをthrowするため、
			// 通常のリダイレクトとエラーを区別する必要がある
			console.error("Redirect error:", error);

			// NEXT_REDIRECTエラーは正常なリダイレクトなので再スロー
			if (error && typeof error === "object" && "digest" in error) {
				throw error;
			}

			// その他のエラーはフォールバック処理へ
			// クライアントサイドでのフォールバックナビゲーションを試みる
		}
	}

	// プレビュー記事を取得（最初の3記事）
	let feedItems: ReturnType<typeof articleToFeedItemData>[] = [];
	let error: string | null = null;

	try {
		const { articles } = await getFeedArticles({ limit: 3 });

		// ArticleをFeedItemDataに変換
		feedItems = articles.map(articleToFeedItemData);

		// 記事が取得できなかった場合
		if (feedItems.length === 0) {
			error =
				"現在表示できる記事がありません。しばらくしてから再度お試しください。";
		}
	} catch (fetchError) {
		// 記事取得エラーの処理
		console.error("Article fetch error:", fetchError);
		error =
			fetchError instanceof Error
				? fetchError.message
				: "記事の読み込みに失敗しました。ネットワーク接続を確認してください。";
	}

	// 未認証ホームラッパーコンポーネントをレンダリング
	// エラー状態とリトライ機能を含む
	return <UnauthenticatedHomeWrapper articles={feedItems} error={error} />;
}
