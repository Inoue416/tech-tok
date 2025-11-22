# 実装タスクリスト

## 1. Better Auth認証システムのセットアップ

Better Authをインストールし、Google/GitHub OAuthプロバイダーを設定します。認証フローの基盤を構築します。

- [ ] 1.1 Better Authパッケージのインストールと初期設定
  - `pnpm uninstall next-auth @auth/prisma-adapter` を実行
  - `pnpm install better-auth` を実行
  - `src/lib/auth.ts` にBetter Auth設定を作成
  - 環境変数を `.env.local` に追加（BETTER_AUTH_SECRET, BETTER_AUTH_URL等）
  - _要件: 6.1, 6.2, 6.3_

- [ ] 1.2 OAuth プロバイダーの設定
  - Google OAuth プロバイダーを設定
  - GitHub OAuth プロバイダーを設定
  - Prisma アダプターを設定
  - _要件: 6.1, 6.2, 6.4_

- [ ] 1.3 認証APIエンドポイントの作成
  - `app/api/auth/[...all]/route.ts` を作成
  - Better Auth ハンドラーを実装
  - _要件: 6.3, 6.5_


## 2. ログインページの実装

OAuth認証を使用したログインUIを構築します。

- [ ] 2.1 ログインページコンポーネントの作成
  - `app/(auth)/login/page.tsx` を作成
  - ログインカードUIを実装
  - アプリロゴとタイトルを表示
  - _要件: 6.1, 6.2_

- [ ] 2.2 OAuthボタンコンポーネントの実装
  - `features/auth/components/oauth-buttons.tsx` を作成
  - Google ログインボタンを実装
  - GitHub ログインボタンを実装
  - Better Auth の signIn 関数を統合
  - _要件: 6.1, 6.2, 6.3_

- [ ] 2.3 認証後のリダイレクト処理
  - 認証成功時にフィードページへリダイレクト
  - セッション状態の確認
  - _要件: 6.5_


## 3. フィードデータ取得ロジックの実装

データベースから記事を取得し、Article型に変換するServer Actionsを実装します。

- [ ] 3.1 Article型定義の作成
  - `features/feed/types/article.ts` を作成
  - Article インターフェースを定義
  - RssEntry/Post から Article への変換関数を実装
  - _要件: 1.4, 1.5_

- [ ] 3.2 フィード取得Server Actionの実装
  - `app/actions/feed.ts` を作成
  - `getFeedArticles` 関数を実装（ページネーション対応）
  - FeedItem から Article への変換処理
  - ユーザーのいいね/ブックマーク状態を含める
  - _要件: 1.5, 9.3_

- [ ] 3.3 カテゴリー別フィルタリング機能
  - カテゴリーIDによるフィルタリングロジックを追加
  - Technology テーブルとの結合処理
  - _要件: 5.3_


## 4. 縦スクロールフィードUIの実装

TikTok風の縦スクロールUIコンポーネントを構築します。

- [ ] 4.1 VerticalFeedコンポーネントの作成
  - `features/feed/components/vertical-feed.tsx` を作成
  - Intersection Observer APIを使用したスクロール検知
  - 現在表示中の記事インデックスの管理
  - キーボードナビゲーション（↑↓キー）の実装
  - _要件: 1.1, 1.2, 1.3_

- [ ] 4.2 無限スクロール機能の実装
  - `features/feed/hooks/use-infinite-scroll.ts` を作成
  - 次のページを自動ロードするロジック
  - ローディング状態の管理
  - _要件: 1.2_

- [ ] 4.3 スクロールインジケーターの実装
  - 既存の `components/scroll-indicator.tsx` を統合
  - 現在位置と総記事数の表示
  - _要件: 1.1_


## 5. 記事カードコンポーネントの実装

個々の記事を表示するカードUIを構築します。

- [ ] 5.1 ArticleCardコンポーネントの作成
  - `features/feed/components/article-card.tsx` を作成
  - 記事タイトル、本文、メタ情報の表示
  - レスポンシブレイアウト（モバイル/デスクトップ）
  - _要件: 1.4, 2.1, 2.2, 2.3, 2.4_

