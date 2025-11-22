# Design Document

## Overview

TechTokアプリケーション内にブランドロゴを表示する機能を実装します。再利用可能な`AppLogo`コンポーネントを作成し、サイドバーナビゲーション、ログインページ、未認証ホーム画面、モバイルヘッダーの4箇所に配置します。既存のSVGアイコンファイルを活用し、Tailwind CSSとclass-variance-authorityを使用してバリアント管理を行います。

## Architecture

### Component Hierarchy

```
AppLogo (src/components/ui/app-logo.tsx)
├── Link (Next.js)
│   └── div (container)
│       ├── Image (Next.js) - SVGロゴ
│       └── span - "TECHTOK"テキスト (optional)
```

### Integration Points

1. **SidebarNavigation** (`src/components/layout/sidebar-navigation.tsx`)
   - ナビゲーション項目の上部に配置
   - サイズ: medium (h-12)
   - テキスト表示: あり

2. **LoginForm** (`src/features/auth/components/login-form.tsx`)
   - CardHeaderの上部に配置
   - サイズ: large (h-20)
   - テキスト表示: あり

3. **UnauthenticatedHomeWrapper** (`src/features/feed/components/unauthenticated-home-wrapper.tsx`)
   - 新規作成するMobileHeaderコンポーネント内に配置
   - サイズ: small (h-8)
   - テキスト表示: モバイルでは省略可能

4. **MobileHeader** (新規作成: `src/components/layout/mobile-header.tsx`)
   - ログイン済みモバイルユーザー向け
   - 固定位置ヘッダー
   - サイズ: small (h-8)

## Components and Interfaces

### AppLogo Component

**ファイル**: `src/components/ui/app-logo.tsx`

```typescript
import Image from "next/image";
import Link from "next/link";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const logoVariants = cva(
	"inline-flex items-center gap-2 transition-opacity hover:opacity-80 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 rounded-md",
	{
		variants: {
			size: {
				small: "h-8",
				medium: "h-12",
				large: "h-20",
			},
		},
		defaultVariants: {
			size: "medium",
		},
	}
);

const textVariants = cva("font-bold tracking-tight", {
	variants: {
		size: {
			small: "text-sm",
			medium: "text-lg",
			large: "text-2xl",
		},
	},
	defaultVariants: {
		size: "medium",
	},
});

export interface AppLogoProps extends VariantProps<typeof logoVariants> {
	showText?: boolean;
	className?: string;
	href?: string;
}

export function AppLogo({
	size = "medium",
	showText = true,
	className,
	href = "/feed",
}: AppLogoProps) {
	const imageSize = size === "small" ? 32 : size === "medium" ? 48 : 80;

	return (
		<Link
			href={href}
			className={cn(logoVariants({ size }), className)}
			aria-label="TechTokホームに移動"
		>
			<Image
				src="/techtok_app_icon.svg"
				alt="TECHTOK"
				width={imageSize}
				height={imageSize}
				priority
			/>
			{showText && (
				<span className={textVariants({ size })}>TECHTOK</span>
			)}
		</Link>
	);
}
```

### Storybook Story

**ファイル**: `src/components/ui/app-logo.stories.tsx`

```typescript
import type { Meta, StoryObj } from "@storybook/react";
import { AppLogo } from "./app-logo";

const meta = {
	title: "UI/AppLogo",
	component: AppLogo,
	parameters: {
		layout: "centered",
	},
	tags: ["autodocs"],
	argTypes: {
		size: {
			control: "select",
			options: ["small", "medium", "large"],
		},
		showText: {
			control: "boolean",
		},
	},
} satisfies Meta<typeof AppLogo>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Small: Story = {
	args: {
		size: "small",
		showText: true,
	},
};

export const Medium: Story = {
	args: {
		size: "medium",
		showText: true,
	},
};

export const Large: Story = {
	args: {
		size: "large",
		showText: true,
	},
};

export const IconOnly: Story = {
	args: {
		size: "medium",
		showText: false,
	},
};

export const InDarkBackground: Story = {
	args: {
		size: "medium",
		showText: true,
	},
	decorators: [
		(Story) => (
			<div className="bg-black p-8 rounded-lg">
				<Story />
			</div>
		),
	],
};
```

### MobileHeader Component

**ファイル**: `src/components/layout/mobile-header.tsx`

```typescript
"use client";

import { AppLogo } from "@/components/ui/app-logo";
import { cn } from "@/lib/utils";

interface MobileHeaderProps {
	className?: string;
}

export function MobileHeader({ className }: MobileHeaderProps) {
	return (
		<header
			className={cn(
				"md:hidden",
				"fixed top-0 left-0 right-0 z-50",
				"bg-background/80 backdrop-blur-lg",
				"border-b border-border",
				"px-4 py-3",
				className
			)}
		>
			<AppLogo size="small" showText={false} />
		</header>
	);
}
```

## Data Models

このコンポーネントは静的なUIコンポーネントであり、データモデルは不要です。

## Error Handling

### 画像読み込みエラー

