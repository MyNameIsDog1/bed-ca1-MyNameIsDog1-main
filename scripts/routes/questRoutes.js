const express = require('express');
const router = express.Router();
const questController = require('../controllers/questController');

// Define quest routes
router.post('/', questController.createPetQuest);
router.get('/count', questController.getQuestCount);
router.get('/pet/:pet_id', questController.getPetQuests);
router.put('/complete/:quest_id', questController.completePetQuest);
router.get('/rewards/:pet_id', questController.getPetRewards);

module.exports = router;
