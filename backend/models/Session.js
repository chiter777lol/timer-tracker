const mongoose = require('mongoose');

const sessionSchema = new mongoose.Schema({
  projectId: { type: mongoose.Schema.Types.ObjectId, ref: 'Project', required: true },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  startTime: { type: Date, required: true },
  endTime: { type: Date },
  duration: { type: Number, default: 0 }, // в минутах
  note: { type: String, default: '' },
  isActive: { type: Boolean, default: true }
});

module.exports = mongoose.model('Session', sessionSchema);
