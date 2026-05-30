import { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";

const API_BASE_URL = process.env.REACT_APP_API_URL || "";

const AdminOrders = () => {
  const [orders, setOrders] = useState([]);
  const [errorMessage, setErrorMessage] = useState("");

  const fetchOrders = async () => {
    try {
      setErrorMessage("");
      const response = await axios.get(`${API_BASE_URL}/api/orders`);
      setOrders(response.data);
    } catch (error) {
      console.error("Failed to fetch orders:", error);
      setErrorMessage("Failed to load orders. Please try again.");
    }
  };

  // Load orders when the page opens
  useEffect(() => {
    fetchOrders();
  }, []);

  const updateOrderStatus = async (orderId, status) => {
    try {
      const response = await axios.put(`${API_BASE_URL}/api/orders/${orderId}`, {
        status,
      });

      // Update the order in the list
      setOrders(
        orders.map((order) =>
          order._id === response.data._id ? response.data : order
        )
      );
    } catch (error) {
      console.error("Failed to update order status:", error);
      alert("Failed to update order status.");
    }
  };

  const deleteOrder = async (orderId) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this order?"
    );

    if (!confirmDelete) return;

    try {
      await axios.delete(`${API_BASE_URL}/api/orders/${orderId}`);

      // Remove deleted order from the list
      setOrders(orders.filter((order) => order._id !== orderId));
    } catch (error) {
      console.error("Failed to delete order:", error);
      alert("Failed to delete order.");
    }
  };

  // Set badge colour based on order status
  const getStatusBadgeClass = (status) => {
    if (status === "Delivered") return "bg-success";
    if (status === "Processing") return "bg-warning text-dark";
    if (status === "Cancelled") return "bg-danger";
    return "bg-secondary";
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
          <p className="text-uppercase fw-semibold mb-2 opacity-75">
            Admin Panel
          </p>
          <h1 className="fw-bold mb-2">Order Management</h1>
          <p className="lead mb-0">
            View customer orders, update delivery status, and remove cancelled
            records.
          </p>
        </div>
      </section>

      <main className="container pb-5">
        {errorMessage && (
          <div className="alert alert-danger shadow-sm">{errorMessage}</div>
        )}

        <div className="row g-4 mb-4">
          <div className="col-md-4">
            <Link to="/admin/products" className="text-decoration-none">
              <div className="card border-0 shadow-sm h-100 dashboard-card">
                <div className="card-body p-4">
                  <h4 className="fw-bold text-dark mb-3">Product Management</h4>
                  <p className="text-muted mb-0">
                    Add, view, update, and remove grocery product records.
                  </p>
                </div>
              </div>
            </Link>
          </div>

          <div className="col-md-4">
            <Link to="/admin/orders" className="text-decoration-none">
              <div className="card border-0 shadow-sm h-100 dashboard-card">
                <div className="card-body p-4">
                  <h4 className="fw-bold text-dark mb-3">Order Management</h4>
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
                <h4 className="fw-bold mb-3">User Monitoring</h4>
                <p className="text-muted mb-0">
                  Monitor customer activity and platform usage records.
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="card border-0 shadow-sm">
          <div className="card-header bg-white border-0 p-4">
            <h4 className="fw-bold mb-1">Customer Orders</h4>
            <p className="text-muted mb-0">
              Admins can read, update, and delete order records from this page.
            </p>
          </div>

          <div className="card-body p-4">
            {orders.length === 0 ? (
              <div className="text-center text-muted py-5">
                <div className="fs-1 mb-3">📦</div>
                <h5 className="fw-bold">No orders found</h5>
                <p className="mb-0">
                  Customer orders will appear here after checkout.
                </p>
              </div>
            ) : (
              <div className="table-responsive">
                <table className="table align-middle">
                  <thead>
                    <tr>
                      <th>Order ID</th>
                      <th>Items</th>
                      <th>Total</th>
                      <th>Status</th>
                      <th>Created</th>
                      <th className="text-end">Actions</th>
                    </tr>
                  </thead>

                  <tbody>
                    {orders.map((order) => (
                      <tr key={order._id}>
                        <td>
                          <span className="fw-semibold">
                            {order._id.slice(-8)}
                          </span>
                        </td>

                        <td>
                          {order.items.map((item) => (
                            <div key={item.productId} className="small">
                              {item.name} × {item.quantity}
                            </div>
                          ))}
                        </td>

                        <td className="fw-semibold text-success">
                          ${Number(order.totalAmount).toFixed(2)}
                        </td>

                        <td>
                          <span
                            className={`badge rounded-pill ${getStatusBadgeClass(
                              order.status
                            )}`}
                          >
                            {order.status}
                          </span>
                        </td>

                        <td className="text-muted small">
                          {new Date(order.createdAt).toLocaleDateString()}
                        </td>

                        <td className="text-end">
                          <select
                            className="form-select form-select-sm d-inline-block me-2"
                            style={{ width: "140px" }}
                            value={order.status}
                            onChange={(e) =>
                              updateOrderStatus(order._id, e.target.value)
                            }
                          >
                            <option value="Pending">Pending</option>
                            <option value="Processing">Processing</option>
                            <option value="Delivered">Delivered</option>
                            <option value="Cancelled">Cancelled</option>
                          </select>

                          <button
                            className="btn btn-outline-danger btn-sm"
                            onClick={() => deleteOrder(order._id)}
                          >
                            Delete
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

export default AdminOrders;