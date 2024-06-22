const express = require('express');
const router = express.Router();
const petController = require('../controllers/petController');

// Define pet routes
router.post('/pets', petController.createPet);
router.get('/pets/:pet_id', petController.getPetDetails);
router.put('/pets/:pet_id', petController.updatePet);
router.delete('/pets/:pet_id', petController.deletePet);

module.exports = router;
