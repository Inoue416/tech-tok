# technologiesテーブルの使い方ガイド

## 概要

`technologies` テーブルは、**技術スタック（React, TypeScript等）のマスターデータを管理**するテーブルです。アプリケーション全体で技術タグとして活用されます。

---

## テーブル定義

### `technologies` テーブル

```prisma
model Technology {
  id        String   @id @default(cuid())
  name      String   // 技術名（例: "React", "TypeScript"）
  category  String?  // カテゴリー（例: "Frontend", "Backend", "Language"）
  color     String?  // 表示用カラーコード（例: "#61DAFB"）
  createdAt DateTime @default(now()) @map("created_at")
  updatedAt DateTime @updatedAt @map("updated_at")

  // リレーション
  userTechnologies   UserTechnology[]   // ユーザーの技術スタック
  sourceTechnologies SourceTechnology[] // RSSソースの技術分類

  @@map("technologies")
}
```

### 関連する中間テーブル

#### 1. `user_technologies` - ユーザーの技術スタック

```prisma
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

#### 2. `source_technologies` - RSSソースの技術分類

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

---

## 主な使用箇所

### 1. RSSソースの技術分類

RSSフィードソースに技術タグを関連付けることで、そのソースから取得される全記事に自動的に技術タグが付与されます。

#### データ例

```typescript
// React公式ブログにReact技術タグを関連付け
const reactBlog = await prisma.rssSource.create({
  data: {
    feedUrl: "https://react.dev/blog/rss.xml",
    title: "React Blog",
    category: "Frontend"
  }
});

const reactTech = await prisma.technology.findFirst({
  where: { name: "React" }
});

await prisma.sourceTechnology.create({
  data: {
    sourceId: reactBlog.id,
    technologyId: reactTech.id
  }
});
```

#### フィード表示での使用

**ファイル**: `src/features/feed/types/article.ts`

```typescript
export function rssEntryToArticle(
  feedItem: FeedItemWithRelations,
  entry: NonNullable<FeedItemWithRelations["rssEntry"]>,
  userId?: string,
  userLikes?: Set<string>,
  userBookmarks?: Set<string>,
): Article {
  // ソースに関連付けられた技術タグを取得
  const categories: Category[] =
    entry.source.sourceTechnologies.map((st) => ({
      id: st.technology.id,
      name: st.technology.name,      // 技術名を表示
      color: st.technology.color,    // カラーを使用
    }));

  return {
    id: feedItem.id,
    type: "rss",
    title: entry.title,
    content: entry.contentText || entry.description || "",
    authorName: entry.authorName || entry.source.title || "Unknown",
    // ...
    categories, // ✅ 技術タグを記事に表示
  };
}
```

#### UI表示（記事カード）

**ファイル**: `src/features/feed/components/article-card.tsx`

```typescript
{/* カテゴリータグ表示 */}
{article.categories.length > 0 && (
  <div className="flex flex-wrap gap-2 mb-4">
    {article.categories.map((category) => (
      <span
        key={category.id}
        className="px-3 py-1 rounded-full bg-white/10 text-white text-sm"
        style={
          category.color
            ? { backgroundColor: `${category.color}20` } // ✅ colorを背景色に使用
            : undefined
        }
      >
        {category.name} {/* ✅ 技術名を表示（例: "React"） */}
      </span>
    ))}
  </div>
)}
```

#### 表示イメージ

```
┌─────────────────────────────────────┐
│  📰 React公式ブログ                 │
│                                     │
│  React 19の新機能                   │
│                                     │
│  🏷️ React  TypeScript  Frontend   │
│    ↑ technologies から表示         │
│                                     │
│  👍 123  💬 45  📤 12              │
└─────────────────────────────────────┘
```

---

### 2. ユーザープロフィールの技術スタック

ユーザーが興味のある技術や得意な技術をプロフィールに設定できます。

#### データ例

```typescript
// ユーザーに技術スタックを関連付け
const user = await prisma.user.findFirst({
  where: { username: "alice_dev" }
});

