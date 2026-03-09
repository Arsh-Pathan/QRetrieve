const mongoose = require('mongoose');

const itemSchema = new mongoose.Schema({
  itemId: {
    type: String,
    required: true,
    unique: true,
    index: true,
  },
  ownerName: {
    type: String,
    required: true,
    trim: true,
  },
  ownerContact: {
    type: String,
    required: true,
    trim: true,
  },
  itemName: {
    type: String,
    required: true,
    trim: true,
  },
  status: {
    type: String,
    enum: ['safe', 'found'],
    default: 'safe',
  },
  createdAt: {
    type: Date,
    default: Date.now,
    index: true,
  },
});

module.exports = mongoose.model('Item', itemSchema);
