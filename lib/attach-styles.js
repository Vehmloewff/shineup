const head = require("./string-to-head");
const { cssifyObject } = require("css-in-js-utils");

module.exports = /**
 * Attach your styles object directly to the document head
 * @param {Object} styles An object that is valid css
 * @param {String} key This is the unique indentifer used to avoid conflicts
 */ function attachStyles(styles, key) {
	if (!styles || typeof styles !== `object`) throw new Error(`'styles' must be a defined object.`);
	if (!key || typeof key !== `string` || key.length < 1)
		throw new Error(`'key' must be a defined string and not be empty.`);

	head.stringToHead(
		(function() {
			let str = ``;

			Object.keys(styles).forEach((key) => {
				str += `${key}{${cssifyObject(styles[key])}}\n`;
			});

			return str;
		})(),
		key
	);
};
