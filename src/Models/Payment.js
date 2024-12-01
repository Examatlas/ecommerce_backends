const mongoose = require('mongoose');

const paymentSchema = new mongoose.Schema({
  orderId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Order',
        required: true,
      },
  razorpayOrderId: { type: String },
  razorpayPaymentId: { type: String },
  razorpaySignature: { type: String },
  currency: { type: String, required: true },
  finalAmount: { type: Number, required: true },
  status: {
    type: String,
    enum: ['Initiated', 'Success', 'Failed', 'Refunded'],
    required: true,
    default: 'Initiated',
  },
  method: {
    type: String,
    enum: ['Online', 'COD'],
    required: true,
    default: 'Online',
  },
  failureReason: { type: String },
  paidAt: { type: Date },
  failedAt: { type: Date },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Payment', paymentSchema);
