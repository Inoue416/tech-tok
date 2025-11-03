import { Bookmark } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export function BookmarksEmpty() {
	return (
		<div className="container mx-auto px-4 py-16">
			<div className="max-w-md mx-auto text-center">
				<div className="mb-6 flex justify-center">
					<div className="w-24 h-24 rounded-full bg-muted flex items-center justify-center">
						<Bookmark className="w-12 h-12 text-muted-foreground" />
					</div>
				</div>

				<h2 className="text-2xl font-bold mb-3">ブックマークがありません</h2>

				<p className="text-muted-foreground mb-6">
					気になる記事や投稿を見つけたら、ブックマークボタンをタップして保存しましょう。
					後で読みたいコンテンツをここで管理できます。
				</p>

				<Button asChild>
					<Link href="/feed">フィードを見る</Link>
				</Button>
			</div>
		</div>
	);
}
