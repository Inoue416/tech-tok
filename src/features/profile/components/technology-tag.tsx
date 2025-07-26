import type { Technology } from "@/features/profile/types";
import { cn } from "@/lib/utils";

interface TechnologyTagProps {
	technology: Technology;
	size?: "sm" | "md";
	className?: string;
}

const sizeVariants = {
	sm: "px-2 py-1 text-xs",
	md: "px-3 py-1.5 text-sm",
};

const categoryColors = {
	language:
		"bg-blue-100 text-blue-800 border-blue-200 dark:bg-blue-900/20 dark:text-blue-300 dark:border-blue-800",
	framework:
		"bg-green-100 text-green-800 border-green-200 dark:bg-green-900/20 dark:text-green-300 dark:border-green-800",
	tool: "bg-purple-100 text-purple-800 border-purple-200 dark:bg-purple-900/20 dark:text-purple-300 dark:border-purple-800",
	platform:
		"bg-orange-100 text-orange-800 border-orange-200 dark:bg-orange-900/20 dark:text-orange-300 dark:border-orange-800",
	other:
		"bg-gray-100 text-gray-800 border-gray-200 dark:bg-gray-900/20 dark:text-gray-300 dark:border-gray-800",
};

/**
 * 技術タグを表示するコンポーネント
 */
export function TechnologyTag({
	technology,
	size = "md",
	className,
}: TechnologyTagProps) {
	const sizeClass = sizeVariants[size];
	const colorClass = technology.category
		? categoryColors[technology.category]
		: categoryColors.other;

	return (
		<span
			className={cn(
				"inline-flex items-center rounded-full border font-medium transition-colors",
				sizeClass,
				colorClass,
				className,
			)}
		>
			{technology.name}
		</span>
	);
}
