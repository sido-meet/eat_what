const express = require('express');
const cors = require('cors');
const db = require('./database'); // Import the database connection
const foodRoutes = require('./api/routes/foodRoutes');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json()); // For parsing application/json

// API Routes
app.use('/api', foodRoutes);

db.serialize(() => {
    // Start the server
    app.listen(PORT, '0.0.0.0', () => {
        console.log(`Server running on http://0.0.0.0:${PORT}`);
    });
});
