// this example explores the responses api of openai
dotenv.config();
import dotenv from 'dotenv';
import OpenAI from 'openai';

const openai = new OpenAI({
	apiKey: process.env.OPENAI_API_KEY
});

// basic response
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
				// developer/system is like a function that provides instructions to the model, it handles the business logic
				role: 'developer',
				content: 'You are a helpful assistant that ends every response with a joke.'
			},
			{
				role: 'user', // user provides input that is then processed by the developer instructions
				content: 'Hi, how are you?'
			}
		]
	});
	console.log(response2.output_text);
}

// stream response
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

// image analysis
const imageAnalysis = async () => {
	const imageurl = 'https://upload.wikimedia.org/wikipedia/commons/3/3d/Lionel_Messi_NE_Revolution_Inter_Miami_7.9.25-055.jpg';

	const response = await openai.responses.create({
		model: 'gpt-4o-mini',
		input: [
			{
				role: 'user',
				content: [
					{
						type: 'input_text',
						text: 'What is this image? What is the name of the player in the image?'
					},
					{
						type: 'input_image',
						image_url: imageurl
					}
				]
			}
		]
	});
	console.log(response.output_text);
}

imageAnalysis();