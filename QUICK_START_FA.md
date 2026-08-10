# 🚀 راهنمای سریع - وبسایت اشتراک WorldWar Bot

<div dir="rtl">

## 📦 فایل‌های دریافتی

```
worldwar-subscription-site.jsx      ← کد React وبسایت کامل
SETUP_GUIDE_FA.md                   ← راهنمای تفصیلی راه‌اندازی
bot_integration.py                  ← ماژول اتصال ربات
package.json                        ← تمام npm packages مورد نیاز
database-schema.js                  ← معماری database MongoDB
README_FA.md                        ← مستندات کامل
QUICK_START_FA.md                   ← این فایل!
```

---

## 🎯 اولویت‌های اول

### مرحله ۱: تنظیم پایگاه داده (۵ دقیقه)

```bash
# وارد mongodb.com شوید
# یک Cluster رایگان بسازید
# اتصال string کپی کنید
# درون .env قرار دهید

MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/worldwar
```

### مرحله ۲: درگاه پرداخت (۱۰ دقیقه)

#### گزینه الف: Zarinpal (بهترین برای ایران)

```
1. zarinpal.com روی بروید
2. حساب تجاری بسازید
3. Merchant ID بگیرید
4. درون .env بریزید

ZARINPAL_MERCHANT_ID=xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx
```

#### گزینه ب: Stripe (جهانی)

```
1. stripe.com روی بروید
2. API Key بگیرید
3. درون .env بریزید

STRIPE_SECRET_KEY=sk_live_xxxxx
STRIPE_PUBLISHABLE_KEY=pk_live_xxxxx
```

### مرحله ۳: توکن ربات تلگرام (۲ دقیقه)

```bash
# با BotFather در تلگرام چت کنید
/newbot
# نام ربات: WorldWar Subscription
# توکن دریافت کنید
# درون .env بریزید

TELEGRAM_BOT_TOKEN=123456:ABC-DEF1234ghIkl-zyx57W2v1u123ew11
```

---

## ⚡ راه‌اندازی محلی (۱۰ دقیقه)

### 1. دانلود و نصب

```bash
# دانلود فایل‌ها
git clone <repository>
cd worldwar-bot-website

# نصب dependencies
npm install

# ایجاد .env
cp .env.example .env
# سپس .env را ویرایش کنید
```

### 2. شروع سرور

```bash
# Terminal 1 - Backend
npm run backend

# Terminal 2 - Frontend
npm run frontend

# Terminal 3 - ربات تلگرام
python bot_integration.py
```

### 3. بازدید وبسایت

```
http://localhost:3000
```

✅ **تمام شد!** وبسایت الان روی کامپیوتر شما اجرا می‌شه

---

## 📊 تست پرداخت

### بدون پول واقعی!

```
ZARINPAL - درگاه test:
شماره: 1234567890
CVV: 123
تاریخ: ۱۴/۹۹
```

```
STRIPE - درگاه test:
کارت: 4242 4242 4242 4242
تاریخ: ۱۲/۳۴
CVC: 123
```

---

## 🌐 استقرار به سرور

### بر روی Heroku (رایگان ۲ ساعت/ماه)

```bash
# 1. Login
heroku login

# 2. ایجاد اپ
heroku create worldwar-subscription

# 3. متغیرهای محیط
heroku config:set MONGODB_URI=mongodb+srv://...
heroku config:set TELEGRAM_BOT_TOKEN=...
heroku config:set ZARINPAL_MERCHANT_ID=...

# 4. Deploy
git push heroku main

# 5. نتیجه
https://worldwar-subscription.herokuapp.com
```

### بر روی Railway (بهترین!)

```bash
# 1. railway.app وارد شوید
# 2. GitHub repo متصل کنید
# 3. Database را اضافه کنید
# 4. بقیه خودکار!
```

### بر روی DigitalOcean ($5/ماه)

```bash
# 1. ssh به سرور
ssh root@your-ip

# 2. نصب Node.js
curl -fsSL https://deb.nodesource.com/setup_16.x | sudo -E bash -
sudo apt install nodejs

# 3. Clone & Deploy
git clone <repo>
cd worldwar-bot-website
npm install
npm start
```

---

## 🔑 متغیرهای محیط (.env)

کپی کنید و تکمیل کنید:

