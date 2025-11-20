# Technologiesテーブル単独初期化ガイド

## 概要

`technologies`テーブルのみを初期化するための専用スクリプトです。既存のユーザーデータやRSSデータを保持したまま、技術スタックのマスターデータだけを更新できます。

---

## 使用方法

### 基本コマンド

```bash
# technologiesテーブルのみを初期化
pnpm db:seed-tech
```

### 実行される処理

1. 既存の技術データを更新（upsert）
   - 既存の技術: `category`と`color`を更新
   - 新しい技術: 新規作成

2. 既存の関連データは**保持される**
   - `user_technologies`: ユーザーの技術スタック関連付けは維持
   - `source_technologies`: RSSソースの技術関連付けは維持

---

## 特徴

### ✅ データを保持

以下のデータは**削除されません**：

- ユーザーデータ（`users`）
- ユーザーの技術スタック（`user_technologies`）
- RSSソースデータ（`rss_sources`）
- RSSソースの技術分類（`source_technologies`）
- RSS記事データ（`rss_entries`）
- その他すべてのデータ

### ✅ 安全な更新

- **Upsert処理**を使用
  - 既存の技術: 更新のみ（IDは変更されない）
  - 新しい技術: 新規作成
  - 削除された技術: データベースに残る（手動削除が必要）

### ✅ 既存の関連付けを維持

例えば、ユーザーが「React」を技術スタックに設定している場合：

**実行前**:
```
users → user_technologies → technologies (React)
```

**実行後**:
```
users → user_technologies → technologies (React) ← 色やカテゴリーが更新される
```

関連付けは維持され、技術の詳細情報（`category`, `color`）のみが更新されます。

---

## 実行例

### コマンド実行

```bash
$ pnpm db:seed-tech
```

### 出力例

```
🌱 Technologiesデータの投入を開始します...

📊 Technologiesデータを投入中...
✅ Technologiesデータ投入完了
   新規作成: 15個
   更新: 52個
   合計: 67個

📊 現在のTechnologies総数: 67個

🎉 Technologiesデータの投入が完了しました！
```

---

## 登録される技術

### 合計67個の技術

- **フロントエンド**: 6個（React, Vue.js, Angular等）
- **フレームワーク**: 4個（Next.js, Nuxt.js, Remix等）
- **プログラミング言語**: 11個（TypeScript, JavaScript, Python等）
- **バックエンド**: 9個（Node.js, Express, NestJS等）
- **データベース**: 7個（PostgreSQL, MySQL, MongoDB等）
- **クラウド**: 6個（AWS, GCP, Azure等）
- **DevOps・インフラ**: 6個（Docker, Kubernetes, Terraform等）
- **モバイル**: 3個（React Native, Flutter, Expo）
- **ツール**: 7個（Git, GitHub, VS Code等）
- **テスト**: 4個（Jest, Vitest, Cypress等）
- **AI・機械学習**: 4個（TensorFlow, PyTorch, OpenAI等）

詳細なリストは `docs/technologies-seed-guide.md` を参照してください。

---

## 使用シーン

### 1. 技術情報の更新

技術のカラーやカテゴリーを変更したい場合：

```typescript
// scripts/seed-technologies.ts を編集
{ name: "React", category: "Frontend", color: "#61DAFB" }
// ↓ カラーを変更
{ name: "React", category: "Frontend", color: "#00D8FF" }
```

実行後、既存のReact技術のカラーが更新されます。

### 2. 新しい技術の追加

新しい技術を追加したい場合：

```typescript
// scripts/seed-technologies.ts に追加
{ name: "Bun", category: "Runtime", color: "#FBF0DF" },
{ name: "Deno", category: "Runtime", color: "#000000" },
```

実行後、新しい技術がデータベースに追加されます。

### 3. 本番環境での技術マスター更新

開発環境で技術リストを更新し、本番環境に反映する場合：

```bash
# 開発環境で実行してテスト
pnpm db:seed-tech

# 本番環境で実行
DATABASE_URL="本番DB接続文字列" pnpm db:seed-tech
```

---

## 通常のシードとの違い

