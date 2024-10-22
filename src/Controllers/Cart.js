const Cart = require('../Models/Cart');

// Add to cart
exports.addToCart = async (req, res) => {
  const { userId, bookId } = req.body;

  try {
    let cart = await Cart.findOne({ userId });

    if (cart) {
      // Check if the item already exists in the cart
      const itemIndex = cart.items.findIndex(item => item.bookId.toString() === bookId);
      if (itemIndex > -1) {
        // If it exists, increment the quantity
        cart.items[itemIndex].quantity += 1;
      } else {
        // If it doesn't exist, add it to the cart
        cart.items.push({ bookId, quantity: 1 });
      }
    } else {
      // If no cart exists, create a new one for the user
      cart = new Cart({ userId, items: [{ bookId, quantity: 1 }] });
    }

    await cart.save();
    return res.status(200).json({ success: true, message: "Item added to cart", cart });
  } catch (error) {
    return res.status(500).json({ success: false, message: "Failed to add item to cart", error: error.message });
  }
};



// Get cart by user ID
exports.getCart = async (req, res) => {
  const { userId } = req.params;

  try {
    const cart = await Cart.findOne({ userId }).populate('items.bookId');
    if (!cart) {
      return res.status(404).json({ success: false, message: "Cart not found" });
    }
    return res.status(200).json({ success: true, cart , message : "cart item fetched successfully !!" });
  } catch (error) {
    return res.status(500).json({ success: false, message: "Failed to fetch cart", error: error.message });
  }
};



// // Remove item from cart
exports.removeFromCart = async (req, res) => {
  const { userId, itemId } = req.body;

  try {
    const cart = await Cart.findOne({ userId });

    if (!cart) {
      return res.status(404).json({ success: false, message: "Cart not found" });
    }

    // Remove the item from the cart
    cart.items = cart.items.filter(item => item._id.toString() !== itemId);

    await cart.save();
    return res.status(200).json({ success: true, message: "Item removed from cart", cart });
  } catch (error) {
    return res.status(500).json({ success: false, message: "Failed to remove item from cart", error: error.message });
  }
};



// Update item quantity in cart
exports.updateCartItemQuantity = async (req, res) => {
  const { userId, itemId, quantity } = req.body;

  try {
    const cart = await Cart.findOne({ userId });

    if (!cart) {
      return res.status(404).json({ success: false, message: "Cart not found" });
    }

    // Find the item in the cart
    const item = cart.items.id(itemId);
    if (!item) {
      return res.status(404).json({ success: false, message: "Item not found in cart" });
    }

    // Update the quantity
    if (quantity <= 0) {
      // If quantity is less than or equal to 0, remove the item from the cart
      cart.items = cart.items.filter(item => item._id.toString() !== itemId);
    } else {
      // Update the quantity
      item.quantity = quantity;
    }

    await cart.save();
    return res.status(200).json({ success: true, message: "Cart item updated successfully", cart });
  } catch (error) {
    return res.status(500).json({ success: false, message: "Failed to update cart item", error: error.message });
  }
};
