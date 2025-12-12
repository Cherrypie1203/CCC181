// server.js - Backend for CCC181
const express = require("express");
const cors = require("cors");
const sqlite3 = require("sqlite3").verbose();
const path = require("path");

const app = express();
const PORT = 3001;
const DB_FILE = path.join(__dirname, "data.sqlite");

app.use(cors());
app.use(express.json());

// Connect to SQLite
const db = new sqlite3.Database(DB_FILE);
db.run(`
  CREATE TABLE IF NOT EXISTS applications (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT,
    score INTEGER,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  )
`);

// Routes
app.get("/api/status", (req, res) => {
  res.json({ status: "OK", timestamp: new Date().toISOString() });
});

app.get("/api/applications", (req, res) => {
  db.all("SELECT * FROM applications ORDER BY created_at DESC", [], (err, rows) => {
    res.json(rows);
  });
});

app.post("/api/applications", (req, res) => {
  const { name, score } = req.body;
  db.run("INSERT INTO applications (name, score) VALUES (?, ?)", [name, score], function() {
    res.json({ id: this.lastID, name, score });
  });
});

app.listen(PORT, () => {
  console.log(`Backend running on http://localhost:${PORT}`);
});
