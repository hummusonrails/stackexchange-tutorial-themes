// server.js

import express from 'express';
import path from 'path';
import fs from 'fs/promises';
import cookieParser from 'cookie-parser';
import { fileURLToPath } from 'url';
import { main } from './index.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.use(express.static(path.join(__dirname, 'public')));
app.use(cookieParser());

app.get('/', async (req, res) => {
  const lastGenerated = req.cookies.lastGenerated;
  const now = new Date();
  let topics;

  if (!lastGenerated || now - lastGenerated >= 7 * 24 * 60 * 60 * 1000) {
    topics = await main();
    res.cookie('lastGenerated', now);
  } else {
    try {
      topics = (await fs.readFile('topics.txt', 'utf8')).split('\n');
    } catch (error) {
      console.error(`Error reading topics from file: ${error}`);
      topics = [];
    }
  }
  res.render('index', { topics });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${3000}`);
});