- [ ] 5.2 記事コンテンツの表示
  - テキストコンテンツのレンダリング
  - 長文の場合の省略表示（「続きを読む」）
  - _要件: 1.4_

- [ ] 5.3 元記事リンクボタンの実装
  - 元記事URLへのリンクボタンを追加
  - 新しいタブで開く処理
  - URLが存在しない場合は非表示
  - _要件: 10.1, 10.2, 10.3, 10.4, 10.5_


## 6. インタラクション機能の実装

いいね、ブックマーク、共有機能を実装します。

- [ ] 6.1 いいね機能のServer Action実装
  - `app/actions/interactions.ts` に `toggleLike` 関数を作成
  - Like レコードの作成/削除処理
  - いいね数の集計
  - _要件: 3.2, 3.3, 3.5_

- [ ] 6.2 ブックマーク機能のServer Action実装
  - `toggleBookmark` 関数を作成
  - Bookmark レコードの作成/削除処理
  - _要件: 4.2, 4.3, 4.5_

- [ ] 6.3 共有機能のServer Action実装
  - `trackShare` 関数を作成
  - PostShare レコードの作成
  - 共有数のカウント
  - _要件: 11.6_

- [ ] 6.4 インタラクションボタンコンポーネントの作成
  - `features/interactions/components/like-button.tsx` を作成
  - `features/interactions/components/bookmark-button.tsx` を作成
  - `features/interactions/components/share-button.tsx` を作成
  - Optimistic Update の実装
  - アニメーション効果の追加
  - _要件: 3.1, 3.4, 4.1, 4.4, 11.1, 11.2_

- [ ] 6.5 共有ダイアログの実装
  - `features/interactions/components/share-dialog.tsx` を作成
  - Web Share API の統合（モバイル）
  - URLコピー機能の実装
  - _要件: 11.2, 11.3, 11.4, 11.5_


## 7. カテゴリータブの実装

記事をカテゴリー別にフィルタリングするタブUIを構築します。

- [ ] 7.1 CategoryTabsコンポーネントの作成
  - `features/feed/components/category-tabs.tsx` を作成
  - カテゴリー一覧の横スクロール表示
  - 選択状態の視覚的フィードバック
  - _要件: 5.1, 5.2_

- [ ] 7.2 カテゴリー取得処理の実装
  - Technology テーブルからカテゴリー一覧を取得
  - Server Component でのデータプリフェッチ
  - _要件: 5.3_

- [ ] 7.3 カテゴリー選択時のフィード更新
  - カテゴリー選択時のフィルタリング処理
  - スクロール位置の維持
  - _要件: 5.2, 5.4_


## 8. フィードページの統合

すべてのコンポーネントを統合してフィードページを完成させます。

- [ ] 8.1 フィードページの作成
  - `app/(main)/feed/page.tsx` を作成
  - Server Component でのデータ取得
  - CategoryTabs と VerticalFeed の統合
  - _要件: 1.1, 5.1_

- [ ] 8.2 認証状態の確認
  - 未認証ユーザーのリダイレクト処理
  - セッション情報の取得
  - _要件: 6.6_

- [ ] 8.3 レイアウトの実装
  - モバイル/デスクトップのレスポンシブレイアウト
  - ナビゲーションヘッダーの追加
  - _要件: 2.1, 2.2, 2.3, 2.4_


## 9. コメント機能の実装

記事へのコメント投稿・表示機能を構築します。

- [ ] 9.1 コメント関連Server Actionsの実装
  - `app/actions/comments.ts` を作成
  - `createComment` 関数を実装
  - `deleteComment` 関数を実装
  - `getComments` 関数を実装
  - _要件: 8.2, 8.5, 8.6_

- [ ] 9.2 コメント表示コンポーネントの作成
  - `features/feed/components/comment-list.tsx` を作成
  - コメント一覧の表示（時系列順）
  - コメント投稿者の名前とアバター表示
  - _要件: 8.3, 8.4_

- [ ] 9.3 コメント入力フォームの実装
  - `features/feed/components/comment-form.tsx` を作成
  - テキストエリアとバリデーション
  - 送信ボタンとローディング状態
  - _要件: 8.1, 8.2_

