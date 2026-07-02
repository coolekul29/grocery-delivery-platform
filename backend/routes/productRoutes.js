const express = require("express");
const upload = require("../middleware/uploadMiddleware");

const {
  getProducts,
  createProduct,
  updateProduct,
  deleteProduct,
  cloneProduct,
} = require("../controllers/productController");

const router = express.Router();

/* Product routes */

// Get all products
router.get("/", getProducts);

// Create a product with image upload
router.post("/", upload.single("image"), createProduct);

// Update product details or image
router.put("/:id", upload.single("image"), updateProduct);

// Delete a product
router.delete("/:id", deleteProduct);

// Clone a product
router.post("/:id/clone", cloneProduct);

module.exports = router;