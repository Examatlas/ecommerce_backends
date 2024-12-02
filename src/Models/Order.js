const mongoose = require("mongoose");
const Razorpay = require("razorpay");
const {Schema} = mongoose;
const {getNextSequence} = require('../Utilis/getNextSequence'); // Path to your utility function
const BillingDetail = require("./BillingDetail");

const orderSchema = new mongoose.Schema({
  orderId: {
    type: String,
    unique: true,
  },
  razorpayOrderId: {
    type: String,
    required: false,
    unique: true,
  },
  razorpayReceipt: { type: String},
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  items: {
    type :  Array,
    required :  true
  },
  totalAmount: { type: Number, required: true },
  shippingCharges: { type: Number, required: true, default:0 },
  taxAmount: { type: Number, default: 0},
  discounts: { type: Number, default: 0 },
  finalAmount: { type: Number, required: true },
  paymentMethod: {
    type: String,
    enum: ['Razorpay', 'COD'],
    required: true,
    default: 'Razorpay',
  },
  status: {
    type: String,
    enum: ['Pending', 'Confirmed', 'Shipped', 'Delivered', 'Failed', 'Cancelled'],
    default: 'Pending',
  },
  shippingDetailId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'BillingDetail',
    required: true,
  },
  isShippingBillingSame: { type: Boolean, default: true},
  billingDetailId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'BillingDetail',
    required: false,
    default: null,
  },
  shipping: { type: mongoose.Schema.Types.ObjectId, ref: 'Shipping' },
  isActive: { type: Boolean, default: true},
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

// Pre-save middleware to auto-generate the custom orderId
orderSchema.pre('save', async function (next) {
  if (!this.orderId) {
    const sequenceValue = await getNextSequence('orderId');
    const date = new Date();
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0'); // Months are 0-indexed
    const day = String(date.getDate()).padStart(2, '0');
    this.orderId = `CP${year}${month}${day}${String(sequenceValue).padStart(2, '0')}`;
  }
  next();
});

module.exports = mongoose.model('Order', orderSchema);
