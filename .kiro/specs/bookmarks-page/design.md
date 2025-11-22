# ブックマーク一覧画面 デザイン文書

## 概要

ブックマーク一覧画面は、認証済みユーザーが保存したコンテンツを管理・閲覧するための専用ページです。既存のフィード機能と統合し、一貫性のあるUIとUXを提供します。

## アーキテクチャ

### ページ構造

```
/bookmarks (App Router)
├── page.tsx (Server Component)
│   ├── 認証チェック
│   ├── 初期データ取得
│   └── クライアントコンポーネントへの委譲
└── client-bookmarks.tsx (Client Component)
    ├── データ管理（状態、キャッシュ）
    ├── ユーザーインタラクション処理
    └── UI レンダリング
```

### データフロー

```mermaid
graph TD
    A[ユーザー] -->|アクセス| B[/bookmarks page.tsx]
    B -->|認証チェック| C{認証済み?}
    C -->|No| D[/login へリダイレクト]
    C -->|Yes| E[getBookmarkedArticles]
    E -->|データ取得| F[Prisma]
    F -->|FeedItem + Relations| E
    E -->|Article[]| G[client-bookmarks.tsx]
    G -->|表示| H[BookmarksList]
    A -->|削除操作| I[removeBookmark action]
    I -->|更新| F
    I -->|成功| G
```

## コンポーネントとインターフェース

### 1. ページコンポーネント

#### `/src/app/bookmarks/page.tsx` (Server Component)

```typescript
import { redirect } from "next/navigation";
import { getSession } from "@/lib/auth";
import { getBookmarkedArticles } from "@/app/actions/bookmarks";
import { ClientBookmarks } from "./client-bookmarks";

export default async function BookmarksPage() {
  // 認証チェック
  const session = await getSession();
  if (!session?.user) {
    redirect("/login");
  }

  // 初期データ取得
  const initialData = await getBookmarkedArticles({ limit: 20 });

  return <ClientBookmarks initialData={initialData} />;
}
```

#### `/src/app/bookmarks/client-bookmarks.tsx` (Client Component)

```typescript
"use client";

import { useState } from "react";
import type { GetBookmarkedArticlesResult } from "@/app/actions/bookmarks";
import { BookmarksList } from "@/features/bookmarks/components/bookmarks-list";
import { BookmarksEmpty } from "@/features/bookmarks/components/bookmarks-empty";
import { BookmarksError } from "@/features/bookmarks/components/bookmarks-error";

interface ClientBookmarksProps {
  initialData: GetBookmarkedArticlesResult;
}

export function ClientBookmarks({ initialData }: ClientBookmarksProps) {
  const [data, setData] = useState(initialData);
  const [error, setError] = useState<Error | null>(null);

  // 空状態
  if (data.articles.length === 0 && !error) {
    return <BookmarksEmpty />;
  }

  // エラー状態
  if (error) {
    return <BookmarksError error={error} onRetry={handleRetry} />;
  }

  // 通常表示
  return (
    <BookmarksList
      articles={data.articles}
      hasMore={data.hasMore}
      onLoadMore={handleLoadMore}
      onRemove={handleRemove}
    />
  );
}
```

### 2. Server Actions

#### `/src/app/actions/bookmarks.ts`

