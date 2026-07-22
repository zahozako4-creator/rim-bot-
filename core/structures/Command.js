class Command {

	constructor(options = {}) {

		this.name = options.name || "";

		this.aliases = Array.isArray(options.aliases)
			? options.aliases
			: [];

		this.category = options.category || "عام";

		this.description = options.description || "";

		this.guide = options.guide || "";

		this.version = options.version || "1.0.0";

		this.author = options.author || "Rim Team";

		this.cooldown = Number(options.cooldown) || 0;

		this.permissions = Number(options.permissions) || 0;

		this.enabled = options.enabled !== false;

		this.hidden = options.hidden || false;

		this.ownerOnly = options.ownerOnly || false;

		this.adminOnly = options.adminOnly || false;

		this.premiumOnly = options.premiumOnly || false;

		this.groupOnly = options.groupOnly || false;

		this.privateOnly = options.privateOnly || false;

		this.allowReply = options.allowReply !== false;

		this.allowReaction = options.allowReaction !== false;

		this.allowPrefix = options.allowPrefix !== false;

		this.allowNoPrefix = options.allowNoPrefix || false;

		this.languages = options.languages || {};

		this.beforeExecute = options.beforeExecute || null;

		this.afterExecute = options.afterExecute || null;

		this.data = {};

		this.validate();

	}

	validate() {

		if (!this.name)
			throw new Error("اسم الأمر مطلوب");

		if (typeof this.name !== "string")
			throw new Error("اسم الأمر يجب أن يكون نصاً");

		if (!Array.isArray(this.aliases))
			throw new Error("aliases يجب أن تكون Array");

	}

	async execute(ctx) {
		throw new Error(`الأمر "${this.name}" لا يحتوي على execute()`);
	}

}

module.exports = Command;
