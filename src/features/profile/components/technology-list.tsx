import { useState } from "react";
import { Button } from "@/components/ui/button";
import type { TechnologyListProps } from "@/features/profile/types";
import { TechnologyTag } from "./technology-tag";

/**
 * 技術タグのリストを表示するコンポーネント
 */
export function TechnologyList({
	technologies,
	maxVisible = 6,
}: TechnologyListProps) {
	const [showAll, setShowAll] = useState(false);

	const visibleTechnologies = showAll
		? technologies
		: technologies.slice(0, maxVisible);

	const hasMore = technologies.length > maxVisible;

	if (technologies.length === 0) {
		return (
			<div className="text-muted-foreground text-sm">
				技術スタックが登録されていません
			</div>
		);
	}

	return (
		<div className="space-y-3">
			<div className="flex flex-wrap gap-2">
				{visibleTechnologies.map((technology) => (
					<TechnologyTag
						key={technology.id}
						technology={technology}
						size="sm"
					/>
				))}
			</div>

			{hasMore && (
				<Button
					variant="ghost"
					size="sm"
					onClick={() => setShowAll(!showAll)}
					className="h-auto p-0 text-sm text-muted-foreground hover:text-foreground"
				>
					{showAll
						? "表示を減らす"
						: `他 ${technologies.length - maxVisible} 件を表示`}
				</Button>
			)}
		</div>
	);
}
