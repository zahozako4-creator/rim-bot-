class Context {

	constructor(data = {}) {

		/* الرسالة */
		this.message = data.message || null;

		/* مرسل الرسالة */
		this.user = data.user || {};

		/* المجموعة */
		this.thread = data.thread || {};

		/* معرفات */
		this.senderID = data.senderID || null;
		this.threadID = data.threadID || null;
		this.messageID = data.messageID || null;

		/* النص */
		this.body = data.body || "";

		/* الوسائط */
		this.args = data.args || [];

		/* البادئة */
		this.prefix = data.prefix || ".";

		/* اللغة */
		this.language = data.language || "ar";

		/* الأمر الحالي */
		this.command = data.command || null;

		/* الحدث الحالي */
		this.event = data.event || null;

		/* قاعدة البيانات */
		this.database = data.database || null;

		/* التطبيق */
		this.app = data.app || null;

		/* البوت */
		this.rim = data.rim || null;

		/* الصلاحيات */
		this.permissions = data.permissions || 0;

	}

	/* إرسال رسالة */

	async send(text, options = {}) {

		if (!this.message)
			throw new Error("message غير موجود");

		return this.message.reply({
			body: text,
			...options
		});

	}

	/* رد */

	async reply(text, options = {}) {

		if (!this.message)
			throw new Error("message غير موجود");

		return this.message.reply({
			body: text,
			...options
		});

	}

	/* تفاعل */

	async react(emoji = "👍") {

		if (!this.message)
			return;

		if (typeof this.message.react === "function")
			return this.message.react(emoji);

	}

	/* حذف */

	async delete() {

		if (!this.message)
			return;

		if (typeof this.message.unsend === "function")
			return this.message.unsend();

	}

	/* إرسال إلى مجموعة */

	async sendTo(threadID, text, options = {}) {

		if (!this.rim?.api)
			throw new Error("API غير موجود");

		return this.rim.api.sendMessage({
			body: text,
			...options
		}, threadID);

	}

	/* هل المستخدم Admin */

	get isAdmin() {

		return this.permissions >= 2;

	}

	/* هل Owner */

	get isOwner() {

		return this.permissions >= 4;

	}

}

module.exports = Context;
