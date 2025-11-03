# エラーハンドリング実装ドキュメント

## 概要

未認証ホームページのエラーハンドリング実装が完了しました。このドキュメントでは、実装された3つの主要なエラーハンドリング機能について説明します。

## 実装されたエラーハンドリング

### 1. セッションチェックエラーの処理

**場所**: `src/app/page.tsx`

**実装内容**:
- `getSession()`呼び出しをtry-catchブロックで囲む
- エラーが発生した場合、コンソールにログを出力
- 未認証ユーザーとして扱い、プレビュー体験を継続

```typescript
let session = null;
try {
  session = await getSession();
} catch (error) {
  console.error("Session check error:", error);
  // 未認証として扱い、処理を継続
}
```

**動作**:
- セッションチェックが失敗しても、ユーザーは記事プレビューを閲覧可能
- エラーは致命的ではないため、ユーザー体験を中断しない

### 2. 記事取得エラーの処理

**場所**: `src/app/page.tsx`

**実装内容**:
- `getFeedArticles()`呼び出しをtry-catchブロックで囲む
- エラーが発生した場合、エラーメッセージを保存
- エラー状態をクライアントコンポーネントに渡す

```typescript
let feedItems = [];
let error: string | null = null;

try {
  const { articles } = await getFeedArticles({ limit: 3 });
  feedItems = articles.map(articleToFeedItemData);
  
  if (feedItems.length === 0) {
    error = "現在表示できる記事がありません。しばらくしてから再度お試しください。";
  }
} catch (fetchError) {
  console.error("Article fetch error:", fetchError);
  error = fetchError instanceof Error
    ? fetchError.message
    : "記事の読み込みに失敗しました。ネットワーク接続を確認してください。";
}
```

**動作**:
- 記事取得に失敗した場合、エラー状態コンポーネントを表示
- ユーザーにリトライボタンとログインオプションを提供

### 3. リダイレクトエラーの処理

**場所**: `src/app/page.tsx`

**実装内容**:
- `redirect()`呼び出しをtry-catchブロックで囲む
- Next.jsの正常なリダイレクト（NEXT_REDIRECT）と実際のエラーを区別
- 実際のエラーの場合、フォールバック処理を実行

```typescript
if (session?.user) {
  try {
    redirect("/feed");
  } catch (error) {
    console.error("Redirect error:", error);
    
    // NEXT_REDIRECTエラーは正常なリダイレクトなので再スロー
    if (error && typeof error === "object" && "digest" in error) {
      throw error;
    }
    
    // その他のエラーはフォールバック処理へ
  }
}
```

**動作**:
- 正常なリダイレクトは通常通り実行
- リダイレクトエラーの場合、クライアントサイドでのフォールバックナビゲーションを試みる

## 新規作成されたコンポーネント

### PreviewErrorState

**ファイル**: `src/features/feed/components/preview-error-state.tsx`

**責務**:
- エラー状態のUIを表示
- リトライボタンを提供
- ログインプロンプトを表示

**プロパティ**:
```typescript
interface PreviewErrorStateProps {
  message?: string;           // エラーメッセージ
  onRetry?: () => void;       // リトライコールバック
  showLoginPrompt?: boolean;  // ログインプロンプト表示フラグ
}
```

**機能**:
- エラーアイコンと明確なエラーメッセージ
- 再試行ボタン（提供された場合）
- ログインボタン（showLoginPromptがtrueの場合）
- ユーザーフレンドリーな補足情報

### UnauthenticatedHomeWrapper

**ファイル**: `src/features/feed/components/unauthenticated-home-wrapper.tsx`

**責務**:
- エラー状態の管理
- リトライ機能の提供
- グローバルエラーハンドラーの設定

**プロパティ**:
```typescript
interface UnauthenticatedHomeWrapperProps {
  articles: FeedItemData[];  // プレビュー記事
  error?: string | null;     // 初期エラー状態
}
```

**機能**:
- エラー状態の場合、PreviewErrorStateを表示
- 記事が空の場合もエラーとして扱う
- リトライ時にページをリフレッシュ
- グローバルエラーハンドラーを設定

## Storybookストーリー

**ファイル**: `src/features/feed/components/preview-error-state.stories.tsx`

以下のストーリーが実装されています:
- Default: デフォルトのエラー状態
- CustomMessage: カスタムエラーメッセージ
- NoRetry: リトライボタンなし
- NoLoginPrompt: ログインプロンプトなし
- NoArticles: 記事が見つからない場合
- DatabaseError: データベース接続エラー

## テスト方法

### 1. セッションチェックエラーのテスト

```bash
# Auth.jsの設定を一時的に無効化して確認
# または、getSession()が失敗するようにモックを設定
```

### 2. 記事取得エラーのテスト

```bash
# データベースを停止して確認
docker compose down

# ページにアクセス
# エラー状態コンポーネントが表示されることを確認
```

### 3. リダイレクトエラーのテスト

```bash
# /feedルートを一時的に削除または無効化
# 認証済みユーザーでホームページにアクセス
```

### 4. Storybookでの確認

```bash
pnpm storybook

# Features/Feed/PreviewErrorState を開く
# 各ストーリーを確認
```

## エラーメッセージ一覧

| エラーケース | メッセージ |
|------------|----------|
| 記事取得失敗 | "記事の読み込みに失敗しました。ネットワーク接続を確認してください。" |
| 記事が空 | "現在表示できる記事がありません。しばらくしてから再度お試しください。" |
| データベースエラー | "フィード記事の取得に失敗しました" |
| リダイレクトエラー | "ページの移動に失敗しました。手動でフィードページに移動してください。" |

## 要件との対応

### 要件 4.1: パフォーマンス

- エラーハンドリングは最小限のオーバーヘッド
- エラー状態でもユーザー体験を維持
- 適切なローディング状態とエラーメッセージ

### 要件 4.3: サーバーサイドレンダリング

- サーバーサイドでエラーをキャッチ
- エラー状態をクライアントに渡す
- クライアントサイドでリトライ機能を提供

## 今後の改善案

1. **エラートラッキング**: Sentryなどのエラートラッキングサービスとの統合
2. **リトライロジック**: 指数バックオフを使用した自動リトライ
3. **オフライン対応**: Service Workerを使用したオフライン体験
4. **エラーアナリティクス**: エラー発生率の監視とアラート
5. **ユーザーフィードバック**: エラー報告機能の追加

## まとめ

エラーハンドリングの実装により、以下が達成されました:

✅ セッションチェックエラーの処理（未認証として扱う）
✅ 記事取得エラーの処理（エラーメッセージとリトライボタン）
✅ リダイレクトエラーの処理（フォールバックナビゲーション）
✅ ユーザーフレンドリーなエラーUI
✅ Storybookストーリーの作成
✅ 要件 4.1, 4.3 への対応

すべてのエラーケースが適切に処理され、ユーザーは常に次のアクションを取ることができます。
