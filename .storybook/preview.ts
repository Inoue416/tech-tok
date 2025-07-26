import "../src/app/globals.css";
import type { Preview } from "@storybook/nextjs";

const preview: Preview = {
	parameters: {
		actions: { argTypesRegex: "^on[A-Z].*" },
		controls: {
			matchers: {
				color: /(background|color)$/i,
				date: /Date$/i,
			},
		},
		// shadcn/uiやRadix UIのテーマ切り替えを行う場合はここにdecoratorを追加可能
	},
};

export default preview;
