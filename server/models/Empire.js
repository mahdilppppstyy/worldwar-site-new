const mongoose = require('mongoose');

const EmpireSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
  name: { type: String, required: true },
  leader: { name: String, title: String },

  government: {
    type: { type: String, enum: ['democracy', 'monarchy', 'dictatorship', 'theocracy', 'republic'], default: 'monarchy' },
    stability: Number
  },

  resources: {
    population: { type: Number, default: 1000000 },
    gold: { type: Number, default: 50000 },
    oil: { type: Number, default: 10000 },
    uranium: { type: Number, default: 5000 },
    iron: { type: Number, default: 20000 },
    coal: { type: Number, default: 15000 },
    gas: { type: Number, default: 8000 },
    electricity: { type: Number, default: 12000 }
  },

  military: {
    troops: { type: Number, default: 0 },
    warships: { type: Number, default: 0 },
    aircraft: { type: Number, default: 0 },
    missiles: { type: Number, default: 0 },
    weapons: { type: Number, default: 0 }
  },

  cities: { type: Number, default: 1 },
  factories: { type: Number, default: 0 },
  militaryBases: { type: Number, default: 0 },
  researchLabs: { type: Number, default: 0 },

  power: { type: Number, default: 0 },
  rank: Number,
  winCount: { type: Number, default: 0 },
  lossCount: { type: Number, default: 0 },
  alliances: [{ allianceId: mongoose.Schema.Types.ObjectId, joinedAt: Date }],

  active: { type: Boolean, default: true },
  lastAttackTime: Date,
  lastDefenseTime: Date,

  foundedAt: { type: Date, default: Date.now },
  lastActivityAt: { type: Date, default: Date.now }
});

EmpireSchema.index({ userId: 1 });
EmpireSchema.index({ rank: 1 });
EmpireSchema.index({ power: -1 });

module.exports = mongoose.model('Empire', EmpireSchema);
