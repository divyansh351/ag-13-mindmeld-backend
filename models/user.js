const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
    username: { type: String, required: true, unique: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    age: { type: Number, required: true },
    occupation: { type: String },
    goals: [{ type: String }], // Cognitive goals like ["memory", "focus"]
    registrationDate: { type: Date, default: Date.now },
    performance: {
        memory: [{ date: Date, score: Number }],
        attention: [{ date: Date, score: Number }],
        focus: [{ date: Date, score: Number }],
        problemSolving: [{ date: Date, score: Number }],
    },
    streak: { type: Number, default: 0 }, // Days of continuous activity
    lastActiveDate: { type: Date }, // For streak tracking
    xp: { type: Number, default: 0 }, // Total XP earned
    level: { type: Number, default: 1 }, // User level
    coins: { type: Number, default: 0 }, // In-app currency
    badges: [{ type: String }], // Earned badges
    skillTree: {
        memory: { level: { type: Number, default: 1 }, unlocked: { type: Boolean, default: true } },
        attention: { level: { type: Number, default: 1 }, unlocked: { type: Boolean, default: false } },
        focus: { level: { type: Number, default: 1 }, unlocked: { type: Boolean, default: false } },
        problemSolving: { level: { type: Number, default: 1 }, unlocked: { type: Boolean, default: false } },
    },
});


module.exports = mongoose.model('User', UserSchema);