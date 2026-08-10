const express = require('express');
const axios = require('axios');
const { v4: uuidv4 } = require('uuid');
const User = require('../models/User');
const Transaction = require('../models/Transaction');
const { checkApiKey } = require('../middleware/auth');

const router = express.Router();

// قیمت پلن‌ها به تومان (با پلن‌های صفحه‌ی اصلی سایت هماهنگ است)
const PLAN_PRICES = {
  pro: 499000,
  elite: 1499000
};

const ZARINPAL_REQUEST_URL = 'https://api.zarinpal.com/pg/v4/payment/request.json';
const ZARINPAL_VERIFY_URL = 'https://api.zarinpal.com/pg/v4/payment/verify.json';
const ZARINPAL_STARTPAY_URL = 'https://www.zarinpal.com/pg/StartPay/';

// POST /api/generate-payment-link -> استفاده شده توسط ربات تلگرام
router.post('/generate-payment-link', async (req, res) => {
  try {
    const { telegramId, plan } = req.body;
    if (!telegramId || !PLAN_PRICES[plan]) {
      return res.status(400).json({ error: 'telegramId و plan معتبر الزامی هستند' });
    }

    const amount = PLAN_PRICES[plan];
    const callbackUrl = `${process.env.WEBSITE_URL}/api/payment/zarinpal/callback?telegramId=${telegramId}&plan=${plan}`;

    const response = await axios.post(ZARINPAL_REQUEST_URL, {
      merchant_id: process.env.ZARINPAL_MERCHANT_ID,
      amount,
      description: `اشتراک ${plan} - وردوار`,
      callback_url: callbackUrl
    });

    const data = response.data && response.data.data;
    if (data && data.code === 100) {
      return res.json({ paymentLink: `${ZARINPAL_STARTPAY_URL}${data.authority}` });
    }
    res.status(400).json({ error: 'ساخت لینک پرداخت با خطا مواجه شد' });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ error: 'خطای سرور در اتصال به زرین‌پال' });
  }
});

// GET /api/payment/zarinpal/callback -> زرین‌پال کاربر رو بعد از پرداخت به اینجا برمی‌گردونه
router.get('/payment/zarinpal/callback', async (req, res) => {
  try {
    const { Authority, Status, telegramId, plan } = req.query;

    if (Status !== 'OK') {
      return res.redirect(`${process.env.WEBSITE_URL}/payment-failed`);
    }

    const amount = PLAN_PRICES[plan];
    const verifyResponse = await axios.post(ZARINPAL_VERIFY_URL, {
      merchant_id: process.env.ZARINPAL_MERCHANT_ID,
      amount,
      authority: Authority
    });

    const data = verifyResponse.data && verifyResponse.data.data;
    if (!data || data.code !== 100) {
      return res.redirect(`${process.env.WEBSITE_URL}/payment-failed`);
    }

    const user = await User.findOne({ telegramId });
    if (user) {
      const end = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000);
      user.plan = plan;
      user.active = true;
      user.subscriptionStart = new Date();
      user.subscriptionEnd = end;
      user.totalSpent += amount;
      user.lastPaymentDate = new Date();
      await user.save();

      await Transaction.create({
        userId: user._id,
        type: 'subscription',
        amount,
        gateway: 'zarinpal',
        gatewayTransactionId: data.ref_id ? String(data.ref_id) : undefined,
        authority: Authority,
        status: 'success',
        completedAt: new Date(),
        invoiceNumber: uuidv4().slice(0, 10)
      });
    }

    res.redirect(`${process.env.WEBSITE_URL}/payment-success`);
  } catch (err) {
    console.error(err.message);
    res.redirect(`${process.env.WEBSITE_URL}/payment-failed`);
  }
});

// POST /api/payment/process -> استفاده شده توسط ربات تلگرام برای ثبت پرداخت‌های دستی/غیر زرین‌پال
router.post('/payment/process', checkApiKey, async (req, res) => {
  try {
    const { telegramId, plan, amount, gateway, transactionId } = req.body;
    const user = await User.findOne({ telegramId });
    if (!user) {
      return res.status(404).json({ error: 'کاربر یافت نشد' });
    }

    const end = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000);
    user.plan = plan;
    user.active = true;
    user.subscriptionStart = new Date();
    user.subscriptionEnd = end;
    user.totalSpent += amount || 0;
    user.lastPaymentDate = new Date();
    await user.save();

    await Transaction.create({
      userId: user._id,
      type: 'subscription',
      amount: amount || 0,
      gateway: gateway || 'manual',
      gatewayTransactionId: transactionId,
      status: 'success',
      completedAt: new Date()
    });

    res.json({ success: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'خطای سرور' });
  }
});

module.exports = router;
