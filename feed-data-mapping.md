# フィード・記事データマッピング仕様書

このドキュメントでは、フィードや記事に関してどういった情報をどのテーブルのどのカラムから取得しているかを包括的に説明します。

## 目次

1. [概要](#概要)
2. [Article型（統合表示型）](#article型統合表示型)
3. [RSS記事のデータマッピング](#rss記事のデータマッピング)
4. [ユーザー投稿のデータマッピング](#ユーザー投稿のデータマッピング)
5. [インタラクションデータ](#インタラクションデータ)
6. [カテゴリー・技術スタックデータ](#カテゴリー技術スタックデータ)
7. [プロフィールデータ](#プロフィールデータ)
8. [ブックマークデータ](#ブックマークデータ)
9. [データ取得フロー](#データ取得フロー)
10. [UIコンポーネントでの使用](#uiコンポーネントでの使用)

---

## 概要

アプリケーションでは、RSS記事とユーザー投稿を統合的に扱うため、`feed_items` テーブルで一元管理し、フロントエンド向けには `Article` 型に変換して表示します。

### データフロー図

```
[RSS記事]                [ユーザー投稿]
   ↓                          ↓
rss_entries              posts
   ↓                          ↓
   └────→  feed_items  ←─────┘
              ↓
        Article型に変換
              ↓
         UIコンポーネント
```

---

## Article型（統合表示型）

**ファイル**: `src/features/feed/types/article.ts`

フィード画面で表示する統合的なデータ型です。

```typescript
interface Article {
  id: string;               // feed_items.id
  type: "rss" | "post";     // feed_items.type から判定
  title: string;            // 記事タイトル
  content: string;          // 記事本文・要約
  authorName: string;       // 著者名
  authorAvatar?: string;    // 著者アバター画像URL
  originalUrl?: string;     // 元記事URL（RSS記事のみ）
  publishedAt: Date;        // 公開日時
  likeCount: number;        // いいね数
  commentCount: number;     // コメント数
  shareCount: number;       // シェア数
  isLiked: boolean;         // ログインユーザーのいいね状態
  isBookmarked: boolean;    // ログインユーザーのブックマーク状態
  categories: Category[];   // カテゴリー（技術スタック）
}
```

---

## RSS記事のデータマッピング

### 変換関数: `rssEntryToArticle()`

**ファイル**: `src/features/feed/types/article.ts` (87-102行目)

| Article型フィールド | 取得元テーブル.カラム | 優先順位・フォールバック |
|-------------------|---------------------|----------------------|
| `id` | `feed_items.id` | - |
| `type` | 固定値 `"rss"` | - |
| `title` | `rss_entries.title` | - |
| `content` | `rss_entries.ai_summary` <br> `rss_entries.content_text` <br> `rss_entries.description` | 1. ai_summary<br>2. content_text<br>3. description<br>4. 空文字 |
| `authorName` | `rss_entries.author_name` <br> `rss_sources.title` | 1. author_name<br>2. source.title<br>3. "Unknown" |
| `authorAvatar` | `rss_entries.image_url` | なければ undefined |
| `originalUrl` | `rss_entries.link` | なければ undefined |
| `publishedAt` | `rss_entries.published_at` | - |
| `likeCount` | `likes` テーブルの集計 | ※別途集計が必要 |
| `commentCount` | `comments` テーブルの集計 | ※別途集計が必要 |
| `shareCount` | `post_shares` テーブルの集計 | ※別途集計が必要（RSS記事は0） |
| `isLiked` | `likes` テーブル | userIdとfeedItemIdで判定 |
| `isBookmarked` | `bookmarks` テーブル | userIdとfeedItemIdで判定 |
| `categories` | `source_technologies` → `technologies` | sourceTechnologiesから取得 |

### 詳細なテーブル構造

#### `rss_entries` テーブル

| カラム名 | 型 | 説明 | 使用箇所 |
|---------|-----|------|---------|
| `id` | String | 主キー | - |
| `source_id` | String | `rss_sources` への外部キー | source情報取得 |
| `guid` | String | 記事の一意識別子 | 重複検出 |
| `link` | String | 記事のURL | ✅ `originalUrl` |
| `title` | String | 記事のタイトル | ✅ `title` |
| `description` | Text | 記事の要約 | ✅ `content`（第3優先） |
| `content_html` | Text | 記事の本文（HTML） | 保存のみ（表示未使用） |
| `content_text` | Text | 記事の本文（テキスト） | ✅ `content`（第2優先） |
| `ai_summary` | Text | AI生成要約（300文字以内） | ✅ `content`（第1優先） |
| `author_name` | String | 著者名 | ✅ `authorName`（第1優先） |
| `language` | String | 言語コード | 言語フィルタリング用 |
| `image_url` | String | 画像URL | ✅ `authorAvatar` |
| `published_at` | DateTime | 公開日時 | ✅ `publishedAt` |
| `updated_at` | DateTime | 更新日時 | 記録用 |
| `content_hash` | String | コンテンツハッシュ | 重複検出用 |

#### `rss_sources` テーブル

| カラム名 | 型 | 説明 | 使用箇所 |
|---------|-----|------|---------|
| `id` | String | 主キー | - |
| `feed_url` | String | RSSフィードURL | フェッチ処理 |
| `site_url` | String | サイトURL | 参照用 |
| `title` | String | フィード名 | ✅ `authorName`（第2優先） |
| `description` | Text | フィード説明 | 参照用 |
| `language` | String | 言語 | フィルタリング |
| `category` | String | カテゴリー | 分類用 |
| `is_active` | Boolean | アクティブ状態 | フェッチ制御 |
| `fetch_interval_minutes` | Int | 取得間隔（分） | フェッチ制御 |
| `etag` | String | HTTP ETag | キャッシュ制御 |
| `last_modified` | String | HTTP Last-Modified | キャッシュ制御 |
| `last_fetched_at` | DateTime | 最終取得日時 | フェッチ管理 |

---

## ユーザー投稿のデータマッピング

### 変換関数: `postToArticle()`

**ファイル**: `src/features/feed/types/article.ts` (108-137行目)

| Article型フィールド | 取得元テーブル.カラム | 優先順位・フォールバック |
|-------------------|---------------------|----------------------|
| `id` | `feed_items.id` | - |
| `type` | 固定値 `"post"` | - |
| `title` | `posts.title` | - |
| `content` | `posts.body` | なければ空文字 |
| `authorName` | `users.display_name` <br> `users.name` | 1. display_name<br>2. name<br>3. "Unknown" |
| `authorAvatar` | `users.image` | なければ undefined |
| `originalUrl` | undefined | ユーザー投稿には元記事なし |
| `publishedAt` | `posts.created_at` | - |
| `likeCount` | `likes` テーブルの集計 | ※別途集計が必要 |
| `commentCount` | `comments` テーブルの集計 | ※別途集計が必要 |
| `shareCount` | `post_shares` テーブルの集計 | ※別途集計が必要 |
| `isLiked` | `likes` テーブル | userIdとfeedItemIdで判定 |
| `isBookmarked` | `bookmarks` テーブル | userIdとfeedItemIdで判定 |
| `categories` | `post_hashtags` → `hashtags` | ハッシュタグから取得 |

### 詳細なテーブル構造

#### `posts` テーブル

| カラム名 | 型 | 説明 | 使用箇所 |
|---------|-----|------|---------|
| `id` | String | 主キー | - |
| `author_id` | String | `users` への外部キー | 著者情報取得 |
| `type` | PostType | 投稿タイプ（TEXT/VIDEO） | メディア判定 |
| `title` | String | 投稿タイトル | ✅ `title` |
| `body` | Text | 投稿本文 | ✅ `content` |
| `video_url` | String | 動画URL | VIDEO投稿用 |
| `thumbnail_url` | String | サムネイルURL | VIDEO投稿用 |
| `created_at` | DateTime | 作成日時 | ✅ `publishedAt` |
| `updated_at` | DateTime | 更新日時 | 記録用 |

#### `users` テーブル（著者情報）

| カラム名 | 型 | 説明 | 使用箇所 |
|---------|-----|------|---------|
| `id` | String | 主キー | - |
| `username` | String | ユーザー名（一意） | 識別用 |
| `display_name` | String | 表示名 | ✅ `authorName`（第1優先） |
| `name` | String | 名前（Auth.js標準） | ✅ `authorName`（第2優先） |
| `email` | String | メールアドレス | 認証用 |
| `email_verified` | Boolean | メール認証済み | 認証状態 |
| `image` | String | アバター画像URL | ✅ `authorAvatar` |
| `bio` | String | 自己紹介 | プロフィール表示 |
| `created_at` | DateTime | アカウント作成日時 | 記録用 |
| `updated_at` | DateTime | 更新日時 | 記録用 |

---

## インタラクションデータ

### いいね（Like）

**Server Action**: `src/app/actions/interactions.ts`

| 機能 | 使用テーブル | 取得カラム | 説明 |
|-----|------------|----------|------|
| いいね状態確認 | `likes` | `user_id`, `feed_item_id` | ユニークキーで存在確認 |
| いいね追加 | `likes` | - | user_id + feed_item_id でレコード作成 |
| いいね削除 | `likes` | `id` | レコード削除 |
| いいね数取得 | `likes` | COUNT(*) | feed_item_id で集計 |

#### `likes` テーブル

| カラム名 | 型 | 説明 |
|---------|-----|------|
| `id` | String | 主キー |
| `user_id` | String | `users` への外部キー |
| `feed_item_id` | String | `feed_items` への外部キー |
| `created_at` | DateTime | いいね日時 |

**ユニーク制約**: `(user_id, feed_item_id)`

### ブックマーク（Bookmark）

**Server Action**: `src/app/actions/interactions.ts`, `src/app/actions/bookmarks.ts`

| 機能 | 使用テーブル | 取得カラム | 説明 |
|-----|------------|----------|------|
| ブックマーク状態確認 | `bookmarks` | `user_id`, `feed_item_id` | ユニークキーで存在確認 |
| ブックマーク追加 | `bookmarks` | - | user_id + feed_item_id でレコード作成 |
| ブックマーク削除 | `bookmarks` | `id` | レコード削除 |
| ブックマーク一覧取得 | `bookmarks` + `feed_items` | 全カラム（JOIN） | user_id でフィルタ、created_at 降順 |

#### `bookmarks` テーブル

| カラム名 | 型 | 説明 |
|---------|-----|------|
| `id` | String | 主キー |
| `user_id` | String | `users` への外部キー |
| `feed_item_id` | String | `feed_items` への外部キー |
| `created_at` | DateTime | ブックマーク日時 |

**ユニーク制約**: `(user_id, feed_item_id)`

### コメント（Comment）

| 機能 | 使用テーブル | 取得カラム | 説明 |
|-----|------------|----------|------|
| コメント数取得 | `comments` | COUNT(*) | post_id で集計 |
| コメント一覧取得 | `comments` + `users` | 全カラム（JOIN） | post_id でフィルタ |

#### `comments` テーブル

| カラム名 | 型 | 説明 |
|---------|-----|------|
| `id` | String | 主キー |
| `post_id` | String | `posts` への外部キー |
| `user_id` | String | `users` への外部キー |
| `body` | Text | コメント本文 |
| `parent_comment_id` | String | 親コメントID（返信用） |
| `created_at` | DateTime | コメント日時 |
| `updated_at` | DateTime | 更新日時 |

### シェア（Share）

**Server Action**: `src/app/actions/interactions.ts`

| 機能 | 使用テーブル | 取得カラム | 説明 |
|-----|------------|----------|------|
| シェア追加 | `post_shares` | - | user_id + post_id でレコード作成 |
| シェア数取得 | `post_shares` | COUNT(*) | post_id で集計 |

**注意**: RSS記事はシェアできず、ユーザー投稿（Post）のみシェア可能です。

#### `post_shares` テーブル

| カラム名 | 型 | 説明 |
|---------|-----|------|
| `id` | String | 主キー |
| `post_id` | String | `posts` への外部キー |
| `user_id` | String | `users` への外部キー |
| `created_at` | DateTime | シェア日時 |

---

## カテゴリー・技術スタックデータ

### 技術スタック（Technology）

**Server Action**: `src/app/actions/feed.ts` - `getCategories()`

| 機能 | 使用テーブル | 取得カラム | 説明 |
|-----|------------|----------|------|
| カテゴリー一覧取得 | `technologies` | `id`, `name`, `color` | 全件取得、name昇順 |

#### `technologies` テーブル

| カラム名 | 型 | 説明 | 使用箇所 |
|---------|-----|------|---------|
| `id` | String | 主キー | カテゴリーID |
| `name` | String | 技術名（例: React, TypeScript） | ✅ カテゴリー表示 |
| `category` | String | カテゴリー分類 | フィルタリング |
| `color` | String | 表示カラー（例: #61DAFB） | ✅ カテゴリータグ背景色 |
| `created_at` | DateTime | 作成日時 | 記録用 |
| `updated_at` | DateTime | 更新日時 | 記録用 |

### RSS記事とカテゴリーの関連付け

#### `source_technologies` テーブル（中間テーブル）

| カラム名 | 型 | 説明 |
|---------|-----|------|
| `id` | String | 主キー |
| `source_id` | String | `rss_sources` への外部キー |
| `technology_id` | String | `technologies` への外部キー |
| `created_at` | DateTime | 関連付け日時 |

**ユニーク制約**: `(source_id, technology_id)`

### ユーザー投稿とカテゴリーの関連付け

#### `post_hashtags` テーブル（中間テーブル）

| カラム名 | 型 | 説明 |
|---------|-----|------|
| `id` | String | 主キー |
| `post_id` | String | `posts` への外部キー |
| `hashtag_id` | String | `hashtags` への外部キー |

**ユニーク制約**: `(post_id, hashtag_id)`

#### `hashtags` テーブル

| カラム名 | 型 | 説明 |
|---------|-----|------|
| `id` | String | 主キー |
| `name` | String | ハッシュタグ名（ユニーク） |
| `created_at` | DateTime | 作成日時 |

---

## プロフィールデータ

**Server Action**: `src/app/actions/profile.ts`

### ユーザー情報

| 表示項目 | 取得元テーブル.カラム | 説明 |
|---------|---------------------|------|
| ユーザー名 | `users.username` | 一意のユーザー名 |
| 表示名 | `users.display_name` | 表示用の名前 |
| アバター画像 | `users.image` | プロフィール画像URL |
| 自己紹介 | `users.bio` | プロフィール文 |
| 技術スタック | `user_technologies` → `technologies` | ユーザーの興味・スキル |

### ユーザー技術スタック

#### `user_technologies` テーブル（中間テーブル）

| カラム名 | 型 | 説明 |
|---------|-----|------|
| `id` | String | 主キー |
| `user_id` | String | `users` への外部キー |
| `technology_id` | String | `technologies` への外部キー |
| `created_at` | DateTime | 関連付け日時 |

**ユニーク制約**: `(user_id, technology_id)`

---

## ブックマークデータ

**Server Action**: `src/app/actions/bookmarks.ts` - `getBookmarkedArticles()`

### 取得データフロー

```
bookmarks (user_id でフィルタ、created_at 降順)
  ↓
feed_items (JOIN)
  ↓
├─ rss_entries + rss_sources + source_technologies + technologies
└─ posts + users + post_hashtags + hashtags
  ↓
Article型に変換
```

### ページネーション

| パラメータ | 説明 |
|----------|------|
| `cursor` | `bookmarks.id` を使用したカーソルベースページネーション |
| `limit` | 取得件数（デフォルト: 20） |

---

## データ取得フロー

### フィード取得 (`getFeedArticles`)

**ファイル**: `src/app/actions/feed.ts` (37-175行目)

#### ステップ1: FeedItemを取得

```sql
SELECT * FROM feed_items
WHERE is_published = true
  AND (id < cursor) -- ページネーション
  AND (...) -- カテゴリーフィルター
ORDER BY published_at DESC
LIMIT limit + 1
```

**JOIN関連**:
- `rss_entry` → `source` → `source_technologies` → `technology`
- `post` → `author` (users) + `hashtags` → `hashtag`

#### ステップ2: ユーザーのインタラクション状態を取得

```sql
-- いいね状態
SELECT feed_item_id FROM likes
WHERE user_id = :userId
  AND feed_item_id IN (:feedItemIds)

-- ブックマーク状態
SELECT feed_item_id FROM bookmarks
WHERE user_id = :userId
  AND feed_item_id IN (:feedItemIds)
```

#### ステップ3: Article型に変換

- `feedItemToArticle()` 関数を使用
- RSS記事 → `rssEntryToArticle()`
- ユーザー投稿 → `postToArticle()`

### フィード統合管理

#### `feed_items` テーブル

| カラム名 | 型 | 説明 |
|---------|-----|------|
| `id` | String | 主キー（フィード表示ID） |
| `type` | FeedItemType | RSS_ENTRY または POST |
| `rss_entry_id` | String | `rss_entries` への外部キー（RSS記事の場合） |
| `post_id` | String | `posts` への外部キー（投稿の場合） |
| `is_published` | Boolean | 公開状態（デフォルト: true） |
| `rank_score` | Float | ランキングスコア（アルゴリズム用） |
| `published_at` | DateTime | 公開日時（ソート用） |
| `created_at` | DateTime | レコード作成日時 |
| `updated_at` | DateTime | 更新日時 |

**インデックス**:
- `(is_published, published_at)` - フィード取得クエリ最適化
- `(rank_score)` - ランキング表示最適化

---

## UIコンポーネントでの使用

### ArticleCard コンポーネント

**ファイル**: `src/features/feed/components/article-card.tsx`

| 表示要素 | Article型フィールド | 取得元 |
|---------|-------------------|--------|
| 著者アバター | `authorAvatar` | rss_entries.image_url / users.image |
| 著者名 | `authorName` | rss_entries.author_name / users.display_name |
| 公開日 | `publishedAt` | rss_entries.published_at / posts.created_at |
| タイトル | `title` | rss_entries.title / posts.title |
| カテゴリータグ | `categories[]` | technologies (source_technologies / post_hashtags経由) |
| 本文 | `content` | rss_entries.content_text / posts.body |
| 元記事リンク | `originalUrl` | rss_entries.link |
| いいねボタン | `id`, `isLiked`, `likeCount` | feed_items.id + likes テーブル |
| ブックマークボタン | `id`, `isBookmarked` | feed_items.id + bookmarks テーブル |
| コメント数 | `commentCount` | comments テーブル集計 |
| シェアボタン | `id`, `shareCount` | feed_items.id + post_shares テーブル |

### インタラクションコンポーネント

#### LikeButton

**ファイル**: `src/features/interactions/components/like-button.tsx`

| プロパティ | 取得元 |
|-----------|--------|
| `articleId` | `feed_items.id` |
| `initialIsLiked` | `likes` テーブル（user_id + feed_item_id） |
| `initialCount` | `likes` テーブルのCOUNT |

#### BookmarkButton

**ファイル**: `src/features/interactions/components/bookmark-button.tsx`

| プロパティ | 取得元 |
|-----------|--------|
| `articleId` | `feed_items.id` |
| `initialIsBookmarked` | `bookmarks` テーブル（user_id + feed_item_id） |

#### ShareButton

**ファイル**: `src/features/interactions/components/share-button.tsx`

| プロパティ | 取得元 |
|-----------|--------|
| `articleId` | `feed_items.id` |
| `articleTitle` | Article.title |
| `initialCount` | `post_shares` テーブルのCOUNT |

---

## データ集計について

現在、以下のカウント情報は**リアルタイム集計**ではなく、Article型に変換時に`0`で初期化されています：

- `likeCount` - いいね数
- `commentCount` - コメント数  
- `shareCount` - シェア数

### 実装時の集計クエリ

**いいね数**:
```sql
SELECT COUNT(*) FROM likes
WHERE feed_item_id = :feedItemId
```

**コメント数** (ユーザー投稿のみ):
```sql
SELECT COUNT(*) FROM comments
WHERE post_id = :postId
```

**シェア数** (ユーザー投稿のみ):
```sql
SELECT COUNT(*) FROM post_shares
WHERE post_id = :postId
```

### 将来の最適化案

パフォーマンス向上のため、以下の方法を検討：

1. **キャッシュテーブルの導入**: `feed_item_stats` テーブルを作成し、集計値をキャッシュ
2. **トリガーによる更新**: いいね/コメント/シェア時にキャッシュを自動更新
3. **Redis等のキャッシュ**: 頻繁にアクセスされる統計情報をメモリキャッシュ

---

## カテゴリーフィルタリング

### RSS記事のフィルタリング

```sql
SELECT * FROM feed_items
WHERE rss_entry_id IN (
  SELECT rss_entry_id FROM rss_entries
  WHERE source_id IN (
    SELECT source_id FROM source_technologies
    WHERE technology_id = :categoryId
  )
)
```

### ユーザー投稿のフィルタリング

```sql
SELECT * FROM feed_items
WHERE post_id IN (
  SELECT post_id FROM post_hashtags
  WHERE hashtag_id = :categoryId
)
```

### 統合フィルタリング（OR条件）

**実装**: `src/app/actions/feed.ts` (56-80行目)

```typescript
{
  OR: [
    {
      rssEntry: {
        source: {
          sourceTechnologies: {
            some: { technologyId: categoryId }
          }
        }
      }
    },
    {
      post: {
        hashtags: {
          some: { hashtagId: categoryId }
        }
      }
    }
  ]
}
```

---

## まとめ

### 主要テーブルと役割

| テーブル名 | 役割 | 関連テーブル |
|-----------|------|------------|
| `feed_items` | フィード統合管理 | rss_entries, posts |
| `rss_entries` | RSS記事データ | rss_sources |
| `posts` | ユーザー投稿データ | users |
| `likes` | いいね管理 | users, feed_items |
| `bookmarks` | ブックマーク管理 | users, feed_items |
| `comments` | コメント管理 | users, posts |
| `post_shares` | シェア管理 | users, posts |
| `technologies` | 技術スタックマスター | - |
| `source_technologies` | RSS記事-技術関連付け | rss_sources, technologies |
| `post_hashtags` | 投稿-ハッシュタグ関連付け | posts, hashtags |
| `user_technologies` | ユーザー-技術関連付け | users, technologies |

### データ取得の3ステップ

1. **FeedItem取得**: `feed_items` から公開済みアイテムを取得（関連データをJOIN）
2. **インタラクション取得**: ログインユーザーのいいね/ブックマーク状態を取得
3. **型変換**: `Article` 型に変換してフロントエンドに渡す

### 関連ファイル

- **スキーマ**: `prisma/schema.prisma`
- **Server Actions**:
  - `src/app/actions/feed.ts` - フィード取得
  - `src/app/actions/interactions.ts` - いいね・ブックマーク・シェア
  - `src/app/actions/bookmarks.ts` - ブックマーク一覧
  - `src/app/actions/profile.ts` - プロフィール管理
- **型定義**:
  - `src/features/feed/types/article.ts` - Article型・変換関数
  - `src/features/profile/types/index.ts` - プロフィール型
- **コンポーネント**:
  - `src/features/feed/components/article-card.tsx` - 記事カード
  - `src/features/interactions/components/` - インタラクションボタン

