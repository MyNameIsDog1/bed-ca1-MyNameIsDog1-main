const express = require('express');
const session = require('express-session');
const bodyParser = require('body-parser');
const path = require('path');
const mainRoutes = require('./routes/mainRoutes');
const userRoutes = require('./routes/userRoutes');
const petRoutes = require('./routes/petRoutes');
const questRoutes = require('./routes/questRoutes');
const storeRoutes = require('./routes/storeRoutes'); // Add store routes

const app = express();

// Middleware setup
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Session setup
app.use(session({
    secret: 'darell', // Change this to a strong secret
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false } // Set to true if using HTTPS
}));

// Serve static files from the public directory
app.use(express.static(path.join(__dirname, '../public')));

// Use routes
app.use('/', mainRoutes);
app.use('/users', userRoutes);
app.use('/pets', petRoutes);
app.use('/quests', questRoutes);
app.use('/store', storeRoutes); // Add store routes

// Error handling middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ message: 'Something broke!', error: err });
});

module.exports = app;
