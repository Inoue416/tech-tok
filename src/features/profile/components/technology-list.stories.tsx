import type { Meta, StoryObj } from "@storybook/nextjs";
import { TechnologyList } from "./technology-list";
import type { Technology } from "../types";

const meta: Meta<typeof TechnologyList> = {
	title: "features/profile/TechnologyList",
	component: TechnologyList,
	tags: ["autodocs"],
	argTypes: {
		maxVisible: {
			control: { type: "number", min: 1, max: 20, step: 1 },
			description: "最初に表示する技術の最大数",
		},
	},
};

export default meta;
type Story = StoryObj<typeof TechnologyList>;

// サンプルテクノロジー
const frontendTechnologies: Technology[] = [
	{ id: "react", name: "React", category: "framework" },
	{ id: "typescript", name: "TypeScript", category: "language" },
	{ id: "nextjs", name: "Next.js", category: "framework" },
	{ id: "tailwind", name: "Tailwind CSS", category: "framework" },
	{ id: "javascript", name: "JavaScript", category: "language" },
	{ id: "html", name: "HTML", category: "language" },
	{ id: "css", name: "CSS", category: "language" },
	{ id: "figma", name: "Figma", category: "tool" },
	{ id: "vscode", name: "VS Code", category: "tool" },
	{ id: "git", name: "Git", category: "tool" },
];

const backendTechnologies: Technology[] = [
	{ id: "nodejs", name: "Node.js", category: "platform" },
	{ id: "python", name: "Python", category: "language" },
	{ id: "django", name: "Django", category: "framework" },
	{ id: "postgresql", name: "PostgreSQL", category: "tool" },
	{ id: "redis", name: "Redis", category: "tool" },
	{ id: "docker", name: "Docker", category: "tool" },
	{ id: "aws", name: "AWS", category: "platform" },
	{ id: "kubernetes", name: "Kubernetes", category: "tool" },
];

const fewTechnologies: Technology[] = [
	{ id: "react", name: "React", category: "framework" },
	{ id: "typescript", name: "TypeScript", category: "language" },
	{ id: "nextjs", name: "Next.js", category: "framework" },
];

/**
 * フロントエンド技術スタック
 */
export const FrontendStack: Story = {
	args: {
		technologies: frontendTechnologies,
		maxVisible: 6,
	},
};

/**
 * バックエンド技術スタック
 */
export const BackendStack: Story = {
	args: {
		technologies: backendTechnologies,
		maxVisible: 6,
	},
};

/**
 * 少数の技術
 */
export const FewTechnologies: Story = {
	args: {
		technologies: fewTechnologies,
		maxVisible: 6,
	},
};

/**
 * 技術スタックなし
 */
export const EmptyTechnologies: Story = {
	args: {
		technologies: [],
		maxVisible: 6,
	},
};

/**
 * 最大表示数3の場合
 */
export const MaxVisible3: Story = {
	args: {
		technologies: frontendTechnologies,
		maxVisible: 3,
	},
};

/**
 * 最大表示数8の場合
 */
export const MaxVisible8: Story = {
	args: {
		technologies: frontendTechnologies,
		maxVisible: 8,
	},
};

/**
 * すべて表示する場合
 */
export const ShowAll: Story = {
	args: {
		technologies: frontendTechnologies,
		maxVisible: 100,
	},
};

/**
 * フルスタック開発者の例
 */
export const FullStackDeveloper: Story = {
	args: {
		technologies: [
			...frontendTechnologies.slice(0, 5),
			...backendTechnologies.slice(0, 5),
			{ id: "mongodb", name: "MongoDB", category: "tool" },
			{ id: "graphql", name: "GraphQL", category: "framework" },
			{ id: "jest", name: "Jest", category: "tool" },
			{ id: "cypress", name: "Cypress", category: "tool" },
		],
		maxVisible: 6,
	},
};

/**
 * 幅広いカテゴリの技術
 */
export const MixedCategories: Story = {
	args: {
		technologies: [
			{ id: "js", name: "JavaScript", category: "language" },
			{ id: "react", name: "React", category: "framework" },
			{ id: "docker", name: "Docker", category: "tool" },
			{ id: "aws", name: "AWS", category: "platform" },
			{ id: "agile", name: "アジャイル", category: "other" },
			{ id: "python", name: "Python", category: "language" },
			{ id: "vue", name: "Vue.js", category: "framework" },
			{ id: "kubernetes", name: "Kubernetes", category: "tool" },
			{ id: "gcp", name: "Google Cloud", category: "platform" },
			{ id: "scrum", name: "スクラム", category: "other" },
		],
		maxVisible: 6,
	},
};