/**
 * Storybook用のBetter Auth Client モック
 */

export const authClient = {
	signIn: {
		social: async () => {
			console.warn("[Storybook] authClient.signIn.social was called but is mocked");
			return { data: null, error: null };
		},
	},
	signOut: async () => {
		console.warn("[Storybook] authClient.signOut was called but is mocked");
		return { data: null, error: null };
	},
	useSession: () => {
		return {
			data: null,
			isPending: false,
			error: null,
		};
	},
};

export const signIn = authClient.signIn;
export const signOut = authClient.signOut;
export const useSession = authClient.useSession;

