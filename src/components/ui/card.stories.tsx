import type { Meta, StoryObj } from "@storybook/nextjs";
import { Card, CardContent } from "./card";

const meta: Meta<typeof Card> = {
	title: "ui/Card",
	component: Card,
	tags: ["autodocs"],
};
export default meta;

type Story = StoryObj<typeof Card>;

export const Default: Story = {
	render: () => (
		<Card className="max-w-xs mx-auto">
			<CardContent>
				<h2 className="text-lg font-bold mb-2">タイトル</h2>
				<p className="text-gray-700">
					これはCardコンポーネントのサンプルです。
				</p>
			</CardContent>
		</Card>
	),
};
