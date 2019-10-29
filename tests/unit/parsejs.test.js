const parseJS = require("../../lib/parsejs");
const isDOM = require("is-dom");

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
				$h1: {
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
					$h1: {
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

	it(`should combine the $ to the parent values insde the children`, () => {
		expect(
			parseJS({
				foreground: {
					top: "0",
					$h1: {
						left: "0",
						".active": {
							right: "0",
						},
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
			".foreground h1.active": {
				right: "0",
			},
		});
	});

	it(`should call functions and populate the parent with the result`, () => {
		expect(
			parseJS({
				foreground: {
					top: "0",
					background: () => {
						return "red";
					},
				},
			})
		).toMatchObject({
			".foreground": {
				top: "0",
				background: "red",
			},
		});
	});

	it(`should call functions and populate the parent with the result in a recursive manner`, () => {
		expect(
			parseJS({
				foreground: {
					top: "0",
					$h1: () => {
						return {
							color: "red",
							border: "1px solid green",
							background: () => {
								return "blue";
							},
						};
					},
				},
			})
		).toMatchObject({
			".foreground": {
				top: "0",
			},
			".foreground h1": {
				color: "red",
				border: "1px solid green",
				background: "blue",
			},
		});
	});

	it(`should assign the value of functions that start with '&' symbol to the parent`, () => {
		expect(
			parseJS({
				top: "0",
				"&background": () => {
					return { background: "red" };
				},
			})
		).toMatchObject({
			".default": {
				top: "0",
				background: "red",
			},
		});
	});

	it(`should assign the value of functions that start with '&' symbol to the parent in a recursive manner`, () => {
		expect(
			parseJS({
				top: "0",
				"&712347": () => {
					return {
						right: "0",
						"&8913242": () => {
							return {
								left: "0",
								"&198324112": () => {
									return { bottom: "0" };
								},
							};
						},
					};
				},
			})
		).toMatchObject({
			".default": {
				top: "0",
				right: "0",
				left: "0",
				bottom: "0",
			},
		});
	});

	describe(`parseJS should pass in three arguments to the functions of the right type`, () => {
		parseJS(
			{
				top: "0",
				right: "0",
				left: function func({ obj, parent, key, id, className, querySelector }) {
					it(`obj should match the entire object passed in`, () => {
						expect(obj).toMatchObject({
							".default": {
								top: "0",
								right: "0",
								left: func,
							},
						});
					});

					it(`parent should match the parent obj`, () => {
						expect(parent).toMatchObject({
							top: "0",
							right: "0",
							left: func,
						});
					});

					it(`key should match the key`, () => {
						expect(key).toBe("left");
					});

					it(`id should be valid`, () => {
						expect(id).toBe("random-thing");
					});

					it(`className should be the selector`, () => {
						expect(className).toBe("default");
					});

					it(`querySelector should be the id + the class`, () => {
						expect(querySelector).toBe("." + id + "." + className);
					});
				},
			},
			"random-thing"
		);
	});

	it(`should still work when there are no params passed`, () => {
		expect(parseJS()).toMatchObject({});
	});

	it(`should work when there is only one key:value pair passed`, () => {
		expect(parseJS({ color: "red" })).toMatchObject({
			".default": {
				color: "red",
			},
		});
	});

	it(`should throw when types are invalid`, () => {
		expect(() => parseJS("", "")).toThrow();
		expect(() => parseJS({}, 0)).toThrow();
	});
});
