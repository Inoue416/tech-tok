# バッチ処理用データベーススキーマ仕様書

## 1. 概要

本ドキュメントは、Tech-Tokアプリケーションにおいて、記事データを定期的にAPIからフェッチしてデータベースへ登録するバッチ処理を実装するための、データベーススキーマ情報をまとめたものです。

### 1.1 目的
- 外部RSS/APIから記事データをフェッチし、データベースへ登録するバッチ処理の実装
- データの整合性を保ちながら、効率的にデータを登録・更新する仕組みの構築
- 重複データの防止と既存データの更新

### 1.2 バッチ処理のフロー概要

```
1. RssSourceテーブルから処理対象のソースを取得
   ↓
2. 各ソースのfeedUrlからRSSフィードを取得
   ↓
3. 取得したエントリーをパース
   ↓
4. RssEntryテーブルへの登録/更新（重複チェック）
   ↓
5. ハッシュタグの抽出とHashtagテーブルへの登録
   ↓
6. RssEntryHashtagテーブルへの関連付け
   ↓
7. FeedItemテーブルへの登録（フィード表示用）
   ↓
8. RssFetchLogテーブルへのログ記録
```

---

## 2. データベース環境

### 2.1 使用技術
- **データベース**: PostgreSQL 17
- **ORM**: Prisma 6.14.0
- **接続方法**: Prisma Client

### 2.2 接続情報
```env
# 開発環境
DATABASE_URL="postgresql://user:password@localhost:5432/techtok-db"

# 本番環境（予定：Supabase）
DATABASE_URL="postgresql://postgres:[PASSWORD]@[PROJECT_REF].supabase.co:5432/postgres"
```

---

## 3. RSS/記事データ関連テーブル

### 3.1 RssSource（RSS情報源）

**テーブル名**: `rss_sources`

#### 概要
RSS/Atomフィードの情報源を管理するテーブル。バッチ処理の対象となるフィードURLと設定を保持します。

#### スキーマ定義

```prisma
model RssSource {
  id                     String    @id @default(cuid())
  feedUrl                String    @unique @map("feed_url")
  siteUrl                String?   @map("site_url")
  title                  String?
  description            String?   @db.Text
  language               String?
  category               String?
  isActive               Boolean   @default(true) @map("is_active")
  fetchIntervalMinutes   Int       @default(60) @map("fetch_interval_minutes")
  etag                   String?
  lastModified           String?   @map("last_modified")
  lastFetchedAt          DateTime? @map("last_fetched_at")
  createdAt              DateTime  @default(now()) @map("created_at")
  updatedAt              DateTime  @updatedAt @map("updated_at")

  entries            RssEntry[]
  fetchLogs          RssFetchLog[]
  sourceTechnologies SourceTechnology[]

  @@index([isActive])
  @@index([lastFetchedAt])
  @@map("rss_sources")
}
```

#### フィールド詳細

| フィールド名 | 型 | NULL | デフォルト | 説明 | バッチ処理での用途 |
|------------|-----|------|-----------|------|------------------|
| id | String | NO | cuid() | プライマリキー | ソース識別 |
| feedUrl | String | NO | - | RSSフィードURL（ユニーク） | フェッチ先URL |
| siteUrl | String | YES | NULL | サイトのURL | メタ情報 |
| title | String | YES | NULL | フィードタイトル | 表示用 |
| description | String | YES | NULL | フィードの説明 | メタ情報 |
| language | String | YES | NULL | 言語コード（en, ja等） | フィルタリング |
| category | String | YES | NULL | カテゴリ（General, Frontend等） | フィルタリング |
| **isActive** | Boolean | NO | true | **有効/無効フラグ** | **バッチ処理対象の判定** |
| **fetchIntervalMinutes** | Int | NO | 60 | **フェッチ間隔（分）** | **次回実行判定** |
| **etag** | String | YES | NULL | **HTTPキャッシュ用ETag** | **差分取得の最適化** |
| **lastModified** | String | YES | NULL | **HTTPキャッシュ用Last-Modified** | **差分取得の最適化** |
| **lastFetchedAt** | DateTime | YES | NULL | **最終フェッチ日時** | **次回実行判定** |
| createdAt | DateTime | NO | now() | 作成日時 | - |
| updatedAt | DateTime | NO | @updatedAt | 更新日時 | - |

#### インデックス
- `isActive`: バッチ処理対象の高速取得
- `lastFetchedAt`: 次回フェッチ対象の判定

#### バッチ処理での使用例

```typescript
// 処理対象のソースを取得
const targetSources = await prisma.rssSource.findMany({
  where: {
    isActive: true,
    OR: [
      { lastFetchedAt: null }, // 未フェッチ
      {
        lastFetchedAt: {
          lt: new Date(Date.now() - fetchIntervalMinutes * 60 * 1000)
        }
      }
    ]
  },
  include: {
    sourceTechnologies: {
      include: {
        technology: true
      }
    }
  }
});
```

#### サンプルデータ

```typescript
{
  feedUrl: "https://dev.to/feed",
  siteUrl: "https://dev.to",
  title: "DEV Community",
  description: "A constructive and inclusive social network for software developers",
  category: "General",
  language: "en",
  isActive: true,
  fetchIntervalMinutes: 60,
}
```

---

### 3.2 RssEntry（RSS記事エントリー）

