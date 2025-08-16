# Prisma環境設計書

## 1. プロジェクト概要
- **アプリケーション**: TikTok風のエンジニア向け技術記事アプリ
- **データベース**: PostgreSQL 17
- **ORM**: Prisma 6.14.0（既にインストール済み）
- **認証**: Auth.js（NextAuth.js 5.0.0-beta.29）
- **認証プロバイダー**: Google OAuth, GitHub OAuth

## 2. データベース環境

### 2.1 開発環境
- **ローカル開発**: Docker Compose（PostgreSQL 17）
- **データベース名**: `techtok-db`
- **ユーザー**: `user`
- **パスワード**: `password`
- **接続設定**: localhost:5432
- **接続URL**: `postgresql://user:password@localhost:5432/techtok-db`

### 2.2 本番環境（予定）
- **サービス**: Supabase（PostgreSQL）
- **特徴**: 
  - マネージドPostgreSQL
  - リアルタイム機能
  - 自動バックアップ
  - Row Level Security（RLS）対応
- **接続**: Supabase接続文字列を使用
- **移行方針**: Prismaスキーマは共通、環境変数のみ変更

## 3. Prismaスキーマ設計方針

### 3.1 ID戦略
- **プライマリキー**: CUID2を使用（短く、URL-safe、衝突耐性が高い）
- **外部キー**: 参照先のプライマリキーと同じ形式

### 3.2 認証システム設計
- **Auth.js Prisma Adapter**: 標準のAuth.jsアダプターを使用（Userテーブルのみ）
- **セッション管理**: JWT（クッキーベース）- データベースセッションは使用しない
- **必要テーブル**: Account, VerificationToken（Sessionテーブルは不要）
- **ユーザーテーブル統合**: 既存のUSERテーブルとAuth.jsのUserテーブルを統合
- **プロバイダー対応**: Google OAuth, GitHub OAuthの設定

### 3.3 データ設計原則
- **リレーション**: 外部キー制約を適切に設定
- **複合ユニーク制約**: データベーススキーマ設計書に記載された制約を実装
- **インデックス**: パフォーマンス最適化のため適切なインデックスを配置
- **データ整合性**: 参照整合性と一意性制約を厳格に管理
- **Supabase対応**: Row Level Security（RLS）ポリシーとの互換性を考慮
- **環境間移行**: ローカル開発環境からSupabaseへのスムーズな移行

## 4. 主要テーブル群

### 4.1 認証関連（Auth.js標準）
- **User**: 統合ユーザーテーブル
- **Account**: OAuth アカウント情報
- **VerificationToken**: メール認証等のトークン
- **セッション**: JWT（クッキー）で管理、データベースには保存しない

### 4.2 アプリケーション固有テーブル
1. **ユーザー関連**: FOLLOW, USER_TECHNOLOGY
2. **コンテンツ関連**: POST, RSS_ENTRY, FEED_ITEM
3. **インタラクション関連**: LIKE, BOOKMARK, COMMENT, POST_SHARE
4. **分類・タグ関連**: HASHTAG, TECHNOLOGY, POST_HASHTAG, RSS_ENTRY_HASHTAG
5. **RSS管理関連**: RSS_SOURCE, RSS_FETCH_LOG, RSS_ENCLOSURE, SOURCE_TECHNOLOGY
6. **システム関連**: NOTIFICATION

## 5. 複合ユニーク制約一覧
- `LIKE(user_id, post_id)`
- `BOOKMARK(user_id, post_id)`
- `FOLLOW(follower_id, following_id)`
- `POST_HASHTAG(post_id, hashtag_id)`
- `USER_TECHNOLOGY(user_id, technology_id)`
- `RSS_ENTRY(source_id, guid)`
- `RSS_ENTRY_HASHTAG(entry_id, hashtag_id)`
- `SOURCE_TECHNOLOGY(source_id, technology_id)`
- `Account(provider, providerAccountId)` - Auth.js標準

## 6. インデックス設計
- **パフォーマンス重要箇所**:
  - RSS_ENTRY.published_at（フィード表示）
  - FEED_ITEM.published_at, rank_score（ランキング）
  - NOTIFICATION.user_id, created_at（通知取得）
  - POST.author_id（ユーザー投稿取得）

## 7. 環境変数設定

### 7.1 開発環境（.env.local）
```
# Database - Local Development
DATABASE_URL="postgresql://user:password@localhost:5432/techtok-db"

# Auth.js
AUTH_SECRET="your-secret-key"
AUTH_GOOGLE_ID="google-client-id"
AUTH_GOOGLE_SECRET="google-client-secret"
AUTH_GITHUB_ID="github-client-id"
AUTH_GITHUB_SECRET="github-client-secret"
```

### 7.2 本番環境（Supabase）
```
# Database - Supabase
DATABASE_URL="postgresql://postgres:[PASSWORD]@[PROJECT_REF].supabase.co:5432/postgres"
# または
DATABASE_URL="postgresql://postgres.[PROJECT_REF]:[PASSWORD]@aws-0-ap-northeast-1.pooler.supabase.com:6543/postgres"

# Auth.js（同じ設定）
AUTH_SECRET="production-secret-key"
AUTH_GOOGLE_ID="google-client-id"
AUTH_GOOGLE_SECRET="google-client-secret"  
AUTH_GITHUB_ID="github-client-id"
AUTH_GITHUB_SECRET="github-client-secret"

# Supabase固有（必要に応じて）
NEXT_PUBLIC_SUPABASE_URL="https://[PROJECT_REF].supabase.co"
NEXT_PUBLIC_SUPABASE_ANON_KEY="your-anon-key"
SUPABASE_SERVICE_ROLE_KEY="your-service-role-key"
```

## 8. データ整合性・制約
- **外部キー制約**: 全ての関連テーブル間で参照整合性を保持
- **NOT NULL制約**: 必須フィールドの明示
- **データ削除**: 論理削除ではなく物理削除を基本とする
- **カスケード削除**: ユーザー削除時の関連データ処理を定義

## 9. 今後の拡張性

### 9.1 Supabase活用機能
- **リアルタイム**: Supabaseのリアルタイム機能を活用したライブ更新
- **Row Level Security**: ユーザーレベルでのデータアクセス制御
- **Edge Functions**: サーバーサイド処理の一部をEdge Functionsで実装
- **Storage**: 画像・動画ファイルの管理

### 9.2 パフォーマンス最適化
- **統計テーブル**: 高頻度アクセスが必要な場合のマテリアライズドビュー
- **キャッシュレイヤー**: Redis等の導入検討
- **フルテキスト検索**: PostgreSQLのフルテキスト検索機能活用
- **パーティショニング**: 大量データ対応時のテーブル分割

### 9.3 環境移行戦略
- **段階的移行**: ローカル開発 → Supabase開発環境 → 本番環境
- **データマイグレーション**: Prisma migrateとSupabaseの組み合わせ
- **バックアップ戦略**: Supabase自動バックアップ + 定期的なダンプ

---

**作成日**: 2025-08-16  
**更新日**: 2025-08-16  
**バージョン**: 1.0