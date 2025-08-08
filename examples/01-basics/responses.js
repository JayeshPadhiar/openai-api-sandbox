// this example explores the responses api of openai
import dotenv from 'dotenv';
import OpenAI from 'openai';

dotenv.config();

const openai = new OpenAI({
	apiKey: process.env.OPENAI_API_KEY
});

const basicResponse = async () => {
	const response = await openai.responses.create({
		model: 'gpt-4o-mini',
		input: 'Write a one sentence story about a spoon.'
	});

	// the output_text is the final text output of the response
	console.log(response.output_text);

	// the output array contains the array of the response items
	for (const output of response.output) {
		for (const content of output.content) {
			console.log(content.text);
		}
	}
}

basicResponse();