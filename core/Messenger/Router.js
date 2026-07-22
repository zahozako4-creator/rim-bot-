const Parser = require("./Parser");
const Logger = require("../Logger");

class Router {

	constructor(rim) {

		this.rim = rim;

		this.parser = new Parser(rim);

	}

	async handle(event) {

		const ctx = this.parser.parse(event);

		// الرسالة ليست أمرًا
		if (!ctx.isCommand)
			return;

		// دعم الـ Alias
		const commandName =
			this.rim.loader?.resolveAlias(ctx.command) || ctx.command;

		const command = this.rim.commands.get(commandName);

		if (!command) {

			Logger.warn(
				"ROUTER",
				`الأمر غير موجود: ${ctx.command}`
			);

			return;

		}

		try {

			ctx.command = command;

			await command.execute(ctx);

		}
		catch (err) {

			Logger.error(
				"ROUTER",
				err.stack || err.message
			);

		}

	}

}

module.exports = Router;
