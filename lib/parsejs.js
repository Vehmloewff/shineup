const flatten = require("flat");

function isLayered(obj) {
	let layerFound = false;

	for (let possibleLayer in obj) {
		if (!/^\$/.test(possibleLayer) && typeof obj[possibleLayer] === "object") {
			layerFound = true;
			break;
		}
	}

	return layerFound;
}

function addDotToClassName(className) {
	if (!/^(\.|\$)/.test(className)) return "." + className;
	else return className;
}

function flattenObjectChildren(obj) {
	function callAllFunctions(obj) {
		let funcsExist = true;

		function callVisibileFunctions(obj) {
			funcsExist = false;

			for (let key in obj) {
				if (typeof obj[key] === "function") {
					obj[key] = obj[key]();
					funcsExist = true;
				}
			}

			return obj;
		}

		while (funcsExist) {
			obj = callVisibileFunctions(flatten(obj, { delimiter: "|" }));
		}

		return obj;
	}

	function changeKey(key) {
		const levels = key.split("|");
		const highestLevel = levels.pop();

		return `${levels.join("").replace(/\$/g, " ")}|${highestLevel}`;
	}

	const flatObj = callAllFunctions(obj);
	const newObj = {};

	for (let key in flatObj) {
		const value = flatObj[key];

		key = changeKey(key);
		newObj[key] = value;
	}

	return flatten.unflatten(newObj, { delimiter: "|" });
}

module.exports = /**
 * Parses the JS into a css string
 * @param {Object} obj Javascript object to be parsed
 * @returns {Object} The parsed JS
 */ function parseJS(obj = {}) {
	if (!isLayered(obj)) {
		const defaultName = "default";

		const defaultCSS = { [defaultName]: {} };

		defaultCSS[defaultName] = obj;

		obj = defaultCSS;
	}

	for (let className in obj) {
		const dottedClassname = addDotToClassName(className);

		obj[dottedClassname] = obj[className];

		delete obj[className];
	}

	obj = flattenObjectChildren(obj);

	return obj;
};