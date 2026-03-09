const mongoose = require('mongoose');

const reportSchema = new mongoose.Schema({
  reportId: {
    type: String,
    required: true,
    unique: true,
  },
  itemId: {
    type: String,
    required: true,
    index: true,
  },
  finderName: {
    type: String,
    required: true,
    trim: true,
  },
  finderLocation: {
    type: String,
    required: true,
    trim: true,
  },
  finderContact: {
    type: String,
    default: '',
    trim: true,
  },
  message: {
    type: String,
    default: '',
    trim: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
    index: true,
  },
});

module.exports = mongoose.model('Report', reportSchema);
