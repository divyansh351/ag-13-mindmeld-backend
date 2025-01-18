const mongoose = require('mongoose');

const BaseTestSchema = new mongoose.Schema({
    testType: {
        type: String,
        required: true,
        enum: ['memory', 'attention', 'focus', 'reactionTime', 'problemSolving']
    },
    difficulty: {
        type: String,
        enum: ["easy", "medium", "hard"],
        default: "medium"
    },
    description: String,
    xpReward: { type: Number, default: 10 },
    coinsReward: { type: Number, default: 5 },
    createdAt: { type: Date, default: Date.now }
}, { discriminatorKey: 'testType' });

const Test = mongoose.model('Test', BaseTestSchema);

const MemoryTest = Test.discriminator('memory', new mongoose.Schema({
    content: {
        images: [String],
        duration: Number,
        recallTime: Number,
        pairs: [{
            item1: String,
            item2: String
        }]
    }
}));

const AttentionTest = Test.discriminator('attention', new mongoose.Schema({
    content: {
        targetSymbols: [String],
        distractors: [String],
        duration: Number,
        frequency: Number
    }
}));

const FocusTest = Test.discriminator('focus', new mongoose.Schema({
    content: {
        sequence: [String],
        intervalDuration: Number,
        totalDuration: Number,
        distractions: [String]
    }
}));

const ReactionTest = Test.discriminator('reactionTime', new mongoose.Schema({
    content: {
        stimulus: String,
        delayMin: Number,
        delayMax: Number,
        trials: Number
    }
}));

const ProblemSolvingTest = Test.discriminator('problemSolving', new mongoose.Schema({
    content: {
        problem: String,
        options: [String],
        correctAnswer: String,
        timeLimit: Number,
        hints: [String]
    }
}));

module.exports = { Test, MemoryTest, AttentionTest, FocusTest, ReactionTest, ProblemSolvingTest };