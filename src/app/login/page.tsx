import { LoginForm } from "@/components/auth/login-form";

/**
 * ログインページ
 */
export default function LoginPage() {
	/**
	 * OAuthログインのハンドラー（後で実装予定）
	 */
	const handleOAuthLogin = (provider: "github" | "google") => {
		console.log(`OAuth login with ${provider}`);
		// TODO: NextAuth.jsを使用したOAuth認証の実装
	};

	return (
		<LoginForm
			onOAuthLogin={handleOAuthLogin}
			// isLoading={false}
			// error="ログインエラーのテスト"
		/>
	);
}
