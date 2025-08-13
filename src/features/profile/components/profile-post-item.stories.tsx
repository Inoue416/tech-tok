import type { Meta, StoryObj } from "@storybook/nextjs";
import { ProfilePostItem } from "./profile-post-item";
import type { ProfilePost } from "../types";

const meta: Meta<typeof ProfilePostItem> = {
	title: "features/profile/ProfilePostItem",
	component: ProfilePostItem,
	tags: ["autodocs"],
	argTypes: {
		displayType: {
			control: "select",
			options: ["liked", "bookmarked"],
			description: "表示タイプ",
		},
		isOwnProfile: {
			control: "boolean",
			description: "自分のプロフィールかどうか",
		},
		onClick: {
			action: "clicked",
			description: "投稿クリック時のコールバック",
		},
		onUnlike: {
			action: "unliked",
			description: "いいね解除時のコールバック",
		},
		onUnbookmark: {
			action: "unbookmarked",
			description: "ブックマーク解除時のコールバック",
		},
	},
};

export default meta;
type Story = StoryObj<typeof ProfilePostItem>;

// モックデータ
const textPost: ProfilePost = {
	id: "post-1",
	type: "text",
	content: {
		title: "React Server Components入門",
		text: "React Server Componentsは新しいパラダイムです。サーバーサイドでコンポーネントをレンダリングすることで、パフォーマンスとユーザー体験を向上させることができます。",
		description: "RSCの基本概念について学ぼう",
	},
	author: {
		id: "author-1",
		name: "Tech Writer",
		avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=32&h=32&fit=crop&crop=face",
	},
	createdAt: "2024-01-15T10:00:00Z",
	stats: {
		likes: 1200,
		comments: 85,
		shares: 43,
	},
	hashtags: ["React", "ServerComponents", "Next.js"],
	isLiked: true,
	isBookmarked: false,
	likedAt: "2024-01-15T15:30:00Z",
};

const videoPost: ProfilePost = {
	id: "post-2",
	type: "video",
	content: {
		url: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4",
		title: "TypeScript基本文法解説",
		description: "TypeScript基本文法の解説動画",
		thumbnail: "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=400&h=500&fit=crop",
	},
	author: {
		id: "author-2",
		name: "Code Instructor",
		avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=32&h=32&fit=crop&crop=face",
	},
	createdAt: "2024-01-14T14:00:00Z",
	stats: {
		likes: 2500,
		comments: 150,
		shares: 78,
	},
	hashtags: ["TypeScript", "JavaScript", "Tutorial"],
	isLiked: false,
	isBookmarked: true,
	bookmarkedAt: "2024-01-14T16:45:00Z",
};

const highStatsPost: ProfilePost = {
	id: "post-3",
	type: "text",
	content: {
		title: "Clean Code原則",
		text: "コードは書くよりも読む時間の方が長い。だからこそ、読みやすく保守しやすいコードを書くことが重要です。",
		description: "保守しやすいコードを書くためのベストプラクティス",
	},
	author: {
		id: "author-3",
		name: "Software Engineer",
		avatar: "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=32&h=32&fit=crop&crop=face",
	},
	createdAt: "2024-01-13T09:00:00Z",
	stats: {
		likes: 125000,
		comments: 2300,
		shares: 890,
	},
	hashtags: ["CleanCode", "プログラミング", "ベストプラクティス", "リファクタリング", "設計"],
	isLiked: true,
	isBookmarked: true,
};

/**
 * テキスト投稿（いいね表示）
 */
export const TextPostLiked: Story = {
	args: {
		post: textPost,
		displayType: "liked",
		isOwnProfile: true,
	},
};

/**
 * 動画投稿（ブックマーク表示）
 */
export const VideoPostBookmarked: Story = {
	args: {
		post: videoPost,
		displayType: "bookmarked",
		isOwnProfile: true,
	},
};

/**
 * 他人の投稿（アクションボタンなし）
 */
export const OtherUserPost: Story = {
	args: {
		post: textPost,
		displayType: "liked",
		isOwnProfile: false,
	},
};

/**
 * 高い数値の統計情報
 */
export const HighStatsPost: Story = {
	args: {
		post: highStatsPost,
		displayType: "liked",
		isOwnProfile: true,
	},
};

/**
 * ハッシュタグなしの投稿
 */
export const NoHashtagsPost: Story = {
	args: {
		post: {
			...textPost,
			hashtags: undefined,
		},
		displayType: "liked",
		isOwnProfile: true,
	},
};

/**
 * タイトルなしの投稿
 */
export const NoTitlePost: Story = {
	args: {
		post: {
			...textPost,
			content: {
				...textPost.content,
				title: undefined,
			},
		},
		displayType: "liked",
		isOwnProfile: true,
	},
};

/**
 * 説明なしの投稿
 */
export const NoDescriptionPost: Story = {
	args: {
		post: {
			...textPost,
			content: {
				...textPost.content,
				description: undefined,
			},
		},
		displayType: "liked",
		isOwnProfile: true,
	},
};

/**
 * サムネイルなし動画投稿
 */
export const VideoWithoutThumbnail: Story = {
	args: {
		post: {
			...videoPost,
			content: {
				...videoPost.content,
				thumbnail: undefined,
			},
		},
		displayType: "bookmarked",
		isOwnProfile: true,
	},
};

/**
 * インタラクティブな投稿（クリック可能）
 */
export const InteractivePost: Story = {
	args: {
		post: textPost,
		displayType: "liked",
		isOwnProfile: true,
		onClick: (post) => alert(`投稿クリック: ${post.content.title}`),
		onUnlike: (postId) => alert(`いいね解除: ${postId}`),
		onUnbookmark: (postId) => alert(`ブックマーク解除: ${postId}`),
	},
};

/**
 * 投稿一覧の例
 */
export const PostGrid: Story = {
	render: () => (
		<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 p-4">
			<ProfilePostItem
				post={textPost}
				displayType="liked"
				isOwnProfile={true}
			/>
			<ProfilePostItem
				post={videoPost}
				displayType="bookmarked"
				isOwnProfile={true}
			/>
			<ProfilePostItem
				post={highStatsPost}
				displayType="liked"
				isOwnProfile={false}
			/>
		</div>
	),
};