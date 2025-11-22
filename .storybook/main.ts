import type { StorybookConfig } from "@storybook/nextjs";
import path from "node:path";
import webpack from "webpack";

const config: StorybookConfig = {
	stories: ["../src/**/*.stories.@(js|jsx|ts|tsx)"],
	addons: [
		"@storybook/addon-essentials",
	],
	framework: {
		name: "@storybook/nextjs",
		options: {},
	},
	staticDirs: ["../public"],
	typescript: {
		reactDocgen: "react-docgen-typescript",
	},
	webpackFinal: async (config) => {
		// NormalModuleReplacementPluginを使用してモジュールを置換
		if (!config.plugins) {
			config.plugins = [];
		}
		
		config.plugins.push(
			// 生成されたPrismaファイル全体をモックに置換（__mocks__以外）
			new webpack.NormalModuleReplacementPlugin(
				/src\/generated\/prisma\/client\.ts$/,
				path.resolve(__dirname, "../src/generated/prisma/__mocks__/client.ts")
			),
			new webpack.NormalModuleReplacementPlugin(
				/src\/generated\/prisma\/(?!__mocks__).*\.ts$/,
				path.resolve(__dirname, "../src/lib/__mocks__/empty.ts")
			),
			// Prisma Clientをモックに置換
			new webpack.NormalModuleReplacementPlugin(
				/^@prisma\/client$/,
				path.resolve(__dirname, "../src/generated/prisma/__mocks__/client.ts")
			),
			new webpack.NormalModuleReplacementPlugin(
				/^@prisma\/adapter-pg$/,
				path.resolve(__dirname, "../src/lib/__mocks__/empty.ts")
			),
			new webpack.NormalModuleReplacementPlugin(
				/^@prisma\/extension-accelerate$/,
				path.resolve(__dirname, "../src/lib/__mocks__/empty.ts")
			),
			new webpack.NormalModuleReplacementPlugin(
				/^@prisma\/client\/runtime\/library$/,
				path.resolve(__dirname, "../src/lib/__mocks__/empty.ts")
			),
			new webpack.NormalModuleReplacementPlugin(
				/^@prisma\/client\/runtime\/client\.mjs$/,
				path.resolve(__dirname, "../src/lib/__mocks__/empty.ts")
			),
			new webpack.NormalModuleReplacementPlugin(
				/@prisma\/client\/runtime/,
				path.resolve(__dirname, "../src/lib/__mocks__/empty.ts")
			),
			// pg と pg-native をモックに置換
			new webpack.NormalModuleReplacementPlugin(
				/^pg$/,
				path.resolve(__dirname, "../src/lib/__mocks__/empty.ts")
			),
			new webpack.NormalModuleReplacementPlugin(
				/^pg-native$/,
				path.resolve(__dirname, "../src/lib/__mocks__/empty.ts")
			),
			// Better Authをモックに置換
			new webpack.NormalModuleReplacementPlugin(
				/^better-auth$/,
				path.resolve(__dirname, "../src/lib/__mocks__/empty.ts")
			),
			new webpack.NormalModuleReplacementPlugin(
				/^better-auth\/react$/,
				path.resolve(__dirname, "../src/lib/__mocks__/auth-client.ts")
			),
			new webpack.NormalModuleReplacementPlugin(
				/^better-auth\/adapters\/prisma$/,
				path.resolve(__dirname, "../src/lib/__mocks__/empty.ts")
			),
		);
		// Node.jsビルトインモジュールのポリフィルを無効化
		if (config.resolve) {
			config.resolve.fallback = {
				...config.resolve.fallback,
				"node:events": false,
				"node:path": false,
				"node:url": false,
				"node:fs": false,
				"node:crypto": false,
				"node:stream": false,
				"node:util": false,
				"node:buffer": false,
				"node:os": false,
				"node:net": false,
				"node:tls": false,
				"node:zlib": false,
				"node:http": false,
				"node:https": false,
				"node:assert": false,
				fs: false,
				net: false,
				tls: false,
				crypto: false,
				stream: false,
				url: false,
				zlib: false,
				http: false,
				https: false,
				assert: false,
				os: false,
				path: false,
				util: false,
				events: false,
				buffer: false,
			};
		}

		// Prisma関連のモジュールをモック
		if (config.resolve && config.resolve.alias) {
			const alias = config.resolve.alias as Record<string, string | false>;
			// プライマリーなモック
			alias["@/lib/prisma"] = path.resolve(__dirname, "../src/lib/__mocks__/prisma.ts");
			alias["@/generated/prisma/client"] = path.resolve(__dirname, "../src/generated/prisma/__mocks__/client.ts");
			
			// 生成されたPrismaファイルをすべてモックに置換
			alias["@/generated/prisma/internal/class"] = path.resolve(__dirname, "../src/lib/__mocks__/empty.ts");
			alias["@/generated/prisma/internal/prismaNamespace"] = path.resolve(__dirname, "../src/lib/__mocks__/empty.ts");
			alias["@/generated/prisma/internal/prismaNamespaceBrowser"] = path.resolve(__dirname, "../src/lib/__mocks__/empty.ts");
			
			// Prisma Clientをモック
			alias["@prisma/client"] = path.resolve(__dirname, "../src/generated/prisma/__mocks__/client.ts");
			alias["@prisma/client/runtime/library"] = path.resolve(__dirname, "../src/lib/__mocks__/empty.ts");
			alias["@prisma/client/runtime/client.mjs"] = path.resolve(__dirname, "../src/lib/__mocks__/empty.ts");
			alias["pg-native"] = path.resolve(__dirname, "../src/lib/__mocks__/empty.ts");
			alias["pg"] = path.resolve(__dirname, "../src/lib/__mocks__/empty.ts");
			
			// Server Actionsをモック
			alias["@/app/actions/interactions"] = path.resolve(__dirname, "../src/app/actions/__mocks__/interactions.ts");
			alias["@/app/actions/bookmarks"] = path.resolve(__dirname, "../src/app/actions/__mocks__/bookmarks.ts");
			alias["@/app/actions/feed"] = path.resolve(__dirname, "../src/app/actions/__mocks__/feed.ts");
			alias["@/app/actions/profile"] = path.resolve(__dirname, "../src/app/actions/__mocks__/profile.ts");
			
			// Better Authをモック
			alias["@/lib/auth"] = path.resolve(__dirname, "../src/lib/__mocks__/auth.ts");
			alias["@/lib/auth-client"] = path.resolve(__dirname, "../src/lib/__mocks__/auth-client.ts");
			alias["better-auth"] = path.resolve(__dirname, "../src/lib/__mocks__/empty.ts");
			alias["better-auth/react"] = path.resolve(__dirname, "../src/lib/__mocks__/auth-client.ts");
			alias["better-auth/adapters/prisma"] = path.resolve(__dirname, "../src/lib/__mocks__/empty.ts");
		}

		return config;
	},
	docs: {},
};

export default config;
