const mongoose = require('mongoose');

const wishlistSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  bookId: { type: mongoose.Schema.Types.ObjectId, ref: 'Book', required: true },
  IsInWishlist : { type: Boolean, default: false },
});

const Wishlist = mongoose.model('Wishlist', wishlistSchema);

module.exports = Wishlist;
