import React, { useState } from "react";

const AddProduct = () => {
  const [productData, setProductData] = useState({
    name: "",
    description: "",
    price: "",
    category: "",
    stock: "",
    image: null,
  });

  const handleChange = (e) => {
    const { name, value, files } = e.target;

    setProductData({
      ...productData,
      [name]: files ? files[0] : value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    console.log("Product Data:", productData);
  };

  return (
    <div className="container mt-5">
      <h2 className="mb-4">Add Product</h2>

      <form onSubmit={handleSubmit}>
        {/* Product Name */}
        <div className="mb-3">
          <label className="form-label">Product Name</label>
          <input
            type="text"
            className="form-control"
            name="name"
            value={productData.name}
            onChange={handleChange}
          />
        </div>

        {/* Description */}
        <div className="mb-3">
          <label className="form-label">Description</label>
          <textarea
            className="form-control"
            name="description"
            rows="3"
            value={productData.description}
            onChange={handleChange}
          ></textarea>
        </div>

        {/* Price */}
        <div className="mb-3">
          <label className="form-label">Price</label>
          <input
            type="number"
            className="form-control"
            name="price"
            value={productData.price}
            onChange={handleChange}
          />
        </div>

        {/* Category */}
        <div className="mb-3">
          <label className="form-label">Category</label>
          <input
            type="text"
            className="form-control"
            name="category"
            value={productData.category}
            onChange={handleChange}
          />
        </div>

        {/* Stock */}
        <div className="mb-3">
          <label className="form-label">Stock Quantity</label>
          <input
            type="number"
            className="form-control"
            name="stock"
            value={productData.stock}
            onChange={handleChange}
          />
        </div>

        {/* Product Image */}
        <div className="mb-3">
          <label className="form-label">Product Image</label>
          <input
            type="file"
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