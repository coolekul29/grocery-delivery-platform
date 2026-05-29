const express = require("express");
const productController = require("../controllers/productController");
const upload = require("../middleware/uploadMiddleware");

const router = express.Router();

/* Product routes */

// Get all products
router.get("/", productController.getProducts);

// Create a product with image upload
router.post("/", upload.single("image"), productController.createProduct);

// Update product details or image
router.put("/:id", upload.single("image"), productController.updateProduct);

// Delete a product
router.delete("/:id", productController.deleteProduct);

module.exports = router;