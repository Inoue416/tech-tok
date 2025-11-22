import { redirect } from "next/navigation";
import { LoginForm } from "@/features/auth/components/login-form";
import { getSession } from "@/lib/auth";

/**
 * ログインページ
 * 既にログイン済みの場合はフィードページにリダイレクト
 */
export default async function LoginPage({
	searchParams,
}: {
	searchParams: Promise<{ callbackUrl?: string }>;
}) {
	// セッションチェック
	const session = await getSession();

	// searchParamsをawaitで解決
	const params = await searchParams;

	// callbackUrlを取得（デフォルトは/feed）
	const callbackUrl = params.callbackUrl || "/feed";

	// 既にログイン済みの場合はcallbackUrlにリダイレクト
	if (session?.user) {
		redirect(callbackUrl);
	}

	return <LoginForm callbackUrl={callbackUrl} />;
}
