
import dotenv from 'dotenv';
dotenv.config();

import axios from 'axios';
import { ChatGPTAPI } from 'chatgpt';

// Define GPT model parameters
const apiKey = process.env.OPENAI_API_KEY;
const gpt = new ChatGPTAPI({
  apiKey: apiKey,
})

// Use GPT to analyze the text and extract common topics
const getOutline = async (topic) => {
  let question = `
  You are a technical writer and you have been tasked to write a tutorial with the title of "${topic}". 
  Your first job is to create an outline for the tutorial. In your response to this prompt, please provide a 
  step-by-step outline for the tutorial in HTML format. In each step of the outline, please provide a 
  brief description of what the reader will learn in that step. You can use the following format for each step:

  <li>Step 1: [Name of Step]: <i>&lt;description of what the reader will learn in this step&gt;</i></li>
  <li>Step 2: [Name of Step]: <i>&lt;description of what the reader will learn in this step&gt;</i></li>
  etc.
  `
  const response = await gpt.sendMessage(question, {
    max_tokens: 100,
    n: 5, // number of topics to extract
    stop: '\n', // use newline character to separate topics
    presence_penalty: 0.5,
    frequency_penalty: 0,
  });
  return response.text;
};

// Main function to retrieve recent questions from the Substrate site, analyze them using GPT, and generate tutorial and blog post ideas
const createOutline = async (topic) => {
  let outline = await getOutline(topic);
  console.log(outline);
  return outline;
}

// Call the main function
createOutline();

export { createOutline };