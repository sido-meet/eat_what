const express = require('express');
const cors = require('cors');
const db = require('./database'); // Import the database connection

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json()); // For parsing application/json

// API Routes

// GET all foods
app.get('/api/foods', (req, res) => {
    db.all('SELECT * FROM foods', [], (err, rows) => {
        if (err) {
            res.status(500).json({ error: err.message });
            return;
        }
        // Parse tags back to array
        const foodsWithParsedTags = rows.map(food => ({
            ...food,
            tags: food.tags ? JSON.parse(food.tags) : []
        }));
        res.json(foodsWithParsedTags);
    });
});

// POST a new food
app.post('/api/foods', (req, res) => {
    const { name, image, location, tags } = req.body;
    if (!name) {
        return res.status(400).json({ error: 'Food name is required.' });
    }

    const tagsString = JSON.stringify(tags || []);

    db.run('INSERT INTO foods (name, image, location, tags) VALUES (?, ?, ?, ?)', [name, image, location, tagsString], function(err) {
        if (err) {
            res.status(500).json({ error: err.message });
            return;
        }
        res.status(201).json({ id: this.lastID, name, image, location, tags });
    });
});

// DELETE a food by ID
app.delete('/api/foods/:id', (req, res) => {
    const { id } = req.params;
    db.run('DELETE FROM foods WHERE id = ?', id, function(err) {
        if (err) {
            res.status(500).json({ error: err.message });
            return;
        }
        if (this.changes === 0) {
            res.status(404).json({ message: 'Food not found.' });
        } else {
            res.json({ message: 'Food deleted successfully.' });
        }
    });
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