```env
# MongoDB
MONGODB_URI=mongodb+srv://user:pass@cluster.mongodb.net/worldwar

# Telegram
TELEGRAM_BOT_TOKEN=your_bot_token_here

# Payment - Zarinpal
ZARINPAL_MERCHANT_ID=your_merchant_id
ZARINPAL_API_KEY=your_api_key

# Payment - Stripe
STRIPE_SECRET_KEY=sk_live_xxxxx
STRIPE_PUBLISHABLE_KEY=pk_live_xxxxx

# Security
JWT_SECRET=your_secret_key_here
ENCRYPTION_KEY=your_encryption_key

# Website
WEBSITE_URL=https://yourdomain.com
API_URL=https://yourdomain.com/api
WEBHOOK_URL=https://yourdomain.com/webhook

# Email
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=your-app-password

# Node
NODE_ENV=production
PORT=3000
```

---

## 📱 طریقه کار

### 1. کاربر وارد وبسایت می‌شه
```
https://yourdomain.com
```

### 2. پلان خود را انتخاب می‌کنه
```
Free / Pro / Elite
```

### 3. روی دکمه "خریداری" کلیک می‌کنه
```
درگاه پرداخت باز می‌شه (Zarinpal/Stripe)
```

### 4. پول پرداخت می‌کنه
```
پیامی از ربات تلگرام دریافت می‌کنه
```

### 5. اشتراک فعال می‌شه
```
مزایای پلانش فوری فعال می‌شن
```

---

## 💰 درآمد‌زایی

### مثال ماهانه:
```
۱۰۰۰ کاربر × ۸۹۹۰۰ تومان (Pro) = ۸۹.۹ میلیون

۵۰۰ کاربر × ۲۹۹۹۰۰ تومان (Elite) = ۱۴۹.۹ میلیون

کل: ≈ ۲۴۰ میلیون تومان/ماه
```

---

## 🐛 خطاهای رایج و حل

### ❌ "Cannot connect to MongoDB"
```
✓ MongoDB URI درست است
✓ Firewall MongoDB باز است
✓ Password صحیح است
```

### ❌ "Telegram bot not responding"
```
✓ Token صحیح است
✓ Bot @BotFather فعال است
✓ Internet اتصال دارد
```

### ❌ "Payment gateway error"
```
✓ Merchant ID صحیح است
✓ Mode تنظیم درست است (test/production)
✓ HTTPS فعال است
```

---

## 📈 مراحل بعدی

### مهم:
- [ ] دامنه خود را خریدید
- [ ] SSL Certificate فعال کردید
- [ ] Telegram webhook تنظیم کردید
- [ ] Admin Panel تنظیم کردید

### بهبود:
- [ ] Email verification اضافه کنید
- [ ] Two-factor authentication اضافه کنید
- [ ] Analytics dashboard ساختید
- [ ] Referral system اضافه کنید

### بازاریابی:
- [ ] صفحه Instagram/TikTok بسازید
- [ ] YouTube فیلم‌های tutoring بسازید
- [ ] کانال تلگرام تشکیل دهید
- [ ] معرفی دوستان برنامه شروع کنید

---

## 📞 درخواست کمک

### اگر مشکلی دارید:

1. **Logs بررسی کنید:**
```bash
npm run dev 2>&1 | tee server.log
tail -f server.log
```

2. **Database عیب‌یابی:**
```javascript
// mongosh از terminal
use worldwar
db.users.find()
db.transactions.find()
```

3. **Discord Server:**
```
https://discord.gg/worldwar
```

4. **Email Support:**
```
support@worldwar.bot
```

---

## 🎉 موفقیت!

اگر تا اینجا رسیدید یعنی:
✅ وبسایت محلی شما اجرا می‌شه
✅ Database متصل است
✅ پرداخت‌ها کار می‌کنند
✅ ربات تلگرام کار می‌کنه

**الان فقط باید:**
1. دامنه خریدید
2. بر روی سرور مستقل Deploy کنید
3. سرو شروع کنید! 🚀

---

## 📚 فایل‌های مهم‌تر

| فایل | مقصد |
|------|------|
| `worldwar-subscription-site.jsx` | کد React وبسایت |
| `server.js` | Backend API |
| `bot_integration.py` | ربات تلگرام |
| `database-schema.js` | Database معماری |
| `README_FA.md` | مستندات کامل |
| `SETUP_GUIDE_FA.md` | راهنمای تفصیلی |

---

## 🔗 لینک‌های مفید

- [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
- [Heroku](https://www.heroku.com)
- [Railway](https://railway.app)
- [DigitalOcean](https://www.digitalocean.com)
- [Zarinpal](https://www.zarinpal.com)
- [Stripe](https://stripe.com)
- [Telegram Bot API](https://core.telegram.org/bots/api)

---

**نسخه:** 1.0.0
**آخر ویرایش:** 1403/5/17
**وضعیت:** ✅ آماده برای استقرار

---

</div>
