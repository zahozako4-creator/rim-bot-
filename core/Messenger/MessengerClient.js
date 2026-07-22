const LoginManager = require("./LoginManager");
const Logger = require("../Logger");

class MessengerClient {

	constructor(rim) {

		this.rim = rim;

		this.api = null;

		this.connected = false;

		this.startedAt = null;

		this.loginManager = new LoginManager(rim);

	}

	async start() {

		return this.connect();

	}

	async connect() {

		if (this.connected)
			return this.api;

		Logger.system("الاتصال بفيسبوك...");

		this.api = await this.loginManager.connect();

		this.connected = true;

		this.startedAt = Date.now();

		this.rim.api = this.api;

		Logger.success("MESSENGER", "تم الاتصال بنجاح");

		return this.api;

	}

	async disconnect() {

		if (!this.connected)
			return;

		try {

			if (typeof this.api.logout === "function")
				await this.api.logout();

		}
		catch (err) {

			Logger.warn(
				"MESSENGER",
				err.message
			);

		}

		this.connected = false;

		this.api = null;

		this.rim.api = null;

		Logger.warn(
			"MESSENGER",
			"تم قطع الاتصال"
		);

	}

	async restart() {

		await this.disconnect();

		return this.connect();

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

}

module.exports = MessengerClient;
