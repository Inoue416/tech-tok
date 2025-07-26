import type { Technology } from "@/features/profile/types";

/**
 * 利用可能な技術スタックの選択肢（モックデータ）
 */
export const availableTechnologies: Technology[] = [
	// プログラミング言語
	{
		id: "tech-js",
		name: "JavaScript",
		category: "language",
	},
	{
		id: "tech-ts",
		name: "TypeScript",
		category: "language",
	},
	{
		id: "tech-python",
		name: "Python",
		category: "language",
	},
	{
		id: "tech-java",
		name: "Java",
		category: "language",
	},
	{
		id: "tech-go",
		name: "Go",
		category: "language",
	},
	{
		id: "tech-rust",
		name: "Rust",
		category: "language",
	},
	{
		id: "tech-php",
		name: "PHP",
		category: "language",
	},
	{
		id: "tech-csharp",
		name: "C#",
		category: "language",
	},
	{
		id: "tech-swift",
		name: "Swift",
		category: "language",
	},
	{
		id: "tech-kotlin",
		name: "Kotlin",
		category: "language",
	},

	// フロントエンドフレームワーク
	{
		id: "tech-react",
		name: "React",
		category: "framework",
	},
	{
		id: "tech-vue",
		name: "Vue.js",
		category: "framework",
	},
	{
		id: "tech-angular",
		name: "Angular",
		category: "framework",
	},
	{
		id: "tech-nextjs",
		name: "Next.js",
		category: "framework",
	},
	{
		id: "tech-nuxt",
		name: "Nuxt.js",
		category: "framework",
	},
	{
		id: "tech-svelte",
		name: "Svelte",
		category: "framework",
	},
	{
		id: "tech-remix",
		name: "Remix",
		category: "framework",
	},

	// バックエンドフレームワーク
	{
		id: "tech-express",
		name: "Express.js",
		category: "framework",
	},
	{
		id: "tech-fastapi",
		name: "FastAPI",
		category: "framework",
	},
	{
		id: "tech-django",
		name: "Django",
		category: "framework",
	},
	{
		id: "tech-flask",
		name: "Flask",
		category: "framework",
	},
	{
		id: "tech-spring",
		name: "Spring Boot",
		category: "framework",
	},
	{
		id: "tech-gin",
		name: "Gin",
		category: "framework",
	},
	{
		id: "tech-laravel",
		name: "Laravel",
		category: "framework",
	},

	// データベース・プラットフォーム
	{
		id: "tech-postgresql",
		name: "PostgreSQL",
		category: "platform",
	},
	{
		id: "tech-mysql",
		name: "MySQL",
		category: "platform",
	},
	{
		id: "tech-mongodb",
		name: "MongoDB",
		category: "platform",
	},
	{
		id: "tech-redis",
		name: "Redis",
		category: "platform",
	},
	{
		id: "tech-nodejs",
		name: "Node.js",
		category: "platform",
	},
	{
		id: "tech-aws",
		name: "AWS",
		category: "platform",
	},
	{
		id: "tech-gcp",
		name: "Google Cloud",
		category: "platform",
	},
	{
		id: "tech-azure",
		name: "Azure",
		category: "platform",
	},
	{
		id: "tech-vercel",
		name: "Vercel",
		category: "platform",
	},
	{
		id: "tech-netlify",
		name: "Netlify",
		category: "platform",
	},

	// 開発ツール
	{
		id: "tech-docker",
		name: "Docker",
		category: "tool",
	},
	{
		id: "tech-kubernetes",
		name: "Kubernetes",
		category: "tool",
	},
	{
		id: "tech-git",
		name: "Git",
		category: "tool",
	},
	{
		id: "tech-github",
		name: "GitHub",
		category: "tool",
	},
	{
		id: "tech-gitlab",
		name: "GitLab",
		category: "tool",
	},
	{
		id: "tech-figma",
		name: "Figma",
		category: "tool",
	},
	{
		id: "tech-vscode",
		name: "VS Code",
		category: "tool",
	},
	{
		id: "tech-postman",
		name: "Postman",
		category: "tool",
	},

	// その他
	{
		id: "tech-graphql",
		name: "GraphQL",
		category: "other",
	},
	{
		id: "tech-rest",
		name: "REST API",
		category: "other",
	},
	{
		id: "tech-grpc",
		name: "gRPC",
		category: "other",
	},
	{
		id: "tech-websocket",
		name: "WebSocket",
		category: "other",
	},
	{
		id: "tech-oauth",
		name: "OAuth",
		category: "other",
	},
	{
		id: "tech-jwt",
		name: "JWT",
		category: "other",
	},
	{
		id: "tech-tailwind",
		name: "Tailwind CSS",
		category: "other",
	},
	{
		id: "tech-sass",
		name: "Sass",
		category: "other",
	},
	{
		id: "tech-webpack",
		name: "Webpack",
		category: "other",
	},
	{
		id: "tech-vite",
		name: "Vite",
		category: "other",
	},
];

/**
 * カテゴリ別に技術スタックを取得する関数
 */
export function getTechnologiesByCategory(
	category?: Technology["category"],
): Technology[] {
	if (!category) {
		return availableTechnologies;
	}
	return availableTechnologies.filter((tech) => tech.category === category);
}

/**
 * 技術スタックをIDで検索する関数
 */
export function getTechnologyById(id: string): Technology | undefined {
	return availableTechnologies.find((tech) => tech.id === id);
}

/**
 * 技術スタックを名前で検索する関数
 */
export function searchTechnologies(query: string): Technology[] {
	const lowerQuery = query.toLowerCase();
	return availableTechnologies.filter((tech) =>
		tech.name.toLowerCase().includes(lowerQuery),
	);
}
