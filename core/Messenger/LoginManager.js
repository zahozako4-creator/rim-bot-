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
					autoMark
