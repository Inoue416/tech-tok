/**
 * Storybook用のBetter Auth Server モック
 */

export const auth = {
	api: {
		getSession: async () => null,
		signOut: async () => ({ success: true }),
	},
	$Infer: {
		Session: {} as Record<string, never>,
	},
};

export type Session = {
	user: {
		id: string;
		name: string;
		email: string;
		image?: string;
	};
	session: {
		id: string;
		userId: string;
		expiresAt: Date;
	};
} | null;

