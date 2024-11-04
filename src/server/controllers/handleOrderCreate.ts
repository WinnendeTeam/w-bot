import { Request, Response } from "express";
import crypto from "crypto";
import { container } from "tsyringe";
import { Client } from "discordx";
import { Beans } from "../../models/framework/DI/Beans";
import { TextChannel } from "discord.js";

export const handleOrderCreate = (req: Request, res: Response): void => {
	const hmac = req.get("X-Shopify-Hmac-SHA256") as string;
	const body = JSON.stringify(req.body);
	const secret = process.env.SHOPIFY_WEBHOOK_SECRET; // Replace with your actual webhook secret

	if (!secret) {
		console.error("Webhook secret is not defined.");
		res.status(500).send("Internal Server Error");
		return;
	}

	// Verify the request HMAC signature
	const hash = crypto.createHmac("sha256", secret).update(body, "utf8").digest("base64");

	if (hash !== hmac) {
		console.log("Webhook verification failed");
		res.status(403).send("Unauthorized");
		return;
	}

	// Process the incoming order data
	const orderData = req.body;
	console.log("Order received:", orderData);

	const bot = container.resolve<Client>(Beans.IBotToken);

	const serverId = '1144233680332664932';
	const channelId = '1302947779156639765';
	const channel = bot.guilds.cache.get(serverId)?.channels.cache.get(channelId);

	if (channel && channel instanceof TextChannel) {
		channel.send(`Order received: ${orderData}`);
	} else {
		console.error("Channel not found or is not a text channel");
	}

	// Respond to Shopify to confirm receipt
	res.status(200).send("Webhook received");
};
