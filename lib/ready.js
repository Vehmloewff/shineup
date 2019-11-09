const functions = [];
let isReady = false;

module.exports = {
	ready: () => {
		isReady = true;
		functions.forEach((fn) => fn());
	},
	callOnReady: (fn) => {
		if (isReady) fn();
		else functions.push(fn);
	},
};
