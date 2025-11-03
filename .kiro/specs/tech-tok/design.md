# 設計書

## 1. 概要

Tech-Tokは、TikTok風の縦スクロールUIで技術記事を閲覧できるWebアプリケーションです。Next.js 15（App Router）、Supabase PostgreSQL、Prisma、Better Auth、Tailwind CSS、shadcn/uiを使用して構築します。

### 主要機能
- 縦スクロール記事フィード
- OAuth認証（Google/GitHub）
- 記事へのインタラクション（いいね、ブックマーク、コメント、共有）
- カテゴリー別フィルタリング
- ユーザープロフィール管理
- 元記事へのリダイレクト

## 2. アーキテクチャ

### 2.1 システム構成

```
┌─────────────────────────────────────────────────────────┐
│                     Vercel (Hosting)                     │
│  ┌───────────────────────────────────────────────────┐  │
│  │           Next.js 15 App Router                   │  │
│  │  ┌─────────────┐  ┌─────────────┐  ┌──────────┐ │  │
│  │  │   Pages     │  │  API Routes │  │  Server  │ │  │
│  │  │  (RSC/SSR)  │  │             │  │  Actions │ │  │
│  │  └─────────────┘  └─────────────┘  └──────────┘ │  │
│  └───────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────┘
                          │
                          │ Prisma Client
                          ↓
┌─────────────────────────────────────────────────────────┐
│              Supabase PostgreSQL Database                │
│  ┌───────────────────────────────────────────────────┐  │
│  │  Users, Posts, RSS Entries, Likes, Bookmarks...  │  │
│  └───────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────┘
                          │
                          │ OAuth
                          ↓
┌─────────────────────────────────────────────────────────┐
│         OAuth Providers (Google, GitHub)                 │
└─────────────────────────────────────────────────────────┘
```

### 2.2 技術スタック

| レイヤー | 技術 | 用途 |
|---------|------|------|
| フロントエンド | Next.js 15, React 19 | UIレンダリング、ルーティング |
| スタイリング | Tailwind CSS 4, shadcn/ui | デザインシステム、コンポーネント |
| 認証 | Better Auth | OAuth認証、セッション管理 |
| データベース | Supabase PostgreSQL | データ永続化 |
| ORM | Prisma 6 | データベースアクセス、型安全性 |
| バリデーション | Zod | スキーマバリデーション |
| デプロイ | Vercel | ホスティング、CI/CD |

### 2.3 ディレクトリ構造

```
tech-tok/
├── src/
│   ├── app/                    # Next.js App Router
│   │   ├── (auth)/            # 認証関連ページグループ
│   │   │   ├── login/
│   │   │   └── signup/
│   │   ├── (main)/            # メインアプリページグループ
│   │   │   ├── feed/          # フィード画面
│   │   │   ├── profile/       # プロフィール画面
│   │   │   └── bookmarks/     # ブックマーク一覧
│   │   ├── api/               # API Routes
│   │   │   ├── auth/          # 認証エンドポイント
│   │   │   └── feed/          # フィード取得API
│   │   ├── layout.tsx
│   │   └── page.tsx
│   ├── components/            # 共通UIコンポーネント
│   │   ├── ui/               # shadcn/ui コンポーネント
│   │   └── layout/           # レイアウトコンポーネント
│   ├── features/             # 機能別モジュール
│   │   ├── auth/             # 認証機能
│   │   │   ├── components/
│   │   │   ├── hooks/
│   │   │   └── actions/
│   │   ├── feed/             # フィード機能
│   │   │   ├── components/
│   │   │   ├── hooks/
│   │   │   ├── actions/
│   │   │   └── types/
│   │   ├── profile/          # プロフィール機能
│   │   └── interactions/     # いいね、ブックマーク等
│   ├── lib/                  # ユーティリティ
│   │   ├── prisma.ts        # Prismaクライアント
│   │   ├── auth.ts          # Better Auth設定
│   │   └── utils.ts         # 汎用ユーティリティ
│   └── types/               # 型定義
├── prisma/
│   ├── schema.prisma        # データベーススキーマ
│   └── seed.ts              # シードデータ
└── public/                  # 静的ファイル
```

## 3. コンポーネント設計

### 3.1 ページコンポーネント

#### 3.1.1 フィードページ (`/feed`)
**責務**: 記事の縦スクロール表示、カテゴリーフィルタリング

