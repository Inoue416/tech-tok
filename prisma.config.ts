/**
 * Prisma Configuration
 * Prisma 7の新しい設定方法に対応
 * データベース接続URLをここで管理します
 */

import "dotenv/config";
import { defineConfig, env } from "prisma/config";

export default defineConfig({
    schema: 'prisma/schema.prisma',
      migrations: {
        path: 'prisma/migrations',
      },
	datasource: {
        url: env("DIRECT_URL"),
	},
});

