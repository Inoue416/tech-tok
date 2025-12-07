# TechTok コードスタイル・規約

## Biome.js設定

### フォーマッター
- **インデント**: タブ
- **クォートスタイル**: ダブルクォート (`"`)

### リンタールール
- **推奨ルール**: 有効
- **未使用インポート**: エラー (`noUnusedImports`)
- **バレルファイル禁止**: エラー (`noBarrelFile`)
- **img要素警告**: 警告 (`noImgElement`) - Next.js Imageを使用すること

#### スタイルルール
- `noParameterAssign`: パラメータ再代入禁止
- `useAsConstAssertion`: as const推奨
- `useDefaultParameterLast`: デフォルトパラメータは最後に
- `useEnumInitializers`: enum初期化子必須
- `useSelfClosingElements`: 自己閉じタグ使用
- `useSingleVarDeclarator`: 単一変数宣言
- `noUnusedTemplateLiteral`: 不要なテンプレートリテラル禁止
- `useNumberNamespace`: Number名前空間使用
- `noInferrableTypes`: 推論可能な型注釈禁止
- `noUselessElse`: 不要なelse禁止

## TypeScript設定
- **ターゲット**: ES2017
- **Strict Mode**: 有効
- **パスエイリアス**: `@/*` → `./src/*`

## コーディング規約

### ファイル・ディレクトリ命名
- コンポーネントファイル: `kebab-case.tsx` (例: `scroll-indicator.tsx`)
- Storybookファイル: `kebab-case.stories.tsx`
- ユーティリティ: `kebab-case.ts`

### Prismaスキーマ規約
- テーブル名: `snake_case` (`@@map("table_name")`)
- カラム名: `snake_case` (`@map("column_name")`)
- モデル名: `PascalCase`
- フィールド名: `camelCase`

### コンポーネント開発ルール
- 新しいコンポーネント作成時は、同時にStorybookファイルも作成
- APIコール部分はmockingしてStorybook動作確認
- UIコンポーネントは `src/components/ui/` に配置
- 機能別コンポーネントは `src/features/` に配置

### インポート順序
- Biomeの `organizeImports` が自動整理
