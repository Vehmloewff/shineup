/**
 * Parses the JS into a css string
 * @param {Object} js Javascript object to be parsed
 * @returns {String} The parsed css
 */
function parseJS(js = {}) {
	return `${js}`;
}

/**
 * Simplify a JS object
 * @param {Object} js The Javascript object to be simplified
 * @returns {{ css: Object, get: (name) => void}}
 */
function simplifyJS(js = {}) {
	return js;
}

module.exports = {
	parseJS,
	simplifyJS,
};
