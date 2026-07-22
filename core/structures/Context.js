class Context {

	constructor(data = {}) {

		Object.assign(this, data);

	}

	/* رد */

	async reply(body) {

		return this.rim.sender.reply(this, body);

	}

	/* إرسال رسالة */

	async send(body) {

		return this.rim.sender.text(
			this.threadID,
			body
		);

	}

	/* إرسال صورة */

	async image(filePath, body = "") {

		return this.rim.sender.image(
			this.threadID,
			filePath,
			body
		);

	}

	/* إرسال فيديو */

	async video(filePath, body = "") {

		return this.rim.sender.video(
			this.threadID,
			filePath,
			body
		);

	}

	/* إرسال صوت */

	async audio(filePath, body = "") {

		return this.rim.sender.audio(
			this.threadID,
			filePath,
			body
		);

	}

	/* تفاعل */

	async react(emoji) {

		return this.rim.sender.react(
			emoji,
			this.messageID
		);

	}

	/* حذف الرسالة */

	async unsend() {

		return this.rim.sender.unsend(
			this.messageID
		);

	}

	/* تغيير لقب */

	async nickname(userID, nickname) {

		return this.rim.sender.nickname(
			this.threadID,
			userID,
			nickname
		);

	}

	get isAdmin() {

		return this.permissions >= 2;

	}

	get isOwner() {

		return this.permissions >= 4;

	}

}

module.exports = Context;
