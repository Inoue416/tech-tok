import type { Meta, StoryObj } from "@storybook/nextjs";
import { useState } from "react";
import { ScrollIndicator } from "./scroll-indicator";

const meta: Meta<typeof ScrollIndicator> = {
	title: "components/ScrollIndicator",
	component: ScrollIndicator,
	tags: ["autodocs"],
	parameters: {
		layout: "fullscreen",
	},
	argTypes: {
		total: {
			control: { type: "number", min: 1, max: 20, step: 1 },
			description: "インジケーターの総数",
		},
		current: {
			control: { type: "number", min: 0, max: 19, step: 1 },
			description: "現在のアクティブなインデックス",
		},
		onItemClick: {
			action: "item-clicked",
			description: "アイテムクリック時のコールバック",
		},
	},
};

export default meta;
type Story = StoryObj<typeof ScrollIndicator>;

/**
 * デフォルトのScrollIndicator
 */
export const Default: Story = {
	args: {
		total: 5,
		current: 0,
		onItemClick: (index) => {
			console.log(`Item ${index} clicked`);
		},
	},
	render: (args) => (
		<div className="relative h-screen bg-gradient-to-br from-blue-500 to-purple-600">
			<div className="flex h-full items-center justify-center">
				<div className="text-center text-white">
					<h1 className="mb-4 text-4xl font-bold">
						アイテム {args.current + 1}
					</h1>
					<p className="text-lg">
						右側のインジケーターをクリックしてナビゲーション
					</p>
				</div>
			</div>
			<ScrollIndicator {...args} />
		</div>
	),
};

/**
 * インタラクティブなScrollIndicator
 */
export const Interactive: Story = {
	render: () => {
		const [current, setCurrent] = useState(0);
		const total = 8;

		return (
			<div className="relative h-screen bg-gradient-to-br from-green-500 to-blue-600">
				<div className="flex h-full items-center justify-center">
					<div className="text-center text-white">
						<h1 className="mb-4 text-4xl font-bold">スライド {current + 1}</h1>
						<p className="text-lg mb-4">
							インジケーターをクリックしてナビゲーション
						</p>
						<div className="space-x-4">
							<button
								type="button"
								className="rounded bg-white/20 px-4 py-2 text-white hover:bg-white/30"
								onClick={() => setCurrent(Math.max(0, current - 1))}
								disabled={current === 0}
							>
								前へ
							</button>
							<button
								type="button"
								className="rounded bg-white/20 px-4 py-2 text-white hover:bg-white/30"
								onClick={() => setCurrent(Math.min(total - 1, current + 1))}
								disabled={current === total - 1}
							>
								次へ
							</button>
						</div>
					</div>
				</div>
				<ScrollIndicator
					total={total}
					current={current}
					onItemClick={setCurrent}
				/>
			</div>
		);
	},
};

/**
 * 多数のアイテム
 */
export const ManyItems: Story = {
	args: {
		total: 15,
		current: 7,
		onItemClick: (index) => {
			console.log(`Item ${index} clicked`);
		},
	},
	render: (args) => (
		<div className="relative h-screen bg-gradient-to-br from-red-500 to-pink-600">
			<div className="flex h-full items-center justify-center">
				<div className="text-center text-white">
					<h1 className="mb-4 text-4xl font-bold">
						アイテム {args.current + 1} / {args.total}
					</h1>
					<p className="text-lg">多数のアイテムがある場合の表示例</p>
				</div>
			</div>
			<ScrollIndicator {...args} />
		</div>
	),
};

/**
 * カスタムスタイル
 */
export const CustomStyle: Story = {
	args: {
		total: 6,
		current: 2,
		onItemClick: (index) => {
			console.log(`Item ${index} clicked`);
		},
	},
	render: (args) => (
		<div className="relative h-screen bg-gradient-to-br from-yellow-500 to-orange-600">
			<div className="flex h-full items-center justify-center">
				<div className="text-center text-white">
					<h1 className="mb-4 text-4xl font-bold">カスタムスタイル</h1>
					<p className="text-lg">左側に配置されたインジケーター</p>
				</div>
			</div>
			<ScrollIndicator {...args} className="left-4 right-auto" />
		</div>
	),
};
