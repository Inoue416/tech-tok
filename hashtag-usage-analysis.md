# hashtagテーブルの用途と使用状況

## 概要

`hashtags` テーブルは、**記事やユーザー投稿に関連付けるハッシュタグを管理するマスターテーブル**です。

---

## テーブル定義

### `hashtags` テーブル

```prisma
model Hashtag {
  id        String   @id @default(cuid())
  name      String   @unique  // ハッシュタグ名（例: "react", "typescript"）
  createdAt DateTime @default(now()) @map("created_at")

  postHashtags     PostHashtag[]      // ユーザー投稿との関連
  rssEntryHashtags RssEntryHashtag[]  // RSS記事との関連

  @@map("hashtags")
}
```

### 中間テーブル

#### 1. `post_hashtags` - ユーザー投稿とハッシュタグの関連

```prisma
model PostHashtag {
  id       String @id @default(cuid())
  postId   String @map("post_id")
  hashtagId String @map("hashtag_id")

  post    Post    @relation(fields: [postId], references: [id], onDelete: Cascade)
  hashtag Hashtag @relation(fields: [hashtagId], references: [id], onDelete: Cascade)

  @@unique([postId, hashtagId])
  @@map("post_hashtags")
}
```

#### 2. `rss_entry_hashtags` - RSS記事とハッシュタグの関連

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

---

## 想定される用途

### 1. **ユーザー投稿のハッシュタグ**

ユーザーが投稿を作成する際に、投稿内容に関連するハッシュタグを付与します。

#### 使用例

```typescript
// ユーザーが投稿作成時にハッシュタグを指定
const post = await prisma.post.create({
  data: {
    title: "Reactの最新機能について",
    body: "React 19の新機能を試してみました...",
    authorId: userId,
  }
});

// ハッシュタグを関連付け
const tags = ["react", "javascript", "frontend"];
for (const tagName of tags) {
  // ハッシュタグを取得または作成
  const hashtag = await prisma.hashtag.upsert({
    where: { name: tagName },
    update: {},
    create: { name: tagName }
  });
  
  // 投稿とハッシュタグを関連付け
  await prisma.postHashtag.create({
    data: {
      postId: post.id,
      hashtagId: hashtag.id
    }
  });
}
```

### 2. **RSS記事の自動ハッシュタグ抽出**

RSS記事から自動的にハッシュタグを抽出して付与します。

#### 想定される処理フロー

```typescript
// バッチ処理でRSS記事を取得
async function processRssEntry(feedItem: RssFeedItem) {
  // 1. RSS記事を保存
  const rssEntry = await prisma.rssEntry.create({
    data: {
      sourceId: sourceId,
      guid: feedItem.guid,
      title: feedItem.title,
      description: feedItem.description,
      // ... その他のフィールド
    }
  });

  // 2. タイトルと本文からハッシュタグを抽出
  const hashtags = extractHashtags(
    feedItem.title + ' ' + feedItem.description
  );

  // 3. ハッシュタグを登録・関連付け
  for (const tagName of hashtags) {
    const hashtag = await prisma.hashtag.upsert({
      where: { name: tagName },
      update: {},
      create: { name: tagName }
    });
    
    await prisma.rssEntryHashtag.create({
      data: {
        entryId: rssEntry.id,
        hashtagId: hashtag.id
      }
    });
  }
}

// ハッシュタグ抽出ロジックの例
function extractHashtags(text: string): string[] {
  // 方法1: テキスト中の #で始まる単語を抽出
  const hashtagPattern = /#(\w+)/g;
  const matches = text.match(hashtagPattern) || [];
  return matches.map(tag => tag.slice(1).toLowerCase());
  
  // 方法2: キーワード辞書とのマッチング
  const techKeywords = ['react', 'typescript', 'nextjs', 'prisma', ...];
  const foundTags = techKeywords.filter(keyword => 
    text.toLowerCase().includes(keyword)
  );
  return foundTags;
  
  // 方法3: NLP/AIによる自動タグ付け（将来実装）
  // return await analyzeTextWithAI(text);
}
```

### 3. **フィード画面での表示**

フィードで記事を表示する際、関連するハッシュタグを表示します。

#### UI表示例

```typescript
// src/features/feed/components/feed-info.tsx

export function FeedInfo({ data }: FeedInfoProps) {
  return (
    <div className="flex-1 text-white">
      {/* 作者情報 */}
      <div className="mb-2 flex items-center gap-2">
        <span className="font-semibold">{data.author.name}</span>
      </div>

      {/* ハッシュタグ表示 */}
      {data.hashtags && data.hashtags.length > 0 && (
        <div className="flex flex-wrap gap-1">
          {data.hashtags.map((tag) => (
            <span key={tag} className="text-sm text-blue-300">
              #{tag}
            </span>
          ))}
        </div>
      )}
    </div>
  );
}
```

