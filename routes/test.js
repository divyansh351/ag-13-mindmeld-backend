const express = require('express');
const router = express.Router();
const { auth } = require('../middleware/auth');
const validate = require('../middleware/validate');
const TestController = require('../controllers/testController');

// Base Test Routes
router.get('/all', auth, TestController.getAllTests);
router.get('/type/:testType', auth, TestController.getTestsByType);

// Memory Test Routes
router.post('/memory/create', auth, validate.memoryTest, TestController.createMemoryTest);
router.get('/memory/:testId', auth, TestController.getMemoryTest);
router.post('/memory/:testId/submit', auth, TestController.submitMemoryTest);

// Attention Test Routes
router.post('/attention/create', auth, validate.attentionTest, TestController.createAttentionTest);
router.get('/attention/:testId', auth, TestController.getAttentionTest);
router.post('/attention/:testId/submit', auth, TestController.submitAttentionTest);

// Focus Test Routes
router.post('/focus/create', auth, validate.focusTest, TestController.createFocusTest);
router.get('/focus/:testId', auth, TestController.getFocusTest);
router.post('/focus/:testId/submit', auth, TestController.submitFocusTest);

// Reaction Time Routes 
router.post('/reaction/create', auth, validate.reactionTest, TestController.createReactionTest);
router.get('/reaction/:testId', auth, TestController.getReactionTest);
router.post('/reaction/:testId/submit', auth, TestController.submitReactionTest);

// Problem Solving Routes
router.post('/problem/create', auth, validate.problemTest, TestController.createProblemTest);
router.get('/problem/:testId', auth, TestController.getProblemTest);
router.post('/problem/:testId/submit', auth, TestController.submitProblemTest);

module.exports = router;