```typescript
"use server";

import { getSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { feedItemToArticle } from "@/features/feed/types/converters";
import type { Article } from "@/features/feed/types/article";

export interface GetBookmarkedArticlesParams {
  cursor?: string;
  limit?: number;
}

export interface GetBookmarkedArticlesResult {
  articles: Article[];
  nextCursor: string | null;
  hasMore: boolean;
}

/**
 * ユーザーのブックマーク一覧を取得
 */
export async function getBookmarkedArticles(
  params: GetBookmarkedArticlesParams = {}
): Promise<GetBookmarkedArticlesResult> {
  const { cursor, limit = 20 } = params;

  const session = await getSession();
  if (!session?.user?.id) {
    throw new Error("認証が必要です");
  }

  const userId = session.user.id;

  // ブックマークを取得（作成日時降順）
  const bookmarks = await prisma.bookmark.findMany({
    where: {
      userId,
      ...(cursor && {
        id: { lt: cursor },
      }),
    },
    include: {
      feedItem: {
        include: {
          rssEntry: {
            include: {
              source: {
                include: {
                  sourceTechnologies: {
                    include: { technology: true },
                  },
                },
              },
            },
          },
          post: {
            include: {
              author: true,
              hashtags: {
                include: { hashtag: true },
              },
            },
          },
          likes: {
            where: { userId },
            select: { feedItemId: true },
          },
        },
      },
    },
    orderBy: {
      createdAt: "desc",
    },
    take: limit + 1,
  });

  const hasMore = bookmarks.length > limit;
  const items = hasMore ? bookmarks.slice(0, limit) : bookmarks;
  const nextCursor = hasMore ? items[items.length - 1].id : null;

  // Article型に変換
  const articles = items
    .map((bookmark) => {
      const userLikes = new Set(
        bookmark.feedItem.likes.map((like) => like.feedItemId)
      );
      const userBookmarks = new Set([bookmark.feedItemId]);

      return feedItemToArticle(
        bookmark.feedItem,
        userId,
        userLikes,
        userBookmarks
      );
    })
    .filter((article): article is Article => article !== null);

  return {
    articles,
    nextCursor,
    hasMore,
  };
}

/**
 * ブックマークを削除
 */
export async function removeBookmark(feedItemId: string): Promise<void> {
  const session = await getSession();
  if (!session?.user?.id) {
    throw new Error("認証が必要です");
  }

  await prisma.bookmark.delete({
    where: {
      userId_feedItemId: {
        userId: session.user.id,
        feedItemId,
      },
    },
  });
}
```

### 3. Feature コンポーネント

#### `/src/features/bookmarks/components/bookmarks-list.tsx`

グリッドレイアウトでブックマークを表示するメインコンポーネント。

```typescript
"use client";

import { useCallback, useRef } from "react";
import type { Article } from "@/features/feed/types/article";
import { BookmarkCard } from "./bookmark-card";

interface BookmarksListProps {
  articles: Article[];
  hasMore: boolean;
  onLoadMore: () => void;
  onRemove: (feedItemId: string) => Promise<void>;
}

export function BookmarksList({
  articles,
  hasMore,
  onLoadMore,
  onRemove,
}: BookmarksListProps) {
  const observerTarget = useRef<HTMLDivElement>(null);

  // 無限スクロール実装
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasMore) {
          onLoadMore();
        }
      },
      { threshold: 0.1 }
    );

    if (observerTarget.current) {
      observer.observe(observerTarget.current);
    }

    return () => observer.disconnect();
  }, [hasMore, onLoadMore]);

  return (
    <div className="container mx-auto px-4 py-6">
      <h1 className="text-2xl font-bold mb-6">ブックマーク</h1>
      
      {/* レスポンシブグリッド */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {articles.map((article) => (
          <BookmarkCard
            key={article.id}
            article={article}
            onRemove={onRemove}
          />
        ))}
      </div>

      {/* 無限スクロールトリガー */}
      {hasMore && (
        <div ref={observerTarget} className="h-20 flex items-center justify-center">
          <LoadingSpinner />
        </div>
      )}
    </div>
  );
}
```

#### `/src/features/bookmarks/components/bookmark-card.tsx`

個別のブックマークカードコンポーネント。

