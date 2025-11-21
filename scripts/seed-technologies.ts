/**
 * Technologies Seed Script
 * technologiesテーブルのみを初期化するスクリプト
 */

import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
	console.log("🌱 Technologiesデータの投入を開始します...\n");

	const technologiesData = [
		// フロントエンド
		{ name: "React", category: "Frontend", color: "#61DAFB" },
		{ name: "Vue.js", category: "Frontend", color: "#42B883" },
		{ name: "Angular", category: "Frontend", color: "#DD0031" },
		{ name: "Svelte", category: "Frontend", color: "#FF3E00" },
		{ name: "Solid.js", category: "Frontend", color: "#2C4F7C" },
		{ name: "Qwik", category: "Frontend", color: "#AC7EF4" },
		{ name: "HTMX", category: "Frontend", color: "#3D72D7" },
		{ name: "Blazor", category: "Frontend", color: "#512BD4" },
		{ name: "Tailwind CSS", category: "Frontend", color: "#06B6D4" },
		{ name: "Sass", category: "Frontend", color: "#CC6699" },

		// フレームワーク
		{ name: "Next.js", category: "Framework", color: "#000000" },
		{ name: "Nuxt.js", category: "Framework", color: "#00DC82" },
		{ name: "Remix", category: "Framework", color: "#000000" },
		{ name: "Astro", category: "Framework", color: "#FF5D01" },

		// プログラミング言語
		{ name: "TypeScript", category: "Language", color: "#3178C6" },
		{ name: "JavaScript", category: "Language", color: "#F7DF1E" },
		{ name: "Python", category: "Language", color: "#3776AB" },
		{ name: "Go", category: "Language", color: "#00ADD8" },
		{ name: "Rust", category: "Language", color: "#000000" },
		{ name: "Java", category: "Language", color: "#007396" },
		{ name: "C#", category: "Language", color: "#239120" },
		{ name: "PHP", category: "Language", color: "#777BB4" },
		{ name: "Ruby", category: "Language", color: "#CC342D" },
		{ name: "Swift", category: "Language", color: "#FA7343" },
		{ name: "Kotlin", category: "Language", color: "#7F52FF" },

		// バックエンド
		{ name: "Node.js", category: "Backend", color: "#339933" },
		{ name: "Express", category: "Backend", color: "#000000" },
		{ name: "Fastify", category: "Backend", color: "#000000" },
		{ name: "Hono", category: "Backend", color: "#E36002" },
		{ name: "NestJS", category: "Backend", color: "#E0234E" },
		{ name: "ASP.NET Core", category: "Backend", color: "#512BD4" },
		{ name: "Django", category: "Backend", color: "#092E20" },
		{ name: "FastAPI", category: "Backend", color: "#009688" },
		{ name: "Flask", category: "Backend", color: "#000000" },
		{ name: "Spring Boot", category: "Backend", color: "#6DB33F" },
		{ name: "Laravel", category: "Backend", color: "#FF2D20" },
		{ name: "Ruby on Rails", category: "Backend", color: "#CC0000" },
		{ name: "Gin", category: "Backend", color: "#00ADD8" },
		{ name: "Fiber", category: "Backend", color: "#00ADD8" },

		// データベース
		{ name: "PostgreSQL", category: "Database", color: "#336791" },
		{ name: "MySQL", category: "Database", color: "#4479A1" },
		{ name: "MongoDB", category: "Database", color: "#47A248" },
		{ name: "Redis", category: "Database", color: "#DC382D" },
		{ name: "Supabase", category: "Database", color: "#3ECF8E" },
		{ name: "Firebase", category: "Database", color: "#FFCA28" },
		{ name: "Prisma", category: "Database", color: "#2D3748" },
		{ name: "Entity Framework Core", category: "Database", color: "#512BD4" },

		// クラウド・インフラ
		{ name: "AWS", category: "Cloud", color: "#232F3E" },
		{ name: "GCP", category: "Cloud", color: "#4285F4" },
		{ name: "Azure", category: "Cloud", color: "#0078D4" },
		{ name: "Vercel", category: "Cloud", color: "#000000" },
		{ name: "Netlify", category: "Cloud", color: "#00C7B7" },
		{ name: "Cloudflare", category: "Cloud", color: "#F38020" },

		// DevOps・インフラ
		{ name: "Docker", category: "Infrastructure", color: "#2496ED" },
		{ name: "Kubernetes", category: "Infrastructure", color: "#326CE5" },
		{ name: "Terraform", category: "Infrastructure", color: "#7B42BC" },
		{ name: "GitHub Actions", category: "Infrastructure", color: "#2088FF" },
		{ name: "Jenkins", category: "Infrastructure", color: "#D24939" },
		{ name: "GitLab CI", category: "Infrastructure", color: "#FC6D26" },

		// モバイル
		{ name: "React Native", category: "Mobile", color: "#61DAFB" },
		{ name: "Flutter", category: "Mobile", color: "#02569B" },
		{ name: "Expo", category: "Mobile", color: "#000020" },
		{ name: ".NET MAUI", category: "Mobile", color: "#512BD4" },

		// ツール・その他
		{ name: "Git", category: "Tools", color: "#F05032" },
		{ name: "GitHub", category: "Tools", color: "#181717" },
		{ name: "VS Code", category: "Tools", color: "#007ACC" },
		{ name: "Webpack", category: "Tools", color: "#8DD6F9" },
		{ name: "Vite", category: "Tools", color: "#646CFF" },
		{ name: "ESLint", category: "Tools", color: "#4B32C3" },
		{ name: "Prettier", category: "Tools", color: "#F7B93E" },

		// テスト
		{ name: "Jest", category: "Testing", color: "#C21325" },
		{ name: "Vitest", category: "Testing", color: "#6E9F18" },
		{ name: "Cypress", category: "Testing", color: "#17202C" },
		{ name: "Playwright", category: "Testing", color: "#2EAD33" },

		// AI・機械学習
		{ name: "TensorFlow", category: "AI/ML", color: "#FF6F00" },
		{ name: "PyTorch", category: "AI/ML", color: "#EE4C2C" },
		{ name: "OpenAI", category: "AI/ML", color: "#412991" },
		{ name: "LangChain", category: "AI/ML", color: "#1C3C3C" },
		{ name: "ChatGPT", category: "AI/ML", color: "#10A37F" },
		{ name: "Codex", category: "AI/ML", color: "#412991" },
		{ name: "Claude Code", category: "AI/ML", color: "#D97757" },
		{ name: "Gemini", category: "AI/ML", color: "#4285F4" },
		{ name: "Gemini CLI", category: "AI/ML", color: "#4285F4" },
		{ name: "Ollama", category: "AI/ML", color: "#000000" },
		{ name: "Pinecone", category: "Database", color: "#000000" },
		{ name: "Chroma", category: "Database", color: "#FF6B6B" },

		// ランタイム・実行環境
		{ name: "Bun", category: "Runtime", color: "#FBF0DF" },
		{ name: "Deno", category: "Runtime", color: "#000000" },

		// 開発ツール（追加）
		{ name: "pnpm", category: "Tools", color: "#F69220" },
		{ name: "Turborepo", category: "Tools", color: "#EF4444" },
		{ name: "esbuild", category: "Tools", color: "#FFCF00" },

		// UIライブラリ（追加）
		{ name: "Shadcn UI", category: "Frontend", color: "#000000" },
		{ name: "Radix UI", category: "Frontend", color: "#161618" },
		{ name: "Framer Motion", category: "Frontend", color: "#0055FF" },

		// API・プロトコル
		{ name: "GraphQL", category: "Backend", color: "#E10098" },
		{ name: "tRPC", category: "Backend", color: "#2596BE" },

		// 認証・バックエンドサービス
		{ name: "Clerk", category: "Backend", color: "#6C47FF" },

		// インフラ（追加）
		{ name: "Cloudflare Workers", category: "Cloud", color: "#F38020" },

		// プログラミング言語・技術（追加）
		{ name: "WebAssembly", category: "Language", color: "#654FF0" },

		// 開発手法
		{ name: "Spec Driven", category: "Methodology", color: "#3B82F6" },
		{ name: "Vibe Coding", category: "Methodology", color: "#8B5CF6" },
	];

	console.log("📊 Technologiesデータを投入中...");

	let createdCount = 0;
	let updatedCount = 0;

	for (const tech of technologiesData) {
		// 既存チェック
		const existing = await prisma.technology.findUnique({
			where: { name: tech.name },
		});

		await prisma.technology.upsert({
			where: { name: tech.name },
			update: {
				category: tech.category,
				color: tech.color,
			},
			create: {
				name: tech.name,
				category: tech.category,
				color: tech.color,
			},
		});

		if (existing) {
			updatedCount++;
		} else {
			createdCount++;
		}
	}

	console.log("✅ Technologiesデータ投入完了");
	console.log("   新規作成: " + createdCount + "個");
	console.log("   更新: " + updatedCount + "個");
	console.log("   合計: " + technologiesData.length + "個\n");

	// 最終確認
	const totalCount = await prisma.technology.count();
	console.log(`📊 現在のTechnologies総数: ${totalCount}個`);

	console.log("\n🎉 Technologiesデータの投入が完了しました！");
}

main()
	.catch((e) => {
		console.error("❌ Technologiesデータ投入エラー:", e);
		process.exit(1);
	})
	.finally(async () => {
		await prisma.$disconnect();
	});
