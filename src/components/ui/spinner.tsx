import { cn } from "@/lib/utils";

interface SpinnerProps {
	className?: string;
	size?: "sm" | "md" | "lg";
}

export function Spinner({ className, size = "md" }: SpinnerProps) {
	const sizeClasses = {
		sm: "w-4 h-4 border-2",
		md: "w-8 h-8 border-2",
		lg: "w-12 h-12 border-3",
	};

	return (
		<output
			className={cn(
				"animate-spin rounded-full border-primary border-t-transparent",
				sizeClasses[size],
				className,
			)}
			aria-label="読み込み中"
		>
			<span className="sr-only">読み込み中...</span>
		</output>
	);
}
