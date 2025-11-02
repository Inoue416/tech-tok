import Image from "next/image";
import { cn } from "@/lib/utils";

interface ProfileAvatarProps {
	src?: string;
	alt: string;
	size?: "sm" | "md" | "lg" | "xl";
	className?: string;
}

const sizeVariants = {
	sm: "size-8",
	md: "size-12",
	lg: "size-16",
	xl: "size-24",
};

const sizePixels = {
	sm: 32,
	md: 48,
	lg: 64,
	xl: 96,
};

/**
 * プロフィール画像を表示するアバターコンポーネント
 */
export function ProfileAvatar({
	src,
	alt,
	size = "lg",
	className,
}: ProfileAvatarProps) {
	const sizeClass = sizeVariants[size];
	const sizeValue = sizePixels[size];

	return (
		<div
			className={cn(
				"relative overflow-hidden rounded-full bg-muted flex items-center justify-center",
				sizeClass,
				className,
			)}
		>
			{src ? (
				<Image
					src={src}
					alt={alt}
					width={sizeValue}
					height={sizeValue}
					className="size-full object-cover"
				/>
			) : (
				<div className="flex items-center justify-center size-full bg-gradient-to-br from-blue-500 to-purple-600 text-white font-semibold text-sm">
					{alt.charAt(0).toUpperCase()}
				</div>
			)}
		</div>
	);
}
