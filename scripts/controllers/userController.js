const model = require("../models/userModels");

// =============================== repeated middleware =========================================
// check if username exists in database -- used in qns 1 & 4
module.exports.checkUsernameExist = (req, res, next) => {
    const username = req.body.username;

    if (!username) {
        return res.status(400).json({ message: "Username is undefined" });
    }

    model.checkIfUsernameExist(username, (error, results) => {
        if (error) {
            console.error(error);
            res.status(500).json({ message: "Error checking duplicated username" });
        } else if (results.length > 0) {
            res.status(409).json({ message: "Username is associated with other users" });
        } else {
            next();
        }
    });
};

// check if user ID exists in database -- used in qns 3 & 4
module.exports.checkUserIDExist = (req, res, next) => {
    const userId = req.params.user_id;

    if (isNaN(userId)) {
        return res.status(400).json({ message: 'User ID needs to be a number' });
    }

    model.checkUserExistId(userId, (error, results) => {
        if (error) {
            console.error(error);
            res.status(500).json({ message: "Error checking if user ID exists" });
        } else if (results.length === 0) {
            res.status(404).json({ message: 'User ID not found' });
        } else {
            if (results[0].points === null) {
                results[0].points = 0; // change "null" to 0
            }
            res.locals.userInfo = results;
            next();
        }
    });
};

// ================================= question 1 =========================================
// create the user
module.exports.createUser = (req, res, next) => {
    const username = req.body.username;

    model.creatingNewUser(username, (error, results) => {
        if (error) {
            console.error(error);
            res.status(500).json({ message: "Error creating new user", error });
        } else {
            res.locals.insertedRow = results.insertId; // get ID of the new user
            next();
        }
    });
};

// print user details
module.exports.printUserDetails = (req, res) => {
    const userId = res.locals.insertedRow; // get the ID from previous middleware

    model.getUserDetails(userId, (error, results) => {
        if (error) {
            console.error(error);
            res.status(500).json({ message: "Error printing user details" });
        } else {
            if (results[0].points === null) {
                results[0].points = 0; // set points to 0 instead of null
            }
            res.status(201).json(results[0]);
        }
    });
};

// ================================= question 2 =========================================
// get all users from database
module.exports.getUsers = (req, res) => {
    model.getAllUsers((error, results) => {
        if (error) {
            console.error(error);
            res.status(500).json({ message: "Error retrieving all users" });
        } else {
            results.forEach(user => {
                if (user.points === null) {
                    user.points = 0; // change null to 0 if points == null
                }
            });
            res.status(200).json(results);
        }
    });
};

// ================================= question 3 =========================================
// check number of completed questions
module.exports.checkCompletedQns = (req, res, next) => {
    const participantId = req.params.user_id;

    model.checkNoOfQnsAnswered(participantId, (error, results) => {
        if (error) {
            console.error(error);
            res.status(500).json({ message: "Error checking number of questions answered" });
        } else {
            res.locals.participant_id = results.length || 0;
            next();
        }
    });
};

// get user information and number of completed questions
module.exports.getUserInfoNCompletedQns = (req, res) => {
    const userInfo = res.locals.userInfo[0]; // from checkUserIDExist
    const completedQn = res.locals.participant_id; // from checkCompletedQns

    if (userInfo.points === null) {
        userInfo.points = 0; // set points to 0 instead of null
    }

    const final = {
        user_id: userInfo.user_id,
        username: userInfo.username,
        completed_questions: completedQn,
        points: userInfo.points,
    };

    res.status(200).json(final);
};

// ================================= question 4 =========================================
// update username
module.exports.updateUsername = (req, res, next) => {
    const userId = req.params.user_id;
    const username = req.body.username;

    model.insertSingle(userId, username, (error, results) => {
        if (error) {
            console.error(error);
            res.status(500).json({ message: `Error updating user ${userId} name` });
        } else {
            res.locals.insertedRow = results.insertId; // get the row number of newly inserted request
            next();
        }
    });
};

// print user details 
module.exports.printUserDetailsQn4 = (req, res) => {
    const userId = req.params.user_id;

    model.getUserDetails(userId, (error, results) => {
        if (error) {
            console.error(error);
            res.status(500).json({ message: "Error printing user details" });
        } else {
            if (results[0].points === null) {
                results[0].points = 0; // set points to 0 instead of null
            }
            res.status(200).json(results[0]);
        }
    });
};
