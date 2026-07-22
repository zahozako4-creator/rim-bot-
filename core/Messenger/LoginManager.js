const fs = require("fs");
const path = require("path");

const login = require("fca-unofficial");

const Logger = require("../Logger");

class LoginManager {

	constructor(rim) {

		this.rim = rim;

		this.api = null;

		this.statePath = path.join(
			process.cwd(),
			"accounts",
			"fbstate.json"
		);

	}

	loadAppState() {

		if (!fs.existsSync(this.statePath))
			throw new Error("لم يتم العثور على accounts/fbstate.json");

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

		}
		catch (err) {

			Logger.warn(
				"LOGIN",
				"تعذر حفظ AppState"
			);

		}

	}

	async connect() {

		Logger.system("تسجيل الدخول إلى Facebook...");

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

						return reject(err
