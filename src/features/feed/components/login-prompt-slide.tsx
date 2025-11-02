"use client";

import { Check } from "lucide-react";
import { Card } from "@/components/ui/card";
import { OAuthButtons } from "@/features/auth/components/oauth-buttons";

/**
 * ログインプロンプトスライドのプロパティ
 */
export interface LoginPromptSlideProps {
	/** ログイン後のオプションのコールバックURL */
	callbackUrl?: string;
}

/**
 * ログインプロンプトスライドコンポーネント
 * 未認証ユーザーに対してログインを促すフルスクリーンスライド
 */
export function LoginPromptSlide({
	callbackUrl = "/feed",
}: LoginPromptSlideProps) {
	return (
		<div className="relative h-full w-full bg-gradient-to-b from-gray-900 to-black flex items-center justify-center p-4">
			{/* 中央配置コンテンツカード */}
			<Card className="w-full max-w-md bg-gray-800/90 border-gray-700 p-8 space-y-6">
				{/* 見出し */}
				<div className="text-center space-y-2">
					<h2 className="text-3xl font-bold text-white">
						もっと見たいですか？
					</h2>
					<p className="text-gray-300 text-lg">
						ログインして全ての記事をお楽しみください
					</p>
					<p className="text-green-400 text-base font-semibold">
						完全無料で利用できます
					</p>
				</div>

				{/* メリットリスト */}
				<div className="space-y-3">
					<BenefitItem text="無制限の記事閲覧" />
					<BenefitItem text="お気に入り機能" />
					<BenefitItem text="コメント機能" />
					<BenefitItem text="フォロー機能" />
				</div>

				{/* OAuthボタン */}
				<div className="pt-4">
					<OAuthButtons callbackUrl={callbackUrl} />
				</div>
			</Card>
		</div>
	);
}

/**
 * メリットアイテムコンポーネント
 */
function BenefitItem({ text }: { text: string }) {
	return (
		<div className="flex items-center gap-3 text-gray-200">
			<div className="flex-shrink-0 w-6 h-6 rounded-full bg-green-500/20 flex items-center justify-center">
				<Check className="h-4 w-4 text-green-400" />
			</div>
			<span className="text-base">{text}</span>
		</div>
	);
}
