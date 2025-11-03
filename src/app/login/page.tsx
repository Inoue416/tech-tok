import { redirect } from "next/navigation";
import { LoginForm } from "@/features/auth/components/login-form";
import { getSession } from "@/lib/auth";

/**
 * ログインページ
 * 既にログイン済みの場合はフィードページにリダイレクト
 */
export default async function LoginPage() {
	// セッションチェック
	const session = await getSession();

	// 既にログイン済みの場合はフィードページにリダイレクト
	if (session?.user) {
		redirect("/feed");
	}

	return <LoginForm callbackUrl="/feed" />;
}
