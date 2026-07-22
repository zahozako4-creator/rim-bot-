const Context = require("../structures/Context");

class Parser {

	constructor(rim) {
		this.rim = rim;
	}

	parse(event) {

		const body = String(event.body || "").trim();

		const prefix =
			this.rim.config.prefix || ".";

		const isCommand =
			body.startsWith(prefix);

		let command = null;

		let args = [];

		if (isCommand) {

			const content = body
				.slice(prefix.length)
				.trim();

			args = content.length
				? content.split(/\s+/)
				: [];

			command = args.shift()?.toLowerCase() || null;

		}

		return new Context({

			rim: this.rim,

			api: this.rim.api,

			raw: event,

			type: event.type,

			threadID: event.threadID,

			messageID: event.messageID,

			senderID: event.senderID,

			body,

			prefix,

			command,

			args,

			isCommand,

			mentions: event.mentions || {},

			attachments: event.attachments || [],

			timestamp: event.timestamp || Date.now()

		});

	}

}

module.exports = Parser;
