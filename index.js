const Bootstrap = require("./core/Bootstrap");
const Logger = require("./core/Logger");

(async () => {

	try {

		console.clear();

		Logger.system("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
		Logger.system("🍓 Rim Framework");
		Logger.system("🚀 بدء التشغيل...");
		Logger.system("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");

		const bootstrap = new Bootstrap();

		const rim = await bootstrap.start();

		global.Rim = rim;

		Logger.system("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
		Logger.success("SYSTEM", "تم تشغيل Rim بنجاح");
		Logger.system("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");

	}
	catch (error) {

		Logger.system("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
		Logger.error(
			"SYSTEM",
			error.stack || error.message
		);
		Logger.system("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");

		process.exit(1);

	}

})();

/* أخطاء غير متوقعة */

process.on("uncaughtException", error => {

	Logger.error(
		"UNCAUGHT",
		error.stack || error.message
	);

});

process.on("unhandledRejection", reason => {

	Logger.error(
		"PROMISE",
		reason?.stack || reason
	);

});

/* إيقاف البوت */

async function shutdown(signal) {

	Logger.warn(
		"SYSTEM",
		`استلام ${signal}، جاري الإغلاق...`
	);

	try {

		if (global.Rim)
			await global.Rim.stop();

	}
	catch (err) {

		Logger.error(
			"SHUTDOWN",
			err.stack || err.message
		);

	}

	process.exit(0);

}

process.on("SIGINT", () => shutdown("SIGINT"));

process.on("SIGTERM", () => shutdown("SIGTERM"));
