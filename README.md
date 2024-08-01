# Starter Repository for Assignment
You are required to build your folder structures for your project.

installed nodemon ,express,mysql,dotenv

Scripts { 
    "test": "echo \"Error: no test specified\" && exit 1",
    "init_tables": "node scripts/1tables/initTables.js",
    "app" : "node src/app.js",
    "index" : "node index.js",
    "start" : "npm run index",
    "dev" : "nodemon index"
}

Run post man and run current code using npm run dev or npm run start
set postman to post and place http://localhost:3000/pets 
in the body u can use this as an example
{
    "owner_id": 1,
    "name": "Fluffy",
    "breed": "Golden Retriever",
    "health": 100,
    "happiness": 100
}
create a pet quest 
set to POST
http://localhost:3000/pet-quests
{
    "pet_id": 1,
    "description": "Find the hidden bone",
    "reward_points": 10
}
put this in the body
get quests
http://localhost:3000/pet-quests/1

Complete quests
seth method to post
http://localhost:3000/pet-quests/1/complete

get rewards
seth method to get
http://localhost:3000/rewards/1
