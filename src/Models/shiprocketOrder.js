const mongoose = require('mongoose');

const ShiprocketOrderSchema = new mongoose.Schema(
  {
    orderId: {
      type: String,
      required: true,
      unique: true,
    },
    awbCode: {
      type: String,
      default: null,
    },
    courierId: {
      type: String,
      default: null,
    },
    pickupScheduled: {
      type: Boolean,
      default: false,
    },
    orderDetails: {
      type: Object, 
      required: true,
    },
    status: {
      type: String,
      enum: ['pending', 'awb_generated', 'pickup_scheduled'],
      default: 'pending',
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
    updatedAt: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('ShiprocketOrder', ShiprocketOrderSchema);
