require('dotenv').config();

const path = require('path');
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');

const authRoutes = require('./server/routes/auth');
const userRoutes = require('./server/routes/users');
const paymentRoutes = require('./server/routes/payments');
const adminRoutes = require('./server/routes/admin');

const app = express();
const PORT = process.env.PORT || 3000;

// --- امنیت و میدلورهای پایه ---
app.use(helmet({ contentSecurityPolicy: false }));
app.use(cors());
app.use(express.json());

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 دقیقه
  max: 300
});
app.use('/api/', limiter);

// --- اتصال به دیتابیس ---
mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log('✅ به MongoDB وصل شد'))
  .catch((err) => console.error('❌ خطا در اتصال به MongoDB:', err.message));

// --- مسیرهای API ---
app.use('/api', authRoutes);
app.use('/api', userRoutes);
app.use('/api', paymentRoutes);
app.use('/api/admin', adminRoutes);

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', time: new Date().toISOString() });
});

// --- فایل‌های استاتیک فرانت‌اند (بعد از build) ---
app.use(express.static(path.join(__dirname, 'build')));

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'build', 'index.html'));
});

app.listen(PORT, () => {
  console.log(`🚀 سرور روی پورت ${PORT} اجرا شد`);
});
