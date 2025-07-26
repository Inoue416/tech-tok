import { Button } from "@/components/ui/button";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
} from "@/components/ui/dialog";

interface DeleteConfirmationDialogProps {
	open: boolean;
	onOpenChange: (open: boolean) => void;
	onConfirm: () => void;
	title?: string;
	description?: string;
}

/**
 * 削除確認ダイアログコンポーネント
 */
export function DeleteConfirmationDialog({
	open,
	onOpenChange,
	onConfirm,
	title = "投稿を削除しますか？",
	description = "この操作は取り消すことができません。投稿は完全に削除されます。",
}: DeleteConfirmationDialogProps) {
	const handleConfirm = () => {
		onConfirm();
		onOpenChange(false);
	};

	return (
		<Dialog open={open} onOpenChange={onOpenChange}>
			<DialogContent className="sm:max-w-md">
				<DialogHeader>
					<DialogTitle>{title}</DialogTitle>
					<DialogDescription>{description}</DialogDescription>
				</DialogHeader>
				<DialogFooter className="flex gap-2">
					<Button variant="outline" onClick={() => onOpenChange(false)}>
						キャンセル
					</Button>
					<Button variant="destructive" onClick={handleConfirm}>
						削除する
					</Button>
				</DialogFooter>
			</DialogContent>
		</Dialog>
	);
}
