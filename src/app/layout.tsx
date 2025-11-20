import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { MainContentWrapper } from "@/components/layout/main-content-wrapper";
import { MainNavigation } from "@/components/layout/main-navigation";

const geistSans = Geist({
	variable: "--font-geist-sans",
	subsets: ["latin"],
});

const geistMono = Geist_Mono({
	variable: "--font-geist-mono",
	subsets: ["latin"],
});

export const metadata: Metadata = {
	title: "TECHTOK",
	description: "技術ブログを縦スクロールで閲覧できるサービス",
	manifest: "/manifest.json",
	icons: {
		icon: [
			{ url: "/icon.svg", type: "image/svg+xml" },
			{ url: "/favicon.ico", sizes: "any" },
		],
		apple: "/apple-icon.png",
	},
	appleWebApp: {
		capable: true,
		statusBarStyle: "black-translucent",
		title: "TECHTOK",
	},
	openGraph: {
		type: "website",
		locale: "ja_JP",
		url: "https://techtok.app",
		siteName: "TECHTOK",
		title: "TECHTOK",
		description: "技術ブログを縦スクロールで閲覧できるサービス",
		images: [
			{
				url: "/techtok_app_icon.png",
				width: 512,
				height: 512,
				alt: "TECHTOK",
			},
		],
	},
	twitter: {
		card: "summary",
		title: "TECHTOK",
		description: "技術ブログを縦スクロールで閲覧できるサービス",
		images: ["/techtok_app_icon.png"],
	},
};

export default async function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<html lang="ja">
			<body
				className={`${geistSans.variable} ${geistMono.variable} antialiased`}
			>
				<MainContentWrapper>{children}</MainContentWrapper>
				<MainNavigation />
			</body>
		</html>
	);
}
