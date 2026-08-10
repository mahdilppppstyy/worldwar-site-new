# 🎮 WorldWar Bot - وبسایت اشتراک تلگرام

<div dir="rtl">

وبسایتی حرفه‌ای برای فروش اشتراک بازی **جنگ جهانی** در تلگرام

## 📊 ویژگی‌های وبسایت

✅ **صفحه اصلی جذاب** - معرفی بازی و ویژگی‌ها
✅ **سیستم قیمت‌گذاری** - 3 پلان (رایگان، حرفه‌ای، الیت)
✅ **درگاه پرداخت** - اتصال Zarinpal و Stripe
✅ **پنل کاربری** - مدیریت اشتراک و آمار
✅ **سیستم اطلاع‌رسانی** - ایمیل و پیامک
✅ **Dashboard ادمین** - مدیریت کاربران و درآمد
✅ **API متصل** - اتصال با ربات تلگرام

---

## 🚀 شروع سریع (۵ دقیقه)

### 1️⃣ نیازمندی‌ها

```bash
- Node.js 16+
- MongoDB (رایگان از mongodb.com)
- حساب Zarinpal (پرداخت ایرانی)
- توکن ربات تلگرام (از BotFather)
```

### 2️⃣ راه‌اندازی محلی

```bash
# Clone repo
git clone <repository>
cd worldwar-bot-website

# Install packages
npm install

# Create .env file
cat > .env << EOF
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/worldwar
TELEGRAM_BOT_TOKEN=123456:ABC-DEF1234ghIkl
ZARINPAL_MERCHANT_ID=xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx
JWT_SECRET=your-secret-key-here
NODE_ENV=development
WEBSITE_URL=http://localhost:3000
EOF

# Start servers
npm run dev
```

### 3️⃣ باز کردن در مرورگر

```
http://localhost:3000
```

---

## 📁 ساختار پروژه

```
worldwar-bot-website/
├── public/
│   ├── index.html
│   └── favicon.ico
├── src/
│   ├── components/
│   │   ├── PricingPlans.jsx
│   │   ├── Dashboard.jsx
│   │   ├── PaymentModal.jsx
│   │   └── Navigation.jsx
│   ├── pages/
│   │   ├── Home.jsx
│   │   ├── Features.jsx
│   │   ├── Pricing.jsx
│   │   └── Admin.jsx
│   ├── App.jsx
│   └── index.js
├── server/
│   ├── server.js
│   ├── routes/
│   │   ├── auth.js
│   │   ├── users.js
│   │   ├── payments.js
│   │   └── admin.js
│   ├── models/
│   │   ├── User.js
│   │   ├── Subscription.js
│   │   ├── Transaction.js
│   │   └── Empire.js
│   └── middleware/
│       ├── auth.js
│       └── admin.js
├── .env
├── package.json
├── server.js
└── README.md
```

---

## 💳 درگاه‌های پرداخت

### Zarinpal (ایران)

**مزایا:**
- تراکنش‌های داخلی
- کمیسیون کم (۲/۲%)
- پشتیبانی فارسی

**پیاده‌سازی:**

```javascript
const gateway = new ZarinpalGateway();

// درخواست پرداخت
const { authority, paymentUrl } = await gateway.createPayment(
  amount: 99900,
  email: 'user@example.com',
  description: 'اشتراک حرفه‌ای'
);

// تأیید پرداخت
const verified = await gateway.verifyPayment(authority, 99900);
```

### Stripe (جهانی)

**مزایا:**
- پشتیبانی بین‌المللی
- کارت‌های خارجی
- سامانه پیشرفته

**پیاده‌سازی:**

```javascript
const stripe = require('stripe')(process.env.STRIPE_KEY);

// ایجاد payment intent
const intent = await stripe.paymentIntents.create({
  amount: 99900,
  currency: 'usd',
  metadata: { plan: 'pro' }
});
```

---

## 🗄️ پایگاه داده

### MongoDB Collections

```javascript
// Users
db.users.insertOne({
  telegramId: "123456789",
  email: "user@example.com",
  username: "username",
  plan: "pro",
  subscriptionStart: new Date(),
  subscriptionEnd: new Date(Date.now() + 30*24*60*60*1000),
  maxEmpires: 5,
  activeEmpires: 2,
  paymentHistory: []
})

// Subscriptions
db.subscriptions.insertOne({
  userId: ObjectId("..."),
  plan: "pro",
  pricePerMonth: 89900,
  startDate: new Date(),
  endDate: new Date(Date.now() + 30*24*60*60*1000),
  autoRenew: true
})

// Transactions
db.transactions.insertOne({
  userId: ObjectId("..."),
  type: "upgrade",
  amount: 89900,
  currency: "IRR",
  gateway: "zarinpal",
  transactionId: "...",
  status: "success",
  createdAt: new Date()
})
```

