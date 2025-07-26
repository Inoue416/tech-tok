"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import type { FeedItemData } from "../types";

interface UseVerticalScrollProps {
	items: FeedItemData[];
	onItemChange?: (index: number) => void;
	autoPlay?: boolean;
}

/**
 * 縦スクロールフィードのロジックを管理するカスタムフック
 */
export function useVerticalScroll({
	items,
	onItemChange,
	autoPlay = false,
}: UseVerticalScrollProps) {
	const containerRef = useRef<HTMLDivElement>(null);
	const [currentIndex, setCurrentIndex] = useState(0);
	const [isScrolling, setIsScrolling] = useState(false);
	const scrollTimeoutRef = useRef<NodeJS.Timeout | null>(null);

	// スクロール位置の監視とアクティブアイテムの更新
	const handleScroll = useCallback(() => {
		if (!containerRef.current || isScrolling) return;

		const container = containerRef.current;
		const scrollTop = container.scrollTop;
		const itemHeight = container.clientHeight;
		const newIndex = Math.round(scrollTop / itemHeight);

		if (newIndex !== currentIndex && newIndex >= 0 && newIndex < items.length) {
			setCurrentIndex(newIndex);
			onItemChange?.(newIndex);
		}

		// スクロール終了の検出
		if (scrollTimeoutRef.current) {
			clearTimeout(scrollTimeoutRef.current);
		}
		scrollTimeoutRef.current = setTimeout(() => {
			setIsScrolling(false);
		}, 150);
	}, [currentIndex, items.length, onItemChange, isScrolling]);

	// プログラマティックスクロール
	const scrollToItem = useCallback(
		(index: number) => {
			if (!containerRef.current || index < 0 || index >= items.length) return;

			setIsScrolling(true);
			const container = containerRef.current;
			const targetScrollTop = index * container.clientHeight;

			container.scrollTo({
				top: targetScrollTop,
				behavior: "smooth",
			});

			setTimeout(() => {
				setCurrentIndex(index);
				onItemChange?.(index);
				setIsScrolling(false);
			}, 300);
		},
		[items.length, onItemChange],
	);

	// キーボードナビゲーション
	const handleKeyDown = useCallback(
		(event: KeyboardEvent) => {
			switch (event.key) {
				case "ArrowUp":
					event.preventDefault();
					scrollToItem(Math.max(0, currentIndex - 1));
					break;
				case "ArrowDown":
					event.preventDefault();
					scrollToItem(Math.min(items.length - 1, currentIndex + 1));
					break;
				case " ":
					event.preventDefault();
					scrollToItem(Math.min(items.length - 1, currentIndex + 1));
					break;
			}
		},
		[currentIndex, items.length, scrollToItem],
	);

	// イベントリスナーの設定
	useEffect(() => {
		const container = containerRef.current;
		if (!container) return;

		container.addEventListener("scroll", handleScroll, { passive: true });
		document.addEventListener("keydown", handleKeyDown);

		return () => {
			container.removeEventListener("scroll", handleScroll);
			document.removeEventListener("keydown", handleKeyDown);
			if (scrollTimeoutRef.current) {
				clearTimeout(scrollTimeoutRef.current);
			}
		};
	}, [handleScroll, handleKeyDown]);

	// 自動再生機能
	useEffect(() => {
		if (!autoPlay) return;

		const interval = setInterval(() => {
			const nextIndex = (currentIndex + 1) % items.length;
			scrollToItem(nextIndex);
		}, 5000);

		return () => clearInterval(interval);
	}, [autoPlay, currentIndex, items.length, scrollToItem]);

	return {
		containerRef,
		currentIndex,
		scrollToItem,
	};
}
