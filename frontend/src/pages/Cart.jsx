import { useNavigate } from "react-router-dom";

const API_BASE_URL = process.env.REACT_APP_API_URL || "http://localhost:5001"

function Cart({ cart, setCart }) {
  const navigate = useNavigate();
  const groupedCart = cart.reduce((items, item) => {
    const existingItem = items.find((i) => i._id === item._id);

    if (existingItem) {
      existingItem.quantity += 1;
    } else {
      items.push({ ...item, quantity: 1 });
    }

    return items;
  }, []);

  const total = groupedCart.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  const removeItem = (id) => {
  const updatedCart = cart.filter(item => item._id !== id);
  setCart(updatedCart);
  };

  const increaseQty = (id) => {
    const itemToAdd = cart.find(item => item._id === id);
    setCart([...cart, itemToAdd]);
  };

  const decreaseQty = (id) => {
    let removed = false;
    const updatedCart = cart.filter(item => {
      if (item._id === id && !removed) {
        removed = true;
        return false;
      }
      return true;
    });
    setCart(updatedCart);
  };

  const placeOrder = async () => {
  try {
    const groupedCart = cart.reduce((items, item) => {
      const existingItem = items.find((i) => i._id === item._id);

      if (existingItem) {
        existingItem.quantity += 1;
      } else {
        items.push({
          productId: item._id,
          name: item.name,
          price: item.price,
          quantity: 1,
        });
      }

      return items;
    }, []);

    const totalAmount = groupedCart.reduce(
      (sum, item) => sum + item.price * item.quantity,
      0
    );

    const response = await fetch(`${API_BASE_URL}/api/orders`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        items: groupedCart,
        totalAmount,
      }),
    });

    const data = await response.json();

    // clear cart
    setCart([]);

    // redirect to success page
    navigate("/order-success", { state: { order: data } });

      } catch (error) {
        console.error(error);
        alert("Error placing order");
      }
    };

  return (
    <div style={{ padding: "20px" }}>
      <h2>Your Cart</h2>

      {groupedCart.length === 0 ? (
        <p>No items in cart</p>
      ) : (
        <>
      {groupedCart.map((item) => (
        <div key={item._id} style={{ marginBottom: "10px" }}>
          {item.name} - ${item.price} - Qty: {item.quantity}

          <button
            onClick={() => increaseQty(item._id)}
            style={{ marginLeft: "10px" }}
          >
            +
          </button>

          <button
            onClick={() => decreaseQty(item._id)}
            style={{ marginLeft: "5px" }}
          >
            -
          </button>

          <button
            onClick={() => removeItem(item._id)}
            style={{
              marginLeft: "10px",
              backgroundColor: "red",
              color: "white",
              border: "none",
              padding: "3px 8px",
              cursor: "pointer"
            }}
          >
            Remove
          </button>
        </div>
      ))}

          <hr />

          <h3>Total: ${total}</h3>

        <button
          onClick={placeOrder}
          style={{
            backgroundColor: "green",
            color: "white",
            padding: "8px 14px",
            border: "none",
            cursor: "pointer",
          }}
        >
          Place Order
        </button>
        </>
      )}
    </div>
  );
}

export default Cart;