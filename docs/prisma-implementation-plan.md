# Prisma実装計画書

## 1. 実装概要
- **目的**: データベーススキーマに基づくPrisma環境の構築
- **対象環境**: ローカル開発環境（Docker PostgreSQL）
- **将来対応**: Supabaseへの移行準備
- **実装期間**: 1-2時間程度

## 2. 実装ステップ

### ステップ1: 環境変数設定
**目的**: データベース接続とAuth.js設定
**作業内容**:
- `.env.local` ファイルの作成
- DATABASE_URL の設定
- AUTH_SECRET の生成・設定
- OAuth設定用の環境変数準備

**成果物**:
- `.env.local` ファイル
- 更新された `.env.sample` ファイル

### ステップ2: Prismaスキーマファイル作成
**目的**: データベーススキーマの定義
**作業内容**:
- `prisma/schema.prisma` ファイルの作成
- Prismaクライアント設定
- データベースプロバイダー設定（PostgreSQL）
- Auth.jsアダプター用テーブル定義
- アプリケーション固有テーブル定義

**成果物**:
- `prisma/schema.prisma` ファイル

### ステップ3: 認証テーブル実装
**目的**: Auth.js（NextAuth.js）対応テーブルの定義
**作業内容**:
- User テーブル（統合設計）
- Account テーブル（OAuth情報）
- Session テーブル（セッション管理）
- VerificationToken テーブル（認証トークン）

**注意点**:
- Auth.js Prisma Adapterの標準仕様に準拠
- 既存USERテーブルとの統合を考慮

### ステップ4: アプリケーションテーブル実装
**目的**: TikTok風アプリの機能テーブル定義
**作業内容**:
- ユーザー関連テーブル（FOLLOW, USER_TECHNOLOGY）
- コンテンツテーブル（POST, RSS_ENTRY, FEED_ITEM）
- インタラクションテーブル（LIKE, BOOKMARK, COMMENT, POST_SHARE）
- 分類テーブル（HASHTAG, TECHNOLOGY, POST_HASHTAG等）
- RSS管理テーブル（RSS_SOURCE, RSS_FETCH_LOG等）
- システムテーブル（NOTIFICATION）

**制約設定**:
- 複合ユニーク制約の実装
- 外部キー制約の設定
- インデックスの配置

### ステップ5: Prismaクライアント生成とテスト
**目的**: 生成されたPrismaクライアントの動作確認
**作業内容**:
- `npx prisma generate` の実行
- Prismaクライアントの型定義確認
- 基本的なCRUD操作のテスト準備

### ステップ6: データベースマイグレーション
**目的**: 実際のデータベースへのスキーマ適用
**作業内容**:
- Docker Compose起動確認
- `npx prisma db push` または `npx prisma migrate dev` の実行
- テーブル作成確認

### ステップ7: Auth.js設定ファイル作成
**目的**: Next.js アプリケーションでの認証設定
**作業内容**:
- `auth.config.ts` または類似設定ファイル作成
- Google・GitHub プロバイダー設定
- Prisma アダプター設定
- セッション設定

### ステップ8: 動作確認とテスト
**目的**: Docker ComposeのPostgreSQLとの疎通確認
**作業内容**:
- Docker Compose起動確認
- データベース接続テスト
- Prismaクライアント動作確認
- 基本CRUD操作テスト
- テーブル関連テスト

## 3. 実装順序と依存関係

```
1. 環境変数設定
   ↓
2. Prismaスキーマファイル作成
   ↓
3. 認証テーブル実装
   ↓
4. アプリケーションテーブル実装
   ↓
5. Prismaクライアント生成
   ↓
6. データベースマイグレーション
   ↓
7. Auth.js設定
   ↓
8. 動作確認
```

## 4. 技術的考慮事項

### 4.1 ID戦略
- **主キー**: `@id @default(cuid())` を使用
- **理由**: CUID2は短く、URL-safe、分散システムでの衝突耐性が高い

