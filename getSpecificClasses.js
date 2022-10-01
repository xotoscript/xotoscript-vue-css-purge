const cssSelectorExtract = require("css-selector-extract");
const fs = require("fs");

(async () => {
	const result = await cssSelectorExtract.process({
		css: cssFile,

		filters: [/\.show/],
	});
	fs.writeFileSync("show-classes.scss", result);
})();
