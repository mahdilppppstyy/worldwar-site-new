const mongoose = require('mongoose');

const AllianceSchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true },
  description: String,
  flag: String,
  logo: String,

  leader: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },

  members: [{
    userId: mongoose.Schema.Types.ObjectId,
    empireId: mongoose.Schema.Types.ObjectId,
    role: { type: String, enum: ['leader', 'officer', 'member'], default: 'member' },
    joinedAt: Date
  }],

  treasury: {
    gold: { type: Number, default: 0 },
    oil: Number,
    uranium: Number,
    resources: [{ type: String, amount: Number }]
  },

  stats: {
    totalPower: Number,
    wars: Number,
    alliances: Number,
    enemyCount: Number,
    territories: Number
  },

  level: { type: Number, default: 1 },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Alliance', AllianceSchema);
