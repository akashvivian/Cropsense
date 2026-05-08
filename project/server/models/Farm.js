const mongoose = require('mongoose');

const farmSchema = new mongoose.Schema({
  name: {
    type: String,
    required: false,
    default: 'My Farm'
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  lat: {
    type: Number,
    required: true
  },
  lng: {
    type: Number,
    required: true
  },
  N: {
    type: Number,
    required: true
  },
  P: {
    type: Number,
    required: true
  },
  K: {
    type: Number,
    required: true
  },
  ph: {
    type: Number,
    required: true
  },
  rainfall: {
    type: Number,
    required: true
  },
  lastCrop: {
    type: String,
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Farm', farmSchema);
