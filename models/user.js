// filepath: /models/user.js
const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  memoryscore: { type: Number, default: 0 },
  problemscore: { type: Number, default: 0 },
  focusscore: { type: Number, default: 0 },
  attentionscore: {type: Number, default: 0},
  reactionscore: { type: Number, default: 0 },
  exp: { type: Number, default: 0 },
  streak: { type: Number, default: 0 },
  lastActive: { type: Date, default: Date.now }
}, { timestamps: true });

module.exports = mongoose.model('User', userSchema);