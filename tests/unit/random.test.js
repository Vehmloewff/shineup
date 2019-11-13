const random = require("../../lib/random");

describe(`random`, () => {
	it(`should create an id full of valid chars that is 10 chars long`, () => {
		const id = random(10);

		expect(id).toMatch(/^[a-z0-9A-Z]+$/);
        expect(id.length).toBe(10);
        expect(random(200).length).toBe(200)
	});
});
