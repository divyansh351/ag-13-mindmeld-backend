const User = require('../models/user');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const register = async (req, res) => {
  try {
    const { username, email, password } = req.body;
    const exists = await User.findOne({ $or: [{ email }, { username }] });
    if (exists) {
      return res.status(400).json({ message: 'User already exists' });
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    await User.create({
      username,
      email,
      password: hashedPassword
    });
    res.status(201).json({ message: 'User registered successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.userId).select('-password');
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.json(user);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}


const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }
    const isValid = await bcrypt.compare(password, user.password);
    if (!isValid) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }
    const token = jwt.sign(
      { userId: user._id },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );
    res.json({ token, userId: user._id });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getDashboard = async (req, res) => {
  try {
    const user = await User.findById(req.userId).select('-password');
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.json(user);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const updateStats = async (req, res) => {
  try {
    const { score, testType, time } = req.body;
    const user = await User.findById(req.userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }


    const exp= score/10; //correction logic factor


    if(testType === 'memory'){
      user.memoryscore += score || 0;
    }else if(testType === 'problem'){
      user.problemscore += score || 0;
    }else if(testType === 'focus'){
      user.focusscore += score || 0;
    }else if(testType === 'reaction'){
      user.reactionscore += score || 0;
    }else if(testType === 'attention'){
      user.attentionscore += score || 0;
    }
    user.exp += exp || 0;
    const today = new Date().toDateString();
    const lastActive = user.lastActive.toDateString();
    if (today !== lastActive) {
      const yesterday = new Date();
      yesterday.setDate(yesterday.getDate() - 1);
      user.streak = yesterday.toDateString() === lastActive ? user.streak + 1 : 1;
      user.lastActive = new Date();
    }
    await user.save();
    res.json({
      exp: user.exp,
      streak: user.streak
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = { register, login, getDashboard, updateStats, getProfile };