import dotenv from 'dotenv';
dotenv.config();

import axios from 'axios';
import { ChatGPTAPI } from 'chatgpt';
import fs from 'fs/promises';

// instantiate the db
import db from './db.js';

const saveTopicsToDatabase = async (topics) => {
  const query = `
    INSERT INTO topics (content)
    VALUES ($1)
  `;

  try {
    await db.query(query, [topics]);
    console.log('Topics saved to the database.');
  } catch (error) {
    console.error('Error saving topics to the database:', error);
  }
};
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
  let question = `
      Imagine you are a technical writer or developer advocate looking at the following questions submitted by 
      developers on StackExchange. Please provide a list of tutorial titles that are the result of your analysis
      of the themes that emerge from the questions. The tutorial titles should not be a direct copy of the question
      title, but should be a concise and SEO friendly title that describes the theme.
      Here are the questions: ${questionText}
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
const main = async () => {
  const questions = await getRecentQuestions();
  const questionText = extractQuestionText(questions);
  let topics = await analyzeQuestionText(questionText);
  // remove the leading '- ' from each topic and add a newline
  topics = topics.replace(/- /g, '').replace(/,/g, '\n');
  // remove leading sentence starting with "List of" 
  topics = topics.replace(/List of.*/g, '');
  // remove "Tutorial Title: " from the beginning of each topic, case insensitive
  topics = topics.replace(/Tutorial Title: /gi, '');
  // remove any leading or trailing whitespace
  topics = topics.trim();
  // each new topic can be multiple lines, and begins with a number and a period
  // split the topics into an array of topics
  topics = topics.split(/\n\d+\./);
  // remove any empty strings from the array
  topics = topics.filter((topic) => topic !== '');
  // add to the database each topic
  topics.forEach(async (topic) => {
    await saveTopicsToDatabase(topic);
  });
}

// Call the main function
main();

export { main };