const technologies = await prisma.technology.findMany({
  where: {
    name: { in: ["React", "TypeScript", "Next.js"] }
  }
});

for (const tech of technologies) {
  await prisma.userTechnology.create({
    data: {
      userId: user.id,
      technologyId: tech.id
    }
  });
}
```

#### プロフィール画面での表示

**ファイル**: `src/features/profile/components/profile-info-section.tsx`

```typescript
export function ProfileInfoSection({
  technologies,
  onEdit,
}: ProfileInfoSectionProps) {
  return (
    <div className="space-y-4 p-6 bg-card rounded-lg border">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold">技術スタック</h2>
        <Button onClick={onEdit} variant="ghost" size="sm">
          <Edit className="size-4" />
        </Button>
      </div>

      {technologies.length > 0 ? (
        <div className="flex flex-wrap gap-2">
          {technologies.map((tech) => (
            <div
              key={tech.id}
              className="inline-flex items-center rounded-full px-3 py-1 text-sm font-medium"
              style={
                tech.color
                  ? {
                      backgroundColor: `${tech.color}20`,  // ✅ colorを背景色に
                      color: tech.color,                   // ✅ colorを文字色に
                      borderColor: `${tech.color}40`,
                    }
                  : undefined
              }
            >
              {tech.name} {/* ✅ 技術名を表示 */}
            </div>
          ))}
        </div>
      ) : (
        <p className="text-sm text-muted-foreground">
          技術スタックが設定されていません
        </p>
      )}
    </div>
  );
}
```

#### 技術スタック選択UI

**ファイル**: `src/features/profile/components/technology-selector.tsx`

```typescript
export function TechnologySelector({
  availableTechnologies,
  selectedTechnologies,
  onSelectionChange,
  maxSelections,
}: TechnologySelectorProps) {
  return (
    <div className="space-y-4">
      {/* 検索バー */}
      <Input
        type="text"
        placeholder="技術を検索..."
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
      />

      {/* 選択済み技術 */}
      {localSelected.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {localSelected.map((tech) => (
            <button
              key={tech.id}
              onClick={() => toggleTechnology(tech.id)}
              style={
                tech.color
                  ? {
                      backgroundColor: tech.color,  // ✅ colorを使用
                      color: "white",
                    }
                  : undefined
              }
            >
              {tech.name} {/* ✅ 技術名を表示 */}
              <X className="size-3" />
            </button>
          ))}
        </div>
      )}

      {/* 利用可能な技術一覧 */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
        {availableTechnologies.map((tech) => (
          <button
            key={tech.id}
            onClick={() => toggleTechnology(tech.id)}
            style={
              isSelected && tech.color
                ? {
                    backgroundColor: `${tech.color}20`,
                    color: tech.color,
                    borderColor: `${tech.color}40`,
                  }
                : undefined
            }
          >
            <span>{tech.name}</span> {/* ✅ 技術名を表示 */}
            {isSelected && <Check className="size-4" />}
          </button>
        ))}
      </div>
    </div>
  );
}
```

#### 技術スタック更新

**ファイル**: `src/app/actions/profile.ts`

```typescript
export async function updateTechnologies(
  technologyIds: string[],
): Promise<UpdateTechnologiesResult> {
  try {
    const session = await getSession();
    if (!session?.user?.id) {
      return { success: false, error: "認証が必要です" };
    }

    const userId = session.user.id;

    // トランザクションで更新
    await prisma.$transaction(async (tx) => {
      // 既存のUserTechnologyレコードを削除
      await tx.userTechnology.deleteMany({
        where: { userId },
      });

      // 新しいUserTechnologyレコードを作成
      if (technologyIds.length > 0) {
        await tx.userTechnology.createMany({
          data: technologyIds.map((technologyId) => ({
            userId,
            technologyId,
          })),
        });
      }
    });

    // 更新後の技術スタックを取得
    const userTechnologies = await prisma.userTechnology.findMany({
      where: { userId },
      include: { technology: true },
    });

    const technologies: Technology[] = userTechnologies.map((ut) => ({
      id: ut.technology.id,
      name: ut.technology.name,
      category: ut.technology.category,
      color: ut.technology.color,
    }));

    return { success: true, technologies };
  } catch (error) {
    console.error("Error updating technologies:", error);
    return {
      success: false,
      error: "技術スタックの更新に失敗しました",
    };
  }
}
```

#### 表示イメージ

```
┌─────────────────────────────────────┐
│  プロフィール                       │
│                                     │
│  👤 Alice Developer                 │
│  @alice_dev                         │
│                                     │
│  技術スタック                🖊️    │
│  ┌─────────────────────────────┐  │
│  │ React  TypeScript  Next.js  │  │
│  │ Tailwind CSS  Prisma        │  │
│  └─────────────────────────────┘  │
│                                     │
│  [ログアウト] [アカウント削除]      │
└─────────────────────────────────────┘
```

---

### 3. フィードのカテゴリーフィルタリング

ユーザーが特定の技術でフィード記事を絞り込むことができます。

#### カテゴリー一覧の取得

**ファイル**: `src/app/actions/feed.ts`

```typescript
export async function getCategories() {
  try {
    const technologies = await prisma.technology.findMany({
      orderBy: {
        name: "asc",
      },
    });

    return technologies.map((tech) => ({
      id: tech.id,
      name: tech.name,    // ✅ カテゴリー名として使用
      color: tech.color,  // ✅ 表示色として使用
    }));
  } catch (error) {
    console.error("Error fetching categories:", error);
    throw new Error("カテゴリーの取得に失敗しました");
  }
}
```

#### カテゴリーフィルタリング

**ファイル**: `src/app/actions/feed.ts`

```typescript
export async function getFeedArticles(
  params: GetFeedArticlesParams = {},
): Promise<GetFeedArticlesResult> {
  const { cursor, categoryId, limit = 10 } = params;

  const feedItems = await prisma.feedItem.findMany({
    where: {
      isPublished: true,
      // カテゴリーフィルター
      ...(categoryId && {
        OR: [
          {
            rssEntry: {
              source: {
                sourceTechnologies: {
                  some: {
                    technologyId: categoryId,  // ✅ 技術IDでフィルタ
                  },
                },
              },
            },
          },
          // 将来的にユーザー投稿もtechnologiesで管理する場合
          {
            post: {
              technologies: {
                some: {
                  technologyId: categoryId,
                },
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
                include: {
                  technology: true,  // ✅ 技術情報を取得
                },
              },
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

  // ... 残りの処理
}
```

#### UIでの使用例

```typescript
// カテゴリーフィルター
<Select onValueChange={(value) => setSelectedCategory(value)}>
  <SelectTrigger>
    <SelectValue placeholder="カテゴリーを選択" />
  </SelectTrigger>
  <SelectContent>
    <SelectItem value="all">すべて</SelectItem>
    {categories.map((category) => (
      <SelectItem key={category.id} value={category.id}>
        <span style={{ color: category.color }}>
          {category.name} {/* ✅ React, TypeScript等 */}
        </span>
      </SelectItem>
    ))}
  </SelectContent>
</Select>
```

---

## データの管理

### シードデータでの初期投入

**ファイル**: `prisma/seed.ts`

```typescript
const technologies = [
  { name: "React", category: "Frontend", color: "#61DAFB" },
  { name: "TypeScript", category: "Language", color: "#3178C6" },
  { name: "Next.js", category: "Framework", color: "#000000" },
  { name: "Node.js", category: "Backend", color: "#339933" },
  { name: "AWS", category: "Cloud", color: "#232F3E" },
  { name: "Go", category: "Language", color: "#00ADD8" },
  { name: "PostgreSQL", category: "Database", color: "#336791" },
  { name: "Python", category: "Language", color: "#3776AB" },
  { name: "Docker", category: "Infrastructure", color: "#2496ED" },
  { name: "Kubernetes", category: "Infrastructure", color: "#326CE5" },
];

for (const tech of technologies) {
  await prisma.technology.upsert({
    where: { name: tech.name },
    update: {},
    create: tech,
  });
}

console.log(`✅ ${technologies.length} technologies created`);
```

### 実行方法

```bash
# シードデータ投入
pnpm db:seed

# データベースリセット + シード実行
pnpm db:reset

# Prisma Studio でデータ確認
pnpm db:studio
```

---

## technologiesテーブルに入るデータの例

### フロントエンド技術

| name | category | color |
|------|----------|-------|
| React | Frontend | #61DAFB |
| Vue.js | Frontend | #42B883 |
| Angular | Frontend | #DD0031 |
| Svelte | Frontend | #FF3E00 |
| Tailwind CSS | Frontend | #06B6D4 |

### バックエンド技術

| name | category | color |
|------|----------|-------|
| Node.js | Backend | #339933 |
| Express | Backend | #000000 |
| NestJS | Backend | #E0234E |
| Django | Backend | #092E20 |
| FastAPI | Backend | #009688 |

### プログラミング言語

| name | category | color |
|------|----------|-------|
| TypeScript | Language | #3178C6 |
| JavaScript | Language | #F7DF1E |
| Python | Language | #3776AB |
| Go | Language | #00ADD8 |
| Rust | Language | #000000 |

### インフラ・DevOps

| name | category | color |
|------|----------|-------|
| Docker | Infrastructure | #2496ED |
| Kubernetes | Infrastructure | #326CE5 |
| AWS | Cloud | #232F3E |
| GCP | Cloud | #4285F4 |
| Azure | Cloud | #0078D4 |

### データベース

| name | category | color |
|------|----------|-------|
| PostgreSQL | Database | #336791 |
| MySQL | Database | #4479A1 |
| MongoDB | Database | #47A248 |
| Redis | Database | #DC382D |

---

## カラム詳細

### `name` カラム

**型**: String  
**用途**: 技術名を格納  
**例**: `"React"`, `"TypeScript"`, `"Docker"`  
**表示箇所**:
- フィード記事のカテゴリータグ
- プロフィールの技術スタック
- カテゴリーフィルターの選択肢

### `category` カラム（オプション）

**型**: String | null  
**用途**: 技術のカテゴリー分類  
**例**: `"Frontend"`, `"Backend"`, `"Language"`, `"Database"`  
**使用例**:
- 技術スタック選択UIでのグループ化
- カテゴリー別の技術一覧表示

```typescript
// カテゴリーでグループ化
const techsByCategory = technologies.reduce((acc, tech) => {
  const category = tech.category || "その他";
  if (!acc[category]) acc[category] = [];
  acc[category].push(tech);
  return acc;
}, {} as Record<string, Technology[]>);

// 表示
Object.entries(techsByCategory).map(([category, techs]) => (
  <div key={category}>
    <h3>{category}</h3>
    {techs.map(tech => <TechTag tech={tech} />)}
  </div>
));
```

### `color` カラム（オプション）

**型**: String | null  
**用途**: 技術タグの視覚的な識別  
**例**: `"#61DAFB"` (React blue), `"#3178C6"` (TypeScript blue)  
**使用方法**:

```typescript
// 背景色として使用（透明度20%）
style={{ backgroundColor: `${tech.color}20` }}

// 文字色として使用
style={{ color: tech.color }}

// ボーダー色として使用（透明度40%）
style={{ borderColor: `${tech.color}40` }}
```

**表示例**:
- フィード記事: 淡い背景色でカテゴリータグを表示
- プロフィール: ブランドカラーで技術スタックを強調
- カテゴリーフィルター: 色付きのアイコンで視認性向上

---

## 使用場所の一覧

| 機能 | 使用方法 | 関連ファイル |
|-----|---------|------------|
| **RSS記事のカテゴリー表示** | `source_technologies` 経由で取得 | `src/features/feed/types/article.ts` |
| **フィード記事カード** | カテゴリータグとして表示（color使用） | `src/features/feed/components/article-card.tsx` |
| **プロフィール表示** | ユーザーの技術スタックを表示 | `src/features/profile/components/profile-info-section.tsx` |
| **技術スタック選択** | 選択UIで一覧表示・検索 | `src/features/profile/components/technology-selector.tsx` |
| **技術スタック更新** | Server Actionで更新処理 | `src/app/actions/profile.ts` |
| **カテゴリーフィルター** | フィードを技術で絞り込み | `src/app/actions/feed.ts` |
| **カテゴリー一覧** | フィルター用の選択肢を取得 | `src/app/actions/feed.ts` |

---

## 将来の拡張案

### 1. 人気度・使用回数の追跡

```prisma
model Technology {
  // 既存フィールド...
  usageCount Int @default(0) @map("usage_count")  // 使用回数
  
  @@index([usageCount])  // 人気順ソート用
}
```

```typescript
// 人気の技術を取得
const popularTechnologies = await prisma.technology.findMany({
  orderBy: { usageCount: "desc" },
  take: 10,
});
```

### 2. 技術の説明文・アイコン

```prisma
model Technology {
  // 既存フィールド...
  description String? @db.Text  // 説明文
  icon        String?           // アイコンURL
  slug        String? @unique   // URL friendly な識別子
}
```

### 3. ユーザー作成タグの許可

```prisma
model Technology {
  // 既存フィールド...
  isOfficial Boolean @default(true) @map("is_official")  // 公式タグか
  createdBy  String? @map("created_by")  // 作成者のユーザーID
}
```

### 4. 技術の階層構造

```prisma
model Technology {
  // 既存フィールド...
  parentId String? @map("parent_id")  // 親技術ID
  
  parent   Technology?  @relation("TechnologyHierarchy", fields: [parentId], references: [id])
  children Technology[] @relation("TechnologyHierarchy")
}
```

例: React → React Router, React Query, Next.js

---

## まとめ

### technologiesテーブルの役割

1. **RSSソースの技術分類**: ソースレベルで技術タグを付与し、フィード記事に表示
2. **ユーザープロフィール**: ユーザーの興味・スキルを表す技術スタックとして表示
3. **カテゴリーフィルタリング**: フィード記事を特定の技術で絞り込み
4. **視覚的な識別**: `color` カラムを使用してブランドカラーで表示

### 主要な特徴

✅ **マスターデータ**: 管理者が事前に登録した公式の技術リスト  
✅ **カラー情報**: `color` カラムで視覚的に区別できる  
✅ **カテゴリー分類**: `category` カラムで技術を分類可能  
✅ **多対多リレーション**: ユーザーやRSSソースと柔軟に関連付け  
✅ **検索・フィルタリング**: 名前での検索、カテゴリーでの絞り込みが可能  

### 現在の実装状況

**✅ 実装済み**:
- テーブル定義
- RSSソースとの関連付け（`source_technologies`）
- ユーザープロフィールとの関連付け（`user_technologies`）
- フィード記事でのカテゴリー表示
- プロフィール画面での技術スタック表示・編集
- カテゴリーフィルタリング

**将来的な拡張**:
- 人気度トラッキング
- ユーザー作成タグ
- 技術の階層構造
- アイコン・説明文の追加

---

## 関連ファイル

- **スキーマ**: `prisma/schema.prisma`
- **シードデータ**: `prisma/seed.ts`, `docs/seed-data-specification.md`
- **Server Actions**:
  - `src/app/actions/feed.ts` - カテゴリー取得・フィルタリング
  - `src/app/actions/profile.ts` - 技術スタック更新
- **型定義**:
  - `src/features/feed/types/article.ts` - Article型・変換関数
  - `src/features/profile/types/index.ts` - Technology型
- **UIコンポーネント**:
  - `src/features/feed/components/article-card.tsx` - カテゴリータグ表示
  - `src/features/profile/components/profile-info-section.tsx` - 技術スタック表示
  - `src/features/profile/components/technology-selector.tsx` - 技術スタック選択UI