**コンポーネント構成**:
```tsx
FeedPage
├── CategoryTabs          // カテゴリータブ
├── VerticalFeed          // 縦スクロールコンテナ
│   └── ArticleCard[]     // 記事カード（複数）
│       ├── ArticleHeader
│       ├── ArticleContent
│       └── ArticleActions
│           ├── LikeButton
│           ├── BookmarkButton
│           ├── CommentButton
│           ├── ShareButton
│           └── OriginalLinkButton
└── ScrollIndicator       // スクロール位置インジケーター
```

**状態管理**:
- `articles`: 表示中の記事リスト
- `currentIndex`: 現在表示中の記事インデックス
- `selectedCategory`: 選択中のカテゴリー
- `isLoading`: ローディング状態

#### 3.1.2 プロフィールページ (`/profile/[username]`)
**責務**: ユーザー情報表示、プロフィール編集

**コンポーネント構成**:
```tsx
ProfilePage
├── ProfileHeader
│   ├── Avatar
│   ├── UserInfo
│   └── EditButton (自分のプロフィールの場合)
├── ProfileTabs
│   ├── PostsTab          // 投稿一覧
│   ├── LikesTab          // いいね一覧
│   └── BookmarksTab      // ブックマーク一覧
└── ProfileEditDialog     // 編集ダイアログ
```

#### 3.1.3 ログインページ (`/login`)
**責務**: OAuth認証

**コンポーネント構成**:
```tsx
LoginPage
├── LoginCard
│   ├── AppLogo
│   ├── LoginDescription
│   └── OAuthButtons
│       ├── GoogleLoginButton
│       └── GitHubLoginButton
└── Footer
```

### 3.2 機能コンポーネント

#### 3.2.1 ArticleCard
**Props**:
```typescript
interface ArticleCardProps {
  article: Article;
  isActive: boolean;
  onLike: (articleId: string) => Promise<void>;
  onBookmark: (articleId: string) => Promise<void>;
  onShare: (articleId: string) => void;
}
```

**機能**:
- 記事タイトル、本文、メタ情報の表示
- インタラクションボタン（いいね、ブックマーク、コメント、共有）
- 元記事へのリンク
- アニメーション（スクロール時のフェードイン/アウト）

#### 3.2.2 VerticalFeed
**Props**:
```typescript
interface VerticalFeedProps {
  articles: Article[];
  onScrollChange: (index: number) => void;
  categoryId?: string;
}
```

**機能**:
- Intersection Observer APIを使用した縦スクロール検知
- 無限スクロール（次の記事を自動ロード）
- スワイプジェスチャー対応（モバイル）
- キーボードナビゲーション（PC: ↑↓キー）

#### 3.2.3 CategoryTabs
**Props**:
```typescript
interface CategoryTabsProps {
  categories: Category[];
  selectedId?: string;
  onSelect: (categoryId: string) => void;
}
```

**機能**:
- カテゴリー一覧の横スクロール表示
- 選択状態の視覚的フィードバック
- カテゴリー選択時のフィード更新

#### 3.2.4 ShareDialog
**Props**:
```typescript
interface ShareDialogProps {
  article: Article;
  isOpen: boolean;
  onClose: () => void;
}
```

**機能**:
- Web Share API対応（モバイル）
- URLコピー機能
- 共有数のトラッキング

## 4. データモデル

### 4.1 主要エンティティ

#### User（ユーザー）
```typescript
interface User {
  id: string;
  username: string | null;
  displayName: string | null;
  email: string | null;
  image: string | null;  // アバター画像URL
  bio: string | null;
  createdAt: Date;
  updatedAt: Date;
}
```

#### Article（記事）
フィード表示用の統合型。RssEntryまたはPostから生成。

```typescript
interface Article {
  id: string;
  type: 'rss' | 'post';
  title: string;
  content: string;
  authorName: string;
  authorAvatar?: string;
  originalUrl?: string;  // 元記事URL
  publishedAt: Date;
  likeCount: number;
  commentCount: number;
  shareCount: number;
  isLiked: boolean;      // 現在のユーザーがいいね済みか
  isBookmarked: boolean; // 現在のユーザーがブックマーク済みか
  categories: Category[];
}
```

#### Category（カテゴリー）
```typescript
interface Category {
  id: string;
  name: string;
  color: string;
}
```

### 4.2 データフロー

#### フィード取得フロー
```
1. ユーザーがフィードページにアクセス
2. Server Component で初期データ取得
   - FeedItem を publishedAt 降順で取得
   - 関連する RssEntry または Post を結合
   - ユーザーのいいね/ブックマーク状態を取得
3. Article 型に変換してクライアントに送信
4. クライアントで VerticalFeed コンポーネントに渡す
5. スクロールで次のページを取得（無限スクロール）
```

