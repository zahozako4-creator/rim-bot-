const EventEmitter = require("events");
const Logger = require("../Logger");

class Listener extends EventEmitter {

	constructor(rim, api) {

		super();

		this.rim = rim;

		this.api = api;

		this.running = false;

		this.stopListening = null;

	}

	async start() {

		if (this.running)
			return;

		Logger.system("بدء الاستماع إلى الرسائل...");

		this.running = true;

		this.stopListening = this.api.listenMqtt((err, event) => {

			if (err) {

				Logger.error(
					"LISTENER",
					err.stack || err.message
				);

				this.emit("error", err);

				return;

			}

			if (!event)
				return;

			switch (event.type) {

				case "message":
				case "message_reply":
					this.emit("message", event);
					break;

				case "message_reaction":
					this.emit("reaction", event);
					break;

				case "message_unsend":
					this.emit("unsend", event);
					break;

				case "event":
					this.emit("event", event);
					break;

				case "typ":
					this.emit("typing", event);
					break;

				case "read":
					this.emit("read", event);
					break;

				case "presence":
					this.emit("presence", event);
					break;

				default:
					this.emit("raw", event);

			}

		});

		Logger.success(
			"LISTENER",
			"تم تشغيل Listener"
		);

	}

	stop() {

		if (!this.running)
			return;

		if (typeof this.stopListening === "function")
			this.stopListening();

		this.running = false;

		this.stopListening = null;

		Logger.warn(
			"LISTENER",
			"تم إيقاف Listener"
		);

	}

	isRunning() {

		return this.running;

	}

}

module.exports = Listener;
