/**
 * ユーザープロフィールのデータ型定義
 */
export interface UserProfile {
	id: string;
	username: string;
	displayName: string;
	avatar?: string;
	bio?: string;
	technologies: Technology[];
	stats: ProfileStats;
	isOwnProfile: boolean;
	isFollowing?: boolean;
}

/**
 * 技術タグの型定義
 */
export interface Technology {
	id: string;
	name: string;
	color?: string;
	category?: "language" | "framework" | "tool" | "platform" | "other";
}

/**
 * プロフィール統計情報の型定義
 */
export interface ProfileStats {
	followers: number;
	following: number;
	likedPosts: number;
	bookmarkedPosts: number;
}

/**
 * プロフィール投稿の型定義（いいね・ブックマーク用）
 */
export interface ProfilePost {
	id: string;
	type: "video" | "text";
	content: {
		url?: string;
		text?: string;
		title?: string;
		description?: string;
		thumbnail?: string;
	};
	author: {
		id: string;
		avatar?: string;
		name: string;
	};
	createdAt: string;
	stats: {
		likes: number;
		comments: number;
		shares: number;
	};
	hashtags?: string[];
	isLiked: boolean;
	isBookmarked: boolean;
	likedAt?: string;
	bookmarkedAt?: string;
}

/**
 * プロフィール投稿表示タイプ
 */
export type ProfilePostDisplayType = "liked" | "bookmarked";

/**
 * プロフィール編集データの型定義
 */
export interface ProfileEditData {
	displayName: string;
	username: string;
	bio?: string;
	technologies: Technology[];
}

/**
 * プロフィールコンポーネントのプロパティ型定義
 */
export interface ProfileProps {
	profile: UserProfile;
	likedPosts: ProfilePost[];
	bookmarkedPosts: ProfilePost[];
	displayType: ProfilePostDisplayType;
	onFollow?: (userId: string) => void;
	onUnfollow?: (userId: string) => void;
	onShare?: (profile: UserProfile) => void;
	onPostClick?: (post: ProfilePost) => void;
	onProfileEdit?: (data: ProfileEditData) => void;
	onDisplayTypeChange?: (type: ProfilePostDisplayType) => void;
	onUnlike?: (postId: string) => void;
	onUnbookmark?: (postId: string) => void;
}

/**
 * プロフィールヘッダーのプロパティ型定義
 */
export interface ProfileHeaderProps {
	profile: UserProfile;
	onFollow?: (userId: string) => void;
	onUnfollow?: (userId: string) => void;
	onShare?: (profile: UserProfile) => void;
	onProfileEdit?: (data: ProfileEditData) => void;
}

/**
 * 技術タグリストのプロパティ型定義
 */
export interface TechnologyListProps {
	technologies: Technology[];
	maxVisible?: number;
}

/**
 * プロフィール統計のプロパティ型定義
 */
export interface ProfileStatsProps {
	stats: ProfileStats;
}

/**
 * プロフィール投稿リストのプロパティ型定義
 */
export interface ProfilePostListProps {
	posts: ProfilePost[];
	displayType: ProfilePostDisplayType;
	isOwnProfile: boolean;
	onPostClick?: (post: ProfilePost) => void;
	onDisplayTypeChange?: (type: ProfilePostDisplayType) => void;
	onUnlike?: (postId: string) => void;
	onUnbookmark?: (postId: string) => void;
}
