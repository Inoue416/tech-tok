import type {
	ProfilePost,
	Technology,
	UserProfile,
} from "@/features/profile/types";
import { getTechnologyById } from "./technology-options";

/**
 * サンプルユーザープロフィールデータ
 */
export const sampleProfile: UserProfile = {
	id: "user-1",
	username: "tech_developer",
	displayName: "田中 太郎",
	avatar:
		"https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face",
	bio: "フルスタックエンジニアとして5年間活動しています。React、TypeScript、Node.jsが得意です。新しい技術を学ぶことが好きで、オープンソースプロジェクトにも積極的に貢献しています。",
	technologies: [
		getTechnologyById("tech-ts"),
		getTechnologyById("tech-react"),
		getTechnologyById("tech-nextjs"),
		getTechnologyById("tech-nodejs"),
		getTechnologyById("tech-postgresql"),
		getTechnologyById("tech-docker"),
		getTechnologyById("tech-aws"),
		getTechnologyById("tech-graphql"),
	].filter((tech): tech is Technology => tech !== undefined),
	stats: {
		followers: 1250,
		following: 345,
		likedPosts: 89,
		bookmarkedPosts: 34,
	},
	isOwnProfile: false,
	isFollowing: false,
};

/**
 * 自分のプロフィールデータ
 */
export const ownProfile: UserProfile = {
	...sampleProfile,
	id: "user-own",
	username: "my_username",
	displayName: "私の名前",
	isOwnProfile: true,
	isFollowing: undefined,
	stats: {
		followers: 456,
		following: 123,
		likedPosts: 67,
		bookmarkedPosts: 23,
	},
};

/**
 * いいねした投稿のサンプルデータ
 */
export const sampleLikedPosts: ProfilePost[] = [
	{
		id: "liked-post-1",
		type: "video",
		content: {
			title: "React 18の新機能を解説",
			description: "Concurrent Featuresについて詳しく説明します",
			thumbnail:
				"https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=400&h=500&fit=crop",
		},
		author: {
			id: "author-1",
			name: "山田 花子",
			avatar:
				"https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face",
		},
		createdAt: "2024-01-15T10:30:00Z",
		stats: {
			likes: 234,
			comments: 45,
			shares: 12,
		},
		hashtags: ["React", "JavaScript", "WebDev"],
		isLiked: true,
		isBookmarked: false,
		likedAt: "2024-01-15T11:00:00Z",
	},
	{
		id: "liked-post-2",
		type: "text",
		content: {
			title: "TypeScriptのベストプラクティス",
			text: "型安全性を保ちながら開発効率を上げる方法について考察してみました。特にGeneric型の活用方法やユーティリティ型の使い分けについて詳しく解説しています。",
		},
		author: {
			id: "author-2",
			name: "佐藤 次郎",
			avatar:
				"https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face",
		},
		createdAt: "2024-01-12T14:20:00Z",
		stats: {
			likes: 156,
			comments: 23,
			shares: 8,
		},
		hashtags: ["TypeScript", "Programming", "Tips"],
		isLiked: true,
		isBookmarked: true,
		likedAt: "2024-01-12T15:00:00Z",
		bookmarkedAt: "2024-01-12T15:30:00Z",
	},
	{
		id: "liked-post-3",
		type: "video",
		content: {
			title: "Next.js App Routerの使い方",
			description: "新しいApp Routerの基本的な使い方から応用まで",
			thumbnail:
				"https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=400&h=500&fit=crop",
		},
		author: {
			id: "author-3",
			name: "鈴木 三郎",
			avatar:
				"https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&h=150&fit=crop&crop=face",
		},
		createdAt: "2024-01-10T09:15:00Z",
		stats: {
			likes: 189,
			comments: 31,
			shares: 15,
		},
		hashtags: ["NextJS", "React", "WebDev"],
		isLiked: true,
		isBookmarked: false,
		likedAt: "2024-01-10T10:00:00Z",
	},
];

/**
 * ブックマークした投稿のサンプルデータ
 */
export const sampleBookmarkedPosts: ProfilePost[] = [
	{
		id: "bookmarked-post-1",
		type: "text",
		content: {
			title: "効率的なGit運用について",
			text: "チーム開発でのGitフローの運用方法について実際の経験を基に紹介します。ブランチ戦略やコミットメッセージの書き方など。",
		},
		author: {
			id: "author-4",
			name: "田中 四郎",
			avatar:
				"https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face",
		},
		createdAt: "2024-01-08T16:45:00Z",
		stats: {
			likes: 98,
			comments: 17,
			shares: 5,
		},
		hashtags: ["Git", "TeamWork", "Development"],
		isLiked: false,
		isBookmarked: true,
		bookmarkedAt: "2024-01-08T17:00:00Z",
	},
	{
		id: "bookmarked-post-2",
		type: "video",
		content: {
			title: "Docker入門講座",
			description: "初心者向けにDockerの基本概念から実践まで",
			thumbnail:
				"https://images.unsplash.com/photo-1605745341112-85968b19335b?w=400&h=500&fit=crop",
		},
		author: {
			id: "author-5",
			name: "高橋 五郎",
			avatar:
				"https://images.unsplash.com/photo-1519244703995-f4e0f30006d5?w=150&h=150&fit=crop&crop=face",
		},
		createdAt: "2024-01-05T11:30:00Z",
		stats: {
			likes: 267,
			comments: 52,
			shares: 28,
		},
		hashtags: ["Docker", "DevOps", "Tutorial"],
		isLiked: true,
		isBookmarked: true,
		likedAt: "2024-01-05T12:00:00Z",
		bookmarkedAt: "2024-01-05T12:15:00Z",
	},
	{
		id: "bookmarked-post-3",
		type: "text",
		content: {
			title: "パフォーマンス最適化のコツ",
			text: "Webアプリケーションのパフォーマンスを向上させるための実践的なテクニックを紹介します。",
		},
		author: {
			id: "author-6",
			name: "伊藤 六子",
			avatar:
				"https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face",
		},
		createdAt: "2024-01-03T13:20:00Z",
		stats: {
			likes: 143,
			comments: 29,
			shares: 11,
		},
		hashtags: ["Performance", "WebDev", "Optimization"],
		isLiked: false,
		isBookmarked: true,
		bookmarkedAt: "2024-01-03T14:00:00Z",
	},
];
