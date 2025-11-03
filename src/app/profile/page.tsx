import { redirect } from "next/navigation";
import { ClientProfile } from "@/app/profile/client-profile";
import { getSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

/**
 * プロフィールページ（Server Component）
 * セッション取得、認証チェック、データ取得を行う
 */
export default async function ProfilePage() {
	// セッション取得
	const session = await getSession();

	// 未認証の場合はログインページにリダイレクト
	if (!session?.user?.id) {
		redirect("/login");
	}

	const userId = session.user.id;

	// ユーザー情報と技術スタックを取得
	const user = await prisma.user.findUnique({
		where: { id: userId },
		select: {
			id: true,
			username: true,
			displayName: true,
			image: true,
			userTechnologies: {
				include: {
					technology: {
						select: {
							id: true,
							name: true,
							category: true,
							color: true,
						},
					},
				},
			},
		},
	});

	// ユーザーが見つからない場合（通常は発生しない）
	if (!user) {
		redirect("/login");
	}

	// 利用可能な技術一覧を取得
	const availableTechnologies = await prisma.technology.findMany({
		select: {
			id: true,
			name: true,
			category: true,
			color: true,
		},
		orderBy: {
			name: "asc",
		},
	});

	// 技術スタックを整形
	const technologies = user.userTechnologies.map((ut) => ({
		id: ut.technology.id,
		name: ut.technology.name,
		category: ut.technology.category,
		color: ut.technology.color,
	}));

	return (
		<ClientProfile
			user={{
				id: user.id,
				username: user.username,
				displayName: user.displayName,
				image: user.image,
			}}
			technologies={technologies}
			availableTechnologies={availableTechnologies}
		/>
	);
}
