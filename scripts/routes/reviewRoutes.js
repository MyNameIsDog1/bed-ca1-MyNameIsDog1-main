const express = require('express');
const router = express.Router();
const reviewController = require('../controllers/reviewController');
const reviewModel = require('../models/reviewModel'); // Import the reviewModel

// Middleware to check if the user is the owner of the review
function isReviewOwner(req, res, next) {
    const data = { id: req.params.id };
    reviewModel.selectById(data, (error, results) => { // Use reviewModel
        if (error) {
            console.error("Error isReviewOwner:", error);
            return res.status(500).json({ message: 'Internal server error', error });
        }
        if (results.length === 0 || results[0].user_id !== req.session.user_id) {
            return res.status(403).send("Error: User is not authorized to modify this review");
        }
        next();
    });
}

router.get('/', reviewController.readAllReview);
router.get('/:id', reviewController.readReviewById);
router.post('/', reviewController.createReview);
router.put('/:id', isReviewOwner, reviewController.updateReviewById);
router.delete('/:id', isReviewOwner, reviewController.deleteReviewById);
router.get('/counts', reviewController.getReviewCounts);

module.exports = router;
