# 技術タグの保持戦略

## 現在の設計状況

### 関連テーブル

現在のデータベースには以下のテーブルが存在します：

1. **`technologies`** - 技術スタックのマスターデータ（React, TypeScript等）
2. **`hashtags`** - ハッシュタグのマスターデータ
3. **`source_technologies`** - RSSソースレベルの技術関連付け（`rss_sources` ↔ `technologies`）
4. **`rss_entry_hashtags`** - RSS記事レベルのハッシュタグ関連付け（`rss_entries` ↔ `hashtags`）
5. **`post_hashtags`** - ユーザー投稿のハッシュタグ関連付け（`posts` ↔ `hashtags`）
6. **`user_technologies`** - ユーザーの技術スタック関連付け（`users` ↔ `technologies`）

### 現在の実装状況

**フィード取得時のカテゴリー表示**（`src/features/feed/types/article.ts`）：
- **RSS記事**: `source_technologies` → `technologies` を使用（ソースレベル）
- **ユーザー投稿**: `post_hashtags` → `hashtags` を使用

### 問題点

1. **二重管理**: `technologies` と `hashtags` が分離していて管理が複雑
2. **粒度の不一致**: RSS記事は「ソースレベル」、投稿は「記事レベル」で管理
3. **データの不整合**: 同じ技術（例: "React"）が `technologies` と `hashtags` の両方に存在する可能性
4. **フィルタリングの複雑さ**: カテゴリーフィルタで両方のテーブルを考慮する必要がある

---

## 推奨設計パターン

### ✅ パターンA: 統一マスターテーブル方式（推奨）

**概要**: `technologies` テーブルに統一し、全ての技術タグを一元管理

#### 構造

```
technologies (マスター)
    ↓
├─ source_technologies (RSS ソース ↔ 技術)
├─ rss_entry_technologies (RSS 記事 ↔ 技術) ← 新規作成
├─ post_technologies (投稿 ↔ 技術) ← post_hashtags を置き換え
└─ user_technologies (ユーザー ↔ 技術) ← 既存
```

#### テーブル設計

##### `technologies` テーブル（既存を拡張）

```prisma
model Technology {
  id        String   @id @default(cuid())
  name      String   @unique  // ← ユニーク制約を追加
  slug      String   @unique  // URL friendly な識別子（例: "react", "typescript"）
  category  String?  // 技術カテゴリー（例: "フロントエンド", "バックエンド"）
  color     String?  // 表示用カラーコード
  icon      String?  // アイコンURL
  description String? @db.Text  // 説明文
  isOfficial Boolean @default(true) @map("is_official") // 公式タグかユーザー作成か
  usageCount Int @default(0) @map("usage_count") // 使用回数（人気度）
  createdAt DateTime @default(now()) @map("created_at")
  updatedAt DateTime @updatedAt @map("updated_at")

  // リレーション
  userTechnologies      UserTechnology[]
  sourceTechnologies    SourceTechnology[]
  rssEntryTechnologies  RssEntryTechnology[]  // 新規
  postTechnologies      PostTechnology[]       // 新規

  @@index([slug])
  @@index([category])
  @@index([usageCount]) // 人気順ソート用
  @@map("technologies")
}
```

##### `rss_entry_technologies` テーブル（新規作成）

```prisma
model RssEntryTechnology {
  id           String   @id @default(cuid())
  entryId      String   @map("entry_id")
  technologyId String   @map("technology_id")
  createdAt    DateTime @default(now()) @map("created_at")

  entry      RssEntry   @relation(fields: [entryId], references: [id], onDelete: Cascade)
  technology Technology @relation(fields: [technologyId], references: [id], onDelete: Cascade)

  @@unique([entryId, technologyId])
  @@index([entryId])
  @@index([technologyId])
  @@map("rss_entry_technologies")
}
```

##### `post_technologies` テーブル（post_hashtags を置き換え）

```prisma
model PostTechnology {
  id           String   @id @default(cuid())
  postId       String   @map("post_id")
  technologyId String   @map("technology_id")
  createdAt    DateTime @default(now()) @map("created_at")

  post       Post       @relation(fields: [postId], references: [id], onDelete: Cascade)
  technology Technology @relation(fields: [technologyId], references: [id], onDelete: Cascade)

  @@unique([postId, technologyId])
  @@index([postId])
  @@index([technologyId])
  @@map("post_technologies")
}
```

