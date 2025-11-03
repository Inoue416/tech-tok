import { cva, type VariantProps } from "class-variance-authority";
import Image from "next/image";
import Link from "next/link";
import { cn } from "@/lib/utils";

const logoVariants = cva(
	"inline-flex items-center gap-2 transition-opacity hover:opacity-80 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 rounded-md",
	{
		variants: {
			size: {
				small: "h-8",
				medium: "h-12",
				large: "h-20",
			},
		},
		defaultVariants: {
			size: "medium",
		},
	},
);

const textVariants = cva("font-bold tracking-tight", {
	variants: {
		size: {
			small: "text-sm",
			medium: "text-lg",
			large: "text-2xl",
		},
	},
	defaultVariants: {
		size: "medium",
	},
});

export interface AppLogoProps extends VariantProps<typeof logoVariants> {
	showText?: boolean;
	className?: string;
	href?: string;
}

export function AppLogo({
	size = "medium",
	showText = true,
	className,
	href = "/feed",
}: AppLogoProps) {
	const imageSize = size === "small" ? 32 : size === "medium" ? 48 : 80;

	return (
		<Link
			href={href}
			className={cn(logoVariants({ size }), className)}
			aria-label="TechTokホームに移動"
		>
			<Image
				src="/techtok_app_icon.png"
				alt="TECHTOK"
				width={imageSize}
				height={imageSize}
				priority
			/>
			{showText && <span className={textVariants({ size })}>TECHTOK</span>}
		</Link>
	);
}
