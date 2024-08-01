const model = require("../models/userModels");
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const db = require('../database/db');
const { body, validationResult } = require('express-validator');

// Validation middleware for registration
exports.validateRegistration = [
    body('username').isLength({ min: 5 }).withMessage('Username must be at least 5 characters long'),
    body('password').isLength({ min: 5 }).withMessage('Password must be at least 5 characters long'),
    (req, res, next) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        next();
    }
];
// Check if username exists
exports.checkUsernameExist = (req, res, next) => {
    const username = req.body.username;
    if (!username) {
        return res.status(400).json({ message: "Username is undefined" });
    }
    model.checkIfUsernameExist(username, (error, results) => {
        if (error) {
            console.error(error);
            return res.status(500).json({ message: "Error checking duplicated username" });
        } else if (results.length > 0) {
            return res.status(409).json({ message: "Username is associated with other users" });
        } else {
            next();
        }
    });
};


// Register user
// Register user
exports.register = async (req, res) => {
    try {
        const { username, password, email } = req.body;

        // Check if the username already exists
        const existingUser = await model.checkIfUsernameExist(username);
        if (existingUser.length > 0) {
            return res.status(409).json({ message: 'Username already taken' });
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = { username, password: hashedPassword, email };
        await model.createUser(newUser);
        res.status(201).json({ message: 'User registered successfully' });
    } catch (error) {
        console.error('Error registering new user:', error);
        res.status(500).json({ message: 'Error registering new user' });
    }
};
exports.login = async (req, res) => {
    try {
        const { username, password } = req.body;
        const user = await model.findUserByUsername(username);

        if (user && await bcrypt.compare(password, user.password)) {
            const token = jwt.sign({ userId: user.user_id, username: user.username }, process.env.JWT_SECRET, { expiresIn: '1h' });
            res.status(200).json({ token });
        } else {
            res.status(401).json({ message: 'Invalid credentials' });
        }
    } catch (error) {
        console.error('Error during user login:', error);
        res.status(500).json({ message: 'Error during user login' });
    }
};

// Check if user ID exists in database
exports.checkUserIDExist = (req, res, next) => {
    const userId = req.params.user_id;
    if (isNaN(userId)) {
        return res.status(400).json({ message: 'User ID needs to be a number' });
    }
    model.checkUserExistId(userId, (error, results) => {
        if (error) {
            console.error(error);
            return res.status(500).json({ message: "Error checking if user ID exists" });
        } else if (results.length === 0) {
            return res.status(404).json({ message: 'User ID not found' });
        } else {
            res.locals.userInfo = results;
            next();
        }
    });
};

// Create the user
exports.createUser = (req, res, next) => {
    const username = req.body.username;
    model.creatingNewUser(username, (error, results) => {
        if (error) {
            console.error(error);
            res.status(500).json({ message: "Error creating new user" });
        } else {
            res.locals.insertedRow = results.insertId; // get ID of the new user
            next();
        }
    });
};

// Print user details
exports.printUserDetails = (req, res) => {
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


exports.getUsers = (req, res) => {
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
// Get user count
exports.getUserCount = (req, res) => {
    model.getUserCount((error, results) => {
        if (error) {
            console.error('Error retrieving user count:', error);
            res.status(500).json({ message: 'Error retrieving user count' });
        } else {
            res.status(200).json({ userCount: results[0].count });
        }
    });
};

// Check number of completed questions
exports.checkCompletedQns = (req, res, next) => {
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

// Get user information and number of completed questions
exports.getUserInfoNCompletedQns = (req, res) => {
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

// Update username
exports.updateUsername = (req, res, next) => {
    const userId = req.params.user_id;
    const username = req.body.username;
    model.updateUserUsername(userId, username, (error, results) => {
        if (error) {
            console.error(error);
            res.status(500).json({ message: `Error updating user ${userId} name` });
        } else {
            next(); // Proceed to print updated user details
        }
    });
};

// Print user details after update
exports.printUserDetailsQn4 = (req, res) => {
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

// Fetch logged-in user details
exports.getMe = (req, res) => {
    if (!req.session.user_id) {
        return res.status(401).json({ message: 'Not authenticated' });
    }

    const query = 'SELECT user_id, username FROM User WHERE user_id = ?';
    db.query(query, [req.session.user_id], (error, results) => {
        if (error) {
            console.error('Error fetching user details:', error);
            return res.status(500).json({ message: 'Internal server error', error });
        }

        if (results.length === 0) {
            return res.status(404).json({ message: 'User not found' });
        }

        return res.status(200).json(results[0]);
    });
};
exports.getQuestCount = (req, res) => {
    model.getQuestCount((error, results) => {
        if (error) {
            console.error('Error retrieving quest count:', error);
            res.status(500).json({ message: 'Error retrieving quest count' });
        } else {
            res.status(200).json({ questCount: results[0].count });
        }
    });
};
exports.login = (req, res) => {
    const { username, password } = req.body;

    if (!username || !password) {
        return res.status(400).json({ message: 'All fields are required' });
    }

    const query = 'SELECT user_id, username, password FROM User WHERE username = ?';
    db.query(query, [username], async (error, results) => {
        if (error) {
            console.error('Error querying user:', error);
            return res.status(500).json({ message: 'Internal server error', error });
        }

        if (results.length === 0) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }

        const user = results[0];
        const isMatch = await bcrypt.compare(password, user.password);

        if (!isMatch) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }

        // Generate a JWT token
        const token = jwt.sign({ user_id: user.user_id, username: user.username }, process.env.JWT_SECRET, { expiresIn: '1h' });

        // Set session data
        req.session.user_id = user.user_id;
        req.session.username = user.username;

        return res.status(200).json({ message: 'Login successful', token });
    });
};
