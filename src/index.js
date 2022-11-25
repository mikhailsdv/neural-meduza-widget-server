const {
	API_ID,
	API_HASH,
	CHANNEL_ID,
	PORT,
	CACHE_FILE,
	DETA_PROJECT_KEY,
} = require("./config")
const {TelegramClient} = require("telegram")
const {StoreSession} = require("telegram/sessions")
const {NewMessage} = require("telegram/events")
const input = require("input")
const {Deta} = require("deta");
const fs = require("fs")
const express = require("express");
const expressApp = express();
const deta = Deta(DETA_PROJECT_KEY);
const db = deta.Base("ios");
const {addMinus100, log} = require("./utils")
const storeSession = new StoreSession("session")

;(async () => {
	const {pathExists} = await import("path-exists")
	if (!await pathExists(CACHE_FILE)) {
		await fs.promises.writeFile(CACHE_FILE, "Пустой заголовок...")
	}
})()

expressApp.use(express.json())
expressApp.get("/title", async (req, res) => {
	const title = await fs.promises.readFile(CACHE_FILE)
	res.json({title: title ? title.toString() : "Пустой заголовок..."})
	const query = req.query || {}
	const params = {
		uuid: query.uuid,
		name: query.name,
		systemName: query.systemName,
		systemVersion: query.systemVersion,
		model: query.model,
		isPhone: query.isPhone,
		isPad: query.isPad,
		preferredLanguages: query.preferredLanguages,
		locale: query.locale,
		language: query.language,
		runsInApp: query.runsInApp,
		runsInActionExtension: query.runsInActionExtension,
		runsWithSiri: query.runsWithSiri,
		runsInWidget: query.runsInWidget,
		runsInNotification: query.runsInNotification,
		runsFromHomeScreen: query.runsFromHomeScreen,
		widgetFamily: query.widgetFamily,
		iso_date: new Date().toISOString(),
		unix_date: new Date().valueOf(),
	}
	log("New request", params)
	await db.put(params)
});
expressApp.listen(PORT, () => {
	console.log(`Example app listening on port ${PORT}`)
})

;(async () => {
	log("Loading interactive example...")
	const client = new TelegramClient(storeSession, API_ID, API_HASH, {
		connectionRetries: 999,
		requestRetries: 999,
		retryDelay: 10000,
		useWSS: true,
	})
	await client.start({
		phoneNumber: async () => await input.text("Please enter your phone number:\n"),
		password: async () => await input.text("Please enter your password:\n"),
		phoneCode: async () => await input.text("Please enter the secret code:\n"),
		onError: log,
	})
	log("You should now be connected.")
	client.session.save() // Save session to avoid logging in again

	client.addEventHandler(async ({message}) => {
		const {
			peerId,
			media,
			message: text,
			groupedId,
			fwdFrom,
		} = message
		let channelId = peerId?.channelId?.value
		console.log(channelId)
		channelId && (channelId = addMinus100(channelId))
		if (
			!channelId ||
			channelId !== CHANNEL_ID ||
			media ||
			groupedId ||
			fwdFrom ||
			!text
		) {
			return
		}
		await fs.promises.writeFile(CACHE_FILE, text)
		log("New message saved message:", text)
	}, new NewMessage({}))
})()
