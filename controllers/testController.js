const { Test, MemoryTest, AttentionTest, FocusTest, ReactionTest, ProblemSolvingTest } = require('../models/test');
const Performance = require('../models/performance');
const User = require('../models/user');

const TestController = {
    // Generic Test Controllers
    async getAllTests(req, res) {
        try {
            const tests = await Test.find();
            res.json(tests);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    },

    async getTestsByType(req, res) {
        try {
            const tests = await Test.find({ testType: req.params.testType });
            res.json(tests);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    },

    // Memory Test Controllers
    async createMemoryTest(req, res) {
        try {
            const test = await MemoryTest.create(req.body);
            res.status(201).json(test);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    },

    async getMemoryTest(req, res) {
        try {
            const test = await MemoryTest.findById(req.params.testId);
            if (!test) return res.status(404).json({ message: "Test not found" });
            res.json(test);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    },

    async submitMemoryTest(req, res) {
        try {
            const { answers, timeTaken } = req.body;
            const test = await MemoryTest.findById(req.params.testId);
            if (!test) return res.status(404).json({ message: "Test not found" });

            const score = calculateMemoryScore(answers, test.content);
            await updateUserProgress(req.user.userId, 'memory', score, timeTaken);

            res.json({ score });
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    },

    // Attention Test Controllers
    async createAttentionTest(req, res) {
        try {
            const test = await AttentionTest.create(req.body);
            res.status(201).json(test);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    },

    async getAttentionTest(req, res) {
        try {
            const test = await AttentionTest.findById(req.params.testId);
            if (!test) return res.status(404).json({ message: "Test not found" });
            res.json(test);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    },

    async submitAttentionTest(req, res) {
        try {
            const { responses, timeTaken } = req.body;
            const test = await AttentionTest.findById(req.params.testId);
            if (!test) return res.status(404).json({ message: "Test not found" });

            const score = calculateAttentionScore(responses, test.content);
            await updateUserProgress(req.user.userId, 'attention', score, timeTaken);

            res.json({ score });
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    },

    // Focus Test Controllers
    async createFocusTest(req, res) {
        try {
            const test = await FocusTest.create(req.body);
            res.status(201).json(test);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    },

    async getFocusTest(req, res) {
        try {
            const test = await FocusTest.findById(req.params.testId);
            if (!test) return res.status(404).json({ message: "Test not found" });
            res.json(test);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    },

    async submitFocusTest(req, res) {
        try {
            const { responses, timeTaken } = req.body;
            const test = await FocusTest.findById(req.params.testId);
            if (!test) return res.status(404).json({ message: "Test not found" });

            const score = calculateFocusScore(responses, test.content);
            const progress = await updateUserProgress(req.user.userId, 'focus', score, timeTaken);

            res.json({ score, ...progress });
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    },

    // Reaction Test Controllers
    async createReactionTest(req, res) {
        try {
            const test = await ReactionTest.create(req.body);
            res.status(201).json(test);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    },

    async getReactionTest(req, res) {
        try {
            const test = await ReactionTest.findById(req.params.testId);
            if (!test) return res.status(404).json({ message: "Test not found" });
            res.json(test);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    },

    async submitReactionTest(req, res) {
        try {
            const { reactions, timeTaken } = req.body;
            const test = await ReactionTest.findById(req.params.testId);
            if (!test) return res.status(404).json({ message: "Test not found" });

            const score = calculateReactionScore(reactions, test.content);
            const progress = await updateUserProgress(req.user.userId, 'reactionTime', score, timeTaken);

            res.json({ score, ...progress });
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    },


    // Problem Solving Controllers
    async createProblemTest(req, res) {
        try {
            const test = await ProblemSolvingTest.create(req.body);
            res.status(201).json(test);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    },

    async getProblemTest(req, res) {
        try {
            const test = await ProblemSolvingTest.findById(req.params.testId);
            if (!test) return res.status(404).json({ message: "Test not found" });
            res.json(test);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    },

    async submitProblemTest(req, res) {
        try {
            const { answer, timeTaken } = req.body;
            const test = await ProblemSolvingTest.findById(req.params.testId);
            if (!test) return res.status(404).json({ message: "Test not found" });

            const score = calculateProblemScore(answer, test.content, timeTaken);
            const progress = await updateUserProgress(req.user.userId, 'problemSolving', score, timeTaken);

            res.json({ score, ...progress });
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }
};

// Helper Functions
function calculateMemoryScore(answers, content) {
    // Implement scoring logic for memory test
    return Math.floor(Math.random() * 100); // Placeholder
}


function calculateMemoryScore(answers, content) {
    const correctPairs = content.pairs.filter((pair, index) =>
        answers[index] && answers[index].item1 === pair.item1 && answers[index].item2 === pair.item2
    ).length;
    return Math.floor((correctPairs / content.pairs.length) * 100);
}

function calculateFocusScore(responses, content) {
    const correctResponses = responses.filter((response, index) =>
        response === content.sequence[index]
    ).length;
    return Math.floor((correctResponses / content.sequence.length) * 100);
}

function calculateReactionScore(reactions, content) {
    const averageReactionTime = reactions.reduce((acc, time) => acc + time, 0) / reactions.length;
    const maxScore = 100;
    const minReactionTime = 100; // 100ms as ideal reaction time
    return Math.floor(Math.max(0, maxScore * (minReactionTime / averageReactionTime)));
}

function calculateProblemScore(answer, content, timeTaken) {
    const isCorrect = answer === content.correctAnswer;
    const timeScore = Math.max(0, 1 - (timeTaken / content.timeLimit));
    return Math.floor(isCorrect ? (100 * (0.7 + (0.3 * timeScore))) : 0);
}

async function updateUserProgress(userId, testType, score, timeTaken) {
    const user = await User.findById(userId);

    const xpEarned = Math.floor(score * 1.5);
    const coinsEarned = Math.floor(score * 0.5);

    user.xp += xpEarned;
    user.coins += coinsEarned;

    // Update performance history
    if (!user.performance) user.performance = {};
    if (!user.performance[testType]) user.performance[testType] = [];
    user.performance[testType].push({ date: new Date(), score });

    // Record performance
    await Performance.create({
        userId,
        testType,
        score,
        timeTaken,
        xpEarned,
        coinsEarned
    });

    await user.save();

    return {
        xpEarned,
        coinsEarned,
        totalXp: user.xp,
        totalCoins: user.coins
    };
}

module.exports = TestController;