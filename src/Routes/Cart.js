// routes/cartRoutes.js
const express = require('express');
const { addToCart, getCart, removeFromCart, updateCartItemQuantity } = require('../Controllers/Cart');

const router = express.Router();

// Add item to cart
router.post('/add', addToCart);

// Get cart for a specific user
router.get('/get/:userId', getCart);

// Remove item from cart
router.delete('/remove', removeFromCart);

router.put('/update',updateCartItemQuantity );


module.exports = router;
