const Bootstrap = require("./core/Bootstrap");

(async () => {
	console.clear();

	console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
	console.log("🍓 Rim Framework");
	console.log("🚀 Starting...");
	console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");

	try {
		const bootstrap = new Bootstrap();

		const rim = await bootstrap.start();

		global.Rim = rim;

		console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
		console.log("✅ Rim Started Successfully");
		console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
	}
	catch (error) {
		console.error("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
		console.error("❌ Rim Failed To Start");
		console.error(error);
		console.error("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
		process.exit(1);
	}
})();

process.on("uncaughtException", (error) => {
	console.error("❌ Uncaught Exception");
	console.error(error);
});

process.on("unhandledRejection", (reason) => {
	console.error("❌ Unhandled Rejection");
	console.error(reason);
});

process.on("SIGINT", () => {
	console.log("\n🛑 Rim Stopped");
	process.exit(0);
});

process.on("SIGTERM", () => {
	console.log("\n🛑 Rim Terminated");
	process.exit(0);
});
