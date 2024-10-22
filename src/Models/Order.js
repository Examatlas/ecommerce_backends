const mongoose = require("mongoose");
const Razorpay = require("razorpay");
const {Schema} = mongoose;
const OrderSchema = new mongoose.Schema({
  userId : 
    {
      type : Schema.Types.ObjectId,
      ref : "User",
      required : true
    },
    totalAmount :{
      type : Number,
      required: true
    },
    paymentMethod :{
      type : String,
      required : true,
      default : 'Razorpay'
    },
    
  status : {
    type : String,
    required: true,
    default : 'Pending'
  },
  billingDetailId : 
  {
    type : Schema.Types.ObjectId,
    ref : "BillingDetail",
    required : true
  },
  items : {
    type :  Array,
    required :  true
  },
  razorpay_order_id: {
    type: String,
    required: false,
  },
  razorpay_payment_id: {
    type: String,
    required: false,
  },
  razorpay_signature: {
    type: String,
    required: false,
  }
  // user id
  // examatlas order id 
});

const Order = mongoose.model("Order", OrderSchema);
module.exports = Order;
