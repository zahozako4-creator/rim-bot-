const LoginManager = require("./LoginManager");

class MessengerClient {
	constructor(rim) {
		this.rim = rim;

		this.api = null;

		this.loginManager = new LoginManager(rim);

		this.connected = false;

		this.startedAt = null;
	}

	async connect() {
		if (this.connected)
			return this.api;

		this.api = await this.loginManager.connect();

		this.connected = true;

		this.startedAt = Date.now();

		this.rim.api = this.api;

		return this.api;
	}

	isConnected() {
		return this.connected;
	}

	getAPI() {
		return this.api;
	}

	getUptime() {
		if (!this.startedAt)
			return 0;

		return Date.now() - this.startedAt;
	}

	async disconnect() {
		if (!this.api)
			return;

		if (typeof this.api.logout === "function") {
			try {
				await this.api.logout();
			}
			catch {}
		}

		this.connected = false;
		this.api = null;
		this.rim.api = null;
	}

	async restart() {
		await this.disconnect();
		return this.connect();
	}
}

module.exports = MessengerClient;
