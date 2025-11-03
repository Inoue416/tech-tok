# 設計ドキュメント

## 概要

このドキュメントは、TechTokのプロフィールページ再設計の技術設計を定義します。既存のモックUIを刷新し、ユーザーが自分のプロフィール情報を管理し、アカウント操作（ログアウト、退会）を実行できるシンプルで焦点を絞ったインターフェースを提供します。

## アーキテクチャ

### 全体構成

```
src/app/profile/
├── page.tsx                    # プロフィールページ（Server Component）
└── client-profile.tsx          # クライアントコンポーネント

src/app/actions/
└── profile.ts                  # Server Actions（プロフィール更新、アカウント削除）

src/features/profile/
├── components/
│   ├── profile-header.tsx      # プロフィールヘッダー（アイコン、ユーザー名）
│   ├── profile-header.stories.tsx
│   ├── profile-info-section.tsx # プロフィール情報セクション
│   ├── profile-info-section.stories.tsx
│   ├── technology-selector.tsx  # 技術スタック選択UI
│   ├── technology-selector.stories.tsx
│   ├── account-actions.tsx      # アカウント操作（ログアウト、退会）
│   ├── account-actions.stories.tsx
│   ├── edit-username-dialog.tsx # ユーザー名編集ダイアログ
│   ├── edit-username-dialog.stories.tsx
│   ├── edit-icon-dialog.tsx     # アイコン編集ダイアログ
│   ├── edit-icon-dialog.stories.tsx
│   ├── delete-account-dialog.tsx # アカウント削除確認ダイアログ
│   └── delete-account-dialog.stories.tsx
├── types/
│   └── index.ts                 # 型定義
└── data/
    └── sample-data.ts           # サンプルデータ（Storybook用）
```

### データフロー

1. **ページロード**
   - Server Component (`page.tsx`) がセッションを取得
   - 未認証の場合はログインページにリダイレクト
   - 認証済みの場合、ユーザー情報と技術スタックをPrismaから取得
   - Client Component にデータを渡す

2. **プロフィール編集**
   - ユーザーが編集ボタンをクリック
   - ダイアログが開き、現在の値を表示
   - ユーザーが変更を送信
   - Server Action が実行され、データベースを更新
   - 成功時、UIを更新してトーストメッセージを表示

3. **ログアウト**
   - ユーザーがログアウトボタンをクリック
   - 確認ダイアログを表示
   - 確認後、Better Auth の signOut API を呼び出し
   - ログインページにリダイレクト

4. **アカウント削除**
   - ユーザーが退会ボタンをクリック
   - 警告付き確認ダイアログを表示
   - 二次確認を要求
   - Server Action が関連データを削除（Cascade削除）
   - ユーザーアカウントを削除
   - ホームページにリダイレクト

## コンポーネントとインターフェース

### 1. ProfileHeader

プロフィールアイコンとユーザー名を表示し、編集機能を提供します。

```typescript
interface ProfileHeaderProps {
  user: {
    id: string;
    username: string | null;
    displayName: string | null;
    image: string | null;
  };
  onUsernameEdit: () => void;
  onIconEdit: () => void;
}
```

**機能:**
- プロフィールアイコンの表示（デフォルトアイコン対応）
- ユーザー名の表示
- 編集ボタン（アイコン、ユーザー名それぞれ）

### 2. ProfileInfoSection

技術スタックの表示と編集機能を提供します。

```typescript
interface ProfileInfoSectionProps {
  technologies: Technology[];
  onEdit: () => void;
}

interface Technology {
  id: string;
  name: string;
  category: string | null;
  color: string | null;
}
```

**機能:**
- 技術スタックのタグ表示
- 編集ボタン
- 空の状態の表示

### 3. TechnologySelector

技術スタックを選択・管理するUIコンポーネントです。

```typescript
interface TechnologySelectorProps {
  availableTechnologies: Technology[];
  selectedTechnologies: Technology[];
  onSelectionChange: (technologies: Technology[]) => void;
  maxSelections?: number;
}
```

**機能:**
- 利用可能な技術の一覧表示
- 検索/フィルター機能
- 選択/解除機能
- 選択済み技術の表示

### 4. EditUsernameDialog

ユーザー名を編集するダイアログコンポーネントです。

