const fs = require("fs");
const path = require("path");

const login = require("fca-unofficial");

class LoginManager {

	constructor(rim) {
		this.rim = rim;

		this.api = null;
	}

	getAppState() {

		const statePath = path.join(process.cwd(), "accounts", "fbstate.json");

		if (!fs.existsSync(statePath))
			throw new Error("لم يتم العثور على fbstate.json");

		return JSON.parse(
			fs.readFileSync(statePath, "utf8")
		);
	}

	async connect() {

		const appState = this.getAppState();

		return new Promise((resolve, reject) => {

			login(
				{
					appState
				},
				(err, api) => {

					if (err)
						return reject(err);

					this.api = api;

					this.rim.api = api;

					resolve(api);

				}
			);

		});

	}

}

module.exports = LoginManager;
