# TechTok 開発コマンド一覧

## 開発サーバー
```bash
# Next.js開発サーバー起動 (http://localhost:3000)
pnpm dev

# Storybook起動 (http://localhost:6006)
pnpm storybook

# 本番ビルド
pnpm build

# 本番サーバー起動
pnpm start
```

## コード品質
```bash
# リンター実行（自動修正あり）
pnpm lint

# フォーマッター実行
pnpm format
```

## データベース関連
```bash
# PostgreSQLをDockerで起動
docker compose up -d

# PostgreSQL停止
docker compose down

# Prisma Studio起動（GUI） (http://localhost:5555)
pnpm db:studio

# データベーススキーマ適用
pnpm db:push

# Prismaクライアント生成
npx prisma generate

# シードデータ投入（全データ）
pnpm db:seed

# 技術スタックデータのみ投入
pnpm db:seed-tech

# RSSソースデータのみ投入
pnpm db:seed-rss-source

# データベース完全リセット + シード実行
pnpm db:reset
```

## トラブルシューティング
```bash
# PostgreSQL接続エラー時
docker compose ps        # コンテナ状態確認
docker compose logs db   # ログ確認
docker compose restart db # 再起動

# データベース完全リセット
docker compose down -v
rm -rf docker-psql/data
docker compose up -d

# node_modules リセット
rm -rf node_modules pnpm-lock.yaml
pnpm install

# Prismaクライアント再生成
npx prisma generate
```

## Git関連
```bash
# 作業ブランチ作成（developから分岐）
git checkout develop
git pull origin develop
git checkout -b feature/your-feature-name
```

## システムコマンド（Darwin/macOS）
```bash
# ディレクトリ一覧
ls -la

# ファイル検索
find . -name "*.ts"

# テキスト検索
grep -r "pattern" .

# プロセス確認
ps aux | grep node

# ポート使用確認
lsof -i :3000
```
