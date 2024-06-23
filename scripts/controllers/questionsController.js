// REQUIRE MODULES
const model = require("../models/questionsModels");

// Print survey questions -- used in qns 5 & 7
module.exports.printSurveryQuestion = (req, res, next) => {
    const qnsId = res.locals.qnsId;
    model.getSurveyQnsDetails(qnsId, (error, results) => {
        if (error) {
            console.error(error);
            res.status(500).json({ message: "Error printing survey questions details" });
        } else {
            res.status(201).json(results);
        }
    });
};

// Check if user exists  
module.exports.checkUserIDExist = (req, res, next) => {
    const userId = req.body.user_id;
    if (!userId) {
        return res.status(400).json({ message: "User id cannot be empty" });
    } else if (isNaN(userId)) {
        return res.status(400).json({ message: "User id needs to be a number" });
    }

    model.checkUserIdExist(userId, (error, results) => {
        if (error) {
            console.log(error);
            res.status(500).json({ message: "Error checking user id exist", error });
        } else if (results.length === 0) {
            res.status(404).json({ message: "User id does not exist" });
        } else {
            next();
        }
    });
};

// Check if question id exists 
module.exports.checkQnsIdExist = (req, res, next) => {
    const qnsId = req.params.question_id;

    if (isNaN(qnsId)) {
        return res.status(400).json({ message: "Question id needs to be a number" });
    }

    model.checkQuestionIdExist(qnsId, (error, results) => {
        if (error) {
            console.log(error);
            res.status(500).json({ message: "Error getting questions details" });
        } else if (results.length === 0) {
            res.status(404).json({ message: "Question id not found" });
        } else {
            res.locals.userId = results[0].creator_id;
            res.locals.qnsId = results[0].question_id;
            next();
        }
    });
};


// Create new question
module.exports.createQuestion = (req, res, next) => {
    const { question: qns, user_id: userId } = req.body;
    if (!qns || !userId) {
        return res.status(400).json({ message: "Error: Question and user id are required" });
    }

    model.createNewQns(qns, userId, (error, results) => {
        if (error) {
            console.error(error);
            res.status(500).json({ message: "Error posting question" });
        } else {
            res.locals.qnsId = results.insertId;
            next();
        }
    });
};

// Get all questions from database
module.exports.getQuestions = (req, res) => {
    model.getAllQuestions((error, results) => {
        if (error) {
            console.error(error);
            res.status(500).json({ message: "Error retrieving all questions" });
        } else {
            res.status(200).json(results);
        }
    });
};

// Check if user and questions are associated
module.exports.checkIfUsernQnsAreAssociated = (req, res, next) => {
    const { user_id: userId } = req.body;
    const qnsId = req.params.question_id;

    if (!userId) {
        return res.status(400).json({ message: "User id is undefined" });
    } else if (isNaN(userId)) {
        return res.status(400).json({ message: "User id needs to be a number" });
    }

    model.checkUsernQnsAssociate(userId, qnsId, (error, results) => {
        if (error) {
            console.error(error);
            res.status(500).json({ message: "Error retrieving questions and user" });
        } else if (results.length === 0) {
            res.status(403).json({ message: "Question and user not associated" });
        } else {
            res.locals.qnsId = qnsId;
            next();
        }
    });
};

// Update the question
module.exports.updateQns = (req, res, next) => {
    const { question: updateDetails, user_id: userId } = req.body;
    const qnsId = req.params.question_id;
    if (!updateDetails) {
        return res.status(400).json({ message: "Question to update is undefined" });
    }

    model.updateQnsUsingId(userId, qnsId, updateDetails, (error) => {
        if (error) {
            console.error(error);
            res.status(500).json({ message: "Error updating questions" });
        } else {
            next();
        }
    });
};

// Check if question is associated with user answer
module.exports.checkUserAnswerTable = (req, res, next) => {
    const { userId, qnsId } = res.locals;

    model.checkUserAnswerDatabase(userId, qnsId, (error, results) => {
        if (error) {
            console.error(error);
            res.status(500).json({ message: "Error checking UserAnswer database" });
        } else if (results.length === 0) {
            res.locals.answerId = 0;
            next();
        } else {
            res.locals.answerId = results[0].answer_id;
            next();
        }
    });
};

// Delete response
module.exports.deleteUserAnswer = (req, res, next) => {
    const answerId = res.locals.answerId;
    if (answerId === 0) {
        next(); // No responses to delete in UserAnswer database
    } else {
        model.deleteUserAnswerViaId(answerId, (error) => {
            if (error) {
                console.error(error);
                res.status(500).json({ message: "Error deleting from UserAnswer" });
            } else {
                next();
            }
        });
    }
};

// Delete the question
module.exports.deleteQns = (req, res) => {
    const qnsId = res.locals.qnsId;

    model.deleteSpecificQns(qnsId, (error) => {
        if (error) {
            console.error(error);
            res.status(500).json({ message: "Error deleting question" });
        } else {
            res.status(204).send();
        }
    });
};

// Create the answer
module.exports.createAnswer = (req, res, next) => {
    const data = {
        qnsId: req.params.question_id,
        userId: req.body.user_id,
        answer: req.body.answer,
        creation_date: req.body.creation_date,
        notes: req.body.additional_notes
    };

    // Validation for answer
    if (!data.answer) {
        return res.status(400).json({ message: "Answer cannot be empty" });
    }

    // Validation for creation_date
    if (!data.creation_date) {
        return res.status(400).json({ message: "Creation date cannot be empty" });
    }

    model.createAnswerviaQnsId(data, (error, results) => {
        if (error) {
            console.error(error);
            res.status(500).json({ message: "Error posting answer" });
        } else {
            res.locals.insertId = results.insertId;
            next();
        }
    });
};

// Print the user answer
module.exports.printAnswer = (req, res, next) => {
    const answerId = res.locals.insertId;
    model.printAnswerviaId(answerId, (error, results) => {
        if (error) {
            console.error(error);
            res.status(500).json({ message: "Error printing UserAnswer" });
        } else if (results.length === 0) {
            res.status(404).json({ message: "Error printing UserAnswer via insertid" });
        } else {
            results.forEach(result => {
                result.answer = result.answer === 1;
                result.additional_notes = result.additional_notes || "";
            });
            res.status(201).json(results);
            res.locals.userId = results[0].participant_id;
            next();
        }
    });
};

module.exports.addPoints = (req, res) => {
    const userId = res.locals.userId;
    model.adding5Points(userId, (error, results) => {
        if (error) {
            console.error(error);
            res.status(500).json({ message: "Error adding points to user" });
        } else {
            console.log(results);
        }
    });
};


// Retrieve answers given by participant 
module.exports.getQuestionswAnswers = (req, res) => {
    const qnsId = req.params.question_id;
    model.getQuestionswAnswers(qnsId, (error, results) => {
        if (error) {
            console.error(error);
            res.status(500).json({ message: "Error checking if question is answered by users" });
        } else if (results.length === 0) {
            res.status(404).json({ message: "Question was not answered by any user" });
        } else {
            results.forEach(result => {
                result.additional_notes = result.additional_notes || "";
            });
            res.status(200).json(results);
        }
    });
};
