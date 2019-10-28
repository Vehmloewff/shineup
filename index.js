const debug = require('./debug')('startup');

function sayHello(name) {
	debug.error('Failed!');
	debug.warn('Warning!');
	debug.notice('Notice...');
	debug.info('Up to date!');

	return `Hello, ${name}!`;
}

module.exports = sayHello;
