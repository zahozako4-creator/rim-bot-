const fs = require("fs");

class Sender {
	constructor(rim) {
		this.rim = rim;
	}

	get api() {
		if (!this.rim.api)
			throw new Error("لم يتم الاتصال بفيسبوك بعد");

		return this.rim.api;
	}

	/**
	 * إرسال رسالة نصية
	 */
	async text(threadID, body, replyTo = null) {
		return new Promise((resolve, reject) => {
			this.api.sendMessage(
				{ body },
				threadID,
				(err, info) => {
					if (err)
						return reject(err);

					resolve(info);
				},
				replyTo
			);
		});
	}

	/**
	 * إرسال صورة
	 */
	async image(threadID, imagePath, body = "") {
		return new Promise((resolve, reject) => {

			const stream = fs.createReadStream(imagePath);

			this.api.sendMessage(
				{
					body,
					attachment: stream
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

	/**
	 * إرسال فيديو
	 */
	async video(threadID, videoPath, body = "") {
		return new Promise((resolve, reject) => {

			const stream = fs.createReadStream(videoPath);

			this.api.sendMessage(
				{
					body,
					attachment: stream
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

	/**
	 * إرسال ملف صوتي
	 */
	async audio(threadID, audioPath, body = "") {
		return new Promise((resolve, reject) => {

			const stream = fs.createReadStream(audioPath);

			this.api.sendMessage(
				{
					body,
					attachment: stream
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

	/**
	 * حذف رسالة
	 */
	async unsend(messageID) {
		return new Promise((resolve, reject) => {

			this.api.unsendMessage(messageID, err => {

				if (err)
					return reject(err);

				resolve(true);
			});

		});
	}

	/**
	 * وضع إعجاب على رسالة
	 */
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

	/**
	 * تغيير لقب عضو
	 */
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
