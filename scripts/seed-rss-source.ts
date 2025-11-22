/**
 * Database seed script for RSS sources
 * Seeds initial RSS feed sources for Qiita, Zenn, and Hatena Blog
 */

import { prisma } from "@/lib/prisma";

interface RssSourceSeedData {
	feedUrl: string;
	siteUrl: string;
	title: string;
	description: string;
	language: string;
	category: string;
	isActive: boolean;
	fetchIntervalMinutes: number;
}

const RSS_SOURCES: RssSourceSeedData[] = [
	{
		feedUrl:
			process.env.FEED_QIITA_URL || "https://qiita.com/popular-items/feed.atom",
		siteUrl: "https://qiita.com",
		title: "Qiita - 人気の投稿",
		description: "Qiitaの人気記事フィード",
		language: "ja",
		category: "Qiita",
		isActive: true,
		fetchIntervalMinutes: 60,
	},
	{
		feedUrl: process.env.FEED_ZENN_URL || "https://zenn.dev/feed",
		siteUrl: "https://zenn.dev",
		title: "Zenn - 最新の投稿",
		description: "Zennの最新記事フィード",
		language: "ja",
		category: "Zenn",
		isActive: true,
		fetchIntervalMinutes: 60,
	},
	{
		feedUrl:
			process.env.FEED_HATENA_URL || "https://b.hatena.ne.jp/hotentry/it.rss",
		siteUrl: "https://b.hatena.ne.jp",
		title: "はてなブックマーク - 人気エントリー（IT）",
		description: "はてなブックマークの人気IT記事フィード",
		language: "ja",
		category: "Hatena",
		isActive: true,
		fetchIntervalMinutes: 60,
	},
];

export async function seed() {
	console.log("🌱 Seeding RSS sources...");

	try {
		let createdCount = 0;
		let skippedCount = 0;

		for (const sourceData of RSS_SOURCES) {
			// Check if source already exists
			const existing = await prisma.rssSource.findUnique({
				where: { feedUrl: sourceData.feedUrl },
			});

			if (existing) {
				console.log(`⏭️  Skipped: ${sourceData.title} (already exists)`);
				skippedCount++;
				continue;
			}

			// Create new RSS source
			await prisma.rssSource.create({
				data: sourceData,
			});

			console.log(`✅ Created: ${sourceData.title}`);
			createdCount++;
		}

		console.log("\n📊 Seeding Summary:");
		console.log(`   Created: ${createdCount}`);
		console.log(`   Skipped: ${skippedCount}`);
		console.log(`   Total:   ${RSS_SOURCES.length}`);
		console.log("\n✨ Seeding completed successfully!");
	} catch (error) {
		console.error("❌ Seeding failed:", error);
		throw error;
	} finally {
		await prisma.$disconnect();
	}
}

// Run if executed directly
if (import.meta.url === `file://${process.argv[1]}`) {
	seed().catch((error) => {
		console.error("Seeding failed:", error);
		process.exit(1);
	});
}