---

## 🔐 امنیت

### تنظیمات مهم

```javascript
// 1. Helmet برای headers
const helmet = require('helmet');
app.use(helmet());

// 2. Rate limiting
const rateLimit = require('express-rate-limit');
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 دقیقه
  max: 100 // محدودیت درخواست
});
app.use('/api/', limiter);

// 3. CORS
app.use(cors({
  origin: process.env.WEBSITE_URL,
  credentials: true
}));

// 4. JWT for auth
const jwt = require('jsonwebtoken');
function verifyToken(req, res, next) {
  const token = req.headers['authorization']?.split(' ')[1];
  if (!token) return res.sendStatus(401);
  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) return res.sendStatus(403);
    req.user = user;
    next();
  });
}
```

---

## 📧 ایمیل‌ها و اطلاع‌رسانی

### پیکربندی Nodemailer

```javascript
const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  host: 'smtp.gmail.com',
  port: 587,
  secure: false,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});

// ایمیل خوش‌آمدگویی
async function sendWelcomeEmail(email, username) {
  await transporter.sendMail({
    from: 'support@worldwar.bot',
    to: email,
    subject: 'خوش آمدید به WorldWar Bot!',
    html: `
      <h2>سلام ${username}!</h2>
      <p>اشتراک شما با موفقیت فعال شد.</p>
      <p>با @WORLDWAR011_BOT در تلگرام شروع کنید.</p>
    `
  });
}
```

---

## 🚢 استقرار بر روی سرور

### بر روی Heroku

```bash
# 1. نصب Heroku CLI
npm install -g heroku

# 2. Login
heroku login

# 3. ایجاد اپلیکیشن
heroku create worldwar-bot-website

# 4. متغیرهای محیط
heroku config:set MONGODB_URI=mongodb+srv://...
heroku config:set TELEGRAM_BOT_TOKEN=...
heroku config:set ZARINPAL_MERCHANT_ID=...

# 5. Deploy
git push heroku main

# 6. بررسی وضعیت
heroku logs --tail
```

### بر روی Railway.app

```bash
# 1. نصب CLI
npm install -g @railway/cli

# 2. Login
railway login

# 3. Link پروژه
railway link

# 4. Database
railway add postgres

# 5. Deploy
railway up
```

### بر روی DigitalOcean

```bash
# 1. SSH به سرور
ssh root@your-server-ip

# 2. نصب Node.js
curl -fsSL https://deb.nodesource.com/setup_16.x | sudo -E bash -
sudo apt install nodejs

# 3. Clone و setup
git clone <repo>
cd worldwar-bot-website
npm install

# 4. PM2 برای اجرای دائمی
npm install -g pm2
pm2 start server.js --name worldwar

# 5. SSL (Let's Encrypt)
sudo apt install certbot python3-certbot-nginx
sudo certbot certonly --standalone -d yourdomain.com
```

---

## 📊 Admin Dashboard

### دسترسی

```
https://yourdomain.com/admin
(نام کاربری و رمز از .env)
```

### ویژگی‌ها

📈 **آمار:**
- کل کاربران
- درآمد ماهانه
- تعداد اشتراک‌ها
- نرخ تبدیل

👥 **مدیریت کاربران:**
- لیست کاربران
- تغییر پلان
- لغو اشتراک
- تاریخ پرداخت

💰 **تراکنش‌ها:**
- گزارش درآمد
- تراکنش‌های ناموفق
- صورت‌حساب

---

## 🔌 API اندپوینت‌ها

### احراز هویت

```bash
POST /api/auth/register
POST /api/auth/login
POST /api/auth/logout
```

### اشتراک

```bash
GET /api/user/:telegramId
POST /api/subscribe
POST /api/upgrade
POST /api/downgrade
POST /api/cancel
```

### پرداخت

```bash
POST /api/payment/create
POST /api/payment/verify/:transactionId
GET /api/payment/history/:userId
```

### مدیریت

```bash
GET /api/admin/users
GET /api/admin/stats
GET /api/admin/revenue
POST /api/admin/user/:id/block
```

---

## 🤖 اتصال ربات تلگرام

### توکن‌های لازم

```python
# در فایل config.py ربات
WEBSITE_API = 'https://yourdomain.com/api'
API_KEY = 'your-api-key-here'
```

### دستورات ربات

