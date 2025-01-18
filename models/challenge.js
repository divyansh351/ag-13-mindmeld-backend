const mongoose = require('mongoose');

const ChallengeSchema = new mongoose.Schema({
    challengeType: { type: String, required: true }, // e.g., "Weekly Challenge", "Seasonal Challenge"
    description: { type: String },
    startDate: { type: Date, required: true },
    endDate: { type: Date, required: true },
    xpReward: { type: Number, default: 50 },
    coinsReward: { type: Number, default: 20 },
    participants: [{ type: mongoose.Schema.Types.ObjectId, ref: "users" }], // List of users taking part
    completedBy: [{ type: mongoose.Schema.Types.ObjectId, ref: "users" }], // List of users who completed it
});

module.exports = mongoose.model('Challenge', ChallengeSchema);