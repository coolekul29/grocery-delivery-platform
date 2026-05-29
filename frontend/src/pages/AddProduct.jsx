import React, { useState } from "react";
import axios from "axios";

const API_BASE_URL = process.env.REACT_APP_API_URL || "http://localhost:5001";

const AddProduct = () => {
  const [productData, setProductData] = useState({
    name: "",
    description: "",
    price: "",
    category: "",
    stock: "",
    image: null,
  });

  const [errors, setErrors] = useState({});

  // Update input values
  const handleChange = (e) => {
    const { name, value, files } = e.target;

    setProductData({
      ...productData,
      [name]: files ? files[0] : value,
    });

    // Clear error when user types again
    setErrors({
      ...errors,
      [name]: "",
    });
  };

  // Check required fields
  const validateForm = () => {
    const newErrors = {};

    if (!productData.name.trim()) {
      newErrors.name = "Product name is required.";
    }

    if (!productData.description.trim()) {
      newErrors.description = "Description is required.";
    }

    if (!productData.price) {
      newErrors.price = "Price is required.";
    } else if (Number(productData.price) <= 0) {
      newErrors.price = "Price must be greater than 0.";
    }

    if (!productData.category.trim()) {
      newErrors.category = "Category is required.";
    }

    if (!productData.stock) {
      newErrors.stock = "Stock quantity is required.";
    } else if (Number(productData.stock) < 0) {
      newErrors.stock = "Stock quantity cannot be negative.";
    }

    setErrors(newErrors);

    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    try {
      // Use FormData because product image can be uploaded
      const formData = new FormData();

      formData.append("name", productData.name);
      formData.append("description", productData.description);
      formData.append("price", productData.price);
      formData.append("category", productData.category);
      formData.append("stock", productData.stock);

      if (productData.image) {
        formData.append("image", productData.image);
      }

      await axios.post(`${API_BASE_URL}/api/products`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      alert("Product added successfully!");

      // Clear form after product is added
      setProductData({
        name: "",
        description: "",
        price: "",
        category: "",
        stock: "",
        image: null,
      });

      document.getElementById("imageFileInput").value = "";
    } catch (error) {
      console.error("Failed to add product:", error);
      alert("Failed to add product.");
    }
  };

  return (
    <div className="container mt-5">
      <h2 className="mb-4">Add Product</h2>

      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <label className="form-label">Product Name</label>
          <input
            type="text"
            className={`form-control ${errors.name ? "is-invalid" : ""}`}
            name="name"
            value={productData.name}
            onChange={handleChange}
          />
          {errors.name && <div className="invalid-feedback">{errors.name}</div>}
        </div>

        <div className="mb-3">
          <label className="form-label">Description</label>
          <textarea
            className={`form-control ${errors.description ? "is-invalid" : ""}`}
            name="description"
            rows="3"
            value={productData.description}
            onChange={handleChange}
          ></textarea>
          {errors.description && (
            <div className="invalid-feedback">{errors.description}</div>
          )}
        </div>

        <div className="mb-3">
          <label className="form-label">Price</label>
          <input
            type="number"
            className={`form-control ${errors.price ? "is-invalid" : ""}`}
            name="price"
            value={productData.price}
            onChange={handleChange}
          />
          {errors.price && <div className="invalid-feedback">{errors.price}</div>}
        </div>

        <div className="mb-3">
          <label className="form-label">Category</label>
          <input
            type="text"
            className={`form-control ${errors.category ? "is-invalid" : ""}`}
            name="category"
            value={productData.category}
            onChange={handleChange}
          />
          {errors.category && (
            <div className="invalid-feedback">{errors.category}</div>
          )}
        </div>

        <div className="mb-3">
          <label className="form-label">Stock Quantity</label>
          <input
            type="number"
            className={`form-control ${errors.stock ? "is-invalid" : ""}`}
            name="stock"
            value={productData.stock}
            onChange={handleChange}
          />
          {errors.stock && <div className="invalid-feedback">{errors.stock}</div>}
        </div>

        <div className="mb-3">
          <label className="form-label">Product Image</label>
          <input
            type="file"
            id="imageFileInput"
            className="form-control"
            name="image"
            onChange={handleChange}
          />
        </div>

        <button type="submit" className="btn btn-primary">
          Add Product
        </button>
      </form>
    </div>
  );
};

export default AddProduct;