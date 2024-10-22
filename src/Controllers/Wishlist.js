const Wishlist = require("../Models/Wishlist");

// Add or remove item from wishlist
exports.toggleWishlist = async (req, res) => {
  try {
    const { userId, bookId } = req.body;

    const existingItem = await Wishlist.findOne({ userId, bookId });

    if (existingItem) {
      // Remove item if already in wishlist
      await Wishlist.deleteOne({ userId, bookId });
      return res.status(200).json({status:true, message: 'Item removed from wishlist'});
    }

    // Add item if not already in wishlist
    const wishlistItem = new Wishlist({ userId, bookId });
    await wishlistItem.save();
    return res.status(200).json({status:true, message: 'Item added to wishlist',wishlistItem });
  } catch (error) {
    res.status(500).json({status:false, message: 'Server Error', error });
  }
};


// Get all wishlist items for a user
exports.getWishlist = async (req, res) => {
  try {
    const { userId } = req.params;

    const wishlistItems = await Wishlist.find({ userId }).populate('bookId');
    res.status(200).json({status:true, message: "wishlist retrived successfully!! " ,wishlistItems});
  } catch (error) {
    res.status(500).json({status:false, message: 'your wishlist is empty' });
  }
};



// Remove from Wishlist
exports.deleteWishlist = async (req, res) => {
  try {
    const { itemId } = req.params; // Extract itemId from request parameters
    const deletedItem = await Wishlist.findByIdAndDelete(itemId);

    if (!deletedItem) {
      return res.status(404).json({ message: "Item not found" });
    }

    return res.status(200).json({status:true, message: "Item removed from wishlist" });
  } catch (error) {
    console.error(error);
    return res.status(500).json({status:false, message: "Failed to remove item from wishlist" });
  }
};
