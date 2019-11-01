const createStyles = require("./lib/create-styles");
const generate = require("simple-random/browser");

module.exports = {
	parseJS: require("./lib/parsejs"),
	attachStyles: require("./lib/attach-styles"),
	createScope: () => {
		const key = `s${generate()}`;
		const style = (obj) => createStyles(obj, key);

		return { style };
	},
	createStyles,
};
