"use client";

import { Check, Search, X } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import type { TechnologySelectorProps } from "@/features/profile/types";
import { cn } from "@/lib/utils";

/**
 * 技術スタックを選択するUIコンポーネント
 */
export function TechnologySelector({
	availableTechnologies,
	selectedTechnologies,
	onSelectionChange,
	maxSelections,
}: TechnologySelectorProps) {
	const [searchQuery, setSearchQuery] = useState("");
	const [localSelected, setLocalSelected] = useState(selectedTechnologies);

	// 検索フィルター
	const filteredTechnologies = availableTechnologies.filter((tech) =>
		tech.name.toLowerCase().includes(searchQuery.toLowerCase()),
	);

	// 技術の選択/解除
	const toggleTechnology = (techId: string) => {
		const isSelected = localSelected.some((t) => t.id === techId);

		let newSelected: typeof localSelected;
		if (isSelected) {
			// 解除
			newSelected = localSelected.filter((t) => t.id !== techId);
		} else {
			// 選択
			if (maxSelections && localSelected.length >= maxSelections) {
				return; // 最大選択数に達している
			}
			const tech = availableTechnologies.find((t) => t.id === techId);
			if (tech) {
				newSelected = [...localSelected, tech];
			} else {
				return;
			}
		}
		setLocalSelected(newSelected);
		onSelectionChange(newSelected);
	};

	// 選択をクリア
	const clearSelection = () => {
		setLocalSelected([]);
		onSelectionChange([]);
	};

	const isMaxReached = maxSelections
		? localSelected.length >= maxSelections
		: false;

	return (
		<div className="space-y-4">
			{/* 検索バー */}
			<div className="relative">
				<Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
				<Input
					type="text"
					placeholder="技術を検索..."
					value={searchQuery}
					onChange={(e) => setSearchQuery(e.target.value)}
					className="pl-9"
				/>
			</div>

			{/* 選択済み技術 */}
			{localSelected.length > 0 && (
				<div className="space-y-2">
					<div className="flex items-center justify-between">
						<p className="text-sm font-medium">
							選択済み ({localSelected.length}
							{maxSelections && ` / ${maxSelections}`})
						</p>
						<Button
							variant="ghost"
							size="sm"
							onClick={clearSelection}
							className="h-auto p-1 text-xs"
						>
							すべてクリア
						</Button>
					</div>
					<div className="flex flex-wrap gap-2">
						{localSelected.map((tech) => (
							<button
								key={tech.id}
								type="button"
								onClick={() => toggleTechnology(tech.id)}
								className={cn(
									"inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-sm font-medium transition-colors",
									"bg-primary text-primary-foreground hover:bg-primary/90",
								)}
								style={
									tech.color
										? {
												backgroundColor: tech.color,
												color: "white",
											}
										: undefined
								}
							>
								{tech.name}
								<X className="size-3" />
							</button>
						))}
					</div>
				</div>
			)}

			{/* 利用可能な技術一覧 */}
			<div className="space-y-2">
				<p className="text-sm font-medium">利用可能な技術</p>
				<div className="max-h-[300px] overflow-y-auto border rounded-md p-2">
					{filteredTechnologies.length > 0 ? (
						<div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
							{filteredTechnologies.map((tech) => {
								const isSelected = localSelected.some((t) => t.id === tech.id);
								const isDisabled = !isSelected && isMaxReached;

								return (
									<button
										key={tech.id}
										type="button"
										onClick={() => toggleTechnology(tech.id)}
										disabled={isDisabled}
										className={cn(
											"relative flex items-center justify-between gap-2 rounded-md px-3 py-2 text-sm font-medium transition-colors text-left",
											isSelected
												? "bg-primary/10 text-primary border border-primary/20"
												: "bg-muted hover:bg-muted/80 border border-transparent",
											isDisabled && "opacity-50 cursor-not-allowed",
										)}
										style={
											isSelected && tech.color
												? {
														backgroundColor: `${tech.color}20`,
														color: tech.color,
														borderColor: `${tech.color}40`,
													}
												: undefined
										}
									>
										<span className="truncate">{tech.name}</span>
										{isSelected && <Check className="size-4 shrink-0" />}
									</button>
								);
							})}
						</div>
					) : (
						<p className="text-sm text-muted-foreground text-center py-8">
							検索結果が見つかりませんでした
						</p>
					)}
				</div>
			</div>

			{maxSelections && isMaxReached && (
				<p className="text-sm text-muted-foreground text-center">
					最大{maxSelections}個まで選択できます
				</p>
			)}
		</div>
	);
}

/**
 * ダイアログ形式の技術スタック選択UI
 */
export function TechnologySelectorDialog({
	open,
	onOpenChange,
	availableTechnologies,
	selectedTechnologies,
	onSave,
	maxSelections,
}: {
	open: boolean;
	onOpenChange: (open: boolean) => void;
	availableTechnologies: TechnologySelectorProps["availableTechnologies"];
	selectedTechnologies: TechnologySelectorProps["selectedTechnologies"];
	onSave: (
		technologies: TechnologySelectorProps["selectedTechnologies"],
	) => Promise<void>;
	maxSelections?: number;
}) {
	const [localSelected, setLocalSelected] = useState(selectedTechnologies);
	const [error, setError] = useState<string | null>(null);
	const [isLoading, setIsLoading] = useState(false);

	// ダイアログが開かれたときに選択状態をリセット
	const handleOpenChange = (newOpen: boolean) => {
		if (newOpen) {
			setLocalSelected(selectedTechnologies);
			setError(null);
		}
		onOpenChange(newOpen);
	};

	// 保存処理
	const handleSave = async () => {
		setIsLoading(true);
		setError(null);

		try {
			await onSave(localSelected);
			onOpenChange(false);
		} catch (err) {
			setError(
				err instanceof Error ? err.message : "技術スタックの更新に失敗しました",
			);
		} finally {
			setIsLoading(false);
		}
	};

	return (
		<Dialog open={open} onOpenChange={handleOpenChange}>
			<DialogContent className="max-w-2xl max-h-[90vh] overflow-hidden flex flex-col">
				<DialogHeader>
					<DialogTitle>技術スタックを編集</DialogTitle>
					<DialogDescription>
						興味のある技術を選択してください
						{maxSelections && `（最大${maxSelections}個）`}
					</DialogDescription>
				</DialogHeader>

				<div className="flex-1 overflow-y-auto py-4">
					<TechnologySelector
						availableTechnologies={availableTechnologies}
						selectedTechnologies={localSelected}
						onSelectionChange={setLocalSelected}
						maxSelections={maxSelections}
					/>
				</div>

				{error && (
					<p className="text-sm text-destructive text-center" role="alert">
						{error}
					</p>
				)}

				<DialogFooter>
					<Button
						variant="outline"
						onClick={() => onOpenChange(false)}
						disabled={isLoading}
					>
						キャンセル
					</Button>
					<Button onClick={handleSave} disabled={isLoading}>
						{isLoading ? "保存中..." : "保存"}
					</Button>
				</DialogFooter>
			</DialogContent>
		</Dialog>
	);
}
