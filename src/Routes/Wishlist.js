const express = require('express');
const { toggleWishlist, getWishlist, deleteWishlist } = require('../Controllers/Wishlist');
const router = express.Router();

// Toggle wishlist (add/remove)
router.post('/toggleWishlist', toggleWishlist);

// Get wishlist by user ID
router.get('/getWishlist/:userId', getWishlist);


// Remove from Wishlist route
router.delete("/remove/:itemId", deleteWishlist);


module.exports = router;
