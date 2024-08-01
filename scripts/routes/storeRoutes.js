const express = require('express');
const router = express.Router();
const storeController = require('../controllers/storeController');

// Define store routes
router.post('/buy', storeController.buyItem);
router.post('/feed', storeController.feedPet);

module.exports = router;
