const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema(
  {
    // List of items in the order
    items: [
      {
        productId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Product",
          required: true,
        },

        name: {
          type: String,
          required: true,
        },

        price: {
          type: Number,
          required: true,
        },

        quantity: {
          type: Number,
          required: true,
          min: [1, "Quantity cannot be less than 1"],
        },
      },
    ],

    // Final total amount after decorator discounts
    totalAmount: {
      type: Number,
      required: true,
    },

    // Total discount applied to the whole order
    discount: {
      type: Number,
      default: 0,
    },

    // Delivery fee for the whole order
    deliveryFee: {
      type: Number,
      default: 5,
    },

    // List of discounts applied
    appliedDiscounts: {
      type: [String],
      default: [],
    },

    status: {
      type: String,
      enum: ["Pending", "Processing", "Delivered", "Cancelled"],
      default: "Pending",
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Order", orderSchema);