# RSSデータの取得と表示フロー

このドキュメントでは、RSSフィードから取得したデータがどのように保存され、フィード画面に表示されるかを説明します。

## 概要

RSSフィードから取得した記事データは、以下の3つのステップで処理されます：

1. **データ保存**: `rss_entries` テーブルにRSS記事を保存
2. **統合管理**: `feed_items` テーブルでRSS記事とユーザー投稿を統合管理
3. **表示変換**: フロントエンド用の `Article` 型に変換して表示

## データベーススキーマ

### 1. `rss_sources` テーブル

RSSフィードソースの基本情報を管理します。

| カラム名 | 型 | 説明 |
|---------|-----|------|
| `id` | String | 主キー |
| `feed_url` | String | RSSフィードのURL（ユニーク） |
| `site_url` | String | サイトのURL |
| `title` | String | フィードのタイトル |
| `description` | Text | フィードの説明 |
| `language` | String | 言語 |
| `category` | String | カテゴリー |
| `is_active` | Boolean | アクティブ状態（デフォルト: true） |
| `fetch_interval_minutes` | Int | 取得間隔（分、デフォルト: 60） |
| `last_fetched_at` | DateTime | 最終取得日時 |

### 2. `rss_entries` テーブル（重要）

**RSSフィードから取得した記事データを保存するメインテーブルです。**

| カラム名 | 型 | 説明 | 表示への使用 |
|---------|-----|------|-------------|
| `id` | String | 主キー | - |
| `source_id` | String | `rss_sources` への外部キー | - |
| `guid` | String | 記事の一意識別子 | - |
| `link` | String | 記事のURL | ✅ **元記事URL** として表示 |
| `title` | String | 記事のタイトル | ✅ **タイトル** として表示 |
| `description` | Text | 記事の要約・説明 | ✅ **要約/本文（第2優先）** として表示 |
| `content_html` | Text | 記事の本文（HTML形式） | 保存のみ（表示未使用） |
| `content_text` | Text | 記事の本文（テキスト形式） | ✅ **要約/本文（第1優先）** として表示 |
| `author_name` | String | 著者名 | ✅ **著者名（第1優先）** として表示 |
| `language` | String | 言語 | - |
| `image_url` | String | 画像URL | ✅ **サムネイル画像** として表示 |
| `published_at` | DateTime | 公開日時 | ✅ **公開日時** として表示 |
| `content_hash` | String | コンテンツのハッシュ値 | 重複検出用 |

### 3. `feed_items` テーブル

RSS記事とユーザー投稿を統合的に管理し、フィードに表示する項目を管理します。

| カラム名 | 型 | 説明 |
|---------|-----|------|
| `id` | String | 主キー（フィード表示時のID） |
| `type` | FeedItemType | アイテムタイプ（RSS_ENTRY または POST） |
| `rss_entry_id` | String | `rss_entries` への外部キー |
| `post_id` | String | `posts` への外部キー |
| `is_published` | Boolean | 公開状態（デフォルト: true） |
| `rank_score` | Float | ランキングスコア |
| `published_at` | DateTime | 公開日時 |

## データ取得フロー

### Server Action: `getFeedArticles()`

**ファイル**: `src/app/actions/feed.ts`

```typescript
// 1. FeedItemを取得（公開済み、カテゴリーフィルタリング対応）
const feedItems = await prisma.feedItem.findMany({
  where: {
    isPublished: true,
    // カーソルベースのページネーション
    // カテゴリーフィルター
  },
  include: {
    rssEntry: {
      include: {
        source: {
          include: {
            sourceTechnologies: {
              include: {
                technology: true,
              },
            },
          },
        },
      },
    },
    post: {
      include: {
        author: true,
        hashtags: {
          include: {
            hashtag: true,
          },
        },
      },
    },
  },
  orderBy: {
    publishedAt: "desc",
  },
  take: limit + 1,
});

// 2. ユーザーのいいね/ブックマーク状態を取得
// 3. FeedItemをArticle型に変換
```

## データ変換: Article型への変換

### 変換関数: `rssEntryToArticle()`

**ファイル**: `src/features/feed/types/article.ts`

RSS記事を表示用の `Article` 型に変換します。

```typescript
{
  id: feedItem.id,                    // feed_items.id
  type: "rss",                        // 固定値
  title: entry.title,                 // rss_entries.title
  content: entry.contentText          // rss_entries.content_text
    || entry.description              // または rss_entries.description
    || "",
  authorName: entry.authorName        // rss_entries.author_name
    || entry.source.title             // または rss_sources.title
    || "Unknown",
  authorAvatar: entry.imageUrl        // rss_entries.image_url
    || undefined,
  originalUrl: entry.link             // rss_entries.link
    || undefined,
  publishedAt: entry.publishedAt,     // rss_entries.published_at
  likeCount: 0,                       // 別途集計が必要
  commentCount: 0,                    // 別途集計が必要
  shareCount: 0,                      // 別途集計が必要
  isLiked: userLikes?.has(feedItem.id) || false,
  isBookmarked: userBookmarks?.has(feedItem.id) || false,
  categories: [...],                  // source_technologies -> technologies
}
```

## フィード表示で使用される項目まとめ

| UI表示項目 | データソース | フォールバック |
|-----------|-------------|---------------|
| **タイトル** | `rss_entries.title` | - |
| **要約/本文** | `rss_entries.ai_summary` | `rss_entries.content_text` → `rss_entries.description` → 空文字 |
| **著者名** | `rss_entries.author_name` | `rss_sources.title` → "Unknown" |
| **サムネイル画像** | `rss_entries.image_url` | undefined（画像なし） |
| **元記事URL** | `rss_entries.link` | undefined |
| **公開日時** | `rss_entries.published_at` | - |
| **カテゴリー** | `source_technologies` → `technologies` | 空配列 |
| **いいね状態** | `likes` テーブル（ユーザーごと） | false |
| **ブックマーク状態** | `bookmarks` テーブル（ユーザーごと） | false |

## 要約データの優先順位

フィード画面に表示される**要約/本文**は、以下の優先順位で取得されます：

1. **第1優先**: `rss_entries.ai_summary`（AI生成要約、300文字以内）
2. **第2優先**: `rss_entries.content_text`（テキスト形式の本文）
3. **第3優先**: `rss_entries.description`（要約・説明文）
4. **フォールバック**: 空文字列 `""`

## カテゴリー（技術スタック）の関連付け

RSSソースと技術スタックの関連付けは以下のテーブルで管理されます：

- `source_technologies`: RSSソースと技術の中間テーブル
- `technologies`: 技術スタックのマスターテーブル

これにより、ユーザーは特定の技術（React、TypeScriptなど）でフィルタリングしてフィードを閲覧できます。

## 関連ファイル

- **スキーマ定義**: `prisma/schema.prisma`
- **Server Actions**: `src/app/actions/feed.ts`
- **型定義**: `src/features/feed/types/article.ts`
- **フィード画面**: `src/app/feed/page.tsx`
- **フィードコンポーネント**: `src/features/feed/components/`

## まとめ

- RSSの要約は主に **`rss_entries.content_text`** または **`rss_entries.description`** から取得
- `feed_items` テーブルでRSS記事とユーザー投稿を統合管理
- フロントエンドでは統一された `Article` 型で表示
- カテゴリーフィルタリングやいいね/ブックマーク機能も統合的に実装

