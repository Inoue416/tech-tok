"use client";

import { AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

/**
 * プレビューエラー状態のプロパティ
 */
export interface PreviewErrorStateProps {
	/** エラーメッセージ */
	message?: string;
	/** リトライボタンのコールバック */
	onRetry?: () => void;
	/** ログインプロンプトを表示するか */
	showLoginPrompt?: boolean;
}

/**
 * プレビューエラー状態コンポーネント
 * 記事取得エラー時に表示
 */
export function PreviewErrorState({
	message = "記事の読み込みに失敗しました",
	onRetry,
	showLoginPrompt = true,
}: PreviewErrorStateProps) {
	return (
		<div className="flex h-screen w-full items-center justify-center bg-black p-4">
			<Card className="max-w-md w-full bg-zinc-900 border-zinc-800 p-8">
				<div className="flex flex-col items-center text-center space-y-6">
					{/* エラーアイコン */}
					<div className="rounded-full bg-red-500/10 p-4">
						<AlertCircle className="h-12 w-12 text-red-500" />
					</div>

					{/* エラーメッセージ */}
					<div className="space-y-2">
						<h2 className="text-2xl font-bold text-white">
							エラーが発生しました
						</h2>
						<p className="text-zinc-400">{message}</p>
					</div>

					{/* アクションボタン */}
					<div className="flex flex-col w-full gap-3">
						{onRetry && (
							<Button
								onClick={onRetry}
								variant="default"
								size="lg"
								className="w-full"
							>
								再試行
							</Button>
						)}

						{showLoginPrompt && (
							<Button
								onClick={() => {
									window.location.href = "/login";
								}}
								variant="outline"
								size="lg"
								className="w-full"
							>
								ログインして続ける
							</Button>
						)}
					</div>

					{/* 補足情報 */}
					<p className="text-sm text-zinc-500">
						問題が解決しない場合は、しばらく時間をおいてから再度お試しください。
					</p>
				</div>
			</Card>
		</div>
	);
}