**テーブル名**: `rss_entries`

#### 概要
RSS/Atomフィードから取得した個々の記事データを保存するテーブル。バッチ処理の主要な登録先です。

#### スキーマ定義

```prisma
model RssEntry {
  id            String    @id @default(cuid())
  sourceId      String    @map("source_id")
  guid          String
  link          String?
  title         String
  description   String?   @db.Text
  contentHtml   String?   @map("content_html") @db.Text
  contentText   String?   @map("content_text") @db.Text
  authorName    String?   @map("author_name")
  language      String?
  imageUrl      String?   @map("image_url")
  publishedAt   DateTime  @map("published_at")
  updatedAt     DateTime  @updatedAt @map("updated_at")
  contentHash   String    @map("content_hash")

  source      RssSource         @relation(fields: [sourceId], references: [id], onDelete: Cascade)
  enclosures  RssEnclosure[]
  hashtags    RssEntryHashtag[]
  feedItems   FeedItem[]

  @@unique([sourceId, guid])
  @@index([publishedAt])
  @@index([sourceId])
  @@map("rss_entries")
}
```

#### フィールド詳細

| フィールド名 | 型 | NULL | デフォルト | 説明 | バッチ処理での用途 |
|------------|-----|------|-----------|------|------------------|
| id | String | NO | cuid() | プライマリキー | エントリー識別 |
| **sourceId** | String | NO | - | **RssSourceのID** | **外部キー** |
| **guid** | String | NO | - | **記事の一意識別子** | **重複チェック** |
| link | String | YES | NULL | 記事のURL | 元記事へのリンク |
| **title** | String | NO | - | **記事タイトル** | **必須フィールド** |
| description | String | YES | NULL | 記事の概要 | 短い説明文 |
| contentHtml | String | YES | NULL | 記事本文（HTML） | リッチコンテンツ |
| contentText | String | YES | NULL | 記事本文（プレーンテキスト） | 検索・表示用 |
| authorName | String | YES | NULL | 著者名 | 表示用 |
| language | String | YES | NULL | 言語コード | フィルタリング |
| imageUrl | String | YES | NULL | サムネイル画像URL | 表示用 |
| **publishedAt** | DateTime | NO | - | **公開日時** | **ソート・フィルタ** |
| updatedAt | DateTime | NO | @updatedAt | 更新日時 | 自動更新 |
| **contentHash** | String | NO | - | **コンテンツのハッシュ値** | **更新判定** |

#### 制約
- **ユニーク制約**: `[sourceId, guid]` - 同一ソース内での重複防止
- **外部キー**: `sourceId` → `RssSource.id` （CASCADE削除）

#### インデックス
- `publishedAt`: 新着順ソート
- `sourceId`: ソース別の記事取得

#### バッチ処理での使用例

```typescript
// 重複チェックと登録/更新
const existingEntry = await prisma.rssEntry.findUnique({
  where: {
    sourceId_guid: {
      sourceId: source.id,
      guid: feedItem.guid,
    }
  }
});

if (existingEntry) {
  // contentHashを比較して更新が必要か判定
  if (existingEntry.contentHash !== newContentHash) {
    await prisma.rssEntry.update({
      where: { id: existingEntry.id },
      data: {
        title: feedItem.title,
        description: feedItem.description,
        contentHtml: feedItem.contentHtml,
        contentText: feedItem.contentText,
        contentHash: newContentHash,
        // publishedAtは更新しない（元の公開日時を保持）
      }
    });
  }
} else {
  // 新規登録
  await prisma.rssEntry.create({
    data: {
      sourceId: source.id,
      guid: feedItem.guid,
      link: feedItem.link,
      title: feedItem.title,
      description: feedItem.description,
      contentHtml: feedItem.contentHtml,
      contentText: feedItem.contentText,
      authorName: feedItem.author,
      language: feedItem.language,
      imageUrl: feedItem.image,
      publishedAt: feedItem.published,
      contentHash: newContentHash,
    }
  });
}
```

#### contentHashの生成例

```typescript
import crypto from 'crypto';

function generateContentHash(content: string): string {
  return crypto
    .createHash('sha256')
    .update(content)
    .digest('hex')
    .substring(0, 32); // 32文字に短縮
}

// 使用例
const contentHash = generateContentHash(
  `${feedItem.title}${feedItem.description}${feedItem.contentText}`
);
```

#### サンプルデータ

```typescript
{
  sourceId: "clx123...",
  guid: "dev-to-react-hooks-guide",
  link: "https://dev.to/example/react-hooks-guide",
  title: "Complete Guide to React Hooks in 2024",
  description: "Learn everything you need to know about React Hooks with practical examples",
  contentText: "React Hooks have revolutionized how we write React components...",
  authorName: "John Developer",
  language: "en",
  imageUrl: "https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=800",
  publishedAt: new Date("2024-01-15T10:00:00Z"),
  contentHash: "a1b2c3d4e5f6...",
}
```

---

### 3.3 RssEnclosure（添付ファイル）

**テーブル名**: `rss_enclosures`

#### 概要
RSS記事に添付された画像や動画などのメディアファイル情報を保存するテーブル。

#### スキーマ定義