#### メリット

✅ **一元管理**: 技術タグが1つのテーブルで管理され、データの整合性が保たれる  
✅ **柔軟な粒度**: ソースレベルと記事レベルの両方で技術タグを付与可能  
✅ **シンプルなフィルタリング**: カテゴリーフィルタが統一的に実装できる  
✅ **統計情報の取得**: 技術ごとの使用回数や人気度を簡単に集計できる  
✅ **拡張性**: 新しいエンティティ（動画、チュートリアル等）への対応が容易  

#### デメリット

⚠️ **マイグレーション必要**: 既存の `hashtags` データを `technologies` に移行する必要がある  
⚠️ **タグの自由度低下**: ユーザーが自由にハッシュタグを作成できない（管理された技術タグのみ）  

---

### パターンB: 階層的ハイブリッド方式

**概要**: `technologies`（公式）と `hashtags`（フリータグ）を併用

#### 構造

```
technologies (公式技術タグ)
    ↓
├─ source_technologies
├─ rss_entry_technologies
├─ post_technologies
└─ user_technologies

hashtags (フリータグ)
    ↓
├─ rss_entry_hashtags
└─ post_hashtags
```

#### 特徴

- **公式タグ**: React, TypeScript等の主要技術は `technologies` で管理
- **フリータグ**: ユーザーが自由に作成できるタグは `hashtags` で管理
- **両方の関連付け**: 1つの記事に公式タグとフリータグの両方を付与可能

#### メリット

✅ **柔軟性**: 公式タグによる構造化とフリータグによる自由度を両立  
✅ **段階的移行**: 既存の `hashtags` を残したまま `technologies` を拡張可能  
✅ **SEO対策**: 公式タグでカテゴリー構造を作り、フリータグで詳細情報を補完  

#### デメリット

⚠️ **複雑性**: 2つのタグシステムを管理する必要がある  
⚠️ **重複リスク**: 同じ技術が両方に存在する可能性  
⚠️ **フィルタリングの複雑化**: 両方を考慮したクエリが必要  

---

### パターンC: 記事レベルのみ方式（最もシンプル）

**概要**: ソースレベルの関連付けを廃止し、記事レベルのみで管理

#### 構造

```
technologies (マスター)
    ↓
├─ rss_entry_technologies (RSS記事 ↔ 技術)
├─ post_technologies (投稿 ↔ 技術)
└─ user_technologies (ユーザー ↔ 技術)

※ source_technologies は削除
```

#### 特徴

- RSSソースレベルの `source_technologies` を削除
- 全ての技術タグは記事レベルで付与
- RSS取得時に記事ごとに技術タグを自動判定・付与

#### メリット

✅ **粒度の統一**: 全てが記事レベルで管理される  
✅ **正確性**: 記事ごとに適切な技術タグを付与できる  
✅ **柔軟性**: 1つのRSSソースから複数の技術に関する記事を取得可能  

#### デメリット

⚠️ **自動タグ付けの実装**: RSS記事から技術タグを自動判定するロジックが必要  
⚠️ **パフォーマンス**: 記事数が多い場合、JOIN処理が重くなる可能性  

---

## 推奨: パターンAの実装

### 理由

1. **データの一貫性**: 技術タグが1つのマスターテーブルで管理される
2. **拡張性**: 新しいエンティティへの対応が容易
3. **ユーザー体験**: 統一されたカテゴリーフィルタリングが可能
4. **保守性**: シンプルな設計で理解・メンテナンスしやすい

### 実装ステップ

#### ステップ1: マイグレーション準備

```typescript
// scripts/migrate-hashtags-to-technologies.ts

// 1. hashtags の内容を technologies にマージ
// 2. post_hashtags を post_technologies に変換
// 3. rss_entry_hashtags を rss_entry_technologies に変換
```

#### ステップ2: スキーマ更新

