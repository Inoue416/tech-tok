/**
 * Prisma Seed Script for Development Environment
 * 開発環境用のテストデータを投入するスクリプト
 */

import { prisma } from "@/lib/prisma";

async function main() {
	console.log("🌱 シードデータの投入を開始します...\n");

	// 既存データの削除（開発環境のみ）
	console.log("🧹 既存データの削除...");
	await prisma.feedItem.deleteMany();
	await prisma.rssEntryHashtag.deleteMany();
	await prisma.rssEntryTechnology.deleteMany();
	await prisma.rssEnclosure.deleteMany();
	await prisma.rssEntry.deleteMany();
	await prisma.rssFetchLog.deleteMany();
	await prisma.rssSource.deleteMany();
	await prisma.postHashtag.deleteMany();
	await prisma.postShare.deleteMany();
	await prisma.comment.deleteMany();
	await prisma.bookmark.deleteMany();
	await prisma.like.deleteMany();
	await prisma.post.deleteMany();
	await prisma.notification.deleteMany();
	await prisma.userTechnology.deleteMany();
	await prisma.follow.deleteMany();
	await prisma.hashtag.deleteMany();
	await prisma.technology.deleteMany();
	await prisma.account.deleteMany();
	await prisma.user.deleteMany();
	console.log("✅ 既存データ削除完了\n");

	// 1. Technologyデータ
	console.log("1️⃣ Technologyデータ作成...");
	const technologiesData = [
		// フロントエンド
		{ name: "React", category: "Frontend", color: "#61DAFB" },
		{ name: "Vue.js", category: "Frontend", color: "#42B883" },
		{ name: "Angular", category: "Frontend", color: "#DD0031" },
		{ name: "Svelte", category: "Frontend", color: "#FF3E00" },
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
		{ name: "NestJS", category: "Backend", color: "#E0234E" },
		{ name: "Django", category: "Backend", color: "#092E20" },
		{ name: "FastAPI", category: "Backend", color: "#009688" },
		{ name: "Flask", category: "Backend", color: "#000000" },
		{ name: "Spring Boot", category: "Backend", color: "#6DB33F" },
		{ name: "Laravel", category: "Backend", color: "#FF2D20" },
		{ name: "Ruby on Rails", category: "Backend", color: "#CC0000" },

		// データベース
		{ name: "PostgreSQL", category: "Database", color: "#336791" },
		{ name: "MySQL", category: "Database", color: "#4479A1" },
		{ name: "MongoDB", category: "Database", color: "#47A248" },
		{ name: "Redis", category: "Database", color: "#DC382D" },
		{ name: "Supabase", category: "Database", color: "#3ECF8E" },
		{ name: "Firebase", category: "Database", color: "#FFCA28" },
		{ name: "Prisma", category: "Database", color: "#2D3748" },

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
	];

	const technologies = await Promise.all(
		technologiesData.map((tech) =>
			prisma.technology.create({
				data: tech,
			}),
		),
	);
	console.log(`✅ ${technologies.length}個のTechnologyを作成\n`);

	// 2. Hashtagデータ
	console.log("2️⃣ Hashtagデータ作成...");
	const hashtags = await Promise.all([
		prisma.hashtag.create({ data: { name: "react" } }),
		prisma.hashtag.create({ data: { name: "nextjs" } }),
		prisma.hashtag.create({ data: { name: "typescript" } }),
		prisma.hashtag.create({ data: { name: "nodejs" } }),
		prisma.hashtag.create({ data: { name: "python" } }),
		prisma.hashtag.create({ data: { name: "golang" } }),
		prisma.hashtag.create({ data: { name: "docker" } }),
		prisma.hashtag.create({ data: { name: "kubernetes" } }),
		prisma.hashtag.create({ data: { name: "aws" } }),
		prisma.hashtag.create({ data: { name: "postgresql" } }),
		prisma.hashtag.create({ data: { name: "webdev" } }),
		prisma.hashtag.create({ data: { name: "backend" } }),
		prisma.hashtag.create({ data: { name: "frontend" } }),
		prisma.hashtag.create({ data: { name: "tutorial" } }),
		prisma.hashtag.create({ data: { name: "tips" } }),
	]);
	console.log(`✅ ${hashtags.length}個のHashtagを作成\n`);

	// 3. Userデータ（開発用テストユーザー）
	console.log("3️⃣ Userデータ作成...");
	const users = await Promise.all([
		prisma.user.create({
			data: {
				username: "alice_dev",
				displayName: "Alice Developer",
				email: "alice@example.com",
				bio: "フロントエンドエンジニア。React、TypeScriptが得意です。",
				image:
					"https://images.unsplash.com/photo-1494790108755-2616b612b547?w=400&h=400&fit=crop&crop=face",
			},
		}),
		prisma.user.create({
			data: {
				username: "bob_backend",
				displayName: "Bob Backend",
				email: "bob@example.com",
				bio: "バックエンドエンジニア。Go、Python、AWSでインフラ構築中。",
				image:
					"https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop&crop=face",
			},
		}),
		prisma.user.create({
			data: {
				username: "charlie_fullstack",
				displayName: "Charlie FullStack",
				email: "charlie@example.com",
				bio: "フルスタックエンジニア。Next.js + Supabaseで開発してます。",
				image:
					"https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&h=400&fit=crop&crop=face",
			},
		}),
		prisma.user.create({
			data: {
				username: "diana_mobile",
				displayName: "Diana Mobile",
				email: "diana@example.com",
				bio: "モバイルアプリエンジニア。React Native、Flutter使い。",
				image:
					"https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400&h=400&fit=crop&crop=face",
			},
		}),
		prisma.user.create({
			data: {
				username: "eva_devops",
				displayName: "Eva DevOps",
				email: "eva@example.com",
				bio: "DevOpsエンジニア。Docker、Kubernetes、CI/CDが専門。",
				image:
					"https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&h=400&fit=crop&crop=face",
			},
		}),
	]);
	console.log(`✅ ${users.length}人のUserを作成\n`);

	// 4. UserTechnology関連付け
	console.log("4️⃣ UserTechnology関連付け...");
	// 技術名でIDを取得するヘルパー関数
	const getTechId = (name: string) => {
		const tech = technologies.find((t) => t.name === name);
		if (!tech) throw new Error(`Technology not found: ${name}`);
		return tech.id;
	};

	const userTechnologies = await Promise.all([
		// Alice: React, TypeScript, Next.js, Tailwind CSS
		prisma.userTechnology.create({
			data: { userId: users[0].id, technologyId: getTechId("React") },
		}),
		prisma.userTechnology.create({
			data: { userId: users[0].id, technologyId: getTechId("TypeScript") },
		}),
		prisma.userTechnology.create({
			data: { userId: users[0].id, technologyId: getTechId("Next.js") },
		}),
		prisma.userTechnology.create({
			data: { userId: users[0].id, technologyId: getTechId("Tailwind CSS") },
		}),

		// Bob: Node.js, Python, Go, AWS, PostgreSQL
		prisma.userTechnology.create({
			data: { userId: users[1].id, technologyId: getTechId("Node.js") },
		}),
		prisma.userTechnology.create({
			data: { userId: users[1].id, technologyId: getTechId("Python") },
		}),
		prisma.userTechnology.create({
			data: { userId: users[1].id, technologyId: getTechId("Go") },
		}),
		prisma.userTechnology.create({
			data: { userId: users[1].id, technologyId: getTechId("AWS") },
		}),
		prisma.userTechnology.create({
			data: { userId: users[1].id, technologyId: getTechId("PostgreSQL") },
		}),

		// Charlie: React, Next.js, TypeScript, PostgreSQL, Supabase
		prisma.userTechnology.create({
			data: { userId: users[2].id, technologyId: getTechId("React") },
		}),
		prisma.userTechnology.create({
			data: { userId: users[2].id, technologyId: getTechId("Next.js") },
		}),
		prisma.userTechnology.create({
			data: { userId: users[2].id, technologyId: getTechId("TypeScript") },
		}),
		prisma.userTechnology.create({
			data: { userId: users[2].id, technologyId: getTechId("PostgreSQL") },
		}),
		prisma.userTechnology.create({
			data: { userId: users[2].id, technologyId: getTechId("Supabase") },
		}),

		// Diana: React Native, TypeScript, Node.js, Flutter
		prisma.userTechnology.create({
			data: { userId: users[3].id, technologyId: getTechId("React Native") },
		}),
		prisma.userTechnology.create({
			data: { userId: users[3].id, technologyId: getTechId("TypeScript") },
		}),
		prisma.userTechnology.create({
			data: { userId: users[3].id, technologyId: getTechId("Node.js") },
		}),
		prisma.userTechnology.create({
			data: { userId: users[3].id, technologyId: getTechId("Flutter") },
		}),

		// Eva: Docker, Kubernetes, AWS, Go, Terraform
		prisma.userTechnology.create({
			data: { userId: users[4].id, technologyId: getTechId("Docker") },
		}),
		prisma.userTechnology.create({
			data: { userId: users[4].id, technologyId: getTechId("Kubernetes") },
		}),
		prisma.userTechnology.create({
			data: { userId: users[4].id, technologyId: getTechId("AWS") },
		}),
		prisma.userTechnology.create({
			data: { userId: users[4].id, technologyId: getTechId("Go") },
		}),
		prisma.userTechnology.create({
			data: { userId: users[4].id, technologyId: getTechId("Terraform") },
		}),
	]);
	console.log(
		`✅ ${userTechnologies.length}個のUserTechnology関連付けを作成\n`,
	);

	// 5. Follow関係
	console.log("5️⃣ Follow関係作成...");
	const follows = await Promise.all([
		prisma.follow.create({
			data: { followerId: users[0].id, followingId: users[1].id },
		}),
		prisma.follow.create({
			data: { followerId: users[0].id, followingId: users[2].id },
		}),
		prisma.follow.create({
			data: { followerId: users[1].id, followingId: users[0].id },
		}),
		prisma.follow.create({
			data: { followerId: users[1].id, followingId: users[4].id },
		}),
		prisma.follow.create({
			data: { followerId: users[2].id, followingId: users[0].id },
		}),
		prisma.follow.create({
			data: { followerId: users[2].id, followingId: users[3].id },
		}),
		prisma.follow.create({
			data: { followerId: users[3].id, followingId: users[2].id },
		}),
		prisma.follow.create({
			data: { followerId: users[4].id, followingId: users[1].id },
		}),
	]);
	console.log(`✅ ${follows.length}個のFollow関係を作成\n`);

	// 6. RSS Sourceデータ
	console.log("6️⃣ RSS Sourceデータ作成...");
	const rssSources = await Promise.all([
		prisma.rssSource.create({
			data: {
				feedUrl: "https://dev.to/feed",
				siteUrl: "https://dev.to",
				title: "DEV Community",
				description:
					"A constructive and inclusive social network for software developers",
				category: "General",
				language: "en",
				isActive: true,
				fetchIntervalMinutes: 60,
			},
		}),
		prisma.rssSource.create({
			data: {
				feedUrl: "https://blog.golang.org/feed.atom",
				siteUrl: "https://blog.golang.org",
				title: "The Go Blog",
				description: "Official blog of the Go programming language",
				category: "Language",
				language: "en",
				isActive: true,
				fetchIntervalMinutes: 120,
			},
		}),
		prisma.rssSource.create({
			data: {
				feedUrl: "https://react.dev/rss.xml",
				siteUrl: "https://react.dev",
				title: "React Blog",
				description: "Official React blog with updates and announcements",
				category: "Frontend",
				language: "en",
				isActive: true,
				fetchIntervalMinutes: 180,
			},
		}),
		prisma.rssSource.create({
			data: {
				feedUrl: "https://zenn.dev/feed",
				siteUrl: "https://zenn.dev",
				title: "Zenn",
				description: "エンジニアのための技術情報共有コミュニティ",
				category: "General",
				language: "ja",
				isActive: true,
				fetchIntervalMinutes: 30,
			},
		}),
		prisma.rssSource.create({
			data: {
				feedUrl: "https://qiita.com/popular-items/feed",
				siteUrl: "https://qiita.com",
				title: "Qiita - Popular",
				description: "プログラマのための技術情報共有サービス",
				category: "General",
				language: "ja",
				isActive: true,
				fetchIntervalMinutes: 45,
			},
		}),
	]);
	console.log(`✅ ${rssSources.length}個のRSS Sourceを作成\n`);

	// 7. RSS Entryデータ（サンプル記事）
	console.log("7️⃣ RSS Entryデータ作成...");
	const baseDate = new Date("2024-01-15T10:00:00Z");
	const rssEntries = await Promise.all([
		prisma.rssEntry.create({
			data: {
				sourceId: rssSources[0].id,
				guid: "dev-to-react-hooks-guide",
				link: "https://dev.to/example/react-hooks-guide",
				title: "Complete Guide to React Hooks in 2024",
				description:
					"Learn everything you need to know about React Hooks with practical examples",
				contentText:
					"React Hooks have revolutionized how we write React components...",
				authorName: "John Developer",
				language: "en",
				imageUrl:
					"https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=800&h=400&fit=crop",
				publishedAt: new Date(baseDate.getTime() - 1 * 24 * 60 * 60 * 1000),
				contentHash: "hash1",
			},
		}),
		prisma.rssEntry.create({
			data: {
				sourceId: rssSources[1].id,
				guid: "go-blog-generics-2024",
				link: "https://blog.golang.org/generics-update",
				title: "Go Generics: Advanced Patterns and Best Practices",
				description:
					"Explore advanced use cases for Go generics introduced in Go 1.18+",
				contentText:
					"Go generics have opened up new possibilities for type-safe programming...",
				authorName: "Go Team",
				language: "en",
				imageUrl:
					"https://images.unsplash.com/photo-1516259762381-22954d7d3ad2?w=800&h=400&fit=crop",
				publishedAt: new Date(baseDate.getTime() - 2 * 24 * 60 * 60 * 1000),
				contentHash: "hash2",
			},
		}),
		prisma.rssEntry.create({
			data: {
				sourceId: rssSources[2].id,
				guid: "react-server-components",
				link: "https://react.dev/blog/server-components",
				title: "Understanding React Server Components",
				description: "Deep dive into React Server Components and how they work",
				contentText:
					"React Server Components represent a new paradigm in React development...",
				authorName: "React Team",
				language: "en",
				imageUrl:
					"https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=800&h=400&fit=crop",
				publishedAt: new Date(baseDate.getTime() - 3 * 24 * 60 * 60 * 1000),
				contentHash: "hash3",
			},
		}),
		prisma.rssEntry.create({
			data: {
				sourceId: rssSources[3].id,
				guid: "zenn-nextjs-app-router",
				link: "https://zenn.dev/example/nextjs-app-router",
				title: "Next.js App Routerを使いこなす：実践的な使い方",
				description: "Next.js 13以降のApp Routerの実践的な活用方法を解説",
				contentText: "Next.js App Routerは従来のPages Routerと比べて...",
				authorName: "Zenn Developer",
				language: "ja",
				imageUrl:
					"https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=800&h=400&fit=crop",
				publishedAt: new Date(baseDate.getTime() - 4 * 24 * 60 * 60 * 1000),
				contentHash: "hash4",
			},
		}),
		prisma.rssEntry.create({
			data: {
				sourceId: rssSources[4].id,
				guid: "qiita-typescript-tips",
				link: "https://qiita.com/example/typescript-tips",
				title: "TypeScript開発効率を上げる10のTips",
				description:
					"日々のTypeScript開発で役立つ実践的なテクニックをまとめました",
				contentText: "TypeScriptでの開発において、型安全性を保ちながら...",
				authorName: "Qiita User",
				language: "ja",
				imageUrl:
					"https://images.unsplash.com/photo-1516259762381-22954d7d3ad2?w=800&h=400&fit=crop",
				publishedAt: new Date(baseDate.getTime() - 5 * 24 * 60 * 60 * 1000),
				contentHash: "hash5",
			},
		}),
	]);
	console.log(`✅ ${rssEntries.length}個のRSS Entryを作成\n`);

	// 9. RSS Entry Hashtag関連付け
	console.log("8️⃣ RSS Entry Hashtag関連付け...");
	const rssEntryHashtags = await Promise.all([
		// React Hooks記事
		prisma.rssEntryHashtag.create({
			data: { entryId: rssEntries[0].id, hashtagId: hashtags[0].id },
		}),
		prisma.rssEntryHashtag.create({
			data: { entryId: rssEntries[0].id, hashtagId: hashtags[12].id },
		}),
		prisma.rssEntryHashtag.create({
			data: { entryId: rssEntries[0].id, hashtagId: hashtags[13].id },
		}),

		// Go記事
		prisma.rssEntryHashtag.create({
			data: { entryId: rssEntries[1].id, hashtagId: hashtags[5].id },
		}),
		prisma.rssEntryHashtag.create({
			data: { entryId: rssEntries[1].id, hashtagId: hashtags[11].id },
		}),

		// React Server Components記事
		prisma.rssEntryHashtag.create({
			data: { entryId: rssEntries[2].id, hashtagId: hashtags[0].id },
		}),
		prisma.rssEntryHashtag.create({
			data: { entryId: rssEntries[2].id, hashtagId: hashtags[1].id },
		}),

		// Next.js記事
		prisma.rssEntryHashtag.create({
			data: { entryId: rssEntries[3].id, hashtagId: hashtags[1].id },
		}),
		prisma.rssEntryHashtag.create({
			data: { entryId: rssEntries[3].id, hashtagId: hashtags[14].id },
		}),

		// TypeScript記事
		prisma.rssEntryHashtag.create({
			data: { entryId: rssEntries[4].id, hashtagId: hashtags[2].id },
		}),
		prisma.rssEntryHashtag.create({
			data: { entryId: rssEntries[4].id, hashtagId: hashtags[14].id },
		}),
	]);
	console.log(
		`✅ ${rssEntryHashtags.length}個のRSS Entry Hashtag関連付けを作成\n`,
	);

	// 10. Postデータ（ユーザー投稿）
	console.log("9️⃣ Postデータ作成...");
	const posts = await Promise.all([
		prisma.post.create({
			data: {
				authorId: users[0].id,
				type: "TEXT",
				title: "React 19の新機能について",
				body: "React 19で追加された新機能について調べてみました。特にConcurrent Featuresの改善が注目ですね！みなさんはもう試しましたか？ #React #Frontend",
				createdAt: new Date(baseDate.getTime() - 6 * 60 * 60 * 1000),
			},
		}),
		prisma.post.create({
			data: {
				authorId: users[1].id,
				type: "TEXT",
				title: "Go 1.23の新機能レビュー",
				body: "Go 1.23がリリースされました！新しいslices packageが便利すぎる...。パフォーマンス改善も素晴らしいです。 #Go #Backend #Performance",
				createdAt: new Date(baseDate.getTime() - 12 * 60 * 60 * 1000),
			},
		}),
		prisma.post.create({
			data: {
				authorId: users[2].id,
				type: "TEXT",
				title: "Supabase + Next.js 最高の組み合わせ",
				body: "Supabaseを使ったNext.jsアプリ開発が本当に快適。RLSでセキュリティも万全、リアルタイム機能も簡単に実装できます！ #NextJS #Supabase #FullStack",
				createdAt: new Date(baseDate.getTime() - 18 * 60 * 60 * 1000),
			},
		}),
		prisma.post.create({
			data: {
				authorId: users[3].id,
				type: "TEXT",
				title: "React Native vs Flutter 2024",
				body: "モバイル開発でReact NativeとFlutterを両方使ってみた感想。用途によって使い分けるのがベストですが、最近はFlutterが優勢かも？ #ReactNative #Flutter #Mobile",
				createdAt: new Date(baseDate.getTime() - 24 * 60 * 60 * 1000),
			},
		}),
		prisma.post.create({
			data: {
				authorId: users[4].id,
				type: "TEXT",
				title: "Kubernetesでの障害対応事例",
				body: "本日のKubernetesクラスター障害対応の記録。Podが突然Terminatingになってしまった原因と対処法をまとめました。 #Kubernetes #DevOps #TroubleShooting",
				createdAt: new Date(baseDate.getTime() - 30 * 60 * 60 * 1000),
			},
		}),
	]);
	console.log(`✅ ${posts.length}個のPostを作成\n`);

	// 11. Feed Itemデータ
	console.log("🔟 Feed Itemデータ作成...");
	const feedItems = await Promise.all([
		// RSS記事のFeedItem
		...rssEntries.map((entry, index) =>
			prisma.feedItem.create({
				data: {
					type: "RSS_ENTRY",
					rssEntryId: entry.id,
					publishedAt: entry.publishedAt,
					rankScore: 0.8 - index * 0.1,
					isPublished: true,
				},
			}),
		),
		// ユーザー投稿のFeedItem
		...posts.map((post, index) =>
			prisma.feedItem.create({
				data: {
					type: "POST",
					postId: post.id,
					publishedAt: post.createdAt,
					rankScore: 0.9 - index * 0.05,
					isPublished: true,
				},
			}),
		),
	]);
	console.log(`✅ ${feedItems.length}個のFeed Itemを作成\n`);

	// 12. Like・Bookmark・Comment データ
	console.log("1️⃣1️⃣ Like・Bookmark・Commentデータ作成...");

	// Likes (FeedItemを使用)
	const likes = await Promise.all([
		prisma.like.create({
			data: { userId: users[1].id, feedItemId: feedItems[5].id },
		}),
		prisma.like.create({
			data: { userId: users[2].id, feedItemId: feedItems[5].id },
		}),
		prisma.like.create({
			data: { userId: users[0].id, feedItemId: feedItems[6].id },
		}),
		prisma.like.create({
			data: { userId: users[3].id, feedItemId: feedItems[6].id },
		}),
		prisma.like.create({
			data: { userId: users[4].id, feedItemId: feedItems[6].id },
		}),
	]);

	// Bookmarks (FeedItemを使用)
	const bookmarks = await Promise.all([
		prisma.bookmark.create({
			data: { userId: users[0].id, feedItemId: feedItems[6].id },
		}),
		prisma.bookmark.create({
			data: { userId: users[1].id, feedItemId: feedItems[7].id },
		}),
		prisma.bookmark.create({
			data: { userId: users[2].id, feedItemId: feedItems[9].id },
		}),
	]);

	// Comments
	const comments = await Promise.all([
		prisma.comment.create({
			data: {
				postId: posts[0].id,
				userId: users[1].id,
				body: "React 19の新機能、本当に便利ですね！特にuse()フックが気になっています。",
			},
		}),
		prisma.comment.create({
			data: {
				postId: posts[0].id,
				userId: users[2].id,
				body: "Concurrent Featuresの安定性がかなり向上したみたいですね。プロダクションでも安心して使えそう！",
			},
		}),
		prisma.comment.create({
			data: {
				postId: posts[1].id,
				userId: users[0].id,
				body: "Go 1.23のslices package、本当に便利ですよね。コードがかなりシンプルになりました。",
			},
		}),
	]);

	console.log(
		`✅ ${likes.length}個のLike、${bookmarks.length}個のBookmark、${comments.length}個のCommentを作成\n`,
	);

	// 最終確認
	const totalCounts = {
		users: await prisma.user.count(),
		technologies: await prisma.technology.count(),
		hashtags: await prisma.hashtag.count(),
		rssSources: await prisma.rssSource.count(),
		rssEntries: await prisma.rssEntry.count(),
		posts: await prisma.post.count(),
		feedItems: await prisma.feedItem.count(),
		likes: await prisma.like.count(),
		bookmarks: await prisma.bookmark.count(),
		comments: await prisma.comment.count(),
		follows: await prisma.follow.count(),
	};

	console.log("📊 シードデータ投入結果:");
	console.log(`   👥 Users: ${totalCounts.users}人`);
	console.log(`   🔧 Technologies: ${totalCounts.technologies}個`);
	console.log(`   🏷️ Hashtags: ${totalCounts.hashtags}個`);
	console.log(`   📡 RSS Sources: ${totalCounts.rssSources}個`);
	console.log(`   📰 RSS Entries: ${totalCounts.rssEntries}記事`);
	console.log(`   📝 Posts: ${totalCounts.posts}投稿`);
	console.log(`   📋 Feed Items: ${totalCounts.feedItems}項目`);
	console.log(`   👍 Likes: ${totalCounts.likes}個`);
	console.log(`   🔖 Bookmarks: ${totalCounts.bookmarks}個`);
	console.log(`   💬 Comments: ${totalCounts.comments}個`);
	console.log(`   🤝 Follows: ${totalCounts.follows}関係`);

	console.log("\n🎉 シードデータの投入が完了しました！");
}

main()
	.catch((e) => {
		console.error("❌ シードデータ投入エラー:", e);
		process.exit(1);
	})
	.finally(async () => {
		await prisma.$disconnect();
	});
