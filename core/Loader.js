const fs = require("fs");
const path = require("path");

const Logger = require("./Logger");

class Loader {

	constructor(rim) {

		this.rim = rim;

		this.root = process.cwd();

		this.paths = {
			scripts: path.join(this.root, "scripts"),
			events: path.join(this.root, "scripts", "events"),
			plugins: path.join(this.root, "plugins")
		};

		this.stats = {
			commands: 0,
			events: 0,
			plugins: 0,
			errors: 0,
			startTime: Date.now()
		};

		this.aliases = new Map();

	}

	/* بدء النظام */

	async initialize() {

		Logger.system("تهيئة Loader...");

		await this.ensureDirectories();

		await this.loadCommands();

		await this.loadEvents();

		Logger.success(
			"LOADER",
			"اكتمل تحميل جميع الملفات"
		);

	}

	/* إنشاء المجلدات */

	async ensureDirectories() {

		const folders = [

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

		for (const folder of folders) {

			const full = path.join(
				this.root,
				folder
			);

			if (!fs.existsSync(full)) {

				fs.mkdirSync(full, {
					recursive: true
				});

				Logger.info(
					"LOADER",
					`تم إنشاء ${folder}`
				);

			}

		}

	}

	/* البحث داخل المجلدات */

	scanFiles(directory, extension = ".js") {

		const result = [];

		if (!fs.existsSync(directory))
			return result;

		const files = fs.readdirSync(directory, {
			withFileTypes: true
		});

		for (const file of files) {

			const full = path.join(
				directory,
				file.name
			);

			if (file.isDirectory()) {

				result.push(
					...this.scanFiles(
						full,
						extension
					)
				);

				continue;

			}

			if (
				file.isFile() &&
				path.extname(file.name) === extension
			) {

				result.push(full);

			}

		}

		return result;

	}

	/* حذف كاش require */

	clearRequireCache(file) {

		try {

			delete require.cache[
				require.resolve(file)
			];

		}
		catch {}

	}

	/* إعادة تحميل ملف */

	reload(file) {

		this.clearRequireCache(file);

		return require(file);

	}
		/* تحميل جميع الأوامر */

	async loadCommands() {

		Logger.loader("تحميل الأوامر...");

		this.rim.commands.clear();

		this.aliases.clear();

		this.stats.commands = 0;

		const files = this.scanFiles(
			this.paths.scripts
		);

		for (const file of files) {

			/* تجاهل مجلد الأحداث */

			if (
				file.includes(
					`${path.sep}events${path.sep}`
				)
			)
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

				if (
					typeof command.execute !== "function"
				) {

					Logger.warn(
						"COMMAND",
						`${command.name} لا يحتوي على execute()`
					);

					continue;

				}

				if (
					this.rim.commands.has(command.name)
				) {

					Logger.warn(
						"COMMAND",
						`الأمر ${command.name} مكرر`
					);

					continue;

				}

				command.filePath = file;

				this.rim.commands.set(
					command.name,
					command
				);

				/* تسجيل Alias */

				if (
					Array.isArray(command.aliases)
				) {

					for (const alias of command.aliases) {

						if (
							!this.aliases.has(alias)
						) {

							this.aliases.set(
								alias,
								command.name
							);

						}

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
			`تم تحميل ${this.stats.commands} أمر
				/* تحميل جميع الأحداث */

	async loadEvents() {

		Logger.loader("تحميل الأحداث...");

		this.rim.events.clear();

		this.stats.events = 0;

		const files = this.scanFiles(
			this.paths.events
		);

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

	/* إعادة تحميل أمر */

	async reload