#### いいね機能フロー
```
1. ユーザーがいいねボタンをクリック
2. Optimistic Update でUIを即座に更新
3. Server Action を呼び出し
   - Like レコードを作成/削除
   - PostShare レコードの share_count を更新（集計）
4. 成功/失敗に応じてUIを確定/ロールバック
```

## 5. API設計

### 5.1 Server Actions

#### フィード関連
```typescript
// app/actions/feed.ts

// フィード取得
export async function getFeedArticles(params: {
  cursor?: string;
  categoryId?: string;
  limit?: number;
}): Promise<{ articles: Article[]; nextCursor: string | null }>;

// 記事詳細取得
export async function getArticleById(id: string): Promise<Article | null>;
```

#### インタラクション関連
```typescript
// app/actions/interactions.ts

// いいね
export async function toggleLike(articleId: string): Promise<{ success: boolean; isLiked: boolean }>;

// ブックマーク
export async function toggleBookmark(articleId: string): Promise<{ success: boolean; isBookmarked: boolean }>;

// コメント投稿
export async function createComment(params: {
  articleId: string;
  content: string;
  parentId?: string;
}): Promise<{ success: boolean; comment?: Comment }>;

// コメント削除
export async function deleteComment(commentId: string): Promise<{ success: boolean }>;

// 共有トラッキング
export async function trackShare(articleId: string): Promise<{ success: boolean }>;
```

#### プロフィール関連
```typescript
// app/actions/profile.ts

// プロフィール取得
export async function getProfile(username: string): Promise<Profile | null>;

// プロフィール更新
export async function updateProfile(data: {
  displayName?: string;
  bio?: string;
  image?: string;
}): Promise<{ success: boolean; profile?: Profile }>;

// ユーザーの記事取得
export async function getUserArticles(userId: string, cursor?: string): Promise<{
  articles: Article[];
  nextCursor: string | null;
}>;
```

### 5.2 API Routes

#### 認証
```typescript
// app/api/auth/[...all]/route.ts
// Better Auth のエンドポイント
// GET/POST /api/auth/sign-in
// GET/POST /api/auth/callback/google
// GET/POST /api/auth/callback/github
// GET /api/auth/session
```

## 6. 状態管理

### 6.1 サーバー状態
Prismaを通じてデータベースから取得。Server ComponentsとServer Actionsで管理。

### 6.2 クライアント状態
React Hooksで管理。

#### フィード画面の状態
```typescript
// features/feed/hooks/useFeed.ts
interface UseFeedReturn {
  articles: Article[];
  currentIndex: number;
  isLoading: boolean;
  hasMore: boolean;
  loadMore: () => Promise<void>;
  scrollToIndex: (index: number) => void;
}

export function useFeed(categoryId?: string): UseFeedReturn;
```

#### インタラクション状態
```typescript
// features/interactions/hooks/useInteractions.ts
interface UseInteractionsReturn {
  toggleLike: (articleId: string) => Promise<void>;
  toggleBookmark: (articleId: string) => Promise<void>;
  isLiking: boolean;
  isBookmarking: boolean;
}

export function useInteractions(): UseInteractionsReturn;
```

### 6.3 Optimistic Updates
いいね、ブックマークなどのインタラクションは、Optimistic Updateパターンを使用してUXを向上。

```typescript
// 例: いいねのOptimistic Update
const toggleLike = async (articleId: string) => {
  // 1. UIを即座に更新
  setArticles(prev => prev.map(article => 
    article.id === articleId 
      ? { ...article, isLiked: !article.isLiked, likeCount: article.likeCount + (article.isLiked ? -1 : 1) }
      : article
  ));

  try {
    // 2. サーバーに送信
    const result = await toggleLikeAction(articleId);
    
    // 3. サーバーの結果で確定
    if (!result.success) {
      // ロールバック
      setArticles(prev => prev.map(article => 
        article.id === articleId 
          ? { ...article, isLiked: !article.isLiked, likeCount: article.likeCount + (article.isLiked ? 1 : -1) }
          : article
      ));
    }
  } catch (error) {
    // エラー時もロールバック
  }
};
```

## 7. UI/UXデザイン

### 7.1 レスポンシブブレークポイント
Tailwind CSS 4のデフォルトブレークポイントを使用。

| ブレークポイント | 幅 | デバイス |
|----------------|-----|---------|
| sm | 640px | モバイル（横向き） |
| md | 768px | タブレット |
| lg | 1024px | デスクトップ |
| xl | 1280px | 大画面デスクトップ |

### 7.2 縦スクロールUI

