/**
 * 技術タグの型定義
 */
export interface Technology {
	id: string;
	name: string;
	color?: string | null;
	category?: string | null;
}

/**
 * ユーザープロフィールの型定義
 */
export interface UserProfile {
	id: string;
	username: string | null;
	displayName: string | null;
	image: string | null;
	technologies: Technology[];
}

/**
 * ユーザー名編集データの型定義
 */
export interface EditUsernameData {
	username: string;
}

/**
 * アイコン編集データの型定義
 */
export interface EditIconData {
	iconUrl: string;
}

/**
 * 技術スタック編集データの型定義
 */
export interface EditTechnologiesData {
	technologyIds: string[];
}

/**
 * プロフィールヘッダーのプロパティ型定義
 */
export interface ProfileHeaderProps {
	user: {
		id: string;
		username: string | null;
		displayName: string | null;
		image: string | null;
	};
	onUsernameEdit: () => void;
	onIconEdit: () => void;
}

/**
 * プロフィール情報セクションのプロパティ型定義
 */
export interface ProfileInfoSectionProps {
	technologies: Technology[];
	onEdit: () => void;
}

/**
 * 技術スタック選択UIのプロパティ型定義
 */
export interface TechnologySelectorProps {
	availableTechnologies: Technology[];
	selectedTechnologies: Technology[];
	onSelectionChange: (technologies: Technology[]) => void;
	maxSelections?: number;
}

/**
 * ユーザー名編集ダイアログのプロパティ型定義
 */
export interface EditUsernameDialogProps {
	open: boolean;
	onOpenChange: (open: boolean) => void;
	currentUsername: string | null;
	onSave: (username: string) => Promise<void>;
}

/**
 * アイコン編集ダイアログのプロパティ型定義
 */
export interface EditIconDialogProps {
	open: boolean;
	onOpenChange: (open: boolean) => void;
	currentIcon: string | null;
	onSave: (iconUrl: string) => Promise<void>;
}

/**
 * アカウント操作のプロパティ型定義
 */
export interface AccountActionsProps {
	onLogout: () => void;
	onDeleteAccount: () => void;
}

/**
 * アカウント削除ダイアログのプロパティ型定義
 */
export interface DeleteAccountDialogProps {
	open: boolean;
	onOpenChange: (open: boolean) => void;
	onConfirm: () => Promise<void>;
}

/**
 * Server Actions用の結果型定義
 */

/**
 * ユーザー名更新結果の型定義
 */
export type UpdateUsernameResult =
	| { success: true; username: string }
	| { success: false; error: string };

/**
 * アイコン更新結果の型定義
 */
export type UpdateIconResult =
	| { success: true; iconUrl: string }
	| { success: false; error: string };

/**
 * 技術スタック更新結果の型定義
 */
export type UpdateTechnologiesResult =
	| { success: true; technologies: Technology[] }
	| { success: false; error: string };

/**
 * アカウント削除結果の型定義
 */
export type DeleteAccountResult =
	| { success: true }
	| { success: false; error: string };