| 項目 | `db:seed` | `db:seed-tech` |
|-----|-----------|----------------|
| **対象テーブル** | 全テーブル | `technologies`のみ |
| **既存データ削除** | ✅ 全削除 | ❌ 削除しない |
| **実行時間** | 長い（全データ作成） | 短い（技術のみ） |
| **安全性** | ⚠️ 全データ消失 | ✅ 既存データ保持 |
| **使用場面** | 開発環境リセット | 技術マスター更新 |

---

## カスタマイズ

### 技術の追加

`scripts/seed-technologies.ts` の `technologiesData` 配列に追加：

```typescript
const technologiesData = [
  // 既存の技術...
  
  // 新しい技術を追加
  { name: "Bun", category: "Runtime", color: "#FBF0DF" },
  { name: "Deno", category: "Runtime", color: "#000000" },
  { name: "Zig", category: "Language", color: "#F7A41D" },
];
```

### 技術の削除

**注意**: スクリプトからデータを削除しても、データベースからは削除されません。

手動で削除する必要があります：

```sql
-- Prisma Studio または SQL で削除
DELETE FROM technologies WHERE name = 'OldTechnology';
```

または、関連付けがない場合のみ削除するスクリプトを作成：

```typescript
// 使用されていない技術を削除
const unusedTechs = await prisma.technology.findMany({
  where: {
    AND: [
      { userTechnologies: { none: {} } },
      { sourceTechnologies: { none: {} } },
    ],
  },
});

for (const tech of unusedTechs) {
  await prisma.technology.delete({ where: { id: tech.id } });
}
```

---

## トラブルシューティング

### エラー: "Database connection failed"

**原因**: データベースが起動していない

**対処法**:
```bash
# Dockerコンテナを起動
docker compose up -d

# 接続確認
docker ps
```

### エラー: "Foreign key constraint failed"

**原因**: 技術を削除しようとしたが、関連データが存在する

**対処法**:
- 削除する技術に関連する`user_technologies`や`source_technologies`を先に削除
- または、その技術は削除せず更新のみにする

### 実行結果が反映されない

**対処法**:
1. Prisma Studioで確認: `pnpm db:studio`
2. キャッシュクリア: アプリケーションを再起動
3. Prisma Clientを再生成: `npx prisma generate`

---

## 実装の詳細

### Upsert処理

```typescript
await prisma.technology.upsert({
  where: { name: tech.name },        // nameで検索
  update: {                          // 既存の場合: 更新
    category: tech.category,
    color: tech.color,
  },
  create: {                          // 存在しない場合: 作成
    name: tech.name,
    category: tech.category,
    color: tech.color,
  },
});
```

- `name`をユニークキーとして使用
- 既存の技術: `category`と`color`を更新
- 新しい技術: 新規レコードを作成
- `id`は変更されない（関連付けが維持される）

---

## 本番環境での使用

### ⚠️ 注意事項

1. **バックアップを取る**
   ```bash
   pg_dump -h localhost -U user techtok-db > backup.sql
   ```

2. **まず開発環境でテスト**
   ```bash
   pnpm db:seed-tech
   ```

3. **本番環境で実行**
   ```bash
   DATABASE_URL="本番DB接続文字列" pnpm db:seed-tech
   ```

4. **動作確認**
   - Prisma Studioで確認
   - アプリケーションで表示確認

---

## 関連ファイル

- **スクリプト**: `scripts/seed-technologies.ts`
- **実行コマンド**: `package.json` (db:seed-tech)
- **技術一覧**: `docs/technologies-seed-guide.md`
- **使用方法**: `docs/technologies-usage-guide.md`

---

## まとめ

### メリット

✅ **安全**: 既存データを削除しない  
✅ **高速**: 技術データのみを更新  
✅ **柔軟**: 新しい技術を簡単に追加  
✅ **保守性**: 関連付けを維持したまま更新  

### 実行手順

1. `scripts/seed-technologies.ts`を編集（必要に応じて）
2. `pnpm db:seed-tech`を実行
3. Prisma Studioで確認
4. アプリケーションで動作確認

---

**作成日**: 2025-11-19  
**更新日**: 2025-11-19  
**バージョン**: 1.0

