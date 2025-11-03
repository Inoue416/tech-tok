"use client";

import { Edit } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { ProfileInfoSectionProps } from "@/features/profile/types";
import { cn } from "@/lib/utils";

/**
 * プロフィール情報セクション（技術スタック表示）
 */
export function ProfileInfoSection({
	technologies,
	onEdit,
}: ProfileInfoSectionProps) {
	return (
		<div className="space-y-4 p-6 bg-card rounded-lg border">
			<div className="flex items-center justify-between">
				<h2 className="text-lg font-semibold text-foreground">技術スタック</h2>
				<Button
					onClick={onEdit}
					variant="ghost"
					size="sm"
					aria-label="技術スタックを編集"
				>
					<Edit className="size-4" />
				</Button>
			</div>

			{technologies.length > 0 ? (
				<div className="flex flex-wrap gap-2">
					{technologies.map((tech) => (
						<div
							key={tech.id}
							className={cn(
								"inline-flex items-center rounded-full px-3 py-1 text-sm font-medium",
								"bg-primary/10 text-primary border border-primary/20",
							)}
							style={
								tech.color
									? {
											backgroundColor: `${tech.color}20`,
											color: tech.color,
											borderColor: `${tech.color}40`,
										}
									: undefined
							}
						>
							{tech.name}
						</div>
					))}
				</div>
			) : (
				<div className="text-center py-8">
					<p className="text-sm text-muted-foreground mb-3">
						技術スタックが設定されていません
					</p>
					<Button onClick={onEdit} variant="outline" size="sm">
						技術スタックを追加
					</Button>
				</div>
			)}
		</div>
	);
}
