const parseJS = require("../../lib/parsejs");

describe(`parseJS`, () => {
	it(`it should return a css obj`, () => {
		expect(
			parseJS({
				background: "red",
				"font-size": "20px",
			})
		).toMatchObject({
			".default": {
				background: "red",
				"font-size": "20px",
			},
		});
	});

	it(`should allow camelCased properties`, () => {
		expect(
			parseJS({
				background: "red",
				fontSize: "20px",
			})
		).toMatchObject({
			".default": {
				background: "red",
				fontSize: "20px",
			},
		});
	});

	it(`should return the name if it is given`, () => {
		expect(
			parseJS({
				background: {
					background: "red",
					fontSize: "20px",
				},
			})
		).toMatchObject({
			".background": {
				background: "red",
				fontSize: "20px",
			},
		});
	});

	it(`should return multiple objects if they are given`, () => {
		expect(
			parseJS({
				foreground: {
					top: "0",
				},
				background: {
					background: "red",
					fontSize: "20px",
				},
			})
		).toMatchObject({
			".foreground": {
				top: "0",
			},
			".background": {
				background: "red",
				fontSize: "20px",
			},
		});
	});

	it(`should combine the $ to the root .default`, () => {
		expect(
			parseJS({
				top: "0",
				"$ h1": {
					left: "0",
				},
			})
		).toMatchObject({
			".default": {
				top: "0",
			},
			".default h1": {
				left: "0",
			},
		});
	});

	it(`should combine the $ to the root`, () => {
		expect(
			parseJS({
				foreground: {
					top: "0",
					"$ h1": {
						left: "0",
					},
				},
			})
		).toMatchObject({
			".foreground": {
				top: "0",
			},
			".foreground h1": {
				left: "0",
			},
		});
	});
});