#### モバイル
- フルスクリーン表示
- スワイプジェスチャーで記事切り替え
- 下部に固定されたアクションバー（いいね、ブックマーク等）
- カテゴリータブは上部に固定

#### デスクトップ
- 中央に記事カード（最大幅: 640px）
- キーボードナビゲーション（↑↓キー）
- サイドバーにカテゴリー一覧
- ホバー時にアクションボタン表示

### 7.3 アニメーション
- 記事切り替え: フェードイン/アウト（300ms）
- いいねボタン: スケールアニメーション
- ローディング: スケルトンスクリーン

### 7.4 アクセシビリティ
- キーボードナビゲーション対応
- ARIA属性の適切な使用
- フォーカス管理
- スクリーンリーダー対応

## 8. エラーハンドリング

### 8.1 エラー種別

#### クライアントエラー
- ネットワークエラー: トースト通知で再試行を促す
- バリデーションエラー: フォーム下にエラーメッセージ表示
- 認証エラー: ログインページにリダイレクト

#### サーバーエラー
- データベースエラー: エラーページ表示
- 外部API エラー: フォールバック表示
- 認証エラー: 401 Unauthorized

### 8.2 エラー表示

```typescript
// components/error-boundary.tsx
export function ErrorBoundary({ error }: { error: Error }) {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <h2>エラーが発生しました</h2>
      <p>{error.message}</p>
      <Button onClick={() => window.location.reload()}>
        再読み込み
      </Button>
    </div>
  );
}
```

## 9. パフォーマンス最適化

### 9.1 データ取得最適化
- Server Components でのデータプリフェッチ
- Prisma の `select` で必要なフィールドのみ取得
- インデックスの適切な配置（publishedAt, userId等）

### 9.2 画像最適化
- Next.js Image コンポーネント使用
- 遅延ロード（lazy loading）
- WebP形式への自動変換

### 9.3 コード分割
- Dynamic Import で必要なコンポーネントのみロード
- Route-based code splitting（App Routerのデフォルト）

### 9.4 キャッシング
- Vercel Edge Cache でAPIレスポンスをキャッシュ
- SWR または React Query でクライアント側キャッシュ（将来的に検討）

## 10. セキュリティ

### 10.1 認証・認可
- Better Auth でセッション管理
- JWT トークンをHTTP-only Cookieに保存
- CSRF保護（Better Authのデフォルト）

### 10.2 データバリデーション
- Zod でサーバー側バリデーション
- Prisma の型安全性を活用
- XSS対策（Reactのデフォルトエスケープ）

### 10.3 環境変数
```env
# .env.local
DATABASE_URL="postgresql://..."
BETTER_AUTH_SECRET="..."
BETTER_AUTH_URL="http://localhost:3000"
GOOGLE_CLIENT_ID="..."
GOOGLE_CLIENT_SECRET="..."
GITHUB_CLIENT_ID="..."
GITHUB_CLIENT_SECRET="..."
```

## 11. テスト戦略

### 11.1 単体テスト
- ユーティリティ関数のテスト
- カスタムフックのテスト
- バリデーションロジックのテスト

### 11.2 統合テスト
- Server Actions のテスト
- API Routes のテスト
- データベース操作のテスト

### 11.3 E2Eテスト
- 主要ユーザーフローのテスト
  - ログイン → フィード閲覧 → いいね → ログアウト
  - プロフィール編集
  - コメント投稿

### 11.4 ビジュアルテスト
- Storybook でコンポーネントのビジュアル確認
- 既に設定済み（.storybook/）

## 12. デプロイメント

### 12.1 環境
- **開発環境**: ローカル（Docker PostgreSQL）
- **本番環境**: Vercel + Supabase

### 12.2 CI/CD
```yaml
# .github/workflows/deploy.yml
name: Deploy
on:
  push:
    branches: [main]
jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
      - run: pnpm install
      - run: pnpm build
      - run: pnpm prisma generate
      - uses: amondnet/vercel-action@v20
```

### 12.3 データベースマイグレーション
```bash
# 本番環境へのマイグレーション
DATABASE_URL="postgresql://..." pnpm prisma migrate deploy
```

## 13. 今後の拡張性

### 13.1 フェーズ2機能
- 動画記事対応（現在はテキストのみ）
- フォロー機能の実装
- 通知機能
- 検索機能
- おすすめアルゴリズム

### 13.2 技術的改善
- Redis キャッシュ導入
- フルテキスト検索（PostgreSQL）
- リアルタイム機能（Supabase Realtime）
- PWA対応

---

**作成日**: 2025-11-01  
**バージョン**: 1.0
