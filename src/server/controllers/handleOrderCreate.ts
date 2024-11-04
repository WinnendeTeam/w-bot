import { Request, Response } from "express";
import crypto from "crypto";
import { container } from "tsyringe";
import { Client } from "discordx";
import { Beans } from "../../models/framework/DI/Beans";
import { TextChannel } from "discord.js";

export const handleOrderCreate = (req: Request, res: Response): void => {
	const hmac = req.get("X-Shopify-Hmac-SHA256") as string;
	const body = (req as any).rawBody;
	const secret = process.env.SHOPIFY_WEBHOOK_SECRET;

	if (!secret) {
		console.error("Webhook secret is not defined.");
		res.status(500).send("Internal Server Error");
		return;
	}

	// Verify the request HMAC signature
	const hash = crypto.createHmac("sha256", secret).update(body, "utf8").digest("base64");

	if (hash !== hmac) {
		console.log("Webhook verification failed. HMAC does not match.");
		res.status(403).send("Unauthorized");
		return;
	}

	// Process the incoming order data
	const orderData = req.body;
	console.log("Order received:", orderData);

	const bot = container.resolve<Client>(Beans.IBotToken);

	const serverId = '1144233680332664932';
	const channelId = '1302947779156639765';
	const guild = bot.guilds.cache.get(serverId);

	if (!guild) {
		console.error("Guild not found");
		res.status(500).send("Internal Server Error: Guild not found");
		return;
	}

	const channel = guild.channels.cache.get(channelId);

	if (channel && channel instanceof TextChannel) {
		const orderNumber = `#${orderData.order_number}`;
		const price: string = `${orderData.current_total_price} ${orderData.currency}`;
		const country: string = orderData.shipping_address.country;

		channel.send(
			`New Order ${orderNumber}.\nAmount: ${price}.\nCountry: ${country}.
		`);
	} else {
		console.error("Channel not found or is not a text channel");
		res.status(500).send("Internal Server Error: Channel not found or not a text channel");
		return;
	}

	// Respond to Shopify to confirm receipt
	res.status(200).send("Webhook received");
};
