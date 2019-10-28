const sayHello = require('../../');

describe('sayHello', () => {
	it(`Should return a gretting containing the name`, () => {
		const res = sayHello('Elijah');
		expect(res).toMatch(/Elijah/);
	});
});
