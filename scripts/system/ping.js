const Command = require("../../core/structures/Command");

class Ping extends Command {

	constructor() {
		super({
			name: "بينغ",
			aliases: ["ping", "p"],
			category: "system",
			description: "عرض سرعة البوت",
			usage: ".بينغ",
			cooldown: 3,
			permissions: 0
		});
	}

	async execute(ctx) {

		const start = Date.now();

		await Rim.sender.text(
			ctx.threadID,
			"🏓 جاري قياس سرعة البوت..."
		);

		const ping = Date.now() - start;

		await Rim.sender.text(
			ctx.threadID,
			`🏓 سرعة البوت: ${ping} ms`
		);

	}

}

module.exports = new Ping();