```typescript
"use client";

import { useState } from "react";
import { Bookmark, ExternalLink, Trash2 } from "lucide-react";
import Link from "next/link";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import type { Article } from "@/features/feed/types/article";
import { formatDistanceToNow } from "@/lib/utils";

interface BookmarkCardProps {
  article: Article;
  onRemove: (feedItemId: string) => Promise<void>;
}

export function BookmarkCard({ article, onRemove }: BookmarkCardProps) {
  const [isRemoving, setIsRemoving] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const handleRemove = async () => {
    setIsRemoving(true);
    try {
      await onRemove(article.id);
    } catch (error) {
      console.error("Failed to remove bookmark:", error);
      setIsRemoving(false);
    }
  };

  return (
    <Card className="group hover:shadow-lg transition-shadow">
      {/* サムネイル */}
      <Link href={`/feed?item=${article.id}`}>
        <div className="relative aspect-video bg-muted overflow-hidden">
          {article.thumbnailUrl ? (
            <img
              src={article.thumbnailUrl}
              alt={article.title}
              className="object-cover w-full h-full group-hover:scale-105 transition-transform"
            />
          ) : (
            <div className="flex items-center justify-center h-full">
              <Bookmark className="w-12 h-12 text-muted-foreground" />
            </div>
          )}
          
          {/* コンテンツタイプバッジ */}
          <div className="absolute top-2 right-2">
            <span className="px-2 py-1 text-xs bg-black/70 text-white rounded">
              {article.type === "rss" ? "RSS" : "投稿"}
            </span>
          </div>
        </div>
      </Link>

      <CardContent className="p-4">
        {/* タイトル */}
        <Link href={`/feed?item=${article.id}`}>
          <h3 className="font-semibold line-clamp-2 hover:text-primary transition-colors">
            {article.title}
          </h3>
        </Link>

        {/* 説明 */}
        {article.description && (
          <p className="text-sm text-muted-foreground line-clamp-2 mt-2">
            {article.description}
          </p>
        )}

        {/* メタ情報 */}
        <div className="flex items-center gap-2 mt-3 text-xs text-muted-foreground">
          <span>{article.author.name}</span>
          <span>•</span>
          <span>{formatDistanceToNow(article.publishedAt)}</span>
        </div>
      </CardContent>

      <CardFooter className="p-4 pt-0 flex justify-between">
        {/* 外部リンク（RSS記事の場合） */}
        {article.type === "rss" && article.sourceUrl && (
          <Button variant="ghost" size="sm" asChild>
            <a href={article.sourceUrl} target="_blank" rel="noopener noreferrer">
              <ExternalLink className="w-4 h-4 mr-1" />
              元記事
            </a>
          </Button>
        )}

        {/* 削除ボタン */}
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setShowConfirm(true)}
          disabled={isRemoving}
          className="ml-auto text-destructive hover:text-destructive"
        >
          <Trash2 className="w-4 h-4 mr-1" />
          削除
        </Button>
      </CardFooter>

      {/* 削除確認ダイアログ */}
      {showConfirm && (
        <ConfirmDialog
          title="ブックマークを削除"
          message="このブックマークを削除してもよろしいですか？"
          onConfirm={handleRemove}
          onCancel={() => setShowConfirm(false)}
        />
      )}
    </Card>
  );
}
```

#### `/src/features/bookmarks/components/bookmarks-empty.tsx`

ブックマークが存在しない場合の空状態コンポーネント。

```typescript
import { Bookmark } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export function BookmarksEmpty() {
  return (
    <div className="container mx-auto px-4 py-16">
      <div className="max-w-md mx-auto text-center">
        <div className="mb-6 flex justify-center">
          <div className="w-24 h-24 rounded-full bg-muted flex items-center justify-center">
            <Bookmark className="w-12 h-12 text-muted-foreground" />
          </div>
        </div>
        
        <h2 className="text-2xl font-bold mb-3">ブックマークがありません</h2>
        
        <p className="text-muted-foreground mb-6">
          気になる記事や投稿を見つけたら、ブックマークボタンをタップして保存しましょう。
          後で読みたいコンテンツをここで管理できます。
        </p>

        <Button asChild>
          <Link href="/feed">
            フィードを見る
          </Link>
        </Button>
      </div>
    </div>
  );
}
```

#### `/src/features/bookmarks/components/bookmarks-error.tsx`

エラー状態を表示するコンポーネント。

```typescript
import { AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

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
          <Button onClick={onRetry}>
            再試行
          </Button>
        </div>
      </div>
    </div>
  );
}
```

## データモデル

### Article型（既存）

```typescript
export interface Article {
  id: string;
  type: "rss" | "post";
  title: string;
  description: string | null;
  thumbnailUrl: string | null;
  sourceUrl: string | null;
  author: {
    id: string;
    name: string;
    avatar: string | null;
  };
  publishedAt: Date;
  stats: {
    likes: number;
    comments: number;
    shares: number;
  };
  isLiked: boolean;
  isBookmarked: boolean;
  hashtags: string[];
  technologies: string[];
}
```

### Bookmark型（Prisma）

```prisma
model Bookmark {
  id         String   @id @default(cuid())
  userId     String   @map("user_id")
  feedItemId String   @map("feed_item_id")
  createdAt  DateTime @default(now()) @map("created_at")

  user     User     @relation(...)
  feedItem FeedItem @relation(...)

  @@unique([userId, feedItemId])
  @@index([userId])
}
```

## エラーハンドリング

### エラーの種類と対応

1. **認証エラー**
   - 検出: `getSession()` が null を返す
   - 対応: `/login` へリダイレクト

2. **データ取得エラー**
   - 検出: Prisma クエリの例外
   - 対応: `BookmarksError` コンポーネントを表示、再試行ボタン提供

