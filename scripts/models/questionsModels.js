const pool = require("../database/db");

// =============================== repeated SQL =========================================
// get details from Survey Question database -- qns 5 & 7
module.exports.getSurveyQnsDetails = (qnsId, callback) => {
    const SQL = `
        SELECT question_id, question, creator_id 
        FROM SurveyQuestion
        WHERE question_id = ?`;
    const VALUES = [qnsId];
    pool.query(SQL, VALUES, callback);
};

// check if question ID exists in Survey Question database -- qns 7 & 8 & 9
module.exports.checkQuestionIdExist = (qnsId, callback) => {
    const SQL = `
        SELECT * FROM SurveyQuestion
        WHERE question_id = ?`;
    const VALUES = [qnsId];
    pool.query(SQL, VALUES, callback);
};

// ================================= question 5 =========================================
// post new question in Survey Question database
module.exports.createNewQns = (qns, userId, callback) => {
    const SQL = `
        INSERT INTO SurveyQuestion (creator_id, question)
        VALUES (?, ?)`;
    const VALUES = [userId, qns];
    pool.query(SQL, VALUES, callback);
};

// ================================= question 6 =========================================
// get all questions from Survey Question database
module.exports.getAllQuestions = (callback) => {
    const SQL = `
        SELECT question_id, question, creator_id
        FROM SurveyQuestion`;
    pool.query(SQL, callback);
};

// ================================= question 7 =========================================
// check if user and questions are associated in Survey Question database
module.exports.checkUsernQnsAssociate = (userId, qnsId, callback) => {
    const SQL = `
        SELECT * FROM SurveyQuestion
        WHERE question_id = ? AND creator_id = ?`;
    const VALUES = [qnsId, userId];
    pool.query(SQL, VALUES, callback);
};

// update questions using question ID in Survey Question database
module.exports.updateQnsUsingId = (userId, qnsId, updateDetails, callback) => {
    const SQL = `
        UPDATE SurveyQuestion
        SET question = ?
        WHERE question_id = ? AND creator_id = ?`;
    const VALUES = [updateDetails, qnsId, userId];
    pool.query(SQL, VALUES, callback);
};

// ================================= question 8 =========================================
// check if user answered the specific question
module.exports.checkUserAnswerDatabase = (userId, qnsId, callback) => {
    const SQL = `
        SELECT * FROM UserAnswer
        WHERE answered_question_id = ? AND participant_id = ?`;
    const VALUES = [qnsId, userId];
    pool.query(SQL, VALUES, callback);
};

// delete the response from UserAnswer
module.exports.deleteUserAnswerViaId = (answerId, callback) => {
    const SQL = `
        DELETE FROM UserAnswer
        WHERE answer_id = ?`;
    const VALUES = [answerId];
    pool.query(SQL, VALUES, callback);
};

// delete the question in SurveyQuestion
module.exports.deleteSpecificQns = (qnsId, callback) => {
    const SQL = `
        DELETE FROM SurveyQuestion
        WHERE question_id = ?`;
    const VALUES = [qnsId];
    pool.query(SQL, VALUES, callback);
};

// ================================= question 9 =========================================
// check if user exists in User
module.exports.checkUserIdExist = (userId, callback) => {
    const SQL = `
        SELECT * FROM User
        WHERE user_id = ?`;
    const VALUES = [userId];
    pool.query(SQL, VALUES, callback);
};

// post the answers into UserAnswer
module.exports.createAnswerviaQnsId = (data, callback) => {
    const SQL = `
        INSERT INTO UserAnswer (answered_question_id, participant_id, answer, creation_date, additional_notes)
        VALUES (?, ?, ?, ?, ?)`;
    const VALUES = [data.qnsId, data.userId, data.answer, data.creation_date, data.notes];
    pool.query(SQL, VALUES, callback);
};

// print the answers given by user
module.exports.printAnswerviaId = (answerId, callback) => {
    const SQL = `
        SELECT * FROM UserAnswer
        WHERE answer_id = ?`;
    const VALUES = [answerId];
    pool.query(SQL, VALUES, callback);
};

// add 5 points to the user who answered
module.exports.adding5Points = (userId, callback) => {
    const SQL = `
        UPDATE User
        SET points = IFNULL(points, 0) + 5
        WHERE user_id = ?`;
    const VALUES = [userId];
    pool.query(SQL, VALUES, callback);
};

// ================================= question 10 =========================================
// get the specific question's answers
module.exports.getQuestionswAnswers = (qnsId, callback) => {
    const SQL = `
        SELECT participant_id, answer, creation_date, additional_notes 
        FROM UserAnswer 
        WHERE answered_question_id = ?`;
    const VALUES = [qnsId];
    pool.query(SQL, VALUES, callback);
};
