const express = require('express');
const router = express.Router();
const { auth } = require('../middleware/auth');
const validate = require('../middleware/validate');
const UserController = require('../controllers/userController');
const User = require('../models/user');

// Auth Routes (Public)
router.post('/register', validate.registration, UserController.registerUser);
router.post('/login', validate.login, UserController.loginUser);

// Profile Routes (Protected)
router.get('/profile', auth, UserController.getUserProfile);

// Progress Routes (Protected)
router.post('/progress/update', auth, validate.progress, UserController.updateProgress);

// Streak Routes (Protected)
router.put('/streak', auth, UserController.updateStreak);
router.get('/streak', auth, async (req, res) => {
    const user = await User.findById(req.user.userId);
    res.json({ streak: user.streak });
});

// Skill Routes (Protected)
router.get('/skills', auth, async (req, res) => {
    const user = await User.findById(req.user.userId);
    res.json({ skillTree: user.skillTree });
});
router.put('/skills', auth, validate.skillUpdate, UserController.updateSkills);

module.exports = router;