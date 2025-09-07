import sqlite3 from 'sqlite3';
import readline from 'readline';
import path from 'path';
import { fileURLToPath } from 'url';

// __dirname для ESM
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Підключаємося до бази
const dbPath = path.resolve(__dirname, 'database.db');
const db = new sqlite3.Database(dbPath, (err) => {
  if (err) console.error('Помилка підключення:', err.message);
  else console.log('Підключено до SQLite!');
});

// Створюємо інтерфейс для введення команд у консолі
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
  prompt: 'SQL> '
});

// Виводимо підказку
rl.prompt();

// Обробка введення команд
rl.on('line', (line) => {
  const sql = line.trim();

  if (!sql) {
    rl.prompt();
    return;
  }

  // Команда для очищення консолі
  if (sql.toLowerCase() === 'clear' || sql.toLowerCase() === 'cls') {
    console.clear();
    rl.prompt();
    return;
  }

  // Визначаємо тип запиту: SELECT чи інший
  if (sql.toLowerCase().startsWith('select')) {
    db.all(sql, [], (err, rows) => {
      if (err) console.error('Помилка:', err.message);
      else console.log(rows);
      rl.prompt();
    });
  } else {
    db.run(sql, function(err) {
      if (err) console.error('Помилка:', err.message);
      else console.log(`Успішно виконано. Затронуто рядків: ${this.changes}`);
      rl.prompt();
    });
  }
}).on('close', () => {
  console.log('\nВихід з програми...');
  db.close();
  process.exit(0);
});
