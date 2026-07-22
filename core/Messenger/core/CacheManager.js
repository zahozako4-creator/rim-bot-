class CacheManager {
	constructor() {

		this.users = new Map();

		this.threads = new Map();

		this.commands = new Map();

		this.events = new Map();

		this.languages = new Map();

		this.settings = new Map();

		this.cooldowns = new Map();

		this.media = new Map();

		this.sessions = new Map();

		this.plugins = new Map();

		this.temp = new Map();
	}

	getStore(name) {
		return this[name];
	}

	has(store, key) {
		return this[store]?.has(key);
	}

	get(store, key) {
		return this[store]?.get(key);
	}

	set(store, key, value) {
		this[store]?.set(key, value);
		return value;
	}

	delete(store, key) {
		return this[store]?.delete(key);
	}

	clear(store) {
		this[store]?.clear();
	}

	clearAll() {
		for (const key of Object.keys(this)) {
			if (this[key] instanceof Map)
				this[key].clear();
		}
	}

	size(store) {
		return this[store]?.size || 0;
	}

	stats() {
		return {
			users: this.users.size,
			threads: this.threads.size,
			commands: this.commands.size,
			events: this.events.size,
			languages: this.languages.size,
			settings: this.settings.size,
			cooldowns: this.cooldowns.size,
			media: this.media.size,
			sessions: this.sessions.size,
			plugins: this.plugins.size,
			temp: this.temp.size
		};
	}
}

module.exports = CacheManager;
