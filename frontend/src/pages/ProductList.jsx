import React, { useEffect, useState } from "react";
import axios from "axios";

const ProductList = () => {
  const [products, setProducts] = useState([]);
  const [error, setError] = useState("");
  const [sortBy, setSortBy] = useState("newest");
  const [selectedCategory, setSelectedCategory] = useState("All");

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      setError("");

      const response = await axios.get(
        "http://localhost:5001/api/products"
      );

      setProducts(response.data);
    } catch (error) {
      console.error("Error fetching products:", error);
      setError("Unable to load products. Please try again later.");
    }
  };

  // Get unique categories
  const categories = [
    "All",
    ...new Set(products.map((product) => product.category)),
  ];

  // Filter products by category
  const filteredProducts =
    selectedCategory === "All"
      ? products
      : products.filter(
          (product) => product.category === selectedCategory
        );

  // Sort filtered products
  const sortedProducts = [...filteredProducts].sort((a, b) => {
    switch (sortBy) {
      case "category":
        return a.category.localeCompare(b.category);

      case "name":
        return a.name.localeCompare(b.name);

      case "priceLowHigh":
        return Number(a.price) - Number(b.price);

      case "priceHighLow":
        return Number(b.price) - Number(a.price);

      case "newest":
      default:
        // If createdAt exists
        if (a.createdAt && b.createdAt) {
          return new Date(b.createdAt) - new Date(a.createdAt);
        }

        // MongoDB fallback
        return b._id.localeCompare(a._id);
    }
  });

  return (
    <div className="container mt-5">
      <h2 className="mb-4">Product Listings</h2>

      {/* Filter and Sort */}
      <div className="row mb-4">

        <div className="col-md-6">
          <label className="form-label fw-bold">
            Filter by Category
          </label>

          <select
            className="form-select"
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
          >
            {categories.map((category) => (
              <option
                key={category}
                value={category}
              >
                {category}
              </option>
            ))}
          </select>
        </div>

        <div className="col-md-6">
          <label className="form-label fw-bold">
            Sort By
          </label>

          <select
            className="form-select"
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
          >
            <option value="newest">
              Newest Products
            </option>

            <option value="name">
              Name (A-Z)
            </option>

            <option value="category">
              Category
            </option>

            <option value="priceLowHigh">
              Price: Low to High
            </option>

            <option value="priceHighLow">
              Price: High to Low
            </option>
          </select>
        </div>

      </div>

      {error && (
        <div className="alert alert-danger">
          {error}
        </div>
      )}

      {!error && sortedProducts.length === 0 ? (
        <div className="alert alert-info">
          No products available.
        </div>
      ) : (
        <div className="row">
          {sortedProducts.map((product) => (
            <div
              className="col-md-4 mb-4"
              key={product._id}
            >
              <div className="card h-100 shadow-sm">

                {product.image && (
                  <img
                    src={`http://localhost:5001${product.image}`}
                    alt={product.name}
                    className="card-img-top"
                    style={{
                      height: "250px",
                      objectFit: "cover",
                    }}
                  />
                )}

                <div className="card-body">

                  <h5 className="card-title">
                    {product.name}
                  </h5>

                  <p className="card-text">
                    {product.description}
                  </p>

                  <p>
                    <strong>Category:</strong>{" "}
                    {product.category}
                  </p>

                  <p>
                    <strong>Price:</strong> $
                    {Number(product.price).toFixed(2)}
                  </p>

                  <p>
                    <strong>Stock:</strong>{" "}
                    {product.stock}
                  </p>

                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ProductList;