const EventEmitter = require("events");

class MessengerClient extends EventEmitter {
	constructor(rim) {
		super();

		this.rim = rim;

		this.api = null;
		this.account = null;

		this.isLoggedIn = false;
		this.isListening = false;

		this.listener = null;

		this.stats = {
			messages: 0,
			events: 0,
			sent: 0,
			errors: 0,
			startTime: null
		};
	}

	/**
	 * تسجيل الدخول
	 */
	async login() {
		throw new Error("login() لم يتم تنفيذه بعد");
	}

	/**
	 * بدء استقبال الرسائل
	 */
	async start() {
		if (!this.isLoggedIn)
			throw new Error("يجب تسجيل الدخول أولاً");

		this.stats.startTime = Date.now();

		this.isListening = true;

		await this.listen();
	}

	/**
	 * إيقاف البوت
	 */
	async stop() {
		this.isListening = false;

		if (typeof this.listener === "function")
			this.listener();

		this.listener = null;
	}

	/**
	 * إعادة الاتصال
	 */
	async reconnect() {
		await this.stop();

		await this.login();

		await this.start();
	}

	/**
	 * استقبال الرسائل
	 */
	async listen() {
		throw new Error("listen() لم يتم تنفيذه بعد");
	}

	/**
	 * إرسال رسالة
	 */
	async send() {
		throw new Error("send() لم يتم تنفيذه بعد");
	}

	/**
	 * الرد على رسالة
	 */
	async reply() {
		throw new Error("reply() لم يتم تنفيذه بعد");
	}

	/**
	 * إضافة تفاعل
	 */
	async react() {
		throw new Error("react() لم يتم تنفيذه بعد");
	}

	/**
	 * حذف رسالة
	 */
	async unsend() {
		throw new Error("unsend() لم يتم تنفيذه بعد");
	}

	/**
	 * معلومات البوت
	 */
	getInfo() {
		return {
			loggedIn: this.isLoggedIn,
			listening: this.isListening,
			stats: this.stats
		};
	}
}

module.exports = MessengerClient;
