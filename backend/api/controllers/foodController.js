const db = require('../../database');

// Get all foods
exports.getAllFoods = (req, res) => {
    db.all('SELECT * FROM foods', [], (err, rows) => {
        if (err) {
            res.status(500).json({ error: err.message });
            return;
        }
        const foodsWithParsedTags = rows.map(food => ({
            ...food,
            tags: food.tags ? JSON.parse(food.tags) : []
        }));
        res.json(foodsWithParsedTags);
    });
};

// Add a new food
exports.addFood = (req, res) => {
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
};

// Delete a food by ID
exports.deleteFood = (req, res) => {
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
};

// Update a food by ID
exports.updateFood = (req, res) => {
    const { id } = req.params;
    const { name, image, location, tags } = req.body;

    if (!name) {
        return res.status(400).json({ error: 'Food name is required.' });
    }

    const tagsString = JSON.stringify(tags || []);

    db.run(
        'UPDATE foods SET name = ?, image = ?, location = ?, tags = ? WHERE id = ?',
        [name, image, location, tagsString, id],
        function(err) {
            if (err) {
                res.status(500).json({ error: err.message });
                return;
            }
            if (this.changes === 0) {
                res.status(404).json({ message: 'Food not found.' });
            } else {
                res.json({ id, name, image, location, tags });
            }
        }
    );
};
