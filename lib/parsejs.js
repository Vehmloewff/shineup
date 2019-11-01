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

function getParent(obj, delimiter) {
	const returnObj = {};

	Object.keys(obj).forEach((key) => {
		const roots = key.split(delimiter);
		const root = roots[roots.length - 1];

		returnObj[root] = obj[key];
	});

	return returnObj;
}

function flattenObjectChildren(obj, id) {
	const delimiter = `|`;
	const savedObject = obj;

	function callAllFunctions(obj) {
		let funcsExist = true;

		function callVisibileFunctions(obj) {
			funcsExist = false;

			for (let key in obj) {
				if (typeof obj[key] === "function") {
					const rootKeys = key.split(delimiter);
					const lastKey = rootKeys.pop();

					const className = rootKeys[0].replace(/^\./, "");

					const res = obj[key]({
						obj: savedObject,
						parent: getParent(obj, delimiter),
						key: lastKey,
						id,
						className,
						querySelector: `.${id}.${className}`,
					});

					// If last key starts with '&'...
					if (/^&/.test(lastKey)) {
						// Spread it over the parent
						delete obj[key];

						if (typeof res !== "object")
							throw new Error(
								`The value of all keys starting with an '&' symbol of type 'function' must return an object.`
							);

						const rootKey = rootKeys.join(delimiter);
						Object.keys(res).forEach((newKey) => {
							obj[`${rootKey}|${newKey}`] = res[newKey];
						});
					}
					// Otherwise
					else {
						// Carry on
						obj[key] = res;
					}

					funcsExist = true;
				}
			}

			return obj;
		}

		while (funcsExist) {
			obj = callVisibileFunctions(flatten(obj, { delimiter }));
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

	return flatten.unflatten(newObj, { delimiter });
}

module.exports = /**
 * Parses the JS into a css string
 * @param {Object} obj Javascript object to be parsed
 * @param {String} id The id that is used to avoid conflicts
 * @returns {{css: Object, classes: Object}} The parsed JS
 */ function parseJS(obj = {}, id = "my-component") {
	// Check the types
	if (typeof obj !== "object")
		throw new Error(`The first paramater must be of type 'object'.  Recieved type '${typeof obj}';`);
	if (typeof id !== "string")
		throw new Error(`The second paramater must be of type 'string'.  Recieved type '${typeof id}';`);

	if (JSON.stringify(obj) === `{}`) return { css: {}, classes: {} };

	// All the types are valid.  Carry on.
	if (!isLayered(obj)) {
		const defaultName = "default";

		const defaultCSS = { [defaultName]: {} };

		defaultCSS[defaultName] = obj;

		obj = defaultCSS;
	}

	const classes = {};

	for (let className in obj) {
		const dottedClassname = addDotToClassName(className);

		obj[dottedClassname] = obj[className];

		classes[className] = `${id} ${className}`;

		delete obj[className];
	}

	const css = flattenObjectChildren(obj, id);

	return { css, classes };
};
