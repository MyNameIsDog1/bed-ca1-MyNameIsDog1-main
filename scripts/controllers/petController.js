const model = require('../models/petModels');

module.exports.createPet = (req, res) => {
    const petData = {
        owner_id: req.body.owner_id,
        name: req.body.name,
        breed: req.body.breed,
        health: req.body.health,
        happiness: req.body.happiness
    };
    model.createPet(petData, (error, results) => {
        if (error) {
            res.status(500).json({ message: "Error creating new pet", error });
        } else {
            res.status(201).json({ pet_id: results.insertId });
        }
    });
};

module.exports.getPetDetails = (req, res) => {
    const petId = req.params.pet_id;
    model.getPetDetails(petId, (error, results) => {
        if (error) {
            res.status(500).json({ message: "Error retrieving pet details", error });
        } else {
            res.status(200).json(results[0]);
        }
    });
};

module.exports.updatePet = (req, res) => {
    const petId = req.params.pet_id;
    const petData = {
        name: req.body.name,
        breed: req.body.breed,
        health: req.body.health,
        happiness: req.body.happiness
    };
    model.updatePet(petId, petData, (error, results) => {
        if (error) {
            res.status(500).json({ message: "Error updating pet", error });
        } else {
            res.status(200).json({ message: "Pet updated successfully" });
        }
    });
};

module.exports.deletePet = (req, res) => {
    const petId = req.params.pet_id;
    model.deletePet(petId, (error, results) => {
        if (error) {
            res.status(500).json({ message: "Error deleting pet", error });
        } else {
            res.status(200).json({ message: "Pet deleted successfully" });
        }
    });
};

