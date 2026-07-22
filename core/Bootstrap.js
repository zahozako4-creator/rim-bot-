const fs = require("fs");
const path = require("path");

const Rim = require("./Rim");
const Loader = require("./Loader");
const Database = require("./Database");
const Logger = require("./Logger");
const EventDispatcher = require("./EventDispatcher");
const ServiceManager = require("./managers/ServiceManager");

class Bootstrap {

	constructor() {
		this.rim = null;
		this.config = null;
	}

	loadConfig() {
		const configPath = path.resolve(process.cwd(), "config.json");

		if (!fs.existsSync(configPath))
			throw new Error("لم يتم العثور على ملف config.json");

		try {
			this.config = JSON.parse(fs.readFileSync(configPath, "utf8"));
			Logger.success("BOOTSTRAP", "تم تحميل config.json");
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

		this.rim.dispatcher = new EventDispatcher(this.rim);
		this.rim.services = new ServiceManager();

this.rim.services.register("config", this.config);
this.rim.services.register("logger", Logger);

		Logger.success("BOOTSTRAP", "تم إنشاء محرك Rim");

	}

	async initializeDatabase() {

		Logger.database("الاتصال بقاعدة البيانات...");

		this.rim.database = new Database(this.rim);

		if (typeof this.rim.database.connect === "function")
			await this.rim.database.connect();
this.rim.services.register("database", this.rim.database);
		Logger.success("DATABASE", "تم الاتصال بقاعدة البيانات");

	}

	async initializeLoader() {

		Logger.loader("تحميل الملفات...");

		this.rim.loader = new Loader(this.rim);

		if (typeof this.rim.loader.initialize === "function")
			await this.rim.loader.initialize();
		

		Logger.success("LOADER", "اكتمل تحميل الملفات");

	}

	async initializeModules() {

		Logger.system("تهيئة الوحدات...");

		/*
			سيتم إضافتها لاحقًا

			Language
			Messenger
			Context
			Router
			Middleware
			Permission
			Economy
			Plugin
			HotReload
		*/

	}

	async start() {

		Logger.system("━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
		Logger.system("🍓 بدء تشغيل Rim Framework");
		Logger.system("━━━━━━━━━━━━━━━━━━━━━━━━━━━━");

		this.loadConfig();

		await this.initializeCore();

		await this.initializeDatabase();

		await this.initializeLoader();

		await this.initializeModules();

		if (typeof this.rim.start === "function")
			await this.rim.start();

		Logger.system("━━━━━━━━━━━━━━━━━━━━━━━━━━━━");

		Logger.success("BOOTSTRAP", "تم تشغيل Rim بنجاح");

		Logger.info("BOOTSTRAP", `Version : ${this.rim.version || "1.0.0"}`);
		Logger.info("BOOTSTRAP", `Commands : ${this.rim.commands.size}`);
		Logger.info("BOOTSTRAP", `Events : ${this.rim.events.size}`);

		Logger.system("━━━━━━━━━━━━━━━━━━━━━━━━━━━━");

		return this.rim;
	}

}

module.exports = Bootstrap;
