# 要件定義書

## はじめに

Tech-Tokは、TikTokのような縦スクロールUIで技術記事の要約を読むことができるWebアプリケーションです。エンジニアが短時間で技術情報をキャッチアップできることを目的としています。モバイルとPCの両方に対応し、記事へのインタラクション機能（いいね、ブックマーク、コメント）を提供します。

## 用語集

- **System**: Tech-Tokアプリケーション全体
- **User**: アプリケーションを利用するエンジニア
- **Article**: データベースから取得される技術記事（テキストベース）
- **Feed**: 縦スクロール可能な記事一覧画面
- **Category**: 記事を分類する技術カテゴリー（例: React, TypeScript, AWS）
- **OAuth Provider**: Google または GitHub の認証プロバイダー
- **Profile**: ユーザーの個人情報とアクティビティを表示するページ
- **Comment**: 記事に対するユーザーのコメント
- **Like**: 記事への「いいね」アクション
- **Bookmark**: 記事を保存するアクション
- **Database**: Supabase PostgreSQL データベース

## 要件

### 要件1: 記事の縦スクロール表示

**ユーザーストーリー:** エンジニアとして、TikTokのような縦スクロールで技術記事を読みたい。短時間で多くの記事をブラウズできるようにしたい。

#### 受入基準

1. THE System SHALL display articles in a vertical scrollable feed format
2. WHEN User scrolls down, THE System SHALL load the next article automatically
3. WHEN User scrolls up, THE System SHALL load the previous article automatically
4. THE System SHALL display article content as text format
5. THE System SHALL retrieve articles from Database

### 要件2: レスポンシブデザイン

**ユーザーストーリー:** エンジニアとして、モバイルとPCの両方で快適に記事を読みたい。デバイスに応じた最適な表示を期待する。

#### 受入基準

1. THE System SHALL render optimized layout for mobile devices
2. THE System SHALL render optimized layout for desktop devices
3. WHEN viewport width changes, THE System SHALL adjust layout responsively
4. THE System SHALL maintain readability across all supported screen sizes

### 要件3: 記事へのいいね機能

**ユーザーストーリー:** エンジニアとして、気に入った記事に「いいね」をつけたい。後で人気記事を確認できるようにしたい。

#### 受入基準

1. WHERE User is authenticated, THE System SHALL display like button on each article
2. WHEN User taps like button, THE System SHALL register like action to Database
3. WHEN User taps like button again, THE System SHALL remove like action from Database
4. THE System SHALL display total like count for each article
5. THE System SHALL persist like status across sessions

### 要件4: 記事のブックマーク機能

**ユーザーストーリー:** エンジニアとして、後で読みたい記事をブックマークしたい。保存した記事を一覧で確認できるようにしたい。

#### 受入基準

1. WHERE User is authenticated, THE System SHALL display bookmark button on each article
2. WHEN User taps bookmark button, THE System SHALL save article to User bookmark list in Database
3. WHEN User taps bookmark button again, THE System SHALL remove article from bookmark list
4. THE System SHALL provide access to bookmarked articles list
5. THE System SHALL persist bookmark status across sessions

### 要件5: カテゴリー別記事フィルタリング

**ユーザーストーリー:** エンジニアとして、特定の技術カテゴリーの記事だけを見たい。興味のある技術領域に絞って情報収集したい。

#### 受入基準

1. THE System SHALL display category tabs at the top of Feed
2. WHEN User selects a category tab, THE System SHALL filter articles by selected Category
3. THE System SHALL retrieve filtered articles from Database based on Category
4. THE System SHALL maintain scroll position when switching between categories
5. THE System SHALL display all articles when no specific category is selected

### 要件6: OAuth認証

**ユーザーストーリー:** エンジニアとして、GoogleまたはGitHubアカウントで簡単にログインしたい。新しいアカウントを作成する手間を省きたい。

#### 受入基準

1. THE System SHALL provide Google OAuth login option
2. THE System SHALL provide GitHub OAuth login option
3. WHEN User selects OAuth Provider, THE System SHALL redirect to provider authentication page
4. WHEN authentication succeeds, THE System SHALL create or retrieve User record in Database
5. WHEN authentication succeeds, THE System SHALL redirect User to Feed page
6. THE System SHALL maintain User session across page reloads

### 要件7: ユーザープロフィール

**ユーザーストーリー:** エンジニアとして、自分のプロフィール情報を確認・編集したい。投稿した記事やアクティビティを一覧で見たい。

#### 受入基準

1. WHERE User is authenticated, THE System SHALL display Profile page
2. THE System SHALL display User name and avatar on Profile page
3. THE System SHALL display User bio on Profile page
4. THE System SHALL allow User to edit profile information
5. WHEN User updates profile, THE System SHALL save changes to Database
6. THE System SHALL display User activity history on Profile page

### 要件8: 記事へのコメント機能

**ユーザーストーリー:** エンジニアとして、記事に対してコメントを投稿したい。他のエンジニアと技術的な議論をしたい。

#### 受入基準

1. WHERE User is authenticated, THE System SHALL display comment input field on each article
2. WHEN User submits comment, THE System SHALL save comment to Database
3. THE System SHALL display all comments for each article in chronological order
4. THE System SHALL display commenter name and avatar with each comment
5. WHERE User is comment author, THE System SHALL allow User to delete own comment
6. WHEN User deletes comment, THE System SHALL remove comment from Database

### 要件9: データベース統合

**ユーザーストーリー:** システム管理者として、記事データを効率的に管理したい。Supabaseを使用してスケーラブルなデータ管理を実現したい。

#### 受入基準

1. THE System SHALL connect to Supabase PostgreSQL Database
2. THE System SHALL use Prisma as ORM for database operations
3. THE System SHALL retrieve articles from Database with pagination
4. THE System SHALL store user interactions in Database with referential integrity
5. WHEN database connection fails, THE System SHALL display error message to User

### 要件10: 元記事へのリダイレクト

**ユーザーストーリー:** エンジニアとして、要約を読んだ後に元の記事全文を読みたい。元記事のサイトに簡単にアクセスしたい。

#### 受入基準

1. THE System SHALL display link to original article on each article card
2. WHEN User taps original article link, THE System SHALL redirect User to original article URL in new tab
3. THE System SHALL preserve original article URL in Database
4. THE System SHALL maintain User position in Feed after returning from external link
5. WHERE original article URL is unavailable, THE System SHALL hide redirect link

### 要件11: 記事の共有機能

**ユーザーストーリー:** エンジニアとして、気に入った記事を他の人と共有したい。SNSやメッセージアプリで簡単にシェアできるようにしたい。

#### 受入基準

1. THE System SHALL display share button on each article card
2. WHEN User taps share button, THE System SHALL display share options menu
3. THE System SHALL generate shareable URL for each article
4. THE System SHALL provide native share functionality on mobile devices
5. THE System SHALL provide copy link option for desktop devices
6. WHEN User shares article, THE System SHALL track share count in Database

### 要件12: デプロイメント

**ユーザーストーリー:** システム管理者として、アプリケーションを本番環境にデプロイしたい。Vercelを使用して継続的デプロイを実現したい。

#### 受入基準

1. THE System SHALL be deployable to Vercel platform
2. THE System SHALL connect to Supabase Database in production environment
3. WHEN code is pushed to main branch, THE System SHALL trigger automatic deployment
4. THE System SHALL serve static assets through Vercel CDN
5. THE System SHALL maintain environment variables securely in Vercel
