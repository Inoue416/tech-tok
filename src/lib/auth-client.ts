/**
 * Better Auth Client
 * クライアントコンポーネントで使用する認証関連のヘルパー関数
 */

import { createAuthClient } from "better-auth/react";

export const authClient = createAuthClient({
	baseURL: process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000",
});

export const { signIn, signOut, useSession } = authClient;
