import React, { useEffect, useState, useMemo } from "react";
import axios from "axios";

const API_BASE_URL = process.env.REACT_APP_API_URL || "";

const ProductList = () => {
  const [products, setProducts] = useState([]);
  const [error, setError] = useState("");

  // Search, Filter & Sort
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [sortBy, setSortBy] = useState("newest");

  // Product categories
  const categories = useMemo(
    () => [
      { value: "fruits", label: "Fruits" },
      { value: "vegetables", label: "Vegetables" },
      { value: "meat", label: "Meat" },
      { value: "dairy", label: "Dairy" },
      { value: "bakery", label: "Bakery" },
    ],
    []
  );

  useEffect(() => {
    fetchProducts();
  }, [searchTerm, selectedCategory]);

  const fetchProducts = async () => {
    try {
      setError("");

      const response = await axios.get(
        `${API_BASE_URL}/api/products`,
        {
          params: {
            search: searchTerm || undefined,
            category:
              selectedCategory === "All"
                ? undefined
                : selectedCategory,
          },
        }
      );

      setProducts(response.data);
    } catch (error) {
      console.error("Error fetching products:", error);

      setError(
        "Unable to load products. Please try again later."
      );
    }
  };

  // Sort products
  const sortedProducts = [...products].sort((a, b) => {
    switch (sortBy) {
      case "name":
        return a.name.localeCompare(b.name);

      case "priceLowHigh":
        return Number(a.price) - Number(b.price);

      case "priceHighLow":
        return Number(b.price) - Number(a.price);

      case "newest":
      default:
        if (a.createdAt && b.createdAt) {
          return new Date(b.createdAt) - new Date(a.createdAt);
        }

        return b._id.localeCompare(a._id);
    }
  });

  return (
    <div className="container mt-5">
      <h2 className="mb-4">Product Listings</h2>

      {/* Search, Filter & Sort */}
      <div className="row mb-4">

        {/* Search */}
        <div className="col-md-4">
          <label className="form-label fw-bold">
            Search
          </label>

          <input
            type="text"
            className="form-control"
            placeholder="Search products..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        {/* Category Filter */}
        <div className="col-md-4">
          <label className="form-label fw-bold">
            Filter by Category
          </label>

          <select
            className="form-select"
            value={selectedCategory}
            onChange={(e) =>
              setSelectedCategory(e.target.value)
            }
          >
            <option value="All">
              All Categories
            </option>

            {categories.map((category) => (
              <option
                key={category.value}
                value={category.value}
              >
                {category.label}
              </option>
            ))}
          </select>
        </div>

        {/* Sort */}
        <div className="col-md-4">
          <label className="form-label fw-bold">
            Sort By
          </label>

          <select
            className="form-select"
            value={sortBy}
            onChange={(e) =>
              setSortBy(e.target.value)
            }
          >
            <option value="newest">
              Newest Products
            </option>

            <option value="name">
              Name (A-Z)
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
          No products found.
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
                    src={`${API_BASE_URL}${product.image}`}
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