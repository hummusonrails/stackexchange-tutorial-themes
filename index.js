
import dotenv from 'dotenv';
dotenv.config();

import axios from 'axios';
import { ChatGPTAPI } from 'chatgpt';
import fs from 'fs/promises';

// Define StackExchange API endpoint and parameters for the Substrate site
const apiUrl = 'https://api.stackexchange.com/2.3/questions?site=substrate&pagesize=50';
const pageSizeParam = 100; // number of questions to retrieve per request

// Define GPT model parameters
const apiKey = process.env.OPENAI_API_KEY;
const gpt = new ChatGPTAPI({
  apiKey: apiKey,
})

// Make HTTP requests to the StackExchange API to retrieve recent questions from the Substrate site
const getRecentQuestions = async (page = 1) => {
  try {
    const response = await axios.get(apiUrl, {
      params: {
        page,
      },
    });
    return response.data.items;
  } catch (error) {
    console.error(error);
  }
};

// Extract question titles and bodies from the retrieved questions
const extractQuestionText = (questions) => {
  const questionTexts = [];
  questions.forEach((question) => {
    questionTexts.push(question.title);
    questionTexts.push(question.body);
  });
  return questionTexts.join('\n');
};

// Use GPT to analyze the text and extract common topics
const analyzeQuestionText = async (questionText) => {
  let question = `Imagine you are analyzing these questions submitted by developers on StackExchange, what themes do you see arise from them? Are there common questions that people ask? What are the common topics? Please provide a specific list of highly defined tutorial topics that could be written that would address these questions, only provide the list of tutorial titles in your response and nothing else before or after it: ${questionText}`
  const response = await gpt.sendMessage(question, {
    max_tokens: 100,
    n: 5, // number of topics to extract
    stop: '\n', // use newline character to separate topics
    presence_penalty: 0.5,
    frequency_penalty: 0,
  });
  return response.text;
  // return response.choices[0].text;
};

// Main function to retrieve recent questions from the Substrate site, analyze them using GPT, and generate tutorial and blog post ideas
const main = async () => {
  const questions = await getRecentQuestions();
  const questionText = extractQuestionText(questions);
  const topics = await analyzeQuestionText(questionText);
  await fs.writeFile('topics.txt', topics);
  return topics;
};

// Call the main function
main();

export { main };