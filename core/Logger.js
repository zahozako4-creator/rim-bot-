const chalk = require("chalk");

class Logger {

	getTime() {
		const date = new Date();

		const h = String(date.getHours()).padStart(2, "0");
		const m = String(date.getMinutes()).padStart(2, "0");
		const s = String(date.getSeconds()).padStart(2, "0");

		return `${h}:${m}:${s}`;
	}

	print(type, color, message) {
		console.log(
			chalk.gray(`[${this.getTime()}]`) +
			" " +
			color(`[${type}]`) +
			" " +
			chalk.white(message)
		);
	}

	info(message) {
		this.print("INFO", chalk.cyan, message);
	}

	success(message) {
		this.print("SUCCESS", chalk.green, message);
	}

	warn(message) {
		this.print("WARNING", chalk.yellow, message);
	}

	error(message) {
		this.print("ERROR", chalk.red, message);
	}

	debug(message) {
		this.print("DEBUG", chalk.magenta, message);
	}

	command(message) {
		this.print("COMMAND", chalk.blueBright, message);
	}

	event(message) {
		this.print("EVENT", chalk.hex("#ff66cc"), message);
	}

	database(message) {
		this.print("DATABASE", chalk.greenBright, message);
	}

	system(message) {
		this.print("SYSTEM", chalk.whiteBright, message);
	}

	login(message) {
		this.print("LOGIN", chalk.hex("#00ffff"), message);
	}

	api(message) {
		this.print("API", chalk.hex("#ff9900"), message);
	}

	plugin(message) {
		this.print("PLUGIN", chalk.hex("#9966ff"), message);
	}

	cache(message) {
		this.print("CACHE", chalk.hex("#00cc99"), message);
	}

	loader(message) {
		this.print("LOADER", chalk.hex("#ff66ff"), message);
	}

	router(message) {
		this.print("ROUTER", chalk.hex("#66ccff"), message);
	}
}

module.exports = new Logger();
