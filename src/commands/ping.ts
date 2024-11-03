import { Discord, Slash } from "discordx";

import type { CommandInteraction } from "discord.js";

@Discord()
export class Ping {
	@Slash({ description: "ping" })
	async ping(interaction: CommandInteraction): Promise<void> {
		await interaction.reply("pong!");
	}
}
