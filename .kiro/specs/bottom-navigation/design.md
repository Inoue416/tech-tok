# 設計書

## 1. 概要

Tech-Tokアプリケーションにおいて、ユーザーが主要な画面間をスムーズに移動できるよう、ページ下部に固定されたナビゲーションバーを実装します。モバイルファーストのアプローチで、TikTokやInstagramのような直感的なUIを提供します。

### 主要機能
- ページ下部に固定表示されるナビゲーションバー
- フィード、プロフィール、ブックマークへのクイックアクセス
- アクティブルートの視覚的フィードバック
- レスポンシブデザイン（モバイル/デスクトップ対応）
- アクセシビリティ対応

## 2. アーキテクチャ

### 2.1 コンポーネント構成

```
BottomNavigation
├── NavigationItem (フィード)
├── NavigationItem (ブックマーク)
└── NavigationItem (プロフィール)
```

### 2.2 技術スタック

| 要素 | 技術 | 用途 |
|------|------|------|
| フレームワーク | Next.js 15 App Router | ルーティング、SSR |
| スタイリング | Tailwind CSS 4 | レスポンシブデザイン |
| アイコン | Lucide React | ナビゲーションアイコン |
| ユーティリティ | class-variance-authority | バリアント管理 |

### 2.3 配置場所

```
src/
├── components/
│   └── layout/
│       ├── bottom-navigation.tsx       # メインコンポーネント
│       ├── bottom-navigation.stories.tsx
│       └── navigation-item.tsx         # ナビゲーション項目
└── app/
    └── layout.tsx                      # BottomNavigationを配置
```

## 3. コンポーネント設計

### 3.1 BottomNavigation コンポーネント

#### 責務
- ナビゲーション項目の配置と管理
- 現在のルートの検知とアクティブ状態の管理
- レスポンシブ表示の制御

#### Props
```typescript
interface BottomNavigationProps {
  className?: string;
}
```

#### 実装例
```typescript
"use client";

import { Home, Bookmark, User } from "lucide-react";
import { usePathname } from "next/navigation";
import { NavigationItem } from "./navigation-item";

export function BottomNavigation({ className }: BottomNavigationProps) {
  const pathname = usePathname();

  const items = [
    {
      href: "/feed",
      icon: Home,
      label: "フィード",
      isActive: pathname === "/feed" || pathname === "/",
    },
    {
      href: "/bookmarks",
      icon: Bookmark,
      label: "ブックマーク",
      isActive: pathname === "/bookmarks",
    },
    {
      href: "/profile",
      icon: User,
      label: "プロフィール",
      isActive: pathname.startsWith("/profile"),
    },
  ];

  return (
    <nav
      className={cn(
        "fixed bottom-0 left-0 right-0 z-50",
        "bg-background border-t border-border",
        "md:hidden", // デスクトップでは非表示
        className
      )}
      role="navigation"
      aria-label="メインナビゲーション"
    >
      <div className="flex items-center justify-around h-16 px-2">
        {items.map((item) => (
          <NavigationItem key={item.href} {...item} />
        ))}
      </div>
    </nav>
  );
}
```

### 3.2 NavigationItem コンポーネント

#### 責務
- 個別のナビゲーション項目の表示
- アクティブ状態の視覚的フィードバック
- ルーティング処理

#### Props
```typescript
import type { LucideIcon } from "lucide-react";

interface NavigationItemProps {
  href: string;
  icon: LucideIcon;
  label: string;
  isActive: boolean;
}
```

#### 実装例
```typescript
"use client";

import Link from "next/link";
import { cn } from "@/lib/utils";
import type { NavigationItemProps } from "./types";

export function NavigationItem({
  href,
  icon: Icon,
  label,
  isActive,
}: NavigationItemProps) {
  return (
    <Link
      href={href}
      className={cn(
        "flex flex-col items-center justify-center",
        "min-w-[64px] h-full px-3 py-2",
        "transition-colors duration-200",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
        "rounded-md",
        isActive
          ? "text-primary"
          : "text-muted-foreground hover:text-foreground"
      )}
      aria-label={label}
      aria-current={isActive ? "page" : undefined}
    >
      <Icon
        className={cn(
          "h-6 w-6 mb-1 transition-transform",
          isActive && "scale-110"
        )}
        aria-hidden="true"
      />
      <span
        className={cn(
          "text-xs font-medium",
          isActive && "font-semibold"
        )}
      >
        {label}
      </span>
    </Link>
  );
}
```

