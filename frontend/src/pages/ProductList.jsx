import { useState, useEffect, useMemo, useCallback } from "react";
import axios from "axios";

const API_BASE_URL = process.env.REACT_APP_API_URL || "";

const ProductList = ({ cart, setCart }) => {
  const [products, setProducts] = useState([]);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("");
  const [cartMessage, setCartMessage] = useState("");

  // Product categories
  const categories = useMemo(
    () => ["Fruits", "Vegetables", "Meat", "Dairy", "Bakery"],
    []
  );

  // Load products from backend
  const fetchProducts = useCallback(async () => {
    try {
      setError("");

      const response = await axios.get(`${API_BASE_URL}/api/products`, {
        params: { search, category },
      });

      setProducts(response.data);
    } catch (error) {
      console.error("Failed to load products:", error);
      setError("Unable to load products. Please try again later.");
    }
  }, [search, category]);

  // Reload products when search or category changes
  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  const handleAddToCart = (product) => {
    const updatedCart = [...cart, product];

    setCart(updatedCart);
    localStorage.setItem("cart", JSON.stringify(updatedCart));

    setCartMessage(`${product.name} has been added to your cart.`);

    // Hide success message after a few seconds
    setTimeout(() => {
      setCartMessage("");
    }, 2500);
  };

  return (
    <div style={{ backgroundColor: "#f8fafc", minHeight: "100vh" }}>
      <section
        className="py-5 mb-4"
        style={{
          background: "linear-gradient(135deg, #198754 0%, #20c997 100%)",
          color: "white",
        }}
      >
        <div className="container">
          <div className="row align-items-center">
            <div className="col-lg-8">
              <p className="text-uppercase fw-semibold mb-2 opacity-75">
                Online Grocery Delivery
              </p>

              <h1 className="fw-bold mb-3">
                Fresh groceries delivered to you
              </h1>

              <p className="lead mb-0">
                Browse fresh grocery items, search by product name, filter by
                category, and add your favourites to cart.
              </p>
            </div>

            <div className="col-lg-4 text-lg-end mt-4 mt-lg-0">
              <span className="badge bg-light text-success fs-6 px-4 py-3 rounded-pill hero-badge">
                Fast • Fresh • Convenient
              </span>
            </div>
          </div>
        </div>
      </section>

      <main className="container pb-5">
        <div className="card border-0 shadow-sm mb-4">
          <div className="card-body p-4">
            <div className="row g-3 align-items-end">
              <div className="col-md-8">
                <label className="form-label fw-semibold">
                  Search Products
                </label>

                <input
                  type="text"
                  className="form-control form-control-lg"
                  placeholder="Search by product name..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
              </div>

              <div className="col-md-4">
                <label className="form-label fw-semibold">
                  Category
                </label>

                <select
                  className="form-select form-select-lg"
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                >
                  <option value="">All Categories</option>

                  {categories.map((categoryName) => (
                    <option key={categoryName} value={categoryName}>
                      {categoryName}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>
        </div>

        {cartMessage && (
          <div className="alert alert-success shadow-sm" role="alert">
            {cartMessage}
          </div>
        )}

        {error && (
          <div className="alert alert-danger shadow-sm" role="alert">
            {error}
          </div>
        )}

        <div className="d-flex justify-content-between align-items-center mb-3">
          <div>
            <h2 className="fw-bold mb-1">Browse Groceries</h2>

            <p className="text-muted mb-0">
              Showing {products.length} available product
              {products.length === 1 ? "" : "s"}
            </p>
          </div>
        </div>

        {products.length === 0 ? (
          <div className="card border-0 shadow-sm">
            <div className="card-body text-center p-5">
              <div className="fs-1 mb-3">🛒</div>

              <h4 className="fw-bold">No products found</h4>

              <p className="text-muted mb-0">
                Please try another search keyword or category filter.
              </p>
            </div>
          </div>
        ) : (
          <div className="row g-4">
            {products.map((product) => (
              <div className="col-sm-6 col-lg-4" key={product._id}>
                <div className="card h-100 border-0 shadow-sm product-card">
                  <div className="product-image-wrapper">
                    {product.image ? (
                      <img
                        src={`${API_BASE_URL}${product.image}`}
                        alt={product.name}
                        loading="lazy"
                        className="product-image"
                        onError={(e) => {
                          e.currentTarget.style.display = "none";

                          e.currentTarget.parentElement.innerHTML = `
                            <div class="text-center text-muted">
                              <div class="product-fallback-icon">🥦</div>
                              <div class="fw-semibold">No Image Available</div>
                            </div>
                          `;
                        }}
                      />
                    ) : (
                      <div className="text-center text-muted">
                        <div className="product-fallback-icon">🥦</div>
                        <div className="fw-semibold">No Image Available</div>
                      </div>
                    )}
                  </div>

                  <div className="card-body d-flex flex-column p-4">
                    <div className="d-flex justify-content-between align-items-start gap-2 mb-2">
                      <h5 className="card-title fw-bold mb-0">
                        {product.name}
                      </h5>

                      <span className="badge bg-success-subtle text-success border border-success-subtle rounded-pill">
                        {product.category}
                      </span>
                    </div>

                    <p className="card-text text-muted small flex-grow-1 mb-4">
                      {product.description || "Fresh grocery item available."}
                    </p>

                    <div className="d-flex justify-content-between align-items-center mb-4">
                      <div>
                        <div className="text-muted small">Price</div>

                        <div className="fw-bold fs-5 text-success">
                          ${Number(product.price).toFixed(2)}
                        </div>
                      </div>

                      <div className="text-end">
                        <div className="text-muted small">Stock</div>

                        <span
                          className={`badge rounded-pill ${
                            product.stock > 0
                              ? "bg-light text-dark border"
                              : "bg-danger"
                          }`}
                        >
                          {product.stock > 0
                            ? `${product.stock} available`
                            : "Out of stock"}
                        </span>
                      </div>
                    </div>

                    <button
                      className="btn btn-success btn-lg w-100 fw-semibold mt-auto"
                      disabled={product.stock <= 0}
                      onClick={() => handleAddToCart(product)}
                    >
                      {product.stock > 0
                        ? "Add to Cart"
                        : "Out of Stock"}
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
};

export default ProductList;