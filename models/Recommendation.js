const mongoose = require('mongoose');

const RecommendationSchema = new mongoose.Schema({
    testType: { type: String, required: true }, // "memory", "attention", etc.
    advice: { type: String, required: true },
    level: { type: String, enum: ["low", "medium", "high"] }, // Based on user performance
    additionalResources: [{ type: String }], // Links to articles, games, etc.
});

module.exports = mongoose.model('Recommendation', RecommendationSchema);