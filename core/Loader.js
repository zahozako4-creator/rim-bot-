const fs = require("fs");
const path = require("path");
const Logger = require("./Logger");

class Loader {
	constructor(rim) {
		this.rim = rim;

		// مسارات المشروع
		this.rootPath = process.cwd();

		this.paths = {
			commands: path.join(this.rootPath, "scripts", "commands"),
			events: path.join(this.rootPath, "scripts", "events"),
			plugins: path.join(this.rootPath, "plugins")
		};

		// الإحصائيات
		this.stats = {
			commands: 0,
			events: 0,
			plugins: 0,
			errors: 0,
			startTime: Date.now()
		};

		// الكاش
		this.cache = {
			commands: new Map(),
			aliases: new Map(),
			events: new Map()
		};
	}

	/**
	 * بدء عملية التحميل
	 */
	async initialize() {
		Logger.info("LOADER", "بدء تهيئة نظام التحميل...");
		await this.ensureDirectories();
    await this.loadCommands();
    await this.loadEvents();
	}

	/**
	 * التأكد من وجود جميع المجلدات المطلوبة
	 */
	async ensureDirectories() {
		for (const dir of Object.values(this.paths))
      /**
 * البحث عن جميع الملفات داخل مجلد (Recursive)
 */
scanFiles(directory, extension = ".js") {
	const files = [];

	if (!fs.existsSync(directory))
		return files;

	const items = fs.readdirSync(directory, {
		withFileTypes: true
	});

	for (const item of items) {
		const fullPath = path.join(directory, item.name);

		if (item.isDirectory()) {
			files.push(...this.scanFiles(fullPath, extension));
		}
		else if (
			item.isFile() &&
			path.extname(item.name).toLowerCase() === extension
		) {
			files.push(fullPath);
		}
	}

	return files;
}

/**
 * تنظيف require cache
 */
clearRequireCache(filePath) {
	try {
		delete require.cache[require.resolve(filePath)];
	}
	catch {}
}

/**
 * إعادة تحميل ملف
 */
reloadModule(filePath) {
	this.clearRequireCache(filePath);
	return require(filePath);
    }
    /**
 * تحميل جميع الأوامر
 */
async loadCommands() {
	Logger.info("LOADER", "جاري تحميل الأوامر...");

	this.rim.commands.clear();
	this.cache.aliases.clear();

	const files = this.scanFiles(this.paths.commands);

	for (const file of files) {
		try {
			const CommandClass = this.reloadModule(file);

			if (typeof CommandClass !== "function") {
				Logger.warn("COMMAND", `${file} لا يقوم بتصدير Class`);
				continue;
			}

			const command = new CommandClass();

			if (!command.name) {
				Logger.warn("COMMAND", `${file} لا يحتوي على اسم`);
				continue;
			}

			if (this.rim.commands.has(command.name)) {
				Logger.warn(
					"COMMAND",
					`تم تجاهل ${command.name} لأنه مكرر`
				);
				continue;
			}

			command.filePath = file;

			this.rim.commands.set(command.name, command);

			if (Array.isArray(command.aliases)) {
				for (const alias of command.aliases) {
					if (!this.cache.aliases.has(alias))
						this.cache.aliases.set(alias, command.name);
				}
			}

			this.stats.commands++;

			Logger.command(command.name);

		}
		catch (err) {
			this.stats.errors++;

			Logger.error(
				"COMMAND",
				`${path.basename(file)}\n${err.stack}`
			);
		}
	}

	Logger.success(
		"LOADER",
		`تم تحميل ${this.stats.commands} أمر`
	);
                    }
   /**
 * تحميل جميع الأحداث
 */
async loadEvents() {
	Logger.info("LOADER", "جاري تحميل الأحداث...");

	this.rim.events.clear();

	const files = this.scanFiles(this.paths.events);

	for (const file of files) {
		try {
			const EventClass = this.reloadModule(file);

			if (typeof EventClass !== "function") {
				Logger.warn("EVENT", `${file} لا يقوم بتصدير Class`);
				continue;
			}

			const event = new EventClass();

			if (!event.name) {
				Logger.warn("EVENT", `${file} لا يحتوي على اسم`);
				continue;
			}

			if (this.rim.events.has(event.name)) {
				Logger.warn(
					"EVENT",
					`تم تجاهل الحدث "${event.name}" لأنه مكرر`
				);
				continue;
			}

			event.filePath = file;

			this.rim.events.set(event.name, event);

			this.stats.events++;

			Logger.event(event.name);

		}
		catch (err) {
			this.stats.errors++;

			Logger.error(
				"EVENT",
				`${path.basename(file)}\n${err.stack}`
			);
		}
	}

	Logger.success(
		"LOADER",
		`تم تحميل ${this.stats.events} حدث`
	);
} 
  const Logger = require("./Logger");

class EventDispatcher {

	constructor(rim) {
		this.rim = rim;
	}

	/**
	 * تشغيل حدث
	 */
	async emit(eventName, context) {

		const event = this.rim.events.get(eventName);

		if (!event)
			return false;

		try {

			await event.execute(context);

			return true;

		}
		catch (error) {

			Logger.error(
				`EVENT:${eventName}`,
				error.stack || error.message
			);

			return false;

		}

	}

	/**
	 * هل الحدث موجود؟
	 */
	has(eventName) {
		return this.rim.events.has(eventName);
	}

	/**
	 * الحصول على حدث
	 */
	get(eventName) {
		return this.rim.events.get(eventName);
	}

	/**
	 * جميع الأحداث
	 */
	all() {
		return [...this.rim.events.values()];
	}

}

module.exports = EventDispatcher;