```prisma
model RssEnclosure {
  id           String  @id @default(cuid())
  entryId      String  @map("entry_id")
  url          String
  mimeType     String? @map("mime_type")
  length       Int?
  thumbnailUrl String? @map("thumbnail_url")

  entry RssEntry @relation(fields: [entryId], references: [id], onDelete: Cascade)

  @@index([entryId])
  @@map("rss_enclosures")
}
```

#### フィールド詳細

| フィールド名 | 型 | NULL | 説明 | バッチ処理での用途 |
|------------|-----|------|------|------------------|
| id | String | NO | プライマリキー | - |
| entryId | String | NO | RssEntryのID | 外部キー |
| url | String | NO | ファイルURL | メディアファイルの場所 |
| mimeType | String | YES | MIMEタイプ | ファイル種別判定 |
| length | Int | YES | ファイルサイズ（バイト） | - |
| thumbnailUrl | String | YES | サムネイルURL | 表示用 |

#### バッチ処理での使用例

```typescript
// RSSフィードのenclosureタグから取得
if (feedItem.enclosures && feedItem.enclosures.length > 0) {
  await prisma.rssEnclosure.createMany({
    data: feedItem.enclosures.map(enc => ({
      entryId: rssEntry.id,
      url: enc.url,
      mimeType: enc.type,
      length: enc.length,
    }))
  });
}
```

---

### 3.4 Hashtag（ハッシュタグ）

**テーブル名**: `hashtags`

#### 概要
記事に関連付けるハッシュタグのマスターテーブル。

#### スキーマ定義

```prisma
model Hashtag {
  id        String   @id @default(cuid())
  name      String   @unique
  createdAt DateTime @default(now()) @map("created_at")

  postHashtags     PostHashtag[]
  rssEntryHashtags RssEntryHashtag[]

  @@map("hashtags")
}
```

#### フィールド詳細

| フィールド名 | 型 | NULL | 説明 | バッチ処理での用途 |
|------------|-----|------|------|------------------|
| id | String | NO | プライマリキー | - |
| **name** | String | NO | **ハッシュタグ名（ユニーク）** | **重複チェック** |
| createdAt | DateTime | NO | 作成日時 | - |

#### バッチ処理での使用例

```typescript
// ハッシュタグの抽出と登録
const hashtags = extractHashtags(rssEntry.title + ' ' + rssEntry.description);

for (const tagName of hashtags) {
  // 既存のハッシュタグを取得または作成
  const hashtag = await prisma.hashtag.upsert({
    where: { name: tagName },
    update: {},
    create: { name: tagName }
  });
  
  // RssEntryとの関連付け
  await prisma.rssEntryHashtag.create({
    data: {
      entryId: rssEntry.id,
      hashtagId: hashtag.id
    }
  });
}
```

---

### 3.5 RssEntryHashtag（RSS記事とハッシュタグの関連）

**テーブル名**: `rss_entry_hashtags`

#### 概要
RssEntryとHashtagの多対多リレーションを管理する中間テーブル。

#### スキーマ定義

```prisma
model RssEntryHashtag {
  id        String @id @default(cuid())
  entryId   String @map("entry_id")
  hashtagId String @map("hashtag_id")

  entry   RssEntry @relation(fields: [entryId], references: [id], onDelete: Cascade)
  hashtag Hashtag  @relation(fields: [hashtagId], references: [id], onDelete: Cascade)

  @@unique([entryId, hashtagId])
  @@map("rss_entry_hashtags")
}
```

#### フィールド詳細

| フィールド名 | 型 | NULL | 説明 | バッチ処理での用途 |
|------------|-----|------|------|------------------|
| id | String | NO | プライマリキー | - |
| entryId | String | NO | RssEntryのID | 外部キー |
| hashtagId | String | NO | HashtagのID | 外部キー |

#### 制約
- **ユニーク制約**: `[entryId, hashtagId]` - 重複防止

---

### 3.6 Technology（技術スタック）

**テーブル名**: `technologies`

#### 概要
技術スタック（React、Go等）のマスターテーブル。ソースとカテゴリの関連付けに使用。

#### スキーマ定義

```prisma
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
```

#### フィールド詳細

| フィールド名 | 型 | NULL | 説明 |
|------------|-----|------|------|
| id | String | NO | プライマリキー |
| name | String | NO | 技術名（React、Go等） |
| category | String | YES | カテゴリ（Frontend、Backend等） |
| color | String | YES | 表示用カラーコード |
| createdAt | DateTime | NO | 作成日時 |
| updatedAt | DateTime | NO | 更新日時 |

#### サンプルデータ

```typescript
[
  { name: "React", category: "Frontend", color: "#61DAFB" },
  { name: "Next.js", category: "Framework", color: "#000000" },
  { name: "TypeScript", category: "Language", color: "#3178C6" },
  { name: "Node.js", category: "Backend", color: "#339933" },
  { name: "Python", category: "Language", color: "#3776AB" },
  { name: "Go", category: "Language", color: "#00ADD8" },
]
```

---

### 3.7 SourceTechnology（ソースと技術スタックの関連）

**テーブル名**: `source_technologies`

#### 概要
RssSourceとTechnologyの多対多リレーションを管理する中間テーブル。

#### スキーマ定義

