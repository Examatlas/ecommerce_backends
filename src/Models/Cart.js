// models/Cart.js
const mongoose = require('mongoose');

// CartItem schema
const cartItemSchema = new mongoose.Schema({
  bookId: { type: mongoose.Schema.Types.ObjectId, ref: 'Book', required: true },
  quantity: { type: Number, required: true, default: 1 }
});

// Cart schema
const cartSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  items: [cartItemSchema]
});

const Cart = mongoose.model('Cart', cartSchema);
module.exports = Cart;
