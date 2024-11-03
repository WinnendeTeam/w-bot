import "dotenv/config.js";
import "reflect-metadata";

import { dirname, importx } from "@discordx/importer";
import { NotBot } from "@discordx/utilities";
import { IntentsBitField } from "discord.js";
import { Client } from "discordx";
import { container } from "tsyringe";
import { Beans } from "./models/framework/DI/Beans";
import express, { NextFunction, Request, Response } from "express";
import http from "http";

// Server Setup

const app = express();
const router = express.Router();

router.use((req: Request, res: Response, next: NextFunction) => {
	res.header('Access-Control-Allow-Methods', 'GET');
	res.header('Access-Control-Allow-Origin', '*');
	next();
});

router.get('/health', (req, res) => {
	const data = {
		uptime: process.uptime(),
		message: 'Ok',
		date: new Date()
	}

	res.status(200).send(data);
});

app.use('/', router);
const server = http.createServer(app);
server.listen(process.env.PORT);

// Discord Bot

abstract class Main {
	private static readonly bot = new Client({
		intents: [
			IntentsBitField.Flags.Guilds,
			IntentsBitField.Flags.GuildMembers,
			IntentsBitField.Flags.GuildMessages,
			IntentsBitField.Flags.GuildMessageReactions,
			IntentsBitField.Flags.GuildVoiceStates,
		],

		silent: false,

		allowedMentions: {
			parse: ["users"],
		},

		guards: [NotBot],

		simpleCommand: {
			prefix: "!",
		},
	});

	public static async run() {
		container.registerInstance<Client>(Beans.IBotToken, this.bot);

		await importx(`${dirname(import.meta.url)}/{events,commands}/**/*.{ts,js}`);

		if (!process.env.BOT_TOKEN) {
			throw Error("Could not find BOT_TOKEN in your environment");
		}

		await this.bot.login(process.env.BOT_TOKEN);
	}
}

Main.run();