```prisma
model SourceTechnology {
  id           String   @id @default(cuid())
  sourceId     String   @map("source_id")
  technologyId String   @map("technology_id")
  createdAt    DateTime @default(now()) @map("created_at")

  source     RssSource  @relation(fields: [sourceId], references: [id], onDelete: Cascade)
  technology Technology @relation(fields: [technologyId], references: [id], onDelete: Cascade)

  @@unique([sourceId, technologyId])
  @@map("source_technologies")
}
```

#### フィールド詳細

| フィールド名 | 型 | NULL | 説明 |
|------------|-----|------|------|
| id | String | NO | プライマリキー |
| sourceId | String | NO | RssSourceのID |
| technologyId | String | NO | TechnologyのID |
| createdAt | DateTime | NO | 作成日時 |

#### 制約
- **ユニーク制約**: `[sourceId, technologyId]` - 重複防止

---

### 3.8 FeedItem（フィード表示用統合アイテム）

**テーブル名**: `feed_items`

#### 概要
RssEntryとユーザー投稿（Post）を統合してフィード表示するためのテーブル。

#### スキーマ定義

```prisma
enum FeedItemType {
  RSS_ENTRY
  POST
}

model FeedItem {
  id           String       @id @default(cuid())
  type         FeedItemType
  rssEntryId   String?      @map("rss_entry_id")
  postId       String?      @map("post_id")
  isPublished  Boolean      @default(true) @map("is_published")
  rankScore    Float        @default(0.0) @map("rank_score")
  publishedAt  DateTime     @map("published_at")
  createdAt    DateTime     @default(now()) @map("created_at")
  updatedAt    DateTime     @updatedAt @map("updated_at")

  rssEntry  RssEntry?  @relation(fields: [rssEntryId], references: [id], onDelete: Cascade)
  post      Post?      @relation(fields: [postId], references: [id], onDelete: Cascade)
  likes     Like[]
  bookmarks Bookmark[]

  @@index([isPublished, publishedAt])
  @@index([rankScore])
  @@map("feed_items")
}
```

#### フィールド詳細

| フィールド名 | 型 | NULL | 説明 | バッチ処理での用途 |
|------------|-----|------|------|------------------|
| id | String | NO | プライマリキー | - |
| **type** | FeedItemType | NO | **アイテムタイプ（RSS_ENTRY/POST）** | **必須指定** |
| rssEntryId | String | YES | RssEntryのID（typeがRSS_ENTRYの場合） | 外部キー |
| postId | String | YES | PostのID（typeがPOSTの場合） | 外部キー |
| isPublished | Boolean | NO | 公開フラグ | 表示制御 |
| rankScore | Float | NO | ランキングスコア | ソート順 |
| **publishedAt** | DateTime | NO | **公開日時** | **ソート基準** |
| createdAt | DateTime | NO | 作成日時 | - |
| updatedAt | DateTime | NO | 更新日時 | - |

#### バッチ処理での使用例

```typescript
// RssEntry登録後にFeedItemを作成
await prisma.feedItem.create({
  data: {
    type: 'RSS_ENTRY',
    rssEntryId: rssEntry.id,
    publishedAt: rssEntry.publishedAt,
    rankScore: calculateRankScore(rssEntry), // ランキングアルゴリズム
    isPublished: true,
  }
});
```

---

### 3.9 RssFetchLog（フェッチログ）

**テーブル名**: `rss_fetch_logs`

#### 概要
RSSフィードのフェッチ処理の実行ログを記録するテーブル。バッチ処理の監視とデバッグに使用。

#### スキーマ定義

```prisma
model RssFetchLog {
  id            String    @id @default(cuid())
  sourceId      String    @map("source_id")
  startedAt     DateTime  @map("started_at")
  finishedAt    DateTime? @map("finished_at")
  httpStatus    Int?      @map("http_status")
  fetchedCount  Int       @default(0) @map("fetched_count")
  insertedCount Int       @default(0) @map("inserted_count")
  updatedCount  Int       @default(0) @map("updated_count")
  durationMs    Int?      @map("duration_ms")
  errorMessage  String?   @map("error_message") @db.Text

  source RssSource @relation(fields: [sourceId], references: [id], onDelete: Cascade)

  @@index([sourceId])
  @@index([startedAt])
  @@map("rss_fetch_logs")
}
```

#### フィールド詳細

| フィールド名 | 型 | NULL | 説明 | バッチ処理での用途 |
|------------|-----|------|------|------------------|
| id | String | NO | プライマリキー | - |
| sourceId | String | NO | RssSourceのID | 外部キー |
| **startedAt** | DateTime | NO | **処理開始日時** | **必須記録** |
| **finishedAt** | DateTime | YES | **処理終了日時** | **処理完了時に記録** |
| httpStatus | Int | YES | HTTPステータスコード | エラー分析 |
| **fetchedCount** | Int | NO | **取得した記事数** | **統計情報** |
| **insertedCount** | Int | NO | **新規登録した記事数** | **統計情報** |
| **updatedCount** | Int | NO | **更新した記事数** | **統計情報** |
| durationMs | Int | YES | 処理時間（ミリ秒） | パフォーマンス分析 |
| **errorMessage** | String | YES | **エラーメッセージ** | **エラー時に記録** |

#### バッチ処理での使用例

