import type { Technology, UserProfile } from "@/features/profile/types";
import { getTechnologyById } from "./technology-options";

/**
 * サンプルユーザープロフィールデータ（Storybook用）
 */
export const sampleProfile: UserProfile = {
	id: "user-1",
	username: "tech_developer",
	displayName: "田中 太郎",
	image:
		"https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face",
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
};

/**
 * 自分のプロフィールデータ（Storybook用）
 */
export const ownProfile: UserProfile = {
	id: "user-own",
	username: "my_username",
	displayName: "私の名前",
	image: null,
	technologies: [
		getTechnologyById("tech-ts"),
		getTechnologyById("tech-react"),
		getTechnologyById("tech-nextjs"),
	].filter((tech): tech is Technology => tech !== undefined),
};
