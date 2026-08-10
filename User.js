const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  telegramId: { type: String, required: true, unique: true, index: true },
  username: { type: String, required: true },
  email: { type: String, required: true, unique: true, index: true },
  firstName: String,
  lastName: String,
  profilePic: String,

  passwordHash: String,

  plan: { type: String, enum: ['free', 'pro', 'elite'], default: 'free' },
  subscriptionStart: Date,
  subscriptionEnd: Date,
  autoRenew: { type: Boolean, default: false },
  active: { type: Boolean, default: true },

  maxEmpires: { type: Number, default: 1 },
  activeEmpires: { type: Number, default: 0 },
  premiumFeatures: {
    apiAccess: Boolean,
    customMaps: Boolean,
    vipChat: Boolean,
    advancedStats: Boolean,
    diplomaticAlliances: Boolean,
    privateServer: Boolean,
    legendaryLeader: Boolean
  },

  paymentMethod: { type: String, enum: ['zarinpal', 'stripe', 'paypal', 'manual'] },
  paymentHistory: [{
    transactionId: String,
    amount: Number,
    currency: String,
    date: Date,
    status: String,
    planUpgraded: String
  }],

  totalSpent: { type: Number, default: 0 },
  lastPaymentDate: Date,
  paymentAttempts: { type: Number, default: 0 },

  verified: { type: Boolean, default: false },
  verificationCode: String,
  suspended: { type: Boolean, default: false },
  suspensionReason: String,

  language: { type: String, default: 'fa' },
  timezone: String,
  emailNotifications: { type: Boolean, default: true },
  telegramNotifications: { type: Boolean, default: true },

  referralCode: String,
  referredBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  tags: [String],
  notes: String,

  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
  lastLoginAt: Date
});

UserSchema.index({ plan: 1, active: 1 });
UserSchema.index({ subscriptionEnd: 1 });

module.exports = mongoose.model('User', UserSchema);