```typescript
// フェッチ開始時にログ作成
const fetchLog = await prisma.rssFetchLog.create({
  data: {
    sourceId: source.id,
    startedAt: new Date(),
  }
});

try {
  // フェッチ処理
  const result = await fetchAndProcessFeed(source);
  
  // 成功時にログ更新
  await prisma.rssFetchLog.update({
    where: { id: fetchLog.id },
    data: {
      finishedAt: new Date(),
      httpStatus: result.httpStatus,
      fetchedCount: result.fetchedCount,
      insertedCount: result.insertedCount,
      updatedCount: result.updatedCount,
      durationMs: Date.now() - fetchLog.startedAt.getTime(),
    }
  });
} catch (error) {
  // エラー時にログ更新
  await prisma.rssFetchLog.update({
    where: { id: fetchLog.id },
    data: {
      finishedAt: new Date(),
      errorMessage: error.message,
      durationMs: Date.now() - fetchLog.startedAt.getTime(),
    }
  });
}
```

---

## 4. その他の関連テーブル

### 4.1 Like（いいね）

**テーブル名**: `likes`

```prisma
model Like {
  id         String   @id @default(cuid())
  userId     String   @map("user_id")
  feedItemId String   @map("feed_item_id")
  createdAt  DateTime @default(now()) @map("created_at")

  user     User     @relation(fields: [userId], references: [id], onDelete: Cascade)
  feedItem FeedItem @relation(fields: [feedItemId], references: [id], onDelete: Cascade)

  @@unique([userId, feedItemId])
  @@index([feedItemId])
  @@map("likes")
}
```

### 4.2 Bookmark（ブックマーク）

**テーブル名**: `bookmarks`

```prisma
model Bookmark {
  id         String   @id @default(cuid())
  userId     String   @map("user_id")
  feedItemId String   @map("feed_item_id")
  createdAt  DateTime @default(now()) @map("created_at")

  user     User     @relation(fields: [userId], references: [id], onDelete: Cascade)
  feedItem FeedItem @relation(fields: [feedItemId], references: [id], onDelete: Cascade)

  @@unique([userId, feedItemId])
  @@index([userId])
  @@map("bookmarks")
}
```

### 4.3 Comment（コメント）

**テーブル名**: `comments`

```prisma
model Comment {
  id              String   @id @default(cuid())
  postId          String   @map("post_id")
  userId          String   @map("user_id")
  body            String   @db.Text
  parentCommentId String?  @map("parent_comment_id")
  createdAt       DateTime @default(now()) @map("created_at")
  updatedAt       DateTime @updatedAt @map("updated_at")

  user          User      @relation(fields: [userId], references: [id], onDelete: Cascade)
  post          Post      @relation(fields: [postId], references: [id], onDelete: Cascade)
  parentComment Comment?  @relation("CommentReplies", fields: [parentCommentId], references: [id])
  replies       Comment[] @relation("CommentReplies")

  @@index([postId])
  @@index([userId])
  @@map("comments")
}
```

### 4.4 Post（ユーザー投稿）

**テーブル名**: `posts`

```prisma
enum PostType {
  TEXT
  VIDEO
}

model Post {
  id           String   @id @default(cuid())
  authorId     String   @map("author_id")
  type         PostType @default(TEXT)
  title        String
  body         String?  @db.Text
  videoUrl     String?  @map("video_url")
  thumbnailUrl String?  @map("thumbnail_url")
  createdAt    DateTime @default(now()) @map("created_at")
  updatedAt    DateTime @updatedAt @map("updated_at")

  author   User        @relation(fields: [authorId], references: [id], onDelete: Cascade)
  comments Comment[]
  hashtags PostHashtag[]
  shares   PostShare[]
  feedItems FeedItem[]

  @@index([authorId])
  @@index([createdAt])
  @@map("posts")
}
```

### 4.5 User（ユーザー）

**テーブル名**: `users`

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
```

---

## 5. データフロー図

### 5.1 バッチ処理のデータフロー

```
┌─────────────────┐
│  External RSS   │
│  Feed Sources   │
└────────┬────────┘
         │ fetch
         ▼
┌─────────────────┐      ┌──────────────────┐
│   RssSource     │◄─────│ SourceTechnology │
│  (feed配信元)   │      └──────────────────┘
└────────┬────────┘              │
         │ 1:N                   │ N:1
         ▼                       ▼
┌─────────────────┐      ┌──────────────────┐
│    RssEntry     │      │   Technology     │
│  (記事データ)    │      │  (技術スタック)   │
└────────┬────────┘      └──────────────────┘
         │ 1:N
         ├─────────┐
         ▼         ▼
┌────────────┐  ┌──────────────────┐
│RssEnclosure│  │ RssEntryHashtag  │
│(添付ファイル)│  └────────┬─────────┘
└────────────┘           │ N:1
                         ▼
                  ┌──────────────┐
                  │   Hashtag    │
                  │(ハッシュタグ) │
                  └──────────────┘

┌─────────────────┐
│    RssEntry     │
└────────┬────────┘
         │ 1:1
         ▼
┌─────────────────┐
│    FeedItem     │───┐
│ (フィード表示用) │   │ 1:N
└─────────────────┘   │
                      ├───► Like (いいね)
                      │
                      └───► Bookmark (ブックマーク)

┌─────────────────┐      ┌──────────────────┐
│   RssSource     │──────│  RssFetchLog     │
│                 │ 1:N  │  (フェッチログ)   │
└─────────────────┘      └──────────────────┘
```

### 5.2 記事登録の処理フロー

```
[バッチ処理開始]
       │
       ▼
