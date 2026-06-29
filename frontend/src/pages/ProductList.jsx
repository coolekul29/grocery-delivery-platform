import React, { useEffect, useState } from "react";
import axios from "axios";

const ProductList = () => {
  const [products, setProducts] = useState([]);
  const [error, setError] = useState("");
  const [sortBy, setSortBy] = useState("newest");

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

      setError(
        "Unable to load products. Please try again later."
      );
    }
  };

  // Sort products
  const sortedProducts = [...products].sort((a, b) => {
    switch (sortBy) {
      case "category":
        return a.category.localeCompare(b.category);

      case "priceLowHigh":
        return Number(a.price) - Number(b.price);

      case "priceHighLow":
        return Number(b.price) - Number(a.price);

      case "name":
        return a.name.localeCompare(b.name);

      case "newest":
      default:
        // Use createdAt if available
        if (a.createdAt && b.createdAt) {
          return new Date(b.createdAt) - new Date(a.createdAt);
        }

        // Fallback for MongoDB ObjectId
        return b._id.localeCompare(a._id);
    }
  });

  return (
    <div className="container mt-5">
      <h2 className="mb-4">Product Listings</h2>

      {/* Sort Dropdown */}
      <div className="d-flex justify-content-end mb-4">
        <select
          className="form-select w-auto"
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value)}
        >
          <option value="newest">Newest Products</option>
          <option value="name">Name (A-Z)</option>
          <option value="category">Category</option>
          <option value="priceLowHigh">Price: Low to High</option>
          <option value="priceHighLow">Price: High to Low</option>
        </select>
      </div>

      {error && (
        <div className="alert alert-danger">
          {error}
        </div>
      )}

      {products.length === 0 ? (
        <div className="alert alert-info">
          No products available at the moment.
        </div>
      ) : (
        <div className="row">
          {sortedProducts.map((product) => (
            <div className="col-md-4 mb-4" key={product._id}>
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
                  <h5 className="card-title">{product.name}</h5>

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