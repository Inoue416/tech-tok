import type { ProfileStatsProps } from "@/features/profile/types";
import { cn } from "@/lib/utils";

interface StatItemProps {
	label: string;
	value: number;
	className?: string;
}

/**
 * 統計項目を表示するコンポーネント
 */
function StatItem({ label, value, className }: StatItemProps) {
	const formatNumber = (num: number): string => {
		if (num >= 1000000) {
			return `${(num / 1000000).toFixed(1)}M`;
		}
		if (num >= 1000) {
			return `${(num / 1000).toFixed(1)}K`;
		}
		return num.toString();
	};

	return (
		<div className={cn("text-center", className)}>
			<div className="text-xl font-bold text-foreground">
				{formatNumber(value)}
			</div>
			<div className="text-sm text-muted-foreground">{label}</div>
		</div>
	);
}

/**
 * プロフィール統計情報を表示するコンポーネント
 */
export function ProfileStats({ stats }: ProfileStatsProps) {
	return (
		<div className="flex justify-center gap-8 py-4">
			<StatItem label="投稿" value={stats.posts} />
			<StatItem label="フォロワー" value={stats.followers} />
			<StatItem label="フォロー中" value={stats.following} />
		</div>
	);
}
