import { AlertCircle } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";

interface BookmarksErrorProps {
	error: Error;
	onRetry: () => void;
}

export function BookmarksError({ error, onRetry }: BookmarksErrorProps) {
	return (
		<div className="container mx-auto px-4 py-16">
			<div className="max-w-md mx-auto">
				<Alert variant="destructive">
					<AlertCircle className="h-4 w-4" />
					<AlertTitle>エラーが発生しました</AlertTitle>
					<AlertDescription>
						{error.message || "ブックマークの読み込みに失敗しました"}
					</AlertDescription>
				</Alert>

				<div className="mt-6 text-center">
					<Button onClick={onRetry}>再試行</Button>
				</div>
			</div>
		</div>
	);
}
