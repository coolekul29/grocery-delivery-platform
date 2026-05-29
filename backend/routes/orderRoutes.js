const express = require("express");
const orderController = require("../controllers/orderController");

const router = express.Router();

/* Order routes */

// Create a new order
router.post("/", orderController.createOrder);

// Get all orders
router.get("/", orderController.getOrders);

// Update order status
router.put("/:id", orderController.updateOrderStatus);

// Delete an order
router.delete("/:id", orderController.deleteOrder);

module.exports = router;