```
/start - شروع بازی
/status - وضعیت اشتراک
/upgrade - ارتقا پلان
/empire - مدیریت امپراتوری
/help - کمک
/support - تماس با پشتیبانی
```

---

## 📞 پشتیبانی و مشکل‌یابی

### خطاهای رایج

**❌ خطا: "Cannot connect to MongoDB"**
```bash
✓ MongoDB connection string درست است
✓ IP Address در MongoDB whitelist است
✓ نام کاربری و رمز صحیح است
```

**❌ خطا: "Payment gateway error"**
```bash
✓ Merchant ID صحیح است
✓ API Key موثر است
✓ HTTPS فعال است
```

**❌ خطا: "Telegram bot not responding"**
```bash
✓ Bot token صحیح است
✓ Webhook URL درست است
✓ Firewall بسته نیست
```

### لاگ‌های مفید

```bash
# Backend logs
npm run dev 2>&1 | tee server.log

# Database logs
mongosh --logPath /var/log/mongodb/mongod.log

# Payment logs
tail -f payment-gateway.log
```

---

## 💡 تیپ‌های بیشتر درآمد

### 🎁 برنامه‌های ترجیح دهی

```javascript
// مثال: ۲۰% تخفیف برای بخش سالانه
const annualDiscount = {
  pro: { monthly: 89900, annual: 718000 }, // ۲۰% off
  elite: { monthly: 299900, annual: 2399000 } // ۲۰% off
};
```

### 🎯 معرفی دوستان

```javascript
// هر معرفی = ۱۰% تخفیف تا ۶ ماه
app.post('/api/referral/create', async (req, res) => {
  const referralCode = generateCode();
  await Referral.create({
    userId: req.user.id,
    code: referralCode,
    discount: 10,
    validUntil: new Date(Date.now() + 6*30*24*60*60*1000)
  });
});
```

### ⭐ محتوای اختصاصی

```
پلان Elite = دسترسی به:
- نقشه‌های سفارشی
- تور خصوصی
- رویدادهای ویژه
- مشاوره استراتژیک
```

---

## 📱 نسخه موبایل

وبسایت به طور کامل responsive است و روی موبایل کار می‌کند:

```css
@media (max-width: 768px) {
  .pricing-grid { grid-template-columns: 1fr; }
  .navbar { position: sticky; }
}
```

---

## 🔄 Cron Jobs

```javascript
// بررسی اشتراک‌های منقضی (روزانه)
schedule.scheduleJob('0 0 * * *', async () => {
  const expired = await User.find({
    subscriptionEnd: { $lt: new Date() }
  });
  
  for (let user of expired) {
    await sendExpirationEmail(user);
    await updateUserPlan(user._id, 'free');
  }
});

// صورت‌حساب ماهانه (اول ماه)
schedule.scheduleJob('0 0 1 * *', async () => {
  const users = await User.find({ plan: { $ne: 'free' } });
  for (let user of users) {
    await generateMonthlyInvoice(user);
  }
});
```

---

## 📈 معیارهای کلیدی (KPIs)

```
نرخ تبدیل = (کاربران پرداخت کننده / کل کاربران) × 100
Churn Rate = (کاربران رفتن شده / کاربران ماه گذشته) × 100
LTV = (متوسط درآمد ماهانه × ۱۲ × میانگین ماه‌های حفظ)
CAC = (هزینه بازاریابی / تعداد کاربران جدید)
```

---

## 📚 منابع مفید

- [MongoDB Docs](https://docs.mongodb.com)
- [Express.js Guide](https://expressjs.com)
- [Telegram Bot API](https://core.telegram.org/bots/api)
- [Zarinpal Docs](https://www.zarinpal.com/dev/api)
- [Stripe Docs](https://stripe.com/docs)
- [Railway Deployment](https://railway.app/docs)

---

## ✉️ تماس و پشتیبانی

📧 **Email:** support@worldwar.bot
💬 **Telegram:** [@worldwar_support](https://t.me/worldwar_support)
🌐 **Website:** worldwar.bot

---

## 📄 لایسنس

MIT License - استفاده آزاد برای اهداف تجاری

---

## 🙌 مشارکت

از نظرات و بهبودی‌های شما استقبال می‌کنیم!

```bash
git fork
git checkout -b feature/amazing-feature
git commit -am 'اضافه کردن ویژگی شگفت‌انگیز'
git push origin feature/amazing-feature
```

---

**نسخه:** 1.0.0
**آخرین به‌روزرسانی:** 1403/5/17
**وضعیت:** ✅ تولید آماده

---

</div>
