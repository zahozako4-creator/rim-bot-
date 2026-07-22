const MessengerClient = require("./Messenger/MessengerClient");
const Listener = require("./Messenger/Listener");
const Router = require("./Messenger/Router");
const Sender = require("./Messenger/Sender");

class Rim {
	constructor(options = {}) {

		this.config = options.config || {};

		this.version = "1.0.0";

		this.api = null;

		this.commands = new Map();

		this.events = new Map();

		this.database = null;

		this.cache = null;

		this.services = null;

		this.messenger = null;

		this.listener = null;

		this.router = null;

		this.sender = null;
	}

	async start() {

		/* الاتصال بفيسبوك */

		this.messenger = new MessengerClient(this);

		await this.messenger.start();

		this.api = this.messenger.getAPI();

		/* نظام الإرسال */

		this.sender = new Sender(this);

		/* الراوتر */

		this.router = new Router(this);

		/* الاستماع */

		this.listener = new Listener(this, this.api);

		this.listener.on("message", async (event) => {

			await this.router.handle(event);

		});

		this.listener.on("error", err => {

			console.error("[Listener]", err);

		});

		await this.listener.start();
	}

	async stop() {

		if (this.listener)
			this.listener.stop();

		if (this.messenger)
			await this.messenger.disconnect();

	}
}

module.exports = Rim;
