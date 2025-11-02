import Image from "next/image";
import type { FeedItemData } from "../types";

interface FeedInfoProps {
	data: FeedItemData;
}

/**
 * フィードアイテムの情報表示コンポーネント
 * 作者情報、説明文、ハッシュタグを表示
 */
export function FeedInfo({ data }: FeedInfoProps) {
	return (
		<div className="flex-1 text-white">
			{/* 作者情報 */}
			<div className="mb-2 flex items-center gap-2">
				{data.author.avatar && (
					<Image
						src={data.author.avatar}
						alt={data.author.name}
						width={32}
						height={32}
						className="h-8 w-8 rounded-full"
					/>
				)}
				<span className="font-semibold">{data.author.name}</span>
			</div>

			{/* 説明文 */}
			{data.content.description && (
				<p className="mb-2 text-sm">{data.content.description}</p>
			)}

			{/* ハッシュタグ */}
			{data.hashtags && data.hashtags.length > 0 && (
				<div className="flex flex-wrap gap-1">
					{data.hashtags.map((tag) => (
						<span key={tag} className="text-sm text-blue-300">
							#{tag}
						</span>
					))}
				</div>
			)}
		</div>
	);
}
