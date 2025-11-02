import { redirect } from "next/navigation";
import { getFeedArticles } from "@/app/actions/feed";
import { getSession } from "@/lib/auth";
import { ClientFeed } from "./client-feed";

/**
 * フィードページ
 * 認証が必要なページ
 */
export default async function FeedPage() {
	const session = await getSession();

	// 未認証の場合はログインページにリダイレクト
	if (!session?.user) {
		redirect("/login");
	}

	// 初期データを取得
	const feedResult = await getFeedArticles({ limit: 10 });

	return (
		<ClientFeed
			initialArticles={feedResult.articles}
			initialCursor={feedResult.nextCursor}
			hasMore={feedResult.hasMore}
		/>
	);
}
