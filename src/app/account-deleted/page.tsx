import { CheckCircle } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";

/**
 * アカウント削除完了ページ
 * アカウント削除が成功した後に表示されるページ
 */
export default function AccountDeletedPage() {
	return (
		<div className="min-h-screen bg-background flex items-center justify-center px-4">
			<Card className="max-w-md w-full">
				<CardHeader className="text-center space-y-4 pb-4">
					<div className="flex justify-center">
						<div className="rounded-full bg-green-100 dark:bg-green-900/20 p-3">
							<CheckCircle className="size-12 text-green-600 dark:text-green-400" />
						</div>
					</div>
					<div className="space-y-2">
						<h1 className="text-2xl font-bold">アカウントを削除しました</h1>
						<p className="text-muted-foreground">
							ご利用ありがとうございました
						</p>
					</div>
				</CardHeader>

				<CardContent className="space-y-6">
					<div className="space-y-4 text-sm text-muted-foreground">
						<p>
							あなたのアカウントとすべての関連データが完全に削除されました。
						</p>
						<p>
							TechTokをご利用いただき、誠にありがとうございました。
							またのご利用を心よりお待ちしております。
						</p>
					</div>

					<div className="space-y-3">
						<Button asChild className="w-full" size="lg">
							<Link href="/">ホームに戻る</Link>
						</Button>
						<Button asChild variant="outline" className="w-full" size="lg">
							<Link href="/login">新しいアカウントを作成</Link>
						</Button>
					</div>
				</CardContent>
			</Card>
		</div>
	);
}

