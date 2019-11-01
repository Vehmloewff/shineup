const createStyles = require("../../lib/create-styles");
const mockHead = require("../helpers/mock-string-to-head");

describe(`createStyles`, () => {
	beforeEach(() => {
		mockHead(() => {});
	});

	it(`should return the classname`, () => {
		expect(
			createStyles(
				{
					background: "blue",
				},
				"com"
			)
		).toBe(`com default`);
	});

	it(`should return an object`, () => {
		expect(
			createStyles(
				{
					background: {
						background: "blue",
					},
				},
				"com"
			)
		).toMatchObject({
			background: `com background`,
		});
	});

	it(`should return a get function`, () => {
		expect(
			createStyles(
				{
					background: {
						background: "blue",
					},
				},
				"com"
			).get("background")
		).toBe(`com background`);
	});

	it(`should yell at us when invalid params are passed`, () => {
		expect(() => createStyles("", "com")).toThrow();
		expect(() => createStyles(0, "com")).toThrow();
		expect(() => createStyles({}, null)).toThrow();
		expect(() => createStyles({}, {})).toThrow();
	});
});
