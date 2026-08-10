const express = require('express');
const { v4: uuidv4 } = require('uuid');
const User = require('../models/User');
const Subscription = require('../models/Subscription');
const { checkApiKey, checkUserAuth } = require('../middleware/auth');

const router = express.Router();

const PLAN_LIMITS = {
  free: { empires: 1 },
  pro: { empires: 5 },
  elite: { empires: 15 }
};

// GET /api/user/:telegramId  -> استفاده شده توسط ربات تلگرام (bot_integration.py)
router.get('/user/:telegramId', checkApiKey, async (req, res) => {
  try {
    const user = await User.findOne({ telegramId: req.params.telegramId });
    if (!user) {
      return res.status(404).json({ error: 'کاربر یافت نشد' });
    }
    res.json({
      telegramId: user.telegramId,
      email: user.email,
      plan: user.plan,
      active: user.active,
      subscriptionEnd: user.subscriptionEnd,
      maxEmpires: user.maxEmpires,
      activeEmpires: user.activeEmpires
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'خطای سرور' });
  }
});

// POST /api/subscribe -> ساخت اشتراک جدید (رایگان یا شروع فرآیند پرداخت)
router.post('/subscribe', checkApiKey, async (req, res) => {
  try {
    const { telegramId, email, plan } = req.body;
    if (!telegramId || !email || !plan) {
      return res.status(400).json({ error: 'telegramId, email و plan الزامی هستند' });
    }
    if (!PLAN_LIMITS[plan]) {
      return res.status(400).json({ error: 'پلن نامعتبر است' });
    }

    let user = await User.findOne({ telegramId });
    if (!user) {
      user = await User.create({
        telegramId,
        email,
        username: `user_${telegramId}`,
        referralCode: uuidv4().slice(0, 8)
      });
    }

    const now = new Date();
    const end = plan === 'free' ? null : new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000);

    user.plan = plan;
    user.active = true;
    user.subscriptionStart = now;
    user.subscriptionEnd = end;
    user.maxEmpires = PLAN_LIMITS[plan].empires;
    await user.save();

    if (plan !== 'free') {
      await Subscription.create({
        userId: user._id,
        plan,
        period: { startDate: now, endDate: end },
        status: 'active'
      });
    }

    res.status(201).json({
      telegramId: user.telegramId,
      plan: user.plan,
      active: user.active,
      subscriptionEnd: user.subscriptionEnd
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'خطای سرور' });
  }
});

// POST /api/user/:telegramId/upgrade -> ارتقای پلن
router.post('/user/:telegramId/upgrade', checkApiKey, async (req, res) => {
  try {
    const { newPlan } = req.body;
    if (!PLAN_LIMITS[newPlan]) {
      return res.status(400).json({ error: 'پلن نامعتبر است' });
    }

    const user = await User.findOne({ telegramId: req.params.telegramId });
    if (!user) {
      return res.status(404).json({ error: 'کاربر یافت نشد' });
    }

    user.plan = newPlan;
    user.maxEmpires = PLAN_LIMITS[newPlan].empires;
    user.subscriptionEnd = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000);
    await user.save();

    res.json({ success: true, plan: user.plan, subscriptionEnd: user.subscriptionEnd });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'خطای سرور' });
  }
});

// GET /api/me -> پروفایل کاربر لاگین‌شده از سایت (JWT)
router.get('/me', checkUserAuth, async (req, res) => {
  try {
    const user = await User.findById(req.userId).select('-passwordHash');
    if (!user) return res.status(404).json({ error: 'کاربر یافت نشد' });
    res.json(user);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'خطای سرور' });
  }
});

module.exports = router;
