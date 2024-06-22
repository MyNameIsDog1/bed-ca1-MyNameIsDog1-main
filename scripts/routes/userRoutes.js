// REQUIRE EXPRESS
const express = require("express");

// CREATE ROUTER
const router = express.Router();

// REQUIRE CONTROLLER
const userController = require("../controllers/userController");

//ALL ROUTES
// section A (1) 
router.post("/", userController.checkUsernameExist, userController.createUser, userController.printUserDetails); 
// section A (2)
router.get("/", userController.getUsers); 
// section A (3)
router.get("/:user_id", userController.checkUserIDExist, userController.checkCompletedQns, userController.getUserInfoNCompletedQns);
// section A (4)
router.put("/:user_id", userController.checkUserIDExist, userController.checkUsernameExist, userController.updateUsername, userController.printUserDetailsQn4); 

// EXPORT ROUTER
module.exports = router