[RssSource取得]
 - isActive = true
 - 最終フェッチから指定時間経過
       │
       ▼
[各ソースに対して]
       │
       ├─► [RssFetchLog作成] (startedAt記録)
       │
       ▼
[RSS/Atomフィード取得]
 - HTTPリクエスト
 - ETag/Last-Modifiedヘッダー送信
       │
       ▼
[フィードパース]
 - XMLパース
 - 各エントリー抽出
       │
       ▼
[各エントリーに対して]
       │
       ├─► [重複チェック]
       │    - sourceId + guid で検索
       │    │
       │    ├─► [既存あり]
       │    │    - contentHash比較
       │    │    - 変更あれば更新
       │    │
       │    └─► [既存なし]
       │         - RssEntry作成
       │         - contentHash生成
       │
       ├─► [RssEnclosure作成]
       │    - 添付ファイル情報
       │
       ├─► [Hashtag処理]
       │    - タイトル・本文から抽出
       │    - Hashtag upsert
       │    - RssEntryHashtag作成
       │
       └─► [FeedItem作成]
            - type = RSS_ENTRY
            - rankScore計算
            - publishedAt設定
       │
       ▼
[RssSource更新]
 - lastFetchedAt更新
 - etag/lastModified更新
       │
       ▼
[RssFetchLog更新]
 - finishedAt記録
 - 統計情報記録
 - エラー情報記録（エラー時）
       │
       ▼
[バッチ処理終了]
```

---

## 6. バッチ処理実装のポイント

### 6.1 重複防止

#### RssEntry
- **ユニーク制約**: `[sourceId, guid]`
- **実装方法**: `findUnique` → `create` or `update`

```typescript
const existingEntry = await prisma.rssEntry.findUnique({
  where: {
    sourceId_guid: {
      sourceId: source.id,
      guid: entry.guid,
    }
  }
});
```

#### Hashtag
- **ユニーク制約**: `name`
- **実装方法**: `upsert`

```typescript
const hashtag = await prisma.hashtag.upsert({
  where: { name: tagName },
  update: {},
  create: { name: tagName }
});
```

### 6.2 トランザクション処理

複数のテーブルへの登録は、トランザクションでまとめて処理します。

```typescript
await prisma.$transaction(async (tx) => {
  // RssEntry作成
  const rssEntry = await tx.rssEntry.create({ data: entryData });
  
  // RssEnclosure作成
  if (enclosures.length > 0) {
    await tx.rssEnclosure.createMany({
      data: enclosures.map(enc => ({ entryId: rssEntry.id, ...enc }))
    });
  }
  
  // Hashtag関連付け
  for (const tag of hashtags) {
    const hashtag = await tx.hashtag.upsert({
      where: { name: tag },
      update: {},
      create: { name: tag }
    });
    
    await tx.rssEntryHashtag.create({
      data: { entryId: rssEntry.id, hashtagId: hashtag.id }
    });
  }
  
  // FeedItem作成
  await tx.feedItem.create({
    data: {
      type: 'RSS_ENTRY',
      rssEntryId: rssEntry.id,
      publishedAt: rssEntry.publishedAt,
      rankScore: calculateRankScore(rssEntry),
    }
  });
});
```

### 6.3 エラーハンドリング

```typescript
const fetchLog = await prisma.rssFetchLog.create({
  data: { sourceId: source.id, startedAt: new Date() }
});

try {
  // フェッチ処理
  const result = await fetchAndProcess(source);
  
  // 成功時の更新
  await prisma.rssFetchLog.update({
    where: { id: fetchLog.id },
    data: {
      finishedAt: new Date(),
      httpStatus: result.status,
      fetchedCount: result.fetched,
      insertedCount: result.inserted,
      updatedCount: result.updated,
      durationMs: result.duration,
    }
  });
  
  // RssSource更新
  await prisma.rssSource.update({
    where: { id: source.id },
    data: {
      lastFetchedAt: new Date(),
      etag: result.etag,
      lastModified: result.lastModified,
    }
  });
  
} catch (error) {
  // エラー時の更新
  await prisma.rssFetchLog.update({
    where: { id: fetchLog.id },
    data: {
      finishedAt: new Date(),
      errorMessage: error.message,
      durationMs: Date.now() - fetchLog.startedAt.getTime(),
    }
  });
  
  console.error(`Failed to fetch ${source.feedUrl}:`, error);
}
```

### 6.4 パフォーマンス最適化

#### バッチ登録
複数件の登録は `createMany` を使用します。

```typescript
await prisma.rssEnclosure.createMany({
  data: enclosures,
  skipDuplicates: true, // 重複をスキップ
});
```

#### 並列処理
複数のソースを並列で処理します。

```typescript
const sources = await prisma.rssSource.findMany({
  where: { isActive: true }
});

// 並列処理（同時実行数を制限）
const CONCURRENCY = 5;
for (let i = 0; i < sources.length; i += CONCURRENCY) {
  const batch = sources.slice(i, i + CONCURRENCY);
  await Promise.all(batch.map(source => fetchAndProcess(source)));
}
```

#### インデックスの活用
- `RssSource.isActive` + `RssSource.lastFetchedAt` でフェッチ対象を高速検索
- `RssEntry.sourceId` + `RssEntry.guid` で重複チェックを高速化
- `FeedItem.isPublished` + `FeedItem.publishedAt` でフィード表示を高速化

### 6.5 差分取得の最適化

HTTPヘッダーを使った条件付きリクエスト：

```typescript
const headers: Record<string, string> = {};

