/**
 * Better Auth Configuration
 * Google・GitHub OAuth認証とPrisma Adapterの設定
 */

import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { prisma } from "@/lib/prisma";

export const auth = betterAuth({
	database: prismaAdapter(prisma, {
		provider: "postgresql",
	}),
	emailAndPassword: {
		enabled: false, // メール/パスワード認証は無効化（OAuth のみ）
	},
	socialProviders: {
		google: {
			clientId: process.env.AUTH_GOOGLE_ID || "",
			clientSecret: process.env.AUTH_GOOGLE_SECRET || "",
		},
		github: {
			clientId: process.env.AUTH_GITHUB_ID || "",
			clientSecret: process.env.AUTH_GITHUB_SECRET || "",
		},
	},
	session: {
		expiresIn: 60 * 60 * 24 * 30, // 30日間（秒単位）
		updateAge: 60 * 60 * 24, // 24時間ごとにセッション更新
	},
	advanced: {
		cookiePrefix: "tech-tok",
		crossSubDomainCookies: {
			enabled: false,
		},
	},
});

export type Session = typeof auth.$Infer.Session;

/**
 * サーバーコンポーネントやServer Actionsでセッションを取得
 */
export async function getSession() {
	return await auth.api.getSession({
		headers: await import("next/headers").then((mod) => mod.headers()),
	});
}

/**
 * 認証が必要なページで使用するヘルパー関数
 * 未認証の場合はnullを返す
 */
export async function requireAuth() {
	const session = await getSession();
	return session;
}
