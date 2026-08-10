const mongoose = require('mongoose');

const SubscriptionSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
  plan: { type: String, enum: ['free', 'pro', 'elite'], required: true },

  billing: {
    cycle: { type: String, enum: ['monthly', 'annual'], default: 'monthly' },
    pricePerCycle: Number,
    currency: { type: String, default: 'IRR' },
    discount: { percentage: Number, endDate: Date, reason: String }
  },

  period: {
    startDate: { type: Date, required: true },
    endDate: { type: Date, required: true },
    daysRemaining: Number
  },

  features: {
    empires: Number,
    storage: Number,
    apiCalls: Number,
    customMaps: Boolean,
    advancedStats: Boolean,
    prioritySupport: Boolean,
    customEvents: Boolean,
    privateAllianceServer: Boolean
  },

  status: { type: String, enum: ['active', 'paused', 'expired', 'cancelled'], default: 'active' },
  autoRenew: { type: Boolean, default: true },
  paymentMethod: String,

  cancellation: { cancelledAt: Date, reason: String, feedback: String },

  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

SubscriptionSchema.index({ userId: 1, status: 1 });
SubscriptionSchema.index({ 'period.endDate': 1, status: 1 });

module.exports = mongoose.model('Subscription', SubscriptionSchema);
