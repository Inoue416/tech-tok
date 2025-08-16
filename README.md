# TechTok <img src="./readme-assets/icon.svg" alt="icon" width="32" />

エンジニア向けの技術情報を縦スクロール（TikTok風）で楽しめるアプリケーションです。技術ブログやRSSフィードから記事を取得し、要約して提供します。

## 🎯 概要

TechTokは、忙しいエンジニアが効率的に技術情報をキャッチアップできることを目指したアプリです。

### ターゲットユーザー
- エンジニア
- ディレクター  
- 学生
- エンジニアを目指す転職者

### 主要機能
- 📱 TikTok風縦スクロール UI
- 📰 技術記事・ブログの要約表示
- 🔖 記事のブックマーク・いいね
- 👥 ユーザーフォロー機能
- 🏷️ ハッシュタグによる分類
- 🔍 技術スタック別フィルタリング

## 🛠️ 技術スタック

### Frontend
- **Next.js 15** - React フレームワーク
- **TypeScript** - 型安全なJavaScript
- **Tailwind CSS** - ユーティリティファーストCSS
- **Shadcn UI** + **Radix UI** - UIコンポーネント
- **Storybook** - コンポーネント開発・テスト

### Backend・Database
- **Prisma** - ORMとデータベースツール
- **PostgreSQL** - リレーショナルデータベース
- **Auth.js (NextAuth.js)** - 認証システム（Google・GitHub OAuth）

### Development・Tools
- **Biome.js** - リンター・フォーマッター
- **Docker Compose** - ローカル開発環境
- **pnpm** - パッケージマネージャー

### Deployment（予定）
- **Vercel** - フロントエンドデプロイ
- **Supabase** - マネージドPostgreSQL

## 🚀 開発環境セットアップ

### 必要な環境
- Node.js 18+
- pnpm 
- Docker & Docker Compose

### 1. リポジトリのクローン
```bash
git clone <repository-url>
cd tech-tok
```

### 2. 依存関係のインストール
```bash
pnpm install
```

### 3. 環境変数の設定
```bash
# .env.localファイルを作成（.env.sampleを参考に）
cp .env.sample .env.local

# 必要に応じて編集
vim .env.local
```

### 4. データベースの起動
```bash
# PostgreSQLをDockerで起動
docker compose up -d

# データベースの状態確認
docker compose ps
```

### 5. データベースセットアップ
```bash
# Prismaクライアント生成
DATABASE_URL="postgresql://user:password@localhost:5432/techtok-db" npx prisma generate

# データベーススキーマ適用
DATABASE_URL="postgresql://user:password@localhost:5432/techtok-db" npx prisma db push

# 開発用データ投入
DATABASE_URL="postgresql://user:password@localhost:5432/techtok-db" pnpm db:seed
```

### 6. 開発サーバー起動
```bash
# Next.jsアプリケーション起動
pnpm dev
# → http://localhost:3000

# Storybook起動（別ターミナル）
pnpm storybook  
# → http://localhost:6006

# Prisma Studio起動（別ターミナル）
DATABASE_URL="postgresql://user:password@localhost:5432/techtok-db" pnpm db:studio
# → http://localhost:5555
```

## 🔧 開発用コマンド

### データベース関連
```bash
# シードデータ投入
pnpm db:seed

# データベース完全リセット + シード実行
pnpm db:reset

# データベーススキーマ適用
pnpm db:push

# Prisma Studio起動（GUI）
pnpm db:studio
```

### 開発・ビルド
```bash
# 開発サーバー起動
pnpm dev

# 本番ビルド
pnpm build

# 本番サーバー起動
pnpm start

# Storybook起動
pnpm storybook
```

### コード品質
```bash
# リンター実行
pnpm lint

# フォーマッター実行  
pnpm format
```

## 📊 データベース構成

### 主要テーブル
- **users** - ユーザー情報（Auth.js統合）
- **accounts** - OAuth アカウント情報
- **posts** - ユーザー投稿
- **rss_sources** - RSS情報源
- **rss_entries** - RSS記事
- **feed_items** - 統合フィード（RSS + 投稿）
- **likes, bookmarks, comments** - インタラクション
- **technologies, hashtags** - 分類・タグ

### 開発用データ
シードデータで以下のテストデータが投入されます：
- 👥 5人のテストユーザー（各専門分野）
- 🔧 10種類の技術スタック
- 📰 5つのRSS記事 + 5つのユーザー投稿  
- 🤝 ソーシャル機能のテストデータ

詳細は [`docs/seed-data-specification.md`](./docs/seed-data-specification.md) を参照。

## 📁 プロジェクト構成

```
tech-tok/
├── src/                    # アプリケーションコード
│   ├── components/         # Reactコンポーネント
│   ├── lib/               # ユーティリティ・設定
│   ├── types/             # TypeScript型定義
│   └── app/               # Next.js App Router
├── prisma/                # データベース関連
│   ├── schema.prisma      # データベーススキーマ
│   └── seed.ts           # シードデータ
├── docs/                  # ドキュメント
├── scripts/               # ユーティリティスクリプト
└── docker-compose.yaml    # ローカル開発環境
```

## 🔑 認証設定（OAuth）

Google・GitHub OAuthを使用するには、以下の設定が必要です：

### Google OAuth設定
1. [Google Cloud Console](https://console.cloud.google.com/)でプロジェクト作成
2. OAuth 2.0 クライアントIDを作成
3. `.env.local`に設定：
```bash
AUTH_GOOGLE_ID="your-google-client-id"
AUTH_GOOGLE_SECRET="your-google-client-secret"
```

### GitHub OAuth設定  
1. [GitHub Settings > Developer settings](https://github.com/settings/developers)
2. OAuth Appを作成
3. `.env.local`に設定：
```bash
AUTH_GITHUB_ID="your-github-client-id"
AUTH_GITHUB_SECRET="your-github-client-secret"
```

## 🐛 トラブルシューティング

### データベース関連
```bash
# PostgreSQL接続エラー
docker compose ps        # コンテナ状態確認
docker compose logs db   # ログ確認
docker compose restart db # 再起動

# データベース完全リセット
docker compose down -v
rm -rf docker-psql/data
docker compose up -d
```

### 依存関係関連
```bash
# node_modules リセット
rm -rf node_modules pnpm-lock.yaml
pnpm install

# Prismaクライアント再生成
npx prisma generate
```

## 📚 開発ガイド

- 📋 [データベース設計書](./docs/prisma-design-document.md)
- 📋 [実装計画書](./docs/prisma-implementation-plan.md)
- 📊 [シードデータ仕様](./docs/seed-data-specification.md)
- 🌿 [Gitブランチ戦略](./branch-strategy.md)

## 🤝 開発ルール

### ブランチ戦略
```bash
# 作業ブランチ作成（developから分岐）
git checkout develop
git pull origin develop
git checkout -b feature/your-feature-name

# prefixルール
# feature/xxx  - 新機能
# fix/xxx      - バグ修正  
# docs/xxx     - ドキュメント
# refactor/xxx - リファクタリング
```

### コンポーネント作成ルール
- 新しいコンポーネント作成時は、同時にStorybookファイルも作成
- APIコール部分はmockingしてStorybook動作確認

## 📄 ライセンス

MIT License

## 👥 貢献

Issues・Pull Requestsお待ちしております！

---

**最終更新**: 2025-08-16