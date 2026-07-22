class Event {

	constructor(options = {}) {

		this.name = options.name || "";

		this.description = options.description || "";

		this.version = options.version || "1.0.0";

		this.author = options.author || "Rim Team";

		this.priority = Number(options.priority) || 0;

		this.once = options.once || false;

		this.enabled = options.enabled !== false;

		this.languages = options.languages || {};

		this.beforeExecute = options.beforeExecute || null;

		this.afterExecute = options.afterExecute || null;

		this.data = {};

		this.validate();

	}

	validate() {

		if (!this.name)
			throw new Error("اسم الحدث مطلوب");

		if (typeof this.name !== "string")
			throw new Error("اسم الحدث يجب أن يكون نصاً");

		if (typeof this.priority !== "number")
			throw new Error("priority يجب أن يكون رقم");

	}

	async execute(ctx) {
		throw new Error(`الحدث "${this.name}" لا يحتوي على execute()`);
	}

}

module.exports = Event;
