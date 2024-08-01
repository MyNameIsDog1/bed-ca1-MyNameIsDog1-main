const express = require('express');
const router = express.Router();
const petController = require('../controllers/petController');

// Define pet routes
router.post('/', petController.createPet);
router.get('/:pet_id', petController.getPetDetails);
router.get('/:pet_id/points', petController.getPetPoints);
router.get('/:pet_id/health-happiness', petController.getPetHealthAndHappiness);
router.put('/:pet_id', petController.updatePet);
router.delete('/:pet_id', petController.deletePet);

module.exports = router;
