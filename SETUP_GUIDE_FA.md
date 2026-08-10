# راهنمای راه‌اندازی وبسایت اشتراک WorldWar Bot

## 📋 فهرست مطالب
1. [نیازمندی‌ها](#نیازمندی‌ها)
2. [تنظیم Backend](#تنظیم-backend)
3. [اتصال درگاه پرداخت](#اتصال-درگاه-پرداخت)
4. [پایگاه داده](#پایگاه-داده)
5. [استقرار](#استقرار)
6. [تنظیمات دامنه](#تنظیمات-دامنه)

---

## نیازمندی‌ها

### سرویس‌های مورد نیاز:
- **Hosting**: Heroku، Railway، Vercel یا DigitalOcean
- **Database**: PostgreSQL یا MongoDB
- **Payment Gateway**: Zarinpal، Idpay یا Stripe
- **Telegram Bot**: توکن از BotFather

### نرم‌افزارهای محلی:
```bash
- Node.js v16+
- Python 3.8+
- npm یا yarn
- Git
```

---

## تنظیم Backend

### 1. ایجاد سرور Node.js/Express

**فایل: `server.js`**
```javascript
const express = require('express');
const axios = require('axios');
const cors = require('cors');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());

// Database connection
const mongoose = require('mongoose');
mongoose.connect(process.env.MONGODB_URI);

// User Model
const userSchema = new mongoose.Schema({
  telegramId: String,
  email: String,
  plan: { type: String, enum: ['free', 'pro', 'elite'] },
  subscriptionStart: Date,
  subscriptionEnd: Date,
  empires: Number,
  active: Boolean,
  paymentId: String,
  createdAt: { type: Date, default: Date.now }
});

const User = mongoose.model('User', userSchema);

// API Routes
app.post('/api/subscribe', async (req, res) => {
  const { telegramId, email, plan } = req.body;
  
  // Create subscription in database
  const user = new User({
    telegramId,
    email,
    plan,
    subscriptionStart: new Date(),
    subscriptionEnd: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
    empires: getPlanEmpires(plan),
    active: true
  });
  
  await user.save();
  res.json({ success: true, userId: user._id });
});

app.get('/api/user/:telegramId', async (req, res) => {
  const user = await User.findOne({ telegramId: req.params.telegramId });
  res.json(user);
});

app.post('/api/payment/callback', async (req, res) => {
  // Zarinpal callback
  const { userId, status } = req.body;
  
  if (status === 'SUCCESS') {
    await User.updateOne({ _id: userId }, { active: true });
    res.json({ success: true });
  }
});

function getPlanEmpires(plan) {
  const empires = { free: 1, pro: 5, elite: 15 };
  return empires[plan] || 1;
}

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
```

### 2. فایل محیط (`‎.env`)

```
MONGODB_URI=mongodb+srv://user:pass@cluster.mongodb.net/worldwar
TELEGRAM_BOT_TOKEN=123456:ABC-DEF1234ghIkl-zyx57W2v1u123ew11
ZARINPAL_MERCHANT_ID=xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx
ZARINPAL_API_KEY=your_zarinpal_api_key
JWT_SECRET=your_secret_key
NODE_ENV=production
```

---

## اتصال درگاه پرداخت

### روش 1: Zarinpal (بهترین برای ایران)

```javascript
const axios = require('axios');

class ZarinpalGateway {
  constructor() {
    this.merchantId = process.env.ZARINPAL_MERCHANT_ID;
    this.apiKey = process.env.ZARINPAL_API_KEY;
  }

  async createPayment(amount, email, description) {
    try {
      const response = await axios.post(
        'https://api.zarinpal.com/pg/v4/payment/request.json',
        {
          merchant_id: this.merchantId,
          amount: amount * 1000,
          currency: 'IRR',
          description: description,
          email: email,
          callback_url: 'https://yourdomain.com/payment/callback'
        },
        {
          headers: {
            'Content-Type': 'application/json'
          }
        }
      );

      return {
        authority: response.data.data.authority,
        paymentUrl: `https://www.zarinpal.com/pg/StartPay/${response.data.data.authority}`
      };
    } catch (error) {
      console.error('Payment error:', error);
      throw error;
    }
  }

  async verifyPayment(authority, amount) {
    const response = await axios.post(
      'https://api.zarinpal.com/pg/v4/payment/verify.json',
      {
        merchant_id: this.merchantId,
        amount: amount * 1000,
        authority: authority
      }
    );

    return response.data.data.code === 100;
  }
}

module.exports = ZarinpalGateway;
```

### روش 2: Stripe (برای بازار جهانی)

```javascript
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

app.post('/create-payment-intent', async (req, res) => {
  const { amount, email, planId } = req.body;

  const paymentIntent = await stripe.paymentIntents.create({
    amount: amount * 100, // convert to cents
    currency: 'usd',
    metadata: { plan: planId, email: email }
  });

  res.json({ clientSecret: paymentIntent.client_secret });
});
```

---

## پایگاه داده

### نمودار جداول:

**users collection**
```
{
  _id: ObjectId,
  telegramId: String (unique),
  email: String,
  username: String,
  plan: 'free' | 'pro' | 'elite',
  subscriptionStart: Date,
  subscriptionEnd: Date,
  maxEmpires: Number,
  activeEmpires: Number,
  paymentHistory: [{
    id: String,
    amount: Number,
    date: Date,
    status: 'success' | 'failed'
  }],
  premiumFeatures: {
    apiAccess: Boolean,
    customMaps: Boolean,
    vipChat: Boolean,
    advancedStats: Boolean
  },
  createdAt: Date,
  updatedAt: Date
}
```

**empires collection**
```
{
  _id: ObjectId,
  userId: ObjectId,
  name: String,
  leader: String,
  resources: {
    population: Number,
    gold: Number,
    oil: Number,
    uranium: Number
  },
  military: {
    troops: Number,
    warships: Number,
    aircraft: Number
  },
  power: Number (۰-۱۰۰),
  createdAt: Date,
  lastActivity: Date
}
```

**transactions collection**
```
{
  _id: ObjectId,
  userId: ObjectId,
  type: 'upgrade' | 'downgrade' | 'cancel',
  fromPlan: String,
  toPlan: String,
  amount: Number,
  currency: String,
  gatewayId: String,
  status: 'pending' | 'success' | 'failed',
  createdAt: Date
}
```

---

## استقرار

### بر روی Heroku:

```bash
# 1. Login
heroku login

# 2. Create app
heroku create worldwar-bot

# 3. Add MongoDB
heroku addons:create mongolab:sandbox

# 4. Set environment variables
heroku config:set TELEGRAM_BOT_TOKEN=xxxxx
heroku config:set ZARINPAL_MERCHANT_ID=xxxxx

# 5. Deploy
git push heroku main

# 6. Check logs
heroku logs --tail
```

### بر روی Railway:

```bash
# 1. Install CLI
npm i -g railway

# 2. Login
railway login

# 3. Link project
railway link

# 4. Add plugins (PostgreSQL, Redis)
railway add

# 5. Deploy
railway up
```

### بر روی DigitalOcean App Platform:

1. Push to GitHub
2. Create new App on DigitalOcean
3. Connect GitHub repo
4. Add MongoDB as component
5. Set environment variables
6. Deploy

---

## تنظیمات دامنه

### DNS Settings:

```
A Record: @ → your_server_ip
CNAME: www → @ 
CNAME: api → @ 
```

### SSL Certificate (Let's Encrypt):

```bash
# Using Certbot
sudo certbot certonly --standalone -d yourdomain.com

# Auto-renew
sudo systemctl enable certbot.timer
```

---

## اتصال ربات تلگرام

### فایل: `bot_webhook.py`

```python
from telegram import Update
from telegram.ext import Application, CommandHandler, ContextTypes
import requests

TOKEN = 'YOUR_BOT_TOKEN'
WEBHOOK_URL = 'https://yourdomain.com/webhook'
API_BASE = 'https://yourdomain.com/api'

app = Application.builder().token(TOKEN).build()

async def start(update: Update, context: ContextTypes.DEFAULT_TYPE):
    # Check if user subscribed
    response = requests.get(f'{API_BASE}/user/{update.effective_user.id}')
    
    if response.status_code == 404:
        # New user - redirect to payment
        await update.message.reply_text(
            'سلام! برای شروع بازی می‌باید اشتراک بگیرید:\n'
            f'https://yourdomain.com/signup?id={update.effective_user.id}'
        )
    else:
        user = response.json()
        await update.message.reply_text(f'خوش آمدید {user["username"]}!')

app.add_handler(CommandHandler("start", start))
app.run_webhook(
    listen="0.0.0.0",
    port=8000,
    url_path=TOKEN,
    webhook_url=f'{WEBHOOK_URL}/{TOKEN}'
)
```

---

## تست Local:

```bash
# 1. Install dependencies
npm install
pip install -r requirements.txt

# 2. Start MongoDB
mongod

# 3. Run backend
node server.js

# 4. Run Telegram bot
python bot_webhook.py

# 5. Open website
# React: npm start (if using Create React App)
# Or serve the JSX component
```

---

## Monitoring و Logging:

```javascript
// Use services like:
- Sentry (error tracking)
- LogRocket (session replay)
- New Relic (performance monitoring)
- DataDog (infrastructure monitoring)
```

---

## نکات مهم:

✅ **امنیت:**
- JWT tokens برای auth
- HTTPS هنگام deploy
- Rate limiting
- SQL Injection prevention

✅ **عملکرد:**
- Cache with Redis
- CDN for static files
- Database indexing
- Load balancing

✅ **پشتیبانی:**
- Error logging
- Uptime monitoring
- Auto-scaling
- Backup strategy

---

برای سوالات بیشتر، به support@worldwar.bot تماس بگیرید! 🚀
