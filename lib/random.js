const nums = `1234567890`.split('');
const letters = `abcdefghijklmnopqrstuvwxyz`;
const specialChars = `-`.split('');
const lowerCaseLetters = letters.split('');
const upperCaseLetters = letters.toUpperCase().split('');

const choices = nums.concat(lowerCaseLetters, upperCaseLetters, specialChars);

module.exports = (length) => {
	const getChar = () => choices[Math.floor(Math.random() * choices.length)];

	let chars = ``;
	for (let cur = 0; cur < length; cur++) {
		chars += getChar();
	}

	return chars;
};
