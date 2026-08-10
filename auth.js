const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { v4: uuidv4 } = require('uuid');
const User = require('../models/User');

const router = express.Router();

// ثبت‌نام کاربر جدید از طریق سایت
router.post('/register', async (req, res) => {
  try {
    const { email, password, username, telegramId } = req.body;

    if (!email || !password || !username) {
      return res.status(400).json({ error: 'email, password و username الزامی هستند' });
    }

    const existing = await User.findOne({ email });
    if (existing) {
      return res.status(409).json({ error: 'این ایمیل قبلاً ثبت شده' });
    }

    const passwordHash = await bcrypt.hash(password, 10);

    const user = await User.create({
      email,
      username,
      passwordHash,
      telegramId: telegramId || `web-${uuidv4()}`,
      referralCode: uuidv4().slice(0, 8)
    });

    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: '7d' });

    res.status(201).json({
      token,
      user: { id: user._id, email: user.email, username: user.username, plan: user.plan }
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'خطای سرور' });
  }
});

// ورود
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });

    if (!user || !user.passwordHash) {
      return res.status(401).json({ error: 'ایمیل یا رمز عبور اشتباه است' });
    }

    const match = await bcrypt.compare(password, user.passwordHash);
    if (!match) {
      return res.status(401).json({ error: 'ایمیل یا رمز عبور اشتباه است' });
    }

    user.lastLoginAt = new Date();
    await user.save();

    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: '7d' });

    res.json({
      token,
      user: { id: user._id, email: user.email, username: user.username, plan: user.plan }
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'خطای سرور' });
  }
});

module.exports = router;
