const pool = require("../database/db");


// check if username exists in User database -- used in qns 1 & 4
// Check if username exists
module.exports.checkIfUsernameExist = (username) => {
    return new Promise((resolve, reject) => {
        const SQL = `
            SELECT username FROM User
            WHERE username = ?`;
        const VALUES = [username];
        pool.query(SQL, VALUES, (error, results) => {
            if (error) {
                reject(error);
            } else {
                resolve(results);
            }
        });
    });
};
// check if user ID exists in User database -- used in qns 3 & 4
module.exports.checkUserExistId = (userId, callback) => {
    const SQL = `
        SELECT * FROM User
        WHERE user_id = ?`;
    const VALUES = [userId];
    pool.query(SQL, VALUES, callback);
};

// check the number of questions answered by a specific user in UserAnswer database -- used in qns 3 & 4
module.exports.checkNoOfQnsAnswered = (participantId, callback) => {
    const SQL = `
        SELECT participant_id FROM UserAnswer
        WHERE participant_id = ?`;
    const VALUES = [participantId];
    pool.query(SQL, VALUES, callback);
};

// ================================= question 1 =========================================
// create new user
// In your database operations module

// Function to create a new user
module.exports.createUser = (user) => {
    return new Promise((resolve, reject) => {
        const { username, password } = user;
        const SQL = `INSERT INTO User (username, password) VALUES (?, ?)`;
        pool.query(SQL, [username, password], (error, results) => {
            if (error) return reject(error);
            resolve(results);
        });
    });
};
module.exports.getUserCount = (callback) => {
    const SQL = 'SELECT COUNT(*) AS count FROM User';
    pool.query(SQL, callback);
};




// get specific user from User database
module.exports.getUserDetails = (userId, callback) => {
    const SQL = `
        SELECT * FROM User
        WHERE user_id = ?`;
    const VALUES = [userId];
    pool.query(SQL, VALUES, callback);
};

// ================================= question 2 =========================================
// get all users from User database
module.exports.getAllUsers = (callback) => {
    const SQL = `
        SELECT * FROM User`;
    pool.query(SQL, callback);
};

// ================================= question 4 =========================================
// update username in User database
module.exports.insertSingle = (userId, username, callback) => {
    const SQL = `
        UPDATE User
        SET username = ?
        WHERE user_id = ?`;
    const VALUES = [username, userId];
    pool.query(SQL, VALUES, callback);
};
// Find user by username
module.exports.findUserByUsername = (username) => {
    return new Promise((resolve, reject) => {
        const SQL = `
            SELECT * FROM User
            WHERE username = ?`;
        const VALUES = [username];
        pool.query(SQL, VALUES, (error, results) => {
            if (error) {
                reject(error);
            } else {
                resolve(results[0]);
            }
        });
    });
};
module.exports.getQuestCount = (callback) => {
    const SQL = 'SELECT COUNT(*) AS count FROM PetQuests WHERE status = "completed"';
    pool.query(SQL, callback);
};