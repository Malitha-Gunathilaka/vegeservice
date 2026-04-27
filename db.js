const sqlite3 = require("sqlite3").verbose();

const db = new sqlite3.Database("./idamart.db", (err) => {
  if (err) {
    console.error("DB Error:", err.message);
  } else {
    console.log("SQLite Connected");
  }
});

// Create tables
db.serialize(() => {
  db.run(`CREATE TABLE IF NOT EXISTS customers (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    phone TEXT UNIQUE
  )`);

  db.run(`CREATE TABLE IF NOT EXISTS prices (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    item TEXT,
    price REAL,
    date TEXT
  )`);
});

module.exports = db;
