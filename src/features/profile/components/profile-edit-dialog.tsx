import { useEffect, useId, useState } from "react";
import { Button } from "@/components/ui/button";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import type {
	ProfileEditData,
	Technology,
	UserProfile,
} from "@/features/profile/types";
import { TechnologySelector } from "./technology-selector";

interface ProfileEditDialogProps {
	open: boolean;
	onOpenChange: (open: boolean) => void;
	profile: UserProfile;
	onSave: (data: ProfileEditData) => void;
}

/**
 * プロフィール編集ダイアログコンポーネント
 */
export function ProfileEditDialog({
	open,
	onOpenChange,
	profile,
	onSave,
}: ProfileEditDialogProps) {
	const [formData, setFormData] = useState<ProfileEditData>({
		displayName: profile.displayName,
		username: profile.username,
		bio: profile.bio || "",
		technologies: [...profile.technologies],
	});

	const displayNameId = useId();
	const usernameId = useId();
	const bioId = useId();

	// プロフィールが変更されたときにフォームデータを更新
	useEffect(() => {
		setFormData({
			displayName: profile.displayName,
			username: profile.username,
			bio: profile.bio || "",
			technologies: [...profile.technologies],
		});
	}, [profile]);

	const handleSave = () => {
		onSave(formData);
		onOpenChange(false);
	};

	const handleTechnologiesChange = (technologies: Technology[]) => {
		setFormData((prev) => ({
			...prev,
			technologies,
		}));
	};

	return (
		<Dialog open={open} onOpenChange={onOpenChange}>
			<DialogContent className="sm:max-w-md max-h-[80vh] overflow-y-auto">
				<DialogHeader>
					<DialogTitle>プロフィールを編集</DialogTitle>
					<DialogDescription>
						あなたの基本情報と技術スタックを更新できます。
					</DialogDescription>
				</DialogHeader>

				<div className="space-y-4">
					{/* 表示名 */}
					<div className="space-y-2">
						<Label htmlFor={displayNameId}>表示名</Label>
						<Input
							id={displayNameId}
							value={formData.displayName}
							onChange={(e) =>
								setFormData((prev) => ({
									...prev,
									displayName: e.target.value,
								}))
							}
							placeholder="表示名を入力"
						/>
					</div>

					{/* ユーザー名 */}
					<div className="space-y-2">
						<Label htmlFor={usernameId}>ユーザー名</Label>
						<Input
							id={usernameId}
							value={formData.username}
							onChange={(e) =>
								setFormData((prev) => ({
									...prev,
									username: e.target.value,
								}))
							}
							placeholder="ユーザー名を入力"
						/>
					</div>

					{/* バイオ */}
					<div className="space-y-2">
						<Label htmlFor={bioId}>自己紹介</Label>
						<Textarea
							id={bioId}
							value={formData.bio}
							onChange={(e) =>
								setFormData((prev) => ({
									...prev,
									bio: e.target.value,
								}))
							}
							placeholder="自己紹介を入力"
							rows={3}
						/>
					</div>

					{/* 技術スタック */}
					<TechnologySelector
						selectedTechnologies={formData.technologies}
						onTechnologiesChange={handleTechnologiesChange}
						maxSelections={10}
					/>
				</div>

				<DialogFooter className="flex gap-2">
					<Button variant="outline" onClick={() => onOpenChange(false)}>
						キャンセル
					</Button>
					<Button onClick={handleSave}>保存</Button>
				</DialogFooter>
			</DialogContent>
		</Dialog>
	);
}
