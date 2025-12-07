# ブランチ運用ルール

## ブランチ構成
- **main**: デフォルトブランチ。リリース済みの本番コード。
- **develop**: リリース前の統合ブランチ。作業ブランチのマージ先。
- **release**: リリース作業用のブランチ。developからマージし、リリース後mainへマージ。
- **test**: テスト環境用ブランチ。作業ブランチから自由にマージ・強制プッシュ可能。
- **feature/bugfix等の作業ブランチ**: developから作成し、作業後developへPull Request。

## ブランチプレフィックス
- `feature/xxx` - 新機能
- `fix/xxx` または `bugfix/xxx` - バグ修正
- `docs/xxx` - ドキュメント
- `refactor/xxx` - リファクタリング

## 運用フロー
1. developから作業ブランチ（feature/xxx, bugfix/yyy等）を作成
2. 作業ブランチで開発・修正
3. 作業ブランチからdevelopへPull Requestを作成し、承認後マージ
4. リリース時にdevelopをreleaseへマージ
5. リリース後、releaseからmainへPull Requestを作成し、承認後マージ

## 注意事項
- 作業ブランチからtestブランチへの強制プッシュ・マージは許可
- testブランチから作業ブランチへのプッシュやマージは禁止
- main, develop, releaseはPull Requestベースで運用
