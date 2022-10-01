const { promises: fs } = require("fs");
const { PurgeCSS } = require("purgecss");
const glob = require("glob");

/**
 * @comment
 */

async function purgeComponent(componentFilePath) {
	const vueComponetFile = await fs.readFile(componentFilePath, "utf-8");

	const purgeCSSResults = await new PurgeCSS().purge({
		content: [{ raw: vueComponetFile, extension: "vue" }],

		defaultExtractor: function (content) {
			const contentWithoutStyleBlocks = content.replace(/<style[^]+?<\/style>/gi, "");
			return contentWithoutStyleBlocks.match(/[A-Za-z0-9-_/:]*[A-Za-z0-9-_/]+/g) || [];
		},

		safelist: [/-(leave|enter|appear)(|-(to|from|active))$/, /^(?!(|.*?:)cursor-move).+-move$/, /^router-link(|-exact)-active$/, /data-v-.*/],

		variables: true,
		keyframes: true,
		fontFace: true,
	});

	for (result of purgeCSSResults) {
		let file = vueComponetFile;
		file += `\n<style scoped>\n${result.css}\n</style>
		`;
		fs.writeFile(componentFilePath, file);
	}
}

glob("../../client/src/**/*.vue", async (error, files) => {
	if (error) {
		console.error(error);
	} else {
		await Promise.all(
			files.map((filePath) => {
				return purgeComponent(filePath);
			}),
		);
	}
});
