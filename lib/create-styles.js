const parseJS = require("./parsejs");
const attachStyles = require("./attach-styles");

module.exports = (obj = {}, key = "my-component") => {
	const parsed = parseJS(obj, key);
	const classes = {};

	let length = 0;
	for (let className in parsed) {
		const name = className.replace(".", "");
		const data = `.${key}${className}`;

		classes[name] = data;
		length++;
	}

	classes.get = (className) => {
		return classes[className];
	};

	attachStyles(obj, key);

	if (length === 1 && classes.default) return classes.default;
	else return classes;
};
