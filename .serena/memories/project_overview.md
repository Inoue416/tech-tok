# TechTok プロジェクト概要

## プロジェクトの目的
TechTokは、エンジニア向けの技術情報をTikTok風の縦スクロールUIで楽しめるWebアプリケーションです。技術ブログやRSSフィードから記事を取得し、要約して提供します。

## ターゲットユーザー
- エンジニア
- ディレクター
- 学生
- エンジニアを目指す転職者

## 主要機能
- TikTok風縦スクロール UI
- 技術記事・ブログの要約表示
- 記事のブックマーク・いいね
- ユーザーフォロー機能
- ハッシュタグによる分類
- 技術スタック別フィルタリング

## 技術スタック

### Frontend
- **Next.js 15.4** - React フレームワーク（App Router使用）
- **React 19** - UIライブラリ
- **TypeScript 5.9** - 型安全なJavaScript
- **Tailwind CSS 4** - ユーティリティファーストCSS
- **Shadcn UI** + **Radix UI** - UIコンポーネント
- **Storybook 10** - コンポーネント開発・テスト

### Backend・Database
- **Prisma 7** - ORMとデータベースツール
- **PostgreSQL 16** - リレーショナルデータベース
- **Better Auth 1.3** - 認証システム（Google・GitHub OAuth）

### Development・Tools
- **Biome.js 2.3** - リンター・フォーマッター
- **Docker Compose** - ローカル開発環境（PostgreSQL）
- **pnpm** - 高速パッケージマネージャー
- **tsx** - TypeScriptスクリプト実行

### Deployment（予定）
- **Vercel** - フロントエンドデプロイ
- **Supabase** - マネージドPostgreSQL
