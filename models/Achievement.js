const mongoose = require('mongoose');

const AchievementSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "users", required: true },
    badge: { type: String, required: true },
    description: { type: String },
    dateEarned: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Achievement', AchievementSchema);