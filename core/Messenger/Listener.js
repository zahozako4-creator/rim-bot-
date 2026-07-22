const EventEmitter = require("events");

class Listener extends EventEmitter {
	constructor(rim, api) {
		super();

		this.rim = rim;
		this.api = api;

		this.stopListening = null;

		this.running = false;
	}

	async start() {
		if (this.running)
			return;

		this.running = true;

		this.stopListening = this.api.listenMqtt((err, event) => {

			if (err) {
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
					this.emit("
