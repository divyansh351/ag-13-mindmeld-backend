const router = require('express').Router();
const { register, login, getDashboard, updateStats, getProfile } = require('../controllers/userController');
const auth = require('../middleware/auth');

router.post('/register', register);
router.post('/login', login);
router.get('/dashboard', auth, getDashboard);
router.get('/profile', auth, getProfile);
router.post('/stats', auth, updateStats);

module.exports = router;