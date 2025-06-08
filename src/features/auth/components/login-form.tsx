"use client";

import { Button } from "@/components/ui/button";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

/**
 * OAuthプロバイダーの型定義
 */
type OAuthProvider = "github" | "google";

/**
 * ログインフォームのプロパティ
 */
export interface LoginFormProps {
	/** ログイン処理中かどうか */
	isLoading?: boolean;
	/** OAuthログインのコールバック関数 */
	onOAuthLogin?: (provider: OAuthProvider) => void;
	/** エラーメッセージ */
	error?: string;
}

/**
 * OAuthログインフォームコンポーネント
 * GitHub、GoogleのOAuth認証に対応したログイン画面を提供
 */
export function LoginForm({
	isLoading = false,
	onOAuthLogin,
	error,
}: LoginFormProps) {
	/**
	 * OAuthログインボタンのクリックハンドラー
	 */
	const handleOAuthLogin = (provider: OAuthProvider) => {
		if (onOAuthLogin && !isLoading) {
			onOAuthLogin(provider);
		}
	};

	return (
		<div className="flex min-h-screen items-center justify-center bg-background px-4 py-12 sm:px-6 lg:px-8">
			<Card className="w-full max-w-md">
				<CardHeader className="space-y-1">
					<CardTitle className="text-2xl font-bold text-center">
						ログイン
					</CardTitle>
					<CardDescription className="text-center">
						GitHubまたはGoogleでログインしてください
					</CardDescription>
				</CardHeader>
				<CardContent className="space-y-4">
					{/* エラーメッセージ表示 */}
					{error && (
						<div className="rounded-md bg-destructive/15 p-3">
							<p className="text-sm text-destructive">{error}</p>
						</div>
					)}

					{/* OAuthログインボタン */}
					<div className="space-y-3">
						{/* GitHubログインボタン */}
						<Button
							variant="outline"
							className="w-full"
							onClick={() => handleOAuthLogin("github")}
							disabled={isLoading}
						>
							<svg
								className="mr-2 h-4 w-4"
								viewBox="0 0 24 24"
								aria-label="GitHubのロゴ"
								role="img"
								aria-hidden="false"
							>
								<path
									fill="currentColor"
									d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"
								/>
							</svg>
							{isLoading ? "ログイン中..." : "GitHubでログイン"}
						</Button>

						{/* 区切り線 */}
						<div className="relative">
							<div className="absolute inset-0 flex items-center">
								<Separator className="w-full" />
							</div>
							<div className="relative flex justify-center text-xs uppercase">
								<span className="bg-background px-2 text-muted-foreground">
									または
								</span>
							</div>
						</div>

						{/* Googleログインボタン */}
						<Button
							variant="outline"
							className="w-full"
							onClick={() => handleOAuthLogin("google")}
							disabled={isLoading}
						>
							<svg
								className="mr-2 h-4 w-4"
								viewBox="0 0 24 24"
								aria-label="Googleのロゴ"
								role="img"
								aria-hidden="false"
							>
								<path
									fill="currentColor"
									d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
								/>
								<path
									fill="currentColor"
									d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
								/>
								<path
									fill="currentColor"
									d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
								/>
								<path
									fill="currentColor"
									d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
								/>
							</svg>
							{isLoading ? "ログイン中..." : "Googleでログイン"}
						</Button>
					</div>

					{/* 利用規約・プライバシーポリシーへのリンク */}
					<div className="text-center text-xs text-muted-foreground">
						ログインすることで、
						<a href="/terms" className="underline hover:text-primary">
							利用規約
						</a>
						および
						<a href="/privacy" className="underline hover:text-primary">
							プライバシーポリシー
						</a>
						に同意したものとみなされます。
					</div>
				</CardContent>
			</Card>
		</div>
	);
}
