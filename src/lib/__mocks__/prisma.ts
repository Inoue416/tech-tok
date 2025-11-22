/**
 * Storybook用のPrismaクライアントモック
 */

const mockPrisma = {
	user: {
		findUnique: async () => null,
		findMany: async () => [],
		create: async () => ({}),
		update: async () => ({}),
		delete: async () => ({}),
	},
	article: {
		findUnique: async () => null,
		findMany: async () => [],
		create: async () => ({}),
		update: async () => ({}),
		delete: async () => ({}),
	},
	like: {
		findUnique: async () => null,
		findMany: async () => [],
		create: async () => ({}),
		delete: async () => ({}),
	},
	bookmark: {
		findUnique: async () => null,
		findMany: async () => [],
		create: async () => ({}),
		delete: async () => ({}),
	},
	comment: {
		findUnique: async () => null,
		findMany: async () => [],
		create: async () => ({}),
		update: async () => ({}),
		delete: async () => ({}),
	},
	share: {
		findUnique: async () => null,
		findMany: async () => [],
		create: async () => ({}),
	},
	$transaction: async (fn: unknown) => {
		if (typeof fn === "function") {
			return fn(mockPrisma);
		}
		return [];
	},
	$disconnect: async () => {},
};

export const prisma = mockPrisma as unknown;
export default mockPrisma;

