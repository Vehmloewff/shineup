module.exports = (fn) => {
	require("../../lib/string-to-head").stringToHead = fn;
};
