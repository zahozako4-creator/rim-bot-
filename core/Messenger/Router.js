const fs = require("fs");
const Logger = require("../Logger");

class Sender {

	constructor(rim) {
		this.rim = rim;
	}

	get api() {

		if (!this.rim.api)
			throw new Error("Facebook API غير متصل");

		return this.rim.api;

	}

	ensureFile(filePath) {

		if (!fs.existsSync(filePath))
			throw new Error(`الملف غير موجود:\n${filePath}`);

	}

	send(options, threadID, replyTo = null) {

		return new Promise((resolve, reject) => {

			this.api.sendMessage(
				options,
				threadID,
				(err, info) => {

					if (err) {

						Logger.error(
							"SENDER",
							err.stack || err.message
						);

						return reject(err);

					}

					resolve(info);

				},
				replyTo
			);

		});

	}

	async text(threadID, body, replyTo = null) {

		return this.send(
			{ body },
			threadID,
			replyTo
		);

	}

	async reply(ctx, body) {

		return this.text(
			ctx.threadID,
			body,
			ctx.messageID
		);

	}

	async sendFile(threadID, filePath, body = "", replyTo = null) {

		this.ensureFile(filePath);

		const stream = fs.createReadStream(filePath);

		return this.send(
			{
				body,
				attachment: stream
			},
			threadID,
			replyTo
		);

	}

	async image(threadID, filePath, body = "") {

		return this.sendFile(
			threadID,
			filePath,
			body
		);

	}

	async video(threadID, filePath, body = "") {

		return this.sendFile(
			threadID,
			filePath,
			body
		);

	}

	async audio(threadID, filePath, body = "") {

		return this.sendFile(
			threadID,
			filePath,
			body
		);

	}

	async sticker(threadID, stickerID) {

		return new Promise((resolve, reject) => {

			this.api.sendMessage(
				{
					sticker: stickerID
				},
				threadID,
				(err, info) => {

					if (err)
						return reject(err);

					resolve(info);

				}
			);

		});

	}

	async typing(threadID, status = true) {

		if (typeof this.api.sendTypingIndicator === "function")
			return this.api.sendTypingIndicator(threadID, status);

	}

	async react(emoji, messageID) {

		return new Promise((resolve, reject) => {

			this.api.setMessageReaction(
				emoji,
				messageID,
				err => {

					if (err)
						return reject(err);

					resolve(true);

				},
				true
			);

		});

	}

	async unsend(messageID) {

		return new Promise((resolve, reject) => {

			this.api.unsendMessage(
				messageID,
				err => {

					if (err)
						return reject(err);

					resolve(true);

				}
			);

		});

	}

	async nickname(threadID, userID, nickname) {

		return new Promise((resolve, reject) => {

			this.api.changeNickname(
				nickname,
				threadID,
				userID,
				err => {

					if (err)
						return reject(err);

					resolve(true);

				}
			);

		});

	}

}

module.exports = Sender;
