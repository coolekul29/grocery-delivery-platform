import { useEffect, useState } from "react";
import axios from "axios";

const API_BASE_URL = process.env.REACT_APP_API_URL || "http://localhost:5001";

function Products({ cart, setCart }) {
  const [products, setProducts] = useState([]);

  // Load products when page opens
  useEffect(() => {
    axios.get(`${API_BASE_URL}/api/products`)
      .then(res => {
        setProducts(res.data);
      })
      .catch(err => console.error("Failed to load products:", err));
  }, []);

  const addToCart = (product) => {
    const updatedCart = [...cart, product];

    // Save cart changes
    setCart(updatedCart);
    localStorage.setItem("cart", JSON.stringify(updatedCart));
  };

  return (
    <div style={{ padding: "20px" }}>
      <h2>Browse Products</h2>
      <p>Cart ({cart.length})</p>

      <div style={{
        display: "grid",
        gridTemplateColumns: "repeat(5, 1fr)",
        gap: "20px",
        marginTop: "20px"
      }}>
        {products.map(product => (
          <div key={product._id} style={{
            border: "1px solid #ccc",
            padding: "15px",
            textAlign: "center",
            background: "#f5f5f5"
          }}>
            <h4>{product.name}</h4>
            <p>${product.price}</p>

            <button
              onClick={() => addToCart(product)}
              style={{
                backgroundColor: "green",
                color: "white",
                padding: "5px 10px",
                border: "none",
                cursor: "pointer"
              }}
            >
              Add to Cart
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Products;