if (source.etag) {
  headers['If-None-Match'] = source.etag;
}

if (source.lastModified) {
  headers['If-Modified-Since'] = source.lastModified;
}

const response = await fetch(source.feedUrl, { headers });

if (response.status === 304) {
  // 変更なし
  return { modified: false };
}

// 新しいETag/Last-Modifiedを保存
const newEtag = response.headers.get('etag');
const newLastModified = response.headers.get('last-modified');
```

---

## 7. バッチ処理の実装例

### 7.1 基本構造

```typescript
// batch/fetch-rss-feeds.ts

import { PrismaClient } from '@prisma/client';
import Parser from 'rss-parser';

const prisma = new PrismaClient();
const parser = new Parser();

async function fetchRssFeeds() {
  console.log('🚀 RSS フィード取得バッチを開始します');
  
  // 処理対象のソースを取得
  const sources = await prisma.rssSource.findMany({
    where: {
      isActive: true,
      OR: [
        { lastFetchedAt: null },
        {
          lastFetchedAt: {
            lt: new Date(Date.now() - 60 * 60 * 1000) // 1時間以上前
          }
        }
      ]
    },
    include: {
      sourceTechnologies: {
        include: {
          technology: true
        }
      }
    }
  });
  
  console.log(`📡 処理対象: ${sources.length}件のソース`);
  
  // 各ソースを処理
  let successCount = 0;
  let errorCount = 0;
  
  for (const source of sources) {
    try {
      await processFeedSource(source);
      successCount++;
    } catch (error) {
      console.error(`❌ ${source.title} の処理に失敗:`, error);
      errorCount++;
    }
  }
  
  console.log('✅ バッチ処理完了');
  console.log(`   成功: ${successCount}件`);
  console.log(`   失敗: ${errorCount}件`);
}

async function processFeedSource(source: any) {
  const startTime = Date.now();
  
  // フェッチログ作成
  const fetchLog = await prisma.rssFetchLog.create({
    data: {
      sourceId: source.id,
      startedAt: new Date(),
    }
  });
  
  try {
    // RSSフィード取得
    const feed = await parser.parseURL(source.feedUrl);
    
    let insertedCount = 0;
    let updatedCount = 0;
    
    // 各エントリーを処理
    for (const item of feed.items) {
      const result = await processEntry(source, item);
      if (result === 'inserted') insertedCount++;
      if (result === 'updated') updatedCount++;
    }
    
    // 成功時の更新
    await prisma.$transaction([
      prisma.rssFetchLog.update({
        where: { id: fetchLog.id },
        data: {
          finishedAt: new Date(),
          httpStatus: 200,
          fetchedCount: feed.items.length,
          insertedCount,
          updatedCount,
          durationMs: Date.now() - startTime,
        }
      }),
      prisma.rssSource.update({
        where: { id: source.id },
        data: {
          lastFetchedAt: new Date(),
        }
      })
    ]);
    
    console.log(`✅ ${source.title}: ${insertedCount}件登録, ${updatedCount}件更新`);
    
  } catch (error) {
    // エラー時の更新
    await prisma.rssFetchLog.update({
      where: { id: fetchLog.id },
      data: {
        finishedAt: new Date(),
        errorMessage: error.message,
        durationMs: Date.now() - startTime,
      }
    });
    
    throw error;
  }
}

async function processEntry(source: any, item: any): Promise<'inserted' | 'updated' | 'skipped'> {
  const guid = item.guid || item.id || item.link;
  if (!guid) {
    console.warn('⚠️  GUID がないエントリーをスキップ');
    return 'skipped';
  }
  
  // contentHash生成
  const contentHash = generateContentHash(
    `${item.title}${item.contentSnippet || item.content}`
  );
  
  // 既存チェック
  const existing = await prisma.rssEntry.findUnique({
    where: {
      sourceId_guid: {
        sourceId: source.id,
        guid,
      }
    }
  });
  
  if (existing) {
    // 更新判定
    if (existing.contentHash !== contentHash) {
      await prisma.rssEntry.update({
        where: { id: existing.id },
        data: {
          title: item.title,
          description: item.contentSnippet,
          contentHtml: item.content,
          contentText: stripHtml(item.content),
          contentHash,
        }
      });
      return 'updated';
    }
    return 'skipped';
  }
  
  // 新規登録
  await prisma.$transaction(async (tx) => {
    // RssEntry作成
    const rssEntry = await tx.rssEntry.create({
      data: {
        sourceId: source.id,
        guid,
        link: item.link,
        title: item.title,
        description: item.contentSnippet,
        contentHtml: item.content,
        contentText: stripHtml(item.content),
        authorName: item.creator || item.author,
        imageUrl: item.enclosure?.url,
        publishedAt: item.pubDate ? new Date(item.pubDate) : new Date(),
        contentHash,
      }
    });
    
    // ハッシュタグ処理
    const hashtags = extractHashtags(item.title + ' ' + item.contentSnippet);
    for (const tagName of hashtags) {
      const hashtag = await tx.hashtag.upsert({
        where: { name: tagName },
        update: {},
        create: { name: tagName }
      });
      
      await tx.rssEntryHashtag.create({
        data: {
          entryId: rssEntry.id,
          hashtagId: hashtag.id
        }
      });
    }
    
    // FeedItem作成
    await tx.feedItem.create({
      data: {
        type: 'RSS_ENTRY',
        rssEntryId: rssEntry.id,
        publishedAt: rssEntry.publishedAt,
        rankScore: 0.5, // デフォルトスコア
        isPublished: true,
      }
    });
  });
  
  return 'inserted';
}