- [ ] 9.4 コメントセクションの統合
  - ArticleCard にコメントセクションを追加
  - コメント数の表示
  - コメント展開/折りたたみ機能
  - _要件: 8.1, 8.3_


## 10. プロフィール機能の実装

ユーザープロフィールの表示と編集機能を構築します。

- [ ] 10.1 プロフィール取得Server Actionの実装
  - `app/actions/profile.ts` を作成
  - `getProfile` 関数を実装
  - `getUserArticles` 関数を実装
  - _要件: 7.1, 7.6_

- [ ] 10.2 プロフィールページの作成
  - `app/(main)/profile/[username]/page.tsx` を作成
  - プロフィールヘッダーの表示
  - ユーザー情報の表示（名前、アバター、bio）
  - _要件: 7.1, 7.2, 7.3_

- [ ] 10.3 プロフィール編集機能の実装
  - `updateProfile` Server Action を実装
  - プロフィール編集ダイアログの作成
  - フォームバリデーション（Zod）
  - _要件: 7.4, 7.5_

- [ ] 10.4 ユーザーアクティビティタブの実装
  - 投稿一覧タブ
  - いいね一覧タブ
  - ブックマーク一覧タブ
  - _要件: 7.6_


## 11. ブックマーク一覧ページの実装

保存した記事を一覧表示するページを構築します。

- [ ] 11.1 ブックマーク取得Server Actionの実装
  - `app/actions/bookmarks.ts` を作成
  - `getBookmarkedArticles` 関数を実装
  - ページネーション対応
  - _要件: 4.4_

- [ ] 11.2 ブックマークページの作成
  - `app/(main)/bookmarks/page.tsx` を作成
  - ブックマーク済み記事の一覧表示
  - グリッドレイアウトの実装
  - _要件: 4.4_


## 12. エラーハンドリングとローディング状態

エラー表示とローディングUIを実装します。

- [ ] 12.1 エラーバウンダリの実装
  - `app/error.tsx` を作成
  - エラーページUIの実装
  - 再試行ボタンの追加
  - _要件: 9.5_

- [ ] 12.2 ローディングコンポーネントの作成
  - `app/loading.tsx` を作成
  - スケルトンスクリーンの実装
  - `features/feed/components/article-skeleton.tsx` を作成
  - _要件: 1.1_

- [ ] 12.3 トースト通知の実装
  - エラー通知コンポーネントの作成
  - 成功通知の表示
  - _要件: 3.2, 4.2, 8.2_


## 13. パフォーマンス最適化

アプリケーションのパフォーマンスを最適化します。

- [ ] 13.1 画像最適化の実装
  - Next.js Image コンポーネントの使用
  - 遅延ロード（lazy loading）の設定
  - _要件: 1.4_

- [ ] 13.2 データベースクエリの最適化
  - Prisma の `select` で必要なフィールドのみ取得
  - インデックスの確認と追加
  - _要件: 9.3, 9.4_

- [ ] 13.3 コード分割の実装
  - Dynamic Import で重いコンポーネントを遅延ロード
  - ShareDialog などのモーダルを動的インポート
  - _要件: 1.1_


## 14. デプロイメント準備

Vercelへのデプロイ準備を行います。

- [ ] 14.1 環境変数の設定
  - Vercel プロジェクトの作成
  - 本番環境の環境変数を設定
  - Supabase 接続文字列の設定
  - _要件: 12.5_

- [ ] 14.2 データベースマイグレーション
  - 本番データベースへのマイグレーション実行
  - `prisma migrate deploy` の実行
  - _要件: 9.1, 9.2_

- [ ] 14.3 ビルドとデプロイ
  - `pnpm build` でビルドエラーの確認
  - Vercel へのデプロイ
  - デプロイ後の動作確認
  - _要件: 12.1, 12.3, 12.4_

---

**注意事項**:
- 各タスクは順番に実装することを推奨します
- タスク実行前に requirements.md と design.md を確認してください
- 実装中に不明点があれば、設計書を参照してください
