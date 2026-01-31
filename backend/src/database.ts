import Database from 'better-sqlite3';
import { DB_PATH } from './utils/constants';

const db = new Database(DB_PATH);
console.log('Database Path:', DB_PATH);

export const initDb = () => {
  db.exec(`
    CREATE TABLE IF NOT EXISTS podcasts (
      id TEXT PRIMARY KEY,
      title TEXT NOT NULL,
      description TEXT,
      host TEXT,
      cover_image TEXT,
      duration TEXT,
      transcription TEXT,
      source_url TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);
};

export default db;
