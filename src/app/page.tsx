"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { VerticalScrollFeed } from "@/features/feed/components/vertical-scroll-feed";
import { sampleFeedData } from "@/features/feed/data/sample-data";
import type { FeedItemData } from "@/features/feed/types";

// 一時的なモック認証状態（NextAuth.js実装まで）
const useAuth = () => {
	// 実際の実装では NextAuth.js の useSession を使用
	const [isLoggedIn, setIsLoggedIn] = useState(false);
	
	return {
		isLoggedIn,
		// デモ用の認証状態切り替え
		toggleAuth: () => setIsLoggedIn(!isLoggedIn)
	};
};

/**
 * ホームページコンポーネント
 * - 投稿を縦スクロールで表示
 * - 未ログインユーザーには制限された投稿数のみ表示
 * - ログイン促進機能
 */
export default function Home() {
	const { isLoggedIn, toggleAuth } = useAuth();
	const [feedData, setFeedData] = useState<FeedItemData[]>([]);
	const [showLoginPrompt, setShowLoginPrompt] = useState(false);

	// 投稿データの準備
	useEffect(() => {
		if (isLoggedIn) {
			// ログイン済み：全ての投稿を表示
			setFeedData(sampleFeedData);
		} else {
			// 未ログイン：最初の10件のみ表示
			const limitedData = sampleFeedData.slice(0, 10);
			setFeedData(limitedData);
		}
	}, [isLoggedIn]);

	// 未ログインユーザーがスクロールを続けた時のログイン促進
	const handleItemChange = (index: number) => {
		if (!isLoggedIn && index >= 9) {
			// 10番目の投稿に到達したらログイン促進を表示
			setShowLoginPrompt(true);
		}
	};

	// ログイン促進モーダルの表示
	if (showLoginPrompt && !isLoggedIn) {
		return (
			<div className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4">
				<Card className="w-full max-w-md">
					<CardHeader className="text-center">
						<CardTitle className="text-2xl">もっと見たいですか？</CardTitle>
						<CardDescription>
							ログインして全ての投稿をお楽しみください
						</CardDescription>
					</CardHeader>
					<CardContent className="space-y-4">
						<div className="grid grid-cols-2 gap-4">
							<Link href="/login">
								<Button className="w-full">
									ログイン
								</Button>
							</Link>
							<Button 
								variant="outline" 
								className="w-full"
								onClick={() => setShowLoginPrompt(false)}
							>
								戻る
							</Button>
						</div>
						{/* デモ用 - 実際の実装では削除 */}
						<Button 
							variant="ghost" 
							size="sm"
							className="w-full text-xs"
							onClick={() => {
								toggleAuth();
								setShowLoginPrompt(false);
							}}
						>
							[デモ] ログイン状態を切り替え
						</Button>
					</CardContent>
				</Card>
			</div>
		);
	}

	// メインフィード表示
	return (
		<div className="h-screen w-full bg-black">
			{/* デバッグ用ヘッダー（実際の実装では削除） */}
			<div className="absolute top-4 left-4 z-40">
				<Button
					variant="ghost"
					size="sm"
					className="text-white bg-black/50"
					onClick={toggleAuth}
				>
					[デモ] {isLoggedIn ? 'ログアウト' : 'ログイン'}
				</Button>
			</div>

			{feedData.length > 0 ? (
				<VerticalScrollFeed 
					items={feedData}
					onItemChange={handleItemChange}
				/>
			) : (
				<div className="flex h-screen items-center justify-center bg-black text-white">
					<div className="text-center">
						<h1 className="text-2xl font-bold mb-4">TechTok</h1>
						<p className="text-gray-400">コンテンツを読み込み中...</p>
					</div>
				</div>
			)}

			{/* 未ログインユーザー向けの制限表示 */}
			{!isLoggedIn && feedData.length > 0 && (
				<div className="absolute bottom-4 left-4 right-4 z-30 text-center">
					<Card className="bg-black/70 border-gray-700">
						<CardContent className="py-3">
							<p className="text-white text-sm">
								あと{sampleFeedData.length - feedData.length}件の投稿があります
							</p>
							<Link href="/login">
								<Button size="sm" className="mt-2">
									ログインして全て見る
								</Button>
							</Link>
						</CardContent>
					</Card>
				</div>
			)}
		</div>
	);
}
