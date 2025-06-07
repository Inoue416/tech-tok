import * as React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Share2, Heart } from "lucide-react";

// ダミーコンテンツ
const feedData = [
	{
		id: 1,
		title: "コンテンツ1",
		description: "これは1つ目のコンテンツです。",
		image:
			"https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=400&q=80",
		url: "https://example.com/article1",
	},
	{
		id: 2,
		title: "コンテンツ2",
		description: "これは2つ目のコンテンツです。",
		image:
			"https://images.unsplash.com/photo-1465101046530-73398c7f28ca?auto=format&fit=crop&w=400&q=80",
		url: "https://example.com/article2",
	},
	{
		id: 3,
		title: "コンテンツ3",
		description: "これは3つ目のコンテンツです。",
		image:
			"https://images.unsplash.com/photo-1519125323398-675f0ddb6308?auto=format&fit=crop&w=400&q=80",
		url: "https://example.com/article3",
	},
];

export function VerticalSwipeFeed() {
	const [current, setCurrent] = React.useState(0);
	const [imageLoaded, setImageLoaded] = React.useState(false);
	const touchStartY = React.useRef<number | null>(null);

	// スワイプ判定
	const handleTouchStart = (e: React.TouchEvent) => {
		touchStartY.current = e.touches[0].clientY;
	};
	const handleTouchEnd = (e: React.TouchEvent) => {
		if (touchStartY.current === null) return;
		const deltaY = e.changedTouches[0].clientY - touchStartY.current;
		if (deltaY < -50 && current < feedData.length - 1) {
			setCurrent(current + 1);
		} else if (deltaY > 50 && current > 0) {
			setCurrent(current - 1);
		}
		touchStartY.current = null;
	};

	const item = feedData[current];

	const handleShare = async () => {
		if (navigator.share) {
			try {
				await navigator.share({
					title: item.title,
					text: item.description,
					url: item.url,
				});
			} catch (error) {
				console.error("Error sharing:", error);
			}
		} else {
			await navigator.clipboard.writeText(item.url);
			alert("Link copied to clipboard!");
		}
	};

	return (
		<div
			className="h-screen w-full flex items-center justify-center bg-black"
			onTouchStart={handleTouchStart}
			onTouchEnd={handleTouchEnd}
		>
			<Card className="w-full max-w-sm mx-auto bg-white/90 shadow-lg rounded-xl overflow-hidden flex flex-col items-center">
				<CardContent className="flex flex-col items-center p-0">
					<img
						src={item.image}
						alt={item.title}
						className={`w-full h-96 object-cover transition-opacity duration-300 bg-white ${imageLoaded ? "opacity-100" : "opacity-0"}`}
						loading="lazy"
						onLoad={() => setImageLoaded(true)}
						onError={() => setImageLoaded(true)} // Show content even if image fails
					/>
					<div className="p-4 w-full">
						<h2 className="text-xl font-bold mb-2">{item.title}</h2>
						<p className="text-gray-700 mb-4">{item.description}</p>
						<div className="flex justify-between">
							<Button
								variant="outline"
								disabled={current === 0}
								onClick={() => setCurrent(current - 1)}
							>
								前へ
							</Button>
							<Button
								variant="default"
								disabled={current === feedData.length - 1}
								onClick={() => setCurrent(current + 1)}
							>
								次へ
							</Button>
							<Button variant="default" onClick={handleShare}>
								<Share2 className="w-5 h-5" />
							</Button>
							{/* <Button variant="outline" onClick={() => toggleLike(item)}> */}
							<Button variant="outline">
								<Heart className={"w-5 h-5 fill-red-500"} />
							</Button>
						</div>
					</div>
				</CardContent>
			</Card>
		</div>
	);
}
