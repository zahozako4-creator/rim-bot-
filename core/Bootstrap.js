const fs = require("fs");
const path = require("path");

const Rim = require("./Rim");
const Loader = require("./Loader");
const Database = require("./Database");
const Logger = require("./Logger");
this.rim.services = new ServiceManager();
this.rim.cache = new CacheManager();

this.rim.services.register("config", this.config);
this.rim.services.register("logger", Logger);
this.rim.services.register("cache", this.rim.cache);

this.rim.services.register(
	"database",
	this.rim.database
);

class Bootstrap {

	constructor() {
		this.rim = null;
		this.config = null;
	}

	loadConfig() {

		const configPath = path.resolve(process.cwd(), "config.json");

		if (!fs.existsSync(configPath))
			throw new Error("لم يتم العثور على config.json");

		try {

			this.config = JSON.parse(
				fs.readFileSync(configPath, "utf8")
			);

			Logger.success("BOOTSTRAP", "تم تحميل الإعدادات");

			return this.config;

		}
		catch (err) {

			Logger.error("BOOTSTRAP", err.message);

			throw err;

		}

	}

	async initializeCore() {

		Logger.system("تهيئة محرك Rim...");

		this.rim = new Rim({
			config: this.config
		});

		global.Rim = this.rim;

		this.rim.commands = new Map();
		this.rim.events = new Map();

		this.rim.services = new ServiceManager();

		this.rim.cache = new CacheManager();

		this.rim.services.register("config", this.config);
		this.rim.services.register("logger", Logger);
		this.rim.services.register("cache", this.rim.cache);

		Logger.success("BOOTSTRAP", "تم إنشاء المحرك");

	}

	async initializeDatabase() {

		Logger.database("الاتصال بقاعدة البيانات...");

		this.rim.database = new Database(this.rim);

		if (typeof this.rim.database.connect === "function")
			await this.rim.database.connect();

		this.rim.services.register(
			"database",
			this.rim.database
		);

		Logger.success("DATABASE", "تم الاتصال بقاعدة البيانات");

	}

	async initializeLoader() {

		Logger.loader("تحميل الأوامر والأحداث...");

		this.rim.loader = new Loader(this.rim);

		if (typeof this.rim.loader.initialize === "function")
			await this.rim.loader.initialize();

		Logger.success("LOADER", "اكتمل التحميل");

	}

	async initializeModules() {

		Logger.system("تهيئة الوحدات...");

		/*
			سيتم إضافة:

			Messenger
			Router
			Parser
			Context
			Permission
			Language
			Plugin
			Economy
			Scheduler
		*/

	}

	async start() {

		Logger.system("━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
		Logger.system("🍓 Rim Framework");
		Logger.system("━━━━━━━━━━━━━━━━━━━━━━━━━━━━");

		this.loadConfig();

		await this.initializeCore();

		await this.initializeDatabase();

		await this.initializeLoader();

		await this.initializeModules();

		await this.rim.start();

		Logger.system("━━━━━━━━━━━━━━━━━━━━━━━━━━━━");

		Logger.success("BOOTSTRAP", "Rim يعمل بنجاح");

		Logger.info("BOOTSTRAP", `Version : ${this.rim.version}`);
		Logger.info("BOOTSTRAP", `Commands : ${this.rim.commands.size}`);
		Logger.info("BOOTSTRAP", `Events : ${this.rim.events.size}`);

		Logger.system("━━━━━━━━━━━━━━━━━━━━━━━━━━━━");

		return this.rim;

	}

}

module.exports = Bootstrap;
