const attachStyles = require("../../lib/attach-styles");
const createMock = require("../helpers/mock-string-to-head");

describe(`attachStyles`, () => {
	it(`it should call 'string-to-head' with the correct params`, () => {
		const mockFunc = jest.fn(() => {});
		createMock(mockFunc);

		attachStyles(
			{
				".class": {
					color: "red",
				},
			},
			"some-id"
		);

		expect(mockFunc.mock.calls.length).toBe(1);
		expect(mockFunc.mock.calls[0][0]).toBe(`.class{color:red}`);
		expect(mockFunc.mock.calls[0][1]).toBe(`some-id`);
	});
});
