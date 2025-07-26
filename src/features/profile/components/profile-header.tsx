import { Edit, Share2, UserMinus, UserPlus } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { ProfileHeaderProps } from "@/features/profile/types";
import { ProfileAvatar } from "./profile-avatar";
import { ProfileStats } from "./profile-stats";
import { TechnologyList } from "./technology-list";

/**
 * プロフィールヘッダーを表示するコンポーネント
 */
export function ProfileHeader({
	profile,
	onFollow,
	onUnfollow,
	onShare,
	onProfileEdit,
}: ProfileHeaderProps) {
	const handleFollowClick = () => {
		if (profile.isFollowing) {
			onUnfollow?.(profile.id);
		} else {
			onFollow?.(profile.id);
		}
	};

	const handleShareClick = () => {
		onShare?.(profile);
	};

	const handleEditClick = () => {
		onProfileEdit?.({
			displayName: profile.displayName,
			username: profile.username,
			bio: profile.bio || "",
			technologies: profile.technologies,
		});
	};

	return (
		<div className="space-y-6">
			{/* プロフィール画像と基本情報 */}
			<div className="flex flex-col items-center text-center space-y-4">
				<ProfileAvatar
					src={profile.avatar}
					alt={profile.displayName}
					size="xl"
				/>

				<div className="space-y-2">
					<h1 className="text-2xl font-bold text-foreground">
						{profile.displayName}
					</h1>
					<p className="text-muted-foreground">@{profile.username}</p>
					{profile.bio && (
						<p className="text-sm text-muted-foreground max-w-md">
							{profile.bio}
						</p>
					)}
				</div>
			</div>

			{/* 統計情報 */}
			<ProfileStats stats={profile.stats} />

			{/* アクションボタン */}
			<div className="flex justify-center gap-3">
				{profile.isOwnProfile ? (
					<>
						<Button
							onClick={handleEditClick}
							variant="outline"
							size="sm"
							className="flex items-center gap-2"
						>
							<Edit className="size-4" />
							プロフィールを編集
						</Button>
						<Button
							onClick={handleShareClick}
							variant="outline"
							size="sm"
							className="flex items-center gap-2"
						>
							<Share2 className="size-4" />
							シェア
						</Button>
					</>
				) : (
					<>
						<Button
							onClick={handleFollowClick}
							variant={profile.isFollowing ? "outline" : "default"}
							size="sm"
							className="flex items-center gap-2"
						>
							{profile.isFollowing ? (
								<>
									<UserMinus className="size-4" />
									フォロー中
								</>
							) : (
								<>
									<UserPlus className="size-4" />
									フォローする
								</>
							)}
						</Button>

						<Button
							onClick={handleShareClick}
							variant="outline"
							size="sm"
							className="flex items-center gap-2"
						>
							<Share2 className="size-4" />
							シェア
						</Button>
					</>
				)}
			</div>

			{/* 技術スタック */}
			<div className="space-y-3">
				<h3 className="text-sm font-semibold text-foreground">技術スタック</h3>
				<TechnologyList technologies={profile.technologies} />
			</div>
		</div>
	);
}