```typescript
interface EditUsernameDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  currentUsername: string | null;
  onSave: (username: string) => Promise<void>;
}
```

**機能:**
- 現在のユーザー名を表示
- 入力バリデーション（空文字チェック、文字数制限）
- 保存処理とエラーハンドリング

### 5. EditIconDialog

プロフィールアイコンを変更するダイアログコンポーネントです。

```typescript
interface EditIconDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  currentIcon: string | null;
  onSave: (iconUrl: string) => Promise<void>;
}
```

**機能:**
- プリセットアイコンの選択
- 画像アップロード（将来的な拡張）
- プレビュー表示

### 6. AccountActions

ログアウトと退会のアクションボタンを提供します。

```typescript
interface AccountActionsProps {
  onLogout: () => void;
  onDeleteAccount: () => void;
}
```

**機能:**
- ログアウトボタン
- 退会ボタン（危険なアクションとして視覚的に区別）

### 7. DeleteAccountDialog

アカウント削除の確認ダイアログです。

```typescript
interface DeleteAccountDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: () => Promise<void>;
}
```

**機能:**
- 警告メッセージの表示
- 二次確認（テキスト入力による確認）
- 削除処理とエラーハンドリング

## データモデル

### Prismaスキーマ（既存）

```prisma
model User {
  id            String    @id @default(cuid())
  username      String?   @unique
  displayName   String?   @map("display_name")
  name          String?
  email         String?   @unique
  emailVerified Boolean   @default(false) @map("email_verified")
  image         String?
  bio           String?
  createdAt     DateTime  @default(now()) @map("created_at")
  updatedAt     DateTime  @updatedAt @map("updated_at")

  accounts         Account[]
  posts            Post[]
  likes            Like[]
  bookmarks        Bookmark[]
  comments         Comment[]
  notifications    Notification[]
  shares           PostShare[]
  userTechnologies UserTechnology[]
  followers        Follow[] @relation("UserFollowers")
  following        Follow[] @relation("UserFollowing")

  @@map("users")
}

model Technology {
  id        String   @id @default(cuid())
  name      String
  category  String?
  color     String?
  createdAt DateTime @default(now()) @map("created_at")
  updatedAt DateTime @updatedAt @map("updated_at")

  userTechnologies   UserTechnology[]
  sourceTechnologies SourceTechnology[]

  @@map("technologies")
}

model UserTechnology {
  id           String   @id @default(cuid())
  userId       String   @map("user_id")
  technologyId String   @map("technology_id")
  createdAt    DateTime @default(now()) @map("created_at")

  user       User       @relation(fields: [userId], references: [id], onDelete: Cascade)
  technology Technology @relation(fields: [technologyId], references: [id], onDelete: Cascade)

  @@unique([userId, technologyId])
  @@map("user_technologies")
}
```

### Server Actions型定義

```typescript
// src/app/actions/profile.ts

export type UpdateUsernameResult = 
  | { success: true; username: string }
  | { success: false; error: string };

export type UpdateIconResult = 
  | { success: true; iconUrl: string }
  | { success: false; error: string };

export type UpdateTechnologiesResult = 
  | { success: true; technologies: Technology[] }
  | { success: false; error: string };

export type DeleteAccountResult = 
  | { success: true }
  | { success: false; error: string };
```

## エラーハンドリング

### エラーの種類

1. **認証エラー**
   - セッションが無効または期限切れ
   - 対応: ログインページにリダイレクト

2. **バリデーションエラー**
   - ユーザー名が空
   - ユーザー名が既に使用されている
   - 対応: エラーメッセージをダイアログ内に表示

3. **データベースエラー**
   - 更新失敗
   - 削除失敗
   - 対応: トーストメッセージでエラーを表示

4. **ネットワークエラー**
   - Server Action の呼び出し失敗
   - 対応: リトライオプション付きエラーメッセージ

### エラー表示戦略

- **インラインエラー**: フォーム内のバリデーションエラー
- **トーストメッセージ**: 操作の成功/失敗通知
- **ダイアログエラー**: 重大なエラー（アカウント削除失敗など）

## テスト戦略

### 単体テスト

各コンポーネントのStorybookストーリーを作成し、以下の状態をカバーします:

