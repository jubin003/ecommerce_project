import Cart from "../models/Cart.js";
import Vinyl from "../models/Vinyl.js";

// Get user's cart
export const getCart = async (req, res) => {
  try {
    const cart = await Cart.findOne({ user: req.params.userId })
      .populate({
        path: "items.vinyl",
        populate: { path: "song" },
      });

    if (!cart) {
      return res.status(200).json({ items: [] });
    }

    res.status(200).json(cart);
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: err.message });
  }
};

// Add item to cart
export const addToCart = async (req, res) => {
  try {
    const { userId, vinylId, quantity = 1 } = req.body;

    // Check if vinyl exists and has stock
    const vinyl = await Vinyl.findById(vinylId);
    if (!vinyl) {
      return res.status(404).json({ message: "Vinyl not found" });
    }

    if (vinyl.quantity < quantity) {
      return res.status(400).json({ message: "Insufficient stock" });
    }

    // Find or create cart
    let cart = await Cart.findOne({ user: userId });

    if (!cart) {
      cart = await Cart.create({
        user: userId,
        items: [{ vinyl: vinylId, quantity }],
      });
    } else {
      // Check if item already in cart
      const existingItem = cart.items.find(
        (item) => item.vinyl.toString() === vinylId
      );

      if (existingItem) {
        // Update quantity
        if (vinyl.quantity < existingItem.quantity + quantity) {
          return res.status(400).json({ message: "Insufficient stock" });
        }
        existingItem.quantity += quantity;
      } else {
        // Add new item
        cart.items.push({ vinyl: vinylId, quantity });
      }

      await cart.save();
    }

    const populatedCart = await Cart.findById(cart._id).populate({
      path: "items.vinyl",
      populate: { path: "song" },
    });

    res.status(200).json({ message: "Item added to cart", cart: populatedCart });
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: err.message });
  }
};

// Update cart item quantity
export const updateCartItem = async (req, res) => {
  try {
    const { userId, vinylId, quantity } = req.body;

    if (quantity < 1) {
      return res.status(400).json({ message: "Quantity must be at least 1" });
    }

    const vinyl = await Vinyl.findById(vinylId);
    if (!vinyl) {
      return res.status(404).json({ message: "Vinyl not found" });
    }

    if (vinyl.quantity < quantity) {
      return res.status(400).json({ message: "Insufficient stock" });
    }

    const cart = await Cart.findOne({ user: userId });
    if (!cart) {
      return res.status(404).json({ message: "Cart not found" });
    }

    const item = cart.items.find((item) => item.vinyl.toString() === vinylId);
    if (!item) {
      return res.status(404).json({ message: "Item not in cart" });
    }

    item.quantity = quantity;
    await cart.save();

    const populatedCart = await Cart.findById(cart._id).populate({
      path: "items.vinyl",
      populate: { path: "song" },
    });

    res.status(200).json({ message: "Cart updated", cart: populatedCart });
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: err.message });
  }
};

// Remove item from cart
export const removeFromCart = async (req, res) => {
  try {
    const { userId, vinylId } = req.body;

    const cart = await Cart.findOne({ user: userId });
    if (!cart) {
      return res.status(404).json({ message: "Cart not found" });
    }

    cart.items = cart.items.filter((item) => item.vinyl.toString() !== vinylId);
    await cart.save();

    const populatedCart = await Cart.findById(cart._id).populate({
      path: "items.vinyl",
      populate: { path: "song" },
    });

    res.status(200).json({ message: "Item removed from cart", cart: populatedCart });
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: err.message });
  }
};

// Clear cart
export const clearCart = async (req, res) => {
  try {
    const cart = await Cart.findOne({ user: req.params.userId });
    if (!cart) {
      return res.status(404).json({ message: "Cart not found" });
    }

    cart.items = [];
    await cart.save();

    res.status(200).json({ message: "Cart cleared" });
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: err.message });
  }
};