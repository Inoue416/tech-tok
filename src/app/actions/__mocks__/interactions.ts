/**
 * Storybook用のinteractions Server Actionsモック
 */

export async function toggleLike(_articleId: string) {
	console.warn("[Storybook] toggleLike was called but is mocked");
	return {
		success: true,
		liked: true,
		likeCount: 100,
	};
}

export async function getLikeStatus(_articleId: string) {
	console.warn("[Storybook] getLikeStatus was called but is mocked");
	return {
		isLiked: false,
		likeCount: 100,
	};
}

export async function toggleBookmark(_articleId: string) {
	console.warn("[Storybook] toggleBookmark was called but is mocked");
	return {
		success: true,
		bookmarked: true,
	};
}

export async function getBookmarkStatus(_articleId: string) {
	console.warn("[Storybook] getBookmarkStatus was called but is mocked");
	return {
		isBookmarked: false,
	};
}

export async function shareArticle(_articleId: string, _platform: string) {
	console.warn("[Storybook] shareArticle was called but is mocked");
	return {
		success: true,
	};
}

export async function addComment(_articleId: string, content: string) {
	console.warn("[Storybook] addComment was called but is mocked");
	return {
		success: true,
		comment: {
			id: "mock-comment-id",
			content,
			createdAt: new Date(),
		},
	};
}

export async function getComments(_articleId: string) {
	console.warn("[Storybook] getComments was called but is mocked");
	return {
		comments: [],
	};
}

