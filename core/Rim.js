const EventEmitter = require("events");

class Rim extends EventEmitter {
	constructor(options = {}) {
		super();

		this.version = "1.0.0";
		this.name = "Rim 🍓";
		this.startedAt = null;

		this.config = options.config || {};

		this.database = null;
		this.loader = null;
		this.router = null;
		this.messenger = null;
		this.language = null;
		this.permission = null;
		this.prefix = null;
		this.logger = null;

		this.commands = new Map();
		this.events = new Map();

		this.cache = {
			users: new Map(),
			threads: new Map(),
			cooldowns: new Map()
		};
	}

	async initialize() {
		this.startedAt = Date.now();

		this.emit("initialize");
	}

	async start() {
		await this.initialize();

		this.emit("ready");
	}

	get uptime() {
		if (!this.startedAt)
			return 0;

		return Date.now() - this.startedAt;
	}

	registerCommand(command) {
		this.commands.set(command.config.name, command);
	}

	registerEvent(event) {
		this.events.set(event.config.name, event);
	}

	getCommand(name) {
		return this.commands.get(name);
	}

	getEvent(name) {
		return this.events.get(name);
	}
}

module.exports = Rim;
