import pkg from 'pg';
const { Pool } = pkg;
import { config } from 'dotenv';

config();

const pool = new Pool({
  host: process.env.DATABASE_URL,
  port: process.env.DB_PORT,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
});

export default {
  query: (text, params) => pool.query(text, params),
};
