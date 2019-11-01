const parseJS = require("./parsejs");
const attachStyles = require("./attach-styles");

module.exports = (obj = {}, key = "my-component") => {
	const { css, classes } = parseJS(obj, key);
	const newParsed = {};

	let length = 0;
	for (let className in css) {
		const selector = `.${key}${className}`;

		newParsed[selector] = css[className];
		length++;
	}

	classes.get = (className) => {
		return classes[className];
	};

	attachStyles(newParsed, key);

	if (length === 1 && classes.default) return classes.default;
	else return classes;
};
