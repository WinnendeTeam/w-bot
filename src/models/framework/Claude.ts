import Anthropic from "@anthropic-ai/sdk";
import { TextBlockParam } from "@anthropic-ai/sdk/resources";

const anthropic = new Anthropic({
	apiKey: process.env["ANTHROPIC_API_KEY"]
});

export async function promptMessage(content: string[]): Promise<string | null> {
	const contentFormatted: Array<TextBlockParam> = content.map((v, i) => {
		return {
			type: "text",
			text: v
		};
	});

	const productDescriptionResponse = (
		await anthropic.messages.create({
			model: "claude-3-5-sonnet-latest",
			max_tokens: 1024,
			messages: [
				{
					role: "user",
					content: contentFormatted
				}
			]
		})
	).content[0];

	if (productDescriptionResponse.type !== "text") {
		console.error("AI Error");
		return null;
	}

	return productDescriptionResponse.text;
}