### 4.2 リレーション設計
- **1対多**: `@relation` を使用した適切な関連付け
- **多対多**: 中間テーブルでの明示的な関連付け
- **自己参照**: フォロー機能での自己参照関係

### 4.3 制約とインデックス
- **複合ユニーク制約**: `@@unique([field1, field2])` 
- **インデックス**: `@@index([field])` でパフォーマンス最適化
- **カスケード**: 適切な `onDelete` 設定

### 4.4 型安全性
- **Enum**: 固定値の型安全な管理
- **Optional**: `?` による任意フィールドの明示
- **JSON**: 柔軟なデータ格納が必要な箇所での活用

## 5. エラー対応と注意点

### 5.1 よくあるエラー
- **接続エラー**: DATABASE_URL の確認
- **マイグレーションエラー**: 既存データとの競合
- **型エラー**: Prismaクライアント再生成の必要性

### 5.2 デバッグ方法
- `npx prisma studio` でのデータ確認
- `npx prisma db seed` でのテストデータ投入
- ログレベルの調整

## 6. 完了基準

### 6.1 必須要件
- [ ] Prismaスキーマの完成
- [ ] 全テーブルの作成完了  
- [ ] 制約・インデックスの設定完了
- [ ] Prismaクライアントの生成成功
- [ ] データベース接続確認
- [ ] Auth.js基本設定完了

### 6.2 品質基準
- [ ] 型エラーなし
- [ ] リンターエラーなし
- [ ] 基本CRUD操作の動作確認
- [ ] 認証フローの基本動作確認

## 7. データベース疎通テスト詳細

### 7.1 Docker Compose環境確認
```bash
# Docker Composeサービス起動
docker-compose up -d

# PostgreSQLコンテナ状態確認
docker-compose ps
docker-compose logs db

# PostgreSQL接続テスト（直接接続）
docker-compose exec db psql -U user -d techtok-db -c "SELECT version();"
```

### 7.2 Prisma疎通テスト手順

#### 7.2.1 基本接続テスト
```bash
# Prisma接続確認
npx prisma db push --force-reset

# テーブル作成確認
npx prisma studio
# ブラウザでhttp://localhost:5555にアクセスしてテーブル一覧確認
```

#### 7.2.2 CRUD操作テスト
**テストスクリプト作成**: `scripts/test-db-connection.ts`
```typescript
// 基本CRUD操作のテスト
// - User作成・取得・更新・削除
// - Technology作成・User関連付け
// - RSS_SOURCE作成・RSS_ENTRY関連付け
// - 複合ユニーク制約の動作確認
```

#### 7.2.3 リレーション・制約テスト
```bash
# 外部キー制約テスト
# - 存在しないuser_idでのLIKE作成エラー確認
# - カスケード削除の動作確認

# 複合ユニーク制約テスト  
# - 同一user_id + post_idでのLIKE重複作成エラー確認
# - 同一follower_id + following_idでのFOLLOW重複作成エラー確認
```

### 7.3 テスト成功基準
- [ ] Docker ComposeでPostgreSQL起動成功
- [ ] DATABASE_URLでの接続成功
- [ ] 全テーブルがPrisma Studioで確認できる
- [ ] 基本CRUD操作が正常実行
- [ ] 外部キー制約が正常動作
- [ ] 複合ユニーク制約が正常動作
- [ ] リレーション取得が正常動作

### 7.4 トラブルシューティング
- **接続エラー**: `docker-compose ps`でDB状態確認
- **ポート競合**: 5432ポートの使用状況確認
- **権限エラー**: PostgreSQLユーザー権限確認
- **マイグレーションエラー**: `prisma db push --force-reset`で初期化

## 8. 次のステップ
実装完了後の展開：
1. **シードデータ作成**: 開発用のテストデータ投入
2. **API実装**: Next.js API Routesでの基本CRUD実装
3. **UI実装**: 認証画面とフィード画面の実装
4. **Supabase移行準備**: 環境変数とマイグレーション手順の整備

---

**作成日**: 2025-08-16  
**更新日**: 2025-08-16  
**バージョン**: 1.0