```prisma
// prisma/schema.prisma

// Technology モデルを拡張
model Technology {
  id          String   @id @default(cuid())
  name        String   @unique
  slug        String   @unique
  category    String?
  color       String?
  isOfficial  Boolean  @default(true) @map("is_official")
  usageCount  Int      @default(0) @map("usage_count")
  createdAt   DateTime @default(now()) @map("created_at")
  updatedAt   DateTime @updatedAt @map("updated_at")

  userTechnologies     UserTechnology[]
  sourceTechnologies   SourceTechnology[]
  rssEntryTechnologies RssEntryTechnology[]
  postTechnologies     PostTechnology[]

  @@index([slug])
  @@index([usageCount])
  @@map("technologies")
}

// 新規: RssEntry と Technology の中間テーブル
model RssEntryTechnology {
  id           String   @id @default(cuid())
  entryId      String   @map("entry_id")
  technologyId String   @map("technology_id")
  createdAt    DateTime @default(now()) @map("created_at")

  entry      RssEntry   @relation(fields: [entryId], references: [id], onDelete: Cascade)
  technology Technology @relation(fields: [technologyId], references: [id], onDelete: Cascade)

  @@unique([entryId, technologyId])
  @@index([entryId])
  @@index([technologyId])
  @@map("rss_entry_technologies")
}

// 新規: Post と Technology の中間テーブル
model PostTechnology {
  id           String   @id @default(cuid())
  postId       String   @map("post_id")
  technologyId String   @map("technology_id")
  createdAt    DateTime @default(now()) @map("created_at")

  post       Post       @relation(fields: [postId], references: [id], onDelete: Cascade)
  technology Technology @relation(fields: [technologyId], references: [id], onDelete: Cascade)

  @@unique([postId, technologyId])
  @@index([postId])
  @@index([technologyId])
  @@map("post_technologies")
}

// RssEntry モデルを更新
model RssEntry {
  // ... 既存のフィールド ...
  
  source       RssSource              @relation(...)
  enclosures   RssEnclosure[]
  technologies RssEntryTechnology[]   // 変更: hashtags から technologies へ
  feedItems    FeedItem[]
}

// Post モデルを更新
model Post {
  // ... 既存のフィールド ...
  
  author       User             @relation(...)
  comments     Comment[]
  technologies PostTechnology[] // 変更: hashtags から technologies へ
  shares       PostShare[]
  feedItems    FeedItem[]
}
```

#### ステップ3: データ変換関数を更新

```typescript
// src/features/feed/types/article.ts

export function rssEntryToArticle(
  feedItem: FeedItemWithRelations,
  entry: NonNullable<FeedItemWithRelations["rssEntry"]>,
  userId?: string,
  userLikes?: Set<string>,
  userBookmarks?: Set<string>,
): Article {
  // 技術タグを取得（記事レベル優先、フォールバックでソースレベル）
  const categories: Category[] = entry.technologies?.length > 0
    ? entry.technologies.map((et) => ({
        id: et.technology.id,
        name: et.technology.name,
        color: et.technology.color,
      }))
    : entry.source.sourceTechnologies.map((st) => ({
        id: st.technology.id,
        name: st.technology.name,
        color: st.technology.color,
      }));

  return {
    id: feedItem.id,
    type: "rss",
    title: entry.title,
    content: entry.contentText || entry.description || "",
    authorName: entry.authorName || entry.source.title || "Unknown",
    authorAvatar: entry.imageUrl || undefined,
    originalUrl: entry.link || undefined,
    publishedAt: entry.publishedAt,
    likeCount: 0,
    commentCount: 0,
    shareCount: 0,
    isLiked: userId ? userLikes?.has(feedItem.id) || false : false,
    isBookmarked: userId ? userBookmarks?.has(feedItem.id) || false : false,
    categories,
  };
}

export function postToArticle(
  feedItem: FeedItemWithRelations,
  post: NonNullable<FeedItemWithRelations["post"]>,
  userId?: string,
  userLikes?: Set<string>,
  userBookmarks?: Set<string>,
): Article {
  const categories: Category[] = post.technologies.map((pt) => ({
    id: pt.technology.id,
    name: pt.technology.name,
    color: pt.technology.color,
  }));

  return {
    id: feedItem.id,
    type: "post",
    title: post.title,
    content: post.body || "",
    authorName: post.author.displayName || post.author.name || "Unknown",
    authorAvatar: post.author.image || undefined,
    originalUrl: undefined,
    publishedAt: post.createdAt,
    likeCount: 0,
    commentCount: 0,
    shareCount: 0,
    isLiked: userId ? userLikes?.has(feedItem.id) || false : false,
    isBookmarked: userId ? userBookmarks?.has(feedItem.id) || false : false,
    categories,
  };
}
```

#### ステップ4: フィード取得クエリを更新

