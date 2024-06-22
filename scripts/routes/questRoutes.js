const express = require('express');
const router = express.Router();
const questController = require('../controllers/questController');

// Define quest routes
router.post('/pet-quests', questController.createPetQuest);
router.get('/pet-quests/:pet_id', questController.getPetQuests);
router.post('/pet-quests/:quest_id/complete', questController.completePetQuest);
router.get('/rewards/:pet_id', questController.getPetRewards);

module.exports = router;