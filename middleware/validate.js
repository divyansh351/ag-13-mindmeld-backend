const { check } = require('express-validator');

const validate = {
    registration: [
        check('username').notEmpty().trim().isLength({ min: 3 }),
        check('email').isEmail().normalizeEmail(),
    ],

    login: [
        check('email').isEmail().normalizeEmail(),
        check('password').notEmpty()
    ],

    progress: [
        check('testType').isIn(['memory', 'focus', 'problemSolving']),
        check('score').isNumeric(),
        check('timeTaken').optional().isNumeric()
    ],

    skillUpdate: [
        check('skillType').isIn(['memory', 'focus', 'problemSolving']),
        check('action').isIn(['unlock', 'levelUp'])
    ],

    memoryTest: [
        check('content.images').isArray(),
        check('content.duration').isNumeric(),
        check('content.recallTime').isNumeric(),
        check('content.pairs').isArray()
    ],

    attentionTest: [
        check('content.targetSymbols').isArray(),
        check('content.distractors').isArray(),
        check('content.duration').isNumeric(),
        check('content.frequency').isNumeric()
    ],

    focusTest: [
        check('content.sequence').isArray(),
        check('content.intervalDuration').isNumeric(),
        check('content.totalDuration').isNumeric(),
        check('content.distractions').isArray()
    ],

    reactionTest: [
        check('content.stimulus').isString(),
        check('content.delayMin').isNumeric(),
        check('content.delayMax').isNumeric(),
        check('content.trials').isNumeric()
    ],

    problemTest: [
        check('content.problem').isString(),
        check('content.options').isArray(),
        check('content.correctAnswer').isString(),
        check('content.timeLimit').isNumeric(),
        check('content.hints').isArray()
    ]

};


module.exports = validate;