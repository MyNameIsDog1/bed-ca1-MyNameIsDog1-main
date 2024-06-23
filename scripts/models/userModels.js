const pool = require("../database/db");


// check if username exists in User database -- used in qns 1 & 4
module.exports.checkIfUsernameExist = (username, callback) => {
    const SQL = `
        SELECT username FROM User
        WHERE username = ?`;
    const VALUES = [username];
    pool.query(SQL, VALUES, callback);
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
module.exports.creatingNewUser = (username, callback) => {
    const SQL = `
        INSERT INTO User (username)
        VALUES (?)`;
    const VALUES = [username];
    pool.query(SQL, VALUES, callback);
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
