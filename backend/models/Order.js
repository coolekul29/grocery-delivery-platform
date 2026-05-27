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

          // Quantity must be at least 1
          min: [1, "Quantity cannot be less than 1"],
        },
      },
    ],

    totalAmount: {
      type: Number,
      required: true,
    },

    status: {
      type: String,

      // Allowed order status values
      enum: ["Pending", "Processing", "Delivered", "Cancelled"],

      default: "Pending",
    },
  },

  // Automatically adds createdAt and updatedAt
  { timestamps: true }
);

module.exports = mongoose.model("Order", orderSchema);