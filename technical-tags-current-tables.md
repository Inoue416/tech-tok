# 既存テーブルを使った技術タグ管理戦略

## 現状の利用可能なテーブル

現在のデータベースには以下のテーブルが**既に存在**しています：

### マスターテーブル

1. **`technologies`** - 技術スタックのマスターデータ
   - カラム: `id`, `name`, `category`, `color`, `created_at`, `updated_at`

2. **`hashtags`** - ハッシュタグのマスターデータ
   - カラム: `id`, `name` (unique), `created_at`

### 中間テーブル（関連付け）

3. **`source_technologies`** - RSSソース ↔ 技術
   - カラム: `id`, `source_id`, `technology_id`, `created_at`

4. **`rss_entry_hashtags`** - RSS記事 ↔ ハッシュタグ
   - カラム: `id`, `entry_id`, `hashtag_id`

5. **`post_hashtags`** - 投稿 ↔ ハッシュタグ
   - カラム: `id`, `post_id`, `hashtag_id`

6. **`user_technologies`** - ユーザー ↔ 技術
   - カラム: `id`, `user_id`, `technology_id`, `created_at`

---

## ✅ 方法1: 現状のまま使用（最も簡単）

### 概要

**新しいテーブルは作成せず**、既存のテーブルをそのまま使用する方法です。

### 構造

```
[RSSソース]
   ↓
source_technologies → technologies
   ↓
表示: ソースレベルの技術タグ

[RSS記事]
   ↓
rss_entry_hashtags → hashtags
   ↓
表示: 記事レベルのハッシュタグ

[ユーザー投稿]
   ↓
post_hashtags → hashtags
   ↓
表示: 投稿レベルのハッシュタグ
```

### 実装方法

#### Article型の変換ロジック（RSS記事）

```typescript
// src/features/feed/types/article.ts

export function rssEntryToArticle(
  feedItem: FeedItemWithRelations,
  entry: NonNullable<FeedItemWithRelations["rssEntry"]>,
  userId?: string,
  userLikes?: Set<string>,
  userBookmarks?: Set<string>,
): Article {
  // ソースレベルの技術タグを使用
  const sourceTags: Category[] = 
    entry.source.sourceTechnologies.map((st) => ({
      id: st.technology.id,
      name: st.technology.name,
      color: st.technology.color,
    }));

  // 記事レベルのハッシュタグを使用（既存）
  const entryTags: Category[] = 
    entry.hashtags?.map((eh) => ({
      id: eh.hashtag.id,
      name: eh.hashtag.name,
      color: null, // hashtagsテーブルにはcolorカラムがない
    })) || [];

  // 両方を結合（重複排除）
  const allTags = [...sourceTags, ...entryTags];
  const uniqueTags = Array.from(
    new Map(allTags.map(tag => [tag.id, tag])).values()
  );

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
    categories: uniqueTags, // 結合した技術タグ
  };
}
```

#### Article型の変換ロジック（ユーザー投稿）

```typescript
export function postToArticle(
  feedItem: FeedItemWithRelations,
  post: NonNullable<FeedItemWithRelations["post"]>,
  userId?: string,
  userLikes?: Set<string>,
  userBookmarks?: Set<string>,
): Article {
  // ハッシュタグを使用（既存）
  const categories: Category[] = 
    post.hashtags.map((ph) => ({
      id: ph.hashtag.id,
      name: ph.hashtag.name,
      color: null,
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

#### フィード取得クエリ（既存テーブル使用）

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
      // カテゴリーフィルター（既存テーブルのみ使用）
      ...(categoryId && {
        OR: [
          // RSS記事: ソースレベルの技術タグでフィルタ
          {
            rssEntry: {
              source: {
                sourceTechnologies: {
                  some: { technologyId: categoryId },
                },
              },
            },
          },
          // RSS記事: 記事レベルのハッシュタグでフィルタ
          {
            rssEntry: {
              hashtags: {
                some: { hashtagId: categoryId },
              },
            },
          },
          // ユーザー投稿: ハッシュタグでフィルタ
          {
            post: {
              hashtags: {
                some: { hashtagId: categoryId },
              },
            },
          },
        ],
      }),
    },
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
          hashtags: {
            include: { hashtag: true },
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
    },
    orderBy: { publishedAt: "desc" },
    take: limit + 1,
  });

  // ... 残りの処理
}
```

