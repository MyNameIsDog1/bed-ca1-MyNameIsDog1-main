const express = require('express');
const router = express.Router();

const petRoutes = require('./petRoutes');
const userRoutes = require('./userRoutes');
const questRoutes = require('./questRoutes');
const reviewRoutes = require('./reviewRoutes'); // Include reviewRoutes

router.use("/pets", petRoutes);
router.use("/users", userRoutes);
router.use("/quests", questRoutes);
router.use("/api/reviews", reviewRoutes); // Mount review routes

module.exports = router;
