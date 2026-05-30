import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const API_BASE_URL = process.env.REACT_APP_API_URL || "";

function Cart({ cart, setCart }) {
  const navigate = useNavigate();
  const { user } = useAuth();

  // Group same products together
  const groupedCart = cart.reduce((items, item) => {
    const existingItem = items.find((i) => i._id === item._id);

    if (existingItem) {
      existingItem.quantity += 1;
    } else {
      items.push({ ...item, quantity: 1 });
    }

    return items;
  }, []);

  // Calculate total price
  const total = groupedCart.reduce(
    (sum, item) => sum + Number(item.price) * item.quantity,
    0
  );

  const removeItem = (id) => {
    const updatedCart = cart.filter((item) => item._id !== id);
    setCart(updatedCart);
    localStorage.setItem("cart", JSON.stringify(updatedCart));
  };

  const increaseQty = (id) => {
    const itemToAdd = cart.find((item) => item._id === id);
    if (!itemToAdd) return;

    const updatedCart = [...cart, itemToAdd];
    setCart(updatedCart);
    localStorage.setItem("cart", JSON.stringify(updatedCart));
  };

  const decreaseQty = (id) => {
    let removed = false;

    // Remove one item only
    const updatedCart = cart.filter((item) => {
      if (item._id === id && !removed) {
        removed = true;
        return false;
      }

      return true;
    });

    setCart(updatedCart);
    localStorage.setItem("cart", JSON.stringify(updatedCart));
  };

  const placeOrder = async () => {
    try {
      if (groupedCart.length === 0) {
        alert("Your cart is empty.");
        return;
      }

      // User must login before placing an order
      if (!user) {
        alert("Please log in before placing your order.");
        navigate("/login");
        return;
      }

      // Prepare order items for backend
      const orderItems = groupedCart.map((item) => ({
        productId: item._id,
        name: item.name,
        price: Number(item.price),
        quantity: item.quantity,
      }));

      const response = await fetch(`${API_BASE_URL}/api/orders`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          items: orderItems,
          totalAmount: total,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to place order.");
      }

      // Clear cart after order is placed
      setCart([]);
      localStorage.removeItem("cart");

      navigate("/order-success", { state: { order: data } });
    } catch (error) {
      console.error("Error placing order:", error);
      alert("Error placing order. Please try again.");
    }
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
            Checkout
          </p>
          <h1 className="fw-bold mb-2">Your Shopping Cart</h1>
          <p className="lead mb-0">
            Create, review, update, and remove grocery items before placing your order.
          </p>
        </div>
      </section>

      <main className="container pb-5">
        {groupedCart.length === 0 ? (
          <div className="card border-0 shadow-sm">
            <div className="card-body text-center p-5">
              <div className="fs-1 mb-3">🛒</div>
              <h3 className="fw-bold">Your cart is empty</h3>
              <p className="text-muted mb-4">
                Browse groceries and add items to your cart.
              </p>

              <button
                className="btn btn-success btn-lg px-4 fw-semibold"
                onClick={() => navigate("/products")}
              >
                Browse Products
              </button>
            </div>
          </div>
        ) : (
          <div className="row g-4">
            <div className="col-lg-8">
              <div className="card border-0 shadow-sm">
                <div className="card-header bg-white border-0 p-4">
                  <h4 className="fw-bold mb-0">Customer Cart Management</h4>
                </div>

                <div className="card-body p-0">
                  {groupedCart.map((item) => (
                    <div
                      key={item._id}
                      className="d-flex flex-column flex-md-row justify-content-between align-items-md-center gap-3 p-4 border-top"
                    >
                      <div>
                        <h5 className="fw-bold mb-1">{item.name}</h5>
                        <p className="text-muted mb-0">
                          ${Number(item.price).toFixed(2)} each
                        </p>
                      </div>

                      <div className="d-flex align-items-center gap-3">
                        <div className="btn-group" role="group">
                          <button
                            className="btn btn-outline-secondary"
                            onClick={() => decreaseQty(item._id)}
                          >
                            -
                          </button>

                          <button className="btn btn-light fw-bold" disabled>
                            Qty: {item.quantity}
                          </button>

                          <button
                            className="btn btn-outline-secondary"
                            onClick={() => increaseQty(item._id)}
                          >
                            +
                          </button>
                        </div>

                        <div className="text-end" style={{ minWidth: "90px" }}>
                          <div className="text-muted small">Subtotal</div>
                          <div className="fw-bold text-success">
                            ${(Number(item.price) * item.quantity).toFixed(2)}
                          </div>
                        </div>

                        <button
                          className="btn btn-outline-danger"
                          onClick={() => removeItem(item._id)}
                        >
                          🗑 Remove
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="col-lg-4">
              <div className="card border-0 shadow-sm">
                <div className="card-body p-4">
                  <h4 className="fw-bold mb-4">Order Summary</h4>

                  <div className="d-flex justify-content-between mb-2">
                    <span className="text-muted">Items</span>
                    <span className="fw-semibold">{cart.length}</span>
                  </div>

                  <div className="d-flex justify-content-between mb-2">
                    <span className="text-muted">Delivery</span>
                    <span className="fw-semibold text-success">Free</span>
                  </div>

                  <hr />

                  <div className="d-flex justify-content-between align-items-center mb-4">
                    <span className="fw-bold fs-5">Total</span>
                    <span className="fw-bold fs-4 text-success">
                      ${total.toFixed(2)}
                    </span>
                  </div>

                  <button
                    className="btn btn-success btn-lg w-100 fw-semibold"
                    onClick={placeOrder}
                  >
                    Place Order
                  </button>

                  <button
                    className="btn btn-outline-secondary w-100 mt-3"
                    onClick={() => navigate("/products")}
                  >
                    Continue Shopping
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}

export default Cart;