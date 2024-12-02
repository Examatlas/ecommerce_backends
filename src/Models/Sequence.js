const mongoose = require('mongoose');

const sequenceSchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true }, // E.g., 'orderId'
  sequenceValue: { type: Number, required: true },      // Current sequence value
});

const Sequence = mongoose.model('Sequence', sequenceSchema);

module.exports = Sequence;
