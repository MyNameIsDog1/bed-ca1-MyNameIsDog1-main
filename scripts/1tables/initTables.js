const pool = require('../database/db');

const SQLSTATEMENT = `
    -- Drop tables in the correct order
    DROP TABLE IF EXISTS Reviews;
    DROP TABLE IF EXISTS PetQuests;
    DROP TABLE IF EXISTS Rewards;
    DROP TABLE IF EXISTS UserAnswer;
    DROP TABLE IF EXISTS SurveyQuestion;
    DROP TABLE IF EXISTS StorePurchases;
    DROP TABLE IF EXISTS Pets;
    DROP TABLE IF EXISTS User;

    -- Create User table
    CREATE TABLE User (
        user_id INT AUTO_INCREMENT PRIMARY KEY,
        username VARCHAR(255) NOT NULL,
        password VARCHAR(255) NOT NULL,
        points INT DEFAULT 0
    );

    -- Create Pets table
    CREATE TABLE Pets (
        pet_id INT AUTO_INCREMENT PRIMARY KEY,
        owner_id INT NOT NULL,
        name VARCHAR(255) NOT NULL,
        breed VARCHAR(255),
        health INT DEFAULT 40,
        happiness INT DEFAULT 40,
        points INT DEFAULT 0,
        FOREIGN KEY (owner_id) REFERENCES User(user_id)
    );

    -- Create StorePurchases table
    CREATE TABLE StorePurchases (
        id INT AUTO_INCREMENT PRIMARY KEY,
        pet_id INT,
        item VARCHAR(255),
        cost INT,
        purchase_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (pet_id) REFERENCES Pets(pet_id)
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
        question TEXT NOT NULL,
        FOREIGN KEY (creator_id) REFERENCES User(user_id)
    );

    -- Create UserAnswer table
    CREATE TABLE UserAnswer (
        answer_id INT AUTO_INCREMENT PRIMARY KEY,
        answered_question_id INT NOT NULL,
        participant_id INT NOT NULL,
        answer BOOL NOT NULL,
        creation_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        additional_notes TEXT,
        FOREIGN KEY (answered_question_id) REFERENCES SurveyQuestion(question_id),
        FOREIGN KEY (participant_id) REFERENCES User(user_id)
    );

    -- Create Reviews table
    CREATE TABLE Reviews (
        id INT AUTO_INCREMENT PRIMARY KEY,
        review_amt INT NOT NULL,
        user_id INT NOT NULL,
        comment TEXT NOT NULL,
        username VARCHAR(255) NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES User(user_id)
    );

    -- Insert initial data into User table
    INSERT INTO User (username, password) VALUES
    ('user1', 'password1'),
    ('user2', 'password2'),
    ('user3', 'password3');

    -- Insert initial data into SurveyQuestion table
    INSERT INTO SurveyQuestion (creator_id, question) VALUES
    (1, 'Do you buy fruits from FC6?'),
    (1, 'Is the fried chicken at FC5 salty?'),
    (2, 'Did you recycle any e-waste?'),
    (2, 'Do you turn off lights and appliances when not in use?'),
    (2, 'Have you visited the cafe at Moberly?');

    -- Insert initial data into Reviews table
    INSERT INTO Reviews (review_amt, user_id, comment, username) VALUES
    (5, 1, 'Great service!', 'user1'),
    (4, 2, 'Good quality', 'user2'),  
    (3, 3, 'Average experience', 'user3');
`;

pool.query(SQLSTATEMENT, (error, results, fields) => {
    if (error) {
        console.error("Error creating tables:", error);
    } else {
        console.log("Tables created successfully");
    }
    process.exit();
});
