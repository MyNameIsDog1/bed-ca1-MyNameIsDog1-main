const model = require('../models/questModels');

module.exports.createPetQuest = (req, res) => {
    const questData = {
        pet_id: req.body.pet_id,
        description: req.body.description,
        reward_points: req.body.reward_points
    };
    model.createPetQuest(questData, (error, results) => {
        if (error) {
            res.status(500).json({ message: "Error creating pet quest", error });
        } else {
            res.status(201).json({ quest_id: results.insertId });
        }
    });
};

module.exports.getQuestCount = (req, res) => {
    model.getQuestCount((error, results) => {
        if (error) {
            console.error('Error retrieving quest count:', error);
            res.status(500).json({ message: 'Error retrieving quest count' });
        } else {
            const questCount = results && results[0] ? results[0].count : 0;
            res.status(200).json({ questCount });
        }
    });
};

module.exports.getPetQuests = (req, res) => {
    const petId = req.params.pet_id;
    model.getPetQuests(petId, (error, results) => {
        if (error) {
            res.status(500).json({ message: "Error retrieving pet quests", error });
        } else {
            res.status(200).json(results);
        }
    });
};

module.exports.completePetQuest = (req, res) => {
    const questId = req.params.quest_id;
    model.completePetQuest(questId, (error, results) => {
        if (error) {
            res.status(500).json({ message: "Error completing pet quest", error });
        } else {
            const healthDecrease = Math.floor(Math.random() * 10) + 1; // Random decrease between 1 and 10
            const happinessDecrease = Math.floor(Math.random() * 10) + 1; // Random decrease between 1 and 10
            const petId = results.pet_id;

            model.decreasePetStats(petId, healthDecrease, happinessDecrease, (error, updateResults) => {
                if (error) {
                    res.status(500).json({ message: "Error updating pet stats", error });
                } else {
                    res.status(200).json({
                        message: "Pet quest completed successfully and reward granted",
                        healthDecrease,
                        happinessDecrease
                    });
                }
            });
        }
    });
};

module.exports.getPetRewards = (req, res) => {
    const petId = req.params.pet_id;
    model.getPetRewards(petId, (error, results) => {
        if (error) {
            res.status(500).json({ message: "Error retrieving pet rewards", error });
        } else {
            res.status(200).json(results);
        }
    });
};
module.exports.feedPet = (req, res) => {
    const petId = req.body.pet_id;
    const healthIncrease = 10;
    const happinessIncrease = 10;

    model.updatePetHealthAndHappiness(petId, healthIncrease, happinessIncrease, (error) => {
        if (error) {
            res.status(500).json({ message: "Error feeding pet", error });
        } else {
            res.status(200).json({ message: "Pet fed successfully" });
        }
    });
};
module.exports.getPetDetails = (req, res) => {
    const petId = req.params.pet_id;
    model.getPetDetails(petId, (error, results) => {
        if (error) {
            res.status(500).json({ message: "Error retrieving pet details", error });
        } else {
            const pet = results[0];
            if (pet.health <= 0) {
                res.status(200).json({ message: "Your pet has died", pet });
            } else {
                res.status(200).json(pet);
            }
        }
    });
};
