require('dotenv').config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require('cors');
const userRoutes = require('./routes/user');
const testRoutes = require('./routes/test');

const dbUrl = process.env.DB_URL || 'mongodb://localhost:27017/mindmeld';
const port = process.env.PORT || 3000;

mongoose.connect(dbUrl)
    .then(() => console.log("Connected to MongoDB successfully"))
    .catch((err) => {
        console.error("MongoDB connection error:", err);
        process.exit(1);
    });

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use('/api/users', userRoutes);
app.use('/api/tests', testRoutes);

app.get("/", (req, res) => {
    res.status(200).json({ message: "MindMeld API is running" });
});

// Error handling middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ error: 'Something broke!' });
});

// 404 handler
app.use((req, res) => {
    res.status(404).json({ error: 'Route not found' });
});

app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});