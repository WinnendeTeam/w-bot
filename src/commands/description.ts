import { Discord, Slash, SlashChoice, SlashOption } from "discordx";
import Anthropic from '@anthropic-ai/sdk';
import { ApplicationCommandOptionType, type CommandInteraction } from "discord.js";

import productDescriptionTemplate from "../models/ai/templates/productDescription";
import productDescriptionPrompt from "../models/ai/prompts/productDescription";
import { promptMessage } from "../models/framework/Claude";

@Discord()
export class Description {
	@Slash({ description: "description" })
	async description(
		@SlashOption({
			description: "Product Name",
			name: "name",
			required: true,
			type: ApplicationCommandOptionType.String
		})
		name: string,
		@SlashOption({
			description: "Competitor Product Description",
			name: "reference",
			required: true,
			type: ApplicationCommandOptionType.String,
		})
		reference: string,

		interaction: CommandInteraction
	): Promise<void> {
		await interaction.deferReply();

		const productDescriptionResponse = await promptMessage(
			[
				productDescriptionTemplate,
				productDescriptionPrompt(name, reference)
			]
		);

		if (productDescriptionResponse == null) {
			await interaction.editReply("AI Error!");
			return;
		}

		await interaction.editReply(`${productDescriptionResponse}`);

	}
}