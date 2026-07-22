class Parser {
	constructor(rim) {
		this.rim = rim;
	}

	parse(event) {
		const body = event.body || "";

		const prefix = this.rim.config.prefix || ".";

		const isCommand = body.startsWith(prefix);

		const args = isCommand
			? body.slice(prefix.length).trim().split(/\s+/)
			: [];

		const command = isCommand
			? (args.shift() || "").toLowerCase()
			: null;

		return {
			raw: event,

			type: event.type,

			threadID: event.threadID,

			messageID: event.messageID,

			senderID: event.senderID,

			body,

			isCommand,

			command,

			args,

			prefix,

			mentions: event.mentions || {},

			attachments: event.attachments || [],

			timestamp: event.timestamp || Date.now()
		};
	}
}

module.exports = Parser;
