import type { Article } from "../types/article";
import type { FeedItemData } from "../types";

/**
 * フィード機能のサンプルデータ（Storybook用）
 */
export const sampleFeedData: FeedItemData[] = [
	{
		id: "1",
		type: "video",
		content: {
			url: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4",
			description: "美しい自然の風景をお楽しみください 🌸",
		},
		author: {
			id: "user1",
			name: "nature_lover",
			avatar:
				"https://secure.gravatar.com/avatar/a31503cd951e57579074a84fbe79c3cc",
		},
		stats: {
			likes: 12500,
			comments: 234,
			shares: 89,
		},
		hashtags: ["自然", "風景", "癒し"],
	},
	{
		id: "2",
		type: "text",
		content: {
			title: "今日の名言",
			text: "成功は最終的なものではなく、失敗は致命的なものではない。\n続ける勇気こそが重要なのだ。\n\n- ウィンストン・チャーチル",
		},
		author: {
			id: "user3",
			name: "daily_quotes",
		},
		stats: {
			likes: 15600,
			comments: 89,
			shares: 234,
		},
		hashtags: ["名言", "励まし", "モチベーション"],
	},
	{
		id: "3",
		type: "video",
		content: {
			url: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4",
			description: "クリエイティブな映像作品をお楽しみください 🎬",
		},
		author: {
			id: "user5",
			name: "creative_studio",
		},
		stats: {
			likes: 23400,
			comments: 567,
			shares: 189,
		},
		hashtags: ["アート", "映像", "クリエイティブ"],
	},
];

/**
 * 未認証ホーム用のサンプル記事データ（Storybook用）
 */
export const sampleArticles: Article[] = [
	{
		id: "article-1",
		type: "rss",
		title: "React 19の新機能とServer Components完全ガイド",
		content:
			"React 19では、Server Componentsが正式に安定版として導入されました。これにより、サーバーサイドでのレンダリングがより効率的になり、クライアントに送信されるJavaScriptの量を大幅に削減できます。\n\nServer Componentsを使用することで、データフェッチングがより簡潔になり、ウォーターフォールの問題も解決されます。また、Suspenseとの統合により、ローディング状態の管理も改善されました。",
		authorName: "Tech Blog Japan",
		authorAvatar:
			"https://secure.gravatar.com/avatar/a31503cd951e57579074a84fbe79c3cc",
		originalUrl: "https://example.com/react-19-server-components",
		publishedAt: new Date("2025-01-15T10:00:00Z"),
		likeCount: 1245,
		commentCount: 89,
		shareCount: 234,
		isLiked: false,
		isBookmarked: false,
		categories: [
			{ id: "react", name: "React", color: "#61DAFB" },
			{ id: "javascript", name: "JavaScript", color: "#F7DF1E" },
		],
	},
	{
		id: "article-2",
		type: "rss",
		title: "Next.js 15のApp Router最適化テクニック",
		content:
			"Next.js 15では、App Routerのパフォーマンスがさらに向上しました。新しいキャッシング戦略により、ページの読み込み速度が大幅に改善されています。\n\n特に注目すべきは、Partial Prerenderingの機能です。これにより、静的な部分と動的な部分を効率的に組み合わせることができ、SEOとパフォーマンスの両立が可能になりました。\n\nまた、Server Actionsも改善され、フォームの送信やデータの更新がよりシンプルに実装できるようになっています。",
		authorName: "Frontend Weekly",
		authorAvatar:
			"https://secure.gravatar.com/avatar/b31503cd951e57579074a84fbe79c3dd",
		originalUrl: "https://example.com/nextjs-15-app-router",
		publishedAt: new Date("2025-01-14T14:30:00Z"),
		likeCount: 987,
		commentCount: 56,
		shareCount: 178,
		isLiked: false,
		isBookmarked: false,
		categories: [
			{ id: "nextjs", name: "Next.js", color: "#000000" },
			{ id: "react", name: "React", color: "#61DAFB" },
		],
	},
	{
		id: "article-3",
		type: "post",
		title: "TypeScript 5.4の新機能で型安全性を向上させる方法",
		content:
			"TypeScript 5.4では、いくつかの新機能が追加されました。特に注目すべきは、型推論の改善とパフォーマンスの向上です。\n\n新しい`NoInfer`ユーティリティ型を使用することで、ジェネリック型の推論をより細かく制御できるようになりました。これにより、予期しない型推論のエラーを防ぐことができます。\n\nまた、コンパイラのパフォーマンスも大幅に向上しており、大規模なプロジェクトでもビルド時間が短縮されています。",
		authorName: "TypeScript Master",
		authorAvatar:
			"https://secure.gravatar.com/avatar/c31503cd951e57579074a84fbe79c3ee",
		publishedAt: new Date("2025-01-13T09:15:00Z"),
		likeCount: 756,
		commentCount: 42,
		shareCount: 123,
		isLiked: false,
		isBookmarked: false,
		categories: [
			{ id: "typescript", name: "TypeScript", color: "#3178C6" },
			{ id: "javascript", name: "JavaScript", color: "#F7DF1E" },
		],
	},
	{
		id: "article-4",
		type: "rss",
		title: "Tailwind CSS v4のベータ版がリリース - より高速に",
		content:
			"Tailwind CSS v4のベータ版がリリースされました。最大の変更点は、新しいエンジンの採用により、コンパイル速度が大幅に向上したことです。\n\n従来のバージョンと比較して最大10倍高速化されており、大規模なプロジェクトでも快適に開発できます。また、新しいカラーパレットや、より細かい制御が可能なユーティリティクラスも追加されています。",
		authorName: "CSS Tricks",
		authorAvatar:
			"https://secure.gravatar.com/avatar/d31503cd951e57579074a84fbe79c3ff",
		originalUrl: "https://example.com/tailwind-v4-beta",
		publishedAt: new Date("2025-01-12T16:45:00Z"),
		likeCount: 2134,
		commentCount: 167,
		shareCount: 445,
		isLiked: false,
		isBookmarked: false,
		categories: [
			{ id: "css", name: "CSS", color: "#1572B6" },
			{ id: "tailwind", name: "Tailwind CSS", color: "#06B6D4" },
		],
	},
];
