import { useLocation, useNavigate } from "react-router-dom";

function OrderSuccess() {
  const location = useLocation();
  const navigate = useNavigate();

  // Get order data from the previous page
  const { order } = location.state || {};

  // Show message if no order data exists
  if (!order) {
    return (
      <div style={{ backgroundColor: "#f8fafc", minHeight: "100vh" }}>
        <main className="container py-5">
          <div className="card border-0 shadow-sm text-center p-5">
            <div className="fs-1 mb-3">⚠️</div>
            <h2 className="fw-bold mb-3">No Order Data Found</h2>
            <p className="text-muted mb-4">
              We could not find your order details. Please return to the product
              page and try again.
            </p>

            <button
              className="btn btn-success btn-lg px-4 fw-semibold"
              onClick={() => navigate("/products")}
            >
              Back to Products
            </button>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div style={{ backgroundColor: "#f8fafc", minHeight: "100vh" }}>
      <section
        className="py-5 mb-4"
        style={{
          background: "linear-gradient(135deg, #198754 0%, #20c997 100%)",
          color: "white",
        }}
      >
        <div className="container text-center">
          <p className="text-uppercase fw-semibold mb-2 opacity-75">
            Order Confirmation
          </p>

          <h1 className="fw-bold mb-2">Order Placed Successfully</h1>

          <p className="lead mb-0">
            Thank you for shopping with Grocery Delivery Platform.
          </p>
        </div>
      </section>

      <main className="container pb-5">
        <div className="row justify-content-center">
          <div className="col-lg-7">
            <div className="card border-0 shadow-lg rounded-4">
              <div className="card-body text-center p-5">
                <div
                  className="rounded-circle bg-success text-white d-inline-flex align-items-center justify-content-center mb-4"
                  style={{
                    width: "90px",
                    height: "90px",
                    fontSize: "42px",
                  }}
                >
                  ✓
                </div>

                <h2 className="fw-bold mb-3">Thank you for your order!</h2>

                <p className="text-muted mb-4">
                  Your grocery order has been successfully created and is now
                  ready for processing.
                </p>

                <div className="bg-light rounded-4 p-4 text-start mb-4">
                  <div className="d-flex justify-content-between border-bottom pb-3 mb-3">
                    <span className="text-muted">Order ID</span>
                    <span className="fw-semibold">{order._id}</span>
                  </div>

                  <div className="d-flex justify-content-between">
                    <span className="text-muted">Total Paid</span>
                    <span className="fw-bold text-success fs-5">
                      ${Number(order.totalAmount).toFixed(2)}
                    </span>
                  </div>
                </div>

                <button
                  className="btn btn-success btn-lg px-5 fw-semibold"
                  onClick={() => navigate("/products")}
                >
                  Continue Shopping
                </button>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

export default OrderSuccess;