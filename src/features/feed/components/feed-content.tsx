"use client";

import { Play } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import type { FeedItemData } from "../types";

interface FeedContentProps {
	data: FeedItemData;
	isActive: boolean;
}

/**
 * フィードアイテムのメインコンテンツ表示コンポーネント
 */
export function FeedContent({ data, isActive }: FeedContentProps) {
	const [isPlaying, setIsPlaying] = useState(false);
	const videoRef = useRef<HTMLVideoElement>(null);

	// 動画の再生制御
	useEffect(() => {
		const video = videoRef.current;
		if (!video || data.type !== "video") return;

		if (isActive && isPlaying) {
			video.play().catch(console.error);
		} else {
			video.pause();
		}
	}, [isActive, isPlaying, data.type]);

	// アクティブ時の自動再生
	useEffect(() => {
		if (isActive && data.type === "video") {
			setIsPlaying(true);
		} else {
			setIsPlaying(false);
		}
	}, [isActive, data.type]);

	const handleVideoClick = () => {
		if (data.type === "video") {
			setIsPlaying(!isPlaying);
		}
	};

	const handleVideoKeyDown = (e: React.KeyboardEvent) => {
		if (e.key === "Enter" || e.key === " ") {
			e.preventDefault();
			handleVideoClick();
		}
	};

	switch (data.type) {
		case "video":
			return (
				<div className="relative h-full w-full">
					<video
						ref={videoRef}
						src={data.content.url}
						className="h-full w-full object-cover"
						loop
						muted
						playsInline
						onClick={handleVideoClick}
						onKeyDown={handleVideoKeyDown}
						tabIndex={0}
					/>
					{!isPlaying && (
						<div className="absolute inset-0 flex items-center justify-center">
							<Button
								type="button"
								variant="ghost"
								size="lg"
								className="h-16 w-16 rounded-full bg-black/50 text-white hover:bg-black/70"
								onClick={handleVideoClick}
							>
								<Play className="h-8 w-8 fill-current" />
							</Button>
						</div>
					)}
				</div>
			);

		case "text":
			return (
				<div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-purple-600 to-blue-600 p-8">
					<div className="text-center text-white">
						{data.content.title && (
							<h2 className="mb-4 text-3xl font-bold">{data.content.title}</h2>
						)}
						{data.content.text && (
							<p className="text-lg leading-relaxed">{data.content.text}</p>
						)}
					</div>
				</div>
			);

		default:
			return undefined;
	}
}
