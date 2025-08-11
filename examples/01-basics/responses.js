// this example explores the responses api of openai
dotenv.config();
import dotenv from 'dotenv';
import OpenAI from 'openai';

const openai = new OpenAI({
	apiKey: process.env.OPENAI_API_KEY
});


const basicResponse = async () => {
	// input structure with instructions
	const response = await openai.responses.create({
		model: 'gpt-4o-mini',
		// instruction only applies to the current response
		instructions: 'You are a helpful assistant that ends every response with a joke.',
		input: 'Hi, how are you?'
	});
	console.log(response.output_text);


	// similar input structure but with object instead of string
	const response2 = await openai.responses.create({
		model: 'gpt-4o-mini',
		input: [
			{
				// developer is like a function that provides instructions to the model, it handles the business logic
				role: 'developer', // instructions provided by the developer
				content: 'You are a helpful assistant that ends every response with a joke.'
			},
			{
				role: 'user', // user provides input that is then processed by the developer instructions
				content: 'Hi, how are you?'
			}
		]
	});
	console.log(response2.output_text);

	// input with image processing


}


const streamResponse = async () => {
	const stream = await openai.responses.create({
		model: 'gpt-4o',
		input: 'write a sentence about a spoon',
		stream: true
	});

	for await (const chunk of stream) {
		process.stdout.write(chunk.delta ?? '');
	}
}

basicResponse();