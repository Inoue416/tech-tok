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
