import type { Meta, StoryObj } from "@storybook/nextjs";
import { TechnologyTag } from "./technology-tag";
import type { Technology } from "../types";

const meta: Meta<typeof TechnologyTag> = {
	title: "features/profile/TechnologyTag",
	component: TechnologyTag,
	tags: ["autodocs"],
	argTypes: {
		size: {
			control: "select",
			options: ["sm", "md"],
			description: "タグのサイズ",
		},
	},
};

export default meta;
type Story = StoryObj<typeof TechnologyTag>;

// サンプルテクノロジー
const sampleTechnologies: Record<string, Technology> = {
	react: {
		id: "react",
		name: "React",
		category: "framework",
	},
	typescript: {
		id: "typescript",
		name: "TypeScript",
		category: "language",
	},
	nodejs: {
		id: "nodejs",
		name: "Node.js",
		category: "platform",
	},
	docker: {
		id: "docker",
		name: "Docker",
		category: "tool",
	},
	custom: {
		id: "custom",
		name: "カスタム技術",
		category: "other",
	},
};

/**
 * 言語カテゴリのタグ
 */
export const LanguageTag: Story = {
	args: {
		technology: sampleTechnologies.typescript,
		size: "md",
	},
};

/**
 * フレームワークカテゴリのタグ
 */
export const FrameworkTag: Story = {
	args: {
		technology: sampleTechnologies.react,
		size: "md",
	},
};

/**
 * ツールカテゴリのタグ
 */
export const ToolTag: Story = {
	args: {
		technology: sampleTechnologies.docker,
		size: "md",
	},
};

/**
 * プラットフォームカテゴリのタグ
 */
export const PlatformTag: Story = {
	args: {
		technology: sampleTechnologies.nodejs,
		size: "md",
	},
};

/**
 * その他カテゴリのタグ
 */
export const OtherTag: Story = {
	args: {
		technology: sampleTechnologies.custom,
		size: "md",
	},
};

/**
 * 小サイズのタグ
 */
export const SmallSize: Story = {
	args: {
		technology: sampleTechnologies.react,
		size: "sm",
	},
};

/**
 * 中サイズのタグ
 */
export const MediumSize: Story = {
	args: {
		technology: sampleTechnologies.react,
		size: "md",
	},
};

/**
 * カテゴリ別カラー比較
 */
export const CategoryColors: Story = {
	render: () => (
		<div className="space-y-4">
			<div className="flex flex-wrap gap-2">
				<TechnologyTag technology={{ id: "js", name: "JavaScript", category: "language" }} />
				<TechnologyTag technology={{ id: "ts", name: "TypeScript", category: "language" }} />
				<TechnologyTag technology={{ id: "py", name: "Python", category: "language" }} />
			</div>

			<div className="flex flex-wrap gap-2">
				<TechnologyTag technology={{ id: "react", name: "React", category: "framework" }} />
				<TechnologyTag technology={{ id: "vue", name: "Vue.js", category: "framework" }} />
				<TechnologyTag technology={{ id: "next", name: "Next.js", category: "framework" }} />
			</div>

			<div className="flex flex-wrap gap-2">
				<TechnologyTag technology={{ id: "vscode", name: "VS Code", category: "tool" }} />
				<TechnologyTag technology={{ id: "docker", name: "Docker", category: "tool" }} />
				<TechnologyTag technology={{ id: "git", name: "Git", category: "tool" }} />
			</div>

			<div className="flex flex-wrap gap-2">
				<TechnologyTag technology={{ id: "node", name: "Node.js", category: "platform" }} />
				<TechnologyTag technology={{ id: "vercel", name: "Vercel", category: "platform" }} />
				<TechnologyTag technology={{ id: "aws", name: "AWS", category: "platform" }} />
			</div>

			<div className="flex flex-wrap gap-2">
				<TechnologyTag technology={{ id: "agile", name: "アジャイル", category: "other" }} />
				<TechnologyTag technology={{ id: "design", name: "UI/UX", category: "other" }} />
			</div>
		</div>
	),
};

/**
 * サイズ比較
 */
export const SizeComparison: Story = {
	render: () => (
		<div className="space-y-4">
			<div className="flex items-center gap-2">
				<TechnologyTag technology={sampleTechnologies.react} size="sm" />
				<span className="text-sm text-gray-600">Small</span>
			</div>
			<div className="flex items-center gap-2">
				<TechnologyTag technology={sampleTechnologies.react} size="md" />
				<span className="text-sm text-gray-600">Medium</span>
			</div>
		</div>
	),
};

/**
 * 技術スタックの例
 */
export const TechStack: Story = {
	render: () => (
		<div className="space-y-4">
			<h3 className="text-lg font-semibold">フロントエンド開発者</h3>
			<div className="flex flex-wrap gap-2">
				<TechnologyTag technology={{ id: "react", name: "React", category: "framework" }} />
				<TechnologyTag technology={{ id: "ts", name: "TypeScript", category: "language" }} />
				<TechnologyTag technology={{ id: "next", name: "Next.js", category: "framework" }} />
				<TechnologyTag technology={{ id: "tailwind", name: "Tailwind CSS", category: "framework" }} />
				<TechnologyTag technology={{ id: "figma", name: "Figma", category: "tool" }} />
			</div>
		</div>
	),
};

/**
 * カスタムスタイル
 */
export const CustomStyle: Story = {
	args: {
		technology: sampleTechnologies.react,
		size: "md",
		className: "ring-2 ring-offset-2 ring-blue-500",
	},
};