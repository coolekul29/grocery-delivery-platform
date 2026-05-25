import React, { useCallback, useEffect, useState } from "react";
import axios from "axios";

const API_BASE_URL = process.env.REACT_APP_API_URL || "http://localhost:5001"

const ProductList = () => {
  const [products, setProducts] = useState([]);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("");

  const fetchProducts = useCallback(async () => {
    try {
      setError("");

      const response = await axios.get(`${API_BASE_URL}/api/products`, {
        params: {
          search,
          category,
        },
      });

      setProducts(response.data);
    } catch (error) {
      console.error("Error fetching products:", error);
      setError("Unable to load products. Please try again later.");
    }
  }, [search, category]);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  const handleDeleteProduct = async (productId) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this product?"
    );

    if (!confirmDelete) {
      return;
    }

    try {
      await axios.delete(`${API_BASE_URL}/api/products/${productId}`);

      alert("Product deleted successfully.");

      fetchProducts();
    } catch (error) {
      console.error("Error deleting product:", error);

      alert("Failed to delete product. Please try again.");
    }
  };

  return (
    <div className="container mt-5">
      <h2 className="mb-4">Product Listings</h2>

      <div className="row mb-4">
        <div className="col-md-8 mb-2">
          <input
            type="text"
            className="form-control"
            placeholder="Search products by name..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        <div className="col-md-4 mb-2">
          <select
            className="form-select"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
          >
            <option value="">All Categories</option>
            <option value="Fruits">Fruits</option>
            <option value="Vegetables">Vegetables</option>
            <option value="Meat">Meat</option>
            <option value="Dairy">Dairy</option>
            <option value="Bakery">Bakery</option>
          </select>
        </div>
      </div>

      <div className="row">
        {error && <div className="alert alert-danger">{error}</div>}

        {products.length === 0 ? (
          <div className="alert alert-info">
            No products found. Please try another search or filter.
          </div>
        ) : (
          <div className="row">
            {products.map((product) => (
              <div className="col-md-4 mb-4" key={product._id}>
                <div className="card h-100 shadow-sm">
                  {product.image && (
                    <img
                      src={`${API_BASE_URL}${product.image}`}
                      alt={product.name}
                      loading="lazy"
                      className="card-img-top"
                      style={{
                        height: "250px",
                        objectFit: "cover",
                      }}
                    />
                  )}

                  <div className="card-body">
                    <h5 className="card-title">{product.name}</h5>

                    <p className="card-text">{product.description}</p>

                    <p>
                      <strong>Category:</strong> {product.category}
                    </p>

                    <p>
                      <strong>Price:</strong> ${product.price}
                    </p>

                    <p>
                      <strong>Stock:</strong> {product.stock}
                    </p>

                    <button
                      className="btn btn-danger w-100 mt-2"
                      onClick={() => handleDeleteProduct(product._id)}
                    >
                      Delete Product
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductList;