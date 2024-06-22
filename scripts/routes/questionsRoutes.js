// REQUIRE EXPRESS
const express = require("express");

//CREATE ROUTER
const router = express.Router();

// REQURIE CONTROLLER
const questionsController = require("../controllers/questionsController");

// ALL ROUTES
// section A (5) 
router.post("/", questionsController.checkUserIDExist, questionsController.createQuestion, questionsController.printSurveryQuestion);
// section A (6)
router.get("/", questionsController.getQuestions);
// section A (7) 
router.put("/:question_id", questionsController.checkQnsIdExist, questionsController.checkIfUsernQnsAreAssociated, questionsController.updateQns, questionsController.printSurveryQuestion);
// section A (8)
router.delete("/:question_id", questionsController.checkQnsIdExist, questionsController.checkUserAnswerTable, questionsController.deleteUserAnswer, questionsController.deleteQns);
// section A (9)
router.post("/:question_id/answers", questionsController.checkQnsIdExist, questionsController.checkUserIDExist, questionsController.createAnswer, questionsController.printAnswer, questionsController.addPoints); 
// section A (10)
router.get("/:question_id/answers", questionsController.checkQnsIdExist, questionsController.getQuestionswAnswers);
 
// EXPORT ROUTER
module.exports = router;
