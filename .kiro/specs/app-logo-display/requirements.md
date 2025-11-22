# Requirements Document

## Introduction

TechTokアプリケーション内にブランドロゴを戦略的に配置し、ブランド認知度を高め、ユーザーエクスペリエンスを向上させる機能を実装します。既存のアイコンファイル（SVG、PNG）を活用し、認証状態やデバイスタイプに応じて適切な位置にロゴを表示します。

## Glossary

- **Logo Component**: アプリケーション内で表示されるTechTokブランドロゴのReactコンポーネント
- **Sidebar Navigation**: デスクトップ表示時の左側固定ナビゲーション（幅264px）
- **Login Page**: 未認証ユーザー向けのOAuthログイン画面
- **Unauthenticated Home**: 未認証ユーザーが最初に見るフィードプレビュー画面
- **Authenticated State**: ユーザーがログイン済みの状態
- **Unauthenticated State**: ユーザーが未ログインの状態

## Requirements

### Requirement 1

**User Story:** エンジニアとして、アプリケーション内でTechTokのブランドを認識できるように、主要な画面にロゴが表示されることを期待する

#### Acceptance Criteria

1. WHEN デスクトップ画面でログイン済みの状態でアプリを表示する場合、THE Logo Component SHALL Sidebar Navigationの最上部に表示される
2. WHEN ログインページを表示する場合、THE Logo Component SHALL ログインフォームカードの上部中央に表示される
3. WHEN 未認証ホーム画面を表示する場合、THE Logo Component SHALL 画面上部に表示される
4. THE Logo Component SHALL SVG形式のロゴファイル（techtok_app_icon.svg）を使用する
5. THE Logo Component SHALL クリック可能であり、クリック時にフィードページ（/feed）に遷移する

### Requirement 2

**User Story:** デザイナーとして、ロゴが各画面のコンテキストに適したサイズとスタイルで表示されることを期待する

#### Acceptance Criteria

1. WHEN Sidebar Navigationにロゴを表示する場合、THE Logo Component SHALL 高さ40pxから48pxの範囲で表示される
2. WHEN ログインページにロゴを表示する場合、THE Logo Component SHALL 高さ64pxから80pxの範囲で表示される
3. WHEN 未認証ホーム画面にロゴを表示する場合、THE Logo Component SHALL 高さ32pxの範囲で表示される
4. THE Logo Component SHALL ロゴアイコンとテキスト「TECHTOK」を横並びで表示する
5. THE Logo Component SHALL ダークモードとライトモードの両方で適切なコントラストを保つ

### Requirement 3

**User Story:** ユーザーとして、ロゴが直感的にクリック可能であることを視覚的に理解できることを期待する

#### Acceptance Criteria

1. WHEN ロゴにマウスカーソルを合わせる場合、THE Logo Component SHALL ホバー状態を視覚的に示す（例：透明度変化、スケール変化）
2. WHEN ロゴにマウスカーソルを合わせる場合、THE Logo Component SHALL カーソルをポインター形状に変更する
3. THE Logo Component SHALL アクセシビリティのためにaria-labelを含む
4. THE Logo Component SHALL キーボードナビゲーション（Tabキー、Enterキー）に対応する
5. WHEN ロゴをクリックまたはEnterキーを押下する場合、THE Logo Component SHALL Next.jsのクライアントサイドナビゲーションを使用してページ遷移する

### Requirement 4

**User Story:** 開発者として、ロゴコンポーネントが再利用可能で保守しやすい設計であることを期待する

#### Acceptance Criteria

1. THE Logo Component SHALL src/components/ui/ディレクトリに配置される
2. THE Logo Component SHALL サイズバリアント（small、medium、large）をpropsで受け取る
3. THE Logo Component SHALL テキスト表示の有無をpropsで制御できる
4. THE Logo Component SHALL Storybookストーリーを含む
5. THE Logo Component SHALL TypeScript型定義を含む

### Requirement 5

**User Story:** モバイルユーザーとして、画面サイズに応じて適切にロゴが表示されることを期待する

#### Acceptance Criteria

1. WHEN モバイル画面（768px未満）でログイン済みの状態でアプリを表示する場合、THE Logo Component SHALL 画面上部の固定ヘッダーに表示される
2. WHEN モバイル画面でロゴを表示する場合、THE Logo Component SHALL 高さ32pxで表示される
3. WHEN モバイル画面でロゴを表示する場合、THE Logo Component SHALL テキスト「TECHTOK」を省略してアイコンのみ表示することができる
4. THE Logo Component SHALL レスポンシブデザインに対応し、画面幅に応じて適切にレイアウトされる
5. WHEN モバイル画面で縦スクロールする場合、THE Logo Component SHALL 固定位置に留まりコンテンツと重ならないようにする
