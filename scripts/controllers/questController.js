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
            res.status(200).json({ message: "Pet quest completed successfully and reward granted" });
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
