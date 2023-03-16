import express from 'express';
import path from 'path';
import fs from 'fs/promises';
import db from './db.js';
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
  res.render('index');
});


app.get('/topics', async (req, res) => {
  const lastGenerated = req.cookies.lastGenerated;
  const now = new Date();
  let topics;

  const fetchLatestTopicsFromDatabase = async () => {
    const query = `
      SELECT content
      FROM topics
      ORDER BY created_at DESC
    `;
  
    try {
      const result = await db.query(query);
      return result.rows.map(row => row.content);
    } catch (error) {
      console.error('Error fetching topics from the database:', error);
    }
  };

  if (!lastGenerated || now - new Date(lastGenerated) >= 7 * 24 * 60 * 60 * 1000) {
    const topicsString = await main();
    topics = topicsString;
    res.cookie('lastGenerated', now);
  } else {
    const topicsArray = await fetchLatestTopicsFromDatabase();
    topics = topicsArray;
    console.log('Topics fetched from the database.');
    console.log(topics);
  }

  res.json(topics);
});


const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${3000}`);
});