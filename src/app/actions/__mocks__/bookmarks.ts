/**
 * Storybook用のbookmarks Server Actionsモック
 */

export async function getBookmarks() {
	console.warn("[Storybook] getBookmarks was called but is mocked");
	return {
		bookmarks: [],
	};
}

export async function removeBookmark(_bookmarkId: string) {
	console.warn("[Storybook] removeBookmark was called but is mocked");
	return {
		success: true,
	};
}

