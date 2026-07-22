const fs = require("fs");
const path = require("path");

const Rim = require("./Rim");
const Loader = require("./Loader");
const Database = require("./Database");
const Logger = require("./Logger");
const EventDispatcher = require("./EventDispatcher");

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
			Logger.success("تم تحميل config.json");
			return this.config;
		}
		catch (err) {
			Logger.error("فشل في قراءة config.json");
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

		Logger.success("تم تهيئة المحرك");
	}

	async initializeDatabase() {
		Logger.database("الاتصال بقاعدة البيانات...");

		this.rim.database = new Database(this.rim);

		if (typeof this.rim.database.connect === "function")
			await this.rim.database.connect();

		Logger.success("تم الاتصال بقاعدة البيانات");
	}

	async initializeLoader() {
		Logger.loader("تحميل الأوامر والأحداث...");

		this.rim.loader = new Loader(this.rim);

		if (typeof this.rim.loader.loadCommands === "function")
			await this.rim.loader.loadCommands();

		if (typeof this.rim.loader.loadEvents === "function")
			await this.rim.loader.loadEvents();

		Logger.success("تم تحميل جميع الملفات");
	}

	async initializeModules() {
		Logger.system("تهيئة الوحدات...");

		// سيتم إضافة:
		// Language
		// Messenger
		// Router
		// Middleware
	}

	async start() {

		Logger.system("━━━━━━━━━━━━━━━━━━━━━━");
		Logger.system("🍓 بدء تشغيل Rim Framework");
		Logger.system("━━━━━━━━━━━━━━━━━━━━━━");

		this.loadConfig();

		await this.initializeCore();

		await this.initializeDatabase();

		await this.initializeLoader();

		await this.initializeModules();

		if (typeof this.rim.start === "function")
			await this.rim.start();

		Logger.system("━━━━━━━━━━━━━━━━━━━━━━");
		Logger.success("تم تشغيل Rim بنجاح");
		Logger.info(`الإصدار : ${this.rim.version || "1.0.0"}`);
		Logger.info(`الأوامر : ${this.rim.commands.size}`);
		Logger.info(`الأحداث : ${this.rim.events.size}`);
		Logger.system("━━━━━━━━━━━━━━━━━━━━━━");

		return this.rim;
	}
}

module.exports = Bootstrap;
