const model = require('../models/petModels');

module.exports.createPet = (req, res) => {
    const petData = {
        owner_id: req.body.owner_id,
        name: req.body.name,
        breed: req.body.breed,
        health: 40,
        happiness: 40
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

module.exports.getPetPoints = (req, res) => {
    const petId = req.params.pet_id;
    model.getPetPoints(petId, (error, results) => {
        if (error) {
            res.status(500).json({ message: "Error retrieving pet points", error });
        } else {
            res.status(200).json({ points: results[0].points });
        }
    });
};

module.exports.feedPet = (req, res) => {
    const { pet_id, item } = req.body;

    const feedEffects = {
        dog_food: { health: 10, happiness: 5, cost: 30 },
        cat_food: { health: 5, happiness: 10, cost: 20 }
    };

    const effects = feedEffects[item];

    if (!effects) {
        return res.status(400).json({ message: "Invalid item" });
    }

    model.getPetDetails(pet_id, (error, petResults) => {
        if (error) {
            return res.status(500).json({ message: "Error retrieving pet details", error });
        }
        if (petResults.length === 0) {
            return res.status(404).json({ message: "Pet not found" });
        }

        const pet = petResults[0];

        if (pet.points < effects.cost) {
            return res.status(400).json({ message: "Insufficient points" });
        }

        const updatedHealth = Math.min(100, pet.health + effects.health);
        const updatedHappiness = Math.min(100, pet.happiness + effects.happiness);
        const updatedPoints = pet.points - effects.cost;

        model.updatePet(pet_id, { health: updatedHealth, happiness: updatedHappiness, points: updatedPoints }, (updateError, updateResults) => {
            if (updateError) {
                return res.status(500).json({ message: "Error updating pet", updateError });
            }

            res.status(200).json({ message: `You have fed your pet with ${item}`, health: updatedHealth, happiness: updatedHappiness, remainingPoints: updatedPoints });
        });
    });
};
module.exports.getPetHealthAndHappiness = (req, res) => {
    const petId = req.params.pet_id;
    model.getPetHealthAndHappiness(petId, (error, results) => {
        if (error) {
            res.status(500).json({ message: "Error retrieving pet health and happiness", error });
        } else {
            if (results.length === 0) {
                res.status(404).json({ message: "Pet not found" });
            } else {
                res.status(200).json({
                    health: results[0].health,
                    happiness: results[0].happiness
                });
            }
        }
    });
};