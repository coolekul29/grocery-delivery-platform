import { useLocation, useNavigate } from "react-router-dom";

function OrderSuccess() {
  const location = useLocation();
  const navigate = useNavigate();

  const { order } = location.state || {};

  if (!order) {
    return <p>No order data</p>;
  }

  return (
    <div style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        height: "80vh",
        flexDirection: "column"
        }}>
      <h2>Order Successful</h2>

      <p>Your order has been placed successfully</p>

      <h3>Order ID: {order._id}</h3>
      <h3>Total Paid: ${order.totalAmount}</h3>

      <button
        onClick={() => navigate("/products")}
        style={{
          marginTop: "20px",
          backgroundColor: "green",
          color: "white",
          padding: "10px 20px",
          border: "none",
          cursor: "pointer",
        }}
      >
        Continue Shopping
      </button>
    </div>
  );
}

export default OrderSuccess;