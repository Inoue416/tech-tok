"use client";

import { Bookmark, ExternalLink, Trash2 } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
} from "@/components/ui/dialog";
import type { Article } from "@/features/feed/types/article";
import { formatDistanceToNow } from "@/lib/utils";

interface BookmarkCardProps {
	article: Article;
	onRemove: (feedItemId: string) => Promise<void>;
}

export function BookmarkCard({ article, onRemove }: BookmarkCardProps) {
	const [isRemoving, setIsRemoving] = useState(false);
	const [showConfirm, setShowConfirm] = useState(false);

	const handleRemove = async () => {
		setIsRemoving(true);
		try {
			await onRemove(article.id);
		} catch (error) {
			console.error("Failed to remove bookmark:", error);
			setIsRemoving(false);
		}
	};

	return (
		<>
			<Card className="group hover:shadow-lg transition-shadow overflow-hidden">
				{/* サムネイル */}
				<Link href={`/feed?item=${article.id}`}>
					<div className="relative aspect-video bg-muted overflow-hidden">
						{article.authorAvatar ? (
							<Image
								src={article.authorAvatar}
								alt={article.title}
								fill
								className="object-cover group-hover:scale-105 transition-transform"
							/>
						) : (
							<div className="flex items-center justify-center h-full">
								<Bookmark className="w-12 h-12 text-muted-foreground" />
							</div>
						)}

						{/* コンテンツタイプバッジ */}
						<div className="absolute top-2 right-2">
							<span className="px-2 py-1 text-xs bg-black/70 text-white rounded">
								{article.type === "rss" ? "RSS" : "投稿"}
							</span>
						</div>
					</div>
				</Link>

				<CardContent className="p-4">
					{/* タイトル */}
					<Link href={`/feed?item=${article.id}`}>
						<h3 className="font-semibold line-clamp-2 hover:text-primary transition-colors">
							{article.title}
						</h3>
					</Link>

					{/* 説明 */}
					{article.content && (
						<p className="text-sm text-muted-foreground line-clamp-2 mt-2">
							{article.content}
						</p>
					)}

					{/* メタ情報 */}
					<div className="flex items-center gap-2 mt-3 text-xs text-muted-foreground">
						<span>{article.authorName}</span>
						<span>•</span>
						<span>{formatDistanceToNow(article.publishedAt)}</span>
					</div>
				</CardContent>

				<CardFooter className="p-4 pt-0 flex justify-between">
					{/* 外部リンク（RSS記事の場合） */}
					{article.type === "rss" && article.originalUrl && (
						<Button variant="ghost" size="sm" asChild>
							<a
								href={article.originalUrl}
								target="_blank"
								rel="noopener noreferrer"
							>
								<ExternalLink className="w-4 h-4 mr-1" />
								元記事
							</a>
						</Button>
					)}

					{/* 削除ボタン */}
					<Button
						variant="ghost"
						size="sm"
						onClick={() => setShowConfirm(true)}
						disabled={isRemoving}
						className="ml-auto text-destructive hover:text-destructive"
					>
						<Trash2 className="w-4 h-4 mr-1" />
						削除
					</Button>
				</CardFooter>
			</Card>

			{/* 削除確認ダイアログ */}
			<Dialog open={showConfirm} onOpenChange={setShowConfirm}>
				<DialogContent className="sm:max-w-md">
					<DialogHeader>
						<DialogTitle>ブックマークを削除</DialogTitle>
						<DialogDescription>
							このブックマークを削除してもよろしいですか？
						</DialogDescription>
					</DialogHeader>
					<DialogFooter className="flex gap-2">
						<Button variant="outline" onClick={() => setShowConfirm(false)}>
							キャンセル
						</Button>
						<Button variant="destructive" onClick={handleRemove}>
							削除する
						</Button>
					</DialogFooter>
				</DialogContent>
			</Dialog>
		</>
	);
}
