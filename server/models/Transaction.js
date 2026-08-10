const mongoose = require('mongoose');

const TransactionSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
  type: { type: String, enum: ['subscription', 'upgrade', 'downgrade', 'renewal', 'refund'], required: true },
  amount: { type: Number, required: true },
  currency: { type: String, default: 'IRR' },
  planFrom: String,
  planTo: String,

  gateway: { type: String, enum: ['zarinpal', 'stripe', 'paypal', 'manual'], required: true },
  gatewayTransactionId: String,
  authority: String,
  clientSecret: String,

  status: { type: String, enum: ['pending', 'processing', 'success', 'failed', 'refunded'], default: 'pending' },
  failureReason: String,
  retryCount: { type: Number, default: 0 },

  initiatedAt: { type: Date, default: Date.now },
  completedAt: Date,
  refundedAt: Date,

  ipAddress: String,
  userAgent: String,
  invoiceNumber: String,

  createdAt: { type: Date, default: Date.now, index: true }
});

TransactionSchema.index({ userId: 1, status: 1 });
TransactionSchema.index({ gateway: 1, status: 1 });
TransactionSchema.index({ createdAt: -1 });

module.exports = mongoose.model('Transaction', TransactionSchema);