#### カテゴリー一覧取得（technologies と hashtags を結合）

```typescript
// src/app/actions/feed.ts

export async function getCategories() {
  try {
    // technologiesを取得
    const technologies = await prisma.technology.findMany({
      orderBy: { name: "asc" },
    });

    // hashtagsを取得
    const hashtags = await prisma.hashtag.findMany({
      orderBy: { name: "asc" },
    });

    // 両方を結合して返す
    const techCategories = technologies.map((tech) => ({
      id: tech.id,
      name: tech.name,
      color: tech.color,
      type: 'technology' as const,
    }));

    const hashtagCategories = hashtags.map((tag) => ({
      id: tag.id,
      name: tag.name,
      color: null,
      type: 'hashtag' as const,
    }));

    // 名前でソートして返す
    return [...techCategories, ...hashtagCategories].sort((a, b) => 
      a.name.localeCompare(b.name)
    );
  } catch (error) {
    console.error("Error fetching categories:", error);
    throw new Error("カテゴリーの取得に失敗しました");
  }
}
```

### メリット

✅ **変更不要**: 既存のスキーマをそのまま使用できる  
✅ **即座に実装可能**: マイグレーション不要  
✅ **柔軟性**: ソースレベルと記事レベルの両方の情報を活用  
✅ **段階的改善**: 後からスキーマを統一することも可能  

### デメリット

⚠️ **二重管理**: `technologies` と `hashtags` の両方を管理する必要がある  
⚠️ **データ重複リスク**: 同じ技術名が両方のテーブルに存在する可能性  
⚠️ **フィルタリングの複雑さ**: ORクエリが多くなり、パフォーマンスに影響する可能性  

---

## ✅ 方法2: hashtagsテーブルに統一（小規模な変更）

### 概要

`technologies` を廃止し、**すべて `hashtags` テーブルで管理**する方法です。

### 必要な変更

#### 1. `hashtags` テーブルにカラムを追加

```prisma
model Hashtag {
  id        String   @id @default(cuid())
  name      String   @unique
  category  String?  // 追加: カテゴリー分類
  color     String?  // 追加: 表示カラー
  createdAt DateTime @default(now()) @map("created_at")

  postHashtags     PostHashtag[]
  rssEntryHashtags RssEntryHashtag[]

  @@map("hashtags")
}
```

#### 2. `source_technologies` を `source_hashtags` に変更

```prisma
model SourceHashtag {
  id        String   @id @default(cuid())
  sourceId  String   @map("source_id")
  hashtagId String   @map("hashtag_id")
  createdAt DateTime @default(now()) @map("created_at")

  source  RssSource @relation(fields: [sourceId], references: [id], onDelete: Cascade)
  hashtag Hashtag   @relation(fields: [hashtagId], references: [id], onDelete: Cascade)

  @@unique([sourceId, hashtagId])
  @@map("source_hashtags")
}
```

#### 3. `user_technologies` を `user_hashtags` に変更

```prisma
model UserHashtag {
  id        String   @id @default(cuid())
  userId    String   @map("user_id")
  hashtagId String   @map("hashtag_id")
  createdAt DateTime @default(now()) @map("created_at")

  user    User    @relation(fields: [userId], references: [id], onDelete: Cascade)
  hashtag Hashtag @relation(fields: [hashtagId], references: [id], onDelete: Cascade)

  @@unique([userId, hashtagId])
  @@map("user_hashtags")
}
```

#### 4. マイグレーションスクリプト

