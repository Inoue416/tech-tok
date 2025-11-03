import type { Meta, StoryObj } from "@storybook/nextjs";
import { ProfileInfoSection } from "./profile-info-section";

const meta: Meta<typeof ProfileInfoSection> = {
	title: "Features/Profile/ProfileInfoSection",
	component: ProfileInfoSection,
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
 * 技術が選択された状態
 * ユーザーが複数の技術スタックを設定している場合の表示
 */
export const WithTechnologies: Story = {
	args: {
		technologies: [
			{
				id: "1",
				name: "React",
				category: "Frontend",
				color: "#61DAFB",
			},
			{
				id: "2",
				name: "TypeScript",
				category: "Language",
				color: "#3178C6",
			},
			{
				id: "3",
				name: "Next.js",
				category: "Framework",
				color: "#000000",
			},
			{
				id: "4",
				name: "Node.js",
				category: "Backend",
				color: "#339933",
			},
			{
				id: "5",
				name: "PostgreSQL",
				category: "Database",
				color: "#4169E1",
			},
		],
		onEdit: () => console.log("Edit clicked"),
	},
};

/**
 * 空の状態
 * ユーザーがまだ技術スタックを設定していない場合の表示
 */
export const Empty: Story = {
	args: {
		technologies: [],
		onEdit: () => console.log("Edit clicked"),
	},
};

/**
 * 少数の技術
 * 1-2個の技術のみ設定されている場合
 */
export const FewTechnologies: Story = {
	args: {
		technologies: [
			{
				id: "1",
				name: "Python",
				category: "Language",
				color: "#3776AB",
			},
			{
				id: "2",
				name: "Django",
				category: "Framework",
				color: "#092E20",
			},
		],
		onEdit: () => console.log("Edit clicked"),
	},
};

/**
 * 多数の技術
 * 多くの技術スタックを設定している場合の表示
 */
export const ManyTechnologies: Story = {
	args: {
		technologies: [
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
		],
		onEdit: () => console.log("Edit clicked"),
	},
};

/**
 * 色なしの技術
 * カラー情報が設定されていない技術の表示
 */
export const WithoutColors: Story = {
	args: {
		technologies: [
			{
				id: "1",
				name: "React",
				category: "Frontend",
				color: null,
			},
			{
				id: "2",
				name: "TypeScript",
				category: "Language",
				color: null,
			},
			{
				id: "3",
				name: "Next.js",
				category: "Framework",
				color: null,
			},
		],
		onEdit: () => console.log("Edit clicked"),
	},
};
