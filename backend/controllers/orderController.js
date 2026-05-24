const Order = require("../models/Order");

exports.createOrder = async (req, res) => {
  try {
    const { items, totalAmount } = req.body;

    const order = new Order({
      items,
      totalAmount,
      status: "Pending",
    });

    await order.save();

    res.status(201).json(order);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getOrders = async (req, res) => {
  try {
    const orders = await Order.find();
    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};