// // models/billingDetailModel.js
// const mongoose = require('mongoose');

// const BillingDetailSchema = new mongoose.Schema({
//   firstName: { type: String, required: true },
//   lastName: { type: String, required: true },
//   country: { type: String, required: true },
//   streetAddress: { type: String, required: true },
//   apartment: { type: String, default: '' },
//   city: { type: String, required: true },
//   state: { type: String, required: true },
//   pinCode: { type: String, required: true },
//   phone: { type: String, required: true },
//   email: { type: String, required: true }
// });

// module.exports = mongoose.model('BillingDetail', BillingDetailSchema);



const mongoose = require('mongoose');

const BillingDetailSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }, // Reference to User model
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  country: { type: String, required: true },
  streetAddress: { type: String, required: true },
  apartment: { type: String, default: '' },
  city: { type: String, required: true },
  state: { type: String, required: true },
  pinCode: { type: String, required: true },
  phone: { type: String, required: true },
  email: { type: String, required: true }
});

module.exports = mongoose.model('BillingDetail', BillingDetailSchema);
