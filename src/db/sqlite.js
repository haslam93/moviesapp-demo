import fs from 'node:fs';
import path from 'node:path';
import Database from 'better-sqlite3';
import { config } from '../config/index.js';

let dbInstance;

const ensureDirectory = () => {
  const directory = path.dirname(config.database.file);
  if (!fs.existsSync(directory)) {
    fs.mkdirSync(directory, { recursive: true });
  }
};

const buildDatabase = () => {
  ensureDirectory();
  const database = new Database(config.database.file);
  database.pragma('journal_mode = WAL');
  database.pragma('foreign_keys = ON');

  database.exec(`
    CREATE TABLE IF NOT EXISTS categories (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL UNIQUE,
      label TEXT NOT NULL
    );
  `);

  database.exec(`
    CREATE TABLE IF NOT EXISTS movies (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      external_id TEXT NOT NULL,
      category_id INTEGER NOT NULL,
      title TEXT NOT NULL,
      description TEXT,
      poster_url TEXT,
      imdb_url TEXT,
      year INTEGER,
      rating REAL,
      runtime_minutes INTEGER,
      genres TEXT,
      created_at TEXT DEFAULT CURRENT_TIMESTAMP,
      updated_at TEXT DEFAULT CURRENT_TIMESTAMP,
      UNIQUE(external_id, category_id),
      FOREIGN KEY(category_id) REFERENCES categories(id) ON DELETE CASCADE
    );
  `);

  database.exec(`
    CREATE TRIGGER IF NOT EXISTS trg_movies_updated_at
    AFTER UPDATE ON movies
    FOR EACH ROW
    BEGIN
      UPDATE movies SET updated_at = CURRENT_TIMESTAMP WHERE id = NEW.id;
    END;
  `);

  database.exec(`
    CREATE TABLE IF NOT EXISTS favorites (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      movie_id INTEGER NOT NULL,
      created_at TEXT DEFAULT CURRENT_TIMESTAMP,
      UNIQUE(movie_id),
      FOREIGN KEY(movie_id) REFERENCES movies(id) ON DELETE CASCADE
    );
  `);

  database.exec(`
    CREATE INDEX IF NOT EXISTS idx_favorites_movie_id ON favorites(movie_id);
  `);

  return database;
};

export const getDb = () => {
  if (!dbInstance) {
    dbInstance = buildDatabase();
  }
  return dbInstance;
};

export const closeDb = () => {
  if (dbInstance) {
    dbInstance.close();
    dbInstance = undefined;
  }
};

export const initializeDatabase = () => {
  getDb();
};

export default {
  getDb,
  initializeDatabase,
  closeDb
};
