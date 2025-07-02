const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const fs = require('fs');

const DB_PATH = path.resolve(__dirname, 'foods.db');
const JSON_FOODS_PATH = path.resolve(__dirname, '../data/foods.json');

const db = new sqlite3.Database(DB_PATH, (err) => {
    if (err) {
        console.error('Could not connect to database', err);
    } else {
        console.log('Connected to SQLite database');
        db.run(`
            CREATE TABLE IF NOT EXISTS foods (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                name TEXT NOT NULL UNIQUE,
                image TEXT,
                location TEXT,
                tags TEXT
            )
        `, (err) => {
            if (err) {
                console.error('Error creating foods table', err);
            } else {
                console.log('Foods table created or already exists.');
                // Check if table is empty and import data from JSON
                db.get('SELECT COUNT(*) AS count FROM foods', (err, row) => {
                    if (err) {
                        console.error('Error checking food count', err);
                        return;
                    }
                    if (row.count === 0) {
                        console.log('Foods table is empty, importing data from JSON...');
                        fs.readFile(JSON_FOODS_PATH, 'utf8', (err, data) => {
                            if (err) {
                                console.error('Error reading foods.json', err);
                                return;
                            }
                            const foods = JSON.parse(data);
                            const stmt = db.prepare('INSERT INTO foods (name, image, location, tags) VALUES (?, ?, ?, ?)');
                            foods.forEach(food => {
                                stmt.run(food.name, food.image, food.location, JSON.stringify(food.tags));
                            });
                            stmt.finalize(() => {
                                console.log('Initial foods data imported.');
                            });
                        });
                    } else {
                        console.log('Foods table already contains data.');
                    }
                });
            }
        });
    }
});

module.exports = db;
