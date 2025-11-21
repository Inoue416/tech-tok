/**
 * Storybook用のfeed Server Actionsモック
 */

export async function getArticles(cursor?: string) {
	console.warn("[Storybook] getArticles was called but is mocked");
	return {
		articles: [],
		nextCursor: null,
	};
}

export async function getArticleById(articleId: string) {
	console.warn("[Storybook] getArticleById was called but is mocked");
	return {
		article: null,
	};
}