// ユーティリティ関数
function generateContentHash(content: string): string {
  const crypto = require('crypto');
  return crypto.createHash('sha256').update(content).digest('hex').substring(0, 32);
}

function stripHtml(html: string): string {
  return html.replace(/<[^>]*>/g, '').trim();
}

function extractHashtags(text: string): string[] {
  const matches = text.match(/#[\w]+/g) || [];
  return [...new Set(matches.map(tag => tag.substring(1).toLowerCase()))];
}

// 実行
fetchRssFeeds()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
```

### 7.2 実行方法

#### package.jsonにスクリプト追加

```json
{
  "scripts": {
    "batch:fetch-rss": "tsx batch/fetch-rss-feeds.ts"
  }
}
```

#### 手動実行

```bash
pnpm batch:fetch-rss
```

#### Cron実行（本番環境）

```bash
# 毎時0分に実行
0 * * * * cd /path/to/tech-tok && pnpm batch:fetch-rss >> /var/log/rss-batch.log 2>&1
```

---

## 8. 監視とメンテナンス

### 8.1 ログ分析

```typescript
// 最近のフェッチログを確認
const recentLogs = await prisma.rssFetchLog.findMany({
  where: {
    startedAt: {
      gte: new Date(Date.now() - 24 * 60 * 60 * 1000) // 過去24時間
    }
  },
  include: {
    source: true
  },
  orderBy: {
    startedAt: 'desc'
  }
});

// 統計情報
const stats = {
  total: recentLogs.length,
  success: recentLogs.filter(log => !log.errorMessage).length,
  error: recentLogs.filter(log => log.errorMessage).length,
  totalFetched: recentLogs.reduce((sum, log) => sum + log.fetchedCount, 0),
  totalInserted: recentLogs.reduce((sum, log) => sum + log.insertedCount, 0),
  averageDuration: recentLogs.reduce((sum, log) => sum + (log.durationMs || 0), 0) / recentLogs.length,
};
```

### 8.2 エラー検知

```typescript
// エラーが多発しているソースを検知
const errorSources = await prisma.rssSource.findMany({
  where: {
    fetchLogs: {
      some: {
        startedAt: {
          gte: new Date(Date.now() - 24 * 60 * 60 * 1000)
        },
        errorMessage: {
          not: null
        }
      }
    }
  },
  include: {
    fetchLogs: {
      where: {
        startedAt: {
          gte: new Date(Date.now() - 24 * 60 * 60 * 1000)
        }
      },
      orderBy: {
        startedAt: 'desc'
      }
    }
  }
});
```

### 8.3 データクリーンアップ

```typescript
// 古いフェッチログの削除（30日以上前）
await prisma.rssFetchLog.deleteMany({
  where: {
    startedAt: {
      lt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)
    }
  }
});
```

---

## 9. 注意事項とベストプラクティス

### 9.1 データ整合性

- **トランザクション**: 関連する複数テーブルへの書き込みは必ずトランザクションで包む
- **外部キー制約**: 削除時のカスケード動作を理解する
- **ユニーク制約**: 重複防止のために適切に設定する

### 9.2 パフォーマンス

- **インデックス**: 検索条件に使用するカラムにインデックスを設定
- **バッチサイズ**: 一度に処理する件数を制限する
- **並列処理**: 複数ソースを並列処理する際は同時実行数を制限

### 9.3 エラーハンドリング

- **リトライ**: 一時的なネットワークエラーはリトライする
- **ログ記録**: 全ての処理をRssFetchLogに記録する
- **通知**: 連続してエラーが発生する場合は通知する

### 9.4 セキュリティ

- **入力検証**: 外部から取得したデータは必ず検証する
- **XSS対策**: HTMLコンテンツはサニタイズする
- **レート制限**: 外部APIへのアクセスはレート制限を守る

---

## 10. 付録

### 10.1 RSSパーサーライブラリ

推奨ライブラリ：`rss-parser`

```bash
pnpm add rss-parser
pnpm add -D @types/rss-parser
```

### 10.2 関連ドキュメント

- [Prismaスキーマファイル](../prisma/schema.prisma)
- [シードデータ仕様書](./seed-data-specification.md)
- [Prisma設計ドキュメント](./prisma-design-document.md)
- [Prisma実装計画書](./prisma-implementation-plan.md)

### 10.3 参考情報

- [Prisma公式ドキュメント](https://www.prisma.io/docs)
- [RSS 2.0仕様](https://www.rssboard.org/rss-specification)
- [Atom仕様](https://datatracker.ietf.org/doc/html/rfc4287)

---

**作成日**: 2025-11-08  
**更新日**: 2025-11-08  
**バージョン**: 1.0  
**作成者**: AI Assistant

