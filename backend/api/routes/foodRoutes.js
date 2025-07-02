const express = require('express');
const router = express.Router();
const foodController = require('../controllers/foodController');

// GET all foods
router.get('/foods', foodController.getAllFoods);

// POST a new food
router.post('/foods', foodController.addFood);

// DELETE a food by ID
router.delete('/foods/:id', foodController.deleteFood);

// PUT (update) a food by ID
router.put('/foods/:id', foodController.updateFood);

module.exports = router;
