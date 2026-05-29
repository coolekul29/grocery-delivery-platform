const mongoose = require("mongoose");

const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Product name is required"],

      // Remove extra spaces
      trim: true,
    },

    description: {
      type: String,
      required: [true, "Product description is required"],
    },

    price: {
      type: Number,
      required: [true, "Product price is required"],

      // Price cannot be below 0
      min: [0, "Price cannot be a negative value"],
    },

    category: {
      type: String,
      required: [true, "Product category is required"],

      // Save category in lowercase
      lowercase: true,
    },

    stock: {
      type: Number,
      required: [true, "Product stock count is required"],

      // Stock cannot be negative
      min: [0, "Stock cannot fall below zero"],
    },

    image: {
      type: String,

      // Save uploaded image path
      default: "",
    },
  },

  // Add createdAt and updatedAt automatically
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Product", productSchema);