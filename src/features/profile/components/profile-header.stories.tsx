import type { Meta, StoryObj } from "@storybook/nextjs";
import { ProfileHeader } from "./profile-header";
import type { UserProfile } from "../types";

const meta: Meta<typeof ProfileHeader> = {
	title: "features/profile/ProfileHeader",
	component: ProfileHeader,
	tags: ["autodocs"],
	argTypes: {
		onFollow: {
			action: "followed",
			description: "フォロー時のコールバック",
		},
		onUnfollow: {
			action: "unfollowed",
			description: "フォロー解除時のコールバック",
		},
		onShare: {
			action: "shared",
			description: "シェア時のコールバック",
		},
		onProfileEdit: {
			action: "profile-edit",
			description: "プロフィール編集時のコールバック",
		},
	},
};

export default meta;
type Story = StoryObj<typeof ProfileHeader>;

// モックデータ
const ownProfile: UserProfile = {
	id: "user-1",
	username: "tanaka_taro",
	displayName: "田中太郎",
	avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face",
	bio: "フロントエンド開発者です。React、TypeScript、Next.jsを使って美しいWebアプリケーションを作ることが好きです。",
	technologies: [
		{ id: "react", name: "React", category: "framework" },
		{ id: "typescript", name: "TypeScript", category: "language" },
		{ id: "nextjs", name: "Next.js", category: "framework" },
		{ id: "tailwind", name: "Tailwind CSS", category: "framework" },
		{ id: "javascript", name: "JavaScript", category: "language" },
		{ id: "figma", name: "Figma", category: "tool" },
	],
	stats: {
		followers: 1234,
		following: 567,
		likedPosts: 89,
		bookmarkedPosts: 45,
	},
	isOwnProfile: true,
};

const otherProfile: UserProfile = {
	id: "user-2",
	username: "sato_hanako",
	displayName: "佐藤花子",
	avatar: "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=100&h=100&fit=crop&crop=face",
	bio: "バックエンド開発を専門にしています。Python、Django、AWSでスケーラブルなシステムを構築しています。",
	technologies: [
		{ id: "python", name: "Python", category: "language" },
		{ id: "django", name: "Django", category: "framework" },
		{ id: "postgresql", name: "PostgreSQL", category: "tool" },
		{ id: "aws", name: "AWS", category: "platform" },
		{ id: "docker", name: "Docker", category: "tool" },
		{ id: "redis", name: "Redis", category: "tool" },
	],
	stats: {
		followers: 2567,
		following: 123,
		likedPosts: 234,
		bookmarkedPosts: 156,
	},
	isOwnProfile: false,
	isFollowing: false,
};

const followingProfile: UserProfile = {
	...otherProfile,
	id: "user-3",
	username: "yamada_jiro",
	displayName: "山田次郎",
	avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face",
	isFollowing: true,
};

const influencerProfile: UserProfile = {
	id: "user-4",
	username: "tech_guru",
	displayName: "Tech Guru",
	avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&h=100&fit=crop&crop=face",
	bio: "技術系YouTuberとして活動しています。最新の技術トレンドや開発ノウハウを発信中！チャンネル登録よろしくお願いします🙏",
	technologies: [
		{ id: "react", name: "React", category: "framework" },
		{ id: "vue", name: "Vue.js", category: "framework" },
		{ id: "nodejs", name: "Node.js", category: "platform" },
		{ id: "python", name: "Python", category: "language" },
		{ id: "aws", name: "AWS", category: "platform" },
		{ id: "docker", name: "Docker", category: "tool" },
		{ id: "kubernetes", name: "Kubernetes", category: "tool" },
		{ id: "graphql", name: "GraphQL", category: "framework" },
	],
	stats: {
		followers: 125000,
		following: 500,
		likedPosts: 3400,
		bookmarkedPosts: 1200,
	},
	isOwnProfile: false,
	isFollowing: true,
};

/**
 * 自分のプロフィール
 */
export const OwnProfile: Story = {
	args: {
		profile: ownProfile,
	},
};

/**
 * 他人のプロフィール（未フォロー）
 */
export const OtherProfileNotFollowing: Story = {
	args: {
		profile: otherProfile,
	},
};

/**
 * 他人のプロフィール（フォロー中）
 */
export const OtherProfileFollowing: Story = {
	args: {
		profile: followingProfile,
	},
};

/**
 * インフルエンサープロフィール
 */
export const InfluencerProfile: Story = {
	args: {
		profile: influencerProfile,
	},
};

/**
 * アバターなしのプロフィール
 */
export const WithoutAvatar: Story = {
	args: {
		profile: {
			...ownProfile,
			avatar: undefined,
		},
	},
};

/**
 * 自己紹介なしのプロフィール
 */
export const WithoutBio: Story = {
	args: {
		profile: {
			...otherProfile,
			bio: undefined,
		},
	},
};

/**
 * 技術スタックなしのプロフィール
 */
export const WithoutTechnologies: Story = {
	args: {
		profile: {
			...otherProfile,
			technologies: [],
		},
	},
};

/**
 * 最小限の情報のプロフィール
 */
export const MinimalProfile: Story = {
	args: {
		profile: {
			id: "user-minimal",
			username: "newuser",
			displayName: "新規ユーザー",
			technologies: [],
			stats: {
				followers: 0,
				following: 0,
				likedPosts: 0,
				bookmarkedPosts: 0,
			},
			isOwnProfile: true,
		},
	},
};

/**
 * インタラクティブプロフィール（全コールバック付き）
 */
export const InteractiveProfile: Story = {
	args: {
		profile: otherProfile,
		onFollow: (userId) => alert(`フォロー: ${userId}`),
		onUnfollow: (userId) => alert(`フォロー解除: ${userId}`),
		onShare: (profile) => alert(`シェア: ${profile.displayName}`),
		onProfileEdit: (data) => alert(`プロフィール編集: ${JSON.stringify(data, null, 2)}`),
	},
};

/**
 * フルスタック開発者のプロフィール
 */
export const FullStackDeveloper: Story = {
	args: {
		profile: {
			id: "fullstack-dev",
			username: "fullstack_dev",
			displayName: "フルスタック太郎",
			avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop&crop=face",
			bio: "フロントエンドからバックエンド、インフラまで幅広く対応可能です。最新技術のキャッチアップが得意で、チーム開発でのコミュニケーションも大切にしています。",
			technologies: [
				{ id: "react", name: "React", category: "framework" },
				{ id: "nodejs", name: "Node.js", category: "platform" },
				{ id: "python", name: "Python", category: "language" },
				{ id: "aws", name: "AWS", category: "platform" },
				{ id: "docker", name: "Docker", category: "tool" },
				{ id: "typescript", name: "TypeScript", category: "language" },
				{ id: "postgresql", name: "PostgreSQL", category: "tool" },
				{ id: "graphql", name: "GraphQL", category: "framework" },
				{ id: "kubernetes", name: "Kubernetes", category: "tool" },
				{ id: "terraform", name: "Terraform", category: "tool" },
			],
			stats: {
				followers: 8500,
				following: 1200,
				likedPosts: 2300,
				bookmarkedPosts: 890,
			},
			isOwnProfile: false,
			isFollowing: false,
		},
	},
};