const User = require('../models/user');
const Performance = require('../models/performance');
const Leaderboard = require('../models/leaderboard');
const Achievement = require('../models/achievement');
const Challenge = require('../models/challenge');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const UserController = {
    // AUTH CONTROLLERS
    async registerUser(req, res) {
        try {
            const { username, email, password, age, occupation, goals } = req.body;
            const userExists = await User.findOne({ $or: [{ email }, { username }] });
            if (userExists) {
                return res.status(400).json({ message: "User already exists" });
            }

            const hashedPassword = await bcrypt.hash(password, 10);
            const user = await User.create({
                username,
                email,
                password: hashedPassword,
                age,
                occupation,
                goals,
                lastActiveDate: new Date()
            });

            // Create initial leaderboard entry
            await Leaderboard.create({
                userId: user._id,
                username: user.username,
                xp: 0,
                streak: 0,
                rank: 0
            });

            res.status(201).json({ message: "Registration successful" });
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    },

    async loginUser(req, res) {
        try {
            const { email, password } = req.body;
            const user = await User.findOne({ email });
            if (!user || !await bcrypt.compare(password, user.password)) {
                return res.status(401).json({ message: "Invalid credentials" });
            }

            const token = jwt.sign(
                { userId: user._id },
                process.env.JWT_SECRET,
                { expiresIn: '7d' }
            );

            // Update last active date
            await User.findByIdAndUpdate(user._id, { lastActiveDate: new Date() });

            res.json({ token, userId: user._id });
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    },

    // PROFILE CONTROLLERS
    async getUserProfile(req, res) {
        try {
            const user = await User.findById(req.user.userId)
                .select('-password')
                .lean();

            const performance = await Performance.find({ userId: req.user.userId })
                .sort({ date: -1 })
                .limit(10);

            const achievements = await Achievement.find({ userId: req.user.userId });
            const activeChallenges = await Challenge.find({
                participants: req.user.userId,
                endDate: { $gte: new Date() }
            });

            res.json({
                ...user,
                recentPerformance: performance,
                achievements,
                activeChallenges
            });
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    },

    // PROGRESS CONTROLLERS
    async updateProgress(req, res) {
        try {
            const { testType, score, timeTaken } = req.body;
            const user = await User.findById(req.user.userId);

            // Calculate rewards
            const xpEarned = Math.floor(score * 1.5);
            const coinsEarned = Math.floor(score * 0.5);

            // Update user stats
            user.xp += xpEarned;
            user.coins += coinsEarned;
            user.performance[testType].push({ date: new Date(), score });

            // Level up check
            if (user.xp >= user.level * 100) {
                user.level += 1;
                await Achievement.create({
                    userId: user._id,
                    badge: `Level ${user.level}`,
                    description: `Reached level ${user.level}!`
                });
            }

            // Record performance
            await Performance.create({
                userId: user._id,
                testType,
                score,
                timeTaken,
                xpEarned,
                coinsEarned
            });

            // Update leaderboard
            await Leaderboard.findOneAndUpdate(
                { userId: user._id },
                { xp: user.xp, streak: user.streak }
            );

            await user.save();
            res.json({
                xp: user.xp,
                level: user.level,
                coins: user.coins,
                xpEarned,
                coinsEarned
            });
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    },

    // STREAK CONTROLLERS
    async updateStreak(req, res) {
        try {
            const user = await User.findById(req.user.userId);
            const today = new Date().toDateString();
            const lastActive = user.lastActiveDate?.toDateString();

            if (today === lastActive) {
                return res.json({ streak: user.streak });
            }

            const yesterday = new Date();
            yesterday.setDate(yesterday.getDate() - 1);
            const isConsecutive = lastActive === yesterday.toDateString();

            user.streak = isConsecutive ? user.streak + 1 : 1;
            user.lastActiveDate = new Date();

            // Streak achievements
            if (user.streak % 7 === 0) {
                await Achievement.create({
                    userId: user._id,
                    badge: `${user.streak} Day Streak`,
                    description: `Maintained a ${user.streak} day streak!`
                });
            }

            await user.save();
            await Leaderboard.findOneAndUpdate(
                { userId: user._id },
                { streak: user.streak }
            );

            res.json({ streak: user.streak });
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    },

    // SKILL TREE CONTROLLERS
    async updateSkills(req, res) {
        try {
            const { skillType, action } = req.body;
            const user = await User.findById(req.user.userId);
            const skill = user.skillTree[skillType];

            if (!skill) {
                return res.status(400).json({ message: "Invalid skill type" });
            }

            if (action === "unlock" && !skill.unlocked) {
                skill.unlocked = true;
            } else if (action === "levelUp" && skill.unlocked) {
                skill.level += 1;

                // Skill level achievement
                if (skill.level % 5 === 0) {
                    await Achievement.create({
                        userId: user._id,
                        badge: `${skillType} Master ${skill.level}`,
                        description: `Reached ${skillType} skill level ${skill.level}!`
                    });
                }
            }

            await user.save();
            res.json({ skillTree: user.skillTree });
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }
};

module.exports = UserController;