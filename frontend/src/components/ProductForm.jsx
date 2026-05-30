import { useState, useEffect } from "react";
import axios from "axios";

const API_BASE_URL = process.env.REACT_APP_API_URL || "";

const ProductForm = ({ products, setProducts, editingProduct, setEditingProduct }) => {
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    category: "",
    price: "",
    stock: "",
  });

  useEffect(() => {
    if (editingProduct) {
      // Fill the form when editing a product
      setFormData({
        name: editingProduct.name || "",
        description: editingProduct.description || "",
        category: editingProduct.category || "",
        price: editingProduct.price || "",
        stock: editingProduct.stock || "",
      });
    } else {
      // Clear the form when adding a new product
      setFormData({
        name: "",
        description: "",
        category: "",
        price: "",
        stock: "",
      });
    }
  }, [editingProduct]);

  // Update form values while typing
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      // Change price and stock into numbers
      const productData = {
        ...formData,
        price: Number(formData.price),
        stock: Number(formData.stock),
      };

      if (editingProduct) {
        // Update existing product
        const response = await axios.put(
          `${API_BASE_URL}/api/products/${editingProduct._id}`,
          productData
        );

        setProducts(
          products.map((product) =>
            product._id === response.data._id ? response.data : product
          )
        );
      } else {
        // Add new product
        const response = await axios.post(
          `${API_BASE_URL}/api/products`,
          productData
        );

        setProducts([...products, response.data]);
      }

      // Reset form after saving
      setEditingProduct(null);
      setFormData({
        name: "",
        description: "",
        category: "",
        price: "",
        stock: "",
      });
    } catch (error) {
      console.error("Failed to save product:", error);
      alert("Failed to save product. Please try again.");
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <h4 className="fw-bold mb-3">
        {editingProduct ? "Edit Grocery Product" : "Add New Grocery Product"}
      </h4>

      <p className="text-muted mb-4">
        Use this form to create or update product information in the grocery
        catalogue.
      </p>

      <div className="row g-3">
        <div className="col-md-6">
          <label className="form-label fw-semibold">Product Name</label>
          <input
            type="text"
            name="name"
            placeholder="Example: Apple"
            value={formData.name}
            onChange={handleChange}
            className="form-control form-control-lg"
            required
          />
        </div>

        <div className="col-md-6">
          <label className="form-label fw-semibold">Category</label>
          <select
            name="category"
            value={formData.category}
            onChange={handleChange}
            className="form-select form-select-lg"
            required
          >
            <option value="">Select category</option>
            <option value="Fruits">Fruits</option>
            <option value="Vegetables">Vegetables</option>
            <option value="Meat">Meat</option>
            <option value="Dairy">Dairy</option>
            <option value="Bakery">Bakery</option>
          </select>
        </div>

        <div className="col-md-6">
          <label className="form-label fw-semibold">Price</label>
          <input
            type="number"
            name="price"
            placeholder="Example: 3.00"
            value={formData.price}
            onChange={handleChange}
            className="form-control form-control-lg"
            min="0"
            step="0.01"
            required
          />
        </div>

        <div className="col-md-6">
          <label className="form-label fw-semibold">Stock Quantity</label>
          <input
            type="number"
            name="stock"
            placeholder="Example: 100"
            value={formData.stock}
            onChange={handleChange}
            className="form-control form-control-lg"
            min="0"
            required
          />
        </div>

        <div className="col-12">
          <label className="form-label fw-semibold">Description</label>
          <textarea
            name="description"
            placeholder="Enter a short product description"
            value={formData.description}
            onChange={handleChange}
            className="form-control form-control-lg"
            rows="3"
          />
        </div>
      </div>

      <div className="d-flex gap-3 mt-4">
        <button type="submit" className="btn btn-success btn-lg fw-semibold px-4">
          {editingProduct ? "Update Product" : "Add Product"}
        </button>

        {editingProduct && (
          <button
            type="button"
            className="btn btn-outline-secondary btn-lg px-4"
            onClick={() => setEditingProduct(null)}
          >
            Cancel
          </button>
        )}
      </div>
    </form>
  );
};

export default ProductForm;