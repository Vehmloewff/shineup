const createStyles = require("./lib/create-styles");

const random = () => {
	const string = String(
		Math.random() *
		Math.pow(10, Math.random() * 200) *
		Math.random() * Math.pow(10, Math.random() * 200)
	) + '-shine';

	return string.split('.').join('').split('+').join('')
};

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
