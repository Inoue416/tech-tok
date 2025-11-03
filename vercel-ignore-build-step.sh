#!/bin/bash

echo "VERCEL_GIT_COMMIT_REF: $VERCEL_GIT_COMMIT_REF"
echo "VERCEL_GIT_COMMIT_MESSAGE: $VERCEL_GIT_COMMIT_MESSAGE"

# 許可するブランチのリスト
ALLOWED_BRANCHE="develop"
# マージコミットメッセージから元のブランチ名を抽出
MERGE_BRANCH=$(echo "$VERCEL_GIT_COMMIT_MESSAGE" | grep -o "$ALLOWED_BRANCHE")
echo "MERGE_BRANCH: $MERGE_BRANCH"

# mainブランチへのマージかどうかを確認
if [[ "$VERCEL_GIT_COMMIT_REF" == "release" ]]; then
  if [ -n "$MERGE_BRANCH" ]; then
    echo "✅ - ビルドを続行します (${MERGE_BRANCH}からのマージ)"
    exit 1
  else
    echo "🛑 - ビルドをキャンセルしました (許可されていないブランチ)"
    exit 0
  fi
else
  echo "🛑 - releaseブランチではないためビルドをキャンセルしました"
  exit 0
fi