Next.jsの`Image`コンポーネントは自動的にエラーハンドリングを行います。追加のエラーハンドリングは不要です。

### ナビゲーションエラー

Next.jsの`Link`コンポーネントがクライアントサイドナビゲーションを処理します。エラー時はブラウザのデフォルト動作にフォールバックします。

## Testing Strategy

### Unit Tests (Optional)

- コンポーネントのレンダリング確認
- propsによるバリアント切り替え確認
- アクセシビリティ属性の確認

### Visual Testing (Storybook)

- 各サイズバリアントの表示確認
- テキスト表示/非表示の確認
- ダークモード/ライトモードでの表示確認
- ホバー状態の確認

### Integration Testing (Optional)

- クリック時のナビゲーション動作確認
- キーボードナビゲーション確認

## Implementation Details

### 配置の詳細

#### 1. SidebarNavigation

```typescript
// src/components/layout/sidebar-navigation.tsx
import { AppLogo } from "@/components/ui/app-logo";

export function SidebarNavigation({ className }: SidebarNavigationProps) {
	// ... existing code ...
	
	return (
		<nav className={cn(/* ... */)}>
			{/* ロゴを最上部に追加 */}
			<div className="px-2 py-4 border-b border-border">
				<AppLogo size="medium" showText />
			</div>
			
			<div className="flex flex-col gap-1 mt-4">
				{items.map((item) => (
					<NavigationItem key={item.href} {...item} variant="sidebar" />
				))}
			</div>
		</nav>
	);
}
```

#### 2. LoginForm

```typescript
// src/features/auth/components/login-form.tsx
import { AppLogo } from "@/components/ui/app-logo";

export function LoginForm({ callbackUrl = "/feed", error }: LoginFormProps) {
	return (
		<div className="flex min-h-screen items-center justify-center bg-background px-4 py-12 sm:px-6 lg:px-8">
			<Card className="w-full max-w-md">
				{/* ロゴをCardHeaderの前に追加 */}
				<div className="flex justify-center pt-8 pb-4">
					<AppLogo size="large" showText />
				</div>
				
				<CardHeader className="space-y-1">
					{/* ... existing code ... */}
				</CardHeader>
				{/* ... rest of the code ... */}
			</Card>
		</div>
	);
}
```

#### 3. UnauthenticatedHomeWrapper

```typescript
// src/features/feed/components/unauthenticated-home-wrapper.tsx
import { MobileHeader } from "@/components/layout/mobile-header";

export function UnauthenticatedHomeWrapper({ articles, error }: Props) {
	return (
		<>
			{/* モバイルヘッダーを追加 */}
			<MobileHeader />
			
			{/* 既存のコンテンツ（上部パディングを追加） */}
			<div className="pt-16 md:pt-0">
				{/* ... existing code ... */}
			</div>
		</>
	);
}
```

#### 4. MainNavigation (モバイルヘッダー追加)

```typescript
// src/components/layout/main-navigation.tsx
import { MobileHeader } from "./mobile-header";

export function MainNavigation({ className }: MainNavigationProps) {
	const { data: session } = useSession();

	if (!session) {
		return null;
	}

	return (
		<>
			<MobileHeader />
			<SidebarNavigation className={className} />
			<BottomNavigation className={className} />
		</>
	);
}
```

### レイアウト調整

モバイルヘッダーを追加するため、メインコンテンツに上部パディングを追加：

```typescript
// src/app/layout.tsx
<div className="min-h-screen pt-16 md:pt-0 pb-24 md:pb-0 md:ml-64">
	{children}
</div>
```

## Design Decisions

### 1. SVG vs PNG

**決定**: SVGを優先使用

**理由**:
- スケーラブルで高解像度ディスプレイに対応
- ファイルサイズが小さい
- ダークモード対応が容易

### 2. class-variance-authority使用

**決定**: cvaでバリアント管理

**理由**:
- 既存のUIコンポーネントと一貫性
- 型安全なバリアント管理
- Tailwind CSSとの統合が容易

### 3. Next.js Image vs img

**決定**: Next.js Imageコンポーネント使用

**理由**:
- 自動最適化
- 遅延読み込み対応
- パフォーマンス向上

### 4. モバイルヘッダーの配置

**決定**: 固定位置ヘッダーとして実装

**理由**:
- ブランド認知を常に維持
- TikTok風UIとの整合性
- スクロール時も視認性を確保

### 5. テキスト表示の制御

**決定**: showTextプロップで制御

**理由**:
- 柔軟性の確保
- モバイルでの省スペース化
- 各コンテキストに応じた最適化

## Accessibility Considerations

- `aria-label`でスクリーンリーダー対応
- キーボードナビゲーション（Tab、Enter）対応
- フォーカスリング表示
- 十分なコントラスト比の確保
- セマンティックHTML（`<header>`, `<nav>`）の使用

## Performance Considerations

- Next.js Imageの`priority`属性でLCP改善
- SVG使用によるファイルサイズ削減
- クライアントサイドナビゲーションで高速遷移
- 固定位置要素のGPUアクセラレーション（`backdrop-blur`）
