/**
 * Storybook用のfeed Server Actionsモック
 */

export async function getArticles(_cursor?: string) {
	console.warn("[Storybook] getArticles was called but is mocked");
	return {
		articles: [],
		nextCursor: null,
	};
}

export async function getArticleById(_articleId: string) {
	console.warn("[Storybook] getArticleById was called but is mocked");
	return {
		article: null,
	};
}

