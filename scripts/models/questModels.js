const pool = require("../database/db");

module.exports.createPetQuest = (questData, callback) => {
    const SQL = `
        INSERT INTO PetQuests (pet_id, description, status, reward_points)
        VALUES (?, ?, 'pending', ?)`;
    const VALUES = [questData.pet_id, questData.description, questData.reward_points];
    pool.query(SQL, VALUES, callback);
};

module.exports.getPetQuests = (petId, callback) => {
    const SQL = `
        SELECT * FROM PetQuests
        WHERE pet_id = ?`;
    const VALUES = [petId];
    pool.query(SQL, VALUES, callback);
};

module.exports.completePetQuest = (questId, callback) => {
    const updateQuestSQL = `
        UPDATE PetQuests
        SET status = 'completed'
        WHERE quest_id = ?`;
    const questValues = [questId];

    pool.query(updateQuestSQL, questValues, (error, results) => {
        if (error) {
            return callback(error);
        }

        // Fetch quest details
        const fetchQuestSQL = `
            SELECT pet_id, reward_points
            FROM PetQuests
            WHERE quest_id = ?`;
        pool.query(fetchQuestSQL, [questId], (error, results) => {
            if (error) {
                return callback(error);
            }

            const { pet_id, reward_points } = results[0];

            // Insert reward into Rewards table
            const insertRewardSQL = `
                INSERT INTO Rewards (pet_id, reward_description, points)
                VALUES (?, 'Quest completed', ?)`;
            pool.query(insertRewardSQL, [pet_id, reward_points], (error, results) => {
                if (error) {
                    return callback(error);
                }

                // Update the pet's points in the Pets table
                const updatePetPointsSQL = `
                    UPDATE Pets
                    SET points = points + ?
                    WHERE pet_id = ?`;
                pool.query(updatePetPointsSQL, [reward_points, pet_id], (error, results) => {
                    if (error) {
                        return callback(error);
                    }

                    // Decrease pet's health and happiness
                    const healthDecrease = Math.floor(Math.random() * 10) + 1; // Random decrease between 1 and 10
                    const happinessDecrease = Math.floor(Math.random() * 10) + 1; // Random decrease between 1 and 10
                    module.exports.decreasePetStats(pet_id, -healthDecrease, -happinessDecrease, callback);
                });
            });
        });
    });
};

module.exports.decreasePetStats = (petId, healthDecrease, happinessDecrease, callback) => {
    const SQL = `
        UPDATE Pets
        SET health = GREATEST(health + ?, 0),
            happiness = GREATEST(happiness + ?, 0)
        WHERE pet_id = ?`;
    const VALUES = [healthDecrease, happinessDecrease, petId];
    pool.query(SQL, VALUES, callback);
};

module.exports.getPetRewards = (petId, callback) => {
    const SQL = `
        SELECT * FROM Rewards
        WHERE pet_id = ?`;
    const VALUES = [petId];
    pool.query(SQL, VALUES, callback);
};

// Get quest count
module.exports.getQuestCount = (callback) => {
    const SQL = `SELECT COUNT(*) AS count FROM PetQuests WHERE status = 'completed'`;
    pool.query(SQL, (error, results) => {
        if (error) {
            callback(error, null);
        } else {
            callback(null, results);
        }
    });
};

// Get pet details
module.exports.getPetDetails = (petId, callback) => {
    const SQL = `
        SELECT * FROM Pets
        WHERE pet_id = ?`;
    const VALUES = [petId];
    pool.query(SQL, VALUES, callback);
};
