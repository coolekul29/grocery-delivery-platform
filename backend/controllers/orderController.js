const Order = require("../models/Order");
const logger = require("../singleton/logger");

const {
  OrderCost,
  PromoDiscountDecorator,
  StudentDiscountDecorator,
  FreeDeliveryDecorator,
} = require("../decorator/discountDecorator");

const {
  OrderSubject,
  AdminObserver,
  ProcessingObserver,
} = require("../observer/orderObserver");

// Create new order
exports.createOrder = async (req, res) => {
  try {
    const { items, totalAmount, promoCode, isStudent } = req.body;

    let orderCost = new OrderCost(totalAmount);

    if (promoCode === "PROMO10") {
      orderCost = new PromoDiscountDecorator(orderCost);
    }

    if (isStudent === true) {
      orderCost = new StudentDiscountDecorator(orderCost);
    }

    if (totalAmount >= 50) {
      orderCost = new FreeDeliveryDecorator(orderCost);
    }

    const finalCost = orderCost.calculate();

    const order = new Order({
      items,
      totalAmount: finalCost.total,
      discount: finalCost.discount,
      deliveryFee: finalCost.deliveryFee,
      appliedDiscounts: finalCost.appliedDiscounts,
    });

    await order.save();

    logger.log(
    "ORDER",
    `New order created with total amount $${finalCost.total}`
    );

    const orderSubject = new OrderSubject();

    orderSubject.subscribe(new AdminObserver());
    orderSubject.subscribe(new ProcessingObserver());

    orderSubject.notify(order);

    res.status(201).json(order);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get all orders
exports.getOrders = async (req, res) => {
  try {
    const orders = await Order.find().sort({ createdAt: -1 });

    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Update order status
exports.updateOrderStatus = async (req, res) => {
  try {
    const { status } = req.body;

    const updatedOrder = await Order.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    );

    if (!updatedOrder) {
      return res.status(404).json({ message: "Order not found" });
    }

    res.json(updatedOrder);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Delete order
exports.deleteOrder = async (req, res) => {
  try {
    const deletedOrder = await Order.findByIdAndDelete(req.params.id);

    if (!deletedOrder) {
      return res.status(404).json({ message: "Order not found" });
    }

    res.json({ message: "Order deleted" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};