/**
 * Storybook用のprofile Server Actionsモック
 */

export async function getProfile() {
	console.warn("[Storybook] getProfile was called but is mocked");
	return {
		profile: null,
	};
}

export async function updateProfile(data: any) {
	console.warn("[Storybook] updateProfile was called but is mocked");
	return {
		success: true,
		profile: data,
	};
}

export async function deleteAccount() {
	console.warn("[Storybook] deleteAccount was called but is mocked");
	return {
		success: true,
	};
}

