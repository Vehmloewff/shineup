module .exports = () => {
	const string = String(
		Math.random() *
		Math.pow(10, Math.random() * 200) *
		Math.random() * Math.pow(10, Math.random() * 200)
	) + '-shine';

	return string.split('.').join('').split('+').join('')
};