## 4. レイアウト統合

### 4.1 RootLayout への統合

```typescript
// src/app/layout.tsx
import { BottomNavigation } from "@/components/layout/bottom-navigation";
import { auth } from "@/lib/auth";

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();

  return (
    <html lang="ja">
      <body>
        <div className="min-h-screen pb-16 md:pb-0">
          {children}
        </div>
        {session && <BottomNavigation />}
      </body>
    </html>
  );
}
```

### 4.2 コンテンツ領域の調整

ボトムナビゲーションがコンテンツを隠さないよう、メインコンテンツに下部パディングを追加:

```typescript
// モバイル: pb-16 (64px)
// デスクトップ: pb-0 (ナビゲーション非表示のため)
<div className="min-h-screen pb-16 md:pb-0">
  {children}
</div>
```

## 5. スタイリング

### 5.1 デザイントークン

```typescript
// Tailwind CSS クラス
const styles = {
  container: "fixed bottom-0 left-0 right-0 z-50",
  background: "bg-background border-t border-border",
  layout: "flex items-center justify-around h-16 px-2",
  item: {
    base: "flex flex-col items-center justify-center min-w-[64px] h-full px-3 py-2",
    active: "text-primary",
    inactive: "text-muted-foreground hover:text-foreground",
  },
  icon: {
    base: "h-6 w-6 mb-1 transition-transform",
    active: "scale-110",
  },
  label: {
    base: "text-xs font-medium",
    active: "font-semibold",
  },
};
```

### 5.2 レスポンシブブレークポイント

| ブレークポイント | 表示 | 説明 |
|----------------|------|------|
| < 768px (モバイル) | 表示 | ボトムナビゲーション表示 |
| ≥ 768px (デスクトップ) | 非表示 | サイドバーナビゲーションに切り替え（将来実装） |

### 5.3 ダークモード対応

Tailwind CSSのダークモードクラスを使用:
```typescript
// 背景色: bg-background (自動でダークモード対応)
// ボーダー: border-border (自動でダークモード対応)
// テキスト: text-primary, text-muted-foreground (自動対応)
```

## 6. ナビゲーション項目の定義

### 6.1 項目一覧

| 項目 | アイコン | ラベル | ルート | 説明 |
|------|---------|--------|--------|------|
| フィード | Home | フィード | `/feed`, `/` | メインの記事フィード |
| ブックマーク | Bookmark | ブックマーク | `/bookmarks` | 保存した記事一覧 |
| プロフィール | User | プロフィール | `/profile/*` | ユーザープロフィール |

### 6.2 アクティブ状態の判定

```typescript
const isActive = {
  feed: pathname === "/feed" || pathname === "/",
  bookmarks: pathname === "/bookmarks",
  profile: pathname.startsWith("/profile"),
};
```

## 7. アクセシビリティ

### 7.1 ARIA属性

```typescript
// ナビゲーションコンテナ
<nav role="navigation" aria-label="メインナビゲーション">

// ナビゲーション項目
<Link
  aria-label="フィード"
  aria-current={isActive ? "page" : undefined}
>

// アイコン（装飾的）
<Icon aria-hidden="true" />
```

### 7.2 キーボードナビゲーション

- Tab キー: 次の項目にフォーカス
- Shift + Tab: 前の項目にフォーカス
- Enter / Space: 項目を選択
- フォーカスリング: `focus-visible:ring-2 focus-visible:ring-ring`

### 7.3 タップターゲットサイズ

```typescript
// 最小タップ領域: 44x44px (WCAG 2.1 Level AAA)
// 実装: min-w-[64px] h-full (h-16 = 64px)
// 実際のタップ領域: 64x64px
```

