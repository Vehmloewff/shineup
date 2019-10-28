const debug = require('debug');
const chalk = require('chalk');
const name = `TODO-change-this`;

/**
 * @param {String?} job The job that is logging
 */
module.exports = (job) => {
	const log = debug(`${name}:${job}`);

	/**
	 * Log an error message to the console
	 * @param {String} message What to log
	 */
	function error(message) {
		log(chalk.black.bgRed('ERROR:'), message);
	}

	/**
	 * Log a warning message to the console
	 * @param {String} message What to log
	 */
	function warn(message) {
		log(chalk.black.bgYellow('WARN:'), message);
	}

	/**
	 * Log a notice message to the console
	 * @param {String} message What to log
	 */
	function notice(message) {
		log(chalk.black.bgCyan('NOTICE:'), message);
	}

	/**
	 * Log an info message to the console
	 * @param {String} message What to log
	 */
	function info(message) {
		log(chalk.black.bgGreen('INFO:'), message);
	}

	return {
		error,
		warn,
		notice,
		info,
	};
};
