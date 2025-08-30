import sqlite3 from 'sqlite3';
import path from 'path';
import { fileURLToPath } from 'url';

// Емуляція __dirname
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Вказуємо шлях до файлу бази даних
const dbPath = path.resolve(__dirname, 'database.db');

// Створюємо підключення
const db = new sqlite3.Database(dbPath, (err) => {
  if (err) {
    console.error('Помилка підключення до бази даних:', err.message);
  } else {
    console.log('Підключення до SQLite успішне!');
  }
});

// Експортуємо об'єкт db
export default db;
