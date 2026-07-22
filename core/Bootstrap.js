const fs = require("fs");
const path = require("path");

const Rim = require("./Rim");
const Loader = require("./Loader");
const Database = require("./Database");

class Bootstrap {
	constructor() {
		this.rim = null;
		this.config = null;
	}

	loadConfig() {
		const configPath = path.resolve(process.cwd(), "config.json");

		if (!fs.existsSync(configPath))
			throw new Error("❌ لم يتم العثور على ملف config.json");

		try {
			this.config = JSON.parse(fs.readFileSync(configPath, "utf8"));
			return this.config;
		}
		catch (err) {
			throw new Error("❌ خطأ أثناء قراءة config.json\n" + err.message);
		}
	}

	async initializeCore() {
		this.rim = new Rim({
			config: this.config
		});

		global.Rim = this.rim;
	}

	async initializeDatabase() {
		this.rim.database = new Database(this.rim);
		await this.rim.database.connect();
	}

	async initializeLoader() {
		this.rim.loader = new Loader(this.rim);

		await this.rim.loader.loadCommands();
		await this.rim.loader.loadEvents();
	}

	async initializeModules() {
		// سيتم إضافة Language و Messenger و Router لاحقاً
	}

	async start() {
		console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━");
		console.log("🍓 بدء تشغيل Rim Framework");
		console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━");

		this.loadConfig();

		await this.initializeCore();

		await this.initializeDatabase();

		await this.initializeLoader();

		await this.initializeModules();

		await this.rim.start();

		console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━");
		console.log("✅ Rim جاهز للعمل");
		console.log(`📦 Version : ${this.rim.version}`);
		console.log(`⚡ Commands : ${this.rim.commands.size}`);
		console.log(`🎉 Events : ${this.rim.events.size}`);
		console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━");

		return this.rim;
	}
}

module.exports = Bootstrap;
