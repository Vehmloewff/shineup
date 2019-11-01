const createStyles = require("./lib/create-styles");
const random = require("randomatic");

module.exports = {
	parseJS: require("./lib/parsejs"),
	attachStyles: require("./lib/attach-styles"),
	createScope: () => {
		const key = `s${random("aA0", 10)}`;
		const style = (obj) => createStyles(obj, key);

		return { style };
	},
	createStyles,
};
