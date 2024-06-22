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

                // Optionally, update the pet's points in the Pets table
                const updatePetPointsSQL = `
                    UPDATE Pets
                    SET points = points + ?
                    WHERE pet_id = ?`;
                pool.query(updatePetPointsSQL, [reward_points, pet_id], callback);
            });
        });
    });
};

module.exports.getPetRewards = (petId, callback) => {
    const SQL = `
        SELECT * FROM Rewards
        WHERE pet_id = ?`;
    const VALUES = [petId];
    pool.query(SQL, VALUES, callback);
};