#### 表示イメージ

```
┌─────────────────────────────────┐
│  👤 山田太郎                    │
│                                 │
│  Reactの新機能について解説      │
│                                 │
│  #react #typescript #frontend   │
│                                 │
│  👍 123  💬 45  📤 12          │
└─────────────────────────────────┘
```

### 4. **ハッシュタグでの検索・フィルタリング**

ユーザーが特定のハッシュタグで記事を絞り込むことができます。

#### 検索機能の実装例

```typescript
// ハッシュタグで記事を検索
async function searchByHashtag(tagName: string) {
  const hashtag = await prisma.hashtag.findUnique({
    where: { name: tagName },
    include: {
      postHashtags: {
        include: {
          post: {
            include: {
              author: true
            }
          }
        }
      },
      rssEntryHashtags: {
        include: {
          entry: {
            include: {
              source: true
            }
          }
        }
      }
    }
  });

  if (!hashtag) {
    return { posts: [], rssEntries: [] };
  }

  return {
    posts: hashtag.postHashtags.map(ph => ph.post),
    rssEntries: hashtag.rssEntryHashtags.map(reh => reh.entry)
  };
}
```

### 5. **トレンドハッシュタグの分析**

人気のハッシュタグをランキング表示できます。

```typescript
// 人気のハッシュタグを取得
async function getTrendingHashtags(limit: number = 10) {
  const hashtags = await prisma.hashtag.findMany({
    include: {
      _count: {
        select: {
          postHashtags: true,
          rssEntryHashtags: true
        }
      }
    },
    orderBy: {
      // 使用回数でソート（集計が必要）
    },
    take: limit
  });

  return hashtags.map(tag => ({
    name: tag.name,
    totalCount: tag._count.postHashtags + tag._count.rssEntryHashtags
  }));
}
```

---

## 現在の使用状況

### ✅ 実装済み

1. **テーブル定義**: `hashtags`, `post_hashtags`, `rss_entry_hashtags` が定義されている
2. **型定義**: `FeedItemData` に `hashtags?: string[]` が含まれている
3. **UI コンポーネント**: `FeedInfo` コンポーネントでハッシュタグを表示できる

### ⚠️ 未実装・部分的実装

1. **データ投入**: 実際の `hashtags` テーブルへのデータ登録処理が未実装
2. **RSS記事との関連付け**: `rss_entry_hashtags` への登録が未実装
3. **ユーザー投稿との関連付け**: `post_hashtags` への登録が未実装
4. **ハッシュタグ抽出ロジック**: RSS記事やユーザー投稿からハッシュタグを抽出する処理が未実装
5. **検索機能**: ハッシュタグでの検索・フィルタリング機能が未実装

### 現在の代替手段

現在は `hashtags` の代わりに、以下を使用しています：

- **RSS記事**: `source_technologies` → `technologies`（ソースレベルの技術タグ）
- **ユーザー投稿**: `post_hashtags` → `hashtags`（設計上は存在するが未使用）

実際の表示では `Article.categories` として `technologies` テーブルの情報を使用しています。

---

## hashtagsテーブルに入るデータの例

### 技術系ハッシュタグ

```
#react
#typescript
#nextjs
#prisma
#tailwindcss
#nodejs
#docker
#kubernetes
#aws
#postgresql
```

### トピック系ハッシュタグ

```
#チュートリアル
#初心者向け
#tips
#ベストプラクティス
#パフォーマンス
#セキュリティ
#デバッグ
#テスト
```

### コンテンツタイプ系ハッシュタグ

```
#解説記事
#コードレビュー
#プロジェクト紹介
#ライブラリ紹介
#比較記事
```

---

## technologies との違い

| 項目 | `technologies` | `hashtags` |
|-----|---------------|-----------|
| **目的** | 公式の技術スタックの管理 | 自由なハッシュタグ |
| **データ追加** | 管理者が事前に登録 | ユーザーが自由に作成可能 |
| **カラー情報** | ✅ あり（`color`） | ❌ なし |
| **カテゴリー分類** | ✅ あり（`category`） | ❌ なし |
| **関連付け** | RSSソース、ユーザープロフィール | RSS記事、ユーザー投稿 |
| **粒度** | 粗い（ソースレベル） | 細かい（記事レベル） |
| **用途** | カテゴリーフィルタリング、プロフィール | タグ付け、検索、トレンド分析 |

### 併用パターン

両方を使い分けることで、構造化された分類とフリータグの柔軟性を両立できます。

**例**: 

```
記事: "Next.js 14の新機能App Routerを試してみた"

technologies (公式カテゴリー):
  - React
  - Next.js
  - TypeScript

hashtags (フリータグ):
  - #nextjs14
  - #approuter
  - #チュートリアル
  - #初心者向け
  - #サンプルコード
```

