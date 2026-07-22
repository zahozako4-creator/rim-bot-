const fs = require("fs");
const path = require("path");

class AccountManager {
	constructor(rim) {
		this.rim = rim;
		this.accounts = [];
		this.mainAccount = null;
	}

	async load() {
		const accountsPath = path.join(process.cwd(), "accounts");

		if (!fs.existsSync(accountsPath))
			throw new Error("مجلد accounts غير موجود");

		const files = fs.readdirSync(accountsPath)
			.filter(file => file.endsWith(".json"));

		if (!files.length)
			throw new Error("لا يوجد أي حساب داخل مجلد accounts");

		for (const file of files) {
			try {
				const account = JSON.parse(
					fs.readFileSync(path.join(accountsPath, file), "utf8")
				);

				account.__filename = file;

				this.accounts.push(account);
			}
			catch (e) {
				console.error(`فشل تحميل ${file}`);
			}
		}

		if (!this.accounts.length)
			throw new Error("لم يتم تحميل أي حساب");

		this.mainAccount = this.accounts[0];

		return this.mainAccount;
	}

	getMainAccount() {
		return this.mainAccount;
	}

	getAccounts() {
		return this.accounts;
	}

	getAccount(index = 0) {
		return this.accounts[index];
	}
}

module.exports = AccountManager;
