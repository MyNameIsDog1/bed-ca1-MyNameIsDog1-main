const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const jwt = require('jsonwebtoken');
const questController = require('../controllers/questController'); // Add this line to import questController
// JWT authentication middleware
function authenticateToken(req, res, next) {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN

    if (!token) {
        return res.status(401).json({ message: 'Authentication token is missing!' });
    }

    jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
        if (err) {
            return res.status(403).json({ message: 'Invalid token!' });
        }
        req.user = user;
        next();
    });
}
router.get('/count', userController.getUserCount);
// Registration route with validation and rate limiting
router.post('/register', userController.validateRegistration, userController.register);

// Login route with rate limiting
router.post('/login', userController.login);

// Fetch user details route
router.get('/me', authenticateToken, userController.getMe);

// Fetching all users requires authentication
router.get('/', authenticateToken, userController.getUsers);

// Fetching and updating specific user data requires authentication and checks for existing userID
router.get('/:user_id', authenticateToken, userController.checkUserIDExist, userController.getUserInfoNCompletedQns);
router.put('/:user_id', authenticateToken, userController.checkUserIDExist, userController.updateUsername);
router.get('/users', userController.getUsers);

// New count routes
router.get('/users/count', userController.getUserCount);
router.get('/quests/count', questController.getQuestCount);
// Export router
module.exports = router;