1. **ProfileHeader**
   - デフォルトアイコンの表示
   - カスタムアイコンの表示
   - ユーザー名の表示
   - 編集ボタンのクリック

2. **TechnologySelector**
   - 空の状態
   - 技術が選択された状態
   - 検索機能
   - 最大選択数の制限

3. **ダイアログコンポーネント**
   - 開閉状態
   - バリデーションエラー
   - 保存処理中の状態
   - 成功/失敗状態

### 統合テスト（オプション）

- Server Actions の動作確認
- データベース操作の確認
- 認証フローの確認

### E2Eテスト（オプション）

- プロフィール編集フロー
- ログアウトフロー
- アカウント削除フロー

## セキュリティ考慮事項

### 認証と認可

- すべてのServer Actionsでセッション検証を実施
- ユーザーは自分のプロフィールのみ編集可能
- アカウント削除は二重確認を要求

### データ削除

- アカウント削除時、Prismaの`onDelete: Cascade`により関連データを自動削除
- 削除対象:
  - Posts
  - Likes
  - Bookmarks
  - Comments
  - Notifications
  - PostShares
  - UserTechnologies
  - Follows（フォロワー/フォロー中）
  - Accounts（OAuth連携情報）

### 入力バリデーション

- ユーザー名: 1-50文字、英数字とアンダースコアのみ
- XSS対策: すべての入力をサニタイズ
- SQL Injection対策: Prismaのパラメータ化クエリを使用

## パフォーマンス最適化

### データ取得

- 必要最小限のフィールドのみ取得（Prisma select）
- 技術スタックは`include`で一度に取得

### クライアントサイド

- React Server Componentsを活用し、初期ロードを高速化
- ダイアログは遅延ロード（dynamic import）
- 画像は Next.js Image コンポーネントで最適化

### キャッシング

- Server Componentsのデフォルトキャッシュを活用
- 更新後は`revalidatePath`でキャッシュを無効化

## UI/UXデザイン

### レイアウト

```
┌─────────────────────────────────────┐
│  Profile Header                     │
│  ┌─────┐                           │
│  │Icon │  Username                 │
│  └─────┘  [Edit] [Edit]            │
└─────────────────────────────────────┘
┌─────────────────────────────────────┐
│  Technology Stack                   │
│  [React] [TypeScript] [Next.js]    │
│  [Edit]                             │
└─────────────────────────────────────┘
┌─────────────────────────────────────┐
│  Account Actions                    │
│  [Logout]                           │
│  [Delete Account]                   │
└─────────────────────────────────────┘
```

### カラースキーム

- **通常のボタン**: デフォルトまたはセカンダリ
- **ログアウトボタン**: アウトライン
- **退会ボタン**: デストラクティブ（赤系）

### レスポンシブデザイン

- モバイル: 1カラムレイアウト
- タブレット以上: 中央寄せ、最大幅600px

## 実装の優先順位

### Phase 1: 基本機能
1. プロフィール情報の表示
2. ユーザー名編集
3. ログアウト機能

### Phase 2: 拡張機能
4. アイコン編集（プリセット選択）
5. 技術スタック編集

### Phase 3: アカウント管理
6. アカウント削除機能

## 技術スタック

- **フレームワーク**: Next.js 15 (App Router)
- **UI**: React 19, Shadcn UI, Radix UI
- **スタイリング**: Tailwind CSS 4
- **認証**: Better Auth
- **データベース**: PostgreSQL + Prisma
- **状態管理**: React useState（ローカル状態）
- **フォーム**: React Hook Form（必要に応じて）
- **バリデーション**: Zod（必要に応じて）

## 既存コードからの変更点

### 削除する機能
- いいね一覧の表示
- ブックマーク一覧の表示
- フォロー/フォロー解除ボタン
- シェア機能
- 他のユーザーのプロフィール表示

### 新規追加する機能
- ユーザー名編集ダイアログ
- アイコン編集ダイアログ
- 技術スタック編集UI
- ログアウト確認ダイアログ
- アカウント削除確認ダイアログ（二重確認）
- Server Actions（プロフィール更新、アカウント削除）

### 再利用する既存コンポーネント
- `Button` (Shadcn UI)
- `Dialog` (Shadcn UI)
- `Input` (Shadcn UI)
- `Card` (Shadcn UI)
- `Alert` (Shadcn UI)