---

## 実装の優先順位

### Phase 1: 基本機能（即座に実装可能）

1. **ユーザー投稿でのハッシュタグ入力**
   - 投稿フォームにハッシュタグ入力欄を追加
   - `#tag` 形式または複数選択UIで入力
   - `post_hashtags` に登録

2. **ハッシュタグの表示**
   - `ArticleCard` コンポーネントでハッシュタグを表示
   - `Article` 型に `hashtags: string[]` を追加

### Phase 2: RSS記事への適用

1. **RSS記事からのハッシュタグ抽出**
   - テキスト中の `#tag` を抽出
   - キーワード辞書とのマッチング
   - `rss_entry_hashtags` に登録

2. **手動でのハッシュタグ編集**
   - 管理画面でRSS記事のハッシュタグを編集可能にする

### Phase 3: 高度な機能

1. **ハッシュタグ検索**
   - ハッシュタグをクリックすると関連記事を表示
   - ハッシュタグ一覧ページ

2. **トレンド分析**
   - 人気ハッシュタグのランキング表示
   - 時系列でのトレンド変化

3. **AI による自動タグ付け**
   - NLP/機械学習で記事内容から適切なハッシュタグを自動生成

---

## データ投入方法

### 方法1: Seed データで初期データを投入

```typescript
// prisma/seed.ts

const commonHashtags = [
  // 技術系
  'react', 'typescript', 'nextjs', 'prisma', 'tailwindcss',
  'nodejs', 'docker', 'kubernetes', 'aws', 'postgresql',
  
  // トピック系
  'チュートリアル', '初心者向け', 'tips', 'ベストプラクティス',
  'パフォーマンス', 'セキュリティ', 'デバッグ', 'テスト',
  
  // コンテンツタイプ系
  '解説記事', 'コードレビュー', 'プロジェクト紹介', 'ライブラリ紹介'
];

async function seedHashtags() {
  for (const tagName of commonHashtags) {
    await prisma.hashtag.upsert({
      where: { name: tagName },
      update: {},
      create: { name: tagName }
    });
  }
  console.log(`Seeded ${commonHashtags.length} hashtags`);
}
```

### 方法2: バッチ処理で既存データから抽出

```typescript
// scripts/extract-hashtags-from-existing-data.ts

async function extractHashtagsFromExistingData() {
  // 1. 既存のtechnologiesをhashtagsにコピー
  const technologies = await prisma.technology.findMany();
  for (const tech of technologies) {
    await prisma.hashtag.upsert({
      where: { name: tech.name.toLowerCase() },
      update: {},
      create: { name: tech.name.toLowerCase() }
    });
  }

  // 2. 既存のRSS記事のタイトル・本文からハッシュタグを抽出
  const rssEntries = await prisma.rssEntry.findMany();
  for (const entry of rssEntries) {
    const text = `${entry.title} ${entry.description || ''}`;
    const tags = extractHashtags(text);
    
    for (const tagName of tags) {
      const hashtag = await prisma.hashtag.upsert({
        where: { name: tagName },
        update: {},
        create: { name: tagName }
      });
      
      await prisma.rssEntryHashtag.upsert({
        where: {
          entryId_hashtagId: {
            entryId: entry.id,
            hashtagId: hashtag.id
          }
        },
        update: {},
        create: {
          entryId: entry.id,
          hashtagId: hashtag.id
        }
      });
    }
  }
}
```

---

## まとめ

### hashtagsテーブルの役割

1. **ユーザー投稿のタグ付け**: ユーザーが自由にハッシュタグを付けられる
2. **RSS記事の詳細分類**: ソースレベル（technologies）よりも細かい粒度で分類
3. **検索・発見**: ハッシュタグで記事を検索・フィルタリング
4. **トレンド分析**: 人気のトピックを可視化

### 現状と今後

- **現状**: テーブルは存在するが、データ投入・活用が未実装
- **代替手段**: 現在は `technologies` テーブルを使用している
- **推奨**: まずは `technologies` で運用し、必要に応じて `hashtags` を段階的に実装

### 実装の判断基準

**hashtagsを実装すべきケース**:
- ユーザーが自由にタグを作成できるようにしたい
- 記事ごとに細かいタグ付けをしたい
- トレンド分析機能を実装したい

**technologiesで十分なケース**:
- 管理された技術スタックだけで分類したい
- カラー情報やカテゴリー分類が必要
- シンプルな実装で済ませたい

---

## 関連ファイル

- **スキーマ**: `prisma/schema.prisma`
- **ドキュメント**: `docs/batch-processing-database-schema.md`
- **型定義**: `src/features/feed/types/index.ts`
- **UIコンポーネント**: `src/features/feed/components/feed-info.tsx`
- **Server Actions**: `src/app/actions/feed.ts`

