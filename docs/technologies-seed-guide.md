# Technologiesシードデータガイド

## 概要

このドキュメントでは、`technologies` テーブルの初期値を投入する方法と、登録される技術の一覧を説明します。

---

## シードデータの実行方法

### 1. データベース接続確認

```bash
# Dockerコンテナが起動していることを確認
docker ps

# PostgreSQLが起動していない場合
docker compose up -d
```

### 2. シードデータ投入

```bash
# シードデータのみ投入
pnpm db:seed

# または、データベース完全リセット + シード実行
pnpm db:reset
```

### 3. データ確認

```bash
# Prisma Studio でデータを確認
pnpm db:studio
```

ブラウザで `http://localhost:5555` が開き、technologies テーブルのデータを確認できます。

---

## 登録される技術一覧

### フロントエンド（6個）

| name | category | color |
|------|----------|-------|
| React | Frontend | #61DAFB |
| Vue.js | Frontend | #42B883 |
| Angular | Frontend | #DD0031 |
| Svelte | Frontend | #FF3E00 |
| Tailwind CSS | Frontend | #06B6D4 |
| Sass | Frontend | #CC6699 |

### フレームワーク（4個）

| name | category | color |
|------|----------|-------|
| Next.js | Framework | #000000 |
| Nuxt.js | Framework | #00DC82 |
| Remix | Framework | #000000 |
| Astro | Framework | #FF5D01 |

### プログラミング言語（11個）

| name | category | color |
|------|----------|-------|
| TypeScript | Language | #3178C6 |
| JavaScript | Language | #F7DF1E |
| Python | Language | #3776AB |
| Go | Language | #00ADD8 |
| Rust | Language | #000000 |
| Java | Language | #007396 |
| C# | Language | #239120 |
| PHP | Language | #777BB4 |
| Ruby | Language | #CC342D |
| Swift | Language | #FA7343 |
| Kotlin | Language | #7F52FF |

### バックエンド（9個）

| name | category | color |
|------|----------|-------|
| Node.js | Backend | #339933 |
| Express | Backend | #000000 |
| NestJS | Backend | #E0234E |
| Django | Backend | #092E20 |
| FastAPI | Backend | #009688 |
| Flask | Backend | #000000 |
| Spring Boot | Backend | #6DB33F |
| Laravel | Backend | #FF2D20 |
| Ruby on Rails | Backend | #CC0000 |

### データベース（7個）

| name | category | color |
|------|----------|-------|
| PostgreSQL | Database | #336791 |
| MySQL | Database | #4479A1 |
| MongoDB | Database | #47A248 |
| Redis | Database | #DC382D |
| Supabase | Database | #3ECF8E |
| Firebase | Database | #FFCA28 |
| Prisma | Database | #2D3748 |

### クラウド（6個）

| name | category | color |
|------|----------|-------|
| AWS | Cloud | #232F3E |
| GCP | Cloud | #4285F4 |
| Azure | Cloud | #0078D4 |
| Vercel | Cloud | #000000 |
| Netlify | Cloud | #00C7B7 |
| Cloudflare | Cloud | #F38020 |

### DevOps・インフラ（6個）

| name | category | color |
|------|----------|-------|
| Docker | Infrastructure | #2496ED |
| Kubernetes | Infrastructure | #326CE5 |
| Terraform | Infrastructure | #7B42BC |
| GitHub Actions | Infrastructure | #2088FF |
| Jenkins | Infrastructure | #D24939 |
| GitLab CI | Infrastructure | #FC6D26 |

### モバイル（3個）

| name | category | color |
|------|----------|-------|
| React Native | Mobile | #61DAFB |
| Flutter | Mobile | #02569B |
| Expo | Mobile | #000020 |

### ツール（7個）

| name | category | color |
|------|----------|-------|
| Git | Tools | #F05032 |
| GitHub | Tools | #181717 |
| VS Code | Tools | #007ACC |
| Webpack | Tools | #8DD6F9 |
| Vite | Tools | #646CFF |
| ESLint | Tools | #4B32C3 |
| Prettier | Tools | #F7B93E |

### テスト（4個）

| name | category | color |
|------|----------|-------|
| Jest | Testing | #C21325 |
| Vitest | Testing | #6E9F18 |
| Cypress | Testing | #17202C |
| Playwright | Testing | #2EAD33 |

### AI・機械学習（4個）

| name | category | color |
|------|----------|-------|
| TensorFlow | AI/ML | #FF6F00 |
| PyTorch | AI/ML | #EE4C2C |
| OpenAI | AI/ML | #412991 |
| LangChain | AI/ML | #1C3C3C |

---

## 合計: 67個の技術

---

## シードデータに含まれる関連データ

### UserTechnology（ユーザーの技術スタック）

以下の5人のテストユーザーに技術スタックが関連付けられます：

#### Alice Developer（フロントエンド）
- React
- TypeScript
- Next.js
- Tailwind CSS

