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
    image: null,
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
        image: null,
      });
    } else {
      // Clear the form when adding a new product
      setFormData({
        name: "",
        description: "",
        category: "",
        price: "",
        stock: "",
        image: null,
      });
    }
  }, [editingProduct]);

  // Update form values while typing
  const handleChange = (e) => {
    const { name, value, files } = e.target;

    setFormData({
      ...formData,
      [name]: files ? files[0] : value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      // Use FormData so image file can be uploaded
      const productData = new FormData();

      productData.append("name", formData.name);
      productData.append("description", formData.description);
      productData.append("category", formData.category);
      productData.append("price", Number(formData.price));
      productData.append("stock", Number(formData.stock));

      if (formData.image) {
        productData.append("image", formData.image);
      }

      if (editingProduct) {
        // Update existing product
        const response = await axios.put(
          `${API_BASE_URL}/api/products/${editingProduct._id}`,
          productData,
          {
            headers: {
              "Content-Type": "multipart/form-data",
            },
          }
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
          productData,
          {
            headers: {
              "Content-Type": "multipart/form-data",
            },
          }
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
        image: null,
      });

      const imageInput = document.getElementById("productImageInput");
      if (imageInput) {
        imageInput.value = "";
      }
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

        <div className="col-12">
          <label className="form-label fw-semibold">Product Image</label>
          <input
            type="file"
            id="productImageInput"
            name="image"
            accept="image/png, image/jpeg, image/jpg"
            onChange={handleChange}
            className="form-control form-control-lg"
          />
        </div>

        {editingProduct?.image && (
          <div className="col-12">
            <p className="text-muted mb-2">Current Image:</p>
            <img
              src={`${API_BASE_URL}${editingProduct.image}`}
              alt={editingProduct.name}
              style={{
                width: "120px",
                height: "120px",
                objectFit: "cover",
                borderRadius: "8px",
              }}
            />
          </div>
        )}
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