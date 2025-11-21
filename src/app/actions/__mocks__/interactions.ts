/**
 * Storybook用のinteractions Server Actionsモック
 */

export async function toggleLike(articleId: string) {
	console.warn("[Storybook] toggleLike was called but is mocked");
	return {
		success: true,
		liked: true,
		likeCount: 100,
	};
}

export async function getLikeStatus(articleId: string) {
	console.warn("[Storybook] getLikeStatus was called but is mocked");
	return {
		isLiked: false,
		likeCount: 100,
	};
}

export async function toggleBookmark(articleId: string) {
	console.warn("[Storybook] toggleBookmark was called but is mocked");
	return {
		success: true,
		bookmarked: true,
	};
}

export async function getBookmarkStatus(articleId: string) {
	console.warn("[Storybook] getBookmarkStatus was called but is mocked");
	return {
		isBookmarked: false,
	};
}

export async function shareArticle(articleId: string, platform: string) {
	console.warn("[Storybook] shareArticle was called but is mocked");
	return {
		success: true,
	};
}

export async function addComment(articleId: string, content: string) {
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

export async function getComments(articleId: string) {
	console.warn("[Storybook] getComments was called but is mocked");
	return {
		comments: [],
	};
}

