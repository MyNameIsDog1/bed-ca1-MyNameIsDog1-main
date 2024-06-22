const pool = require("../database/db");

const SQLSTATEMENT = `
    -- Drop tables in the correct order
    DROP TABLE IF EXISTS PetQuests;
    DROP TABLE IF EXISTS Rewards;
    DROP TABLE IF EXISTS UserAnswer;
    DROP TABLE IF EXISTS SurveyQuestion;
    DROP TABLE IF EXISTS Pets;
    DROP TABLE IF EXISTS User;

    -- Create User table
    CREATE TABLE User (
        user_id INT AUTO_INCREMENT PRIMARY KEY,
        username TEXT,
        points INT
    );

    -- Create Pets table
    CREATE TABLE Pets (
        pet_id INT AUTO_INCREMENT PRIMARY KEY,
        owner_id INT NOT NULL,
        name VARCHAR(255) NOT NULL,
        breed VARCHAR(255),
        health INT DEFAULT 100,
        happiness INT DEFAULT 100,
        points INT DEFAULT 0,
        FOREIGN KEY (owner_id) REFERENCES User(user_id)
    );

    -- Create PetQuests table
    CREATE TABLE PetQuests (
        quest_id INT AUTO_INCREMENT PRIMARY KEY,
        pet_id INT NOT NULL,
        description TEXT NOT NULL,
        status VARCHAR(255) DEFAULT 'pending',
        reward_points INT NOT NULL,
        FOREIGN KEY (pet_id) REFERENCES Pets(pet_id)
    );

    -- Create Rewards table
    CREATE TABLE Rewards (
        reward_id INT AUTO_INCREMENT PRIMARY KEY,
        pet_id INT NOT NULL,
        reward_description TEXT NOT NULL,
        points INT NOT NULL,
        date_awarded TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (pet_id) REFERENCES Pets(pet_id)
    );

    -- Create SurveyQuestion table
    CREATE TABLE SurveyQuestion (
        question_id INT AUTO_INCREMENT PRIMARY KEY,
        creator_id INT NOT NULL,
        question TEXT NOT NULL
    );

    -- Create UserAnswer table
    CREATE TABLE UserAnswer (
        answer_id INT AUTO_INCREMENT PRIMARY KEY,
        answered_question_id INT NOT NULL,
        participant_id INT NOT NULL,
        answer BOOL NOT NULL,
        creation_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        additional_notes TEXT
    );

    -- Insert initial data into SurveyQuestion table
    INSERT INTO SurveyQuestion (question_id, creator_id, question) VALUES
    (1, 1, 'Do you buy fruits from FC6?'),
    (2, 1, 'Is the fried chicken at FC5 salty?'),
    (3, 2, 'Did you recycle any e-waste?'),
    (4, 2, 'Do you turn off lights and appliances when not in use?'),
    (5, 2, 'Have you visited the cafe at Moberly?');
`;

pool.query(SQLSTATEMENT, (error, results, fields) => {
    if (error) {
        console.error("Error creating tables: ", error);
    } else {
        console.log("Tables created successfully: ", results);
    }
    process.exit();
});