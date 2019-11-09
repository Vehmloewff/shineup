const createStyles = require("./lib/create-styles");
const random = require("./lib/random");

module.exports = {
	parseJS: require("./lib/parsejs"),
	attachStyles: require("./lib/attach-styles"),
	createScope: () => {
		const key = `s${random()}`;
		const style = (obj) => createStyles(obj, key);

		return { style };
	},
	ready: require("./lib/ready").ready,
	createStyles,
};
