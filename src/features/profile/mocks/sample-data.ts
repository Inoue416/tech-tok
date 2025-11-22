import type { Technology, UserProfile } from "@/features/profile/types";

/**
 * サンプル技術データ（Storybook用）
 */
const sampleTechnologies: Technology[] = [
	{ id: "tech-ts", name: "TypeScript", category: "language", color: "#3178C6" },
	{ id: "tech-react", name: "React", category: "framework", color: "#61DAFB" },
	{
		id: "tech-nextjs",
		name: "Next.js",
		category: "framework",
		color: "#000000",
	},
	{
		id: "tech-nodejs",
		name: "Node.js",
		category: "platform",
		color: "#339933",
	},
	{
		id: "tech-postgresql",
		name: "PostgreSQL",
		category: "platform",
		color: "#4169E1",
	},
	{ id: "tech-docker", name: "Docker", category: "tool", color: "#2496ED" },
	{ id: "tech-aws", name: "AWS", category: "platform", color: "#FF9900" },
	{ id: "tech-graphql", name: "GraphQL", category: "other", color: "#E10098" },
];

/**
 * サンプルユーザープロフィールデータ（Storybook用）
 */
export const sampleProfile: UserProfile = {
	id: "user-1",
	username: "tech_developer",
	displayName: "田中 太郎",
	image:
		"https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face",
	technologies: sampleTechnologies,
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
		sampleTechnologies[0], // TypeScript
		sampleTechnologies[1], // React
		sampleTechnologies[2], // Next.js
	],
};
