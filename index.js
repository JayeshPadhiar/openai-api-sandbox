import dotenv from 'dotenv';
import OpenAI from 'openai';
import { basicChat } from './examples/1_basic_chat.js';

dotenv.config();

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

// Wrap the API call in an async function
async function main() {
  try {
		await basicChat(openai);
  } catch (error) {
    console.error('Error:', error.message);
  }
}

main();