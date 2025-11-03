import type { Meta, StoryObj } from "@storybook/nextjs";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import type { Technology } from "@/features/profile/types";
import {
	TechnologySelector,
	TechnologySelectorDialog,
} from "./technology-selector";

const sampleTechnologies: Technology[] = [
	{ id: "1", name: "React", category: "Frontend", color: "#61DAFB" },
	{ id: "2", name: "TypeScript", category: "Language", color: "#3178C6" },
	{ id: "3", name: "Next.js", category: "Framework", color: "#000000" },
	{ id: "4", name: "Node.js", category: "Backend", color: "#339933" },
	{ id: "5", name: "PostgreSQL", category: "Database", color: "#4169E1" },
	{ id: "6", name: "Prisma", category: "ORM", color: "#2D3748" },
	{ id: "7", name: "Tailwind CSS", category: "CSS", color: "#06B6D4" },
	{ id: "8", name: "Docker", category: "DevOps", color: "#2496ED" },
	{ id: "9", name: "Git", category: "VCS", color: "#F05032" },
	{ id: "10", name: "AWS", category: "Cloud", color: "#FF9900" },
	{ id: "11", name: "Python", category: "Language", color: "#3776AB" },
	{ id: "12", name: "Django", category: "Framework", color: "#092E20" },
	{ id: "13", name: "Vue.js", category: "Frontend", color: "#4FC08D" },
	{ id: "14", name: "Angular", category: "Frontend", color: "#DD0031" },
	{ id: "15", name: "MongoDB", category: "Database", color: "#47A248" },
];

const meta: Meta<typeof TechnologySelector> = {
	title: "Features/Profile/TechnologySelector",
	component: TechnologySelector,
	parameters: {
		layout: "centered",
	},
	tags: ["autodocs"],
	decorators: [
		(Story) => (
			<div className="w-[600px]">
				<Story />
			</div>
		),
	],
};

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * 空の状態
 * ユーザーがまだ技術を選択していない初期状態
 */
export const Empty: Story = {
	args: {
		availableTechnologies: sampleTechnologies,
		selectedTechnologies: [],
		onSelectionChange: (technologies) => {
			console.log("Selected technologies:", technologies);
		},
	},
};

/**
 * 技術が選択された状態
 * いくつかの技術が既に選択されている状態
 */
export const WithSelection: Story = {
	args: {
		availableTechnologies: sampleTechnologies,
		selectedTechnologies: [
			sampleTechnologies[0],
			sampleTechnologies[1],
			sampleTechnologies[2],
		],
		onSelectionChange: (technologies) => {
			console.log("Selected technologies:", technologies);
		},
	},
};

/**
 * 最大選択数の制限あり
 * 最大5個まで選択できる制限がある場合
 */
export const WithMaxSelections: Story = {
	args: {
		availableTechnologies: sampleTechnologies,
		selectedTechnologies: [
			sampleTechnologies[0],
			sampleTechnologies[1],
			sampleTechnologies[2],
		],
		onSelectionChange: (technologies) => {
			console.log("Selected technologies:", technologies);
		},
		maxSelections: 5,
	},
};

/**
 * 最大選択数に達した状態
 * これ以上選択できない状態
 */
export const MaxReached: Story = {
	args: {
		availableTechnologies: sampleTechnologies,
		selectedTechnologies: sampleTechnologies.slice(0, 5),
		onSelectionChange: (technologies) => {
			console.log("Selected technologies:", technologies);
		},
		maxSelections: 5,
	},
};

/**
 * インタラクティブな例
 * 実際に技術を選択/解除できる例
 */
export const Interactive: Story = {
	render: () => {
		const [selected, setSelected] = useState<Technology[]>([]);

		return (
			<div className="space-y-4">
				<div className="text-sm">
					<p className="font-medium">選択済み: {selected.length}個</p>
					<p className="text-muted-foreground">
						{selected.map((t) => t.name).join(", ") || "なし"}
					</p>
				</div>
				<TechnologySelector
					availableTechnologies={sampleTechnologies}
					selectedTechnologies={selected}
					onSelectionChange={setSelected}
					maxSelections={5}
				/>
			</div>
		);
	},
};

/**
 * ダイアログ形式
 * ダイアログとして表示される技術選択UI
 */
export const DialogVersion: StoryObj<typeof TechnologySelectorDialog> = {
	render: () => {
		const [open, setOpen] = useState(false);
		const [selected, setSelected] = useState<Technology[]>([
			sampleTechnologies[0],
			sampleTechnologies[1],
		]);

		return (
			<div className="space-y-4">
				<div className="text-sm">
					<p className="font-medium">選択済み: {selected.length}個</p>
					<p className="text-muted-foreground">
						{selected.map((t) => t.name).join(", ") || "なし"}
					</p>
				</div>
				<Button onClick={() => setOpen(true)}>技術スタックを編集</Button>
				<TechnologySelectorDialog
					open={open}
					onOpenChange={setOpen}
					availableTechnologies={sampleTechnologies}
					selectedTechnologies={selected}
					onSave={async (technologies) => {
						console.log("Saving technologies:", technologies);
						await new Promise((resolve) => setTimeout(resolve, 1000));
						setSelected(technologies);
					}}
					maxSelections={5}
				/>
			</div>
		);
	},
};
