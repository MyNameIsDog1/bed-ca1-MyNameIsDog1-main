// INCLUDES
const express = require("express");

// CREATE APP
const app = express();

// USES
app.use(express.json());
app.use(express.urlencoded({extended:false}));

// SETUP ROUTES
const mainRoutes = require('./routes/mainRoutes');
const petRoutes = require('./routes/petRoutes');  // Include pet routes
const userRoutes = require('./routes/userRoutes');
const questRoutes = require('./routes/questRoutes');  // Include quest routes

// SETUP STATIC FILES
app.use("/", mainRoutes);
app.use("/", petRoutes);  // Use pet routes
app.use("/", userRoutes);  // Use user routes
app.use("/", questRoutes);  // Use quest routes
// EXPORT APP
module.exports = app;
