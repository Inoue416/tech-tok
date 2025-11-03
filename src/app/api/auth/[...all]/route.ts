/**
 * Better Auth API Route Handler
 * すべての認証関連のエンドポイントを処理
 *
 * エンドポイント例:
 * - POST /api/auth/sign-in/social
 * - GET /api/auth/callback/google
 * - GET /api/auth/callback/github
 * - GET /api/auth/session
 * - POST /api/auth/sign-out
 */

import { auth } from "@/lib/auth";

export async function GET(request: Request) {
	return auth.handler(request);
}

export async function POST(request: Request) {
	return auth.handler(request);
}
