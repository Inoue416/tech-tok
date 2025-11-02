import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { MainNavigation } from "@/components/layout/main-navigation";
import { getSession } from "@/lib/auth";

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
	description: "技術ブログを縦スクロースで閲覧できるサービス",
};

export default async function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	const session = await getSession();

	return (
		<html lang="ja">
			<body
				className={`${geistSans.variable} ${geistMono.variable} antialiased`}
			>
				<div className="min-h-screen pb-24 md:pb-0 md:ml-64">{children}</div>
				{session && <MainNavigation />}
			</body>
		</html>
	);
}
