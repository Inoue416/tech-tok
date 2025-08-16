# 開発環境用シードデータ仕様書

## 1. 概要
Tech-Tok アプリケーションの開発環境で使用するテストデータの仕様書です。実際の運用を想定したリアルなデータ構造とリレーションを含んでいます。

## 2. 実行方法

### 基本コマンド
```bash
# シードデータ投入
pnpm db:seed

# データベーススキーマ適用 + シード実行
pnpm db:reset

# Prisma Studio でデータ確認
pnpm db:studio
```

### 環境変数
```bash
DATABASE_URL="postgresql://user:password@localhost:5432/techtok-db"
```

## 3. データ構成

### 3.1 ユーザー（5人）
| username | displayName | 役割 | 技術スタック |
|----------|-------------|------|-------------|
| alice_dev | Alice Developer | フロントエンド | React, Next.js, TypeScript |
| bob_backend | Bob Backend | バックエンド | Node.js, Python, Go, AWS, PostgreSQL |
| charlie_fullstack | Charlie FullStack | フルスタック | React, Next.js, TypeScript, PostgreSQL |
| diana_mobile | Diana Mobile | モバイル | React, TypeScript, Node.js |
| eva_devops | Eva DevOps | DevOps | Docker, Kubernetes, AWS, Go |

### 3.2 技術スタック（10個）
| 技術名 | カテゴリ | 人気度 | カラーコード |
|--------|----------|---------|--------------|
| React | Frontend | ⭐⭐⭐ | #61DAFB |
| TypeScript | Language | ⭐⭐⭐ | #3178C6 |
| Next.js | Framework | ⭐⭐ | #000000 |
| Node.js | Backend | ⭐⭐ | #339933 |
| AWS | Cloud | ⭐⭐ | #232F3E |
| Go | Language | ⭐⭐ | #00ADD8 |
| PostgreSQL | Database | ⭐⭐ | #336791 |
| Python | Language | ⭐ | #3776AB |
| Docker | Infrastructure | ⭐ | #2496ED |
| Kubernetes | Infrastructure | ⭐ | #326CE5 |

### 3.3 RSS情報源（5つ）
| 名称 | URL | 言語 | カテゴリ |
|------|-----|------|----------|
| DEV Community | https://dev.to | EN | General |
| The Go Blog | https://blog.golang.org | EN | Language |
| React Blog | https://react.dev | EN | Frontend |
| Zenn | https://zenn.dev | JA | General |
| Qiita - Popular | https://qiita.com | JA | General |

### 3.4 コンテンツ（10項目）
- **RSS記事**: 5記事（技術ブログからの記事）
- **ユーザー投稿**: 5投稿（各ユーザー1投稿）
- **フィードアイテム**: 10項目（RSS記事 + ユーザー投稿）

### 3.5 インタラクション
- **いいね**: 5個（投稿への評価）
- **ブックマーク**: 3個（保存された投稿）
- **コメント**: 3個（投稿への返信）
- **フォロー**: 8関係（ユーザー同士の関係）

### 3.6 ハッシュタグ（15個）
技術系: `react`, `nextjs`, `typescript`, `nodejs`, `python`, `golang`, `docker`, `kubernetes`, `aws`, `postgresql`
カテゴリ系: `webdev`, `backend`, `frontend`, `tutorial`, `tips`

## 4. データの特徴

### 4.1 リアルなユーザーペルソナ
- 各ユーザーが専門分野を持つ
- 技術スタックが役割と一致
- プロフィール画像付き（Unsplash）

### 4.2 実際の技術記事
- 有名な技術ブログからのサンプル記事
- 日本語・英語の混合コンテンツ
- ハッシュタグによる分類

### 4.3 ソーシャル機能
- ユーザー間のフォロー関係
- 投稿への多様なリアクション
- コメントによる議論

### 4.4 フィード機能
- RSS記事とユーザー投稿の混合
- ランキングスコアによる優先度
- 公開状態の管理

## 5. 開発用途

### 5.1 UI開発
- 各種コンポーネントの表示確認
- レスポンシブデザインのテスト
- ロード状態の確認

### 5.2 機能開発
- ユーザー認証フロー
- フィード表示ロジック
- 検索・フィルタリング
- インタラクション機能

### 5.3 パフォーマンステスト
- データベースクエリの最適化
- ページネーション
- リアルタイム更新

## 6. カスタマイズ

### 6.1 データ追加
```bash
# 既存データを保持したまま追加データ投入
DATABASE_URL="postgresql://user:password@localhost:5432/techtok-db" tsx scripts/add-more-data.ts
```

### 6.2 データリセット
```bash
# 全データ削除 + 再投入
pnpm db:reset
```

### 6.3 特定テーブルのみ操作
prisma/seed.ts を編集して必要な部分のみ実行

## 7. 注意事項

- **本番環境では使用禁止**: このデータは開発専用
- **画像URL**: Unsplashの画像を使用（外部依存）
- **メールアドレス**: example.com ドメインを使用
- **パスワード**: Auth.js経由のOAuth認証のため未設定

## 8. トラブルシューティング

### よくあるエラー
- **接続エラー**: Docker PostgreSQLの起動状況確認
- **重複エラー**: 既存データのクリーンアップが必要
- **外部キー制約エラー**: データの依存関係を確認

### 対処法
```bash
# データベース完全リセット
docker compose down -v
rm -rf docker-psql/data
docker compose up -d
DATABASE_URL="..." pnpm db:push
DATABASE_URL="..." pnpm db:seed
```

---

**作成日**: 2025-08-16  
**更新日**: 2025-08-16  
**バージョン**: 1.0