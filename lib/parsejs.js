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

function addToRoot(rootName, childName, childObject) {
	return {
		newName: childName.replace("$", rootName),
		newObject: childObject,
	};
}

function findExtraAndAddToRoot(rootName, rootObject) {
	const children = {};

	for (let objectKey in rootObject) {
		if (/^\$/.test(objectKey)) {
			const { newName, newObject } = addToRoot(rootName, objectKey, rootObject[objectKey]);
			delete rootObject[objectKey];

			children[newName] = newObject;
		}
	}

	return {
		rootObject,
		children,
	};
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

	let newObj = {};

	for (let className in obj) {
		const dottedClassname = addDotToClassName(className);

		const { rootObject, children } = findExtraAndAddToRoot(dottedClassname, obj[className]);

		newObj[dottedClassname] = rootObject;

		newObj = Object.assign(newObj, children);
	}

	return newObj;
};
