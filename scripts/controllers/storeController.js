const pool = require('../database/db');

const itemCosts = {
    dog_bone: 50,
    dog_leash: 100,
    cat_bowl: 75,
    dog_food: 30,
    cat_food: 20
};

const feedEffects = {
    dog_food: { health: 10, happiness: 5 },
    cat_food: { health: 5, happiness: 10 }
};

module.exports.buyItem = (req, res) => {
    const petId = req.body.pet_id;
    const item = req.body.item;
    const cost = itemCosts[item];

    if (!cost) {
        return res.status(400).json({ message: "Invalid item selected" });
    }

    // Retrieve the total points of the pet
    pool.query('SELECT points FROM Pets WHERE pet_id = ?', [petId], (error, results) => {
        if (error) {
            console.error("Error retrieving points:", error);
            return res.status(500).json({ message: "Error retrieving points", error });
        }

        if (results.length === 0) {
            return res.status(404).json({ message: "Pet not found" });
        }

        const totalPoints = results[0].points || 0;
        if (totalPoints < cost) {
            return res.status(400).json({ message: "Not enough points" });
        }

        const newPoints = totalPoints - cost;

        // Update the pet's points
        pool.query('UPDATE Pets SET points = ? WHERE pet_id = ?', [newPoints, petId], (updateError) => {
            if (updateError) {
                console.error("Error updating points:", updateError);
                return res.status(500).json({ message: "Error updating points", updateError });
            }

            // Insert the purchase record
            pool.query('INSERT INTO StorePurchases (pet_id, item, cost) VALUES (?, ?, ?)', [petId, item, cost], (insertError) => {
                if (insertError) {
                    console.error("Error recording purchase:", insertError);
                    return res.status(500).json({ message: "Error recording purchase", insertError });
                }

                res.status(200).json({ message: `Purchased ${item}`, item: item, remainingPoints: newPoints });
            });
        });
    });
};

module.exports.feedPet = (req, res) => {
    const petId = req.body.pet_id;
    const item = req.body.item;
    const cost = itemCosts[item];

    if (!cost) {
        return res.status(400).json({ message: "Invalid item selected" });
    }

    const effects = feedEffects[item];

    if (!effects) {
        return res.status(400).json({ message: "Invalid feed item selected" });
    }

    // Retrieve the pet's current points, health, and happiness
    pool.query('SELECT points, health, happiness FROM Pets WHERE pet_id = ?', [petId], (error, results) => {
        if (error) {
            console.error("Error retrieving pet details:", error);
            return res.status(500).json({ message: "Error retrieving pet details", error });
        }

        if (results.length === 0) {
            return res.status(404).json({ message: "Pet not found" });
        }

        const pet = results[0];
        if (pet.points < cost) {
            return res.status(400).json({ message: "Not enough points" });
        }

        const newPoints = pet.points - cost;
        const newHealth = Math.min(100, pet.health + effects.health);
        const newHappiness = Math.min(100, pet.happiness + effects.happiness);

        // Update the pet's points, health, and happiness
        pool.query('UPDATE Pets SET points = ?, health = ?, happiness = ? WHERE pet_id = ?', [newPoints, newHealth, newHappiness, petId], (updateError) => {
            if (updateError) {
                console.error("Error updating pet details:", updateError);
                return res.status(500).json({ message: "Error updating pet details", updateError });
            }

            // Insert the purchase record
            pool.query('INSERT INTO StorePurchases (pet_id, item, cost) VALUES (?, ?, ?)', [petId, item, cost], (insertError) => {
                if (insertError) {
                    console.error("Error recording purchase:", insertError);
                    return res.status(500).json({ message: "Error recording purchase", insertError });
                }

                res.status(200).json({ message: `Fed pet with ${item}`, item: item, remainingPoints: newPoints, health: newHealth, happiness: newHappiness });
            });
        });
    });
};
