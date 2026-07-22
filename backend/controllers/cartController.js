const Cart = require('../models/Cart');
const CartItem = require('../models/CartItem');
const Product = require('../models/Product');

// @desc    Get user cart
// @route   GET /api/cart
// @access  Private
const getCart = async (req, res) => {
  try {
    let cart = await Cart.findOne({ user_id: req.user._id });
    
    if (!cart) {
      cart = await Cart.create({ user_id: req.user._id });
    }

    const cartItems = await CartItem.find({ cart_id: cart._id }).populate('product_id');

    // Format for frontend
    const formattedItems = cartItems.map(item => {
      // If product was deleted, return null and filter it out later
      if (!item.product_id) return null;
      
      return {
        ...item.product_id._doc,
        qty: item.quantity,
        selectedSize: item.size,
        cartItemId: `${item.product_id._id}-${item.size}`
      };
    }).filter(item => item !== null);

    res.json(formattedItems);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error fetching cart' });
  }
};

// @desc    Sync cart from frontend to backend
// @route   PUT /api/cart
// @access  Private
const syncCart = async (req, res) => {
  try {
    const { items } = req.body; // Array of frontend cart items

    let cart = await Cart.findOne({ user_id: req.user._id });
    if (!cart) {
      cart = await Cart.create({ user_id: req.user._id });
    }

    // Clear existing cart items for this cart
    await CartItem.deleteMany({ cart_id: cart._id });

    // Insert new ones
    if (items && items.length > 0) {
      const cartItemsToInsert = items.map(item => ({
        cart_id: cart._id,
        product_id: item._id, // frontend stores product object
        size: item.selectedSize || '',
        quantity: item.qty || 1
      }));
      
      await CartItem.insertMany(cartItemsToInsert);
    }

    res.json({ message: 'Cart synchronized successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error syncing cart' });
  }
};

module.exports = {
  getCart,
  syncCart
};