```typescript
// scripts/migrate-technologies-to-hashtags.ts

import { prisma } from '@/lib/prisma';

async function main() {
  // 1. technologies の内容を hashtags にコピー
  const technologies = await prisma.technology.findMany();
  
  for (const tech of technologies) {
    // 既存のhashtagと重複しないか確認
    const existingHashtag = await prisma.hashtag.findUnique({
      where: { name: tech.name },
    });
    
    if (!existingHashtag) {
      await prisma.hashtag.create({
        data: {
          name: tech.name,
          category: tech.category,
          color: tech.color,
        },
      });
    }
  }

  // 2. source_technologies を source_hashtags に変換
  const sourceTechs = await prisma.sourceTechnology.findMany({
    include: { technology: true },
  });

  for (const st of sourceTechs) {
    const hashtag = await prisma.hashtag.findUnique({
      where: { name: st.technology.name },
    });

    if (hashtag) {
      await prisma.$executeRaw`
        INSERT INTO source_hashtags (id, source_id, hashtag_id, created_at)
        VALUES (${st.id}, ${st.sourceId}, ${hashtag.id}, ${st.createdAt})
        ON CONFLICT DO NOTHING
      `;
    }
  }

  // 3. user_technologies を user_hashtags に変換
  const userTechs = await prisma.userTechnology.findMany({
    include: { technology: true },
  });

  for (const ut of userTechs) {
    const hashtag = await prisma.hashtag.findUnique({
      where: { name: ut.technology.name },
    });

    if (hashtag) {
      await prisma.$executeRaw`
        INSERT INTO user_hashtags (id, user_id, hashtag_id, created_at)
        VALUES (${ut.id}, ${ut.userId}, ${hashtag.id}, ${ut.createdAt})
        ON CONFLICT DO NOTHING
      `;
    }
  }

  console.log('Migration completed successfully');
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
```

### メリット

✅ **一元管理**: 全てのタグを `hashtags` テーブルで管理  
✅ **シンプルなクエリ**: フィルタリングが単純になる  
✅ **ユーザー作成タグ**: ユーザーが自由にハッシュタグを作成可能  

### デメリット

⚠️ **マイグレーション必要**: データ移行が必要  
⚠️ **テーブル名変更**: `source_technologies` → `source_hashtags` 等  

---

## ✅ 方法3: technologiesテーブルに統一（推奨）

### 概要

`hashtags` を廃止し、**すべて `technologies` テーブルで管理**する方法です。

### 必要な変更

#### 1. `technologies` テーブルにユニーク制約を追加

```prisma
model Technology {
  id        String   @id @default(cuid())
  name      String   @unique  // ← ユニーク制約を追加
  category  String?
  color     String?
  createdAt DateTime @default(now()) @map("created_at")
  updatedAt DateTime @updatedAt @map("updated_at")

  userTechnologies     UserTechnology[]
  sourceTechnologies   SourceTechnology[]
  rssEntryTechnologies RssEntryTechnology[]  // 追加
  postTechnologies     PostTechnology[]      // 追加

  @@map("technologies")
}
```

#### 2. `rss_entry_hashtags` を `rss_entry_technologies` に変更

**既存テーブルのリネーム**（新規作成ではない）:

```sql
-- マイグレーション
ALTER TABLE rss_entry_hashtags RENAME TO rss_entry_technologies;
ALTER TABLE rss_entry_technologies RENAME COLUMN hashtag_id TO technology_id;
```

```prisma
model RssEntryTechnology {
  id           String   @id @default(cuid())
  entryId      String   @map("entry_id")
  technologyId String   @map("technology_id")

  entry      RssEntry   @relation(fields: [entryId], references: [id], onDelete: Cascade)
  technology Technology @relation(fields: [technologyId], references: [id], onDelete: Cascade)

  @@unique([entryId, technologyId])
  @@map("rss_entry_technologies")
}
```

#### 3. `post_hashtags` を `post_technologies` に変更

**既存テーブルのリネーム**:

```sql
-- マイグレーション
ALTER TABLE post_hashtags RENAME TO post_technologies;
ALTER TABLE post_technologies RENAME COLUMN hashtag_id TO technology_id;
```

```prisma
model PostTechnology {
  id           String   @id @default(cuid())
  postId       String   @map("post_id")
  technologyId String   @map("technology_id")

  post       Post       @relation(fields: [postId], references: [id], onDelete: Cascade)
  technology Technology @relation(fields: [technologyId], references: [id], onDelete: Cascade)

  @@unique([postId, technologyId])
  @@map("post_technologies")
}
```

#### 4. マイグレーションスクリプト

