const Cart = require("../model/Cart");

exports.addToCart = async (req, res) => {
  const cart = new Cart(req.body);
  try {
    const doc = await cart.save();
    res.status(201).json(doc);
  } catch (err) {
    res.status(400).json(err);
  }
};

exports.fetchCartByUser = async (req, res) => {
  const { user } = req.query;

  try {
    const cartItems = await Cart.find({ user: user })
      .populate("user")
      .populate("product");
    res.status(200).json(cartItems);
  } catch (err) {
    res.status(400).json(err);
  }
};
