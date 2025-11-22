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
- **Next.js 15.4** - React フレームワーク
- **React 19** - UIライブラリ
- **TypeScript 5.9** - 型安全なJavaScript
- **Tailwind CSS 4** - ユーティリティファーストCSS
- **Shadcn UI** + **Radix UI** - UIコンポーネント
- **Storybook 9** - コンポーネント開発・テスト

### Backend・Database
- **Prisma 6.14** - ORMとデータベースツール
- **PostgreSQL 16** - リレーショナルデータベース
- **Better Auth 1.3** - 認証システム（Google・GitHub OAuth）

### Development・Tools
- **Biome.js 2.1** - リンター・フォーマッター
- **Docker Compose** - ローカル開発環境（PostgreSQL）
- **pnpm** - 高速パッケージマネージャー
- **tsx** - TypeScriptスクリプト実行

### Deployment（予定）
- **Vercel** - フロントエンドデプロイ
- **Supabase** - マネージドPostgreSQL

## 🚀 開発環境セットアップ

### 必要な環境
- **Node.js 18+** (推奨: 20以降)
- **pnpm** (npm install -g pnpm でインストール)
- **Docker & Docker Compose** (PostgreSQL用)

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
# .env.localファイルを作成
touch .env.local

# 以下の環境変数を設定
# DATABASE_URL="postgresql://user:password@localhost:5432/techtok-db"
# BETTER_AUTH_SECRET="your-random-secret-key"
# BETTER_AUTH_URL="http://localhost:3000"
# AUTH_GOOGLE_ID="your-google-client-id"
# AUTH_GOOGLE_SECRET="your-google-client-secret"
# AUTH_GITHUB_ID="your-github-client-id"
# AUTH_GITHUB_SECRET="your-github-client-secret"
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
npx prisma generate

# データベーススキーマ適用
pnpm db:push

# 開発用データ投入
pnpm db:seed
```

> 💡 **Note**: 環境変数（DATABASE_URL）は`.env.local`に設定してあることを前提としています。

### 6. 開発サーバー起動
```bash
# Next.jsアプリケーション起動
pnpm dev
# → http://localhost:3000

# Storybook起動（別ターミナル）
pnpm storybook  
# → http://localhost:6006

# Prisma Studio起動（別ターミナル）
pnpm db:studio
# → http://localhost:5555
```

## 🔧 開発用コマンド

### データベース関連
```bash
# シードデータ投入（ユーザー、投稿、RSS等）
pnpm db:seed

# 技術スタックデータのみ投入
pnpm db:seed-tech

# RSSソースデータのみ投入
pnpm db:seed-rss-source

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
- **users** - ユーザー情報（Better Auth統合）
- **accounts** - OAuth アカウント情報
- **sessions** - セッション管理
- **posts** - ユーザー投稿
- **rss_sources** - RSS情報源
- **rss_entries** - RSS記事
- **feed_items** - 統合フィード（RSS + 投稿）
- **likes, bookmarks, comments** - インタラクション
- **technologies, hashtags** - 分類・タグ

### 開発用データ
シードデータ（`pnpm db:seed`）で以下のテストデータが投入されます：
- 👥 **5人のテストユーザー** - フロントエンド、バックエンド等の専門分野別
- 🔧 **主要な技術スタック** - React、Next.js、TypeScript、Python等
- 📰 **RSS記事** - 複数の技術ブログから取得した記事データ
- 📝 **ユーザー投稿** - テキスト・動画投稿のサンプル  
- 🤝 **ソーシャルデータ** - いいね、ブックマーク、コメント、フォロー関係
- 🏷️ **ハッシュタグ** - #react、#typescript等の技術タグ

詳細は [`docs/seed-data-specification.md`](./docs/seed-data-specification.md) を参照してください。

## 📁 プロジェクト構成

```
tech-tok/
├── src/                    # アプリケーションコード
│   ├── app/                # Next.js App Router
│   │   ├── actions/        # Server Actions
│   │   ├── api/           # API Routes
│   │   └── ...            # ページコンポーネント
│   ├── components/         # Reactコンポーネント
│   │   ├── layout/        # レイアウトコンポーネント
│   │   └── ui/            # 共通UIコンポーネント
│   ├── features/          # 機能別コンポーネント
│   │   ├── auth/          # 認証関連
│   │   ├── feed/          # フィード関連
│   │   ├── bookmarks/     # ブックマーク関連
│   │   └── profile/       # プロフィール関連
│   ├── lib/               # ユーティリティ・設定
│   └── types/             # TypeScript型定義
├── prisma/                # データベース関連
│   ├── schema.prisma      # データベーススキーマ
│   └── seed.ts           # シードデータ
├── docs/                  # ドキュメント
├── scripts/               # ユーティリティスクリプト
├── public/                # 静的ファイル
└── docker-compose.yaml    # ローカル開発環境
```

## 🔑 認証設定（Better Auth）

Better Authを使用したGoogle・GitHub OAuth認証の設定方法：

### Google OAuth設定
1. [Google Cloud Console](https://console.cloud.google.com/)でプロジェクト作成
2. 「APIとサービス」→「認証情報」→「OAuth 2.0 クライアントID」を作成
3. 承認済みのリダイレクトURIに追加：
   - `http://localhost:3000/api/auth/callback/google`
4. `.env.local`に設定：
```bash
AUTH_GOOGLE_ID="your-google-client-id"
AUTH_GOOGLE_SECRET="your-google-client-secret"
```

### GitHub OAuth設定  
1. [GitHub Settings > Developer settings](https://github.com/settings/developers)
2. 「OAuth Apps」→「New OAuth App」を作成
3. Authorization callback URLに設定：
   - `http://localhost:3000/api/auth/callback/github`
4. `.env.local`に設定：
```bash
AUTH_GITHUB_ID="your-github-client-id"
AUTH_GITHUB_SECRET="your-github-client-secret"
```

### Better Auth認証シークレット
```bash
# ランダムな文字列を生成して設定
BETTER_AUTH_SECRET="your-random-secret-key-min-32-characters"
BETTER_AUTH_URL="http://localhost:3000"
```

> 💡 **Tip**: `BETTER_AUTH_SECRET`は`openssl rand -base64 32`で生成できます。

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

**最終更新**: 2025-11-20