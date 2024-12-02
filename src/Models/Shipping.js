const mongoose = require('mongoose');

const ShippingSchema = new mongoose.Schema({
    orderId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Order',
        required: true,
        unique: true
      },
  shipRocketOrderId: String,
  shipmentId: String,
  channelId: Number,
  channelName: String,
  channelOrderId: String,
  customerDetails: {
    name: String,
    email: String,
    phone: String,
    address: String,
    address2: String,
    city: String,
    state: String,
    country: String,
    pincode: String,
  },
  pickupDetails: {
    pickupCode: String,
    location: String,
    locationId: Number,
    pickupAddress: String,
    address2: String,
    city: String,
    state: String,
    country: String,
    phone: String,
    email: String,
  },
  paymentDetails: {
    method: String,
    status: String,
    totalAmount: Number,
    netTotal: Number,
    discounts: Number,
    shippingCharges: Number,
    cod: Boolean,
    tax: Number,
  },
  productDetails: [
    {
      id: Number,
      name: String,
      sku: String,
      price: Number,
      quantity: Number,
      discount: Number,
      netTotal: Number,
    },
  ],
  shipmentDetails: {
    id: Number,
    cost: Number,
    tax: Number,
    weight: Number,
    volumetricWeight: Number,
    dimensions: String,
    courier: String,
    status: String,
    awb: String,
    etd: String,
    deliveredDate: String,
  },
  invoiceDetails: {
    invoiceNo: String,
    invoiceDate: Date,
    invoiceLink: String,
  },
  orderStatus: {
    status: String,
    subStatus: String,
    statusCode: Number,
    createdAt: Date,
    updatedAt: Date,
    orderDate: Date,
  },
  riskDetails: {
    rtoRisk: String,
    addressRisk: String,
    orderRisk: String,
    addressScore: String,
    addressCategory: String,
  },
  trackingDetails: {
    ewayBillNumber: String,
    ewayBillDate: Date,
    lastMileAwb: String,
    lastMileCourierName: String,
    awbTrackUrl: String,
  },
  comments: String,
});

module.exports = mongoose.model('Shipping', ShippingSchema);