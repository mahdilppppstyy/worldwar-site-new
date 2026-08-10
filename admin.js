const express = require('express');
const User = require('../models/User');
const Transaction = require('../models/Transaction');
const { checkUserAuth } = require('../middleware/auth');
const { checkAdmin } = require('../middleware/admin');

const router = express.Router();

router.use(checkUserAuth, checkAdmin);

// GET /api/admin/stats -> آمار کلی برای داشبورد ادمین
router.get('/stats', async (req, res) => {
  try {
    const totalUsers = await User.countDocuments();
    const activeSubs = await User.countDocuments({ active: true, plan: { $ne: 'free' } });

    const revenueAgg = await Transaction.aggregate([
      { $match: { status: 'success' } },
      { $group: { _id: null, total: { $sum: '$amount' } } }
    ]);

    res.json({
      totalUsers,
      activeSubscriptions: activeSubs,
      totalRevenue: revenueAgg[0] ? revenueAgg[0].total : 0
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'خطای سرور' });
  }
});

// GET /api/admin/users -> لیست کاربران
router.get('/users', async (req, res) => {
  try {
    const users = await User.find().select('-passwordHash').sort({ createdAt: -1 }).limit(200);
    res.json(users);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'خطای سرور' });
  }
});

module.exports = router;
