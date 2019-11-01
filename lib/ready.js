const callOnReady = [];
let isReady = false;

module.exports.onReady = (fn) => {
	if (isReady) fn();
	else callOnReady.push(fn);
};

module.exports.ready = () => {
	isReady = true;
	for (let index in callOnReady) {
		callOnReady[index]();
	}
};
