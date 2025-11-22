# Implementation Plan

- [x] 1. AppLogoコンポーネントの作成
  - 再利用可能なロゴコンポーネントを実装し、サイズバリアント（small、medium、large）とテキスト表示制御を提供する
  - Next.js ImageとLinkを使用してSVGロゴとナビゲーション機能を実装
  - class-variance-authorityでバリアント管理を行う
  - _Requirements: 1.4, 1.5, 2.1, 2.2, 2.3, 2.4, 3.1, 3.2, 3.3, 3.4, 3.5, 4.1, 4.2, 4.3, 4.5_

- [x] 1.1 AppLogoコンポーネント本体の実装
  - `src/components/ui/app-logo.tsx`を作成
  - cvaでlogoVariantsとtextVariantsを定義（small/medium/large）
  - AppLogoPropsインターフェースを定義（size、showText、className、href）
  - Next.js ImageでSVGロゴを表示（/techtok_app_icon.svg）
  - Next.js Linkでクリック可能にし、/feedに遷移
  - ホバー効果（opacity-80）とフォーカスリング（ring-2）を実装
  - aria-label="TechTokホームに移動"を追加
  - _Requirements: 1.4, 1.5, 2.1, 2.2, 2.3, 2.4, 2.5, 3.1, 3.2, 3.3, 3.4, 3.5, 4.2, 4.3, 4.5_

- [x] 1.2 AppLogoのStorybookストーリー作成
  - `src/components/ui/app-logo.stories.tsx`を作成
  - Small、Medium、Largeの各サイズストーリーを作成
  - IconOnly（テキストなし）ストーリーを作成
  - InDarkBackground（ダークモード確認用）ストーリーを作成
  - argTypesでsize（select）とshowText（boolean）を定義
  - _Requirements: 4.4_

- [x] 2. MobileHeaderコンポーネントの作成
  - モバイル用の固定ヘッダーコンポーネントを実装し、AppLogoを小さいサイズで表示する
  - 固定位置（top-0）、半透明背景（backdrop-blur）、ボーダーを実装
  - _Requirements: 5.1, 5.2, 5.3, 5.5_

- [x] 2.1 MobileHeaderコンポーネント本体の実装
  - `src/components/layout/mobile-header.tsx`を作成
  - md:hidden（モバイルのみ表示）を設定
  - fixed top-0 left-0 right-0 z-50で固定配置
  - bg-background/80 backdrop-blur-lgで半透明背景
  - border-b border-borderでボーダー追加
  - AppLogoをsize="small" showText={false}で配置
  - _Requirements: 5.1, 5.2, 5.3, 5.5_

- [x] 3. SidebarNavigationへのロゴ統合
  - サイドバーナビゲーションの最上部にAppLogoを追加し、ナビゲーション項目と区切る
  - _Requirements: 1.1, 2.1, 2.4_

- [x] 3.1 SidebarNavigationの修正
  - `src/components/layout/sidebar-navigation.tsx`を修正
  - AppLogoをインポート
  - ナビゲーション項目の前に新しいdivを追加
  - AppLogoをsize="medium" showTextで配置
  - px-2 py-4 border-b border-borderで区切りを追加
  - _Requirements: 1.1, 2.1, 2.4_

- [x] 4. LoginFormへのロゴ統合
  - ログインフォームのカード上部にAppLogoを大きいサイズで追加する
  - _Requirements: 1.2, 2.2, 2.4_

- [x] 4.1 LoginFormの修正
  - `src/features/auth/components/login-form.tsx`を修正
  - AppLogoをインポート
  - Cardコンポーネント内、CardHeaderの前に新しいdivを追加
  - flex justify-center pt-8 pb-4でセンタリング
  - AppLogoをsize="large" showTextで配置
  - _Requirements: 1.2, 2.2, 2.4_

- [x] 5. MainNavigationへのMobileHeader統合
  - ログイン済みユーザー向けにMobileHeaderを追加する
  - _Requirements: 5.1, 5.2, 5.3_

- [x] 5.1 MainNavigationの修正
  - `src/components/layout/main-navigation.tsx`を修正
  - MobileHeaderをインポート
  - セッションがある場合にMobileHeaderを表示
  - SidebarNavigationとBottomNavigationと並列に配置
  - _Requirements: 5.1, 5.2, 5.3_

- [x] 6. UnauthenticatedHomeWrapperへのMobileHeader統合
  - 未認証ホーム画面にMobileHeaderを追加し、コンテンツに適切なパディングを設定する
  - _Requirements: 1.3, 2.3, 5.1, 5.2, 5.3, 5.5_

- [x] 6.1 UnauthenticatedHomeWrapperの修正
  - `src/features/feed/components/unauthenticated-home-wrapper.tsx`を修正
  - MobileHeaderをインポート
  - コンポーネントの最上部にMobileHeaderを追加
  - 既存のコンテンツをdivでラップし、pt-16 md:pt-0を追加（ヘッダー分のパディング）
  - _Requirements: 1.3, 2.3, 5.1, 5.2, 5.3, 5.5_

- [x] 7. RootLayoutのレイアウト調整
  - メインコンテンツエリアにモバイルヘッダー分の上部パディングを追加する
  - _Requirements: 5.4, 5.5_

- [x] 7.1 RootLayoutの修正
  - `src/app/layout.tsx`を修正
  - メインコンテンツのdivクラスを更新
  - pt-16 md:pt-0を追加（モバイルでヘッダー分のパディング、デスクトップでは不要）
  - 既存のpb-24 md:pb-0 md:ml-64は維持
  - _Requirements: 5.4, 5.5_

- [ ]* 8. ビジュアルテストと動作確認
  - Storybookで各バリアントの表示を確認し、実際のページでロゴの配置と動作を検証する
  - _Requirements: 全要件_

- [ ]* 8.1 Storybookでの確認
  - `pnpm storybook`を実行
  - AppLogoの各ストーリー（Small、Medium、Large、IconOnly、InDarkBackground）を確認
  - ホバー効果とフォーカスリングの動作を確認
  - _Requirements: 3.1, 3.2, 3.3, 4.4_

- [ ]* 8.2 実際のページでの確認
  - `pnpm dev`を実行
  - ログインページ（/login）でロゴの表示を確認
  - ログイン後、デスクトップでサイドバーのロゴを確認
  - モバイルビュー（DevTools）でヘッダーのロゴを確認
  - 未認証ホーム（/）でモバイルヘッダーを確認
  - 各ロゴのクリックで/feedに遷移することを確認
  - _Requirements: 1.1, 1.2, 1.3, 1.5, 3.5, 5.1, 5.2, 5.3, 5.4, 5.5_
