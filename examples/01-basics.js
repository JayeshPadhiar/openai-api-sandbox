// this example explores the responses api of openai
dotenv.config();
import dotenv from 'dotenv';
import OpenAI from 'openai';
import {Agent, run} from '@openai/agents'

import fs from 'fs';

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
	console.log('Response 1:', response.output_text);


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
	console.log('Response 2:', response2.output_text);
}

// stream response
const streamResponse = async () => {
	const stream = await openai.responses.create({
		model: 'gpt-4o',
		input: 'give a brief of the history of the internet',
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
						text: 'What is this image? What is the name of the player in the image? What is the name of the team in the image?'
					},
					{
						type: 'input_image',
						image_url: imageurl,
						detail: 'low', // low, high, auto
					}
				]
			}
		]
	});
	console.log(response.output_text);
}

// image generation
const imageGeneration = async () => {
	const response = await openai.responses.create({
		model: 'gpt-4.1',
		input: 'generate a photo of an engineering team sitting and having lunch',
		tools: [
			{
				type: 'image_generation',
				quality: 'low'
			}
		]
	});

	// Save the image to a file
	const imageData = response.output
		.filter((output) => output.type === "image_generation_call")
		.map((output) => output.result);

	if (imageData.length > 0) {
		const imageBase64 = imageData[0];
		fs.writeFileSync("image.png", Buffer.from(imageBase64, "base64"));
	}
}

const fileAnalysis = async () => {
	const response = await openai.responses.create({
		model: 'gpt-4o-mini',
		input: [
			{
				role: 'user',
				content: [
					{
						type: 'input_text',
						text: 'Analyze the following file and give me a brief of the person'
					},
					{
						type: 'input_file',
						file_url: 'https://jayeshpadhiar.com/files/Jayesh_Padhiar_Resume.pdf'
					}
				]
			}
		],
	});
	console.log(response.output_text);
}

const webSearch = async () => {
	const response = await openai.responses.create({
		model: 'gpt-4o-mini',
		input: 'whats the news on supreme court and dogs',
		tools: [
			{
				type: 'web_search_preview',
			}
		]
	});
	console.log(response.output_text);
}

const customFunction = async () => {
	const tools = [{
		type: 'function',
		name: 'get_weather',
		description: 'Get the latest weather of the given location and return the temperature in celsius and end the response with a joke',
		parameters: {
			type: 'object',
			properties: {
				location: {
					type: 'string',
					description: 'The location to get the weather for'
				}
			},
		},
	}];

	let input = [{
		role: 'user',
		content: 'whats the weather in navi mumbai'
	}]

	let response = await openai.responses.create({
		model: 'gpt-4o-mini',
		input,
		tools,
		tool_choice: 'auto' // auto, required, none
	});
	console.log(response.output);

	// add the response to the input
	input = input.concat(response.output);

	// get the function call details from the response
	const functionCall = response.output.find(output => output.type === 'function_call');

	// function to call
	const getWeather = async (location) => {
		return {
			location,
			temperature: 25,
			weather: 'sunny',
			joke: 'Why did the computer scientist get a cold? Because it had too many bugs. heheheheheheh'
		}
	}
	const result = await getWeather('navi mumbai');

	// add the result to the input
	input.push({
		type: 'function_call_output',
		call_id: functionCall.call_id,
		output: JSON.stringify(result)
	});

	// call the function again
	response = await openai.responses.create({
		model: 'gpt-4o-mini',
		input,
		tools,
		instructions: 'Give the final response here',
	});
	console.log(response.output_text);

}

const agentFlow = async () => {
	const spanishAgent = new Agent({
		name: 'spanishAgent',
		instructions: 'you are an agent that only speaks spanish. start your response with "Hola soy un agente de espanol"',
	});

	const englishAgent = new Agent({
		name: 'englishAgent',
		instructions: 'you are an agent that only speaks english. start your response with "Hello I am an english agent"',
	});

	const germanyAgent = new Agent({
		name: 'germanAgent',
		instructions: 'you are an agent that only speaks german. start your response with "Hallo ich bin ein deutscher agent"',
	});

	const langAgent = new Agent({
		name: 'langAgent',
		instructions: 'you are an agent that takes input from the user and translates it to the language of the agent that is speaking',
		handoffs: [spanishAgent, englishAgent, germanyAgent]
	});

	const result = await run(langAgent, 'was machst du?');
	console.log(result.finalOutput);
}

// basicResponse();
// streamResponse();
// imageAnalysis();
// imageGeneration();
// fileAnalysis();
// webSearch();
// customFunction();
agentFlow();