```typescript
// scripts/migrate-hashtags-to-technologies.ts

import { prisma } from '@/lib/prisma';

async function main() {
  // 1. hashtags の内容を technologies にコピー
  const hashtags = await prisma.hashtag.findMany();
  
  const hashtagToTechMap = new Map<string, string>();
  
  for (const hashtag of hashtags) {
    // 既存のtechnologyと重複しないか確認
    let technology = await prisma.technology.findUnique({
      where: { name: hashtag.name },
    });
    
    if (!technology) {
      technology = await prisma.technology.create({
        data: {
          name: hashtag.name,
          category: null,
          color: null,
        },
      });
    }
    
    hashtagToTechMap.set(hashtag.id, technology.id);
  }

  // 2. rss_entry_hashtags のデータを変換
  const rssEntryHashtags = await prisma.rssEntryHashtag.findMany();
  
  for (const reh of rssEntryHashtags) {
    const technologyId = hashtagToTechMap.get(reh.hashtagId);
    if (technologyId) {
      await prisma.$executeRaw`
        INSERT INTO rss_entry_technologies (id, entry_id, technology_id)
        VALUES (${reh.id}, ${reh.entryId}, ${technologyId})
        ON CONFLICT DO NOTHING
      `;
    }
  }

  // 3. post_hashtags のデータを変換
  const postHashtags = await prisma.postHashtag.findMany();
  
  for (const ph of postHashtags) {
    const technologyId = hashtagToTechMap.get(ph.hashtagId);
    if (technologyId) {
      await prisma.$executeRaw`
        INSERT INTO post_technologies (id, post_id, technology_id)
        VALUES (${ph.id}, ${ph.postId}, ${technologyId})
        ON CONFLICT DO NOTHING
      `;
    }
  }

  console.log('Migration completed successfully');
  console.log(`Migrated ${hashtags.length} hashtags to technologies`);
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
```

### メリット

✅ **一元管理**: 全てのタグを `technologies` テーブルで管理  
✅ **カラー情報**: `color` カラムがあり、UIで視覚的な区別が可能  
✅ **カテゴリー分類**: `category` カラムで技術を分類可能  
✅ **統一的な扱い**: RSS記事も投稿も同じ粒度で技術タグを管理  

### デメリット

⚠️ **マイグレーション必要**: データ移行とテーブルリネームが必要  
⚠️ **タグの制約**: ユーザーが自由にタグを作成しにくい（管理された技術タグのみ）  

---

## 推奨: どの方法を選ぶべきか

### 即座に実装したい場合

**→ 方法1（現状のまま使用）**

- 変更なし、すぐに使える
- 既存のテーブルをそのまま活用
- コード側の変換ロジックで対応

### 長期的な保守性を重視する場合

**→ 方法3（technologiesに統一）**

- データの一貫性が高い
- カラー情報やカテゴリー分類が使える
- 将来的な拡張がしやすい

### ユーザー自由度を重視する場合

**→ 方法2（hashtagsに統一）**

- ユーザーが自由にタグを作成可能
- SNS的な使い方に適している

---

## 具体的な実装例（方法1: 現状のまま）

### 型定義の更新

```typescript
// src/features/feed/types/article.ts

export type FeedItemWithRelations = FeedItem & {
  rssEntry:
    | (RssEntry & {
        source: {
          title: string | null;
          sourceTechnologies: {
            technology: Technology;
          }[];
        };
        hashtags: {
          hashtag: {
            id: string;
            name: string;
          };
        }[];
      })
    | null;
  post:
    | (Post & {
        author: User;
        hashtags: {
          hashtag: {
            id: string;
            name: string;
          };
        }[];
      })
    | null;
};
```

### 変更不要なファイル

以下のファイルは**変更不要**です：

- ✅ `prisma/schema.prisma` - スキーマ変更なし
- ✅ データベースマイグレーション - 不要
- ✅ 既存のコンポーネント - Article型を受け取るだけなので影響なし

### 変更が必要なファイル

以下のファイルのみ変更：

1. **`src/features/feed/types/article.ts`** - 変換ロジックの修正（上記参照）
2. **`src/app/actions/feed.ts`** - フィルタリングクエリの修正（上記参照）

---

## まとめ

### 最も簡単な方法

**✅ 方法1: 現状のテーブルをそのまま使用**

- 新規テーブル作成: **不要**
- マイグレーション: **不要**
- コード変更: **最小限**（変換ロジックのみ）
- 即座に実装可能: **Yes**

### 実装手順

1. `src/features/feed/types/article.ts` の変換関数を修正
2. `src/app/actions/feed.ts` のフィルタリングクエリを修正
3. 必要に応じて `getCategories()` で両方を結合

これだけで、既存のテーブルを使って技術タグを管理できます！

将来的にスキーマを統一したくなったら、その時点で方法2か方法3を選択してマイグレーションすることも可能です。