## 8. パフォーマンス最適化

### 8.1 クライアントコンポーネント

```typescript
"use client";
// usePathname を使用するため、クライアントコンポーネントとして実装
```

### 8.2 プリフェッチ

Next.js の Link コンポーネントは自動的にプリフェッチを実行:
```typescript
<Link href="/feed" prefetch={true}>
  // デフォルトで有効
</Link>
```

### 8.3 レンダリング最適化

```typescript
// React.memo でメモ化（必要に応じて）
export const NavigationItem = React.memo(NavigationItemComponent);

// useMemo でナビゲーション項目をメモ化
const items = useMemo(() => [
  { href: "/feed", icon: Home, label: "フィード" },
  // ...
], []);
```

## 9. 状態管理

### 9.1 ルート状態

```typescript
// Next.js の usePathname フックを使用
const pathname = usePathname();

// アクティブ状態の判定
const isActive = pathname === "/feed";
```

### 9.2 認証状態

```typescript
// RootLayout でセッション確認
const session = await auth();

// 認証済みユーザーのみナビゲーション表示
{session && <BottomNavigation />}
```

## 10. エラーハンドリング

### 10.1 ルーティングエラー

```typescript
// Next.js の Link コンポーネントが自動処理
// 404 エラーは Next.js の not-found.tsx で処理
```

### 10.2 フォールバック

```typescript
// ナビゲーション項目が読み込めない場合
const items = navigationItems ?? defaultNavigationItems;
```

## 11. テスト戦略

### 11.1 Storybook

```typescript
// bottom-navigation.stories.tsx
export default {
  title: "Layout/BottomNavigation",
  component: BottomNavigation,
} satisfies Meta<typeof BottomNavigation>;

export const Default: Story = {
  parameters: {
    nextjs: {
      appDirectory: true,
      navigation: {
        pathname: "/feed",
      },
    },
  },
};

export const ProfileActive: Story = {
  parameters: {
    nextjs: {
      navigation: {
        pathname: "/profile",
      },
    },
  },
};
```

### 11.2 単体テスト（将来実装）

```typescript
describe("BottomNavigation", () => {
  it("現在のルートに応じてアクティブ状態を表示する", () => {
    // テストコード
  });

  it("ナビゲーション項目をクリックするとルートが変更される", () => {
    // テストコード
  });
});
```

## 12. 将来の拡張性

### 12.1 追加のナビゲーション項目

```typescript
// 検索機能の追加
{
  href: "/search",
  icon: Search,
  label: "検索",
  isActive: pathname === "/search",
}

// 通知機能の追加
{
  href: "/notifications",
  icon: Bell,
  label: "通知",
  isActive: pathname === "/notifications",
  badge: unreadCount, // 未読数バッジ
}
```

### 12.2 デスクトップ用サイドバー

```typescript
// md:hidden を削除し、デスクトップ用レイアウトを追加
<nav className={cn(
  "fixed z-50",
  "bottom-0 left-0 right-0 md:top-0 md:left-0 md:bottom-0 md:w-64",
  "bg-background border-t md:border-r md:border-t-0"
)}>
```

### 12.3 アニメーション

```typescript
// Framer Motion を使用したアニメーション
import { motion } from "framer-motion";

<motion.div
  initial={{ y: 100 }}
  animate={{ y: 0 }}
  transition={{ type: "spring", stiffness: 300, damping: 30 }}
>
  <BottomNavigation />
</motion.div>
```

## 13. 実装チェックリスト

- [ ] BottomNavigation コンポーネントの作成
- [ ] NavigationItem コンポーネントの作成
- [ ] RootLayout への統合
- [ ] アクティブ状態の判定ロジック
- [ ] レスポンシブデザインの実装
- [ ] アクセシビリティ対応（ARIA属性）
- [ ] Storybook ストーリーの作成
- [ ] ダークモード対応の確認
- [ ] タップターゲットサイズの確認
- [ ] パフォーマンステスト

---

**作成日**: 2025-11-02  
**バージョン**: 1.0
