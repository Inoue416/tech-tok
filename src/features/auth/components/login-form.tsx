"use client";

import { AppLogo } from "@/components/ui/app-logo";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { OAuthButtons } from "./oauth-buttons";

/**
 * ログインフォームのプロパティ
 */
export interface LoginFormProps {
	/** ログイン後のリダイレクト先 */
	callbackUrl?: string;
	/** エラーメッセージ */
	error?: string;
}

/**
 * OAuthログインフォームコンポーネント
 * GitHub、GoogleのOAuth認証に対応したログイン画面を提供
 */
export function LoginForm({ callbackUrl = "/feed", error }: LoginFormProps) {
	return (
		<div className="flex min-h-screen items-center justify-center bg-background px-4 py-12 sm:px-6 lg:px-8">
			<Card className="w-full max-w-md">
				<div className="flex justify-center pt-8 pb-4">
					<AppLogo size="large" showText />
				</div>
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
					<OAuthButtons callbackUrl={callbackUrl} />

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
