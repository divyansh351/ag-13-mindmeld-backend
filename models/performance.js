const mongoose = require('mongoose');

const PerformanceSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "users", required: true },
    testType: { type: String, required: true }, // "memory", "attention", etc.
    score: { type: Number, required: true },
    timeTaken: { type: Number }, // Time taken in seconds
    date: { type: Date, default: Date.now },
    xpEarned: { type: Number, required: true },
    coinsEarned: { type: Number, required: true },
});

module.exports = mongoose.model('Performance', PerformanceSchema);