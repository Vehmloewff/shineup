const parseJS = require("./parsejs");
const attachStyles = require("./attach-styles");
const { onReady } = require("./ready");

module.exports = (obj = {}, key = "my-component") => {
	const parsed = parseJS(obj, key);
	const classes = {};
	const newParsed = {};

	let length = 0;
	for (let className in parsed) {
		const name = className.replace(".", "");
		const data = `${key} ${name}`;
		const selector = `.${key}${className}`;

		newParsed[selector] = parsed[className];
		classes[name] = data;
		length++;
	}

	classes.get = (className) => {
		return classes[className];
	};

	console.log(classes)

	onReady(() => attachStyles(newParsed, key));

	if (length === 1 && classes.default) return classes.default;
	else return classes;
};
