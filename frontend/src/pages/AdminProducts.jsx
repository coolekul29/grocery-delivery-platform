import { useState, useEffect } from "react";
import axiosInstance from "../axiosConfig";
import ProductForm from "../components/ProductForm";
import ProductListAdmin from "../components/ProductListAdmin";
import { useAuth } from "../context/AuthContext";
import { Link } from "react-router-dom";

const Products = () => {
  const { user } = useAuth();
  const [products, setProducts] = useState([]);
  const [editingProduct, setEditingProduct] = useState(null);
  const [errorMessage, setErrorMessage] = useState("");

  // Load products when user is logged in
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setErrorMessage("");

        const response = await axiosInstance.get("/api/products", {
          headers: { Authorization: `Bearer ${user.token}` },
        });

        setProducts(response.data);
      } catch (error) {
        console.error("Failed to load products:", error);
        setErrorMessage("Failed to load product data. Please refresh.");
      }
    };

    if (user?.token) {
      fetchProducts();
    }
  }, [user]);

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
          <p className="text-uppercase fw-semibold mb-2 opacity-75">
            Admin Panel
          </p>

          <h1 className="fw-bold mb-2">Admin Dashboard</h1>

          <p className="lead mb-0">
            Manage platform records using Create, Read, Update, and Delete
            operations.
          </p>
        </div>
      </section>

      <main className="container pb-5">
        <div className="row g-4 mb-4">

          <div className="col-md-4">
            <Link
              to="/admin/products"
              className="text-decoration-none"
            >
              <div className="card border-0 shadow-sm h-100 dashboard-card">
                <div className="card-body p-4">
                  <h4 className="fw-bold text-dark mb-3">
                    Product Management
                  </h4>
                  <p className="text-muted mb-0">
                    Add, view, update, and remove grocery product records.
                  </p>
                </div>
              </div>
            </Link>
          </div>

          <div className="col-md-4">
            <Link
              to="/admin/orders"
              className="text-decoration-none"
            >
              <div className="card border-0 shadow-sm h-100 dashboard-card">
                <div className="card-body p-4">
                  <h4 className="fw-bold text-dark mb-3">
                    Order Management
                  </h4>
                  <p className="text-muted mb-0">
                    Review customer orders and update delivery progress.
                  </p>
                </div>
              </div>
            </Link>
          </div>

          <div className="col-md-4">
            <div className="card border-0 shadow-sm h-100 dashboard-card">
              <div className="card-body p-4">
                <h4 className="fw-bold mb-3">
                  User Monitoring
                </h4>
                <p className="text-muted mb-0">
                  Monitor customer activity and platform usage records.
                </p>
              </div>
            </div>
          </div>

        </div>

        {errorMessage && (
          <div className="alert alert-danger shadow-sm">{errorMessage}</div>
        )}

        <div className="card border-0 shadow-sm mb-4">
          <div className="card-header bg-white border-0 p-4">
            <h4 className="fw-bold mb-1">Admin CRUD Management</h4>
            <p className="text-muted mb-0">
              Use this section to create, read, update, and delete grocery product
              records.
            </p>
          </div>

          <div className="card-body p-4">
            <ProductForm
              products={products}
              setProducts={setProducts}
              editingProduct={editingProduct}
              setEditingProduct={setEditingProduct}
            />
          </div>
        </div>

        <div className="card border-0 shadow-sm">
          <div className="card-header bg-white border-0 p-4">
            <h4 className="fw-bold mb-1">Existing Records</h4>
            <p className="text-muted mb-0">
              View, edit, or delete grocery products currently stored in the system.
            </p>
          </div>

          <div className="card-body p-4">
            <ProductListAdmin
              products={products}
              setProducts={setProducts}
              setEditingProduct={setEditingProduct}
            />
          </div>
        </div>
      </main>
    </div>
  );
};

export default Products;