const Parser = require("./Parser");

class Router {
	constructor(rim) {
		this.rim = rim;
		this.parser = new Parser(rim);
	}

	async handle(event) {

		const ctx = this.parser.parse(event);

		// ليست أمر
		if (!ctx.isCommand)
			return;

		const command = this.rim.commands.get(ctx.command);

		if (!command)
			return;

		try {

			await command.execute(ctx);

		}
		catch (err) {

			console.error(
				`[Router] خطأ داخل الأمر ${ctx.command}\n`,
				err
			);

		}

	}
}

module.exports = Router;
