import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { getBookmarkedArticles } from "@/app/actions/bookmarks";
import { getSession } from "@/lib/auth";
import { ClientBookmarks } from "./client-bookmarks";

export const metadata: Metadata = {
	title: "ブックマーク | TechTok",
	description:
		"保存した技術記事や投稿を管理・閲覧できます。後で読みたいコンテンツをここで整理しましょう。",
};

export default async function BookmarksPage() {
	// 認証チェック
	const session = await getSession();
	if (!session?.user) {
		redirect("/login");
	}

	// 初期データ取得
	const initialData = await getBookmarkedArticles({ limit: 20 });

	return <ClientBookmarks initialData={initialData} />;
}
