const pool = require("../database/db");

// Create Pet
module.exports.createPet = (petData, callback) => {
    const SQL = `
        INSERT INTO Pets (owner_id, name, breed, health, happiness)
        VALUES (?, ?, ?, ?, ?)`;
    const VALUES = [petData.owner_id, petData.name, petData.breed, petData.health, petData.happiness];
    pool.query(SQL, VALUES, callback);
};

// Get Pet Details
module.exports.getPetDetails = (petId, callback) => {
    const SQL = `
        SELECT * FROM Pets
        WHERE pet_id = ?`;
    const VALUES = [petId];
    pool.query(SQL, VALUES, callback);
};

// Update Pet
module.exports.updatePet = (petId, petData, callback) => {
    const SQL = `
        UPDATE Pets
        SET name = ?, breed = ?, health = ?, happiness = ?
        WHERE pet_id = ?`;
    const VALUES = [petData.name, petData.breed, petData.health, petData.happiness, petId];
    pool.query(SQL, VALUES, callback);
};

// Delete Pet
module.exports.deletePet = (petId, callback) => {
    const SQL = `
        DELETE FROM Pets
        WHERE pet_id = ?`;
    const VALUES = [petId];
    pool.query(SQL, VALUES, callback);
};
