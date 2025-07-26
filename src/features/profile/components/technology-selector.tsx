import { Search, X } from "lucide-react";
import { useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
	availableTechnologies,
	searchTechnologies,
} from "@/features/profile/data/technology-options";
import type { Technology } from "@/features/profile/types";
import { TechnologyTag } from "./technology-tag";

interface TechnologySelectorProps {
	selectedTechnologies: Technology[];
	onTechnologiesChange: (technologies: Technology[]) => void;
	maxSelections?: number;
}

/**
 * 技術スタック選択コンポーネント
 */
export function TechnologySelector({
	selectedTechnologies,
	onTechnologiesChange,
	maxSelections = 10,
}: TechnologySelectorProps) {
	const [searchQuery, setSearchQuery] = useState("");
	const [showSuggestions, setShowSuggestions] = useState(false);

	// 検索結果を取得
	const searchResults = useMemo(() => {
		if (!searchQuery.trim()) {
			return availableTechnologies.slice(0, 20); // 最初の20件を表示
		}
		return searchTechnologies(searchQuery);
	}, [searchQuery]);

	// 選択済みの技術スタックを除外
	const availableOptions = useMemo(() => {
		const selectedIds = new Set(selectedTechnologies.map((tech) => tech.id));
		return searchResults.filter((tech) => !selectedIds.has(tech.id));
	}, [searchResults, selectedTechnologies]);

	const handleTechnologyAdd = (technology: Technology) => {
		if (selectedTechnologies.length >= maxSelections) {
			return;
		}
		onTechnologiesChange([...selectedTechnologies, technology]);
		setSearchQuery("");
		setShowSuggestions(false);
	};

	const handleTechnologyRemove = (techId: string) => {
		onTechnologiesChange(
			selectedTechnologies.filter((tech) => tech.id !== techId),
		);
	};

	const handleInputFocus = () => {
		setShowSuggestions(true);
	};

	const handleInputBlur = () => {
		// 少し遅延させてクリックイベントを処理できるようにする
		setTimeout(() => setShowSuggestions(false), 200);
	};

	return (
		<div className="space-y-3">
			<Label>技術スタック</Label>

			{/* 選択済み技術タグ */}
			{selectedTechnologies.length > 0 && (
				<div className="flex flex-wrap gap-2">
					{selectedTechnologies.map((tech) => (
						<div key={tech.id} className="relative group">
							<TechnologyTag technology={tech} size="sm" />
							<Button
								size="icon"
								variant="destructive"
								className="absolute -top-2 -right-2 size-5 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
								onClick={() => handleTechnologyRemove(tech.id)}
							>
								<X className="size-3" />
							</Button>
						</div>
					))}
				</div>
			)}

			{/* 検索・追加エリア */}
			<div className="relative">
				<div className="relative">
					<Search className="absolute left-3 top-1/2 transform -translate-y-1/2 size-4 text-muted-foreground" />
					<Input
						value={searchQuery}
						onChange={(e) => setSearchQuery(e.target.value)}
						onFocus={handleInputFocus}
						onBlur={handleInputBlur}
						placeholder="技術スタックを検索..."
						className="pl-10"
						disabled={selectedTechnologies.length >= maxSelections}
					/>
				</div>

				{/* 選択肢のドロップダウン */}
				{showSuggestions && availableOptions.length > 0 && (
					<div className="absolute top-full left-0 right-0 z-10 mt-1 bg-background border rounded-md shadow-lg max-h-60 overflow-y-auto">
						{availableOptions.map((tech) => (
							<button
								key={tech.id}
								type="button"
								className="w-full px-4 py-2 text-left hover:bg-accent hover:text-accent-foreground flex items-center gap-2 transition-colors"
								onClick={() => handleTechnologyAdd(tech)}
							>
								<TechnologyTag technology={tech} size="sm" />
							</button>
						))}
					</div>
				)}
			</div>

			{/* 選択数の表示 */}
			<div className="text-xs text-muted-foreground">
				{selectedTechnologies.length} / {maxSelections} 選択中
				{selectedTechnologies.length >= maxSelections && (
					<span className="text-destructive ml-2">
						最大選択数に達しています
					</span>
				)}
			</div>

			{/* カテゴリ別クイック選択（人気の技術） */}
			{!searchQuery && selectedTechnologies.length < maxSelections && (
				<div className="space-y-2">
					<Label className="text-xs">人気の技術</Label>
					<div className="flex flex-wrap gap-2">
						{availableTechnologies
							.filter(
								(tech) =>
									[
										"tech-js",
										"tech-ts",
										"tech-react",
										"tech-nextjs",
										"tech-nodejs",
										"tech-python",
									].includes(tech.id) &&
									!selectedTechnologies.some(
										(selected) => selected.id === tech.id,
									),
							)
							.map((tech) => (
								<button
									key={tech.id}
									type="button"
									onClick={() => handleTechnologyAdd(tech)}
									className="transition-transform hover:scale-105"
								>
									<TechnologyTag technology={tech} size="sm" />
								</button>
							))}
					</div>
				</div>
			)}
		</div>
	);
}
