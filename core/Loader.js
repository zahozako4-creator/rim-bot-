const fs = require("fs");
const path = require("path");

const Logger = require("./Logger");

class Loader {

	constructor(rim) {

		this.rim = rim;

		this.root = process.cwd();

		this.paths = {
			scripts: path.join(this.root, "scripts"),
			plugins: path.join(this.root, "plugins")
		};

		this.stats = {
			commands: 0,
			events: 0,
			plugins: 0,
			errors: 0
		};

		this.aliases = new Map();

	}

	async initialize() {

		Logger.system("تهيئة Loader...");

		await this.ensureDirectories();

		await this.loadCommands();

		await this.loadEvents();

		Logger.success("LOADER", "اكتمل تحميل النظام");

	}

	async ensureDirectories() {

		const directories = [

			"scripts",

			"scripts/system",

			"scripts/admin",

			"scripts/group",

			"scripts/media",

			"scripts/tools",

			"scripts/ai",

			"scripts/games",

			"scripts/downloads",

			"scripts/economy",

			"scripts/owner",

			"scripts/events",

			"plugins"

		];

		for (const dir of directories) {

			const fullPath = path.join(this.root, dir);

			if (!fs.existsSync(fullPath)) {

				fs.mkdirSync(fullPath, {
					recursive: true
				});

				Logger.info("LOADER", `تم إنشاء ${dir}`);

			}

		}

	}
		/**
	 * البحث داخل جميع المجلدات بشكل Recursive
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

				files.push(
					...this.scanFiles(fullPath, extension)
				);

				continue;

			}

			if (
				item.isFile() &&
				path.extname(item.name).toLowerCase() === extension
			)
				files.push(fullPath);

		}

		return files;

	}

	/**
	 * حذف الكاش الخاص بـ require
	 */
	clearRequireCache(filePath) {

		try {

			delete require.cache[
				require.resolve(filePath)
			];

		}
		catch {}

	}

	/**
	 * إعادة تحميل الملف
	 */
	reload(filePath) {

		this.clearRequireCache(filePath);

		return require(filePath);

	}	/**
	 * تحميل جميع الأوامر
	 */
	async loadCommands() {

		Logger.loader("تحميل الأوامر...");

		this.rim.commands.clear();

		this.aliases.clear();

		this.stats.commands = 0;

		const files = this.scanFiles(this.paths.scripts);

		for (const file of files) {

			// نتجاهل مجلد الأحداث
			if (file.includes(`${path.sep}events${path.sep}`))
				continue;

			try {

				const command = this.reload(file);

				if (!command)
					continue;

				if (!command.name) {

					Logger.warn(
						"COMMAND",
						`${path.basename(file)} لا يحتوي على name`
					);

					continue;

				}

				if (typeof command.execute !== "function") {

					Logger.warn(
						"COMMAND",
						`${command.name} لا يحتوي على execute()`
					);

					continue;

				}

				if (this.rim.commands.has(command.name)) {

					Logger.warn(
						"COMMAND",
						`الأمر ${command.name} مكرر`
					);

					continue;

				}

				command.filePath = file;

				this.rim.commands.set(
						/**
	 * تحميل جميع الأحداث
	 */
	async loadEvents() {

		Logger.loader("تحميل الأحداث...");

		this.rim.events.clear();

		this.stats.events = 0;

		const eventsPath = path.join(
			this.paths.scripts,
			"events"
		);

		const files = this.scanFiles(eventsPath);

		for (const file of files) {

			try {

				const event = this.reload(file);

				if (!event)
					continue;

				if (!event.name) {

					Logger.warn(
						"EVENT",
						`${path.basename(file)} لا يحتوي على name`
					);

					continue;

				}

				if (typeof event.execute !== "function") {

					Logger.warn(
						"EVENT",
						`${event.name} لا يحتوي على execute()`
					);

					continue;

				}

				if (this.rim.events.has(event.name)) {

					Logger.warn(
						"EVENT",
						`الحدث ${event.name} مكرر`
					);

					continue;

				}

				event.filePath = file;

				this.rim.events.set(
					event.name,
					event
				);

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
					/**
	 * الحصول على اسم الأمر الحقيقي من Alias
	 */
	resolveAlias(name) {

		if (this.rim.commands.has(name))
			return name;

		if (this.aliases.has(name))
			return this.aliases.get(name);

		return null;

	}

	/**
	 * إعادة تحميل أمر
	 */
	async reloadCommand(name) {

		const command = this.rim.commands.get(name);

		if (!command)
			return false;

		try {

			const file = command.filePath;

			this.clearRequireCache(file);

			const newCommand = require(file);

			this.rim.commands.set(
				newCommand.name,
				newCommand
			);

			Logger.success(
				"LOADER",
				`تم إعادة تحميل ${newCommand.name}`
			);

			return true;

		}
		catch (err) {

			Logger.error(
				"LOADER",
				err.stack
			);

			return false;

		}

	}

	/**
	 * إحصائيات Loader
	 */
	getStats() {

		return {

			commands: this.stats.commands,

			events: this.stats.events,

			plugins: this.stats.plugins,

			errors: this.stats.errors,

			aliases: this.aliases.size

		};

	}
				
