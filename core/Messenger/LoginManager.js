const fs = require("fs");
const path = require("path");
const login = require("fca-unofficial");

const Logger = require("../Logger");

class LoginManager {

	constructor(rim) {
		this.rim = rim;
		this.api = null;
		this.connected = false;

		this.statePath = path.join(
			process.cwd(),
			"accounts",
			"fbstate.json"
		);
	}

	loadAppState() {

		if (!fs.existsSync(this.statePath)) {
			throw new Error("لم يتم العثور على accounts/fbstate.json");
		}

		return JSON.parse(
			fs.readFileSync(this.statePath, "utf8")
		);

	}

	saveAppState(appState) {

		try {

			fs.writeFileSync(
				this.statePath,
				JSON.stringify(appState, null, 2)
			);

			Logger.success(
				"LOGIN",
				"تم تحديث fbstate.json"
			);

		}
		catch (err) {

			Logger.warn(
				"LOGIN",
				"تعذر حفظ fbstate.json"
			);

		}

	}

	async connect() {

		if (this.connected)
			return this.api;

		Logger.system("بدء تسجيل الدخول إلى Facebook...");

		const appState = this.loadAppState();

		return new Promise((resolve, reject) => {

			login(
				{
					appState,
					listenEvents: true,
					selfListen: false,
					forceLogin: true,
					autoMarkRead: false,
					autoMarkDelivery: false
				},
				(err, api) => {

					if (err) {

						Logger.error(
							"LOGIN",
							err.stack || err.message
						);

						return reject(err);

					}

					this.api = api;
					this.connected = true;
					this.rim.api = api;

					if (typeof api.getAppState === "function") {
						this.saveAppState(api.getAppState());
					}

					Logger.success(
						"LOGIN",
						"تم تسجيل الدخول بنجاح"
					);

					resolve(api);

				}
			);

		});

	}

	getAPI() {
		return this.api;
	}

	isConnected() {
		return this.connected;
	}

	async disconnect() {

		if (!this.api)
			return;

		try {

			if (typeof this.api.logout === "function") {
				await this.api.logout();
			}

		}
		catch (err) {}

		this.api = null;
		this.connected = false;
		this.rim.api = null;

		Logger.warn(
			"LOGIN",
			"تم قطع الاتصال"
		);

	}

	async reconnect() {

		Logger.warn(
			"LOGIN",
			"إعادة الاتصال..."
		);

		await this.disconnect();

		return this.connect();

	}

}

module.exports = LoginManager;