#### Bob Backend（バックエンド）
- Node.js
- Python
- Go
- AWS
- PostgreSQL

#### Charlie FullStack（フルスタック）
- React
- Next.js
- TypeScript
- PostgreSQL
- Supabase

#### Diana Mobile（モバイル）
- React Native
- TypeScript
- Node.js
- Flutter

#### Eva DevOps（DevOps）
- Docker
- Kubernetes
- AWS
- Go
- Terraform

### SourceTechnology（RSSソースの技術分類）

以下の5つのRSSソースに技術タグが関連付けられます：

#### DEV Community
- React
- TypeScript
- Node.js
- Python

#### The Go Blog
- Go

#### React Blog
- React
- Next.js
- TypeScript

#### Zenn
- React
- TypeScript
- Next.js

#### Qiita
- Python
- Node.js
- TypeScript

---

## カラーコードについて

各技術のカラーコードは、公式ブランドカラーまたは一般的に使用されているカラーです。

### カラーの使用例

```typescript
// 背景色として使用（透明度20%）
style={{ backgroundColor: `${tech.color}20` }}

// 文字色として使用
style={{ color: tech.color }}

// ボーダー色として使用（透明度40%）
style={{ borderColor: `${tech.color}40` }}
```

### UI表示イメージ

```
┌─────────────────────────────────┐
│  技術スタック                    │
│  ┌───────────────────────────┐  │
│  │ React  TypeScript         │  │
│  │ ↑青背景  ↑青文字          │  │
│  │                           │  │
│  │ Next.js  Tailwind CSS     │  │
│  └───────────────────────────┘  │
└─────────────────────────────────┘
```

---

## カスタマイズ方法

### 新しい技術を追加

`prisma/seed.ts` の `technologiesData` 配列に追加：

```typescript
const technologiesData = [
  // 既存の技術...
  
  // 新しい技術を追加
  { name: "Bun", category: "Runtime", color: "#FBF0DF" },
  { name: "Deno", category: "Runtime", color: "#000000" },
];
```

### カテゴリーを追加

新しいカテゴリーを自由に追加できます：

```typescript
{ name: "SomeNewTech", category: "NewCategory", color: "#FFFFFF" },
```

### 技術を削除

不要な技術を配列から削除するだけです。

---

## トラブルシューティング

### エラー: "Technology not found"

ユーザーまたはRSSソースに関連付けようとした技術が `technologiesData` に存在しない場合に発生します。

**対処法**:
1. エラーメッセージで表示された技術名を確認
2. `technologiesData` にその技術が含まれているか確認
3. 含まれていない場合は追加するか、関連付けを削除

### エラー: "Unique constraint failed"

同じ技術名を複数回作成しようとした場合に発生します。

**対処法**:
1. データベースをリセット: `pnpm db:reset`
2. または、重複する技術名を削除

### データが反映されない

**対処法**:
1. Dockerコンテナが起動しているか確認: `docker ps`
2. データベース接続文字列を確認: `.env` の `DATABASE_URL`
3. キャッシュクリア: `rm -rf node_modules/.prisma`
4. 再度スキーマを反映: `pnpm db:push`
5. シード再実行: `pnpm db:seed`

---

## 本番環境での注意事項

### ⚠️ 重要な注意点

1. **seed.tsは開発環境専用**
   - 本番環境では `prisma migrate deploy` を使用
   - シードデータは開発・テスト用

2. **既存データの削除**
   - `seed.ts` は既存データを**すべて削除**します
   - 本番環境では絶対に実行しないでください

3. **本番環境での技術追加**
   - 管理画面を作成してGUIで追加
   - または、専用のマイグレーションスクリプトを作成

### 本番環境での技術追加例

```typescript
// scripts/add-technology.ts
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function addTechnology() {
  await prisma.technology.create({
    data: {
      name: "NewTechnology",
      category: "Category",
      color: "#FFFFFF"
    }
  });
}

addTechnology()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
```

---

## 関連ファイル

- **シードスクリプト**: `prisma/seed.ts`
- **スキーマ定義**: `prisma/schema.prisma`
- **パッケージ設定**: `package.json` (prisma.seed)
- **使用方法**: `docs/technologies-usage-guide.md`

---

## まとめ

### シード実行の流れ

1. ✅ Dockerコンテナ起動
2. ✅ `pnpm db:seed` 実行
3. ✅ Prisma Studio で確認
4. ✅ アプリケーションで使用

### 登録される技術

- **合計67個**の技術が10のカテゴリーに分類
- 各技術にブランドカラーが設定済み
- テストユーザーに技術スタックが関連付け
- RSSソースに技術タグが関連付け

### 次のステップ

1. シードデータを投入
2. Prisma Studio でデータ確認
3. アプリケーションを起動して動作確認
4. 必要に応じて技術を追加・カスタマイズ

---

**作成日**: 2025-11-19  
**更新日**: 2025-11-19  
**バージョン**: 1.0

