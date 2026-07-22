const MessengerClient = require("./Messenger/MessengerClient");
const Listener = require("./Messenger/Listener");
const Router = require("./Messenger/Router");
const Sender = require("./Messenger/Sender");
const Logger = require("./Logger");

class Rim {

	constructor(options = {}) {

		this.config = options.config || {};

		this.version = "1.0.0";

		this.started = false;

		this.startedAt = null;

		this.api = null;

		this.commands = new Map();

		this.events = new Map();

		this.database = null;

		this.cache = null;

		this.services = null;

		this.loader = null;

		this.messenger = null;

		this.listener = null;

		this.router = null;

		this.sender = null;

	}

	async start() {

		if (this.started)
			return;

		Logger.system("بدء تشغيل Messenger...");

		this.messenger = new MessengerClient(this);

		await this.messenger.start();

		this.api = this.messenger.getAPI();

		this.sender = new Sender(this);

		this.router = new Router(this);

		this.listener = new Listener(this, this.api);

		this.listener.on("message", event =>
			this.router.handle(event)
		);

		this.listener.on("error", err =>
			Logger.error("LISTENER", err.stack || err.message)
		);

		await this.listener.start();

		this.started = true;

		this.startedAt = Date.now();

		Logger.success("RIM", "تم تشغيل Rim");

	}

	async stop() {

		if (!this.started)
			return;

		if (this.listener)
			this.listener.stop();

		if (this.messenger)
			await this.messenger.disconnect();

		this.started = false;

		Logger.warn("RIM", "تم إيقاف Rim");

	}

	getCommand(name) {

		return this.commands.get(name);

	}

	getEvent(name) {

		return this.events.get(name);

	}

	getUptime() {

		if (!this.startedAt)
			return 0;

		return Date.now() - this.startedAt;

	}

}

module.exports = Rim;
