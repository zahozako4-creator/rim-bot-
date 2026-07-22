const fs = require("fs");
const path = require("path");

const Logger = require("./Logger");

class Loader {
	constructor(rim) {
		this.rim = rim;

		this.root = process.cwd();

		this.commandsPath = path.join(this.root, "scripts");
		this.eventsPath = path.join(this.root, "scripts", "events");
		this.pluginsPath = path.join(this.root, "plugins");

		this.aliases = new Map();

		this.stats = {
			commands: 0,
			events: 0,
			plugins: 0,
			errors: 0
		};
	}

	async initialize() {

		Logger.system("تهيئة Loader...");

		await this.ensureDirectories();

		await this.loadCommands();

		await this.loadEvents();

		Logger.success(
			"LOADER",
			"تم تحميل النظام بنجاح"
		);
	}

	async ensureDirectories() {

		const folders = [
			"scripts",
			"scripts/admin",
			"scripts/ai",
			"scripts/downloads",
			"scripts/economy",
			"scripts/events",
			"scripts/fun",
			"scripts/games",
			"scripts/group",
			"scripts/media",
			"scripts/owner",
			"scripts/system",
			"scripts/tools",
			"plugins"
		];

		for (const folder of folders) {

			const full = path.join(this.root, folder);

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

	scan(directory) {

		const files = [];

		if (!fs.existsSync(directory))
			return files;

		const items = fs.readdirSync(directory, {
			withFileTypes: true
		});

		for (const item of items) {

			const full = path.join(directory, item.name);

			if (item.isDirectory()) {

				files.push(...this.scan(full));

				continue;

			}

			if (
				item.isFile() &&
				item.name.endsWith(".js")
			)
				files.push(full);

		}

		return files;

	}

	clearCache(file) {

		try {

			delete require.cache[
				require.resolve(file)
			];

		}
		catch {}

	}

	requireFile(file) {

		this.clearCache(file);

		return require(file);

		}
	     	async loadCommands() {

		Logger.loader("تحميل الأوامر...");

		this.rim.commands.clear();

		this.aliases.clear();

		this.stats.commands = 0;

		const files = this.scan(this.commandsPath);

		for (const file of files) {

			if (
				file.includes(
					`${path.sep}events${path.sep}`
				)
			)
				continue;

			try {

				const command =
					this.requireFile(file);

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
					typeof command.execute !==
					"function"
				) {

					Logger.warn(
						"COMMAND",
						`${command.name} لا يحتوي على execute()`
					);

					continue;

				}

				if (
					this.rim.commands.has(
						command.name
					)
				) {

					Logger.warn(
						"COMMAND",
						`${command.name} موجود مسبقًا`
					);

					continue;

				}

				command.filePath = file;

				this.rim.commands.set(
					command.name,
					command
				);

				if (
					Array.isArray(command.aliases)
				) {

					for (const alias of command.aliases) {

						this.aliases.set(
							alias.toLowerCase(),
							command.name
						);

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
	    	/* تحميل جميع الأحداث */

	async loadEvents() {

		Logger.loader("تحميل الأحداث...");

		this.rim.events.clear();

		this.stats.events = 0;

		const files = this.scan(this.eventsPath);

		for (const file of files) {

			try {

				const event = this.requireFile(file);

				if (!event)
					continue;

				if (!event.name) {

					Logger.warn(
						"EVENT",
						`${path.basename(file)} لا يحتوي على name`
					);

					continue;

				}

				if (
					typeof event.execute !== "function"
				) {

					Logger.warn(
						"EVENT",
						`${event.name} لا يحتوي على execute()`
					);

					continue;

				}

				if (
					this.rim.events.has(event.name)
				) {

					Logger.warn(
						"EVENT",
						`${event.name} موجود مسبقًا`
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

	/* حل Alias */

	resolveAlias(name) {

		name = name.toLowerCase();

		if (this.rim.commands.has(name))
			return name;

		if (this.aliases.has(name))
			return this.aliases.get(name);

		return null;

	}
		/* إعادة تحميل أمر */

	async reloadCommand(name) {

		const command = this.rim.commands.get(name);

		if (!command)
			return false;

		try {

			const file = command.filePath;

			const newCommand = this.requireFile(file);

			newCommand.filePath = file;

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
				err.stack || err.message
			);

			return false;

		}

	}

	/* إعادة تحميل حدث */

	async reloadEvent(name) {

		const event = this.rim.events.get(name);

		if (!event)
			return false;

		try {

			const file = event.filePath;

			const newEvent = this.requireFile(file);

			newEvent.filePath = file;

			this.rim.events.set(
				newEvent.name,
				newEvent
			);

			Logger.success(
				"LOADER",
				`تم إعادة تحميل الحدث ${newEvent.name}`
			);

			return true;

		}
		catch (err) {

			Logger.error(
				"LOADER",
				err.stack || err.message
			);

			return false;

		}

	}

	/* الإحصائيات */

	getStats() {

		return {
			commands: this.stats.commands,
			events: this.stats.events,
			plugins: this.stats.plugins,
			errors: this.stats.errors,
			aliases: this.aliases.size
		};

	}

}

module.exports = Loader;
