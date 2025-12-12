# TechTok コードベース構造

## ディレクトリ構成

```
tech-tok/
├── src/                        # アプリケーションコード
│   ├── app/                    # Next.js App Router
│   │   ├── actions/            # Server Actions
│   │   ├── api/                # API Routes
│   │   ├── login/              # ログインページ
│   │   ├── feed/               # フィードページ
│   │   ├── bookmarks/          # ブックマークページ
│   │   ├── profile/            # プロフィールページ
│   │   ├── account-deleted/    # アカウント削除ページ
│   │   ├── layout.tsx          # ルートレイアウト
│   │   ├── page.tsx            # ホームページ
│   │   └── globals.css         # グローバルスタイル
│   ├── components/             # Reactコンポーネント
│   │   ├── layout/             # レイアウトコンポーネント
│   │   └── ui/                 # 共通UIコンポーネント（Shadcn UI）
│   ├── features/               # 機能別コンポーネント
│   │   ├── auth/               # 認証関連
│   │   ├── feed/               # フィード関連
│   │   ├── bookmarks/          # ブックマーク関連
│   │   ├── profile/            # プロフィール関連
│   │   ├── interactions/       # インタラクション関連
│   │   └── test-space/         # テスト用
│   ├── lib/                    # ユーティリティ・設定
│   │   ├── prisma.ts           # Prismaクライアント
│   │   ├── auth.ts             # Better Auth設定
│   │   ├── auth-client.ts      # 認証クライアント
│   │   ├── utils.ts            # ユーティリティ関数
│   │   └── __mocks__/          # モック
│   ├── types/                  # TypeScript型定義
│   └── generated/              # 生成ファイル（Prisma）
├── prisma/                     # データベース関連
│   ├── schema.prisma           # データベーススキーマ
│   └── seed.ts                 # シードデータ
├── docs/                       # ドキュメント
├── scripts/                    # ユーティリティスクリプト
├── public/                     # 静的ファイル
├── docker-psql/                # Docker PostgreSQLデータ
├── .storybook/                 # Storybook設定
├── .github/                    # GitHub Actions
└── docker-compose.yaml         # ローカル開発環境
```

## 主要ファイル

### 設定ファイル
- `package.json` - 依存関係とスクリプト
- `tsconfig.json` - TypeScript設定
- `biome.json` - リンター・フォーマッター設定
- `next.config.ts` - Next.js設定
- `prisma.config.ts` - Prisma設定
- `components.json` - Shadcn UI設定

### データベーステーブル（主要）
- `users` - ユーザー情報
- `accounts` - OAuthアカウント情報
- `sessions` - セッション管理
- `posts` - ユーザー投稿
- `rss_sources` - RSS情報源
- `rss_entries` - RSS記事
- `feed_items` - 統合フィード（RSS + 投稿）
- `likes`, `bookmarks`, `comments` - インタラクション
- `technologies`, `hashtags` - 分類・タグ
- `follows` - フォロー関係