```typescript
// src/app/actions/feed.ts

export async function getFeedArticles(
  params: GetFeedArticlesParams = {},
): Promise<GetFeedArticlesResult> {
  const { cursor, categoryId, limit = 10 } = params;

  const feedItems = await prisma.feedItem.findMany({
    where: {
      isPublished: true,
      ...(cursor && { id: { lt: cursor } }),
      // カテゴリーフィルター（統一化）
      ...(categoryId && {
        OR: [
          {
            rssEntry: {
              OR: [
                // 記事レベルの技術タグ
                {
                  technologies: {
                    some: { technologyId: categoryId },
                  },
                },
                // ソースレベルの技術タグ（フォールバック）
                {
                  source: {
                    sourceTechnologies: {
                      some: { technologyId: categoryId },
                    },
                  },
                },
              ],
            },
          },
          {
            post: {
              technologies: {
                some: { technologyId: categoryId },
              },
            },
          },
        ],
      }),
    },
    include: {
      rssEntry: {
        include: {
          technologies: {
            include: { technology: true },
          },
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
          technologies: {
            include: { technology: true },
          },
        },
      },
    },
    orderBy: { publishedAt: "desc" },
    take: limit + 1,
  });

  // ... 残りの処理
}
```

---

## 粒度の選択: ソースレベル vs 記事レベル

### RSSソースレベル（`source_technologies`）

**使用ケース**:
- RSSソース全体が特定の技術に関するもの（例: React公式ブログ）
- 全記事に共通の技術タグを自動付与したい
- RSS取得時の処理を軽量化したい

**メリット**:
- 設定が簡単（ソースごとに1回設定すればOK）
- パフォーマンスが良い（記事ごとのタグ付け不要）

**デメリット**:
- 粒度が粗い（全記事に同じタグが付く）
- 複数技術を扱うソースには不向き

### RSS記事レベル（`rss_entry_technologies`）

**使用ケース**:
- 記事ごとに異なる技術を扱うRSSソース（例: Qiitaトレンド）
- より正確なカテゴリーフィルタリングを提供したい
- NLPによる自動タグ付けを実装する予定

**メリット**:
- 正確性が高い（記事ごとに適切なタグ）
- ユーザー投稿と同じ粒度で管理できる

**デメリット**:
- 自動タグ付けロジックの実装が必要
- 処理コストが高い

### 推奨: ハイブリッド運用

**両方を使い分ける**:

1. **ソースレベル**: デフォルトのタグとして設定
2. **記事レベル**: 記事固有のタグとして追加設定
3. **表示時**: 記事レベル優先、なければソースレベルを使用

```typescript
// 優先順位付きで取得
const categories = 
  entry.technologies?.length > 0  // 記事レベル（優先）
    ? entry.technologies.map(...)
    : entry.source.sourceTechnologies.map(...); // ソースレベル（フォールバック）
```

---

## まとめ

### 最終推奨

**✅ パターンA（統一マスターテーブル方式）+ ハイブリッド粒度運用**

#### 採用理由

1. **データの一貫性**: 全ての技術タグを `technologies` テーブルで一元管理
2. **柔軟な粒度**: ソースレベルと記事レベルの両方を活用
3. **シンプルなUI**: ユーザーは統一されたカテゴリーでフィルタリング可能
4. **拡張性**: 将来的な機能追加（動画、チュートリアル等）に対応しやすい
5. **段階的実装**: まずソースレベルで運用し、徐々に記事レベルの自動タグ付けを実装

#### 実装優先順位

**Phase 1** (即座に実装可能):
- `technologies` テーブルに `name` のユニーク制約を追加
- 既存の `hashtags` データを `technologies` にマージ
- `post_technologies` テーブルを作成し、`post_hashtags` を移行

**Phase 2** (将来実装):
- `rss_entry_technologies` テーブルを作成
- RSS記事から技術タグを自動判定するロジックを実装（NLP/キーワードマッチング）
- 記事レベル優先のタグ表示ロジックを実装

**Phase 3** (さらなる最適化):
- ユーザーによる手動タグ修正機能
- タグの人気度・使用回数による並び替え
- 関連技術の推薦機能

---

## 関連ファイル

- **スキーマ**: `prisma/schema.prisma`
- **マイグレーション**: `prisma/migrations/`
- **型定義**: `src/features/feed/types/article.ts`
- **Server Actions**: `src/app/actions/feed.ts`
- **コンポーネント**: `src/features/feed/components/article-card.tsx`

