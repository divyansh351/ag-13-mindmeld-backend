const mongoose = require('mongoose');

const LeaderboardSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "users", required: true },
    username: { type: String, required: true },
    xp: { type: Number, required: true },
    streak: { type: Number, required: true },
    rank: { type: Number }, // Calculated rank
});

module.exports = mongoose.model('Leaderboard', LeaderboardSchema);