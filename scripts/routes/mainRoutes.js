const express = require("express");

const router = express.Router();

const questionsRoutes = require("./questionsRoutes");
const userRoutes = require("./userRoutes");


router.use("/users", userRoutes);
router.use("/questions", questionsRoutes)

module.exports = router;