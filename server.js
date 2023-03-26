import express from 'express';
import path from 'path';
import fs from 'fs/promises';
import db from './db.js';
import cookieParser from 'cookie-parser';
import { fileURLToPath } from 'url';
import { main } from './index.js';
import { createOutline } from './create-outline.js';

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
  let topics = [];

  const fetchLatestTopicsFromDatabase = async () => {
    const query = `
      SELECT id, content, created_at
      FROM topics
      ORDER BY created_at DESC
    `;

    try {
      const result = await db.query(query);
      // return result rows as an array of topics with their id and content
      console.log(result.rows);
      return result.rows.map((row) => {
        return {
          id: row.id,
          content: row.content,
        };
      });
    } catch (error) {
      console.error('Error fetching topics from the database:', error);
    }
  };

  const deleteAllTopics = async () => {
    const query = `
      DELETE FROM topics
    `;

    try {
      await db.query(query);
    } catch (error) {
      console.error('Error deleting topics from the database:', error);
    }
  };

  const topicsArray = await fetchLatestTopicsFromDatabase();

  if (topicsArray.length > 0) {
    const latestCreatedAt = new Date(topicsArray[0].created_at);
    const now = new Date();
    const oneMonth = 30 * 24 * 60 * 60 * 1000;

    if (now - latestCreatedAt >= oneMonth) {
      await deleteAllTopics();
      const topicsString = await main();
      topics = topicsString;
    } else {
      topics = topicsArray;
    }
  } else {
    const topicsString = await main();
    topics = topicsString;
  }

  res.json(topics);
});


app.get('/topics/:id', async (req, res) => {
  const topicId = req.params.id;

  const query = `
    SELECT content
    FROM topics
    WHERE id = $1
  `;

  try {
    const result = await db.query(query, [topicId]);

    if (result.rows.length === 0) {
      return res.status(404).send('Topic not found');
    }

    const topic = {
      id: result.rows[0].id,
      content: result.rows[0].content,
    };

    const outline = await createOutline(topic.content);

    res.render('topic', { topic, outline });

  } catch (error) {
    console.error('Error fetching content from the database:', error);
    res.status(500).send('Server error');
  }
});




const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${3000}`);
});