3. **削除エラー**
   - 検出: `removeBookmark` の例外
   - 対応: トーストメッセージでエラー通知、状態をロールバック

4. **ネットワークエラー**
   - 検出: Server Action の通信失敗
   - 対応: エラーメッセージ表示、3回まで自動リトライ

### エラーログ

すべてのエラーは `console.error` でログ出力し、本番環境では監視サービスに送信します。

## テスト戦略

### 1. ユニットテスト

- Server Actions（`getBookmarkedArticles`, `removeBookmark`）
- データ変換関数（`feedItemToArticle`）
- ユーティリティ関数

### 2. コンポーネントテスト（Storybook）

- `BookmarkCard` - 各状態（通常、削除中、エラー）
- `BookmarksEmpty` - 空状態表示
- `BookmarksError` - エラー状態表示
- `BookmarksList` - グリッドレイアウト、レスポンシブ

### 3. 統合テスト

- ページ全体のレンダリング
- ブックマーク削除フロー
- 無限スクロール動作
- 認証フロー

## パフォーマンス最適化

### 1. データ取得

- **ページネーション**: カーソルベースで20件ずつ取得
- **プリロード**: Server Component で初期データを取得
- **キャッシング**: React Query または SWR でクライアント側キャッシュ

### 2. レンダリング

- **画像最適化**: Next.js Image コンポーネント使用、遅延読み込み
- **仮想化**: 大量のブックマークがある場合は react-window を検討
- **メモ化**: `useMemo`, `useCallback` で不要な再レンダリング防止

### 3. インタラクション

- **楽観的更新**: 削除操作は即座にUIを更新、バックグラウンドで同期
- **デバウンス**: 検索・フィルター機能追加時に適用

## アクセシビリティ

### WCAG 2.1 AA 準拠

1. **キーボードナビゲーション**
   - すべてのインタラクティブ要素に Tab でアクセス可能
   - Enter/Space でアクション実行
   - Escape でダイアログを閉じる

2. **スクリーンリーダー対応**
   - セマンティックHTML使用（`<nav>`, `<main>`, `<article>`）
   - ARIA ラベル適切に設定
   - 状態変化をアナウンス

3. **視覚的配慮**
   - カラーコントラスト比 4.5:1 以上
   - フォーカス状態を明確に表示
   - テキストサイズ調整可能

4. **エラーメッセージ**
   - 明確で具体的な内容
   - 視覚的にも音声的にも伝達

## レスポンシブデザイン

### ブレークポイント

- **モバイル** (< 768px): 1カラム、フルワイド
- **タブレット** (768px - 1023px): 2カラム
- **デスクトップ** (≥ 1024px): 3カラム

### レイアウト調整

```css
/* モバイル */
.bookmarks-grid {
  grid-template-columns: 1fr;
  gap: 1rem;
  padding: 1rem;
}

/* タブレット */
@media (min-width: 768px) {
  .bookmarks-grid {
    grid-template-columns: repeat(2, 1fr);
    gap: 1.5rem;
    padding: 1.5rem;
  }
}

/* デスクトップ */
@media (min-width: 1024px) {
  .bookmarks-grid {
    grid-template-columns: repeat(3, 1fr);
    gap: 2rem;
    padding: 2rem;
  }
}
```

## セキュリティ考慮事項

1. **認証・認可**
   - すべてのServer Actionでセッション検証
   - ユーザーは自分のブックマークのみアクセス可能

2. **入力検証**
   - feedItemId の形式検証（cuid）
   - SQL インジェクション対策（Prisma が自動処理）

3. **XSS 対策**
   - React の自動エスケープ機能を活用
   - 外部リンクに `rel="noopener noreferrer"` 付与

4. **CSRF 対策**
   - Next.js の Server Actions が自動処理

## 今後の拡張可能性

1. **検索・フィルター機能**
   - タイトル・説明文での全文検索
   - タグ・技術スタックでのフィルタリング
   - 日付範囲指定

2. **ソート機能**
   - 保存日時順（デフォルト）
   - 公開日時順
   - タイトル順

3. **一括操作**
   - 複数選択
   - 一括削除
   - タグ一括追加

4. **エクスポート機能**
   - JSON形式でエクスポート
   - Markdown形式でエクスポート

5. **共有機能**
   - ブックマークコレクションの公開
   - 他ユーザーとの共有
